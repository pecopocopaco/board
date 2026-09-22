import { widgetShell } from '../components/Widget.js';
import { SunMoonAdapter } from '../adapters/SunMoonAdapter.js';

export const SunMoon = {
  id: 'sunMoon', title: 'SUN & MOON', icon: '🌙', tabs: ['home', 'world'], interval: 60000,
  render(el, w) {
    const { sunrise, sunset, moon } = SunMoonAdapter.getTodayData();
    const fmtT = (d) => d ? new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' }).format(d) : '--:--';
    el.innerHTML = widgetShell(w, `
      <div class="weather-grid" style="grid-template-columns:repeat(2,1fr);">
        <div class="wg-item"><div class="v">${fmtT(sunrise)}</div><div class="l">日の出</div></div>
        <div class="wg-item"><div class="v">${fmtT(sunset)}</div><div class="l">日の入り</div></div>
      </div>
      <div style="text-align:center; margin-top:14px;">
        <div style="font-size:34px;">${moon.icon}</div>
        <div class="r-sub" style="margin-top:4px;">${moon.name}</div>
      </div>
    `, `<span class="badge live">LIVE</span>`);
  }
};
