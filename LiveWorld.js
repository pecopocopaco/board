import { widgetShell } from '../components/Widget.js';

const LINKS = [
  { label: 'EARTHQUAKE', url: 'https://www.jma.go.jp/bosai/map.html' },
  { label: 'FLIGHT', url: 'https://www.flightradar24.com/' },
  { label: 'SHIP', url: 'https://www.marinetraffic.com/' },
  { label: 'WEATHER', url: 'https://www.jma.go.jp/bosai/' },
  { label: 'SPACE', url: 'https://spaceweather.com/' },
  { label: 'CYBER', url: 'https://www.shodan.io/' }
];

export const LiveWorld = {
  id: 'liveWorld', title: 'LIVE WORLD', icon: '🌍', tabs: ['world'], interval: 0,
  render(el, w) {
    el.innerHTML = widgetShell(w, `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        ${LINKS.map((l) => `<a href="${l.url}" target="_blank" rel="noopener" class="btn ghost" style="text-align:center; text-decoration:none; display:block;">${l.label} ↗</a>`).join('')}
      </div>
    `);
  }
};
