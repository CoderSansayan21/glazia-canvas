import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Attach JWT token automatically on every request, if logged in
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If token expired/invalid, backend sends 401 -> auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Optional: redirect to login. Left to calling code/context to decide.
    }
    return Promise.reject(error);
  }
);

// ----Canvas API calls ----
export const canvasApi = {
  create: (data: { name: string; elements: any[]; layerOrder: string[] }) =>
    api.post('/canvases', data),

  getAll: () => api.get('/canvases'),

  getById: (id: string) => api.get(`/canvases/${id}`),

  update: (id: string, data: { name?: string; elements?: any[]; layerOrder?: string[] }) =>
    api.put(`/canvases/${id}`, data),

  delete: (id: string) => api.delete(`/canvases/${id}`),
};

// ----Auth API calls ----
export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),
};

export default api;