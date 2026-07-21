import { useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import { socket } from "../../../utils/socket";

function useSocketRegistration() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("register", {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
    });
  }, [user]);
}

export default useSocketRegistration;
