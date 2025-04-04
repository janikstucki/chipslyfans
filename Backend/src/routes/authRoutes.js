import { Router } from "express";
import { login, register, success } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login', login);
router.get('/auto', authMiddleware, success, register);

export default router;