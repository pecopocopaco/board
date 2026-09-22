import { widgetShell } from '../components/Widget.js';
import { TrafficAdapter } from '../adapters/TrafficAdapter.js';

export const Traffic = {
  id: 'traffic', title: 'TRAFFIC', icon: '🛣', tabs: ['commute'], interval: 120000,
  render(el, w) {
    const data = TrafficAdapter.getRoutes();
    el.innerHTML = widgetShell(w, data.routes.map((r) => `
      <div class="row">
        <div class="r-main">${r.from} → ${r.to}</div>
        <div style="text-align:right;">
          <div class="r-time" style="font-size:14px;">${r.mins} MIN</div>
          <span class="chip ${r.status === 'NORMAL' ? 'normal' : r.status === 'CRITICAL' ? 'crit' : 'warn'}" style="font-size:8.5px;">${r.status}</span>
        </div>
      </div>
    `).join(''), `<span class="badge demo">DEMO</span>`);
  }
};
