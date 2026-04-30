import { create } from 'zustand';

const useMapStore = create((set, get) => ({
  mapInstance: null,
  userLocation: null,
  selectedCase: null,
  mapMode: 'default', // 'default' or 'context'
  visibleLayers: {
    heatmap: true,
    trail: true,
    markers: true,
    coverage: false
  },
  filters: {
    priority: ['HIGH', 'MEDIUM', 'LOW'],
    status: ['active'],
    radius: 10
  },
  
  setMapInstance: (map) => set({ mapInstance: map }),
  
  setUserLocation: (location) => set({ userLocation: location }),
  
  setSelectedCase: (caseData) => set({ 
    selectedCase: caseData,
    mapMode: caseData ? 'context' : 'default'
  }),
  
  setMapMode: (mode) => set({ mapMode: mode }),
  
  toggleLayer: (layer) => set((state) => ({
    visibleLayers: {
      ...state.visibleLayers,
      [layer]: !state.visibleLayers[layer]
    }
  })),
  
  updateFilters: (newFilters) => set((state) => ({
    filters: {
      ...state.filters,
      ...newFilters
    }
  })),
  
  reset: () => set({
    selectedCase: null,
    mapMode: 'default'
  })
}));

export default useMapStore;
