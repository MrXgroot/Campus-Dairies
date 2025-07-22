// src/hooks/useVideoCompressor.js
import { useRef } from "react";
import VideoCompressor from "../worker/videoCompressor.worker.js?worker";

export const useVideoCompressor = (onCompressed) => {
  const workerRef = useRef(null);

  const compressVideo = (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    if (!workerRef.current) {
      workerRef.current = new VideoCompressor();

      workerRef.current.onerror = (e) => {
        console.error("🔥 Worker error:", e);
      };

      workerRef.current.onmessage = (e) => {
        if (!e.data) {
          console.warn("⚠️ Compression failed");
          return;
        }

        console.log("✅ Got compressed video blob");
        onCompressed(e.data.file);
      };
    }

    console.log("📤 Sending file to worker");
    workerRef.current.postMessage(file);
  };

  return compressVideo;
};
