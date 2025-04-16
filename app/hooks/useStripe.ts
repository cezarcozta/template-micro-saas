import { useEffect, useState } from "react";
import { loadStripe, Stripe } from '@stripe/stripe-js';

export function useStripe() {
  const [stripeState, setStripeState] = useState<Stripe | null>(null);

  useEffect(() => {
    async function initStripe() {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!);
      setStripeState(stripeInstance);
    }

    initStripe()
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createStripeCheckout(checkoutData: any) {
    if (!stripeState) return;

    try {
      const response = await fetch('/api/stripe/create-pay-checkout', { method: 'POST', body: JSON.stringify(checkoutData) });

      if (!response.ok) return;

      const data = await response.json();

      await stripeState.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      const error = err as Error;
      console.error(error.message)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createSubscriptionCheckout(checkoutData: any) {
    if (!stripeState) return;

    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', { method: 'POST', body: JSON.stringify(checkoutData) });

      if (!response.ok) return;

      const data = await response.json();

      await stripeState.redirectToCheckout({ sessionId: data.sessionId });

      return data;
    } catch (err) {
      const error = err as Error;
      console.error(error.message)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createStripePortal(checkoutData: any) {
    if (!stripeState) return;

    try {
      const response = await fetch('/api/stripe/create-portal', { method: 'POST', body: JSON.stringify(checkoutData), headers: { "Content-Type": "application/json" } });

      if (!response.ok) return;

      const data = await response.json();

      window.location.href = data.url;
    } catch (err) {
      const error = err as Error;
      console.error(error.message)
    }
  }

  return { createStripeCheckout, createSubscriptionCheckout, createStripePortal }
}