// middlewares/multer.js
import multer from 'multer'

const storage = multer.memoryStorage()

export default multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Nur Bilder erlaubt!'), false)
  }
})
