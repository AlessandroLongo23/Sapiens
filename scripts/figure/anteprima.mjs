/**
 * Anteprima delle figure TikZ di una o più lezioni, compilate come le compila la pubblicazione, in PNG da guardare.
 *
 *   node scripts/figure/anteprima.mjs <cartella di uscita> <file.md> [altri file.md] [--scuro] [--solo nome]
 *
 * Per ogni file compila ogni blocco ```tikz (con `% nome` e `% alt`) con le librerie di scripts/lezioni/publish.mts
 * e scrive <uscita>/<file>-chiaro.png: le figure una sotto l'altra, alla scala del sito, ciascuna con il suo nome.
 * Con --scuro anche <file>-scuro.png, invertito come nel tema scuro del sito. Con --solo, solo le figure il cui nome
 * contiene quel testo. Un errore di TeX si stampa con il nome della figura e il file va avanti.
 * Usa il Playwright della radice del progetto.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { chromium } from 'playwright';
import { compileFigure } from './compile.mjs';

const TIKZ_LIBRARIES = 'arrows.meta,decorations.pathmorphing,decorations.markings,patterns,calc';
/** FIGURE_SCALE of src/lib/content/figures.ts: the site shows TikZ at 1.5 times its size. */
const SCALE = 1.5;

const args = process.argv.slice(2);
const dark = args.includes('--scuro');
const onlyAt = args.indexOf('--solo');
const only = onlyAt >= 0 ? args[onlyAt + 1] : null;
const [out, ...files] = args.filter((a, i) => !a.startsWith('--') && (onlyAt < 0 || i !== onlyAt + 1));
if (!out || files.length === 0) {
	console.log('uso: node scripts/figure/anteprima.mjs <cartella di uscita> <file.md> [...] [--scuro] [--solo nome]');
	process.exit(1);
}
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
let failed = 0;
for (const file of files) {
	const md = readFileSync(file, 'utf8');
	const parts = [];
	for (const m of md.matchAll(/```tikz\n([\s\S]+?)```/g)) {
		const lines = m[1].split('\n');
		const name = lines.find((l) => l.startsWith('% nome:'))?.slice(7).trim() ?? '(senza nome)';
		if (only && !name.includes(only)) continue;
		const code = lines.filter((l) => !/^% (nome|alt|svg):/.test(l)).join('\n');
		try {
			const { svg, width, height } = await compileFigure(code, { tikzLibraries: TIKZ_LIBRARIES });
			const sized = svg.replace(/<svg([^>]*?)\swidth="[\d.]+"([^>]*?)\sheight="[\d.]+"/, `<svg$1 width="${(width * SCALE).toFixed(1)}"$2 height="${(height * SCALE).toFixed(1)}"`);
			parts.push(`<section><p>${name} (${Math.round(width * SCALE)}×${Math.round(height * SCALE)} px)</p><div class="fig">${sized}</div></section>`);
		} catch (e) {
			failed++;
			console.log(`ERRORE ${basename(file)}, figura "${name}": ${e.message.split('\n')[0]}`);
			parts.push(`<section><p>${name}: ERRORE DI COMPILAZIONE</p></section>`);
		}
	}
	if (parts.length === 0) {
		console.log(`${basename(file)}: nessuna figura`);
		continue;
	}
	for (const scheme of dark ? ['chiaro', 'scuro'] : ['chiaro']) {
		const page = await browser.newPage({ viewport: { width: 760, height: 80 }, deviceScaleFactor: 1 });
		const bg = scheme === 'scuro' ? '#16181d' : '#fff';
		const fg = scheme === 'scuro' ? '#ddd' : '#333';
		const filter = scheme === 'scuro' ? '.fig svg{filter:invert(1) hue-rotate(180deg)}' : '';
		await page.setContent(`<style>body{font:13px sans-serif;background:${bg};color:${fg};margin:16px}section{margin-bottom:28px}p{margin:0 0 8px}.fig{max-width:720px}.fig svg{max-width:100%;height:auto}${filter}</style>${parts.join('')}`);
		const png = resolve(out, `${basename(file, '.md')}-${scheme}.png`);
		await page.screenshot({ path: png, fullPage: true });
		await page.close();
		console.log(`${basename(file)}: ${parts.length} figure → ${png}`);
	}
}
await browser.close();
process.exitCode = failed ? 1 : 0;
