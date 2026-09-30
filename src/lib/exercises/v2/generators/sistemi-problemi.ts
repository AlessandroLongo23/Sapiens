/**
 * Problemi con i sistemi. Spec: specs/exercises/sistemi-problemi.md
 *
 * Seven levels in the order of the lesson's worked examples, each a new kind of problem: two numbers,
 * prices and tickets (with the solution that is not acceptable), ages, geometry, the digits of a number,
 * percentages and mixtures (with the concentration out of range), motion with the current and a problem
 * with three unknowns.
 *
 * Every story is built backwards: the values of the unknowns first, then the data of the text. `params`
 * hold the data as the text states them, so the checker (scripts/exercises/checkers/sistemi_problemi.py)
 * rebuilds the system from the story and solves it on its own. The steps solve the system the way the
 * lesson does: reduction when a variable has equal or opposite coefficients, otherwise substitution.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { assembleChoice, textBlock } from '../insiemi';

export const ID = 'sistemi-problemi';

export const STORIES: Record<number, readonly string[]> = {
	1: ['somma-differenza', 'somma-rapporto', 'differenza-rapporto', 'somma-supera'],
	2: ['biglietti', 'quaderni', 'monete', 'banconote'],
	3: ['eta-differenza', 'eta-somma'],
	4: ['rettangolo', 'isoscele'],
	5: ['somma-scambio', 'rapporto-scambio', 'somma-multiplo', 'differenza-somma'],
	6: ['sconti', 'miscela'],
	7: ['fiume', 'monete3'],
};

/** Levels whose problems may be impossible: the option "Il problema è impossibile" is always there. */
const WITH_IMPOSSIBLE = new Set([2, 6]);

const TIMES: Record<number, string> = { 2: 'doppio', 3: 'triplo', 4: 'quadruplo', 5: 'quintuplo' };
const ORD = ['prima', 'seconda', 'terza'];
const NAMES = ['Giulia', 'Sara', 'Marta', 'Anna', 'Elena', 'Luca', 'Marco', 'Paolo', 'Davide', 'Matteo', 'Tommaso', 'Giorgio'];
const IMPOSSIBLE = 'impossibile';

const t = (s: string) => `\\text{${s}}`;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// LaTeX of numbers, terms and systems

