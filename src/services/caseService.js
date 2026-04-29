import api from "./api";

export const caseService = {
  // Create new case
  createCase: async (caseData) => {
    const response = await api.post("/cases", caseData);
    return response.data;
  },

  // Get all cases
  getAllCases: async (filters = {}) => {
    const response = await api.get("/cases", { params: filters });
    return response.data;
  },

  // Get case by ID
  getCaseById: async (caseId) => {
    const response = await api.get(`/cases/${caseId}`);
    return response.data;
  },

  // Update case
  updateCase: async (caseId, updates) => {
    const response = await api.put(`/cases/${caseId}`, updates);
    return response.data;
  },

  // Add sighting
  addSighting: async (caseId, sightingData) => {
    const response = await api.post(`/cases/${caseId}/sightings`, sightingData);
    return response.data;
  },

  // Resolve case
  resolveCase: async (caseId, resolution) => {
    const response = await api.patch(`/cases/${caseId}/resolve`, resolution);
    return response.data;
  },

  // Get nearby cases
  getNearbyCases: async (lat, lng, radius = 5000) => {
    const response = await api.get("/cases/nearby", {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  // Quick sighting
  quickSighting: async (sightingData) => {
    const response = await api.post("/cases/quick", sightingData);
    return response.data;
  },

  // Update case notification preferences
  updateNotifications: async (caseId, payload) => {
    const response = await api.patch(`/cases/${caseId}/notifications`, payload);
    return response.data;
  },

  // Send an SMS update for a case
  sendSMSUpdate: async (caseId, payload) => {
    const response = await api.post(`/cases/${caseId}/sms`, payload);
    return response.data;
  },

  // Get high priority cases
  getHighPriorityCases: async () => {
    const response = await api.get("/cases/high-priority");
    return response.data;
  },

  // Find potential matches for a case
  findMatches: async (caseId) => {
    const response = await api.post("/matching/find", { caseId });
    return response.data;
  },

  // Search cases
  searchCases: async (query, status) => {
    const response = await api.get("/cases/search", {
      params: { q: query, status },
    });
    return response.data;
  },

  // Search cases by face embedding or case ID
  searchByEmbedding: async (payload) => {
    const response = await api.post("/ai/search", payload);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get("/cases/stats");
    return response.data;
  },
};
