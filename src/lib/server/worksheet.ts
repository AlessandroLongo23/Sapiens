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
 * the result under each. Unlike a run, it is the same for everybody and on every visit: the seeds derive from the
 * lesson and the sheet number, so the page Google indexes is the page a student reads. Sheet 1 is the one at
 * `esercizi/scheda`; "Un'altra scheda" asks for the next ones (`?numero=<n>`), which are not indexed.
 */

/** Exercises per level on a sheet. */
export const SHEET_PER_LEVEL = 6;
/** Sheets a lesson offers: enough for a month of homework, not an endless space of URLs for a crawler. */
export const SHEET_MAX = 20;
/** Seeds tried per level to find SHEET_PER_LEVEL different exercises. */
const TRIES = 40;

export interface SheetItem {
	/** Number on the sheet, 1 onwards across levels, as in a textbook. */
	number: number;
	promptHtml: string;
	blocks: QuestionBlock[];
	/** The options, for exercises that are a choice by nature (true or false, which set); null for the others. */
	optionsHtml: string[] | null;
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
	sheet: number;
	count: number;
	levels: SheetLevel[];
}

/** FNV-1a: a stable 32-bit seed from the lesson path and the sheet number. */
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

function item(number: number, s: Sample): SheetItem {
	const text = s.format === 'text';
	const blocks: QuestionBlock[] = !s.problem.trim()
		? []
		: text
			? [{ kind: isAsk(s.problem) ? 'ask' : 'text', html: textHtml(s.problem) }]
			: presentProblem(s.problem).map((b): QuestionBlock =>
					b.kind === 'text' ? { kind: isAsk(b.tex) ? 'ask' : 'text', html: renderMath(b.tex) } : b.kind === 'givens' ? { kind: 'givens', items: b.items.map((t) => renderTex(t, false)) } : { kind: 'math', html: renderTex(`\\displaystyle ${b.tex}`, false) }
				);
	if (s.figure) blocks.push({ kind: 'figure', html: figureHtml(s.figure) });
	const asks = blocks.some((b) => b.kind === 'ask');
	const prompt = IMPLIED_PROMPTS.has(s.prompt) || (asks && GENERIC_PROMPTS.has(s.prompt)) ? '' : s.prompt;

	// On paper an exercise is answered in full: options only where the exercise is a choice to begin with.
	const choice: ChoiceAnswer | null = s.answer.kind === 'choice' ? s.answer : null;
	// An option in words (`\text{I numeri pari} \\ \text{compresi tra 7 e 21}`, maybe in a `gathered`) becomes one
	// line of prose that wraps: the breaks were made for a button.
	const option = (o: ChoiceAnswer['options'][number]) =>
		o.figure ? figureHtml(o.figure) : text ? textHtml(o.latex) : renderMath(presentStep(o.latex.replace(/\\(?:begin|end)\{gathered\}/g, '').replace(/\\\\/g, ' ')));
	const solution = text ? textHtml(s.solution) : renderMath(presentStep(s.solution));
	return {
		number,
		promptHtml: prompt ? (text ? textHtml(prompt) : renderMath(prompt)) : '',
		blocks,
		optionsHtml: choice ? choice.options.map(option) : null,
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

async function build(dbPath: string, sheet: number): Promise<Worksheet | null> {
	const config = configs[dbPath];
	const load = config && generators[config.generator];
	if (!load) return null;
	const generator = await load();
	const base = hash(`${dbPath}#${sheet}`);
	let number = 0;
	const levels = config.levels
		.map((level): SheetLevel => {
			const items = samples(generator, base, level, SHEET_PER_LEVEL).map((s) => item(++number, s));
			const shared = items.length > 1 && items.every((i) => i.promptHtml && i.promptHtml === items[0].promptHtml) ? items[0].promptHtml : '';
			return { level, name: levelName(config.generator, level), promptHtml: shared, items: shared ? items.map((i) => ({ ...i, promptHtml: '' })) : items };
		})
		.filter((l) => l.items.length > 0);
	return levels.length ? { sheet, count: number, levels } : null;
}

// A sheet never changes for a given build, so each one is built once per server instance.
const built = new Map<string, Promise<Worksheet | null>>();

/** Sheet `sheet` (1 to SHEET_MAX) of a lesson, by database path; null when the lesson has no exercises. */
export function worksheet(dbPath: string, sheet = 1): Promise<Worksheet | null> {
	const n = Number.isInteger(sheet) && sheet >= 1 && sheet <= SHEET_MAX ? sheet : 1;
	const key = `${dbPath}#${n}`;
	let sheetPromise = built.get(key);
	if (!sheetPromise) {
		sheetPromise = build(dbPath, n).catch((err) => {
			built.delete(key);
			throw err;
		});
		built.set(key, sheetPromise);
	}
	return sheetPromise;
}
