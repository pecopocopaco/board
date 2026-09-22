import { seededRandom, daySeed } from '../data/mockData.js';

// Deliberately visualization-only: this must never gain the ability to
// trigger, target, or interact with any real system.
export const CyberAdapter = {
  getOverview() {
    const r = seededRandom(daySeed() + 6);
    const level = ['LOW', 'GUARDED', 'ELEVATED'][Math.floor(r() * 3)];
    return { demo: true, level, active: Math.round(2 + r() * 8), incidents24h: Math.round(5 + r() * 40) };
  }
};
