const asyncHandler = require('../utils/asyncHandler');
const settingsService = require('../services/settingsService');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getOrCreateSettings();
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  res.json({ success: true, data: settings });
});

module.exports = {
  getSettings,
  updateSettings
};
