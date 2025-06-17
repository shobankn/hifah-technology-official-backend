const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  categoryKey: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
