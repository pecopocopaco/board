import { widgetShell } from '../components/Widget.js';
import { chartSvg } from '../components/utils.js';
import { MarketAdapter } from '../adapters/MarketAdapter.js';

export const Market = {
  id: 'market', title: 'MARKET', icon: '📈', tabs: ['market'], interval: 60000, span: 2,
  render(el, w) {
    const m = MarketAdapter.getQuotes();
    el.innerHTML = widgetShell(w, `
      <div class="mini-empty" style="text-align:left; padding:0 0 8px;">※ 参考情報です。投資判断は自己責任で行ってください。</div>
      ${m.rows.map((r, i) => `
        <div class="market-row">
          <div class="market-name">${r.name}</div>
          ${chartSvg(i, Number(r.chg) >= 0)}
          <div style="text-align:right;">
            <div class="market-val">${r.val}</div>
            <div class="market-chg ${Number(r.chg) >= 0 ? 'up' : 'down'}" style="font-family:var(--font-mono); font-size:11px;">${Number(r.chg) >= 0 ? '+' : ''}${r.chg}%</div>
          </div>
        </div>
      `).join('')}
    `, `<span class="badge demo">参考情報</span>`);
  }
};
