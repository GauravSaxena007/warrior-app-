const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  details: { type: [String], required: true },
  duration: { type: String, required: true },
  code: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);