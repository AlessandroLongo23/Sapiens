import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, decimalTex, parseDecimal, parseNatural } from './numbers';
import { resultTex, splitList, sumLines } from './media-mediana-moda';

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
	if (!parts.length) return 'Scrivi i tuoi voti separati da uno spazio, per esempio 6+ 7 5½.';
	if (parts.length > MAX_GRADES) return `Al massimo ${MAX_GRADES} voti alla volta: togline qualcuno.`;
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
		if (r.sign() <= 0) return 'I pesi devono essere maggiori di zero, per esempio 1 1 2.';
		out.push(r);
	}
	if (out.length !== count) return `Hai scritto ${count} ${count === 1 ? 'voto' : 'voti'} e ${out.length} ${out.length === 1 ? 'peso' : 'pesi'}: serve un peso per ogni voto, nello stesso ordine: per esempio voti 6 7 8 e pesi 1 1 2.`;
	return out;
}

const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), ZERO);

/** The report card note, a step of its own at the end. */
const REPORT: Step = {
	say: 'Ricorda che il voto in pagella non è per forza la media.',
	then: 'Lo decide il consiglio di classe, che guarda anche i progressi, l’impegno e la partecipazione.'
};

/**
 * The grades as a table, when some are written in school notation or have weights: the grade as written, its value,
 * its weight. Nothing when every grade is a plain number with the same weight.
 */
function gradeTable(grades: Grade[], ws: Rational[] | null): Step[] {
	const notation = grades.some((g) => g.notation);
	if (!notation) return [];
	return [
		{
			say: 'Trasforma in numeri i voti scritti con il più, il meno o il mezzo.',
			table: {
				head: ['Voto scritto', 'Vale', ...(ws ? ['Peso'] : [])],
				rows: grades.map((g, i) => [`$${g.tex}$`, g.notation ? `$\\hl{${g4(g.value)}}$` : `$${g4(g.value)}$`, ...(ws ? [`$${g4(ws[i])}$`] : [])])
			},
			then: 'Il più aggiunge un quarto di voto e il meno lo toglie. Il mezzo aggiunge $0{,}5$; due voti vicini, come 7/8, valgono il voto a metà.'
		}
	];
}

interface Current {
	S: Rational;
	W: Rational;
	mean: Rational;
	steps: Step[];
}

/** The average so far, with its steps. */
function current(grades: Grade[], ws: Rational[] | null): Current {
	const vs = grades.map((g) => g.value);
	const table = gradeTable(grades, ws);
	if (!ws) {
		const S = sum(vs);
		const W = Rational.of(vs.length);
		const mean = S.div(W);
		const steps: Step[] =
			vs.length === 1
				? [{ say: 'Con un voto solo, la media è il voto stesso.', math: [`\\text{media} ${resultTex(mean, 2)}`] }]
				: [
						{ say: 'Somma i voti.', math: sumLines(vs) },
						{ say: `Dividi la somma per quanti sono i voti, cioè $${vs.length}$.`, math: [`\\dfrac{${g4(S)}}{${vs.length}} ${resultTex(mean, 2)}`] }
					];
		return { S, W, mean, steps: [...table, ...steps] };
	}
	const products = vs.map((v, i) => v.mul(ws[i]));
	const S = sum(products);
	const W = sum(ws);
	const mean = S.div(W);
	return {
		S,
		W,
		mean,
		steps: [
			...table,
			{ say: 'Moltiplica ogni voto per il suo peso.', math: vs.map((v, i) => `${g4(v)} \\cdot ${g4(ws[i])} = ${g4(products[i])}`) },
			{ say: 'Somma i prodotti.', math: sumLines(products) },
			{ say: 'Somma i pesi.', math: sumLines(ws) },
			{ say: 'Dividi la somma dei prodotti per la somma dei pesi.', math: [`\\dfrac{${g4(S)}}{${g4(W)}} ${resultTex(mean, 2)}`] }
		]
	};
}

/** More than five steps: headings on the parts. */
function grouped(steps: Step[], parts: [number, string][]): Step[] {
	if (steps.length <= 5) return steps;
	return steps.map((s, i) => {
		const part = parts.find(([at]) => at === i);
		return part ? { ...s, group: part[1] } : s;
	});
}

