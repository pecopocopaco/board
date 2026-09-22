import { CalendarStore } from '../services/storage.js';

// Swap this for a real Google Calendar / CalDAV adapter later — the UI only
// ever calls getEvents()/addEvent(), so the storage backing can change
// without touching any widget code.
export const CalendarAdapter = {
  getEvents() {
    return CalendarStore.load().sort((a, b) => a.time.localeCompare(b.time));
  },
  addEvent(time, title) {
    const list = CalendarStore.load();
    list.push({ time, title: title.toUpperCase() });
    list.sort((a, b) => a.time.localeCompare(b.time));
    CalendarStore.save(list);
  }
};
