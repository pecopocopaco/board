import { widgetShell } from '../components/Widget.js';
import { NewsAdapter } from '../adapters/NewsAdapter.js';

// Placeholder summarizer: templates the top headlines. Swap for a real
// summarization API call (e.g. the Claude API — see README) behind a
// backend proxy when a key is available.
function summarize(news) {
  const top = news.items.slice(0, 3).map((n) => n.title);
  return `本日の主要ニュースは${news.items.length}件。注目トピックは「${top[0]}」「${top[1]}」など。地域では「${top[2]}」も話題になっています。`;
}

export const AISummary = {
  id: 'aiSummary', title: "TODAY'S AI BRIEF", icon: '🧠', tabs: ['news'], interval: 300000,
  render(el, w) {
    const news = NewsAdapter.getLatestNews();
    el.innerHTML = widgetShell(w, `<div class="ai-brief-box">${summarize(news)}</div>`, `<span class="badge demo">DEMO</span>`);
  }
};
