import express from 'express';
import { createAbonnement } from '../controllers/abonnementController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createAbonnement);

export default router;
