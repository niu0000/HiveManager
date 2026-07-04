# 【コンテキスト保持用】宿泊管理システム（Dormitory Manager）システム開発マスター仕様書 v3.0

## 1. プログラム全体原則（最重要）
- 【単一責任・細分化の徹底】一つのファイルや関数にロジックを詰め込まない。修正・テストを容易にするため、サービス・API・バリデーションは機能単位で極小のモジュール（ファイル）に完全細分化する。
- 【ハードコードの完全排除】列位置、ベッド番号範囲、ステータスの背景色など、運用の変化に伴う設定値はすべて DB（UI 経由で変更可能）から動的に引き当てる。
- 【カプセルホテル仕様】一部屋がそのまま一ベッドとして機能するカプセルホテル形式を採用。部屋＝ベッドとして扱い、タイムライン形式で予約状況を可視化する。

---

## 2. アーキテクチャ & 技術スタック
- フロントエンド：React 18+, Vite, Tailwind CSS (レスポンシブ対応)
- バックエンド：FastAPI (Python 3.10+)
- データベース：SQLite (開発用) / PostgreSQL (本番用) + SQLAlchemy ORM
- 認証方式：JWT (JSON Web Tokens) による Role-based アクセス制御 (admin / staff)
- 外部連携：Google Sheets API v4 (セルの値・effectiveFormat.backgroundColor の双方向同期)
- セキュリティ：bcrypt (パスワードハッシュ化), CORS 制限，Rate Limiting (ログイン試行制限)
- **実行環境**: Docker は使用せず、ローカル環境で直接実行

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
- `rooms`: 部屋マスタ（name, room_type, attributes）- カプセルホテル仕様では部屋＝ベッドとして扱う
- `beds`: ベッドマスタ（room_id, bed_number, position）- 各部屋に 1 つのベッドが存在

### 4.2 reservations（予約・アサインデータ）
- ねっぱん CSV から取り込んだ予約情報全体
- `neppan_reservation_id` は現時点では未実装（必要に応じて追加）

### 4.3 assignments（ベッド割り当て）
- `reservation_id`, `bed_id`, `check_in_date`, `check_out_date`, `status`

### 4.7 bed_timelines（ベッドタイムライン表示用ビュー/クエリ）
- **カプセルホテル仕様対応**: 一部屋に一人の運用のため、ベッド単位でのタイムライン表示を標準とする
- 各ベッド（＝部屋）の予約状況を日付順に時系列表示
- フロントエンドでは横軸：日付、縦軸：ベッド番号（部屋番号）のマトリックス形式で可視化
- データベースからは `assignments` テーブルを `bed_id`, `check_in_date` でソートして取得
- ステータス別カラーリング（予約済、チェックイン済み、チェックアウト済み、清掃中、メンテナンス中）
- **タイムライン形式**: 各ベッドの予約状況を横長のタイムラインとして表示し、連泊状況や空き状況を直感的に把握可能

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

3. **Phase 3: 高度な自動アサイン機能**
   - CSV アップロード UI
   - **高度な自動アサインエンジン実装**:
     * **性別解析・男女別ベッド振り分け**:
       - ゲストの性別情報を多言語対応で解析（'male', 'm', '男' / 'female', 'f', '女'）
       - 部分一致・大文字小文字無視・trim 処理によるあいまいマッチ
       - 部屋の `gender_restriction` 属性に基づきフィルタリング
       - 男性専用・女性専用部屋への適切な割り当て
       - 専用部屋満室時の混合部屋へのフォールバック戦略
     * **連泊移動最小化アルゴリズム**:
       - 既存のアサイン情報をキャッシュし優先参照
       - 連泊中のゲストは同一ベッドを最優先（priority=0）で割り当て
       - チェックイン日順ソートによる効率的な割り当て
       - ゲストの移動負担と清掃コストの削減
     * **賢い上下段最適化（スマート階層アサイン）**:
       - 固定日数閾値ではなく、予約リスト内の連泊日数の分布を分析し、相対的に長い順にスコア化
       - スコアが高い（＝長い）宿泊者から順に下段ベッドを消費
       - 下段が満杯になった時点で、自動的に上段ベッドへの割り当てへ切り替え（フォールバック）
       - 高齢者・子供連れ・障害者フラグがある場合、連泊短めでも下段スコアにボーナス付与
       - チェックイン順序だけでなく、全体のバランスを見て最適な配置を決定
     * **手動確定・ロック機能**:
       - スタッフが特定のベッド（上段/下段）を指定し「確定（ロック）」可能
       - 手動確定された割り当ては、自動ア_assign エンジンによる上書きを防止（`is_locked=True`）
       - 延長予約が発生しても、ロック状態を維持し連続性を保証
       - 競合解決優先度：`手動確定 > 長期連泊 (スマート階層) > 通常予約` の順で厳格に優先
       - 誰が・いつ・どの理由でロックしたかを記録（監査証跡）
       - 管理者権限でのロック一括解除機能
     * **For2（ファミリールーム）対応**:
       - 大人 2 名以上の予約をファミリーと判定
       - ファミリーはルームタイプ（RoomType.ROOM）のみ割り当て可能
       - `capacity` 属性に基づき人数収容可能な部屋を優先
       - `is_for2` フラグを持つ部屋を特別優先
       - グループ予約の隣接ベッド配置ロジック
     * **競合解決・優先度スコアリングシステム**:
       - 複数予約が同一ベッドを競合した場合の解決ロジック
       - 連泊日数、予約時期、ゲストタイプに基づく重み付けスコアリング
       - 全体最適化のためのバックトラック（再割り当て）機能
     * **時間帯管理**:
       - 同日チェックイン/チェックアウトの重複処理
       - 早期チェックイン・遅延チェックアウト対応
     * **清掃・メンテナンス状態連携**:
       - UNAVAILABLE/IN_PROGRESS ステータスのベッド除外
       - メンテナンス中ベッドの自動フィルタリング
     * **説明可能性・監査証跡**:
       - アサイン理由の記録（デバッグ・スタッフ説明用）
       - アサインログの保存
     * **エッジケース処理**:
       - 1 泊予約と長期連泊のバランス調整
       - データ不整合のバリデーション
     * **設定の柔軟性**:
       - 性別判定ルール、ファミリー定義、優先度基準の DB 設定化
       - 部屋属性の動的設定
     * **パフォーマンス最適化**:
       - ベッド利用状況のメモリキャッシュ（bed_occupancy）
       - 部屋・ベッド情報の事前キャッシュ
       - 大量データ（1000 件以上）対応
       - キャッシュ無効化戦略
   - オーバーブック（溢れ）アラート機能
   - ベッド移動指示 UI（タイムライン表示・当日タスクリスト自動生成）