/** A rational as LaTeX: 12, -3, 182{,}5 (a finite decimal with up to three digits), otherwise \frac. */
export function valTex(r: Rational): string {
	if (r.isInteger()) return String(r.num);
	let a = r.abs();
	let k = 0;
	while (!a.isInteger() && k < 3) {
		a = a.mul(q(10));
		k++;
	}
	if (!a.isInteger()) return r.toLatex();
	const s = String(a.num).padStart(k + 1, '0');
	return `${r.sign() < 0 ? '-' : ''}${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

/** Signed pieces joined: [[1, '12x'], [-1, '8y']] gives 12x - 8y. Bodies are written without their sign. */
function join(parts: [number, string][]): string {
	return parts
		.map(([s, b], i) => (i === 0 ? (s < 0 ? `-${b}` : b) : `${s < 0 ? '-' : '+'} ${b}`))
		.join(' ');
}
/** |a|·v without the sign: x, 3x. */
const termBody = (a: number, v: string) => (Math.abs(a) === 1 ? v : `${Math.abs(a)}${v}`);
/** a·v with its sign: x, -x, 3x, -3x. */
const cx = (a: number, v: string) => join([[Math.sign(a), termBody(a, v)]]);

export interface Row {
	a: number[];
	c: number;
}

function linTex(a: number[], vars: string[]): string {
	return join(a.flatMap((c, i): [number, string][] => (c === 0 ? [] : [[Math.sign(c), termBody(c, vars[i])]])));
}
const rowTex = (r: Row, vars: string[]) => `${linTex(r.a, vars)} = ${r.c}`;
export const casesTex = (eqs: string[]) => `\\begin{cases} ${eqs.join(' \\\\ ')} \\end{cases}`;

/** a times a known value, as a signed piece: 12 \cdot 180, 12 \cdot (-3), 31. */
function prod(a: number, v: Rational): [number, string] {
	if (Math.abs(a) === 1) return [Math.sign(a) * (v.sign() < 0 ? -1 : 1), valTex(v.abs())];
	return [Math.sign(a), `${Math.abs(a)} \\cdot ${v.sign() < 0 ? `(${valTex(v)})` : valTex(v)}`];
}

/** p + r·u as it reads best: 300 - x, y + 26, 3y. */
function affine(p: number, r: number, u: string): string {
	const parts: [number, string][] = [];
	if (r > 0) {
		parts.push([1, termBody(r, u)]);
		if (p !== 0) parts.push([Math.sign(p), String(Math.abs(p))]);
	} else {
		if (p !== 0) parts.push([Math.sign(p), String(Math.abs(p))]);
		parts.push([-1, termBody(r, u)]);
	}
	return join(parts);
}

// ---------------------------------------------------------------------------
// Solving a 2 × 2 system with integer coefficients, with the steps of the lesson

interface Solved {
	steps: string[];
	sol: Rational[];
}

/** Back substitution: the value of vars[o] in the row where vars[e] is easiest to find. */
function backSub(rows: Row[], vars: string[], o: number, value: Rational, e: number): Solved {
	const i = Math.abs(rows[0].a[e]) === 1 ? 0 : Math.abs(rows[1].a[e]) === 1 ? 1 : rows[0].a[e] !== 0 ? 0 : 1;
	const r = rows[i];
	const ae = r.a[e];
	const rhs = q(r.c).sub(value.mul(q(r.a[o])));
	const res = rhs.div(q(ae));
	const steps: string[] = [];
	if (r.a[o] !== 0) {
		const pieces: [number, string][] = [];
		const known = prod(r.a[o], value);
		const unknown: [number, string] = [Math.sign(ae), termBody(ae, vars[e])];
		if (o < e) pieces.push(known, unknown);
		else pieces.push(unknown, known);
		steps.push(`${t(`Sostituisci `)} ${vars[o]} = ${valTex(value)} ${t(` nella ${ORD[i]} equazione: `)} ${join(pieces)} = ${r.c}`);
	}
	if (ae !== 1) steps.push(`${cx(ae, vars[e])} = ${valTex(rhs)}`);
	steps.push(`${vars[e]} = ${valTex(res)}`);
	const sol: Rational[] = [];
	sol[o] = value;
	sol[e] = res;
	return { steps, sol };
}

function reduction(rows: Row[], vars: string[], e: number, kind: 'opp' | 'eq'): Solved {
	const o = 1 - e;
	const [r0, r1] = rows;
	let k: number, m: number, text: string;
	if (kind === 'opp') {
		k = r0.a[o] + r1.a[o];
		m = r0.c + r1.c;
		text = `${t('Sommando membro a membro, ')} ${vars[e]} ${t(' se ne va: ')}`;
	} else {
		k = r1.a[o] - r0.a[o];
		m = r1.c - r0.c;
		text = `${t('Sottraendo la prima equazione dalla seconda, ')} ${vars[e]} ${t(' se ne va: ')}`;
		if (k < 0) {
			k = -k;
			m = -m;
			text = `${t('Sottraendo la seconda equazione dalla prima, ')} ${vars[e]} ${t(' se ne va: ')}`;
		}
	}
	const value = q(m, k);
	const steps = [`${text} ${cx(k, vars[o])} = ${m}`];
	if (k !== 1) steps.push(`${vars[o]} = ${valTex(value)}`);
	const back = backSub(rows, vars, o, value, e);
	return { steps: [...steps, ...back.steps], sol: back.sol };
}

function substitution(rows: Row[], vars: string[], i: number, v: number): Solved {
	const u = 1 - v;
	const j = 1 - i;
	const row = rows[i];
	const av = row.a[v];
	if (Math.abs(av) !== 1) throw new Error(`${ID}: substitution needs a coefficient ±1`);
	const p = row.c * av;
	const r = -row.a[u] * av;
	const expr = affine(p, r, vars[u]);
	const steps = [`${t(`Dalla ${ORD[i]} equazione ricavi `)} ${vars[v]} = ${expr}${t(`, e lo sostituisci nella ${ORD[j]}:`)}`];
	const { a, c: C } = rows[j];
	const A = a[u];
	const B = a[v];
	const plain = B === 1 && !expr.startsWith('-');
	// a single monomial is multiplied with a dot (2 \cdot 3x), a binomial goes in parentheses (8(300 - x))
	const vPiece: [number, string] = plain
		? [1, expr]
		: p === 0
			? [Math.sign(B * r), Math.abs(B) === 1 ? termBody(r, vars[u]) : `${Math.abs(B)} \\cdot ${termBody(r, vars[u])}`]
			: [Math.sign(B), `${Math.abs(B) === 1 ? '' : Math.abs(B)}(${expr})`];
	const pieces: [number, string][] = [];
	const uPiece: [number, string][] = A === 0 ? [] : [[Math.sign(A), termBody(A, vars[u])]];
	if (u < v) pieces.push(...uPiece, vPiece);
	else pieces.push(vPiece, ...uPiece);
	steps.push(`${join(pieces)} = ${C}`);
	if (!plain) {
		// expanded, in the order of the expression
		const exp: [number, string][] = [];
		const bp: [number, string][] = B * p === 0 ? [] : [[Math.sign(B * p), String(Math.abs(B * p))]];
		const bru: [number, string] = [Math.sign(B * r), termBody(B * r, vars[u])];
		const inner: [number, string][] = r > 0 ? [bru, ...bp] : [...bp, bru];
		if (u < v) exp.push(...uPiece, ...inner);
		else exp.push(...inner, ...uPiece);
		const expanded = `${join(exp)} = ${C}`;
		if (expanded !== steps[steps.length - 1]) steps.push(expanded);
	}
	const K = A + B * r;
	const M = C - B * p;
	if (K === 0) throw new Error(`${ID}: singular system`);
	const collected = `${cx(K, vars[u])} = ${M}`;
	if (collected !== steps[steps.length - 1]) steps.push(collected);
	const value = q(M, K);
	if (K !== 1) steps.push(`${vars[u]} = ${valTex(value)}`);
	// back to the other unknown
	const withValue: [number, string][] = [];
	const rv = r === 0 ? null : prod(r, value);
	if (r > 0 && rv) withValue.push(rv);
	if (p !== 0) withValue.push([Math.sign(p), String(Math.abs(p))]);
	if (r < 0 && rv) withValue.push(rv);
	const res = q(p).add(value.mul(q(r)));
	const shown = join(withValue);
	steps.push(shown === valTex(res) ? `${t('Allora ')} ${vars[v]} = ${valTex(res)}` : `${t('Allora ')} ${vars[v]} = ${shown} = ${valTex(res)}`);
	const sol: Rational[] = [];
	sol[u] = value;
	sol[v] = res;
	return { steps, sol };
}

/**
 * Solves a 2 × 2 system: reduction when a variable has opposite (then equal) coefficients, otherwise
 * substitution from a coefficient ±1 (`sub` forces it: row and variable), otherwise reduction after
 * multiplying the two equations.
 */
export function solve2(rows: Row[], vars: string[], sub?: [number, number]): Solved {
	const [r0, r1] = rows;
	if (r0.a[0] * r1.a[1] - r0.a[1] * r1.a[0] === 0) throw new Error(`${ID}: singular system`);
	if (sub) return substitution(rows, vars, sub[0], sub[1]);
	for (const e of [1, 0]) if (r0.a[e] !== 0 && r0.a[e] === -r1.a[e]) return reduction(rows, vars, e, 'opp');
	for (const e of [0, 1]) if (r0.a[e] !== 0 && r0.a[e] === r1.a[e]) return reduction(rows, vars, e, 'eq');
	for (const v of [1, 0]) for (const i of [0, 1]) if (Math.abs(rows[i].a[v]) === 1) return substitution(rows, vars, i, v);
	const l = lcm(Math.abs(r0.a[1]), Math.abs(r1.a[1]));
	const m0 = l / Math.abs(r0.a[1]);
	const m1 = l / Math.abs(r1.a[1]);
	const scaled = [
		{ a: r0.a.map((x) => x * m0), c: r0.c * m0 },
		{ a: r1.a.map((x) => x * m1), c: r1.c * m1 },
	];
	const text = m0 === 1 ? t(`Moltiplica la seconda equazione per ${m1}:`) : m1 === 1 ? t(`Moltiplica la prima equazione per ${m0}:`) : t(`Moltiplica la prima equazione per ${m0} e la seconda per ${m1}:`);
	const red = reduction(scaled, vars, 1, scaled[0].a[1] === -scaled[1].a[1] ? 'opp' : 'eq');
	return { steps: [text, casesTex(scaled.map((r) => rowTex(r, vars))), ...red.steps], sol: red.sol };
}

// ---------------------------------------------------------------------------
// The problems

type Answer =
	/** The values of the unknowns, one option line each; level 1 writes "31 e 19". */
	| { kind: 'tuple'; labels: string[]; unit: string }
	/** One number the question asks (an area, the number with the digits). */
	| { kind: 'number'; value: Rational };

interface Problem {
	story: string;
	data: Record<string, string | number>;
	prose: string;
	/** What x and y are, with their limitations. */
	unknowns: string;
	/** The system as the text gives it, in LaTeX. */
	system: string;
	/** From the translated system to the integer rows (may be empty). */
	normalize: string[];
	/** Everything after the system: the solution, the check or the rejection, the answer. */
	solving: string[];
	sol: Rational[];
	ok: boolean;
	answer: Answer;
	solution: string;
	/** Wrong answers from real mistakes, in order of preference: tuples for a tuple answer, one number otherwise. */
	mistakes: Rational[][];
}

const natural = (r: Rational) => r.isInteger() && r.num >= 0;
const R = (xs: number[]) => xs.map((x) => q(x));

/** The check on the text, or for a solution that is not acceptable the reason it is rejected. */
function acceptance(sol: Rational[], ok: boolean, check: string, reject: string): string {
	if (ok) return `${t('Controllo sul testo: ')} ${check}`;
	const i = Math.max(0, sol.findIndex((s) => !natural(s)));
	return `${valTex(sol[i])} ${t(reject)}`;
}

// Level 1: two numbers ------------------------------------------------------

function numeri(rng: Rng, story: string): Problem {
	for (;;) {
		const k = rng.int(2, story === 'somma-supera' ? 3 : 5);
		const y = rng.int(2, 40);
		let x: number, rows: Row[], system: string, prose: string, sub: [number, number] | undefined, check: string;
		const mistakes: number[][] = [];
		const data: Record<string, number> = {};
		if (story === 'somma-differenza') {
			x = rng.int(y + 2, y + 50);
			const S = x + y, D = x - y;
			Object.assign(data, { S, D });
			prose = `La somma di due numeri è ${S} e la loro differenza è ${D}. Quali sono i due numeri?`;
			system = casesTex([`x + y = ${S}`, `x - y = ${D}`]);
			rows = [{ a: [1, 1], c: S }, { a: [1, -1], c: D }];
			check = `${x} + ${y} = ${S} ${t(' e ')} ${x} - ${y} = ${D}`;
			// the difference split in the wrong way; y read as the difference
			if (S % 2 === 0) mistakes.push([S / 2 + D, S / 2 - D]);
			mistakes.push([S - D, D], [x + D, y]);
		} else if (story === 'somma-rapporto') {
			x = k * y;
			const S = x + y;
			Object.assign(data, { S, k });
			prose = `La somma di due numeri è ${S}, e uno è il ${TIMES[k]} dell'altro. Quali sono i due numeri?`;
			system = casesTex([`x + y = ${S}`, `x = ${k}y`]);
			rows = [{ a: [1, 1], c: S }, { a: [1, -k], c: 0 }];
			sub = [1, 0];
			check = `${x} + ${y} = ${S} ${t(' e ')} ${x} = ${k} \\cdot ${y}`;
			// the sum divided by k; one of the two numbers off
			if (S % k === 0) mistakes.push([S - S / k, S / k]);
			mistakes.push([k * (y + 1), y + 1], [k * (y - 1), y - 1]);
		} else if (story === 'differenza-rapporto') {
			x = k * y;
			const D = x - y;
			Object.assign(data, { D, k });
			prose = `Due numeri differiscono di ${D}, e il maggiore è il ${TIMES[k]} del minore. Quali sono i due numeri?`;
			system = casesTex([`x - y = ${D}`, `x = ${k}y`]);
			rows = [{ a: [1, -1], c: D }, { a: [1, -k], c: 0 }];
			sub = [1, 0];
			check = `${x} - ${y} = ${D} ${t(' e ')} ${x} = ${k} \\cdot ${y}`;
			if (D % k === 0) mistakes.push([D / k + D, D / k]);
			mistakes.push([x + 1, y + 1], [k * (y + 1), y + 1]);
		} else {
			const d = rng.int(1, 15);
			x = k * y + d;
			const S = x + y;
			Object.assign(data, { S, k, d });
			prose = `La somma di due numeri è ${S}, e il maggiore supera di ${d} il ${TIMES[k]} del minore. Quali sono i due numeri?`;
			system = casesTex([`x + y = ${S}`, `x = ${k}y + ${d}`]);
			rows = [{ a: [1, 1], c: S }, { a: [1, -k], c: d }];
			sub = [1, 0];
			check = `${x} + ${y} = ${S} ${t(' e ')} ${x} = ${k} \\cdot ${y} + ${d}`;
			// "supera" on the wrong side (x = ky - d), the excess inside the product (x = k(y + d))
			if ((S + d) % (k + 1) === 0) mistakes.push([S - (S + d) / (k + 1), (S + d) / (k + 1)]);
			if ((S - k * d) % (k + 1) === 0) mistakes.push([S - (S - k * d) / (k + 1), (S - k * d) / (k + 1)]);
		}
		if (x + y > 160 || x <= y) continue;
		for (let i = 1; i <= 6; i++) mistakes.push([x + i, y - i], [x - i, y + i]);
		const solved = solve2(rows, ['x', 'y'], sub);
		return {
			story,
			data,
			prose,
			unknowns: `${t('Chiama ')} x ${t(' il maggiore e ')} y ${t(' il minore')}`,
			system,
			normalize: [],
			solving: [...solved.steps, `${t('Controllo sul testo: ')} ${check}`],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'tuple', labels: [], unit: '' },
			solution: `${t('I due numeri sono ')} ${x} ${t(' e ')} ${y}`,
			mistakes: mistakes.map(R),
		};
	}
}

