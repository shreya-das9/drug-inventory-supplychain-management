

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const router = express.Router();

// ✅ Login
router.post('/login', async (req, res) => {
  console.log('Request received:', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    // res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    res.json({
  success: true,
  user: {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  },
  token
});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Register
// src/routes/auth.js

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let baseUsername = email.split('@')[0];
    let username = baseUsername;

    // ✅ Check if username already exists
    const checkUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (checkUser.rows.length > 0) {
      username = `${baseUsername}_${Date.now().toString().slice(-4)}`;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // const result = await pool.query(
    //   `INSERT INTO users (username, email, password_hash, first_name, last_name) 
    //    VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, username`,
    //   [username, email, hashedPassword, firstName, lastName]
    // );
     const userRole = role || 'USER';

const result = await pool.query(
  `INSERT INTO users (username, email, password_hash, first_name, last_name, role)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING id, email, username, role`,
  [username, email, hashedPassword, firstName, lastName, userRole]
);
    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});
module.exports = router;
