const db = require("../config/db");

// CREATE Restaurant
const createRestaurant = async (restaurant) => {
  const sql = `
    INSERT INTO restaurants
    (
      owner_id,
      restaurant_name,
      description,
      address,
      city,
      logo,
      cover_image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    restaurant.owner_id,
    restaurant.restaurant_name,
    restaurant.description,
    restaurant.address,
    restaurant.city,
    restaurant.logo,
    restaurant.cover_image,
  ]);

  return result;
};

// GET Restaurant By ID
const getRestaurantById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE id = ?",
    [id]
  );

  return rows;
};

// GET Owner Restaurants
const getOwnerRestaurants = async (ownerId) => {
  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE owner_id = ?",
    [ownerId]
  );

  return rows;
};

// DELETE Restaurant
const deleteRestaurant = async (id, ownerId) => {
  const [result] = await db.query(
    "DELETE FROM restaurants WHERE id = ? AND owner_id = ?",
    [id, ownerId]
  );

  return result;
};

// UPDATE Restaurant
const updateRestaurant = async (id, ownerId, restaurant) => {
  const sql = `
    UPDATE restaurants
    SET
      restaurant_name = ?,
      description = ?,
      address = ?,
      city = ?
    WHERE id = ?
      AND owner_id = ?
  `;

  const [result] = await db.query(sql, [
    restaurant.restaurant_name,
    restaurant.description,
    restaurant.address,
    restaurant.city,
    id,
    ownerId,
  ]);

  return result;
};

module.exports = {
  createRestaurant,
  getRestaurantById,
  getOwnerRestaurants,
  deleteRestaurant,
  updateRestaurant,
};