import { Router } from "express";
import { getCommentsByPostId, deleteComment } from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();


// 📄 Kommentare zu einem Post abrufen
router.get("/post/:postId", getCommentsByPostId);

// ❌ Kommentar löschen
router.delete("/:id", authenticate, deleteComment);

export default router;
