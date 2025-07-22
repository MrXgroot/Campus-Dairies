const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  getCommentsByPostId,
  deleteComment,
  addReply,
  deleteReply,
} = require("../controllers/commentController");

// Create a comment on a post
router.post("/:postId", authMiddleware, createComment);

// Get all comments on a post
router.get("/:postId", authMiddleware, getCommentsByPostId);

// Delete a comment
router.delete("/:commentId", authMiddleware, deleteComment);

// Add a reply to a comment
router.post("/reply/:commentId", authMiddleware, addReply);

// Delete a reply from a comment
router.delete("/reply/:commentId/:replyId", authMiddleware, deleteReply);

module.exports = router;
