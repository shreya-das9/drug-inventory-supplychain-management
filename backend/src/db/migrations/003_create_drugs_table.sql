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