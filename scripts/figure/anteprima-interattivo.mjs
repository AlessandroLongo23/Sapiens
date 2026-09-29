/**
 * Screenshot di una figura interattiva o di una scena degli esercizi, dalla pagina di prova del sito in sviluppo
 * (src/app/prova-fisica, solo con `next dev`).
 *
 *   node scripts/figure/anteprima-interattivo.mjs <uscita.png> figura=<nome> [--scuro] [--telefono] [--porta 3000]
 *   node scripts/figure/anteprima-interattivo.mjs <uscita.png> scena=<tipo> 'dati={"angolo":30}' [--scuro] [--telefono]
 *
 * Con --scuro la pagina è nel tema scuro, con --telefono larga 390 px. Stampa gli errori della console e dice se la
 * pagina scorre di lato. Con `--clic "selettore"` clicca un elemento prima dello screenshot (per esempio un bottone
 * di un'animazione: `--clic "button:has-text('Avvia')" --attendi 1500`).
 */
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, d) => (args.includes(name) ? args[args.indexOf(name) + 1] : d);
const skip = new Set(['--porta', '--clic', '--attendi'].flatMap((n) => (args.includes(n) ? [args.indexOf(n) + 1] : [])));
const plain = args.filter((a, i) => !a.startsWith('--') && !skip.has(i));
const [out, ...query] = plain;
if (!out || query.length === 0) {
	console.log('uso: node scripts/figure/anteprima-interattivo.mjs <uscita.png> figura=<nome> | scena=<tipo> dati=<json> [--scuro] [--telefono]');
	process.exit(1);
}
const params = new URLSearchParams(query.map((q) => [q.slice(0, q.indexOf('=')), q.slice(q.indexOf('=') + 1)]));
const url = `http://localhost:${value('--porta', '3000')}/prova-fisica?${params}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: flag('--telefono') ? 390 : 800, height: 200 }, deviceScaleFactor: 2 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
if (flag('--scuro')) await page.evaluate(() => document.documentElement.classList.add('dark'));
await page.waitForSelector('#prova svg, #errore', { timeout: 60000 }).catch(() => errors.push('nessun <svg> nella pagina'));
// The cookie banner, the dev indicator and anything else pinned to the screen would cover the figure.
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
await page.evaluate(() => {
	for (const el of document.body.querySelectorAll('*')) if (!el.closest('#prova') && ['fixed', 'sticky'].includes(getComputedStyle(el).position)) el.style.display = 'none';
});
if (args.includes('--clic')) await page.click(value('--clic'));
await page.waitForTimeout(Number(value('--attendi', '300')));
const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
await page.locator('#prova').screenshot({ path: out });
await browser.close();
console.log(`${out}${wide ? '  ATTENZIONE: la pagina scorre di lato' : ''}`);
for (const e of errors) console.log(`errore: ${e}`);
process.exitCode = errors.length || wide ? 1 : 0;
