const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const router = express.Router();
//app.use(express.json())
// Login route
router.post('/login', async (req, res) => {
  //const { email, password } = req.body;
  // Debug and safety check
console.log('Request received:');
console.log('Headers:', req.headers);
console.log('Body:', req.body);
console.log('Content-Type:', req.get('content-type'));

if (!req.body) {
  return res.status(400).json({ 
    error: 'Request body is missing',
    debug: 'Make sure express.json() middleware is configured and Content-Type is application/json'
  });
}

const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({ 
    error: 'Email and password are required',
    received: req.body
  });
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

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route (optional)
router.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role`,
      [username, email, hashedPassword, firstName, lastName]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
