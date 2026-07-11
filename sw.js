const CACHE = 'gsrm-portal-v1';
const FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase aur external requests cache mat karo
  if(e.request.url.includes('firestore') || e.request.url.includes('firebase') || e.request.url.includes('googleapis')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
