import { seededRandom, daySeed, NEWS_SAMPLES } from '../data/mockData.js';

let cache = null;

// Swap getLatestNews() for a real RSS-to-JSON or news API call (through a
// backend proxy if it needs a key). Cached per session so all widgets that
// read news (News, AI Brief, AI Summary) see the same headlines.
export const NewsAdapter = {
  getLatestNews() {
    if (cache) return cache;
    const r = seededRandom(daySeed());
    const sources = ['NHK', '河北新報', '日経', 'Reuters', '時事通信'];
    cache = {
      demo: true,
      items: NEWS_SAMPLES.map((n, i) => ({
        title: n.title,
        cat: n.cat,
        source: sources[i % sources.length],
        minsAgo: Math.round(5 + r() * 300)
      }))
    };
    return cache;
  }
};
