import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sheetsApi } from '../lib/api';

interface ColumnMapping {
  spreadsheetColumn: string;
  systemField: string;
}

const SheetSettings: React.FC = () => {
  const navigate = useNavigate();
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [mappings, setMappings] = useState<ColumnMapping[]>([
    { spreadsheetColumn: '', systemField: 'name' },
    { spreadsheetColumn: '', systemField: 'status' },
    { spreadsheetColumn: '', systemField: 'bed_number' },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 既存の設定を読み込む
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await sheetsApi.getSettings();
        if (res) {
          setSpreadsheetId(res.spreadsheet_id || '');
          setSheetName(res.sheet_name || 'Sheet1');
          if (res.mappings) {
            setMappings(res.mappings);
          }
        }
      } catch (err) {
        console.error('設定の読み込みに失敗しました', err);
      }
    };
    fetchSettings();
  }, []);

  const handleMappingChange = (index: number, field: keyof ColumnMapping, value: string) => {
    const newMappings = [...mappings];
    newMappings[index][field] = value;
    setMappings(newMappings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await sheetsApi.updateSetting('spreadsheet_id', spreadsheetId, 'Google Spreadsheet ID');
      await sheetsApi.updateSetting('sheet_name', sheetName, 'Google Sheet Name');
      setMessage({ type: 'success', text: '設定を保存しました' });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || '保存に失敗しました' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            ← 戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Google スプレッドシート連携設定</h2>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* シートID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                スプレッドシート ID
              </label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMvs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms など"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                URL (https://docs.google.com/spreadsheets/d/[ここ]/edit...) から取得してください
              </p>
            </div>

            {/* シート名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                シート名
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* カラムマッピング */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">カラムマッピング</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {mappings.map((mapping, index) => (
                  <div key={mapping.systemField} className="flex items-center space-x-2">
                    <div className="w-1/3 text-sm font-medium text-gray-700">
                      {mapping.systemField === 'name' && '名前'}
                      {mapping.systemField === 'status' && 'ステータス'}
                      {mapping.systemField === 'bed_number' && 'ベッド番号'}
                    </div>
                    <div className="w-2/3">
                      <input
                        type="text"
                        value={mapping.spreadsheetColumn}
                        onChange={(e) => handleMappingChange(index, 'spreadsheetColumn', e.target.value)}
                        placeholder="スプレッドシートの列名 (例: 氏名, 状態)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                スプレッドシートのヘッダー行とシステム項目を紐付けます
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '保存中...' : '設定を保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SheetSettings;
