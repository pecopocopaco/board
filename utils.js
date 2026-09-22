export const pad = (n) => String(n).padStart(2, '0');
export const WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];

export function fmtClock(d, h24) {
  let h = d.getHours();
  if (!h24) { h = h % 12; if (h === 0) h = 12; }
  return `${pad(h)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function fmtDate(d) {
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function timeAgo(sec) {
  if (sec < 60) return `${sec} SEC AGO`;
  if (sec < 3600) return `${Math.floor(sec / 60)} MIN AGO`;
  return `${Math.floor(sec / 3600)} HR AGO`;
}

import { seededRandom, daySeed } from '../data/mockData.js';
export function chartSvg(seedOffset, up) {
  const r = seededRandom(daySeed() + seedOffset);
  const pts = Array.from({ length: 12 }, () => 10 + r() * 16);
  const max = Math.max(...pts), min = Math.min(...pts);
  const norm = pts.map((p, i) => {
    const x = i * (70 / 11);
    const y = 26 - ((p - min) / (max - min || 1)) * 24;
    return `${x},${y}`;
  });
  return `<svg class="mini-chart" viewBox="0 0 70 26" preserveAspectRatio="none"><polyline points="${norm.join(' ')}" fill="none" stroke="${up ? 'var(--green)' : 'var(--red)'}" stroke-width="1.6"/></svg>`;
}
