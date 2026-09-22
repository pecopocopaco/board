import { widgetShell } from '../components/Widget.js';
import { pad } from '../components/utils.js';
import { CalendarAdapter } from '../adapters/CalendarAdapter.js';

export const Calendar = {
  id: 'calendar', title: 'CALENDAR', icon: '📅', tabs: ['home'], interval: 1000,
  render(el, w) {
    const events = CalendarAdapter.getEvents();
    el.innerHTML = widgetShell(w, `
      <div class="countdown-label">次の予定まで</div>
      <div class="countdown" id="calCountdown">--:--:--</div>
      ${events.map((e) => `<div class="row"><div class="r-main">${e.title}</div><div class="r-time">${e.time}</div></div>`).join('') || '<div class="mini-empty">予定はありません</div>'}
      <div style="margin-top:10px; display:flex; gap:6px;">
        <input class="text-input" id="calNewTitle" placeholder="予定名" style="margin-top:0;">
        <input class="text-input" id="calNewTime" type="time" style="margin-top:0; max-width:110px;">
      </div>
      <button class="btn" id="calAddBtn" style="margin-top:8px; width:100%;">+ 予定を追加</button>
    `);
    el.querySelector('#calAddBtn').addEventListener('click', () => {
      const t = el.querySelector('#calNewTitle').value.trim();
      const tm = el.querySelector('#calNewTime').value;
      if (!t || !tm) return;
      CalendarAdapter.addEvent(tm, t);
      Calendar.render(el, w);
    });
    Calendar.update(el, w);
  },
  update(el) {
    const box = el.querySelector('#calCountdown'); if (!box) return;
    const events = CalendarAdapter.getEvents();
    const now = new Date();
    let next = null;
    for (const e of events) {
      const [h, m] = e.time.split(':').map(Number);
      const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      if (t > now) { next = t; break; }
    }
    if (!next) { box.textContent = '本日の予定なし'; return; }
    const diff = Math.floor((next - now) / 1000);
    box.textContent = `${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`;
  }
};
