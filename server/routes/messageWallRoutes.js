// routes/messageWallRoutes.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const messageWallController = require("../controllers/messageWallController");
const authMiddleware = require("../middleware/authMiddleware");

// Validation middleware
const validateMessage = [
  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Message must be between 1 and 500 characters")
    .trim(),
];

const validateReport = [
  body("reason")
    .optional()
    .isIn(["spam", "inappropriate", "harassment", "other"])
    .withMessage("Invalid report reason"),
];

// All routes require authentication
router.use(authMiddleware);

// GET /api/messagewall - Get all messages with pagination and search
router.get("/", messageWallController.getMessages);

// POST /api/messagewall - Create new message
router.post("/", validateMessage, messageWallController.createMessage);

// DELETE /api/messagewall/:id - Delete message
router.delete("/:id", messageWallController.deleteMessage);

// POST /api/messagewall/:id/report - Report message
router.post("/:id/report", validateReport, messageWallController.reportMessage);

// GET /api/messagewall/user/me - Get current user's messages
router.get("/user/me", messageWallController.getUserMessages);

module.exports = router;

// Add this to your main app.js or server.js
/*
const messageWallRoutes = require('./routes/messageWallRoutes');
app.use('/api/messagewall', messageWallRoutes);
*/
