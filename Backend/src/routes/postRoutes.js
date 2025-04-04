import {Router} from 'express';
import { getPosts, createPost, deletePost } from '../controllers/postController.js';


const router = Router();
// Define routes for posts

router.get('/', getPosts); // Get all posts

router.post('/', createPost); // Create a new post

// router.put('/:id', authenticate, validatePost, updatePost); // Update a post by ID

router.delete('/:id' , deletePost); // Delete a post by ID

export default router;