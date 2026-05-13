import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-12-15.clover",
    });

    const body = await request.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Acceso Premium a los Snippets - De pago",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success?email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/`,
    });

    return NextResponse.json({ url: session.url }); 
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
