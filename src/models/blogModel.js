const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true }, // rich HTML with images
  tags: [String],
  thumbnailUrl: { type: String, required: true }, // Cloudinary image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
