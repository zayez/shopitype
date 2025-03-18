import multer from '@koa/multer'
import { format } from 'date-fns'
import fs from 'fs'
import config from '../config/config'

const { isProd, isDev } = config
const { IMAGE_MAX_SIZE_MB } = config.app
const IMAGE_MAX_SIZE = 1024 * (1024 * IMAGE_MAX_SIZE_MB)

const uploadsDir =
  isProd || isDev ? './public/uploads/' : './tests/data/uploads/'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true })
      cb(null, uploadsDir)
    } catch (err) {
      throw err
    }
  },
  filename: (req, file, cb) => {
    const f = `${format(new Date(), 'yyyy-MM-dd-hh-mm-ss')}_${
      file.originalname
    }`
    cb(null, f)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
    // Reject the file
    return cb(null, false)
  }
  // Accept the file
  cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: IMAGE_MAX_SIZE },
  fileFilter,
})

export default upload
