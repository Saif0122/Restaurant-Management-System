import multer from 'multer';
import { ApiError } from '../utils/ApiError';

// Configure storage (using memory storage to buffer files before sending to Cloudinary)
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Not an image! Please upload only images.') as any, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
