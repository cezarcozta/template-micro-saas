"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Payments() {
  const stripe = useStripe();

  return (
    <main className="flex flex-col gap-15 items-center justify-center h-screen">
      <div className="text-4xl font-bold">Pagamentos</div>
      <button
        className="border rounded-md px-1"
        onClick={() =>
          stripe.createStripeCheckout({
            email: "cezarcozta@gmail.com",
            testId: "teste",
          })
        }
      >
        Criar Pagamento Stripe
      </button>
      <button
        className="border rounded-md px-1"
        onClick={() =>
          stripe.createSubscriptionCheckout({
            email: "cezarcozta@gmail.com",
            testId: "teste",
          })
        }
      >
        Criar Assinatura Stripe
      </button>
      <button
        className="border rounded-md px-1"
        onClick={() =>
          stripe.createStripePortal({
            email: "cezarcozta@gmail.com",
            testId: "teste",
          })
        }
      >
        Criar Portal Stripe
      </button>
    </main>
  );
}
