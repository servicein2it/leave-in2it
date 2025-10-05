-- Complete Supabase setup for Leave Management System
-- Run this in Supabase SQL Editor

-- 1. Create users table
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

-- 2. Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id VARCHAR PRIMARY KEY NOT NULL,
  user_id VARCHAR NOT NULL,
  employee_name VARCHAR NOT NULL,
  leave_type VARCHAR NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  contact_number VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'รอพิจารณา', -- 'รอพิจารณา', 'อนุมัติ', 'ปฏิเสธ'
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  approved_by VARCHAR,
  approved_date TIMESTAMP WITH TIME ZONE,
  document_url VARCHAR, -- For sick leave documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_start_date ON leave_requests(start_date);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
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
  'admin', -- ⚠️ Change this password after first login!
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
),
(
  'emp-004',
  'malee.wong',
  'password123',
  'EMPLOYEE',
  'นาง',
  'Malee',
  'มาลี',
  'วงศ์',
  'malee.wong@in2it.co.th',
  '084-567-8901',
  'HR Manager',
  '',
  'Bangkok, Thailand',
  '@malee',
  'malee101',
  'FEMALE',
  '{
    "accumulated": 12,
    "sick": 30,
    "maternity": 90,
    "paternity": 0,
    "personal": 3,
    "vacation": 6,
    "ordination": 1,
    "military": 0,
    "study": 3,
    "international": 0,
    "spouse": 0
  }'::jsonb
) ON CONFLICT (username) DO NOTHING;

-- Insert sample leave requests
INSERT INTO leave_requests (
  id,
  user_id,
  employee_name,
  leave_type,
  start_date,
  end_date,
  total_days,
  reason,
  contact_number,
  status,
  request_date
) VALUES 
(
  'req-001',
  'emp-001',
  'จอห์น โด',
  'ลาป่วย',
  '2024-12-20 00:00:00+07',
  '2024-12-22 00:00:00+07',
  3,
  'ป่วยเป็นไข้หวัด',
  '081-234-5678',
  'อนุมัติ',
  '2024-12-18 09:00:00+07'
),
(
  'req-002',
  'emp-002',
  'เจน สมิธ',
  'ลาพักผ่อน',
  '2024-12-25 00:00:00+07',
  '2024-12-27 00:00:00+07',
  3,
  'ไปเที่ยวกับครอบครัว',
  '082-345-6789',
  'รอพิจารณา',
  '2024-12-19 10:30:00+07'
),
(
  'req-003',
  'emp-003',
  'สมชาย ไทย',
  'ลากิจส่วนตัว',
  '2024-12-30 00:00:00+07',
  '2024-12-30 00:00:00+07',
  1,
  'ธุระส่วนตัว',
  '083-456-7890',
  'รอพิจารณา',
  '2024-12-19 14:15:00+07'
) ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 'Users created:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Leave requests created:' as info, COUNT(*) as count FROM leave_requests
UNION ALL
SELECT 'Admin users:' as info, COUNT(*) as count FROM users WHERE role = 'ADMIN'
UNION ALL
SELECT 'Employee users:' as info, COUNT(*) as count FROM users WHERE role = 'EMPLOYEE';

-- Show sample data
SELECT 
  'Sample Users:' as section,
  username,
  role,
  first_name || ' ' || last_name as full_name,
  email,
  position
FROM users
ORDER BY role DESC, created_at
LIMIT 5;