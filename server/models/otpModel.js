const db = require("../config/db");

// ================= OTP (otp_verifications table) =================
// This table is independent of `users`, so it works for BOTH flows:
//  - Registration: the user row doesn't exist yet.
//  - Login: the user row already exists.
// `email` has a UNIQUE key, so we upsert on every send.

// Save (or refresh) an OTP for an email
const saveOTP = async (email, otp, expiry) => {
  const [result] = await db.query(
    `INSERT INTO otp_verifications (email, otp, otp_expiry)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE otp = VALUES(otp), otp_expiry = VALUES(otp_expiry)`,
    [email, otp, expiry]
  );
  return result;
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const [rows] = await db.query(
    `SELECT *
     FROM otp_verifications
     WHERE email = ?
     AND otp = ?
     AND otp_expiry > NOW()`,
    [email, otp]
  );
  return rows;
};

// Clear OTP after successful verification
const clearOTP = async (email) => {
  const [result] = await db.query(
    `DELETE FROM otp_verifications WHERE email = ?`,
    [email]
  );
  return result;
};

module.exports = {
  saveOTP,
  verifyOTP,
  clearOTP,
};
