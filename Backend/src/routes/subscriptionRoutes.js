import express from 'express';
import { checkSubscriptionStatus, cancelSubscription } from '../controllers/subscriptionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/status/:creatorId', authenticate, checkSubscriptionStatus);
router.delete('/cancel/:subscriptionId', authenticate, cancelSubscription);

export default router;
