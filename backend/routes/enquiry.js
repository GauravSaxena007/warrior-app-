const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

// POST enquiry
router.post("/", async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const saved = await newEnquiry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all enquiries
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE enquiry
router.delete("/:id", async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
