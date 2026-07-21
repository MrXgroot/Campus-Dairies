import useSocketRegistration from "../hooks/socket/useSocketRegistration";
import useOnlineUsers from "../hooks/socket/useOnlineUsers";
import useNotificationListener from "../hooks/socket/useNotificationListener";

function SocketProvider({ children }) {
  useSocketRegistration();
  useOnlineUsers();
  useNotificationListener();

  return <>{children}</>;
}

export default SocketProvider;
