const Post = require("../models/Post");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryStorage");
const multer = require("multer");
const {
  getMyPosts,
  getTaggedPosts,
  uploadPost,
  getPublicPosts,
  reactToPost,
  getGroupPosts,
  reportPost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/my-uploads", authMiddleware, getMyPosts);
router.get("/tagged", authMiddleware, getTaggedPosts);
router.get("/public", authMiddleware, getPublicPosts);
router.post("/:id/react", authMiddleware, reactToPost);
router.get("/group/:id", authMiddleware, getGroupPosts);
router.post(
  "/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log("here1:", err.message);
        return res
          .status(400)
          .json({ error: "Multer upload error: " + err.message });
      } else if (err) {
        console.log("here2", err);
        return res.status(500).json({ error: "Upload failed: " + err.message });
      }
      next();
    });
  },
  uploadPost
);
router.post("/:id/report", authMiddleware, reportPost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
