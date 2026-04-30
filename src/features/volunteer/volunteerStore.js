import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVolunteerStore = create(
  persist(
    (set, get) => ({
      isVolunteer: false,
      isAvailable: false,
      currentZone: null,
      assignedCases: [],
      searchHistory: [],
      stats: {
        totalSearches: 0,
        hoursVolunteered: 0,
        casesHelped: 0
      },
      
      setVolunteerStatus: (isVolunteer) => set({ isVolunteer }),
      
      setAvailability: (isAvailable) => set({ isAvailable }),
      
      setCurrentZone: (zone) => set({ currentZone: zone }),
      
      assignCase: (caseId) => set((state) => ({
        assignedCases: [...state.assignedCases, caseId]
      })),
      
      completeCase: (caseId) => set((state) => ({
        assignedCases: state.assignedCases.filter(id => id !== caseId),
        searchHistory: [...state.searchHistory, {
          caseId,
          completedAt: new Date().toISOString()
        }],
        stats: {
          ...state.stats,
          totalSearches: state.stats.totalSearches + 1,
          casesHelped: state.stats.casesHelped + 1
        }
      })),
      
      addHours: (hours) => set((state) => ({
        stats: {
          ...state.stats,
          hoursVolunteered: state.stats.hoursVolunteered + hours
        }
      })),
      
      reset: () => set({
        isAvailable: false,
        currentZone: null,
        assignedCases: []
      })
    }),
    {
      name: 'volunteer-storage'
    }
  )
);

export default useVolunteerStore;
