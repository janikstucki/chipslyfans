import express from 'express';
import { toggleLike } from '../controllers/interactionController.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/like/:id', authenticate, toggleLike);
// router.post('/comment', commentPost);
// router.post('/subscribe', subscribe);
// router.post('/share', sharePost);

// router.post('/unsubscribe', unsubscribe);
// router.post('/deleteComment', deleteComment);
// router.post('/disLike', deleteLike);

export default router;
