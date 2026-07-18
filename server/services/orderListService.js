const db = require("../config/db");

const getUserOrders = async (userId) => {
    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [userId]);
    return rows;
};

module.exports = {
    getUserOrders
};