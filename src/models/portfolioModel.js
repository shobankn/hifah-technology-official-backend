const mongoose = require('mongoose');

const ParagraphSchema = new mongoose.Schema({
  paragraphTitle: { type: String, required: true },
  paragraphDescription: { type: String, required: true },
  paragraphImage: { type: String }, // Cloudinary image URL
});

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
   category: [{ type: String, required: true }], // Instead of tags
  image: { type: String, required: true }, // Main image URL from Cloudinary
  paragraphs: [ParagraphSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
