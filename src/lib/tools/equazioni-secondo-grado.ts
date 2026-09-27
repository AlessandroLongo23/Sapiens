import { Rational, ZERO, gcd, q } from '@/lib/exercises/v2/rational';
import { Surd, sqrtParts } from '@/lib/exercises/v2/surd';
import { paren, polyScale, polySub, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { fail, type Outcome } from './types';
import { decimal } from './numbers';
import { denominatorsLcm, expandSide, expansionStep, monoLatex, parseConstant, parseEquation, type Mono } from './equazione';

/**
 * Second-degree equations, from the coefficients a, b, c or typed in full, solved as in the lesson
 * (equazioni-secondo-grado): normal form, integer coefficients, the incomplete equations the quick way (pura,
 * spuria), the complete ones with the discriminant and the formula, exact roots as rationals or simplified
 * radicals ((3 ± √5)/2) and their decimal values.
 */

export type QuadraticMode = 'coef' | 'eq';

export interface QuadraticInput {
	mode: QuadraticMode;
	a?: string;
	b?: string;
	c?: string;
	eq?: string;
}

const DIGITS = 4;

function approx(s: Surd): string {
	if (s.isRational()) return decimal(s.toRational(), DIGITS).tex;
	const v = s.value();
	const r = Math.round(Math.abs(v) * 10 ** DIGITS) / 10 ** DIGITS;
	const [int, frac = ''] = r.toFixed(DIGITS).replace(/0+$/, '').split('.');
	return `${v < 0 ? '-' : ''}${int}${frac ? `{,}${frac}` : ''}`;
}

function surdText(s: Surd): string {
	return s.toString().replace(/\*?sqrt\((\d+)\)/g, '√$1');
}

/** "\frac{a \pm k\sqrt{r}}{d}", or without the fraction when d = 1 (from the exercise generator). */
function pmLatex(a: number, k: number, r: number, d: number): string {
	const root = `${k === 1 ? '' : k}\\sqrt{${r}}`;
	const numer = a === 0 ? `\\pm ${root}` : `${a} \\pm ${root}`;
	return d === 1 ? numer : `\\frac{${numer}}{${d}}`;
}

/** √(p/q) for a non-negative rational, as a simplified radical: √(p·q)/q. */
const sqrtRational = (x: Rational): Surd => Surd.of(0, 1, x.num * x.den, x.den);

/** Exact roots of a x² + b x + c with rational coefficients, a ≠ 0, in increasing order. */
export function quadraticRoots(p: Poly): Surd[] {
	const [c = ZERO, b = ZERO, a] = p;
	const m = denominatorsLcm([a, b, c]);
	const [C, B, A] = [c, b, a].map((x) => x.mul(q(m)).num);
	const D = B * B - 4 * A * C;
	if (D < 0) return [];
	if (D === 0) return [Surd.of(-B, 0, 1, 2 * A)];
	const roots = [Surd.of(-B, -1, D, 2 * A), Surd.of(-B, 1, D, 2 * A)];
	return roots.sort((x, y) => x.compare(y));
}

function rootsResult(roots: Surd[], steps: string[]): Outcome {
	if (roots.length === 0) return { ok: true, result: 'Nessuna soluzione reale: $S = \\emptyset$', copy: 'Nessuna soluzione reale', steps };
	if (roots.some((r) => !(r.isRational() && r.toRational().isInteger()))) {
		const rel = (r: Surd) => (r.isRational() && decimal(r.toRational(), DIGITS).exact ? '=' : '\\approx');
		const list = roots.length === 1 ? `x_1 = x_2 ${rel(roots[0])} ${approx(roots[0])}` : `x_1 ${rel(roots[0])} ${approx(roots[0])}, \\quad x_2 ${rel(roots[1])} ${approx(roots[1])}`;
		steps.push(`In forma decimale: $${list}$.`);
	}
	if (roots.length === 1) return { ok: true, result: `$x_1 = x_2 = ${roots[0].toLatex()}$`, copy: `x1 = x2 = ${surdText(roots[0])}`, steps };
	return {
		ok: true,
		result: `$x_1 = ${roots[0].toLatex()}, \\quad x_2 = ${roots[1].toLatex()}$`,
		copy: `x1 = ${surdText(roots[0])}; x2 = ${surdText(roots[1])}`,
		steps
	};
}

const eqLatex = (p: Poly) => `${polyToLatex(p)} = 0`;

/** From a x² + b x + c = 0 with rational coefficients to the roots, with the steps of the lesson. */
function solveNormal(p: Poly, steps: string[]): Outcome {
	let cur = p.slice(0, 3);
	while (cur.length < 3) cur.push(ZERO);
	const m = denominatorsLcm(cur);
	if (m > 1) {
		cur = polyScale(cur, q(m));
		steps.push(`Moltiplica entrambi i membri per il mcm dei denominatori, $${m}$, così i coefficienti diventano interi: $${eqLatex(cur)}$.`);
	}
	if (cur[2].sign() < 0) {
		cur = polyScale(cur, q(-1));
		steps.push(`Moltiplica entrambi i membri per $-1$, così il coefficiente di $x^2$ è positivo: $${eqLatex(cur)}$.`);
	}
	const g = gcd(gcd(cur[0].num, cur[1].num), cur[2].num);
	if (g > 1) {
		cur = polyScale(cur, q(1, g));
		steps.push(`Dividi entrambi i membri per $${g}$: $${eqLatex(cur)}$.`);
	}
	const [C, B, A] = cur.map((x) => x.num);
	const roots = quadraticRoots(cur);
	const D = B * B - 4 * A * C;
	const deltaTex = `\\Delta = b^2 - 4ac = ${paren(q(B))}^2 - 4 \\cdot ${paren(q(A))} \\cdot ${paren(q(C))} = ${D}`;

	if (B === 0 && C === 0) {
		steps.push(`È un'equazione incompleta monomia: $${A === 1 ? '' : `${A}`}x^2 = 0$ vale solo se $x^2 = 0$, cioè per $x = 0$.`);
		steps.push('Le due soluzioni coincidono: $x_1 = x_2 = 0$.');
		return rootsResult(roots, steps);
	}
	if (B === 0) {
		// Pura: a x² + c = 0.
		const x2 = q(-C, A);
		steps.push(`Manca il termine con la $x$ ($b = 0$): è un'equazione pura. Porta il termine noto a secondo membro: $${polyToLatex([ZERO, ZERO, q(A)])} = ${-C}$.`);
		if (A !== 1) steps.push(`Dividi entrambi i membri per $${A}$: $x^2 = ${x2.toLatex()}$.`);
		if (x2.sign() < 0) {
			steps.push('Un quadrato non può essere negativo: l\'equazione non ha soluzioni reali.');
		} else {
			const root = sqrtRational(x2);
			const direct = `\\sqrt{${x2.toLatex()}}`;
			steps.push(`Estrai la radice quadrata, con il doppio segno: $x = \\pm ${direct}${root.toLatex() === direct ? '' : ` = \\pm ${root.toLatex()}`}$.`);
			steps.push(`Quindi $x_1 = ${roots[0].toLatex()}$ e $x_2 = ${roots[1].toLatex()}$.`);
		}
		steps.push(`Con la formula ottieni lo stesso risultato: $${deltaTex}$${D < 0 ? ', negativo.' : ', e $x_{1,2} = \\dfrac{\\pm\\sqrt{\\Delta}}{2a}$.'}`);
		return rootsResult(roots, steps);
	}
	if (C === 0) {
		// Spuria: a x² + b x = 0.
		const inner = [q(B), q(A)];
		steps.push(`Manca il termine noto ($c = 0$): è un'equazione spuria. Raccogli $x$: $x\\left(${polyToLatex(inner)}\\right) = 0$.`);
		const other = q(-B, A);
		steps.push(`Per la legge di annullamento del prodotto $x = 0$ oppure $${polyToLatex(inner)} = 0$, cioè $x = ${other.toLatex()}$.`);
		steps.push(`Quindi $x_1 = ${roots[0].toLatex()}$ e $x_2 = ${roots[1].toLatex()}$.`);
		steps.push(`Con la formula ottieni lo stesso risultato: $${deltaTex}$, e $\\sqrt{\\Delta} = ${Math.abs(B)}$.`);
		return rootsResult(roots, steps);
	}

	// Complete: the formula.
	steps.push(`Individua i coefficienti: $a = ${A},\\ b = ${B},\\ c = ${C}$.`);
	steps.push(`Calcola il discriminante: $${deltaTex}$.`);
	const minusB = -B;
	const twoA = 2 * A;
	if (D < 0) {
		steps.push("$\\Delta < 0$: l'equazione non ha soluzioni reali, perché nessun numero reale ha per quadrato un numero negativo.");
		return rootsResult(roots, steps);
	}
	if (D === 0) {
		steps.push('$\\Delta = 0$: due soluzioni reali coincidenti.');
		steps.push(`Applica la formula: $x_1 = x_2 = -\\dfrac{b}{2a} = \\dfrac{${minusB}}{${twoA}} = ${roots[0].toLatex()}$.`);
		return rootsResult(roots, steps);
	}
	steps.push('$\\Delta > 0$: due soluzioni reali distinte.');
	steps.push(`Applica la formula risolutiva: $x_{1,2} = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a} = \\dfrac{${minusB} \\pm \\sqrt{${D}}}{${twoA}}$.`);
	const { k, r } = sqrtParts(D);
	if (r === 1) {
		steps.push(`$\\sqrt{${D}} = ${k}$, quindi $x_1 = \\dfrac{${minusB} - ${k}}{${twoA}} = ${roots[0].toLatex()}$ e $x_2 = \\dfrac{${minusB} + ${k}}{${twoA}} = ${roots[1].toLatex()}$.`);
		return rootsResult(roots, steps);
	}
	if (k > 1) steps.push(`Semplifica il radicale: $\\sqrt{${D}} = ${k}\\sqrt{${r}}$, quindi $x_{1,2} = ${pmLatex(minusB, k, r, twoA)}$.`);
	const h = gcd(gcd(minusB, k), twoA);
	if (h > 1) steps.push(`Dividi numeratore e denominatore per $${h}$: $x_{1,2} = ${pmLatex(minusB / h, k / h, r, twoA / h)}$.`);
	steps.push(`Quindi $x_1 = ${roots[0].toLatex()}$ e $x_2 = ${roots[1].toLatex()}$.`);
	return rootsResult(roots, steps);
}

/** Why the equation is not second degree, for the page to link the other tool. */
export function quadraticDegree(input: QuadraticInput): number | null {
	if (input.mode === 'coef') {
		const a = parseConstant(input.a ?? '');
		return a && a !== 'error' ? (a.isZero() ? 1 : 2) : null;
	}
	const parsed = parseEquation(input.eq ?? '');
	return parsed.ok ? parsed.eq.degree : null;
}

export function equazioneSecondoGrado(input: QuadraticInput): Outcome {
	try {
		return input.mode === 'coef' ? fromCoefficients(input) : fromEquation(input.eq ?? '');
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti.');
	}
}

function fromCoefficients({ a = '', b = '', c = '' }: QuadraticInput): Outcome {
	const [A, B, C] = [a, b, c].map(parseConstant);
	if (A === null) return fail('Scrivi il coefficiente a, il numero davanti a x².');
	if (A === 'error' || B === 'error' || C === 'error') return fail('I coefficienti devono essere numeri: interi, decimali con la virgola (1,5) o frazioni (2/3).');
	if (A.isZero()) return fail("Con a = 0 manca il termine con x²: l'equazione è di primo grado.");
	const p: Poly = [C ?? ZERO, B ?? ZERO, A];
	const steps = [`Scrivi l'equazione in forma normale $ax^2 + bx + c = 0$: $${eqLatex(p)}$.`];
	return solveNormal(p, steps);
}

function fromEquation(text: string): Outcome {
	const parsed = parseEquation(text);
	if (!parsed.ok) return fail(parsed.error.replace('2x + 3 = 7', 'x^2 - 5x + 6 = 0'));
	const { eq } = parsed;
	if (eq.degree > 2) return fail(`È un'equazione di grado ${eq.degree}: questo strumento risolve solo le equazioni di secondo grado.`);
	if (eq.degree < 2) return fail("Dopo aver portato tutto a primo membro il termine con x² non c'è: l'equazione non è di secondo grado. Risolvila con il calcolatore delle equazioni di primo grado.");

	const steps: string[] = [];
	const expansion = expansionStep(eq);
	if (expansion) steps.push(expansion);
	const left: Mono[] = expandSide(eq.lhs);
	const right: Mono[] = expandSide(eq.rhs);
	const P = polySub(eq.L, eq.R);
	const moved: Mono[] = [...left, ...right.map((t) => ({ c: t.c.neg(), deg: t.deg }))];
	const reduced = polyToLatex(P);
	if (right.length) steps.push(`Porta tutti i termini a primo membro, cambiando il segno a quelli che passano dall'altra parte: $${monoLatex(moved)} = 0$.`);
	if (monoLatex(moved) !== reduced) steps.push(`Riduci i termini simili e ordina secondo le potenze di $x$: ottieni la forma normale $${reduced} = 0$.`);
	return solveNormal(P, steps);
}
