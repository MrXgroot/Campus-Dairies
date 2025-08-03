const Post = require("../models/Post");
const Group = require("../models/Group");
const User = require("../models/User");
const Comment = require("../models/Comment");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { createNotification } = require("../controllers/notificationController");

// Helper function to enrich posts with consistent format
const enrichPost = (post, userId) => {
  const latestComment = post.comments?.[0];

  return {
    _id: post._id,
    caption: post.caption,
    mediaUrl: post.mediaUrl,
    cloudinaryPublicId: post.cloudinaryPublicId,
    type: post.type,
    mood: post.mood,
    categories: post.categories || [],
    category: post.category, // Keep for backward compatibility
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    createdBy: post.createdBy,
    taggedUsers: post.taggedUsers,
    groupId: post.groupId,

    likesCount: post.likes?.length || 0,
    isLiked: post.likes?.some((id) => id.toString() === userId),

    commentCount: post.commentCount || 0,

    // Reports
    isReported: post.reports?.some((id) => id.toString() === userId),

    latestComment: latestComment
      ? {
          text: latestComment.text,
          createdAt: latestComment.createdAt,
          commentedBy: latestComment.user,
        }
      : null,
  };
};

exports.getMyPosts = async (req, res) => {
  const user = req.user;
  const userId = req.user.id;
  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }
  try {
    const posts = await Post.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .lean();

    const enrichedPosts = posts.map((post) => enrichPost(post, userId));
    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Fetch my uploads failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTaggedPosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const posts = await Post.find({ taggedUsers: userId })
      .populate("createdBy", "name username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    const enrichedPosts = posts.map((post) => enrichPost(post, userId));
    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Fetch tagged posts failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Upload a photo or video post
// @route   POST /api/posts/upload
// @access  Private
exports.uploadPost = async (req, res) => {
  const {
    caption,
    groupId,
    mood,
    mediaUrl,
    cloudinaryPublicId,
    type,
    taggedUsers: taggedUsersRaw,
    categories: categoriesRaw,
  } = req.body;
  const userId = req.user.id;

  if (!mediaUrl || !cloudinaryPublicId || !type) {
    return res.status(400).json({ error: "Missing media upload info" });
  }

  try {
    if (!groupId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId);
      return res.status(400).json({ error: "Missing required fields" });
    }

    let taggedUsers = [];
    if (taggedUsersRaw) {
      try {
        const parsed = JSON.parse(taggedUsersRaw);
        if (Array.isArray(parsed)) {
          taggedUsers = parsed.filter((id) =>
            mongoose.Types.ObjectId.isValid(id)
          );
        } else {
          await cloudinary.uploader.destroy(cloudinaryPublicId);
          return res
            .status(400)
            .json({ error: "taggedUsers must be an array" });
        }
      } catch (err) {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
        return res.status(400).json({ error: "Invalid taggedUsers format" });
      }
    }

    // Handle categories
    let categories = [];
    if (categoriesRaw) {
      try {
        const parsed =
          typeof categoriesRaw === "string"
            ? JSON.parse(categoriesRaw)
            : categoriesRaw;
        if (Array.isArray(parsed)) {
          const validCategories = [
            "college",
            "krishna",
            "msc",
            "mca",
            "farewell",
            "trip",
            "boyshostel",
            "girlshostel",
          ];
          categories = parsed.filter((cat) => validCategories.includes(cat));
        } else {
          await cloudinary.uploader.destroy(cloudinaryPublicId);
          return res.status(400).json({ error: "categories must be an array" });
        }
      } catch (err) {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
        return res.status(400).json({ error: "Invalid categories format" });
      }
    }

    // Default to "college" if no categories provided
    if (categories.length === 0) {
      categories = ["college"];
    }

    if (groupId !== "public") {
      const group = await Group.findById(groupId);
      if (!group) {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
        return res.status(404).json({ error: "Group not found" });
      }

      if (!group.members.includes(userId)) {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
        return res
          .status(403)
          .json({ error: "You are not a member of this group" });
      }
    }

    const newPost = await Post.create({
      mediaUrl,
      cloudinaryPublicId,
      type,
      caption,
      mood,
      createdBy: userId,
      groupId,
      taggedUsers,
      categories,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .lean();

    // Create notifications
    if (taggedUsers.length > 0) {
      await Promise.all(
        taggedUsers.map((taggedUserId) =>
          createNotification({
            senderId: userId,
            receiverId: taggedUserId,
            type: "tag",
            message: `${populatedPost.createdBy.username} tagged you in a post`,
            postId: newPost._id,
            req,
          })
        )
      );
    }

    const enrichedPost = enrichPost(populatedPost, userId);
    res.status(201).json(enrichedPost);
  } catch (err) {
    console.error("Upload post failed:", err);

    // Cleanup on error
    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId);
    }

    res.status(500).json({ error: "Server error" });
  }
};

exports.generateSignature = async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const groupId = req.query.groupId;

  if (!groupId) {
    return res.status(400).json({ error: "Missing groupId" });
  }

  const folder =
    groupId === "public" ? "posts/public" : `posts/groups/${groupId}`;

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  });
};

