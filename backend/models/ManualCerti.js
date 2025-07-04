const mongoose = require('mongoose');

const ManualCertiSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  mobile: { type: String, required: true },
  courseName: { type: String, required: true },
  certificateNumber: { type: String, required: true, unique: true },
  obtainMarks: [{
    subject: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    obtained: { type: Number, required: true }
  }],
  marksheetHTML: { type: String, required: true },
  certificateFile: { type: String, default: null },
  marksheetFile: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ManualCerti', ManualCertiSchema);