// Level 2: prices, with the solution that is not acceptable ------------------

interface PriceCtx {
	key: string;
	labels: (p1: number, p2: number) => [string, string];
	N: [number, number];
	prices: (rng: Rng) => [number, number];
	prose: (rng: Rng, N: number, p1: number, p2: number, I: number) => string;
	unknowns: (p1: number, p2: number) => string;
	solution: (x: number, y: number, p1: number, p2: number) => string;
}

const PRICE_CTX: Record<string, PriceCtx> = {
	biglietti: {
		key: 'biglietti',
		labels: () => ['interi', 'ridotti'],
		N: [80, 400],
		prices: (rng) => [rng.int(10, 18), rng.int(5, 9)],
		prose: (_r, N, p1, p2, I) => `Per uno spettacolo si vendono ${N} biglietti: gli interi costano ${p1} euro e i ridotti ${p2} euro. L'incasso è di ${I} euro. Quanti biglietti di ciascun tipo sono stati venduti?`,
		unknowns: () => `${t('Chiama ')} x ${t(' il numero dei biglietti interi e ')} y ${t(' quello dei ridotti: sono numeri naturali')}`,
		solution: (x, y) => `Sono stati venduti ${x} biglietti interi e ${y} ridotti`,
	},
	quaderni: {
		key: 'quaderni',
		labels: () => ['quaderni', 'penne'],
		N: [6, 20],
		prices: (rng) => [rng.int(3, 6), rng.int(1, 2)],
		prose: (rng, N, p1, p2, I) => `${rng.pick(NAMES)} compra ${N} oggetti, tra quaderni da ${p1} euro e penne da ${p2} euro, e spende ${I} euro. Quanti quaderni e quante penne compra?`,
		unknowns: () => `${t('Chiama ')} x ${t(' il numero dei quaderni e ')} y ${t(' quello delle penne: sono numeri naturali')}`,
		solution: (x, y) => `${x} ${x === 1 ? 'quaderno' : 'quaderni'} e ${y} ${y === 1 ? 'penna' : 'penne'}`,
	},
	monete: {
		key: 'monete',
		labels: () => ['da 2 euro', 'da 1 euro'],
		N: [10, 60],
		prices: () => [2, 1],
		prose: (_r, N, _p1, _p2, I) => `In un salvadanaio ci sono ${N} monete, da 2 euro e da 1 euro, per un totale di ${I} euro. Quante monete ci sono di ciascun tipo?`,
		unknowns: () => `${t('Chiama ')} x ${t(' il numero delle monete da 2 euro e ')} y ${t(' quello delle monete da 1 euro: sono numeri naturali')}`,
		solution: (x, y) => `${x} ${x === 1 ? 'moneta' : 'monete'} da 2 euro e ${y} da 1 euro`,
	},
	banconote: {
		key: 'banconote',
		labels: (p1, p2) => [`da ${p1} euro`, `da ${p2} euro`],
		N: [8, 40],
		prices: (rng) => rng.pick([[10, 5], [20, 10], [50, 20], [50, 10], [20, 5]] as [number, number][]),
		prose: (_r, N, p1, p2, I) => `In una cassa ci sono ${N} banconote, da ${p1} euro e da ${p2} euro, per un totale di ${I} euro. Quante banconote ci sono di ciascun tipo?`,
		unknowns: (p1, p2) => `${t('Chiama ')} x ${t(` il numero delle banconote da ${p1} euro e `)} y ${t(` quello delle banconote da ${p2} euro: sono numeri naturali`)}`,
		solution: (x, y, p1, p2) => `${x} ${x === 1 ? 'banconota' : 'banconote'} da ${p1} euro e ${y} da ${p2} euro`,
	},
};

function prezzi(rng: Rng, story: string, ok: boolean): Problem {
	const ctx = PRICE_CTX[story];
	for (;;) {
		const [p1, p2] = ctx.prices(rng);
		const N = rng.int(ctx.N[0], ctx.N[1]);
		let I: number;
		if (ok) {
			const x = rng.int(1, N - 1);
			I = p1 * x + p2 * (N - x);
		} else if (p1 - p2 > 1 && rng.int(0, 1) === 1) {
			// x between 0 and N but not an integer
			I = rng.int(p2 * N + 1, p1 * N - 1);
		} else {
			// more than the most expensive, or less than the cheapest
			I = rng.int(0, 1) === 1 ? p1 * N + rng.int(1, 3 * p1) : p2 * N - rng.int(1, Math.max(1, Math.min(3 * p1, Math.floor((p2 * N) / 5))));
		}
		const xr = q(I - p2 * N, p1 - p2);
		const yr = q(N).sub(xr);
		const acceptable = natural(xr) && natural(yr) && xr.num > 0 && yr.num > 0;
		if (acceptable !== ok) continue;
		if (!ok && (xr.isZero() || yr.isZero())) continue;
		const prose = ctx.prose(rng, N, p1, p2, I);
		const rows: Row[] = [{ a: [1, 1], c: N }, { a: [p1, p2], c: I }];
		const solved = solve2(rows, ['x', 'y']);
		const [x, y] = solved.sol;
		const check = `${x.num} + ${y.num} = ${N} ${t(' e ')} ${join([prod(p1, x), prod(p2, y)])} = ${I}`;
		const last = acceptance(solved.sol, ok, check, ` non è un numero naturale: la soluzione non è accettabile, e il problema è impossibile`);
		const [l1, l2] = ctx.labels(p1, p2);
		const mistakes: Rational[][] = [];
		if (ok) {
			mistakes.push([y, x]);
			for (let i = 1; i <= 8; i++) mistakes.push(R([x.num + i, y.num - i]), R([x.num - i, y.num + i]));
		} else {
			// the rejected solution, then the naturals closest to it
			mistakes.push([x, y]);
			const f = Math.min(Math.max(Math.floor(x.num / x.den), 0), N);
			mistakes.push(R([f, N - f]), R([f + 1, N - f - 1]), R([N, 0]), R([0, N]));
			for (let i = 1; i <= 8; i++) mistakes.push(R([f - i, N - f + i]), R([f + 1 + i, N - f - 1 - i]));
		}
		return {
			story,
			data: { N, p1, p2, I, case: ok ? 'accettabile' : 'impossibile' },
			prose,
			unknowns: ctx.unknowns(p1, p2),
			system: casesTex([`x + y = ${N}`, `${p1}x + ${p2 === 1 ? '' : p2}y = ${I}`]),
			normalize: [],
			solving: [...solved.steps, last],
			sol: solved.sol,
			ok,
			answer: { kind: 'tuple', labels: [l1, l2], unit: '' },
			solution: ok ? t(ctx.solution(x.num, y.num, p1, p2)) : t('Il problema è impossibile'),
			mistakes,
		};
	}
}

// Level 3: ages -------------------------------------------------------------

const FAMILY = [
	{ P: 'madre', C: 'figlia', un: 'una madre', il: 'la madre', del: 'della figlia', di: 'di sua figlia' },
	{ P: 'madre', C: 'figlio', un: 'una madre', il: 'la madre', del: 'del figlio', di: 'di suo figlio' },
	{ P: 'padre', C: 'figlia', un: 'un padre', il: 'il padre', del: 'della figlia', di: 'di sua figlia' },
	{ P: 'padre', C: 'figlio', un: 'un padre', il: 'il padre', del: 'del figlio', di: 'di suo figlio' },
];

