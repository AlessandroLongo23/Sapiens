/**
 * The guided exercise of a lesson, as its author writes it: a ```guidato block in the lesson's markdown. It is a
 * worked example, told step by step, that stops where students go wrong: the text after a stop appears once the
 * student has answered it, asked to be shown the step, or gone on. vault/Idee/Esercizio guidato nelle lezioni.md
 *
 *   ```guidato
 *   % nome: esponenziale-spostata-zero
 *   % titolo: Un'esponenziale spostata in giù
 *
 *   Trova il punto in cui il grafico di $y = 2^x - 8$ incontra l'asse $x$.
 *
 *   ?? scrivi: Qual è l'ascissa del punto?
 *   numero: 3
 *   errore: 4 :: Hai diviso $8$ per $2$: serve l'esponente che dà $8$.
 *
 *   Per $y = 0$ si ha $2^x = 8 = 2^3$, quindi $x = 3$.
 *   ```
 *
 * The text between the stops is lesson markdown, with its formulas and figures. A stop is a run of lines with no
 * blank line among them; the first says what the student does (`?? scrivi:`, `?? scegli:`, `?? cursore:`) and asks
 * the question, the others are "key: value". A new kind of stop is a new word after `??` and a reader in STOPS.
 *
 * Nothing here knows the grader or the LaTeX parser: the page carries the block and this file to the browser.
 */

import type { ExpressionAnswer, NumberAnswer, OpenGrading, SetAnswer, AnswerForm } from '@/lib/exercises/v2/types';
import type { ReadPlotBlock } from '@/lib/grafico/blocco';

/** What a written answer is compared with (the open answers of the exercises: lib/exercises/v2/grade). */
export type WrittenAnswer = NumberAnswer | SetAnswer | ExpressionAnswer;

interface StopBase {
	/** Which stop of the block it is, from 1: how the check names it. */
	number: number;
	/** The question, a line of lesson text. */
	question: string;
	/** How the answer is written in the worked example, a line of lesson text. Absent, it is made from the answer. */
	shown?: string;
	/** A line said with the answer, when the stop is answered or shown. */
	explanation?: string;
	/** A line added to the message of a wrong answer the author did not foresee. */
	hint?: string;
}

export interface WriteStop extends StopBase {
	kind: 'write';
	answer: WrittenAnswer;
	grading: OpenGrading;
	/** Wrong answers the author foresaw, each with what to tell the student who gives it. */
	errors: { answer: WrittenAnswer; message: string }[];
}

export interface ChoiceStop extends StopBase {
	kind: 'choice';
	/** In the order they are written. A wrong one has its message. */
	options: { text: string; right: boolean; message?: string }[];
}

/** A slider compared with a number: `k = -3`, `a > 1`. */
export interface Condition {
	name: string;
	op: '=' | '<' | '>';
	value: number;
}

export interface SliderStop extends StopBase {
	kind: 'slider';
	/** The text of the stop's ```grafico block. */
	plot: string;
	/** Where the sliders must be brought: one `=` for each slider that counts. */
	expected: Condition[];
	/** How far from the expected value a slider may be left. */
	tolerance: number;
	errors: { when: Condition[]; message: string }[];
}

export type GuidedStop = WriteStop | ChoiceStop | SliderStop;
export type GuidedPart = { kind: 'text'; markdown: string } | GuidedStop;

export interface GuidedBlock {
	name: string;
	title: string;
	parts: GuidedPart[];
}

/**
 * The block as the page carries it to the browser: every text is HTML already (the formulas typeset on the
 * server), and the plane has its formulas parsed. content/markdown.ts makes it.
 */
export type PageStop =
	| { kind: 'write'; answer: WrittenAnswer; grading: OpenGrading; errors: { answer: WrittenAnswer; html: string }[]; hint?: string }
	| { kind: 'choice'; options: { html: string; right: boolean; message?: string }[] }
	| { kind: 'slider'; plot: ReadPlotBlock; expected: Condition[]; tolerance: number; errors: { when: Condition[]; html: string }[]; hint?: string };

export interface GuidedData {
	name: string;
	stops: PageStop[];
}

/** The forms an answer can be asked in, by the names an author writes. */
export const FORMS: Record<string, AnswerForm> = {
	sviluppata: 'expanded',
	scomposta: 'factored',
	irriducibile: 'irreducible',
	semplificata: 'simplified',
	razionalizzata: 'rationalized',
	esplicita: 'explicit',
	potenza: 'power',
	radicale: 'radical',
	decimale: 'decimal'
};

