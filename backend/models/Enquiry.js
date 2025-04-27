const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  state: String,
  city: String,
  area: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Enquiry", enquirySchema);