4. **Phase 4: 清掃管理・おすすめ情報**
   - 清掃ステータス管理 UI
   - ゲスト向け QR コード生成

5. **Phase 5: 全体最適化・テスト**
   - エンドツーエンドテスト
   - パフォーマンスチューニング

---

## 8. ローカル環境構築手順（Docker なし）

### 8.1 前提条件
- Python 3.10 以上
- Node.js 18 以上
- npm または yarn

### 8.2 バックエンドセットアップ

```bash
# backend ディレクトリに移動
cd backend

# 仮想環境作成（推奨）
python -m venv venv

# 仮想環境アクティベート
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 依存パッケージインストール
pip install -r requirements.txt

# 環境変数設定（.env ファイル作成）
cp .env.example .env
# .env ファイルを編集して必要な設定を記述

# データベース初期化
python init_db.py

# バックエンド起動
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 8.3 フロントエンドセットアップ

```bash
# frontend ディレクトリに移動
cd frontend

# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev
```

### 8.4 アプリケーションアクセス
- フロントエンド：http://localhost:5173
- バックエンド API：http://localhost:8000
- API ドキュメント：http://localhost:8000/docs

---

## 9. 配布方法

### 9.1 配布パッケージ作成

#### バックエンド
```bash
# backend ディレクトリで実行
# 依存パッケージの一覧出力
pip freeze > requirements.txt

# 配布用ディレクトリ作成
mkdir -p dist/backend
cp -r app dist/backend/
cp requirements.txt dist/backend/
cp init_db.py dist/backend/
cp .env.example dist/backend/

# ZIP パッケージ作成
cd dist
zip -r hive_manager_backend.zip backend/
```

#### フロントエンド
```bash
# frontend ディレクトリで実行
# 本番ビルド
npm run build

# 配布用ディレクトリ作成
mkdir -p dist/frontend
cp -r dist/* dist/frontend/
cp package.json dist/frontend/
cp README.md dist/frontend/

# ZIP パッケージ作成
cd dist
zip -r hive_manager_frontend.zip frontend/
```

### 9.2 配布マニュアル

#### ユーザー向けインストール手順

1. **事前準備**
   - Python 3.10 以上のインストール確認
   - Node.js 18 以上のインストール確認

2. **バックエンドのセットアップ**
   ```bash
   # 展開
   unzip hive_manager_backend.zip
   cd backend
   
   # 仮想環境作成
   python -m venv venv
   
   # 仮想環境アクティベート
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # 依存パッケージインストール
   pip install -r requirements.txt
   
   # 環境変数設定
   cp .env.example .env
   # .env ファイルを編集
   
   # データベース初期化
   python init_db.py
   
   # サーバー起動
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **フロントエンドのセットアップ**
   ```bash
   # 展開
   unzip hive_manager_frontend.zip
   cd frontend
   
   # 依存パッケージインストール
   npm install
   
   # 開発サーバー起動
   npm run dev
   ```

4. **動作確認**
   - ブラウザで http://localhost:5173 にアクセス
   - ログイン画面が表示されれば成功

### 9.3 更新手順

#### バックエンド更新
```bash
# 仮想環境アクティベート
source venv/bin/activate  # または venv\Scripts\activate

# 依存パッケージ更新
pip install -r requirements.txt --upgrade

# データベースマイグレーション（必要な場合）
python init_db.py

# サーバー再起動
# 一度 Ctrl+C で停止後、再度起動
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### フロントエンド更新
```bash
# 依存パッケージ更新
npm install

# 再ビルド
npm run build

# 開発サーバー再起動
# 一度 Ctrl+C で停止後、再度起動
npm run dev
```

### 9.4 トラブルシューティング

- **ポートが使用中**: ポート番号を変更（backend: 8000→8001, frontend: 5173→5174）
- **依存パッケージのエラー**: `pip cache purge` または `rm -rf node_modules && npm install`
- **データベースエラー**: `init_db.py` を再実行して DB を再初期化

---
