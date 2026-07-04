// FunFacts コンポーネント - 豆知識カード

import { useState } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface FunFactsProps {
  facts: string[];
}

export default function FunFacts({ facts }: FunFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  if (!facts || facts.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
      <div className="flex items-center mb-3">
        <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
        <h3 className="font-bold text-gray-900">豆知識</h3>
      </div>

      <div className="relative">
        {/* ナビゲーションボタン */}
        {facts.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 
                         bg-white rounded-full shadow-md hover:bg-amber-50 
                         transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 
                         bg-white rounded-full shadow-md hover:bg-amber-50 
                         transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}

        {/* 豆知識本文 */}
        <div className="px-8 py-2">
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            {facts[currentIndex]}
          </p>
        </div>

        {/* インジケーター */}
        {facts.length > 1 && (
          <div className="flex justify-center mt-3 space-x-1">
            {facts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all
                          ${index === currentIndex 
                            ? 'bg-amber-500 w-4' 
                            : 'bg-amber-200 hover:bg-amber-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
