import { db } from '@/app/lib/firebase';
import stripe from '@/app/lib/strtipe';
import 'server-only';

export async function getOrCreateCustomer(userId: string, userEmail: string) {
  try {
    const userRef = db.collection('users').doc(userId);
    const user = await userRef.get();
    if (!user.exists) {
      throw new Error('User Not Found')
    }
    const stripeCustomerId = user.data()?.strtipeCustomerId;

    if (stripeCustomerId) return stripeCustomerId;

    const userName = user.data()?.name;

    const stripeCustomer = await stripe.customers.create({
      email: userEmail,
      ...(userName && { name: userName }),
      metadata: {
        userId,
      },
    })

    await userRef.update({
      stripeCustomerId: stripeCustomer.id
    })

    return stripeCustomer.id;
  } catch (err) {
    console.error(err);
    throw new Error('Internal Server Error')
  }

}