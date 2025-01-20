const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999); // Random 6-digit OTP
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Check if user already exists (basic validation)
        const checkUserQuery = `SELECT email FROM users WHERE email = $1`;
        const userCheckResult = await pool.query(checkUserQuery, [email]);
        if (userCheckResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Insert user data with the OTP into the database (not verified yet)
        const query = `
    INSERT INTO users (first_name, last_name, email, password, otp, otp_expires_at, verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
`;
        const values = [firstName, lastName, email, hashedPassword, otp, otpExpiresAt, false];
        const result = await pool.query(query, values);


        const userId = result.rows[0].id;

        // Send OTP via email using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify Your Account',
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
            background-color:rgb(94, 175, 117);
            color: white;
            text-align: center;
            padding: 20px 10px;
        }
        .header img {
            max-width: 80px;
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
        .otp {
            display: block;
            font-size: 24px;
            color: #333;
            background-color: #f7f7f7;
            text-align: center;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
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
            <p>Connecting Farmers, Markets, and Consumers</p>
        </div>
        <div class="content">
            <h2>Verify Your Email</h2>
            <p>Hello,</p>
            <p>Thank you for signing up with <strong>Farm2Market</strong>. To complete your registration, please use the One-Time Password (OTP) provided below:</p>
            <div class="otp">${otp}</div>
            <p><strong>Note:</strong> This OTP is valid for <strong>10 minutes</strong>. Please do not share this OTP with anyone for security reasons.</p>
            <p>If you did not initiate this request, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Farm2Market. All rights reserved.</p>
            <p>
                Need help? <a href="mailto:support@farm2market.com">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>
            `,
        };


        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'OTP has been sent to your email. Please check your inbox, and if you do not see it, check your spam folder for the verification email.', userId: userId
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Signup failed. Please try again later.' });
    }
});

// OTP Verification route
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;

    try {
        // Fetch user by ID and check OTP
        const query = `SELECT otp, otp_expires_at, verified FROM users WHERE id = $1`;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const { otp: storedOtp, otp_expires_at: otpExpiresAt, verified } = result.rows[0];

        // Check if the account is already verified
        if (verified) {
            return res.status(400).json({ error: 'Account already verified.' });
        }

        // Validate OTP
        if (storedOtp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        // Check OTP expiration
        if (new Date() > otpExpiresAt) {
            return res.status(400).json({ error: 'OTP has expired.' });
        }

        // Mark the account as verified
        await pool.query(`UPDATE users SET verified = true WHERE id = $1`, [userId]);

        // Delete OTP from the database to ensure it can't be reused
        await pool.query(`UPDATE users SET otp = NULL WHERE id = $1`, [userId]);

        res.status(200).json({ message: 'Account verified successfully.' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ error: 'OTP verification failed. Please try again later.' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const checkUserQuery = `SELECT id, email, password, verified FROM users WHERE email = $1`;
        const userResult = await pool.query(checkUserQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const user = userResult.rows[0];

        // Check if the user is verified
        if (!user.verified) {
            return res.status(400).json({ error: 'Account not verified. Please verify your account first.' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }                      // Token expiration time (1 hour)
        );
        // Send response with JWT token
        res.status(200).json({
            message: 'Login successful.',
            jwtToken: token, // Send token 
            userId: user.id,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed. Please try again later.' });
    }
});

module.exports = router;