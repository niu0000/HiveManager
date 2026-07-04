// Compass コンポーネント - 方位表示

import { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';

interface CompassProps {
  rotationY?: number;
}

export default function Compass({ rotationY = 0 }: CompassProps) {
  const needleRef = useRef<HTMLDivElement>(null);

  // 地球儀の回転に合わせて針を反転
  useEffect(() => {
    if (needleRef.current) {
      needleRef.current.style.transform = `rotate(${-rotationY}rad)`;
    }
  }, [rotationY]);

  return (
    <div className="relative w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2">
      {/* 外輪 */}
      <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
      
      {/* 方位マーク */}
      <div className="absolute inset-2 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* N (北) */}
          <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-500">
            N
          </span>
          {/* S (南) */}
          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-400">
            S
          </span>
          {/* E (東) */}
          <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400">
            E
          </span>
          {/* W (西) */}
          <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400">
            W
          </span>
        </div>
      </div>

      {/* 針 */}
      <div
        ref={needleRef}
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
      >
        <Navigation className="w-8 h-8 text-red-500 fill-red-500" />
      </div>

      {/* 中心点 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-md" />
      </div>
    </div>
  );
}
