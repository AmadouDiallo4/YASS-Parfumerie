const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucune image fournie' });
  }

  const baseUrl = env.UPLOAD_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  return res.status(201).json({
    success: true,
    data: {
      filename: req.file.filename,
      url: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
});

module.exports = {
  uploadImage
};
