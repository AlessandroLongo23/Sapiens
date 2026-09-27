import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
import { decimal, decimalTex, parseDecimal, parseNatural } from './numbers';
import { splitList } from './media-mediana-moda';

/**
 * The average of school grades as students write them on the register: "6+", "6-", "6½", "6 e mezzo", "7/8",
 * "10 e lode". The convention is the most common one: + adds a quarter of a mark, - takes a quarter off, ½ adds
 * half, and "7/8" (or "7-8") is halfway between the two. Every school may round differently, and the mark on the
 * report card is decided by the teachers: the tool gives the average, never a promised mark.
 */

export type GradeMode = 'media' | 'serve';

export interface Grade {
	/** As the student wrote it, normalised: "6+", "7/8", "6½". */
	raw: string;
	value: Rational;
	/** False for a plain number ("7", "7,5"), true when the notation had to be converted. */
	notation: boolean;
	/** The grade as written, for a formula. */
	tex: string;
}

const MAX_GRADES = 60;
const QUARTER = Rational.of(1, 4);
const HALF = Rational.of(1, 2);
const TEN = Rational.of(10);
const g2 = (r: Rational) => decimalTex(r, 2);
const g4 = (r: Rational) => decimalTex(r, 4);
/** "= 7{,}25", or "\\approx 7{,}08" when rounded. */
const eq2 = (r: Rational) => (decimal(r, 2).exact ? `= ${g2(r)}` : g2(r));
/** In prose: "7,25", or "circa 7,08". */
const about2 = (r: Rational) => (decimal(r, 2).exact ? `$${g2(r)}$` : `circa $${decimal(r, 2).tex}$`);

/** "6 e mezzo" → "6½", "7 - 8" → "7-8", "10 e lode" → "10l", before splitting on spaces. */
function normalise(input: string): string {
	return input
		.toLowerCase()
		.replace(/(\d)\s*e\s*mezzo\b/g, '$1½')
		.replace(/\b10\s*(?:e\s*)?lode\b/g, '10l')
		.replace(/(\d)\s+([-/])\s+(\d)/g, '$1$2$3');
}

/** One grade in school notation, or an error sentence. */
export function parseGrade(token: string): Grade | string {
	const s = normalise(token.trim());
	const bad = `"${token.trim()}" non è un voto: scrivi per esempio 7, 6,5, 6+, 6-, 6½ o 7/8.`;
	let m: RegExpExecArray | null;
	let grade: Grade;
	if ((m = /^(\d{1,2})(\+\+|--)$/.exec(s))) {
		return `"${s}" non ha un valore condiviso da tutte le scuole: scrivilo come numero, per esempio ${m[2] === '++' ? `${m[1]},5` : `${Number(m[1]) - 1},5`}.`;
	} else if ((m = /^(\d{1,2})½$/.exec(s))) {
		grade = { raw: s, value: Rational.of(Number(m[1])).add(HALF), notation: true, tex: `${m[1]}\\tfrac{1}{2}` };
	} else if ((m = /^(\d{1,2})([+-])$/.exec(s))) {
		const n = Rational.of(Number(m[1]));
		grade = { raw: s, value: m[2] === '+' ? n.add(QUARTER) : n.sub(QUARTER), notation: true, tex: `\\text{${s}}` };
	} else if ((m = /^(\d{1,2})([-/])(\d{1,2})$/.exec(s))) {
		const a = Number(m[1]);
		const b = Number(m[3]);
		if (b !== a + 1) return `"${s}" non è un voto: con la barra si scrivono due voti vicini, come 6/7 o 7/8, che valgono il voto a metà.`;
		grade = { raw: s, value: Rational.of(2 * a + 1, 2), notation: true, tex: `\\text{${s}}` };
	} else if (s === '10l') {
		grade = { raw: '10 e lode', value: TEN, notation: true, tex: '\\text{10 e lode}' };
	} else {
		const r = parseDecimal(s);
		if (!r) return bad;
		grade = { raw: s, value: r, notation: false, tex: g4(r) };
	}
	if (grade.value.sign() < 0 || grade.value.compare(TEN) > 0) return `"${token.trim()}" vale ${decimal(grade.value, 2).text}: i voti vanno da 0 a 10.`;
	return grade;
}

export function parseGrades(input: string): Grade[] | string {
	const parts = splitList(normalise(input));
	if (!parts.length) return 'Scrivi i tuoi voti, separati da uno spazio o da un punto e virgola: 6+ 7 5½.';
	if (parts.length > MAX_GRADES) return `Al massimo ${MAX_GRADES} voti alla volta.`;
	const out: Grade[] = [];
	for (const p of parts) {
		const g = parseGrade(p);
		if (typeof g === 'string') return g;
		out.push(g);
	}
	return out;
}

