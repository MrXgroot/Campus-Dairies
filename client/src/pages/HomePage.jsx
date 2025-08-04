import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import Header from "../components/header/Header";
import PostCard from "../components/post/PostCard";
import PostModal from "../components/postModal/PostModal";
import usePostStore from "../store/postStore";
import { socket } from "../utils/socket";
import useUserStore from "../store/userStore";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  Plus,
  MoreVertical,
  Camera,
  Image,
  X,
  RefreshCw,
  Filter,
  TrendingUp,
  ThumbsDown,
  CheckCircle,
} from "lucide-react";
import useOnlineUserStore from "../store/onlineUserStore";
import useGroupStore from "../store/groupStore";

// Memoized components (unchanged)
const StoriesSection = memo(({ stories, onClick }) => {
  const handleStoryClick = useCallback(
    (storyId) => {
      onClick(storyId);
    },
    [onClick]
  );

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <StoryItem key={story._id} story={story} onClick={handleStoryClick} />
        ))}
      </div>
    </div>
  );
});

const StoryItem = memo(({ story, onClick }) => {
  const handleDoubleClick = useCallback(() => {
    onClick(story._id);
  }, [story._id, onClick]);

  const storyClassName = useMemo(() => {
    if (story.isAdd) {
      return "bg-gray-200 dark:bg-gray-700";
    }
    return story.isViewed
      ? "bg-gray-300"
      : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500";
  }, [story.isAdd, story.isViewed]);

  return (
    <div className="flex-shrink-0 text-center cursor-pointer hover:scale-105 transition-transform active:scale-95">
      <div
        onDoubleClick={handleDoubleClick}
        className={`relative ${storyClassName} p-1 rounded-full relative`}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white dark:bg-gray-800 p-0.5">
          {story.isAdd ? (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
          ) : (
            <img
              src={story.avatar}
              referrerPolicy="no-refferer"
              alt={story.username}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          )}
        </div>
        <div className="absolute w-4 h-4 bg-green-500 rounded-full left-[70%] bottom-[2%] border-2 border-white" />
      </div>
      <p className="text-xs mt-1 text-gray-700 dark:text-gray-300 truncate w-16">
        {story.username}
      </p>
    </div>
  );
});

const FilterSection = memo(
  ({ filters, selectedFilter, setSelectedFilter, loading }) => {
    const handleFilterClick = useCallback(
      (filter) => {
        setSelectedFilter(filter);
      },
      [setSelectedFilter]
    );

    return (
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              filter={filter}
              isSelected={selectedFilter === filter}
              onClick={handleFilterClick}
              disabled={loading}
            />
          ))}
        </div>
      </div>
    );
  }
);

const FilterButton = memo(({ filter, isSelected, onClick, disabled }) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick(filter);
    }
  }, [filter, onClick, disabled]);

  const buttonClassName = useMemo(() => {
    const baseClasses =
      "px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0";
    const stateClasses = disabled
      ? "opacity-50 cursor-not-allowed"
      : "active:scale-95";
    const styleClasses = isSelected
      ? "bg-blue-500 text-white shadow-lg"
      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

    return `${baseClasses} ${stateClasses} ${styleClasses}`;
  }, [isSelected, disabled]);

  const displayText = useMemo(() => {
    if (filter === "all") return "All";
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  }, [filter]);

  return (
    <button
      onClick={handleClick}
      className={buttonClassName}
      disabled={disabled}
    >
      {displayText}
    </button>
  );
});

const FloatingActionButton = memo(({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform duration-200"
  >
    <Plus className="w-6 h-6 text-white" />
  </button>
));

const LoadingScreen = memo(() => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
      <p className="text-gray-600 dark:text-gray-300">Loading your feed...</p>
    </div>
  </div>
));

const PostItem = memo(({ post, index, handleDeletePost }) => {
  const deleteHandler = useCallback(() => {
    handleDeletePost(post._id);
  }, [post._id, handleDeletePost]);

  const animationStyle = useMemo(
    () => ({
      animation: `fadeIn 0.6s ease-out ${index * 0.1}s forwards`,
    }),
    [index]
  );

  return (
    <div className="opacity-0 animate-fade-in" style={animationStyle}>
      <PostCard post={post} handleDeletePost={deleteHandler} />
    </div>
  );
});

