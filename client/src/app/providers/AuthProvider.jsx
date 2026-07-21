import { useEffect } from "react";
import useAuthStore from "../../store/authStore";
function AuthProvider({ children }) {
  const { isLoggedIn, fetchUser, token } = useAuthStore();
  useEffect(() => {
    if (token && !isLoggedIn) {
      fetchUser();
    }
  }, [token, isLoggedIn, fetchUser]);

  return <>{children}</>;
}

export default AuthProvider;
