import { create } from "zustand";
const useSoundStore = create((set, get) => ({
  isMuted: true,
  setIsMuted: () => set((state) => ({ isMuted: !state.isMuted })),
}));

export default useSoundStore;
