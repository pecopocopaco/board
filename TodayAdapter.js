import { seededRandom, daySeed, TODAY_NOTES } from '../data/mockData.js';

export const TodayAdapter = {
  getNote() {
    const r = seededRandom(daySeed() + 7);
    return { demo: true, note: TODAY_NOTES[Math.floor(r() * TODAY_NOTES.length)] };
  }
};
