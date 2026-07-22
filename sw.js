/* Bump CACHE whenever you change the site — installed devices will refresh. */
const CACHE = 'am-v1';
const SHELL = [
  './', './index.html', './manifest.json', './assets/site.css', './assets/site.js',
  './en/index.html','./en/ventures.html','./en/experience.html','./en/skills.html','./en/contact.html',
  './fa/index.html','./fa/ventures.html','./fa/experience.html','./fa/skills.html','./fa/contact.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
