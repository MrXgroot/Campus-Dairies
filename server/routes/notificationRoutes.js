const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  deleteNotification,
  deleteAllNotifications,
  createNotification,
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications); // Get all notifications

router.delete("/:id", authMiddleware, deleteNotification); // Delete single notification

router.delete("/", authMiddleware, deleteAllNotifications); // Delete all notifications for the user

module.exports = router;
