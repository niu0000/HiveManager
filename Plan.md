# 【コンテキスト保持用】宿泊管理システム（Dormitory Manager）システム開発マスター仕様書 v2.8

## 1. プログラム全体原則（最重要）
- 【単一責任・細分化の徹底】一つのファイルや関数にロジックを詰め込まない。修正・テストを容易にするため、サービス・API・バリデーションは機能単位で極小のモジュール（ファイル）に完全細分化する。
- 【ハードコードの完全排除】列位置、ベッド番号範囲、ステータスの背景色など、運用の変化に伴う設定値はすべて DB（UI 経由で変更可能）から動的に引き当てる。

---

## 2. アーキテクチャ & 技術スタック
- フロントエンド：React 18+, Vite, Tailwind CSS (レスポンシブ対応)
- バックエンド：FastAPI (Python 3.10+)
- データベース：SQLite (開発用) / PostgreSQL (本番用) + SQLAlchemy ORM
- 認証方式：JWT (JSON Web Tokens) による Role-based アクセス制御 (admin / staff)
- 外部連携：Google Sheets API v4 (セルの値・effectiveFormat.backgroundColor の双方向同期)
- セキュリティ：bcrypt (パスワードハッシュ化), CORS 制限，Rate Limiting (ログイン試行制限)

---

## 3. ディレクトリ構造（現在の実装優先）

**現状のディレクトリ構造を維持し、既存のコードを優先して開発を進める。**

backend/
├── app/
│   ├── main.py                  # エントリーポイント・ミドルウェア設定
│   ├── config.py                # 環境設定（DB URL、JWT シークレット等）
│   ├── database.py              # DB セッション管理
│   ├── models/                  # DB テーブル定義（SQLAlchemy）
│   │   ├── __init__.py
│   │   └── base.py              # 全モデル定義（rooms, beds, reservations, assignments, cleaning_records, recommendations, settings）
│   ├── schemas/                 # Pydantic バリデーション
│   │   ├── __init__.py
│   │   ├── auth.py              # 認証関連スキーマ
│   │   ├── room.py              # 部屋・ベッド関連
│   │   ├── reservation.py       # 予約関連
│   │   ├── assignment.py        # アサイン関連
│   │   ├── cleaning.py          # 清掃関連
│   │   ├── recommendation.py    # おすすめ情報関連
│   │   ├── setting.py           # 設定関連
│   │   └── sync.py              # 同期関連
│   ├── api/                     # ルーティング（エンドポイント）
│   │   ├── __init__.py
│   │   ├── auth.py              # ログイン、アカウント管理
│   │   ├── rooms.py             # 部屋・ベッド管理
│   │   ├── reservations.py      # 予約管理
│   │   ├── assignments.py       # アサイン操作
│   │   ├── cleaning.py          # 清掃ステータス管理
│   │   ├── recommendations.py   # おすすめ場所管理
│   │   ├── sheets.py            # Google スプレッドシート連携テスト
│   │   └── sync.py              # 同期処理
│   ├── services/                # ビジネスロジック
│   │   ├── __init__.py
│   │   ├── google_sheets_service.py  # Google Sheets API 通信
│   │   ├── settings_service.py       # 設定管理（DB から Sheet ID 等取得）
│   │   ├── assignment_service.py     # アサインロジック
│   │   ├── cleaning_service.py       # 清掃管理
│   │   ├── recommendation_service.py # おすすめ情報管理
│   │   ├── csv_parser.py             # CSV パース
│   │   └── sync_service.py           # 同期コントロール
│   └── utils/                   # 共通ユーティリティ
│       ├── __init__.py
│       └── color_resolver.py    # 背景色→ステータス変換
├── requirements.txt
└── .env

---

## 4. データベース設計（主要テーブル定義）

### 4.1 rooms / beds
- `rooms`: 部屋マスタ（name, room_type, attributes）
- `beds`: ベッドマスタ（room_id, bed_number, position）

### 4.2 reservations（予約・アサインデータ）
- ねっぱん CSV から取り込んだ予約情報全体
- `neppan_reservation_id` は現時点では未実装（必要に応じて追加）

### 4.3 assignments（ベッド割り当て）
- `reservation_id`, `bed_id`, `check_in_date`, `check_out_date`, `status`

### 4.4 cleaning_records（清掃記録）
- `bed_id`, `status`, `staff_name`, `started_at`, `completed_at`, `notes`

### 4.5 recommendations（おすすめ情報）
- 多言語対応（name_ja/en/zh/ko, description_ja/en/zh/ko, lat, lng, hours, budget）

### 4.6 settings（システム設定）
- `key`, `value`, `description`
- Google Sheet ID、カラムマッピング等を保存

---

## 5. 核となる機能のロジック仕様

### 5.1 Google スプレッドシート連携 (`google_sheets_service.py`)
- Service Account 認証により Sheets API に接続
- データ取得（get_sheet_data）、更新（update_sheet_data）、背景色取得（get_background_colors）
- 背景色は RGB(0-1) → 整数 (0-255) 変換まで実装済み

### 5.2 設定管理 (`settings_service.py`)
- DB の `settings` テーブルからキー・バリュー形式で設定を取得・保存
- キャッシュ機構付き（初回 DB 参照後はメモリキャッシュ）

### 5.3 自動アサインエンジン (`assignment_service.py`)
- CSV パース結果とベッドマスタを元に空きベッドを探索
- 性別・ベッド範囲ルール是基于 DB 設定（今後拡張）

### 5.4 CSV パース (`csv_parser.py`)
- ねっぱん CSV の各列を Reservation モデルにマッピング
- 日付変換、数値変換、文字列クレンジングを実行

### 5.5 背景色判定 (`utils/color_resolver.py`)
- シートから取得した RGB をもとにステータスを判定（今後 color_statuses テーブルと連携予定）

---

## 6. 実務上の例外・運用リスク対応（落とし穴と対策）
- **変更・キャンセル処理:** CSV 内に既存の予約番号がある場合、キャンセルの場合は即時ベッド解放。変更の場合は「現在アサイン中のベッド」をベースに期間伸縮を試み、手動調整の崩壊を防ぐ。
- **オーバーブック（溢れ）アラート:** 突発的な故障や設定ミスでベッドが不足した場合、エラー落ちさせず「未アサイン（要手動調整リスト）」として管理画面最上部にポップアップ警告する。
- **ベッド移動指示 UI:** 連泊中にどうしてもベッド移動が発生するゲストをタイムラインに矢印表示し、当日のフロント・清掃タスクに自動リスト化して共有漏れを防ぐ。

---

## 7. 実実装フェーズ（マイルストーン）

**【方針変更】** 既存のディレクトリ構造を維持し、以下の順序で開発を進める：

1. **Phase 1: Google スプレッドシート連携強化**
   - シート ID・マッピング設定の UI 実装
   - 背景色に基づいたステータス自動判定の実装
   - データ双方向同期の確立

2. **Phase 2: 認証機能の拡充**
   - JWT 認証の完善
   - ロールベースアクセス制御（admin/staff）

3. **Phase 3: 自動アサイン機能**
   - CSV アップロード UI
   - アサインエンジンの最適化（男女別・連泊移動最小化・For2 対応）

4. **Phase 4: 清掃管理・おすすめ情報**
   - 清掃ステータス管理 UI
   - ゲスト向け QR コード生成

5. **Phase 5: 全体最適化・テスト**
   - エンドツーエンドテスト
   - パフォーマンスチューニング
