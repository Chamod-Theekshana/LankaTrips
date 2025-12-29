import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 50);
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const ok = /image\/(png|jpeg|jpg|webp)/.test(file.mimetype);
  cb(ok ? null : new Error('Only image uploads are allowed'), ok);
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
