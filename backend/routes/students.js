const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const multer = require('multer');
const mongoose = require('mongoose'); // ✅ Needed for ObjectId validation

// Basic multer setup to store in memory or temp folder
const storage = multer.memoryStorage(); // or use diskStorage for local
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
      course,
      registrationDate,
      courseCompletionDate,
      courseAmount,
      franchiseeHead, // Added to accept franchiseeHead
    } = req.body;

    // Debug log to inspect received franchiseeHead
    console.log('Received franchiseeHead:', franchiseeHead);

    let validatedFranchiseeHead = null;
    if (franchiseeHead) {
      if (!mongoose.Types.ObjectId.isValid(franchiseeHead)) {
        // Modified: Accept string instead of rejecting as invalid ObjectId
        validatedFranchiseeHead = franchiseeHead; // Use string directly
      } else {
        validatedFranchiseeHead = mongoose.Types.ObjectId(franchiseeHead); // For backward compatibility
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
      franchiseeHead, // Include franchiseeHead as string
      franchiseeHeadRef: validatedFranchiseeHead && mongoose.Types.ObjectId.isValid(validatedFranchiseeHead) ? validatedFranchiseeHead : null, // Preserve ObjectId reference
      certificateStatus: "Pending",
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('franchiseeHeadRef', 'centerHead _id'); // Modified to populate franchiseeHeadRef
    // Debug log to inspect sent students
    console.log('Students sent:', JSON.stringify(students, null, 2));
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});


module.exports = router;