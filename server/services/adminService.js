const adminModel = require("../models/adminModel");

// ================= USERS =================

const fetchAllUsers = () => adminModel.getAllUsers();

const setUserStatus = (id, status) => adminModel.updateUserStatus(id, status);

const removeUser = (id) => adminModel.deleteUser(id);

// ================= RESTAURANTS =================

const fetchAllRestaurants = () => adminModel.getAllRestaurantsAdmin();

const setRestaurantStatus = (id, status) =>
  adminModel.updateRestaurantStatus(id, status);

const removeRestaurant = (id) => adminModel.deleteRestaurantAdmin(id);

// ================= ORDERS =================

const fetchAllOrders = () => adminModel.getAllOrdersAdmin();

const fetchOrderItems = (orderId) => adminModel.getOrderItemsAdmin(orderId);

// ================= ANALYTICS =================

const fetchAnalytics = async () => {
  const [overviewRows, revenueTrend, topRestaurants, statusBreakdown] =
    await Promise.all([
      adminModel.getOverviewStats(),
      adminModel.getRevenueTrend(),
      adminModel.getTopRestaurants(),
      adminModel.getOrderStatusBreakdown(),
    ]);

  return {
    overview: overviewRows[0],
    revenueTrend,
    topRestaurants,
    statusBreakdown,
  };
};

module.exports = {
  fetchAllUsers,
  setUserStatus,
  removeUser,
  fetchAllRestaurants,
  setRestaurantStatus,
  removeRestaurant,
  fetchAllOrders,
  fetchOrderItems,
  fetchAnalytics,
};