function eta(rng: Rng, story: string): Problem {
	for (;;) {
		const f = rng.int(0, FAMILY.length - 1);
		const F = FAMILY[f];
		const k = rng.int(2, 5);
		const n = rng.int(2, 15);
		const when = rng.pick(['tra', 'fa'] as const);
		const y = rng.int(2, 30);
		if (when === 'fa' && y - n < 1) continue;
		const x = when === 'tra' ? k * (y + n) - n : k * (y - n) + n;
		const d = x - y;
		if (d < 20 || d > 45 || x > 70) continue;
		const S = x + y;
		const sg = when === 'tra' ? '+' : '-';
		const whenText =
			when === 'tra'
				? `Tra ${n} anni ${F.il} avrà il ${TIMES[k]} degli anni ${F.del}.`
				: `${n} anni fa ${F.il} aveva il ${TIMES[k]} degli anni ${F.del}.`;
		const first = story === 'eta-differenza' ? `Oggi ${F.un} ha ${d} anni più ${F.del}.` : `Oggi la somma delle età di ${F.un} e ${F.di} è ${S} anni.`;
		const prose = `${first} ${whenText} Quanti anni hanno oggi?`;
		const eq1 = story === 'eta-differenza' ? `x = y + ${d}` : `x + y = ${S}`;
		const eq2 = `x ${sg} ${n} = ${k}(y ${sg} ${n})`;
		const c2 = (when === 'tra' ? 1 : -1) * (k - 1) * n;
		const rows: Row[] = [story === 'eta-differenza' ? { a: [1, -1], c: d } : { a: [1, 1], c: S }, { a: [1, -k], c: c2 }];
		const solved = solve2(rows, ['x', 'y'], story === 'eta-differenza' ? [0, 0] : undefined);
		const nowP = when === 'tra' ? x + n : x - n;
		const nowC = when === 'tra' ? y + n : y - n;
		const check = `${story === 'eta-differenza' ? `${x} - ${y} = ${d}` : `${x} + ${y} = ${S}`}${t(`, e ${when === 'tra' ? `tra ${n} anni` : `${n} anni fa`} `)} ${nowP} = ${k} \\cdot ${nowC}`;
		// time passing for one only (x ± n = k·y), time forgotten (x = k·y), then ages near the answer
		const mistakes: number[][] = [];
		const [a0, a1] = rows[0].a;
		for (const c of [when === 'tra' ? -n : n, 0]) {
			// x - k·y = c together with the first equation: x = c + k·y
			const yy = q(rows[0].c - a0 * c, a0 * k + a1);
			const xx = q(c).add(yy.mul(q(k)));
			mistakes.push([xx.num / xx.den, yy.num / yy.den]);
		}
		for (let i = 1; i <= 6; i++) {
			if (story === 'eta-differenza') mistakes.push([x + i, y + i], [x - i, y - i]);
			else mistakes.push([x + i, y - i], [x - i, y + i]);
		}
		return {
			story,
			data: { family: f, k, n, when, ...(story === 'eta-differenza' ? { d } : { S }) },
			prose,
			unknowns: `${t(`Chiama `)} x ${t(` l'età ${F.P === 'madre' ? 'della madre' : 'del padre'} oggi e `)} y ${t(` quella ${F.del}, in anni: `)} x ${t(` e `)} y ${t(' sono positivi')}${when === 'fa' ? `${t(', e ')} y > ${n}` : ''}`,
			system: casesTex([eq1, eq2]),
			normalize: [`${t('Svolgi i calcoli nella seconda equazione e porta le incognite a sinistra: ')} x - ${k}y = ${c2}`],
			solving: [...solved.steps, `${t('Controllo sul testo: ')} ${check}`],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'tuple', labels: [F.P, F.C], unit: 'anni' },
			solution: t(`${cap(F.il)} ha ${x} anni, ${F.C === 'figlia' ? 'la figlia' : 'il figlio'} ${y}`),
			mistakes: mistakes.filter((m) => m.every(Number.isInteger)).map(R),
		};
	}
}

// Level 4: geometry ---------------------------------------------------------

function rettangolo(rng: Rng): Problem {
	for (;;) {
		const u = rng.pick(['cm', 'm']);
		const x = rng.int(4, 30);
		const y = rng.int(3, 20);
		if (x === y) continue;
		// one side changes by a length, the other is doubled or tripled (otherwise the two equations say the same thing)
		const which = rng.pick(['base', 'altezza'] as const);
		const k = rng.int(2, 3);
		const s = rng.pick([1, -1]);
		const a = rng.int(1, 6);
		const nb = which === 'altezza' ? x + s * a : k * x;
		const nh = which === 'altezza' ? k * y : y + s * a;
		if (nb <= 0 || nh <= 0) continue;
		const P = 2 * (x + y);
		const P2 = 2 * (nb + nh);
		const verbK = k === 2 ? 'si raddoppia' : 'si triplica';
		const change =
			which === 'altezza'
				? `Se si ${s > 0 ? 'allunga' : 'accorcia'} la base di ${a} ${u} e ${verbK} l'altezza`
				: `Se ${verbK} la base e si ${s > 0 ? 'allunga' : 'accorcia'} l'altezza di ${a} ${u}`;
		const prose = `Un rettangolo ha perimetro ${P} ${u}. ${change}, il perimetro diventa ${P2} ${u}. Calcola l'area del rettangolo.`;
		const sgn = s > 0 ? '+' : '-';
		const eq2 = which === 'altezza' ? `2(x ${sgn} ${a} + ${k}y) = ${P2}` : `2(${k}x + y ${sgn} ${a}) = ${P2}`;
		const rows: Row[] = [
			{ a: [1, 1], c: P / 2 },
			which === 'altezza' ? { a: [1, k], c: P2 / 2 - s * a } : { a: [k, 1], c: P2 / 2 - s * a },
		];
		const solved = solve2(rows, ['x', 'y']);
		const A = x * y;
		// the semiperimeter, the perimeter taken as x + y, the new rectangle, a side off by one
		const wrongP = solve2([{ a: [1, 1], c: P }, which === 'altezza' ? { a: [1, k], c: P2 - s * a } : { a: [k, 1], c: P2 - s * a }], ['x', 'y']).sol;
		const mistakes = [[x + y], [nb * nh], [wrongP[0].mul(wrongP[1]).num / wrongP[0].mul(wrongP[1]).den], [2 * (x + y)], [(x + 1) * y], [x * (y + 1)], [(x - 1) * y], [x * (y - 1)]];
		return {
			story: 'rettangolo',
			data: { u, which, k, s, a, P, P2 },
			prose,
			unknowns: `${t(`Chiama `)} x ${t(' la base e ')} y ${t(` l'altezza, in ${u}, con `)} x > 0 ${t(' e ')} y > 0`,
			system: casesTex([`2(x + y) = ${P}`, eq2]),
			normalize: [`${t('Dividi le due equazioni per 2 e porta i numeri a destra:')}`, casesTex(rows.map((r) => rowTex(r, ['x', 'y'])))],
			solving: [
				...solved.steps,
				`${t('Controllo sul testo: ')} 2 \\cdot (${x} + ${y}) = ${P} ${t(' e ')} 2 \\cdot (${nb} + ${nh}) = ${P2}`,
				`${t("L'area è ")} ${x} \\cdot ${y} = ${A}`,
			],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'number', value: q(A) },
			solution: `${t("L'area è ")} ${A} \\text{ ${u}}^2`,
			mistakes: mistakes.filter((m) => Number.isInteger(m[0])).map(R),
		};
	}
}

function isoscele(rng: Rng): Problem {
	for (;;) {
		const rel = rng.pick(['vertice-supera', 'base-supera', 'vertice-volte', 'base-volte'] as const);
		let x: number, y: number, eq2: string, row2: Row, relText: string, check2: string;
		let d = 0;
		let k = 0;
		if (rel === 'vertice-supera' || rel === 'base-supera') {
			d = 3 * rng.int(2, 28);
			if (rel === 'vertice-supera') {
				y = (180 - d) / 3;
				x = y + d;
				eq2 = `x = y + ${d}`;
				row2 = { a: [1, -1], c: d };
				relText = `l'angolo al vertice supera di $${d}^\\circ$ ciascuno degli angoli alla base`;
				check2 = `${x} - ${y} = ${d}`;
			} else {
				x = (180 - 2 * d) / 3;
				y = x + d;
				eq2 = `y = x + ${d}`;
				row2 = { a: [-1, 1], c: d };
				relText = `ciascuno degli angoli alla base supera di $${d}^\\circ$ l'angolo al vertice`;
				check2 = `${y} - ${x} = ${d}`;
			}
		} else if (rel === 'vertice-volte') {
			k = rng.pick([2, 3, 4]);
			y = 180 / (k + 2);
			x = k * y;
			eq2 = `x = ${k}y`;
			row2 = { a: [1, -k], c: 0 };
			relText = `l'angolo al vertice è il ${TIMES[k]} di ciascuno degli angoli alla base`;
			check2 = `${x} = ${k} \\cdot ${y}`;
		} else {
			k = rng.pick([2, 4]);
			x = 180 / (2 * k + 1);
			y = k * x;
			eq2 = `y = ${k}x`;
			row2 = { a: [-k, 1], c: 0 };
			relText = `ciascuno degli angoli alla base è il ${TIMES[k]} dell'angolo al vertice`;
			check2 = `${y} = ${k} \\cdot ${x}`;
		}
		if (x <= 0 || y <= 0 || x === y || !Number.isInteger(x) || !Number.isInteger(y)) continue;
		const rows: Row[] = [{ a: [1, 2], c: 180 }, row2];
		const sub: [number, number] = rel === 'vertice-supera' || rel === 'vertice-volte' ? [1, 0] : [1, 1];
		const solved = solve2(rows, ['x', 'y'], sub);
		// the two base angles counted once (x + y = 180), vertex and base swapped, the sum kept but the relation lost
		const once = solve2([{ a: [1, 1], c: 180 }, row2], ['x', 'y']).sol;
		const mistakes: Rational[][] = [once, R([y, x]), R([x + 2, y - 1]), R([x - 2, y + 1]), R([x + 4, y - 2]), R([x - 4, y + 2]), R([x + 6, y - 3])];
		return {
			story: 'isoscele',
			data: { rel, d, k },
			prose: `In un triangolo isoscele ${relText}. Quanto misurano gli angoli?`,
			unknowns: `${t('Chiama ')} x ${t(" l'angolo al vertice e ")} y ${t(' ciascun angolo alla base, in gradi: la somma degli angoli interni è ')} 180^\\circ`,
			system: casesTex([`x + 2y = 180`, eq2]),
			normalize: [],
			solving: [...solved.steps, `${t('Controllo sul testo: ')} ${x} + ${y} + ${y} = 180 ${t(' e ')} ${check2}`],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'tuple', labels: ['al vertice', 'alla base'], unit: '°' },
			solution: `${t("L'angolo al vertice misura ")} ${x}^\\circ${t(', ciascun angolo alla base ')} ${y}^\\circ`,
			mistakes: mistakes.filter((m) => m.every((v) => v.isInteger() && v.num > 0)),
		};
	}
}

