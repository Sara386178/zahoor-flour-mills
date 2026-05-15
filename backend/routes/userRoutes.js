const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone || undefined,
      password: hashed,
    });
    const safe = user.toJSON();
    res.status(201).json(safe);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const safe = user.toJSON();
    delete safe.password;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, phone, role, password } = req.body;
    const updates = {};
    if (name != null) updates.name = String(name).trim();
    if (phone !== undefined) updates.phone = phone ? String(phone).trim() : '';
    if (role != null) updates.role = String(role).trim().toLowerCase();
    if (password) {
      updates.password = await bcrypt.hash(String(password), 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
