const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lname: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);