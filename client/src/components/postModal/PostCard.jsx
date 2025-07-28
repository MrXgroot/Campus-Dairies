import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

const PostCard = ({ post, user }) => {
  const isVideo = post.type === "video";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      <div className="aspect-square bg-black">
        {isVideo ? (
          <video controls className="w-full h-full object-cover">
            <source src={post.image} type="video/mp4" />
          </video>
        ) : (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 flex items-center gap-6 text-gray-600 dark:text-gray-300">
        <button className="hover:text-red-500 transition-colors flex items-center gap-1">
          <Heart className="w-5 h-5" />
          <span className="text-sm">Like</span>
        </button>
        <button className="hover:text-blue-500 transition-colors flex items-center gap-1">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Comment</span>
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
        {post.caption && (
          <p>
            <span className="font-semibold">{post.user.username}</span>{" "}
            {post.caption}
          </p>
        )}

        {/* Tagged users */}
        {post.taggedUsers?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {post.taggedUsers.map((u, i) => (
              <span
                key={i}
                className="text-xs text-blue-600 dark:text-blue-400"
              >
                @{u.username}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comment count */}
      <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400">
        {post.comments?.length > 0 && (
          <span>View all {post.comments.length} comments</span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
