import { loadStripe } from '@stripe/stripe-js';

export function normalizePublishableKey(raw) {
  const s = String(raw || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
  if ((s.startsWith('pk_test_') || s.startsWith('pk_live_')) && s.length > 12) {
    return s;
  }
  return null;
}

let cachedKey = null;
let cachedPromise = null;

/** Returns a Promise from @stripe/stripe-js, or null if key is missing/invalid. */
export function getStripePromise(publishableKey) {
  const k = normalizePublishableKey(publishableKey);
  if (!k) {
    return null;
  }
  if (cachedKey === k && cachedPromise) {
    return cachedPromise;
  }
  cachedKey = k;
  cachedPromise = loadStripe(k);
  return cachedPromise;
}
