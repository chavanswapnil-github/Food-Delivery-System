-- FoodHub Admin Module migration
-- Run this once against your existing database.
-- Usage: mysql -u <user> -p <database_name> < admin_module_migration.sql

-- 1. Allow blocking/unblocking user accounts from the Admin panel
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE';

-- 2. Allow enabling/disabling restaurants from the Admin panel
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE';

-- 3. Promote an existing account to Admin.
--    There is no public "Admin" sign-up in the app on purpose (admin accounts
--    should never be self-service). Register a normal account first, then
--    run this with that account's email to make it an admin:
--
-- UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
