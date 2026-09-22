import { widgetShell } from '../components/Widget.js';
import { pad } from '../components/utils.js';
import { WeatherAdapter } from '../adapters/WeatherAdapter.js';

export const Weather = {
  id: 'weather', title: 'WEATHER', icon: '☀', tabs: ['home', 'commute'], interval: 600000, span: 2,
  async render(el, w) {
    const data = await WeatherAdapter.getCurrentWeather();
    el.innerHTML = widgetShell(w, `
      <div class="weather-now">
        <div class="weather-temp">${data.icon} ${data.temp}°</div>
        <div class="weather-desc">${data.cond}<br>体感 ${data.feels}°</div>
      </div>
      <div class="weather-grid">
        <div class="wg-item"><div class="v">${data.humidity}%</div><div class="l">湿度</div></div>
        <div class="wg-item"><div class="v">${data.wind}m/s</div><div class="l">風速</div></div>
        <div class="wg-item"><div class="v">${data.pop}%</div><div class="l">降水確率</div></div>
        <div class="wg-item"><div class="v">UV ${data.uv}</div><div class="l">紫外線</div></div>
        <div class="wg-item"><div class="v">SENDAI</div><div class="l">地点</div></div>
        <div class="wg-item"><div class="v">10分毎</div><div class="l">更新間隔</div></div>
      </div>
      <div class="hourly-scroll">
        ${data.hourly.map((h) => `<div class="hourly-item"><div>${pad(h.hour)}:00</div><div class="ic">${h.icon}</div><div class="t">${h.temp}°</div></div>`).join('')}
      </div>
    `, `<span class="badge ${data.demo ? 'demo' : 'live'}">${data.demo ? 'DEMO' : 'LIVE'}</span>`);
  }
};
