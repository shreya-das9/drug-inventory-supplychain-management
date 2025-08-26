const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'drug_inventory',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''), // Ensure it's a string
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 10
};

// Create database pool
const pool = new Pool(dbConfig);

// Logger function
const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'drug-inventory-backend',
    message,
    ...meta
  };
  console.log(JSON.stringify(logEntry));
};

// Migration table setup
const createMigrationsTable = async (client) => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(query);
  log('info', 'Migrations table created or verified');
};

// Get executed migrations
const getExecutedMigrations = async (client) => {
  const result = await client.query('SELECT filename FROM migrations ORDER BY id');
  return result.rows.map(row => row.filename);
};

// Mark migration as executed
const markMigrationAsExecuted = async (client, filename) => {
  await client.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
};

// Read migration files
const getMigrationFiles = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  try {
    const files = await fs.readdir(migrationsDir);
    return files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in order
  } catch (error) {
    if (error.code === 'ENOENT') {
      log('warn', 'Migrations directory not found, creating it');
      await fs.mkdir(migrationsDir, { recursive: true });
      return [];
    }
    throw error;
  }
};

// Execute a single migration
const executeMigration = async (client, filename) => {
  const migrationPath = path.join(__dirname, 'migrations', filename);
  
  try {
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    log('info', `Executing migration: ${filename}`);
    
    // Execute the migration in a transaction
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await markMigrationAsExecuted(client, filename);
    await client.query('COMMIT');
    
    log('info', `Migration completed: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    log('error', `Migration failed: ${filename}`, { error: error.message });
    throw error;
  }
};

// Main migration function
const runMigrations = async () => {
  const client = await pool.connect();
  
  try {
    log('info', 'Starting database migration process');
    
    // Verify database connection
    await client.query('SELECT NOW()');
    log('info', 'Database connection established');
    
    // Create migrations table
    await createMigrationsTable(client);
    
    // Get migration files and executed migrations
    const migrationFiles = await getMigrationFiles();
    const executedMigrations = await getExecutedMigrations(client);
    
    // Find pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      log('info', 'No pending migrations found');
      return;
    }
    
    log('info', `Found ${pendingMigrations.length} pending migration(s)`, {
      pending: pendingMigrations
    });
    
    // Execute pending migrations
    for (const migration of pendingMigrations) {
      await executeMigration(client, migration);
    }
    
    log('info', 'All migrations completed successfully');
    
  } catch (error) {
    log('error', 'Migration process failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  } finally {
    client.release();
  }
};

// Create sample migration files if they don't exist
const createSampleMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  // Sample migration files for drug inventory system
  const sampleMigrations = {
    '001_create_users_table.sql': `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `,
    
    '002_create_suppliers_table.sql': `
-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    license_number VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_license ON suppliers(license_number);
    `,
    
    '003_create_drugs_table.sql': `
-- Create drugs table
CREATE TABLE IF NOT EXISTS drugs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255),
    category VARCHAR(100),
    dosage_form VARCHAR(100),
    strength VARCHAR(100),
    unit VARCHAR(50),
    description TEXT,
    barcode VARCHAR(100) UNIQUE,
    ndc_number VARCHAR(50),
    is_controlled BOOLEAN DEFAULT false,
    requires_prescription BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_drugs_name ON drugs(name);
CREATE INDEX IF NOT EXISTS idx_drugs_barcode ON drugs(barcode);
CREATE INDEX IF NOT EXISTS idx_drugs_category ON drugs(category);
    `,
    
    '004_create_inventory_table.sql': `
-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    drug_id INTEGER REFERENCES drugs(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id),
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    manufacturing_date DATE,
    expiry_date DATE,
    location VARCHAR(255),
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_inventory_drug_id ON inventory(drug_id);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier_id ON inventory(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_batch ON inventory(batch_number);
    `,
    
    '005_create_transactions_table.sql': `
-- Create transactions table for tracking inventory movements
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    drug_id INTEGER REFERENCES drugs(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id),
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    batch_number VARCHAR(100),
    reference_number VARCHAR(100),
    notes TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_drug_id ON transactions(drug_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
    `
  };
  
  try {
    await fs.mkdir(migrationsDir, { recursive: true });
    
    for (const [filename, content] of Object.entries(sampleMigrations)) {
      const filePath = path.join(migrationsDir, filename);
      
      try {
        await fs.access(filePath);
        // File exists, skip
      } catch {
        // File doesn't exist, create it
        await fs.writeFile(filePath, content.trim());
        log('info', `Created sample migration: ${filename}`);
      }
    }
  } catch (error) {
    log('warn', 'Could not create sample migrations', { error: error.message });
  }
};

// Main execution
const main = async () => {
  try {
    // Validate required environment variables
    if (!process.env.DB_PASSWORD) {
      log('error', 'DB_PASSWORD environment variable is required');
      process.exit(1);
    }
    
    log('info', 'Database configuration', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      passwordSet: !!dbConfig.password
    });
    
    // Create sample migrations if needed
    await createSampleMigrations();
    
    // Run migrations
    await runMigrations();
    
  } catch (error) {
    log('error', 'Migration process failed', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  } finally {
    await pool.end();
    log('info', 'Database pool closed');
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  log('info', 'Received SIGINT, closing database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log('info', 'Received SIGTERM, closing database pool...');
  await pool.end();
  process.exit(0);
});

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { runMigrations, pool };