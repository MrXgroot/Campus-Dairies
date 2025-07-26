const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/userController");
const upload = require("../middleware/cloudinaryStorage");
router.get("/me", authMiddleware, profileController.getMyProfile);
router.put(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  profileController.updateProfile
);
// router.get("/uploads", authMiddleware, profileController.getUploadedPosts);
// router.get("/tagged", authMiddleware, profileController.getTaggedPosts);
router.get("/taggable", authMiddleware, profileController.getUserList);
router.post("/wave/:id", authMiddleware, profileController.sendWaveToUser);
module.exports = router;
