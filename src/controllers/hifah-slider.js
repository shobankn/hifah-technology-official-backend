const { uploadToS3 } = require("../utils/uploadtos3");

const uploadSliderimages =  async (req, res) => {
  try {
    const folder = req.body.folder || 'default';

    const urls = await Promise.all(
      req.files.map(file => uploadToS3(file, folder))
    );

    res.status(200).json({
      message: 'Upload successful',
      urls, // now an array of URLs
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

module.exports = { uploadSliderimages }