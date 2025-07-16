const Post = require("../models/Post");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryStorage");
const {
  getMyPosts,
  getTaggedPosts,
  uploadPost,
  getPublicPosts,
  reactToPost,
  getGroupPosts,
  reportPost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/my-uploads", authMiddleware, getMyPosts);
router.get("/tagged", authMiddleware, getTaggedPosts);
router.get("/public", authMiddleware, getPublicPosts);
router.post("/:id/react", authMiddleware, reactToPost);
router.get("/group/:id", authMiddleware, getGroupPosts);
router.post("/upload", authMiddleware, upload.single("file"), uploadPost);
router.post("/:id/report", authMiddleware, reportPost);

module.exports = router;
