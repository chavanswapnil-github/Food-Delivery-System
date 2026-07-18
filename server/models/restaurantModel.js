const db = require("../config/db");

const getAllRestaurants = async () => {
  const [rows] = await db.query("SELECT * FROM restaurants");
  return rows;
};

module.exports = {
  getAllRestaurants,
};