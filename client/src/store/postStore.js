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

  // Category pagination maps - similar to group maps
  categoryPostMap: {}, // { "all": [...posts], "college": [...posts], "krishna": [...posts] }
  categoryPageMap: {}, // { "all": 2, "college": 1, "krishna": 3 }
  hasMoreCategoryMap: {}, // { "all": true, "college": false, "krishna": true }

  // Current active category (initially null to force first load)
  currentCategory: null,

  // Helper to get category key
  getCategoryKey: (categories) => {
    if (!categories || categories.length === 0) return "all";
    return categories.sort().join(","); // Sort to ensure consistent keys
  },

  // Reset only public posts pagination (keep category maps intact)
  resetPagination: () => {
    set({
      publicPosts: [],
      currentPage: 0,
      hasMore: true,
    });
  },

  // Reset specific category pagination
  resetCategoryPagination: (categoryKey) => {
    const { categoryPostMap, categoryPageMap, hasMoreCategoryMap } = get();

    set({
      categoryPostMap: {
        ...categoryPostMap,
        [categoryKey]: [],
      },
      categoryPageMap: {
        ...categoryPageMap,
        [categoryKey]: 0,
      },
      hasMoreCategoryMap: {
        ...hasMoreCategoryMap,
        [categoryKey]: true,
      },
    });
  },

  // Reset all category maps
  resetAllCategoryPagination: () => {
    set({
      categoryPostMap: {},
      categoryPageMap: {},
      hasMoreCategoryMap: {},
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

  // ✅ Updated fetchPublicPosts to use category maps
  fetchPublicPosts: async () => {
    return get().fetchPostsByCategories([], false);
  },

  // ✅ Updated fetchPostsByCategories with pagination maps
  fetchPostsByCategories: async (categories, forceRefresh = false) => {
    const {
      limit,
      loadingPosts,
      categoryPostMap,
      categoryPageMap,
      hasMoreCategoryMap,
      getCategoryKey,
    } = get();

    const categoryKey = getCategoryKey(categories);

    // Get current state for this category
    const currentPosts = categoryPostMap[categoryKey] || [];
    const currentPage = categoryPageMap[categoryKey] || 0;
    const hasMore = hasMoreCategoryMap[categoryKey] ?? true;

    if (!hasMore || loadingPosts) return;

    // Check if we need to fetch more data
    const alreadyFetchedPosts = currentPosts.length;
    const expectedPosts = (currentPage + 1) * limit;

    // If we already have enough posts for the next page and not forcing refresh, skip fetching
    if (alreadyFetchedPosts >= expectedPosts && !forceRefresh) {
      // Update publicPosts with cached data if switching categories
      if (get().currentCategory !== categoryKey) {
        set({
          publicPosts: currentPosts,
          currentCategory: categoryKey,
        });
      }
      return;
    }

    set({ loadingPosts: true, currentCategory: categoryKey });

    try {
      const nextPage = forceRefresh ? 1 : currentPage + 1;
      let res;

      if (categoryKey === "all") {
        res = await api.get(`/posts/public?page=${nextPage}&limit=${limit}`);
      } else {
        const categoriesParam = categories.join(",");
        res = await api.get(
          `/posts/categories?categories=${categoriesParam}&page=${nextPage}&limit=${limit}`
        );
      }

      const newPosts = res.data;
      const updatedPosts = forceRefresh
        ? newPosts
        : [...currentPosts, ...newPosts];

      set({
        // Update category maps
        categoryPostMap: {
          ...categoryPostMap,
          [categoryKey]: updatedPosts,
        },
        categoryPageMap: {
          ...categoryPageMap,
          [categoryKey]: nextPage,
        },
        hasMoreCategoryMap: {
          ...hasMoreCategoryMap,
          [categoryKey]: newPosts.length === limit,
        },
        // Update current view
        publicPosts: updatedPosts,
        currentPage: nextPage,
        hasMore: newPosts.length === limit,
      });
    } catch (err) {
      console.error("Failed to fetch posts by categories:", err);
      if (categoryKey !== "all") {
        toast.error(`Failed to load ${categories.join(", ")} posts`);
      }
    } finally {
      set({ loadingPosts: false });
    }
  },

  // ✅ Method to switch category (uses cached data if available)
  switchToCategory: async (categories, forceRefresh = false) => {
    const { getCategoryKey, categoryPostMap, currentCategory } = get();
    const categoryKey = getCategoryKey(categories);

    // If already on this category and not forcing refresh, do nothing
    // But allow first mount (when currentCategory is null)
    if (
      currentCategory === categoryKey &&
      !forceRefresh &&
      currentCategory !== null
    ) {
      return;
    }

    // If we have cached data for this category, use it immediately
    const cachedPosts = categoryPostMap[categoryKey];
    if (cachedPosts && cachedPosts.length > 0 && !forceRefresh) {
      const cachedPage = get().categoryPageMap[categoryKey] || 0;
      const cachedHasMore = get().hasMoreCategoryMap[categoryKey] ?? true;

      set({
        publicPosts: cachedPosts,
        currentPage: cachedPage,
        hasMore: cachedHasMore,
        currentCategory: categoryKey,
      });
      return;
    }

    // Otherwise fetch fresh data
    await get().fetchPostsByCategories(categories, forceRefresh);
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
          // Update all category maps
          categoryPostMap: Object.keys(state.categoryPostMap).reduce(
            (acc, key) => {
              acc[key] = state.categoryPostMap[key].map((post) =>
                post._id === postId ? updatedPost : post
              );
              return acc;
            },
            {}
          ),
          // Update group maps
          groupPostMap: Object.keys(state.groupPostMap).reduce((acc, key) => {
            acc[key] = state.groupPostMap[key].map((post) =>
              post._id === postId ? updatedPost : post
            );
            return acc;
          }, {}),
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

      if (isGroupPost && postData.groupId) {
        const { groupPostMap } = get();
        const groupId = postData.groupId;
        const existingPosts = groupPostMap[groupId] || [];

        set((state) => ({
          groupPostMap: {
            ...groupPostMap,
            [groupId]: [newPost, ...existingPosts],
          },
        }));
      } else {
        // Add to current public posts and all relevant category caches
        set((state) => {
          const updatedCategoryPostMap = { ...state.categoryPostMap };

          // Add to "all" category
          if (updatedCategoryPostMap["all"]) {
            updatedCategoryPostMap["all"] = [
              newPost,
              ...updatedCategoryPostMap["all"],
            ];
          }

          // Add to specific categories if the post belongs to them
          if (postData.categories && Array.isArray(postData.categories)) {
            postData.categories.forEach((category) => {
              if (updatedCategoryPostMap[category]) {
                updatedCategoryPostMap[category] = [
                  newPost,
                  ...updatedCategoryPostMap[category],
                ];
              }
            });
          }

          return {
            publicPosts: [newPost, ...state.publicPosts],
            categoryPostMap: updatedCategoryPostMap,
          };
        });
      }

      toast.success("Post uploaded successfully");
    } catch (err) {
      toast.error("Post upload failed");
      console.error("Post upload failed:", err);
    } finally {
      setTimeout(() => setUploading(false), 500);
    }
  },

  // ✅ Updated toggleLikePost method to update all maps
  toggleLikePost: async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      const updatedPost = res.data.updatedPost;

      set((state) => ({
        // Update current public posts
        publicPosts: state.publicPosts.map((post) =>
          post._id === postId ? updatedPost : post
        ),
        // Update all category maps
        categoryPostMap: Object.keys(state.categoryPostMap).reduce(
          (acc, key) => {
            acc[key] = state.categoryPostMap[key].map((post) =>
              post._id === postId ? updatedPost : post
            );
            return acc;
          },
          {}
        ),
        // Update all group maps
        groupPostMap: Object.keys(state.groupPostMap).reduce((acc, key) => {
          acc[key] = state.groupPostMap[key].map((post) =>
            post._id === postId ? updatedPost : post
          );
          return acc;
        }, {}),
      }));
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

  // ✅ Updated deleteUploadedPost method to handle all maps
  deleteUploadedPost: async (postId) => {
    let previousState;

    set((state) => {
      previousState = {
        publicPosts: state.publicPosts,
        posts: state.posts,
        categoryPostMap: state.categoryPostMap,
        groupPostMap: state.groupPostMap,
      };

      return {
        publicPosts: state.publicPosts.filter((post) => post._id !== postId),
        posts: state.posts.filter((post) => post._id !== postId),
        // Remove from all category maps
        categoryPostMap: Object.keys(state.categoryPostMap).reduce(
          (acc, key) => {
            acc[key] = state.categoryPostMap[key].filter(
              (post) => post._id !== postId
            );
            return acc;
          },
          {}
        ),
        // Remove from all group maps
        groupPostMap: Object.keys(state.groupPostMap).reduce((acc, key) => {
          acc[key] = state.groupPostMap[key].filter(
            (post) => post._id !== postId
          );
          return acc;
        }, {}),
      };
    });

    try {
      const res = await api.delete(`/posts/${postId}`);
      if (res.data.success || res.status === 200) {
        toast.success("Post deleted successfully");
      }
    } catch (err) {
      console.error("Delete failed, restoring state", err);
      // Rollback to previous state
      set(previousState);
      toast.error("Failed to delete post. Please try again.");
    }
  },

  // ✅ Your existing methods (unchanged)
  fetchUploadedPosts: async () => {
    try {
      const res = await api.get("/posts/my-uploads");
      set({ posts: res.data });
    } catch (err) {
      console.error("Fetch uploaded posts failed:", err);
    }
  },

  fetchTaggedPosts: async () => {
    try {
      const res = await api.get("/posts/tagged");
      set({ tagged: res.data });
    } catch (err) {
      console.error("Fetch tagged posts failed:", err);
    }
  },

  fetchSinglePost: async (postId) => {
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

  // ✅ Helper method to get current filter state
  getCurrentFilterState: () => {
    const { currentCategory } = get();
    return {
      isFilterActive: currentCategory !== "all" && currentCategory !== null,
      currentCategories:
        currentCategory === "all" || currentCategory === null
          ? []
          : currentCategory.split(","),
    };
  },

  // ✅ Method to load more posts based on current category
  loadMorePosts: async () => {
    const { currentCategory } = get();

    if (currentCategory === "all" || currentCategory === null) {
      await get().fetchPostsByCategories([], false);
    } else {
      const categories = currentCategory.split(",");
      await get().fetchPostsByCategories(categories, false);
    }
  },

  // ✅ Method to refresh current category
  refreshCurrentCategory: async () => {
    const { currentCategory } = get();

    if (currentCategory === "all" || currentCategory === null) {
      await get().fetchPostsByCategories([], true);
    } else {
      const categories = currentCategory.split(",");
      await get().fetchPostsByCategories(categories, true);
    }
  },
}));

export default usePostStore;
