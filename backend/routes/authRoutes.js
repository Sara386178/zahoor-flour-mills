const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAdminToken, getJwtSecret } = require('../middleware/auth');

const router = express.Router();

/**
 * Admin login: must be a User in MongoDB with role "admin".
 * Create the first admin with: npm run seed (creates admin@zahoorflourmills.local)
 * or promote a user in Compass (set role to "admin").
 */
router.post('/admin/login', async (req, res) => {
  try {
    if (!getJwtSecret()) {
      return res.status(503).json({
        message:
          'Server is not configured for admin login. Set JWT_SECRET in backend/.env (min 16 characters) and restart.',
      });
    }

    const { email, password } = req.body;
    const emailNorm = String(email || '').toLowerCase().trim();
    const passNorm = String(password || '').trim();
    if (!emailNorm || !passNorm) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: emailNorm }).select('+password');
    const isAdminRole = String(user?.role || '').toLowerCase() === 'admin';
    if (!user || !isAdminRole) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.password || typeof user.password !== 'string') {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(passNorm, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signAdminToken(user._id);
    const safe = user.toJSON();
    delete safe.password;
    res.json({ token, user: safe });
  } catch (error) {
    console.error('admin login:', error.message);
    res.status(500).json({ message: error.message || 'Login failed.' });
  }
});

module.exports = router;
