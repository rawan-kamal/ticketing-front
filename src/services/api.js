import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export { API_URL };

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const ticketAPI = {
  submitTicket: (data) => api.post('/tickets/submit', data),
  trackTicket: (ticketNumber, customerEmail) =>
    api.post('/tickets/track', { ticketNumber, customerEmail }),
  getAllTickets: (params) => api.get('/tickets', { params }),
  getTicket: (id) => api.get(`/tickets/${id}`),
  updateStatus: (id, status) => api.put(`/tickets/${id}/status`, { status }),
  updatePriority: (id, priority) => api.put(`/tickets/${id}/priority`, { priority }),
  deleteTicket: (id) => api.delete(`/tickets/${id}`),
  getStats: () => api.get('/tickets/stats/overview'),
};

export const replyAPI = {
  getPublicReplies: (ticketNumber, customerEmail) =>
    api.post(`/replies/track/${ticketNumber}`, { customerEmail }),
  sendCustomerReply: (ticketNumber, customerEmail, message) =>
    api.post(`/replies/customer/${ticketNumber}`, { customerEmail, message }),
  getReplies: (ticketId) => api.get(`/replies/ticket/${ticketId}`),
  sendReply: (ticketId, message) => api.post(`/replies/ticket/${ticketId}`, { message }),
  deleteReply: (id) => api.delete(`/replies/${id}`),
};
