import express from 'express';
import { likePost, commentPost, sharePost, subscribe, unsubscribe, deleteComment, deleteLike, getInteractions } from '../controllers/interactionController.js';

const router = express.Router();

router.post('/like', likePost);
router.post('/comment', commentPost);
router.post('/subscribe', subscribe);
router.post('/share', sharePost);

router.post('/unsubscribe', unsubscribe);
router.post('/deleteComment', deleteComment);
router.post('/disLike', deleteLike);

export default router;
