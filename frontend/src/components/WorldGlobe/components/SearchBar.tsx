import React, { useState, useMemo } from 'react';
import type { CountryData } from '../data/countries';
import { countries, searchAliases } from '../data/countries';

interface SearchBarProps {
  onCountrySelect: (country: CountryData) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onCountrySelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // 検索結果のサジェスト
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const results: CountryData[] = [];
    const seenCodes = new Set<string>();

    // エイリアスから国コードを検索
    const aliasMatch = searchAliases[normalizedQuery];
    if (aliasMatch) {
      const country = countries.find(c => c.code === aliasMatch);
      if (country && !seenCodes.has(country.code)) {
        results.push(country);
        seenCodes.add(country.code);
      }
    }

    // 各国のデータで部分一致検索
    for (const country of countries) {
      if (seenCodes.has(country.code)) continue;

      const matchConditions = [
        country.name.toLowerCase().includes(normalizedQuery),
        country.nameEn.toLowerCase().includes(normalizedQuery),
        country.code.toLowerCase() === normalizedQuery,
        country.capital.toLowerCase().includes(normalizedQuery),
      ];

      if (matchConditions.some(Boolean)) {
        results.push(country);
        seenCodes.add(country.code);
      }

      if (results.length >= 6) break;
    }

    return results;
  }, [query]);

  // 国を選択
  const handleSelect = (country: CountryData) => {
    onCountrySelect(country);
    setQuery(`${country.flag} ${country.name}`);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // フォーカス時にサジェストを開く
  const handleFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  // クエリ変更時
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // クリック外側を検知して閉じる
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-bar-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container relative w-full max-w-md mx-auto">
      {/* 検索入力フィールド */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="国名を入力…（日本語・英語対応）"
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                     focus:border-[#6C63FF] focus:outline-none focus:ring-2 
                     focus:ring-[#6C63FF]/20 transition-all duration-200
                     bg-white text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* サジェストドロップダウン */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white 
                        border border-gray-200 rounded-xl shadow-lg 
                        overflow-hidden z-50">
          <ul className="max-h-64 overflow-y-auto">
            {suggestions.map((country, index) => (
              <li
                key={country.code}
                onClick={() => handleSelect(country)}
                className={`px-4 py-3 cursor-pointer flex items-center gap-3
                           transition-colors duration-150
                           ${index === highlightedIndex 
                             ? 'bg-[#6C63FF]/10' 
                             : 'hover:bg-gray-50'}`}
              >
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {country.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {country.nameEn}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {country.capital}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
