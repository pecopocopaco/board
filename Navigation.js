export const TABS = [
  { id: 'home', label: 'HOME' },
  { id: 'commute', label: 'COMMUTE' },
  { id: 'news', label: 'NEWS' },
  { id: 'world', label: 'WORLD' },
  { id: 'market', label: 'MARKET' },
  { id: 'ai', label: 'AI' },
  { id: 'settings', label: 'SETTINGS' }
];

export function renderTabs(currentTab, onSelect) {
  const nav = document.getElementById('tabs');
  nav.innerHTML = TABS.map(
    (t) => `<button class="tab-btn ${t.id === currentTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('');
  nav.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn.dataset.tab));
  });
}
