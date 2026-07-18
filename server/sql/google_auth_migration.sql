-- FoodHub Google Sign-In migration
-- Run this once against your existing database.
-- Usage: mysql -u <user> -p <database_name> < google_auth_migration.sql
--
-- Google accounts don't have a local password or a phone number the app
-- collected itself, so both columns have to become optional. We also add
-- google_id (Google's unique "sub" claim) and auth_provider so we can tell
-- local accounts and Google accounts apart, and so an existing local
-- account can be linked to Google by matching on email.

-- 1. Track how the account was created / whether it's linked to Google
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_provider ENUM('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL UNIQUE;

-- 2. Google sign-ups have no local password and may not supply a phone
--    number, so both must be nullable. (Existing rows are untouched.)
ALTER TABLE users
  MODIFY COLUMN password VARCHAR(255) NULL,
  MODIFY COLUMN phone VARCHAR(20) NULL;
