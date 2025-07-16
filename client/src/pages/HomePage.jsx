import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header/Header";
import PostCard from "../components/post/PostCard";
import PostModal from "../components/postModal/PostModal";
import usePostStore from "../store/postStore";
import { socket } from "../utils/socket";
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
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const observerRef = useRef();

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

  const { publicPosts, fetchPublicPosts, hasMore, loading, resetPagination } =
    usePostStore();
  const onlineUsers = useOnlineUserStore((state) => state.onlineUsers);
  useEffect(() => {
    resetPagination();
    fetchPublicPosts();
  }, []);
  console.log(onlineUsers);
  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts([...publicPosts]);
      setRefreshing(false);
    }, 1000);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesFilter =
      selectedFilter === "all" || post.category === selectedFilter;
    const matchesSearch =
      publicPosts.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publicPosts.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("fetching");
          fetchPublicPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

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
      <StoriesSection stories={onlineUsers} />

      {/* Filters */}
      <FilterSection
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Posts Feed */}
      <div className="max-w-md mx-auto pb-20">
        {publicPosts.map((post, index) => (
          <div
            key={post._id}
            className="opacity-0 animate-fade-in"
            style={{
              animation: `fadeIn 0.6s ease-out ${index * 0.1}s forwards`,
            }}
          >
            {/* <AdvancedPost post={post} /> */}
            <PostCard post={post} />
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

const StoriesSection = ({ stories }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story._id}
            className="flex-shrink-0 text-center cursor-pointer hover:scale-105 transition-transform active:scale-95"
          >
            <div
              className={`relative ${
                story.isAdd
                  ? "bg-gray-200 dark:bg-gray-700"
                  : story.isViewed
                  ? "bg-gray-300"
                  : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
              } p-1 rounded-full`}
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

const CreatePostModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            rows="3"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          />

          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors active:scale-95">
              <Image className="w-4 h-4" />
              Photo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors active:scale-95">
              <Camera className="w-4 h-4" />
              Camera
            </button>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all active:scale-95">
            Share Post
          </button>
        </div>
      </div>
    </div>
  );
};

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
