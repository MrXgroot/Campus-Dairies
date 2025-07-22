import { useState, useEffect, useRef } from "react";
import useProfileStore from "../store/profileStore";
import usePostStore from "../store/postStore";
import HamburgerMenu from "../components/profileComponents/HamburgerMenu";
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
  Plus,
  Lock,
  User,
  Users,
} from "lucide-react";
import PostCard from "../components/post/PostCard";

export default function InstagramProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditprofileOpen, setIsEditProfileOpen] = useState(false);

  const profile = useProfileStore((state) => state.profile);
  const loading = useProfileStore((state) => state.loading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const posts = usePostStore((state) => state.posts);
  const loadingPosts = usePostStore((state) => state.loadingPosts);
  const tagged = usePostStore((state) => state.tagged);
  const fetchUploadedPosts = usePostStore((state) => state.fetchUploadedPosts);
  const fetchTaggedPosts = usePostStore((state) => state.fetchTaggedPosts);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const deleteUploadedPost = usePostStore((state) => state.deleteUploadedPost);
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

  const handleDeletePost = (postId) => {
    deleteUploadedPost(postId);
  };

  const onUploadAvatar = (file) => {
    updateProfile(file);
  };

  const handleUpdateProfile = (file) => {
    console.log(file);
    updateProfile(file);
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

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logged out successfully!");
      setShowHamburgerMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="h-10 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // add loadingPosts to the post section
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

      <div className="max-w-md mx-auto ">
        {/* Profile Header with Stats */}
        <ProfileHeaderAndStats
          profile={profile}
          onProfileButtonClick={onProfileButtonClick}
          onUploadAvatar={onUploadAvatar}
          fileInputRef={fileInputRef}
          openEditProfile={() => setIsEditProfileOpen(true)}
        />

        <div className="flex bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 ">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            My Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("tagged")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "tagged"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Tagged ({posts.length})
          </button>
        </div>
        {/* Posts Content */}
        {activeTab === "posts"
          ? posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                canDelete={true}
                handleDeletePost={handleDeletePost}
              />
            ))
          : renderPosts(tagged, true)}
      </div>

      <EditProfileModal
        isOpen={isEditprofileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmitFormData={handleUpdateProfile}
        fileInputRef={fileInputRef}
        onProfileButtonClick={onProfileButtonClick}
      />
    </div>
  );
}

import imageCompression from "browser-image-compression";

const ProfileHeaderAndStats = ({
  profile,
  onUploadAvatar,
  onProfileButtonClick,
  fileInputRef,
  openEditProfile,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("avatar", compressedFile);
      formData.append("isAvatar", "true");

      onUploadAvatar(formData);
    } catch (error) {
      console.error("Avatar compression failed", error);
    }
  };

  return (
    <div className="relative p-6 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
      {/* Options Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          <MoreVertical size={20} />
        </button>
        {showOptions && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50">
            <button
              onClick={() => {
                openEditProfile();
                setShowOptions(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
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

      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <img
            src={profile.avatar || "/placeholder.svg"}
            alt="Avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={onProfileButtonClick}
            className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full shadow-sm"
          >
            <Camera size={14} className="text-white" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username}
          </p>
          {profile.quote && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-xs">
              {profile.quote}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <Heart fill="red" strokeWidth={0} className="w-5 h-5 mb-1" />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {profile.stats.heartCount || 0}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Likes
          </span>
        </div>
        <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <Users className="w-5 h-5 mb-1 text-purple-500" />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {profile.stats.followers || 0}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Followers
          </span>
        </div>
        <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <span className="text-xl mb-1">👋</span>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {profile.stats.waveCount || 0}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Waves
          </span>
        </div>
      </div>
    </div>
  );
};

const EditProfileModal = ({
  isOpen,
  onClose,
  onSubmitFormData,
  fileInputRef,
  onProfileButtonClick,
}) => {
  const [username, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      const compressed = await imageCompression(file, options);
      setAvatar(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error("Compression failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("quote", bio);
    if (avatar) formData.append("avatar", avatar);

    onSubmitFormData(formData);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:"))
        URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  onProfileButtonClick();
                }}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 dark:text-white font-medium">
                Add your profile photo
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Choose a photo that represents you
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-800 dark:text-white font-medium mb-2">
              Your User Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-gray-800 dark:text-white font-medium mb-2">
              Your Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us something about you..."
              rows="3"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Info */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <h3 className="text-gray-800 dark:text-white font-medium">
                  Your Profile
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Edit your name, avatar, and bio to make it yours.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
