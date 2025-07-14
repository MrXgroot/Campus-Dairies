import { create } from "zustand";
import api from "../utils/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || "",
  isLoggedIn: false,
  isLoading: false,

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, isLoggedIn: true });
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  googleLogin: async (googleToken) => {
    console.log(googleToken);
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/google", { token: googleToken });
      const { user, token } = res.data;
      console.log(token, res);
      localStorage.setItem("token", token);
      set({ user, token, isLoggedIn: true });
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/register", formData);
      console.log(res);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, isLoggedIn: true });
    } catch (err) {
      console.error("Register failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    console.log("fuck");
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data, isLoggedIn: true });
    } catch (err) {
      console.error("Auth fetch error:", err);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: "", isLoggedIn: false });
  },
}));

export default useAuthStore;
