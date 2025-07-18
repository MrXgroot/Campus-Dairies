const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

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
    const { name, quote } = req.body;
    const userId = req.user.id;
    const file = req.file;
    console.log(file, "this is the file routes");
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If a new file is uploaded (i.e., new avatar)
    if (file) {
      console.log(file);
      // Delete the old avatar if it exists
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      // Store new avatar info
      user.avatar = file.path;
      user.avatarPublicId = file.filename; // this is the public_id if you're using multer-storage-cloudinary
    }

    // Update name and quote
    if (name) user.name = name;
    if (quote) user.quote = quote;

    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    console.log(sanitizedUser);
    res.status(200).json(sanitizedUser);
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
