import { widgetShell } from '../components/Widget.js';
import { TodayAdapter } from '../adapters/TodayAdapter.js';

export const Today = {
  id: 'today', title: 'TODAY', icon: '📖', tabs: ['home'], interval: 0,
  render(el, w) {
    const t = TodayAdapter.getNote();
    el.innerHTML = widgetShell(w, `<div class="ai-brief-box">${t.note}</div>`, `<span class="badge demo">DEMO</span>`);
  }
};
