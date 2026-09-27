import { Rational, ONE, ZERO, q } from '@/lib/exercises/v2/rational';
import { paren, polyDegree, polyMul, type Poly } from '@/lib/exercises/v2/latex';
import { evaluate, nodeLatex, unwrap, type Node } from './equazione';
import { quadraticRoots } from './equazioni-secondo-grado';
import { isRel, type NumberLine, type Rel } from './disequazioni';
import { conditionLine, conditionsWords, excludedOf, factoredLatex, factorLow } from './equazioni-fratte';
import { coef, parsePolynomial, polyEq, sameLatex, trim } from './polinomi';
import { approxTex, num, sortNums, writeSet, type LineSet, type Num } from './intervalli';
import { fail, type Outcome, type ResultRow, type Step } from './types';

/**
 * Fractional inequalities N(x)/D(x) > 0 (or ≥, <, ≤), with N and D of degree at most 2, solved as in the lessons
 * (disequazioni-lineari/disequazioni-razionali, parabola-disequazioni/disequazioni-secondo-grado-fratte): the
 * conditions of existence, the sign of each factor (a first-degree factor with its zero, a second-degree one with its
 * discriminant and the sign of a, on one row as in the lesson), the table of signs with one row per factor and the
 * fraction below, and the intervals with the sign asked for. The zeros of N are solutions of ≥ and ≤, those of D never.
 *
 * A numerator or denominator typed as a product, (x − 1)(x + 3), gets one row per factor; a negative number in front
 * gets a row of its own.
 */

export interface FracIneqInput {
	n: string;
	d: string;
	rel: string;
}

const EX_N = 'x - 1';
const EX_D = 'x + 2';
const TOO_BIG = 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';

const REL_TEX: Record<Rel, string> = { '>': '>', '>=': '\\geq', '<': '<', '<=': '\\leq' };

/** One row of the table: a factor of the numerator or of the denominator. */
interface Row {
	latex: string;
	p: Poly;
	den: boolean;
	/** Its zeros, with multiplicity (a square has its zero twice). */
	zeros: Num[];
}

/** The factors of a side as typed: a product gives one per factor, the numbers in front go together. */
function factorsOf(node: Node, p: Poly, den: boolean): { c: Rational; rows: Row[] } {
	const row = (latex: string, f: Poly): Row => {
		const roots = polyDegree(f) === 1 ? [num(f[0].neg().div(f[1]))] : quadraticRoots(f);
		// A double zero counts twice: the sign does not change there.
		const zeros = polyDegree(f) === 2 && roots.length === 1 ? [roots[0], roots[0]] : roots;
		return { latex, p: trim(f), den, zeros };
	};
	let n = unwrap(node);
	let c = ONE;
	// A sign in front: −(x − 1)(x + 3) is read as a sum of one negative term.
	for (;;) {
		if (n.k === 'neg') {
			c = c.neg();
			n = unwrap(n.n);
		} else if (n.k === 'sum' && n.terms.length === 1) {
			if (n.terms[0].neg) c = c.neg();
			n = unwrap(n.terms[0].n);
		} else break;
	}
	const rows: Row[] = [];
	if (n.k === 'mul') {
		for (const f of n.f) {
			const v = trim(evaluate(f));
			if (polyDegree(v) <= 0) c = c.mul(v[0]);
			else rows.push(row(nodeLatex(unwrap(f)), v));
		}
	} else {
		const v = trim(evaluate(n));
		if (polyDegree(v) <= 0) c = c.mul(v[0]);
		else rows.push(row(nodeLatex(n), v));
	}
	// The product must give back the side: otherwise one row with the whole side.
	const back = rows.reduce<Poly>((acc, r) => polyMul(acc, r.p), [c]);
	if (!polyEq(back, p)) return { c: ONE, rows: polyDegree(p) >= 1 ? [row(nodeLatex(unwrap(node)), p)] : [] };
	return { c, rows };
}

