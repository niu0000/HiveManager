import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, BedDouble, AlertCircle, CheckCircle } from 'lucide-react';
import { dashboardApi } from '../lib/api';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ElementType;
  colorClass: string;
}

const StatCard = ({ title, value, trend, icon: Icon, colorClass }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      {trend !== undefined && (
        <div className={cn("flex items-center text-sm font-medium", trend >= 0 ? 'text-green-600' : 'text-red-600')}>
          {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(trend)}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    checkInToday: 0,
    checkOutToday: 0,
    availableBeds: 0,
    totalBeds: 0,
    alerts: [] as any[],
    errors: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStatus();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">読み込み中...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="チェックイン（今日）"
          value={stats.checkInToday}
          trend={4}
          icon={BedDouble}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="チェックアウト（今日）"
          value={stats.checkOutToday}
          trend={-2}
          icon={BedDouble}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="空きベッド数"
          value={stats.availableBeds}
          icon={BedDouble}
          colorClass="bg-green-100 text-green-600"
        />
      </div>

      {/* Alerts & Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Alerts & Errors */}
        <div className="lg:col-span-1 space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">アラート</h3>
            {stats.alerts.length > 0 ? (
              <div className="space-y-3">
                {stats.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800 font-medium">{alert.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">アラートはありません</div>
            )}
          </div>

          {/* Errors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">エラー表示</h3>
            {stats.errors.length === 0 ? (
              <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-100">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  現在エラーはありません<br/>
                  <span className="text-green-600 text-xs">すべてのシステムは正常に動作しています。</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-600">エラーが発生しています</div>
            )}
          </div>
        </div>

        {/* Right: Map Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">京都のおすすめ場所</h3>
            <div className="flex space-x-2">
              {['すべて', '観光', 'グルメ', 'カフェ', '体験'].map((cat) => (
                <button
                  key={cat}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px] bg-gray-100 relative flex items-center justify-center">
            {/* ダミーマップ画像 */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://placehold.co/800x400/e2e8f0/94a3b8?text=Kyoto+Map')] bg-cover bg-center" />
            <div className="relative z-10 text-center">
              <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">マップ表示エリア</p>
              <p className="text-xs text-gray-400">Google Maps API 連携予定</p>
            </div>
            
            {/* ダミーピン */}
            <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white text-xs font-bold">清</span>
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white text-xs font-bold">嵐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}