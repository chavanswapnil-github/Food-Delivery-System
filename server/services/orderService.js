const db = require("../config/db");

// ================= PLACE ORDER =================
// Uses a single dedicated connection from the pool so the order row and
// its order_items rows are inserted atomically (all-or-nothing).
const placeOrder = async (userId, orderData) => {
  const {
    address_id,
    payment_method,
    payment_status,
    total_amount,
    items,
    razorpay_order_id = null,
    razorpay_payment_id = null,
  } = orderData;

  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const orderSql = `
      INSERT INTO orders
      (
        user_id,
        address_id,
        payment_method,
        payment_status,
        total_amount,
        razorpay_order_id,
        razorpay_payment_id
      )
      VALUES (?,?,?,?,?,?,?)
    `;

    const [result] = await conn.query(orderSql, [
      userId,
      address_id,
      payment_method,
      payment_status,
      total_amount,
      razorpay_order_id,
      razorpay_payment_id,
    ]);

    const orderId = result.insertId;

    const values = items.map((item) => [
      orderId,
      item.food_id,
      item.quantity,
      item.price,
    ]);

    await conn.query(
      `INSERT INTO order_items (order_id, food_id, quantity, price) VALUES ?`,
      [values]
    );

    await conn.commit();

    return { orderId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ================= MY ORDERS =================

const getMyOrders = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

// ================= ORDER DETAILS =================

const getOrderById = async (orderId, userId) => {
  const sql = `
    SELECT
      o.*,
      oi.food_id,
      oi.quantity,
      oi.price,
      f.food_name,
      f.image
    FROM orders o
    JOIN order_items oi
      ON o.id = oi.order_id
    JOIN foods f
      ON oi.food_id = f.id
    WHERE o.id = ?
    AND o.user_id = ?
  `;

  const [rows] = await db.query(sql, [orderId, userId]);
  return rows;
};

// ================= CANCEL ORDER =================

const cancelOrder = async (orderId, userId) => {
  const [result] = await db.query(
    `
    UPDATE orders
    SET order_status='CANCELLED'
    WHERE id=?
    AND user_id=?
    AND order_status='PLACED'
    `,
    [orderId, userId]
  );
  return result;
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
