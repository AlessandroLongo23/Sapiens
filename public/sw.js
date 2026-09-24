/**
 * Service worker: makes the app installable and keeps the last lessons
 * readable without a network.
 *
 * - Next's hashed build files (/_next/static) never change: cache first.
 * - Same-origin images and fonts: served from the cache, refreshed in the
 *   background.
 * - Lesson pages (/materiale/...): network first; each page read is saved,
 *   the oldest dropped past MAX_LESSONS. Offline, the saved copy is served.
 * - Any other page offline gets /offline.html.
 *
 * Only public material is stored. Signed-in pages (Zaino, account, admin,
 * API) are never cached: a phone is often shared, and a copy of someone's
 * notes must not outlive their session.
 *
 * Bump VERSION to drop every cache on the next visit.
 */
const VERSION = 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const ASSET_CACHE = `asset-${VERSION}`;
const LESSON_CACHE = `lezioni-${VERSION}`;
const OFFLINE_URL = '/offline.html';
const MAX_LESSONS = 30;
const MAX_ASSETS = 200;

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => cache.addAll([OFFLINE_URL, '/icon-192.png', '/favicon.svg']))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	const keep = new Set([STATIC_CACHE, ASSET_CACHE, LESSON_CACHE]);
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;
	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	if (url.pathname.startsWith('/_next/static/')) {
		event.respondWith(cacheFirst(request, STATIC_CACHE));
		return;
	}
	if (request.mode === 'navigate') {
		event.respondWith(url.pathname.startsWith('/materiale/') ? lessonPage(request) : pageOrOffline(request));
		return;
	}
	if (request.destination === 'image' || request.destination === 'font') {
		event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
	}
});

async function cacheFirst(request, cacheName) {
	const cached = await caches.match(request);
	if (cached) return cached;
	const response = await fetch(request);
	if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
	return response;
}

async function staleWhileRevalidate(request, cacheName) {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);
	const network = fetch(request)
		.then(async (response) => {
			if (response.ok) {
				await cache.put(request, response.clone());
				await trim(cache, MAX_ASSETS);
			}
			return response;
		})
		.catch(() => cached);
	return cached ?? network;
}

async function lessonPage(request) {
	const cache = await caches.open(LESSON_CACHE);
	try {
		const response = await fetch(request);
		// A redirect (login, renamed page) or an error page is not a lesson worth keeping.
		if (response.ok && !response.redirected) {
			// Re-inserting moves the page to the end, so trim() drops the least recently read.
			await cache.delete(request, { ignoreSearch: true });
			await cache.put(request, response.clone());
			await trim(cache, MAX_LESSONS);
		}
		return response;
	} catch {
		return (await cache.match(request, { ignoreSearch: true })) ?? (await caches.match(OFFLINE_URL));
	}
}

async function pageOrOffline(request) {
	try {
		return await fetch(request);
	} catch {
		return caches.match(OFFLINE_URL);
	}
}

/** Keeps the newest `max` entries; Cache.keys() lists them in insertion order. */
async function trim(cache, max) {
	const keys = await cache.keys();
	await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)));
}
