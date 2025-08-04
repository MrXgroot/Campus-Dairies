// src/hooks/useVideoCompressor.js
import { useRef } from "react";
import VideoCompressor from "../worker/videoCompressor.worker.js?worker";

export const useVideoCompressor = (
  onCompressed,
  onProgress,
  onStatusChange
) => {
  const workerRef = useRef(null);

  const compressVideo = (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    if (!workerRef.current) {
      workerRef.current = new VideoCompressor();

      workerRef.current.onerror = (e) => {
        console.error("🔥 Worker error:", e);
        onStatusChange?.("Video compression failed");
        onProgress?.({
          phase: "error",
          progress: 0,
          message: "Worker error occurred",
        });
      };

      workerRef.current.onmessage = (e) => {
        if (!e.data) {
          console.warn("⚠️ Compression failed");
          onStatusChange?.("Compression failed");
          onProgress?.({
            phase: "error",
            progress: 0,
            message: "Compression failed",
          });
          return;
        }

        const {
          type,
          file: compressedFile,
          error,
          message,
          progress,
          time,
        } = e.data;

        // Handle new message types for progress tracking
        switch (type) {
          case "ffmpeg_loading_start":
            console.log("📥 FFmpeg loading started");
            onStatusChange?.(message || "Downloading FFmpeg modules...");
            onProgress?.({
              phase: "downloading",
              progress: 10,
              message: message || "Downloading FFmpeg modules...",
            });
            break;

          case "ffmpeg_loading_complete":
            console.log("✅ FFmpeg loaded successfully");
            onStatusChange?.(message || "FFmpeg loaded successfully");
            onProgress?.({
              phase: "ready",
              progress: 30,
              message: message || "FFmpeg ready",
            });
            break;

          case "ffmpeg_loading_error":
            console.error("❌ FFmpeg loading failed:", error);
            onStatusChange?.(error || "Failed to download FFmpeg modules");
            onProgress?.({
              phase: "error",
              progress: 0,
              message: error || "FFmpeg download failed",
            });
            break;

          case "compression_status":
            console.log("🔄 Compression status:", message);
            onStatusChange?.(message);
            onProgress?.({ phase: "compressing", progress: 50, message });
            break;

          case "compression_progress":
            console.log(`📊 Compression progress: ${progress}%`);
            onProgress?.({
              phase: "compressing",
              progress: Math.max(progress || 0, 50), // Ensure minimum 50% for compression phase
              message: `Compressing video... ${progress || 0}%`,
              time,
            });
            break;

          case "compression_complete":
            console.log("✅ Got compressed video blob");
            onStatusChange?.("Video compressed successfully");
            onProgress?.({
              phase: "complete",
              progress: 100,
              message: "Compression complete",
            });
            onCompressed?.(compressedFile);
            break;

          case "compression_error":
            console.error("❌ Compression error:", error);
            onStatusChange?.(error || "Video compression failed");
            onProgress?.({
              phase: "error",
              progress: 0,
              message: error || "Compression failed",
            });
            break;

          default:
            // Handle legacy format for backward compatibility
            if (e.data.file) {
              console.log("✅ Got compressed video blob (legacy format)");
              onStatusChange?.("Video compressed successfully");
              onProgress?.({
                phase: "complete",
                progress: 100,
                message: "Compression complete",
              });
              onCompressed(e.data.file);
            } else if (e.data.error) {
              console.error("❌ Compression error (legacy):", e.data.error);
              onStatusChange?.(e.data.error);
              onProgress?.({
                phase: "error",
                progress: 0,
                message: e.data.error,
              });
            }
        }
      };
    }

    console.log("📤 Sending file to worker");
    onStatusChange?.("Preparing video compression...");
    onProgress?.({
      phase: "preparing",
      progress: 5,
      message: "Preparing video compression...",
    });
    workerRef.current.postMessage(file);
  };

  return compressVideo;
};
