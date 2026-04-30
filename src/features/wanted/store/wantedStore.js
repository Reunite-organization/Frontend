import { create } from "zustand";

export const useWantedStore = create((set) => ({
  activeTab: "browse",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
