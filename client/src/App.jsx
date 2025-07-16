import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginRegistration from "./pages/LoginRegistration";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupPage";
import GroupChatPage from "./pages/GroupChat";
import Profile from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
import NotificationsPage from "./pages/NotificationPage";

import useAuthStore from "./store/authStore";
import useNotificationStore from "./store/notificationStore";
import { socket } from "./utils/socket";
import useOnlineUserStore from "./store/onlineUserStore";
const App = () => {
  const { isLoggedIn, fetchUser, token, user } = useAuthStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const setOnlineUsers = useOnlineUserStore((state) => state.setOnlineUsers);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Auth & user initialization
  useEffect(() => {
    if (token && !isLoggedIn) {
      fetchUser();
    }
  }, [token, isLoggedIn, fetchUser]);

  // ✅ Socket registration
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
      });
    }
  }, [user?._id]);

  useEffect(() => {
    const handleOnlineUsers = (data) => {
      console.log("Online Users:", data); // <-- See the data here
      setOnlineUsers(data);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => socket.off("online-users", handleOnlineUsers);
  }, []);

  // ✅ Notification listener
  useEffect(() => {
    const handler = (notif) => {
      addNotification(notif);
    };
    socket.on("new-notification", handler);
    return () => socket.off("new-notification", handler);
  }, [addNotification]);

  // ✅ Route redirection
  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login");
    } else if (isLoggedIn && location.pathname === "/login") {
      navigate("/");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginRegistration />} />

        {isLoggedIn && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groupchat/:id" element={<GroupChatPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {isLoggedIn && location.pathname !== "/login" && <Navbar />}
    </>
  );
};

export default App;
