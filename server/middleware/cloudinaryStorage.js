const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: "uploads",
      resource_type: isVideo ? "video" : "image", // key part
      format: isVideo ? "mp4" : "webp", // optional
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // optional
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
