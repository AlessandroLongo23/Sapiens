/**
 * The written answers of a guided exercise (blocco.ts), graded by the grader of the exercises' open answers: the
 * answer the stop expects, then the wrong answers its author foresaw, each of which is an answer of its own. Here
 * is also what scripts/lezioni/check.mts asks of a block before a lesson is published.
 *
 * The grader carries the Compute Engine (a megabyte, zipped): this file runs on the server and in the scripts,
 * never in the browser. Relative imports, so that the scripts read it without the alias.
 */
import { gradeOpen } from '../exercises/v2/grade/grade';
import type { OpenGrading, Sample } from '../exercises/v2/types';
import { parsePlotBlock } from '../grafico/blocco';
import { answerLatex } from './scrittura';
import { FORMS, holds, type Condition, type GuidedBlock, type SliderStop, type WriteStop, type WrittenAnswer } from './blocco';

export interface GuidedVerdict {
	correct: boolean;
	/** The grader's own remark: an answer it cannot read, a right value in the wrong form, a fraction to reduce. */
	message?: string;
	/** Which of the foreseen wrong answers this is. */
	error?: number;
}

type Graded = Pick<WriteStop, 'answer' | 'grading'> & { errors: { answer: WrittenAnswer }[] };

const sample = (answer: WrittenAnswer): Sample => ({ generatorId: 'guidato', level: 0, seed: 0, prompt: '', problem: '', solution: '', steps: [], answer, params: {} });

/** A foreseen mistake is recognised by its value alone, however it is written. */
const byValue = (grading: OpenGrading): OpenGrading => (grading.grade === 'value' && grading.set ? grading : { grade: 'value' });

export function gradeGuided(stop: Graded, latex: string): GuidedVerdict {
	const verdict = gradeOpen(sample(stop.answer), stop.grading, latex);
	if (verdict.correct) return verdict.message ? { correct: true, message: verdict.message } : { correct: true };
	// a right value in the wrong form is the grader's to explain, before any foreseen mistake
	if (verdict.reason !== 'form') {
		const error = stop.errors.findIndex((e) => gradeOpen(sample(e.answer), byValue(stop.grading), latex).correct);
		if (error >= 0) return { correct: false, error };
	}
	return verdict.message ? { correct: false, message: verdict.message } : { correct: false };
}

/** The formula of a line that is one formula and nothing else: "$x = 2$". */
const onlyFormula = (text: string | undefined) => /^\$([^$]+)\$\.?$/.exec(text?.trim() ?? '')?.[1].trim() ?? null;

function checkWrite(stop: WriteStop): string[] {
	const errors: string[] = [];
	let derived: string;
	try {
		derived = answerLatex(stop.answer, stop.grading);
		for (const e of stop.errors) answerLatex(e.answer, stop.grading);
	} catch (e) {
		return [`un valore non è scritto nella sintassi di SymPy (2*x**2, sqrt(3), 3/2): ${(e as Error).message}`];
	}
	const shown = onlyFormula(stop.shown);
	const expected = shown ?? derived;
	const verdict = gradeGuided(stop, expected);
	if (!verdict.correct) errors.push(`il correttore boccia la risposta attesa "${expected}"${verdict.message ? ` (${verdict.message})` : ''}${shown ? ': "mostra:" e il valore atteso non dicono la stessa cosa' : ''}`);
	stop.errors.forEach((e, i) => {
		const latex = answerLatex(e.answer, byValue(stop.grading));
		const got = gradeGuided(stop, latex);
		if (got.correct) errors.push(`l'errore previsto "${latex}" è una risposta che il correttore accetta`);
		else if (got.error === undefined) errors.push(`l'errore previsto "${latex}" non viene riconosciuto dal correttore`);
		else if (got.error !== i) errors.push(`l'errore previsto "${latex}" è scritto due volte`);
	});
	return errors;
}

/** The value a slider can be left at: one of its steps, inside its range. */
const reachable = (s: { min: number; max: number; step: number }, value: number) => value >= s.min - 1e-9 && value <= s.max + 1e-9 && Math.abs((value - s.min) / s.step - Math.round((value - s.min) / s.step)) < 1e-6;

