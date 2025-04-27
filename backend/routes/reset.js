const express = require('express');
const router = express.Router();
const models = require('../models/index'); // Import all models

// @route   DELETE /api/reset
// @desc    RESET: Deletes all documents from all collections
router.delete('/', async (req, res) => {
  try {
    const modelNames = Object.keys(models);
    console.log('Models being reset:', modelNames); // Debugging: log models being reset

    for (const name of modelNames) {
      console.log(`Deleting documents from ${name} collection...`); // Debugging: log each collection deletion
      await models[name].deleteMany({});
    }

    res.json({ message: '✅ RESET: All data has been cleared successfully.' });
  } catch (error) {
    console.error('❌ RESET ERROR:', error);
    res.status(500).json({ message: '❌ RESET: Failed to clear data.', error });
  }
});

module.exports = router;