// Level 5: the digits of a number -------------------------------------------

function cifre(rng: Rng, story: string): Problem {
	for (;;) {
		const x = rng.int(1, 9);
		const y = rng.int(1, 9);
		if (x === y) continue;
		const Nn = 10 * x + y;
		const Sw = 10 * y + x;
		const s = x + y;
		const D = Math.abs(Sw - Nn);
		const up = y > x;
		const swapText = up ? `Se si scambiano le due cifre, si ottiene un numero che supera di ${D} quello di partenza.` : `Se si scambiano le due cifre, il numero diminuisce di ${D}.`;
		const swapEq = `10y + x = 10x + y ${up ? '+' : '-'} ${D}`;
		const swapNorm = [`${t('Nella seconda equazione porta le incognite a sinistra: ')} ${up ? `9y - 9x = ${D}` : `9x - 9y = ${D}`}`, `${t('e dividi per 9: ')} ${up ? `y - x = ${D / 9}` : `x - y = ${D / 9}`}`];
		const swapRow: Row = up ? { a: [-1, 1], c: D / 9 } : { a: [1, -1], c: D / 9 };
		const swapCheck = up ? `${Sw} - ${Nn} = ${D}` : `${Nn} - ${Sw} = ${D}`;
		let prose: string, system: string, normalize: string[], rows: Row[], check: string, sub: [number, number] | undefined;
		const data: Record<string, number | string> = {};
		if (story === 'somma-scambio') {
			Object.assign(data, { s, D, dir: up ? 'aumenta' : 'diminuisce' });
			prose = `Un numero di due cifre ha la somma delle cifre uguale a ${s}. ${swapText} Qual è il numero?`;
			system = casesTex([`x + y = ${s}`, swapEq]);
			normalize = swapNorm;
			rows = [{ a: [1, 1], c: s }, swapRow];
			check = `${x} + ${y} = ${s} ${t(' e ')} ${swapCheck}`;
		} else if (story === 'rapporto-scambio') {
			// one digit is k times the other
			const big = Math.max(x, y), small = Math.min(x, y);
			if (big % small !== 0) continue;
			const k = big / small;
			const tensBig = x > y;
			Object.assign(data, { k, D, dir: up ? 'aumenta' : 'diminuisce', rel: tensBig ? 'decine' : 'unita' });
			prose = tensBig
				? `In un numero di due cifre la cifra delle decine è il ${TIMES[k] ?? `${k} volte`} di quella delle unità. ${swapText} Qual è il numero?`
				: `In un numero di due cifre la cifra delle unità è il ${TIMES[k] ?? `${k} volte`} di quella delle decine. ${swapText} Qual è il numero?`;
			if (!TIMES[k]) continue;
			system = casesTex([tensBig ? `x = ${k}y` : `y = ${k}x`, swapEq]);
			normalize = swapNorm;
			rows = [tensBig ? { a: [1, -k], c: 0 } : { a: [-k, 1], c: 0 }, swapRow];
			sub = tensBig ? [0, 0] : [0, 1];
			check = `${tensBig ? `${x} = ${k} \\cdot ${y}` : `${y} = ${k} \\cdot ${x}`} ${t(' e ')} ${swapCheck}`;
		} else if (story === 'somma-multiplo') {
			if (Nn % s !== 0) continue;
			const k = Nn / s;
			Object.assign(data, { s, k });
			prose = `Un numero di due cifre ha la somma delle cifre uguale a ${s}, ed è uguale a ${k} volte la somma delle sue cifre. Qual è il numero?`;
			system = casesTex([`x + y = ${s}`, `10x + y = ${k}(x + y)`]);
			normalize = [`${t('Nella seconda equazione la somma delle cifre è ')} ${s}${t(': ')} 10x + y = ${k} \\cdot ${s} = ${k * s}`];
			rows = [{ a: [1, 1], c: s }, { a: [10, 1], c: k * s }];
			check = `${x} + ${y} = ${s} ${t(' e ')} ${Nn} = ${k} \\cdot ${s}`;
		} else {
			// the difference of the digits and the sum of the number and its swap: 11(x + y)
			const M = Nn + Sw;
			const dd = Math.abs(x - y);
			const tensBig = x > y;
			Object.assign(data, { d: dd, M, rel: tensBig ? 'decine' : 'unita' });
			prose = tensBig
				? `In un numero di due cifre la cifra delle decine supera di ${dd} quella delle unità. La somma del numero e di quello che si ottiene scambiando le cifre è ${M}. Qual è il numero?`
				: `In un numero di due cifre la cifra delle unità supera di ${dd} quella delle decine. La somma del numero e di quello che si ottiene scambiando le cifre è ${M}. Qual è il numero?`;
			system = casesTex([tensBig ? `x - y = ${dd}` : `y - x = ${dd}`, `10x + y + 10y + x = ${M}`]);
			normalize = [`${t('Nella seconda equazione somma i termini simili: ')} 11x + 11y = ${M}`, `${t('e dividi per 11: ')} x + y = ${M / 11}`];
			rows = [tensBig ? { a: [1, -1], c: dd } : { a: [-1, 1], c: dd }, { a: [1, 1], c: M / 11 }];
			check = `${tensBig ? `${x} - ${y}` : `${y} - ${x}`} = ${dd} ${t(' e ')} ${Nn} + ${Sw} = ${M}`;
		}
		const solved = solve2(rows, ['x', 'y'], sub);
		// the digits swapped, x·y and x + y in place of 10x + y, numbers with the same sum of digits
		const mistakes = [[Sw], [x * y], [10 * (x + 1) + (y - 1)], [10 * (x - 1) + (y + 1)], [10 * (x + 2) + (y - 2)], [10 * (x - 2) + (y + 2)], [Nn + 9], [Nn - 9], [Nn + 1], [Nn - 1]];
		return {
			story,
			data,
			prose,
			unknowns: `${t('Chiama ')} x ${t(' la cifra delle decine e ')} y ${t(' quella delle unità: sono cifre da 0 a 9, con ')} x \\neq 0${t('. Il numero vale ')} 10x + y ${t(' e, scambiando le cifre, ')} 10y + x`,
			system,
			normalize: [...normalize, casesTex(rows.map((r) => rowTex(r, ['x', 'y'])))],
			solving: [...solved.steps, `${t('Il numero è ')} ${Nn}${t('. Controllo sul testo: ')} ${check}`],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'number', value: q(Nn) },
			solution: `${t('Il numero è ')} ${Nn}`,
			mistakes: mistakes.filter((m) => m[0] >= 10 && m[0] <= 99).map(R),
		};
	}
}

// Level 6: percentages and mixtures -----------------------------------------

const ITEMS = [
	{ un: 'un paio di scarpe', il: 'le scarpe', del: 'delle scarpe', sc: 'sono scontate', label: 'scarpe' },
	{ un: 'una giacca', il: 'la giacca', del: 'della giacca', sc: 'è scontata', label: 'giacca' },
	{ un: 'uno zaino', il: 'lo zaino', del: 'dello zaino', sc: 'è scontato', label: 'zaino' },
	{ un: 'una felpa', il: 'la felpa', del: 'della felpa', sc: 'è scontata', label: 'felpa' },
	{ un: 'un cappotto', il: 'il cappotto', del: 'del cappotto', sc: 'è scontato', label: 'cappotto' },
	{ un: 'una borsa', il: 'la borsa', del: 'della borsa', sc: 'è scontata', label: 'borsa' },
	{ un: 'un casco', il: 'il casco', del: 'del casco', sc: 'è scontato', label: 'casco' },
	{ un: 'una bicicletta', il: 'la bicicletta', del: 'della bicicletta', sc: 'è scontata', label: 'bicicletta' },
];
const DISCOUNTS = [10, 15, 20, 25, 30, 40, 50];

