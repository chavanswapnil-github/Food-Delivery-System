const adminService = require("../services/adminService");

const handle = (promise, res, successKey, successMessage) => {
  promise
    .then((data) => {
      const payload = { success: true };
      if (successMessage) payload.message = successMessage;
      if (successKey) payload[successKey] = data;
      res.json(payload);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    });
};

// ================= USERS =================

const getUsers = (req, res) => {
  handle(adminService.fetchAllUsers(), res, "users");
};

const updateUserStatus = (req, res) => {
  const { status } = req.body;
  if (!["ACTIVE", "BLOCKED"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  handle(
    adminService.setUserStatus(req.params.id, status),
    res,
    null,
    `User ${status === "BLOCKED" ? "blocked" : "unblocked"} successfully`
  );
};

const deleteUser = (req, res) => {
  handle(adminService.removeUser(req.params.id), res, null, "User deleted successfully");
};

// ================= RESTAURANTS =================

const getRestaurants = (req, res) => {
  handle(adminService.fetchAllRestaurants(), res, "restaurants");
};

const updateRestaurantStatus = (req, res) => {
  const { status } = req.body;
  if (!["ACTIVE", "BLOCKED"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  handle(
    adminService.setRestaurantStatus(req.params.id, status),
    res,
    null,
    `Restaurant ${status === "BLOCKED" ? "blocked" : "unblocked"} successfully`
  );
};

const deleteRestaurant = (req, res) => {
  handle(
    adminService.removeRestaurant(req.params.id),
    res,
    null,
    "Restaurant deleted successfully"
  );
};

// ================= ORDERS =================

const getOrders = (req, res) => {
  handle(adminService.fetchAllOrders(), res, "orders");
};

const getOrderItems = (req, res) => {
  handle(adminService.fetchOrderItems(req.params.id), res, "items");
};

// ================= ANALYTICS =================

const getAnalytics = (req, res) => {
  handle(adminService.fetchAnalytics(), res, "analytics");
};

module.exports = {
  getUsers,
  updateUserStatus,
  deleteUser,
  getRestaurants,
  updateRestaurantStatus,
  deleteRestaurant,
  getOrders,
  getOrderItems,
  getAnalytics,
};
