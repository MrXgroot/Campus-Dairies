// controllers/messageWallController.js
const MessageWall = require("../models/MessageWall");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// Get all messages with pagination
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build search query
    let query = { isDeleted: false };
    if (search) {
      query.$or = [{ content: { $regex: search, $options: "i" } }];
    }

    // Get messages with author info
    const messages = await MessageWall.find(query)
      .populate("author", "username avatar isVerified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await MessageWall.countDocuments(query);
    const hasMore = skip + messages.length < total;

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasMore,
        },
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// Create new message
exports.createMessage = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { content } = req.body;
    const userId = req.user.id;

    // Create new message
    const message = await MessageWall.create({
      content,
      author: userId,
    });

    // Populate author info for response
    await message.populate("author", "username avatar isVerified");

    res.status(201).json({
      success: true,
      data: message,
      message: "Message posted successfully",
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create message",
    });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.isVerified; // Assuming verified users are admins

    // Find the message
    const message = await MessageWall.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if user can delete (own message or admin)
    if (message.author.toString() !== userId.toString() && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message",
      });
    }

    // Soft delete
    message.isDeleted = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

// Report message
exports.reportMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;
    const { reason } = req.body;

    const message = await MessageWall.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if user already reported this message
    const alreadyReported = message.reports.some(
      (report) => report.reportedBy.toString() === userId.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this message",
      });
    }

    // Add report
    message.reports.push({
      reportedBy: userId,
      reason: reason || "other",
    });

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message reported successfully",
    });
  } catch (error) {
    console.error("Report message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to report message",
    });
  }
};

// Get user's own messages
exports.getUserMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await MessageWall.find({
      author: userId,
      isDeleted: false,
    })
      .populate("author", "username avatar isVerified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MessageWall.countDocuments({
      author: userId,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasMore: skip + messages.length < total,
        },
      },
    });
  } catch (error) {
    console.error("Get user messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user messages",
    });
  }
};
