import { seededRandom, daySeed } from '../data/mockData.js';

export const TrafficAdapter = {
  getRoutes() {
    const r = seededRandom(daySeed());
    return {
      demo: true,
      routes: [
        { from: '仙台駅', to: '北仙台', mins: Math.round(14 + r() * 10), status: r() > 0.85 ? 'WARNING' : 'NORMAL' },
        { from: '仙台駅', to: '長町', mins: Math.round(12 + r() * 8), status: 'NORMAL' },
        { from: '仙台南IC', to: '仙台宮城IC', mins: Math.round(9 + r() * 6), status: r() > 0.92 ? 'CRITICAL' : 'NORMAL' }
      ]
    };
  }
};
