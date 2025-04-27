const mongoose = require("mongoose");

const certificateRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  certificateNumber: {
    type: String
  },
  file: {
    type: String
  },
  // Example in CertificateRequest.js or student model
  franchiseeHead: {
    type: String,
    required: true, // Changed to true to make franchiseeHead mandatory
    default: "Unknown" // Default value to handle edge cases
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  status: { type: String, enum: ['Pending', 'Issued'], default: 'Pending' },
  createdAt: { // Added for tracking creation time
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CertificateRequest", certificateRequestSchema);