import { seededRandom, daySeed } from '../data/mockData.js';

export const BusAdapter = {
  getDepartures(stopName) {
    const r = seededRandom(daySeed() + stopName.length);
    const dests = ['八木山動物公園', '荒井駅', 'るーぷる仙台', '長町南駅'];
    return {
      demo: true,
      stop: stopName,
      rows: Array.from({ length: 4 }, (_, i) => ({
        dest: dests[i % dests.length],
        mins: Math.round(3 + i * 7 + r() * 4),
        status: r() > 0.9 ? 'WARNING' : 'NORMAL'
      }))
    };
  }
};
