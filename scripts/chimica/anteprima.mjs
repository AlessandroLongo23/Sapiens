/**
 * Anteprima delle figure di chimica, in chiaro e in scuro, come PNG da guardare.
 *
 *   node scripts/chimica/anteprima.mjs <uscita senza estensione> [filtro sul nome del file]
 *
 * Mette in una pagina tutti gli SVG di docs/lezioni/chimica/figure/ il cui nome contiene il filtro e
 * scrive <uscita>-chiaro.png e <uscita>-scuro.png. Usa il Playwright della radice del progetto.
 */
import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';

const dir = 'docs/lezioni/chimica/figure';
const [out, filter = ''] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith('.svg') && f.includes(filter)).sort();
const body = files.map((f) => `<div><p>${f}</p>${readFileSync(`${dir}/${f}`, 'utf8')}</div>`).join('');
const browser = await chromium.launch();
for (const [scheme, bg, fg] of [['chiaro', '#fff', '#222'], ['scuro', '#0d1117', '#ddd']]) {
	const page = await browser.newPage({ colorScheme: scheme === 'scuro' ? 'dark' : 'light', viewport: { width: 1100, height: 600 }, deviceScaleFactor: 1.5 });
	await page.setContent(`<style>body{font:12px sans-serif;background:${bg};color:${fg};display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}svg{zoom:1.3}</style>${body}`);
	await page.screenshot({ path: `${out}-${scheme}.png`, fullPage: true });
}
await browser.close();
console.log(`${files.length} figure → ${out}-chiaro.png, ${out}-scuro.png`);
