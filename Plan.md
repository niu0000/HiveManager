# 【コンテキスト保持用】宿泊管理システム（Dormitory Manager）システム開発マスター仕様書 v2.7

## 1. プログラム全体原則（最重要）
- 【単一責任・細分化の徹底】一つのファイルや関数にロジックを詰め込まない。修正・テストを容易にするため、サービス・API・バリデーションは機能単位で極小のモジュール（ファイル）に完全細分化する。
- 【ハードコードの完全排除】列位置、ベッド番号範囲、ステータスの背景色など、運用の変化に伴う設定値はすべてDB（UI経由で変更可能）から動的に引き当てる。

---

## 2. アーキテクチャ & 技術スタック
- フロントエンド: React 18+, Vite, Tailwind CSS (レスポンシブ対応)
- バックエンド: FastAPI (Python 3.10+)
- データベース: SQLite (開発用) / PostgreSQL (本番用) + SQLAlchemy ORM
- 認証方式: JWT (JSON Web Tokens) による Role-based アクセス制御 (admin / staff)
- 外部連携: Google Sheets API v4 (セルの値・effectiveFormat.backgroundColor の双方向同期)
- セキュリティ: bcrypt (パスワードハッシュ化), CORS制限, Rate Limiting (ログイン試行制限)

---

## 3. ディレクトリ構造（細分化設計）
プログラムの巨大化を防ぐため、以下の構成を厳守する。

backend/
├── app/
│   ├── main.py                  # エントリーポイント・ミドルウェア設定
│   ├── core/                    # 共通基盤（config.py, security.py, database.py）
│   ├── models/                  # DBテーブル定義（SQLAlchemy）
│   │   ├── user.py              # users
│   │   ├── setting.py           # system_settings, sheet_mappings
│   │   ├── rules.py             # assignment_rules (ベッド範囲・性別制限)
│   │   ├── status.py            # color_statuses (背景色とステータスマップ)
│   │   ├── reservation.py       # reservations, beds
│   │   └── recommendation.py    # recommendations
│   ├── schemas/                 # Pydanticバリデーション（auth.py, setting.py, etc.）
│   ├── api/                     # ルーティング（エンドポイント）
│   │   ├── deps.py              # 共通依存（DBセッション、JWT認証・権限ガード）
│   │   └── v1/
│   │       ├── auth.py          # ログイン、アカウント管理
│   │       ├── settings.py      # マッピング、システム・色設定
│   │       ├── reservations.py  # タイムライン、手動編集、清掃
│   │       ├── upload.py        # ねっぱんCSVアップロード受付
│   │       └── recommendations.py # おすすめ場所管理・公開用API
│   └── services/                # ビジネスロジック（完全機能分離）
│       ├── auth_service.py      # ユーザー認証関連
│       ├── sheet_service.py     # Google Sheets API 通信（値・背景色の取得/書き込み）
│       ├── color_resolver.py    # セル背景色のHEX変換、ステータス自動解決・表記揺れ吸収
│       ├── csv_parser.py        # ねっぱんCSVのパース・クレンジング（敬称削除等）
│       ├── assign_engine.py     # 自動アサインアルゴリズム（男女別・連泊移動最小化・For2対応）
│       └── sync_service.py      # マッピングに基づくシートとDBの同期コントロール
├── requirements.txt
└── .env

---

## 4. データベース設計（主要テーブル定義）

### 4.1 sheet_mappings (列マッピング)
- `field_type` (String: bed_number, guest_name, check_in, check_out, status 等)
- `column_letter` (String: 'B', 'D' 等)
- `header_row` / `data_start_row` (Integer)

### 4.2 assignment_rules (ベッド範囲・属性ルール)
- `room_type_code` (String: ねっぱん識別コード)
- `gender_restriction` (String: male / female / mixed)
- `bed_number_min` (Integer: 1XX・2XXの最小値設定)
- `bed_number_max` (Integer: 1XX・2XXの最大値設定)

### 4.3 color_statuses (背景色とステータスマップ)
- `hex_color` (String: '#FFEB3B' 等)
- `status_key` (String: checking_in, staying, checked_out, maintenance, furiako, noshow)
- `status_name_ja` (String: 「チェックイン待ち」「滞在中」「停止中」「フリアコ」「ノーショー」等)
- `is_allocatable` (Boolean: 自動アサイン時に「空室」として利用可能か)

