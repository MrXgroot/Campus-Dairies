const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// console.log(client);
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isVerified || false },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  console.log(email, password);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      user: {
        _id: newUser._id,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken(user._id);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Google login
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        username: email.split("@")[0],
        password: "google-auth",
      });
    }

    const jwtToken = generateToken(user);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token: jwtToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ error: "Google authentication failed" });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  console.log("called");
  const user = req.user;
  if (!user) {
    return res.status(400).json({ error: "No user logged in" });
  }
  const id = user.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
