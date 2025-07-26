import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Lazy-loaded pages
const LoginRegistration = lazy(() => import("./pages/LoginRegistration"));
const HomePage = lazy(() => import("./pages/HomePage"));
const GroupsPage = lazy(() => import("./pages/GroupPage"));
const GroupChatPage = lazy(() => import("./pages/GroupChat"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotificationsPage = lazy(() => import("./pages/NotificationPage"));

// Non-lazy components
import Navbar from "./components/navbar/Navbar";
import CommentModal from "./components/comment/CommentModal";

import useAuthStore from "./store/authStore";
import useNotificationStore from "./store/notificationStore";
import useModalStore from "./store/modalStore";
import useOnlineUserStore from "./store/onlineUserStore";
import { socket } from "./utils/socket";
import SinglePostDisplay from "./pages/SinglePostDisplay";

const App = () => {
  const { isLoggedIn, fetchUser, token, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { showCommentModal, closeCommentModal } = useModalStore();
  const { setOnlineUsers } = useOnlineUserStore();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !isLoggedIn) fetchUser();
  }, [token, isLoggedIn, fetchUser]);

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
    socket.on("online-users", setOnlineUsers);
    return () => socket.off("online-users", setOnlineUsers);
  }, [setOnlineUsers]);

  useEffect(() => {
    socket.on("new-notification", addNotification);
    return () => socket.off("new-notification", addNotification);
  }, [addNotification]);

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login");
    } else if (isLoggedIn && location.pathname === "/login") {
      navigate("/");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <Suspense
        fallback={
          <div className="text-center mt-20 text-black">Loading...</div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginRegistration />} />
          {isLoggedIn && (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groupchat/:id" element={<GroupChatPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:id" element={<SinglePostDisplay />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {showCommentModal && <CommentModal onClose={closeCommentModal} />}
      <Toaster position="bottom-center" reverseOrder={false} />
      {isLoggedIn && location.pathname !== "/login" && <Navbar />}
    </>
  );
};

export default App;