function checkSlider(stop: SliderStop): string[] {
	const { plot, errors: unread } = parsePlotBlock(stop.plot);
	if (!plot) return unread.map((e) => `grafico: ${e}`);
	const errors: string[] = [];
	const start = Object.fromEntries(plot.sliders.map((s) => [s.name, s.value]));
	const place = (label: string, conditions: Condition[]) => {
		for (const c of conditions) {
			const s = plot.sliders.find((slider) => slider.name === c.name);
			if (!s) errors.push(`${label}: il piano non ha il cursore ${c.name}`);
			else if (c.op !== '=') {
				if (c.value < s.min || c.value > s.max) errors.push(`${label}: ${c.value} è fuori dall'intervallo del cursore ${c.name} (da ${s.min} a ${s.max})`);
			} else if (c.value < s.min - 1e-9 || c.value > s.max + 1e-9) errors.push(`${label}: ${c.name} = ${c.value} è fuori dall'intervallo del cursore (da ${s.min} a ${s.max})`);
			else if (!reachable(s, c.value)) errors.push(`${label}: ${c.name} = ${c.value} non si raggiunge con il passo ${s.step} partendo da ${s.min}`);
		}
	};
	place('atteso', stop.expected);
	if (errors.length) return errors;
	const step = Math.min(...plot.sliders.filter((s) => stop.expected.some((c) => c.name === s.name)).map((s) => s.step));
	if (stop.tolerance >= step) errors.push(`la tolleranza ${stop.tolerance} non è più piccola del passo ${step}: si scrive il valore, e la tolleranza serve solo per i passi fini`);
	if (holds(stop.expected, start, stop.tolerance)) errors.push('i cursori partono già dai valori attesi: lo studente confermerebbe senza muovere niente');
	stop.errors.forEach((e, i) => {
		place(`errore ${i + 1}`, e.when);
		// the sliders left where this mistake puts them, the others where the answer wants them
		if (e.when.every((c) => c.op === '=')) {
			const at = { ...start, ...Object.fromEntries(stop.expected.map((c) => [c.name, c.value])), ...Object.fromEntries(e.when.map((c) => [c.name, c.value])) };
			if (holds(stop.expected, at, stop.tolerance)) errors.push(`errore ${i + 1}: coincide con la risposta attesa`);
		}
	});
	return errors;
}

/** What is wrong with a block that has been read: an answer the grader fails, a slider that cannot get there. */
export function checkGuided(block: GuidedBlock): string[] {
	const errors: string[] = [];
	for (const part of block.parts) {
		if (part.kind === 'text') continue;
		const n = part.number;
		const found = part.kind === 'write' ? checkWrite(part) : part.kind === 'slider' ? checkSlider(part) : [];
		for (const e of found) errors.push(`fermata ${n}: ${e}`);
	}
	return errors;
}

const MAX_LATEX = 2000;
const MAX_VALUE = 200;
const MAX_ERRORS = 12;

function readAnswer(value: unknown): WrittenAnswer | null {
	const a = value as { kind?: unknown; value?: unknown; values?: unknown; universal?: unknown } | null;
	if (!a || typeof a !== 'object') return null;
	const short = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= MAX_VALUE;
	if (a.kind === 'number') return short(a.value) && /^-?\d+(?:\/[1-9]\d*)?$/.test(a.value) ? { kind: 'number', value: a.value } : null;
	if (a.kind === 'expression') return short(a.value) ? { kind: 'expression', value: a.value, latex: '' } : null;
	if (a.kind === 'set') return Array.isArray(a.values) && a.values.length <= MAX_ERRORS && a.values.every(short) ? { kind: 'set', values: a.values, latex: '', ...(a.universal === true ? { universal: true } : {}) } : null;
	return null;
}

/** What the page sends to have a written answer graded, when it has the shape of it; otherwise null. */
export function readGuidedRequest(body: Record<string, unknown>): { stop: Graded; latex: string } | null {
	const { latex, grading } = body as { latex?: unknown; grading?: { grade?: unknown; set?: unknown; form?: unknown } };
	if (typeof latex !== 'string' || !latex.trim() || latex.length > MAX_LATEX || !grading || typeof grading !== 'object') return null;
	const answer = readAnswer(body.answer);
	const wrong = Array.isArray(body.errors) && body.errors.length <= MAX_ERRORS ? body.errors.map(readAnswer) : null;
	if (!answer || !wrong || wrong.some((w) => !w || w.kind !== answer.kind)) return null;
	let read: OpenGrading;
	if (grading.grade === 'value') read = grading.set === 'excluded' ? { grade: 'value', set: 'excluded' } : { grade: 'value' };
	else if (grading.grade === 'form' && Object.values(FORMS).includes(grading.form as never)) read = { grade: 'form', form: grading.form as never };
	else return null;
	return { stop: { answer, grading: read, errors: wrong.map((w) => ({ answer: w! })) }, latex };
}
