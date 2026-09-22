import { EarthquakeAdapter } from '../adapters/EarthquakeAdapter.js';
import { DisasterAdapter } from '../adapters/DisasterAdapter.js';
import { TrainAdapter } from '../adapters/TrainAdapter.js';
import { BusAdapter } from '../adapters/BusAdapter.js';

export async function computeAlert(settings) {
  const [q, d, train, bus] = await Promise.all([
    EarthquakeAdapter.getLatestEarthquake(),
    Promise.resolve(DisasterAdapter.getStatus()),
    Promise.resolve(TrainAdapter.getDepartures()),
    Promise.resolve(BusAdapter.getDepartures(settings.busStop))
  ]);

  let level = 'normal';
  const items = [];

  if (Number(q.mag) >= 5.5) { level = 'crit'; items.push(`地震 M${q.mag} ${q.place}`); }
  if (d.level === 'WARNING') { level = 'crit'; items.push('大雨警報'); }
  else if (d.level === 'WATCH' && level === 'normal') { level = 'warn'; items.push('大雨注意報'); }

  train.lines.filter((l) => l.status !== 'NORMAL').forEach((l) => {
    if (level === 'normal') level = 'warn';
    items.push(`${l.name} ${l.status}`);
  });
  bus.rows.filter((r) => r.status !== 'NORMAL').forEach(() => {
    if (level === 'normal') level = 'warn';
    items.push('バス遅延');
  });

  return { level, items };
}

export async function renderAlertBar(settings) {
  const bar = document.getElementById('alertBar');
  const { level, items } = await computeAlert(settings);
  bar.classList.remove('warn', 'crit');
  if (level === 'crit') {
    bar.classList.add('crit');
    bar.textContent = `● CRITICAL ALERT — ${items[0]}`;
  } else if (level === 'warn') {
    bar.classList.add('warn');
    bar.textContent = `● ${items.length} WARNING${items.length > 1 ? 'S' : ''} — ${items[0]}`;
  } else {
    bar.textContent = '● ALL SYSTEMS NORMAL';
  }
  bar.onclick = () => { if (items.length) alert(items.join('\n')); };
}
