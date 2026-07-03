const API_BASE_URL = 'http://localhost:8000/api';

// 認証ヘッダーを取得
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 汎用 API リクエスト関数
const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }
  
  return res.json();
};

// Dashboard API
export const dashboardApi = {
  getStatus: () => request('/dashboard/status'),
};

// Sheets API
export const sheetsApi = {
  testConnection: () => request('/sheets/test'),
  getSettings: () => request('/settings'),
  updateSetting: (key: string, value: string, description?: string) => 
    request('/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value, description }),
    }),
};

// Sync API
export const syncApi = {
  importFromSheet: () => request('/sync/import', { method: 'POST' }),
  exportToSheet: () => request('/sync/export', { method: 'POST' }),
  getBackgroundColors: (spreadsheetId: string, range?: string) => 
    request(`/sheets/colors?spreadsheet_id=${spreadsheetId}&range=${range || 'Sheet1!A1:Z1000'}`),
};

// Auth API
export const authApi = {
  login: (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    });
  },
};
