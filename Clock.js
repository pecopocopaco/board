import { widgetShell } from '../components/Widget.js';
import { fmtClock, fmtDate, WEEKDAYS_EN } from '../components/utils.js';

export const Clock = {
  id: 'clock', title: 'CLOCK', icon: '🕐', tabs: ['home'], interval: 1000,
  render(el, w, settings) {
    el.innerHTML = widgetShell(w, `
      <div class="big-clock" id="bigClock">--:--:--</div>
      <div class="big-clock-sub" id="bigClockSub">-- --.--.--</div>
    `);
    Clock.update(el, w, settings);
  },
  update(el, w, settings) {
    const d = new Date();
    const c = el.querySelector('#bigClock'); if (c) c.textContent = fmtClock(d, settings.hour24);
    const s = el.querySelector('#bigClockSub'); if (s) s.textContent = `${WEEKDAYS_EN[d.getDay()]}   ${fmtDate(d)}`;
  }
};
