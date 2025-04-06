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
    }
  });

  const productList = productsSold.map(item => `${item.name} - ${item.quantity} ${item.unit}`).join(', ');

  const mailOptions = {
    from: process.env.EMAIL,
    to: farmerEmail,
    subject: 'Your Product Sale Notification',
    text: `Congratulations! You sold the following products: ${productList}. Total earned: $${productsSold.reduce((sum, item) => sum + item.total_price, 0)}.`
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

module.exports = router;