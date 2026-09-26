/**
 * Measures how wide a generator's problems and answer options are on a phone, as the exercise page draws
 * them: KaTeX in display mode, the problem at 18 px in about 350 px, each option at 16 px in the 252 px an
 * answer button leaves (RunPlayer.tsx: px-12, text-base). Wider than that, the page cuts the formula and
 * the student has to scroll sideways.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/width.mts <id> [<id> …]
 *
 * For each level: problems over 350 px and options over 252 px, out of 150 exercises, with the widest.
 * Exits with 1 if anything is over. Needs Playwright's Chromium (installed with the e2e tests).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import katex from 'katex';
import { chromium } from 'playwright';
import { getGenerator } from '../../src/lib/exercises/v2/registry';
import { createRng } from '../../src/lib/exercises/v2/rng';

const PROBLEM = { px: 18, max: 350 };
const OPTION = { px: 16, max: 252 };
const SAMPLES = 150;

const katexDir = createRequire(import.meta.url).resolve('katex/dist/katex.min.css').replace(/katex\.min\.css$/, '');
const css = readFileSync(`${katexDir}katex.min.css`, 'utf8').replace(/url\(fonts\//g, `url(file://${katexDir}fonts/`);

const browser = await chromium.launch();
const page = await browser.newPage();

/** Rendered widths of the given formulas at a font size. */
async function widths(tex: string[], px: number): Promise<number[]> {
	const html = tex.map((t) => `<div class="w">${katex.renderToString(t, { displayMode: true, throwOnError: false })}</div>`).join('');
	await page.setContent(`<style>${css} body{font-size:${px}px} .w{width:max-content}</style>${html}`);
	await page.evaluate(() => document.fonts.ready);
	return page.evaluate(() => [...document.querySelectorAll('.w .katex')].map((e) => e.getBoundingClientRect().width));
}

const report = (ws: number[], max: number) => `${ws.filter((w) => w > max).length}/${ws.length} max ${ws.length ? Math.round(Math.max(...ws)) : 0}`;

let over = 0;
for (const id of process.argv.slice(2)) {
	const g = await getGenerator(id);
	console.log(id);
	for (const level of Object.keys(g.levels).map(Number)) {
		const problems: string[] = [];
		const options: string[] = [];
		for (let s = 1; s <= SAMPLES; s++) {
			const x = g.generate(createRng(s * 7919 + level), level);
			if (x.format === 'text') continue;
			problems.push(x.problem);
			const choice = x.answer.kind === 'choice' ? x.answer : g.toChoice?.(x, createRng(s + 99));
			for (const o of choice?.options ?? []) if (!o.figure) options.push(o.latex);
		}
		const p = await widths(problems, PROBLEM.px);
		const o = await widths(options, OPTION.px);
		over += p.filter((w) => w > PROBLEM.max).length + o.filter((w) => w > OPTION.max).length;
		console.log(`  livello ${level}: problemi oltre ${PROBLEM.max} px ${report(p, PROBLEM.max)}, opzioni oltre ${OPTION.max} px ${report(o, OPTION.max)}`);
	}
}
await browser.close();
process.exitCode = over ? 1 : 0;
