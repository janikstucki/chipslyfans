import { Post } from "../models/Post.js";

export const getPosts = async (req, res) => {
    try {
        // Fetch all posts from the database
        const posts = await Post.findAll()
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        // Create a new post in the database
        const newPost = await Post.create({ title, content, authorId });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
}

export const deletePost = async (req, res) => {
    try {
        const id  = req.params.id;
        // Delete a post from the database
        const deletedPost = await Post.destroy({ where: { id } });
        if (deletedPost) {
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
}