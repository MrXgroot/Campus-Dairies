// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://campus-dairies.onrender.com/api", // or your production URL
  withCredentials: true,
});

// Add JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
