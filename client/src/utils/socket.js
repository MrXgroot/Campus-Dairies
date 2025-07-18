import { io } from "socket.io-client";

export const socket = io("https://campus-dairies.onrender.com/api", {
  withCredentials: true,
});
