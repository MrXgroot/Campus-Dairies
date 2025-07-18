import { useState, useEffect, useRef } from "react";
import useProfileStore from "../store/profileStore";

import {
  LogOut,
  Camera,
  Trash,
  Pencil,
  MoreVertical,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Menu,
  X,
  Star,
  Settings,
} from "lucide-react";
import PostCard from "../components/post/PostCard";

// Custom hook for video auto-play with intersection observer
const useVideoAutoPlay = () => {
  const videoRefs = useRef(new Map());

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          video.play().catch(console.log);
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.5, 1],
      rootMargin: "-50px 0px",
    });

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  const registerVideo = (id, videoElement) => {
    if (videoElement) {
      videoRefs.current.set(id, videoElement);
    } else {
      videoRefs.current.delete(id);
    }
  };

  return { registerVideo };
};

export default function InstagramProfilePage() {
  const [openMenu, setOpenMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const { registerVideo } = useVideoAutoPlay();
  const menuRef = useRef(null);
  const hamburgerMenuRef = useRef(null);

  const profile = useProfileStore((state) => state.profile);
  const loading = useProfileStore((state) => state.loading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const posts = useProfileStore((state) => state.posts);
  const tagged = useProfileStore((state) => state.tagged);
  const fetchUploadedPosts = useProfileStore(
    (state) => state.fetchUploadedPosts
  );
  const fetchTaggedPosts = useProfileStore((state) => state.fetchTaggedPosts);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const fileInputRef = useRef();
  useEffect(() => {
    fetchProfile();
    fetchUploadedPosts();
    fetchTaggedPosts();
  }, []);

  // Handle profile photo change
  const onProfileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onUploadAvatar = (file) => {
    updateProfile(file);
  };

  // Handle post deletion with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((p) => p.id !== id));
      setOpenMenu(null);
    }
  };

  // Handle post editing
  const handleEdit = (id) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      const newCaption = prompt("Edit caption:", post.caption);
      if (newCaption !== null && newCaption.trim()) {
        setPosts(
          posts.map((p) =>
            p.id === id ? { ...p, caption: newCaption.trim() } : p
          )
        );
      }
    }
    setOpenMenu(null);
  };

  // Toggle kebab menu
  const toggleMenu = (postId) => {
    setOpenMenu(openMenu === postId ? null : postId);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logged out successfully!");
      setShowHamburgerMenu(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) {
      alert("Please provide a rating!");
      return;
    }

    alert(
      `Thank you for your feedback!\nRating: ${feedbackRating}/5\nFeedback: ${
        feedbackText || "No additional comments"
      }`
    );

    // Reset feedback form
    setFeedbackRating(0);
    setFeedbackText("");
    setShowFeedbackModal(false);
    setShowHamburgerMenu(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
      if (
        hamburgerMenuRef.current &&
        !hamburgerMenuRef.current.contains(event.target)
      ) {
        setShowHamburgerMenu(false);
      }
    };

    if (openMenu || showHamburgerMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenu, showHamburgerMenu]);

  // Kebab Menu Component
  const KebabMenu = ({ postId, onEdit, onDelete, isDisabled = false }) => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(postId);
        }}
        disabled={isDisabled}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Post options"
      >
        <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
      </button>
      {openMenu === postId && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[140px] z-50">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Hamburger Menu Component
  const HamburgerMenu = () => (
    <div className="relative" ref={hamburgerMenuRef}>
      <button
        onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <Settings
          size={20}
          className={`text-gray-900 dark:text-white ${
            showHamburgerMenu ? "rotate-[-90deg]" : "rotate-0"
          } transition-all duration-300 ease-in-out`}
        />
      </button>
      {showHamburgerMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px] z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setShowFeedbackModal(true);
                setShowHamburgerMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left text-gray-900 dark:text-white"
            >
              <Star size={16} />
              <span>Feedback</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render posts function
  const renderPosts = (postsArray, isTagged = false) => {
    if (postsArray.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {isTagged ? "No tagged posts yet" : "No posts yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {isTagged
              ? "Posts you're tagged in will appear here"
              : "Your memories will appear here"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {postsArray.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    isTagged
                      ? post.createdBy?.avatar || profile.avatar
                      : profile.avatar
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {isTagged ? post.createdBy?.name : profile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {post.group?.name} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <KebabMenu
                postId={post.id}
                onEdit={() =>
                  isTagged
                    ? alert("❌ Cannot edit others' posts")
                    : handleEdit(post.id)
                }
                onDelete={() =>
                  isTagged
                    ? alert("❌ Cannot delete others' posts")
                    : handleDelete(post.id)
                }
              />
            </div>
            {/* Media Content */}
            <div className="bg-black">
              {post.type === "video" ? (
                <video
                  ref={(el) => registerVideo(post.id, el)}
                  src={post.mediaUrl}
                  muted
                  loop
                  playsInline
                  className="w-full max-h-[600px] object-cover"
                  onLoadedMetadata={(e) => {
                    e.target.volume = 0;
                  }}
                />
              ) : (
                <img
                  src={post.mediaUrl || "/placeholder.svg"}
                  alt="Post content"
                  className="w-full max-h-[600px] object-cover"
                />
              )}
            </div>
            {/* Action Buttons */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button className="hover:opacity-70 transition-opacity">
                    <Heart
                      size={24}
                      className="text-gray-900 dark:text-white"
                    />
                  </button>
                  <button className="hover:opacity-70 transition-opacity">
                    <MessageCircle
                      size={24}
                      className="text-gray-900 dark:text-white"
                    />
                  </button>
                  <button className="hover:opacity-70 transition-opacity">
                    <Send size={24} className="text-gray-900 dark:text-white" />
                  </button>
                </div>
                <button className="hover:opacity-70 transition-opacity">
                  <Bookmark
                    size={24}
                    className="text-gray-900 dark:text-white"
                  />
                </button>
              </div>
              {/* Caption */}
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-white text-sm">
                  <span className="font-semibold">
                    {isTagged ? post.createdBy?.name : profile.name}
                  </span>{" "}
                  {post.caption}
                  {post.mood && <span className="ml-1">{post.mood}</span>}
                </p>
                {/* Tagged Users */}
                {post.taggedUsers && post.taggedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.taggedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                      >
                        @{user.name}
                      </span>
                    ))}
                  </div>
                )}
                {/* Engagement Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.reactions.hearts} hearts</span>
                  <span>{post.reactions.comments} comments</span>
                  <span>{post.reactions.waves} waves</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-10 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-40">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
            CampusDairies
          </h1>
          <HamburgerMenu />
        </div>
      </div>

      <div className="max-w-md mx-auto py-4 space-y-6">
        {/* Profile Header with Stats */}
        <ProfileHeaderAndStats
          profile={profile}
          onProfileButtonClick={onProfileButtonClick}
          onUploadAvatar={onUploadAvatar}
          fileInputRef={fileInputRef}
        />

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {`Posts(${posts.length})`}
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "tagged"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Tagged
            </button>
          </div>
        </div>

        {/* Posts Content */}
        {activeTab === "posts"
          ? posts.map((post) => <PostCard key={post._id} post={post} />)
          : renderPosts(tagged, true)}
      </div>
    </div>
  );
}

import imageCompression from "browser-image-compression";

const ProfileHeaderAndStats = ({
  profile,
  onUploadAvatar,
  onProfileButtonClick,
  fileInputRef,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file || !file.type.startsWith("image/")) return;

    try {
      // ✅ Compression options
      const options = {
        maxSizeMB: 0.2, // Compress to ~200KB
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      // ✅ Compress the file
      const compressedFile = await imageCompression(file, options);
      console.log(compressedFile instanceof File);
      // ✅ Prepare form data
      const formData = new FormData();
      formData.append("avatar", compressedFile);
      formData.append("isAvatar", "true");

      // ✅ Trigger upload
      onUploadAvatar(formData);
    } catch (error) {
      console.error("Avatar compression failed", error);
    }
  };

  return (
    <div className="p-4 pt-6 bg-white dark:bg-gray-900 relative">
      {/* More Button */}
      <div className="absolute top-3 right-4">
        <button
          onClick={() => setShowOptions((prev) => !prev)}
          className="text-gray-600 dark:text-gray-300"
        >
          <MoreVertical size={20} />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-md rounded-md z-10">
            <button
              onClick={() => {
                onEditProfile();
                setShowOptions(false);
              }}
              className="px-4 py-2 text-sm w-full text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Update Profile
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Avatar + Info */}
      <div className="flex gap-4 items-start mb-3">
        <div className="relative w-16 h-16 shrink-0">
          <img
            src={profile.avatar || "/placeholder.svg"}
            referrerPolicy="no-referrer"
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={onProfileButtonClick}
            className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 p-1 rounded-full"
          >
            <Camera size={14} className="text-white" />
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username}
          </p>
          {profile.quote && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {profile.quote}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col flex-wrap gap-x-4 gap-y-1">
        <span>{profile.stats?.heartsCount || 0} Hearts</span>
        <span>{profile.stats?.groupsCount || 0} Groups</span>
        <span>{profile.stats?.wavesCount || 0} Waves</span>
      </div>
    </div>
  );
};
