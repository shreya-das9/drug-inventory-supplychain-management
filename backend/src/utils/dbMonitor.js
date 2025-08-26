const pool = require('../db/database');

class DatabaseMonitor {
  static async logActivity(action, userId, details = {}) {
    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, details, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [userId, action, JSON.stringify(details)]
      );
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  static async getRecentActivity(limit = 50) {
    try {
      const result = await pool.query(`
        SELECT 
          al.id,
          al.action,
          al.details,
          al.created_at,
          u.first_name,
          u.last_name,
          u.email,
          u.role
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT $1
      `, [limit]);
      
      return result.rows;
    } catch (error) {
      console.error('Failed to get activity:', error);
      return [];
    }
  }

  static async getUserStats() {
    try {
      const result = await pool.query(`
        SELECT 
          role,
          COUNT(*) as count,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '24 hours' THEN 1 END) as active_today,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '7 days' THEN 1 END) as active_week
        FROM users 
        GROUP BY role
        ORDER BY count DESC
      `);
      
      return result.rows;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return [];
    }
  }
}

module.exports = DatabaseMonitor;