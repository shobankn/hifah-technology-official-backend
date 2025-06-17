const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudnarysingle');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hifah-technology-backend',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage });



const deleteCloudinaryImageByUrl = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${publicIdWithExtension.split('.')[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete failed:", error.message);
    throw error;
  }
};

module.exports = {deleteCloudinaryImageByUrl,upload };



