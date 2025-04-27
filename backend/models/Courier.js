const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
  courierName: { type: String, required: true },
  courierNumber: { type: String, required: true },
  courierDate: { type: Date, required: true },
  franchiseeHead: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Courier', courierSchema);
