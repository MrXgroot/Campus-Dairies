// socket/index.js
const Notification = require("./models/Notification");

const onlineUsers = new Map();

const initSocketServer = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    socket.on("register", async (user) => {
      const userId = user._id;
      socket.join(userId);
      socket.userId = userId;

      // Save user info
      onlineUsers.set(user._id, {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
      });

      io.emit("online-users", Array.from(onlineUsers.values()));
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("online-users", Array.from(onlineUsers.values()));
      }
    });
  });
};

module.exports = initSocketServer;
