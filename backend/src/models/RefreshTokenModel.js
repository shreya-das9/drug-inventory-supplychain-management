const { pool } = require('../config/db');

class RefreshTokenModel {
  static async create(token, userId, expiresAt) {
    const query = `
      INSERT INTO refresh_tokens (token, user_id, expires_at) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await pool.query(query, [token, userId, expiresAt]);
    return result.rows[0];
  }

  static async findByToken(token) {
    const query = `
      SELECT rt.*, u.email, u.role, u.is_active 
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token = $1 AND rt.expires_at > CURRENT_TIMESTAMP
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async deleteByToken(token) {
    const query = 'DELETE FROM refresh_tokens WHERE token = $1';
    await pool.query(query, [token]);
  }

  static async deleteByUserId(userId) {
    const query = 'DELETE FROM refresh_tokens WHERE user_id = $1';
    await pool.query(query, [userId]);
  }

  static async deleteExpired() {
    const query = 'DELETE FROM refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP';
    const result = await pool.query(query);
    return result.rowCount;
  }
}

module.exports = RefreshTokenModel;