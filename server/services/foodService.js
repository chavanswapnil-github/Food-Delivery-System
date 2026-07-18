const db = require("../config/db");

// CREATE FOOD
const createFood = async (food, callback) => {
  try {
    const sql = `
      INSERT INTO foods
      (restaurant_id, food_name, description, price, category, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      food.restaurant_id,
      food.food_name,
      food.description,
      food.price,
      food.category,
      food.image,
    ]);

    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

// GET ALL FOODS
const getFoods = async (callback) => {
  try {
    const [rows] = await db.query("SELECT * FROM foods");
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

// GET FOODS BY RESTAURANT
const getFoodsByRestaurant = async (restaurantId, callback) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM foods WHERE restaurant_id = ?",
      [restaurantId]
    );

    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

// OWNER FOODS
const getOwnerFoods = async (ownerId, callback) => {
  try {
    const sql = `
      SELECT f.*
      FROM foods f
      INNER JOIN restaurants r
      ON f.restaurant_id = r.id
      WHERE r.owner_id = ?
      ORDER BY f.id DESC
    `;

    const [rows] = await db.query(sql, [ownerId]);

    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

// DELETE FOOD
const deleteFood = async (id, ownerId, callback) => {
  try {
    const sql = `
      DELETE f
      FROM foods f
      INNER JOIN restaurants r
      ON f.restaurant_id = r.id
      WHERE f.id = ?
      AND r.owner_id = ?
    `;

    const [result] = await db.query(sql, [id, ownerId]);

    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

// UPDATE FOOD
const updateFood = async (id, ownerId, food, callback) => {
  try {
    const sql = `
      UPDATE foods f
      INNER JOIN restaurants r
      ON f.restaurant_id = r.id
      SET
        f.food_name = ?,
        f.description = ?,
        f.price = ?,
        f.category = ?
      WHERE
        f.id = ?
      AND
        r.owner_id = ?
    `;

    const [result] = await db.query(sql, [
      food.food_name,
      food.description,
      food.price,
      food.category,
      id,
      ownerId,
    ]);

    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  createFood,
  getFoods,
  getFoodsByRestaurant,
  getOwnerFoods,
  deleteFood,
  updateFood,
};