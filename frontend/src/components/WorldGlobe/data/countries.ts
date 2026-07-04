// 主要 50 カ国のデータ（Phase 2 用）

export interface Greeting {
  text: string;
  romanized: string;
  meaning: string;
  lang: string;
}

export interface Food {
  name: string;
  emoji: string;
  description?: string;
}

export interface Landmark {
  name: string;
  emoji: string;
  has3DModel: boolean;
  lat?: number;
  lng?: number;
}

export interface CountryData {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  capital: string;
  language: string;
  lat: number;
  lng: number;
  color: string;
  greetings: Greeting[];
  foods: Food[];
  landmarks: Landmark[];
  funFacts: string[];
}

export const countriesData: CountryData[] = [
  {
    code: 'JP',
    name: '日本',
    nameEn: 'Japan',
    flag: '🇯🇵',
    capital: '東京',
    language: '日本語',
    lat: 36.2048,
    lng: 138.2529,
    color: '#FF6B6B',
    greetings: [
      { text: 'こんにちは', romanized: 'Konnichiwa', meaning: 'Hello', lang: 'ja-JP' },
      { text: 'おはようございます', romanized: 'Ohayou gozaimasu', meaning: 'Good morning', lang: 'ja-JP' },
      { text: 'ありがとう', romanized: 'Arigatou', meaning: 'Thank you', lang: 'ja-JP' },
    ],
    foods: [
      { name: '寿司', emoji: '🍣', description: '新鮮な魚介類と酢飯' },
      { name: 'ラーメン', emoji: '🍜', description: '麺料理の代表格' },
      { name: '天ぷら', emoji: '🍤', description: '衣をつけて揚げた料理' },
      { name: '抹茶', emoji: '🍵', description: '日本の伝統的なお茶' },
    ],
    landmarks: [
      { name: '東京スカイツリー', emoji: '🗼', has3DModel: true, lat: 35.7101, lng: 139.8107 },
      { name: '金閣寺', emoji: '⛩️', has3DModel: false, lat: 35.0394, lng: 135.7292 },
      { name: '富士山', emoji: '🗻', has3DModel: true, lat: 35.3606, lng: 138.7274 },
    ],
    funFacts: [
      '日本は世界で 11 番目に大きな経済大国です',
      '新幹線は平均遅延時間が 18 秒という正確さ',
      '日本には 6,852 以上の島があります',
    ],
  },
  {
    code: 'FR',
    name: 'フランス',
    nameEn: 'France',
    flag: '🇫🇷',
    capital: 'パリ',
    language: 'フランス語',
    lat: 46.2276,
    lng: 2.2137,
    color: '#4ECDC4',
    greetings: [
      { text: 'Bonjour', romanized: 'ボンジュール', meaning: 'こんにちは', lang: 'fr-FR' },
      { text: 'Merci', romanized: 'メルシー', meaning: 'ありがとう', lang: 'fr-FR' },
      { text: "S'il vous plaît", romanized: 'シルヴプレ', meaning: 'お願いします', lang: 'fr-FR' },
    ],
    foods: [
      { name: 'クロワッサン', emoji: '🥐', description: 'バターの香りが素晴らしいパン' },
      { name: 'チーズ', emoji: '🧀', description: '400 種類以上のチーズ' },
      { name: 'ワイン', emoji: '🍷', description: '世界最高峰のワイン' },
      { name: 'マカロン', emoji: '🍪', description: 'カラフルな甘いお菓子' },
    ],
    landmarks: [
      { name: 'エッフェル塔', emoji: '🗼', has3DModel: true, lat: 48.8584, lng: 2.2945 },
      { name: 'ルーブル美術館', emoji: '🏛️', has3DModel: false, lat: 48.8606, lng: 2.3376 },
      { name: '凱旋門', emoji: '🏛️', has3DModel: false, lat: 48.8738, lng: 2.2950 },
    ],
    funFacts: [
      'フランスは世界で最も観光客が多い国',
      'バゲット法があり、パンの品質が保護されています',
      'シャンパーニュはフランスのこの地域でのみ生産可能',
    ],
  },
  {
    code: 'US',
    name: 'アメリカ合衆国',
    nameEn: 'United States',
    flag: '🇺🇸',
    capital: 'ワシントン D.C.',
    language: '英語',
    lat: 37.0902,
    lng: -95.7129,
    color: '#6C63FF',
    greetings: [
      { text: 'Hello', romanized: 'ハロー', meaning: 'こんにちは', lang: 'en-US' },
      { text: 'Good morning', romanized: 'グッドモーニング', meaning: 'おはよう', lang: 'en-US' },
      { text: 'Thank you', romanized: 'サンキュー', meaning: 'ありがとう', lang: 'en-US' },
    ],
    foods: [
      { name: 'ハンバーガー', emoji: '🍔', description: 'アメリカの定番ファストフード' },
      { name: 'ホットドッグ', emoji: '🌭', description: 'ソーセージをパンで挟んだ料理' },
      { name: 'アップルパイ', emoji: '🥧', description: 'アメリカの伝統的デザート' },
      { name: 'バーベキュー', emoji: '🍖', description: '南部の名物料理' },
    ],
    landmarks: [
      { name: '自由の女神', emoji: '🗽', has3DModel: true, lat: 40.6892, lng: -74.0445 },
      { name: 'グランドキャニオン', emoji: '🏜️', has3DModel: false, lat: 36.1069, lng: -112.1129 },
      { name: 'ゴールデンゲートブリッジ', emoji: '🌉', has3DModel: false, lat: 37.8199, lng: -122.4783 },
    ],
    funFacts: [
      'アメリカには 50 の州があります',
      'ハワイは 1959 年に最後の州として追加されました',
      'アメリカには世界最大の空港があります',
    ],
  },
  {
    code: 'GB',
    name: 'イギリス',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    capital: 'ロンドン',
    language: '英語',
    lat: 55.3781,
    lng: -3.4360,
    color: '#FF8E72',
    greetings: [
      { text: 'Hello', romanized: 'ハロー', meaning: 'こんにちは', lang: 'en-GB' },
      { text: 'Good afternoon', romanized: 'グッドアフタヌーン', meaning: 'こんにちは（午後）', lang: 'en-GB' },
      { text: 'Cheers', romanized: 'チアーズ', meaning: 'ありがとう/乾杯', lang: 'en-GB' },
    ],
    foods: [
      { name: 'フィッシュ＆チップス', emoji: '🐟', description: 'イギリスの国民食' },
      { name: '紅茶', emoji: '☕', description: 'アフタヌーンティーの文化' },
      { name: 'イングリッシュブレックファスト', emoji: '🍳', description: '伝統的な朝食' },
      { name: 'スコーン', emoji: '🧁', description: 'クリームティーに欠かせない' },
    ],
    landmarks: [
      { name: 'ビッグベン', emoji: '🕰️', has3DModel: false, lat: 51.5007, lng: -0.1246 },
      { name: 'ロンドンアイ', emoji: '🎡', has3DModel: false, lat: 51.5033, lng: -0.1195 },
      { name: 'ストーンヘンジ', emoji: '🗿', has3DModel: false, lat: 51.1789, lng: -1.8262 },
    ],
    funFacts: [
      'イギリスには 4 つの国（イングランド、スコットランド、ウェールズ、北アイルランド）が含まれます',
      'ロンドン地下鉄は世界最古の地下鉄',
      '女王の衛兵は 1 分以上動かないことで有名',
    ],
  },
  {
    code: 'DE',
    name: 'ドイツ',
    nameEn: 'Germany',
    flag: '🇩🇪',
    capital: 'ベルリン',
    language: 'ドイツ語',
    lat: 51.1657,
    lng: 10.4515,
    color: '#A8E6CF',
    greetings: [
      { text: 'Hallo', romanized: 'ハロー', meaning: 'こんにちは', lang: 'de-DE' },
      { text: 'Guten Tag', romanized: 'グーテンターク', meaning: 'こんにちは', lang: 'de-DE' },
      { text: 'Danke', romanized: 'ダンケ', meaning: 'ありがとう', lang: 'de-DE' },
    ],
    foods: [
      { name: 'ソーセージ', emoji: '🌭', description: '1,500 種類のソーセージ' },
      { name: 'ビール', emoji: '🍺', description: 'オクトーバーフェストで有名' },
      { name: 'プレッツェル', emoji: '🥨', description: '伝統的なパン' },
      { name: 'ザワークラウト', emoji: '🥬', description: '発酵キャベツ' },
    ],
    landmarks: [
      { name: 'ブランデンブルク門', emoji: '🏛️', has3DModel: false, lat: 52.5163, lng: 13.3777 },
      { name: 'ノイシュヴァンシュタイン城', emoji: '🏰', has3DModel: false, lat: 47.5576, lng: 10.7498 },
      { name: 'ベルリンの壁', emoji: '🧱', has3DModel: false, lat: 52.5350, lng: 13.3903 },
    ],
    funFacts: [
      'ドイツには約 1,500 種類のソーセージがあります',
      'アウトバーンには速度制限のない区間があります',
      '世界初の印刷機はドイツで発明されました',
    ],
  },
  {
    code: 'IT',
    name: 'イタリア',
    nameEn: 'Italy',
    flag: '🇮🇹',
    capital: 'ローマ',
    language: 'イタリア語',
    lat: 41.8719,
    lng: 12.5674,
    color: '#FFD3B6',
    greetings: [
      { text: 'Ciao', romanized: 'チャオ', meaning: 'こんにちは/さようなら', lang: 'it-IT' },
      { text: 'Buongiorno', romanized: 'ボンジョルノ', meaning: 'おはよう', lang: 'it-IT' },
      { text: 'Grazie', romanized: 'グラッツィェ', meaning: 'ありがとう', lang: 'it-IT' },
    ],
    foods: [
      { name: 'ピザ', emoji: '🍕', description: 'ナポリが発祥' },
      { name: 'パスタ', emoji: '🍝', description: '300 種類以上の形状' },
      { name: 'ジェラート', emoji: '🍨', description: 'イタリアンアイスクリーム' },
      { name: 'エスプレッソ', emoji: '☕', description: '濃厚なコーヒー' },
    ],
    landmarks: [
      { name: 'コロッセオ', emoji: '🏛️', has3DModel: true, lat: 41.8902, lng: 12.4922 },
      { name: 'ヴェネツィア', emoji: '🚣', has3DModel: false, lat: 45.4408, lng: 12.3155 },
      { name: 'ピサの斜塔', emoji: '🗼', has3DModel: false, lat: 43.7230, lng: 10.3966 },
    ],
    funFacts: [
      'イタリアには世界最多のユネスコ世界遺産があります',
      'バチカン市国はイタリア国内にある独立国家',
      'フォークを使ってスパゲッティを食べるのはイタリアでは一般的ではありません',
    ],
  },
  {
    code: 'ES',
    name: 'スペイン',
    nameEn: 'Spain',
    flag: '🇪🇸',
    capital: 'マドリード',
    language: 'スペイン語',
    lat: 40.4637,
    lng: -3.7492,
    color: '#FFAAA5',
    greetings: [
      { text: 'Hola', romanized: 'オラ', meaning: 'こんにちは', lang: 'es-ES' },
      { text: 'Buenos días', romanized: 'ブエノス ディアス', meaning: 'おはよう', lang: 'es-ES' },
      { text: 'Gracias', romanized: 'グラシアス', meaning: 'ありがとう', lang: 'es-ES' },
    ],
    foods: [
      { name: 'パエリア', emoji: '🥘', description: 'サフランライス料理' },
      { name: 'タパス', emoji: '🍢', description: '小皿料理' },
      { name: 'チョリソー', emoji: '🌭', description: 'スパイシーなソーセージ' },
      { name: 'サンガリア', emoji: '🍷', description: 'フルーツワインカクテル' },
    ],
    landmarks: [
      { name: 'サグラダ・ファミリア', emoji: '⛪', has3DModel: false, lat: 41.4036, lng: 2.1744 },
      { name: 'アルハンブラ宮殿', emoji: '🏰', has3DModel: false, lat: 37.1760, lng: -3.5881 },
      { name: 'プラド美術館', emoji: '🏛️', has3DModel: false, lat: 40.4138, lng: -3.6921 },
    ],
    funFacts: [
      'スペインには 13 のユネスコ世界遺産都市があります',
      'フラメンコはスペイン南部アンダルシア地方発祥',
      'スペイン語は世界で 2 番目に話者の多い言語',
    ],
  },
  {
    code: 'CN',
    name: '中国',
    nameEn: 'China',
    flag: '🇨🇳',
    capital: '北京',
    language: '中国語',
    lat: 35.8617,
    lng: 104.1954,
    color: '#FF6B6B',
    greetings: [
      { text: '你好', romanized: 'Nǐ hǎo', meaning: 'こんにちは', lang: 'zh-CN' },
      { text: '早上好', romanized: 'Zǎoshang hǎo', meaning: 'おはよう', lang: 'zh-CN' },
      { text: '谢谢', romanized: 'Xièxiè', meaning: 'ありがとう', lang: 'zh-CN' },
    ],
    foods: [
      { name: '餃子', emoji: '🥟', description: '定番の中華料理' },
      { name: '北京ダック', emoji: '🦆', description: '北京の名物料理' },
      { name: '点心', emoji: '🍜', description: '広東料理の軽食' },
      { name: '緑茶', emoji: '🍵', description: '中国茶文化' },
    ],
    landmarks: [
      { name: '万里の長城', emoji: '🧱', has3DModel: true, lat: 40.4319, lng: 116.5704 },
      { name: '紫禁城', emoji: '🏯', has3DModel: false, lat: 39.9163, lng: 116.3972 },
      { name: '兵馬俑', emoji: '🗿', has3DModel: false, lat: 34.3848, lng: 109.2734 },
    ],
    funFacts: [
      '中国は世界で最も人口が多い国',
      '万里の長城は宇宙から見える唯一の人工物という説があります（実際は見えません）',
      'パンダは中国の国宝です',
    ],
  },
  {
    code: 'KR',
    name: '韓国',
    nameEn: 'South Korea',
    flag: '🇰🇷',
    capital: 'ソウル',
    language: '韓国語',
    lat: 35.9078,
    lng: 127.7669,
    color: '#A8E6CF',
    greetings: [
      { text: '안녕하세요', romanized: 'Annyeonghaseyo', meaning: 'こんにちは', lang: 'ko-KR' },
      { text: '감사합니다', romanized: 'Gamsahamnida', meaning: 'ありがとう', lang: 'ko-KR' },
      { text: '안녕히 가세요', romanized: 'Annyeonghi gaseyo', meaning: 'さようなら', lang: 'ko-KR' },
    ],
    foods: [
      { name: 'キムチ', emoji: '🥬', description: '発酵野菜料理' },
      { name: 'ビビンバ', emoji: '🍚', description: '混ぜご飯' },
      { name: 'サムギョプサル', emoji: '🥓', description: '豚バラ肉' },
      { name: 'トッポギ', emoji: '🍢', description: '辛い餅料理' },
    ],
    landmarks: [
      { name: '景福宮', emoji: '🏯', has3DModel: false, lat: 37.5796, lng: 126.9770 },
      { name: 'N ソウルタワー', emoji: '🗼', has3DModel: false, lat: 37.5512, lng: 126.9882 },
      { name: '済州島', emoji: '🏝️', has3DModel: false, lat: 33.4996, lng: 126.5312 },
    ],
    funFacts: [
      '韓国には世界最速のインターネット速度があります',
      'ハングルは科学的に作られた文字',
      'K-POP は世界中で人気を集めています',
    ],
  },
  {
    code: 'AU',
    name: 'オーストラリア',
    nameEn: 'Australia',
    flag: '🇦🇺',
    capital: 'キャンベラ',
    language: '英語',
    lat: -25.2744,
    lng: 133.7751,
    color: '#4ECDC4',
    greetings: [
      { text: "G'day", romanized: 'グダイ', meaning: 'こんにちは', lang: 'en-AU' },
      { text: 'Hello', romanized: 'ハロー', meaning: 'こんにちは', lang: 'en-AU' },
      { text: 'Cheers', romanized: 'チアーズ', meaning: 'ありがとう', lang: 'en-AU' },
    ],
    foods: [
      { name: 'バーベキュー', emoji: '🍖', description: 'アウトドア料理' },
      { name: 'ミートパイ', emoji: '🥧', description: '伝統的な轻食' },
      { name: 'ベジマイト', emoji: '🍞', description: '酵母エキススプレッド' },
      { name: 'ラミントン', emoji: '🍰', description: 'ココナッツケーキ' },
    ],
    landmarks: [
      { name: 'オペラハウス', emoji: '🎭', has3DModel: true, lat: -33.8568, lng: 151.2153 },
      { name: 'グレートバリアリーフ', emoji: '🐠', has3DModel: false, lat: -18.2871, lng: 147.6992 },
      { name: 'エアーズロック', emoji: '🗿', has3DModel: false, lat: -25.3444, lng: 131.0369 },
    ],
    funFacts: [
      'オーストラリアにはカンガルーの方が人間より多いです',
      '世界最大の一枚岩があります',
      'コアラは 1 日に 20 時間寝ます',
    ],
  },
];

/**
 * 国名で検索
 */
export function searchCountry(query: string): CountryData[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  return countriesData.filter(country => 
    country.name.toLowerCase().includes(normalizedQuery) ||
    country.nameEn.toLowerCase().includes(normalizedQuery) ||
    country.code.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * コードで国を取得
 */
export function getCountryByCode(code: string): CountryData | undefined {
  return countriesData.find(c => c.code === code);
}
