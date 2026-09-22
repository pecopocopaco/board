import { widgetShell } from '../components/Widget.js';
import { PersonalStatusAdapter } from '../adapters/PersonalStatusAdapter.js';

export const PersonalStatus = {
  id: 'personalStatus', title: 'MY STATUS', icon: '👤', tabs: ['home'], interval: 0,
  render(el, w) {
    const v = PersonalStatusAdapter.getStatus();
    el.innerHTML = widgetShell(w, `
      <div class="weather-grid" style="grid-template-columns:repeat(2,1fr);">
        <div class="wg-item"><div class="v">${v.weight || '--'}</div><div class="l">体重 (kg)</div></div>
        <div class="wg-item"><div class="v">${v.steps || '--'}</div><div class="l">歩数</div></div>
        <div class="wg-item"><div class="v">${v.exercise || '--'}</div><div class="l">運動 (分)</div></div>
        <div class="wg-item"><div class="v">${v.sleep || '--'}</div><div class="l">睡眠</div></div>
      </div>
      <div class="mini-empty" style="text-align:left; padding:8px 0 0;">入力した値のみ端末に保存されます（外部送信なし）。</div>
      <div class="status-input-row" style="margin-top:8px;">
        <input class="text-input" id="psWeight" placeholder="体重" value="${v.weight || ''}">
        <input class="text-input" id="psSteps" placeholder="歩数" value="${v.steps || ''}">
      </div>
      <div class="status-input-row" style="margin-top:8px;">
        <input class="text-input" id="psExercise" placeholder="運動(分)" value="${v.exercise || ''}">
        <input class="text-input" id="psSleep" placeholder="睡眠(例 7h12m)" value="${v.sleep || ''}">
      </div>
      <button class="btn" id="psSave" style="margin-top:8px; width:100%;">保存</button>
    `);
    el.querySelector('#psSave').addEventListener('click', () => {
      PersonalStatusAdapter.saveStatus({
        weight: el.querySelector('#psWeight').value.trim(),
        steps: el.querySelector('#psSteps').value.trim(),
        exercise: el.querySelector('#psExercise').value.trim(),
        sleep: el.querySelector('#psSleep').value.trim()
      });
      PersonalStatus.render(el, w);
    });
  }
};
