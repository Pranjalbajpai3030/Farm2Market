const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Assuming you have a PostgreSQL pool setup
const router = express.Router();

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure the token contains a user ID
        if (!decoded.id && !decoded.userId) {
            console.error("Token missing user ID:", decoded);
            return res.status(401).json({ error: "Invalid token structure" });
        }

        const userId = decoded.id || decoded.userId;

        // Query to check if the user is an admin
        const user = await pool.query("SELECT user_type FROM users WHERE id = $1", [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.rows[0].user_type !== "admin") {
            return res.status(403).json({ error: "Forbidden. Admin access required." });
        }

        // Attach user details to request
        req.user = { id: userId, user_type: user.rows[0].user_type, ...decoded };

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};
// Route to get all customers (farmers & buyers)
router.get("/get-customers", verifyAdmin, async (req, res) => {
    try {
        const customers = await pool.query(
            "SELECT id, first_name, last_name, email, user_type, avatar, created_at FROM users WHERE user_type IN ('farmer', 'buyer')"
        );

        res.status(200).json({ success: true, customers: customers.rows });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
// Route to fetch all products in the database
router.get("/get-all-products", verifyAdmin, async (req, res) => {
    try {
        const products = await pool.query(
            `SELECT p.id AS product_id, p.name AS product_name, p.description, p.category, 
                    p.price, p.unit, p.amount, p.image_url, p.created_at, 
                    u.id AS seller_id, u.first_name, u.last_name, u.email, u.avatar
             FROM products p
             JOIN users u ON p.user_id = u.id`
        );

        if (products.rows.length === 0) {
            return res.status(404).json({ message: "No products available in the database." });
        }

        res.status(200).json({ success: true, products: products.rows });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Route to fetch all orders
router.get("/get-all-orders", verifyAdmin, async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT o.order_id, o.buyer_id, u.first_name AS buyer_first_name, u.last_name AS buyer_last_name, 
                    u.email AS buyer_email, u.avatar AS buyer_avatar, o.total_amount, o.payment_status, 
                    o.transaction_id, o.order_timestamp, o.payment_timestamp
             FROM orders o
             JOIN users u ON o.buyer_id = u.id
             ORDER BY o.order_timestamp DESC`
        );

        if (orders.rows.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.status(200).json({ success: true, orders: orders.rows });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
