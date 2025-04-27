const express = require('express');
const multer = require('multer');
const path = require('path');
const IssuedCertificate = require('../models/IssuedCertificate');
const Student = require('../models/Student'); // Required to fetch student details

const router = express.Router();

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// PUT: Issue certificate
router.put('/:requestId', upload.single('file'), async (req, res) => {
  try {
    const { studentId, certificateNumber } = req.body;
    const file = req.file?.filename;

    if (!studentId || !certificateNumber || !file) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newCert = new IssuedCertificate({
      studentId,
      certificateNumber,
      file,
    });

    await newCert.save();

    res.status(200).json({ message: "Certificate issued successfully" });
  } catch (err) {
    console.error("Error issuing certificate:", err);
    res.status(500).json({ error: "Failed to issue certificate" });
  }
});

module.exports = router;
