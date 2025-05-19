// src/middlewares/webhookRoutes.js
import express from 'express';
import Stripe from 'stripe';
import { Subscription, Payment } from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { abonnementId, consumerId } = session.metadata;

      const subscription = await Subscription.create({
        abonnementId,
        consumerId,
        isActive: true,
        subscribedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await Payment.create({
        userId: consumerId,
        subscriptionId: subscription.id,
        amount: session.amount_total / 100,
        paymentMethod: session.payment_method_types[0],
        paidAt: new Date(),
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Stripe Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
