import { PersonalStatusStore } from '../services/storage.js';

// Health-adjacent fields are stored ONLY when the user types them in here,
// and only ever locally. Swap for an Apple Health / Health Connect adapter
// later without touching the widget UI.
export const PersonalStatusAdapter = {
  getStatus() {
    return PersonalStatusStore.load();
  },
  saveStatus(v) {
    PersonalStatusStore.save(v);
  }
};
