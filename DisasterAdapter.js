import { seededRandom, daySeed } from '../data/mockData.js';

export const DisasterAdapter = {
  getStatus() {
    const r = seededRandom(daySeed() + 4);
    const level = r() > 0.93 ? 'WARNING' : r() > 0.8 ? 'WATCH' : 'NORMAL';
    return {
      demo: true,
      level,
      items: [
        { type: '大雨', level: level === 'WARNING' ? 'WATCH' : 'NORMAL' },
        { type: '津波', level: 'NORMAL' },
        { type: '台風', level: 'NORMAL' }
      ]
    };
  }
};
