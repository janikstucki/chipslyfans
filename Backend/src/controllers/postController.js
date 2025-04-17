import { Post } from "../models/Post.js";
import { uploadFile  } from "../middlewares/s3.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


import { User } from "../models/User.js";
import { Op } from 'sequelize';

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



export const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                scheduleDate: {
                    [Op.lte]: new Date() // Nur Posts mit scheduleDate <= jetzt
                }
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedPosts = posts.map(post => {
            const { author, ...rest } = post.toJSON();
            return {
                ...rest,
                author: {
                    id: author?.id || null,
                    username: author?.username || 'Unbekannt'
                }
            };
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error('[getPosts] Error fetching scheduled posts:', error);
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

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

  // createPost: async (req, res) => {
  //   try {
  //     const { 
  //       title,
  //       content,
  //       taggedPeople,
  //       visibility,
  //       tags,
  //       scheduleDate,
  //       sendNotification
  //     } = JSON.parse(req.body.data);
  
  //     // User-ID aus der Authentifizierung holen
  //     const authorId = req.user.id; 
  
  //     // Pfade der hochgeladenen Bilder aus req.files extrahieren
  //     const imagePaths = req.files?.map(file => file.path) || [];
  
  //     // Einen neuen Post erstellen
  //     const newPost = await Post.create({
  //       title,
  //       content,
  //       images: imagePaths, // Bilderpfade hier speichern
  //       taggedUsers: taggedPeople,
  //       visibility,
  //       tags,
  //       scheduleDate: scheduleDate || new Date(),
  //       sendNotification,
  //       authorId
  //     });
  
  //     res.status(201).json(newPost); // Antwort mit dem neuen Post
  //   } catch (error) {
  //     console.error('Error creating post:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // },
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