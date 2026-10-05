import { chartHtml, codeHtml } from '@/lib/server/exercises';
import 'server-only';
import { configs } from '@/lib/exercises/config';
import { generators } from '@/lib/exercises';
import { levelName } from '@/lib/exercises/level-names';
import { createRng, deriveSeed } from '@/lib/exercises/v2/rng';
import type { ChoiceAnswer, Generator, Sample } from '@/lib/exercises/v2/types';
import { presentProblem, presentStep } from '@/lib/exercises/present';
import { renderMath, renderTex } from '@/lib/content/markdown';
import { figureUrl } from '@/lib/content/figures';
import { escapeHtml } from '@/lib/utils/escape';
import type { QuestionBlock } from '@/lib/server/exercises';

/**
 * The worksheet of a lesson: the exercises to do at a desk, on paper, one after another, as in a textbook, with
 * the result under each. There is one a day: the seeds derive from the lesson and the date, so on a given day the
 * sheet is the same for everybody and on every visit (the page Google indexes is the page a student reads), and
 * tomorrow it is another. Past days stay where they were (`?giorno=<date>`), and are not indexed.
 */

/** Exercises per level on a sheet. */
export const SHEET_PER_LEVEL = 6;
/** Seeds tried per level to find SHEET_PER_LEVEL different exercises. */
const TRIES = 40;

export interface SheetItem {
	/** Number on the sheet, 1 onwards across levels, as in a textbook. */
	number: number;
	promptHtml: string;
	blocks: QuestionBlock[];
	/** The options, for exercises that are a choice by nature (true or false, which set); null for the others. */
	optionsHtml: string[] | null;
	/** Width of an option's column, in rem, from the longest option: short ones sit four to a row, long ones fewer. */
	optionWidth: number;
	/** The result: the right option's letter and text, or the final solution. */
	answerHtml: string;
}

export interface SheetLevel {
	level: number;
	name: string | null;
	/** The instruction, when every exercise of the level has the same: written once, as a textbook does. */
	promptHtml: string;
	items: SheetItem[];
}

export interface Worksheet {
	/** The day, `2026-09-27`: the sheet's seed. */
	day: string;
	count: number;
	levels: SheetLevel[];
}

/** FNV-1a: a stable 32-bit seed from the lesson path and the day. */
function hash(text: string): number {
	let h = 0x811c9dc5;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

// The typesetting below follows `view` in src/lib/server/exercises.ts, so a problem reads the same on the sheet
// and in a run; formulas on their own line are set inline in display style, left-aligned as on a printed page.

const GENERIC_PROMPTS = new Set(['Scegli la risposta corretta.']);
const IMPLIED_PROMPTS = new Set(["Risolvi l'equazione."]);
const isAsk = (tex: string) => tex.trim().endsWith('?') && tex.length <= 100;

const textHtml = (text: string) =>
	text
		.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)
		.map((part, i) => (i % 2 ? renderMath(part) : escapeHtml(part)))
		.join('');

function figureHtml(ref: NonNullable<Sample['figure']>): string {
	const src = figureUrl(process.env.PUBLIC_SUPABASE_URL ?? '', ref.file);
	return `<img src="${src}" alt="${escapeHtml(ref.alt)}" width="${ref.width}" height="${ref.height}" class="h-auto max-w-full dark:invert dark:hue-rotate-180" loading="lazy" decoding="async">`;
}

const LETTERS = 'abcdefgh';

/** About how many characters a formula or a line of text takes once set: commands count as one symbol. */
const printedLength = (source: string) => source.replace(/\\(?:begin|end)\{[a-z]+\}/g, '').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\[a-zA-Z]+/g, 'x').replace(/[{}^_$\\ ]/g, '').length;

/** A column that holds the longest option on one line, up to a width that wraps text of a few words anyway. A
 *  symbol of a formula, with the space around a relation, takes about 0.85rem; a letter of text half that. */
const optionWidth = (lengths: number[], text: boolean) => Math.min(22, Math.max(7, Math.round(Math.max(...lengths) * (text ? 0.5 : 0.85) + 3)));

