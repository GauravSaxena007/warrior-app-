const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  formNumber: String,
  email: String,
  mobile: String,
  address: String,
  photo: String, // or Buffer if you store image directly
  course: String,
  registrationDate: Date,
  courseCompletionDate: Date,
  certificateStatus: { type: String, default: 'Pending' }, // Add this field
  courseAmount: Number,
  certificateStatus: {
    type: String,
    default: "Pending",
  },
  // Example in CertificateRequest.js or student model
  franchiseeHead: {
    type: String, // Changed to String to match StudentRegistration
    required: true, // Added to ensure franchiseeHead is always provided
    default: "Unknown" // Added default for edge cases
  },
  franchiseeHeadRef: { // Added to preserve original ObjectId reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchisee'
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);