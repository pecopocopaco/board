import { widgetShell } from '../components/Widget.js';
import { timeAgo } from '../components/utils.js';
import { EarthquakeAdapter } from '../adapters/EarthquakeAdapter.js';

export const Earthquake = {
  id: 'earthquake', title: 'EARTHQUAKE', icon: '⚠', tabs: ['home', 'world'], interval: 60000,
  async render(el, w) {
    const q = await EarthquakeAdapter.getLatestEarthquake();
    const crit = Number(q.mag) >= 5.5;
    el.innerHTML = widgetShell(w, `
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="font-family:var(--font-mono); font-size:30px; color:${crit ? 'var(--red)' : 'var(--amber)'};">M${q.mag}</div>
        <div>
          <div class="r-main">最大震度 ${q.scale}</div>
          <div class="r-sub">${q.place} ・ 深さ${q.depth}km</div>
        </div>
      </div>
      <div style="margin-top:8px; font-family:var(--font-mono); font-size:11px; color:var(--text-faint);">${timeAgo(q.minsAgo * 60)}</div>
    `, `<span class="badge ${q.demo ? 'demo' : 'live'}">${q.demo ? 'DEMO' : 'LIVE'}</span>`);
  }
};
