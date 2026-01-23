// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const Franchisee = require('../models/Franchisee'); // Adjust path accordingly

// admin user 
const adminUser = {
  email: 'admin@login.com',
  password: '1234567', // plain password
  role: 'admin',
};

// POST /api/auth/adminlogin (Admin Login)
router.post('/adminlogin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email !== adminUser.email || password !== adminUser.password) {
  return res.status(400).json({ message: 'Invalid email or password yr' });
}


  const token = jwt.sign(
    { email: adminUser.email, role: adminUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: {
      email: adminUser.email,
      role: adminUser.role,
    }
  });
});

// POST /api/auth/login (Franchisee Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Franchisee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Franchisee not found' });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const today = new Date();
    if (user.renewalDate && today > new Date(user.renewalDate)) {
      return res.status(403).json({ message: 'Renewal date expired. Please contact admin.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'franchisee' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: 'franchisee',
        centerName: user.centerName,
        centerHead: user.centerHead,
        renewalDate: user.renewalDate
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// POST /api/auth/validate (Token Validation)
router.get('/validate', authMiddleware, (req, res) => {
  res.json({ message: 'Token is valid' });
});


// Protected Route Example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

module.exports = router;
