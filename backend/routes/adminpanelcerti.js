const express = require("express");
const multer = require("multer");
const path = require("path");
const AdminPanelCerti = require("../models/adminpanelcerti");

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to save the issued certificate
router.post("/", upload.single("file"), async (req, res) => {
  const { certificateNumber, studentId } = req.body;
  const file = req.file?.filename;

  if (!certificateNumber || !studentId || !file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCert = new AdminPanelCerti({
      certificateNumber,
      studentId,
      file,
    });

    await newCert.save();

    res.status(201).json(newCert);
  } catch (err) {
    console.error("Error saving certificate:", err);
    res.status(500).json({ message: "Failed to issue certificate" });
  }
});

// Route to fetch all issued certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await AdminPanelCerti.find().populate("studentId");
    res.json(certificates);
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
});

module.exports = router;
