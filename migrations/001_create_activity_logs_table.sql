-- Create activity_logs table for tracking admin portal activities
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  target_id VARCHAR(255),
  target_name VARCHAR(500),
  changes JSONB,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_activity_logs_user_email ON activity_logs(user_email);
CREATE INDEX idx_activity_logs_category ON activity_logs(category);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_user_category ON activity_logs(user_email, category);

-- Enable Row Level Security (optional, depending on your auth setup)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all activity logs
CREATE POLICY "Allow authenticated users to read activity logs"
  ON activity_logs FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert activity logs
CREATE POLICY "Allow authenticated users to insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- Create policy to prevent deletion of logs (audit trail integrity)
CREATE POLICY "Prevent deletion of activity logs"
  ON activity_logs FOR DELETE
  USING (false);
