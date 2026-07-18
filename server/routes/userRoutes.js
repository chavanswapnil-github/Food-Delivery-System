const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// Get logged-in user profile
router.get("/profile", authMiddleware, getProfile);

// Update profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;