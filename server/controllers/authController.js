// Service imports
const { registerUser, loginUser, googleLogin } = require("../services/authService");

// OTP Utility and Model imports
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/sendEmail");

const {
  findUserByEmail,
  saveResetToken,
  findUserByResetToken,
  updatePassword,
} = require("../models/userModel");

// OTPs are stored in their own table (otp_verifications) instead of on the
// users row, since during registration the user row doesn't exist yet.
const { saveOTP, verifyOTP, clearOTP } = require("../models/otpModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// REGISTER Controller
const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Send Register OTP
const sendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await findUserByEmail(email);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await saveOTP(email, otp, expiry);

    try {
      await sendOTPEmail(
        email,
        "Your OTP Verification Code",
        `
          <h2>Food Delivery System</h2>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        `
      );
      console.log("✅ OTP Email Sent");
    } catch (emailErr) {
      console.error("❌ Email Error:", emailErr);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please check server email configuration.",
      });
    }

    res.json({ success: true, message: "OTP Sent" });
  } catch (error) {
    console.error("❌ sendRegisterOTP Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Login OTP
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await findUserByEmail(email);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await saveOTP(email, otp, expiry);

    try {
      await sendOTPEmail(
        email,
        "Your OTP Verification Code",
        `
          <h2>Food Delivery System</h2>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        `
      );
      console.log("✅ OTP Email Sent");
    } catch (emailErr) {
      console.error("❌ Email Error:", emailErr);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please check server email configuration.",
      });
    }

    res.json({ success: true, message: "OTP Sent" });
  } catch (error) {
    console.error("❌ sendLoginOTP Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP (covers both register-verification and login-verification)
const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpResults = await verifyOTP(email, otp);

    if (otpResults.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP",
      });
    }

    const users = await findUserByEmail(email);

    await clearOTP(email);

    // Registration flow: user doesn't exist yet in a completed state
    if (users.length === 0) {
      return res.json({
        success: true,
        message: "OTP Verified",
      });
    }

    // Login flow: issue a token immediately
    const user = users[0];

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ verifyOTPController Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GOOGLE LOGIN / REGISTER Controller
// Frontend sends the Google "credential" (ID token) it received from
// Google Identity Services as { idToken } in the body.
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await googleLogin(idToken);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ googleAuth Error:", error.message);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const users = await findUserByEmail(email);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await saveResetToken(email, token, expiry);

    // Uses the same origin the frontend is actually running on instead of a
    // hard-coded localhost URL, so the reset link also works in production.
    const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
    const link = `${clientOrigin}/reset-password/${token}`;

    await sendOTPEmail(
      email,
      "Reset Your Password",
      `
        <h2>Reset Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 15 minutes.</p>
      `
    );

    res.json({
      success: true,
      message: "Reset link sent to email.",
    });
  } catch (error) {
    console.error("❌ forgotPassword Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const users = await findUserByResetToken(token);

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await updatePassword(users[0].id, hash);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("❌ resetPassword Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  sendRegisterOTP,
  sendLoginOTP,
  verifyOTPController,
  forgotPassword,
  resetPassword,
};
