// Makes the two PDFs of the periodic table in public/tavola-periodica/ from the print pages of a running server.
//
//   BASE=http://localhost:3000 node scripts/tavola-periodica/pdf.mjs
//
// To run again whenever the data (src/lib/tools/elementi.json), the sheet (PeriodicSheet.tsx) or the name of the
// site change.
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/tavola-periodica');
const FILES = { colori: 'tavola-periodica-degli-elementi.pdf', 'bianco-nero': 'tavola-periodica-bianco-e-nero.pdf' };

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [variant, file] of Object.entries(FILES)) {
	await page.goto(`${BASE}/strumenti/tavola-periodica/stampa/${variant}`, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.pdf({ path: path.join(out, file), preferCSSPageSize: true, printBackground: true });
	console.log(file);
}
await browser.close();
