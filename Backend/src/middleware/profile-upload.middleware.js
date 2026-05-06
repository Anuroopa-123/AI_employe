// src/middleware/profile-upload.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
const employeePicDir = path.join(uploadDir, "employeepic");

// Create folders if not exists
[uploadDir, employeePicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, employeePicDir);        // ← Only employee pictures go here
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const cleanName = file.originalname
      .replace(/\s+/g, "_")
      .toLowerCase();
    
    cb(null, `profile_${timestamp}_${cleanName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for profile picture"), false);
  }
};

const profileUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default profileUpload;