import { Comment, Post, UserTagInterest } from '../models/index.js';
export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']],
      include: [{ association: 'author', attributes: ['username', 'profilepicture'] }]
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Kommentare konnten nicht geladen werden." });
  }
};

export const deleteComment = async (req, res) => {
  try { 
    const comment = await Comment.findByPk(req.params.id);

    if (!comment || comment.authorId !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt" });
    }

    await comment.destroy();
    res.json({ message: "Kommentar gelöscht" });
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Löschen des Kommentars." });
  }
};
