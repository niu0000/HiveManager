import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AutoAssign from './pages/AutoAssign';

// ダミーページコンポーネント
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-400 mb-2">{title}</h2>
      <p className="text-gray-400">開発中です</p>
    </div>
  </div>
);

// 簡易認証チェック
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function LoginPage() {
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('admin');
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await fetch('http://localhost:8000/api/auth/token', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('ログインに失敗しました');
      
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      window.location.href = '/';
    } catch (err) {
      setError('ユーザー名またはパスワードが正しくありません');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">GuestHouse</h1>
          <p className="text-gray-500 mt-2">管理システムにログイン</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            ログイン
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          デフォルト: admin / admin
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/auto-assign" element={<ProtectedRoute><AutoAssign /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Placeholder title="京都おすすめ" /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Placeholder title="アラート一覧" /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Placeholder title="設定" /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}