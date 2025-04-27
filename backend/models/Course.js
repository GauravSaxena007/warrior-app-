// backend/models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: [String], required: true },
  duration: { type: String, required: true },
  category: { type: String }, 
  code: { type: String, required: true }
});

module.exports = mongoose.model("Course", courseSchema);
