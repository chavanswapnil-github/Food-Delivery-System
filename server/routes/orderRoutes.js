const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

// ================= PLACE ORDER =================
router.post("/", authMiddleware, placeOrder);

// ================= MY ORDERS =================
router.get("/", authMiddleware, getMyOrders);

// ================= ORDER DETAILS =================
router.get("/:id", authMiddleware, getOrderById);

// ================= CANCEL ORDER =================
router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;