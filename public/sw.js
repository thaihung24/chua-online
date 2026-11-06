// Service Worker tối giản cho Chùa Rắn:
// - Cache-first cho /assets/* và /icons/*
// - Network-first cho điều hướng HTML (rơi về cache hoặc /offline.html khi mất mạng)
// - Không bao giờ lưu /api/* hoặc /ws
const CACHE_NAME = 'chua-ran-v6';
const PRECACHE = ['/offline.html', '/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/ws') return;
  // Không chặn luồng phát âm thanh hoặc yêu cầu Range (tránh lỗi 206 trên Safari/iOS).
  if (req.headers.has('range') || url.pathname.startsWith('/music/') || url.pathname.startsWith('/chant/')) return;

  // Tài sản tĩnh có hash hoặc biểu tượng: ưu tiên bộ nhớ đệm.
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => undefined);
          }
          return res;
        });
      }),
    );
    return;
  }

  // Điều hướng trang HTML: ưu tiên mạng, dự phòng bản đã lưu hoặc /offline.html.
  const accept = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => undefined);
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const offline = await caches.match('/offline.html');
          return offline || new Response('Đang ngoại tuyến', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }),
    );
    return;
  }

  // Các tệp tĩnh khác (CSS/JS SEO, favicon, manifest): mạng trước, rớt mạng dùng cache.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => undefined);
        }
        return res;
      })
      .catch(async () => (await caches.match(req)) || Response.error()),
  );
});
