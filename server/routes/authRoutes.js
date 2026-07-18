const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleAuth,
  sendRegisterOTP,
  sendLoginOTP,
  verifyOTPController,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Register
router.post("/register", register);
router.post("/login", login);

// Google Sign-In (frontend sends the Google ID token here)
router.post("/google", googleAuth);

// OTP
router.post("/send-otp", sendRegisterOTP);
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-otp", verifyOTPController);

// Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;