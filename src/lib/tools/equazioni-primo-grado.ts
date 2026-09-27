import { Rational, ZERO, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
import { decimal } from './numbers';
import { denominatorsLcm, expandSide, expansionStep, monoLatex, parseEquation, polyAt, scaleMonos, type Mono } from './equazione';

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

/** "(−3)" for a negative divisor, as the lesson writes it. */
const divisor = (r: Rational) => (r.sign() < 0 ? `\\left(${r.toLatex()}\\right)` : r.toLatex());

function coefX(a: Rational): string {
	if (a.isZero()) return '0x';
	if (a.isOne()) return 'x';
	if (a.equals(q(-1))) return '-x';
	return `${a.toLatex()}x`;
}

/** The solution with its decimal value when it is not an integer: "x = \frac{7}{3} \approx 2{,}3333". */
function solutionTex(x: Rational): string {
	if (x.isInteger()) return `x = ${x.toLatex()}`;
	const d = decimal(x, DIGITS);
	return `x = ${x.toLatex()} ${d.exact ? '=' : '\\approx'} ${d.tex}`;
}

export function equazionePrimoGrado(input: string): Outcome {
	const parsed = parseEquation(input);
	if (!parsed.ok) return fail(parsed.error);
	const { eq } = parsed;
	if (eq.degree === 2) return fail("È un'equazione di secondo grado: dopo aver portato tutto a primo membro resta un termine con x². Risolvila con il calcolatore delle equazioni di secondo grado.");
	if (eq.degree > 2) return fail(`È un'equazione di grado ${eq.degree}: questo strumento risolve solo le equazioni di primo grado.`);

	try {
		return solve(eq);
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti.');
	}
}

function solve(eq: Extract<ReturnType<typeof parseEquation>, { ok: true }>['eq']): Outcome {
	const steps: string[] = [];
	const expansion = expansionStep(eq);
	if (expansion) steps.push(expansion);

	let left: Mono[] = expandSide(eq.lhs);
	let right: Mono[] = expandSide(eq.rhs);
	const m = denominatorsLcm([...left, ...right].map((t) => t.c));
	if (m > 1) {
		left = scaleMonos(left, q(m));
		right = scaleMonos(right, q(m));
		const also = !expansion && eq.has.fractionBrackets ? ', e togli le parentesi' : '';
		steps.push(`Moltiplica tutti i termini per il mcm dei denominatori, $${m}$${also}: $${monoLatex(left)} = ${monoLatex(right)}$.`);
	}

	// Principles of equivalence: terms with x to the left, numbers to the right, changing sign.
	const lx = left.filter((t) => t.deg > 0);
	const lc = left.filter((t) => t.deg === 0);
	const rx = right.filter((t) => t.deg > 0);
	const rc = right.filter((t) => t.deg === 0);
	const moveX = [...lx, ...rx.map((t) => ({ c: t.c.neg(), deg: t.deg }))];
	const moveC = [...rc, ...lc.map((t) => ({ c: t.c.neg(), deg: 0 }))];
	if (lc.length || rx.length) steps.push(`Porta i termini con la $x$ a primo membro e i numeri a secondo membro, cambiando il segno a quelli che passano dall'altra parte: $${monoLatex(moveX)} = ${monoLatex(moveC)}$.`);

	const A = moveX.filter((t) => t.deg === 1).reduce((s, t) => s.add(t.c), ZERO);
	const B = moveC.reduce((s, t) => s.add(t.c), ZERO);
	if (moveX.length !== 1 || moveC.length > 1) steps.push(`Riduci i termini simili: $${coefX(A)} = ${B.toLatex()}$.`);

	if (A.isZero()) {
		if (B.isZero()) {
			steps.push("Ogni numero moltiplicato per $0$ dà $0$: l'uguaglianza è vera per qualunque valore di $x$, quindi l'equazione è indeterminata.");
			return { ok: true, result: 'Equazione indeterminata: $S = \\mathbb{R}$', copy: 'Indeterminata: ogni numero reale è soluzione', steps };
		}
		steps.push(`Nessun numero moltiplicato per $0$ dà $${B.toLatex()}$: l'equazione è impossibile.`);
		return { ok: true, result: 'Equazione impossibile: $S = \\emptyset$', copy: 'Impossibile: nessuna soluzione', steps };
	}

	const x = B.div(A);
	if (!A.isOne()) {
		// A and B are integers here: after the mcm every coefficient is.
		const frac = `\\dfrac{${B.toLatex()}}{${A.toLatex()}}`;
		const already = A.sign() > 0 && x.num === B.num && x.den === A.num;
		steps.push(`Dividi entrambi i membri per $${divisor(A)}$: $x = ${already ? frac : `${frac} = ${x.toLatex()}`}$.`);
	}
	if (!x.isInteger()) {
		const d = decimal(x, DIGITS);
		steps.push(`In forma decimale: $x ${d.exact ? '=' : '\\approx'} ${d.tex}$.`);
	}
	const vl = polyAt(eq.L, x);
	const vr = polyAt(eq.R, x);
	steps.push(`Controllo: sostituisci $x = ${x.toLatex()}$ nell'equazione di partenza. Il primo membro vale $${vl.toLatex()}$ e il secondo $${vr.toLatex()}$: sono uguali.`);
	return { ok: true, result: `$${solutionTex(x)}$`, copy: `x = ${x.toString()}`, steps };
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
