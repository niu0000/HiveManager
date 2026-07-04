import React from 'react';
import type { CountryData } from '../data/countries';
import type { Landmark } from '../data/landmarks';
import { useSpeech } from '../hooks/useSpeech';

interface CountryPanelProps {
  country: CountryData | null;
  onClose: () => void;
  onLandmarkClick?: (landmark: Landmark) => void;
}

export const CountryPanel: React.FC<CountryPanelProps> = ({ country, onClose }) => {
  const { isSpeaking, speak, stop, isSupported } = useSpeech();

  if (!country) return null;

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-40
                  transform transition-transform duration-300 ease-out
                  ${country ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-3xl mb-1">{country.flag}</div>
          <h2 className="text-xl font-bold text-gray-800">{country.name}</h2>
          <div className="text-xs text-gray-500 mt-1">
            <span>{country.language}</span>
            <span className="mx-2">|</span>
            <span>首都：{country.capital}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center
                     transition-colors duration-150"
        >
          <span className="text-xl text-gray-500">×</span>
        </button>
      </div>

      {/* スクロール可能コンテンツ */}
      <div className="overflow-y-auto h-[calc(100vh-100px)] px-5 py-4 space-y-5">
        
        {/* 挨拶セクション */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            挨拶
          </h3>
          <div className="space-y-2">
            {country.greetings.map((greeting, index) => (
              <div
                key={index}
                className="bg-[#F8F9FF] rounded-xl p-3 border border-[#6C63FF]/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {greeting.text}
                    </div>
                    <div className="text-xs italic text-gray-400">
                      {greeting.romanized}
                    </div>
                    <div className="text-xs text-[#6C63FF] mt-1">
                      "{greeting.meaning}"
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stop();
                      } else {
                        speak(greeting.text, greeting.lang);
                      }
                    }}
                    disabled={!isSupported}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center
                               transition-all duration-200
                               ${isSpeaking 
                                 ? 'bg-[#6C63FF] text-white' 
                                 : 'bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20'}
                               disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSpeaking ? '⏸' : '▶'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 食べ物セクション */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            有名な食べ物
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {country.foods.map((food, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-3 text-center
                           hover:scale-105 hover:shadow-md transition-all duration-200
                           cursor-pointer"
              >
                <div className="text-3xl mb-2">{food.emoji}</div>
                <div className="text-xs font-semibold text-gray-700">
                  {food.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 建物・場所セクション */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            有名な建物・場所
          </h3>
          <div className="space-y-2">
            {country.landmarks.map((landmark, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3
                           hover:bg-gray-100 transition-colors duration-150
                           border-l-3 border-[#6C63FF]"
                style={{ borderLeftWidth: '3px' }}
              >
                <span className="text-xl">{landmark.emoji}</span>
                <span className="text-sm font-medium text-gray-700">
                  {landmark.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 豆知識セクション */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            豆知識
          </h3>
          <div className="space-y-2">
            {country.funFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-[#FFFBEB] rounded-xl p-3 border border-[#FEF3C7]
                           flex items-start gap-3"
              >
                <span className="text-lg">💡</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
