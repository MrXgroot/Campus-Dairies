import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import LoadingScreen from "../../shared/components/LoadingScreen";

function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuthStore();
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
