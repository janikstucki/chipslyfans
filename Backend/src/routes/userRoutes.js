import { Router } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { getUsers, createUser, deleteUser, getUserbyId, getGeneralSettings, patchGeneralSettings, getNotificationSettings, patchNotificationSettings} from '../controllers/userController.js';
import upload from "../middlewares/multer.js";
import { authenticate } from '../middlewares/authMiddleware.js';
import { Abonnement, Subscription } from '../models/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const router = Router();

router.get('/', getUsers); 

router.post('/', upload.single('profilepicture'), createUser);

router.delete('/:id', deleteUser);

router.get('/profile/:id',authenticate , getUserbyId);

router.post('/subscribe', authenticate, async (req, res) => {
    const { abonnementId } = req.body;
    const consumerId = req.user.id; // z.B. aus Middleware
  
    const abo = await Abonnement.findByPk(abonnementId);
    if (!abo || !abo.isActive) return res.status(404).json({ error: 'Abo nicht gefunden oder inaktiv' });
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'chf',
          product_data: {
            name: `Abo von ${abo.creatorId}`,
          },
          unit_amount: parseInt(abo.cost * 100), // Rappen
        },
        quantity: 1,
      }],
      metadata: {
        abonnementId,
        consumerId,
      },
      success_url: 'http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/payment-cancelled',
    });
  
    res.json({ url: session.url });
});

router.get('/payment-status/:sessionId', authenticate, async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      res.json({
        status: session.payment_status,
        amount: session.amount_total / 100
      });
    } catch (error) {
      console.error("❌ Stripe Session Fehler:", error.message);
      res.status(400).json({ error: "Ungültige Session" });
    }
  });


// Settings-Routen

router.get('/settings/:id/general', authenticate, getGeneralSettings);
router.patch('/settings/:id/general', authenticate, patchGeneralSettings);

router.get('/settings/:id/notifications', authenticate, getNotificationSettings);
router.patch('/settings/:id/notifications', authenticate, patchNotificationSettings);

export default router;