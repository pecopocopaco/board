# SENDAI LIVE COMMAND CENTER

仙台の今を一画面で把握できる、SF管制室風のリアルタイム個人ダッシュボード。
Vanilla JS (ES Modules) + Vite。ビルド不要でも `index.html` を直接開くだけで動作します。

## 1. 起動方法

### そのまま開く（ビルド不要）
このプロジェクトはビルドしなくても動くように作られています。
`index.html` をブラウザで直接開く（またはお好みの静的サーバーで配信する）だけで動作します。

```bash
# 例: Pythonの簡易サーバーで配信する場合
cd sendai-live-command-center
python3 -m http.server 8080
# → http://localhost:8080 を開く
```

`file://` で直接開いた場合、Service Worker（オフラインキャッシュ）は登録されませんが、
アプリ本体（各ウィジェット）は問題なく動作します。

### Vite開発サーバーを使う場合

```bash
npm install
npm run dev       # http://localhost:5173 が自動で開きます
npm run build      # dist/ に本番ビルドを出力
npm run preview    # ビルド結果をローカルで確認
```

## 2. ファイル構成

```
sendai-live-command-center/
├── index.html                 # アプリシェル（DOM骨格・CSS/JS読み込み）
├── package.json
├── vite.config.js
├── README.md
├── public/
│   ├── manifest.json          # PWA マニフェスト
│   ├── sw.js                  # Service Worker（アプリシェルのオフラインキャッシュ）
│   └── icons/                 # ホーム画面アイコン (192/512/apple-touch)
└── src/
    ├── main.js                 # 起動処理・ウィジェットレジストリ・レンダーループ
    ├── styles/
    │   ├── base.css             # リセット・カラー変数・背景演出
    │   ├── dashboard.css         # ヘッダー・アラートバー・タブ・レイアウト
    │   └── widgets.css           # ウィジェットカード＆個別UIスタイル
    ├── components/
    │   ├── Header.js             # 時計・日付・オンライン状態
    │   ├── Navigation.js         # タブバー
    │   ├── Alert.js              # 上部アラートバー（地震/防災/JR/バスを集約）
    │   ├── Settings.js           # 設定画面（ON/OFF・並び替え・各種設定）
    │   ├── SearchPalette.js      # 検索 / コマンドパレット（⌘K）
    │   ├── Widget.js             # ウィジェット共通シェル
    │   └── utils.js              # 日付・チャートSVGなど共通ユーティリティ
    ├── widgets/                  # 20ウィジェット（1機能=1ファイル）
    │   ├── Clock.js  Weather.js  Calendar.js  Train.js  Bus.js  Traffic.js
    │   ├── News.js  AISummary.js  XTrend.js  InternetTrend.js
    │   ├── Earthquake.js  Disaster.js  Cyber.js  LiveWorld.js  Market.js
    │   └── WorldClock.js  SunMoon.js  Today.js  AIBrief.js  PersonalStatus.js
    ├── adapters/                  # データソース抽象化層（本体の心臓部）
    │   ├── WeatherAdapter.js      # 実API試行(Open-Meteo, キー不要) → 失敗時DEMO
    │   ├── EarthquakeAdapter.js   # 実API試行(P2P地震情報, キー不要) → 失敗時DEMO
    │   ├── SunMoonAdapter.js      # 完全ローカル計算（常にLIVE、通信不要）
    │   ├── TrainAdapter.js  BusAdapter.js  TrafficAdapter.js
    │   ├── NewsAdapter.js  TrendAdapter.js  MarketAdapter.js
    │   ├── DisasterAdapter.js  CyberAdapter.js  TodayAdapter.js
    │   ├── CalendarAdapter.js       # localStorage（将来Googleカレンダー等に差替可）
    │   └── PersonalStatusAdapter.js # localStorage（将来Apple Health等に差替可）
    ├── services/
    │   ├── api.js            # タイムアウト付きfetchヘルパー
    │   ├── storage.js        # localStorageラッパー・設定モデル
    │   ├── notifications.js  # Notification API ラッパー
    │   └── scheduler.js      # ウィジェット別自動更新（バックグラウンド時は間引き）
    └── data/
        └── mockData.js        # DEMOデータの種・サンプルプール
```

**UIはAdapterが返す標準データしか見ません。** 例えば `WeatherAdapter.getCurrentWeather()`
の中身を実APIに差し替えても、`widgets/Weather.js` 側は一切変更不要です。

## 3. API設定方法

| ウィジェット | 現在の状態 | 実データ化する方法 |
|---|---|---|
| WEATHER | Open-Meteo（キー不要）に実際に接続を試み、失敗時のみDEMOにフォールバック | そのまま動作。パラメータ変更は `src/adapters/WeatherAdapter.js` |
| EARTHQUAKE | P2P地震情報API（キー不要）に接続を試み、失敗時のみDEMOにフォールバック | そのまま動作。`src/adapters/EarthquakeAdapter.js` |
| SUN & MOON / WORLD CLOCK / CLOCK | 常に実データ（計算のみ、通信不要） | 変更不要 |
| JR / BUS / NEWS / TREND / MARKET / TRAFFIC / DISASTER / CYBER | DEMOモード（モックデータ） | 各 `src/adapters/*.js` の関数本体を実APIのfetch呼び出しに差し替える |
| AI BRIEF / AI SUMMARY | テンプレート要約（DEMO） | `src/widgets/AIBrief.js` / `AISummary.js` の生成処理をAnthropic APIなどの要約呼び出しに差し替える |

**重要（セキュリティ）**: APIキーが必要なサービス（証券データAPI・X API・ニュースAPIなど）は、
**絶対にフロントエンドへ直書きしないでください**。`.env` にキーを置き、Cloudflare Workers /
Vercel Functions / 自前サーバーなどの**バックエンドProxy**を1本立てて、フロントエンドは
そのProxyのURLだけを叩く構成にしてください（`src/services/api.js` の `fetchJSON` はそのまま
Proxy呼び出しにも使えます）。

## 4. Cloudへのデプロイ方法

このアプリは静的ファイルのみなので、どの静的ホスティングでも動きます。

**Vercel / Netlify / Cloudflare Pages（推奨）**
```bash
npm run build
# dist/ フォルダをそのままデプロイ
```
- Build command: `npm run build`
- Output directory: `dist`

**GitHub Pages**
```bash
npm run build
# dist/ の中身を gh-pages ブランチ、または /docs フォルダに配置
```

APIキーを使う機能を追加した場合は、上記いずれのプラットフォームでも「Environment
Variables」機能でキーを登録し、サーバーレス関数（Vercel Functions / Cloudflare Workers等）
経由でフロントエンドに公開しないようにしてください。

## 5. 今後追加できる機能

- 実APIへの本格差し替え（気象庁防災情報XML、ODPT交通API、NewsAPI、X API、取引所APIなど）
- AI要約・AIブリーフをAnthropic API等の実LLM呼び出しに変更（バックエンドProxy経由）
- Googleカレンダー連携（`CalendarAdapter`をGoogle Calendar APIに差替）
- Apple Health / Health Connect連携（`PersonalStatusAdapter`を差替）
- Service Workerでのプッシュ通知（現状はフォアグラウンドNotification APIのみ）
- TypeScript化（型安全性の強化）
- IndexedDBへの移行（localStorageの容量制限が気になる場合）
- 複数ダッシュボードレイアウトのプリセット保存・共有
