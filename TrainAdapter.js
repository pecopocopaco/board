import { seededRandom, daySeed } from '../data/mockData.js';

function pad(n) { return String(n).padStart(2, '0'); }

// Swap this function's body for a real transit/ODPT-style API call when one
// is available; getDepartures() is the only method the UI depends on.
export const TrainAdapter = {
  getDepartures() {
    const now = new Date();
    const mk = (base) => Array.from({ length: 4 }, (_, i) => {
      const t = new Date(now.getTime() + (base + i * 16) * 60000);
      return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
    });
    const r = seededRandom(daySeed());
    return {
      demo: true,
      lines: [
        { name: '仙山線', from: '仙台', to: '北仙台', times: mk(4), status: 'NORMAL' },
        { name: '東北本線', from: '仙台', to: '長町', times: mk(7), status: 'NORMAL' },
        { name: '仙石線', from: 'あおば通', to: '陸前原ノ町', times: mk(2), status: r() > 0.85 ? 'WARNING' : 'NORMAL' }
      ]
    };
  }
};
