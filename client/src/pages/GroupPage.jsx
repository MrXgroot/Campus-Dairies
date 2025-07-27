import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Lock,
  UserPlus,
  UserMinus,
  Search,
  Plus,
  MoreHorizontal,
  ArrowLeft,
  Camera,
  X,
  LogOut,
} from "lucide-react";
import moment from "moment";
import { formatDateTime } from "../utils/formatDate.js";
import Header from "../components/header/Header";
import useGroupStore from "../store/groupStore";
import { useNavigate } from "react-router-dom";
// Mock Zustand store for demo

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      onCreateGroup({
        name: groupName,
        description,
        groupImage:
          avatarPreview ||
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop&crop=face",
        isPrivate: true,
      });

      setGroupName("");
      setDescription("");
      setGroupAvatar(null);
      setAvatarPreview("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create Group
          </h2>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Create
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Group avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setAvatarPreview(
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop&crop=face"
                  )
                }
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white font-medium">
                Add group photo
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Choose a photo that represents your group
              </p>
            </div>
          </div>

          {/* Group Name */}
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-white font-medium mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-900 dark:text-white font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about?"
              rows="3"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Privacy Info */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">
                  Private Group
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Only members can see posts and members
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const GroupCard = ({ group, onJoin, onLeave, isJoined, openGroup }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const optionRef = useRef(null);
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (optionRef.current && !optionRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  });
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
      {/* Group Avatar and Info */}
      <div className="flex items-center gap-3 flex-1">
        {/* Group Image */}
        <div
          onClick={() => openGroup(group._id)}
          className="relative cursor-pointer"
        >
          <img
            src={group.groupImage}
            alt={group.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-[2px] shadow">
            <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        {/* Group Info */}
        <div
          onClick={() => openGroup(group._id)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">
            {group.name}
          </h3>
          <div className="flex items-center gap-2 text-xs mt-1 text-gray-600 dark:text-gray-400">
            <Users className="w-3 h-3" />
            <span>{group.stats.totalMembers} members</span>
            <span>•</span>
            <span>{moment(group.createdAt).fromNow()}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <img
              src={group.createdBy.avatar}
              alt={group.createdBy.username}
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {group.createdBy.username}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div ref={optionRef} className="flex items-center gap-2">
        {isJoined ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[140px] z-10">
                <button
                  onClick={() => {
                    onLeave(group._id);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Group
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onJoin(group._id)}
            className="px-4 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Join Group
          </button>
        )}
      </div>
    </div>
  );
};

const GroupsPage = () => {
  const fetchJoinedGroups = useGroupStore((state) => state.fetchJoinedGroups);
  const joinedGroups = useGroupStore((state) => state.joinedGroups);
  const createGroup = useGroupStore((state) => state.createGroup);
  const otherGroups = useGroupStore((state) => state.otherGroups);
  const requestToJoinGroup = useGroupStore((state) => state.requestToJoinGroup);
  const leaveGroup = useGroupStore((state) => state.leaveGroup);
  const fetchDiscoverGroups = useGroupStore(
    (state) => state.fetchDiscoverGroups
  );
  // const joinedGroups = [];
  // const otherGroups = [];
  const loading = false;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("joined");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchJoinedGroups();
    if (activeTab != "joined") {
      fetchDiscoverGroups();
    }
  }, [activeTab]);

  const filteredJoinedGroups = joinedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherGroups = otherGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = (groupData) => {
    console.log("Creating group:", groupData);
    createGroup(groupData);
  };

  const handleRequestToJoinGroup = (groupId) => {
    console.log(groupId);
    requestToJoinGroup(groupId);
  };

  const handleLeaveGroup = (groupId) => {
    leaveGroup(groupId);
  };

  const handleOpenGroup = (groupId) => {
    navigate(`/groupchat/${groupId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  dark:bg-gray-900 bg-gray-50 text-white relative pb-40">
      {/* Header */}
      {/* <div className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                CampusDairies
              </h1>
            </div>
          </div>
        </div>
      </div> */}

      {/* Search */}
      {/* <div className="px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
          />
        </div>
      </div> */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search groups..."
      />
      {/* Tabs */}
      <div className="flex bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab("joined")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "joined"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          My Groups ({joinedGroups.length})
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "discover"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Discover ({otherGroups.length})
        </button>
      </div>

      {/* Content */}
      <div className="pb-6">
        {activeTab === "joined" ? (
          <div>
            {filteredJoinedGroups.length === 0 ? (
              <div className="text-center py-20 px-4 ">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold dark:text-white text-black mb-2">
                  {searchTerm ? "No groups found" : "No groups yet"}
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-4">
                  {searchTerm
                    ? "Try a different search term"
                    : "Join some groups to connect with your peers"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Create Group
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filteredJoinedGroups.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    isJoined={true}
                    openGroup={handleOpenGroup}
                    onLeave={handleLeaveGroup}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredOtherGroups.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchTerm ? "No groups found" : "No more groups"}
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  {searchTerm
                    ? "Try a different search term"
                    : "You've discovered all available groups"}
                </p>
              </div>
            ) : (
              <div>
                {filteredOtherGroups.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    onJoin={handleRequestToJoinGroup}
                    // onLeave={leaveGroup}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FloatingActionButton onClick={() => setShowCreateModal(true)} />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default GroupsPage;

const FloatingActionButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform duration-200"
  >
    <Plus className="w-6 h-6 text-white" />
  </button>
);
