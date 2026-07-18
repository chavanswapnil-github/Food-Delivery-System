const express = require("express");
const router = express.Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all addresses
router.get("/", authMiddleware, getAddresses);

// Add address
router.post("/", authMiddleware, addAddress);

// Update address
router.put("/:id", authMiddleware, updateAddress);

// Delete address
router.delete("/:id", authMiddleware, deleteAddress);

// Set default address
router.put("/default/:id", authMiddleware, setDefaultAddress);

module.exports = router;