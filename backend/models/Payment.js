const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    franchisee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Franchisee',
      required: true,
    },
    topupAmount: {
      type: Number,
      required: true,
    },
    topupAdded: {
      type: Number,
      required: true,
    },
    chargePerApply: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);