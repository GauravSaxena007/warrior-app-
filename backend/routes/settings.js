const express = require("express");
const router = express.Router();
const Settings = require("../models/settings");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET settings
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    console.log("Settings fetched:", settings); // Debug log
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Error fetching settings" });
  }
});

// POST settings (update)
router.post("/", upload.fields([{ name: "photo" }, { name: "footerLogo" }]), async (req, res) => {
  try {
    const data = {
      franchiseNumber: req.body.franchiseNumber,
      welcomeTitle: req.body.welcomeTitle,
      welcomeText: req.body.welcomeText,
      email: req.body.email,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      socialLinks: JSON.parse(req.body.socialLinks),
    };
    if (req.files.photo) {
      data.photo = req.files.photo[0].path.replace(/\\/g, "/"); // Normalize path for cross-platform
      console.log("Photo uploaded to:", data.photo); // Debug log
    }
    if (req.files.footerLogo) {
      data.footerLogo = req.files.footerLogo[0].path.replace(/\\/g, "/"); // Normalize path for cross-platform
      console.log("Footer logo uploaded to:", data.footerLogo); // Debug log
    }

    let settings = await Settings.findOne();
    if (settings) {
      await Settings.updateOne({}, data);
    } else {
      settings = await Settings.create(data);
    }
    console.log("Settings updated:", data); // Debug log
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Error updating settings" });
  }
});

module.exports = router;