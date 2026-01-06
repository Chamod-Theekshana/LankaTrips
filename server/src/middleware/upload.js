import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'lankatrips',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      resource_type: 'image'
    };
  }
});

function fileFilter(req, file, cb) {
  const ok = /image\/(png|jpeg|jpg|webp)/.test(file.mimetype);
  cb(ok ? null : new Error('Only image uploads are allowed'), ok);
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
