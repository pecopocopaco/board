import { widgetShell } from '../components/Widget.js';
import { timeAgo } from '../components/utils.js';
import { NewsAdapter } from '../adapters/NewsAdapter.js';

export const News = {
  id: 'news', title: 'NEWS', icon: '📰', tabs: ['home', 'news'], interval: 300000, span: 2,
  render(el, w, settings) {
    const data = NewsAdapter.getLatestNews();
    const filtered = data.items.filter((n) => settings.newsCategories.includes(n.cat));
    el.innerHTML = widgetShell(w, (filtered.length ? filtered : data.items).slice(0, 8).map((n) => `
      <div class="news-item">
        <div class="news-title">${n.title}</div>
        <div class="news-meta"><span class="cat-tag">${n.cat}</span><span>${n.source}</span><span>${timeAgo(n.minsAgo * 60)}</span></div>
      </div>
    `).join(''), `<span class="badge demo">DEMO</span>`);
  }
};
