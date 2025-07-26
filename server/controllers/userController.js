const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const Notification = require("../models/Notification");
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name username email avatar quote groups waves hearts")
      .populate("groups", "name")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const [postsCount, taggedCount] = await Promise.all([
      Post.countDocuments({ author: req.user.id }),
      Post.countDocuments({ tagged: req.user.id }),
    ]);

    res.status(200).json({
      ...user,
      stats: {
        postsCount,
        taggedCount,
        groupsCount: user.groups?.length || 0,
        wavesCount: user.waves?.length || 0,
        heartsCount: user.hearts?.length || 0,
      },
    });
  } catch (err) {
    console.error("Get profile failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, quote } = req.body;
    const userId = req.user.id;
    const file = req.file;
    console.log(file, "this is the file routes");
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If a new file is uploaded (i.e., new avatar)
    if (file) {
      // Delete the old avatar if it exists
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      // Store new avatar info
      user.avatar = file.path;
      user.avatarPublicId = file.filename; // this is the public_id if you're using multer-storage-cloudinary
    }

    // Update name and quote
    if (username) user.username = username;
    if (quote) user.quote = quote;

    await user.save();
    const updatedUser = await User.findById(userId)
      .select("name username email avatar quote groups waves hearts")
      .populate("groups", "name")
      .lean();

    const [postsCount, taggedCount] = await Promise.all([
      Post.countDocuments({ author: userId }),
      Post.countDocuments({ tagged: userId }),
    ]);

    res.status(200).json({
      ...updatedUser,
      stats: {
        postsCount,
        taggedCount,
        groupsCount: updatedUser.groups?.length || 0,
        wavesCount: updatedUser.waves?.length || 0,
        heartsCount: updatedUser.hearts?.length || 0,
      },
    });
  } catch (err) {
    console.error("Update profile failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const projection = "mediaUrl caption createdAt"; // whatever minimal fields you show

exports.getUploadedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .select(projection)
      .lean();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Fetch uploaded posts failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTaggedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ tagged: req.user.id })
      .sort({ createdAt: -1 })
      .select(projection)
      .lean();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Fetch tagged posts failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserList = async (req, res) => {
  const search = req.query.search?.trim() || "";

  try {
    if (!search) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(search, "i"); // case-insensitive

    const users = await User.find(
      {
        $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
      },
      { password: 0 }
    ).limit(10);

    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getUserList:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.sendWaveToUser = async (req, res) => {
  const id = req.params.id; // The recipient's socket ID or user ID
  const io = req.app.get("io");
  const userId = req.user.id;

  try {
    // Await the user fetch and use lean for performance
    const user = await User.findById(userId).select("username avatar _id");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const notif = await Notification.create({
      receiver: id, // ✅ This is the required field
      sender: userId,
      type: "wave",

      message: `Waved at you`,
    });

    // Emit the wave with minimal user info
    io.to(id).emit("new-notification", "someone waved at you");

    res.status(200).json({ success: true, message: "Wave sent!" });
  } catch (err) {
    console.error("Error sending wave:", err);
    res.status(500).json({ error: "Server error" });
  }
};
