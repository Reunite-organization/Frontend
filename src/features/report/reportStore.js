import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useReportStore = create(
  persist(
    (set, get) => ({
      draftReport: null,
      recentReports: [],
      offlineQueue: [],
      
      saveDraft: (draft) => set({ draftReport: draft }),
      
      clearDraft: () => set({ draftReport: null }),
      
      addRecentReport: (report) => set((state) => ({
        recentReports: [report, ...state.recentReports].slice(0, 10)
      })),
      
      addToOfflineQueue: (report) => set((state) => ({
        offlineQueue: [...state.offlineQueue, {
          ...report,
          queuedAt: new Date().toISOString(),
          id: `offline-${Date.now()}`
        }]
      })),
      
      removeFromOfflineQueue: (id) => set((state) => ({
        offlineQueue: state.offlineQueue.filter(r => r.id !== id)
      })),
      
      clearOfflineQueue: () => set({ offlineQueue: [] }),
      
      getQueuedCount: () => get().offlineQueue.length
    }),
    {
      name: 'report-storage',
      partialize: (state) => ({
        draftReport: state.draftReport,
        offlineQueue: state.offlineQueue
      })
    }
  )
);

export default useReportStore;
