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
} from "lucide-react";

const profileUser = {
  id: "u001",
  name: "Sukesh Acharya",
  username: "sukesh22",
  email: "sukesh@example.com",
  avatar:
    "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
  quote: "Some goodbyes are forever 🌙",
  groups: [
    { id: "g001", name: "MCA Batch" },
    { id: "g002", name: "Hostel A" },
    { id: "g003", name: "Study Group" },
  ],
  stats: {
    totalPosts: 8,
    heartsReceived: 142,
    taggedIn: 23,
  },
};

const myPosts = [
  {
    id: "p001",
    type: "photo",
    mediaUrl:
      "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Final MCA day! Can't believe it's over 😭",
    mood: "😭",
    createdAt: "2025-07-12T14:00:00Z",
    group: { id: "g001", name: "MCA Batch" },
    reactions: { hearts: 15, waves: 8, comments: 12 },
    taggedUsers: [
      { id: "u002", name: "Divya" },
      { id: "u003", name: "Rahul" },
      { id: "u004", name: "Shruthi" },
    ],
  },
  {
    id: "p002",
    type: "photo",
    mediaUrl:
      "https://images.pexels.com/photos/1580271/pexels-photo-1580271.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Graduation ceremony prep! 🎓✨",
    mood: "😊",
    createdAt: "2025-07-11T10:30:00Z",
    group: { id: "g001", name: "MCA Batch" },
    reactions: { hearts: 28, waves: 12, comments: 18 },
    taggedUsers: [
      { id: "u002", name: "Divya" },
      { id: "u005", name: "Priya" },
    ],
  },
  {
    id: "p003",
    type: "video",
    mediaUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "Hostel memories compilation 🏠💫",
    mood: "🥺",
    createdAt: "2025-07-10T18:45:00Z",
    group: { id: "g002", name: "Hostel A" },
    reactions: { hearts: 35, waves: 22, comments: 25 },
    taggedUsers: [
      { id: "u003", name: "Rahul" },
      { id: "u006", name: "Ankit" },
    ],
  },
];

const taggedPosts = [
  {
    id: "p009",
    type: "video",
    mediaUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "Hostel corridor flashmob 😂 Missing these days!",
    createdBy: {
      id: "u003",
      name: "Rahul",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    group: { id: "g002", name: "Hostel A" },
    taggedUsers: [
      { id: "u001", name: "Sukesh" },
      { id: "u007", name: "Varun" },
    ],
    createdAt: "2025-07-09T20:15:00Z",
    reactions: { hearts: 45, waves: 18, comments: 30 },
  },
  {
    id: "p010",
    type: "photo",
    mediaUrl:
      "https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=600",
    caption: "Study group session before finals 📚💪",
    createdBy: {
      id: "u002",
      name: "Divya",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    group: { id: "g003", name: "Study Group" },
    taggedUsers: [
      { id: "u001", name: "Sukesh" },
      { id: "u004", name: "Shruthi" },
    ],
    createdAt: "2025-07-08T16:45:00Z",
    reactions: { hearts: 32, waves: 15, comments: 22 },
  },
];

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
  useEffect(() => {
    fetchProfile();
    fetchUploadedPosts();
    fetchTaggedPosts();
  }, []);
  console.log(posts);

  // Handle profile photo change
  const handleProfilePicChange = () => {
    const newUrl = prompt("Enter new profile photo URL:");
    if (newUrl && newUrl.trim()) {
      setProfile({ ...profile, avatar: newUrl.trim() });
    }
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
        <Menu size={20} className="text-gray-900 dark:text-white" />
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

  // Feedback Modal Component
  const FeedbackModal = () =>
    showFeedbackModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Share Your Feedback
            </h3>
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How was your experience with this app?
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= feedbackRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile
          </h1>
          <HamburgerMenu />
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal />

      <div className="max-w-md mx-auto py-4 space-y-6">
        {/* Profile Header with Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={profile.avatar || "/placeholder.svg"}
                referrerPolicy="no-referrer"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                onClick={handleProfilePicChange}
                className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 p-1.5 rounded-full transition-colors"
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                @{profile.username}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {profile.quote}
              </p>
            </div>
          </div>
          {/* Stats Section - Now inside profile container */}
          {/* <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.stats.totalPosts}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Posts
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.stats.heartsReceived}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Hearts
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile.stats.taggedIn}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tagged
              </div>
            </div>
          </div> */}
        </div>

        {/* Groups Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Groups
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.groups.length > 0 &&
              profile.groups.map((group) => (
                <span
                  key={group.id}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {group.name}
                </span>
              ))}
          </div>
        </div>

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
              Posts
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
        {activeTab === "posts" ? renderPosts(posts) : renderPosts(tagged, true)}
      </div>
    </div>
  );
}
