const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ManualCerti = require('../models/ManualCerti');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/certificates'); // ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST: Add new manual certificate
router.post('/', upload.fields([
  { name: 'certificateFile', maxCount: 1 },
  { name: 'marksheetFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const certificateFile = req.files?.certificateFile?.[0];
    const marksheetFile = req.files?.marksheetFile?.[0];

    console.log("🧾 marksheetHTML:", req.body.marksheetHTML);
    console.log("🎯 obtainMarks:", req.body.obtainMarks);
    // Validate required fields
    if (
      !req.body.studentName ||
      !req.body.mobile ||
      !req.body.courseName ||
      !req.body.certificateNumber ||
      !req.body.marksheetHTML
    ) {
      return res.status(400).json({ error: 'Missing required fields including marksheetHTML' });
    }



    let parsedMarks = [];
    try {
      parsedMarks = JSON.parse(req.body.obtainMarks || '[]');
      if (!Array.isArray(parsedMarks)) {
        return res.status(400).json({ error: 'obtainMarks must be an array' });
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in obtainMarks', details: e.message });
    }

    const newCerti = new ManualCerti({
      studentName: req.body.studentName,
      mobile: req.body.mobile,
      courseName: req.body.courseName,
      certificateNumber: req.body.certificateNumber,
      obtainMarks: parsedMarks,
      marksheetHTML: req.body.marksheetHTML,
      certificateFile: certificateFile ? `Uploads/certificates/${certificateFile.filename}` : null,
      marksheetFile: marksheetFile ? `Uploads/certificates/${marksheetFile.filename}` : null,
    });

    const savedCerti = await newCerti.save();
res.setHeader('Content-Type', 'application/json');
const fullCerti = await ManualCerti.findById(savedCerti._id);


res.status(201).json({
  message: 'Manual certificate saved successfully',
  data: fullCerti
});



  } catch (error) {
    console.error('Error saving manual certificate:', error.stack || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Fetch all manual certificates
router.get('/', async (req, res) => {
  try {
    const certs = await ManualCerti.find();
    res.json(certs);
  } catch (err) {
    console.error('Error fetching manual certificates:', err);
    res.status(500).json({ error: 'Failed to fetch manual certificates' });
  }
});

module.exports = router;