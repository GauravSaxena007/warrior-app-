const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Franchisee = require("../models/Franchisee");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ✅ CREATE franchisee
router.post("/", upload.fields([{ name: "photo" }, { name: "certificate" }]), async (req, res) => {
  try {
    const franchisee = new Franchisee({
      ...req.body,
    });

    if (req.files?.photo?.[0]) {
      franchisee.photo = req.files.photo[0].filename;
    }
    if (req.files?.certificate?.[0]) {
      franchisee.certificate = req.files.certificate[0].filename;
    }

    const saved = await franchisee.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add franchisee" });
  }
});

// ✅ GET all franchisees (Admin Only)
router.get("/", async (req, res) => {
  try {
    const franchisees = await Franchisee.find();
    res.json(franchisees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch franchisees" });
  }
});

// ✅ GET a specific franchisee's profile (Authenticated user)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const franchisee = await Franchisee.findOne({ email: req.user.email });

    if (!franchisee) {
      return res.status(404).json({ message: "Franchisee not found" });
    }

    res.json(franchisee);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ✅ UPDATE franchisee
router.put("/:id", upload.fields([{ name: "photo" }, { name: "certificate" }]), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.files?.photo?.[0]) {
      updates.photo = req.files.photo[0].filename;
    }
    if (req.files?.certificate?.[0]) {
      updates.certificate = req.files.certificate[0].filename;
    }

    const updated = await Franchisee.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: "Franchisee not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update franchisee" });
  }
});

// ✅ DELETE franchisee
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Franchisee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Franchisee not found" });

    res.json({ message: "Franchisee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete franchisee" });
  }
});

// ✅ FINAL: GET total franchisee count
router.get('/count', async (req, res) => {
  try {
    const count = await Franchisee.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching franchisee count:', error);
    res.status(500).json({ message: 'Failed to fetch franchisee count' });
  }
});
router.post("/", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully!" });
  } catch (err) {
    console.error("Error saving enquiry:", err);
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
});

// GET - Fetch all enquiries (for admin panel)
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});
module.exports = router;
