import { create } from "zustand";
import api from "../utils/api";
import toast from "react-hot-toast";
import useLoaderStore from "../store/loaderStore";
const usePostStore = create((set, get) => ({
  loadingPosts: false,
  publicPosts: [],
  currentPage: 0,
  limit: 2,
  hasMore: true,
  hasMoreGroup: true,
  posts: [],
  tagged: [],
  groupPostMap: {},
  groupPageMap: {},
  hasMoreGroupMap: {},
  singlePost: null,

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
    const { currentPage, limit, publicPosts, hasMore, loadingPosts } = get();

    if (!hasMore || loadingPosts) return;

    const alreadyFetchedPosts = publicPosts.length;
    const expectedPosts = (currentPage + 1) * limit;

    // If we already have enough posts for the next page, skip fetching
    if (alreadyFetchedPosts >= expectedPosts) return;

    set({ loadingPosts: true });

    try {
      const nextPage = currentPage + 1;
      const res = await api.get(
        `/posts/public?page=${nextPage}&limit=${limit}`
      );
      const newPosts = res.data;
      set({
        publicPosts: [...publicPosts, ...newPosts],
        hasMore: newPosts.length === limit,
        currentPage: nextPage,
      });
    } catch (err) {
      console.error("Failed to fetch public posts:", err);
    } finally {
      set({ loadingPosts: false });
    }
  },

  fetchGroupPosts: async (groupId) => {
    const { groupPostMap, groupPageMap, hasMoreGroupMap, limit, loadingPosts } =
      get();

    const currentPosts = groupPostMap[groupId] || [];
    const currentPage = groupPageMap[groupId] || 0;
    const hasMore = hasMoreGroupMap[groupId] ?? true;

    if (!hasMore || loadingPosts) return;

    const expectedPosts = (currentPage + 1) * limit;
    if (currentPosts.length >= expectedPosts) return;

    set({ loadingPosts: true });

    try {
      const nextPage = currentPage + 1;
      const res = await api.get(
        `/posts/group/${groupId}?page=${nextPage}&limit=${limit}`
      );
      const newPosts = res.data;

      set({
        groupPostMap: {
          ...groupPostMap,
          [groupId]: [...currentPosts, ...newPosts],
        },
        groupPageMap: {
          ...groupPageMap,
          [groupId]: nextPage,
        },
        hasMoreGroupMap: {
          ...hasMoreGroupMap,
          [groupId]: newPosts.length === limit,
        },
      });
    } catch (err) {
      console.error("Failed to fetch group posts:", err);
    } finally {
      set({ loadingPosts: false });
    }
  },
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

  uploadPost: async (postData, isGroupPost) => {
    const { setUploading } = useLoaderStore.getState();
    setUploading(true);

    try {
      const res = await api.post("/posts/upload", postData);
      const newPost = res.data;
      console.log(postData.groupId, isGroupPost);
      if (isGroupPost && postData.groupId) {
        console.log("updated");
        const { groupPostMap } = get();
        const groupId = postData.groupId;

        const existingPosts = groupPostMap[groupId] || [];
        console.log(existingPosts);
        set((state) => ({
          groupPostMap: {
            ...groupPostMap,
            [groupId]: [newPost, ...existingPosts],
          },
        }));
      } else {
        set((state) => ({
          publicPosts: [newPost, ...state.publicPosts],
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

  toggleLikePost: async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      const updatedPost = res.data.post;

      const { publicPosts, groupPostMap } = get();

      // Update public posts
      const updatedPublicPosts = publicPosts.map((post) =>
        post._id === postId ? updatedPost : post
      );

      // Update all group maps that might contain the post
      const updatedGroupPostMap = {};
      for (const groupId in groupPostMap) {
        updatedGroupPostMap[groupId] = groupPostMap[groupId].map((post) =>
          post._id === postId ? updatedPost : post
        );
      }

      set({
        publicPosts: updatedPublicPosts,
        groupPostMap: updatedGroupPostMap,
      });
    } catch (err) {
      console.error("Failed to like/unlike post:", err);
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

  fetchSinglePost: async (postId) => {
    console.log("calling");
    set({ loadingPosts: true });
    try {
      const res = await api.get(`/posts/taggedpost/${postId}`);
      set({ singlePost: res.data });
    } catch (err) {
      console.error("fetching the tagged post failed", err);
    } finally {
      set({ loadingPosts: false });
    }
  },
}));

export default usePostStore;
