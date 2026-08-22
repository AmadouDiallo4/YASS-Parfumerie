const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');
const { signAdminToken } = require('../utils/jwt');

const login = async ({ email, password }) => {
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    throw new ApiError(401, 'Email ou mot de passe invalide');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Email ou mot de passe invalide');
  }

  const token = signAdminToken(admin);

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  };
};

const getCurrentAdmin = async (adminId) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!admin) {
    throw new ApiError(404, 'Administrateur introuvable');
  }

  return admin;
};

module.exports = {
  login,
  getCurrentAdmin
};