const OPEN = /^```guidato[ \t]*$/;

/**
 * The guided exercises of a lesson's markdown, each with where it is. A block may hold other blocks (the plane of
 * a stop, a figure): its end is the closing fence that no inner block has opened.
 */
export function guidedFences(markdown: string): { index: number; length: number; body: string }[] {
	const found: { index: number; length: number; body: string }[] = [];
	const lines = markdown.split('\n');
	let at = 0;
	for (let i = 0; i < lines.length; i++) {
		const start = at;
		at += lines[i].length + 1;
		if (!OPEN.test(lines[i])) continue;
		let depth = 0;
		let end = at;
		let j = i + 1;
		for (; j < lines.length; j++) {
			const line = lines[j].trim();
			if (/^```\S/.test(line)) depth++;
			else if (line === '```' && depth-- === 0) break;
			end += lines[j].length + 1;
		}
		if (j === lines.length) break; // never closed: the lesson's check says so
		found.push({ index: start, length: end + lines[j].length - start, body: markdown.slice(at, end) });
		at = end + lines[j].length + 1;
		i = j;
	}
	return found;
}

/** "3", "-3", "2,5": a number as a lesson writes it. NaN when it is not one. */
function number(text: string): number {
	return /^-?\d+(?:[.,]\d+)?$/.test(text.trim()) ? Number(text.trim().replace(',', '.')) : NaN;
}

/** "k = -3 e h > 2" as conditions on the sliders, or null. */
export function readConditions(text: string): Condition[] | null {
	const out: Condition[] = [];
	for (const piece of text.split(/\s+e\s+/)) {
		const m = /^\\?([A-Za-z]+(?:_\w)?)\s*([=<>])\s*(\S+)$/.exec(piece.trim());
		const value = m ? number(m[3]) : NaN;
		if (!m || !Number.isFinite(value)) return null;
		out.push({ name: m[1], op: m[2] as Condition['op'], value });
	}
	return out.length ? out : null;
}

/** Whether the sliders are where the conditions say, each `=` within the tolerance. */
export function holds(conditions: Condition[], values: Record<string, number>, tolerance: number): boolean {
	return conditions.every((c) => {
		const v = values[c.name];
		if (!Number.isFinite(v)) return false;
		if (c.op === '=') return Math.abs(v - c.value) <= tolerance + 1e-9;
		return c.op === '<' ? v < c.value - 1e-9 : v > c.value + 1e-9;
	});
}

/** What confirming the sliders where they are gives: right, a mistake the author foresaw, or neither. */
export function judgeSliders(stop: { expected: Condition[]; tolerance: number; errors: { when: Condition[] }[] }, values: Record<string, number>): { correct: boolean; error?: number } {
	if (holds(stop.expected, values, stop.tolerance)) return { correct: true };
	const error = stop.errors.findIndex((e) => holds(e.when, values, stop.tolerance));
	return error < 0 ? { correct: false } : { correct: false, error };
}

/** A number as a formula of the lesson: -3, 2{,}5. */
export const texNumber = (x: number) => String(Number(x.toFixed(6))).replace('.', '{,}');

/** "p", "p/q" or a decimal with the comma, as the exact rational the grader wants; null when it is none of them. */
function rational(text: string): string | null {
	const t = text.trim().replace(/\s+/g, '');
	if (/^-?\d+(?:\/[1-9]\d*)?$/.test(t)) return t;
	const m = /^(-?)(\d+),(\d+)$/.exec(t);
	return m ? `${m[1]}${Number(m[2] + m[3])}/${10 ** m[3].length}` : null;
}

type Lines = { key: string; rest: string }[];
type Reader = (base: StopBase, lines: Lines, fences: { info: string; body: string }[], bad: (message: string) => void) => GuidedStop | null;

/** "value :: message", the message being what the student reads. */
function withMessage(rest: string): [string, string] {
	const cut = rest.indexOf(' :: ');
	return cut < 0 ? [rest.trim(), ''] : [rest.slice(0, cut).trim(), rest.slice(cut + 4).trim()];
}

const ANSWER_KEYS = ['numero', 'insieme', 'esclusi', 'espressione', 'retta'];

