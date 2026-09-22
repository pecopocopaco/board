import { seededRandom, daySeed } from '../data/mockData.js';

// Market data is "reference information" per the project spec — this stays
// clearly labelled DEMO/参考情報 even after a real quote API is wired in,
// since Claude/this app is not providing financial advice.
export const MarketAdapter = {
  getQuotes() {
    const r = seededRandom(daySeed() + 5);
    const mk = (base, vol) => {
      const chg = (r() - 0.45) * vol;
      return { val: (base * (1 + chg / 100)).toFixed(base > 1000 ? 0 : 2), chg: chg.toFixed(2) };
    };
    return {
      demo: true,
      rows: [
        { name: 'NIKKEI 225', ...mk(38500, 1.4) },
        { name: 'NASDAQ', ...mk(17800, 1.8) },
        { name: 'S&P 500', ...mk(5600, 1.1) },
        { name: 'USD/JPY', ...mk(149, 0.6) },
        { name: 'BTC', ...mk(68000, 3.5) },
        { name: 'ETH', ...mk(3400, 4.2) }
      ]
    };
  }
};
