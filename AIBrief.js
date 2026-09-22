import { widgetShell } from '../components/Widget.js';
import { WeatherAdapter } from '../adapters/WeatherAdapter.js';
import { TrainAdapter } from '../adapters/TrainAdapter.js';
import { NewsAdapter } from '../adapters/NewsAdapter.js';
import { CalendarAdapter } from '../adapters/CalendarAdapter.js';

// The dashboard's centerpiece widget. Currently templates a summary from
// the other adapters' data client-side; swap the body of buildBrief() for
// a real call to the Claude API (see README → "API設定方法") to have an
// actual model write the brief instead of a template.
async function buildBrief() {
  const weather = await WeatherAdapter.getCurrentWeather();
  const train = TrainAdapter.getDepartures();
  const news = NewsAdapter.getLatestNews();
  const events = CalendarAdapter.getEvents();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 11 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  const nextEvt = events.find((e) => {
    const [h, m] = e.time.split(':').map(Number);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m) > now;
  });
  const trainIssue = train.lines.find((l) => l.status !== 'NORMAL');
  return `${greeting}\n\n仙台は現在 ${weather.temp}°C、${weather.cond}です。\n` +
    `${trainIssue ? trainIssue.name + 'に運行情報あり（' + trainIssue.status + '）。' : 'JR各線は平常運転です。'}\n` +
    `今日のニュースでは「${news.items[0].title}」が注目されています。\n` +
    `${nextEvt ? '次の予定「' + nextEvt.title + '」は ' + nextEvt.time + ' です。' : '本日の残りの予定はありません。'}`;
}

export const AIBrief = {
  id: 'aiBrief', title: 'AI DAILY BRIEF', icon: '✦', tabs: ['home', 'ai'], interval: 300000, span: 2,
  async render(el, w) {
    const text = await buildBrief();
    el.innerHTML = widgetShell(w, `<div class="ai-brief-box">${text}</div>`, `<span class="badge demo">DEMO</span>`);
  }
};
