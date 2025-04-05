import { Router } from "express";
import { login, register, success,protectedRoute } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login', login);
router.get('/auto', authMiddleware, success, register);
router.get('/protected', protectedRoute);

export default router;