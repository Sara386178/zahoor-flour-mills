const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');

// ─── Helper Functions ───────────────────────────────────────────────
const normalizeEmail = (email) => email.toLowerCase().trim();

const sanitizeUser = (user) => {
  const safe = user.toJSON();
  delete safe.password;
  return safe;
};

const validateRequiredFields = (fields, requiredKeys) => {
  return requiredKeys.filter(key => !fields[key]);
};

// ─── Register New User ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    const missingFields = validateRequiredFields(req.body, ['name', 'email', 'password']);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizeEmail(email) });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: normalizeEmail(email),
      phone: phone || undefined,
      password: hashedPassword,
    });

    return res.status(201).json(sanitizeUser(newUser));

  } catch (error) {
    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─── Login User ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user and verify password
    const user = await User.findOne({ 
      email: normalizeEmail(email) 
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json(sanitizeUser(user));

  } catch (error) {
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ─── Get All Users (Admin Only) ──────────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('-password'); // Never return passwords
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// ─── Update User (Admin Only) ────────────────────────────────────────
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, phone, role, password } = req.body;
    const updates = {};

    // Only update fields that are provided
    if (name != null)  updates.name  = String(name).trim();
    if (phone !== undefined) updates.phone = phone ? String(phone).trim() : '';
    if (role != null)  updates.role  = String(role).trim().toLowerCase();
    if (password)      updates.password = await bcrypt.hash(String(password), 10);

    // Check if there is anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(sanitizeUser(updatedUser));

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ─── Delete User (Admin Only) ────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ 
      message: 'User deleted successfully',
      deletedUserId: req.params.id 
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;