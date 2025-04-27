// models/admin-certi.js
const mongoose = require('mongoose');

const adminCertiSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Assumes a Student model exists
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  filePath: {
    type: String, // Path or URL of the uploaded certificate file
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminCerti', adminCertiSchema);