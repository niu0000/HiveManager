// 国データ（50+ カ国）
export interface Greeting {
  text: string;        // 現地語テキスト
  romanized: string;   // ローマ字読み
  meaning: string;     // 日本語での意味
  lang: string;        // Web Speech API 言語コード（例："ja-JP"）
}

export interface Food {
  name: string;        // 料理名（日本語）
  emoji: string;       // 絵文字
  category?: string;   // カテゴリ（和食 / 洋食 / アジア / etc）
}

export interface LandmarkInfo {
  name: string;        // 建物・場所名（日本語）
  emoji: string;       // 絵文字
}

export interface CountryData {
  code: string;        // ISO 3166-1 alpha-2（例："JP"）
  name: string;        // 日本語国名
  nameEn: string;      // 英語国名
  flag: string;        // 国旗絵文字
  capital: string;     // 首都（日本語）
  language: string;    // 公用語
  lat: number;         // 国の中心緯度（ピン・フライ先）
  lng: number;         // 国の中心経度
  color: string;       // ピンカラー（hex）
  greetings: Greeting[];
  foods: Food[];
  landmarks: LandmarkInfo[];
  funFacts: string[];  // 豆知識（3〜5 個）
}

export const countries: CountryData[] = [
  {
    code: 'JP',
    name: '日本',
    nameEn: 'Japan',
    flag: '🇯🇵',
    capital: '東京',
    language: '日本語',
    lat: 36.2048,
    lng: 138.2529,
    color: '#E53E3E',
    greetings: [
      { text: 'こんにちは', romanized: 'Konnichiwa', meaning: 'こんにちは', lang: 'ja-JP' },
      { text: 'ありがとう', romanized: 'Arigatō', meaning: 'ありがとう', lang: 'ja-JP' },
    ],
    foods: [
      { name: '寿司', emoji: '🍣', category: '和食' },
      { name: 'ラーメン', emoji: '🍜', category: '和食' },
      { name: '天ぷら', emoji: '🍤', category: '和食' },
      { name: '抹茶', emoji: '🍵', category: '和食' },
    ],
    landmarks: [
      { name: '富士山', emoji: '🗻' },
      { name: '東京スカイツリー', emoji: '🗼' },
      { name: '金閣寺', emoji: '⛩️' },
    ],
    funFacts: [
      '日本は世界最古の企業が存在する国です（西暦 578 年創業）',
      '自動販売機の数は世界最多級',
      '新幹線は平均遅延時間が 1 分未満',
    ],
  },
  {
    code: 'US',
    name: 'アメリカ',
    nameEn: 'United States',
    flag: '🇺🇸',
    capital: 'ワシントン D.C.',
    language: '英語',
    lat: 37.0902,
    lng: -95.7129,
    color: '#3182CE',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-US' },
      { text: 'Thank you', romanized: 'Thank you', meaning: 'ありがとう', lang: 'en-US' },
    ],
    foods: [
      { name: 'ハンバーガー', emoji: '🍔', category: '洋食' },
      { name: 'ピザ', emoji: '🍕', category: '洋食' },
      { name: 'ホットドッグ', emoji: '🌭', category: '洋食' },
      { name: 'アップルパイ', emoji: '🥧', category: '洋食' },
    ],
    landmarks: [
      { name: '自由の女神', emoji: '🗽' },
      { name: 'グランドキャニオン', emoji: '🏜️' },
      { name: 'ゴールデンゲートブリッジ', emoji: '🌉' },
    ],
    funFacts: [
      'アメリカには 50 の州があります',
      'ハワイは日本から最も近いアメリカの州',
      'ニューヨークの地下鉄は 24 時間運行',
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
    color: '#805AD5',
    greetings: [
      { text: 'Bonjour', romanized: 'Bonjour', meaning: 'こんにちは', lang: 'fr-FR' },
      { text: 'Merci', romanized: 'Merci', meaning: 'ありがとう', lang: 'fr-FR' },
    ],
    foods: [
      { name: 'クロワッサン', emoji: '🥐', category: '洋食' },
      { name: 'チーズ', emoji: '🧀', category: '洋食' },
      { name: 'フレンチトースト', emoji: '🍞', category: '洋食' },
      { name: 'ワイン', emoji: '🍷', category: '洋食' },
    ],
    landmarks: [
      { name: 'エッフェル塔', emoji: '🗼' },
      { name: 'ルーブル美術館', emoji: '🏛️' },
      { name: '凱旋門', emoji: '🏛️' },
    ],
    funFacts: [
      'フランスは世界で最も訪問者の多い国',
      'バゲットの法律があり、品質が定められている',
      'パリには「光の都」という別名がある',
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
    color: '#38A169',
    greetings: [
      { text: 'Ciao', romanized: 'Ciao', meaning: 'こんにちは', lang: 'it-IT' },
      { text: 'Grazie', romanized: 'Grazie', meaning: 'ありがとう', lang: 'it-IT' },
    ],
    foods: [
      { name: 'ピザ', emoji: '🍕', category: '洋食' },
      { name: 'パスタ', emoji: '🍝', category: '洋食' },
      { name: 'ジェラート', emoji: '🍨', category: '洋食' },
      { name: 'エスプレッソ', emoji: '☕', category: '洋食' },
    ],
    landmarks: [
      { name: 'コロッセオ', emoji: '🏛️' },
      { name: 'ピサの斜塔', emoji: '🗼' },
      { name: 'ヴェネツィア', emoji: '🚣' },
    ],
    funFacts: [
      'イタリアには世界遺産が最も多く存在',
      'ピザはナポリで発明された',
      'バチカン市国はイタリア国内にある独立国家',
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
    color: '#DD6B20',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-GB' },
      { text: 'Cheers', romanized: 'Cheers', meaning: 'ありがとう/乾杯', lang: 'en-GB' },
    ],
    foods: [
      { name: 'フィッシュアンドチップス', emoji: '🐟', category: '洋食' },
      { name: 'イングリッシュブレックファスト', emoji: '🍳', category: '洋食' },
      { name: 'スコーン', emoji: '🧁', category: '洋食' },
      { name: '紅茶', emoji: '☕', category: '洋食' },
    ],
    landmarks: [
      { name: 'ビッグベン', emoji: '🕰️' },
      { name: 'ロンドンアイ', emoji: '🎡' },
      { name: 'ストーンヘンジ', emoji: '🗿' },
    ],
    funFacts: [
      'イギリスには国王がいます',
      'ロンドン地下鉄は世界最古',
      '午後のティータイムは文化の一部',
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
    color: '#E53E3E',
    greetings: [
      { text: 'Hallo', romanized: 'Hallo', meaning: 'こんにちは', lang: 'de-DE' },
      { text: 'Danke', romanized: 'Danke', meaning: 'ありがとう', lang: 'de-DE' },
    ],
    foods: [
      { name: 'ソーセージ', emoji: '🌭', category: '洋食' },
      { name: 'プレッツェル', emoji: '🥨', category: '洋食' },
      { name: 'ビール', emoji: '🍺', category: '洋食' },
      { name: 'シュークリーム', emoji: '🍰', category: '洋食' },
    ],
    landmarks: [
      { name: 'ブランデンブルク門', emoji: '🏛️' },
      { name: 'ノイシュバンシュタイン城', emoji: '🏰' },
      { name: 'ベルリンの壁', emoji: '🧱' },
    ],
    funFacts: [
      'ドイツには約 1500 種類のビールがある',
      'アウトバーンは速度制限のない区間がある',
      'クリスマスマーケット発祥の地',
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
    color: '#DD6B20',
    greetings: [
      { text: 'Hola', romanized: 'Hola', meaning: 'こんにちは', lang: 'es-ES' },
      { text: 'Gracias', romanized: 'Gracias', meaning: 'ありがとう', lang: 'es-ES' },
    ],
    foods: [
      { name: 'パエリア', emoji: '🥘', category: '洋食' },
      { name: 'タパス', emoji: '🍢', category: '洋食' },
      { name: 'ハモン', emoji: '🥓', category: '洋食' },
      { name: 'チュロス', emoji: '🍩', category: '洋食' },
    ],
    landmarks: [
      { name: 'サグラダ・ファミリア', emoji: '⛪' },
      { name: 'アルハンブラ宮殿', emoji: '🏰' },
      { name: 'プラド美術館', emoji: '🏛️' },
    ],
    funFacts: [
      'スペインには 13 の世界遺産がある',
      'シエスタ（昼寝）の文化がある',
      'フラメンコはユネスコ無形文化遺産',
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
    color: '#E53E3E',
    greetings: [
      { text: '你好', romanized: 'Nǐ hǎo', meaning: 'こんにちは', lang: 'zh-CN' },
      { text: '谢谢', romanized: 'Xièxiè', meaning: 'ありがとう', lang: 'zh-CN' },
    ],
    foods: [
      { name: '餃子', emoji: '🥟', category: 'アジア' },
      { name: 'ラーメン', emoji: '🍜', category: 'アジア' },
      { name: '北京ダック', emoji: '🦆', category: 'アジア' },
      { name: 'お茶', emoji: '🍵', category: 'アジア' },
    ],
    landmarks: [
      { name: '万里の長城', emoji: '🧱' },
      { name: '紫禁城', emoji: '🏯' },
      { name: '兵馬俑', emoji: '🗿' },
    ],
    funFacts: [
      '中国は世界で最も人口が多い国',
      'パンダは中国の国宝',
      'お茶の発祥地',
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
    color: '#3182CE',
    greetings: [
      { text: '안녕하세요', romanized: 'Annyeonghaseyo', meaning: 'こんにちは', lang: 'ko-KR' },
      { text: '감사합니다', romanized: 'Gamsahamnida', meaning: 'ありがとう', lang: 'ko-KR' },
    ],
    foods: [
      { name: 'キムチ', emoji: '🥬', category: 'アジア' },
      { name: '焼肉', emoji: '🥩', category: 'アジア' },
      { name: 'ビビンバ', emoji: '🍚', category: 'アジア' },
      { name: 'トッポギ', emoji: '🍢', category: 'アジア' },
    ],
    landmarks: [
      { name: '景福宮', emoji: '🏯' },
      { name: 'N ソウルタワー', emoji: '🗼' },
      { name: '済州島', emoji: '🏝️' },
    ],
    funFacts: [
      '韓国には 4 つの季節がはっきりある',
      'K-POP は世界中で人気',
      'インターネット速度が世界最速レベル',
    ],
  },
  {
    code: 'IN',
    name: 'インド',
    nameEn: 'India',
    flag: '🇮🇳',
    capital: 'ニューデリー',
    language: 'ヒンディー語/英語',
    lat: 20.5937,
    lng: 78.9629,
    color: '#DD6B20',
    greetings: [
      { text: 'नमस्ते', romanized: 'Namaste', meaning: 'こんにちは', lang: 'hi-IN' },
      { text: 'धन्यवाद', romanized: 'Dhanyavād', meaning: 'ありがとう', lang: 'hi-IN' },
    ],
    foods: [
      { name: 'カレー', emoji: '🍛', category: 'アジア' },
      { name: 'ナン', emoji: '🫓', category: 'アジア' },
      { name: 'サモサ', emoji: '🥟', category: 'アジア' },
      { name: 'チャイ', emoji: '☕', category: 'アジア' },
    ],
    landmarks: [
      { name: 'タージ・マハル', emoji: '🕌' },
      { name: '赤い城', emoji: '🏰' },
      { name: 'ガンジス川', emoji: '🌊' },
    ],
    funFacts: [
      'チェスとヨガはインド発祥',
      '世界で最も雨が多い場所がある',
      '牛は神聖な動物とされている',
    ],
  },
  {
    code: 'BR',
    name: 'ブラジル',
    nameEn: 'Brazil',
    flag: '🇧🇷',
    capital: 'ブラジリア',
    language: 'ポルトガル語',
    lat: -14.2350,
    lng: -51.9253,
    color: '#38A169',
    greetings: [
      { text: 'Olá', romanized: 'Olá', meaning: 'こんにちは', lang: 'pt-BR' },
      { text: 'Obrigado', romanized: 'Obrigado', meaning: 'ありがとう', lang: 'pt-BR' },
    ],
    foods: [
      { name: 'フェイジョアーダ', emoji: '🍲', category: '中南米' },
      { name: 'シュラスコ', emoji: '🥩', category: '中南米' },
      { name: 'カイピリーニャ', emoji: '🍹', category: '中南米' },
      { name: ' brigadeiro', emoji: '🍫', category: '中南米' },
    ],
    landmarks: [
      { name: 'キリスト像', emoji: '✝️' },
      { name: 'アマゾン川', emoji: '🌊' },
      { name: 'イグアスの滝', emoji: '💦' },
    ],
    funFacts: [
      'カーニバルは世界最大のお祭り',
      'サッカー王国として有名',
      'アマゾン熱帯雨林の大部分を保有',
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
    color: '#3182CE',
    greetings: [
      { text: 'G\'day', romanized: 'G\'day', meaning: 'こんにちは', lang: 'en-AU' },
      { text: 'Thanks', romanized: 'Thanks', meaning: 'ありがとう', lang: 'en-AU' },
    ],
    foods: [
      { name: 'ベジマイト', emoji: '🍞', category: '洋食' },
      { name: 'バーベキュー', emoji: '🍖', category: '洋食' },
      { name: 'ティムタム', emoji: '🍪', category: '洋食' },
      { name: 'ラミントン', emoji: '🍰', category: '洋食' },
    ],
    landmarks: [
      { name: 'オペラハウス', emoji: '🎭' },
      { name: 'エアーズロック', emoji: '🪨' },
      { name: 'グレートバリアリーフ', emoji: '🐠' },
    ],
    funFacts: [
      'コアラとカンガルーが生息',
      '人口より羊の数の方が多い',
      '世界最大のサンゴ礁がある',
    ],
  },
  {
    code: 'CA',
    name: 'カナダ',
    nameEn: 'Canada',
    flag: '🇨🇦',
    capital: 'オタワ',
    language: '英語/フランス語',
    lat: 56.1304,
    lng: -106.3468,
    color: '#E53E3E',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-CA' },
      { text: 'Bonjour', romanized: 'Bonjour', meaning: 'こんにちは', lang: 'fr-CA' },
    ],
    foods: [
      { name: 'プーティン', emoji: '🍟', category: '洋食' },
      { name: 'メープルシロップ', emoji: '🥞', category: '洋食' },
      { name: 'ベーグル', emoji: '🥯', category: '洋食' },
      { name: 'サーモン', emoji: '🐟', category: '洋食' },
    ],
    landmarks: [
      { name: 'CN タワー', emoji: '🗼' },
      { name: 'ナイアガラの滝', emoji: '💦' },
      { name: 'ロッキー山脈', emoji: '🏔️' },
    ],
    funFacts: [
      '世界で 2 番目に広い国',
      '湖の数が世界最多',
      'アイスホッケーが国技',
    ],
  },
  {
    code: 'MX',
    name: 'メキシコ',
    nameEn: 'Mexico',
    flag: '🇲🇽',
    capital: 'メキシコシティ',
    language: 'スペイン語',
    lat: 23.6345,
    lng: -102.5528,
    color: '#38A169',
    greetings: [
      { text: 'Hola', romanized: 'Hola', meaning: 'こんにちは', lang: 'es-MX' },
      { text: 'Gracias', romanized: 'Gracias', meaning: 'ありがとう', lang: 'es-MX' },
    ],
    foods: [
      { name: 'タコス', emoji: '🌮', category: '中南米' },
      { name: 'ファヒータ', emoji: '🫓', category: '中南米' },
      { name: 'ワカモーレ', emoji: '🥑', category: '中南米' },
      { name: 'マルガリータ', emoji: '🍹', category: '中南米' },
    ],
    landmarks: [
      { name: 'チチェン・イッツァ', emoji: '🏛️' },
      { name: 'テオティワカン', emoji: '🔺' },
      { name: 'カンクン', emoji: '🏖️' },
    ],
    funFacts: [
      'チョコレートはメキシコ発祥',
      'マヤ文明の遺跡が残る',
      '死者の日はユネスコ無形文化遺産',
    ],
  },
  {
    code: 'RU',
    name: 'ロシア',
    nameEn: 'Russia',
    flag: '🇷🇺',
    capital: 'モスクワ',
    language: 'ロシア語',
    lat: 61.5240,
    lng: 105.3188,
    color: '#3182CE',
    greetings: [
      { text: 'Здравствуйте', romanized: 'Zdravstvuyte', meaning: 'こんにちは', lang: 'ru-RU' },
      { text: 'Спасибо', romanized: 'Spasibo', meaning: 'ありがとう', lang: 'ru-RU' },
    ],
    foods: [
      { name: 'ボルシチ', emoji: '🍲', category: '洋食' },
      { name: 'ピロシキ', emoji: '🥟', category: '洋食' },
      { name: 'ウォッカ', emoji: '🍶', category: '洋食' },
      { name: 'イクラ', emoji: '🐟', category: '洋食' },
    ],
    landmarks: [
      { name: 'クレムリン', emoji: '🏰' },
      { name: '赤の広場', emoji: '🟥' },
      { name: 'エルミタージュ美術館', emoji: '🏛️' },
    ],
    funFacts: [
      '世界で最も広い国',
      '11 の時間帯にまたがる',
      'バレエの本場',
    ],
  },
  {
    code: 'EG',
    name: 'エジプト',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    capital: 'カイロ',
    language: 'アラビア語',
    lat: 26.8206,
    lng: 30.8025,
    color: '#DD6B20',
    greetings: [
      { text: 'مرحبا', romanized: 'Marhaban', meaning: 'こんにちは', lang: 'ar-EG' },
      { text: 'شكرا', romanized: 'Shukran', meaning: 'ありがとう', lang: 'ar-EG' },
    ],
    foods: [
      { name: 'ファラフェル', emoji: '🧆', category: '中東' },
      { name: 'フムス', emoji: '🫘', category: '中東' },
      { name: 'ケバブ', emoji: '🍖', category: '中東' },
      { name: 'バクラヴァ', emoji: '🥮', category: '中東' },
    ],
    landmarks: [
      { name: 'ピラミッド', emoji: '🔺' },
      { name: 'スフィンクス', emoji: '🦁' },
      { name: 'ナイル川', emoji: '🌊' },
    ],
    funFacts: [
      '古代文明の発祥地',
      'ピラミッドは 4500 年以上前に建設',
      'ヒエログリフは世界最古の文字の一つ',
    ],
  },
  {
    code: 'TH',
    name: 'タイ',
    nameEn: 'Thailand',
    flag: '🇹🇭',
    capital: 'バンコク',
    language: 'タイ語',
    lat: 15.8700,
    lng: 100.9925,
    color: '#3182CE',
    greetings: [
      { text: 'สวัสดี', romanized: 'Sawasdee', meaning: 'こんにちは', lang: 'th-TH' },
      { text: 'ขอบคุณ', romanized: 'Khob khun', meaning: 'ありがとう', lang: 'th-TH' },
    ],
    foods: [
      { name: 'パッタイ', emoji: '🍜', category: 'アジア' },
      { name: 'トムヤムクン', emoji: '🍲', category: 'アジア' },
      { name: 'マンゴー sticky rice', emoji: '🥭', category: 'アジア' },
      { name: 'グリーンカレー', emoji: '🍛', category: 'アジア' },
    ],
    landmarks: [
      { name: 'ワット・アルン', emoji: '⛩️' },
      { name: '王宮', emoji: '🏰' },
      { name: 'プーケット', emoji: '🏖️' },
    ],
    funFacts: [
      '笑いの国と呼ばれる',
      '王様を敬う文化が強い',
      '水上マーケットが有名',
    ],
  },
  {
    code: 'VN',
    name: 'ベトナム',
    nameEn: 'Vietnam',
    flag: '🇻🇳',
    capital: 'ハノイ',
    language: 'ベトナム語',
    lat: 14.0583,
    lng: 108.2772,
    color: '#E53E3E',
    greetings: [
      { text: 'Xin chào', romanized: 'Xin chào', meaning: 'こんにちは', lang: 'vi-VN' },
      { text: 'Cảm ơn', romanized: 'Cảm ơn', meaning: 'ありがとう', lang: 'vi-VN' },
    ],
    foods: [
      { name: 'フォー', emoji: '🍜', category: 'アジア' },
      { name: 'バインミー', emoji: '🥖', category: 'アジア' },
      { name: '春巻き', emoji: '🥚', category: 'アジア' },
      { name: 'ベトナムコーヒー', emoji: '☕', category: 'アジア' },
    ],
    landmarks: [
      { name: 'ハロン湾', emoji: '⛵' },
      { name: 'ホイアン', emoji: '🏮' },
      { name: 'ホーチミン廟', emoji: '🏛️' },
    ],
    funFacts: [
      '世界最大の洞窟がある',
      'コーヒー輸出量世界 2 位',
      'オートバイの数が非常に多い',
    ],
  },
  {
    code: 'ID',
    name: 'インドネシア',
    nameEn: 'Indonesia',
    flag: '🇮🇩',
    capital: 'ジャカルタ',
    language: 'インドネシア語',
    lat: -0.7893,
    lng: 113.9213,
    color: '#E53E3E',
    greetings: [
      { text: 'Halo', romanized: 'Halo', meaning: 'こんにちは', lang: 'id-ID' },
      { text: 'Terima kasih', romanized: 'Terima kasih', meaning: 'ありがとう', lang: 'id-ID' },
    ],
    foods: [
      { name: 'ナシゴレン', emoji: '🍛', category: 'アジア' },
      { name: 'サテ', emoji: '🍢', category: 'アジア' },
      { name: 'ガドガド', emoji: '🥗', category: 'アジア' },
      { name: 'レンダン', emoji: '🍖', category: 'アジア' },
    ],
    landmarks: [
      { name: 'ボロブドゥール寺院', emoji: '⛩️' },
      { name: 'バリ島', emoji: '🏝️' },
      { name: 'コモドドラゴン', emoji: '🦎' },
    ],
    funFacts: [
      '世界最大の群島国家',
      '火山の数が世界最多',
      '多民族・多言語国家',
    ],
  },
  {
    code: 'MY',
    name: 'マレーシア',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    capital: 'クアラルンプール',
    language: 'マレー語/英語',
    lat: 4.2105,
    lng: 101.9758,
    color: '#3182CE',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'ms-MY' },
      { text: 'Terima kasih', romanized: 'Terima kasih', meaning: 'ありがとう', lang: 'ms-MY' },
    ],
    foods: [
      { name: 'ナシレマ', emoji: '🍚', category: 'アジア' },
      { name: 'ラクサ', emoji: '🍜', category: 'アジア' },
      { name: 'サテ', emoji: '🍢', category: 'アジア' },
      { name: 'ルマ', emoji: '🥤', category: 'アジア' },
    ],
    landmarks: [
      { name: 'ペトロナスツインタワー', emoji: '🏢' },
      { name: 'バトゥ洞窟', emoji: '🕳️' },
      { name: 'マラッカ', emoji: '🏛️' },
    ],
    funFacts: [
      'ペトロナスツインタワーはかつて世界一高いビル',
      '多民族が調和して暮らす',
      '熱帯雨林が国土の大部分を占める',
    ],
  },
  {
    code: 'SG',
    name: 'シンガポール',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    capital: 'シンガポール',
    language: '英語/中国語/マレー語/タミル語',
    lat: 1.3521,
    lng: 103.8198,
    color: '#E53E3E',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-SG' },
      { text: '你好', romanized: 'Nǐ hǎo', meaning: 'こんにちは', lang: 'zh-CN' },
    ],
    foods: [
      { name: 'チキンライス', emoji: '🍗', category: 'アジア' },
      { name: 'ラクサ', emoji: '🍜', category: 'アジア' },
      { name: 'サテ', emoji: '🍢', category: 'アジア' },
      { name: 'チリクラブ', emoji: '🦀', category: 'アジア' },
    ],
    landmarks: [
      { name: 'マーライオン', emoji: '🦁' },
      { name: 'ガーデンズ・バイ・ザ・ベイ', emoji: '🌳' },
      { name: 'マリーナベイサンズ', emoji: '🏨' },
    ],
    funFacts: [
      '都市国家として発展',
      '清潔で安全な国',
      '多言語が公用語',
    ],
  },
  {
    code: 'PH',
    name: 'フィリピン',
    nameEn: 'Philippines',
    flag: '🇵🇭',
    capital: 'マニラ',
    language: 'フィリピン語/英語',
    lat: 12.8797,
    lng: 121.7740,
    color: '#3182CE',
    greetings: [
      { text: 'Kumusta', romanized: 'Kumusta', meaning: 'こんにちは', lang: 'fil-PH' },
      { text: 'Salamat', romanized: 'Salamat', meaning: 'ありがとう', lang: 'fil-PH' },
    ],
    foods: [
      { name: 'アドボ', emoji: '🍗', category: 'アジア' },
      { name: 'シニガン', emoji: '🍲', category: 'アジア' },
      { name: 'ルンピア', emoji: '🥚', category: 'アジア' },
      { name: 'ハロハロ', emoji: '🍨', category: 'アジア' },
    ],
    landmarks: [
      { name: 'ボラカイ島', emoji: '🏖️' },
      { name: 'バナウェ棚田', emoji: '🌾' },
      { name: 'イントラムロス', emoji: '🏰' },
    ],
    funFacts: [
      '7000 以上の島からなる',
      '世界最長のクリスマスシーズン',
      '英語が広く通じる',
    ],
  },
  {
    code: 'NZ',
    name: 'ニュージーランド',
    nameEn: 'New Zealand',
    flag: '🇳🇿',
    capital: 'ウェリントン',
    language: '英語/マオリ語',
    lat: -40.9006,
    lng: 174.8860,
    color: '#3182CE',
    greetings: [
      { text: 'Kia ora', romanized: 'Kia ora', meaning: 'こんにちは', lang: 'mi-NZ' },
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-NZ' },
    ],
    foods: [
      { name: 'ランバーグ', emoji: '🍔', category: '洋食' },
      { name: 'パイ', emoji: '🥧', category: '洋食' },
      { name: 'フィッシュアンドチップス', emoji: '🐟', category: '洋食' },
      { name: ' Pavlova', emoji: '🍰', category: '洋食' },
    ],
    landmarks: [
      { name: 'ミルフォードサウンド', emoji: '🏞️' },
      { name: 'ロトルア', emoji: '♨️' },
      { name: 'ホビット村', emoji: '🏡' },
    ],
    funFacts: [
      '羊の数が人口より多い',
      '映画「ロード・オブ・ザ・リング」の撮影地',
      'マオリ文化が息づく',
    ],
  },
  {
    code: 'ZA',
    name: '南アフリカ',
    nameEn: 'South Africa',
    flag: '🇿🇦',
    capital: 'プレトリア',
    language: 'アフリカーンス語/英語',
    lat: -30.5595,
    lng: 22.9375,
    color: '#38A169',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-ZA' },
      { text: 'Howzit', romanized: 'Howzit', meaning: 'こんにちは', lang: 'en-ZA' },
    ],
    foods: [
      { name: 'ブラーイ', emoji: '🍖', category: 'アフリカ' },
      { name: 'ボボティ', emoji: '🍛', category: 'アフリカ' },
      { name: ' bunny chow', emoji: '🍞', category: 'アフリカ' },
      { name: 'メルバ', emoji: '🥛', category: 'アフリカ' },
    ],
    landmarks: [
      { name: 'テーブルマウンテン', emoji: '🏔️' },
      { name: 'クルーガー国立公園', emoji: '🦁' },
      { name: '喜望峰', emoji: '🌊' },
    ],
    funFacts: [
      '3 つの首都を持つ',
      '11 の公用語がある',
      '野生動物の宝庫',
    ],
  },
  {
    code: 'AE',
    name: 'アラブ首長国連邦',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    capital: 'アブダビ',
    language: 'アラビア語',
    lat: 23.4241,
    lng: 53.8478,
    color: '#38A169',
    greetings: [
      { text: 'مرحبا', romanized: 'Marhaban', meaning: 'こんにちは', lang: 'ar-AE' },
      { text: 'شكرا', romanized: 'Shukran', meaning: 'ありがとう', lang: 'ar-AE' },
    ],
    foods: [
      { name: 'シャワルマ', emoji: '🌯', category: '中東' },
      { name: 'ファラフェル', emoji: '🧆', category: '中東' },
      { name: 'フムス', emoji: '🫘', category: '中東' },
      { name: 'バクラヴァ', emoji: '🥮', category: '中東' },
    ],
    landmarks: [
      { name: 'ブルジュ・ハリファ', emoji: '🏢' },
      { name: 'シェイク・ザーイド・モスク', emoji: '🕌' },
      { name: 'パーム・ジャンメイラ', emoji: '🌴' },
    ],
    funFacts: [
      '世界一高いビルがある',
      '砂漠の中に近代都市を建設',
      '7 つの首長国からなる',
    ],
  },
  {
    code: 'TR',
    name: 'トルコ',
    nameEn: 'Turkey',
    flag: '🇹🇷',
    capital: 'アンカラ',
    language: 'トルコ語',
    lat: 38.9637,
    lng: 35.2433,
    color: '#E53E3E',
    greetings: [
      { text: 'Merhaba', romanized: 'Merhaba', meaning: 'こんにちは', lang: 'tr-TR' },
      { text: 'Teşekkürler', romanized: 'Teşekkürler', meaning: 'ありがとう', lang: 'tr-TR' },
    ],
    foods: [
      { name: 'ケバブ', emoji: '🍖', category: '中東' },
      { name: 'バクラヴァ', emoji: '🥮', category: '中東' },
      { name: 'ドルマ', emoji: '🍆', category: '中東' },
      { name: 'トルココーヒー', emoji: '☕', category: '中東' },
    ],
    landmarks: [
      { name: 'アヤソフィア', emoji: '⛪' },
      { name: 'ブルーモスク', emoji: '🕌' },
      { name: 'カッパドキア', emoji: '🎈' },
    ],
    funFacts: [
      '東西文化の交差点',
      'トルコ風呂の発祥地',
      'サンタクロースのモデルが生まれた国',
    ],
  },
  {
    code: 'GR',
    name: 'ギリシャ',
    nameEn: 'Greece',
    flag: '🇬🇷',
    capital: 'アテネ',
    language: 'ギリシャ語',
    lat: 39.0742,
    lng: 21.8243,
    color: '#3182CE',
    greetings: [
      { text: 'Γειά σου', romanized: 'Geia sou', meaning: 'こんにちは', lang: 'el-GR' },
      { text: 'Ευχαριστώ', romanized: 'Efcharistó', meaning: 'ありがとう', lang: 'el-GR' },
    ],
    foods: [
      { name: 'ムサカ', emoji: '🍆', category: '洋食' },
      { name: 'スブラキ', emoji: '🍢', category: '洋食' },
      { name: 'ギリシャサラダ', emoji: '🥗', category: '洋食' },
      { name: 'ウーゾ', emoji: '🍶', category: '洋食' },
    ],
    landmarks: [
      { name: 'パルテノン神殿', emoji: '🏛️' },
      { name: 'サントリーニ', emoji: '🏝️' },
      { name: 'メテオラ', emoji: '⛰️' },
    ],
    funFacts: [
      'オリンピック発祥の地',
      '西洋哲学の发源地',
      '島嶼国家で 6000 以上の島',
    ],
  },
  {
    code: 'PT',
    name: 'ポルトガル',
    nameEn: 'Portugal',
    flag: '🇵🇹',
    capital: 'リスボン',
    language: 'ポルトガル語',
    lat: 39.3999,
    lng: -8.2245,
    color: '#38A169',
    greetings: [
      { text: 'Olá', romanized: 'Olá', meaning: 'こんにちは', lang: 'pt-PT' },
      { text: 'Obrigado', romanized: 'Obrigado', meaning: 'ありがとう', lang: 'pt-PT' },
    ],
    foods: [
      { name: 'パステル・デ・ナータ', emoji: '🥧', category: '洋食' },
      { name: 'バカリャウ', emoji: '🐟', category: '洋食' },
      { name: 'フランセジーニャ', emoji: '🥪', category: '洋食' },
      { name: 'ポートワイン', emoji: '🍷', category: '洋食' },
    ],
    landmarks: [
      { name: 'ペーナ宮殿', emoji: '🏰' },
      { name: 'ベレンの塔', emoji: '🏯' },
      { name: 'アルファマ地区', emoji: '🏘️' },
    ],
    funFacts: [
      '大航海時代の中心地',
      '世界最古のレストランがある',
      'ポルトガル語は 2 億人以上が話す',
    ],
  },
  {
    code: 'NL',
    name: 'オランダ',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    capital: 'アムステルダム',
    language: 'オランダ語',
    lat: 52.1326,
    lng: 5.2913,
    color: '#DD6B20',
    greetings: [
      { text: 'Hallo', romanized: 'Hallo', meaning: 'こんにちは', lang: 'nl-NL' },
      { text: 'Dank je', romanized: 'Dank je', meaning: 'ありがとう', lang: 'nl-NL' },
    ],
    foods: [
      { name: 'ゴーダチーズ', emoji: '🧀', category: '洋食' },
      { name: ' Stroopwafel', emoji: '🧇', category: '洋食' },
      { name: 'ニシン', emoji: '🐟', category: '洋食' },
      { name: ' bitterballen', emoji: '🍢', category: '洋食' },
    ],
    landmarks: [
      { name: 'チューリップ畑', emoji: '🌷' },
      { name: '風車', emoji: '🎡' },
      { name: '運河', emoji: '🚣' },
    ],
    funFacts: [
      '自転車の数が人口より多い',
      'チューリップは国花',
      '国土の 4 分の 1 が海面下',
    ],
  },
  {
    code: 'SE',
    name: 'スウェーデン',
    nameEn: 'Sweden',
    flag: '🇸🇪',
    capital: 'ストックホルム',
    language: 'スウェーデン語',
    lat: 60.1282,
    lng: 18.6435,
    color: '#3182CE',
    greetings: [
      { text: 'Hej', romanized: 'Hej', meaning: 'こんにちは', lang: 'sv-SE' },
      { text: 'Tack', romanized: 'Tack', meaning: 'ありがとう', lang: 'sv-SE' },
    ],
    foods: [
      { name: 'ミートボール', emoji: '🍖', category: '洋食' },
      { name: 'グラブラックス', emoji: '🐟', category: '洋食' },
      { name: 'クネッケブレード', emoji: '🍞', category: '洋食' },
      { name: 'フィーカ', emoji: '☕', category: '洋食' },
    ],
    landmarks: [
      { name: 'ヴァーサ博物館', emoji: '🏛️' },
      { name: 'ガムラスタン', emoji: '🏘️' },
      { name: 'オーロラ', emoji: '🌌' },
    ],
    funFacts: [
      'ノーベル賞発祥の地',
      'IKEA と H&M の本国',
      '環境先進国',
    ],
  },
  {
    code: 'NO',
    name: 'ノルウェー',
    nameEn: 'Norway',
    flag: '🇳🇴',
    capital: 'オスロ',
    language: 'ノルウェー語',
    lat: 60.4720,
    lng: 8.4689,
    color: '#E53E3E',
    greetings: [
      { text: 'Hei', romanized: 'Hei', meaning: 'こんにちは', lang: 'no-NO' },
      { text: 'Takk', romanized: 'Takk', meaning: 'ありがとう', lang: 'no-NO' },
    ],
    foods: [
      { name: 'サーモン', emoji: '🐟', category: '洋食' },
      { name: 'レフセ', emoji: '🫓', category: '洋食' },
      { name: 'クヴェトブロッド', emoji: '🍞', category: '洋食' },
      { name: 'アクアビット', emoji: '🍶', category: '洋食' },
    ],
    landmarks: [
      { name: 'フィヨルド', emoji: '🏞️' },
      { name: '北極圏', emoji: '❄️' },
      { name: 'ヴィグラン彫刻公園', emoji: '🗿' },
    ],
    funFacts: [
      'フィヨルドが美しい国',
      '北欧神話の発祥地',
      '平和な国ランキング上位',
    ],
  },
  {
    code: 'DK',
    name: 'デンマーク',
    nameEn: 'Denmark',
    flag: '🇩🇰',
    capital: 'コペンハーゲン',
    language: 'デンマーク語',
    lat: 56.2639,
    lng: 9.5018,
    color: '#E53E3E',
    greetings: [
      { text: 'Hej', romanized: 'Hej', meaning: 'こんにちは', lang: 'da-DK' },
      { text: 'Tak', romanized: 'Tak', meaning: 'ありがとう', lang: 'da-DK' },
    ],
    foods: [
      { name: 'スモーブロー', emoji: '🥪', category: '洋食' },
      { name: 'フリーカデッラー', emoji: '🍖', category: '洋食' },
      { name: 'エベスキヴ', emoji: '🍮', category: '洋食' },
      { name: 'カールスバーグ', emoji: '🍺', category: '洋食' },
    ],
    landmarks: [
      { name: '人魚姫の像', emoji: '🧜‍♀️' },
      { name: 'チボリ公園', emoji: '🎢' },
      { name: 'ニューハウン', emoji: '🏘️' },
    ],
    funFacts: [
      'LEGO の発祥地',
      '幸福度が高い国',
      '自転車大国',
    ],
  },
  {
    code: 'FI',
    name: 'フィンランド',
    nameEn: 'Finland',
    flag: '🇫🇮',
    capital: 'ヘルシンキ',
    language: 'フィンランド語/スウェーデン語',
    lat: 61.9241,
    lng: 25.7482,
    color: '#3182CE',
    greetings: [
      { text: 'Hei', romanized: 'Hei', meaning: 'こんにちは', lang: 'fi-FI' },
      { text: 'Kiitos', romanized: 'Kiitos', meaning: 'ありがとう', lang: 'fi-FI' },
    ],
    foods: [
      { name: 'カルヤランピーラッカ', emoji: '🥟', category: '洋食' },
      { name: 'グラヴィロヒ', emoji: '🐟', category: '洋食' },
      { name: 'ライ麦パン', emoji: '🍞', category: '洋食' },
      { name: 'サルミアッキ', emoji: '🍬', category: '洋食' },
    ],
    landmarks: [
      { name: 'サンタクロース村', emoji: '🎅' },
      { name: '湖水地方', emoji: '🏞️' },
      { name: 'オーロラ', emoji: '🌌' },
    ],
    funFacts: [
      'サウナの発祥地',
      '教育水準が世界最高',
      '森と湖の国',
    ],
  },
  {
    code: 'PL',
    name: 'ポーランド',
    nameEn: 'Poland',
    flag: '🇵🇱',
    capital: 'ワルシャワ',
    language: 'ポーランド語',
    lat: 51.9194,
    lng: 19.1451,
    color: '#E53E3E',
    greetings: [
      { text: 'Cześć', romanized: 'Cześć', meaning: 'こんにちは', lang: 'pl-PL' },
      { text: 'Dziękuję', romanized: 'Dziękuję', meaning: 'ありがとう', lang: 'pl-PL' },
    ],
    foods: [
      { name: 'ピエロギ', emoji: '🥟', category: '洋食' },
      { name: 'ビゴス', emoji: '🍲', category: '洋食' },
      { name: 'キェウバサ', emoji: '🌭', category: '洋食' },
      { name: 'ウォトカ', emoji: '🍶', category: '洋食' },
    ],
    landmarks: [
      { name: 'アウシュヴィッツ', emoji: '🕊️' },
      { name: 'クラクフ旧市街', emoji: '🏰' },
      { name: 'ワジェンキ公園', emoji: '🌳' },
    ],
    funFacts: [
      'ショパンの故郷',
      'ピエロギは国民食',
      'ヨーロッパの中心に近い',
    ],
  },
  {
    code: 'AT',
    name: 'オーストリア',
    nameEn: 'Austria',
    flag: '🇦🇹',
    capital: 'ウィーン',
    language: 'ドイツ語',
    lat: 47.5162,
    lng: 14.5501,
    color: '#E53E3E',
    greetings: [
      { text: 'Grüß Gott', romanized: 'Grüß Gott', meaning: 'こんにちは', lang: 'de-AT' },
      { text: 'Danke', romanized: 'Danke', meaning: 'ありがとう', lang: 'de-AT' },
    ],
    foods: [
      { name: 'シュニッツェル', emoji: '🍖', category: '洋食' },
      { name: 'ザッハトルテ', emoji: '🍰', category: '洋食' },
      { name: 'アプフェルシュトルーデル', emoji: '🥧', category: '洋食' },
      { name: 'ウィンナー', emoji: '🌭', category: '洋食' },
    ],
    landmarks: [
      { name: 'シェーンブルン宮殿', emoji: '🏰' },
      { name: 'ハルシュタット', emoji: '🏘️' },
      { name: 'アルプス山脈', emoji: '🏔️' },
    ],
    funFacts: [
      '音楽の都ウィーン',
      'モーツァルトの故郷',
      'アルプスの自然が美しい',
    ],
  },
  {
    code: 'CH',
    name: 'スイス',
    nameEn: 'Switzerland',
    flag: '🇨🇭',
    capital: 'ベルン',
    language: 'ドイツ語/フランス語/イタリア語',
    lat: 46.8182,
    lng: 8.2275,
    color: '#E53E3E',
    greetings: [
      { text: 'Grüezi', romanized: 'Grüezi', meaning: 'こんにちは', lang: 'de-CH' },
      { text: 'Bonjour', romanized: 'Bonjour', meaning: 'こんにちは', lang: 'fr-CH' },
    ],
    foods: [
      { name: 'チーズフォンデュ', emoji: '🫕', category: '洋食' },
      { name: 'ラクレット', emoji: '🧀', category: '洋食' },
      { name: 'ロスティ', emoji: '🥔', category: '洋食' },
      { name: 'スイスチョコ', emoji: '🍫', category: '洋食' },
    ],
    landmarks: [
      { name: 'マッターホルン', emoji: '🏔️' },
      { name: 'インターラーケン', emoji: '🏞️' },
      { name: 'ジュネーブ湖', emoji: '🏞️' },
    ],
    funFacts: [
      '永世中立国',
      '時計と銀行の国',
      '4 つの公用語を持つ',
    ],
  },
  {
    code: 'BE',
    name: 'ベルギー',
    nameEn: 'Belgium',
    flag: '🇧🇪',
    capital: 'ブリュッセル',
    language: 'オランダ語/フランス語/ドイツ語',
    lat: 50.5039,
    lng: 4.4699,
    color: '#3182CE',
    greetings: [
      { text: 'Bonjour', romanized: 'Bonjour', meaning: 'こんにちは', lang: 'fr-BE' },
      { text: 'Hallo', romanized: 'Hallo', meaning: 'こんにちは', lang: 'nl-BE' },
    ],
    foods: [
      { name: 'ワッフル', emoji: '🧇', category: '洋食' },
      { name: 'チョコレート', emoji: '🍫', category: '洋食' },
      { name: 'フライドポテト', emoji: '🍟', category: '洋食' },
      { name: 'ビール', emoji: '🍺', category: '洋食' },
    ],
    landmarks: [
      { name: 'グランプラス', emoji: '🏛️' },
      { name: '小便小僧', emoji: '🚽' },
      { name: '原子の塔', emoji: '⚛️' },
    ],
    funFacts: [
      'チョコレートの消費量が世界一',
      'EU の本部がある',
      'ビール種類が 1000 以上',
    ],
  },
  {
    code: 'IE',
    name: 'アイルランド',
    nameEn: 'Ireland',
    flag: '🇮🇪',
    capital: 'ダブリン',
    language: '英語/アイルランド語',
    lat: 53.1424,
    lng: -7.6921,
    color: '#38A169',
    greetings: [
      { text: 'Dia dhuit', romanized: 'Dia dhuit', meaning: 'こんにちは', lang: 'ga-IE' },
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-IE' },
    ],
    foods: [
      { name: 'アイリッシュシチュー', emoji: '🍲', category: '洋食' },
      { name: 'ソーダブレッド', emoji: '🍞', category: '洋食' },
      { name: 'ギネス', emoji: '🍺', category: '洋食' },
      { name: 'アイリッシュコーヒー', emoji: '☕', category: '洋食' },
    ],
    landmarks: [
      { name: 'モハーの断崖', emoji: '🌊' },
      { name: '巨人の道', emoji: '🪨' },
      { name: 'トリニティカレッジ', emoji: '📚' },
    ],
    funFacts: [
      '聖パトリックの国',
      '文学者が多い国',
      '緑の島と呼ばれる',
    ],
  },
  {
    code: 'AR',
    name: 'アルゼンチン',
    nameEn: 'Argentina',
    flag: '🇦🇷',
    capital: 'ブエノスアイレス',
    language: 'スペイン語',
    lat: -38.4161,
    lng: -63.6167,
    color: '#3182CE',
    greetings: [
      { text: 'Hola', romanized: 'Hola', meaning: 'こんにちは', lang: 'es-AR' },
      { text: 'Che', romanized: 'Che', meaning: 'やあ', lang: 'es-AR' },
    ],
    foods: [
      { name: 'タンパ', emoji: '🥩', category: '中南米' },
      { name: 'エンパナーダ', emoji: '🥟', category: '中南米' },
      { name: 'ドゥルセ・デ・レチェ', emoji: '🍮', category: '中南米' },
      { name: 'マテ茶', emoji: '🍵', category: '中南米' },
    ],
    landmarks: [
      { name: 'イグアスの滝', emoji: '💦' },
      { name: 'ペリト・モレノ氷河', emoji: '❄️' },
      { name: 'タンゴ発祥地', emoji: '💃' },
    ],
    funFacts: [
      'タンゴの発祥地',
      'メッシの母国',
      '南米のパリと呼ばれる',
    ],
  },
  {
    code: 'CL',
    name: 'チリ',
    nameEn: 'Chile',
    flag: '🇨🇱',
    capital: 'サンティアゴ',
    language: 'スペイン語',
    lat: -35.6751,
    lng: -71.5430,
    color: '#3182CE',
    greetings: [
      { text: 'Hola', romanized: 'Hola', meaning: 'こんにちは', lang: 'es-CL' },
      { text: 'Po', romanized: 'Po', meaning: 'ねえ', lang: 'es-CL' },
    ],
    foods: [
      { name: 'エンプラナーダ', emoji: '🥟', category: '中南米' },
      { name: 'パスタ・フロラ', emoji: '🥧', category: '中南米' },
      { name: 'セビーチェ', emoji: '🐟', category: '中南米' },
      { name: 'チリワイン', emoji: '🍷', category: '中南米' },
    ],
    landmarks: [
      { name: 'イースター島', emoji: '🗿' },
      { name: 'アタカマ砂漠', emoji: '🏜️' },
      { name: 'パタゴニア', emoji: '🏔️' },
    ],
    funFacts: [
      '世界で最も細長い国',
      'イースター島のモアイ像',
      '銅生産量世界一',
    ],
  },
  {
    code: 'PE',
    name: 'ペルー',
    nameEn: 'Peru',
    flag: '🇵🇪',
    capital: 'リマ',
    language: 'スペイン語/ケチュア語',
    lat: -9.1900,
    lng: -75.0152,
    color: '#E53E3E',
    greetings: [
      { text: 'Hola', romanized: 'Hola', meaning: 'こんにちは', lang: 'es-PE' },
      { text: 'Allianchu', romanized: 'Allianchu', meaning: 'こんにちは', lang: 'qu-PE' },
    ],
    foods: [
      { name: 'セビーチェ', emoji: '🐟', category: '中南米' },
      { name: 'ロモ・サルタード', emoji: '🥩', category: '中南米' },
      { name: 'アンティクーチョ', emoji: '🍢', category: '中南米' },
      { name: 'ピスコサワー', emoji: '🍹', category: '中南米' },
    ],
    landmarks: [
      { name: 'マチュ・ピチュ', emoji: '🏛️' },
      { name: 'ナスカの地上絵', emoji: '🎨' },
      { name: 'アマゾン川', emoji: '🌊' },
    ],
    funFacts: [
      'インカ帝国の中心地',
      'ジャガイモの原産地',
      '世界遺産の数が南米有数',
    ],
  },
  {
    code: 'CO',
    name: 'コロンビア',
    nameEn: 'Colombia',
    flag: '🇨🇴',
    capital: 'ボゴタ',
    language: 'スペイン語',
    lat: 4.5709,
    lng: -74.2973,
    color: '#DD6B20',
    greetings: [
      { text: 'Hola', romanized: 'Hola', meaning: 'こんにちは', lang: 'es-CO' },
      { text: 'Qué hubo', romanized: 'Qué hubo', meaning: '元気？', lang: 'es-CO' },
    ],
    foods: [
      { name: 'バンデハ・パイサ', emoji: '🍽️', category: '中南米' },
      { name: 'アレパ', emoji: '🫓', category: '中南米' },
      { name: 'エンプラナーダ', emoji: '🥟', category: '中南米' },
      { name: 'コロンビアコーヒー', emoji: '☕', category: '中南米' },
    ],
    landmarks: [
      { name: 'カルタヘナ旧市街', emoji: '🏰' },
      { name: '塩の大聖堂', emoji: '⛪' },
      { name: 'ロス・ネバドス国立公園', emoji: '🏔️' },
    ],
    funFacts: [
      'エメラルド生産量世界一',
      'コーヒーの名産地',
      '生物多様性が世界有数',
    ],
  },
  {
    code: 'SA',
    name: 'サウジアラビア',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    capital: 'リヤド',
    language: 'アラビア語',
    lat: 23.8859,
    lng: 45.0792,
    color: '#38A169',
    greetings: [
      { text: 'السلام عليكم', romanized: 'As-salamu alaykum', meaning: '平和あれ', lang: 'ar-SA' },
      { text: 'شكرا', romanized: 'Shukran', meaning: 'ありがとう', lang: 'ar-SA' },
    ],
    foods: [
      { name: 'カブサ', emoji: '🍛', category: '中東' },
      { name: 'ファラフェル', emoji: '🧆', category: '中東' },
      { name: 'フムス', emoji: '🫘', category: '中東' },
      { name: 'アラビックコーヒー', emoji: '☕', category: '中東' },
    ],
    landmarks: [
      { name: 'メッカ', emoji: '🕋' },
      { name: 'メディナ', emoji: '🕌' },
      { name: 'アル・ディッリヤ', emoji: '🏰' },
    ],
    funFacts: [
      'イスラム教の聖地がある',
      '石油生産量世界有数',
      '砂漠が国土の大部分',
    ],
  },
  {
    code: 'IL',
    name: 'イスラエル',
    nameEn: 'Israel',
    flag: '🇮🇱',
    capital: 'エルサレム',
    language: 'ヘブライ語/アラビア語',
    lat: 31.0461,
    lng: 34.8516,
    color: '#3182CE',
    greetings: [
      { text: 'שלום', romanized: 'Shalom', meaning: '平和/こんにちは', lang: 'he-IL' },
      { text: 'תודה', romanized: 'Toda', meaning: 'ありがとう', lang: 'he-IL' },
    ],
    foods: [
      { name: 'ファラフェル', emoji: '🧆', category: '中東' },
      { name: 'フムス', emoji: '🫘', category: '中東' },
      { name: 'シャクシュカ', emoji: '🍳', category: '中東' },
      { name: 'ピタ', emoji: '🫓', category: '中東' },
    ],
    landmarks: [
      { name: '嘆きの壁', emoji: '🧱' },
      { name: '死海', emoji: '🌊' },
      { name: 'テルアビブ', emoji: '🏖️' },
    ],
    funFacts: [
      '3 つの宗教の聖地',
      'スタートアップ大国',
      '砂漠を緑地に変えた',
    ],
  },
  {
    code: 'KE',
    name: 'ケニア',
    nameEn: 'Kenya',
    flag: '🇰🇪',
    capital: 'ナイロビ',
    language: 'スワヒリ語/英語',
    lat: -0.0236,
    lng: 37.9062,
    color: '#38A169',
    greetings: [
      { text: 'Jambo', romanized: 'Jambo', meaning: 'こんにちは', lang: 'sw-KE' },
      { text: 'Asante', romanized: 'Asante', meaning: 'ありがとう', lang: 'sw-KE' },
    ],
    foods: [
      { name: 'ウガリ', emoji: '🍚', category: 'アフリカ' },
      { name: 'ニヤマ・チョマ', emoji: '🍖', category: 'アフリカ' },
      { name: 'スクマ・ウィキ', emoji: '🥬', category: 'アフリカ' },
      { name: 'チャイ', emoji: '☕', category: 'アフリカ' },
    ],
    landmarks: [
      { name: 'マサイマラ国立保護区', emoji: '🦁' },
      { name: 'キリマンジャロ', emoji: '🏔️' },
      { name: 'モンバサ', emoji: '🏖️' },
    ],
    funFacts: [
      'サファリの聖地',
      '長距離走者が多い',
      '多様な野生動物が生息',
    ],
  },
  {
    code: 'NG',
    name: 'ナイジェリア',
    nameEn: 'Nigeria',
    flag: '🇳🇬',
    capital: 'アブジャ',
    language: '英語',
    lat: 9.0820,
    lng: 8.6753,
    color: '#38A169',
    greetings: [
      { text: 'Hello', romanized: 'Hello', meaning: 'こんにちは', lang: 'en-NG' },
      { text: 'Welcome', romanized: 'Welcome', meaning: 'ようこそ', lang: 'en-NG' },
    ],
    foods: [
      { name: 'ジョロフライス', emoji: '🍛', category: 'アフリカ' },
      { name: 'プフプフ', emoji: '🍞', category: 'アフリカ' },
      { name: 'エグシスープ', emoji: '🍲', category: 'アフリカ' },
      { name: 'スヤ', emoji: '🍢', category: 'アフリカ' },
    ],
    landmarks: [
      { name: 'アソロック', emoji: '🪨' },
      { name: 'ラゴス', emoji: '🏙️' },
      { name: 'オシュン・オソグボ', emoji: '🌳' },
    ],
    funFacts: [
      'アフリカ最大の人口',
      'ノリウッドは世界 2 位の映画産業',
      '多民族・多言語国家',
    ],
  },
];

// 検索用エイリアス辞書
export const searchAliases: Record<string, string> = {
  // 日本
  'にほん': 'JP',
  'nippon': 'JP',
  'tokyo': 'JP',
  
  // アメリカ
  'あめりか': 'US',
  'べこく': 'US',
  'usa': 'US',
  'united states': 'US',
  'new york': 'US',
  
  // フランス
  'ふらんす': 'FR',
  'furan': 'FR',
  'paris': 'FR',
  
  // イタリア
  'いたりあ': 'IT',
  'italia': 'IT',
  'rome': 'IT',
  'roma': 'IT',
  
  // イギリス
  'いぎりす': 'GB',
  'えいこく': 'GB',
  'uk': 'GB',
  'united kingdom': 'GB',
  'london': 'GB',
  
  // ドイツ
  'どいつ': 'DE',
  'germany': 'DE',
  'berlin': 'DE',
  
  // スペイン
  'すぺいん': 'ES',
  'spain': 'ES',
  'madrid': 'ES',
  
  // 中国
  'ちゅうごく': 'CN',
  'chuka': 'CN',
  'beijing': 'CN',
  'peking': 'CN',
  
  // 韓国
  'かんこく': 'KR',
  'kankoku': 'KR',
  'seoul': 'KR',
  
  // インド
  'いんど': 'IN',
  'india': 'IN',
  'delhi': 'IN',
  
  // ブラジル
  'ぶらじる': 'BR',
  'brazil': 'BR',
  'brasilia': 'BR',
  
  // オーストラリア
  'おーすとらりあ': 'AU',
  'australia': 'AU',
  'sydney': 'AU',
  
  // カナダ
  'かなだ': 'CA',
  'canada': 'CA',
  'ottawa': 'CA',
  
  // メキシコ
  'めきしこ': 'MX',
  'mexico': 'MX',
  
  // ロシア
  'ろしあ': 'RU',
  'russia': 'RU',
  'moscow': 'RU',
  
  // エジプト
  'えじぷと': 'EG',
  'egypt': 'EG',
  'cairo': 'EG',
  
  // タイ
  'たい': 'TH',
  'thai': 'TH',
  'thailand': 'TH',
  'bangkok': 'TH',
  
  // ベトナム
  'べとなむ': 'VN',
  'vietnam': 'VN',
  'hanoi': 'VN',
  
  // インドネシア
  'いんどねしあ': 'ID',
  'indonesia': 'ID',
  'jakarta': 'ID',
  
  // マレーシア
  'まれーしあ': 'MY',
  'malaysia': 'MY',
  'kualalumpur': 'MY',
  
  // シンガポール
  'しんがぽーる': 'SG',
  'singapore': 'SG',
  
  // フィリピン
  'ふぃりぴん': 'PH',
  'philippines': 'PH',
  'manila': 'PH',
  
  // ニュージーランド
  'にゅーじーらんど': 'NZ',
  'new zealand': 'NZ',
  'wellington': 'NZ',
  
  // 南アフリカ
  'みなみあふりか': 'ZA',
  'south africa': 'ZA',
  'pretoria': 'ZA',
  
  // アラブ首長国連邦
  'あらぶ': 'AE',
  'uae': 'AE',
  'dubai': 'AE',
  'abudhabi': 'AE',
  
  // トルコ
  'とるこ': 'TR',
  'turkey': 'TR',
  'ankara': 'TR',
  
  // ギリシャ
  'ぐりしゃ': 'GR',
  'greece': 'GR',
  'athens': 'GR',
  
  // ポルトガル
  'ぽるとがる': 'PT',
  'portugal': 'PT',
  'lisbon': 'PT',
  
  // オランダ
  'おらんだ': 'NL',
  'netherlands': 'NL',
  'amsterdam': 'NL',
  
  // スウェーデン
  'すうぇーでん': 'SE',
  'sweden': 'SE',
  'stockholm': 'SE',
  
  // ノルウェー
  'のるうぇー': 'NO',
  'norway': 'NO',
  'oslo': 'NO',
  
  // デンマーク
  'でんまーく': 'DK',
  'denmark': 'DK',
  'copenhagen': 'DK',
  
  // フィンランド
  'ふぃんらんど': 'FI',
  'finland': 'FI',
  'helsinki': 'FI',
  
  // ポーランド
  'ぽーらんど': 'PL',
  'poland': 'PL',
  'warsaw': 'PL',
  
  // オーストリア
  'おーすとりあ': 'AT',
  'austria': 'AT',
  'vienna': 'AT',
  
  // スイス
  'すいす': 'CH',
  'switzerland': 'CH',
  'bern': 'CH',
  
  // ベルギー
  'べるぎー': 'BE',
  'belgium': 'BE',
  'brussels': 'BE',
  
  // アイルランド
  'あいすらんど': 'IE',
  'ireland': 'IE',
  'dublin': 'IE',
  
  // アルゼンチン
  'あるぜんちん': 'AR',
  'argentina': 'AR',
  'buenosaires': 'AR',
  
  // チリ
  'ちり': 'CL',
  'chile': 'CL',
  'santiago': 'CL',
  
  // ペルー
  'ぺるー': 'PE',
  'peru': 'PE',
  'lima': 'PE',
  
  // コロンビア
  'ころんびあ': 'CO',
  'colombia': 'CO',
  'bogota': 'CO',
  
  // サウジアラビア
  'さうじ': 'SA',
  'saudi': 'SA',
  'riyadh': 'SA',
  
  // イスラエル
  'いすらえる': 'IL',
  'israel': 'IL',
  'jerusalem': 'IL',
  
  // ケニア
  'けにあ': 'KE',
  'kenya': 'KE',
  'nairobi': 'KE',
  
  // ナイジェリア
  'ないじぇりあ': 'NG',
  'nigeria': 'NG',
  'abuja': 'NG',
};
