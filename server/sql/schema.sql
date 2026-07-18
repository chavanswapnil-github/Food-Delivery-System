-- =====================================================================
-- FoodHub base database schema
-- ---------------------------------------------------------------------
-- The project did not ship with a base schema (only two ALTER TABLE
-- migration files existed), so there was no way to set up a fresh
-- MySQL database and actually run the app. This file was reverse
-- engineered from every SQL query in server/services, server/models,
-- and server/controllers so every column the code touches actually
-- exists.
--
-- Usage:
--   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS food_delivery"
--   mysql -u root -p food_delivery < schema.sql
--
-- After this, you can optionally run the two migration files in this
-- same folder (they are now redundant if you run this file, since the
-- columns they add are already included here, but are left in place
-- for anyone applying them to an older existing database instead).
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =================== USERS ===================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NULL UNIQUE,
  password VARCHAR(255) NULL,
  role ENUM('CUSTOMER', 'OWNER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  is_verified TINYINT(1) NOT NULL DEFAULT 0,

  -- Google Sign-In: NULL/'LOCAL' for normal email+password accounts.
  auth_provider ENUM('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL',
  google_id VARCHAR(255) NULL UNIQUE,

  otp VARCHAR(10) NULL,
  otp_expiry DATETIME NULL,

  reset_token VARCHAR(255) NULL,
  reset_token_expiry DATETIME NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =================== RESTAURANTS ===================
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  restaurant_name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  address VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  logo VARCHAR(255) NULL,
  cover_image VARCHAR(255) NULL,
  status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_restaurants_owner FOREIGN KEY (owner_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================== FOODS ===================
CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  food_name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NULL,
  image VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_foods_restaurant FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================== ADDRESSES ===================
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(12) NOT NULL,
  address_type ENUM('HOME', 'WORK', 'OTHER') NOT NULL DEFAULT 'HOME',
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================== ORDERS ===================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT NULL,
  payment_method VARCHAR(30) NOT NULL DEFAULT 'COD',
  payment_status ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
  order_status ENUM('PLACED', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')
    NOT NULL DEFAULT 'PLACED',
  total_amount DECIMAL(10, 2) NOT NULL,
  razorpay_order_id VARCHAR(100) NULL,
  razorpay_payment_id VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id)
    REFERENCES addresses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =================== ORDER ITEMS ===================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,

  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_food FOREIGN KEY (food_id)
    REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================== FAVORITES ===================
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_user_food (user_id, food_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_food FOREIGN KEY (food_id)
    REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================== REVIEWS ===================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  rating TINYINT NOT NULL,
  review TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uniq_user_restaurant_review (user_id, restaurant_id),
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_restaurant FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================== COUPONS ===================
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('PERCENT', 'FLAT') NOT NULL DEFAULT 'PERCENT',
  discount_value DECIMAL(10, 2) NOT NULL,
  max_discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_order DECIMAL(10, 2) NOT NULL DEFAULT 0,
  usage_limit INT NOT NULL DEFAULT 1,
  used_count INT NOT NULL DEFAULT 0,
  status TINYINT(1) NOT NULL DEFAULT 1,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Optional: promote an account to Admin after registering normally.
-- There is intentionally no public "Admin" sign-up in the app.
-- UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
-- =====================================================================
