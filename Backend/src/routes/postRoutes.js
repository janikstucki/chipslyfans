// postRoutes.js
import express from 'express';
import { postController, getPosts, createPost } from '../controllers/postController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post(
    '/',
    (req, res, next) => {
      upload.array('images')(req, res, (err) => {
        if (err) {
          console.error('Multer Error:', err);
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        next();
      });
    },
    authenticate,
    createPost
);

// Restliche Routes...
router.get('/', getPosts)
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;