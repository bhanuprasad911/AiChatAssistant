import axiosInstance from '../api/axiosInstance';

export const chatService = {
  sendMessage: async (sessionId, message) => {
    const response = await axiosInstance.post('/chat', { sessionId, message });
    return response.data;
  },

  getHistory: async (sessionId) => {
    const response = await axiosInstance.get(`/conversations/${sessionId}`);
    return response.data;
  },

  getAllSessions: async () => {
    const response = await axiosInstance.get('/sessions');
    return response.data;
  }
};