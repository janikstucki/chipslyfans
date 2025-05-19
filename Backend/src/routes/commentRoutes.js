import { Router } from "express";
import { createComment, getCommentsByPostId, deleteComment } from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

// 📝 Kommentar erstellen
router.post("/", authenticate, createComment);

// 📄 Kommentare zu einem Post abrufen
router.get("/post/:postId", getCommentsByPostId);

// ❌ Kommentar löschen
router.delete("/:id", authenticate, deleteComment);

export default router;
