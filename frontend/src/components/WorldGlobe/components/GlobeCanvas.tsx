// GlobeCanvas コンポーネント - Three.js 地球儀表示

import { useRef } from 'react';
import { useGlobe } from '../hooks/useGlobe';

interface GlobeCanvasProps {
  onCountryClick?: (countryName: string, lat: number, lng: number) => void;
}

export default function GlobeCanvas({ onCountryClick }: GlobeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, error } = useGlobe(containerRef, { onCountryClick });

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

      {/* ヒントテキスト */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          <p className="text-xs text-gray-600">
            🖱️ ドラッグ：回転 | スクロール：ズーム | クリック：国を選択
          </p>
        </div>
      )}
    </div>
  );
}
