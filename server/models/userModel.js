const db = require("../config/db");

// FIND USER BY EMAIL
const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows;
};

// FIND USER BY ID
const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows;
};

// CREATE USER
const createUser = async (user) => {
  const sql = `
    INSERT INTO users
    (full_name, email, phone, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    user.full_name,
    user.email,
    user.phone,
    user.password,
    user.role,
  ]);

  return result;
};

// NOTE: OTP storage lives in models/otpModel.js (otp_verifications table),
// not here — see that file for why.

// ================= RESET PASSWORD =================

// Save Reset Token
const saveResetToken = async (email, token, expiry) => {
  const [result] = await db.query(
    `UPDATE users
     SET reset_token=?,
         reset_token_expiry=?
     WHERE email=?`,
    [token, expiry, email]
  );
  return result;
};

// Find user by reset token
const findUserByResetToken = async (token) => {
  const [rows] = await db.query(
    `SELECT *
     FROM users
     WHERE reset_token=?
     AND reset_token_expiry > NOW()`,
    [token]
  );
  return rows;
};

// Update Password
const updatePassword = async (id, password) => {
  const [result] = await db.query(
    `UPDATE users
     SET password=?,
         reset_token=NULL,
         reset_token_expiry=NULL
     WHERE id=?`,
    [password, id]
  );
  return result;
};

// ================= GOOGLE SIGN-IN =================

// FIND USER BY GOOGLE ID
const findUserByGoogleId = async (googleId) => {
  const [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [googleId]);
  return rows;
};

// CREATE A NEW USER FROM A GOOGLE ACCOUNT (no password / phone yet)
const createGoogleUser = async (user) => {
  const sql = `
    INSERT INTO users
    (full_name, email, google_id, auth_provider, role, is_verified)
    VALUES (?, ?, ?, 'GOOGLE', ?, 1)
  `;

  const [result] = await db.query(sql, [
    user.full_name,
    user.email,
    user.google_id,
    user.role || "CUSTOMER",
  ]);

  return result;
};

// LINK A GOOGLE ACCOUNT TO AN EXISTING LOCAL ACCOUNT (matched by email)
const linkGoogleAccount = async (id, googleId) => {
  const [result] = await db.query(
    `UPDATE users
     SET google_id = ?,
         is_verified = 1
     WHERE id = ?`,
    [googleId, id]
  );
  return result;
};

// ================= PROFILE UTILITIES =================

// Secure profile data retriever filtering out credential strings
const getUserById = async (id) => {
  const sql = `
    SELECT id, full_name, email, phone, role
    FROM users
    WHERE id = ?
  `;
  const [rows] = await db.query(sql, [id]);
  return rows;
};

// Profile record update query engine
const updateUserProfile = async (id, data) => {
  const sql = `
    UPDATE users
    SET full_name = ?, phone = ?
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [data.full_name, data.phone, id]);
  return result;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  saveResetToken,
  findUserByResetToken,
  updatePassword,
  getUserById,
  updateUserProfile,
  findUserByGoogleId,
  createGoogleUser,
  linkGoogleAccount,
};
