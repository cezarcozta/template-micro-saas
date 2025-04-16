import stripe from "@/app/lib/strtipe";
import { handleStripeOneTimePayment } from "@/app/server/stripe/handleStripeOneTimePayment";
import { handleStripeSubscriptionPayment } from "@/app/server/stripe/handleStripeSubscriptionPayment";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !secret) {
      return NextResponse.json({ error: 'No signature or secret' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);
    const eventType = event.type;

    switch (eventType) {
      case "checkout.session.completed":
        const metadata = event.data.object.metadata;

        if (metadata?.price === process.env.STRIPE_ONETIME_PRICE_ID) await handleStripeOneTimePayment(event);

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) await handleStripeSubscriptionPayment(event);
        break;
      case "checkout.session.expired":
        console.log('enviar um email avisando que o pagamento expirou')
        break;
      case "checkout.session.async_payment_succeeded":
        console.log('enviar um email avisando que o pagamento foi realizado')
        console.log('enviar um email avisando boas vindas e agradecimento')
        break;
      case "checkout.session.async_payment_failed":
        console.log('enviar um email avisando que o pagamento foi falhou')
        break;
      case "customer.subscription.created":
        console.log('enviar um email avisando boas vindas e agradecimento')
        break;
      case "customer.subscription.updated":
        console.log('enviar um email avisando do update e da proxima cobrança')
        break;
      case "customer.subscription.deleted":

        break;

      default:
        console.log(`Unhandled event: ${event}`)
        break;
    }
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.error();
  }

}

