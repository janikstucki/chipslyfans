import express from 'express';
import { toggleLike, addComment, getUserInteractions, markInteractionAsRead,addPostVisit } from '../controllers/interactionController.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my', authenticate, getUserInteractions);
router.patch('/:id', authenticate, markInteractionAsRead);

router.post('/like/:id', authenticate, toggleLike);
router.post('/comment', authenticate, addComment);

router.post('/post-visit', authenticate, addPostVisit);

// router.post('/comment', commentPost);
// router.post('/subscribe', subscribe);
// router.post('/share', sharePost);

// router.post('/unsubscribe', unsubscribe);
// router.post('/deleteComment', deleteComment);
// router.post('/disLike', deleteLike);

export default router;
