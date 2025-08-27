// // // const express = require('express');
// // // const router = express.Router();

// // // const { login } = require('../controllers/auth/login.controller');
// // // const { signup } = require('../controllers/auth/signup.controller');
// // // const { refresh } = require('../controllers/auth/refresh.controller');
// // // const { logout } = require('../controllers/auth/logout.controller');

// // // const { validate } = require('../middleware/validation');
// // // const { authLimiter } = require('../middleware/rateLimiter');

// // // // Apply rate limiting to all auth routes
// // // router.use(authLimiter);

// // // // POST /api/auth/signup
// // // router.post('/signup', validate('register'), signup);

// // // // POST /api/auth/login
// // // router.post('/login', validate('login'), login);

// // // // POST /api/auth/refresh
// // // router.post('/refresh', validate('refreshToken'), refresh);

// // // // POST /api/auth/logout
// // // router.post('/logout', logout);

// // // module.exports = router;






// // const express = require('express');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const pool = require('../db/database');
// // const { registerSchema, loginSchema } = require('../validation/auth');
// // const auth = require('../middleware/auth');
// // const router = express.Router();

// // // Generate tokens
// // const generateTokens = (userId, role) => {
// //   const accessToken = jwt.sign(
// //     { userId, role },
// //     process.env.JWT_SECRET,
// //     { expiresIn: '15m' }
// //   );
  
// //   const refreshToken = jwt.sign(
// //     { userId, role },
// //     process.env.JWT_REFRESH_SECRET,
// //     { expiresIn: '7d' }
// //   );
  
// //   return { accessToken, refreshToken };
// // };

// // // Register
// // router.post('/register', async (req, res) => {
// //   try {
// //     const { error } = registerSchema.validate(req.body);
// //     if (error) {
// //       return res.status(400).json({ error: error.details[0].message });
// //     }

// //     const { firstName, lastName, email, password, role = 'USER' } = req.body;

// //     // Check if user exists
// //     const existingUser = await pool.query(
// //       'SELECT id FROM users WHERE email = $1',
// //       [email]
// //     );

// //     if (existingUser.rows.length > 0) {
// //       return res.status(400).json({ error: 'User already exists' });
// //     }

// //     // Hash password
// //     const saltRounds = 12;
// //     const hashedPassword = await bcrypt.hash(password, saltRounds);

// //     // Create user
// //     const result = await pool.query(
// //       `INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at) 
// //        VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
// //        RETURNING id, first_name, last_name, email, role, created_at`,
// //       [firstName, lastName, email, hashedPassword, role.toUpperCase()]
// //     );

// //     const user = result.rows[0];
// //     const { accessToken, refreshToken } = generateTokens(user.id, user.role);

// //     // Store refresh token
// //     await pool.query(
// //       'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
// //       [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
// //     );

// //     // Set httpOnly cookie
// //     res.cookie('refreshToken', refreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// //     });

// //     res.status(201).json({
// //       message: 'User created successfully',
// //       user: {
// //         id: user.id,
// //         firstName: user.first_name,
// //         lastName: user.last_name,
// //         email: user.email,
// //         role: user.role
// //       },
// //       accessToken
// //     });
// //   } catch (error) {
// //     console.error('Register error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Login
// // router.post('/login', async (req, res) => {
// //   try {
// //     const { error } = loginSchema.validate(req.body);
// //     if (error) {
// //       return res.status(400).json({ error: error.details[0].message });
// //     }

// //     const { email, password } = req.body;

// //     // Find user
// //     const result = await pool.query(
// //       'SELECT id, first_name, last_name, email, password, role FROM users WHERE email = $1',
// //       [email]
// //     );

// //     if (result.rows.length === 0) {
// //       return res.status(401).json({ error: 'Invalid credentials' });
// //     }

// //     const user = result.rows[0];

// //     // Check password
// //     const isValidPassword = await bcrypt.compare(password, user.password);
// //     if (!isValidPassword) {
// //       return res.status(401).json({ error: 'Invalid credentials' });
// //     }

// //     const { accessToken, refreshToken } = generateTokens(user.id, user.role);

// //     // Delete old refresh tokens for this user
// //     await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id]);

// //     // Store new refresh token
// //     await pool.query(
// //       'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
// //       [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
// //     );

// //     // Update last login
// //     await pool.query(
// //       'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
// //       [user.id]
// //     );

// //     res.cookie('refreshToken', refreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 7 * 24 * 60 * 60 * 1000
// //     });

// //     res.json({
// //       message: 'Login successful',
// //       user: {
// //         id: user.id,
// //         firstName: user.first_name,
// //         lastName: user.last_name,
// //         email: user.email,
// //         role: user.role
// //       },
// //       accessToken
// //     });
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Refresh token
// // router.post('/refresh', async (req, res) => {
// //   try {
// //     const refreshToken = req.cookies.refreshToken;
    
// //     if (!refreshToken) {
// //       return res.status(401).json({ error: 'Refresh token not found' });
// //     }

// //     // Verify refresh token
// //     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
// //     // Check if refresh token exists in database
// //     const tokenResult = await pool.query(
// //       'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
// //       [refreshToken]
// //     );

