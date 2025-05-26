import { uploadFile  } from "../middlewares/s3.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


import { User, Post, UserTagInterest } from "../models/index.js";

import { Op, Sequelize } from 'sequelize';

const upload = multer({ dest: 'uploads/' });

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


// Hilfsfunktion für Error Handling
const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error'
  });
};

export const createPost = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data)

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Keine Bilder hochgeladen' })
    }

    // Bilder gleichzeitig hochladen
    const uploadResults = await Promise.all(
      req.files.map(file => uploadFile(file.buffer, file.originalname, file.mimetype))
    )

    const imageInfos = uploadResults.map((url, i) => ({
      url,
      filename: req.files[i].originalname
    }))

    const newPost = await Post.create({
      ...data,
      images: imageInfos,
      authorId: req.user.id
    })

    res.status(201).json(newPost)
  } catch (error) {
    console.error('[createPost] Fehler:', error)
    res.status(500).json({ message: 'Fehler beim Erstellen des Posts' })
  }
}

export const likePost = async (req, res) => {
  try{
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post){
      return res.status(404).json({ message: "Post not found"})
    }

    const likes = { ...post.likes };
    const likedBy = likes.likedBy || []
    const alreadyLiked = likedBy.includes(userId);

    if (alreadyLiked){
      likes.likedBy = likedBy.filter(id => id !== userId);
      likes.likeCount = Math.max(0, (likes.likeCount || 0) -1);
    } else {
      likes.likedBy = [...likedBy, userId];
      likes.likeCount = (likes.likeCount || 0) + 1;
    }

    post.likes = likes;
    await post.save();

    return res.status(200).json({ success: true, likes: post.likes });
  } catch (error) {
    console.error('[likePost] Fehler:', error);
    return res.status(500).json({ message: 'Fehler beim Liken des Posts' });
  }
};



export const getPosts = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // 🧠 FALL 1: Pagination aktiv – unabhängig vom User, z.B. beim Scrollen
    if (req.query.offset) {
      const posts = await Post.findAll({
        where: {
          [Op.or]: [
            { scheduleDate: { [Op.lte]: new Date() } },
            { scheduleDate: null }
          ]
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilepicture']
          }
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit
      });

      return res.status(200).json(posts.map(formatPost));
    }

    // 🧠 FALL 2: Initialer Feed – nur einmal beim ersten Laden
    if (userId) {
      const userInterests = await UserTagInterest.findAll({
        where: { userId },
        order: [['weight', 'DESC']],
        limit: 10
      });

      const interestTags = userInterests.map(entry => entry.tag);

      let matchingPosts = [];
      if (interestTags.length > 0) {
        matchingPosts = await Post.findAll({
          where: {
            [Op.or]: interestTags.map(tag => ({
              tags: { [Op.like]: `%${tag}%` }
            })),
            [Op.or]: [
              { scheduleDate: { [Op.lte]: new Date() } },
              { scheduleDate: null }
            ]
          },
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilepicture']
          }],
          order: [['createdAt', 'DESC']],
          limit: 40
        });
      }

      const otherPosts = await Post.findAll({
        where: {
          [Op.or]: [
            { scheduleDate: { [Op.lte]: new Date() } },
            { scheduleDate: null }
          ],
          ...(interestTags.length > 0
            ? {
                [Op.and]: interestTags.map(tag => ({
                  tags: { [Op.notLike]: `%${tag}%` }
                }))
              }
            : {})
        },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilepicture']
        }],
        order: [['createdAt', 'DESC']],
        limit: 20
      });

      const finalPosts = [
        ...matchingPosts.slice(0, 8),
        ...otherPosts.slice(0, matchingPosts.length > 0 ? 2 : 10)
      ];

      finalPosts.sort(() => Math.random() - 0.5); // mischen

      if (finalPosts.length === 0) {
        const fallbackPosts = await Post.findAll({
          where: {
            [Op.or]: [
              { scheduleDate: { [Op.lte]: new Date() } },
              { scheduleDate: null }
            ]
          },
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilepicture']
          }],
          order: [['createdAt', 'DESC']],
          limit: 10
        });
        return res.status(200).json(fallbackPosts.map(formatPost));
      }

      return res.status(200).json(finalPosts.map(formatPost));
    }

    // 🧠 FALL 3: Öffentliche Posts für anonyme Nutzer
    const publicPosts = await Post.findAll({
      where: {
        [Op.or]: [
          { scheduleDate: { [Op.lte]: new Date() } },
          { scheduleDate: null }
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilepicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    return res.status(200).json(publicPosts.map(formatPost));
  } catch (error) {
    console.error('Fehler beim Laden der Posts:', error);
    res.status(500).json({ message: 'Posts konnten nicht geladen werden.' });
  }
};



// Formatierung
function formatPost(post) {
  const { author, ...rest } = post.toJSON();
  return {
    ...rest,
    author: {
      id: author?.id || null,
      username: author?.username || 'Unbekannt',
      profilepicture: author?.profilepicture || null
    }
  };
}

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post nicht gefunden' });
    }

    const { author, ...rest } = post.toJSON();

    const formattedPost = {
      ...rest,
      author: {
        id: author?.id || null,
        username: author?.username || 'Unbekannt'
      }
    };

    res.status(200).json({ success: true, data: formattedPost });
  } catch (error) {
    console.error('[getPostById] Fehler beim Laden des Beitrags:', error);
    res.status(500).json({ message: 'Fehler beim Laden des Beitrags', error });
  }
};



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
      const imageUrls = req.files?.map(file => ({
        path: `/uploads/${file.filename}`, // Generierte URL
        filename: file.filename
      })) || [];

      const newPost = await Post.create({
        ...data,
        images: imageUrls, // Speichere URLs im Format { path, filename }
        authorId: req.user.id
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
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