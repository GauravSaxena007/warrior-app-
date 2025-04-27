const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Franchisee = require('../models/Franchisee');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create new transaction
router.post('/', upload.single('receiptUpload'), async (req, res) => {
  try {
    const { receiptNo, centerName, studentCount, amount, paymentDate, paymentMethod, franchiseeHead } = req.body;
    const receiptUpload = req.file ? req.file.filename : null;

    if (!franchiseeHead) {
      return res.status(400).json({ message: 'Franchisee ID is required' });
    }

    const franchisee = await Franchisee.findById(franchiseeHead);
    if (!franchisee) {
      return res.status(404).json({ message: 'Franchisee not found' });
    }

    const newTransaction = new Transaction({
      receiptNo,
      centerName,
      studentCount,
      amount,
      paymentDate,
      paymentMethod,
      receiptUpload,
      franchiseeHead,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ message: 'Failed to save transaction.' });
  }
});

// Get transactions for the authenticated franchisee
router.get('/', authMiddleware, async (req, res) => {
  try {
    const franchisee = await Franchisee.findOne({ email: req.user.email });
    if (!franchisee) {
      return res.status(404).json({ message: 'Franchisee not found' });
    }

    const transactions = await Transaction.find({ franchiseeHead: franchisee._id });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions.' });
  }
});

// Get all transactions (for admin panel)
router.get('/all', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions.' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Failed to delete transaction.' });
  }
});

router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../Uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

module.exports = router;