/** The sign of a row on the stretch before point j (j = n: after the last point). */
function stretchSign(r: Row, points: Num[], j: number): 1 | -1 {
	const after = r.zeros.filter((z) => points.findIndex((p) => p.equals(z)) >= j).length;
	const s = coef(r.p, polyDegree(r.p)).sign() as 1 | -1;
	return (after % 2 === 0 ? s : -s) as 1 | -1;
}

const signCell = (s: number) => (s > 0 ? '$+$' : s < 0 ? '$-$' : '$0$');

export interface FracIneqResult {
	outcome: Outcome;
	line: NumberLine | null;
	/** The solutions, for the tests. */
	set?: LineSet;
}

export function disequazioneFratta(input: FracIneqInput): Outcome {
	return risolviDisequazioneFratta(input).outcome;
}

/** The inequality as typed, for the preview, or null. */
export function previewDisequazioneFratta(input: FracIneqInput): string | null {
	const n = parsePolynomial(input.n, EX_N);
	const d = parsePolynomial(input.d, EX_D);
	if (!n.ok || !d.ok || !isRel(input.rel)) return null;
	return `\\dfrac{${nodeLatex(unwrap(n.node))}}{${nodeLatex(unwrap(d.node))}} ${REL_TEX[input.rel]} 0`;
}

type Part = 'ce' | 'segno' | 'tabella';
const PART_NAMES: Record<Part, string> = { ce: 'Le condizioni di esistenza', segno: 'Il segno dei fattori', tabella: 'La tabella dei segni' };
type PartStep = Step & { part: Part };

export function risolviDisequazioneFratta(input: FracIneqInput): FracIneqResult {
	const n = parsePolynomial(input.n, EX_N);
	if (!input.n.trim()) return { outcome: fail(`Scrivi il numeratore, per esempio ${EX_N}.`), line: null };
	if (!n.ok) return { outcome: fail(`Numeratore: ${n.error.charAt(0).toLowerCase()}${n.error.slice(1)}`), line: null };
	if (!input.d.trim()) return { outcome: fail(`Scrivi il denominatore, per esempio ${EX_D}.`), line: null };
	const d = parsePolynomial(input.d, EX_D);
	if (!d.ok) return { outcome: fail(`Denominatore: ${d.error.charAt(0).toLowerCase()}${d.error.slice(1)}`), line: null };
	if (!isRel(input.rel)) return { outcome: fail('Scegli il verso della disequazione: >, ≥, < oppure ≤.'), line: null };
	if (polyDegree(n.p) > 2 || polyDegree(d.p) > 2) return { outcome: fail('Qui numeratore e denominatore hanno al massimo grado 2: per esempio x^2 - 4 al numeratore e x + 1 al denominatore.'), line: null };
	if (polyDegree(n.p) < 0) return { outcome: fail('Il numeratore vale zero, e la frazione vale sempre zero: scrivi un numeratore diverso da zero.'), line: null };
	if (polyDegree(d.p) < 0) return { outcome: fail('Il denominatore vale zero: una frazione con denominatore zero non ha significato.'), line: null };
	if (polyDegree(d.p) === 0) return { outcome: fail('Nel denominatore non c’è la x: non è una disequazione fratta. Risolvila con il calcolatore delle disequazioni di primo o di secondo grado.'), line: null };
	try {
		return solve(n.node, n.p, d.node, d.p, input.rel);
	} catch {
		return { outcome: fail(TOO_BIG), line: null };
	}
}

