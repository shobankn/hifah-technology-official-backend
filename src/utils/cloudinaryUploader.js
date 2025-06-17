const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const MAX_CLOUDINARY_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_WIDTH = 2500;

// Upload
const uploadToS3 = async (file, subFolder = '') => {
  if (!file || !file.originalname) throw new Error("Missing file name");

  const nameWithoutExt = file.originalname
    .split('.').slice(0, -1).join('.')
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');

  const folderPath = subFolder ? `hifahtechnology/${subFolder}` : 'hifahtechnology';

  // Step 1: Try quality 90 once
  let buffer = await sharp(file.buffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toBuffer();

  // Step 2: Fallback if >10MB
  if (buffer.length > MAX_CLOUDINARY_SIZE) {
    buffer = await sharp(buffer) // use already processed buffer, not original!
      .webp({ quality: 75 })     // lower quality
      .toBuffer();
  }

  // Upload with timeout-safe stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        public_id: nameWithoutExt,
        resource_type: 'image',
        overwrite: true,
        format: 'webp',
        timeout: 120000, // 2 minutes
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }

        const optimizedUrl = result.secure_url.replace(
          '/upload/',
          '/upload/f_auto,q_auto:good/'
        );
        resolve(optimizedUrl);
      }
    );

    uploadStream.end(buffer);
  });
};

const deleteFromS3 = async (publicUrl) => {
  try {
    const splitUrl = publicUrl.split('/upload/')[1];
    const publicId = splitUrl.replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log(`Deleted from Cloudinary: ${publicId}`);
    return true;
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    throw err;
  }
};

module.exports = { upload, uploadToS3, deleteFromS3 };
