import { loadSettings, saveSettings as persistSettings } from './services/storage.js';
import { scheduleWidget, clearAllScheduled } from './services/scheduler.js';
import { startHeader, startOnlineStatus, markUpdated } from './components/Header.js';
import { renderTabs } from './components/Navigation.js';
import { renderAlertBar } from './components/Alert.js';
import { initSearchAndPalette } from './components/SearchPalette.js';
import { renderSettingsPanel } from './components/Settings.js';

import { Clock } from './widgets/Clock.js';
import { Weather } from './widgets/Weather.js';
import { Calendar } from './widgets/Calendar.js';
import { Train } from './widgets/Train.js';
import { Bus } from './widgets/Bus.js';
import { Traffic } from './widgets/Traffic.js';
import { News } from './widgets/News.js';
import { AISummary } from './widgets/AISummary.js';
import { XTrend } from './widgets/XTrend.js';
import { InternetTrend } from './widgets/InternetTrend.js';
import { Earthquake } from './widgets/Earthquake.js';
import { Disaster } from './widgets/Disaster.js';
import { Cyber } from './widgets/Cyber.js';
import { LiveWorld } from './widgets/LiveWorld.js';
import { Market } from './widgets/Market.js';
import { WorldClock } from './widgets/WorldClock.js';
import { SunMoon } from './widgets/SunMoon.js';
import { Today } from './widgets/Today.js';
import { AIBrief } from './widgets/AIBrief.js';
import { PersonalStatus } from './widgets/PersonalStatus.js';

const WIDGETS = [
  Clock, Weather, Calendar, Train, Bus, Traffic, News, AISummary, XTrend,
  InternetTrend, Earthquake, Disaster, Cyber, LiveWorld, Market, WorldClock,
  SunMoon, Today, AIBrief, PersonalStatus
];

let settings = loadSettings();
function saveSettings() { persistSettings(settings); }

if (!settings.widgetOn) settings.widgetOn = Object.fromEntries(WIDGETS.map((w) => [w.id, true]));
if (!settings.widgetOrder) settings.widgetOrder = WIDGETS.map((w) => w.id);
WIDGETS.forEach((w) => {
  if (!(w.id in settings.widgetOn)) settings.widgetOn[w.id] = true;
  if (!settings.widgetOrder.includes(w.id)) settings.widgetOrder.push(w.id);
});
saveSettings();

let currentTab = 'home';

function enableWidgetDrag(el, id) {
  if (!el.querySelector('.drag-handle')) return;
  el.setAttribute('draggable', 'true');
  el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', id); el.classList.add('dragging'); });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));
  el.addEventListener('dragover', (e) => e.preventDefault());
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData('text/plain');
    if (!dragId || dragId === id) return;
    const order = settings.widgetOrder;
    const from = order.indexOf(dragId), to = order.indexOf(id);
    order.splice(from, 1); order.splice(to, 0, dragId);
    saveSettings(); renderApp();
  });
}

function renderApp(forceTab) {
  if (forceTab) currentTab = forceTab;
  renderTabs(currentTab, (tab) => { currentTab = tab; renderApp(); });
  clearAllScheduled();

  const grid = document.getElementById('widgetGrid');

  if (currentTab === 'settings') {
    renderSettingsPanel(grid, {
      widgets: WIDGETS, settings, saveSettings,
      onChange: (forceTabArg) => renderApp(forceTabArg)
    });
    return;
  }

  const visible = settings.widgetOrder
    .filter((id) => {
      const w = WIDGETS.find((x) => x.id === id);
      return w && w.tabs.includes(currentTab) && settings.widgetOn[id] !== false;
    })
    .map((id) => WIDGETS.find((x) => x.id === id));

  if (!visible.length) {
    grid.innerHTML = `<div class="widget" style="grid-column:1/-1;"><div class="mini-empty">このセクションに表示できるウィジェットがありません。SETTINGSでON/OFFを確認してください。</div></div>`;
    return;
  }

  grid.innerHTML = visible.map((w) => `<div class="widget" data-span="${w.span || 1}" id="w-${w.id}" data-widget-id="${w.id}"></div>`).join('');

  visible.forEach((w) => {
    const el = document.getElementById(`w-${w.id}`);
    w.render(el, w, settings, saveSettings);
    if (w.interval) {
      scheduleWidget(w.id, w.interval, () => {
        if (w.update) w.update(el, w, settings, saveSettings);
        else w.render(el, w, settings, saveSettings);
      }, { alwaysRun: w.id === 'clock' || w.id === 'worldClock' || w.id === 'calendar' });
    }
    enableWidgetDrag(el, w.id);
  });

  markUpdated();
}

async function tickAlert() { await renderAlertBar(settings); }

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { markUpdated(); renderApp(); }
});

startHeader(settings);
startOnlineStatus();
tickAlert();
setInterval(tickAlert, 60000);

initSearchAndPalette({
  widgets: WIDGETS,
  settings,
  saveSettings,
  getTab: () => currentTab,
  setTab: (t) => { currentTab = t; },
  rerender: () => renderApp()
});

renderApp();

// PWA: register the service worker (app-shell offline cache). Safe to
// no-op if the browser doesn't support it or this is served from a
// context (e.g. file://) that disallows Service Workers.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline shell simply won't be cached */ });
  });
}
