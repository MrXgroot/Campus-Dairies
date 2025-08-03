const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// Create a new comment on a post
const createComment = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;
  const userId = req.user.id;

  if (!text) return res.status(400).json({ error: "Comment text is required" });

  try {
    const post = await Post.findById(postId).populate("createdBy", "_id");

    if (!post) return res.status(404).json({ error: "Post not found" });

    let newComment = await Comment.create({
      postId,
      user: userId,
      text,
    });

    // Update post with new comment and increment comment count
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
      $inc: { commentCount: 1 }, // Increment comment count by 1
    });

    newComment = await newComment.populate("user", "name avatar isVerified");

    // Create notification if commenter is not the post owner
    if (userId !== post.createdBy._id.toString()) {
      await Notification.create({
        sender: userId,
        receiver: post.createdBy._id,
        type: "comment",
        message: `${newComment.user.name} commented: "${text.slice(0, 100)}"`,
        post: postId,
        commentId: newComment._id,
      });

      const io = req.app.get("io");
      io.to(post.createdBy._id.toString()).emit("new-notification", {
        message: "new Comment on your post",
      });
    }

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar isVerified")
      .populate("replies.user", "name avatar isVerified");

    res.status(200).json({ comments });
  } catch (err) {
    console.error("Error fetching paginated comments:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (!comment.user.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Remove comment from post and decrement comment count
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: commentId },
      $inc: { commentCount: -1 }, // Decrement comment count by 1
    });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const addReply = async (req, res) => {
  const { commentId } = req.params;
  const { text, replyingTo } = req.body;
  const userId = req.user.id;

  if (!text) return res.status(400).json({ error: "Reply text is required" });

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const reply = {
      user: userId,
      text,
      replyingTo,
      timestamp: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    // Optionally increment comment count for replies as well
    // If you want replies to count towards the total comment count:
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: 1 },
    });

    // get the last reply from comment.replies array
    const lastReply = comment.replies[comment.replies.length - 1];

    // populate user info in the last reply
    await comment.populate({
      path: "replies.user",
      select: "name avatar isVerified",
      match: { _id: lastReply.user }, // only populate the last user
    });

    const populatedReply = comment.replies[comment.replies.length - 1];
    console.log(populatedReply);
    res.status(200).json(populatedReply);
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a reply from a comment
const deleteReply = async (req, res) => {
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ error: "Reply not found" });

    if (!reply.user.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    reply.deleteOne();
    await comment.save();

    // Optionally decrement comment count for reply deletion
    // If you want replies to count towards the total comment count:
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -1 },
    });

    res.status(200).json({ message: "Reply deleted" });
  } catch (err) {
    console.error("Error deleting reply:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createComment,
  getCommentsByPostId,
  deleteComment,
  addReply,
  deleteReply,
};
