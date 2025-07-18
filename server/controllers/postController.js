const Post = require("../models/Post");
const Group = require("../models/Group");
const User = require("../models/User");
const Comment = require("../models/Comment");
exports.getMyPosts = async (req, res) => {
  const user = req.user;
  console.log("usernaem", user);
  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }
  try {
    const posts = await Post.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "groupId",
        select: "name groupImage description",
        match: { _id: { $exists: true } },
      })
      .populate("createdBy", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "username avatar" },
      });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Fetch my uploads failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTaggedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ taggedUsers: req.user.id })
      .populate("createdBy", "name avatar")
      .populate("group", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Fetch tagged posts failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Upload a photo or video post
// @route   POST /api/posts/upload
// @access  Private
exports.uploadPost = async (req, res) => {
  const { caption, groupId, mood } = req.body;
  const userId = req.user.id;
  const file = req.file;
  console.log("inside the controller");
  if (!file || !file.path) {
    return res.status(400).json({ error: "File upload failed" });
  }

  try {
    if (!groupId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Safely parse taggedUsers
    let taggedUsers = [];
    if (req.body.taggedUsers) {
      try {
        const parsed = JSON.parse(req.body.taggedUsers);
        if (Array.isArray(parsed)) {
          taggedUsers = parsed.filter((id) =>
            require("mongoose").Types.ObjectId.isValid(id)
          );
        }
      } catch (err) {
        return res.status(400).json({ error: "Invalid taggedUsers format" });
      }
    }

    // ✅ Group membership check
    if (groupId !== "public") {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Group not found" });

      if (!group.members.includes(userId)) {
        return res
          .status(403)
          .json({ error: "You are not a member of this group" });
      }
    }

    const isVideo = file.mimetype.startsWith("video");

    const newPost = await Post.create({
      mediaUrl: file.path,
      type: isVideo ? "video" : "image",
      caption,
      mood,
      createdBy: userId,
      groupId,
      taggedUsers,
    });
    console.log(newPost);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Upload post failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPublicPosts = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({ groupId: "public" })
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const filteredPosts = posts.filter(
      (post) => !post.reports || post.reports.length <= 3
    );

    const enrichedPosts = filteredPosts.map((post) => ({
      ...post,
      isHearted: post.reactions?.hearts?.some((id) => id.toString() === userId),
      isWaved: post.reactions?.waves?.some((id) => id.toString() === userId),
      isLaughed: post.reactions?.laughs?.some((id) => id.toString() === userId),
      isReported: post.reports?.some((id) => id.toString() === userId),
      totalHearts: post.reactions?.hearts?.length || 0,
      totalWaves: post.reactions?.waves?.length || 0,
      totalLaughs: post.reactions?.laughs?.length || 0,
      totalReports: post.reports?.length || 0,
    }));

    res.status(200).json(enrichedPosts);
  } catch (err) {
    console.error("Error fetching public posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.reactToPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { reactionType } = req.body; // e.g., "hearts", "waves", etc.

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Example: Add or remove user's reaction
    const alreadyReacted = post.reactions[reactionType].includes(userId);

    if (alreadyReacted) {
      post.reactions[reactionType] = post.reactions[reactionType].filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.reactions[reactionType].push(userId);
    }

    await post.save();

    console.log(post);
    res.status(200).json({ message: "Reaction updated", post });
  } catch (err) {
    console.error("React error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getGroupPosts = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;
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
      .populate("createdBy", "username avatar isVerified")
      .populate("taggedUsers", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "username avatar" },
      });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching group posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.reportPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyReported = post.reports.includes(userId);
    if (alreadyReported) {
      // Toggle off if already reported (optional)
      post.reports = post.reports.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.reports.push(userId);
    }

    await post.save();
    res
      .status(200)
      .json({ message: "Post report updated", reported: !alreadyReported });
  } catch (err) {
    console.error("Report post error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
