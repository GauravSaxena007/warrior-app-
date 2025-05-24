const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  maxMarks: { type: String, required: true, trim: true },
  passingMarks: { type: String, required: true, trim: true },
});

const semesterSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjects: [subjectSchema],
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: [String], required: true },
  duration: { type: String, required: true },
  category: { type: String }, 
  code: { type: String, required: true },
  semester: { type: String, required: true },
  semesters: [semesterSchema], // Added to support semesters and subjects
});

module.exports = mongoose.model("Course", courseSchema);