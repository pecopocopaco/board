const SENDAI = { lat: 38.2682, lon: 140.8694 };

function sunTimes(lat, lon, date) {
  const rad = Math.PI / 180;
  const N = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const lngHour = lon / 15;
  function calc(isRise) {
    const t = N + ((isRise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    let L = M + 1.916 * Math.sin(rad * M) + 0.02 * Math.sin(2 * rad * M) + 282.634;
    L = (L + 360) % 360;
    let RA = (1 / rad) * Math.atan(0.91764 * Math.tan(rad * L));
    RA = (RA + 360) % 360;
    const Lq = Math.floor(L / 90) * 90, RAq = Math.floor(RA / 90) * 90;
    RA = (RA + (Lq - RAq)) / 15;
    const sinDec = 0.39782 * Math.sin(rad * L);
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH = (Math.cos(rad * 90.833) - sinDec * Math.sin(rad * lat)) / (cosDec * Math.cos(rad * lat));
    if (cosH > 1 || cosH < -1) return null;
    let H = isRise ? 360 - (1 / rad) * Math.acos(cosH) : (1 / rad) * Math.acos(cosH);
    H = H / 15;
    const T = H + RA - 0.06571 * t - 6.622;
    let UT = T - lngHour;
    UT = (UT + 24) % 24;
    const h = Math.floor(UT), m = Math.floor((UT - h) * 60);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), h, m));
  }
  return { sunrise: calc(true), sunset: calc(false) };
}

function moonPhase(date) {
  const synodic = 29.530588853;
  const known = Date.UTC(2000, 0, 6, 18, 14);
  const diffDays = (date.getTime() - known) / 86400000;
  let phase = (diffDays % synodic) / synodic;
  if (phase < 0) phase += 1;
  const names = ['NEW MOON', 'WAXING CRESCENT', 'FIRST QUARTER', 'WAXING GIBBOUS', 'FULL MOON', 'WANING GIBBOUS', 'LAST QUARTER', 'WANING CRESCENT'];
  const icons = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const idx = Math.round(phase * 8) % 8;
  return { fraction: phase, name: names[idx], icon: icons[idx] };
}

export const SunMoonAdapter = {
  // No mock fallback needed — this is pure math, always "real".
  getTodayData(date = new Date()) {
    const { sunrise, sunset } = sunTimes(SENDAI.lat, SENDAI.lon, date);
    return { demo: false, sunrise, sunset, moon: moonPhase(date) };
  }
};
