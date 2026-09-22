import { widgetShell } from '../components/Widget.js';
import { BusAdapter } from '../adapters/BusAdapter.js';

export const Bus = {
  id: 'bus', title: 'BUS', icon: '🚌', tabs: ['home', 'commute'], interval: 60000,
  render(el, w, settings) {
    const data = BusAdapter.getDepartures(settings.busStop);
    el.innerHTML = widgetShell(w, `
      <div class="r-sub" style="margin-bottom:8px;">停留所: ${data.stop}</div>
      ${data.rows.map((r) => `
        <div class="row">
          <div class="r-main">${r.dest}</div>
          <div style="text-align:right;">
            <div class="r-time" style="font-size:14px;">${r.mins} 分</div>
            <span class="chip ${r.status === 'NORMAL' ? 'normal' : 'warn'}" style="font-size:8.5px;">${r.status}</span>
          </div>
        </div>
      `).join('')}
    `, `<span class="badge demo">DEMO</span>`);
  }
};
