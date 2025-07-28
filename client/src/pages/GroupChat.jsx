import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  Plus,
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
  LogOut,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import PostModal from "../components/postModal/PostModal";
import useGroupStore from "../store/groupStore";
import usePostStore from "../store/postStore";
import useModalStore from "../store/modalStore";
import useLoaderStore from "../store/loaderStore";

// Memoized child components
const GroupDetailsModal = React.memo(({ group, setShowGroupDetails }) => {
  const handleClose = useCallback(() => {
    setShowGroupDetails(false);
  }, [setShowGroupDetails]);

  // Memoize stats array
  const stats = useMemo(
    () => [
      { label: "Members", value: group.stats.totalMembers },
      { label: "Posts", value: group.stats.totalPosts },
      { label: "Videos", value: group.stats.totalVideos },
    ],
    [group.stats]
  );

  // Memoize action items
  const actionItems = useMemo(
    () => [
      {
        icon: <Users className="w-5 h-5 text-purple-500" />,
        title: "View Members",
        desc: "See all group members",
      },
      {
        icon: <UserPlus className="w-5 h-5 text-blue-500" />,
        title: "Invite Members",
        desc: "Invite friends to join",
      },
      {
        icon: <FileText className="w-5 h-5 text-green-500" />,
        title: "Group Rules",
        desc: "View group guidelines",
      },
      {
        icon: <Settings className="w-5 h-5 text-gray-500" />,
        title: "Group Settings",
        desc: "Manage group preferences",
      },
    ],
    []
  );

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Group Details
          </h2>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Settings className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-center mb-6">
            <img
              src={group.groupImage}
              alt={group.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {group.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {group.description}
            </p>
            <div className="flex justify-center gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {actionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                {item.icon}
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {item.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

const AboutGroupModal = React.memo(({ group }) => {
  // Memoize formatted date
  const createdDate = useMemo(
    () => new Date(group.createdAt).toLocaleDateString(),
    [group.createdAt]
  );

  // Memoize group rules
  const groupRules = useMemo(
    () => [
      "Be respectful to all members",
      "No spam or promotional content",
      "Keep posts relevant to the group",
      "No inappropriate content",
    ],
    []
  );

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-950 rounded-lg">
      {/* About Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          About
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {group.description}
        </p>
      </div>

      {/* Group Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Group Info
        </h3>
        <div className="space-y-3">
          {/* Privacy Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              {group.isPrivate ? (
                <Lock className="w-5 h-5 text-white" />
              ) : (
                <Globe className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {group.isPrivate ? "Private" : "Public"} Group
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {group.isPrivate
                  ? "Only members can see posts"
                  : "Anyone can see posts"}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                Created
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {createdDate}
              </p>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <img
              src={group.createdBy.avatar}
              alt={group.createdBy.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                Created by
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {group.createdBy.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Rules */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Group Rules
        </h3>
        <div className="space-y-2">
          {groupRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg"
            >
              <p className="text-gray-800 dark:text-white text-sm">
                {idx + 1}. {rule}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const ShowMembersModal = React.memo(({ group }) => {
  // Memoize members processing
  const allMembers = useMemo(() => {
    const memberMap = new Map();

    group.moderators.forEach((mod) => {
      memberMap.set(mod._id, { ...mod, role: "moderator" });
    });

    group.members.forEach((mem) => {
      if (!memberMap.has(mem._id)) {
        memberMap.set(mem._id, { ...mem, role: "member" });
      }
    });

    memberMap.set(group.createdBy._id, {
      ...group.createdBy,
      role: "admin",
    });

    return Array.from(memberMap.values());
  }, [group.moderators, group.members, group.createdBy]);

  return (
    <div className="space-y-2">
      {allMembers.map((member) => (
        <div
          key={member._id}
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border dark:border-gray-800 border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <img
              src={member.avatar}
              alt={member.username}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-black dark:text-white font-medium">
                {member.username}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                {member.role}
              </p>
            </div>
          </div>
          {member.role === "admin" && (
            <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
              Admin
            </div>
          )}
          {member.role === "moderator" && (
            <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              Moderator
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

const FloatingActionButton = React.memo(({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform duration-200"
  >
    <Plus className="w-6 h-6 text-white" />
  </button>
));

const GroupChatPage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const observerRef = useRef(null);

  // Store selectors
  const groupDetails = useGroupStore((state) => state.groupDetails);
  const fetchGroupById = useGroupStore((state) => state.fetchGroupById);
  const loading = useGroupStore((state) => state.loading);
  const isUploading = useLoaderStore((state) => state.isUploading);
  const fetchGroupPosts = usePostStore((state) => state.fetchGroupPosts);
  const groupPosts = usePostStore((state) => state.groupPostMap[id]) || [];
  const hasMore = usePostStore((state) => state.hasMore);
  const deleteUploadedPost = usePostStore((state) => state.deleteUploadedPost);
  const openUploadModal = useModalStore((state) => state.openUploadModal);
  const resetGroupPagination = usePostStore(
    (state) => state.resetGroupPagination
  );
  const loadingPosts = usePostStore((state) => state.loadingPosts);

  // Memoized data fetching effect
  useEffect(() => {
    fetchGroupById(id);
    fetchGroupPosts(id);
  }, [id, fetchGroupById, fetchGroupPosts]);

  // Memoized intersection observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingPosts) {
          fetchGroupPosts(id);
        }
      },
      { threshold: 1.0 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [hasMore, loadingPosts, id, fetchGroupPosts]);

  // Memoized handlers
  const handleCreatePost = useCallback((postData) => {
    // Implementation here
  }, []);

  const handleReact = useCallback((postId, reactionType) => {
    // Implementation here
  }, []);

  const handleBackButton = useCallback(() => {
    navigate("/groups");
  }, [navigate]);

  const handleComment = useCallback((postId, commentText) => {
    // Implementation here
  }, []);

  const handleDeletePost = useCallback(
    (postId) => {
      deleteUploadedPost(postId);
    },
    [deleteUploadedPost]
  );

  const toggleGroupDetails = useCallback(() => {
    setShowGroupDetails((prev) => !prev);
  }, []);

  const toggleCreatePost = useCallback(() => {
    setShowCreatePost((prev) => !prev);
  }, []);

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const closeCreatePost = useCallback(() => {
    setShowCreatePost(false);
  }, []);

  // Memoized tab handlers
  const handlePostsTab = useCallback(() => setActiveTab("posts"), []);
  const handleMembersTab = useCallback(() => setActiveTab("members"), []);
  const handleAboutTab = useCallback(() => setActiveTab("about"), []);

  // Memoized tab classes
  const postsTabClass = useMemo(
    () =>
      `flex-1 py-3 px-4 text-sm font-medium transition-colors ${
        activeTab === "posts"
          ? "text-purple-400 border-b-2 border-purple-400"
          : "text-gray-400 hover:text-gray-300"
      }`,
    [activeTab]
  );

  const membersTabClass = useMemo(
    () =>
      `flex-1 py-3 px-4 text-sm font-medium transition-colors ${
        activeTab === "members"
          ? "text-purple-400 border-b-2 border-purple-400"
          : "text-gray-400 hover:text-gray-300"
      }`,
    [activeTab]
  );

  const aboutTabClass = useMemo(
    () =>
      `flex-1 py-3 px-4 text-sm font-medium transition-colors ${
        activeTab === "about"
          ? "text-purple-400 border-b-2 border-purple-400"
          : "text-gray-400 hover:text-gray-300"
      }`,
    [activeTab]
  );

  // Memoized empty posts content
  const emptyPostsContent = useMemo(
    () => (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-gray-500 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Be the first to share something!
        </p>
        <button
          onClick={toggleCreatePost}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create Post
        </button>
      </div>
    ),
    [toggleCreatePost]
  );

  // Loading state
  if (loading || !groupDetails) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {/* Left Side - Back Button + Group Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackButton}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-white" />
            </button>
            <img
              src={groupDetails.groupImage}
              alt={groupDetails.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-black dark:text-white">
                {groupDetails.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {groupDetails.stats.totalMembers} members
              </p>
            </div>
          </div>

          {/* Right Side - Users & More */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleGroupDetails}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Users className="w-5 h-5 text-gray-800 dark:text-white" />
            </button>

            <button
              onClick={toggleDropdown}
              className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>
        {isUploading && (
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
        )}
      </div>

      {/* Tabs */}
      <div className="flex dark:bg-gray-800 bg-white border-b border-gray-100 dark:border-gray-800 sticky top-[72px] z-40">
        <button onClick={handlePostsTab} className={postsTabClass}>
          Posts ({groupPosts.length})
        </button>
        <button onClick={handleMembersTab} className={membersTabClass}>
          Members ({groupDetails.stats.totalMembers})
        </button>
        <button onClick={handleAboutTab} className={aboutTabClass}>
          About
        </button>
      </div>

      {activeTab === "posts" && (
        <FloatingActionButton onClick={toggleCreatePost} />
      )}

      {/* Content */}
      <div className="pb-6">
        {activeTab === "posts" && (
          <div className="space-y-4 py-3">
            {groupPosts.length === 0 ? (
              emptyPostsContent
            ) : (
              <div className="max-w-md mx-auto pb-20">
                {groupPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onReact={handleReact}
                    onComment={handleComment}
                    handleDeletePost={handleDeletePost}
                  />
                ))}
                {hasMore && (
                  <div
                    ref={observerRef}
                    className="h-10 flex justify-center items-center"
                  >
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Top Contributors
              </h3>
              <div className="space-y-3">
                {groupDetails.stats?.topContributors &&
                  groupDetails.stats.topContributors.map(
                    (contributor, index) => (
                      <div
                        key={contributor._id}
                        className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-lg"
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
                            <p className="text-gray-800 dark:text-white font-medium">
                              {contributor.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {contributor.count} posts
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-600 dark:text-purple-400 font-semibold">
                            #{index + 1}
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                All Members
              </h3>
              <ShowMembersModal group={groupDetails} />
            </div>
          </div>
        )}

        {activeTab === "about" && <AboutGroupModal group={groupDetails} />}
      </div>

      {/* Group Details Modal */}
      {showGroupDetails && (
        <GroupDetailsModal
          group={groupDetails}
          setShowGroupDetails={setShowGroupDetails}
        />
      )}

      {/* Create Post Modal */}
      <PostModal show={showCreatePost} onClose={closeCreatePost} id={id} />
    </div>
  );
};

export default GroupChatPage;
