import { widgetShell } from '../components/Widget.js';

export const WorldClock = {
  id: 'worldClock', title: 'WORLD CLOCK', icon: '🕓', tabs: ['world'], interval: 1000,
  render(el, w, settings, saveSettings) {
    el.innerHTML = widgetShell(w, `
      <div id="worldClockRows"></div>
      <div style="display:flex; gap:6px; margin-top:8px;">
        <input class="text-input" id="wcNewCity" placeholder="都市名 (例: PARIS)" style="margin-top:0;">
        <input class="text-input" id="wcNewTz" placeholder="Europe/Paris" style="margin-top:0;">
      </div>
      <button class="btn" id="wcAddBtn" style="margin-top:8px; width:100%;">+ 都市を追加</button>
    `);
    WorldClock.update(el, w, settings);
    el.querySelector('#wcAddBtn').addEventListener('click', () => {
      const city = el.querySelector('#wcNewCity').value.trim();
      const tz = el.querySelector('#wcNewTz').value.trim();
      if (!city || !tz) return;
      try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); } catch (e) { alert('無効なタイムゾーンです'); return; }
      settings.worldCities.push(`${tz}|${city.toUpperCase()}`);
      saveSettings();
      WorldClock.update(el, w, settings);
      el.querySelector('#wcNewCity').value = '';
      el.querySelector('#wcNewTz').value = '';
    });
  },
  update(el, w, settings) {
    const box = el.querySelector('#worldClockRows'); if (!box) return;
    const now = new Date();
    box.innerHTML = settings.worldCities.map((entry) => {
      const [tz, label] = entry.split('|');
      let timeStr = '--:--';
      try {
        timeStr = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: !settings.hour24 }).format(now);
      } catch (e) { /* invalid stored tz — skip */ }
      return `<div class="row"><div class="r-main">${label}</div><div class="r-time" style="font-size:16px;">${timeStr}</div></div>`;
    }).join('');
  }
};
