import express from 'express';
import { postController, getPosts } from '../controllers/postController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
    '/',
    postController.uploadMiddleware, // Multer-Middleware
    authenticate, // Auth-Middleware
    postController.createPost // Controller-Funktion
);

// Restliche Routes...
router.get('/', getPosts)
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;