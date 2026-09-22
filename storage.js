// Thin localStorage wrapper. Nothing here ever leaves the device —
// health/personal fields and settings are all local-only by design.

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const SETTINGS_KEY = 'slcc_settings';

export const DEFAULT_SETTINGS = {
  hour24: true,
  city: 'SENDAI',
  worldCities: [
    'Asia/Tokyo|TOKYO',
    'America/New_York|NEW YORK',
    'Europe/London|LONDON',
    'America/Los_Angeles|LOS ANGELES'
  ],
  busStop: '仙台駅前',
  newsCategories: ['JAPAN', 'WORLD', 'TECH', 'AI', 'ECONOMY', 'SPORTS', 'LOCAL'],
  widgetOrder: null,
  widgetOn: null,
  notifications: false
};

export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) };
}

export function saveSettings(settings) {
  saveJSON(SETTINGS_KEY, settings);
}

export function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY);
  return loadSettings();
}

export const CalendarStore = {
  key: 'slcc_events',
  load() {
    return loadJSON(this.key, [
      { time: '15:30', title: 'WORK' },
      { time: '18:00', title: 'SWIMMING' },
      { time: '20:00', title: 'DINNER' }
    ]);
  },
  save(list) {
    saveJSON(this.key, list);
  }
};

export const PersonalStatusStore = {
  key: 'slcc_status',
  load() {
    return loadJSON(this.key, { weight: '', steps: '', exercise: '', sleep: '' });
  },
  save(v) {
    saveJSON(this.key, v);
  }
};
