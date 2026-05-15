/** Base URL for the Express API (no trailing slash). 
 * For mobile testing, set REACT_APP_API_URL in .env to your computer's IP (e.g., http://192.168.1.5:5000).
 */
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/** Stable string id for Mongo documents or legacy numeric ids. */
export function docId(doc) {
  if (doc == null) return undefined;
  if (doc._id != null) return String(doc._id);
  if (doc.id != null) return String(doc.id);
  return undefined;
}
