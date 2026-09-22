// Generic network helper for adapters that call a real, key-less public API
// (e.g. Open-Meteo for weather). Every adapter that uses this MUST catch the
// rejection and fall back to its own mock data — an unreachable API must
// never break a widget (see project spec: "Mock Mode").
//
// Never put an API key in this file or call it with one inline: anything
// that needs a key belongs behind a backend proxy (see README, "API設定方法").

export async function fetchJSON(url, { timeoutMs = 6000, ...opts } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
