import { Rational, ZERO, q } from '@/lib/exercises/v2/rational';
import { polyDegree, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { nodeLatex, polyAt, unwrap, type Node } from './equazione';
import { coef, parsePolynomial } from './polinomi';
import { num, sortNums, writeSet, type LineSet, type Num } from './intervalli';
import { fail, type Outcome, type Step } from './types';

/**
 * Equations with an absolute value, |ax + b| = c and |ax + b| = cx + d, as in the textbooks (grado-superiore/
 * valore-assoluto-equazioni). With a number on the other side: impossible when it is negative, otherwise the argument
 * is that number or its opposite. With x on the other side: the two cases of the sign of the argument, each solved
 * and compared with its condition; a case that holds for every x gives a half-line. The accepted solutions are
 * checked in the equation as typed.
 */

export const EXAMPLE = '|2x - 3| = x + 1';
const TOO_BIG = 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';

interface Parsed {
	A: Poly;
	B: Poly;
	aNode: Node;
	bNode: Node;
	/** The equation as typed. */
	latex: string;
	/** The absolute value is on the left. */
	absLeft: boolean;
}

type ParseResult = { ok: true; p: Parsed } | { ok: false; error: string };

function reword(error: string): string {
	return error
		.replace('Il polinomio è incompleto: manca qualcosa alla fine.', "L'equazione è incompleta: manca qualcosa.")
		.replace('Scrivi il polinomio con la lettera x', 'Usa la x come incognita')
		.replace('in un polinomio', "in un'equazione")
		.replace('Nel polinomio', "Nell'equazione")
		.replace(/La x non può stare in un denominatore[^.]*\./, 'La x non può stare in un denominatore.');
}

export function parseValoreAssoluto(input: string): ParseResult {
	const text = input.replace(/[−–]/g, '-').replace(/\babs\s*\(([^()]*)\)/gi, '|$1|').trim();
	if (!text) return { ok: false, error: `Scrivi un'equazione con il valore assoluto, per esempio ${EXAMPLE}.` };
	if (text.length > 120) return { ok: false, error: "L'equazione è troppo lunga: al massimo 120 caratteri." };
	const eqs = text.split('=').length - 1;
	if (eqs !== 1) return { ok: false, error: eqs ? `C'è più di un segno =: scrivi un solo =, per esempio ${EXAMPLE}.` : `Manca il segno =: scrivi un'equazione, per esempio ${EXAMPLE}.` };
	const bars = text.split('|').length - 1;
	if (bars === 0) return { ok: false, error: `Manca il valore assoluto: scrivi l'argomento tra due barre verticali, per esempio ${EXAMPLE}.` };
	if (bars !== 2) return { ok: false, error: `Qui c'è un solo valore assoluto, tra due barre verticali: per esempio ${EXAMPLE}.` };
	const [l, r] = text.split('=');
	const m = /^\s*\|([^|]*)\|\s*$/;
	const absLeft = m.test(l);
	if (!absLeft && !m.test(r)) return { ok: false, error: `Scrivi il valore assoluto da solo in un membro, senza numeri davanti o dopo: per esempio ${EXAMPLE}.` };
	const inner = (absLeft ? l : r).replace(m, '$1');
	const other = absLeft ? r : l;
	if (!inner.trim()) return { ok: false, error: `Scrivi qualcosa tra le due barre, per esempio ${EXAMPLE}.` };
	if (!other.trim()) return { ok: false, error: `Scrivi qualcosa prima e dopo il segno =, per esempio ${EXAMPLE}.` };
	const pa = parsePolynomial(inner, EXAMPLE);
	if (!pa.ok) return { ok: false, error: reword(pa.error) };
	const pb = parsePolynomial(other, EXAMPLE);
	if (!pb.ok) return { ok: false, error: reword(pb.error) };
	const abs = `\\left| ${nodeLatex(pa.node)} \\right|`;
	const latex = absLeft ? `${abs} = ${nodeLatex(pb.node)}` : `${nodeLatex(pb.node)} = ${abs}`;
	if (polyDegree(pa.p) !== 1) return { ok: false, error: polyDegree(pa.p) < 1 ? `Dentro il valore assoluto non c'è la x: scrivi un argomento di primo grado, per esempio ${EXAMPLE}.` : `Qui l'argomento del valore assoluto è di primo grado, come 2x - 3: per esempio ${EXAMPLE}.` };
	if (polyDegree(pb.p) > 1) return { ok: false, error: `Fuori dal valore assoluto qui ci sono solo un numero o un'espressione di primo grado: per esempio ${EXAMPLE}.` };
	return { ok: true, p: { A: pa.p, B: pb.p, aNode: pa.node, bNode: pb.node, latex, absLeft } };
}

export function previewValoreAssoluto(input: string): string | null {
	const r = parseValoreAssoluto(input);
	return r.ok ? r.p.latex : null;
}

// ---------------------------------------------------------------------------
// Solving

type Part = 'casi' | 'c1' | 'c2' | 'controllo';
type PartStep = Step & { part: Part };

/** "5x", "-x", "0x". */
function coefX(a: Rational): string {
	if (a.isZero()) return '0x';
	if (a.isOne()) return 'x';
	if (a.equals(q(-1))) return '-x';
	return `${a.toLatex()}x`;
}

type Lin = { kind: 'one'; x: Rational; lines: string[] } | { kind: 'all' | 'none'; lines: string[] };

/** l(x) = r(x), both of degree ≤ 1: x on the left, numbers on the right, divide. The solution highlighted. */
function solveLinear(l: Poly, r: Poly): Lin {
	const A = coef(l, 1).sub(coef(r, 1));
	const C = coef(r, 0).sub(coef(l, 0));
	const lines = [`${polyToLatex(l)} = ${polyToLatex(r)}`];
	const moved = `${coefX(A)} = ${C.toLatex()}`;
	if (A.isZero()) {
		if (moved !== lines[0]) lines.push(moved);
		return { kind: C.isZero() ? 'all' : 'none', lines };
	}
	const x = C.div(A);
	if (A.isOne()) {
		if (moved === lines[0]) lines[0] = `x = \\hl{${x.toLatex()}}`;
		else lines.push(`x = \\hl{${x.toLatex()}}`);
		return { kind: 'one', x, lines };
	}
	if (moved !== lines[0]) lines.push(moved);
	lines.push(`x = \\hl{${x.toLatex()}}`);
	return { kind: 'one', x, lines };
}

const cmp = (x: Rational, rel: '>=' | '<=' | '>' | '<', x0: Rational) => {
	const c = x.compare(x0);
	return rel === '>=' ? c >= 0 : rel === '<=' ? c <= 0 : rel === '>' ? c > 0 : c < 0;
};
const REL_TEX = { '>=': '\\geq', '<=': '\\leq', '>': '>', '<': '<' } as const;

export function equazioneValoreAssoluto(input: string): Outcome {
	return risolviValoreAssoluto(input).outcome;
}

/** The outcome and the set of solutions, for the tests. */
export function risolviValoreAssoluto(input: string): { outcome: Outcome; set: LineSet | null } {
	const parsed = parseValoreAssoluto(input);
	if (!parsed.ok) return { outcome: fail(parsed.error), set: null };
	try {
		return polyDegree(parsed.p.B) < 1 ? withNumber(parsed.p) : withCases(parsed.p);
	} catch {
		return { outcome: fail(TOO_BIG), set: null };
	}
}

/** The two sides with x replaced by s, and their values: the check. */
function checkLines(p: Parsed, s: Rational): string[] {
	const va = polyAt(p.A, s);
	const vb = polyAt(p.B, s);
	const abs = `\\left| ${nodeLatex(p.aNode, s)} \\right| = \\left| ${va.toLatex()} \\right| = ${va.abs().toLatex()}`;
	const other = nodeLatex(p.bNode, s);
	const lines = [abs];
	if (polyDegree(p.B) >= 1) lines.push(other === vb.toLatex() ? other : `${other} = ${vb.toLatex()}`);
	return lines;
}

function result(set: LineSet, steps: PartStep[], names: Record<Part, string>): { outcome: Outcome; set: LineSet } {
	const w = writeSet(set);
	const on = steps.length > 5;
	const plain = steps.map(({ part, ...step }, i) => (on && (i === 0 || steps[i - 1].part !== part) ? { group: names[part], ...step } : step));
	const outcome: Outcome = {
		ok: true,
		rows: [
			{ label: 'Soluzioni', value: w.empty ? "Nessuna: l'equazione è impossibile" : w.words },
			{ label: 'Insieme delle soluzioni', value: `$S = ${w.set}$` }
		],
		copy: w.copy.replace(/−/g, '-'),
		steps: plain
	};
	return { outcome, set };
}

/** Isolated solutions only: the points in the set, nothing between. */
const pointsSet = (xs: Rational[]): LineSet => {
	const points = sortNums(xs.map(num));
	return { points, pointIn: points.map(() => true), stretchIn: [...points.map(() => false), false] };
};

/** |A| = k with k a number. */
function withNumber(p: Parsed): { outcome: Outcome; set: LineSet } {
	const k = coef(p.B, 0);
	const names: Record<Part, string> = { casi: 'Il secondo membro', c1: 'Le due equazioni', c2: 'Le due equazioni', controllo: 'Il controllo' };
	const steps: PartStep[] = [];
	const absA = `\\left| ${polyToLatex(p.A)} \\right|`;
	if (k.sign() < 0) {
		steps.push({ say: 'Guarda il secondo membro.', math: [`${absA} = \\hl{${k.toLatex()}}`], then: "Un valore assoluto non è mai negativo: l'equazione è impossibile.", part: 'casi' });
		return result(pointsSet([]), steps, names);
	}
	if (k.isZero()) {
		const s = solveLinear(p.A, [ZERO]);
		steps.push({ say: "Poni l'argomento uguale a zero.", math: s.lines, then: 'Solo lo zero ha valore assoluto zero.', part: 'c1' });
		const x = s.kind === 'one' ? [s.x] : [];
		if (x.length) steps.push({ say: "Controlla nell'equazione di partenza.", math: checkLines(p, x[0]), then: 'I due membri sono uguali: la soluzione è giusta.', part: 'controllo' });
		return result(pointsSet(x), steps, names);
	}
	steps.push({
		say: "Scrivi le due equazioni per l'argomento.",
		math: [`${polyToLatex(p.A)} = \\hl{${k.toLatex()}}`, `${polyToLatex(p.A)} = \\hl{${k.neg().toLatex()}}`],
		then: `Hanno valore assoluto $${k.toLatex()}$ due numeri: $${k.toLatex()}$ e $${k.neg().toLatex()}$.`,
		part: 'c1'
	});
	const s1 = solveLinear(p.A, [k]);
	const s2 = solveLinear(p.A, [k.neg()]);
	steps.push({ say: 'Risolvi la prima equazione.', math: s1.lines, part: 'c1' });
	steps.push({ say: 'Risolvi la seconda equazione.', math: s2.lines, part: 'c2' });
	const xs = [s1, s2].flatMap((s) => (s.kind === 'one' ? [s.x] : []));
	steps.push({ say: "Controlla nell'equazione di partenza.", math: xs.flatMap((x) => checkLines(p, x)), then: `Tutte e due danno $${k.toLatex()}$: le soluzioni sono giuste.`, part: 'controllo' });
	return result(pointsSet(xs), steps, names);
}

/** |A| = B(x): the two cases of the sign of A. */
function withCases(p: Parsed): { outcome: Outcome; set: LineSet } {
	const a = coef(p.A, 1);
	const x0 = coef(p.A, 0).neg().div(a);
	const up = a.sign() > 0;
	// Where A ≥ 0 and where A < 0.
	const r1 = up ? '>=' : '<=';
	const r2 = up ? '<' : '>';
	const c1 = `x ${REL_TEX[r1]} ${x0.toLatex()}`;
	const c2 = `x ${REL_TEX[r2]} ${x0.toLatex()}`;
	// The argument and the other side as typed; the opposite of the argument worked out.
	const Atex = nodeLatex(unwrap(p.aNode));
	const Btex = nodeLatex(p.bNode);
	const single = p.A.filter((c) => !c.isZero()).length === 1;
	const names: Record<Part, string> = {
		casi: "Il segno dell'argomento",
		c1: 'Primo caso: argomento positivo o zero',
		c2: 'Secondo caso: argomento negativo',
		controllo: 'Il controllo'
	};
	const steps: PartStep[] = [];
	steps.push({
		say: "Studia il segno dell'argomento.",
		math: [single && up && Atex === 'x' ? 'x \\geq 0' : `${Atex} \\geq 0 \\;\\Rightarrow\\; ${c1}`],
		then: `Per $${c1}$ il valore assoluto è l'argomento stesso; per $${c2}$ è il suo opposto.`,
		part: 'casi'
	});

	const cases: { part: 'c1' | 'c2'; rel: typeof r1 | typeof r2; cond: string; sol: Lin }[] = [];
	// First case: |A| = A.
	steps.push({ say: `Per $${c1}$ togli le barre.`, math: [`\\hl{${Atex}} = ${Btex}`], part: 'c1' });
	const s1 = solveLinear(p.A, p.B);
	cases.push({ part: 'c1', rel: r1, cond: c1, sol: s1 });
	// Second case: |A| = −A.
	const minusA = p.A.map((c) => c.neg());
	const s2 = solveLinear(minusA, p.B);
	cases.push({ part: 'c2', rel: r2, cond: c2, sol: s2 });

	const accepted: Rational[] = [];
	const whole: { rel: string }[] = [];
	for (const c of cases) {
		if (c.part === 'c2') steps.push({ say: `Per $${c.cond}$ cambia il segno dell'argomento.`, math: single ? [`\\hl{${polyToLatex(minusA)}} = ${Btex}`] : [`-\\left(${Atex}\\right) = ${Btex}`, `\\hl{${polyToLatex(minusA)}} = ${Btex}`], part: 'c2' });
		const s = c.sol;
		let then: string;
		if (s.kind === 'one') {
			if (cmp(s.x, c.rel, x0)) {
				accepted.push(s.x);
				then = `Il $${s.x.toLatex()}$ rispetta la condizione $${c.cond}$: è accettabile.`;
			} else then = `Il $${s.x.toLatex()}$ non rispetta la condizione $${c.cond}$: si scarta.`;
		} else if (s.kind === 'all') {
			whole.push({ rel: c.rel });
			then = `L'uguaglianza è vera per ogni $x$: vanno bene tutti i numeri con $${c.cond}$.`;
		} else then = 'Nessun numero la rende vera: questo caso non dà soluzioni.';
		const lines = s.lines.slice(1);
		steps.push({ say: `Risolvi e confronta con $${c.cond}$.`, math: lines.length ? lines : s.lines, then, part: c.part });
	}

	// The set: isolated solutions and, for a case true for every x, its half-line.
	const pts = sortNums([num(x0), ...accepted.map(num)]);
	const inCase = (v: number, rel: string) => (rel === '>=' ? v >= x0.num / x0.den : rel === '<=' ? v <= x0.num / x0.den : rel === '>' ? v > x0.num / x0.den : v < x0.num / x0.den);
	const isPoint = (x: Num) => accepted.some((s) => num(s).equals(x));
	const set: LineSet = {
		points: pts,
		pointIn: pts.map((x) => isPoint(x) || whole.some((w) => cmp(x.toRational(), w.rel as typeof r1, x0))),
		stretchIn: [...pts, null].map((_, j) => {
			const lo = j === 0 ? -Infinity : pts[j - 1].value();
			const hi = j === pts.length ? Infinity : pts[j].value();
			const mid = lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2;
			return whole.some((w) => inCase(mid, w.rel));
		})
	};
	const w = writeSet(set);
	if (accepted.length)
		steps.push({
			say: "Controlla nell'equazione di partenza.",
			math: accepted.flatMap((x) => checkLines(p, x)),
			then: accepted.length > 1 ? 'Per ogni soluzione i due membri sono uguali: sono giuste.' : 'I due membri sono uguali: la soluzione è giusta.',
			part: 'controllo'
		});
	else if (w.empty) steps.push({ say: 'Metti insieme i due casi.', then: "Nessun caso dà soluzioni: l'equazione è impossibile.", part: 'controllo' });
	return result(set, steps, names);
}

