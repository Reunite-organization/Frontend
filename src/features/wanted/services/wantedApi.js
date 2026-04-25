import axios from "../../../lib/axios";

const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (typeof value === "number" && isNaN(value)) return false;
      return true;
    }),
  );
};

export const wantedApi = {
  // Profile
  getProfile: () =>
    axios.get("/api/wanted/profile").then((res) => res.data.data),
  createProfile: (data) =>
    axios.post("/api/wanted/profile", data).then((res) => res.data.data),
  updateProfile: (data) =>
    axios.put("/api/wanted/profile", data).then((res) => res.data.data),
  getPublicProfile: (userId) =>
    axios.get(`/api/wanted/profile/${userId}`).then((res) => res.data.data),

  // Posts
  getPosts: (params = {}) => {
    const cleaned = cleanParams(params);
    return axios
      .get("/api/wanted/posts", { params: cleaned })
      .then((res) => res.data);
  },
  getPost: (id) =>
    axios.get(`/api/wanted/posts/${id}`).then((res) => res.data.data),
  createPost: (data) =>
    axios.post("/api/wanted/posts", data).then((res) => res.data.data),
  updatePost: (id, data) =>
    axios.put(`/api/wanted/posts/${id}`, data).then((res) => res.data.data),
  deletePost: (id) =>
    axios.delete(`/api/wanted/posts/${id}`).then((res) => res.data),
  getMyPosts: (status) => {
    const params = status ? { status } : {};
    return axios
      .get("/api/wanted/posts/my/all", { params })
      .then((res) => res.data.data);
  },
  markReconnected: (id, successStory) =>
    axios
      .post(`/api/wanted/posts/${id}/reconnected`, { successStory })
      .then((res) => res.data.data),
  sharePost: (id) =>
    axios.post(`/api/wanted/posts/${id}/share`).then((res) => res.data.data),

  // Claims
  submitClaim: (postId, data) =>
    axios
      .post(`/api/wanted/posts/${postId}/claim`, data)
      .then((res) => res.data.data),
  getPendingClaims: () =>
    axios.get("/api/wanted/claims/pending").then((res) => res.data.data),
  getMyClaims: () =>
    axios.get("/api/wanted/claims/my").then((res) => res.data.data),
  reviewClaim: (claimId, data) =>
    axios
      .post(`/api/wanted/claims/${claimId}/review`, data)
      .then((res) => res.data.data),
  withdrawClaim: (claimId) =>
    axios
      .post(`/api/wanted/claims/${claimId}/withdraw`)
      .then((res) => res.data),

  // Chat
  generateVideoToken: async (roomId) => {
    try {
      const response = await api.get(`/chat/${roomId}/video/token`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to generate video token:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to generate video token'
      );
    }
  },

  // End video call
  endVideoCall: async (roomId, data) => {
    try {
      const response = await api.post(`/chat/${roomId}/video/end`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to end video call:', error);
      // Don't throw error for call ending - it should be fire-and-forget
      return null;
    }
  },

  // Get call history
  getCallHistory: async (roomId) => {
    try {
      const response = await api.get(`/chat/${roomId}/video/history`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get call history:', error);
      return [];
    }
  },
  getChatRooms: () =>
    axios.get("/api/wanted/chat/rooms").then((res) => res.data.data),
  getChatMessages: (roomId, page = 1) =>
    axios
      .get(`/api/wanted/chat/${roomId}/messages`, { params: { page } })
      .then((res) => res.data.data),
  sendMessage: (roomId, data) =>
    axios
      .post(`/api/wanted/chat/${roomId}/messages`, data)
      .then((res) => res.data.data),
  uploadChatPhoto: (formData) =>
    axios
      .post("/api/wanted/chat/upload", formData)
      .then((res) => res.data.data),
  leaveChat: (roomId) =>
    axios.post(`/api/wanted/chat/${roomId}/leave`).then((res) => res.data),
//   generateVideoToken: (roomId) =>
//     axios.post(`/api/wanted/chat/${roomId}/video`).then((res) => res.data.data),
//   endVideoCall: (roomId, data) =>
//     axios
//       .post(`/api/wanted/chat/${roomId}/video/end`, data)
//       .then((res) => res.data),
//   getCallHistory: (roomId) =>
//     axios.get(`/api/wanted/chat/${roomId}/calls`).then((res) => res.data.data),

  // Verification
  sendPhoneVerification: (phoneNumber) =>
    axios
      .post("/api/wanted/verify/phone", { phoneNumber })
      .then((res) => res.data),
  verifyPhoneCode: (phoneNumber, code) =>
    axios
      .post("/api/wanted/verify/phone/confirm", { phoneNumber, code })
      .then((res) => res.data),
  generateTelegramCode: () =>
    axios.post("/api/wanted/verify/telegram").then((res) => res.data.data),

  // Stories & Stats
  getSuccessStories: (page = 1, limit = 10) =>
    axios
      .get("/api/wanted/stories", { params: { page, limit } })
      .then((res) => res.data),
  getFeaturedStories: () =>
    axios.get("/api/wanted/stories/featured").then((res) => res.data.data),
  likeStory: (postId) =>
    axios.post(`/api/wanted/stories/${postId}/like`).then((res) => res.data),
  shareStory: (data) =>
    axios.post("/api/wanted/stories/share", data).then((res) => res.data.data),
  getImpactStats: () =>
    axios.get("/api/wanted/impact-stats").then((res) => res.data.data),
};
