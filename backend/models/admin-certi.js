const mongoose = require('mongoose');

const adminCertiSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  filePath: {          // certificate file path
    type: String,
    required: true,
  },
  marksheetPath: {     // marksheet file path
    type: String,
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
