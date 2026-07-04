// LandmarkList コンポーネント - 建物・ランドマークリスト

import { MapPin } from 'lucide-react';
import { type Landmark } from '../data/countries';

interface LandmarkListProps {
  landmarks: Landmark[];
  onLandmarkClick?: (landmark: Landmark) => void;
}

export default function LandmarkList({ landmarks, onLandmarkClick }: LandmarkListProps) {
  return (
    <div className="space-y-2">
      {landmarks.map((landmark, index) => (
        <button
          key={index}
          onClick={() => onLandmarkClick?.(landmark)}
          className="w-full flex items-center p-3 bg-white rounded-xl border border-gray-100 
                     hover:bg-primary-50 hover:border-primary-200 transition-all text-left"
        >
          <span className="text-2xl mr-3">{landmark.emoji}</span>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{landmark.name}</p>
          </div>
          {landmark.has3DModel && (
            <MapPin className="w-4 h-4 text-primary-500" />
          )}
        </button>
      ))}
    </div>
  );
}
