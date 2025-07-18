// middleware/localStorage.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Local uploads directory
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const MAX_FILE_SIZE_MB = 150; // Set 100MB for local testing

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "video/"];
    const isAllowed = allowedTypes.some((type) =>
      file.mimetype.startsWith(type)
    );

    if (!isAllowed) {
      return cb(new Error("Only image and video files are allowed"), false);
    }

    cb(null, true);
  },
});

module.exports = upload;
