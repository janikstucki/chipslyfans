import { Op } from 'sequelize';
import { updateUserTagInterests } from "../utils/tagUtils.js";
import { Comment } from '../models/Comment.js';
import { Post, User, Interaction } from '../models/index.js';

import { UserTagInterest } from '../models/userTagInterests.js';




export const getUserInteractions = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['settings']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const enabledNotifications = user.settings.notifications;

    const notificationTypeMap = {
      likes: 'like',
      comments: 'comment',
      subscriptions: 'subscription',
      messages: 'message',
      postVisit: 'post_visit',
      mentions: 'mention',
      loginAlerts: 'login_alert' 
    };

    const allowedTypes = Object.keys(enabledNotifications)
      .filter(key => enabledNotifications[key])
      .map(key => notificationTypeMap[key]);

    const interactions = await Interaction.findAll({
      where: {
        userId,
        type: allowedTypes
      },
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profilepicture']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(interactions);
  } catch (err) {
    console.error('❌ Fehler beim Laden der Interaktionen:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Interaktionen' });
  }
};


export const markInteractionAsRead = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const interaction = await Interaction.findOne({
      where: {
        id,
        userId
      }
    });

    if (!interaction) {
      return res.status(404).json({ error: 'Interaktion nicht gefunden' });
    }

    // Markiere als gelesen
    interaction.isRead = true;
    await interaction.save();

    return res.json({ success: true });
  } catch (err) {
    console.error('❌ Fehler beim Markieren als gelesen:', err);
    return res.status(500).json({ error: 'Fehler beim Aktualisieren der Benachrichtigung' });
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


export const addPostVisit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const tags = post.tags?.slice(0, 3) || []; 

    const [interaction, created] = await Interaction.findOrCreate({
      where: { userId, postId, type: 'post_visit' },
      defaults: { tags }
    });

    res.status(201).json({ success: true, created });
  } catch (err) {
    console.error("❌ Fehler bei addPostVisit:", err);
    res.status(500).json({ error: "Post-Visit konnte nicht gespeichert werden." });
  }
};


