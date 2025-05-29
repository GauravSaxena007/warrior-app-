const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err); // Added for debugging
    res.status(500).json({ message: err.message });
  }
});

// POST new course
router.post("/", async (req, res) => {
  try {
    const { title, details, duration, category, code, semester, semesters } = req.body;

    // Log incoming request body for debugging
    console.log("Received course data:", JSON.stringify(req.body, null, 2));

    // Explicit validation
    if (!title || !details || !duration || !code || !semester) {
      return res.status(400).json({ message: "Missing required fields: title, details, duration, code, or semester" });
    }

    // Validate semesters if provided
    if (semesters && semesters.length > 0) {
      for (const sem of semesters) {
        if (!sem.semester || !sem.subjects || sem.subjects.length === 0) {
          return res.status(400).json({ message: "Each semester must have a semester number and at least one valid subject" });
        }
        for (const subject of sem.subjects) {
          if (!subject.subject || !subject.maxMarks || !subject.passingMarks) {
            return res.status(400).json({ message: "Each subject must have subject, maxMarks, and passingMarks" });
          }
        }
      }
    }

    const newCourse = new Course({ title, details, duration, category, code, semester, semesters });
    const saved = await newCourse.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving course:", err); // Added for debugging
    res.status(400).json({ message: "Error saving course", error: err.message });
  }
});

// DELETE course by ID
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting course:", err); // Added for debugging
    res.status(500).json({ message: err.message });
  }
});

// GET single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error("Error fetching course by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;