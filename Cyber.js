import { widgetShell } from '../components/Widget.js';
import { CyberAdapter } from '../adapters/CyberAdapter.js';

export const Cyber = {
  id: 'cyber', title: 'CYBER MONITOR', icon: '🛡', tabs: ['world'], interval: 120000,
  render(el, w) {
    const c = CyberAdapter.getOverview();
    el.innerHTML = widgetShell(w, `
      <div class="row"><div class="r-main">THREAT LEVEL</div><span class="chip ${c.level === 'LOW' ? 'normal' : c.level === 'ELEVATED' ? 'crit' : 'warn'}">${c.level}</span></div>
      <div class="row"><div class="r-main">ACTIVE EVENTS</div><div class="r-time" style="font-size:15px;">${c.active}</div></div>
      <div class="row"><div class="r-main">INCIDENTS (24H)</div><div class="r-time" style="font-size:15px;">${c.incidents24h}</div></div>
      <div class="mini-empty" style="text-align:left; padding:6px 0 0;">公開情報の可視化のみ。攻撃の実行・対象操作は行いません。</div>
    `, `<span class="badge demo">DEMO MODE</span>`);
  }
};
