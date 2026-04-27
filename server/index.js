require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const authMiddleware = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Database (MongoDB) ─────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  youtubeUrl: String,
  videoPath: String,
  thumbnailPath: String,
  createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: function(origin, callback) { callback(null, true); }, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Cloudinary & Multer config ────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'thumbnail') {
      return {
        folder: 'portfolio_thumbnails',
        resource_type: 'image'
      };
    } else {
      return {
        folder: 'portfolio_videos',
        resource_type: 'video'
      };
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnail') {
    cb(null, /image\/(jpeg|png|webp)/.test(file.mimetype));
  } else {
    cb(null, /video\//.test(file.mimetype));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 * 1024 } });

// ── Auth ──────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => res.json({ ok: true }));

// ── Videos CRUD ───────────────────────────────────────────────
// GET all (public)
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    const formattedVideos = videos.map(v => ({
      ...v.toObject(),
      id: v._id.toString()
    }));
    res.json(formattedVideos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create (protected + file upload)
app.post('/api/videos', authMiddleware, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, category, description, youtube_url } = req.body;
    if (!title || !category) return res.status(400).json({ error: 'title and category required' });

    const newVideo = new Video({
      title, category,
      description: description || '',
      youtubeUrl: youtube_url || '',
      videoPath: req.files?.video?.[0] ? req.files.video[0].path : '',
      thumbnailPath: req.files?.thumbnail?.[0] ? req.files.thumbnail[0].path : '',
    });

    await newVideo.save();
    res.status(201).json({ ...newVideo.toObject(), id: newVideo._id.toString() });
  } catch (err) {
    console.error('POST Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PATCH update (protected)
app.patch('/api/videos/:id', authMiddleware, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const existing = await Video.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    existing.title = req.body.title ?? existing.title;
    existing.category = req.body.category ?? existing.category;
    existing.description = req.body.description ?? existing.description;
    existing.youtubeUrl = req.body.youtube_url ?? existing.youtubeUrl;
    
    if (req.files?.video?.[0]) existing.videoPath = req.files.video[0].path;
    if (req.files?.thumbnail?.[0]) existing.thumbnailPath = req.files.thumbnail[0].path;

    await existing.save();
    res.json({ ...existing.toObject(), id: existing._id.toString() });
  } catch (err) {
    console.error('PATCH Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE
app.delete('/api/videos/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Not found' });

    // Helper to extract Cloudinary public ID from URL
    const extractPublicId = (url) => {
      if (!url) return null;
      try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        let publicIdParts = parts.slice(uploadIndex + 1);
        if (publicIdParts.length > 0 && publicIdParts[0].startsWith('v') && !isNaN(publicIdParts[0].substring(1))) {
          publicIdParts.shift(); // remove version
        }
        const publicIdWithExt = publicIdParts.join('/');
        const lastDotIndex = publicIdWithExt.lastIndexOf('.');
        return lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
      } catch (err) {
        return null;
      }
    };

    // Delete video file from Cloudinary
    if (video.videoPath && video.videoPath.includes('cloudinary')) {
      const videoPublicId = extractPublicId(video.videoPath);
      if (videoPublicId) {
        await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
      }
    }

    // Delete thumbnail image from Cloudinary
    if (video.thumbnailPath && video.thumbnailPath.includes('cloudinary')) {
      const thumbPublicId = extractPublicId(video.thumbnailPath);
      if (thumbPublicId) {
        await cloudinary.uploader.destroy(thumbPublicId, { resource_type: 'image' });
      }
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`📁 Files: /uploads served statically`);
  console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}\n`);
});
