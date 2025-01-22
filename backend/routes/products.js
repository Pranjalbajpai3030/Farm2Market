const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

//Route to list the products
router.post("/list-products", authenticate, async (req, res) => {
  const { user_id, name, description, category, price, unit, amount, image_url } = req.body;

  if (!user_id || !name || !category || !price || !unit || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (user_id, name, description, category, price, unit, amount, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, name, description, category, price, unit, amount, image_url]
    );

    res.status(201).json({ message: "Product added successfully", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// GET all products or filter by category
router.get("/get-products", authenticate, async (req, res) => {
  const category = req.headers["category"]; // Retrieve category from headers

  try {
    // Define the base query
    let query = `
      SELECT 
        p.id, p.name, p.price, p.description, p.category, p.image_url, p.unit , p.amount, p.created_at, p.user_id, u.first_name, u.last_name 
      FROM 
        products p 
      JOIN 
        users u 
      ON 
        p.user_id = u.id`;
    
    const params = [];

    // Add a WHERE clause if category is provided
    if (category) {
      query += " WHERE p.category = $1";
      params.push(category);
    }

    // Execute the query
    const result = await pool.query(query, params);

    // Respond with the results
    res.status(200).json({
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        unit: product.unit, 
        amount: product.amount,
        listed_at: product.created_at,
        description: product.description,
        category: product.category,
        producerId: product.user_id,
        producer: `${product.first_name} ${product.last_name}`
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// POST API to add product to the cart
router.post("/add-to-cart", authenticate, async (req, res) => {
  const { product_id, quantity, farmer_id } = req.body;
  const user_id = req.user.id; // Extracted from the JWT token via the authenticate middleware

  // Validate request body
  if (!product_id || !quantity || !farmer_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than zero" });
  }

  // Check if the product exists and get its price
  try {
    const productResult = await pool.query(
      "SELECT price FROM products WHERE id = $1",
      [product_id]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const productPrice = productResult.rows[0].price;

    // Check if the farmer exists (to ensure valid relation)
    const farmerResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [farmer_id]
    );
    
    if (farmerResult.rows.length === 0) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // Check if the product is already in the user's cart
    const cartResult = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );
    
    if (cartResult.rows.length > 0) {
      return res.status(400).json({ error: "Product already in cart" });
    }

    // Calculate the total price
    const total_price = quantity * productPrice;

    // Insert into the cart
    await pool.query(
      "INSERT INTO cart (user_id, product_id, farmer_id, quantity, price, total_price) VALUES ($1, $2, $3, $4, $5, $6)",
      [user_id, product_id, farmer_id, quantity, productPrice, total_price]
    );

    // Respond with success message
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;