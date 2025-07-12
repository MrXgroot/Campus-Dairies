const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", getMe);

module.exports = router;
