const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getUsers,
  updateUserStatus,
  deleteUser,
  getRestaurants,
  updateRestaurantStatus,
  deleteRestaurant,
  getOrders,
  getOrderItems,
  getAnalytics,
} = require("../controllers/adminController");

// Every route below requires a valid token AND role === 'ADMIN'
router.use(authMiddleware, adminMiddleware);

// Analytics / overview
router.get("/analytics", getAnalytics);

// Users
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Restaurants
router.get("/restaurants", getRestaurants);
router.put("/restaurants/:id/status", updateRestaurantStatus);
router.delete("/restaurants/:id", deleteRestaurant);

// Orders
router.get("/orders", getOrders);
router.get("/orders/:id/items", getOrderItems);

module.exports = router;
