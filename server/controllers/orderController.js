const orderService = require("../services/orderService");

// ================= PLACE ORDER =================

const placeOrder = async (req, res) => {
  try {
    const result = await orderService.placeOrder(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: result.orderId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= MY ORDERS =================

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getMyOrders(
      req.user.id
    );

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= ORDER DETAILS =================

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= CANCEL ORDER =================

const cancelOrder = async (req, res) => {
  try {
    await orderService.cancelOrder(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};