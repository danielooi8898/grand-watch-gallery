-- ERP & CRM Database Tables

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  city VARCHAR(100),
  type VARCHAR(50) NOT NULL DEFAULT 'Retail', -- Retail, Wholesale
  status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Inactive
  total_spent DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_type ON customers(type);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id BIGSERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  contact VARCHAR(255),
  email VARCHAR(255),
  category VARCHAR(100),
  rating DECIMAL(2, 1) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Inactive
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_suppliers_company ON suppliers(company);
CREATE INDEX idx_suppliers_status ON suppliers(status);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  order_date DATE NOT NULL,
  items_count INTEGER DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  commission DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Completed, Cancelled
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Paid, Partial
  ref_ids TEXT, -- JSON array of item ref IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_date ON orders(order_date DESC);

-- Stock Movements Table
CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGSERIAL PRIMARY KEY,
  movement_date DATE NOT NULL,
  movement_type VARCHAR(10) NOT NULL, -- IN, OUT
  ref_id VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  reason VARCHAR(255),
  user_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_movements_ref_id ON stock_movements(ref_id);
CREATE INDEX idx_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_movements_date ON stock_movements(movement_date DESC);
CREATE INDEX idx_movements_brand ON stock_movements(brand);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to read and write
CREATE POLICY "Allow authenticated users to read customers"
  ON customers FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert customers"
  ON customers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update customers"
  ON customers FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete customers"
  ON customers FOR DELETE
  USING (true);

-- Suppliers policies
CREATE POLICY "Allow authenticated users to read suppliers"
  ON suppliers FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert suppliers"
  ON suppliers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update suppliers"
  ON suppliers FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete suppliers"
  ON suppliers FOR DELETE
  USING (true);

-- Orders policies
CREATE POLICY "Allow authenticated users to read orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders"
  ON orders FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete orders"
  ON orders FOR DELETE
  USING (true);

-- Stock movements policies
CREATE POLICY "Allow authenticated users to read movements"
  ON stock_movements FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert movements"
  ON stock_movements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete movements"
  ON stock_movements FOR DELETE
  USING (true);
