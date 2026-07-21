import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const LoginRegistration = lazy(() => import("../pages/LoginRegistration"));
const HomePage = lazy(() => import("../pages/HomePage"));
const GroupsPage = lazy(() => import("../pages/GroupPage"));
const GroupChatPage = lazy(() => import("../pages/GroupChat"));
const Profile = lazy(() => import("../pages/ProfilePage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const NotificationsPage = lazy(() => import("../pages/NotificationPage"));
const SinglePostDisplay = lazy(() => import("../pages/SinglePostDisplay"));
import LoadingScreen from "../../shared/components/LoadingScreen";
const MessagePage = lazy(() => import("../pages/MessagePage"));
import ProtectedRoute from "./ProtectedRoute";
// import DesktopLayout from "../layouts/DesktopLayout";
import MobileLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginRegistration";
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        Public Routes
        <Route element={<MobileLayout />}>
          <Route path="/login" element={<LoginRegistration />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/post/:id" element={<SinglePostDisplay />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/messagewall" element={<MessagePage />} />
            <Route path="/groupchat/:id" element={<GroupChatPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Protected Routes */}
      </Routes>
    </Suspense>
  );
}
export default AppRoutes;
