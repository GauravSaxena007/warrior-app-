const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const multer = require('multer');
const mongoose = require('mongoose');

// Multer setup - memory storage (change to diskStorage if you want to save files physically)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST new student
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      formNumber,
      email,
      mobile,
      address,
      obtainMarks,
      course,
      registrationDate,
      courseCompletionDate,
      courseAmount,
      franchiseeHead,
    } = req.body;

    console.log('Received franchiseeHead:', franchiseeHead);

    // Validate franchiseeHead: if valid ObjectId convert, else keep string
    let validatedFranchiseeHead = null;
    if (franchiseeHead) {
      if (mongoose.Types.ObjectId.isValid(franchiseeHead)) {
        validatedFranchiseeHead = mongoose.Types.ObjectId(franchiseeHead);
      } else {
        validatedFranchiseeHead = franchiseeHead; // keep string as is
      }
    }

    // Parse obtainMarks safely
    let parsedObtainMarks = [];
    if (obtainMarks) {
      try {
        parsedObtainMarks = JSON.parse(obtainMarks);
      } catch (err) {
        console.error("Failed to parse obtainMarks:", err);
        return res.status(400).json({ error: "Invalid obtainMarks format" });
      }
    }

    const student = new Student({
      name,
      formNumber,
      email,
      mobile,
      address,
      course,
      registrationDate: new Date(registrationDate),
      courseCompletionDate: new Date(courseCompletionDate),
      courseAmount,
      franchiseeHead, // string or original value
      franchiseeHeadRef: mongoose.Types.ObjectId.isValid(validatedFranchiseeHead) ? validatedFranchiseeHead : null,
      certificateStatus: "Pending",
      obtainMarks: parsedObtainMarks,
      // photo handling can be added here if needed (req.file)
    });

    await student.save();

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET all students with franchiseeHeadRef populated
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('franchiseeHeadRef', 'centerHead _id');
    console.log('Students sent:', JSON.stringify(students, null, 2));
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE student by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
});

module.exports = router;