/** The coefficient 1 - p/100 as a decimal with the comma: 0{,}8, 0{,}85. */
const keep = (p: number) => valTex(q(100 - p, 100));

/**
 * Multiply a row with decimals by 10 or 100 and divide by the common factor. `a` and `c` are in
 * hundredths; returns the integer row and the step that says what was done.
 */
function clearDecimals(a: number[], c: number, which: string): { row: Row; steps: string[] } {
	const m = [...a, c].every((v) => v % 10 === 0) ? 10 : 100;
	const f = 100 / m;
	let row = { a: a.map((v) => v / f), c: c / f };
	const steps = [`${t(`Moltiplica la ${which} equazione per ${m}, per togliere i decimali: `)} ${rowTex(row, ['x', 'y'])}`];
	const g = [...row.a, row.c].reduce((acc, v) => gcd(acc, v), 0);
	if (g > 1) {
		row = { a: row.a.map((v) => v / g), c: row.c / g };
		steps.push(`${t(`e dividi per ${g}: `)} ${rowTex(row, ['x', 'y'])}`);
	}
	return { row, steps };
}

function sconti(rng: Rng): Problem {
	for (;;) {
		const i = rng.int(0, ITEMS.length - 1);
		const j = rng.int(0, ITEMS.length - 1);
		if (i === j) continue;
		const A = ITEMS[i], B = ITEMS[j];
		const x = 20 * rng.int(1, 10);
		const y = 20 * rng.int(1, 10);
		const p1 = rng.pick(DISCOUNTS);
		const p2 = rng.pick(DISCOUNTS);
		if (x === y || p1 === p2 || Math.max(x, y) > 4 * Math.min(x, y)) continue;
		const T = x + y;
		const x2 = (x * (100 - p1)) / 100;
		const y2 = (y * (100 - p2)) / 100;
		if (!Number.isInteger(x2) || !Number.isInteger(y2)) continue;
		const T2 = x2 + y2;
		const prose = `${cap(A.un)} e ${B.un} costano insieme ${T} euro. Durante i saldi ${A.il} ${A.sc} del $${p1}\\%$ e ${B.il} del $${p2}\\%$, e insieme costano ${T2} euro. Quanto costava ciascun articolo prima dei saldi?`;
		const clear = clearDecimals([100 - p1, 100 - p2], 100 * T2, 'seconda');
		const rows: Row[] = [{ a: [1, 1], c: T }, clear.row];
		const solved = solve2(rows, ['x', 'y']);
		// the discounted prices, swapped, the discount taken as euros, prices with the same sum
		const mistakes: number[][] = [[x2, y2], [y, x]];
		for (let d = 10; d <= 60; d += 10) mistakes.push([x + d, y - d], [x - d, y + d]);
		return {
			story: 'sconti',
			data: { A: i, B: j, T, p1, p2, T2, case: 'accettabile' },
			prose,
			unknowns: `${t('Chiama ')} x ${t(` il prezzo ${A.del} e `)} y ${t(` quello ${B.del}, in euro, con `)} x > 0 ${t(' e ')} y > 0${t(`. Con lo sconto del ${p1}\\% si paga il ${100 - p1}\\% del prezzo`)}`,
			system: casesTex([`x + y = ${T}`, `${keep(p1)}x + ${keep(p2)}y = ${T2}`]),
			normalize: clear.steps,
			solving: [...solved.steps, `${t('Controllo sul testo: ')} ${keep(p1)} \\cdot ${x} + ${keep(p2)} \\cdot ${y} = ${x2} + ${y2} = ${T2}`],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'tuple', labels: [A.label, B.label], unit: 'euro' },
			solution: t(`${cap(A.label)} ${x} euro, ${B.label} ${y} euro`),
			mistakes: mistakes.filter((m) => m.every((v) => v > 0)).map(R),
		};
	}
}

const SUBSTANCES = ['alcol', 'sale', 'zucchero'];
const CONC = [10, 20, 25, 30, 40, 50, 60, 70, 80];

function miscela(rng: Rng, ok: boolean): Problem {
	for (;;) {
		const sub = rng.int(0, SUBSTANCES.length - 1);
		const c1 = rng.pick(CONC);
		const c2 = rng.pick(CONC);
		if (c2 <= c1) continue;
		const V = rng.pick([10, 20, 30, 40, 50, 60]);
		let c: number;
		if (ok) {
			const x = rng.int(1, V - 1);
			const tot = c1 * x + c2 * (V - x);
			if (tot % V !== 0) continue;
			c = tot / V;
		} else {
			c = rng.int(0, 1) === 1 ? rng.int(c2 + 1, Math.min(95, c2 + 20)) : rng.int(Math.max(1, c1 - 15), c1 - 1);
			if (c <= 0 || c >= 100) continue;
		}
		const xr = q(V * (c2 - c), c2 - c1);
		const yr = q(V).sub(xr);
		const inside = xr.sign() > 0 && yr.sign() > 0;
		if (inside !== ok) continue;
		const prose = `Un laboratorio ha una soluzione di ${SUBSTANCES[sub]} al $${c1}\\%$ e una al $${c2}\\%$. Quanti litri di ciascuna servono per ottenere ${V} litri di soluzione al $${c}\\%$?`;
		const clear = clearDecimals([c1, c2], c * V, 'seconda');
		const rows: Row[] = [{ a: [1, 1], c: V }, clear.row];
		const solved = solve2(rows, ['x', 'y']);
		const [x, y] = solved.sol;
		const pc = (v: number) => valTex(q(v, 100));
		const reason = ok
			? `${t('Controllo sul testo: ')} ${pc(c1)} \\cdot ${valTex(x)} + ${pc(c2)} \\cdot ${valTex(y)} = ${valTex(q(c * V, 100))}${t(` litri di ${SUBSTANCES[sub]} in ${V} litri, cioè il ${c}\\%`)}`
			: `${valTex(x.sign() < 0 ? x : y)} ${t(` è negativo: la soluzione non è accettabile, e il problema è impossibile. Mescolando le due soluzioni non si ottiene una concentrazione ${c > c2 ? 'più alta della più alta' : 'più bassa della più bassa'} delle due`)}`;
		const mistakes: Rational[][] = [];
		if (ok) {
			mistakes.push([y, x]);
			if (V % 2 === 0) mistakes.push(R([V / 2, V / 2]));
			for (let i = 1; i <= 6; i++) mistakes.push([x.add(q(i)), y.sub(q(i))], [x.sub(q(i)), y.add(q(i))]);
		} else {
			mistakes.push([x, y], [x.abs(), y.abs()], [y, x], R([V, 0]), R([0, V]));
			if (V % 2 === 0) mistakes.push(R([V / 2, V / 2]));
		}
		return {
			story: 'miscela',
			data: { sub, c1, c2, V, c, case: ok ? 'accettabile' : 'impossibile' },
			prose,
			unknowns: `${t('Chiama ')} x ${t(` i litri della soluzione al ${c1}\\% e `)} y ${t(` quelli della soluzione al ${c2}\\%, con `)} 0 \\leq x \\leq ${V} ${t(' e ')} 0 \\leq y \\leq ${V}`,
			system: casesTex([`x + y = ${V}`, `${pc(c1)}x + ${pc(c2)}y = ${pc(c * V)}`]),
			normalize: clear.steps,
			solving: [...solved.steps, reason],
			sol: solved.sol,
			ok,
			answer: { kind: 'tuple', labels: [`al ${c1}\\%`, `al ${c2}\\%`], unit: 'litri' },
			solution: ok ? t(`${valTex(x)} litri al ${c1}\\% e ${valTex(y)} litri al ${c2}\\%`) : t('Il problema è impossibile'),
			mistakes: ok ? mistakes.filter((m) => m.every((v) => v.sign() > 0)) : mistakes,
		};
	}
}

// Level 7: motion with the current, three unknowns --------------------------

const hours = (h: number) => (h === 1 ? "un'ora" : `${h} ore`);

