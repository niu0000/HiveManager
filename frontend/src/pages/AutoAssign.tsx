import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { assignmentApi } from '../lib/api';

export default function AutoAssign() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setResult({ success: false, message: 'CSV ファイルを選択してください' });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const res = await assignmentApi.uploadCsv(file);
      setResult({ 
        success: true, 
        message: 'アップロード成功', 
        count: res.imported_count 
      });
      
      // 自動アサイン実行
      const assignRes = await assignmentApi.runAutoAssign();
      setResult({
        success: true,
        message: `アップロード完了 (${res.imported_count}件)。自動アサイン結果：成功 ${assignRes.success_count}件，失敗 ${assignRes.failure_count}件`,
        count: assignRes.success_count
      });
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.detail || 'アップロードに失敗しました' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">自動アサインシステム</h2>
        <p className="text-gray-500 mt-2">ねっぱんの CSV ファイルをドロップしてください。</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">処理中...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              ここに CSV ファイルをドロップ
            </p>
            <p className="text-sm text-gray-500">
              または クリックしてファイルを選択
            </p>
          </div>
        )}
      </div>

      {/* Result Message */}
      {result && (
        <div className={`
          p-4 rounded-xl border flex items-start
          ${result.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'}
        `}>
          {result.success ? (
            <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-semibold mb-1">{result.message}</h4>
            {result.count !== undefined && (
              <p className="text-sm opacity-80">処理された予約数：{result.count}件</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}