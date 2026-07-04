import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Upload, MapPin, AlertTriangle, Settings, LogOut, 
  Sun, Menu, X, Sheet, Globe 
} from 'lucide-react';

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
};

const menuItems = [
  { icon: Home, label: 'ホーム', path: '/' },
  { icon: Upload, label: '自動アサインシステム', path: '/auto-assign' },
  { icon: Sheet, label: 'スプレッドシート設定', path: '/sheet-settings' },
  { icon: Globe, label: 'World', path: '/world' },
  { icon: MapPin, label: '京都おすすめ', path: '/recommendations' },
  { icon: AlertTriangle, label: 'アラート', path: '/alerts' },
  { icon: Settings, label: '設定', path: '/settings' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatTime());
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(formatTime()), 60000);
    const now = new Date();
    setDateStr(now.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' }));
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-primary-700">
              GuestHouse {location.pathname === '/' ? 'DASHBOARD' : 'System'}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              ログアウト
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1" /> {/* Spacer */}

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <Sun className="w-4 h-4 mr-2 text-orange-400" />
              <span>26℃</span>
              <span className="mx-2">|</span>
              <span>京都市下京区</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{currentTime}</div>
              <div className="text-xs text-gray-500">{dateStr}</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}