exports.getPublicPosts = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({
      groupId: "public",
      $or: [
        { reports: { $exists: false } },
        { reports: { $size: 0 } },
        { $expr: { $lte: [{ $size: "$reports" }, 4] } },
      ],
    })
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedPosts = posts.map((post) => enrichPost(post, userId));
    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Error fetching public posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.toggleLikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId)
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    const plainPost = post.toObject();
    const enrichedPost = enrichPost(plainPost, userId);

    res.status(200).json({
      message: "Like status updated",
      liked: !alreadyLiked,
      updatedPost: enrichedPost,
    });
  } catch (err) {
    console.error("Like toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getGroupPosts = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check membership
    const isMember = group.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group" });
    }

    const posts = await Post.find({ groupId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .lean();

    const enrichedPosts = posts.map((post) => enrichPost(post, userId));
    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Error fetching group posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.reportPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId)
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyReported = post.reports.includes(userId);
    if (alreadyReported) {
      post.reports = post.reports.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.reports.push(userId);
    }

    await post.save();
    const plainPost = post.toObject();
    const enrichedPost = enrichPost(plainPost, userId);

    res.status(200).json({
      message: "Post report updated",
      reported: !alreadyReported,
      post: enrichedPost,
    });
  } catch (err) {
    console.error("Report post error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.createdBy.toString() !== userId && !isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (post.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(post.cloudinaryPublicId, {
        resource_type: post.type === "video" ? "video" : "image",
      });
    }

    await Comment.deleteMany({ _id: { $in: post.comments } });
    await Post.findByIdAndDelete(postId);

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete Post Error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSinglePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId)
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // For single post, we might want all comments, not just the latest
    const enrichedPost = {
      ...enrichPost(post, userId),
      comments: post.comments, // Include all comments for single post view
    };

    res.status(200).json(enrichedPost);
  } catch (err) {
    console.error("Could not fetch single post", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get posts by categories
exports.getPostsByCategories = async (req, res) => {
  const userId = req.user.id;
  const { categories } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    let query = {
      groupId: "public",
      $or: [
        { reports: { $exists: false } },
        { reports: { $size: 0 } },
        { $expr: { $lte: [{ $size: "$reports" }, 4] } },
      ],
    };

    // Add category filter if provided
    if (categories) {
      const categoryArray = categories.split(",").map((cat) => cat.trim());
      query.categories = { $in: categoryArray };
    }

    const posts = await Post.find(query)
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 1 },
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedPosts = posts.map((post) => enrichPost(post, userId));
    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Error fetching posts by categories:", err);
    res.status(500).json({ error: "Server error" });
  }
};
