-- Inventory Table

CREATE TABLE IF NOT EXISTS inventory (
  id BIGSERIAL PRIMARY KEY,
  ref_id VARCHAR(255) NOT NULL UNIQUE,
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255),
  serial_no VARCHAR(255) NOT NULL,
  condition VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, USED
  year VARCHAR(50),
  cost_price DECIMAL(12, 2) DEFAULT 0,
  sale_price DECIMAL(12, 2) DEFAULT 0,
  commission DECIMAL(12, 2) DEFAULT 0,
  actor_fee DECIMAL(12, 2) DEFAULT 0,
  owner VARCHAR(255),
  owner_contact VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Sold
  type VARCHAR(50) NOT NULL DEFAULT 'Personal', -- Personal, Consignment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inventory_ref_id ON inventory(ref_id);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_brand ON inventory(brand);
CREATE INDEX idx_inventory_condition ON inventory(condition);
CREATE INDEX idx_inventory_type ON inventory(type);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to read and write
CREATE POLICY "Allow authenticated users to read inventory"
  ON inventory FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert inventory"
  ON inventory FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update inventory"
  ON inventory FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete inventory"
  ON inventory FOR DELETE
  USING (true);