### 4.4 reservations (予約・アサインデータ)
- `neppan_reservation_id` (String: ねっぱん予約番号)
- `is_locked` (Boolean: 手動アサイン後の自動移動禁止フラグ)
- `cleaning_status` (String: 未清掃 / 清掃中 / 完了)

---

## 5. 核となる機能のロジック仕様

### 5.1 背景色判定 & ステータス解決 (`color_resolver.py`)
- Google Sheets APIから得たRGB（0.0-1.0）をHEXコードに変換。
- **【表記揺れ対策】** 人間の手動操作による微妙な色の違い（類似色）を許容するため、カラーディスタンス（RGB距離）計算、または類似色グループ判定を行い、最も近い `color_statuses` に自動翻訳する。

### 5.2 ねっぱんCSVパース (`csv_parser.py`)
- アップロードされたCSVから「予約番号」「代表者氏名」「宿泊日程」「人数（男女内訳）」「部屋タイプ・プラン」を抽出。
- **【氏名クレンジング】** 海外OTA等の「SMITH/JOHN MR」といった敬称（MR/MS）を自動除去し、スプレッドシート書き戻し用に指定文字数（例: 12文字）超は三点リーダー処理する関数を噛ませる。

### 5.3 自動アサインエンジン (`assign_engine.py`)
- **性別・ベッド範囲判定:** CSVの部屋タイプから性別を判定し、`assignment_rules` に基づくベッド番号（1XX＝男性、2XX＝女性）の範囲内でのみ空室を探索。
- **連泊移動（Room Change）の最小化:** ゲストにシーツ移動を強いないよう、「滞在全期間を通して移動なしで固定できるベッド」を最優先でスコアリング探索。不可能な場合のみ最小回数で分割。
- **複数ベッドアサイン（For2対応）:** 1予約で複数ベッドが必要な場合、同一部屋内またはベッド番号が連続する空きベッドをセットで最優先アサイン。
- **状態ガード:** `color_statuses.is_allocatable` が `False` の期間（滞在中・停止中など）、および `is_locked=True` の予約があるベッドは、アサイン対象から完全に除外する。

### 5.4 Googleスプレッドシートへの自動書き戻し
- 自動アサイン成功時、DBの更新に連動して `sheet_service.py` がスプレッドシート側のマッピングされた列へ宿泊者名・ステータスを自動書き込みし、リアルタイムで同期する。

### 5.5 ゲスト向け周辺おすすめ場所（デジタルコンシェルジュ）
- 日英多言語データ対応の `recommendations` テーブル。
- 管理画面から、認証不要のゲスト専用公開ページURLを含む「案内用QRコード」を自動生成・印刷可能。
- ゲスト画面ではワンタップでネイティブ Google Maps アプリが起動し、ルート案内を開始。

### 5.6 連動型ベッド清掃・メイク管理
- チェックアウト日を迎えたベッドを自動で「要清掃」に切り替え。スタッフ専用モバイルUIから「清掃中」「完了」を1タップ更新。完了時はスプレッドシート側にも自動で実績テキストを書き戻す。

---

## 6. 実務上の例外・運用リスク対応（落とし穴と対策）
- **変更・キャンセル処理:** CSV内に既存の予約番号がある場合、キャンセルの場合は即時ベッド解放。変更の場合は「現在アサイン中のベッド」をベースに期間伸縮を試み、手動調整の崩壊を防ぐ。
- **オーバーブック（溢れ）アラート:** 突発的な故障や設定ミスでベッドが不足した場合、エラー落ちさせず「未アサイン（要手動調整リスト）」として管理画面最上部にポップアップ警告する。
- **ベッド移動指示UI:** 連泊中にどうしてもベッド移動が発生するゲストをタイムラインに矢印表示し、当日のフロント・清掃タスクに自動リスト化して共有漏れを防ぐ。

---

## 7. 実実装フェーズ（マイルストーン）
- Phase 1: 細分化ディレクトリ作成 ＆ DB・マイグレーション構築
- Phase 2: JWT認証ガード ＆ 基本 Sheets API 同期（背景色変換・マッピング）
- Phase 3: `csv_parser.py` ＆ `assign_engine.py` （自動アサイン・For2・男女判定）
- Phase 4: おすすめ場所管理（QR生成） ＆ 連動型清掃システム・アラートUI
- Phase 5: スプレッドシート自動書き戻し ＆ 全体最適化・テスト

