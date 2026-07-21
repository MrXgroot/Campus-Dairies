// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // or your production URL
  withCredentials: true,
});

// Add JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    console.log("Body:", config.data);
    console.groupEnd();
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error", error);
    return Promise.reject(error);
  },
);
api.interceptors.response.use(
  (response) => {
    console.group(`✅ ${response.status} ${response.config.url}`);
    console.log("Response:", response.data);
    console.groupEnd();

    return response;
  },
  (error) => {
    console.group(`❌ ${error.response?.status} ${error.config?.url}`);
    console.log("Response:", error.response?.data);
    console.log("Headers:", error.response?.headers);
    console.trace("Who made this request?");
    console.groupEnd();

    return Promise.reject(error);
  },
);

export default api;

// https://campus-dairies.onrender.com/
// http://localhost:3000
