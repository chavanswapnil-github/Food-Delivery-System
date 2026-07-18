import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/auth`;

// Register OTP
export const sendRegisterOTP = async (email) => {
  const response = await axios.post(`${API}/send-otp`, {
    email,
  });

  return response.data;
};

// Login OTP
export const sendLoginOTP = async (email) => {
  const response = await axios.post(`${API}/send-login-otp`, {
    email,
  });

  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await axios.post(`${API}/verify-otp`, {
    email,
    otp,
  });

  return response.data;
};

// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};

// Login User
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });

  return response.data;
};

// Google Sign-In / Sign-Up - sends the Google ID token (credential) to the
// backend, which verifies it with Google and returns our own JWT + user.
export const googleAuth = async (idToken) => {
  const response = await axios.post(`${API}/google`, { idToken });
  return response.data;
};

// Forgot Password - sends a reset link to the user's email
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API}/forgot-password`, { email });
  return response.data;
};

// Reset Password - sets a new password using the emailed token
export const resetPassword = async (token, password) => {
  const response = await axios.post(`${API}/reset-password`, {
    token,
    password,
  });
  return response.data;
};