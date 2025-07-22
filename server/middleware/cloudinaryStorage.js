const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// 50MB max file size (Cloudinary supports up to 100MB for free tier)
const MAX_FILE_SIZE_MB = 100;

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log(file);
    const isVideo = file.mimetype.startsWith("video");
    const format = isVideo ? undefined : "webp"; // Optional: force formats
    let folder = "uploads";
    if (req.body.isAvatar === "true") {
      folder = "avatars";
    }

    return {
      folder,
      resource_type: isVideo ? "video" : "image", // critical!
      format,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Multer middleware with Cloudinary storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "video/"];
    const isAllowed = allowedTypes.some((type) =>
      file.mimetype.startsWith(type)
    );

    if (!isAllowed) {
      console.log("not allowed");
      return cb(new Error("Only image and video files are allowed"), false);
    }

    cb(null, true);
  },
});

module.exports = upload;
