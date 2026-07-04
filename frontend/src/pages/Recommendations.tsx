import { useState } from 'react';
import { Star, MapPin, Clock, DollarSign, Globe, Plus, Edit, Trash2, X } from 'lucide-react';

interface Recommendation {
  id: number;
  name_ja: string;
  name_en?: string;
  category: 'sightseeing' | 'gourmet' | 'cafe' | 'experience';
  description_ja: string;
  lat: number;
  lng: number;
  hours?: string;
  budget?: string;
  rating?: number;
}

const categoryLabels: Record<string, string> = {
  sightseeing: '観光',
  gourmet: 'グルメ',
  cafe: 'カフェ',
  experience: '体験',
};

const categoryColors: Record<string, string> = {
  sightseeing: 'bg-blue-100 text-blue-700',
  gourmet: 'bg-orange-100 text-orange-700',
  cafe: 'bg-green-100 text-green-700',
  experience: 'bg-purple-100 text-purple-700',
};

export default function Recommendations() {
  const [activeCategory, setActiveCategory] = useState<string>('すべて');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // ダミーデータ
  const recommendations: Recommendation[] = [
    {
      id: 1,
      name_ja: '清水寺',
      name_en: 'Kiyomizu-dera Temple',
      category: 'sightseeing',
      description_ja: '京都を代表する有名寺院。舞台からの眺望は絶景です。',
      lat: 34.9949,
      lng: 135.7851,
      hours: '6:00-18:00',
      budget: '大人 400 円',
      rating: 4.8,
    },
    {
      id: 2,
      name_ja: '嵐山竹林',
      name_en: 'Arashiyama Bamboo Grove',
      category: 'sightseeing',
      description_ja: '風情ある竹林の小道。幻想的な空間が広がります。',
      lat: 35.0094,
      lng: 135.6728,
      hours: '終日開放',
      budget: '無料',
      rating: 4.6,
    },
    {
      id: 3,
      name_ja: '錦市場',
      name_en: 'Nishiki Market',
      category: 'gourmet',
      description_ja: '京都の台所。新鮮な食材や京料理を楽しめます。',
      lat: 35.0051,
      lng: 135.7644,
      hours: '9:00-18:00',
      budget: '1000-3000 円',
      rating: 4.5,
    },
    {
      id: 4,
      name_ja: '%25Arabica 嵐山店',
      name_en: '%25 Arabica Arashiyama',
      category: 'cafe',
      description_ja: '世界展開する京都発祥のコーヒーショップ。',
      lat: 35.0142,
      lng: 135.6764,
      hours: '8:00-18:00',
      budget: '500-1000 円',
      rating: 4.4,
    },
    {
      id: 5,
      name_ja: '伏見稲荷大社',
      name_en: 'Fushimi Inari Taisha',
      category: 'sightseeing',
      description_ja: '千本鳥居で有名な神社。山頂までのハイキングも楽しめます。',
      lat: 34.9671,
      lng: 135.7727,
      hours: '終日開放',
      budget: '無料',
      rating: 4.9,
    },
    {
      id: 6,
      name_ja: '茶道体験 舞妓館',
      name_en: 'Tea Ceremony Experience',
      category: 'experience',
      description_ja: '本格的な茶道体験ができます。英語対応可能。',
      lat: 35.0036,
      lng: 135.7753,
      hours: '10:00-17:00',
      budget: '3000 円〜',
      rating: 4.7,
    },
  ];

  const categories = ['すべて', 'sightseeing', 'gourmet', 'cafe', 'experience'];

  const filteredRecommendations = activeCategory === 'すべて'
    ? recommendations
    : recommendations.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">京都のおすすめ場所</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          追加する
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'すべて' ? 'すべて' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{rec.name_ja}</h3>
                  {rec.name_en && (
                    <p className="text-sm text-gray-500">{rec.name_en}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[rec.category]}`}>
                  {categoryLabels[rec.category]}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{rec.description_ja}</p>

              <div className="space-y-2 text-sm text-gray-500">
                {rec.hours && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{rec.hours}</span>
                  </div>
                )}
                {rec.budget && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{rec.budget}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">
                    {rec.lat.toFixed(4)}, {rec.lng.toFixed(4)}
                  </span>
                </div>
                {rec.rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{rec.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                <Globe className="w-4 h-4 mr-1" />
                マップで見る
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingId(rec.id)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showForm || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? '編集' : '新規追加'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前（日本語）*
                </label>
                <input
                  type="text"
                  defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.name_ja : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前（英語）
                </label>
                <input
                  type="text"
                  defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.name_en : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ *
                </label>
                <select
                  defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.category : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">選択してください</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明（日本語）*
                </label>
                <textarea
                  defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.description_ja : ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    緯度 *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.lat : ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    経度 *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.lng : ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    営業時間
                  </label>
                  <input
                    type="text"
                    defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.hours : ''}
                    placeholder="例：9:00-18:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    予算
                  </label>
                  <input
                    type="text"
                    defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.budget : ''}
                    placeholder="例：1000-3000 円"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  レーティング
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={editingId ? recommendations.find(r => r.id === editingId)?.rating : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  {editingId ? '更新' : '追加'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
