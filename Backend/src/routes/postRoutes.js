// postRoutes.js
import express from 'express';
import { postController, getPosts, createPost, getPostById, likePost } from '../controllers/postController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/', upload.array('images'), authenticate, createPost)

// Restliche Routes...
router.get('/', getPosts)
router.get('/:id', getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.put('/:id/like', authenticate, likePost);


export default router;