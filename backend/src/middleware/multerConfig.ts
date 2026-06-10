import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { ensureUploadDir } from '../services/cleanupService'

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'temp')
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '100', 10) * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/flac',
  'audio/x-flac',
  'audio/x-m4a',
  'audio/mp4',
  'audio/m4a',
])

const ALLOWED_EXTENSIONS = new Set(['.mp3', '.wav', '.flac', '.m4a'])

ensureUploadDir(UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (!ALLOWED_MIME_TYPES.has(file.mimetype) && !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Unsupported file type. Allowed: MP3, WAV, FLAC, M4A`))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
})

export { UPLOAD_DIR }