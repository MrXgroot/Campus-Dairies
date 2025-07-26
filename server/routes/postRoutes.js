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
  toggleLikePost,
  getGroupPosts,
  reportPost,
  deletePost,
  generateSignature,
  getSinglePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/my-uploads", authMiddleware, getMyPosts);
router.get("/tagged", authMiddleware, getTaggedPosts);
router.get("/public", authMiddleware, getPublicPosts);
router.post("/:id/like", authMiddleware, toggleLikePost);
router.get("/group/:id", authMiddleware, getGroupPosts);
router.post("/upload", authMiddleware, uploadPost);
router.get("/generate-signature", authMiddleware, generateSignature);
router.post("/:id/report", authMiddleware, reportPost);
router.delete("/:id", authMiddleware, deletePost);
router.get("/taggedpost/:id", authMiddleware, getSinglePost);
module.exports = router;
