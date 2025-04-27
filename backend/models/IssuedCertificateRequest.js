const mongoose = require("mongoose");

const issuedCertificateRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
  },
  file: {
    type: String,  // Path to the file (uploaded certificate)
    required: true,
  },
  status: {
    type: String,
    default: "Issued", // Status can be "Requested" or "Issued"
  },
});

module.exports = mongoose.model("IssuedCertificateRequest", issuedCertificateRequestSchema);
