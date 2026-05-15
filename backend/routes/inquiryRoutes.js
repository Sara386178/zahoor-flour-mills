const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { requireAdmin } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
