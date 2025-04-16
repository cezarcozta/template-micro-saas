import { auth } from "@/app/lib/auth";
import stripe from "@/app/lib/strtipe";
import { getOrCreateCustomer } from "@/app/server/stripe/getOrCreateCustomer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userEmail = body.email;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 })
  }

  const metadata = {
    testId: body.testId,
    price,
    userId
  }

  const customerId = await getOrCreateCustomer(userId, userEmail);

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
      customer: customerId,
      metadata
    });
    if (!session.url) {
      return NextResponse.json({ sessionId: session.id }, { status: 500 })
    }
    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (err) {
    console.error(err as Error)
    return NextResponse.error();
  }
}