/** Weights, one per grade: "1 1 2", "50% 50% 100%". Empty means every grade counts the same. */
function parseWeights(input: string, count: number): Rational[] | null | string {
	if (!input.trim()) return null;
	const parts = splitList(input);
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p.replace(/%$/, ''));
		if (!r) return `"${p}" non è un peso: scrivi dei numeri, come 1 1 2, oppure delle percentuali, come 50% 100%.`;
		if (r.sign() <= 0) return 'I pesi devono essere maggiori di zero.';
		out.push(r);
	}
	if (out.length !== count) return `Hai scritto ${count} ${count === 1 ? 'voto' : 'voti'} e ${out.length} ${out.length === 1 ? 'peso' : 'pesi'}: serve un peso per ogni voto, nello stesso ordine.`;
	return out;
}

const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), ZERO);

/** The step that turns the notations into numbers, or nothing when every grade is already a number. */
function conversionStep(grades: Grade[]): string[] {
	const seen = new Set<string>();
	const converted = grades.filter((g) => g.notation && !seen.has(g.raw) && seen.add(g.raw));
	if (!converted.length) return [];
	return [
		`Trasforma i voti in numeri. Con la convenzione più diffusa il più aggiunge un quarto di voto, il meno lo toglie, il mezzo aggiunge $0{,}5$ e due voti vicini valgono il voto a metà: ${converted.map((g) => `$${g.tex} = ${g2(g.value)}$`).join(', ')}.`
	];
}

const REPORT = 'Il voto in pagella non è per forza la media arrotondata: lo decide il consiglio di classe, che guarda anche i progressi, l\'impegno e la partecipazione.';

interface Current {
	S: Rational;
	W: Rational;
	mean: Rational;
	steps: string[];
}

/** The average so far, with its steps. */
function current(grades: Grade[], ws: Rational[] | null): Current {
	const vs = grades.map((g) => g.value);
	if (!ws) {
		const S = sum(vs);
		const W = Rational.of(vs.length);
		const mean = S.div(W);
		const steps =
			vs.length === 1
				? [`Con un voto solo la media è il voto stesso: ${about2(mean)}.`]
				: [`Somma i voti: $${vs.map(g2).join(' + ')} = ${g2(S)}$.`, `Dividi per il numero dei voti, che sono ${vs.length}: $\\dfrac{${g2(S)}}{${vs.length}} ${eq2(mean)}$.`];
		return { S, W, mean, steps };
	}
	const S = sum(vs.map((v, i) => v.mul(ws[i])));
	const W = sum(ws);
	const mean = S.div(W);
	return {
		S,
		W,
		mean,
		steps: [
			`Moltiplica ogni voto per il suo peso e somma i prodotti: $${vs.map((v, i) => `${g2(v)} \\cdot ${g4(ws[i])}`).join(' + ')} = ${g4(S)}$.`,
			`Somma i pesi: $${ws.map(g4).join(' + ')} = ${g4(W)}$.`,
			`Dividi la somma dei prodotti per la somma dei pesi: $\\dfrac{${g4(S)}}{${g4(W)}} ${eq2(mean)}$.`
		]
	};
}

export function mediaVoti(grades: string, weights = ''): Outcome {
	const gs = parseGrades(grades);
	if (typeof gs === 'string') return fail(gs);
	const ws = parseWeights(weights, gs.length);
	if (typeof ws === 'string') return fail(ws);
	try {
		const c = current(gs, ws);
		return {
			ok: true,
			result: `Media $${eq2(c.mean)}$`,
			copy: decimal(c.mean, 2).text,
			steps: [...conversionStep(gs), ...c.steps, REPORT]
		};
	} catch {
		return fail('I pesi hanno troppe cifre per un calcolo esatto: prova con numeri più semplici.');
	}
}

/** The smallest grade written in quarters that is at least `x` (0 < x ≤ 10): "7+", "7½", "8-". */
export function quarterGrade(x: Rational): { value: Rational; text: string; tex: string } {
	const quarters = Math.ceil((x.num * 4) / x.den);
	const value = Rational.of(quarters, 4);
	const n = Math.floor(quarters / 4);
	const text = [`${n}`, `${n}+`, `${n}½`, `${n + 1}-`][quarters % 4];
	const tex = quarters % 4 === 2 ? `${n}\\tfrac{1}{2}` : `\\text{${text}}`;
	return { value, text, tex };
}

/** Rounded up to two decimals: the grade you need is "at least" this. */
function ceil2(x: Rational): Rational {
	const num = BigInt(x.num) * 100n;
	const den = BigInt(x.den);
	const up = num >= 0n ? (num + den - 1n) / den : num / den;
	return Rational.of(Number(up), 100);
}

export interface TargetInput {
	grades: string;
	weights?: string;
	/** The average the student wants, in any grade notation. */
	target: string;
	/** How many grades are still to come. */
	count: string;
	/** The weight of each of the next grades; empty means 1. */
	nextWeight?: string;
}

