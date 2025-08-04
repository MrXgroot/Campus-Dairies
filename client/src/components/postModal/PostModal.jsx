import { X, ArrowLeft, Plus, Search } from "lucide-react";

import { useRef, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import usePostStore from "../../store/postStore";
import toast from "react-hot-toast";
import useLoaderStore from "../../store/loaderStore";
import { useMediaCompressor } from "../../hooks/useMediaCompressor";
import useUserStore from "../../store/userStore";
import debounce from "lodash.debounce";
import PostCard from "./PostCard";
import SelectFilePage from "./pages/SelectFilePage";
import EditPage from "./pages/EditPage";
import PostModalHeader from "./PostModalHeader";
import TagUserModal from "./TagUserModal";
import api from "../../utils/api";
import useAuthStore from "../../store/authStore";
// import { motion, AnimatePresence } from "framer-motion";
//everythingg is fine jsut tagged user issue correct that afterards

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
  const [rawFile, setRawFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const groupId = location.pathname == "/" ? "public" : id;
  const uploadPost = usePostStore((state) => state.uploadPost);
  const { setUploading, setUploadProgress } = useLoaderStore();

  const MAX_VIDEO_SIZE_MB = 50;
  const { fetchTaggableUsers, people, loadingPeople } = useUserStore();
  const { user } = useAuthStore();
  const { compressMedia } = useMediaCompressor(async (compressedFile) => {
    if (!compressedFile) {
      toast.error("Compression failed");
      return;
    }

    try {
      setUploading(true, 0, "Getting upload signature...");
      const sigRes = await api.get(
        `/posts/generate-signature?groupId=${groupId}`
      );
      const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;
      setUploadProgress(10, "Preparing upload...");
      const cloudForm = new FormData();
      cloudForm.append("file", compressedFile);
      cloudForm.append("api_key", apiKey);
      cloudForm.append("timestamp", timestamp);
      cloudForm.append("signature", signature);
      cloudForm.append("folder", folder);

      setUploadProgress(20, "Uploading to cloud...");

      const cloudinaryUpload = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: cloudForm,
        }
      );
      setUploadProgress(70, "Processing upload...");
      const result = await cloudinaryUpload.json();

      if (!result.secure_url) {
        throw new Error("Cloudinary upload Failed");
      }

      setUploadProgress(80, "Saving post data...");

      const postData = {
        mediaUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        type: result.resource_type,
        caption,
        mood: "❤️",
        groupId,
        taggedUsers: JSON.stringify(taggedUsers.map((u) => u._id)),
        filename: result.original_filename,
        categories: JSON.stringify(
          selectedCategories.length > 0 ? selectedCategories : ["college"]
        ), // Add categories
      };

      setUploadProgress(90, "Finalizing post...");

      // 4. Send to backend using axios
      uploadPost(postData, groupId !== "public");
      setUploadProgress(100, "Post created successfully!");

      // Clean up after a short delay
      setTimeout(() => {
        setUploading(false);
      }, 1000);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
      toast.error("Upload failed");
    }
  });
  const debouncedSearch = useMemo(
    () => debounce((term) => fetchTaggableUsers(term || "mrx"), 300),
    []
  );

  useEffect(() => {
    if (showTagPopup) debouncedSearch(tagSearch);
    return () => debouncedSearch.cancel();
  }, [tagSearch, showTagPopup]);

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Only image and video files are supported.");
      return;
    }

    // ✅ Show preview immediately using original file
    const previewURL = URL.createObjectURL(file);
    setRawFile(file);
    setImagePreview(previewURL);
    setMediaType(isImage ? "image" : "video");
    setStep(2);
  };

  const handleNext = () => {
    if (!caption.trim()) {
      alert("Please add a caption.");
      return;
    }
    setStep(3);
  };

  const handleShare = async () => {
    if (!rawFile) {
      toast.error("No file selected.");
      return;
    }
    if (
      mediaType === "video" &&
      rawFile.size / (1024 * 1024) > MAX_VIDEO_SIZE_MB
    ) {
      toast("Dont close the window while uploading", {
        duration: 6000,
        icon: "⏳",
      });
    }
    try {
      await compressMedia(rawFile);
      setUploading(true);
      resetAndClose();
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error("Failed to upload. Try again.");
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

  const handleShowTaggedPopup = () => {
    fetchTaggableUsers();
    setShowTagPopup(true);
  };

  const mockPost = {
    type: mediaType,
    image: imagePreview,
    caption,
    user: {
      username: "sukesh_acharya",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    taggedUsers,
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black dark:bg-black flex flex-col z-100">
      {/* Header */}

      <PostModalHeader
        step={step}
        setStep={setStep}
        handleNext={handleNext}
        handleShare={handleShare}
        resetAndClose={resetAndClose}
      />
      {/* Content */}
      <div className="flex-1 bg-white dark:bg-black overflow-hidden">
        {/* Step 1: Select Image */}
        {step === 1 && (
          <SelectFilePage
            fileInputRef={fileInputRef}
            handleMediaUpload={handleMediaUpload}
          />
        )}

        {/* Step 2: Edit Image & Add Caption */}
        {step === 2 && (
          <EditPage
            mediaType={mediaType}
            imagePreview={imagePreview}
            setCaption={setCaption}
            handleShowTaggedPopup={handleShowTaggedPopup}
            taggedUsers={taggedUsers}
            removeTag={removeTag}
            caption={caption}
            user={user}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
          />
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <div className="p-4">
              <PostCard post={mockPost} user={user} />
            </div>
          </div>
        )}
      </div>

      {/* Tag People Popup */}

      {showTagPopup && (
        <TagUserModal
          tagSearch={tagSearch}
          setTagSearch={setTagSearch}
          setShowTagPopup={setShowTagPopup}
          people={people}
          handleTagUser={handleTagUser}
        />
      )}
    </div>
  );
};
export default PostModal;