function fiume(rng: Rng): Problem {
	for (;;) {
		const plane = rng.int(0, 1) === 1;
		const x = plane ? 10 * rng.int(30, 90) : rng.int(8, 30);
		const y = plane ? 10 * rng.int(2, 12) : rng.int(1, 6);
		if (x <= 2 * y) continue;
		const t1 = rng.int(1, 5);
		const t2 = rng.int(1, 5);
		if (t1 === 1 && t2 === 1) continue;
		const D1 = t1 * (x - y);
		const D2 = t2 * (x + y);
		const same = D1 === D2;
		const prose = plane
			? `Un aereo percorre ${D1} km in ${hours(t1)} con il vento contrario, e ${same ? 'gli stessi' : ''} ${D2} km in ${hours(t2)} con il vento a favore. Quali sono la velocità dell'aereo senza vento e la velocità del vento, supponendo che siano costanti?`.replace('  ', ' ')
			: same
				? `Una barca percorre ${D1} km risalendo un fiume, cioè contro la corrente, in ${hours(t1)}, e ridiscende gli stessi ${D1} km in ${hours(t2)}. Quali sono la velocità della barca in acqua ferma e la velocità della corrente, supponendo che siano costanti?`
				: `Una barca percorre ${D1} km risalendo un fiume, cioè contro la corrente, in ${hours(t1)}, e ${D2} km scendendo con la corrente in ${hours(t2)}. Quali sono la velocità della barca in acqua ferma e la velocità della corrente, supponendo che siano costanti?`;
		const lhs = (tt: number, s: string) => (tt === 1 ? `x ${s} y` : `${tt}(x ${s} y)`);
		const rows: Row[] = [{ a: [1, -1], c: x - y }, { a: [1, 1], c: x + y }];
		const divide =
			t1 === 1 && t2 === 1 ? [] : [t1 === 1 ? t(`Dividi la seconda equazione per ${t2}:`) : t2 === 1 ? t(`Dividi la prima equazione per ${t1}:`) : t(`Dividi la prima equazione per ${t1} e la seconda per ${t2}:`), casesTex(rows.map((r) => rowTex(r, ['x', 'y'])))];
		const solved = solve2(rows, ['x', 'y']);
		const who = plane ? ["l'aereo", 'il vento'] : ['la barca', 'la corrente'];
		// swapped; the speeds with and against the current as the answer; the average speed
		const mistakes: number[][] = [[y, x], [x + y, x - y], [x + y, y], [x - y, y]];
		const avg = q(D1 + D2, t1 + t2);
		if (avg.isInteger()) mistakes.push([avg.num, x + y - avg.num], [avg.num, y]);
		for (let i = 1; i <= 4; i++) mistakes.push([x + i, y + i], [x - i, y - i], [x + i, y - i]);
		return {
			story: 'fiume',
			data: { vehicle: plane ? 'aereo' : 'barca', t1, t2, D1, D2 },
			prose,
			unknowns: `${t('Chiama ')} x ${t(` la velocità ${plane ? "dell'aereo senza vento" : 'della barca in acqua ferma'} e `)} y ${t(` quella ${plane ? 'del vento' : 'della corrente'}, in km/h, con `)} x > y > 0${t(`: ${plane ? 'contro il vento' : 'contro la corrente'} si va a `)} x - y ${t(' km/h, a favore a ')} x + y${t('. Lo spazio è la velocità per il tempo')}`,
			system: casesTex([`${lhs(t1, '-')} = ${D1}`, `${lhs(t2, '+')} = ${D2}`]),
			normalize: divide,
			solving: [...solved.steps, `${t('Controllo sul testo: ')} ${t1 === 1 ? `${x} - ${y}` : `${t1} \\cdot (${x} - ${y})`} = ${D1} ${t(' e ')} ${t2 === 1 ? `${x} + ${y}` : `${t2} \\cdot (${x} + ${y})`} = ${D2}`],
			sol: solved.sol,
			ok: true,
			answer: { kind: 'tuple', labels: plane ? ['aereo', 'vento'] : ['barca', 'corrente'], unit: 'km/h' },
			solution: t(`${cap(who[0])} va a ${x} km/h, ${who[1]} a ${y} km/h`),
			mistakes: mistakes.filter((m) => m.every((v) => Number.isInteger(v) && v > 0)).map(R),
		};
	}
}

const COINS = [
	[10, 20, 50],
	[5, 10, 20],
	[20, 50, 100],
	[50, 100, 200],
];
const coinName = (c: number) => (c >= 100 ? `da ${c / 100} euro` : `da ${c} centesimi`);
/** A value in cents as euros in prose: 6,50 euro. */
const euros = (cents: number) => (cents % 100 === 0 ? `${cents / 100}` : `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')}`);

function monete3(rng: Rng): Problem {
	for (;;) {
		const ci = rng.int(0, COINS.length - 1);
		const [a, b, c] = COINS[ci];
		const x = rng.int(2, 20);
		const y = rng.int(2, 20);
		const z = rng.int(2, 20);
		const N = x + y + z;
		const V = a * x + b * y + c * z;
		if (N > 50 || x === y || y === z || x === z) continue;
		// a simple relation between two of the counts: x = k·z, y = z + d or x = y + d
		const rel = rng.pick(['x=kz', 'y=z+d', 'x=y+d'] as const);
		let relText: string, relEq: string, known: 'x' | 'y', expr: [number, number, number, number];
		const name = (i: number) => coinName([a, b, c][i]);
		if (rel === 'x=kz') {
			if (x % z !== 0 || !TIMES[x / z]) continue;
			const k = x / z;
			relText = `Le monete ${name(0)} sono il ${TIMES[k]} di quelle ${name(2)}.`;
			relEq = `x = ${k}z`;
			known = 'x';
			expr = [0, 0, k, 0];
		} else if (rel === 'y=z+d') {
			if (y <= z) continue;
			relText = `Le monete ${name(1)} sono ${y - z} più di quelle ${name(2)}.`;
			relEq = `y = z + ${y - z}`;
			known = 'y';
			expr = [0, 0, 1, y - z];
		} else {
			if (x <= y) continue;
			relText = `Le monete ${name(0)} sono ${x - y} più di quelle ${name(1)}.`;
			relEq = `x = y + ${x - y}`;
			known = 'x';
			expr = [0, 1, 0, x - y];
		}
		const coinsText = c < 100 ? `da ${a}, da ${b} e da ${c} centesimi` : `${coinName(a)}, ${coinName(b)} e ${coinName(c)}`;
		const prose = `In un salvadanaio ci sono ${N} monete, ${coinsText}, per un totale di ${euros(V)} euro. ${relText} Quante monete ci sono di ciascun tipo?`;
		const g = gcd(gcd(a, b), gcd(c, V));
		const [a1, b1, c1, V1] = [a / g, b / g, c / g, V / g];
		// substitute the relation in the first two equations: the other two unknowns remain
		const others = known === 'x' ? ['y', 'z'] : ['x', 'z'];
		const coef = (row: number[], cst: number): Row => {
			// row = coefficients of x, y, z; expr gives known = e0·x + e1·y + e2·z + e3
			const ki = known === 'x' ? 0 : 1;
			const full = [0, 1, 2].map((i) => (i === ki ? 0 : row[i]) + row[ki] * expr[i]);
			return { a: others.map((v) => full[['x', 'y', 'z'].indexOf(v)]), c: cst - row[ki] * expr[3] };
		};
		const rows = [coef([1, 1, 1], N), coef([a1, b1, c1], V1)];
		if (rows[0].a[0] * rows[1].a[1] - rows[0].a[1] * rows[1].a[0] === 0) continue;
		const solved = solve2(rows, others);
		const vals: Record<string, number> = { x, y, z };
		const knownValue = vals[known];
		const back = `${known} = ${relEq.split(' = ')[1].replace(/(\d+)?([yz])/, (_m, k: string | undefined, v: string) => (k ? `${k} \\cdot ${vals[v]}` : `${vals[v]}`))} = ${knownValue}`;
		const mistakes: number[][] = [[y, x, z], [z, y, x], [x, z, y], [x + 1, y - 1, z], [x - 1, y + 1, z], [x, y + 1, z - 1], [x, y - 1, z + 1], [x + 1, y, z - 1]];
		return {
			story: 'monete3',
			data: { coins: ci, N, V, rel, ...(rel === 'x=kz' ? { k: x / z } : { d: rel === 'y=z+d' ? y - z : x - y }) },
			prose,
			unknowns: `${t('Chiama ')} x${t(', ')} y ${t(' e ')} z ${t(` il numero delle monete ${coinName(a)}, ${coinName(b)} e ${coinName(c)}: sono numeri naturali. Conta il valore in centesimi`)}`,
			system: casesTex([`x + y + z = ${N}`, `${a}x + ${b}y + ${c}z = ${V}`, relEq]),
			normalize: [
				...(g > 1 ? [`${t(`Dividi la seconda equazione per ${g}: `)} ${linTex([a1, b1, c1], ['x', 'y', 'z'])} = ${V1}`] : []),
				`${t('Sostituisci ')} ${relEq} ${t(' nelle prime due e somma i termini simili:')}`,
				casesTex(rows.map((r) => rowTex(r, others))),
			],
			solving: [
				...solved.steps,
				`${t('Allora ')} ${back}`,
				`${t('Controllo sul testo: ')} ${x} + ${y} + ${z} = ${N} ${t(' e ')} ${a} \\cdot ${x} + ${b} \\cdot ${y} + ${c} \\cdot ${z} = ${V}`,
			],
			sol: R([x, y, z]),
			ok: true,
			answer: { kind: 'tuple', labels: [coinName(a), coinName(b), coinName(c)], unit: '' },
			solution: t(`${x} monete ${coinName(a)}, ${y} ${coinName(b)} e ${z} ${coinName(c)}`),
			mistakes: mistakes.filter((m) => m.every((v) => v > 0)).map(R),
		};
	}
}

