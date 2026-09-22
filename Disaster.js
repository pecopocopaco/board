import { widgetShell } from '../components/Widget.js';
import { DisasterAdapter } from '../adapters/DisasterAdapter.js';

export const Disaster = {
  id: 'disaster', title: 'DISASTER ALERT', icon: '🚨', tabs: ['world'], interval: 60000,
  render(el, w) {
    const d = DisasterAdapter.getStatus();
    el.innerHTML = widgetShell(w, d.items.map((i) => `
      <div class="row"><div class="r-main">${i.type}</div><span class="chip ${i.level === 'NORMAL' ? 'normal' : i.level === 'WARNING' ? 'crit' : 'warn'}">${i.level}</span></div>
    `).join(''), `<span class="badge demo">DEMO</span>`);
  }
};
