import { create } from 'zustand';

const useCaseStore = create((set, get) => ({
  cases: [],
  activeCase: null,
  loading: false,
  error: null,
  stats: null,
  
  setCases: (cases) => set({ cases }),
  
  addCase: (newCase) => set((state) => ({
    cases: [newCase, ...state.cases]
  })),
  
  updateCase: (caseId, updates) => set((state) => ({
    cases: state.cases.map(c => 
      c.caseId === caseId ? { ...c, ...updates } : c
    ),
    activeCase: state.activeCase?.caseId === caseId 
      ? { ...state.activeCase, ...updates }
      : state.activeCase
  })),
  
  setActiveCase: (caseData) => set({ activeCase: caseData }),
  
  clearActiveCase: () => set({ activeCase: null }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setStats: (stats) => set({ stats }),
  
  getCaseById: (caseId) => {
    const state = get();
    return state.cases.find(c => c.caseId === caseId) || state.activeCase;
  },
  
  getHighPriorityCount: () => {
    const state = get();
    return state.cases.filter(c => 
      c.priority?.level === 'HIGH' && c.status === 'active'
    ).length;
  }
}));

export default useCaseStore;
