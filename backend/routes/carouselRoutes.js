const express = require('express');
const router = express.Router();
const Carousel = require('../models/carouselModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this for file deletion

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images only (jpeg, jpg, png)!');
  }
});

// Get all carousel images
router.get('/', async (req, res) => {
  try {
    const carousel = await Carousel.findOne();
    if (!carousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }
    res.json(carousel.images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new images
router.post('/', upload.array('images', 7), async (req, res) => {
  try {
    let carousel = await Carousel.findOne();
    if (!carousel) {
      carousel = new Carousel({ images: [] });
    }

    if (carousel.images.length + req.files.length > carousel.maxImages) {
      return res.status(400).json({ message: `Maximum ${carousel.maxImages} images allowed` });
    }

    if (req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded. Please upload an image.' });
    }

    const newImages = req.files.map(file => ({
      url: `/uploads/${file.filename}`
    }));

    carousel.images.push(...newImages);
    await carousel.save();
    res.status(201).json(carousel.images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete specific image
router.delete('/:index', async (req, res) => {
  try {
    const carousel = await Carousel.findOne();
    if (!carousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= carousel.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Delete the image file from the server
    const imagePath = path.join(__dirname, `../uploads/${carousel.images[index].url.split('/').pop()}`);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });

    carousel.images.splice(index, 1);
    await carousel.save();
    res.json(carousel.images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all images
router.delete('/', async (req, res) => {
  try {
    const carousel = await Carousel.findOne();
    if (!carousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }

    // Delete all image files from the server
    carousel.images.forEach((image) => {
      const imagePath = path.join(__dirname, `../uploads/${image.url.split('/').pop()}`);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    });

    carousel.images = [];
    await carousel.save();
    res.json({ message: 'All images deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
