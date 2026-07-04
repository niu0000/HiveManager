// ポップな3Dランドマークデータ
export interface Landmark {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  color: string; // パステルカラー
  shape: 'cone' | 'torus' | 'sphere' | 'box';
  height: number;
}

export const landmarks: Landmark[] = [
  // 日本
  { id: 'jp-fuji', name: '富士山', country: 'Japan', lat: 35.3606, lng: 138.7274, color: '#FFB7B2', shape: 'cone', height: 1.5 },
  { id: 'jp-tokyo', name: '東京タワー', country: 'Japan', lat: 35.6586, lng: 139.7454, color: '#FF6961', shape: 'cone', height: 1.2 },
  
  // アメリカ
  { id: 'us-statue', name: '自由の女神', country: 'USA', lat: 40.6892, lng: -74.0445, color: '#B5EAD7', shape: 'cone', height: 1.3 },
  { id: 'us-grandcanyon', name: 'グランドキャニオン', country: 'USA', lat: 36.0544, lng: -112.1401, color: '#FFDAC1', shape: 'box', height: 0.8 },
  
  // フランス
  { id: 'fr-eiffel', name: 'エッフェル塔', country: 'France', lat: 48.8584, lng: 2.2945, color: '#C7CEEA', shape: 'cone', height: 1.6 },
  { id: 'fr-louvre', name: 'ルーブル美術館', country: 'France', lat: 48.8606, lng: 2.3376, color: '#FFB7B2', shape: 'cone', height: 0.6 },
  
  // イタリア
  { id: 'it-colosseum', name: 'コロッセオ', country: 'Italy', lat: 41.8902, lng: 12.4922, color: '#FFDAC1', shape: 'torus', height: 0.9 },
  { id: 'it-pisa', name: 'ピサの斜塔', country: 'Italy', lat: 43.7230, lng: 10.3966, color: '#B5EAD7', shape: 'cone', height: 1.0 },
  
  // イギリス
  { id: 'uk-bigben', name: 'ビッグベン', country: 'UK', lat: 51.5007, lng: -0.1246, color: '#C7CEEA', shape: 'box', height: 1.4 },
  { id: 'uk-london', name: 'ロンドンアイ', country: 'UK', lat: 51.5033, lng: -0.1195, color: '#FFB7B2', shape: 'torus', height: 1.1 },
  
  // ドイツ
  { id: 'de-brandenburg', name: 'ブランデンブルク門', country: 'Germany', lat: 52.5163, lng: 13.3777, color: '#FFDAC1', shape: 'box', height: 1.0 },
  
  // スペイン
  { id: 'es-sagrada', name: 'サグラダ・ファミリア', country: 'Spain', lat: 41.4036, lng: 2.1744, color: '#B5EAD7', shape: 'cone', height: 1.5 },
  
  // オーストラリア
  { id: 'au-opera', name: 'オペラハウス', country: 'Australia', lat: -33.8568, lng: 151.2153, color: '#FF6961', shape: 'sphere', height: 0.8 },
  
  // エジプト
  { id: 'eg-pyramid', name: 'ピラミッド', country: 'Egypt', lat: 29.9792, lng: 31.1342, color: '#FFDAC1', shape: 'cone', height: 1.2 },
  
  // インド
  { id: 'in-taj', name: 'タージ・マハル', country: 'India', lat: 27.1751, lng: 78.0421, color: '#C7CEEA', shape: 'sphere', height: 1.0 },
  
  // ブラジル
  { id: 'br-christ', name: 'キリスト像', country: 'Brazil', lat: -22.9519, lng: -43.2105, color: '#B5EAD7', shape: 'cone', height: 1.4 },
  
  // カナダ
  { id: 'ca-tower', name: 'CNタワー', country: 'Canada', lat: 43.6426, lng: -79.3871, color: '#FFB7B2', shape: 'cone', height: 1.5 },
  
  // 中国
  { id: 'cn-greatwall', name: '万里の長城', country: 'China', lat: 40.4319, lng: 116.5704, color: '#FFDAC1', shape: 'box', height: 0.7 },
  { id: 'cn-forbidden', name: '紫禁城', country: 'China', lat: 39.9163, lng: 116.3972, color: '#FF6961', shape: 'box', height: 0.9 },
  
  // ロシア
  { id: 'ru-kremlin', name: 'クレムリン', country: 'Russia', lat: 55.7520, lng: 37.6175, color: '#C7CEEA', shape: 'box', height: 1.1 },
  
  // メキシコ
  { id: 'mx-chichen', name: 'チチェン・イッツァ', country: 'Mexico', lat: 20.6843, lng: -88.5678, color: '#FFDAC1', shape: 'cone', height: 1.0 },
  
  // タイ
  { id: 'th-temple', name: 'ワット・アルン', country: 'Thailand', lat: 13.7437, lng: 100.4887, color: '#B5EAD7', shape: 'cone', height: 1.2 },
  
  // トルコ
  { id: 'tr-hagia', name: 'アヤソフィア', country: 'Turkey', lat: 41.0086, lng: 28.9802, color: '#FFB7B2', shape: 'sphere', height: 1.0 },
  
  // ギリシャ
  { id: 'gr-parthenon', name: 'パルテノン神殿', country: 'Greece', lat: 37.9715, lng: 23.7257, color: '#C7CEEA', shape: 'box', height: 0.9 },
  
  // ペルー
  { id: 'pe-machu', name: 'マチュ・ピチュ', country: 'Peru', lat: -13.1631, lng: -72.5450, color: '#FFDAC1', shape: 'box', height: 0.8 },
  
  // ノルウェー
  { id: 'no-fjord', name: 'フィヨルド', country: 'Norway', lat: 60.5000, lng: 7.0000, color: '#B5EAD7', shape: 'sphere', height: 0.6 },
  
  // ニュージーランド
  { id: 'nz-hobbit', name: 'ホビット村', country: 'New Zealand', lat: -37.8579, lng: 175.6826, color: '#B5EAD7', shape: 'sphere', height: 0.5 },
];
