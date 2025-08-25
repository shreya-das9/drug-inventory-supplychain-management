const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth/login.controller');
const { signup } = require('../controllers/auth/signup.controller');
const { refresh } = require('../controllers/auth/refresh.controller');
const { logout } = require('../controllers/auth/logout.controller');

const { validate } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all auth routes
router.use(authLimiter);

// POST /api/auth/signup
router.post('/signup', validate('register'), signup);

// POST /api/auth/login
router.post('/login', validate('login'), login);

// POST /api/auth/refresh
router.post('/refresh', validate('refreshToken'), refresh);

// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;