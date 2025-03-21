import multer from '@koa/multer'
import { format } from 'date-fns'
import fs from 'fs'
import config from '../config/config'
import { File } from '@koa/multer'
import { IncomingMessage } from 'http'

const { isProd, isDev } = config
const { IMAGE_MAX_SIZE_MB } = config.app
const IMAGE_MAX_SIZE = 1024 * (1024 * IMAGE_MAX_SIZE_MB)

const uploadsDir =
  isProd || isDev ? './public/uploads/' : './tests/data/uploads/'

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    fs.mkdirSync(uploadsDir, { recursive: true })
    cb(null, uploadsDir)
  },
  filename: (_, file, cb) => {
    const f = `${format(new Date(), 'yyyy-MM-dd-hh-mm-ss')}_${
      file.originalname
    }`
    cb(null, f)
  },
})

const fileFilter = (
  _: IncomingMessage,
  file: File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
    return cb(null, false) // Reject the file
  }

  cb(null, true) // Accept the file
}

const upload = multer({
  storage,
  limits: { fileSize: IMAGE_MAX_SIZE },
  fileFilter,
})

export default upload
