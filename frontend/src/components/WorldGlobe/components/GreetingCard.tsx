// GreetingCard コンポーネント - 挨拶カード（音声再生付き）

import { useState } from 'react';
import { Volume2, Pause } from 'lucide-react';
import type { Greeting } from '../data/countries';

interface GreetingCardProps {
  greeting: Greeting;
}

export default function GreetingCard({ greeting }: GreetingCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if ('speechSynthesis' in window) {
      // 既存の音声を停止
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(greeting.text);
      utterance.lang = greeting.lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('お使いのブラウザは音声合成をサポートしていません');
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-white p-4 rounded-xl border border-primary-100 
                    hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900 mb-1">{greeting.text}</p>
          <p className="text-sm text-gray-600 italic">{greeting.romanized}</p>
          <p className="text-xs text-gray-500 mt-1">{greeting.meaning}</p>
        </div>
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`ml-4 p-3 rounded-full transition-all transform hover:scale-105
                      ${isPlaying 
                        ? 'bg-primary-600 text-white animate-pulse' 
                        : 'bg-primary-100 text-primary-600 hover:bg-primary-200'}`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
