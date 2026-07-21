import React from "react";
import { Toaster } from "react-hot-toast";
const ToastProvider = ({ children }) => {
  return (
    <>
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

      {children}
    </>
  );
};

export default ToastProvider;
