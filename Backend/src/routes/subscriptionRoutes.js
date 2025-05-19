import express from 'express';
import { checkSubscriptionStatus } from '../controllers/subscriptionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/status/:creatorId', authenticate, checkSubscriptionStatus);

export default router;
