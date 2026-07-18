const { fetchDashboardStats } = require("../services/dashboardService");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await fetchDashboardStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};