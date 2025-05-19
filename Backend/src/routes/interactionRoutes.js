import express from 'express';
import { interactionController } from '../controllers/interactionController.js';

const router = express.Router();

router.post('/like', interactionController.likePost);
router.post('/comment', interactionController.commentPost);
router.post('/subscribe', interactionController.subscribe);
router.post('/share', interactionController.sharePost);

router.post('/unsubscribe', interactionController.unsubscribe);
router.post('/deleteComment', interactionController.deleteComment);
router.post('/disLike', interactionController.deleteLike);

export default router;
