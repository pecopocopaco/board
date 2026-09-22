// Runs each widget's own update interval (Clock: 1s, Weather: 10min, etc.)
// and throttles background tabs via the Visibility API so we don't hammer
// any future real API while the dashboard isn't on screen.

const timers = new Map();

export function scheduleWidget(id, intervalMs, tick, { alwaysRun = false } = {}) {
  clearScheduled(id);
  if (!intervalMs) return;
  const wrapped = () => {
    if (document.hidden && !alwaysRun) return; // skip this tick, stay cached
    tick();
  };
  const effectiveMs = document.hidden && !alwaysRun ? intervalMs * 4 : intervalMs;
  timers.set(id, setInterval(wrapped, effectiveMs));
}

export function clearScheduled(id) {
  if (timers.has(id)) {
    clearInterval(timers.get(id));
    timers.delete(id);
  }
}

export function clearAllScheduled() {
  timers.forEach((t) => clearInterval(t));
  timers.clear();
}
