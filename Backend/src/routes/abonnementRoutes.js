import express from 'express';
import { createAbonnement, getAbonnementDashboard, updateFutureCost } from '../controllers/abonnementController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createAbonnement);
router.get('/:creatorId', authenticate, getAbonnementDashboard);
router.patch('/:id/future-cost', updateFutureCost);

export default router;