// //     if (tokenResult.rows.length === 0) {
// //       return res.status(401).json({ error: 'Invalid refresh token' });
// //     }

// //     // Get user details
// //     const userResult = await pool.query(
// //       'SELECT id, first_name, last_name, email, role FROM users WHERE id = $1',
// //       [decoded.userId]
// //     );

// //     if (userResult.rows.length === 0) {
// //       return res.status(401).json({ error: 'User not found' });
// //     }

// //     const user = userResult.rows[0];
// //     const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);

// //     // Update refresh token in database
// //     await pool.query(
// //       'UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE user_id = $3',
// //       [newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), user.id]
// //     );

// //     res.cookie('refreshToken', newRefreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 7 * 24 * 60 * 60 * 1000
// //     });

// //     res.json({
// //       user: {
// //         id: user.id,
// //         firstName: user.first_name,
// //         lastName: user.last_name,
// //         email: user.email,
// //         role: user.role
// //       },
// //       accessToken
// //     });
// //   } catch (error) {
// //     console.error('Refresh error:', error);
// //     res.status(401).json({ error: 'Invalid refresh token' });
// //   }
// // });

// // // Logout
// // router.post('/logout', auth, async (req, res) => {
// //   try {
// //     const refreshToken = req.cookies.refreshToken;
    
// //     if (refreshToken) {
// //       await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
// //     }
    
// //     res.clearCookie('refreshToken');
// //     res.json({ message: 'Logged out successfully' });
// //   } catch (error) {
// //     console.error('Logout error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get current user
// // router.get('/me', auth, async (req, res) => {
// //   try {
// //     const result = await pool.query(
// //       'SELECT id, first_name, last_name, email, role, created_at, last_login FROM users WHERE id = $1',
// //       [req.user.userId]
// //     );

// //     if (result.rows.length === 0) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }

// //     const user = result.rows[0];
// //     res.json({
// //       id: user.id,
// //       firstName: user.first_name,
// //       lastName: user.last_name,
// //       email: user.email,
// //       role: user.role,
// //       createdAt: user.created_at,
// //       lastLogin: user.last_login
// //     });
// //   } catch (error) {
// //     console.error('Get user error:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // module.exports = router;




// // src/routes/auth.js
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { pool } = require('../config/db');
// const { registerSchema, loginSchema } = require('../validation/auth');
// const auth = require('../middleware/auth');
// const router = express.Router();

// // token helpers
// const generateTokens = (userId, role) => {
//   const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
//   const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
//   return { accessToken, refreshToken };
// };

// // REGISTER
// router.post('/register', async (req, res) => {
//   try {
//     const { error } = registerSchema.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const { firstName, lastName, email, password, role = 'USER' } = req.body;

//     const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
//     if (existing.rows.length) return res.status(400).json({ error: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 12);
//     const result = await pool.query(
//       `INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
//        VALUES ($1,$2,$3,$4,$5, NOW(), NOW())
//        RETURNING id, first_name, last_name, email, role`,
//       [firstName, lastName, email, hashed, role.toUpperCase()]
//     );

//     const user = result.rows[0];
//     const { accessToken, refreshToken } = generateTokens(user.id, user.role);

//     await pool.query(
//       'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1,$2,$3)',
//       [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
//     );

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         id: user.id,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         email: user.email,
//         role: user.role,
//       },
//       accessToken,
//     });
//   } catch (e) {
//     console.error('Register error:', e);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//   try {
//     const { error } = loginSchema.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const { email, password } = req.body;
//     const result = await pool.query(
//       'SELECT id, first_name, last_name, email, password, role FROM users WHERE email = $1',
//       [email]
//     );
//     if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

//     const user = result.rows[0];
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

//     const { accessToken, refreshToken } = generateTokens(user.id, user.role);
//     await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id]);
//     await pool.query(
//       'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1,$2,$3)',
//       [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
//     );
//     await pool.query('UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1', [user.id]);

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       message: 'Login successful',
//       user: {
//         id: user.id,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         email: user.email,
//         role: user.role,
//       },
//       accessToken,
//     });
//   } catch (e) {
//     console.error('Login error:', e);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // REFRESH
// router.post('/refresh', async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) return res.status(401).json({ error: 'Refresh token not found' });

//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

//     const tokenRow = await pool.query(
//       'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
//       [refreshToken]
//     );
//     if (!tokenRow.rows.length) return res.status(401).json({ error: 'Invalid refresh token' });

//     const userRes = await pool.query(
//       'SELECT id, first_name, last_name, email, role FROM users WHERE id = $1',
//       [decoded.userId]
//     );
//     if (!userRes.rows.length) return res.status(401).json({ error: 'User not found' });

//     const user = userRes.rows[0];
//     const { accessToken, refreshToken: newRefresh } = generateTokens(user.id, user.role);

//     await pool.query(
//       'UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE user_id = $3',
//       [newRefresh, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), user.id]
//     );

