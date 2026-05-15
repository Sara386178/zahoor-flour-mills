const jwt = require('jsonwebtoken');

/** Only used when NODE_ENV is not production and JWT_SECRET is missing or too short. */
const DEV_JWT_FALLBACK = 'zfm-local-dev-jwt-secret-min-16';

let devJwtWarned = false;

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (s && String(s).length >= 16) {
    return s;
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!devJwtWarned) {
      devJwtWarned = true;
      console.warn(
        '[auth] JWT_SECRET missing or under 16 chars — using a dev-only default. Set JWT_SECRET in backend/.env for production-like behavior.'
      );
    }
    return DEV_JWT_FALLBACK;
  }
  return null;
}

/**
 * Sign a short-lived admin JWT. Payload must stay small; no secrets in payload.
 */
function signAdminToken(userId) {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error('JWT_SECRET is not set or too short (use at least 16 characters).');
  }
  return jwt.sign({ role: 'admin' }, secret, {
    subject: String(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function requireAdmin(req, res, next) {
  const secret = getJwtSecret();
  if (!secret) {
    return res.status(503).json({
      message:
        'Admin API is disabled until JWT_SECRET is set in backend/.env (minimum 16 characters).',
    });
  }

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header (Bearer token required).' });
  }

  try {
    const payload = jwt.verify(match[1], secret);
    if (String(payload.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    req.admin = { userId: payload.sub };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin token. Please sign in again.' });
  }
}

module.exports = { signAdminToken, requireAdmin, getJwtSecret };
