import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})


export const uploadlimiter = upload.array('files', 5)

export default uploadlimiter

