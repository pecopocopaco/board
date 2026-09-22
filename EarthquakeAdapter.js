import { fetchJSON } from '../services/api.js';
import { seededRandom, daySeed, EQ_PLACES } from '../data/mockData.js';

function mockEarthquake() {
  const r = seededRandom(daySeed() + 3);
  const mag = (2.5 + r() * 3).toFixed(1);
  const scale = mag > 5.5 ? '5弱' : mag > 4.5 ? '4' : mag > 3.5 ? '3' : '2';
  return {
    demo: true, mag, scale, place: EQ_PLACES[Math.floor(r() * EQ_PLACES.length)],
    minsAgo: Math.round(4 + r() * 180), depth: Math.round(10 + r() * 60)
  };
}

const SCALE_MAP = { 10: '1', 20: '2', 30: '3', 40: '4', 45: '5弱', 50: '5強', 55: '6弱', 60: '6強', 70: '7' };

// Real call — P2P地震情報 (https://www.p2pquake.net/) public, key-less JSON API.
async function realEarthquake() {
  const data = await fetchJSON('https://api.p2pquake.net/v2/history?codes=551&limit=1');
  const item = data[0]?.earthquake;
  if (!item) throw new Error('no data');
  const minsAgo = Math.round((Date.now() - new Date(item.time.replace(/\//g, '-')).getTime()) / 60000);
  return {
    demo: false, mag: item.hypocenter.magnitude, scale: SCALE_MAP[item.maxScale] ?? '-',
    place: item.hypocenter.name, minsAgo: Math.max(0, minsAgo), depth: item.hypocenter.depth
  };
}

export const EarthquakeAdapter = {
  async getLatestEarthquake() {
    try {
      return await realEarthquake();
    } catch (e) {
      return mockEarthquake();
    }
  }
};
