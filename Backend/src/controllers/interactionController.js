import { Interaction, User, Post } from "../models/index.js";
import { Op } from 'sequelize';

export async function likePost(req, res) {
  const { userId, postId } = req.body;

  try {
    const [interaction, created] = await Interaction.findOrCreate({
      where: { userId, postId, type: 'like' }
    });

    if (created) {
      const post = await Post.findByPk(postId);

      // Beispiel: Tags zählen oder mitschreiben in eine User-Interest-Tabelle
      const tags = post.tags?.slice(0, 3) || [];

      console.log(`Top Tags des Posts: ${tags.join(', ')}`);

      // Optional: Speichere Top Tags in einer neuen Tabelle UserTagInterest
      // await UserTagInterest.addOrIncrement(userId, tags)

      return res.status(201).json({ message: 'Post liked successfully', tags });
    } else {
      return res.status(200).json({ message: 'Post already liked' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error liking post' });
  }
}


export function commentPost(req, res) {
    const { userId, postId, comment } = req.body;
    
    Interaction.create({
        userId: userId,
        postId: postId,
        type: 'comment',
        content: comment
    })
    .then(() => {
    return res.status(201).json({ message: 'Comment added successfully' });
    })
    .catch(error => {
    console.error(error);
    return res.status(500).json({ message: 'Error adding comment' });
    });
}

export function sharePost(req, res) {
    const { userId, postId } = req.body;
    
    Interaction.create({
        userId: userId,
        postId: postId,
        type: 'share'
    })
    .then(() => {
    return res.status(201).json({ message: 'Post shared successfully' });
    })
    .catch(error => {
    console.error(error);
    return res.status(500).json({ message: 'Error sharing post' });
    });
}

export function subscribe(req, res) {
    const { userId, abonnementId } = req.body;
    
    Interaction.create({
        userId: userId,
        abonnementId: abonnementId,
        type: 'subscribe'
    })
    .then(() => {
    return res.status(201).json({ message: 'Subscribed successfully' });
    })
    .catch(error => {
    console.error(error);
    return res.status(500).json({ message: 'Error subscribing' });
    });
}

export function unsubscribe(req, res) {
    const { userId, abonnementId } = req.body;
    
    Interaction.destroy({
        where: {
            userId: userId,
            abonnementId: abonnementId,
            type: 'subscribe'
        }
    })
    .then(() => {
    return res.status(200).json({ message: 'Unsubscribed successfully' });
    })
    .catch(error => {
    console.error(error);
    return res.status(500).json({ message: 'Error unsubscribing' });
    });
}

export function deleteComment(req, res) {
    const { userId, postId, commentId } = req.body;
    
    Interaction.destroy({
        where: {
            userId: userId,
            postId: postId,
            id: commentId,
            type: 'comment'
        }
    })
    .then(() => {
    return res.status(200).json({ message: 'Comment deleted successfully' });
    })
    .catch(error => {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting comment' });
    });
}

export function deleteLike(req, res) {
    const { userId, postId } = req.body;
    
    Interaction.destroy({
        where: {
            userId: userId,
            postId: postId,
            type: 'like'
        }
    })
    .then(() => {
    return res.status(200).json({ message: 'Like removed successfully' });
    })
    .catch(error => {
    console.error(error);
    return res.status(500).json({ message: 'Error removing like' });
    });
}

export function getInteractions(req, res) {
  const { userId } = req.params;

  Interaction.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: Post,
        as: 'post',
        include: [
          {
            model: User,
            as: 'author'
          }
        ]
      }
    ]
  })
    .then(interactions => {
      return res.status(200).json(interactions);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching interactions' });
    });
}
