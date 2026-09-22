import { requestNotificationPermission } from '../services/notifications.js';
import { resetSettings } from '../services/storage.js';

export function renderSettingsPanel(container, { widgets, settings, saveSettings, onChange }) {
  container.innerHTML = `
    <div class="widget" data-span="2" style="grid-column: 1 / -1;">
      <div class="widget-title" style="margin-bottom:14px;"><span class="ic">⚙</span>SETTINGS</div>

      <div class="settings-section">
        <h4>WIDGET ON / OFF ・ 並び替え</h4>
        <div id="widgetToggleList"></div>
      </div>

      <div class="settings-section">
        <h4>表示形式</h4>
        <div class="radio-group">
          <label><input type="radio" name="hourfmt" value="24" ${settings.hour24 ? 'checked' : ''}><span>24時間表示</span></label>
          <label><input type="radio" name="hourfmt" value="12" ${!settings.hour24 ? 'checked' : ''}><span>12時間表示</span></label>
        </div>
      </div>

      <div class="settings-section">
        <h4>バス停留所</h4>
        <input class="text-input" id="setBusStop" value="${settings.busStop}">
      </div>

      <div class="settings-section">
        <h4>ニュースカテゴリー</h4>
        <div id="newsCatToggles" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
      </div>

      <div class="settings-section">
        <h4>更新間隔（自動）</h4>
        <div class="mini-empty" style="text-align:left; padding:0;">CLOCK 1秒 / WEATHER 10分 / TRAIN・BUS 1分 / NEWS・TREND 5分 / EARTHQUAKE 1分 / MARKET 1分<br>バックグラウンド時は自動的に更新頻度を下げます。</div>
      </div>

      <div class="settings-section">
        <h4>通知</h4>
        <div class="toggle-row">
          <span class="r-main">地震・JR遅延・警報・重要ニュースの通知</span>
          <label class="switch"><input type="checkbox" id="setNotif" ${settings.notifications ? 'checked' : ''}><span class="slider"></span></label>
        </div>
      </div>

      <div class="settings-section">
        <h4>API 設定</h4>
        <div class="mini-empty" style="text-align:left; padding:0;">APIキーはこのフロントエンドに直接保存しません。実データ連携（要キー）はバックエンドProxy経由でAdapterを差し替えてください。天気・地震はキー不要の公開APIで実データ取得を試み、失敗時のみDEMOに自動フォールバックします。</div>
      </div>

      <button class="btn ghost" id="resetSettingsBtn" style="margin-top:6px;">設定をリセット</button>
    </div>
  `;

  const list = container.querySelector('#widgetToggleList');
  function paintList() {
    list.innerHTML = settings.widgetOrder.map((id) => {
      const w = widgets.find((x) => x.id === id); if (!w) return '';
      return `<div class="toggle-row" draggable="true" data-id="${id}">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="drag-handle">⋮⋮</span><span>${w.icon} ${w.title}</span>
        </div>
        <label class="switch"><input type="checkbox" data-toggle="${id}" ${settings.widgetOn[id] ? 'checked' : ''}><span class="slider"></span></label>
      </div>`;
    }).join('');
    list.querySelectorAll('input[data-toggle]').forEach((cb) => {
      cb.addEventListener('change', () => {
        settings.widgetOn[cb.dataset.toggle] = cb.checked;
        saveSettings();
        onChange();
      });
    });
    let dragId = null;
    list.querySelectorAll('.toggle-row').forEach((row) => {
      row.addEventListener('dragstart', () => { dragId = row.dataset.id; row.classList.add('dragging'); });
      row.addEventListener('dragend', () => row.classList.remove('dragging'));
      row.addEventListener('dragover', (e) => e.preventDefault());
      row.addEventListener('drop', () => {
        if (!dragId || dragId === row.dataset.id) return;
        const order = settings.widgetOrder;
        const from = order.indexOf(dragId), to = order.indexOf(row.dataset.id);
        order.splice(from, 1); order.splice(to, 0, dragId);
        saveSettings(); paintList(); onChange();
      });
    });
  }
  paintList();

  container.querySelectorAll('input[name="hourfmt"]').forEach((r) => {
    r.addEventListener('change', (e) => { settings.hour24 = e.target.value === '24'; saveSettings(); });
  });
  container.querySelector('#setBusStop').addEventListener('change', (e) => {
    settings.busStop = e.target.value.trim() || settings.busStop; saveSettings();
  });

  const allCats = ['JAPAN', 'WORLD', 'TECH', 'AI', 'ECONOMY', 'SPORTS', 'LOCAL'];
  const catBox = container.querySelector('#newsCatToggles');
  catBox.innerHTML = allCats.map((c) =>
    `<label class="chip ${settings.newsCategories.includes(c) ? 'normal' : ''}" style="cursor:pointer;"><input type="checkbox" data-cat="${c}" ${settings.newsCategories.includes(c) ? 'checked' : ''} style="display:none;">${c}</label>`
  ).join('');
  catBox.querySelectorAll('input[data-cat]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const c = cb.dataset.cat;
      if (cb.checked) { if (!settings.newsCategories.includes(c)) settings.newsCategories.push(c); }
      else { settings.newsCategories = settings.newsCategories.filter((x) => x !== c); }
      saveSettings();
      cb.parentElement.classList.toggle('normal', cb.checked);
    });
  });

  container.querySelector('#setNotif').addEventListener('change', async (e) => {
    if (e.target.checked) {
      settings.notifications = await requestNotificationPermission();
      e.target.checked = settings.notifications;
    } else {
      settings.notifications = false;
    }
    saveSettings();
  });

  container.querySelector('#resetSettingsBtn').addEventListener('click', () => {
    if (confirm('すべての設定を初期化しますか？')) {
      const fresh = resetSettings();
      Object.assign(settings, fresh);
      settings.widgetOn = Object.fromEntries(widgets.map((w) => [w.id, true]));
      settings.widgetOrder = widgets.map((w) => w.id);
      saveSettings();
      onChange('home');
    }
  });
}
