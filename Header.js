import { fmtClock, fmtDate, WEEKDAYS_JA, timeAgo } from './utils.js';

let lastUpdateTime = Date.now();
export function markUpdated() { lastUpdateTime = Date.now(); }

export function startHeader(settings) {
  function tick() {
    const now = new Date();
    document.getElementById('headerClock').textContent = fmtClock(now, settings.hour24);
    document.getElementById('headerDate').textContent = `${WEEKDAYS_JA[now.getDay()]} ${fmtDate(now)}`;
    document.getElementById('headerMeta').textContent = settings.city;
    const ago = Math.floor((Date.now() - lastUpdateTime) / 1000);
    const foot = document.getElementById('footUpdated');
    if (foot) foot.textContent = `UPDATED ${timeAgo(ago)}`;
  }
  setInterval(tick, 1000);
  tick();
}

export function startOnlineStatus() {
  function paint() {
    const pill = document.getElementById('statusPill');
    const text = document.getElementById('statusText');
    if (navigator.onLine) { pill.classList.remove('offline'); text.textContent = 'ONLINE'; }
    else { pill.classList.add('offline'); text.textContent = 'OFFLINE'; }
  }
  window.addEventListener('online', paint);
  window.addEventListener('offline', paint);
  paint();
}
