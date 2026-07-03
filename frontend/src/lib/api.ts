import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証トークンの自動付与
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const res = await api.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },
};

export const dashboardApi = {
  getStatus: async () => {
    // ダミーデータ返却（バックエンド実装待ち用）
    return {
      checkInToday: 18,
      checkOutToday: 15,
      availableBeds: 12,
      totalBeds: 74,
      alerts: [{ id: 1, message: 'オーバーブックの可能性（1 件）', type: 'warning' }],
      errors: [],
    };
  },
};

export const assignmentApi = {
  uploadCsv: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/reservations/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  runAutoAssign: async () => {
    const res = await api.post('/assignments/run');
    return res.data;
  },
};
