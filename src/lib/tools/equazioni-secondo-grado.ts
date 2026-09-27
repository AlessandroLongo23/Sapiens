import { Rational, ZERO, gcd, q } from '@/lib/exercises/v2/rational';
import { Surd, sqrtParts } from '@/lib/exercises/v2/surd';
import { polyScale, polySub, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { fail, type Outcome, type Step } from './types';
import { decimal, intTex } from './numbers';
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

/** More steps than this are grouped (docs/strumenti.md, "Leggibilità", rule 6). */
const GROUP_OVER = 5;

type Part = 'forma' | 'coefficienti' | 'discriminante' | 'soluzioni';
const PART_NAMES: Record<Part, string> = { forma: 'La forma normale', coefficienti: 'I coefficienti', discriminante: 'Il discriminante', soluzioni: 'Le soluzioni' };
type PartStep = Step & { part: Part };

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

/**
 * A root as the value of a row, "$x_1 = …$", with its decimal value when it is not an integer as a second formula,
 * so that on a phone the decimal goes to the next line: "$x_1 = 1 + \sqrt{2}$ $\approx 2{,}4142$".
 */
function rootValue(name: string, s: Surd): string {
	if (s.isRational() && s.toRational().isInteger()) return `$${name} = ${s.toLatex()}$`;
	const exact = s.isRational() && decimal(s.toRational(), DIGITS).exact;
	return `$${name} = ${s.toLatex()}$ $${exact ? '=' : '\\approx'} ${approx(s)}$`;
}

/** An integer for a substitution: in brackets when negative. */
const par = (n: number) => (n < 0 ? `(${intTex(n)})` : intTex(n));

/** "k\sqrt{r}", without the 1. */
const rootTex = (k: number, r: number) => (r === 1 ? intTex(k) : `${k === 1 ? '' : intTex(k)}\\sqrt{${intTex(r)}}`);

/** "\frac{a \pm k\sqrt{r}}{d}", or without the fraction when d = 1; `hl` marks the radical. */
function pmLatex(a: number, k: number, r: number, d: number, hl = false): string {
	const root = hl ? `\\hl{${rootTex(k, r)}}` : rootTex(k, r);
	const numer = a === 0 ? `\\pm ${root}` : `${intTex(a)} \\pm ${root}`;
	return d === 1 ? numer : `\\frac{${numer}}{${intTex(d)}}`;
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

/** The outcome, with the steps grouped when they are more than five. */
function result(roots: Surd[], steps: PartStep[]): Outcome {
	const grouped = steps.length > GROUP_OVER;
	const plain = steps.map(({ part, ...step }, i) => (grouped && (i === 0 || steps[i - 1].part !== part) ? { group: PART_NAMES[part], ...step } : step));
	if (roots.length === 0)
		return {
			ok: true,
			rows: [
				{ label: 'Soluzioni', value: 'Nessuna soluzione reale' },
				{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
			],
			copy: 'Nessuna soluzione reale',
			steps: plain
		};
	if (roots.length === 1) return { ok: true, rows: [{ label: 'Due soluzioni coincidenti', value: rootValue('x_1 = x_2', roots[0]) }], copy: `x1 = x2 = ${surdText(roots[0])}`, steps: plain };
	return {
		ok: true,
		rows: [
			{ label: 'Prima soluzione', value: rootValue('x_1', roots[0]) },
			{ label: 'Seconda soluzione', value: rootValue('x_2', roots[1]) }
		],
		copy: `x1 = ${surdText(roots[0])}; x2 = ${surdText(roots[1])}`,
		steps: plain
	};
}

const eqLatex = (p: Poly) => `${polyToLatex(p)} = 0`;

/**
 * The lines of x = ±√(p/q), from the radical to its simplest form: the root of a fraction split in two, the
 * denominator made rational, the square factors taken out. The last line is highlighted.
 */
function sqrtLines(x2: Rational): string[] {
	const [p, d] = [x2.num, x2.den];
	const bodies = [`\\sqrt{${x2.toLatex()}}`];
	if (d === 1) {
		const { k, r } = sqrtParts(p);
		if (k > 1 && r > 1) bodies.push(`\\sqrt{${intTex(k * k)} \\cdot ${intTex(r)}}`);
	} else {
		bodies.push(`\\frac{\\sqrt{${intTex(p)}}}{\\sqrt{${intTex(d)}}}`);
		const den = sqrtParts(d);
		if (den.r === 1) {
			const num = sqrtParts(p);
			if (num.k > 1 && num.r > 1) bodies.push(`\\frac{\\sqrt{${intTex(num.k * num.k)} \\cdot ${intTex(num.r)}}}{${intTex(den.k)}}`);
		} else {
			bodies.push(`\\frac{\\sqrt{${intTex(p)}} \\cdot \\sqrt{${intTex(d)}}}{${intTex(d)}}`, `\\frac{\\sqrt{${intTex(p * d)}}}{${intTex(d)}}`);
			const num = sqrtParts(p * d);
			if (num.k > 1 && num.r > 1) bodies.push(`\\frac{\\sqrt{${intTex(num.k * num.k)} \\cdot ${intTex(num.r)}}}{${intTex(d)}}`);
		}
	}
	bodies.push(sqrtRational(x2).toLatex());
	const unique = bodies.filter((b, i) => i === 0 || b !== bodies[i - 1]);
	return unique.map((b, i) => `${i === 0 ? 'x = ' : '= '}\\pm ${i === unique.length - 1 ? `\\hl{${b}}` : b}`);
}

/** From a x² + b x + c = 0 with rational coefficients to the roots, with the steps of the lesson. */
function solveNormal(p: Poly, steps: PartStep[]): Outcome {
	let cur = p.slice(0, 3);
	while (cur.length < 3) cur.push(ZERO);
	const m = denominatorsLcm(cur);
	if (m > 1) {
		const before = polyToLatex(cur);
		cur = polyScale(cur, q(m));
		steps.push({
			say: `Moltiplica entrambi i membri per $${intTex(m)}$, il mcm dei denominatori.`,
			math: [`\\hl{${intTex(m)}} \\cdot \\left(${before}\\right) = \\hl{${intTex(m)}} \\cdot 0`, eqLatex(cur)],
			then: 'Così i coefficienti sono numeri interi.',
			part: 'forma'
		});
	}
	if (cur[2].sign() < 0) {
		cur = polyScale(cur, q(-1));
		steps.push({ say: 'Moltiplica entrambi i membri per $-1$.', math: [eqLatex(cur)], then: 'Così il coefficiente di $x^2$ è positivo.', part: 'forma' });
	}
	const g = gcd(gcd(Math.abs(cur[0].num), Math.abs(cur[1].num)), Math.abs(cur[2].num));
	if (g > 1) {
		cur = polyScale(cur, q(1, g));
		steps.push({ say: `Dividi entrambi i membri per $${intTex(g)}$.`, math: [eqLatex(cur)], then: 'Così i numeri sono più piccoli.', part: 'forma' });
	}
	const [C, B, A] = cur.map((x) => x.num);
	const roots = quadraticRoots(cur);
	const D = B * B - 4 * A * C;
	const kind = B === 0 && C === 0 ? 'Mancano $b$ e $c$: è un’equazione monomia.' : B === 0 ? 'Manca il termine con la $x$, perché $b = 0$: è un’equazione pura.' : C === 0 ? 'Manca il termine noto, perché $c = 0$: è un’equazione spuria.' : undefined;
	steps.push({
		say: 'Individua i coefficienti.',
		table: { head: ['$a$', '$b$', '$c$'], rows: [[`$${intTex(A)}$`, `$${intTex(B)}$`, `$${intTex(C)}$`]] },
		then: kind,
		part: kind ? 'coefficienti' : 'discriminante'
	});
	const ax2 = polyToLatex([ZERO, ZERO, q(A)]);

	if (B === 0 && C === 0) {
		// Monomia: after dividing by a, x² = 0.
		steps.push({ say: 'Estrai la radice quadrata.', math: ['x^2 = 0', 'x = \\hl{0}'], then: 'Solo zero al quadrato dà zero: le due soluzioni coincidono.', part: 'soluzioni' });
		return result(roots, steps);
	}
	if (B === 0) {
		// Pura: a x² + c = 0.
		const x2 = q(-C, A);
		steps.push({ say: 'Porta il termine noto a destra.', math: [`${ax2} = \\hl{${intTex(-C)}}`], then: "Un termine che passa dall'altra parte dell'uguale cambia segno.", part: 'soluzioni' });
		if (A !== 1) steps.push({ say: `Dividi entrambi i membri per $${intTex(A)}$.`, math: [`x^2 = \\hl{${x2.toLatex()}}`], part: 'soluzioni' });
		if (x2.sign() < 0) steps.push({ say: 'Guarda il segno del secondo membro.', then: "Un quadrato non è mai negativo: l'equazione non ha soluzioni reali.", part: 'soluzioni' });
		else {
			const rationalise = x2.den > 1 && sqrtParts(x2.den).r > 1;
			steps.push({
				say: 'Estrai la radice quadrata, con il più e con il meno.',
				math: sqrtLines(x2),
				then: rationalise ? `Per togliere la radice dal denominatore moltiplica sopra e sotto per $\\sqrt{${intTex(x2.den)}}$. Le soluzioni sono due numeri opposti.` : 'Le soluzioni sono due numeri opposti.',
				part: 'soluzioni'
			});
		}
		return result(roots, steps);
	}
	if (C === 0) {
		// Spuria: a x² + b x = 0.
		const inner = polyToLatex([q(B), q(A)]);
		const other = q(-B, A);
		steps.push({ say: 'Raccogli $x$ a fattor comune.', math: [`\\hl{x}\\left(${inner}\\right) = 0`], part: 'soluzioni' });
		steps.push({ say: 'Usa la legge di annullamento del prodotto.', math: ['x = \\hl{0}', `${inner} = 0`], then: 'Un prodotto vale zero quando almeno un fattore vale zero.', part: 'soluzioni' });
		steps.push({ say: 'Risolvi la seconda equazione.', math: A === 1 ? [`x = \\hl{${other.toLatex()}}`] : [`${ax2.replace('^2', '')} = ${intTex(-B)}`, `x = \\hl{${other.toLatex()}}`], part: 'soluzioni' });
		return result(roots, steps);
	}

	// Complete: the discriminant and the formula.
	const fourAC = 4 * A * C;
	steps.push({
		say: 'Calcola il discriminante.',
		math: ['\\Delta = b^2 - 4ac', `= ${par(B)}^2 - 4 \\cdot ${par(A)} \\cdot ${par(C)}`, `= ${intTex(B * B)} ${fourAC > 0 ? '-' : '+'} ${intTex(Math.abs(fourAC))}`, `= \\hl{${intTex(D)}}`],
		then: D > 0 ? 'Il discriminante è positivo: le soluzioni sono due, diverse.' : D === 0 ? 'Il discriminante è zero: le due soluzioni coincidono.' : 'Il discriminante è negativo: nessun numero reale risolve l’equazione.',
		part: 'discriminante'
	});
	if (D < 0) return result(roots, steps);

	const minusB = -B;
	const twoA = 2 * A;
	const negB = B < 0 ? `-(${intTex(B)})` : `-${intTex(B)}`;
	if (D === 0) {
		const lines = ['x_1 = x_2 = \\frac{-b}{2a}', `= \\frac{${negB}}{2 \\cdot ${intTex(A)}}`, `= \\frac{${intTex(minusB)}}{${intTex(twoA)}}`, `= \\hl{${roots[0].toLatex()}}`];
		steps.push({ say: 'Applica la formula risolutiva senza la radice.', math: lines, then: 'Con il discriminante zero, la radice vale zero.', part: 'soluzioni' });
		return result(roots, steps);
	}
	steps.push({
		say: 'Sostituisci i coefficienti nella formula risolutiva.',
		math: ['x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}', `= \\frac{${negB} \\pm \\sqrt{${intTex(D)}}}{2 \\cdot ${intTex(A)}}`, `= \\frac{${intTex(minusB)} \\pm \\sqrt{${intTex(D)}}}{${intTex(twoA)}}`],
		part: 'soluzioni'
	});
	const { k, r } = sqrtParts(D);
	if (r === 1) {
		steps.push({ say: 'Calcola la radice quadrata.', math: [`\\sqrt{${intTex(D)}} = \\hl{${intTex(k)}}`], part: 'soluzioni' });
		const one = (name: string, sign: '-' | '+', root: Surd) => {
			const top = sign === '-' ? minusB - k : minusB + k;
			const lines = [`${name} = \\frac{${intTex(minusB)} ${sign} ${intTex(k)}}{${intTex(twoA)}}`, `= \\frac{${intTex(top)}}{${intTex(twoA)}}`, `= \\hl{${root.toLatex()}}`];
			return lines;
		};
		steps.push({ say: 'Calcola la prima soluzione, con il segno meno.', math: one('x_1', '-', roots[0]), part: 'soluzioni' });
		steps.push({ say: 'Calcola la seconda soluzione, con il segno più.', math: one('x_2', '+', roots[1]), part: 'soluzioni' });
		return result(roots, steps);
	}
	if (k > 1) {
		steps.push({
			say: 'Semplifica la radice.',
			math: [`\\sqrt{${intTex(D)}} = \\sqrt{${intTex(k * k)} \\cdot ${intTex(r)}}`, `= \\hl{${rootTex(k, r)}}`],
			then: `Il fattore $${intTex(k * k)}$ è il quadrato di $${intTex(k)}$: esce dalla radice come $${intTex(k)}$.`,
			part: 'soluzioni'
		});
		steps.push({ say: 'Scrivi la radice semplificata nella formula.', math: [`x_{1,2} = ${pmLatex(minusB, k, r, twoA, true)}`], part: 'soluzioni' });
	}
	const h = gcd(gcd(Math.abs(minusB), k), twoA);
	if (h > 1) {
		const [a1, k1, d1] = [minusB / h, k / h, twoA / h];
		const numer = `${intTex(a1)} \\pm ${rootTex(k1, r)}`;
		steps.push({
			say: `Raccogli $${intTex(h)}$ al numeratore e semplifica.`,
			math: [`x_{1,2} = \\frac{\\hl{${intTex(h)}}\\left(${numer}\\right)}{${d1 === 1 ? `\\hl{${intTex(h)}}` : `\\hl{${intTex(h)}} \\cdot ${intTex(d1)}`}}`, `= ${pmLatex(a1, k1, r, d1)}`],
			part: 'soluzioni'
		});
	}
	steps.push({ say: 'Separa le due soluzioni.', math: [`x_1 = ${roots[0].toLatex()}`, `x_2 = ${roots[1].toLatex()}`], then: 'La prima con il segno meno, la seconda con il più.', part: 'soluzioni' });
	return result(roots, steps);
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
		return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

function fromCoefficients({ a = '', b = '', c = '' }: QuadraticInput): Outcome {
	const [A, B, C] = [a, b, c].map(parseConstant);
	if (A === null) return fail('Scrivi il coefficiente a, il numero davanti a x². Per esempio 2.');
	if (A === 'error' || B === 'error' || C === 'error') return fail('Scrivi i coefficienti come numeri: interi, decimali con la virgola o frazioni. Per esempio 1,5 oppure 2/3.');
	if (A.isZero()) return fail("Con a = 0 manca il termine con x² e l'equazione è di primo grado. Scrivi un numero diverso da zero, per esempio 1, oppure risolvila come equazione di primo grado.");
	const p: Poly = [C ?? ZERO, B ?? ZERO, A];
	return solveNormal(p, [{ say: "Scrivi l'equazione in forma normale.", math: [eqLatex(p)], part: 'forma' }]);
}

function fromEquation(text: string): Outcome {
	const parsed = parseEquation(text);
	if (!parsed.ok) return fail(parsed.error.replaceAll('2x + 3 = 7', 'x^2 - 5x + 6 = 0'));
	const { eq } = parsed;
	if (eq.degree > 2) return fail(`È un'equazione di grado ${eq.degree}: qui si risolvono solo le equazioni di secondo grado, per esempio x^2 - 5x + 6 = 0.`);
	if (eq.degree < 2) return fail("Dopo aver portato tutto a primo membro il termine con x² non c'è: l'equazione non è di secondo grado. Risolvila con il calcolatore delle equazioni di primo grado.");

	const steps: PartStep[] = [];
	const expansion = expansionStep(eq);
	if (expansion) steps.push({ ...expansion, part: 'forma' });
	const left: Mono[] = expandSide(eq.lhs);
	const right: Mono[] = expandSide(eq.rhs);
	const P = polySub(eq.L, eq.R);
	const moved: Mono[] = [...left, ...right.map((t) => ({ c: t.c.neg(), deg: t.deg, hl: true }))];
	if (right.length) steps.push({ say: 'Porta tutti i termini a sinistra.', math: [`${monoLatex(moved)} = 0`], then: "Un termine che passa dall'altra parte dell'uguale cambia segno.", part: 'forma' });
	const reduced = polyToLatex(P);
	if (monoLatex(moved.map(({ c, deg }) => ({ c, deg }))) !== reduced) {
		const count = (d: number) => moved.filter((t) => t.deg === d).length;
		const monos: Mono[] = [2, 1, 0].filter((d) => !(P[d] ?? ZERO).isZero()).map((d) => ({ c: P[d], deg: d, hl: count(d) > 1 }));
		steps.push({ say: 'Somma i termini simili e ordinali dal grado più alto.', math: [`${monoLatex(monos)} = 0`], then: 'È la forma normale $ax^2 + bx + c = 0$.', part: 'forma' });
	}
	return solveNormal(P, steps);
}
