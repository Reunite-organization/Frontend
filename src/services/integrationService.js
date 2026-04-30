import api from "@/services/api";

export const integrationService = {
  getSupportedLanguages: async () => {
    const response = await api.get("/ai/languages");
    return response.data;
  },

  predictCaseOutcome: async (caseData) => {
    const response = await api.post("/predictions/case-outcome", { caseData });
    return response.data;
  },

  listSchoolNetworks: async () => {
    const response = await api.get("/school-networks");
    return response.data;
  },

  registerSchoolNetwork: async (payload) => {
    const response = await api.post("/school-networks", payload);
    return response.data;
  },

  getSchoolNetworkStats: async () => {
    const response = await api.get("/school-networks/stats");
    return response.data;
  },

  getMonitoringHealth: async () => {
    const response = await api.get("/monitoring/health");
    return response.data;
  },
};

export default integrationService;
