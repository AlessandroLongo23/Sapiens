import { Rational, ZERO, q } from '@/lib/exercises/v2/rational';
import { polyDegree } from '@/lib/exercises/v2/latex';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal } from './numbers';
import { denominatorsLcm, evaluate, expandSide, expansionStep, monoBody, monoLatex, nodeLatex, parseEquation, polyAt, scaleMonos, sideTerms, unwrap, type Mono, type Node } from './equazione';

/**
 * First-degree equations in x, solved as in the lesson (equazioni-primo-grado): remove the brackets, multiply by
 * the mcm of the denominators, move the terms with the principles of equivalence, reduce, divide. Detects the
 * impossible (0x = k) and indeterminate (0x = 0) cases; a second-degree equation is sent to the other tool.
 */

export type LinearCase = 'determinata' | 'impossibile' | 'indeterminata';

export interface LinearSolution {
	case: LinearCase;
	/** The solution, for a determined equation. */
	x?: Rational;
}

/** Why the equation is not for this tool: its degree after moving every term to one side. */
export type NotLinear = { degree: number };

const DIGITS = 4;

/** More steps than this are grouped (docs/strumenti.md, "Leggibilità", rule 6). */
const GROUP_OVER = 5;

type Eq = Extract<ReturnType<typeof parseEquation>, { ok: true }>['eq'];

/** The coefficient of x with its x: "5x", "-x", "0x". */
function coefX(a: Rational): string {
	if (a.isZero()) return '0x';
	if (a.isOne()) return 'x';
	if (a.equals(q(-1))) return '-x';
	return `${a.toLatex()}x`;
}

/**
 * The solution as the value of a row, with its decimal value when it is not an integer as a second formula, so that
 * on a phone it can go to the next line: "$x = \frac{7}{3}$ $\approx 2{,}3333$".
 */
function solutionValue(x: Rational): string {
	if (x.isInteger()) return `$x = ${x.toLatex()}$`;
	const d = decimal(x, DIGITS);
	return `$x = ${x.toLatex()}$ $${d.exact ? '=' : '\\approx'} ${d.tex}$`;
}

/** "a \cdot t" for every term of a side, signs kept outside: "\hl{6} \cdot \dfrac{x}{2} - \hl{6} \cdot 1". */
function timesTerms(m: number, terms: { neg: boolean; latex: string }[]): string {
	return terms.map((t, i) => `${i === 0 ? (t.neg ? '-' : '') : t.neg ? ' - ' : ' + '}\\hl{${m}} \\cdot ${t.latex}`).join('');
}

/** The terms of a side as typed, for the line that multiplies each by the mcm. A negative term goes in brackets. */
function typedTerms(n: Node): { neg: boolean; latex: string }[] {
	return sideTerms(n).map((t) => ({ neg: t.neg, latex: t.n.k === 'neg' || t.n.k === 'sum' ? `\\left(${nodeLatex(t.n)}\\right)` : nodeLatex(t.n) }));
}

/**
 * A side as typed, each term multiplied by m and simplified, keeping the brackets of a numerator:
 * 6 · (x + 1)/3 → 2(x + 1). Null when no term has such a numerator (or the factor is not whole).
 */
function simplifiedTerms(n: Node, m: number): string | null {
	let any = false;
	const parts: { neg: boolean; body: string }[] = [];
	for (const t of sideTerms(n)) {
		const inner = t.n.k === 'div' ? unwrap(t.n.a) : null;
		const den = t.n.k === 'div' ? evaluate(t.n.b) : null;
		if (inner && den && polyDegree(den) === 0 && (inner.k === 'sum' || inner.k === 'neg')) {
			const k = q(m).div(den[0]);
			if (!k.isInteger()) return null;
			any = true;
			const neg = t.neg !== k.sign() < 0;
			const abs = k.abs();
			parts.push({ neg, body: `${abs.isOne() ? '' : abs.toLatex()}\\left(${nodeLatex(inner)}\\right)` });
			continue;
		}
		const monos = expandSide(t.n).map((mono) => ({ c: mono.c.mul(q(m)), deg: mono.deg }));
		if (monos.length === 1) {
			parts.push({ neg: t.neg !== monos[0].c.sign() < 0, body: monoBody(monos[0]) });
		} else parts.push({ neg: t.neg, body: `\\left(${monoLatex(monos)}\\right)` });
	}
	if (!any) return null;
	return parts.map((p, i) => `${i === 0 ? (p.neg ? '-' : '') : p.neg ? ' - ' : ' + '}${p.body}`).join('');
}

