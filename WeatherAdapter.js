import { fetchJSON } from '../services/api.js';
import { seededRandom, daySeed } from '../data/mockData.js';

const SENDAI = { lat: 38.2682, lon: 140.8694 };

const WMO_ICON = (code) => {
  if (code === 0) return { icon: '☀', cond: 'CLEAR' };
  if ([1, 2].includes(code)) return { icon: '🌤', cond: 'PARTLY CLOUDY' };
  if (code === 3) return { icon: '☁', cond: 'CLOUDY' };
  if ([45, 48].includes(code)) return { icon: '🌫', cond: 'FOG' };
  if (code >= 51 && code <= 67) return { icon: '🌧', cond: 'RAIN' };
  if (code >= 71 && code <= 77) return { icon: '❄', cond: 'SNOW' };
  if (code >= 80 && code <= 82) return { icon: '🌦', cond: 'SHOWERS' };
  if (code >= 95) return { icon: '⛈', cond: 'THUNDERSTORM' };
  return { icon: '🌤', cond: 'PARTLY CLOUDY' };
};

function mockWeather() {
  const r = seededRandom(daySeed());
  const temp = Math.round(18 + r() * 10);
  const conds = ['CLEAR', 'PARTLY CLOUDY', 'CLOUDY', 'LIGHT RAIN'];
  const icons = { CLEAR: '☀', 'PARTLY CLOUDY': '🌤', CLOUDY: '☁', 'LIGHT RAIN': '🌧' };
  const cond = conds[Math.floor(r() * conds.length)];
  const now = new Date();
  const hourly = [];
  for (let i = 0; i < 8; i++) {
    const hh = (now.getHours() + i) % 24;
    const c = conds[Math.floor(seededRandom(daySeed() + hh)() * conds.length)];
    hourly.push({ hour: hh, icon: icons[c], temp: Math.round(temp + Math.sin(i / 2) * 3 - i * 0.3) });
  }
  return {
    demo: true, temp, feels: temp - 2, cond, icon: icons[cond],
    humidity: Math.round(45 + r() * 30), wind: (1 + r() * 5).toFixed(1),
    pop: Math.round(r() * 60), uv: Math.round(1 + r() * 7), hourly
  };
}

// Real call — works once this file is served from a normal origin with
// network access (it is blocked inside the sandboxed chat preview only).
async function realWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${SENDAI.lat}&longitude=${SENDAI.lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,uv_index,precipitation_probability` +
    `&hourly=temperature_2m,weather_code&timezone=Asia%2FTokyo&forecast_days=1`;
  const data = await fetchJSON(url);
  const cur = data.current;
  const { icon, cond } = WMO_ICON(cur.weather_code);
  const now = new Date();
  const hourIdx = data.hourly.time.findIndex((t) => new Date(t) >= now);
  const hourly = Array.from({ length: 8 }, (_, i) => {
    const idx = (hourIdx < 0 ? 0 : hourIdx) + i;
    const t = new Date(data.hourly.time[idx]);
    const wc = WMO_ICON(data.hourly.weather_code[idx]);
    return { hour: t.getHours(), icon: wc.icon, temp: Math.round(data.hourly.temperature_2m[idx]) };
  });
  return {
    demo: false, temp: Math.round(cur.temperature_2m), feels: Math.round(cur.apparent_temperature),
    cond, icon, humidity: Math.round(cur.relative_humidity_2m), wind: cur.wind_speed_10m.toFixed(1),
    pop: cur.precipitation_probability ?? 0, uv: Math.round(cur.uv_index ?? 0), hourly
  };
}

export const WeatherAdapter = {
  async getCurrentWeather() {
    try {
      return await realWeather();
    } catch (e) {
      return mockWeather();
    }
  }
};
