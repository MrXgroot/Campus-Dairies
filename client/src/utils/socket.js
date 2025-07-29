import { io } from "socket.io-client";

export const socket = io("https://campus-dairies.onrender.com", {
  withCredentials: true,
});
// http://localhost:3000
// https://campus-dairies.onrender.com