const HomePage = () => {
  // State
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refs
  const observerRef = useRef();

  // Store hooks
  const { sendWaveToUser } = useUserStore();
  const {
    publicPosts,
    switchToCategory,
    hasMore,
    loadingPosts: loading,
    deleteUploadedPost,
    loadMorePosts,
    getCurrentFilterState,
    refreshCurrentCategory,
  } = usePostStore();
  const onlineUsers = useOnlineUserStore((state) => state.onlineUsers);
  const { fetchJoinedGroups } = useGroupStore();

  // Updated filters to match your categories
  const filters = useMemo(
    () => [
      "all",
      "college",
      "krishna",
      "msc",
      "mca",
      "farewell",
      "trip",
      "boyshostel",
      "girlshostel",
    ],
    []
  );

  // Memoized filtered posts (now only for search filtering)
  const filteredPosts = useMemo(() => {
    return publicPosts.filter((post) => {
      const matchesSearch =
        post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.createdBy?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [publicPosts, searchTerm]);

  // Callbacks
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refreshCurrentCategory();
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, [refreshCurrentCategory]);

  const handleDeletePost = useCallback(
    (postId) => {
      deleteUploadedPost(postId);
    },
    [deleteUploadedPost]
  );

  const handleWaveToUser = useCallback(
    (userId) => {
      sendWaveToUser(userId);
    },
    [sendWaveToUser]
  );

  const handleShowCreatePost = useCallback(() => {
    setShowCreatePost(true);
  }, []);

  const handleCloseCreatePost = useCallback(() => {
    setShowCreatePost(false);
  }, []);

  const handleSetSelectedFilter = useCallback(
    (filter) => {
      setSelectedFilter(filter);
      // Switch to the selected category using the new method
      const categories = filter === "all" ? [] : [filter];
      switchToCategory(categories);
    },
    [switchToCategory]
  );

  const handleSetSearchTerm = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Load more posts based on current filter
  const loadMorePostsHandler = useCallback(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      await fetchJoinedGroups();
      // Load initial data for "all" category
      await switchToCategory([]);
    };

    initializeData();
  }, [fetchJoinedGroups, switchToCategory]);

  // Intersection Observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [hasMore, loading, loadMorePosts]);

  // Early return for initial loading state
  if (loading && publicPosts.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={handleSetSearchTerm}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        setShowCreatePost={handleShowCreatePost}
      />

      {/* Stories */}
      <StoriesSection stories={onlineUsers} onClick={handleWaveToUser} />

      {/* Filters */}
      <FilterSection
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={handleSetSelectedFilter}
        loading={loading}
      />

      {/* Loading indicator for filter changes */}
      {loading && publicPosts.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Loading{" "}
            {selectedFilter === "all" ? "all posts" : `${selectedFilter} posts`}
            ...
          </span>
        </div>
      )}

      {/* Posts Feed */}
      <div className="max-w-md mx-auto pb-20">
        {filteredPosts.length > 0
          ? filteredPosts.map((post, index) => (
              <PostItem
                key={post._id}
                post={post}
                index={index}
                handleDeletePost={handleDeletePost}
              />
            ))
          : !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm
                    ? `No posts match "${searchTerm}"`
                    : selectedFilter === "all"
                    ? "No posts available"
                    : `No posts in ${selectedFilter} category`}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleShowCreatePost}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Create First Post
                  </button>
                )}
              </div>
            )}

        {/* Load More Observer */}
        {hasMore && filteredPosts.length > 0 && (
          <div
            ref={observerRef}
            className="h-10 flex justify-center items-center"
          >
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* End of results indicator */}
        {!hasMore && filteredPosts.length > 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You've reached the end of{" "}
              {selectedFilter === "all"
                ? "all posts"
                : `${selectedFilter} posts`}
            </p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <PostModal show={showCreatePost} onClose={handleCloseCreatePost} />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleShowCreatePost} />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
