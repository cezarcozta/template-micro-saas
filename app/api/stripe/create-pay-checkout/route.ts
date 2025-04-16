import stripe from "@/app/lib/strtipe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userEmail = body.email;

  const price = process.env.STRIPE_ONETIME_PRICE_ID;

  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 })
  }

  const metadata = {
    testId: body.testId
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      mode: "payment",
      payment_method_types: ["card", "boleto"],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
      ...(userEmail && { customer_email: userEmail }),
      metadata
    });
    if (!session.url) {
      return NextResponse.json({ sessionId: session.id }, { status: 500 })
    }
    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.error();
  }
}