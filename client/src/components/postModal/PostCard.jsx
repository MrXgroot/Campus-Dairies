const PostCard = ({ post }) => {
  const isVideo = post.type === "video";
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Post Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={post.user.avatar || "/placeholder.svg"}
            alt={post.user.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            {post.user.username}
          </h3>
        </div>
      </div>

      {/* Media (Image or Video) */}
      <div className="aspect-square overflow-hidden">
        {isVideo ? (
          <video className="w-full h-full object-contain">
            <source src={post.image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Caption + Tagged Users */}
      <div className="px-4 py-3">
        <div className="text-gray-900 dark:text-white text-sm">
          <span className="font-semibold">{post.user.username}</span>
          <span className="ml-2">{post.caption}</span>

          {/* Tagged Users */}
          {post.taggedUsers && post.taggedUsers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.taggedUsers.map((user, index) => (
                <span key={index} className="text-blue-600 dark:text-blue-400">
                  @{user.username}
                  {index < post.taggedUsers.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PostCard;
