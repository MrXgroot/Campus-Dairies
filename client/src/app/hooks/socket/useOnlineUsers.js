import { useEffect } from "react";
import useOnlineUserStore from "../../../store/onlineUserStore";
import { socket } from "../../../utils/socket";

function useOnlineUsers() {
  const { setOnlineUsers } = useOnlineUserStore();

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [setOnlineUsers]);
}

export default useOnlineUsers;