/** The answer a line gives, in the kind the stop asks for. */
function writtenAnswer(kind: string, rest: string): WrittenAnswer | null {
	const value = rest.trim();
	if (!value) return null;
	if (kind === 'numero') {
		const exact = rational(value);
		return exact === null ? null : { kind: 'number', value: exact };
	}
	if (kind === 'insieme' || kind === 'esclusi') {
		if (kind === 'insieme' && value === 'R') return { kind: 'set', values: [], latex: '', universal: true };
		if (value === (kind === 'insieme' ? 'vuoto' : 'nessuno')) return { kind: 'set', values: [], latex: '' };
		const values = value.split(';').map((v) => rational(v) ?? v.trim());
		return values.some((v) => !v) ? null : { kind: 'set', values, latex: '' };
	}
	return { kind: 'expression', value, latex: '' };
}

const write: Reader = (base, lines, fences, bad) => {
	if (fences.length) bad('una fermata "scrivi" non ha blocchi dentro');
	const given = lines.filter((l) => ANSWER_KEYS.includes(l.key));
	if (given.length !== 1) {
		bad(given.length ? 'una sola risposta attesa per fermata' : `manca la risposta attesa (${ANSWER_KEYS.join(', ')})`);
		return null;
	}
	const kind = given[0].key;
	const answer = writtenAnswer(kind, given[0].rest);
	if (!answer) {
		bad(`${kind} non letto: ${given[0].rest.slice(0, 60)}`);
		return null;
	}
	let grading: OpenGrading = kind === 'esclusi' ? { grade: 'value', set: 'excluded' } : kind === 'retta' ? { grade: 'form', form: 'explicit' } : { grade: 'value' };
	const errors: WriteStop['errors'] = [];
	for (const { key, rest } of lines) {
		if (key === 'forma') {
			const form = FORMS[rest.trim()];
			if (!form) bad(`forma sconosciuta: ${rest.trim()} (${Object.keys(FORMS).join(', ')})`);
			else if (answer.kind === 'set') bad('la forma non si chiede a un insieme');
			else if (answer.kind === 'number' && form !== 'decimal' && form !== 'irreducible') bad('a un numero si chiede solo la forma decimale o irriducibile');
			else grading = { grade: 'form', form };
		} else if (key === 'errore') {
			const [value, message] = withMessage(rest);
			const wrong = writtenAnswer(kind, value);
			if (!wrong || !message) bad(`errore non letto (risposta :: messaggio): ${rest.slice(0, 60)}`);
			else errors.push({ answer: wrong, message });
		} else if (!ANSWER_KEYS.includes(key)) bad(`riga sconosciuta in una fermata "scrivi": ${key}`);
	}
	if (answer.kind === 'set' && !base.shown) bad('a un insieme serve "mostra:", la risposta come la scrive la lezione');
	return { ...base, kind: 'write', answer, grading, errors };
};

const choice: Reader = (base, lines, fences, bad) => {
	if (fences.length) bad('una fermata "scegli" non ha blocchi dentro');
	const options: ChoiceStop['options'] = [];
	for (const { key, rest } of lines) {
		if (key === 'giusta') {
			if (!rest.trim()) bad('opzione giusta vuota');
			else options.push({ text: rest.trim(), right: true });
		} else if (key === 'sbagliata') {
			const [text, message] = withMessage(rest);
			if (!text || !message) bad(`opzione sbagliata senza il suo messaggio (testo :: messaggio): ${rest.slice(0, 60)}`);
			else options.push({ text, right: false, message });
		} else bad(`riga sconosciuta in una fermata "scegli": ${key}`);
	}
	const right = options.filter((o) => o.right).length;
	if (right !== 1) bad(right ? 'una sola opzione giusta per fermata' : 'manca l\'opzione giusta ("giusta:")');
	if (options.length - right < 1) bad('serve almeno un\'opzione sbagliata ("sbagliata:")');
	return { ...base, kind: 'choice', options };
};

const slider: Reader = (base, lines, fences, bad) => {
	if (fences.length !== 1 || fences[0].info !== 'grafico') {
		bad('a una fermata "cursore" serve un blocco ```grafico, uno solo');
		return null;
	}
	const expected: Condition[] = [];
	const errors: SliderStop['errors'] = [];
	let tolerance = 0;
	for (const { key, rest } of lines) {
		if (key === 'atteso') {
			const read = readConditions(rest);
			if (!read || read.some((c) => c.op !== '=')) bad(`atteso non letto (k = -3): ${rest.slice(0, 60)}`);
			else expected.push(...read);
		} else if (key === 'tolleranza') {
			tolerance = number(rest);
			if (!(tolerance >= 0)) bad(`tolleranza non letta: ${rest.slice(0, 60)}`);
		} else if (key === 'errore') {
			const [value, message] = withMessage(rest);
			const when = readConditions(value);
			if (!when || !message) bad(`errore non letto (k = 3 :: messaggio): ${rest.slice(0, 60)}`);
			else errors.push({ when, message });
		} else bad(`riga sconosciuta in una fermata "cursore": ${key}`);
	}
	if (!expected.length) bad('manca "atteso:", il valore a cui portare il cursore');
	if (new Set(expected.map((c) => c.name)).size !== expected.length) bad('un cursore ha due valori attesi');
	return { ...base, kind: 'slider', plot: fences[0].body, expected, tolerance: tolerance || 0, errors };
};

