const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authorize = require('../middleware/authenticate');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Place an Order
router.post('/orders', authorize, async (req, res) => {
  const userId = req.user.id; // The buyer's user ID from JWT
  const cartItems = req.body.cartItems; // Array of { product_id, quantity }

  try {
    // 1. Check if cart is not empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // 2. Calculate total order amount
    let totalAmount = 0;
    const orderItems = [];

    for (let item of cartItems) {
      const { product_id, quantity } = item;

      // Fetch product details
      const product = await pool.query('SELECT * FROM products WHERE id = $1', [product_id]);
      if (product.rows.length === 0) {
        return res.status(404).json({ message: `Product ${product_id} not found` });
      }

      const productData = product.rows[0];
      if (quantity > productData.amount) {
        return res.status(400).json({ message: `Insufficient stock for product ${product_id}` });
      }
      const totalPrice = productData.price * quantity;
      totalAmount += totalPrice;

      // Add item to order items
      orderItems.push({
        product_id,
        farmer_id: productData.user_id, // Farmer is the user who owns the product
        quantity,
        price: productData.price,
        total_price: totalPrice
      });
    }

    // 3. Insert into the orders table
    const orderResult = await pool.query(
      'INSERT INTO orders (buyer_id, total_amount) VALUES ($1, $2) RETURNING order_id',
      [userId, totalAmount]
    );
    const orderId = orderResult.rows[0].order_id;

    // 4. Insert order items into order_items table
    const insertOrderItemsPromises = orderItems.map(item => {
      return pool.query(
        'INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price, total_price) VALUES ($1, $2, $3, $4, $5, $6)',
        [orderId, item.product_id, item.farmer_id, item.quantity, item.price, item.total_price]
      );
    });
    await Promise.all(insertOrderItemsPromises);

    // 5. Return the order summary
    res.status(201).json({ orderId, totalAmount, items: orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Order Summary
router.get('/orders/:orderId', authorize, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id; // Get the user ID from JWT

  try {
    // 1. Fetch the order details
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1 AND buyer_id = $2',
      [orderId, userId]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // 2. Fetch the order items
    const orderItemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    const orderItems = orderItemsResult.rows;

    // 3. Send order details back to the buyer
    res.status(200).json({ order, items: orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Payment Status (After Payment Success)
router.post('/orders/:orderId/payment', authorize, async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus, transactionId } = req.body; // Details from payment gateway

  try {
    // 1. Update payment status in the orders table
    const updateOrderResult = await pool.query(
      'UPDATE orders SET payment_status = $1, transaction_id = $2, payment_timestamp = CURRENT_TIMESTAMP WHERE order_id = $3 RETURNING order_id',
      [paymentStatus, transactionId, orderId]
    );
    if (updateOrderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 2. Split payment and transfer funds to each seller (this would involve interacting with a payment gateway)
    if (paymentStatus === 'Paid') {
      const orderItemsResult = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [orderId]
      );

      // If payment is marked as "Paid," update the pending_transactions table
      if (paymentStatus === 'Paid') {
        const updatePendingTransactionResult = await pool.query(
          `UPDATE pending_transactions
           SET is_verified = TRUE, verified_at = CURRENT_TIMESTAMP, verified_by = $1
           WHERE order_id = $2 AND transaction_id = $3 RETURNING id`,
          [req.user.id, orderId, transactionId]
        );

        if (updatePendingTransactionResult.rows.length === 0) {
          return res.status(404).json({ message: 'Pending transaction not found for this order and transaction ID.' });
        }
      }
      // Split the payment among the farmers based on their products' total prices
      const totalAmount = orderItemsResult.rows.reduce((total, item) => total + item.total_price, 0);
      const emailPromises = orderItemsResult.rows.map(async (item) => {
        const farmerAmount = (item.total_price / totalAmount) * 10000; // Assuming buyer paid 10k, split proportionally

        // Get the farmer's email (fetching farmer details from users table)
        const farmerResult = await pool.query('SELECT email FROM users WHERE id = $1', [item.farmer_id]);
        const farmerEmail = farmerResult.rows[0]?.email;

        // Update the total amount of the product in the products table
        await pool.query(
          'UPDATE products SET amount = amount - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );

        if (farmerEmail) {
          // Send email to the farmer with product details
          await sendEmailToFarmer(farmerEmail, [
            {
              name: item.product_name,
              quantity: item.quantity,
              unit: item.unit,
              total_price: item.total_price
            }
          ]);
        }
      });

      // Wait for all email notifications to be sent
      await Promise.all(emailPromises);
    }

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Email Notification Logic
async function sendEmailToFarmer(farmerEmail, productsSold) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Construct the product list dynamically with validation
  const productList = productsSold
    .map((item) => {
      const name = item.name || "Unknown Product"; // Fallback if name is undefined
      const unit = item.unit || "unit"; // Fallback if unit is undefined
      const quantity = item.quantity || 0; // Fallback if quantity is undefined
      const totalPrice = Number(item.total_price) || 0; // Ensure total_price is a number

      return `<li>🌾 <strong>${name}</strong> - ${quantity} ${unit} (₹${totalPrice.toFixed(
        2
      )})</li>`;
    })
    .join('');


  const mailOptions = {
    from: process.env.EMAIL,
    to: farmerEmail,
    subject: 'Your Product Sale Notification',
    html: `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: rgb(94, 175, 117);
            color: white;
            text-align: center;
            padding: 20px 10px;
        }
        .header h1 {
            margin: 10px 0 5px;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            font-size: 16px;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .content h2 {
            margin: 0 0 15px;
            color: #2ecc71;
        }
        .content p {
            line-height: 1.6;
            margin: 10px 0;
        }
        .product-list {
            margin: 20px 0;
            padding: 10px;
            background-color: #f7f7f7;
            border-radius: 5px;
            font-size: 14px;
            color: #555;
        }
        .product-list ul {
            padding: 0;
            list-style: none;
        }
        .product-list ul li {
            margin: 5px 0;
        }
        .highlight {
            color: #2ecc71;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            background-color: #f1f1f1;
            padding: 15px;
            font-size: 14px;
            color: #666666;
        }
        .footer a {
            color: #2ecc71;
            text-decoration: none;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Farm2Market</h1>
            <p>Where Your Hard Work Pays Off!</p>
        </div>
        <div class="content">
            <h2>🎉 Congratulations, Farmer Extraordinaire! 🎉</h2>
            <p>We have some fantastic news for you! Your products have been flying off the shelves faster than a tractor on turbo mode. Here's what you've sold:</p>
            <div class="product-list">
                <ul>
                    ${productList}
                </ul>
            </div>
            <p class="highlight">Total Earned: ₹${productsSold
        .reduce((sum, item) => sum + Number(item.total_price), 0)
        .toFixed(2)}.</p>
            <p>Keep up the amazing work! Your dedication and effort are making a difference, one crop at a time. We're here to support you every step of the way.</p>
            <p>Need help or have questions? Feel free to reach out to us anytime. We're just a click away!</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Farm2Market. All rights reserved.</p>
            <p>
                Need help? <a href="mailto:support@farm2market.com">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


// Add a pending transaction and clear the cart
router.post("/pending-transactions", authorize, async (req, res) => {
  const { order_id, transaction_id } = req.body;
  const userId = req.user.id; // Get the user ID from the JWT

  try {
    // Validate input
    if (!order_id || !transaction_id) {
      return res.status(400).json({ message: "Order ID and Transaction ID are required." });
    }

    // Check if the order exists
    const orderResult = await pool.query("SELECT * FROM orders WHERE order_id = $1", [order_id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Insert the pending transaction into the database
    const insertResult = await pool.query(
      `INSERT INTO pending_transactions (order_id, transaction_id, submitted_at, is_verified)
       VALUES ($1, $2, CURRENT_TIMESTAMP, FALSE)
       ON CONFLICT (order_id, transaction_id) DO NOTHING
       RETURNING id`,
      [order_id, transaction_id]
    );

    if (insertResult.rows.length === 0) {
      return res.status(409).json({ message: "This transaction is already pending verification." });
    }

    // Clear the cart for the user
    await pool.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    res.status(201).json({
      message: "Transaction submitted successfully and is pending verification. Cart cleared.",
      transaction_id: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error("Error adding pending transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Get all pending transactions
router.get("/get-pending-transactions", authorize, async (req, res) => {
  try {
    // Fetch all pending transactions
    const result = await pool.query(
      `SELECT pt.id, pt.order_id, pt.transaction_id, pt.submitted_at, pt.is_verified, 
              o.buyer_id, u.first_name AS buyer_first_name, u.last_name AS buyer_last_name
       FROM pending_transactions pt
       JOIN orders o ON pt.order_id = o.order_id
       JOIN users u ON o.buyer_id = u.id
       WHERE pt.is_verified = FALSE
       ORDER BY pt.submitted_at DESC`
    );

    const pendingTransactions = result.rows;

    res.status(200).json({ pendingTransactions });
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;