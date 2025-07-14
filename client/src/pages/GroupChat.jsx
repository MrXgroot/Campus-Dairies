import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Video,
  TrendingUp,
  Calendar,
  MapPin,
  Crown,
  Camera,
  Send,
  X,
  UserPlus,
  Settings,
  Lock,
  Globe,
  Smile,
  Image as ImageIcon,
  FileText,
  Eye,
  EyeOff,
  Bookmark,
  ThumbsDown,
  CheckCircle,
} from "lucide-react";

import PostCard from "../components/post/PostCard";

// Mock data
const mockGroupData = {
  _id: "g001",
  name: "MCA Batch 2024",
  description:
    "Official group for MCA students batch 2024. Share your memories, doubts, and experiences!",
  isPrivate: true,
  avatar:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=face",
  coverImage:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=300&fit=crop",
  createdBy: {
    _id: "u001",
    name: "Sukesh Kumar",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  createdAt: "2024-06-15T10:00:00Z",
  location: "Christ University, Bangalore",
  members: [
    {
      _id: "u001",
      name: "Sukesh Kumar",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      role: "admin",
    },
    {
      _id: "u002",
      name: "Divya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b88c3f96?w=100&h=100&fit=crop&crop=face",
      role: "member",
    },
    {
      _id: "u003",
      name: "Rahul Patel",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      role: "member",
    },
    {
      _id: "u004",
      name: "Priya Singh",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      role: "member",
    },
    {
      _id: "u005",
      name: "Arjun Reddy",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      role: "member",
    },
  ],
  stats: {
    totalPosts: 47,
    totalVideos: 12,
    totalMembers: 18,
    topContributors: [
      {
        _id: "u002",
        name: "Divya Sharma",
        count: 8,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b88c3f96?w=100&h=100&fit=crop&crop=face",
      },
      {
        _id: "u001",
        name: "Sukesh Kumar",
        count: 6,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      {
        _id: "u003",
        name: "Rahul Patel",
        count: 5,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
};

const mockPosts = [
  {
    _id: "1",
    username: "tech_explorer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    imageUrl:
      "https://images.unsplash.com/photo-1518085901-5f5f2a75e5e5?w=800&h=600&fit=crop",
    caption:
      "Beautiful sunset from my coding session today! 🌅 #coding #nature #productivity",
    likes: 234,
    comments: 42,
    timestamp: "2h ago",
    verified: true,
    category: "tech",
  },
  {
    _id: "2",
    username: "creative_mind",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b332b1b4?w=100&h=100&fit=crop&crop=face",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop",
    caption:
      "New artwork in progress! What do you think? 🎨 #art #creativity #design",
    likes: 567,
    comments: 89,
    timestamp: "4h ago",
    verified: false,
    category: "art",
  },
  {
    _id: "3",
    username: "food_enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    caption:
      "Homemade pasta night! Recipe in comments 🍝 #cooking #homemade #delicious",
    likes: 892,
    comments: 156,
    timestamp: "6h ago",
    verified: true,
    category: "food",
  },
  {
    _id: "4",
    username: "travel_diary",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    caption:
      "Mountain hiking adventure! The view was absolutely breathtaking 🏔️ #travel #hiking #mountains",
    likes: 1234,
    comments: 278,
    timestamp: "1d ago",
    verified: false,
    category: "travel",
  },
];

const CreatePostModal = ({ isOpen, onClose, onCreatePost }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [postType, setPostType] = useState("text");
  const [mediaPreview, setMediaPreview] = useState("");

  const moods = [
    "😊",
    "😍",
    "🤔",
    "😎",
    "🥳",
    "📚",
    "💻",
    "🎉",
    "🤯",
    "🚀",
    "❤️",
    "👍",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      onCreatePost({
        type: postType,
        caption: postContent,
        mood: selectedMood,
        mediaUrl: mediaPreview,
      });
      setPostContent("");
      setSelectedMood("");
      setPostType("text");
      setMediaPreview("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">Create Post</h2>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Post
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-medium">Sukesh Kumar</p>
              <p className="text-gray-400 text-sm">Posting to MCA Batch 2024</p>
            </div>
          </div>

          <div className="mb-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              rows="4"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setPostType("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                postType === "text"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              Text
            </button>
            <button
              type="button"
              onClick={() => {
                setPostType("photo");
                setMediaPreview(
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                );
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                postType === "photo"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Image className="w-4 h-4" />
              Photo
            </button>
            <button
              type="button"
              onClick={() => {
                setPostType("video");
                setMediaPreview(
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
                );
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                postType === "video"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Video className="w-4 h-4" />
              Video
            </button>
          </div>

          {(postType === "photo" || postType === "video") && mediaPreview && (
            <div className="mb-4 relative">
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              {postType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                  <Video className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <p className="text-white font-medium mb-2">Choose a mood</p>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedMood === mood
                      ? "bg-purple-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xl">{mood}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const CommentModal = ({ isOpen, onClose, post, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post._id, commentText);
      setCommentText("");
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 w-full max-w-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">Comments</h2>
          <div className="w-10" />
        </div>

        {/* Comments */}
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <img
                  src={comment.createdBy.avatar}
                  alt={comment.createdBy.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg px-3 py-2">
                    <p className="text-white font-medium text-sm">
                      {comment.createdBy.name}
                    </p>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const GroupChatPage = () => {
  const [group] = useState(mockGroupData);
  const [posts, setPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState("posts");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);

  const handleCreatePost = (postData) => {
    const newPost = {
      _id: `p${Date.now()}`,
      ...postData,
      createdBy: {
        _id: "u001",
        name: "Sukesh Kumar",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      createdAt: new Date().toISOString(),
      reactions: { hearts: [], waves: [] },
      comments: [],
      group: { _id: group._id, name: group.name },
    };
    setPosts([newPost, ...posts]);
  };

  const handleReact = (postId, reactionType) => {
    setPosts(
      posts.map((post) => {
        if (post._id === postId) {
          const reactions = { ...post.reactions };
          if (reactions[reactionType].includes("u001")) {
            reactions[reactionType] = reactions[reactionType].filter(
              (id) => id !== "u001"
            );
          } else {
            reactions[reactionType] = [...reactions[reactionType], "u001"];
          }
          return { ...post, reactions };
        }
        return post;
      })
    );
  };
  const handleBackButton = () => {};

  const handleComment = (postId, commentText) => {
    setPosts(
      posts.map((post) => {
        if (post._id === postId) {
          const newComment = {
            _id: `c${Date.now()}`,
            text: commentText,
            createdBy: {
              _id: "u001",
              name: "Sukesh Kumar",
              avatar:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            },
            createdAt: new Date().toISOString(),
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackButton}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <img
              src={group.avatar}
              alt={group.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-white">{group.name}</h1>
              <p className="text-gray-400 text-sm">
                {group.stats.totalMembers} members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGroupDetails(true)}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <Users className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-black border-b border-gray-800 sticky top-[72px] z-30">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "members"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Members ({group.stats.totalMembers})
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "about"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          About
        </button>
      </div>

      {/* Content */}
      <div className="pb-6">
        {activeTab === "posts" && (
          <div className="space-y-4  py-3">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Be the first to share something!
                </p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Post
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onReact={handleReact}
                  onComment={handleComment}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Top Contributors
              </h3>
              <div className="space-y-3">
                {group.stats.topContributors.map((contributor, index) => (
                  <div
                    key={contributor._id}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={contributor.avatar}
                          alt={contributor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-yellow-900" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {contributor.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {contributor.count} posts
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-semibold">
                        #{index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                All Members
              </h3>
              <div className="space-y-2">
                {group.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-gray-400 text-sm capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {member.role === "admin" && (
                      <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                        Admin
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-gray-300 leading-relaxed">
                {group.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Group Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    {group.isPrivate ? (
                      <Lock className="w-5 h-5 text-white" />
                    ) : (
                      <Globe className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {group.isPrivate ? "Private" : "Public"} Group
                    </p>
                    <p className="text-gray-400 text-sm">
                      {group.isPrivate
                        ? "Only members can see posts"
                        : "Anyone can see posts"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Created</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-gray-400 text-sm">{group.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <img
                    src={group.createdBy.avatar}
                    alt={group.createdBy.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">Created by</p>
                    <p className="text-gray-400 text-sm">
                      {group.createdBy.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Group Rules
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-900 rounded-lg">
                  <p className="text-white text-sm">
                    1. Be respectful to all members
                  </p>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg">
                  <p className="text-white text-sm">
                    2. No spam or promotional content
                  </p>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg">
                  <p className="text-white text-sm">
                    3. Keep posts relevant to the group
                  </p>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg">
                  <p className="text-white text-sm">
                    4. No inappropriate content
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Group Details Modal */}
      {showGroupDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
              <button
                onClick={() => setShowGroupDetails(false)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-lg font-semibold text-white">
                Group Details
              </h2>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4">
              <div className="text-center mb-6">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-2">
                  {group.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {group.description}
                </p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {group.stats.totalMembers}
                    </p>
                    <p className="text-gray-400 text-sm">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {group.stats.totalPosts}
                    </p>
                    <p className="text-gray-400 text-sm">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {group.stats.totalVideos}
                    </p>
                    <p className="text-gray-400 text-sm">Videos</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">View Members</p>
                    <p className="text-gray-400 text-sm">
                      See all group members
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Invite Members</p>
                    <p className="text-gray-400 text-sm">
                      Invite friends to join
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <FileText className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Group Rules</p>
                    <p className="text-gray-400 text-sm">
                      View group guidelines
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Group Settings</p>
                    <p className="text-gray-400 text-sm">
                      Manage group preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
};

export default GroupChatPage;
