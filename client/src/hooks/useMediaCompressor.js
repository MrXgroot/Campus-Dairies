// src/hooks/useMediaCompressor.js
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { useVideoCompressor } from "./useVideoCompressor";

export const useMediaCompressor = (onCompressed) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleVideoCompressed = (compressedFile) => {
    setIsCompressing(false);
    setStatus("Video compressed successfully");
    const file = new File([compressedFile], "compressed.mp4", {
      type: "video/mp4",
      lastModified: Date.now(),
    });
    onCompressed?.(file);
  };

  const compressVideo = useVideoCompressor(handleVideoCompressed);

  const compressMedia = async (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    setError(null);

    try {
      setIsCompressing(true);

      if (isImage) {
        setStatus("Compressing image...");
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 720,
          useWebWorker: true,
          fileType: "image/webp",
          initialQuality: 0.7,
        };
        const compressedImage = await imageCompression(file, options);
        setIsCompressing(false);
        setStatus("Image compressed successfully");
        onCompressed?.(compressedImage);
        return;
      }

      if (isVideo) {
        setStatus("Compressing video...");
        compressVideo(file); // This will call onCompressed when done
        return;
      }

      throw new Error("Unsupported file type");
    } catch (err) {
      setIsCompressing(false);
      setError(err.message || "Compression failed");
      setStatus("Compression failed");
      console.error("❌ Compression error:", err);
    }
  };

  return {
    compressMedia, // Call this with a File
    isCompressing, // boolean
    status, // status message
    error, // error message (if any)
  };
};
