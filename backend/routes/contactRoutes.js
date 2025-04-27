const express = require("express");
const router = express.Router();
const { Contact, Submission } = require("../models/Contact");

router.get("/info", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({
        phone: "9422123456 | 07122072727",
        email: "rcsasedu@gmail.com",
        address: "393-A, Indraprastha, Hanuman Nagar, Nagpur - 440009. (Maharashtra)",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.161300152155!2d79.07514377526286!3d21.146516180533007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31d9c1f%3A0x7a6d8c121ff636f9!2sHanuman%20Nagar%2C%20Nagpur%2C%20Maharashtra%20440009!5e0!3m2!1sen!2sin!4v1729761234567",
      });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/info", async (req, res) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/submissions", async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/submissions/:id", async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    res.json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/submissions/:id", async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    res.json({ message: "Submission deleted" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;