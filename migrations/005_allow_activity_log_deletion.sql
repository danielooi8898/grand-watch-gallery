-- Update RLS policy to allow authenticated users to delete activity logs
-- Drop the existing policy that prevents deletion
DROP POLICY IF EXISTS "Prevent deletion of activity logs" ON activity_logs;

-- Create new policy to allow authenticated users to delete activity logs
CREATE POLICY "Allow authenticated users to delete activity logs"
  ON activity_logs FOR DELETE
  USING (true);
