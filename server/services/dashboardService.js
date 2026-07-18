const { getDashboardStats } = require("../models/dashboardModel");

const fetchDashboardStats = async () => {
  const results = await getDashboardStats();
  return results[0];
};

module.exports = {
  fetchDashboardStats,
};
