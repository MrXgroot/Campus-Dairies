const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); // ✅ Needed for socket.io
const { Server } = require("socket.io"); // ✅ Import socket.io server
const Notification = require("./models/Notification");
dotenv.config();
const connectDb = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const groupRoutes = require("./routes/groupRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const app = express();
const server = http.createServer(app); // ✅ Create custom HTTP server
const initSocketServer = require("./socket");

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

// ✅ Attach io to app so you can use it in controllers
app.set("io", io);

// ✅ Socket event handlers
initSocketServer(io);

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comments", commentRoutes);
const PORT = process.env.PORT || 3000;
connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server + Socket.io running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB", err);
  });
