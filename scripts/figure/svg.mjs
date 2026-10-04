/**
 * The TikZ figures of a lesson file that have not been published yet, compiled as the publication compiles them and
 * printed as JSON: one `{ svg, width, height }` per ```tikz block without a `% svg:` line, in the order of the file
 * (null for one that does not compile). The trial page of lesson files (/prova-grafico/lezione) calls it, so a
 * lesson is seen with its figures before it is published.
 *
 *   node scripts/figure/svg.mjs docs/lezioni/informatica/riscritte/57-inf-selezione-due-vie.md
 */
import { readFileSync } from 'node:fs';
import { compileFigure } from './compile.mjs';

const TIKZ_LIBRARIES = 'arrows.meta,decorations.pathmorphing,decorations.markings,patterns,calc';

const text = readFileSync(process.argv[2], 'utf8');
const figures = [];
for (const [, block] of text.matchAll(/```tikz\n([\s\S]+?)```/g)) {
	if (/^% svg:/m.test(block)) continue;
	const code = block
		.split('\n')
		.filter((line) => !/^% (nome|alt|svg):/.test(line))
		.join('\n');
	try {
		figures.push(await compileFigure(code, { tikzLibraries: TIKZ_LIBRARIES }));
	} catch {
		figures.push(null);
	}
}
process.stdout.write(JSON.stringify(figures));
