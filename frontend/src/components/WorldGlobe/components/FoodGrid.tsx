// FoodGrid コンポーネント - 食べ物グリッド

import { type Food } from '../data/countries';

interface FoodGridProps {
  foods: Food[];
}

export default function FoodGrid({ foods }: FoodGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {foods.map((food, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl border border-gray-100 
                     hover:shadow-lg hover:-translate-y-1 transition-all duration-200 
                     cursor-pointer group"
          title={food.description}
        >
          <div className="text-center">
            <span className="text-5xl block mb-2 transform group-hover:scale-110 transition-transform">
              {food.emoji}
            </span>
            <p className="font-medium text-gray-900 text-sm">{food.name}</p>
            {food.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {food.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
