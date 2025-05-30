import express from 'express';
import { createAbonnement, getAbonnementDashboard } from '../controllers/abonnementController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createAbonnement);
router.get('/:creatorId', authenticate, getAbonnementDashboard);

export default router;
