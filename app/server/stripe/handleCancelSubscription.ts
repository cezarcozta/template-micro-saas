import { db } from '@/app/lib/firebase';
import 'server-only';
import Stripe from 'stripe';

export async function handleStripeOneTimePayment(event: Stripe.CustomerSubscriptionDeletedEvent) {

  console.log(`${event} cancelou assinatura`)

  const customerId = event.data.object.customer;

  if (!customerId) {
    return;
  }

  const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get();

  if (userRef.empty) {
    return;
  }

  const userId = userRef.docs[0].id;

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive"
  })
}