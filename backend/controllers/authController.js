const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.json({ success: true, message: 'Connexion réussie', data });
});

const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie' });
});

const me = asyncHandler(async (req, res) => {
  const admin = await authService.getCurrentAdmin(req.user.id);
  res.json({ success: true, data: admin });
});

module.exports = {
  login,
  logout,
  me
};
