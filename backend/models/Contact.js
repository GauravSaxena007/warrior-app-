const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  area: { type: String, default: "" },
  address: { type: String, default: "" },
  pin: { type: String, default: "" },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
});

const contactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  mapUrl: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);
const Submission = mongoose.model("Submission", submissionSchema);

module.exports = { Contact, Submission };