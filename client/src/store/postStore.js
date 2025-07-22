import { create } from "zustand";
import api from "../utils/api";
import toast from "react-hot-toast";
import useLoaderStore from "../store/loaderStore";
const usePostStore = create((set, get) => ({
  loadingPosts: false,
  publicPosts: [],
  groupPosts: [],
  currentPage: 1,
  groupPage: 1,
  limit: 12,
  hasMore: true,
  hasMoreGroup: true,
  posts: [],
  tagged: [],

  // Reset public pagination state
  resetPagination: () => {
    set({
      publicPosts: [],
      currentPage: 1,
      hasMore: true,
    });
  },

  // Reset group pagination state
  resetGroupPagination: () => {
    set({
      groupPosts: [],
      groupPage: 1,
      hasMoreGroup: true,
    });
  },

  // ✅ Fetch public posts with pagination
  fetchPublicPosts: async () => {
    const { currentPage, limit, publicPosts } = get();
    set({ loadingPosts: true });

    try {
      const res = await api.get(
        `/posts/public?page=${currentPage}&limit=${limit}`
      );
      const newPosts = res.data;

      set({
        publicPosts: [...publicPosts, ...newPosts],
        hasMore: newPosts.length === limit,
        currentPage: currentPage + 1,
      });
    } catch (err) {
      console.error("Failed to fetch public posts:", err);
    } finally {
      set({ loadingPosts: false });
    }
  },

  // ✅ Fetch group posts with pagination
  fetchGroupPosts: async (groupId) => {
    const { groupPage, limit, groupPosts } = get();
    set({ loadingPosts: true });

    try {
      const res = await api.get(
        `/posts/group/${groupId}?page=${groupPage}&limit=${limit}`
      );
      const newPosts = res.data;

      set({
        groupPosts: [...groupPosts, ...newPosts],
        hasMoreGroup: newPosts.length === limit,
        groupPage: groupPage + 1,
      });
    } catch (err) {
      console.error("Failed to fetch group posts:", err);
    } finally {
      set({ loadingPosts: false });
    }
  },

  // 🆕 Report a post (toggle like/dislike style)
  reportPost: async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/report`);
      const updatedPost = res.data?.post;

      if (updatedPost) {
        set((state) => ({
          publicPosts: state.publicPosts.map((post) =>
            post._id === postId ? updatedPost : post
          ),
          groupPosts: state.groupPosts.map((post) =>
            post._id === postId ? updatedPost : post
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to report post:", err);
    }
  },

  // Already existing logic:
  uploadPost: async (formData, isGroupPost) => {
    console.log(formData);
    const { setUploading } = useLoaderStore.getState();

    setUploading(true);
    try {
      const res = await api.post("/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newPost = res.data;
      console.log(res.data);

      if (isGroupPost) {
        set((state) => ({
          publicPosts: [newPost, ...state.publicPosts],
        }));
      } else {
        set((state) => ({
          groupPosts: [newPost, ...state.groupPosts],
        }));
      }
      toast.success("Post uploaded successfully");
    } catch (err) {
      toast.error("Post upload failed");
      console.error("Post upload failed:", err);
    } finally {
      setTimeout(() => setUploading(false), 500);
    }
  },

  reactToPost: async (postId, reactionType) => {
    try {
      const res = await api.post(`/posts/${postId}/react`, { reactionType });
      const updatedPost = res.data.post;

      set((state) => ({
        publicPosts: state.publicPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
        groupPosts: state.groupPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
      }));
    } catch (err) {
      console.error("Failed to react:", err);
    }
  },

  commentOnPost: async (postId, comment) => {
    try {
      await api.post(`/posts/${postId}/comment`, { text: comment });
    } catch (err) {
      console.error("Failed to comment:", err);
    }
  },

  deleteUploadedPost: async (postId) => {
    console.log(postId);
    let previousPosts;
    set((state) => {
      previousPosts = state.posts;
      return {
        posts: state.posts.filter((post) => post._id !== postId),
      };
    });

    try {
      const res = await api.delete(`/posts/${postId}`);
      if (res.data.success || res.status == 200) {
        toast.success("Post deleted sucessfully");
      }
    } catch (err) {
      console.error("Delete failed, restoring post", err);
      // Rollback
      set({ posts: previousPosts });

      toast.error("Failed to delete post. Please try again.");
    }
  },
  // Get user's uploaded posts
  fetchUploadedPosts: async () => {
    try {
      const res = await api.get("/posts/my-uploads");
      console.log(res.data);
      set({ posts: res.data });
    } catch (err) {
      console.error("Fetch uploaded posts failed:", err);
    }
  },

  // Get posts user is tagged in
  fetchTaggedPosts: async () => {
    try {
      const res = await api.get("/posts/tagged");
      set({ tagged: res.data });
    } catch (err) {
      console.error("Fetch tagged posts failed:", err);
    }
  },
}));

export default usePostStore;
