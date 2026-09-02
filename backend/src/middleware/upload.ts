import multer from 'multer'
import { InvalidFileTypeError } from '../errors/submissionErrors'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILES = 5

// What an intern is allowed to attach to a task submission.
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new InvalidFileTypeError(file.mimetype))
  },
})

export const uploadSubmissionFiles = upload.array('files', MAX_FILES)

export default uploadSubmissionFiles
