const express = require('express');
const router = express.Router();
const CertificateRequest = require('../models/CertificateRequest');

// POST /api/certificateRequests
router.post('/', async (req, res) => {
  try {
    const { students } = req.body;

    // Debug log to inspect received students data
    console.log('Received students for certificate request:', JSON.stringify(students, null, 2));

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }

    const createdRequests = [];

    for (const student of students) {
      const studentId = student._id;

      if (!studentId) continue;

      const exists = await CertificateRequest.findOne({ studentId });
      if (exists) continue;

      const newRequest = new CertificateRequest({
        studentId,
        certificateNumber: "",
        file: "",
        status: "Pending",
        franchiseeHead: student.franchiseeHead || "Unknown" // Add franchiseeHead from student data
      });

      await newRequest.save();
      createdRequests.push(newRequest);
    }

    if (createdRequests.length === 0) {
      return res.status(200).json({ message: "All selected students already have pending requests" });
    }

    // Debug log to inspect created requests
    console.log('Created certificate requests:', JSON.stringify(createdRequests, null, 2));

    res.status(201).json({ message: "Certificate requests submitted", created: createdRequests });

  } catch (error) {
    console.error("Certificate request error:", error);
    res.status(500).json({ message: "Server error while requesting certificates" });
  }
});

// Optional: same logic under `/request` if needed separately
router.post('/request', async (req, res) => {
  try {
    const { students } = req.body;

    // Debug log to inspect received students data
    console.log('Received students for /request:', JSON.stringify(students, null, 2));

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }

    const createdRequests = [];

    for (const student of students) {
      const studentId = student._id;

      if (!studentId) continue;

      const exists = await CertificateRequest.findOne({ studentId });
      if (exists) continue;

      const newRequest = new CertificateRequest({
        studentId,
        certificateNumber: "",
        file: "",
        status: "Pending",
        franchiseeHead: student.franchiseeHead || "Unknown" // Add franchiseeHead from student data
      });

      await newRequest.save();
      createdRequests.push(newRequest);
    }

    if (createdRequests.length === 0) {
      return res.status(200).json({ message: "All selected students already have pending requests" });
    }

    // Debug log to inspect created requests
    console.log('Created certificate requests (/request):', JSON.stringify(createdRequests, null, 2));

    res.status(201).json({ message: "Certificate requests submitted", created: createdRequests });

  } catch (error) {
    console.error("Certificate request error:", error);
    res.status(500).json({ message: "Server error while requesting certificates" });
  }
});

// GET /api/certificateRequests
router.get('/', async (req, res) => {
  try {
    const requests = await CertificateRequest.find().populate("studentId");
    // Debug log to inspect fetched requests
    console.log('Fetched certificate requests:', JSON.stringify(requests, null, 2));
    res.json(requests);
  } catch (err) {
    console.error('Error fetching certificate requests:', err);
    res.status(500).json({ message: "Error fetching certificate requests" });
  }
});







module.exports = router;