function item(number: number, s: Sample): SheetItem {
	const text = s.format === 'text';
	const blocks: QuestionBlock[] = !s.problem.trim()
		? []
		: text
			? [{ kind: isAsk(s.problem) ? 'ask' : 'text', html: textHtml(s.problem) }]
			: presentProblem(s.problem).map((b): QuestionBlock =>
					b.kind === 'text' ? { kind: isAsk(b.tex) ? 'ask' : 'text', html: renderMath(b.tex) } : b.kind === 'givens' ? { kind: 'givens', items: b.items.map((t) => renderTex(t, false)) } : { kind: 'math', html: renderTex(`\\displaystyle ${b.tex}`, false) }
				);
	if (s.code) blocks.push({ kind: 'code', html: codeHtml(s.code) });
	if (s.chart) blocks.push({ kind: 'figure', html: chartHtml(s.chart) });
	if (s.figure) blocks.push({ kind: 'figure', html: figureHtml(s.figure) });
	if (s.scene) blocks.push({ kind: 'scene', scene: s.scene });
	const asks = blocks.some((b) => b.kind === 'ask');
	const prompt = IMPLIED_PROMPTS.has(s.prompt) || (asks && GENERIC_PROMPTS.has(s.prompt)) ? '' : s.prompt;

	// On paper an exercise is answered in full: options only where the exercise is a choice to begin with.
	const choice: ChoiceAnswer | null = s.answer.kind === 'choice' ? s.answer : null;
	// An option in words (`\text{I numeri pari} \\ \text{compresi tra 7 e 21}`, maybe in a `gathered`) becomes one
	// line of prose that wraps: the breaks were made for a button.
	const option = (o: ChoiceAnswer['options'][number]) =>
		o.chart !== undefined ? chartHtml(o.chart, o.text ?? 'Diagramma di flusso') : o.code ? codeHtml(o.code) : o.figure ? figureHtml(o.figure) : text ? textHtml(o.latex) : renderMath(presentStep(o.latex.replace(/\\(?:begin|end)\{gathered\}/g, '').replace(/\\\\/g, ' ')));
	const solution = text ? textHtml(s.solution) : renderMath(presentStep(s.solution));
	return {
		number,
		promptHtml: prompt ? (text ? textHtml(prompt) : renderMath(prompt)) : '',
		blocks,
		optionsHtml: choice ? choice.options.map(option) : null,
		optionWidth: choice ? optionWidth(choice.options.map((o) => (o.figure || o.chart !== undefined || o.code ? 40 : printedLength(o.latex))), text) : 0,
		answerHtml: choice ? `<b>${LETTERS[choice.correct]})</b> ${option(choice.options[choice.correct])}` : solution
	};
}

/** Up to `count` different exercises at a level, from seeds fixed by `base`. */
function samples(generator: Generator, base: number, level: number, count: number): Sample[] {
	const out: Sample[] = [];
	const seen = new Set<string>();
	for (let i = 0; i < TRIES && out.length < count; i++) {
		let s: Sample;
		try {
			s = generator.generate(createRng(deriveSeed(base, level * 1000 + i)), level);
		} catch {
			continue;
		}
		const key = `${s.prompt}\n${s.problem}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(s);
	}
	return out;
}

async function build(dbPath: string, day: string): Promise<Worksheet | null> {
	const config = configs[dbPath];
	const load = config && generators[config.generator];
	if (!load) return null;
	const generator = await load();
	const base = hash(`${dbPath}#${day}`);
	let number = 0;
	const levels = config.levels
		.map((level): SheetLevel => {
			const items = samples(generator, base, level, SHEET_PER_LEVEL).map((s) => item(++number, s));
			const shared = items.length > 1 && items.every((i) => i.promptHtml && i.promptHtml === items[0].promptHtml) ? items[0].promptHtml : '';
			return { level, name: levelName(config.generator, level), promptHtml: shared, items: shared ? items.map((i) => ({ ...i, promptHtml: '' })) : items };
		})
		.filter((l) => l.items.length > 0);
	return levels.length ? { day, count: number, levels } : null;
}

// A day's sheet never changes for a given build, so each one is built once per server instance. Most visits ask for
// today's; the map is emptied when it grows past what a few days of every lesson take.
const built = new Map<string, Promise<Worksheet | null>>();
const BUILT_MAX = 1000;

/** The sheet of `day` (an ISO date, checked by the caller) of a lesson, by database path; null when the lesson has no exercises. */
export function worksheet(dbPath: string, day: string): Promise<Worksheet | null> {
	const key = `${dbPath}#${day}`;
	let sheetPromise = built.get(key);
	if (!sheetPromise) {
		if (built.size >= BUILT_MAX) built.clear();
		sheetPromise = build(dbPath, day).catch((err) => {
			built.delete(key);
			throw err;
		});
		built.set(key, sheetPromise);
	}
	return sheetPromise;
}
