import { Router } from 'express';
import { getUsers, createUser, deleteUser, getUserbyId } from '../controllers/userController.js';
import upload from "../middlewares/multer.js";
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getUsers); 

router.post('/', upload.single('profilepicture'), createUser);

router.delete('/:id', deleteUser);

router.get('/profile/:id',authenticate , getUserbyId);

export default router;