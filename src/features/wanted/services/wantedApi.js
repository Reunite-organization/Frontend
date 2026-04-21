import axios from '../../../lib/axios';

export const wantedApi = {
  // Profile
  getProfile: () => axios.get('/api/wanted/profile').then(res => res.data.data),
  createProfile: (data) => axios.post('/api/wanted/profile', data).then(res => res.data.data),
  updateProfile: (data) => axios.put('/api/wanted/profile', data).then(res => res.data.data),
  getPublicProfile: (userId) => axios.get(`/api/wanted/profile/${userId}`).then(res => res.data.data),

  // Posts
  getPosts: (params) => axios.get('/api/wanted/posts', { params }).then(res => res.data),
  getPost: (id) => axios.get(`/api/wanted/posts/${id}`).then(res => res.data.data),
  createPost: (data) => axios.post('/api/wanted/posts', data).then(res => res.data.data),
  updatePost: (id, data) => axios.put(`/api/wanted/posts/${id}`, data).then(res => res.data.data),
  deletePost: (id) => axios.delete(`/api/wanted/posts/${id}`).then(res => res.data),
  getMyPosts: (status) => axios.get('/api/wanted/posts/my/all', { params: { status } }).then(res => res.data.data),
  markReconnected: (id, successStory) => axios.post(`/api/wanted/posts/${id}/reconnected`, { successStory }).then(res => res.data.data),
  sharePost: (id) => axios.post(`/api/wanted/posts/${id}/share`).then(res => res.data.data),

  // Claims
  submitClaim: (postId, data) => axios.post(`/api/wanted/posts/${postId}/claim`, data).then(res => res.data.data),
  getPendingClaims: () => axios.get('/api/wanted/claims/pending').then(res => res.data.data),
  getMyClaims: () => axios.get('/api/wanted/claims/my').then(res => res.data.data),
  reviewClaim: (claimId, data) => axios.post(`/api/wanted/claims/${claimId}/review`, data).then(res => res.data.data),
  withdrawClaim: (claimId) => axios.post(`/api/wanted/claims/${claimId}/withdraw`).then(res => res.data),

  // Chat
  getChatRooms: () => axios.get('/api/wanted/chat/rooms').then(res => res.data.data),
  getChatMessages: (roomId, page = 1) => axios.get(`/api/wanted/chat/${roomId}/messages`, { params: { page } }).then(res => res.data.data),
  sendMessage: (roomId, data) => axios.post(`/api/wanted/chat/${roomId}/messages`, data).then(res => res.data.data),
  uploadChatPhoto: (formData) => axios.post('/api/wanted/chat/upload', formData).then(res => res.data.data),
  leaveChat: (roomId) => axios.post(`/api/wanted/chat/${roomId}/leave`).then(res => res.data),
  generateVideoToken: (roomId) => axios.post(`/api/wanted/chat/${roomId}/video`).then(res => res.data.data),

  // Verification
  sendPhoneVerification: (phoneNumber) => axios.post('/api/wanted/verify/phone', { phoneNumber }).then(res => res.data),
  verifyPhoneCode: (phoneNumber, code) => axios.post('/api/wanted/verify/phone/confirm', { phoneNumber, code }).then(res => res.data),
  generateTelegramCode: () => axios.post('/api/wanted/verify/telegram').then(res => res.data.data),

  // Stories & Stats
  getSuccessStories: (page = 1) => axios.get('/api/wanted/stories', { params: { page } }).then(res => res.data),
  likeStory: (postId) => axios.post(`/api/wanted/stories/${postId}/like`).then(res => res.data),
  getImpactStats: () => axios.get('/api/wanted/impact-stats').then(res => res.data.data),
};
