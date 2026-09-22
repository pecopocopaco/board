// Deterministic-per-day pseudo-random generator so DEMO data stays stable
// across a single day's page reloads but changes day to day, rather than
// jumping around on every render.

export function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function daySeed(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return Number(`${d.getFullYear()}${d.getMonth()}${d.getDate()}`);
}

export const NEWS_SAMPLES = [
  { title: '仙台市が新しい防災アプリの実証実験を開始', cat: 'LOCAL' },
  { title: '国内の半導体投資が過去最高を更新', cat: 'ECONOMY' },
  { title: '大手企業が新型AIモデルを発表', cat: 'AI' },
  { title: '東北地方で紅葉が見頃に', cat: 'LOCAL' },
  { title: '為替市場、円相場が小幅変動', cat: 'ECONOMY' },
  { title: 'プロ野球ペナントレースが佳境に', cat: 'SPORTS' },
  { title: '新幹線ダイヤに一部変更の見込み', cat: 'JAPAN' },
  { title: '再生可能エネルギー導入が加速', cat: 'WORLD' },
  { title: '仙台空港で新規路線の就航検討', cat: 'LOCAL' },
  { title: '国際会議が来月仙台で開催予定', cat: 'WORLD' }
];

export const X_TREND_POOL = [
  'AI', '仙台', 'iPhone', 'ChatGPT', 'JR東日本', '楽天イーグルス',
  '台風情報', '新商品', '為替', '大谷翔平', '七夕まつり', '牛タン'
];

export const INTERNET_TREND_POOL = [
  '話題の新作ゲーム', '急上昇の動画クリップ', '注目の新製品レビュー', 'バズった投稿', '人気急上昇の楽曲'
];

export const EQ_PLACES = ['宮城県沖', '福島県沖', '岩手県内陸南部', '山形県置賜地方', '宮城県北部'];

export const TODAY_NOTES = [
  '国際平和デー関連の話題', '七夕伝説にまつわる日', 'ラジオ放送記念日に近い時期', '秋分に近い季節の変わり目'
];
