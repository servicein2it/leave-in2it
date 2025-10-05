-- Create users table for Leave Management System
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR NOT NULL, -- 'ADMIN' or 'EMPLOYEE'
  title VARCHAR NOT NULL,
  nickname VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  profile_picture VARCHAR,
  address TEXT,
  social_media VARCHAR,
  line_user_id VARCHAR,
  gender VARCHAR NOT NULL, -- 'MALE' or 'FEMALE'
  leave_balances JSONB NOT NULL DEFAULT '{
    "accumulated": 0,
    "sick": 0,
    "maternity": 0,
    "paternity": 0,
    "personal": 0,
    "vacation": 0,
    "ordination": 0,
    "military": 0,
    "study": 0,
    "international": 0,
    "spouse": 0
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (
  id,
  username,
  password,
  role,
  title,
  nickname,
  first_name,
  last_name,
  email,
  phone,
  position,
  profile_picture,
  address,
  social_media,
  line_user_id,
  gender,
  leave_balances
) VALUES (
  'admin-001',
  'admin',
  'admin', -- Change this password after first login!
  'ADMIN',
  'นาย',
  'Admin',
  'ผู้ดูแล',
  'ระบบ',
  'admin@in2it.co.th',
  '02-123-4567',
  'System Administrator',
  '',
  'Bangkok, Thailand',
  '',
  '',
  'MALE',
  '{
    "accumulated": 0,
    "sick": 0,
    "maternity": 0,
    "paternity": 0,
    "personal": 0,
    "vacation": 0,
    "ordination": 0,
    "military": 0,
    "study": 0,
    "international": 0,
    "spouse": 0
  }'::jsonb
) ON CONFLICT (username) DO NOTHING;

-- Insert sample employee users
INSERT INTO users (
  id,
  username,
  password,
  role,
  title,
  nickname,
  first_name,
  last_name,
  email,
  phone,
  position,
  profile_picture,
  address,
  social_media,
  line_user_id,
  gender,
  leave_balances
) VALUES 
(
  'emp-001',
  'john.doe',
  'password123',
  'EMPLOYEE',
  'นาย',
  'John',
  'จอห์น',
  'โด',
  'john.doe@in2it.co.th',
  '081-234-5678',
  'Software Developer',
  '',
  'Bangkok, Thailand',
  '@johndoe',
  'john123',
  'MALE',
  '{
    "accumulated": 10,
    "sick": 30,
    "maternity": 0,
    "paternity": 3,
    "personal": 3,
    "vacation": 6,
    "ordination": 1,
    "military": 0,
    "study": 0,
    "international": 0,
    "spouse": 0
  }'::jsonb
),
(
  'emp-002',
  'jane.smith',
  'password123',
  'EMPLOYEE',
  'นางสาว',
  'Jane',
  'เจน',
  'สมิธ',
  'jane.smith@in2it.co.th',
  '082-345-6789',
  'UI/UX Designer',
  '',
  'Bangkok, Thailand',
  '@janesmith',
  'jane456',
  'FEMALE',
  '{
    "accumulated": 8,
    "sick": 30,
    "maternity": 90,
    "paternity": 0,
    "personal": 3,
    "vacation": 6,
    "ordination": 1,
    "military": 0,
    "study": 0,
    "international": 0,
    "spouse": 0
  }'::jsonb
),
(
  'emp-003',
  'somchai.thai',
  'password123',
  'EMPLOYEE',
  'นาย',
  'Somchai',
  'สมชาย',
  'ไทย',
  'somchai.thai@in2it.co.th',
  '083-456-7890',
  'Project Manager',
  '',
  'Bangkok, Thailand',
  '@somchai',
  'somchai789',
  'MALE',
  '{
    "accumulated": 15,
    "sick": 30,
    "maternity": 0,
    "paternity": 3,
    "personal": 3,
    "vacation": 6,
    "ordination": 1,
    "military": 0,
    "study": 5,
    "international": 0,
    "spouse": 0
  }'::jsonb
) ON CONFLICT (username) DO NOTHING;

-- Verify the data
SELECT 
  id,
  username,
  role,
  first_name,
  last_name,
  email,
  position,
  leave_balances
FROM users
ORDER BY role DESC, created_at;