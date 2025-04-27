const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  photo: { type: String, default: null }, // Path to uploaded photo
  franchiseNumber: { type: String, default: "9422123456" },
  welcomeTitle: { type: String, default: "WELCOME TO RCSAS COMPUTER EDUCATION FRANCHISE" },
  welcomeText: { type: String, default: "RCSAS Education provides the best computer education franchise business opportunity in India..." },
  footerLogo: { type: String, default: null }, // Path to uploaded footer logo
  email: { type: String, default: "rcsasedu@gmail.com" },
  phone1: { type: String, default: "07122702727" },
  phone2: { type: String, default: "9422123456" },
  socialLinks: { type: [String], default: ["https://facebook.com", "https://instagram.com"] },
});

module.exports = mongoose.model("Settings", settingsSchema);