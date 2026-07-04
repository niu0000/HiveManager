// SearchBar コンポーネント - 国名検索

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { CountryData } from '../data/countries';
import { searchCountry } from '../data/countries';

interface SearchBarProps {
  onCountrySelect: (country: CountryData) => void;
}

export default function SearchBar({ onCountrySelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CountryData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 入力変更時の処理
  useEffect(() => {
    if (query.trim()) {
      const results = searchCountry(query);
      setSuggestions(results.slice(0, 8)); // 最大 8 件表示
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // 外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: CountryData) => {
    onCountrySelect(country);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      {/* 検索フィールド */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="🔍 国名を入力...（日本語・英語対応）"
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl 
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                     outline-none transition-all shadow-sm hover:shadow-md"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* サジェストドロップダウン */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg 
                        border border-gray-100 overflow-hidden z-50">
          <ul className="max-h-64 overflow-y-auto">
            {suggestions.map((country) => (
              <li key={country.code}>
                <button
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 flex items-center justify-between 
                             hover:bg-primary-50 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{country.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900">{country.name}</p>
                      <p className="text-xs text-gray-500">{country.nameEn}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{country.capital}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
