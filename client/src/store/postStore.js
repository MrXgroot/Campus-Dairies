import { create } from "zustand";
import api from "../utils/api";
import toast from "react-hot-toast";
import useLoaderStore from "../store/loaderStore";

const usePostStore = create((set, get) => ({
  loadingPosts: false,
  publicPosts: [],
  currentPage: 0,
  limit: 12,
  hasMore: true,
  hasMoreGroup: true,
  posts: [],
  tagged: [],
  groupPostMap: {},
  groupPageMap: {},
  hasMoreGroupMap: {},
  singlePost: null,

  // Add new state for category filtering
  currentCategories: [], // Track current selected categories
  isFilterActive: false, // Track if we're filtering by categories

  // Reset public pagination state
  resetPagination: () => {
    set({
      publicPosts: [],
      currentPage: 0, // Reset to 0 to match your existing logic
      hasMore: true,
      currentCategories: [],
      isFilterActive: false,
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

  // ✅ Fetch public posts with pagination (your existing method)
  fetchPublicPosts: async () => {
    const {
      currentPage,
      limit,
      publicPosts,
      hasMore,
      loadingPosts,
      isFilterActive,
    } = get();

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
        // Reset category state when fetching all posts
        currentCategories: [],
        isFilterActive: false,
      });
    } catch (err) {
      console.error("Failed to fetch public posts:", err);
    } finally {
      set({ loadingPosts: false });
    }
  },

  // ✅ New method: Fetch posts by categories
  fetchPostsByCategories: async (categories, resetPosts = false) => {
    const { currentPage, limit, publicPosts, hasMore, loadingPosts } = get();

    if (!hasMore || loadingPosts) return;

    // If resetting or switching categories, start fresh
    if (
      resetPosts ||
      JSON.stringify(get().currentCategories) !== JSON.stringify(categories)
    ) {
      set({
        publicPosts: [],
        currentPage: 0,
        hasMore: true,
        currentCategories: categories,
        isFilterActive: true,
      });
    }

    const { currentPage: updatedPage, publicPosts: updatedPosts } = get();
    const alreadyFetchedPosts = updatedPosts.length;
    const expectedPosts = (updatedPage + 1) * limit;

    if (alreadyFetchedPosts >= expectedPosts && !resetPosts) return;

    set({ loadingPosts: true });

    try {
      const nextPage = updatedPage + 1;
      const categoriesParam = categories.join(",");
      const res = await api.get(
        `/posts/categories?categories=${categoriesParam}&page=${nextPage}&limit=${limit}`
      );
      const newPosts = res.data;

      set({
        publicPosts: resetPosts ? newPosts : [...updatedPosts, ...newPosts],
        hasMore: newPosts.length === limit,
        currentPage: nextPage,
        currentCategories: categories,
        isFilterActive: true,
      });
    } catch (err) {
      console.error("Failed to fetch posts by categories:", err);
      toast.error(`Failed to load ${categories.join(", ")} posts`);
    } finally {
      set({ loadingPosts: false });
    }
  },

  // ✅ Your existing fetchGroupPosts method (unchanged)
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

  // ✅ Your existing reportPost method (unchanged)
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

  // ✅ Updated uploadPost method to handle categories
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
        // Add to public posts regardless of current filter
        // The user should see their new post immediately
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

  // ✅ Your existing toggleLikePost method (unchanged)
  toggleLikePost: async (postId) => {
    console.log("not even callede");
    try {
      const res = await api.post(`/posts/${postId}/like`);
      const updatedPost = res.data.updatedPost;
      console.log(updatedPost, "not data");
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

  // ✅ Your existing commentOnPost method (unchanged)
  commentOnPost: async (postId, comment) => {
    try {
      await api.post(`/posts/${postId}/comment`, { text: comment });
    } catch (err) {
      console.error("Failed to comment:", err);
    }
  },

  // ✅ Updated deleteUploadedPost method to handle both public and group posts
  deleteUploadedPost: async (postId) => {
    console.log(postId);
    let previousPublicPosts, previousPosts, previousGroupPostMap;

    set((state) => {
      previousPublicPosts = state.publicPosts;
      previousPosts = state.posts;
      previousGroupPostMap = state.groupPostMap;

      // Remove from all possible locations
      const updatedGroupPostMap = {};
      for (const groupId in state.groupPostMap) {
        updatedGroupPostMap[groupId] = state.groupPostMap[groupId].filter(
          (post) => post._id !== postId
        );
      }

      return {
        publicPosts: state.publicPosts.filter((post) => post._id !== postId),
        posts: state.posts.filter((post) => post._id !== postId),
        groupPostMap: updatedGroupPostMap,
      };
    });

    try {
      const res = await api.delete(`/posts/${postId}`);
      if (res.data.success || res.status == 200) {
        toast.success("Post deleted successfully");
      }
    } catch (err) {
      console.error("Delete failed, restoring post", err);
      // Rollback
      set({
        publicPosts: previousPublicPosts,
        posts: previousPosts,
        groupPostMap: previousGroupPostMap,
      });
      toast.error("Failed to delete post. Please try again.");
    }
  },

  // ✅ Your existing fetchUploadedPosts method (unchanged)
  fetchUploadedPosts: async () => {
    try {
      const res = await api.get("/posts/my-uploads");
      set({ posts: res.data });
    } catch (err) {
      console.error("Fetch uploaded posts failed:", err);
    }
  },

  // ✅ Your existing fetchTaggedPosts method (unchanged)
  fetchTaggedPosts: async () => {
    try {
      const res = await api.get("/posts/tagged");
      set({ tagged: res.data });
    } catch (err) {
      console.error("Fetch tagged posts failed:", err);
    }
  },

  // ✅ Your existing fetchSinglePost method (unchanged)
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

  // ✅ Helper method to check current filter state
  getCurrentFilterState: () => {
    const { isFilterActive, currentCategories } = get();
    return { isFilterActive, currentCategories };
  },

  // ✅ Method to load more posts based on current state
  loadMorePosts: async () => {
    const { isFilterActive, currentCategories } = get();

    if (isFilterActive && currentCategories.length > 0) {
      await get().fetchPostsByCategories(currentCategories, false);
    } else {
      await get().fetchPublicPosts();
    }
  },
}));

export default usePostStore;
