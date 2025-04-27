const express = require('express');
const router = express.Router();
const Marquee = require('../models/marqueeModel');

// Get marquee settings
router.get('/', async (req, res) => {
  try {
    console.log('Fetching marquee settings...');
    let marquee = await Marquee.findOne();
    if (!marquee) {
      console.log('No marquee settings found, creating default...');
      marquee = await Marquee.create({});
    }
    res.json(marquee);
  } catch (error) {
    console.error('Error in GET /api/marquee:', error.message);
    res.status(500).json({ message: 'Error fetching marquee settings', error: error.message });
  }
});

// Update marquee settings
router.put('/', async (req, res) => {
  try {
    console.log('Updating marquee settings with:', req.body);
    const { texts, backgroundColor, font, showMarquee } = req.body;
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ message: 'Texts must be an array' });
    }
    let marquee = await Marquee.findOne();
    if (!marquee) {
      console.log('No marquee settings found, creating new...');
      marquee = await Marquee.create({ texts, backgroundColor, font, showMarquee });
    } else {
      marquee.texts = texts;
      marquee.backgroundColor = backgroundColor;
      marquee.font = font;
      marquee.showMarquee = showMarquee;
      await marquee.save();
    }
    res.json(marquee);
  } catch (error) {
    console.error('Error in PUT /api/marquee:', error.message);
    res.status(500).json({ message: 'Error updating marquee settings', error: error.message });
  }
});

module.exports = router;