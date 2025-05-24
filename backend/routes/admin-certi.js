const express = require('express');
const router = express.Router();
const AdminCerti = require('../models/admin-certi');
const CertificateRequest = require('../models/CertificateRequest');
const Student = require('../models/Student'); // Add this line to import the Student model
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/certificates/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 75 * 1024 * 1024 }, // 5MB limit
});

// Get all certificate requests
router.get('/certificateRequests', async (req, res) => {
  try {
    const requests = await CertificateRequest.find().populate('studentId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching certificate requests', error: err.message });
  }
});

// Issue a certificate
router.put(
  '/certificateRequests/:id',
  upload.fields([
    { name: 'file', maxCount: 1 },       // certificate
    { name: 'marksheet', maxCount: 1 },  // marksheet
  ]),
  async (req, res) => {
    try {
      const { certificateNumber, studentId } = req.body;

      const certificateFilePath = req.files?.file?.[0]?.path || null;
      const marksheetFilePath = req.files?.marksheet?.[0]?.path || null;

      if (!certificateNumber || !certificateFilePath || !marksheetFilePath || !studentId) {
        return res.status(400).json({
          message:
            'Certificate number, certificate file, marksheet file, and student ID are required',
        });
      }

      // Find and update certificate request status to issued
      const updatedRequest = await CertificateRequest.findByIdAndUpdate(
        req.params.id,
        { status: 'issued' },
        { new: true }
      ).populate('studentId');

      if (!updatedRequest) {
        return res.status(404).json({ message: 'Certificate request not found' });
      }

      if (!updatedRequest.studentId?.course) {
        return res.status(400).json({ message: 'Student course not found' });
      }

      // Create new certificate record
      const certificate = new AdminCerti({
        studentId,
        certificateNumber,
        filePath: certificateFilePath,
        marksheetPath: marksheetFilePath,
        course: updatedRequest.studentId.course,
      });

      await certificate.save();

      // Update student's certificateStatus to 'Issued'
      await Student.findByIdAndUpdate(studentId, { certificateStatus: 'Issued' });

      res.json({ message: 'Certificate issued successfully', certificate });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate certificate number' });
      }
      res.status(500).json({ message: 'Error issuing certificate', error: err.message });
    }
  }
);


// Get all issued certificates
router.get('/issuedCertificates', async (req, res) => {
  try {
    const certificates = await AdminCerti.find().populate('studentId');
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching issued certificates', error: err.message });
  }
});

// Delete a certificate request
router.delete('/certificateRequests/:id', async (req, res) => {
  try {
    const deletedRequest = await CertificateRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Certificate request not found' });
    }
    res.json({ message: 'Certificate request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting certificate request', error: err.message });
  }
});

// POST route to issue a certificate (added from previous code)
router.post('/admin-certi/issuedCertificates', async (req, res) => {
  try {
    const { studentId, certificateNumber, course, filePath } = req.body;

    // Validate request body
    if (!studentId || !certificateNumber || !course || !filePath) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create the issued certificate record
    const certificate = new AdminCerti({
      studentId,
      certificateNumber,
      course,
      filePath,
    });
    await certificate.save();

    // Update the student's certificateStatus to "Issued"
    await Student.findByIdAndUpdate(studentId, {
      certificateStatus: 'Issued',
    });

    res.status(201).json({ message: 'Certificate issued successfully' });
  } catch (err) {
    console.error('Error issuing certificate:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch issued certificates (added from previous code)
router.get('/admin-certi/issuedCertificates', async (req, res) => {
  try {
    const certificates = await AdminCerti.find().populate('studentId');
    res.json(certificates);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/status/issued', async (req, res) => {
  const count = await CertificateRequest.countDocuments({ status: 'issued' });
  res.json({ count });
});


// Route to get count of issued certificates
router.get('/status/issued', async (req, res) => {
  try {
    const count = await CertificateRequest.countDocuments({ status: 'Issued' });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching issued certificates count:', error);
    res.status(500).json({ message: 'Failed to fetch issued certificates count' });
  }
});
router.get('/status/pending', async (req, res) => {
  try {
    const requests = await CertificateRequest.find({ status: 'Pending' });
    const count = requests.length;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending certificates count' });
  }
});
// GET route to fetch a certificate by certificate number
router.get('/certificate/:certificateNumber', async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    // Validate certificateNumber
    if (!certificateNumber) {
      return res.status(400).json({ message: 'Certificate number is required' });
    }

    // Query the certificate
    const certificate = await AdminCerti.findOne({ certificateNumber })
      .populate('studentId')
      .exec();

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (err) {
    console.error('Error fetching certificate:', {
      message: err.message,
      stack: err.stack,
      certificateNumber: req.params.certificateNumber,
    });

    // Handle specific Mongoose errors
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid certificate number format' });
    }

    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;