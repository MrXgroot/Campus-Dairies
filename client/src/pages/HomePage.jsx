import React, { useState, useEffect, useRef } from "react";
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
const HomePage = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const observerRef = useRef();
  const { sendWaveToUser } = useUserStore();
  const mockStories = [
    {
      id: "1",
      username: "You",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      isViewed: false,
      isAdd: true,
    },
    {
      id: "2",
      username: "alex_codes",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
      isViewed: false,
    },
    {
      id: "3",
      username: "sarah_designs",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      isViewed: true,
    },
    {
      id: "4",
      username: "mike_photos",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
      isViewed: false,
    },
    {
      id: "5",
      username: "lisa_travels",
      avatar:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
      isViewed: true,
    },
  ];

  const filters = ["all", "tech", "art", "food", "travel"];

  const {
    publicPosts,
    fetchPublicPosts,
    hasMore,
    loading,
    resetPagination,
    deleteUploadedPost,
  } = usePostStore();
  const onlineUsers = useOnlineUserStore((state) => state.onlineUsers);
  useEffect(() => {
    fetchPublicPosts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts([...publicPosts]);
      setRefreshing(false);
    }, 1000);
  };
  const handleDeletePost = (postId) => {
    deleteUploadedPost(postId);
  };

  const filteredPosts = publicPosts.filter((post) => {
    const matchesFilter =
      selectedFilter === "all" || post.category === selectedFilter;
    const matchesSearch =
      post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.username?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPublicPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleWaveToUser = (userId) => {
    sendWaveToUser(userId);
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        setShowCreatePost={setShowCreatePost}
      />

      {/* Stories */}
      <StoriesSection stories={onlineUsers} onClick={handleWaveToUser} />

      {/* Filters */}
      <FilterSection
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Posts Feed */}
      <div className="max-w-md mx-auto pb-20">
        {filteredPosts.map((post, index) => (
          <div
            key={post._id}
            className="opacity-0 animate-fade-in"
            style={{
              animation: `fadeIn 0.6s ease-out ${index * 0.1}s forwards`,
            }}
          >
            {/* <AdvancedPost post={post} /> */}
            <PostCard post={post} handleDeletePost={handleDeletePost} />
          </div>
        ))}

        {/* Load More Observer */}
        {hasMore && (
          <div
            ref={observerRef}
            className="h-10 flex justify-center items-center"
          >
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <PostModal
        show={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowCreatePost(true)} />

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

const StoriesSection = ({ stories, onClick }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story._id}
            className="flex-shrink-0 text-center cursor-pointer hover:scale-105 transition-transform active:scale-95"
          >
            <div
              onDoubleClick={() => onClick(story._id)}
              className={` relative ${
                story.isAdd
                  ? "bg-gray-200 dark:bg-gray-700"
                  : story.isViewed
                  ? "bg-gray-300"
                  : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
              } p-1 rounded-full relative`}
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
                  />
                )}
              </div>
              <div className="absolute w-4 h-4 bg-green-500 rounded-full left-[70%] bottom-[2%] border-2  border-white "></div>
            </div>
            <p className="text-xs mt-1 text-gray-700 dark:text-gray-300 truncate w-16">
              {story.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterSection = ({ filters, selectedFilter, setSelectedFilter }) => (
  <div className="max-w-md mx-auto px-4 py-2">
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setSelectedFilter(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 active:scale-95 ${
            selectedFilter === filter
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

const FloatingActionButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform duration-200"
  >
    <Plus className="w-6 h-6 text-white" />
  </button>
);

const LoadingScreen = () => (
  <div className="min-h-screen  bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
      <p className="text-gray-600 dark:text-gray-300">Loading your feed...</p>
    </div>
  </div>
);

export default HomePage;
