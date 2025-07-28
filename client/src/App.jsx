import React, {
  useEffect,
  lazy,
  Suspense,
  useMemo,
  useCallback,
  memo,
} from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Lazy-loaded pages with better chunking
const LoginRegistration = lazy(() =>
  import("./pages/LoginRegistration").then((module) => ({
    default: module.default,
  }))
);
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({
    default: module.default,
  }))
);
const GroupsPage = lazy(() =>
  import("./pages/GroupPage").then((module) => ({
    default: module.default,
  }))
);
const GroupChatPage = lazy(() =>
  import("./pages/GroupChat").then((module) => ({
    default: module.default,
  }))
);
const Profile = lazy(() =>
  import("./pages/ProfilePage").then((module) => ({
    default: module.default,
  }))
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((module) => ({
    default: module.default,
  }))
);
const NotificationsPage = lazy(() =>
  import("./pages/NotificationPage").then((module) => ({
    default: module.default,
  }))
);
const SinglePostDisplay = lazy(() =>
  import("./pages/SinglePostDisplay").then((module) => ({
    default: module.default,
  }))
);

// Non-lazy components
import Navbar from "./components/navbar/Navbar";
import CommentModal from "./components/comment/CommentModal";

import useAuthStore from "./store/authStore";
import useSocketMessageStore from "./store/socketMessageStore";
import useModalStore from "./store/modalStore";
import useOnlineUserStore from "./store/onlineUserStore";
import { socket } from "./utils/socket";

// Memoized Loading Component
const LoadingFallback = memo(() => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-white gap-6 font-sans z-50">
    {/* Spinner */}
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

    {/* App Name */}
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      CampusDiaries
    </h1>
  </div>
));

// Memoized Routes Array
const authenticatedRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/groups", element: <GroupsPage /> },
  { path: "/groupchat/:id", element: <GroupChatPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/profile", element: <Profile /> },
  { path: "/post/:id", element: <SinglePostDisplay /> },
];

// Memoized Comment Modal Component
const ConditionalCommentModal = memo(
  ({ showCommentModal, closeCommentModal }) => {
    if (!showCommentModal) return null;
    return <CommentModal onClose={closeCommentModal} />;
  }
);

// Memoized Navbar Component
const ConditionalNavbar = memo(({ isLoggedIn, pathname }) => {
  if (!isLoggedIn || pathname === "/login") return null;
  return <Navbar />;
});

// Memoized Toaster Component
const MemoizedToaster = memo(() => (
  <Toaster
    position="bottom-center"
    reverseOrder={false}
    toastOptions={{
      duration: 4000,
      style: {
        background: "#363636",
        color: "#fff",
      },
    }}
  />
));

const App = () => {
  // Store hooks
  const { isLoggedIn, fetchUser, token, user } = useAuthStore();
  const { addNewNotification } = useSocketMessageStore();
  const { showCommentModal, closeCommentModal } = useModalStore();
  const { setOnlineUsers } = useOnlineUserStore();

  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Memoized values
  const currentPath = useMemo(() => location.pathname, [location.pathname]);
  const shouldShowNavbar = useMemo(
    () => isLoggedIn && currentPath !== "/login",
    [isLoggedIn, currentPath]
  );

  // Memoized authenticated routes
  const memoizedAuthRoutes = useMemo(
    () =>
      authenticatedRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      )),
    []
  );

  // Callbacks for socket events
  const handleOnlineUsers = useCallback(
    (users) => {
      setOnlineUsers(users);
    },
    [setOnlineUsers]
  );

  const handleNewNotification = useCallback(
    (notification) => {
      addNewNotification(notification);
    },
    [addNewNotification]
  );

  const handleCloseCommentModal = useCallback(() => {
    closeCommentModal();
  }, [closeCommentModal]);

  // Socket registration callback
  const registerSocket = useCallback(() => {
    if (user?._id) {
      socket.emit("register", {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
      });
    }
  }, [user?._id, user?.username, user?.avatar]);

  // Effects

  // Authentication effect
  useEffect(() => {
    if (token && !isLoggedIn) {
      fetchUser();
    }
  }, [token, isLoggedIn, fetchUser]);

  // Socket registration effect
  useEffect(() => {
    registerSocket();
  }, [registerSocket]);

  // Socket listeners effect - online users
  useEffect(() => {
    socket.on("online-users", handleOnlineUsers);
    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [handleOnlineUsers]);

  // Socket listeners effect - notifications
  useEffect(() => {
    socket.on("new-notification", handleNewNotification);
    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [handleNewNotification]);

  // Navigation effect
  useEffect(() => {
    if (!isLoggedIn && currentPath !== "/login") {
      navigate("/login", { replace: true });
    } else if (isLoggedIn && currentPath === "/login") {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, currentPath, navigate]);

  // Cleanup effect for socket connections
  useEffect(() => {
    return () => {
      // Cleanup socket listeners on unmount
      socket.off("online-users");
      socket.off("new-notification");
    };
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginRegistration />} />
          {isLoggedIn && memoizedAuthRoutes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <ConditionalCommentModal
        showCommentModal={showCommentModal}
        closeCommentModal={handleCloseCommentModal}
      />

      <MemoizedToaster />

      <ConditionalNavbar isLoggedIn={isLoggedIn} pathname={currentPath} />
    </>
  );
};

export default App;
