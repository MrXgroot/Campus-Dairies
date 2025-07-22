// store/loaderStore.js
import { create } from "zustand";

const useLoaderStore = create((set) => ({
  isUploading: false,
  setUploading: (value) => set({ isUploading: value }),
}));

export default useLoaderStore;
