const db = require("../config/db");

// ================= USERS =================

const getAllUsers = async () => {
  const sql = `
    SELECT
      id, full_name, email, phone, role, status, created_at
    FROM users
    ORDER BY created_at DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const updateUserStatus = async (id, status) => {
  const sql = `UPDATE users SET status = ? WHERE id = ?`;
  const [result] = await db.query(sql, [status, id]);
  return result;
};

const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id = ? AND role != 'ADMIN'`;
  const [result] = await db.query(sql, [id]);
  return result;
};

// ================= RESTAURANTS =================

const getAllRestaurantsAdmin = async () => {
  const sql = `
    SELECT
      r.id, r.restaurant_name, r.description, r.address, r.city,
      r.logo, r.cover_image, r.status, r.owner_id,
      u.full_name AS owner_name, u.email AS owner_email,
      (SELECT COUNT(*) FROM foods f WHERE f.restaurant_id = r.id) AS foodCount
    FROM restaurants r
    LEFT JOIN users u ON u.id = r.owner_id
    ORDER BY r.id DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const updateRestaurantStatus = async (id, status) => {
  const sql = `UPDATE restaurants SET status = ? WHERE id = ?`;
  const [result] = await db.query(sql, [status, id]);
  return result;
};

const deleteRestaurantAdmin = async (id) => {
  const sql = `DELETE FROM restaurants WHERE id = ?`;
  const [result] = await db.query(sql, [id]);
  return result;
};

// ================= ORDERS =================

const getAllOrdersAdmin = async () => {
  const sql = `
    SELECT
      o.id, o.user_id, o.address_id, o.payment_method, o.payment_status,
      o.total_amount, o.order_status AS status, o.created_at,
      u.full_name AS customer_name, u.email AS customer_email,
      (
        SELECT r.restaurant_name
        FROM order_items oi
        JOIN foods f ON f.id = oi.food_id
        JOIN restaurants r ON r.id = f.restaurant_id
        WHERE oi.order_id = o.id
        LIMIT 1
      ) AS restaurant_name,
      (
        SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id
      ) AS itemCount
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const getOrderItemsAdmin = async (orderId) => {
  const sql = `
    SELECT oi.quantity, oi.price, f.food_name, f.image
    FROM order_items oi
    JOIN foods f ON f.id = oi.food_id
    WHERE oi.order_id = ?
  `;
  const [rows] = await db.query(sql, [orderId]);
  return rows;
};

// ================= ANALYTICS =================

const getOverviewStats = async () => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER') AS totalCustomers,
      (SELECT COUNT(*) FROM users WHERE role = 'OWNER') AS totalOwners,
      (SELECT COUNT(*) FROM restaurants) AS totalRestaurants,
      (SELECT COUNT(*) FROM foods) AS totalFoods,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'PLACED') AS pendingOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'DELIVERED') AS deliveredOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'CANCELLED') AS cancelledOrders,
      (SELECT IFNULL(SUM(total_amount), 0) FROM orders WHERE payment_status = 'PAID') AS revenue
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const getRevenueTrend = async () => {
  const sql = `
    SELECT
      DATE(created_at) AS day,
      IFNULL(SUM(total_amount), 0) AS revenue,
      COUNT(*) AS orders
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const getTopRestaurants = async () => {
  const sql = `
    SELECT
      r.id, r.restaurant_name,
      IFNULL(SUM(oi.price * oi.quantity), 0) AS revenue,
      COUNT(DISTINCT oi.order_id) AS orders
    FROM restaurants r
    JOIN foods f ON f.restaurant_id = r.id
    JOIN order_items oi ON oi.food_id = f.id
    GROUP BY r.id, r.restaurant_name
    ORDER BY revenue DESC
    LIMIT 5
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const getOrderStatusBreakdown = async () => {
  const sql = `
    SELECT order_status AS status, COUNT(*) AS count
    FROM orders
    GROUP BY order_status
  `;
  const [rows] = await db.query(sql);
  return rows;
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllRestaurantsAdmin,
  updateRestaurantStatus,
  deleteRestaurantAdmin,
  getAllOrdersAdmin,
  getOrderItemsAdmin,
  getOverviewStats,
  getRevenueTrend,
  getTopRestaurants,
  getOrderStatusBreakdown,
};
