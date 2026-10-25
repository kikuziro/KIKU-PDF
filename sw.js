// PDF 필기장 service worker: keeps the app and its PDF engine on this computer so it opens offline.
// When you change any file of the app, raise VERSION by one so installed copies pick up the change.
const VERSION = 'pdf-pilgi-v4';
const FONT_CACHE = 'pdf-pilgi-fonts';
const FILES = ["./", "index.html", "manifest.webmanifest", "vendor/pdf-lib.min.js", "vendor/pdfjs/pdf.min.js", "vendor/pdfjs/pdf.worker.min.js", "vendor/pdfjs/cmaps.bin", "apple-touch-icon.png", "favicon-32.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "vendor/pdfjs/standard_fonts/FoxitDingbats.pfb", "vendor/pdfjs/standard_fonts/FoxitFixed.pfb", "vendor/pdfjs/standard_fonts/FoxitFixedBold.pfb", "vendor/pdfjs/standard_fonts/FoxitFixedBoldItalic.pfb", "vendor/pdfjs/standard_fonts/FoxitFixedItalic.pfb", "vendor/pdfjs/standard_fonts/FoxitSerif.pfb", "vendor/pdfjs/standard_fonts/FoxitSerifBold.pfb", "vendor/pdfjs/standard_fonts/FoxitSerifBoldItalic.pfb", "vendor/pdfjs/standard_fonts/FoxitSerifItalic.pfb", "vendor/pdfjs/standard_fonts/FoxitSymbol.pfb", "vendor/pdfjs/standard_fonts/LiberationSans-Bold.ttf", "vendor/pdfjs/standard_fonts/LiberationSans-BoldItalic.ttf", "vendor/pdfjs/standard_fonts/LiberationSans-Italic.ttf", "vendor/pdfjs/standard_fonts/LiberationSans-Regular.ttf"];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== VERSION && key !== FONT_CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts for the interface: use the saved copy, refresh it in the background
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.open(FONT_CACHE).then(async cache => {
      const hit = await cache.match(req);
      const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // the page itself: show the saved copy at once, fetch a newer one for next time
  if (req.mode === 'navigate') {
    event.respondWith(caches.open(VERSION).then(async cache => {
      const hit = await cache.match('index.html');
      const net = fetch(req).then(res => { if (res.ok) cache.put('index.html', res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  // everything else (PDF engine, character maps, icons): saved copy first
  event.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
