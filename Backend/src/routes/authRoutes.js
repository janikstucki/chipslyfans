import { Router } from "express";
import { login, register, success,protectedRoute, oauthcallback, logout} from "../controllers/authController.js";
import { authMiddleware, authenticate  } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/auto', authMiddleware, success, register);
router.get('/protected', protectedRoute);

router.get('/authenticate', authenticate, (req, res) => {
    res.json({
            user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

router.get('/oauth/callback', oauthcallback);

export default router;