const mongoose = require("mongoose");

const franchiseeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  centerHead: {
    type: String,
    required: true,
  },
  centerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: String,
  city: String,
  area: String,
  pincode: String,
  registrationNumber: String,
  startingDate: String,
  renewalDate: String,
  photo: String,        // stored as filename in /uploads
  certificate: String,  // stored as filename in /uploads
}, {
  timestamps: true,
});

module.exports = mongoose.model("Franchisee", franchiseeSchema);