export function mediaVoti(grades: string, weights = ''): Outcome {
	const gs = parseGrades(grades);
	if (typeof gs === 'string') return fail(gs);
	const ws = parseWeights(weights, gs.length);
	if (typeof ws === 'string') return fail(ws);
	try {
		const c = current(gs, ws);
		const steps = [...c.steps, REPORT];
		return {
			ok: true,
			rows: [{ label: ws ? 'Media ponderata dei voti' : 'Media dei voti', value: `$${g2(c.mean)}$` }],
			copy: decimal(c.mean, 2).text,
			steps: grouped(steps, [
				[0, ws ? 'La media ponderata' : 'La media'],
				[steps.length - 1, 'Il voto in pagella']
			])
		};
	} catch {
		return fail('I pesi hanno troppe cifre per un calcolo esatto: prova con numeri più semplici, per esempio 1 1 2.');
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
	if (typeof tg === 'string' || tg.value.sign() <= 0) return fail('Scrivi la media che vuoi raggiungere, un voto da 1 a 10: per esempio 6 o 7,5.');
	const k = parseNatural(count, 20);
	if (k === null || k < 1) return fail('Scrivi quanti voti mancano, un numero intero da 1 a 20: per esempio 2.');
	const w = nextWeight.trim() ? parseDecimal(nextWeight.replace(/%$/, '')) : Rational.of(1);
	if (!w || w.sign() <= 0) return fail('Scrivi il peso dei prossimi voti, un numero maggiore di zero: per esempio 2.');

	try {
		const c = current(gs, ws);
		const T = tg.value;
		const K = w.mul(Rational.of(k));
		const W2 = c.W.add(K);
		const TW = T.mul(W2);
		const diff = TW.sub(c.S);
		const x = diff.div(K);
		const Kx = `${K.isOne() ? '' : g4(K)}x`;
		const Tt = g2(T);
		const weighted = ws !== null || !w.isOne();
		const steps = [...c.steps];
		const start = steps.length;

		const who = k === 1 ? `il prossimo voto${w.isOne() ? '' : `, che pesa $${g4(w)}$`}` : `la media dei prossimi $${k}$ voti${w.isOne() ? '' : `, che pesano $${g4(w)}$ ciascuno`}`;
		steps.push({
			say: `Chiama $x$ ${who}.`,
			math: weighted
				? [`\\text{somma dei prodotti} = ${g4(c.S)} + \\hl{${Kx}}`, `\\text{somma dei pesi} = ${g4(c.W)} + \\hl{${g4(K)}} = ${g4(W2)}`]
				: [`\\text{somma dei voti} = ${g4(c.S)} + \\hl{${Kx}}`, `\\text{numero dei voti} = ${g4(c.W)} + \\hl{${k}} = ${g4(W2)}`],
			then: K.isOne()
				? undefined
				: k === 1
					? `Il voto $x$ pesa $${g4(w)}$, quindi aggiunge $${Kx}$ alla somma dei prodotti.`
					: weighted
						? `${k} voti con media $x$ e peso $${g4(w)}$ aggiungono $${Kx}$ alla somma dei prodotti.`
						: `${k} voti con media $x$ sommano $${Kx}$.`
		});
		steps.push({ say: `Scrivi che la nuova media deve essere $${Tt}$.`, math: [`\\dfrac{${g4(c.S)} + ${Kx}}{${g4(W2)}} = ${Tt}`] });
		steps.push({ say: `Moltiplica per $${g4(W2)}$ tutti e due i lati.`, math: [`${g4(c.S)} + ${Kx} = ${Tt} \\cdot ${g4(W2)}`, `${g4(c.S)} + ${Kx} = \\hl{${g4(TW)}}`] });
		steps.push({ say: `Togli $${g4(c.S)}$ da tutti e due i lati.`, math: [`${Kx} = ${g4(TW)} - ${g4(c.S)}`, K.isOne() ? `x ${resultTex(x)}` : `${Kx} = \\hl{${g4(diff)}}`] });
		if (!K.isOne()) steps.push({ say: `Dividi per $${g4(K)}$ tutti e due i lati.`, math: [`x = \\dfrac{${g4(diff)}}{${g4(K)}}`, resultTex(x)] });

		const need = k === 1 ? 'Voto che ti serve' : `Media che ti serve nei prossimi ${k} voti`;
		const now: ResultRow = { label: 'Media di adesso', value: `$${g2(c.mean)}$` };
		const xRel = decimal(x, 4).exact ? '=' : '\\approx';
		const all = k === 1 ? '' : 'in tutti i prossimi voti ';
		const finish = (last: Step[]) => {
			const out = [...steps, ...last, REPORT];
			return grouped(out, [
				[0, 'La media di adesso'],
				[start, 'Il voto che serve'],
				[out.length - 1, 'Il voto in pagella']
			]);
		};

		if (x.compare(TEN) > 0) {
			return {
				ok: true,
				rows: [{ label: need, value: `Impossibile: servirebbe $${g2(x)}$, più di 10` }, now],
				copy: `impossibile (servirebbe ${decimal(x, 2).text})`,
				steps: finish([
					{
						say: 'Confronta $x$ con $10$, il voto più alto.',
						math: [`x ${xRel} ${decimal(x, 4).tex} > 10`],
						then: `Anche con 10 ${all}la media non arriva a $${Tt}$. Servono più voti, o voti che pesano di più.`
					}
				])
			};
		}
		if (x.compare(Rational.of(1)) <= 0) {
			return {
				ok: true,
				rows: [{ label: need, value: 'Qualsiasi voto' }, now],
				copy: 'qualsiasi voto',
				steps: finish([
					{
						say: 'Confronta $x$ con $1$, il voto più basso.',
						math: [`x ${xRel} ${decimal(x, 4).tex} \\leq 1`],
						then: `Anche con il voto più basso ${all}la media resta almeno $${Tt}$.`
					}
				])
			};
		}
		const at = ceil2(x);
		const qg = quarterGrade(x);
		const last: Step[] = [];
		if (!at.equals(x)) last.push({ say: `Arrotonda per eccesso: con meno non arrivi a $${Tt}$.`, then: `Ti serve almeno $${g2(at)}$.` });
		const plain = /^\d+$/.test(qg.text) && qg.value.equals(at);
		if (k === 1 && !plain) last.push({ say: 'Cerca il primo voto con il più o il meno che basta.', math: [`\\hl{${qg.tex}} = ${g2(qg.value)}`] });
		const rows: ResultRow[] = [{ label: need, value: `almeno $${g2(at)}$` }];
		if (k === 1 && !plain) rows.push({ label: 'Scritto sul registro', value: `almeno $${qg.tex}$` });
		rows.push(now);
		return { ok: true, rows, copy: `almeno ${decimal(at, 2).text}`, steps: finish(last) };
	} catch {
		return fail('I pesi hanno troppe cifre per un calcolo esatto: prova con numeri più semplici, per esempio 1 1 2.');
	}
}
