const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  welcomeTitle: { type: String, required: true },
  agreementTitle: { type: String, required: true },
  content: [{ type: String, required: true }],
  points: [{ type: String, required: true }],
  courses: [
    {
      code: { type: String, required: true },
      name: { type: String, required: true },
      duration: { type: String, required: true },
      royalty: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Agreement', agreementSchema);
