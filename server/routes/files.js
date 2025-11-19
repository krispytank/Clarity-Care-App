import express from 'express';
import multer from 'multer';
import File from '../models/File.js';
import { protect } from './auth.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user._id,
      accessibleTo: req.body.accessibleTo ? JSON.parse(req.body.accessibleTo) : [],
      category: req.body.category
    });

    const fileBuffer = fs.readFileSync(req.file.path);
    const encryptedBuffer = file.encryptFile(fileBuffer);
    fs.writeFileSync(req.file.path, encryptedBuffer);

    await file.save();

    res.status(201).json({
      status: 'success',
      data: { file }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const files = await File.find({
      $or: [
        { uploadedBy: req.user._id },
        { accessibleTo: req.user._id }
      ]
    }).populate('uploadedBy', 'firstName lastName');

    res.json({
      status: 'success',
      data: { files }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;