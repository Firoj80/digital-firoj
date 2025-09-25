-- Fix for admin user authentication issue
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Check if admin_users table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'admin_users'
);

-- Step 2: If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Step 4: Insert the default admin user
-- Password: Admin@123
-- Hash generated with bcrypt (salt rounds 12)
INSERT INTO admin_users (username, email, password_hash, full_name, is_active)
VALUES (
    'admin',
    'admin@digitalfiroj.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeU2x2a8v7J8c8q2K',
    'Administrator',
    true
) ON CONFLICT (username) DO NOTHING;

-- Step 5: Verify the admin user was created
SELECT id, username, email, full_name, is_active, created_at
FROM admin_users
WHERE username = 'admin';

-- Step 6: Test password verification (this should return true)
-- SELECT 'Admin@123' = crypt('Admin@123', password_hash) FROM admin_users WHERE username = 'admin';
