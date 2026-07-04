// ZoomControls コンポーネント - ズームイン/アウト UI

import { ZoomIn, ZoomOut, Home } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
}

export default function ZoomControls({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="flex flex-col space-y-2">
      {/* ズームイン */}
      <button
        onClick={onZoomIn}
        className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 group"
        title="ズームイン"
      >
        <ZoomIn className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
      </button>

      {/* リセット */}
      <button
        onClick={onReset}
        className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 group"
        title="リセット"
      >
        <Home className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
      </button>

      {/* ズームアウト */}
      <button
        onClick={onZoomOut}
        className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 group"
        title="ズームアウト"
      >
        <ZoomOut className="w-5 h-5 text-pink-600 group-hover:text-pink-700" />
      </button>
    </div>
  );
}
