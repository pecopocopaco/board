import { TABS } from './Navigation.js';

export function initSearchAndPalette({ widgets, settings, saveSettings, getTab, setTab, rerender }) {
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const paletteOverlay = document.getElementById('paletteOverlay');
  const paletteInput = document.getElementById('paletteInput');
  const paletteResults = document.getElementById('paletteResults');

  function openSearch() {
    searchOverlay.classList.remove('hidden');
    searchInput.value = '';
    searchInput.focus();
    paintSearch('');
  }
  function closeSearch() { searchOverlay.classList.add('hidden'); }

  function paintSearch(q) {
    const query = q.trim().toLowerCase();
    const matches = widgets.filter((w) => !query || w.title.toLowerCase().includes(query) || w.id.toLowerCase().includes(query));
    searchResults.innerHTML = matches.map((w) =>
      `<div class="overlay-result" data-id="${w.id}"><span>${w.icon} ${w.title}</span><span>${w.tabs[0].toUpperCase()}</span></div>`
    ).join('') || '<div class="mini-empty">見つかりません</div>';
    searchResults.querySelectorAll('.overlay-result').forEach((r) => {
      r.addEventListener('click', () => {
        const w = widgets.find((x) => x.id === r.dataset.id);
        setTab(w.tabs[0]);
        closeSearch();
        rerender();
        setTimeout(() => document.getElementById(`w-${w.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
      });
    });
  }

  const COMMANDS = [
    ...TABS.map((t) => ({ label: `goto ${t.label.toLowerCase()}`, run: () => { setTab(t.id); rerender(); } })),
    { label: 'toggle 12/24 hour', run: () => { settings.hour24 = !settings.hour24; saveSettings(); rerender(); } }
  ];

  function openPalette() {
    paletteOverlay.classList.remove('hidden');
    paletteInput.value = '';
    paletteInput.focus();
    paintPalette('');
  }
  function closePalette() { paletteOverlay.classList.add('hidden'); }

  function paintPalette(q) {
    const query = q.trim().toLowerCase();
    const matches = COMMANDS.filter((c) => !query || c.label.includes(query));
    paletteResults.innerHTML = matches.map((c, i) =>
      `<div class="overlay-result ${i === 0 ? 'sel' : ''}" data-i="${i}">&gt; ${c.label}</div>`
    ).join('') || '<div class="mini-empty">コマンドが見つかりません</div>';
    paletteResults.querySelectorAll('.overlay-result').forEach((r) => {
      r.addEventListener('click', () => { matches[Number(r.dataset.i)].run(); closePalette(); });
    });
  }

  document.getElementById('searchBtn').addEventListener('click', openSearch);
  document.getElementById('paletteBtn').addEventListener('click', openPalette);
  searchInput.addEventListener('input', () => paintSearch(searchInput.value));
  paletteInput.addEventListener('input', () => paintPalette(paletteInput.value));
  paletteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') paletteResults.querySelector('.overlay-result')?.click();
  });
  searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
  paletteOverlay.addEventListener('click', (e) => { if (e.target === paletteOverlay) closePalette(); });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape') { closeSearch(); closePalette(); }
    else if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); openSearch(); }
  });
}