// ---------------------------------------------------------------------------
// Sample, options and check

function build(rng: Rng, level: number, story: string): Problem {
	switch (level) {
		case 1:
			return numeri(rng, story);
		case 2:
			return prezzi(rng, story, rng.int(1, 3) !== 1);
		case 3:
			return eta(rng, story);
		case 4:
			return story === 'rettangolo' ? rettangolo(rng) : isoscele(rng);
		case 5:
			return cifre(rng, story);
		case 6:
			return story === 'sconti' ? sconti(rng) : miscela(rng, rng.int(0, 1) === 1);
		default:
			return story === 'fiume' ? fiume(rng) : monete3(rng);
	}
}

const unitTex = (unit: string) => (unit === '°' ? '^\\circ' : unit ? `\\text{ ${unit}}` : '');

/** One option: "31 e 19" on level 1, otherwise a line per unknown, "interi: 180". */
export function tupleOption(level: number, labels: string[], unit: string, vals: Rational[]): ChoiceOption {
	if (level === 1) {
		const [a, b] = [...vals].sort((u, v) => v.compare(u));
		return { latex: `${valTex(a)} \\text{ e } ${valTex(b)}`, values: [a.toString(), b.toString()] };
	}
	const rows = labels.map((l, i) => `\\text{${l}: } ${valTex(vals[i])}${unitTex(unit)}`);
	return { latex: `\\begin{gathered} ${rows.join(' \\\\ ')} \\end{gathered}`, values: vals.map((v) => v.toString()) };
}

const impossibleOpt: ChoiceOption = { latex: '\\text{Il problema è impossibile}', values: [IMPOSSIBLE] };
const numOpt = (r: Rational): ChoiceOption => ({ latex: valTex(r), values: [r.toString()] });

/** The four options, or null when the problem has too few distinct distractors: the caller draws another problem. */
function buildChoice(rng: Rng, p: Problem, level: number): ChoiceAnswer | null {
	const extra = WITH_IMPOSSIBLE.has(level) ? [impossibleOpt] : [];
	let ch: ChoiceAnswer | null;
	if (p.answer.kind === 'number') {
		const ans = p.answer.value;
		const near: Rational[][] = [];
		for (let d = 1; d < 30; d++) near.push([ans.add(q(d))], [ans.sub(q(d))]);
		const ds = [...p.mistakes, ...near].map((m) => m[0]).filter((m) => m.isInteger() && m.num > 0 && !m.equals(ans));
		ch = assembleChoice(rng, numOpt(ans), ds.map(numOpt), 4);
	} else {
		const { labels, unit } = p.answer;
		const key = (vs: Rational[]) => (level === 1 ? [...vs].map((v) => v.toString()).sort().join('|') : vs.map((v) => v.toString()).join('|'));
		// an impossible problem has no values as the answer: its rejected solution is a distractor
		const truth = p.ok ? key(p.sol) : IMPOSSIBLE;
		// positive integers, except the rejected solution of an impossible problem (the first mistake)
		const whole = (m: Rational[]) => m.every((v) => v.isInteger() && (p.ok ? v.num > 0 : v.num >= 0));
		const ds = p.mistakes
			.filter((m, i) => m.length === p.sol.length && key(m) !== truth && ((!p.ok && i === 0) || whole(m)))
			.map((m) => tupleOption(level, labels, unit, m));
		const correct = p.ok ? tupleOption(level, labels, unit, p.sol) : impossibleOpt;
		// an impossible problem shows the rejected solution first; otherwise "impossibile" is one of the distractors
		const pool = p.ok ? [...extra, ...ds] : ds;
		ch = assembleChoice(rng, correct, level === 1 ? dedupeSets(ds) : pool, 4);
	}
	return ch;
}

/** Level 1: two options with the same two numbers are the same answer. */
function dedupeSets(opts: ChoiceOption[]): ChoiceOption[] {
	const seen = new Set<string>();
	return opts.filter((o) => {
		const k = [...o.values].sort().join('|');
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}

const PROMPT = 'Risolvi il problema con un sistema.';
const PROMPT_ACC = 'Risolvi il problema con un sistema e controlla che la soluzione sia accettabile.';

function steps(p: Problem): string[] {
	return [p.unknowns, `${t('Traduci il testo in un sistema:')}`, p.system, ...p.normalize, ...p.solving];
}

function generateLevel(rng: Rng, level: number): Sample {
	for (let attempt = 0; attempt < 1000; attempt++) {
		const story = rng.pick(STORIES[level]);
		const p = build(rng, level, story);
		const choice = buildChoice(rng, p, level);
		if (!choice) continue;
		const tuple = p.answer.kind === 'tuple';
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: WITH_IMPOSSIBLE.has(level) ? PROMPT_ACC : PROMPT,
			problem: textBlock(p.prose),
			solution: p.solution,
			steps: steps(p),
			answer: tuple ? choice : { kind: 'number', value: (p.answer as { value: Rational }).value.toString() },
			params: {
				story: p.story,
				...Object.fromEntries(Object.entries(p.data).map(([k, v]) => [k, String(v)])),
				system: p.system,
				sol: p.sol.map((s) => s.toString()),
				...(tuple ? { labels: (p.answer as { labels: string[] }).labels, unit: (p.answer as { unit: string }).unit } : {}),
			},
		};
		if (!tuple) sample.choice = choice;
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	const lvl = sample.level;
	if (!STORIES[lvl]?.includes(String(p.story))) return [`storia ${String(p.story)} fuori dal livello ${lvl}`];
	if (!sample.steps.includes(String(p.system))) v.push('il sistema non è nei passaggi');
	if (/—|piuttosto che/.test(sample.problem)) v.push('parole vietate nel testo');
	if (/(?<![\d},])1[xyz(]|\+\s*-|-\s*-/.test(String(p.system))) v.push(`sistema scritto male: ${String(p.system)}`);
	const ch = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	if (!ch || ch.options.length !== 4) return [...v, 'servono quattro opzioni'];
	const keys = ch.options.map((o) => (lvl === 1 ? [...o.values].sort() : o.values).join('|'));
	if (new Set(keys).size !== 4 || new Set(ch.options.map((o) => o.latex)).size !== 4) v.push('opzioni ripetute');
	const sol = (p.sol as string[]).map((s) => Rational.parse(s));
	const ok = p.case !== 'impossibile';
	if (sample.answer.kind === 'number') {
		if (keys[ch.correct] !== sample.answer.value) v.push('opzione giusta sbagliata');
	} else {
		const truth = ok ? (lvl === 1 ? sol.map((s) => s.toString()).sort() : sol.map((s) => s.toString())).join('|') : IMPOSSIBLE;
		if (keys[ch.correct] !== truth) v.push('opzione giusta sbagliata');
	}
	if (WITH_IMPOSSIBLE.has(lvl) && !keys.includes(IMPOSSIBLE)) v.push('manca l\'opzione "impossibile"');
	if (ok && !sol.every((s) => s.sign() > 0)) v.push('soluzione non positiva in un problema accettabile');
	return v;
}

export const sistemiProblemi: Generator = {
	id: ID,
	title: 'Problemi con i sistemi',
	levels: {
		1: { label: 'Due numeri', constraints: ['somma e differenza, somma e rapporto, differenza e rapporto, "supera di d il doppio"', 'soluzione: due naturali, il maggiore fino a 160'] },
		2: { label: 'Prezzi e biglietti', constraints: ['numero dei pezzi e incasso o spesa', 'circa un terzo impossibili: soluzione non intera o negativa', 'un\'opzione è sempre "Il problema è impossibile"'] },
		3: { label: 'Età', constraints: ['differenza o somma delle età, "tra n anni" o "n anni fa"', 'differenza tra 20 e 45 anni, genitore fino a 70'] },
		4: { label: 'Problemi di geometria', constraints: ['rettangolo con i lati che cambiano, domanda sull\'area', 'angoli di un triangolo isoscele'] },
		5: { label: 'Le cifre di un numero', constraints: ['numero 10x + y, cifre scambiate 10y + x', 'somma delle cifre, rapporto tra le cifre, multiplo della somma'] },
		6: { label: 'Sconti e miscele', constraints: ['due sconti diversi su due articoli; miscela di due soluzioni', 'metà delle miscele impossibili: concentrazione fuori dalle due'] },
		7: { label: 'Moto e tre incognite', constraints: ['barca con la corrente, aereo con il vento', 'monete di tre tipi con una relazione semplice tra due'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!STORIES[level]) throw new Error(`${ID}: unknown level ${level}`);
		return generateLevel(rng, level);
	},
	check,
	toChoice(sample: Sample): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (sample.choice) return sample.choice;
		throw new Error(`${ID}: sample without choice`);
	},
};

export default sistemiProblemi;
