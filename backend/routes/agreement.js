const express = require('express');
const router = express.Router();
const Agreement = require('../models/agreement');

// Save or Update Agreement
router.post('/save', async (req, res) => {
  try {
    let agreement = await Agreement.findOne();
    if (agreement) {
      // update
      agreement.set(req.body);
      await agreement.save();
    } else {
      // create
      agreement = new Agreement(req.body);
      await agreement.save();
    }
    res.json({ message: 'Agreement saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while saving agreement.');
  }
});

// Fetch Agreement
router.get('/', async (req, res) => {
  try {
    const agreement = await Agreement.findOne();
    if (!agreement) {
      return res.status(404).json({ message: 'No agreement found' });
    }
    res.json(agreement);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fetching agreement.');
  }
});

module.exports = router;
