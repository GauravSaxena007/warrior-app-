const mongoose = require('mongoose');

const ManualCertiSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  mobile: { type: String, required: true },
  courseName: { type: String, required: true },
  certificateNumber: { type: String, required: true },
  obtainMarks: [{ subject: String, maxMarks: Number, passingMarks: Number, obtained: Number }],
  marksheetHTML: { type: String },
  certificateFile: { type: String },
  marksheetFile: { type: String },
});

module.exports = mongoose.model('ManualCerti', ManualCertiSchema);