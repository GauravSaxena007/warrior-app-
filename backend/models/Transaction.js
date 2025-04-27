const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true },
    centerName: { type: String, required: true },
    studentCount: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    receiptUpload: { type: String },
    franchiseeHead: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchisee', required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;