// Offline support.
// - The kids' app (/play/) and parent area (/parents/) are precached on install,
//   along with the scripts and styles they load, so they open with no internet.
// - Pages are network-first: fresh when online, from the cache when not.
// - Next.js build files have hashed names, so they're served cache-first.
// - Each grade's lessons are a separate file loaded on demand. The app posts the
//   files it has loaded ("cache-urls") so they're kept even if they arrived before
//   this worker took control of the page.
// - /api/ is never cached: progress is saved in IndexedDB and synced by the app.
const CACHE = "grademap-v3";
const PRESERVED_CACHES = new Set(["transformers-cache", "kokoro-voices"]);
const SHELLS = ["/play/", "/parents/", "/"];
const EXTRAS = ["/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png"];

/** Cache a page and every /_next/static file its HTML references. */
async function precachePage(cache, path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) return;
  const html = await res.clone().text();
  await cache.put(path, res);
  const assets = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(m[1]);
  await Promise.all(
    [...assets].map((url) =>
      caches.match(url).then((hit) => hit || fetch(url).then((r) => (r.ok ? cache.put(url, r) : undefined))).catch(() => undefined),
    ),
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const path of SHELLS) await precachePage(cache, path).catch(() => undefined);
      await Promise.all(EXTRAS.map((u) => cache.add(u).catch(() => undefined)));
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !PRESERVED_CACHES.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  const { data } = event;
  if (data?.type !== "cache-urls" || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter((u) => typeof u === "string" && new URL(u).origin === self.location.origin && new URL(u).pathname.startsWith("/_next/static/"));
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(urls.map((u) => cache.match(u).then((hit) => hit || cache.add(u).catch(() => undefined)))),
    ),
  );
});

function store(request, response) {
  if (response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

function shellFor(pathname) {
  if (pathname.startsWith("/parents")) return "/parents/";
  if (pathname.startsWith("/play")) return "/play/";
  return "/";
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  // Client-side navigation data. If it fails offline, Next falls back to a full
  // page load, which the navigation branch below serves from the cache.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/") || /\.(png|svg|ico|webmanifest|woff2?)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => store(request, res))));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((res) => store(request, res))
      .catch(() =>
        caches
          .match(request, { ignoreSearch: request.mode === "navigate" })
          .then((hit) => hit || (request.mode === "navigate" ? caches.match(shellFor(url.pathname)) : undefined))
          .then((hit) => hit || Response.error()),
      ),
  );
});
