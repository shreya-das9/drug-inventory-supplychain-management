require('dotenv').config();
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

const seedUsers = async () => {
  const client = await pool.connect();
  
  try {
    // Check if users already exist
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      logger.info('Users already exist, skipping seed');
      return;
    }

    const users = [
      {
        email: 'admin@drugstore.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      },
      {
        email: 'warehouse@drugstore.com',
        password: 'Warehouse123!',
        firstName: 'Warehouse',
        lastName: 'Manager',
        role: 'WAREHOUSE'
      },
      {
        email: 'retailer@drugstore.com',
        password: 'Retailer123!',
        firstName: 'Retailer',
        lastName: 'Owner',
        role: 'RETAILER'
      },
      {
        email: 'user@drugstore.com',
        password: 'User123!',
        firstName: 'Regular',
        lastName: 'User',
        role: 'USER'
      }
    ];

    await client.query('BEGIN');

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);

      // Use email prefix as username (before @)
      const username = user.email.split('@')[0];

      await client.query(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [username, user.email, hashedPassword, user.firstName, user.lastName, user.role, true]
      );

      logger.info(`Created user: ${user.email} with role: ${user.role}`);
    }

    await client.query('COMMIT');
    logger.info('Seed data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  seedUsers()
    .then(() => {
      logger.info('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seedUsers;
