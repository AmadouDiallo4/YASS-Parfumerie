const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getDashboard = asyncHandler(async (_req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.json({ success: true, data: stats });
});

module.exports = {
  getDashboard
};
