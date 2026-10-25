// PDF 필기장 service worker: keeps the app and its PDF engine on this computer so it opens offline.
// When you change any file of the app, raise VERSION by one so installed copies pick up the change.
const VERSION = 'pdf-pilgi-v1';
const FONT_CACHE = 'pdf-pilgi-fonts';
const FILES = ["./","index.html","manifest.webmanifest","vendor/pdf-lib.min.js","vendor/pdfjs/pdf.min.js","vendor/pdfjs/pdf.worker.min.js","icons/apple-touch-icon.png","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","vendor/pdfjs/cmaps/78-EUC-H.bcmap","vendor/pdfjs/cmaps/78-EUC-V.bcmap","vendor/pdfjs/cmaps/78-H.bcmap","vendor/pdfjs/cmaps/78-RKSJ-H.bcmap","vendor/pdfjs/cmaps/78-RKSJ-V.bcmap","vendor/pdfjs/cmaps/78-V.bcmap","vendor/pdfjs/cmaps/78ms-RKSJ-H.bcmap","vendor/pdfjs/cmaps/78ms-RKSJ-V.bcmap","vendor/pdfjs/cmaps/83pv-RKSJ-H.bcmap","vendor/pdfjs/cmaps/90ms-RKSJ-H.bcmap","vendor/pdfjs/cmaps/90ms-RKSJ-V.bcmap","vendor/pdfjs/cmaps/90msp-RKSJ-H.bcmap","vendor/pdfjs/cmaps/90msp-RKSJ-V.bcmap","vendor/pdfjs/cmaps/90pv-RKSJ-H.bcmap","vendor/pdfjs/cmaps/90pv-RKSJ-V.bcmap","vendor/pdfjs/cmaps/Add-H.bcmap","vendor/pdfjs/cmaps/Add-RKSJ-H.bcmap","vendor/pdfjs/cmaps/Add-RKSJ-V.bcmap","vendor/pdfjs/cmaps/Add-V.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-0.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-1.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-2.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-3.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-4.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-5.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-6.bcmap","vendor/pdfjs/cmaps/Adobe-CNS1-UCS2.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-0.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-1.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-2.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-3.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-4.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-5.bcmap","vendor/pdfjs/cmaps/Adobe-GB1-UCS2.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-0.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-1.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-2.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-3.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-4.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-5.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-6.bcmap","vendor/pdfjs/cmaps/Adobe-Japan1-UCS2.bcmap","vendor/pdfjs/cmaps/Adobe-Korea1-0.bcmap","vendor/pdfjs/cmaps/Adobe-Korea1-1.bcmap","vendor/pdfjs/cmaps/Adobe-Korea1-2.bcmap","vendor/pdfjs/cmaps/Adobe-Korea1-UCS2.bcmap","vendor/pdfjs/cmaps/B5-H.bcmap","vendor/pdfjs/cmaps/B5-V.bcmap","vendor/pdfjs/cmaps/B5pc-H.bcmap","vendor/pdfjs/cmaps/B5pc-V.bcmap","vendor/pdfjs/cmaps/CNS-EUC-H.bcmap","vendor/pdfjs/cmaps/CNS-EUC-V.bcmap","vendor/pdfjs/cmaps/CNS1-H.bcmap","vendor/pdfjs/cmaps/CNS1-V.bcmap","vendor/pdfjs/cmaps/CNS2-H.bcmap","vendor/pdfjs/cmaps/CNS2-V.bcmap","vendor/pdfjs/cmaps/ETHK-B5-H.bcmap","vendor/pdfjs/cmaps/ETHK-B5-V.bcmap","vendor/pdfjs/cmaps/ETen-B5-H.bcmap","vendor/pdfjs/cmaps/ETen-B5-V.bcmap","vendor/pdfjs/cmaps/ETenms-B5-H.bcmap","vendor/pdfjs/cmaps/ETenms-B5-V.bcmap","vendor/pdfjs/cmaps/EUC-H.bcmap","vendor/pdfjs/cmaps/EUC-V.bcmap","vendor/pdfjs/cmaps/Ext-H.bcmap","vendor/pdfjs/cmaps/Ext-RKSJ-H.bcmap","vendor/pdfjs/cmaps/Ext-RKSJ-V.bcmap","vendor/pdfjs/cmaps/Ext-V.bcmap","vendor/pdfjs/cmaps/GB-EUC-H.bcmap","vendor/pdfjs/cmaps/GB-EUC-V.bcmap","vendor/pdfjs/cmaps/GB-H.bcmap","vendor/pdfjs/cmaps/GB-V.bcmap","vendor/pdfjs/cmaps/GBK-EUC-H.bcmap","vendor/pdfjs/cmaps/GBK-EUC-V.bcmap","vendor/pdfjs/cmaps/GBK2K-H.bcmap","vendor/pdfjs/cmaps/GBK2K-V.bcmap","vendor/pdfjs/cmaps/GBKp-EUC-H.bcmap","vendor/pdfjs/cmaps/GBKp-EUC-V.bcmap","vendor/pdfjs/cmaps/GBT-EUC-H.bcmap","vendor/pdfjs/cmaps/GBT-EUC-V.bcmap","vendor/pdfjs/cmaps/GBT-H.bcmap","vendor/pdfjs/cmaps/GBT-V.bcmap","vendor/pdfjs/cmaps/GBTpc-EUC-H.bcmap","vendor/pdfjs/cmaps/GBTpc-EUC-V.bcmap","vendor/pdfjs/cmaps/GBpc-EUC-H.bcmap","vendor/pdfjs/cmaps/GBpc-EUC-V.bcmap","vendor/pdfjs/cmaps/H.bcmap","vendor/pdfjs/cmaps/HKdla-B5-H.bcmap","vendor/pdfjs/cmaps/HKdla-B5-V.bcmap","vendor/pdfjs/cmaps/HKdlb-B5-H.bcmap","vendor/pdfjs/cmaps/HKdlb-B5-V.bcmap","vendor/pdfjs/cmaps/HKgccs-B5-H.bcmap","vendor/pdfjs/cmaps/HKgccs-B5-V.bcmap","vendor/pdfjs/cmaps/HKm314-B5-H.bcmap","vendor/pdfjs/cmaps/HKm314-B5-V.bcmap","vendor/pdfjs/cmaps/HKm471-B5-H.bcmap","vendor/pdfjs/cmaps/HKm471-B5-V.bcmap","vendor/pdfjs/cmaps/HKscs-B5-H.bcmap","vendor/pdfjs/cmaps/HKscs-B5-V.bcmap","vendor/pdfjs/cmaps/Hankaku.bcmap","vendor/pdfjs/cmaps/Hiragana.bcmap","vendor/pdfjs/cmaps/KSC-EUC-H.bcmap","vendor/pdfjs/cmaps/KSC-EUC-V.bcmap","vendor/pdfjs/cmaps/KSC-H.bcmap","vendor/pdfjs/cmaps/KSC-Johab-H.bcmap","vendor/pdfjs/cmaps/KSC-Johab-V.bcmap","vendor/pdfjs/cmaps/KSC-V.bcmap","vendor/pdfjs/cmaps/KSCms-UHC-H.bcmap","vendor/pdfjs/cmaps/KSCms-UHC-HW-H.bcmap","vendor/pdfjs/cmaps/KSCms-UHC-HW-V.bcmap","vendor/pdfjs/cmaps/KSCms-UHC-V.bcmap","vendor/pdfjs/cmaps/KSCpc-EUC-H.bcmap","vendor/pdfjs/cmaps/KSCpc-EUC-V.bcmap","vendor/pdfjs/cmaps/Katakana.bcmap","vendor/pdfjs/cmaps/NWP-H.bcmap","vendor/pdfjs/cmaps/NWP-V.bcmap","vendor/pdfjs/cmaps/RKSJ-H.bcmap","vendor/pdfjs/cmaps/RKSJ-V.bcmap","vendor/pdfjs/cmaps/Roman.bcmap","vendor/pdfjs/cmaps/UniCNS-UCS2-H.bcmap","vendor/pdfjs/cmaps/UniCNS-UCS2-V.bcmap","vendor/pdfjs/cmaps/UniCNS-UTF16-H.bcmap","vendor/pdfjs/cmaps/UniCNS-UTF16-V.bcmap","vendor/pdfjs/cmaps/UniCNS-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniCNS-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniCNS-UTF8-H.bcmap","vendor/pdfjs/cmaps/UniCNS-UTF8-V.bcmap","vendor/pdfjs/cmaps/UniGB-UCS2-H.bcmap","vendor/pdfjs/cmaps/UniGB-UCS2-V.bcmap","vendor/pdfjs/cmaps/UniGB-UTF16-H.bcmap","vendor/pdfjs/cmaps/UniGB-UTF16-V.bcmap","vendor/pdfjs/cmaps/UniGB-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniGB-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniGB-UTF8-H.bcmap","vendor/pdfjs/cmaps/UniGB-UTF8-V.bcmap","vendor/pdfjs/cmaps/UniJIS-UCS2-H.bcmap","vendor/pdfjs/cmaps/UniJIS-UCS2-HW-H.bcmap","vendor/pdfjs/cmaps/UniJIS-UCS2-HW-V.bcmap","vendor/pdfjs/cmaps/UniJIS-UCS2-V.bcmap","vendor/pdfjs/cmaps/UniJIS-UTF16-H.bcmap","vendor/pdfjs/cmaps/UniJIS-UTF16-V.bcmap","vendor/pdfjs/cmaps/UniJIS-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniJIS-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniJIS-UTF8-H.bcmap","vendor/pdfjs/cmaps/UniJIS-UTF8-V.bcmap","vendor/pdfjs/cmaps/UniJIS2004-UTF16-H.bcmap","vendor/pdfjs/cmaps/UniJIS2004-UTF16-V.bcmap","vendor/pdfjs/cmaps/UniJIS2004-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniJIS2004-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniJIS2004-UTF8-H.bcmap","vendor/pdfjs/cmaps/UniJIS2004-UTF8-V.bcmap","vendor/pdfjs/cmaps/UniJISPro-UCS2-HW-V.bcmap","vendor/pdfjs/cmaps/UniJISPro-UCS2-V.bcmap","vendor/pdfjs/cmaps/UniJISPro-UTF8-V.bcmap","vendor/pdfjs/cmaps/UniJISX0213-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniJISX0213-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniJISX02132004-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniJISX02132004-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniKS-UCS2-H.bcmap","vendor/pdfjs/cmaps/UniKS-UCS2-V.bcmap","vendor/pdfjs/cmaps/UniKS-UTF16-H.bcmap","vendor/pdfjs/cmaps/UniKS-UTF16-V.bcmap","vendor/pdfjs/cmaps/UniKS-UTF32-H.bcmap","vendor/pdfjs/cmaps/UniKS-UTF32-V.bcmap","vendor/pdfjs/cmaps/UniKS-UTF8-H.bcmap","vendor/pdfjs/cmaps/UniKS-UTF8-V.bcmap","vendor/pdfjs/cmaps/V.bcmap","vendor/pdfjs/cmaps/WP-Symbol.bcmap","vendor/pdfjs/standard_fonts/FoxitDingbats.pfb","vendor/pdfjs/standard_fonts/FoxitFixed.pfb","vendor/pdfjs/standard_fonts/FoxitFixedBold.pfb","vendor/pdfjs/standard_fonts/FoxitFixedBoldItalic.pfb","vendor/pdfjs/standard_fonts/FoxitFixedItalic.pfb","vendor/pdfjs/standard_fonts/FoxitSerif.pfb","vendor/pdfjs/standard_fonts/FoxitSerifBold.pfb","vendor/pdfjs/standard_fonts/FoxitSerifBoldItalic.pfb","vendor/pdfjs/standard_fonts/FoxitSerifItalic.pfb","vendor/pdfjs/standard_fonts/FoxitSymbol.pfb","vendor/pdfjs/standard_fonts/LiberationSans-Bold.ttf","vendor/pdfjs/standard_fonts/LiberationSans-BoldItalic.ttf","vendor/pdfjs/standard_fonts/LiberationSans-Italic.ttf","vendor/pdfjs/standard_fonts/LiberationSans-Regular.ttf"];

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
