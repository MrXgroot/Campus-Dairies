import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginRegistration from "./pages/LoginRegistration";
import HomePage from "./pages/HomePage";
import GroupsPage from "./pages/GroupPage";
import GroupChatPage from "./pages/GroupChat";
import Profile from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
import useAuthStore from "./store/authStore";

const App = () => {
  const { isLoggedIn, fetchUser, token } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // On mount, if token exists but user not loaded, fetch user
  useEffect(() => {
    if (token && !isLoggedIn) {
      fetchUser();
    }
  }, [token, isLoggedIn, fetchUser]);

  // If not logged in, redirect to login (unless already on login page)
  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginRegistration />} />

        {/* Authenticated routes */}
        {isLoggedIn && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groupChat" element={<GroupChatPage />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Navbar visible only when logged in and not on login page */}
      {isLoggedIn && location.pathname !== "/login" && <Navbar />}
    </>
  );
};

export default App;
