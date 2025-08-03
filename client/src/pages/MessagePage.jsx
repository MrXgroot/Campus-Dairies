import React, { useState, useEffect, useCallback, memo } from "react";
import moment from "moment";
import Header from "../components/header/Header";
import useAuthStore from "../store/authStore";
import useMessageWallStore from "../store/messageWallStore";
import {
  Send,
  MoreVertical,
  Trash2,
  Flag,
  RefreshCw,
  Loader,
} from "lucide-react";

const MessageCard = memo(({ message }) => {
  const [showOptions, setShowOptions] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { deleteMessage, reportMessage } = useMessageWallStore();

  const timeAgo = moment(message.createdAt).fromNow();
  const canDelete = message.author._id === user._id || user.isVerified;

  const handleDelete = useCallback(async () => {
    const success = await deleteMessage(message._id);
    if (success) {
      setShowOptions(false);
    }
  }, [message._id, deleteMessage]);

  const handleReport = useCallback(async () => {
    const success = await reportMessage(message._id);
    if (success) {
      setShowOptions(false);
    }
  }, [message._id, reportMessage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={message.author.avatar}
              alt={message.author.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {message.author.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {timeAgo}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-20 w-32 border border-gray-200 dark:border-gray-600">
              {!canDelete && (
                <button
                  onClick={handleReport}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-red-500 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
        {message.content}
      </p>
    </div>
  );
});

const MessageWall = () => {
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    messages,
    loading,
    sending,
    hasMore,
    fetchMessages,
    createMessage,
    searchMessages,
    refreshMessages,
    loadMoreMessages,
  } = useMessageWallStore();

  // Initial load
  useEffect(() => {
    fetchMessages(1, "", true);
  }, [fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim()) {
      const success = await createMessage(newMessage.trim());
      if (success) {
        setNewMessage("");
      }
    }
  }, [newMessage, createMessage]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshMessages();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refreshMessages]);

  const handleSearch = useCallback(
    async (term) => {
      setSearchTerm(term);
      if (term !== searchTerm) {
        await searchMessages(term);
      }
    },
    [searchTerm, searchMessages]
  );

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasMore && !loading) {
          loadMoreMessages();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadMoreMessages]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={handleSearch}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with everyone..."
            className="w-full resize-none border-none outline-none bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
            maxLength={500}
            disabled={sending}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {newMessage.length}/500
            </span>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div>
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 dark:text-gray-300">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))}

              {/* Load More Indicator */}
              {loading && (
                <div className="flex justify-center items-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* End of Messages */}
              {!hasMore && messages.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    You've reached the end of messages
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {searchTerm ? "No messages found" : "No messages yet"}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "Be the first to share something!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageWall;
