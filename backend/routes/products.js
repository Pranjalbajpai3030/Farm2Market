const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
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
    let query = "SELECT * FROM products";
    const params = [];

    if (category) {
      query += " WHERE category = $1";
      params.push(category);
    }

    const result = await pool.query(query, params);
    res.status(200).json({ products: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;