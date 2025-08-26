const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, is_active FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, is_active FROM users WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