//     res.cookie('refreshToken', newRefresh, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       user: {
//         id: user.id,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         email: user.email,
//         role: user.role,
//       },
//       accessToken,
//     });
//   } catch (e) {
//     console.error('Refresh error:', e);
//     res.status(401).json({ error: 'Invalid refresh token' });
//   }
// });

// // LOGOUT
// router.post('/logout', auth, async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (refreshToken) {
//       await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
//     }
//     res.clearCookie('refreshToken');
//     res.json({ message: 'Logged out successfully' });
//   } catch (e) {
//     console.error('Logout error:', e);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // ME
// router.get('/me', auth, async (req, res) => {
//   try {
//     const r = await pool.query(
//       'SELECT id, first_name, last_name, email, role, created_at, last_login FROM users WHERE id = $1',
//       [req.user.userId]
//     );
//     if (!r.rows.length) return res.status(404).json({ error: 'User not found' });

//     const u = r.rows[0];
//     res.json({
//       id: u.id,
//       firstName: u.first_name,
//       lastName: u.last_name,
//       email: u.email,
//       role: u.role,
//       createdAt: u.created_at,
//       lastLogin: u.last_login,
//     });
//   } catch (e) {
//     console.error('Get user error:', e);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db/connection');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');



// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

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



// Register endpoint
router.post('/register', [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('first_name').trim().isLength({ min: 1, max: 100 }).withMessage('First name required'),
    body('last_name').trim().isLength({ min: 1, max: 100 }).withMessage('Last name required'),
    body('role').optional().isIn(['admin', 'manager', 'pharmacist', 'technician', 'viewer']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, email, password, first_name, last_name, role = 'viewer' } = req.body;

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, first_name, last_name, role, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'active')
             RETURNING id, username, email, first_name, last_name, role, created_at`,
            [username, email, hashedPassword, first_name, last_name, role]
        );

        const user = result.rows[0];
        logger.info('User registered successfully', { userId: user.id, username: user.username });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                    createdAt: user.created_at
                },
                token
            }
        });

    } catch (error) {
        logger.error('Registration error', { error: error.message, stack: error.stack });
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login endpoint
router.post('/login', [
    body('username').trim().notEmpty().withMessage('Username required'),
    body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        // Find user by username or email
        const result = await pool.query(
            'SELECT * FROM users WHERE (username = $1 OR email = $1) AND status = $2',
            [username, 'active']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        logger.info('User logged in successfully', { userId: user.id, username: user.username });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                    lastLogin: user.last_login
                },
                token
            }
        });

    } catch (error) {
        logger.error('Login error', { error: error.message, stack: error.stack });
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, username, email, first_name, last_name, role, phone, 
                    address, city, state, country, postal_code, created_at, last_login
             FROM users WHERE id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                city: user.city,
                state: user.state,
                country: user.country,
                postalCode: user.postal_code,
                createdAt: user.created_at,
                lastLogin: user.last_login
            }
        });

    } catch (error) {
        logger.error('Profile fetch error', { error: error.message, userId: req.user.userId });
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
});

// Update user profile
router.put('/profile', auth, [
    body('first_name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('First name must be 1-100 characters'),
    body('last_name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Last name must be 1-100 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('phone').optional().trim().isLength({ max: 20 }).withMessage('Phone must be max 20 characters'),
    body('address').optional().trim().isLength({ max: 500 }).withMessage('Address must be max 500 characters'),
    body('city').optional().trim().isLength({ max: 100 }).withMessage('City must be max 100 characters'),
    body('state').optional().trim().isLength({ max: 100 }).withMessage('State must be max 100 characters'),
    body('country').optional().trim().isLength({ max: 100 }).withMessage('Country must be max 100 characters'),
    body('postal_code').optional().trim().isLength({ max: 20 }).withMessage('Postal code must be max 20 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const allowedUpdates = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'country', 'postal_code'];
        const updates = {};
        
        // Only include fields that were provided and are allowed to be updated
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }

        // Check if email is being updated and if it's already taken
        if (updates.email) {
            const existingUser = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [updates.email, req.user.userId]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Build dynamic update query
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(updates);
        values.push(req.user.userId); // Add userId for WHERE clause

        const result = await pool.query(
            `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $${values.length} 
             RETURNING id, username, email, first_name, last_name, role, phone, address, city, state, country, postal_code`,
            values
        );

        const user = result.rows[0];
        logger.info('User profile updated', { userId: user.id, updatedFields: Object.keys(updates) });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                city: user.city,
                state: user.state,
                country: user.country,
                postalCode: user.postal_code
            }
        });

    } catch (error) {
        logger.error('Profile update error', { error: error.message, userId: req.user.userId });
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
});

// Change password
router.post('/change-password', auth, [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;

        // Get current user password
        const result = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedNewPassword, req.user.userId]
        );

        logger.info('User password changed', { userId: req.user.userId });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        logger.error('Password change error', { error: error.message, userId: req.user.userId });
        res.status(500).json({
            success: false,
            message: 'Server error changing password'
        });
    }
});

// Logout endpoint (optional - mainly for logging)
router.post('/logout', auth, (req, res) => {
    logger.info('User logged out', { userId: req.user.userId });
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;