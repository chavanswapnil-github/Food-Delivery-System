-- Run this once against your existing database to enable map-based addresses.
-- Usage: mysql -u <user> -p <database_name> < add_lat_lng_to_addresses.sql

ALTER TABLE addresses
  ADD COLUMN latitude DECIMAL(10, 7) NULL AFTER pincode,
  ADD COLUMN longitude DECIMAL(10, 7) NULL AFTER latitude;
