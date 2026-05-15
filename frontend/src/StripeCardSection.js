import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function InnerPay({ onPaid, onError, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) {
      onError('The payment form is still loading. Please wait a moment and try again.');
      return;
    }
    setBusy(true);
    onError('');
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message);
        setBusy(false);
        return;
      }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (error) {
        onError(error.message);
        setBusy(false);
        return;
      }
      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        onPaid(paymentIntent.id);
      } else {
        onError(
          paymentIntent
            ? 'Your payment could not be completed. Try another card or use Cash on Delivery.'
            : 'Payment could not be completed.'
        );
      }
    } catch (e) {
      onError(e.message || 'Payment failed');
    }
    setBusy(false);
  };

  return (
    <div style={{ marginTop: 16, padding: 16, border: '1px solid var(--gray-200)', borderRadius: 8, background: 'var(--white)' }}>
      <h4 style={{ marginBottom: 12, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Card details</h4>
      <PaymentElement />
      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: 18 }}
        disabled={disabled || busy || !stripe}
        onClick={handlePay}
      >
        {busy ? 'Processing…' : 'Pay with card & place order'}
      </button>
    </div>
  );
}

/**
 * Payment Element — parent must pass stripePromise from loadStripe(publishableKey).
 */
export function StripeCardSection({ stripePromise, clientSecret, onPaid, onError, disabled }) {
  if (!stripePromise || !clientSecret) {
    return null;
  }
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: 'flat' },
      }}
    >
      <InnerPay onPaid={onPaid} onError={onError} disabled={disabled} />
    </Elements>
  );
}
