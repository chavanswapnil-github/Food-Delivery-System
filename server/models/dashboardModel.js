const db = require("../config/db");

const getDashboardStats = async () => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM restaurants) AS totalRestaurants,
      (SELECT COUNT(*) FROM foods) AS totalFoods,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT IFNULL(SUM(total_amount),0)
         FROM orders
         WHERE order_status='DELIVERED') AS revenue,
      (SELECT COUNT(*)
         FROM orders
         WHERE order_status='PLACED') AS pendingOrders
  `;

  const [rows] = await db.query(sql);
  return rows;
};

module.exports = {
  getDashboardStats,
};
