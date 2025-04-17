import { Router } from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController.js';
import upload from "../middlewares/multer.js";

const router = Router();

router.get('/', getUsers); 

router.post('/', upload.single('profilepicture'), createUser);

router.delete('/:id', deleteUser);

export default router;