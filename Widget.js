// Every widget renders through this shell so title/icon/drag-handle/badge
// placement stays consistent without each widget re-implementing it.
export function widgetShell(w, bodyHtml, extraBadge = '') {
  return `
    <div class="widget-head">
      <div class="widget-title"><span class="ic">${w.icon}</span>${w.title}</div>
      <div class="widget-controls">
        ${extraBadge}
        <span class="drag-handle" title="ドラッグで並び替え">⋮⋮</span>
      </div>
    </div>
    ${bodyHtml}
  `;
}

export function makeWidgetCard(w) {
  const div = document.createElement('div');
  div.className = 'widget';
  div.dataset.span = w.span || 1;
  div.id = `w-${w.id}`;
  div.dataset.widgetId = w.id;
  return div;
}
