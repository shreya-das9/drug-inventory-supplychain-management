// const { pool } = require('../config/db');
// const bcrypt = require('bcryptjs');

// class UserModel {
//   static async create({ email, password, firstName, lastName, role = 'USER' }) {
//     const hashedPassword = await bcrypt.hash(password, 12);
    
//     const query = `
//       INSERT INTO users (email, password_hash, first_name, last_name, role) 
//       VALUES ($1, $2, $3, $4, $5) 
//       RETURNING id, email, first_name, last_name, role, is_verified, is_active, created_at
//     `;
    
//     const values = [email, hashedPassword, firstName, lastName, role];
//     const result = await pool.query(query, values);
//     return result.rows[0];
//   }

//   static async findByEmail(email) {
//     const query = 'SELECT * FROM users WHERE email = $1';
//     const result = await pool.query(query, [email]);
//     return result.rows[0];
//   }

//   static async findById(id) {
//     const query = `
//       SELECT id, email, first_name, last_name, role, is_verified, is_active, created_at, updated_at 
//       FROM users WHERE id = $1
//     `;
//     const result = await pool.query(query, [id]);
//     return result.rows[0];
//   }

//   static async comparePassword(plainPassword, hashedPassword) {
//     return await bcrypt.compare(plainPassword, hashedPassword);
//   }

//   static async updateLastLogin(userId) {
//     const query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1';
//     await pool.query(query, [userId]);
//   }

//   static async updateUser(userId, updates) {
//     const fields = [];
//     const values = [];
//     let paramCounter = 1;

//     Object.keys(updates).forEach(key => {
//       if (updates[key] !== undefined) {
//         fields.push(`${key} = $${paramCounter}`);
//         values.push(updates[key]);
//         paramCounter++;
//       }
//     });

//     if (fields.length === 0) return null;

//     values.push(userId);
//     const query = `
//       UPDATE users 
//       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
//       WHERE id = $${paramCounter} 
//       RETURNING id, email, first_name, last_name, role, is_verified, is_active, created_at, updated_at
//     `;

//     const result = await pool.query(query, values);
//     return result.rows[0];
//   }

//   static async getAllUsers(limit = 50, offset = 0) {
//     const query = `
//       SELECT id, email, first_name, last_name, role, is_verified, is_active, created_at, updated_at 
//       FROM users 
//       ORDER BY created_at DESC 
//       LIMIT $1 OFFSET $2
//     `;
//     const result = await pool.query(query, [limit, offset]);
//     return result.rows;
//   }
// }

// module.exports = UserModel;

// backend/models/UserModel.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class UserModel {
  // Create user
  static async create({ email, password, firstName, lastName, role = "USER" }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    // Auto-generate username from email (before @)
    const username = email.split("@")[0];

    const query = `
      INSERT INTO users 
        (username, email, password_hash, first_name, last_name, role) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, username, email, first_name, last_name, role, is_verified, is_active, created_at
    `;

    const values = [username, email, hashedPassword, firstName, lastName, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find by email
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Compare passwords
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = UserModel;
