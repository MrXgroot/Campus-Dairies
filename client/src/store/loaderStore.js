// src/store/loaderStore.js
import { create } from "zustand";

const useLoaderStore = create((set, get) => ({
  isUploading: false,
  uploadProgress: 0,
  uploadStatus: null,
  compressionProgress: { phase: null, progress: 0, message: null },
  isCompressing: false,

  // Upload methods
  setUploading: (uploading, progress = 0, status = null) => {
    set({
      isUploading: uploading,
      uploadProgress: progress,
      uploadStatus: status,
    });
  },

  setUploadProgress: (progress, status = null) => {
    set({
      uploadProgress: progress,
      uploadStatus: status,
    });
  },

  // Compression methods
  setCompressing: (compressing) => {
    set({ isCompressing: compressing });
  },

  setCompressionProgress: (progressData) => {
    set({
      compressionProgress: progressData,
      isCompressing:
        progressData.phase !== "complete" && progressData.phase !== "error",
    });
  },

  // Combined loading state
  isLoading: () => {
    const state = get();
    return state.isUploading || state.isCompressing;
  },

  // Get current loading message
  getCurrentLoadingMessage: () => {
    const state = get();

    if (state.isCompressing && state.compressionProgress.message) {
      return state.compressionProgress.message;
    }

    if (state.isUploading && state.uploadStatus) {
      return state.uploadStatus;
    }

    if (state.isUploading) {
      return `Uploading... ${state.uploadProgress}%`;
    }

    return null;
  },

  // Reset all states
  reset: () => {
    set({
      isUploading: false,
      uploadProgress: 0,
      uploadStatus: null,
      compressionProgress: { phase: null, progress: 0, message: null },
      isCompressing: false,
    });
  },
}));

export default useLoaderStore;
