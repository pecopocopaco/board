import { seededRandom, daySeed, X_TREND_POOL, INTERNET_TREND_POOL } from '../data/mockData.js';

export const TrendAdapter = {
  getXTrends() {
    const r = seededRandom(daySeed() + 1);
    return { demo: true, items: [...X_TREND_POOL].sort(() => r() - 0.5).slice(0, 5) };
  },
  getInternetTrends() {
    const r = seededRandom(daySeed() + 2);
    return { demo: true, items: [...INTERNET_TREND_POOL].sort(() => r() - 0.5).slice(0, 5) };
  }
};