/** The kinds of stop, by the word after `??`. */
const STOPS: Record<string, Reader> = { scrivi: write, scegli: choice, cursore: slider };
const COMMON: Record<string, 'shown' | 'explanation' | 'hint'> = { mostra: 'shown', spiegazione: 'explanation', aiuto: 'hint' };

/**
 * The block's text as a guided exercise, or what is wrong with it. `read` is what could be read of a block with
 * errors, for the check to go on with: an author gets the mistakes of every stop in one pass.
 */
export function parseGuidedBlock(source: string): { block: GuidedBlock | null; read: GuidedBlock; errors: string[] } {
	const errors: string[] = [];
	const block: GuidedBlock = { name: '', title: '', parts: [] };
	const lines = source.replace(/\r\n?/g, '\n').split('\n');
	let text: string[] = [];
	let stops = 0;
	const flush = () => {
		const markdown = text.join('\n').trim();
		if (markdown) block.parts.push({ kind: 'text', markdown });
		text = [];
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const meta = /^%\s*(nome|titolo):\s*(.*)$/.exec(line.trim());
		if (meta && !block.parts.length && !text.some((l) => l.trim())) {
			if (meta[1] === 'nome') block.name = meta[2].trim();
			else block.title = meta[2].trim();
			continue;
		}
		if (!line.startsWith('??')) {
			// a block inside the text (a figure, a plane) goes with it whole, blank lines and all
			text.push(line);
			if (/^```\S/.test(line.trim())) {
				do text.push(lines[++i] ?? '');
				while (i < lines.length && lines[i].trim() !== '```');
			}
			continue;
		}

		flush();
		const nth = ++stops;
		const bad = (message: string) => errors.push(`fermata ${nth}: ${message}`);
		const head = /^\?\?\s*([a-z]+):\s*(.*)$/.exec(line);
		const own: Lines = [];
		const fences: { info: string; body: string }[] = [];
		const base: StopBase = { number: nth, question: head?.[2].trim() ?? '' };
		// the stop's own lines: up to the first blank one
		for (i++; i < lines.length && lines[i].trim(); i++) {
			const fence = /^```(\S+)\s*$/.exec(lines[i].trim());
			if (fence) {
				const body: string[] = [];
				while (++i < lines.length && lines[i].trim() !== '```') body.push(lines[i]);
				fences.push({ info: fence[1], body: body.join('\n') + '\n' });
				continue;
			}
			const m = /^([a-zàèéìòù]+):\s*(.*)$/.exec(lines[i].trim());
			if (!m) bad(`riga non letta: ${lines[i].trim().slice(0, 60)}`);
			else if (m[1] in COMMON) base[COMMON[m[1]]] = m[2].trim();
			else own.push({ key: m[1], rest: m[2] });
		}
		i--;
		if (!head || !(head[1] in STOPS)) {
			bad(`tipo di fermata sconosciuto: ${line.slice(0, 40)} (${Object.keys(STOPS).join(', ')})`);
			continue;
		}
		if (!base.question) bad('manca la domanda dopo i due punti');
		const stop = STOPS[head[1]](base, own, fences, bad);
		if (stop) block.parts.push(stop);
	}
	flush();

	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(block.name)) errors.push('manca "% nome:" (minuscole, cifre e trattini)');
	if (!block.title) errors.push('manca "% titolo:"');
	if (!stops) errors.push('nessuna fermata: senza fermate è un esempio svolto, e va in un riquadro ad-example');
	if (block.parts[0] && block.parts[0].kind !== 'text') errors.push('prima della prima fermata serve la consegna');
	if (block.parts.length && block.parts[block.parts.length - 1].kind !== 'text') errors.push("dopo l'ultima fermata serve il testo che chiude lo svolgimento");
	return { block: errors.length ? null : block, read: block, errors };
}
