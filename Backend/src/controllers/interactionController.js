import { Op } from 'sequelize';
import { updateUserTagInterests } from "../utils/tagUtils.js";
import { Comment } from '../models/Comment.js';
import { Post, User, Interaction } from '../models/index.js';

import { UserTagInterest } from '../models/userTagInterests.js';




export const getUserInteractions = async (req, res) => {
  try {
    const userId = req.user.id;

    const interactions = await Interaction.findAll({
      where: { userId },
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['title']
        },
        {
          model: User,
          as: 'user', // oder 'author', je nachdem wie es heißt in deiner Relation
          attributes: ['id', 'username', 'profilepicture']
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(interactions);
  } catch (err) {
    console.error('❌ Fehler beim Laden der Interaktionen:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Interaktionen' });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = { ...post.likes };
    const likedBy = likes.likedBy || [];
    const alreadyLiked = likedBy.includes(userId);

    const tags = post.tags?.slice(0, 3) || [];

    if (alreadyLiked) {
      // ➖ Unlike
      likes.likedBy = likedBy.filter(id => id !== userId);
      likes.likeCount = Math.max(0, (likes.likeCount || 0) - 1);

      await Interaction.destroy({
        where: { userId, postId, type: 'like' }
      });

    } else {
      // ➕ Like
      likes.likedBy = [...likedBy, userId];
      likes.likeCount = (likes.likeCount || 0) + 1;

      await Interaction.findOrCreate({
        where: { userId, postId, type: 'like' },
        defaults: { tags }
      });
    }

    post.likes = likes;
    await post.save();

    await updateUserTagInterests(userId, tags);

    return res.status(200).json({ success: true, likes: post.likes });

  } catch (error) {
    console.error('[toggleLike] Fehler:', error);
    return res.status(500).json({ message: 'Fehler beim Liken des Posts' });
  }
};



export const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user?.id;

    console.log("📩 addComment: ", { postId, text, userId });

    if (!userId) {
      return res.status(401).json({ error: "Nicht authentifiziert" });
    }

    const post = await Post.findByPk(postId);
    const tags = post?.tags?.slice?.(0, 3) || [];

    const comment = await Comment.create({
      authorId: userId,
      postId,
      text,
    });

    await Interaction.create({
      userId,
      postId,
      type: 'comment',
      tags
    });

    await updateUserTagInterests(userId, tags);

    res.status(201).json(comment);
  } catch (err) {
    console.error("❌ Fehler bei addComment:", err);
    res.status(500).json({ error: "Kommentar konnte nicht erstellt werden." });
  }
};

