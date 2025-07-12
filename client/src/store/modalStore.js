import { create } from "zustand";

const useModalStore = create((set) => ({
  loginModal: false,
  commentModal: false,
  uploadModal: false,
  currentPost: null,

  openLoginModal: () => set({ loginModal: true }),
  closeLoginModal: () => set({ loginModal: false }),

  openCommentModal: (post) => set({ commentModal: true, currentPost: post }),
  closeCommentModal: () => set({ commentModal: false, currentPost: null }),

  openUploadModal: () => set({ uploadModal: true }),
  closeUploadModal: () => set({ uploadModal: false }),
}));

export default useModalStore;
