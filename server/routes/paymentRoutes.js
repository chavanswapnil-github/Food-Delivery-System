const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  createPayment,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create", auth, createPayment);

router.post("/verify", auth, verifyPayment);

module.exports = router;