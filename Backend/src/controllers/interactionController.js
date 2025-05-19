import { Interaction, User, Post } from "../models/index.js";
import { Op } from 'sequelize';
import { UserTagInterest } from "../models/index.js";
import { updateUserTagInterests } from "../utils/tagUtils.js";

export const toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post){
            return res.status(404).json({ message: "Post not found"});
        }

        const likes = { ...post.likes };
        const likedBy = likes.likedBy || [];
        const alreadyLiked = likedBy.includes(userId);

        if (alreadyLiked){
            likes.likedBy = likedBy.filter(id => id !== userId);
            likes.likeCount = Math.max(0, (likes.likeCount || 0) - 1);
        } else {
            likes.likedBy = [...likedBy, userId];
            likes.likeCount = (likes.likeCount || 0) + 1;

            const tags = post.tags?.slice(0, 3) || [];
            await updateUserTagInterests(userId, tags);
        }

        post.likes = likes;
        await post.save();

        return res.status(200).json({ success: true, likes: post.likes });
    } catch (error) {
        console.error('[toggleLike] Fehler:', error);
        return res.status(500).json({ message: 'Fehler beim Liken des Posts' });
    }
};
