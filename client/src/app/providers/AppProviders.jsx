import AuthProvider from "./AuthProvider";
import SocketProvider from "./SocketProvider";
import ToastProvider from "./ToastProvider";
import ModalProvider from "./ModalProvider";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default AppProviders;
