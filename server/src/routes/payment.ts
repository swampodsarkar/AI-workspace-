import { Router, Request, Response } from 'express'
import Stripe from 'stripe'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-11-20.acacia' })

router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      success_url: successUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/settings?success=true`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing?canceled=true`,
    })

    res.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Payment completed for user:', session.client_reference_id)
    // Update user subscription in database
  }

  res.json({ received: true })
})

router.post('/bkash', async (req: Request, res: Response) => {
  try {
    const { amount, userId, plan } = req.body
    // bKash payment processing logic
    // This would integrate with bKash Merchant API
    res.json({
      success: true,
      message: 'bKash payment initiated',
      transactionId: `BK-${Date.now()}`
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/nagad', async (req: Request, res: Response) => {
  try {
    const { amount, userId, plan } = req.body
    // Nagad payment processing logic
    res.json({
      success: true,
      message: 'Nagad payment initiated',
      transactionId: `NG-${Date.now()}`
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export { router as paymentRouter }