export function equazionePrimoGrado(input: string): Outcome {
	const parsed = parseEquation(input);
	if (!parsed.ok) return fail(parsed.error);
	const { eq } = parsed;
	if (eq.degree === 2) return fail("È un'equazione di secondo grado: dopo aver portato tutto a primo membro resta un termine con x². Risolvila con il calcolatore delle equazioni di secondo grado.");
	if (eq.degree > 2) return fail(`È un'equazione di grado ${eq.degree}: qui si risolvono solo le equazioni di primo grado, per esempio 2x + 3 = 7.`);

	try {
		return solve(eq);
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

type Part = 'parentesi' | 'denominatori' | 'incognita' | 'controllo';
const PART_NAMES: Record<Part, string> = { parentesi: 'Le parentesi', denominatori: 'I denominatori', incognita: "L'incognita da una parte", controllo: 'Il controllo' };

function solve(eq: Eq): Outcome {
	const steps: (Step & { part: Part })[] = [];
	const expansion = expansionStep(eq);
	if (expansion) steps.push({ ...expansion, part: 'parentesi' });

	let left: Mono[] = expandSide(eq.lhs);
	let right: Mono[] = expandSide(eq.rhs);
	const all = [...left, ...right].map((t) => t.c);
	const m = denominatorsLcm(all);
	if (m > 1) {
		const dens = [...new Set(all.filter((c) => c.den > 1).map((c) => c.den))].sort((a, b) => a - b);
		if (dens.length > 1) steps.push({ say: 'Calcola il mcm dei denominatori.', math: [`\\text{mcm}(${dens.join(',\\ ')}) = \\hl{${m}}`], part: 'denominatori' });
		const typed = !expansion;
		const lines = [
			typed ? `${timesTerms(m, typedTerms(eq.lhs))} = ${timesTerms(m, typedTerms(eq.rhs))}` : `${timesTerms(m, left.map((t) => ({ neg: t.c.sign() < 0, latex: monoBody(t) })))} = ${timesTerms(m, right.map((t) => ({ neg: t.c.sign() < 0, latex: monoBody(t) })))}`
		];
		const simpL = typed ? simplifiedTerms(eq.lhs, m) : null;
		const simpR = typed ? simplifiedTerms(eq.rhs, m) : null;
		if (simpL || simpR) lines.push(`${simpL ?? monoLatex(scaleMonos(left, q(m)))} = ${simpR ?? monoLatex(scaleMonos(right, q(m)))}`);
		left = scaleMonos(left, q(m));
		right = scaleMonos(right, q(m));
		lines.push(`${monoLatex(left)} = ${monoLatex(right)}`);
		steps.push({
			say: dens.length > 1 ? `Moltiplica tutti i termini per $${m}$.` : `Moltiplica tutti i termini per $${m}$, il denominatore.`,
			math: lines,
			then: simpL || simpR ? 'Semplifica ogni frazione, poi togli le parentesi.' : 'Così spariscono i denominatori.',
			part: 'denominatori'
		});
	}

	// Principles of equivalence: terms with x to the left, numbers to the right, changing sign.
	const lx = left.filter((t) => t.deg > 0);
	const lc = left.filter((t) => t.deg === 0);
	const rx = right.filter((t) => t.deg > 0);
	const rc = right.filter((t) => t.deg === 0);
	const moveX: Mono[] = [...lx, ...rx.map((t) => ({ c: t.c.neg(), deg: t.deg, hl: true }))];
	const moveC: Mono[] = [...rc, ...lc.map((t) => ({ c: t.c.neg(), deg: 0, hl: true }))];
	if (lc.length || rx.length)
		steps.push({
			say: 'Porta i termini con la $x$ a sinistra e i numeri a destra.',
			math: [`${monoLatex(moveX)} = ${monoLatex(moveC)}`],
			then: "Un termine che passa dall'altra parte dell'uguale cambia segno.",
			part: 'incognita'
		});

	const A = moveX.filter((t) => t.deg === 1).reduce((s, t) => s.add(t.c), ZERO);
	const B = moveC.reduce((s, t) => s.add(t.c), ZERO);
	if (moveX.length !== 1 || moveC.length > 1) {
		const lhs = moveX.length !== 1 ? `\\hl{${coefX(A)}}` : coefX(A);
		const rhs = moveC.length > 1 ? `\\hl{${B.toLatex()}}` : B.toLatex();
		steps.push({ say: 'Somma i termini simili.', math: [`${lhs} = ${rhs}`], part: 'incognita' });
	}

	if (A.isZero()) {
		const zero = B.isZero();
		steps.push({
			say: zero ? 'Cerca i numeri che moltiplicati per $0$ danno $0$.' : `Cerca un numero che moltiplicato per $0$ dia $${B.toLatex()}$.`,
			then: zero ? "Vanno bene tutti: ogni numero per $0$ dà $0$. L'equazione è indeterminata." : "Non esiste: ogni numero per $0$ dà $0$. L'equazione è impossibile.",
			part: 'incognita'
		});
		return finish(
			steps,
			zero
				? [
						{ label: 'Soluzioni', value: "Tutti i numeri reali: l'equazione è indeterminata" },
						{ label: 'Insieme delle soluzioni', value: '$S = \\mathbb{R}$' }
					]
				: [
						{ label: 'Soluzioni', value: "Nessuna: l'equazione è impossibile" },
						{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
					],
			zero ? 'Indeterminata: ogni numero reale è soluzione' : 'Impossibile: nessuna soluzione'
		);
	}

	const x = B.div(A);
	if (!A.isOne()) {
		// A and B are integers here: after the mcm every coefficient is.
		const lines = [`\\dfrac{${coefX(A)}}{\\hl{${A.toLatex()}}} = \\dfrac{${B.toLatex()}}{\\hl{${A.toLatex()}}}`];
		const already = A.sign() > 0 && x.num === B.num && x.den === A.num;
		if (already) lines.push(`x = \\hl{${x.toLatex()}}`);
		else lines.push(`x = \\dfrac{${B.toLatex()}}{${A.toLatex()}}`, `x = \\hl{${x.toLatex()}}`);
		steps.push({
			say: `Dividi entrambi i membri per $${A.toLatex()}$.`,
			math: lines,
			then: already ? undefined : B.isZero() ? 'Zero diviso un numero dà zero.' : A.sign() < 0 ? (B.sign() < 0 ? 'Semplifica: meno diviso meno dà più.' : 'Semplifica: più diviso meno dà meno.') : 'Semplifica la frazione.',
			part: 'incognita'
		});
	}
	const vl = polyAt(eq.L, x);
	const vr = polyAt(eq.R, x);
	// Each side with x replaced, and its value; a side that is already a number needs no line.
	const sides = [
		[nodeLatex(eq.lhs, x), vl.toLatex()],
		[nodeLatex(eq.rhs, x), vr.toLatex()]
	].filter(([sub, value]) => sub !== value);
	steps.push({
		say: "Controlla: sostituisci la soluzione nell'equazione di partenza.",
		math: sides.length ? sides.map(([sub, value]) => `${sub} = ${value}`) : [`${vl.toLatex()} = ${vr.toLatex()}`],
		then: `I due membri valgono entrambi $${vl.toLatex()}$: la soluzione è giusta.`,
		part: 'controllo'
	});
	return finish(steps, [{ label: 'Soluzione', value: solutionValue(x) }], `x = ${x.toString()}`);
}

/** The outcome, with the steps grouped when they are more than five. */
function finish(steps: (Step & { part: Part })[], rows: ResultRow[], copy: string): Outcome {
	const grouped = steps.length > GROUP_OVER;
	return {
		ok: true,
		rows,
		copy,
		steps: steps.map(({ part, ...step }, i) => (grouped && (i === 0 || steps[i - 1].part !== part) ? { group: PART_NAMES[part], ...step } : step))
	};
}

/** The solution without the steps, for the tests and for other tools. */
export function solveLinear(input: string): LinearSolution | NotLinear | null {
	const parsed = parseEquation(input);
	if (!parsed.ok) return null;
	const { eq } = parsed;
	if (eq.degree > 1) return { degree: eq.degree };
	const a = eq.L[1] ?? ZERO;
	const b = eq.L[0] ?? ZERO;
	const A = a.sub(eq.R[1] ?? ZERO);
	const B = (eq.R[0] ?? ZERO).sub(b);
	if (A.isZero()) return { case: B.isZero() ? 'indeterminata' : 'impossibile' };
	return { case: 'determinata', x: B.div(A) };
}