function solve(nNode: Node, N: Poly, dNode: Node, D: Poly, rel: Rel): FracIneqResult {
	const steps: PartStep[] = [];
	const dL = nodeLatex(unwrap(dNode));

	// Conditions of existence.
	const Df = factorLow(D);
	const excluded = excludedOf(Df.factors);
	steps.push({
		say: 'Poni il denominatore diverso da zero.',
		math: [...(sameLatex(dL, factoredLatex(Df)) ? [] : [`${dL} = ${factoredLatex(Df)}`]), ...Df.factors.map((f) => conditionLine(f))],
		then: excluded.length ? `Sono le condizioni di esistenza (C.E.): ${conditionsWords(excluded)}.` : 'Il denominatore non è mai zero: non ci sono valori da escludere.',
		part: 'ce'
	});

	// The rows.
	const fn = factorsOf(nNode, N, false);
	const fd = factorsOf(dNode, D, true);
	const c = fn.c.div(fd.c);
	const rows: Row[] = [...fn.rows, ...fd.rows];
	const points = sortNums(rows.flatMap((r) => r.zeros));
	const nRows = fn.rows.length;
	for (const r of rows) {
		const where = r.den ? (fd.rows.length > 1 ? 'del fattore $' + r.latex + '$ al denominatore' : 'del denominatore') : nRows > 1 ? 'del fattore $' + r.latex + '$ al numeratore' : 'del numeratore';
		steps.push({ ...signStep(r, where), part: 'segno' });
	}
	const constRow = c.sign() < 0;
	if (constRow) steps.push({ say: `Guarda il segno del numero $${c.toLatex()}$.`, math: [`${c.toLatex()} < 0`], then: 'È negativo per ogni $x$: nella tabella ha una riga tutta con il meno.', part: 'segno' });
	else if (!fn.rows.length) steps.push({ say: 'Guarda il segno del numeratore.', math: [`${c.toLatex()} > 0`], then: 'È positivo per ogni $x$: non cambia il segno della frazione.', part: 'segno' });

	// The table: the stretches and the points, then one row per factor and the fraction.
	const k = points.length;
	const tex = points.map((p) => p.toLatex());
	const head = ['$x$'];
	for (let j = 0; j <= k; j++) {
		if (k === 0) head.push('ogni $x$');
		else if (j === 0) head.push(`$x < ${tex[0]}$`);
		else if (j === k) head.push(`$x > ${tex[k - 1]}$`);
		else head.push(`$${tex[j - 1]} < x < ${tex[j]}$`);
		if (j < k) head.push(`$${tex[j]}$`);
	}
	const table: string[][] = [];
	const stretchSigns: number[] = [];
	const pointValue: ('0' | 'x' | number)[] = [];
	for (let j = 0; j <= k; j++) stretchSigns.push(rows.reduce<number>((s, r) => s * stretchSign(r, points, j), c.sign()));
	for (let i = 0; i < k; i++) {
		const zeroOf = rows.filter((r) => r.zeros.some((z) => z.equals(points[i])));
		pointValue.push(zeroOf.some((r) => r.den) ? 'x' : zeroOf.length ? '0' : stretchSigns[i]);
	}
	for (const r of rows) {
		const cells = [`$${r.latex}$`];
		for (let j = 0; j <= k; j++) {
			cells.push(signCell(stretchSign(r, points, j)));
			if (j < k) cells.push(r.zeros.some((z) => z.equals(points[j])) ? '$0$' : signCell(stretchSign(r, points, j)));
		}
		table.push(cells);
	}
	if (constRow) table.push([`$${c.toLatex()}$`, ...head.slice(1).map(() => '$-$')]);
	const frac = ['Frazione'];
	for (let j = 0; j <= k; j++) {
		frac.push(signCell(stretchSigns[j]));
		if (j < k) frac.push(pointValue[j] === 'x' ? '$\\nexists$' : pointValue[j] === '0' ? '$0$' : signCell(pointValue[j] as number));
	}
	table.push(frac);
	steps.push({
		say: 'Riporta i segni nella tabella.',
		table: { head, rows: table },
		then: pointValue.includes('x') ? 'Il segno della frazione viene dalla regola dei segni. Dove il denominatore vale zero la frazione non esiste: $\\nexists$.' : 'Il segno della frazione viene dalla regola dei segni.',
		part: 'tabella'
	});

	// The solutions.
	const positive = rel === '>' || rel === '>=';
	const incl = rel === '>=' || rel === '<=';
	const set: LineSet = {
		points,
		pointIn: pointValue.map((v) => v === '0' && incl),
		stretchIn: stretchSigns.map((s) => (positive ? s > 0 : s < 0))
	};
	const w = writeSet(set);
	const pick = { '>': 'Scegli dove la frazione è positiva.', '>=': 'Scegli dove la frazione è positiva o zero.', '<': 'Scegli dove la frazione è negativa.', '<=': 'Scegli dove la frazione è negativa o zero.' }[rel];
	steps.push({
		say: pick,
		math: w.empty ? ['S = \\emptyset'] : [w.math, `S = ${w.set}`].filter((l, i, a) => a.indexOf(l) === i),
		then: w.empty
			? 'Nessun intervallo ha il segno giusto: la disequazione è impossibile.'
			: !k
				? undefined
				: incl
					? 'Gli zeri del numeratore sono soluzioni; quelli del denominatore mai.'
					: 'Gli zeri sono esclusi: lì la frazione vale zero o non esiste.',
		part: 'tabella'
	});

	const on = steps.length > 5;
	const plain = steps.map(({ part, ...step }, i) => (on && (i === 0 || steps[i - 1].part !== part) ? { group: PART_NAMES[part], ...step } : step));
	const out: ResultRow[] = [
		{ label: 'Condizioni di esistenza', value: conditionsWords(excluded).replace('i denominatori non si annullano', 'il denominatore non si annulla') },
		{ label: 'Soluzioni', value: w.empty ? 'Nessuna: la disequazione è impossibile' : w.words },
		{ label: 'Insieme delle soluzioni', value: `$S = ${w.set}$` }
	];
	const irr = points.filter((p) => !p.isRational());
	if (irr.length) out.push({ label: 'Valori approssimati', value: irr.map((p) => `$${p.toLatex()} \\approx ${approxTex(p)}$`).join(' ') });
	return { outcome: { ok: true, rows: out, copy: w.copy.replace(/−/g, '-'), steps: plain }, line: w.line, set };
}

