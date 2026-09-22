import { widgetShell } from '../components/Widget.js';
import { TrainAdapter } from '../adapters/TrainAdapter.js';

export const Train = {
  id: 'jr', title: 'JR TRAIN', icon: '🚆', tabs: ['home', 'commute'], interval: 60000,
  render(el, w) {
    const data = TrainAdapter.getDepartures();
    el.innerHTML = widgetShell(w, data.lines.map((l) => `
      <div class="row" style="display:block;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="r-main">${l.name}<span class="r-sub"> ${l.from} → ${l.to}</span></div>
          <span class="chip ${l.status === 'NORMAL' ? 'normal' : 'warn'}">${l.status}</span>
        </div>
        <div style="display:flex; gap:12px; margin-top:6px;">${l.times.map((t) => `<span class="r-time" style="font-size:13px;">${t}</span>`).join('')}</div>
      </div>
    `).join(''), `<span class="badge demo">DEMO</span>`);
  }
};
