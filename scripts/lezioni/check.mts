/**
 * Checks lesson markdown files against docs/lezioni/stile.md.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/riscritte/*.md
 *
 * Errors (exit code 1): first lines not "# Title" + blank, LaTeX that KaTeX
 * cannot parse, unbalanced $ or code fences, links to lesson URLs missing from
 * docs/lezioni/url.md, unknown ad-* blocks. Warnings: style rules of the brief.
 * Files under a `flashcard/` directory are also parsed as cards
 * (src/lib/content/flashcards.ts), and there the `---` line is the card's
 * divider, not a separator.
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import katexModule from 'katex';
import { parseFlashcards } from '../../src/lib/content/flashcards';
import { parse as parseLatex } from '@cortex-js/compute-engine/latex-syntax';
import { parsePlotBlock, readPlotBlock } from '../../src/lib/grafico/blocco';
import { cleanLatex, type Json } from '../../src/lib/grafico/formula';
import { codeFences, parseCodeBlock } from '../../src/lib/codice/blocco';
import { parseChartBlock } from '../../src/lib/diagramma/blocco';
import { buildChart } from '../../src/lib/diagramma/disegno';
import { runAll } from '../../src/lib/diagramma/esecuzione';
import { guidedFences, parseGuidedBlock } from '../../src/lib/guidato/blocco';
import { checkGuided } from '../../src/lib/guidato/correzione';

const katex = ((katexModule as unknown as { default?: typeof katexModule }).default ?? katexModule) as typeof katexModule;

const ADMONITIONS = new Set(['note', 'tip', 'warning', 'error', 'example', 'info']);
const BANNED: [RegExp, string][] = [
	[/—/, 'trattino lungo'],
	[/piuttosto che/i, '"piuttosto che"'],
	[/è (importante|fondamentale) (notare|sottolineare|ricordare)/i, '"è importante notare"'],
	[/vediamo insieme|andiamo a (vedere|scoprire)|scopriamo/i, 'formula di passaggio'],
	[/in conclusione|in sintesi|in poche parole/i, 'chiusura di maniera'],
	[/\b(fondamentale|cruciale|essenziale)\b/i, 'riempitivo'],
	[/in questa lezione (vedremo|impareremo)/i, 'annuncio'],
	[/\bsemplicemente\b/i, '"semplicemente"'],
];

const urls = new Set(
	['docs/lezioni/url.md', 'docs/lezioni/fisica/url.md', 'docs/lezioni/chimica/url.md', 'docs/lezioni/informatica/url.md'].flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/(\/materiale\/[^\s)]+)/g)].map((m) => m[1])),
);

let errors = 0;
for (const file of process.argv.slice(2)) {
	const text = readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
	const out: string[] = [];
	const err = (m: string) => {
		errors++;
		out.push(`  ERRORE ${m}`);
	};
	const warn = (m: string) => out.push(`  avviso ${m}`);
	const lines = text.split('\n');
	if (!/^# \S/.test(lines[0] ?? '') || lines[1] !== '') err('le prime due righe devono essere "# Titolo" e una riga vuota');
	const flashcards = /(^|\/)flashcard\//.test(file);
	if (flashcards) {
		const { cards, errors: cardErrors } = parseFlashcards(text);
		cardErrors.forEach(err);
		out.push(`  ${cards.length} carte`);
		for (const c of cards) if (/```|^#/m.test(c.front + '\n' + c.back)) err(`carta "${c.id}": niente riquadri, figure o titoli dentro una carta`);
	}

	// Code fences: balanced, known admonitions; their content is not prose.
	const fences = lines.filter((l) => /^\s*```/.test(l));
	if (fences.length % 2) err('blocchi ``` non chiusi');
	for (const l of fences) {
		const m = l.trim().match(/^```ad-(\w+)/);
		if (m && !ADMONITIONS.has(m[1])) err(`riquadro sconosciuto ad-${m[1]}`);
	}
	// The first plain line of an ad-* block becomes its title (see admonitionPlugin in src/lib/content/markdown.ts).
	for (const m of text.matchAll(/```ad-\w+\n([\s\S]*?)```/g)) {
		const body = m[1].trim().split('\n');
		const first = body[0]?.trim() ?? '';
		if (!first || first.startsWith('#') || first.startsWith('-')) continue;
		if (body.length === 1) err(`riquadro con una sola riga, che diventerebbe tutta titolo: ${first.slice(0, 60)}`);
		else if (first.length > 70 || first.includes('$$')) err(`titolo del riquadro troppo lungo: ${first.slice(0, 60)}`);
	}
	for (const m of text.matchAll(/```tikz\n([\s\S]*?)```/g)) {
		if (!/^%\s*nome:\s*\S/m.test(m[1]) || !/^%\s*alt:\s*\S/m.test(m[1])) err('figura TikZ senza "% nome:" o "% alt:" (servono per il file SVG e per Google Immagini)');
	}
	for (const m of text.matchAll(/```interattivo\n([\s\S]*?)```/g)) {
		if (!/^%\s*nome:\s*\S/m.test(m[1]) || !/^%\s*alt:\s*\S/m.test(m[1])) err('figura interattiva senza "% nome:" o "% alt:"');
	}
	// A plane of the plotter: its lines must be read, its formulas drawn, and every letter must have its slider.
	for (const m of text.matchAll(/```grafico\n([\s\S]*?)```/g)) {
		const { plot, errors } = parsePlotBlock(m[1]);
		const name = /^%\s*nome:\s*(\S+)/m.exec(m[1])?.[1] ?? 'senza nome';
		for (const e of plot ? readPlotBlock(plot, (latex) => parseLatex(latex) as Json, cleanLatex).errors : errors) err(`grafico ${name}: ${e}`);
	}
	// A program: its language and its parts must be read. Whether a solution passes its tests is for scripts/codice/verifica.mts.
	for (const group of codeFences(text)) for (const e of parseCodeBlock(group.fences).errors) err(`codice: ${e}`);
	// Inline code is not prose and holds no formulas: a dollar there is a dollar (a spreadsheet's `$B$2`).
	// A flowchart must be read, and with the values of "% ingresso" it must run to its end.
	for (const m of text.matchAll(/```diagramma\n([\s\S]*?)```/g)) {
		const { block, errors } = parseChartBlock(m[1]);
		for (const e of errors) err(`diagramma: ${e}`);
		if (!block) continue;
		const run = runAll(buildChart(block.program), block.inputs);
		if (run.error) err(`diagramma ${block.name}: ${run.error}`);
	}
	// A guided exercise: its lines must be read, the grader must pass each expected answer and fail each foreseen
	// mistake, and a slider must be able to reach its expected value. Its text and its plane are checked with the rest.
	for (const guided of guidedFences(text)) {
		const { read, errors } = parseGuidedBlock(guided.body);
		const name = /^%\s*nome:\s*(\S+)/m.exec(guided.body)?.[1] ?? 'senza nome';
		for (const e of [...errors, ...checkGuided(read)]) err(`guidato ${name}: ${e}`);
	}
	const noTikz = text.replace(/```(tikz|interattivo|grafico|codice|diagramma)[\s\S]*?```/g, '').replace(/`[^`\n]+`/g, ' ');

	// Math: display first, then inline, each parsed by KaTeX.
	let rest = noTikz.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => {
		try {
			katex.renderToString(tex, { displayMode: true, throwOnError: true });
		} catch (e) {
			err(`LaTeX: ${(e as Error).message.split('\n')[0]} in $$${tex.trim().slice(0, 60)}$$`);
		}
		return ' ';
	});
	rest = rest.replace(/\$([^$\n]+?)\$/g, (_, tex: string) => {
		try {
			katex.renderToString(tex, { throwOnError: true });
		} catch (e) {
			err(`LaTeX: ${(e as Error).message.split('\n')[0]} in $${tex.slice(0, 60)}$`);
		}
		return ' ';
	});
	if (rest.includes('$')) err('simbolo $ spaiato');

	for (const m of rest.matchAll(/\]\((\/materiale\/[^)\s#]+)(#[^)]*)?\)/g)) {
		if (!urls.has(m[1])) err(`link a una lezione che non esiste: ${m[1]}`);
	}
	for (const m of rest.matchAll(/\]\((https?:[^)]+)\)/g)) warn(`link esterno: ${m[1]}`);

	// Style warnings, on prose only.
	lines.forEach((l, i) => {
		const h = l.match(/^#{2,4}\s+(.*)$/);
		if (h) {
			const words = h[1].replace(/\$[^$]*\$/g, '').split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]{4,}$/.test(w));
			if (words.slice(1).some((w) => /^[A-ZÀ-Ý][a-zà-ÿ]/.test(w))) warn(`riga ${i + 1}: titolo con maiuscole all'inglese: ${h[1]}`);
			if (/^\d+[.)]/.test(h[1])) warn(`riga ${i + 1}: titolo numerato: ${h[1]}`);
		}
		if (!flashcards && /^\s*(---|\*\*\*)\s*$/.test(l)) warn(`riga ${i + 1}: separatore ---`);
	});
	for (const [re, name] of BANNED) {
		const hits = noTikz.split('\n').map((l, i) => (re.test(l) ? i + 1 : 0)).filter(Boolean);
		if (hits.length) warn(`${name} alle righe ${hits.join(', ')}`);
	}
	const bold = (noTikz.match(/\*\*[^*]+\*\*/g) ?? []).length;
	if (bold > 12) warn(`${bold} grassetti: vanno solo sui termini definiti`);

	console.log(`${basename(file)}: ${text.length} caratteri${out.some((o) => /ERRORE|avviso/.test(o)) ? '' : ', ok'}`);
	out.forEach((o) => console.log(o));
}
process.exitCode = errors ? 1 : 0;
