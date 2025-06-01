const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Franchisee = require('../models/Franchisee');
const authenticateFranchisee = require('../middleware/authMiddleware');

// Existing routes (unchanged)
router.post('/topup', async (req, res) => {
  try {
    const { franchiseeId, topupAmount, chargePerApply, remarks } = req.body;

    // Validate franchisee existence
    const franchiseeExists = await Franchisee.findById(franchiseeId);
    if (!franchiseeExists) {
      return res.status(404).json({ error: 'Franchisee not found' });
    }

    // Ensure topupAmount is a number
    const parsedTopupAmount = parseFloat(topupAmount);
    if (isNaN(parsedTopupAmount) || parsedTopupAmount < 0) {
      return res.status(400).json({ error: 'Invalid top-up amount' });
    }

    // Find the latest payment record for the franchisee
    const latestPayment = await Payment.findOne({ franchisee: franchiseeId }).sort({ createdAt: -1 });

    // Calculate the new cumulative top-up amount
    const newTopupAmount = latestPayment ? latestPayment.topupAmount + parsedTopupAmount : parsedTopupAmount;

    // Create a new payment record with both topupAdded and cumulative topupAmount
    const payment = new Payment({
      franchisee: franchiseeId,
      topupAmount: newTopupAmount,
      topupAdded: parsedTopupAmount, // Store the individual top-up amount
      chargePerApply: parseFloat(chargePerApply) || latestPayment?.chargePerApply || 0,
      remarks: remarks || '',
    });

    await payment.save();

    // Respond with the updated cumulative top-up amount
    res.status(201).json({ message: 'Top-up recorded successfully', topupAmount: newTopupAmount });
  } catch (err) {
    console.error('Error recording top-up:', err);
    res.status(500).json({ error: 'Server error while recording top-up' });
  }
});

router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('franchisee', 'centerName name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/franchisee/balance', authenticateFranchisee, async (req, res) => {
  try {
    const franchiseeId = req.user.id;
    const latestPayment = await Payment.findOne({ franchisee: franchiseeId }).sort({ createdAt: -1 });
    res.json({
      topupAmount: latestPayment?.topupAmount || 0,
      chargePerApply: latestPayment?.chargePerApply || 0
    });
  } catch (err) {
    console.error('Error fetching balance:', err);
    res.status(500).json({ error: 'Server error while fetching balance' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// New route to deduct topup amount
router.post('/deduct', authenticateFranchisee, async (req, res) => {
  try {
    const franchiseeId = req.user.id;
    const { deductionAmount } = req.body;

    // Ensure deductionAmount is a number
    const parsedDeductionAmount = parseFloat(deductionAmount);
    if (isNaN(parsedDeductionAmount) || parsedDeductionAmount < 0) {
      return res.status(400).json({ error: 'Invalid deduction amount' });
    }

    // Find the latest payment record for the franchisee
    const latestPayment = await Payment.findOne({ franchisee: franchiseeId }).sort({ createdAt: -1 });
    if (!latestPayment) {
      return res.status(404).json({ error: 'No payment record found' });
    }

    // Calculate the new cumulative top-up amount
    const newTopupAmount = latestPayment.topupAmount - parsedDeductionAmount;
    if (newTopupAmount < 0) {
      return res.status(400).json({ error: 'Insufficient top-up amount' });
    }

    // Create a new payment record with the deduction
    const newPayment = new Payment({
      franchisee: franchiseeId,
      topupAmount: newTopupAmount,
      topupAdded: -parsedDeductionAmount, // Record deduction as negative
      chargePerApply: latestPayment.chargePerApply,
      remarks: req.body.remarks || 'Certificate request deduction',
    });
    await newPayment.save();

    res.json({ message: 'Deduction successful', topupAmount: newTopupAmount });
  } catch (err) {
    console.error('Error deducting top-up:', err);
    res.status(500).json({ error: 'Server error while deducting top-up' });
  }
});

module.exports = router;