const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const FraCertificate = require("../models/FraCertificate");

// Multer setup for uploading certificate images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ POST: Upload a certificate
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { franchisee } = req.body;

    if (!req.file || !franchisee) {
      return res.status(400).json({ error: "Franchisee and certificate photo are required" });
    }

    const newCert = new FraCertificate({
      franchisee,
      photo: req.file.filename,
    });

    const savedCert = await newCert.save();
    res.status(201).json(savedCert);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload certificate" });
  }
});

// ✅ GET: All certificates
router.get("/", async (req, res) => {
  try {
    const certs = await FraCertificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// ✅ DELETE: Delete a certificate by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await FraCertificate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Certificate not found" });

    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

module.exports = router;
