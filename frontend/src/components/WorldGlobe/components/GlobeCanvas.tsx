// GlobeCanvas コンポーネント - Three.js 地球儀表示（フェーズ 3 対応）

import { useRef } from 'react';
import { useGlobe } from '../hooks/useGlobe';
import type { Landmark } from '../data/landmarks';
import ZoomControls from './ZoomControls';
import Compass from './Compass';

interface GlobeCanvasProps {
  onCountryClick?: (countryName: string, lat: number, lng: number) => void;
  onLandmarkClick?: (landmark: Landmark) => void;
}

export default function GlobeCanvas({ onCountryClick, onLandmarkClick }: GlobeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const { isLoading, error, addFloatingPin, clearFloatingPins } = useGlobe(containerRef, { onCountryClick, onLandmarkClick });

  // リセット
  const handleReset = () => {
    clearFloatingPins();
  };

  // テスト用ピン追加
  const handleAddTestPin = () => {
    // 東京にピンを追加
    addFloatingPin(35.6762, 139.6503, '#FF6B6B', 'Tokyo');
    // ニューヨークにピンを追加
    addFloatingPin(40.7128, -74.0060, '#4ECDC4', 'New York');
    // ロンドンにピンを追加
    addFloatingPin(51.5074, -0.1278, '#FFE66D', 'London');
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D キャンバス */}
      <div ref={containerRef} className="w-full h-full" />

      {/* ローディング表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">地球儀を読み込み中...</p>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/90">
          <div className="text-center p-6">
            <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* コントロール UI */}
      {!isLoading && !error && (
        <>
          {/* 右下：ズームコントロール */}
          <div className="absolute bottom-4 right-4">
            <ZoomControls
              onReset={handleReset}
            />
          </div>

          {/* 左下：コンパス */}
          <div className="absolute bottom-4 left-4">
            <Compass rotationY={0} />
          </div>

          {/* ヒントテキスト */}
          <div className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
            <p className="text-xs text-gray-600">
              🖱️ ドラッグ：回転 | スクロール：ズーム | クリック：国を選択 | ランドマーク：ジャンプ✨ | ダブルクリック：ズームイン
            </p>
          </div>

          {/* テストボタン */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <button
              onClick={handleAddTestPin}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-bold"
            >
              📍 テストピン追加
            </button>
          </div>

          {/* ポップな装飾 */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="bg-yellow-400/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white animate-pulse">
              ✨ Pop Globe
            </div>
          </div>
        </>
      )}
    </div>
  );
}
