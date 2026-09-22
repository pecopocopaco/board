// Browser Notification API wrapper. Only ever fires when the user has
// explicitly turned notifications on in Settings (settings.notifications).

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function notify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: './icons/icon-192.png' });
  } catch (e) {
    // Notification construction can fail on some mobile browsers that only
    // support notifications via a registered Service Worker — fail silently.
  }
}
