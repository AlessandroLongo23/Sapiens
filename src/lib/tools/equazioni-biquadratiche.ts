import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { Surd } from '@/lib/exercises/v2/surd';
import { polyDegree, polySub, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { parseConstant, parseEquation } from './equazione';
import { equazioneSecondoGrado, quadraticRoots } from './equazioni-secondo-grado';
import { trim } from './polinomi';
import { numText } from './intervalli';
import { fail, type Outcome, type ResultRow, type Step } from './types';

/**
 * Biquadratic equations, a x⁴ + b x² + c = 0, as in the lesson on trinomial equations (grado-superiore/
 * equazioni-binomie-trinomie): the substitution t = x² gives a second-degree equation in t, solved by the
 * second-degree tool (its steps with t in place of x); then each solution in t goes back to x² = t, a negative one
 * gives nothing, zero gives x = 0, a positive one gives x = ±√t. Roots of an irrational t are left as a double
 * radical, with their decimal value.
 */

export interface BiquadInput {
	mode: 'coef' | 'eq';
	a?: string;
	b?: string;
	c?: string;
	eq?: string;
}

const EXAMPLE = 'x^4 - 5x^2 + 4 = 0';
const TOO_BIG = 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';

type Part = 'forma' | 't' | 'x';
const PART_NAMES: Record<Part, string> = { forma: 'La sostituzione', t: "L'equazione in t", x: 'Il ritorno alla x' };
type PartStep = Step & { part: Part };

/** a x⁴ + b x² + c as a polynomial in x. */
const quartic = (a: Rational, b: Rational, c: Rational): Poly => [c, ZERO, b, ZERO, a];

/** Every x of a formula as t, but not the x inside a command (\approx) or a word. */
const toT = (s: string) => s.replace(/(?<![a-zA-Z\\])x(?![a-zA-Z])/g, 't');
/** The same inside the formulas of a sentence only. */
const toTText = (s: string) => s.replace(/\$[^$]+\$/g, (m) => toT(m));

/** A solution in x: exact LaTeX, its value, and text for copying. */
interface Root {
	tex: string;
	value: number;
	text: string;
	exact: boolean;
}

/** √t for t > 0: a simplified radical when t is rational, a double radical otherwise. The last line highlighted. */
function sqrtOf(t: Surd): { root: Root; lines: string[] } {
	if (t.isRational()) {
		const r = t.toRational();
		const s = Surd.of(0, 1, r.num * r.den, r.den);
		const first = `\\sqrt{${r.toLatex()}}`;
		const root = { tex: s.toLatex(), value: s.value(), text: numText(s), exact: s.isRational() };
		if (s.toLatex() === first) return { root, lines: [`x = \\pm \\hl{${first}}`] };
		return { root, lines: [`x = \\pm ${first}`, `x = \\pm \\hl{${s.toLatex()}}`] };
	}
	const tex = `\\sqrt{${t.toLatex()}}`;
	return { root: { tex, value: Math.sqrt(t.value()), text: `√(${numText(t)})`, exact: false }, lines: [`x = \\pm \\hl{${tex}}`] };
}

export function equazioneBiquadratica(input: BiquadInput): Outcome {
	try {
		return input.mode === 'eq' ? fromEquation(input.eq ?? '') : fromCoefficients(input);
	} catch {
		return fail(TOO_BIG);
	}
}

/** The degree of what was typed, for the page to link the second-degree tool; null when it does not parse. */
export function biquadDegree(input: BiquadInput): number | null {
	if (input.mode !== 'eq') {
		const a = parseConstant(input.a ?? '');
		return a && a !== 'error' ? (a.isZero() ? 2 : 4) : null;
	}
	const parsed = parseEquation(input.eq ?? '');
	return parsed.ok ? parsed.eq.degree : null;
}

function fromCoefficients({ a = '', b = '', c = '' }: BiquadInput): Outcome {
	const [A, B, C] = [a, b, c].map(parseConstant);
	if (A === null) return fail('Scrivi il coefficiente a, il numero davanti a x⁴. Per esempio 1.');
	if (A === 'error' || B === 'error' || C === 'error') return fail('Scrivi i coefficienti come numeri: interi, decimali con la virgola o frazioni. Per esempio 1,5 oppure 2/3.');
	if (A.isZero()) return fail("Con a = 0 manca il termine con x⁴: l'equazione è di secondo grado. Scrivi un numero diverso da zero, oppure risolvila come equazione di secondo grado.");
	return solve(quartic(A, B ?? ZERO, C ?? ZERO), []);
}

function fromEquation(text: string): Outcome {
	const parsed = parseEquation(text);
	if (!parsed.ok) return fail(parsed.error.replaceAll('2x + 3 = 7', EXAMPLE));
	const { eq } = parsed;
	const P = trim(polySub(eq.L, eq.R));
	const deg = polyDegree(P);
	if (deg === 2) return fail("Dopo aver portato tutto a primo membro manca il termine con x⁴: l'equazione è di secondo grado. Risolvila con il calcolatore delle equazioni di secondo grado.");
	if (deg !== 4) return fail(`È un'equazione di grado ${Math.max(deg, 0)}: qui si risolvono le equazioni biquadratiche, di quarto grado con solo x⁴, x² e il termine noto. Per esempio ${EXAMPLE}.`);
	if (!P[1].isZero() || !P[3].isZero()) return fail(`Nell'equazione c'è un termine con x o con x³: non è biquadratica. Una biquadratica ha solo x⁴, x² e il termine noto, per esempio ${EXAMPLE}.`);
	const steps: PartStep[] = [];
	const normal = `${polyToLatex(P)} = 0`;
	if (eq.latex.replace(/\s/g, '') !== normal.replace(/\s/g, '')) steps.push({ say: 'Porta tutto a primo membro e ordina i termini.', math: [eq.latex, normal], part: 'forma' });
	return solve(P, steps);
}

function solve(P: Poly, steps: PartStep[]): Outcome {
	const [c, , b, , a] = P;
	const Pt: Poly = [c, b, a];
	const xLatex = `${polyToLatex(P)} = 0`;
	steps.push({
		say: 'Sostituisci $x^2$ con una nuova incognita, $t$.',
		math: ['t = x^2 \\qquad x^4 = t^2', xLatex, `\\hl{${polyToLatex(Pt, 't')}} = 0`],
		then: "È un'equazione di secondo grado in $t$.",
		part: 'forma'
	});

	// The equation in t, with the second-degree tool: its first step (the normal form) is the line above.
	const eqOut = equazioneSecondoGrado({ mode: 'coef', a: a.toString(), b: b.toString(), c: c.toString() });
	if (!eqOut.ok) return fail(TOO_BIG);
	for (const s of eqOut.steps.slice(1)) {
		const { group: _g, ...rest } = s;
		void _g;
		steps.push({
			...rest,
			say: toTText(rest.say),
			math: rest.math?.map(toT),
			table: rest.table && { head: rest.table.head?.map(toTText), rows: rest.table.rows.map((r) => r.map(toTText)) },
			then: rest.then && toTText(rest.then),
			part: 't'
		});
	}
	const ts = quadraticRoots(Pt);
	if (!ts.length) {
		steps.push({ say: 'Torna alla $x$.', then: 'Nessun valore di $t$, quindi nessun valore di $x$: l’equazione non ha soluzioni reali.', part: 'x' });
		return finish([], steps);
	}

	// Back to x: x² = t for each t.
	const roots: Root[] = [];
	ts.forEach((t, i) => {
		// A rational t is said by its value; an irrational one by its name, from the step that separates them.
		const name = t.isRational() ? t.toLatex() : `t_${i + 1}`;
		const say = `Risolvi $x^2 = ${name}$.`;
		const eq = t.isRational() ? [] : [`x^2 = ${t.toLatex()}`];
		if (t.value() < 0) {
			steps.push({ say, math: [`\\hl{x^2 = ${t.toLatex()}}`], then: 'Un quadrato non è mai negativo: questa equazione non ha soluzioni e si scarta.', part: 'x' });
			return;
		}
		if (t.isZero()) {
			roots.push({ tex: '0', value: 0, text: '0', exact: true });
			steps.push({ say, math: ['x = \\hl{0}'], then: 'Solo zero al quadrato dà zero.', part: 'x' });
			return;
		}
		const { root, lines } = sqrtOf(t);
		roots.push(root, { tex: `-${root.tex}`, value: -root.value, text: `−${root.text}`, exact: root.exact });
		steps.push({
			say: `Risolvi $x^2 = ${name}$ con la radice quadrata.`,
			math: [...eq, ...lines],
			then: t.isRational() ? 'Due soluzioni opposte, con il più e con il meno.' : 'Il radicale doppio resta così: due soluzioni opposte.',
			part: 'x'
		});
	});
	roots.sort((u, v) => u.value - v.value);
	return finish(roots, steps);
}

function finish(roots: Root[], steps: PartStep[]): Outcome {
	const on = steps.length > 5;
	const plain = steps.map(({ part, ...step }, i) => (on && (i === 0 || steps[i - 1].part !== part) ? { group: PART_NAMES[part], ...step } : step));
	if (!roots.length)
		return {
			ok: true,
			rows: [
				{ label: 'Soluzioni', value: 'Nessuna soluzione reale' },
				{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
			],
			copy: 'Nessuna soluzione reale',
			steps: plain
		};
	const approx = (r: Root) => {
		const v = Math.round(Math.abs(r.value) * 1e4) / 1e4;
		const [int, frac = ''] = v.toFixed(4).replace(/0+$/, '').split('.');
		return `${r.value < 0 ? '-' : ''}${int}${frac ? `{,}${frac}` : ''}`;
	};
	const names = ['Prima', 'Seconda', 'Terza', 'Quarta'];
	const rows: ResultRow[] = roots.map((r, i) => ({
		label: roots.length === 1 ? 'Soluzione' : `${names[i]} soluzione`,
		value: r.exact ? `$x_${i + 1} = ${r.tex}$` : `$x_${i + 1} = ${r.tex}$ $\\approx ${approx(r)}$`
	}));
	if (roots.length === 1) rows[0].value = rows[0].value.replace('x_1', 'x');
	rows.push({ label: 'Insieme delle soluzioni', value: `$S = \\left\\{ ${roots.map((r) => r.tex).join(',\\ ')} \\right\\}$` });
	return { ok: true, rows, copy: roots.map((r) => `x = ${r.text.replace(/−/g, '-')}`).join('; '), steps: plain };
}
