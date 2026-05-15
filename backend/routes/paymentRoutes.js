const express = require('express');
const router = express.Router();

function normalizePublishableKey(raw) {
  const s = String(raw || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
  if ((s.startsWith('pk_test_') || s.startsWith('pk_live_')) && s.length > 12) {
    return s;
  }
  return null;
}

/**
 * Public publishable key for the browser (safe to expose).
 * Only returned when both secret + publishable keys are set so PaymentIntent flow can work.
 */
router.get('/public-config', (_req, res) => {
  const secretOk = Boolean(String(process.env.STRIPE_SECRET_KEY || '').trim());
  const pk = normalizePublishableKey(process.env.STRIPE_PUBLISHABLE_KEY);
  if (!secretOk || !pk) {
    return res.json({ publishableKey: null });
  }
  res.json({ publishableKey: pk });
});

let stripeClient = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    // eslint-disable-next-line global-require
    const Stripe = require('stripe');
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

/**
 * Create a PaymentIntent for card checkout.
 * amount: integer in smallest currency unit (PKR uses 2 decimals → multiply rupees by 100).
 */
router.post('/create-payment-intent', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({
      message: 'Card payment is not available.',
    });
  }

  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount < 100) {
      return res.status(400).json({
        message:
          'Invalid amount. Send total in smallest currency units (e.g. PKR 150.00 → 15000). Minimum 100.',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'pkr',
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({
      message: 'Card payment could not be completed. Please try again or use another payment method.',
    });
  }
});

/** Optional: confirm server-side (usually client confirms with Elements) */
router.get('/payment-intent/:id', async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: 'Card payment is not available.' });
  }
  try {
    const pi = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({ status: pi.status, amount: pi.amount, currency: pi.currency });
  } catch (error) {
    console.error('Stripe retrieve error:', error.message);
    res.status(500).json({ message: 'Could not load payment status.' });
  }
});

(function logStripeEnvHints() {
  const hasSk = Boolean(String(process.env.STRIPE_SECRET_KEY || '').trim());
  const hasPk = Boolean(normalizePublishableKey(process.env.STRIPE_PUBLISHABLE_KEY));
  if (hasSk && !hasPk) {
    console.warn(
      '[payments] STRIPE_SECRET_KEY is set but STRIPE_PUBLISHABLE_KEY is missing. Add STRIPE_PUBLISHABLE_KEY to backend/.env (Dashboard → Developers → API keys → Publishable key).'
    );
  }
  if (hasPk && !hasSk) {
    console.warn('[payments] STRIPE_PUBLISHABLE_KEY is set but STRIPE_SECRET_KEY is missing — PaymentIntents will not work.');
  }
})();

module.exports = router;
