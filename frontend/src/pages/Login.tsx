import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FormData で送信 (OAuth2PasswordRequestForm 形式)
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, role } = response.data;
      
      // トークン保存
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      
      // ダッシュボードへ遷移
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Hive Manager</h1>
          <p className="text-primary-100 mt-2">スタッフポータル</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              loading 
                ? 'bg-primary-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30'
            }`}
          >
            {loading ? (
              <span className="animate-pulse">ログイン中...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                ログイン
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 text-center text-xs text-gray-500">
          © 2024 Hive Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
}