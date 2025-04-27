const mongoose = require('mongoose');

const issuedCertificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('IssuedCertificate', issuedCertificateSchema);
