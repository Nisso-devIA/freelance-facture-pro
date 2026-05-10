import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const plan = searchParams.get('plan') || 'monthly'

  const priceId = plan === 'yearly' 
    ? process.env.STRIPE_PRICE_YEARLY 
    : process.env.STRIPE_PRICE_MONTHLY

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  })

  return NextResponse.redirect(session.url!)
}