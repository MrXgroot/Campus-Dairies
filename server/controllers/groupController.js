const Group = require("../models/Group");
const User = require("../models/User");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");
// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, groupImage, isPrivate } = req.body;
    const user = req.user;
    if (!user) return res.status(400).json({ error: "User not found" });
    const newGroup = new Group({
      name,
      description,
      groupImage,
      isPrivate,
      createdBy: req.user.id,
      members: [req.user.id],
      moderators: [req.user.id],
      stats: { totalMembers: 1 },
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error("Group creation error:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Get groups the logged-in user has joined
exports.getMyGroups = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(200).json({ message: "User not in Any groups" });
  try {
    const groups = await Group.find({ members: req.user.id })
      .select("-joinRequests")
      .populate("createdBy", "name username avatar");
    res.json(groups);
  } catch (err) {
    console.error("Get my groups failed:", err);
    res.status(500).json({ error: "Failed to fetch joined groups" });
  }
};

// Get groups the user hasn't joined (discoverable)
exports.getOtherGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: { $ne: req.user.id } }).populate(
      "createdBy",
      "username avatar"
    );
    res.json(groups);
  } catch (err) {
    console.error("Get other groups failed:", err);
    res.status(500).json({ error: "Failed to fetch other groups" });
  }
};

// Get details of a specific group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "username avatar")
      .populate("members", "username avatar")
      .populate("moderators", "username avatar");
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch group" });
  }
};

// Update group details
exports.updateGroup = async (req, res) => {
  try {
    const updates = req.body;
    const group = await Group.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to update group" });
  }
};

exports.deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // ✅ Optional auth check (recommended)
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // ✅ Delete all media under the group folder
    try {
      await cloudinary.api.delete_resources_by_prefix(`groups/${groupId}`);
      await cloudinary.api.delete_folder(`groups/${groupId}`);
    } catch (cloudErr) {
      console.warn("Cloudinary delete failed:", cloudErr.message);
      // Not throwing here to allow MongoDB cleanup even if Cloudinary fails
    }

    // ✅ Delete all posts in this group (optional, but good)
    await Post.deleteMany({ groupId });

    // ✅ Delete the group itself
    await Group.findByIdAndDelete(groupId);

    res.json({ message: "Group and related posts deleted successfully" });
  } catch (err) {
    console.error("Delete group error:", err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};

// Request to join a group (pending approval)
exports.requestToJoinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate("createdBy");
    if (!group) return res.status(404).json({ error: "Group not found" });

    const alreadyRequested = group.joinRequests.find(
      (r) => r.user.toString() === req.user.id
    );
    const alreadyMember = group.members.includes(req.user.id);

    if (alreadyRequested || alreadyMember)
      return res.status(400).json({ error: "Already requested or joined" });

    group.joinRequests.push({ user: req.user.id });
    await group.save();

    // Create a notification for the group admin
    const notification = new Notification({
      receiver: group.createdBy._id, // ✅ This is the required field
      sender: req.user.id,
      type: "join-request",
      group: group._id,
      message: `${req.user.username || "someone"} requested to join "${
        group.name
      }"`,
    });
    await notification.save();

    // Notify admin via socket
    const io = req.app.get("io");
    console.log(group.createdBy._id.toString(), "is requested to join group");
    io.to(group.createdBy._id).emit("new-notification", {
      type: "join-request",
      message: `${req.user.username || "someone"} requested to join ${
        group.name
      }`,
    });

    res.status(200).json({ message: "Join request sent" });
  } catch (err) {
    console.error("Join request error:", err);
    res.status(500).json({ error: "Failed to send join request" });
  }
};

// Approve a join request
exports.approveJoinRequest = async (req, res) => {
  const { userId, notificationId } = req.body;
  const groupId = req.params.id;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (
      group.createdBy.toString() !== req.user.id &&
      !group.moderators.includes(req.user.id)
    )
      return res.status(403).json({ error: "Not authorized" });

    // Remove from requests
    group.joinRequests = group.joinRequests.filter(
      (r) => r.user.toString() !== userId
    );

    // Add to members
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      group.stats.totalMembers++;
    }

    await group.save();

    await Notification.findByIdAndDelete(notificationId);
    // Notify user
    const io = req.app.get("io");
    console.log(group.createdBy._id.toString(), "is requested to join group");

    io.to(userId).emit("new-notification", {
      groupId: group._id,
      groupName: group.name,
    });
    io.to(userId.toString()).emit("new-notification", {
      groupId: group._id,
      groupName: group.name,
    });

    res.status(200).json({ message: "User added to group" });
  } catch (err) {
    console.error("Approve join request error:", err);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

// Leave a group
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.createdBy.toString() === req.user.id) {
      return res
        .status(400)
        .json({ error: "Group creator cannot leave the group" });
    }
    group.members = group.members.filter((id) => id.toString() !== req.user.id);
    group.stats.totalMembers--;
    await group.save();
    console.log(req.user, "left the group");
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to leave group" });
  }
};

// Get members of a group
exports.getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate(
      "members",
      "username avatar"
    );
    res.json(group.members);
  } catch (err) {
    res.status(500).json({ error: "Failed to get group members" });
  }
};

// Add a moderator
exports.addModerator = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group.moderators.includes(req.body.userId)) {
      group.moderators.push(req.body.userId);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to add moderator" });
  }
};

// Remove a moderator
exports.removeModerator = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    group.moderators = group.moderators.filter(
      (id) => id.toString() !== req.body.userId
    );
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove moderator" });
  }
};
