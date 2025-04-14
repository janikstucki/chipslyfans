import { Post } from "../models/Post.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Multer Konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Nur Bilddateien sind erlaubt!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});


// Hilfsfunktion für Error Handling
const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error'
  });
};
export const getPosts = async (req, res) => {
    try {
        // Fetch all posts from the database
        const posts = await Post.findAll()
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
}
// Controller-Funktionen
export const postController = {
    uploadMiddleware: upload.array('images'),
  getPosts: async (req, res) => {
    try {
      const posts = await Post.findAll({
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['updatedAt'] }
      });
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      handleError(res, error);
    }
  },

  createPost: async (req, res) => {
    try {
      const { 
        title,
        content,
        taggedPeople,
        visibility,
        tags,
        scheduleDate,
        sendNotification
      } = JSON.parse(req.body.data)
  
      // User-ID aus der Authentifizierung holen
      const authorId = req.user.id // ← Korrekte Quelle
  
      const imagePaths = req.files?.map(file => file.path) || []
  
      const newPost = await Post.create({
        title,
        content,
        images: imagePaths,
        taggedUsers: taggedPeople,
        visibility,
        tags,
        scheduleDate: scheduleDate || new Date(),
        sendNotification,
        authorId // ← Hier verwenden
      })
  
      res.status(201).json(newPost)
    } catch (error) {
      console.error('Error creating post:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Post.destroy({ where: { id } });

      if (!deleted) {
        return handleError(res, new Error('Post nicht gefunden'), 404);
      }

      res.status(200).json({ success: true, message: 'Post erfolgreich gelöscht' });
    } catch (error) {
      handleError(res, error);
    }
  },

  getPostById: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return handleError(res, new Error('Post nicht gefunden'), 404);
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      handleError(res, error);
    }
  },

  updatePost: async (req, res) => {
    try {
      const [updated] = await Post.update(req.body, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return handleError(res, new Error('Post nicht gefunden'), 404);
      }

      const updatedPost = await Post.findByPk(req.params.id);
      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      handleError(res, error);
    }
  }
};