// store/messageWallStore.js
import { create } from "zustand";
import api from "../utils/api"; // Axios instance with baseURL
import toast from "react-hot-toast";

const useMessageWallStore = create((set, get) => ({
  // State
  messages: [],
  loading: false,
  sending: false,
  hasMore: true,
  currentPage: 1,
  searchTerm: "",
  error: null,

  // Actions
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  // Fetch messages with pagination and search
  fetchMessages: async (page = 1, search = "", reset = false) => {
    const state = get();

    // Avoid duplicate requests
    if (state.loading) return;

    set({ loading: true, error: null });

    try {
      const response = await api.get("/messagewall", {
        params: {
          page,
          limit: 20,
          search,
        },
      });

      const { messages, pagination } = response.data.data;

      set({
        messages: reset ? messages : [...state.messages, ...messages],
        hasMore: pagination.hasMore,
        currentPage: pagination.currentPage,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch messages error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch messages";

      set({
        error: errorMessage,
        loading: false,
      });

      toast.error(errorMessage);
    }
  },

  // Create new message
  createMessage: async (content) => {
    const state = get();

    if (state.sending) return;

    set({ sending: true, error: null });

    try {
      const response = await api.post("/messagewall", { content });

      const newMessage = response.data.data;

      // Add new message to the beginning of the list
      set({
        messages: [newMessage, ...state.messages],
        sending: false,
      });

      toast.success("Message posted successfully!");
      return true;
    } catch (error) {
      console.error("Create message error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to post message";

      set({
        error: errorMessage,
        sending: false,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const state = get();

    try {
      await api.delete(`/messagewall/${messageId}`);

      // Remove message from local state
      set({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      });

      toast.success("Message deleted successfully!");
      return true;
    } catch (error) {
      console.error("Delete message error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete message";

      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  },

  // Report message
  reportMessage: async (messageId, reason = "other") => {
    try {
      await api.post(`/messagewall/${messageId}/report`, { reason });

      toast.success("Message reported successfully!");
      return true;
    } catch (error) {
      console.error("Report message error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to report message";

      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  },

  // Load more messages (for infinite scroll)
  loadMoreMessages: async () => {
    const state = get();

    if (!state.hasMore || state.loading) return;

    await get().fetchMessages(state.currentPage + 1, state.searchTerm, false);
  },

  // Search messages
  searchMessages: async (searchTerm) => {
    set({ searchTerm });

    // Reset and fetch with search term
    await get().fetchMessages(1, searchTerm, true);
  },

  // Refresh messages (pull to refresh)
  refreshMessages: async () => {
    const state = get();
    await get().fetchMessages(1, state.searchTerm, true);
  },

  // Clear all messages (for logout)
  clearMessages: () => {
    set({
      messages: [],
      loading: false,
      sending: false,
      hasMore: true,
      currentPage: 1,
      searchTerm: "",
      error: null,
    });
  },

  // Update message locally (for optimistic updates)
  updateMessageLocally: (messageId, updates) => {
    const state = get();
    set({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, ...updates } : msg
      ),
    });
  },

  // Get message by ID
  getMessageById: (messageId) => {
    const state = get();
    return state.messages.find((msg) => msg._id === messageId);
  },

  // Get user's messages count
  getUserMessagesCount: (userId) => {
    const state = get();
    return state.messages.filter((msg) => msg.author._id === userId).length;
  },
}));

export default useMessageWallStore;
