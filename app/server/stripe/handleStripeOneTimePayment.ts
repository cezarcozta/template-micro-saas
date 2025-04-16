import { db } from '@/app/lib/firebase';
import 'server-only';
import Stripe from 'stripe';

export async function handleStripeOneTimePayment(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    console.log('pagamento realizado. enviar email boas vindas e liberar o acesso')
    const metadata = event.data.object.metadata

    const userId = metadata?.userId

    if (!userId) {
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeCustomerId: event.data.object.customer,
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active"
    })
  }
}