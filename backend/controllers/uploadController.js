const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucune image fournie' });
  }

  const { fileTypeFromBuffer } = await import('file-type');
  const detectedType = await fileTypeFromBuffer(req.file.buffer);
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
    throw new ApiError(400, 'Contenu fichier invalide. Formats autorisés: JPG, PNG, WEBP');
  }

  const extension = detectedType.ext === 'jpeg' ? 'jpg' : detectedType.ext;
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const destinationPath = path.resolve(__dirname, '../uploads', filename);
  await fs.writeFile(destinationPath, req.file.buffer);

  const baseUrl = env.UPLOAD_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${filename}`;

  return res.status(201).json({
    success: true,
    data: {
      filename,
      url: fileUrl,
      mimetype: detectedType.mime,
      size: req.file.size
    }
  });
});

module.exports = {
  uploadImage
};
