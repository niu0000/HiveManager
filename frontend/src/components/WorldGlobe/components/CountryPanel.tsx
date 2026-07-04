// CountryPanel コンポーネント - 右側情報パネル

import { X } from 'lucide-react';
import type { CountryData, Landmark } from '../data/countries';
import GreetingCard from './GreetingCard';
import FoodGrid from './FoodGrid';
import LandmarkList from './LandmarkList';
import FunFacts from './FunFacts';

interface CountryPanelProps {
  country: CountryData | null;
  onClose: () => void;
  onLandmarkClick?: (landmark: Landmark) => void;
}

export default function CountryPanel({ country, onClose, onLandmarkClick }: CountryPanelProps) {
  if (!country) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{country.flag}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{country.name}</h2>
            <p className="text-xs text-gray-500">
              {country.language} | 首都：{country.capital}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* スクロールコンテンツ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 挨拶セクション */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            挨拶
          </h3>
          <div className="space-y-3">
            {country.greetings.map((greeting, index) => (
              <GreetingCard key={index} greeting={greeting} />
            ))}
          </div>
        </section>

        {/* 食べ物セクション */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            有名な食べ物
          </h3>
          <FoodGrid foods={country.foods} />
        </section>

        {/* 建物・ランドマークセクション */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            有名な建物・場所
          </h3>
          <LandmarkList landmarks={country.landmarks} onLandmarkClick={onLandmarkClick} />
        </section>

        {/* 豆知識セクション */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            豆知識
          </h3>
          <FunFacts facts={country.funFacts} />
        </section>
      </div>
    </div>
  );
}
