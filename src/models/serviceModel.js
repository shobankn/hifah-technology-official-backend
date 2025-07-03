const mongoose = require('mongoose');

const exploreCardSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  exploriconUrl: { type: String }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  categoryKey: { type: String },

  // 🔥 NEW: Add explore cards array
  exploreCards: [exploreCardSchema]

}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

