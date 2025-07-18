import { create } from "zustand";

const useModalStore = create((set) => ({
  loginModal: false,
  showCommentModal: false,
  uploadModal: false,
  currentPost: null,

  openLoginModal: () => set({ loginModal: true }),
  closeLoginModal: () => set({ loginModal: false }),

  openCommentModal: (post) => {
    set({ showCommentModal: true });
  },
  closeCommentModal: () => set({ showCommentModal: false, currentPost: null }),

  openUploadModal: () => set({ uploadModal: true }),
  closeUploadModal: () => set({ uploadModal: false }),
}));

export default useModalStore;
