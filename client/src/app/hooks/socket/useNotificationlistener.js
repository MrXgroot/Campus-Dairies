import { useEffect } from "react";
import useSocketMessageStore from "../../../store/socketMessageStore";
import { socket } from "../../../utils/socket";

function useNotificationListener() {
  const { addNewNotification } = useSocketMessageStore();

  useEffect(() => {
    const handleNotification = (notification) => {
      addNewNotification(notification);
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);
    };
  }, [addNewNotification]);
}

export default useNotificationListener;
