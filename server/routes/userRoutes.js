const User = require("../models/User");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMyUploads } = require("../controllers/");

router.get("/my-uploads", authMiddleware);
module.exports = router;
