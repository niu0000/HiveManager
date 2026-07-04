import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';

interface Alert {
  id: number;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function Alerts() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unresolved'>('all');
  
  // ダミーデータ
  const alerts: Alert[] = [
    {
      id: 1,
      type: 'warning',
      title: 'ベッド不足のアラート',
      message: '102 号室で予約数に対してベッドが不足しています。手動調整が必要です。',
      timestamp: '2025-01-17 10:30',
      resolved: false,
    },
    {
      id: 2,
      type: 'error',
      title: 'Google シート同期エラー',
      message: 'スプレッドシートとの同期に失敗しました。接続設定を確認してください。',
      timestamp: '2025-01-17 09:15',
      resolved: false,
    },
    {
      id: 3,
      type: 'info',
      title: '清掃期限のお知らせ',
      message: '201 号室の清掃が予定より 30 分遅れています。',
      timestamp: '2025-01-17 08:45',
      resolved: false,
    },
    {
      id: 4,
      type: 'warning',
      title: 'オーバーブック検出',
      message: '1 月 20 日の予約が定員を超過しています。キャンセル待ちリストを確認してください。',
      timestamp: '2025-01-16 18:20',
      resolved: true,
    },
    {
      id: 5,
      type: 'error',
      title: 'CSV インポートエラー',
      message: 'ねっぱん CSV の形式が正しくありません。列マッピングを確認してください。',
      timestamp: '2025-01-16 14:00',
      resolved: true,
    },
  ];

  const filteredAlerts = activeFilter === 'unresolved'
    ? alerts.filter(a => !a.resolved)
    : alerts;

  const getTypeConfig = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return { icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      case 'info':
        return { icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    }
  };

  const stats = {
    total: alerts.length,
    unresolved: alerts.filter(a => !a.resolved).length,
    warnings: alerts.filter(a => a.type === 'warning' && !a.resolved).length,
    errors: alerts.filter(a => a.type === 'error' && !a.resolved).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">アラート一覧</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて ({stats.total})
          </button>
          <button
            onClick={() => setActiveFilter('unresolved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'unresolved' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            未解決 ({stats.unresolved})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">総アラート数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
          <div className="text-sm text-gray-500">未解決</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">{stats.warnings}</div>
          <div className="text-sm text-gray-500">警告</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
          <div className="text-sm text-gray-500">エラー</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Config = getTypeConfig(alert.type);
          const Icon = Config.icon;
          
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                alert.resolved ? 'border-gray-300 opacity-60' : `border-l-[${Config.color}]`
              }`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${Config.bgColor} mr-4`}>
                  <Icon className={`w-6 h-6 ${Config.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                  
                  <div className="flex items-center space-x-3">
                    {alert.resolved ? (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        解決済み
                      </span>
                    ) : (
                      <>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          詳細を見る
                        </button>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          解決済みにする
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          );
        })}
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">アラートはありません</p>
            <p className="text-sm text-gray-500 mt-2">すべてのシステムは正常に動作しています</p>
          </div>
        )}
      </div>
    </div>
  );
}
