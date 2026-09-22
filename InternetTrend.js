import { widgetShell } from '../components/Widget.js';
import { TrendAdapter } from '../adapters/TrendAdapter.js';

export const InternetTrend = {
  id: 'internetTrend', title: 'INTERNET TREND', icon: '🌐', tabs: ['news'], interval: 300000,
  render(el, w) {
    const data = TrendAdapter.getInternetTrends();
    el.innerHTML = widgetShell(w, `
      <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-faint); letter-spacing:1.5px; margin-bottom:6px;">TOP TRENDING</div>
      ${data.items.map((t, i) => `<div class="trend-item"><span class="trend-rank">${i + 1}</span><span class="trend-name">${t}</span></div>`).join('')}
    `, `<span class="badge demo">DEMO</span>`);
  }
};
