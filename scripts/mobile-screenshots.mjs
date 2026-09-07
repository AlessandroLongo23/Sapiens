// Screenshots of the main pages on phones, tablets and desktop, for a
// quick look at the layout while iterating on the UI.
//
//   node scripts/mobile-screenshots.mjs
//   TARGETS=iphonese,galaxys24 FULL=1 node scripts/mobile-screenshots.mjs
//
// BASE (default http://localhost:5173) is the server to hit, OUT the folder
// for the images (default screenshots/), TARGETS a comma-separated list of
// the profiles below, FULL=1 for full-page captures, CONSENT=0 to keep the
// cookie banner. Every page is also checked for sideways overflow.
import { chromium, webkit, devices } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const OUT = process.env.OUT ?? 'screenshots';
mkdirSync(OUT, { recursive: true });

const pages = [
	['home', '/'],
	['materiale', '/materiale'],
	['subject', '/materiale/scuola-superiore/matematica'],
	['theory', '/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni'],
	['exercises', '/materiale/scuola-superiore/matematica/insiemi-e-logica/operazioni-e-relazioni-tra-insiemi/esercizi'],
	['ripetizioni', '/ripetizioni'],
	['pricing', '/pricing'],
	['faq', '/faq']
];

const profiles = {
	iphonese: { device: devices['iPhone SE'], browser: webkit },
	iphone14: { device: devices['iPhone 14'], browser: webkit },
	iphone15promax: { device: devices['iPhone 15 Pro Max'], browser: webkit },
	pixel7: { device: devices['Pixel 7'], browser: chromium },
	galaxys24: { device: devices['Galaxy S24'], browser: chromium },
	ipadmini: { device: devices['iPad Mini'], browser: webkit },
	desktop: { device: devices['Desktop Chrome'], browser: chromium }
};

const targets = (process.env.TARGETS ?? 'iphone14,pixel7').split(',');
const consent = {
	name: 'sapiens-cookie-consent',
	value: encodeURIComponent(
		JSON.stringify({ necessary: true, analytics: false, version: '2026-09-03', timestamp: new Date().toISOString() })
	),
	url: BASE
};

for (const name of targets) {
	const profile = profiles[name];
	if (!profile) {
		console.log(name, 'unknown profile; pick from', Object.keys(profiles).join(', '));
		continue;
	}
	const browser = await profile.browser.launch();
	const context = await browser.newContext({ ...profile.device, locale: 'it-IT' });
	if (process.env.CONSENT !== '0') await context.addCookies([consent]);
	const page = await context.newPage();
	for (const [label, path] of pages) {
		try {
			await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 });
			await page.waitForTimeout(600);
			await page.screenshot({ path: `${OUT}/${name}-${label}.png`, fullPage: process.env.FULL === '1' });
			const w = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, vw: window.innerWidth }));
			console.log(name, label, w.doc > w.vw ? `HORIZONTAL OVERFLOW ${w.doc}>${w.vw}` : 'ok');
		} catch (e) {
			console.log(name, label, 'ERR', e.message.split('\n')[0]);
		}
	}
	await browser.close();
}
