// WorldGlobe メインコンポーネント

import { useState, useRef } from 'react';
import { Globe } from 'lucide-react';
import GlobeCanvas from './components/GlobeCanvas';
import { SearchBar } from './components/SearchBar';
import { CountryPanel } from './components/CountryPanel';
import type { CountryData } from './data/countries';

export default function WorldGlobe() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const globeRef = useRef<{ flyTo: (lat: number, lng: number) => void} | null>(null);

  // 国が選択された時の処理
  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setIsPanelOpen(true);
    
    // 地球儀をその国にフライ（実装は useGlobe と連携）
    if (globeRef.current) {
      globeRef.current.flyTo(country.lat, country.lng);
    }
  };

  // パネルを閉じる
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedCountry(null), 300);
  };

  // ランドマーククリック時の処理
  const handleLandmarkClick = (landmark: any) => {
    if (landmark.lat && landmark.lng && globeRef.current) {
      globeRef.current.flyTo(landmark.lat, landmark.lng);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  World Globe
                </h1>
                <p className="text-sm text-gray-600 font-medium">🌍 世界をポップに探索しよう！</p>
              </div>
            </div>
          </div>
          
          {/* 検索バー */}
          <SearchBar onCountrySelect={handleCountrySelect} />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* 地球儀エリア */}
        <div className="flex-1 relative">
          <GlobeCanvas 
            onCountryClick={(name, lat, lng) => {
              console.log('Clicked:', name, lat, lng);
              // TODO: クリック位置の国を特定して表示
            }}
          />
        </div>

        {/* 右側情報パネル */}
        <div 
          className={`
            fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40
            md:relative md:transform-none md:w-96 md:shadow-none
            ${isPanelOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
          `}
        >
          <CountryPanel 
            country={selectedCountry} 
            onClose={handleClosePanel}
            onLandmarkClick={handleLandmarkClick}
          />
        </div>
      </div>
    </div>
  );
}
