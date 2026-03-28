-- =====================================================
-- Admin Utilities for Supabase
-- These are additional admin utilities and manual operations
-- Main policies are now in schema.sql
-- =====================================================

-- ==================================
-- MAKE A USER AN ADMIN
-- ==================================
-- Replace 'admin@example.com' with the actual admin email

-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';

-- ==================================
-- VIEW ADMIN USERS
-- ==================================

-- SELECT id, email, name, role, created_at 
-- FROM profiles 
-- WHERE role = 'admin';

-- ==================================
-- GRANT SERVICE ROLE BYPASS (for background jobs)
-- ==================================
-- Run this if you have service role operations that need to bypass RLS

-- ALTER TABLE products FORCE ROW LEVEL SECURITY;
-- ALTER TABLE submissions FORCE ROW LEVEL SECURITY;

-- ==================================
-- USEFUL ADMIN QUERIES
-- ==================================

-- Pending products count
-- SELECT COUNT(*) FROM products WHERE status = 'pending';

-- Products pending for more than 24 hours
-- SELECT * FROM products 
-- WHERE status = 'pending' 
-- AND submitted_at < NOW() - INTERVAL '24 hours';

-- Top categories by product count
-- SELECT c.name, c.product_count 
-- FROM categories c 
-- ORDER BY c.product_count DESC;

-- Recent submissions audit log
-- SELECT s.action, s.created_at, p.name as product_name, pr.email as user_email
-- FROM submissions s
-- JOIN products p ON s.product_id = p.id
-- JOIN profiles pr ON s.user_id = pr.id
-- ORDER BY s.created_at DESC
-- LIMIT 50;

-- Newsletter subscriber stats
-- SELECT 
--   COUNT(*) as total,
--   COUNT(*) FILTER (WHERE confirmed = true) as confirmed,
--   COUNT(*) FILTER (WHERE unsubscribed = true) as unsubscribed
-- FROM newsletter_subscribers;

-- ==================================
-- MAINTENANCE OPERATIONS
-- ==================================

-- Recalculate all category product counts
-- UPDATE categories c SET product_count = (
--   SELECT COUNT(*) FROM products p 
--   WHERE p.category_id = c.id AND p.status = 'approved'
-- );

-- Clean up orphaned storage files (manual)
-- Check storage bucket for files not referenced in products table
