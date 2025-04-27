const express = require('express');
const Courier = require('../models/Courier');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { courierName, courierNumber, courierDate, franchiseeHead } = req.body;
    if (!courierName || !courierNumber || !courierDate || !franchiseeHead) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newCourier = new Courier({
      courierName,
      courierNumber,
      courierDate: new Date(courierDate),
      franchiseeHead,
    });
    await newCourier.save();
    res.status(201).json(newCourier);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save courier: ' + err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const couriers = await Courier.find();
    res.json(couriers);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch couriers: ' + err.message });
  }
});

router.get('/getCouriers/:franchiseeHead', async (req, res) => {
  try {
    const franchiseeHead = req.params.franchiseeHead.toLowerCase();
    const couriers = await Courier.find({ franchiseeHead: { $regex: new RegExp(`^${franchiseeHead}$`, 'i') } });
    res.json(couriers);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch couriers: ' + err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const courier = await Courier.findByIdAndDelete(req.params.id);
    if (!courier) {
      return res.status(404).json({ error: 'Courier not found.' });
    }
    res.json({ message: 'Courier deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete courier: ' + err.message });
  }
});

module.exports = router;
