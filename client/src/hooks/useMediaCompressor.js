// src/hooks/useMediaCompressor.js
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { useVideoCompressor } from "./useVideoCompressor";
import useLoaderStore from "../store/loaderStore";

export const useMediaCompressor = (onCompressed) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    phase: null,
    progress: 0,
    message: null,
  });

  // Get loader store methods
  const { setCompressing, setCompressionProgress } = useLoaderStore();

  const handleVideoCompressed = (compressedFile) => {
    setIsCompressing(false);
    setCompressing(false);
    setStatus("Video compressed successfully");
    setProgress({
      phase: "complete",
      progress: 100,
      message: "Video compression complete",
    });
    setCompressionProgress({
      phase: "complete",
      progress: 100,
      message: "Video compression complete",
    });

    const file = new File([compressedFile], "compressed.mp4", {
      type: "video/mp4",
      lastModified: Date.now(),
    });

    onCompressed?.(file);
  };

  const handleVideoProgress = (progressData) => {
    setProgress(progressData);
    setStatus(progressData.message);
    setCompressionProgress(progressData);

    // Update compressing state based on phase
    const isStillCompressing =
      progressData.phase !== "complete" && progressData.phase !== "error";
    setIsCompressing(isStillCompressing);
    setCompressing(isStillCompressing);
  };

  const handleVideoStatusChange = (statusMessage) => {
    setStatus(statusMessage);
  };

  const compressVideo = useVideoCompressor(
    handleVideoCompressed,
    handleVideoProgress,
    handleVideoStatusChange
  );

  const compressMedia = async (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    setError(null);
    setProgress({ phase: null, progress: 0, message: null });

    try {
      setIsCompressing(true);
      setCompressing(true);

      if (isImage) {
        setStatus("Compressing image...");
        setProgress({
          phase: "compressing",
          progress: 50,
          message: "Compressing image...",
        });
        setCompressionProgress({
          phase: "compressing",
          progress: 50,
          message: "Compressing image...",
        });

        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 720,
          useWebWorker: true,
          fileType: "image/webp",
          initialQuality: 0.7,
        };

        const compressedImage = await imageCompression(file, options);

        setIsCompressing(false);
        setCompressing(false);
        setStatus("Image compressed successfully");
        setProgress({
          phase: "complete",
          progress: 100,
          message: "Image compression complete",
        });
        setCompressionProgress({
          phase: "complete",
          progress: 100,
          message: "Image compression complete",
        });

        onCompressed?.(compressedImage);
        return;
      }

      if (isVideo) {
        setStatus("Preparing video compression...");
        setProgress({
          phase: "preparing",
          progress: 5,
          message: "Preparing video compression...",
        });
        setCompressionProgress({
          phase: "preparing",
          progress: 5,
          message: "Preparing video compression...",
        });

        compressVideo(file); // This will handle all progress updates through callbacks
        return;
      }

      throw new Error("Unsupported file type");
    } catch (err) {
      setIsCompressing(false);
      setCompressing(false);
      setError(err.message || "Compression failed");
      setStatus("Compression failed");
      setProgress({
        phase: "error",
        progress: 0,
        message: err.message || "Compression failed",
      });
      setCompressionProgress({
        phase: "error",
        progress: 0,
        message: err.message || "Compression failed",
      });
      console.error("❌ Compression error:", err);
    }
  };

  return {
    compressMedia, // Call this with a File
    isCompressing, // boolean
    status, // status message
    error, // error message (if any)
    progress, // { phase, progress, message }
  };
};
