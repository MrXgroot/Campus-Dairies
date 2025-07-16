const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const groupController = require("../controllers/groupController");

// Group CRUD
router.post("/create", authMiddleware, groupController.createGroup); // ✅ Create group
router.get("/my", authMiddleware, groupController.getMyGroups); // ✅ Get groups the user has joined
router.get("/discover", authMiddleware, groupController.getOtherGroups); // ✅ Get joinable groups
router.get("/:id", authMiddleware, groupController.getGroupById); // ✅ Get details of a group (e.g., in private view)
router.put("/:id", authMiddleware, groupController.updateGroup); // Optional: update group details
router.delete("/:id", authMiddleware, groupController.deleteGroup); // Optional: delete a group

// Group Membership
// router.post("/:id/join", authMiddleware, groupController.joinGroup);
router.post("/:id/leave", authMiddleware, groupController.leaveGroup);
router.get("/:id/members", authMiddleware, groupController.getGroupMembers);
router.post("/:id/request", authMiddleware, groupController.requestToJoinGroup);
router.post(
  "/approve-request",
  authMiddleware,
  groupController.approveJoinRequest
);
router.post("/:id/accept", authMiddleware, groupController.approveJoinRequest);

// Moderation
router.post("/:id/add-mod", authMiddleware, groupController.addModerator);
router.post("/:id/remove-mod", authMiddleware, groupController.removeModerator);

module.exports = router;