/** The step that studies the sign of one factor. */
function signStep(r: Row, where: string): Step {
	const f = r.p;
	if (polyDegree(f) === 1) {
		const a = f[1];
		const x0 = f[0].neg().div(a);
		const up = a.sign() > 0;
		return {
			say: `Studia il segno ${where}.`,
			math: [r.latex === 'x' ? 'x > 0' : `${r.latex} > 0 \\;\\Rightarrow\\; x ${up ? '>' : '<'} ${x0.toLatex()}`],
			then: `Vale zero per $x = ${x0.toLatex()}$ ed è positivo per $x ${up ? '>' : '<'} ${x0.toLatex()}$.`
		};
	}
	const [c0 = ZERO, b = ZERO, a] = f;
	const delta = b.mul(b).sub(q(4).mul(a).mul(c0));
	const roots = quadraticRoots(f);
	const lines = [`\\Delta = ${paren(b)}^2 - 4 \\cdot ${paren(a)} \\cdot ${paren(c0)} = ${delta.toLatex()}`];
	if (roots.length === 2) lines.push(`x_1 = ${roots[0].toLatex()} \\qquad x_2 = ${roots[1].toLatex()}`);
	if (roots.length === 1) lines.push(`x_1 = x_2 = ${roots[0].toLatex()}`);
	const pos = a.sign() > 0;
	const then =
		roots.length === 2
			? pos
				? 'Con $a > 0$ è positivo fuori dalle radici e negativo tra le radici.'
				: 'Con $a < 0$ è negativo fuori dalle radici e positivo tra le radici.'
			: roots.length === 1
				? pos
					? `Con $a > 0$ è positivo per ogni $x$ tranne $${roots[0].toLatex()}$, dove vale zero.`
					: `Con $a < 0$ è negativo per ogni $x$ tranne $${roots[0].toLatex()}$, dove vale zero.`
				: pos
					? 'Con $\\Delta < 0$ e $a > 0$ è positivo per ogni $x$.'
					: 'Con $\\Delta < 0$ e $a < 0$ è negativo per ogni $x$.';
	return { say: `Studia il segno ${where}.`, math: lines, then };
}