export function votoCheServe({ grades, weights = '', target, count, nextWeight = '' }: TargetInput): Outcome {
	const gs = parseGrades(grades);
	if (typeof gs === 'string') return fail(gs);
	const ws = parseWeights(weights, gs.length);
	if (typeof ws === 'string') return fail(ws);
	const tg = parseGrade(target);
	if (typeof tg === 'string' || tg.value.sign() <= 0) return fail('Scrivi la media che vuoi raggiungere, un voto tra 1 e 10: per esempio 6 o 7,5.');
	const k = parseNatural(count, 20);
	if (k === null || k < 1) return fail('Scrivi quanti voti mancano, da 1 a 20.');
	const w = nextWeight.trim() ? parseDecimal(nextWeight.replace(/%$/, '')) : Rational.of(1);
	if (!w || w.sign() <= 0) return fail('Il peso dei prossimi voti deve essere un numero maggiore di zero.');

	try {
		const c = current(gs, ws);
		const T = tg.value;
		const K = w.mul(Rational.of(k));
		const x = T.mul(c.W.add(K)).sub(c.S).div(K);
		const Ktex = K.isOne() ? '' : g4(K);
		const Tt = g2(T);
		const steps = [...conversionStep(gs), ...c.steps];
		const weighted = ws !== null || !w.isOne();
		const who = k === 1 ? 'il prossimo voto' : `la media dei prossimi ${k} voti`;
		const weightNote = w.isOne() ? '' : `, ognuno con peso $${g4(w)}$`;
		steps.push(
			`${gs.length > 1 || ws ? `Adesso la media è ${about2(c.mean)}. ` : ''}Chiama $x$ ${who}${weightNote}. ${k === 1 ? 'Con lui' : 'Con loro'} ${weighted ? 'la somma dei prodotti' : 'la somma dei voti'} diventa $${g4(c.S)} + ${Ktex}x$ e ${weighted ? 'la somma dei pesi' : 'il numero dei voti'} diventa $${g4(c.W)} + ${g4(K)} = ${g4(c.W.add(K))}$. Imponi che la nuova media sia $${Tt}$: $\\dfrac{${g4(c.S)} + ${Ktex}x}{${g4(c.W.add(K))}} = ${Tt}$.`
		);
		steps.push(
			`Ricava $x$: moltiplica per $${g4(c.W.add(K))}$, sottrai $${g4(c.S)}$${K.isOne() ? '' : ` e dividi per $${g4(K)}$`}: $x = ${K.isOne() ? `${Tt} \\cdot ${g4(c.W.add(K))} - ${g4(c.S)}` : `\\dfrac{${Tt} \\cdot ${g4(c.W.add(K))} - ${g4(c.S)}}{${g4(K)}}`} ${decimal(x, 4).exact ? `= ${g4(x)}` : g4(x)}$.`
		);

		const need = k === 1 ? 'Ti serve almeno' : `Ti serve una media di almeno`;
		const tail = k === 1 ? '' : ` nei prossimi ${k} voti`;
		if (x.compare(TEN) > 0) {
			steps.push(`$x$ è più di 10: anche prendendo 10 ${k === 1 ? '' : 'in tutti i prossimi voti '}la media non arriva a $${Tt}$. Servono più voti, o voti con un peso maggiore.`);
			steps.push(REPORT);
			return { ok: true, result: `Impossibile: servirebbe ${about2(x)}, più di 10`, copy: `impossibile (servirebbe ${decimal(x, 2).text})`, steps };
		}
		if (x.compare(Rational.of(1)) <= 0) {
			steps.push(`$x$ non è più di 1: anche con il voto più basso ${k === 1 ? '' : 'in tutti i prossimi voti '}la media resta almeno $${Tt}$.`);
			steps.push(REPORT);
			return { ok: true, result: 'Ti basta qualsiasi voto', copy: 'qualsiasi voto', steps };
		}
		const at = ceil2(x);
		const qg = quarterGrade(x);
		const qNote = k > 1 || qg.value.equals(at) ? '' : ` (un $${qg.tex}$)`;
		steps.push(
			(at.equals(x) ? '' : `Arrotonda per eccesso, perché con meno non arrivi a $${Tt}$: `) +
				(k === 1 ? `${at.equals(x) ? 'Il' : 'il'} prossimo voto deve essere almeno $${g2(at)}$. Tra i voti scritti con più e meno, il primo che basta è $${qg.tex} = ${g2(qg.value)}$.` : `${at.equals(x) ? 'I' : 'i'} prossimi ${k} voti devono avere una media di almeno $${g2(at)}$.`)
		);
		steps.push(REPORT);
		return {
			ok: true,
			result: `${need} $${g2(at)}$${qNote}${tail}`,
			copy: `almeno ${decimal(at, 2).text}`,
			steps
		};
	} catch {
		return fail('I pesi hanno troppe cifre per un calcolo esatto: prova con numeri più semplici.');
	}
}
