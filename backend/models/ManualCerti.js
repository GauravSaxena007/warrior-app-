// backend/models/ManualCerti.js
const mongoose = require('mongoose');

const ManualCertiSchema = new mongoose.Schema({
  studentName: String,
  mobile: String,
  courseName: String,
  certificateNumber: String,
  certificateFile: String,
  marksheetFile: String,
}, { timestamps: true });

module.exports = mongoose.model('ManualCerti', ManualCertiSchema);
