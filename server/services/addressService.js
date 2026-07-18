const db = require("../models/addressModel");

// Add Address
const addAddress = async (userId, data) => {
  const {
    full_name,
    phone,
    address_line,
    city,
    state,
    pincode,
    address_type,
    latitude,
    longitude,
  } = data;

  const [result] = await db.query(
    `INSERT INTO addresses
    (user_id, full_name, phone, address_line, city, state, pincode, address_type, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      full_name,
      phone,
      address_line,
      city,
      state,
      pincode,
      address_type,
      latitude ?? null,
      longitude ?? null,
    ]
  );

  return result;
};

// Get All Addresses
const getAddresses = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM addresses
     WHERE user_id = ?
     ORDER BY is_default DESC, id DESC`,
    [userId]
  );

  return rows;
};

// Update Address
const updateAddress = async (id, userId, data) => {
  const {
    full_name,
    phone,
    address_line,
    city,
    state,
    pincode,
    address_type,
    latitude,
    longitude,
  } = data;

  const [result] = await db.query(
    `UPDATE addresses
     SET full_name=?,
         phone=?,
         address_line=?,
         city=?,
         state=?,
         pincode=?,
         address_type=?,
         latitude=?,
         longitude=?
     WHERE id=? AND user_id=?`,
    [
      full_name,
      phone,
      address_line,
      city,
      state,
      pincode,
      address_type,
      latitude ?? null,
      longitude ?? null,
      id,
      userId,
    ]
  );

  return result;
};

// Delete Address
const deleteAddress = async (id, userId) => {
  const [result] = await db.query(
    `DELETE FROM addresses
     WHERE id=? AND user_id=?`,
    [id, userId]
  );

  return result;
};

// Set Default Address
const setDefaultAddress = async (id, userId) => {
  // Remove previous default
  await db.query(
    `UPDATE addresses
     SET is_default = false
     WHERE user_id=?`,
    [userId]
  );

  // Set new default
  const [result] = await db.query(
    `UPDATE addresses
     SET is_default = true
     WHERE id=? AND user_id=?`,
    [id, userId]
  );

  return result;
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
