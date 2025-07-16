import { X, ImageIcon, ArrowLeft, Plus, Search } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import usePostStore from "../../store/postStore";
import imageCompression from "browser-image-compression";
// Enhanced people data with avatars and full names
const peopleData = [
  {
    username: "arjun_sharma",
    fullName: "Arjun Sharma",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "priya_patel",
    fullName: "Priya Patel",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "rohan_gupta",
    fullName: "Rohan Gupta",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isFollowing: false,
  },
  {
    username: "sneha_singh",
    fullName: "Sneha Singh",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "vikram_reddy",
    fullName: "Vikram Reddy",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "kavya_nair",
    fullName: "Kavya Nair",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    isFollowing: false,
  },
  {
    username: "aditya_joshi",
    fullName: "Aditya Joshi",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "riya_mehta",
    fullName: "Riya Mehta",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "rahul_kumar",
    fullName: "Rahul Kumar",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
    isFollowing: false,
  },
  {
    username: "ananya_iyer",
    fullName: "Ananya Iyer",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "dev_agarwal",
    fullName: "Dev Agarwal",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "pooja_rao",
    fullName: "Pooja Rao",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    isFollowing: false,
  },
  {
    username: "karan_shah",
    fullName: "Karan Shah",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "nisha_verma",
    fullName: "Nisha Verma",
    avatar:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "siddharth_malhotra",
    fullName: "Siddharth Malhotra",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    isFollowing: false,
  },
  {
    username: "tanya_kapoor",
    fullName: "Tanya Kapoor",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "harsh_pandey",
    fullName: "Harsh Pandey",
    avatar:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "ishita_bansal",
    fullName: "Ishita Bansal",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    isFollowing: false,
  },
  {
    username: "ayush_thakur",
    fullName: "Ayush Thakur",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
  {
    username: "meera_bhatt",
    fullName: "Meera Bhatt",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
    isFollowing: true,
  },
];

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
          <video controls className="w-full h-full object-cover">
            <source src={post.image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="w-full h-full object-cover"
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
                <span key={user} className="text-blue-600 dark:text-blue-400">
                  @{user}
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

const PostModal = ({ show, onClose, id = null }) => {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const location = useLocation();
  const [mediaType, setMediaType] = useState("image"); // or "video"
  const [selectedFile, setSelectedFile] = useState(null);

  const groupId = location.pathname == "/" ? "public" : id;
  const uploadPost = usePostStore((state) => state.uploadPost);
  if (!show) return null;

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Only image and video files are allowed.");
      return;
    }

    try {
      let finalFile = file;

      if (isImage) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 720,
          useWebWorker: true,
          fileType: "image/webp",
          initialQuality: 0.7,
        };
        finalFile = await imageCompression(file, options);
        setMediaType("image");
      } else {
        setMediaType("video");
      }

      // store compressed or original file
      setSelectedFile(finalFile);

      // preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setStep(2);
      };
      reader.readAsDataURL(finalFile);
    } catch (error) {
      console.error("Media processing error:", error);
    }
  };

  const handleNext = () => {
    if (!caption.trim()) {
      alert("Please add a caption.");
      return;
    }
    setStep(3);
  };

  const handleShare = async () => {
    if (!selectedFile) return alert("No file selected");

    const formData = new FormData();
    formData.append("file", selectedFile); // actual File or Blob
    formData.append("caption", caption);
    formData.append("type", mediaType);
    formData.append("groupId", groupId);
    formData.append("taggedUsers", JSON.stringify(taggedUsers));

    try {
      uploadPost(formData); // This will now be an API call
      resetAndClose();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setImagePreview(null);
    setMediaType("image");
    setCaption("");
    setTaggedUsers([]);
    setShowTagPopup(false);
    setTagSearch("");
    onClose();
  };

  const handleTagUser = (person) => {
    if (!taggedUsers.find((user) => user.username === person.username)) {
      setTaggedUsers([...taggedUsers, person]);
    }
    setShowTagPopup(false);
    setTagSearch("");
  };

  const removeTag = (username) => {
    setTaggedUsers(taggedUsers.filter((user) => user.username !== username));
  };

  const filteredPeople = peopleData.filter(
    (person) =>
      (person.username.toLowerCase().includes(tagSearch.toLowerCase()) ||
        person.fullName.toLowerCase().includes(tagSearch.toLowerCase())) &&
      !taggedUsers.find((user) => user.username === person.username)
  );

  // Separate following and non-following users
  const followingPeople = filteredPeople.filter((person) => person.isFollowing);
  const otherPeople = filteredPeople.filter((person) => !person.isFollowing);

  const mockPost = {
    user: {
      username: "you",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    image: imagePreview, // works for both image/video base64 or file URLs
    type: mediaType, // "image" or "video"
    caption,
    taggedUsers: taggedUsers.map((user) => user.username),
    timestamp: "now",
  };

  return (
    <div className="fixed inset-0 bg-black dark:bg-black flex flex-col z-100">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {step === 1 ? "New post" : step === 2 ? "New post" : "Share"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {step === 2 && (
            <button
              onClick={handleNext}
              className="text-blue-500 font-semibold text-sm px-3 py-1 hover:text-blue-600 transition-colors"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleShare}
              className="text-blue-500 font-semibold text-sm px-3 py-1 hover:text-blue-600 transition-colors"
            >
              Share
            </button>
          )}
          <button
            onClick={resetAndClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-black overflow-hidden">
        {/* Step 1: Select Image */}
        {step === 1 && (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-white mb-2">
                  Select photos and videos
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                  Share up to 10 photos and videos
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Select from device
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Edit Image & Add Caption */}
        {step === 2 && (
          <div className="h-full flex flex-col">
            {/* Image Preview */}
            <div className="flex-1 bg-black flex items-center justify-center">
              <div className="w-full max-w-md aspect-square">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Caption and Options */}
            <div className="bg-white dark:bg-gray-900 p-4 space-y-4 max-h-80 overflow-y-auto sticky bottom-0 w-full ">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none border-none outline-none text-sm"
                  rows={3}
                />
              </div>

              {/* Tag People */}
              <button
                onClick={() => setShowTagPopup(true)}
                className="flex items-center justify-between w-full py-3 text-left border-t border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-900 dark:text-white text-sm">
                  Tag people
                </span>
                <div className="flex items-center gap-2">
                  {taggedUsers.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {taggedUsers.length} tagged
                    </span>
                  )}
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </div>
              </button>

              {/* Tagged Users Display */}
              {taggedUsers.length > 0 && (
                <div className="space-y-2">
                  {taggedUsers.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTag(user.username)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <div className="p-4">
              <PostCard post={mockPost} />
            </div>
          </div>
        )}
      </div>

      {/* Tag People Popup */}
      {showTagPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-60">
          <div className="bg-white dark:bg-gray-900 w-full max-h-[85vh] rounded-t-xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tag people
              </h3>
              <button
                onClick={() => setShowTagPopup(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border-none outline-none"
                />
              </div>
            </div>

            {/* People List */}
            <div className="flex-1 overflow-y-auto">
              {/* Following Section */}
              {followingPeople.length > 0 && (
                <div>
                  {tagSearch === "" && (
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Following
                      </h4>
                    </div>
                  )}
                  {followingPeople.map((person) => (
                    <button
                      key={person.username}
                      onClick={() => handleTagUser(person)}
                      className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-700"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={person.avatar || "/placeholder.svg"}
                          alt={person.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-gray-900 dark:text-white font-medium text-sm">
                          {person.username}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {person.fullName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Other People Section */}
              {otherPeople.length > 0 && (
                <div>
                  {tagSearch === "" && followingPeople.length > 0 && (
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Others
                      </h4>
                    </div>
                  )}
                  {otherPeople.map((person) => (
                    <button
                      key={person.username}
                      onClick={() => handleTagUser(person)}
                      className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-700"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={person.avatar || "/placeholder.svg"}
                          alt={person.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-gray-900 dark:text-white font-medium text-sm">
                          {person.username}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {person.fullName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {filteredPeople.length === 0 && tagSearch !== "" && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No results found for "{tagSearch}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PostModal;
