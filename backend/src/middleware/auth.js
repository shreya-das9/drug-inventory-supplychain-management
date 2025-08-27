// // const jwt = require('jsonwebtoken');
// // const UserModel = require('../models/UserModel');

// // const auth = async (req, res, next) => {
// //   try {
// //     const authHeader = req.header('Authorization');
    
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'No token provided or invalid format'
// //       });
// //     }

// //     const token = authHeader.substring(7); // Remove 'Bearer ' prefix

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
// //       // Get user from database to ensure they still exist and are active
// //       const user = await UserModel.findById(decoded.id);
      
// //       if (!user) {
// //         return res.status(401).json({
// //           success: false,
// //           message: 'User not found'
// //         });
// //       }

// //       if (!user.is_active) {
// //         return res.status(401).json({
// //           success: false,
// //           message: 'User account is inactive'
// //         });
// //       }

// //       // Add user info to request object
// //       req.user = {
// //         id: user.id,
// //         email: user.email,
// //         role: user.role,
// //         firstName: user.first_name,
// //         lastName: user.last_name,
// //         isVerified: user.is_verified,
// //         isActive: user.is_active
// //       };

// //       next();
// //     } catch (jwtError) {
// //       if (jwtError.name === 'TokenExpiredError') {
// //         return res.status(401).json({
// //           success: false,
// //           message: 'Token expired'
// //         });
// //       }
      
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid token'
// //       });
// //     }
// //   } catch (error) {
// //     console.error('Auth middleware error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error'
// //     });
// //   }
// // };

// // module.exports = auth;













// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     const token = authHeader.substring(7);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Token expired' });
//     }
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };

// module.exports = auth;


const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
// const logger = require('../utils/logger'); // ❌ Remove this line

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        
        // Fixed: Use decoded.id instead of decoded.userId, include email
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1',
            [decoded.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid - user not found'
            });
        }
        
        const user = result.rows[0];
        
        // Fixed: Include email and id
        req.user = {
            id: user.id,
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        
        // ✅ Use console.error instead of logger
        console.error('Auth middleware error', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        
        next();
    };
};

module.exports = { auth, authorize };