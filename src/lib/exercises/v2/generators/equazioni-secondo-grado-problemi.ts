/**
 * Problemi di secondo grado. Spec: specs/exercises/equazioni-secondo-grado-problemi.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/79-equazioni-secondo-grado-problemi.md):
 * numbers with one acceptable solution; one, two or no answers (sum and product, "interi", the stone thrown
 * up); areas of rectangles, triangles and rhombi; irrational sides and impossible rectangles; frames and
 * Pythagoras (a binomial to expand); motion and work (a fractional equation); two equal percentage changes
 * (solved as a pura).
 *
 * Every story is built backwards: the acceptable value first, then the data of the text. `params` hold the
 * data as the text states them, so the checker (scripts/exercises/checkers/equazioni_secondo_grado_problemi.py)
 * rebuilds the equation from the story, solves it and applies the limitations of the unknown on its own.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, exactSqrt, gcd, q } from '../rational';
import { Surd, sqrtParts } from '../surd';
import { assembleChoice, shuffle, textBlock } from '../insiemi';

export const ID = 'equazioni-secondo-grado-problemi';

export const STORIES: Record<number, readonly string[]> = {
	1: ['consecutivi', 'quadrato', 'quadrati'],
	2: ['somma-prodotto', 'somma-prodotto', 'consecutivi-interi', 'quadrato-intero', 'sasso'],
	3: ['rettangolo', 'triangolo', 'rombo'],
	4: ['triangolo-irr', 'rettangolo-irr', 'perimetro-area', 'perimetro-area'],
	5: ['cornice', 'pitagora'],
	6: ['moto-veloce', 'moto-lento', 'lavoro'],
	7: ['aumenti', 'sconti'],
};

const TIMES: Record<number, string> = { 2: 'doppio', 3: 'triplo', 4: 'quadruplo', 5: 'quintuplo' };
const IMPOSSIBLE = 'impossibile';

const t = (s: string) => `\\text{${s}}`;
const sq = (u: string) => `$\\text{${u}}^2$`;
/** A number in the prose: negative numbers in math mode, so the minus is a minus. */
const pn = (n: number) => (n < 0 ? `$${n}$` : String(n));
/** "+ 4" or "- 4" after a term. */
const sgn = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** (-3) for a negative factor, 3 otherwise. */
const par = (n: number | string) => (String(n).startsWith('-') ? `(${n})` : String(n));

/** a v^2 + b v + c with integer coefficients, zero terms dropped. */
export function poly2(a: number, b: number, c: number, v = 'x'): string {
	const parts: string[] = [];
	const push = (k: number, body: string) => {
		if (k === 0) return;
		const abs = Math.abs(k);
		const s = body && abs === 1 ? body : `${abs}${body}`;
		parts.push(parts.length ? `${k < 0 ? '-' : '+'} ${s}` : k < 0 ? `-${s}` : s);
	};
	push(a, `${v}^2`);
	push(b, v);
	push(c, '');
	return parts.length ? parts.join(' ') : '0';
}

/** A finite decimal with the decimal comma (10{,}5), otherwise a fraction. */
export function dec(r: Rational): string {
	let a = r.abs();
	let k = 0;
	while (!a.isInteger()) {
		a = a.mul(q(10));
		if (++k > 6) return r.toLatex();
	}
	const s = String(a.num).padStart(k + 1, '0');
	const body = k === 0 ? s : `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
	return (r.sign() < 0 ? '-' : '') + body;
}

/** A root as the lesson writes it: \sqrt{13} - 1 (the radical first when the rational part is negative). */
export function sx(s: Surd): string {
	if (s.isRational()) return s.toRational().toLatex();
	const k = Math.abs(s.b);
	const root = `${k === 1 ? '' : k}\\sqrt{${s.r}}`;
	let numer: string;
	if (s.a === 0) numer = root;
	else if (s.b > 0 && s.a < 0) numer = `${root} - ${-s.a}`;
	else numer = `${s.a} ${s.b < 0 ? '-' : '+'} ${root}`;
	const neg = s.a === 0 && s.b < 0 ? '-' : '';
	return s.d === 1 ? `${neg}${numer}` : `${neg}\\frac{${numer}}{${s.d}}`;
}

const S = (r: Rational | number) => Surd.rational(typeof r === 'number' ? q(r) : r);
const sortS = (xs: Surd[]) => [...xs].sort((a, b) => a.compare(b));

/** Real roots of A v^2 + B v + C = 0, ascending. */
export function roots(A: number, B: number, C: number): Surd[] {
	const D = B * B - 4 * A * C;
	if (D < 0) return [];
	if (D === 0) return [Surd.of(-B, 0, 1, 2 * A)];
	return sortS([Surd.of(-B, -1, D, 2 * A), Surd.of(-B, 1, D, 2 * A)]);
}

/** The equation `poly = 0`, then divided by the common factor. Returns the normal form. */
function finish(work: string[], a: number, b: number, c: number, v: string): [number, number, number] {
	if (a < 0) [a, b, c] = [-a, -b, -c];
	const line = `${poly2(a, b, c, v)} = 0`;
	if (work[work.length - 1] !== line) work.push(line);
	const g = gcd(gcd(a, b), c);
	if (g > 1) {
		[a, b, c] = [a / g, b / g, c / g];
		work.push(`${t('Dividi i due membri per ')} ${g}${t(': ')} ${poly2(a, b, c, v)} = 0`);
	}
	return [a, b, c];
}

/** The formula, reduced (Delta/4) when b is even as in the lesson; last line x_1 = …, x_2 = …. */
function solveSteps(v: string, A: number, B: number, C: number): string[] {
	const out: string[] = [];
	const rs = roots(A, B, C);
	const half = B % 2 === 0;
	const D = half ? (B / 2) ** 2 - A * C : B * B - 4 * A * C;
	const dl = half ? '\\frac{\\Delta}{4}' : '\\Delta';
	out.push(`${dl} = ${half ? (B / 2) ** 2 : B * B} ${sgn(half ? -A * C : -4 * A * C)} = ${D}`);
	if (D < 0) {
		out.push(`${dl} < 0${t(": l'equazione non ha soluzioni reali")}`);
		return out;
	}
	const { k, r } = sqrtParts(D);
	const root = r === 1 ? String(k) : `\\sqrt{${D}}`;
	const m = half ? -B / 2 : -B;
	const den = half ? A : 2 * A;
	const numer = `${m === 0 ? '' : `${m} `}\\pm ${root}`;
	out.push(`${v}_{1,2} = ${den === 1 ? numer : `\\frac{${numer}}{${den}}`}`);
	if (r !== 1 && k > 1) out.push(`${t('Semplifica il radicale: ')} \\sqrt{${D}} = ${k}\\sqrt{${r}}`);
	if (rs.length === 1) out.push(`${v}_1 = ${v}_2 = ${sx(rs[0])}`);
	else out.push(`${v}_1 = ${sx(rs[0])}, \\quad ${v}_2 = ${sx(rs[1])}`);
	return out;
}

interface Problem {
	story: string;
	data: Record<string, string | number>;
	prose: string;
	/** What the unknown is, with its limitations. */
	unknown: string;
	equation: string;
	/** Conditions of existence, for a fractional equation. */
	ce?: string;
	/** From the equation to the normal form. */
	work: string[];
	/** Own solving lines instead of the formula (level 7, solved as a pura). */
	solve?: string[];
	v: string;
	normal: [number, number, number];
	/** Which solutions are acceptable, and why the others are rejected. */
	verdict: string[];
	toAnswer?: string[];
	check?: string;
	solution: string;
	/** Number levels: the number asked, the numbers of the text, wrong answers from real mistakes. */
	answer?: Rational;
	given?: number[];
	mistakes?: Rational[];
	/** The rejected solution is a plausible option (the question asks the unknown itself). */
	allowNegative?: boolean;
	/** Percent answers (level 7). */
	percent?: boolean;
	/** Choice levels: the correct option and the distractors. */
	correct?: ChoiceOption;
	distractors?: ChoiceOption[];
	case?: string;
}

// ---------------------------------------------------------------------------
// Options

const impossibleOpt: ChoiceOption = { latex: t('Il problema è impossibile'), values: [IMPOSSIBLE] };
const pairKey = (a: Surd, b: Surd) => sortS([a, b]).map(String).join(';');
function pairOpt(a: Surd, b: Surd): ChoiceOption {
	const [x, y] = sortS([a, b]);
	return { latex: `${sx(x)} ${t(' e ')} ${sx(y)}`, values: [pairKey(x, y)] };
}
function twoPairsOpt(p1: [Surd, Surd], p2: [Surd, Surd]): ChoiceOption {
	const [a, b] = [sortS(p1), sortS(p2)].sort((u, w) => u[0].compare(w[0]));
	return {
		latex: `\\begin{gathered} ${sx(b[0])} ${t(' e ')} ${sx(b[1])} \\\\ ${t('oppure ')} ${sx(a[0])} ${t(' e ')} ${sx(a[1])} \\end{gathered}`,
		values: [pairKey(a[0], a[1]), pairKey(b[0], b[1])],
	};
}
function numbersOpt(xs: Surd[]): ChoiceOption {
	const s = sortS(xs);
	return { latex: s.map(sx).join(` ${t(' oppure ')} `), values: s.map(String) };
}
function timesOpt(xs: Surd[]): ChoiceOption {
	const s = sortS(xs);
	const one = (x: Surd) => (x.isRational() ? dec(x.toRational()) : sx(x));
	if (s.length === 1) return { latex: `${t('dopo ')} ${one(s[0])} ${t(' s')}`, values: [String(s[0])] };
	const wide = s.some((x) => !x.isRational());
	const latex = wide
		? `\\begin{gathered} ${t('dopo ')} ${one(s[0])} ${t(' s')} \\\\ ${t('e dopo ')} ${one(s[1])} ${t(' s')} \\end{gathered}`
		: `${t('dopo ')} ${one(s[0])} ${t(' s e dopo ')} ${one(s[1])} ${t(' s')}`;
	return { latex, values: s.map(String) };
}
function numOpt(r: Rational, percent = false): ChoiceOption {
	return { latex: `${dec(r)}${percent ? '\\%' : ''}`, values: [r.toString()] };
}

// ---------------------------------------------------------------------------
// Level 1: numbers, one acceptable solution

function consecutivi(rng: Rng): Problem {
	const kind = rng.pick(['naturali', 'naturali', 'pari', 'dispari'] as const);
	const step = kind === 'naturali' ? 1 : 2;
	for (;;) {
		const x = rng.int(3, 30);
		if (kind === 'pari' && x % 2 !== 0) continue;
		if (kind === 'dispari' && x % 2 === 0) continue;
		const y = x + step;
		const P = x * y;
		const asked = rng.pick(['piccolo', 'grande'] as const);
		const ans = asked === 'piccolo' ? x : y;
		const noun = kind === 'naturali' ? 'due numeri naturali consecutivi' : `due numeri ${kind} consecutivi positivi`;
		const work: string[] = [];
		const normal = finish(work, 1, step, -P, 'x');
		const lim = kind === 'naturali' ? `${t('con ')} x ${t(' naturale')}` : `${t(`con ${kind === 'pari' ? 'x pari' : 'x dispari'} e `)} x > 0`;
		return {
			story: 'consecutivi',
			data: { kind, P, asked },
			prose: `Il prodotto di ${noun} è ${P}. Qual è il più ${asked} dei due numeri?`,
			unknown: `${t('Chiama ')} x ${t(' il più piccolo, ')} ${lim}${t(': il successivo è ')} x + ${step}`,
			equation: `x(x + ${step}) = ${P}`,
			work,
			v: 'x',
			normal,
			verdict: [`${-y} ${t(kind === 'naturali' ? ' non è un numero naturale e si scarta; ' : ' non è positivo e si scarta; ')} ${x} ${t(' è accettabile')}`],
			toAnswer: asked === 'grande' ? [`${t('Il più grande è ')} x + ${step} = ${y}`] : undefined,
			check: `${x} \\cdot ${y} = ${P}`,
			solution: `${t(`I numeri sono ${x} e ${y}: il più ${asked} è `)} ${ans}`,
			answer: q(ans),
			given: [P],
			mistakes: [q(-y), q(asked === 'piccolo' ? y : x), q(asked === 'grande' ? -x : -y + step), q(Math.floor(Math.sqrt(P)) + 1), q(Math.floor(P / 2))],
			allowNegative: true,
		};
	}
}

function quadrato(rng: Rng): Problem {
	const form = rng.pick(['supera', 'aggiungi'] as const);
	for (;;) {
		const k = rng.int(2, 5);
		if (form === 'supera') {
			const s = rng.int(1, 12);
			const r = s + k;
			const c = r * s;
			if (r === k || r === c) continue;
			const work: string[] = [];
			const normal = finish(work, 1, -k, -c, 'x');
			return {
				story: 'quadrato',
				data: { form, k, c, kind: 'naturale' },
				prose: `Il quadrato di un numero naturale supera il suo ${TIMES[k]} di ${c}. Qual è il numero?`,
				unknown: `${t('Chiama ')} x ${t(' il numero, con ')} x ${t(' naturale')}`,
				equation: `x^2 = ${k}x + ${c}`,
				work,
				v: 'x',
				normal,
				verdict: [`${-s} ${t(' non è un numero naturale e si scarta; ')} ${r} ${t(' è accettabile')}`],
				check: `${r}^2 = ${r * r} = ${k} \\cdot ${r} + ${c}`,
				solution: `${t('Il numero è ')} ${r}`,
				answer: q(r),
				given: [k, c],
				// the rejected solution; the sign of b read wrong (x^2 + kx - c = 0); the square taken as the double
				mistakes: [q(-s), q(s), q(c, k), q(r + 1)],
				allowNegative: true,
			};
		}
		const r = rng.int(2, 15);
		const c = r * (r + k);
		if (r === k) continue;
		const work: string[] = [];
		const normal = finish(work, 1, k, -c, 'x');
		return {
			story: 'quadrato',
			data: { form, k, c, kind: 'naturale' },
			prose: `Se al quadrato di un numero naturale aggiungi il suo ${TIMES[k]}, ottieni ${c}. Qual è il numero?`,
			unknown: `${t('Chiama ')} x ${t(' il numero, con ')} x ${t(' naturale')}`,
			equation: `x^2 + ${k}x = ${c}`,
			work,
			v: 'x',
			normal,
			verdict: [`${-(r + k)} ${t(' non è un numero naturale e si scarta; ')} ${r} ${t(' è accettabile')}`],
			check: `${r}^2 + ${k} \\cdot ${r} = ${r * r} + ${k * r} = ${c}`,
			solution: `${t('Il numero è ')} ${r}`,
			answer: q(r),
			given: [k, c],
			mistakes: [q(-(r + k)), q(r + k), q(c, k + 1), q(r + 1)],
			allowNegative: true,
		};
	}
}

function quadrati(rng: Rng): Problem {
	const x = rng.int(2, 20);
	const y = x + 1;
	const Ssum = x * x + y * y;
	const asked = rng.pick(['piccolo', 'grande'] as const);
	const ans = asked === 'piccolo' ? x : y;
	const work = [`x^2 + x^2 + 2x + 1 = ${Ssum}`];
	const normal = finish(work, 2, 2, 1 - Ssum, 'x');
	return {
		story: 'quadrati',
		data: { S: Ssum, asked },
		prose: `La somma dei quadrati di due numeri naturali consecutivi è ${Ssum}. Qual è il più ${asked} dei due numeri?`,
		unknown: `${t('Chiama ')} x ${t(' il più piccolo, con ')} x ${t(' naturale: il successivo è ')} x + 1`,
		equation: `x^2 + (x + 1)^2 = ${Ssum}`,
		work,
		v: 'x',
		normal,
		verdict: [`${-y} ${t(' non è un numero naturale e si scarta; ')} ${x} ${t(' è accettabile')}`],
		toAnswer: asked === 'grande' ? [`${t('Il più grande è ')} x + 1 = ${y}`] : undefined,
		check: `${x}^2 + ${y}^2 = ${x * x} + ${y * y} = ${Ssum}`,
		solution: `${t(`I numeri sono ${x} e ${y}: il più ${asked} è `)} ${ans}`,
		answer: q(ans),
		given: [Ssum],
		// the rejected solution; the other number; the square of the binomial without the double product
		mistakes: [q(-y), q(asked === 'piccolo' ? y : x), q(Math.round(Math.sqrt((Ssum - 1) / 2))), q(Math.floor(Ssum / 2))],
		allowNegative: true,
	};
}

// ---------------------------------------------------------------------------
// Level 2: one, two or no answers

function sommaProdotto(rng: Rng): Problem {
	const impossible = rng.int(1, 10) <= 4;
	for (;;) {
		let s: number, p: number;
		let m = 0, n = 0;
		if (impossible) {
			s = rng.int(4, 20);
			p = Math.floor((s * s) / 4) + rng.int(1, 12);
		} else {
			n = rng.int(2, 20);
			m = rng.int(-9, n - 1);
			if (m === 0 || m + n <= 0) continue;
			s = m + n;
			p = m * n;
		}
		if (p === 0 || s === p) continue;
		const work = [`${s}x - x^2 = ${p}`];
		const normal = finish(work, 1, -s, p, 'x');
		const base = {
			story: 'somma-prodotto',
			data: { s, p },
			prose: `Trova due numeri che hanno somma ${s} e prodotto ${pn(p)}.`,
			unknown: `${t('Chiama ')} x ${t(" uno dei due numeri: l'altro è ")} ${s} - x${t('. Il testo non mette limitazioni')}`,
			equation: `x(${s} - x) = ${p}`,
			work,
			v: 'x',
			normal,
		};
		if (impossible) {
			// Delta read with the wrong sign; the two halves of the sum; two numbers with the right product
			const neg = 4 * p - s * s;
			const flipped = [Surd.of(s, -1, neg, 2), Surd.of(s, 1, neg, 2)];
			const halves = s % 2 === 0 ? [S(s / 2), S(s / 2)] : [S((s - 1) / 2), S((s + 1) / 2)];
			const divs: [number, number][] = [];
			for (let d = 1; d * d <= p; d++) if (p % d === 0) divs.push([d, p / d]);
			const dp = divs[divs.length - 1];
			return {
				...base,
				verdict: [t('Nessuna coppia di numeri reali ha questa somma e questo prodotto')],
				solution: t('Il problema è impossibile'),
				correct: impossibleOpt,
				distractors: shuffle(rng, [pairOpt(flipped[0], flipped[1]), pairOpt(halves[0], halves[1]), pairOpt(S(dp[0]), S(dp[1]))]),
				case: 'nessuna',
			};
		}
		// the signs of both numbers; the right sum with the wrong product; the right product with the wrong sum
		const wrongSum: ChoiceOption[] = [];
		for (let d = 1; d * d <= Math.abs(p); d++) {
			if (p % d !== 0) continue;
			for (const [a, b] of [
				[d, p / d],
				[-d, -p / d],
			]) {
				if (a + b !== s && a + b !== -s) wrongSum.push(pairOpt(S(a), S(b)));
			}
		}
		const ds = [pairOpt(S(-n), S(-m)), pairOpt(S(m - 1), S(n + 1)), ...shuffle(rng, wrongSum), impossibleOpt, pairOpt(S(m + 1), S(n - 1))];
		return {
			...base,
			verdict: [
				`${t('Se ')} x = ${m}${t(", l'altro è ")} ${s} - ${par(m)} = ${n}${t('; se ')} x = ${n}${t(", l'altro è ")} ${m}${t(': le due soluzioni danno la stessa coppia')}`,
			],
			check: `${m} + ${n} = ${s}, \\quad ${m} \\cdot ${n} = ${p}`,
			solution: `${t('I numeri sono ')} ${m} ${t(' e ')} ${n}`,
			correct: pairOpt(S(m), S(n)),
			distractors: ds,
			case: 'una',
		};
	}
}

function consecutiviInteri(rng: Rng): Problem {
	const x = rng.int(3, 30);
	const y = x + 1;
	const P = x * y;
	const work: string[] = [];
	const normal = finish(work, 1, 1, -P, 'x');
	const pos: [Surd, Surd] = [S(x), S(y)];
	const neg: [Surd, Surd] = [S(-y), S(-x)];
	return {
		story: 'consecutivi-interi',
		data: { P },
		prose: `Il prodotto di due numeri interi consecutivi è ${P}. Quali sono i due numeri?`,
		unknown: `${t('Chiama ')} x ${t(' il più piccolo, con ')} x ${t(' intero: il successivo è ')} x + 1`,
		equation: `x(x + 1) = ${P}`,
		work,
		v: 'x',
		normal,
		verdict: [
			`${t('Tutte e due le soluzioni sono numeri interi e sono accettabili: con ')} x = ${x} ${t(` i numeri sono ${x} e ${y}, con `)} x = ${-y} ${t(' sono ')} ${-y} ${t(' e ')} ${-x}`,
		],
		check: `${x} \\cdot ${y} = ${P}, \\quad (${-y}) \\cdot (${-x}) = ${P}`,
		solution: `${t(`I numeri sono ${x} e ${y}, oppure `)} ${-y} ${t(' e ')} ${-x}`,
		correct: twoPairsOpt(pos, neg),
		// only the natural pair (the limitation of example 1 read into the text); the two solutions taken as the pair
		distractors: [pairOpt(pos[0], pos[1]), ...shuffle(rng, [pairOpt(S(-y), S(x)), pairOpt(neg[0], neg[1]), impossibleOpt])],
		case: 'due',
	};
}

function quadratoIntero(rng: Rng): Problem {
	const form = rng.pick(['supera', 'aggiungi'] as const);
	for (;;) {
		const k = rng.int(2, 5);
		const r = rng.int(2, 14);
		// supera: x^2 = kx + c, solutions r and -(r - k); aggiungi: x^2 + kx = c, solutions r and -(r + k)
		const other = form === 'supera' ? r - k : r + k;
		if (other <= 0 || other === r) continue;
		const c = r * other;
		const work: string[] = [];
		const normal = finish(work, 1, form === 'supera' ? -k : k, -c, 'x');
		const sols = [S(-other), S(r)];
		const prose =
			form === 'supera'
				? `Il quadrato di un numero intero supera il suo ${TIMES[k]} di ${c}. Quale può essere il numero?`
				: `Se al quadrato di un numero intero aggiungi il suo ${TIMES[k]}, ottieni ${c}. Quale può essere il numero?`;
		return {
			story: 'quadrato-intero',
			data: { form, k, c, kind: 'intero' },
			prose,
			unknown: `${t('Chiama ')} x ${t(' il numero, con ')} x ${t(' intero')}`,
			equation: form === 'supera' ? `x^2 = ${k}x + ${c}` : `x^2 + ${k}x = ${c}`,
			work,
			v: 'x',
			normal,
			verdict: [`${t('Tutte e due le soluzioni sono numeri interi e sono accettabili')}`],
			check:
				form === 'supera'
					? `${r}^2 = ${k} \\cdot ${r} + ${c}, \\quad (${-other})^2 = ${k} \\cdot (${-other}) + ${c}`
					: `${r}^2 + ${k} \\cdot ${r} = ${c}, \\quad (${-other})^2 + ${k} \\cdot (${-other}) = ${c}`,
			solution: `${t('Il numero è ')} ${r} ${t(' oppure ')} ${-other}`,
			correct: numbersOpt(sols),
			// only the natural solution; only the negative one; the signs of b swapped
			distractors: [numbersOpt([S(r)]), ...shuffle(rng, [numbersOpt([S(-r), S(other)]), numbersOpt([S(-other)]), impossibleOpt])],
			case: 'due',
		};
	}
}

const THROWN = [
	{ what: 'Un sasso lanciato verso l\'alto', it: 'il sasso' },
	{ what: 'Un pallone calciato verso l\'alto', it: 'il pallone' },
	{ what: 'Un razzo giocattolo lanciato verso l\'alto', it: 'il razzo' },
];

function sasso(rng: Rng): Problem {
	const impossible = rng.int(1, 2) === 1;
	const ci = rng.int(0, THROWN.length - 1);
	const ctx = THROWN[ci];
	for (;;) {
		let Ssum: number, H: number, t1 = 0, t2 = 0;
		if (impossible) {
			Ssum = rng.int(2, 8);
			const top = (5 * Ssum * Ssum) / 4;
			H = 5 * (Math.floor(top / 5) + rng.int(1, 5));
			if (H <= top) continue;
		} else {
			t1 = rng.int(1, 5);
			t2 = rng.int(t1 + 1, 7);
			Ssum = t1 + t2;
			H = 5 * t1 * t2;
		}
		const v = 5 * Ssum;
		const work = [`5t^2 - ${v}t + ${H} = 0`];
		const normal = finish(work, 5, -v, H, 't');
		const base = {
			story: 'sasso',
			data: { context: ci, v, H },
			prose: `${ctx.what}, dopo $t$ secondi, si trova a un'altezza di $${v}t - 5t^2$ metri. Dopo quanti secondi si trova a ${H} m di altezza?`,
			unknown: `${t('Chiama ')} t ${t(' il tempo, in secondi, con ')} t > 0`,
			equation: `${v}t - 5t^2 = ${H}`,
			work,
			v: 't',
			normal,
		};
		if (impossible) {
			const neg = 4 * (H / 5) - Ssum * Ssum;
			return {
				...base,
				verdict: [t(`${ctx.it[0].toUpperCase()}${ctx.it.slice(1)} non arriva mai a ${H} m`)],
				solution: t('Il problema è impossibile'),
				correct: impossibleOpt,
				// Delta read with the wrong sign; the top of the flight; back on the ground; the t^2 term forgotten
				distractors: [...(Surd.of(Ssum, -1, neg, 2).value() > 0 ? [timesOpt([Surd.of(Ssum, -1, neg, 2), Surd.of(Ssum, 1, neg, 2)])] : []), timesOpt([S(q(Ssum, 2))]), timesOpt([S(Ssum)]), ...(q(10 * H, v).isInteger() ? [timesOpt([S(q(H, v))])] : []), timesOpt([S(q(Ssum - 1, 2)), S(q(Ssum + 1, 2))])],
				case: 'nessuna',
			};
		}
		return {
			...base,
			verdict: [`${t('Sono positive tutte e due, e hanno tutte e due un significato: dopo ')} ${t1} ${t(` s ${ctx.it} sale, dopo `)} ${t2} ${t(' s ridiscende')}`],
			check: `${v} \\cdot ${t1} - 5 \\cdot ${t1 * t1} = ${H}, \\quad ${v} \\cdot ${t2} - 5 \\cdot ${t2 * t2} = ${H}`,
			solution: `${t('Dopo ')} ${t1} ${t(' s e dopo ')} ${t2} ${t(' s')}`,
			correct: timesOpt([S(t1), S(t2)]),
			// only on the way up; only on the way down; the two solutions added
			distractors: shuffle(rng, [timesOpt([S(t1)]), timesOpt([S(t2)]), impossibleOpt]),
			case: 'due',
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: areas

const RECTS = [
	{ noun: 'un rettangolo', of: 'del rettangolo', u: 'cm' },
	{ noun: "un'aiuola rettangolare", of: "dell'aiuola", u: 'm' },
	{ noun: 'un foglio rettangolare', of: 'del foglio', u: 'cm' },
	{ noun: 'un campo da gioco rettangolare', of: 'del campo', u: 'm' },
];

function rettangolo(rng: Rng): Problem {
	const ci = rng.int(0, RECTS.length - 1);
	const ctx = RECTS[ci];
	for (;;) {
		const rel = rng.pick(['piu', 'doppio'] as const);
		const h = rng.int(2, 20);
		const d = rng.int(1, 12);
		const b = rel === 'piu' ? h + d : 2 * h + d;
		const A = h * b;
		if (A > 500) continue;
		const asked = rng.pick(['perimetro', 'base', 'altezza'] as const);
		const P = 2 * (h + b);
		const ans = asked === 'perimetro' ? P : asked === 'base' ? b : h;
		const u = ctx.u;
		const bx = rel === 'piu' ? `x + ${d}` : `2x + ${d}`;
		const work = [rel === 'piu' ? `x^2 + ${d}x = ${A}` : `2x^2 + ${d}x = ${A}`];
		const normal = finish(work, rel === 'piu' ? 1 : 2, d, -A, 'x');
		const rej = roots(...normal)[0];
		const question = asked === 'perimetro' ? `Calcola il perimetro ${ctx.of}, in ${u}.` : `Quanto misura ${asked === 'base' ? 'la base' : "l'altezza"} ${ctx.of}, in ${u}?`;
		const relText = rel === 'piu' ? `la base supera l'altezza di ${d} ${u}` : `la base supera di ${d} ${u} il doppio dell'altezza`;
		return {
			story: 'rettangolo',
			data: { context: ci, rel, d, A, asked },
			prose: `In ${ctx.noun} ${relText}, e l'area è ${A} ${sq(u)}. ${question}`,
			unknown: `${t('Chiama ')} x ${t(` l'altezza, in ${u}, con `)} x > 0${t(': la base è ')} ${bx}`,
			equation: `x(${bx}) = ${A}`,
			work,
			v: 'x',
			normal,
			verdict: [`${sx(rej)} ${t(" si scarta, perché un'altezza non può essere negativa; ")} ${h} ${t(' è accettabile')}`],
			toAnswer: [
				`${t("L'altezza è ")} ${h} ${t(` ${u} e la base `)} ${bx} = ${b} ${t(` ${u}`)}`,
				...(asked === 'perimetro' ? [`${t('Il perimetro è ')} 2 \\cdot (${b} + ${h}) = ${P} ${t(` ${u}`)}`] : []),
			],
			check: `${b} \\cdot ${h} = ${A}`,
			solution: t(`${asked === 'perimetro' ? 'Il perimetro è' : asked === 'base' ? 'La base misura' : "L'altezza misura"} ${ans} ${u}`),
			answer: q(ans),
			given: [d, A],
			// stopping at x; the other side; the semiperimeter; the rejected solution
			mistakes:
				asked === 'perimetro'
					? [q(h), q(b), q(h + b), q(4 * b), q(A, 2)]
					: asked === 'base'
						? [q(h), q(P), q(h + d), q(b + d)]
						: [rej.toRational(), q(b), rej.toRational().abs(), q(h + d)],
			allowNegative: asked === 'altezza',
		};
	}
}

const TRIS = [
	{ story: 'triangolo', noun: 'un triangolo', small: "l'altezza", big: 'la base', u: 'cm' },
	{ story: 'triangolo', noun: 'una vela triangolare', small: "l'altezza", big: 'la base', u: 'm' },
	{ story: 'rombo', noun: 'un rombo', small: 'la diagonale minore', big: 'la diagonale maggiore', u: 'cm' },
	{ story: 'rombo', noun: 'un aquilone a forma di rombo', small: 'la diagonale minore', big: 'la diagonale maggiore', u: 'cm' },
];

function triangolo(rng: Rng, story: 'triangolo' | 'rombo'): Problem {
	const ids = TRIS.map((c, i) => (c.story === story ? i : -1)).filter((i) => i >= 0);
	const ci = rng.pick(ids);
	const ctx = TRIS[ci];
	for (;;) {
		const h = rng.int(2, 24);
		const d = rng.int(1, 12);
		const b = h + d;
		if ((h * b) % 2 !== 0) continue;
		const A = (h * b) / 2;
		if (A > 300) continue;
		const asked = rng.pick(['piccolo', 'grande'] as const);
		const ans = asked === 'piccolo' ? h : b;
		const u = ctx.u;
		const rombo = story === 'rombo';
		const relText = rombo ? `la diagonale maggiore supera la minore di ${d} ${u}` : `la base supera l'altezza di ${d} ${u}`;
		const askedText = asked === 'piccolo' ? ctx.small : ctx.big;
		const work = [`x(x + ${d}) = ${2 * A}`];
		const normal = finish(work, 1, d, -2 * A, 'x');
		const noHalf = roots(1, d, -A);
		const noHalfAns = noHalf.length === 2 && noHalf[1].isRational() ? [noHalf[1].toRational().add(q(asked === 'grande' ? d : 0))] : [];
		return {
			story,
			data: { context: ci, d, A, asked },
			prose: `In ${ctx.noun} ${relText}, e l'area è ${A} ${sq(u)}. Quanto misura ${askedText}, in ${u}?`,
			unknown: rombo
				? `${t('Chiama ')} x ${t(` la diagonale minore, in ${u}, con `)} x > 0${t(': la maggiore è ')} x + ${d}`
				: `${t('Chiama ')} x ${t(` l'altezza, in ${u}, con `)} x > 0${t(': la base è ')} x + ${d}`,
			equation: `\\frac{x(x + ${d})}{2} = ${A}`,
			work,
			v: 'x',
			normal,
			verdict: [`${-b} ${t(rombo ? ' si scarta, perché una diagonale non può essere negativa; ' : " si scarta, perché un'altezza non può essere negativa; ")} ${h} ${t(' è accettabile')}`],
			toAnswer: asked === 'grande' ? [`${t(`${ctx.big[0].toUpperCase()}${ctx.big.slice(1)} è `)} x + ${d} = ${b}`] : undefined,
			check: `\\frac{${b} \\cdot ${h}}{2} = ${A}`,
			solution: t(`${askedText[0].toUpperCase()}${askedText.slice(1)} misura ${ans} ${u}`),
			answer: q(ans),
			given: [d, A],
			// the area without the division by 2; the other side; the rejected solution
			mistakes: [...noHalfAns, q(asked === 'piccolo' ? b : h), ...(asked === 'piccolo' ? [q(-b)] : [q(h + 2 * d)]), q(asked === 'piccolo' ? h + 1 : b + 2)],
			allowNegative: asked === 'piccolo',
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: irrational sides, impossible rectangles

function sideIrr(rng: Rng, story: 'triangolo-irr' | 'rettangolo-irr'): Problem {
	const tri = story === 'triangolo-irr';
	for (;;) {
		const d = rng.pick([2, 4, 6]);
		const A = rng.int(2, tri ? 25 : 40);
		const h = d / 2;
		const D4 = h * h + (tri ? 2 * A : A);
		if (D4 > 60 || exactSqrt(q(D4))) continue;
		const asked = rng.pick(['piccolo', 'grande'] as const);
		const u = rng.pick(['cm', 'm']);
		const work = tri ? [`x(x + ${d}) = ${2 * A}`] : [`x^2 + ${d}x = ${A}`];
		const normal = finish(work, 1, d, tri ? -2 * A : -A, 'x');
		const [rej, x] = roots(...normal);
		const other = x.add(q(d));
		const ans = asked === 'piccolo' ? x : other;
		const shift = (s: Surd) => (asked === 'grande' ? s.add(q(d)) : s);
		// the triangle without /2 (or the rectangle with it); b instead of b/2 in the reduced formula
		const wrongArea = roots(1, d, tri ? -A : -2 * A)[1];
		const wrongHalf = Surd.of(-d, 1, D4, 1);
		const askedText = asked === 'piccolo' ? "l'altezza" : 'la base';
		const prose = tri
			? `In un triangolo la base supera l'altezza di ${d} ${u}, e l'area è ${A} ${sq(u)}. Quanto misura ${askedText}, in ${u}?`
			: `In un rettangolo la base supera l'altezza di ${d} ${u}, e l'area è ${A} ${sq(u)}. Quanto misura ${askedText}, in ${u}?`;
		return {
			story,
			data: { d, A, asked, u },
			prose,
			unknown: `${t('Chiama ')} x ${t(` l'altezza, in ${u}, con `)} x > 0${t(': la base è ')} x + ${d}`,
			equation: tri ? `\\frac{x(x + ${d})}{2} = ${A}` : `x(x + ${d}) = ${A}`,
			work,
			v: 'x',
			normal,
			verdict: [`x_1 = ${sx(rej)} ${t(" è negativa e si scarta; ")} x_2 = ${sx(x)} ${t(' è positiva e accettabile, anche se irrazionale')}`],
			toAnswer: asked === 'grande' ? [`${t('La base è ')} x + ${d} = ${sx(other)}`] : undefined,
			check: `${tri ? '\\frac{' : ''}(${sx(other)})(${sx(x)})${tri ? '}{2}' : ''} = ${tri ? `\\frac{${D4} - ${h * h}}{2}` : `${D4} - ${h * h}`} = ${A}`,
			solution: `${t(`${asked === 'piccolo' ? "L'altezza" : 'La base'} misura `)} ${sx(ans)} ${t(` ${u}`)}`,
			correct: numbersOpt([ans]),
			distractors: [numbersOpt([shift(rej)]), numbersOpt([asked === 'piccolo' ? other : x]), ...shuffle(rng, [numbersOpt([shift(wrongArea)]), numbersOpt([shift(wrongHalf)]), impossibleOpt])],
			case: 'irrazionale',
		};
	}
}

function perimetroArea(rng: Rng): Problem {
	const impossible = rng.int(1, 10) <= 6;
	for (;;) {
		const s = rng.int(5, 16);
		const top = Math.floor((s * s) / 4);
		const A = impossible ? top + rng.int(1, 12) : rng.int(Math.max(2, top - 30), top - 1);
		const D = s * s - 4 * A;
		if (!impossible && (D <= 0 || exactSqrt(q(D)))) continue;
		if (A === 2 * s) continue;
		const u = rng.pick(['cm', 'm']);
		const work = [`${s}x - x^2 = ${A}`];
		const normal = finish(work, 1, -s, A, 'x');
		const base = {
			story: 'perimetro-area',
			data: { P: 2 * s, A, u },
			prose: `Un rettangolo ha il perimetro di ${2 * s} ${u} e l'area di ${A} ${sq(u)}. Quanto sono lunghi i lati?`,
			unknown: `${t('Il semiperimetro è ')} ${s}${t(`: chiama `)} x ${t(` la base, in ${u}, con `)} 0 < x < ${s}${t(": l'altezza è ")} ${s} - x`,
			equation: `x(${s} - x) = ${A}`,
			work,
			v: 'x',
			normal,
		};
		if (impossible) {
			const neg = 4 * A - s * s;
			const divs: [number, number][] = [];
			for (let d = 1; d * d <= A; d++) if (A % d === 0) divs.push([d, A / d]);
			const dp = divs[divs.length - 1];
			const halves = s % 2 === 0 ? [S(s / 2), S(s / 2)] : [S((s - 1) / 2), S((s + 1) / 2)];
			return {
				...base,
				verdict: [t(`Nessun rettangolo ha perimetro ${2 * s} ${u} e area ${A} ${u}`) + '^2'],
				solution: t('Il problema è impossibile'),
				correct: impossibleOpt,
				// Delta read with the wrong sign; the square with that perimeter; two sides with the right area
				distractors: [pairOpt(Surd.of(s, -1, neg, 2), Surd.of(s, 1, neg, 2)), ...shuffle(rng, [pairOpt(halves[0], halves[1]), pairOpt(S(dp[0]), S(dp[1]))])],
				case: 'impossibile',
			};
		}
		const [x1, x2] = roots(1, -s, A);
		const plus = s * s + 4 * A;
		const wrong2 = s % 2 === 0 ? [Surd.of(s / 2, -1, D, 1), Surd.of(s / 2, 1, D, 1)] : [Surd.of(s, -1, D, 1), Surd.of(s, 1, D, 1)];
		return {
			...base,
			verdict: [`${t('Tutte e due le soluzioni sono positive e minori di ')} ${s}${t(": se la base è una, l'altezza è l'altra, quindi il rettangolo è uno solo")}`],
			check: `x_1 + x_2 = ${s}, \\quad x_1 \\cdot x_2 = \\frac{${s * s} - ${D}}{4} = ${A}`,
			solution: `${t('I lati misurano ')} ${sx(x1)} ${t(' e ')} ${sx(x2)} ${t(` ${u}`)}`,
			correct: pairOpt(x1, x2),
			// Delta = b^2 + 4ac; the whole Delta in the reduced formula (or no division by 2a); impossible
			distractors: [pairOpt(Surd.of(s, -1, plus, 2), Surd.of(s, 1, plus, 2)), pairOpt(wrong2[0], wrong2[1]), impossibleOpt],
			case: 'irrazionale',
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: frames and Pythagoras

const FRAMES = [
	{ intro: (a: number, b: number) => `Una foto di ${a} cm per ${b} cm è circondata da una cornice di larghezza costante.`, area: "L'area della cornice", total: "L'area della foto con la cornice", width: 'Quanto è larga la cornice, in cm?', perim: 'Quanto misura il perimetro esterno della cornice, in cm?', u: 'cm', a: [10, 30], b: 40, x: [1, 6], of: 'la cornice' },
	{ intro: (a: number, b: number) => `Un giardino rettangolare di ${a} m per ${b} m è circondato da un vialetto di larghezza costante.`, area: "L'area del vialetto", total: "L'area del giardino con il vialetto", width: 'Quanto è largo il vialetto, in m?', perim: 'Quanto misura il perimetro esterno del vialetto, in m?', u: 'm', a: [6, 30], b: 40, x: [1, 4], of: 'il vialetto' },
	{ intro: (a: number, b: number) => `Una piscina rettangolare di ${a} m per ${b} m è circondata da un bordo pavimentato di larghezza costante.`, area: "L'area del bordo", total: "L'area della piscina con il bordo", width: 'Quanto è largo il bordo, in m?', perim: 'Quanto misura il perimetro esterno del bordo, in m?', u: 'm', a: [4, 20], b: 30, x: [1, 3], of: 'il bordo' },
];

/** Photos a × b whose frame of integer width has the same area as the photo (example 5: 20 × 30, x = 5). */
const SAME_AREA: [number, number, number][] = [];
for (let a = 4; a <= 40; a++)
	for (let b = a + 1; b <= 60; b++)
		for (let x = 1; x <= 12; x++) if (4 * x * x + 2 * (a + b) * x === a * b) SAME_AREA.push([a, b, x]);

function cornice(rng: Rng): Problem {
	const ci = rng.int(0, FRAMES.length - 1);
	const ctx = FRAMES[ci];
	for (;;) {
		const mode = rng.pick(ci === 0 ? (['cornice', 'totale', 'uguale'] as const) : (['cornice', 'totale'] as const));
		let a: number, b: number, x: number;
		if (mode === 'uguale') {
			[a, b, x] = rng.pick(SAME_AREA);
		} else {
			a = rng.int(ctx.a[0], ctx.a[1]);
			b = rng.int(a + 1, ctx.b);
			x = rng.int(ctx.x[0], ctx.x[1]);
		}
		const C = 4 * x * x + 2 * (a + b) * x;
		const T = (a + 2 * x) * (b + 2 * x);
		const asked = rng.int(1, 10) <= 7 ? 'larghezza' : 'perimetro';
		const Pout = 2 * (a + b + 4 * x);
		const ans = asked === 'larghezza' ? x : Pout;
		const u = ctx.u;
		const sentence = mode === 'cornice' ? `${ctx.area} è ${C} ${sq(u)}.` : mode === 'totale' ? `${ctx.total} è ${T} ${sq(u)}.` : `${ctx.area} è uguale all'area della foto.`;
		const prose = `${ctx.intro(a, b)} ${sentence} ${asked === 'larghezza' ? ctx.width : ctx.perim}`;
		const lhs = `(${a} + 2x)(${b} + 2x)`;
		const equation = mode === 'totale' ? `${lhs} = ${T}` : `${lhs} - ${a * b} = ${mode === 'cornice' ? C : a * b}`;
		const expanded = `${a * b} + ${2 * a}x + ${2 * b}x + 4x^2`;
		const work = mode === 'totale' ? [`${expanded} = ${T}`] : [`${expanded} - ${a * b} = ${C}`, `4x^2 + ${2 * (a + b)}x = ${C}`];
		const normal = finish(work, 4, 2 * (a + b), -C, 'x');
		const [rej] = roots(...normal);
		const given = mode === 'cornice' ? [a, b, C] : mode === 'totale' ? [a, b, T] : [a, b];
		// the frame on one side only; the corners forgotten; the rejected solution
		const oneSide = roots(1, a + b, -C).filter((r) => r.isRational() && r.value() > 0);
		const toAns = (r: Rational) => (asked === 'larghezza' ? r : r.mul(q(8)).add(q(2 * (a + b))));
		const mistakes = [
			...oneSide.map((r) => toAns(r.toRational())),
			toAns(q(C, 2 * (a + b))),
			...(asked === 'larghezza' ? [rej.toRational()] : [q(2 * (a + b + 2 * x)), q(2 * (a + b))]),
			toAns(q(x + 1)),
		];
		return {
			story: 'cornice',
			data: { context: ci, mode, a, b, ...(mode === 'cornice' ? { C } : mode === 'totale' ? { T } : {}), asked },
			prose,
			unknown: `${t('Chiama ')} x ${t(` la larghezza, in ${u}, con `)} x > 0${t(': i lati esterni sono ')} ${a} + 2x ${t(' e ')} ${b} + 2x`,
			equation,
			work,
			v: 'x',
			normal,
			verdict: [`${sx(rej)} ${t(' si scarta, perché una larghezza non può essere negativa; ')} ${x} ${t(' è accettabile')}`],
			toAnswer: asked === 'perimetro' ? [`${t('I lati esterni sono ')} ${a + 2 * x} ${t(' e ')} ${b + 2 * x}${t(': il perimetro è ')} 2 \\cdot (${a + 2 * x} + ${b + 2 * x}) = ${Pout}`] : undefined,
			check: `${a + 2 * x} \\cdot ${b + 2 * x} ${mode === 'totale' ? `= ${T}` : `- ${a * b} = ${T} - ${a * b} = ${C}`}`,
			solution: t(asked === 'larghezza' ? `La larghezza è ${x} ${u}` : `Il perimetro esterno è ${Pout} ${u}`),
			answer: q(ans),
			given,
			mistakes,
			allowNegative: asked === 'larghezza',
		};
	}
}

/** Right triangles with integer sides, legs a < b, hypotenuse up to 41 (c^2 up to 1681). */
const TRIPLES: [number, number, number][] = [];
for (let m = 2; m <= 8; m++)
	for (let n = 1; n < m; n++) {
		if (gcd(m, n) !== 1 || (m - n) % 2 === 0) continue;
		for (let k = 1; k * (m * m + n * n) <= 41; k++) {
			const x = k * (m * m - n * n), y = 2 * k * m * n;
			TRIPLES.push([Math.min(x, y), Math.max(x, y), k * (m * m + n * n)]);
		}
	}

function pitagora(rng: Rng): Problem {
	const shape = rng.pick(['triangolo', 'rettangolo'] as const);
	for (;;) {
		const [a, b, c] = rng.pick(TRIPLES);
		const d = b - a;
		const asked = rng.pick(['piccolo', 'grande', 'perimetro', 'area'] as const);
		const tri = shape === 'triangolo';
		const P = tri ? a + b + c : 2 * (a + b);
		const area = tri ? (a * b) / 2 : a * b;
		const ans = asked === 'piccolo' ? a : asked === 'grande' ? b : asked === 'perimetro' ? P : area;
		if ([d, c].includes(ans)) continue;
		const work = [`x^2 + x^2 + ${2 * d}x + ${d * d} = ${c * c}`];
		const normal = finish(work, 2, 2 * d, d * d - c * c, 'x');
		const small = tri ? 'il cateto minore' : "l'altezza";
		const big = tri ? 'il cateto maggiore' : 'la base';
		const question = { piccolo: `Quanto misura ${small}?`, grande: `Quanto misura ${big}?`, perimetro: `Calcola il perimetro ${tri ? 'del triangolo' : 'del rettangolo'}.`, area: `Calcola l'area ${tri ? 'del triangolo' : 'del rettangolo'}.` }[asked];
		const prose = tri
			? `In un triangolo rettangolo un cateto supera l'altro di ${d} cm, e l'ipotenusa misura ${c} cm. ${question}`
			: `In un rettangolo la base supera l'altezza di ${d} cm, e la diagonale misura ${c} cm. ${question}`;
		const noSq = exactSqrt(q(c * c - d * d, 2));
		const toAns = (x: number) => (asked === 'piccolo' ? x : asked === 'grande' ? x + d : asked === 'perimetro' ? (tri ? 2 * x + d + c : 2 * (2 * x + d)) : tri ? (x * (x + d)) / 2 : x * (x + d));
		const mistakes: Rational[] = [
			...(noSq && noSq.isInteger() ? [q(toAns(noSq.num))] : []),
			...(asked === 'piccolo' ? [q(-b), q(b)] : asked === 'grande' ? [q(a), q(c - d)] : asked === 'perimetro' ? [q(a + b), q(tri ? 2 * (a + b) : a + b + c)] : [q(tri ? a * b : a * b, tri ? 1 : 2), q(tri ? a * c : 2 * a * c, 2)]),
			q(toAns(c - d)),
		];
		return {
			story: 'pitagora',
			data: { shape, d, c, asked },
			prose,
			unknown: `${t('Chiama ')} x ${t(tri ? ' il cateto minore, in cm: il maggiore è ' : " l'altezza, in cm: la base è ")} x + ${d}${t(', e deve essere minore di ')} ${c}${t(', quindi ')} 0 < x < ${c - d}`,
			equation: `x^2 + (x + ${d})^2 = ${c * c}`,
			work,
			v: 'x',
			normal,
			verdict: [`${-b} ${t(' si scarta; ')} ${a} ${t(' sta tra 0 e ')} ${c - d}${t(', quindi è accettabile')}`],
			toAnswer: [
				`${t(tri ? 'I cateti sono ' : "L'altezza è ")} ${a} ${t(tri ? ' e ' : ' e la base ')} ${b} ${t(' cm')}`,
				...(asked === 'perimetro' ? [`${t('Il perimetro è ')} ${tri ? `${a} + ${b} + ${c}` : `2 \\cdot (${a} + ${b})`} = ${P} ${t(' cm')}`] : []),
				...(asked === 'area' ? [`${t("L'area è ")} ${tri ? `\\frac{${a} \\cdot ${b}}{2}` : `${a} \\cdot ${b}`} = ${area} ${t(' cm')}^2`] : []),
			],
			check: `${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}`,
			solution: `${t(asked === 'piccolo' ? `${small[0].toUpperCase()}${small.slice(1)} misura ${a} cm` : asked === 'grande' ? `${big[0].toUpperCase()}${big.slice(1)} misura ${b} cm` : asked === 'perimetro' ? `Il perimetro è ${P} cm` : `L'area è ${area} `)}${asked === 'area' ? `\\text{cm}^2` : ''}`,
			answer: q(ans),
			given: [d, c, c * c],
			mistakes,
			allowNegative: asked === 'piccolo',
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: motion and work, a fractional equation

const MOVERS = [
	{ who: 'Un ciclista', v: [10, 30], k: [2, 3, 4, 5, 6, 8, 10] },
	{ who: "Un'auto", v: [40, 100], k: [5, 10, 15, 20] },
	{ who: 'Un treno', v: [60, 150], k: [10, 20, 30] },
	{ who: 'Un camion', v: [40, 80], k: [5, 10, 20] },
];
const hours = (h: number) => (h === 1 ? "un'ora" : `${h} ore`);

function moto(rng: Rng, dir: 'veloce' | 'lento'): Problem {
	const ci = rng.int(0, MOVERS.length - 1);
	const ctx = MOVERS[ci];
	for (;;) {
		const v = rng.int(ctx.v[0], ctx.v[1]);
		const k = rng.pick(ctx.k);
		const h = rng.pick([1, 1, 2]);
		const w = dir === 'veloce' ? v + k : v - k;
		if (w <= 0) continue;
		const num = h * v * w;
		if (num % k !== 0) continue;
		const D = num / k;
		if (D < 10 || D > 600 || D === v) continue;
		const hc = h === 1 ? '' : String(h);
		const work =
			dir === 'veloce'
				? [`${D}(v + ${k}) - ${D}v = ${hc}v(v + ${k})`, `${D * k} = ${h === 1 ? 'v^2' : `${h}v^2`} + ${h * k}v`]
				: [`${D}v - ${D}(v - ${k}) = ${hc}v(v - ${k})`, `${D * k} = ${h === 1 ? 'v^2' : `${h}v^2`} - ${h * k}v`];
		const normal = finish(work, h, dir === 'veloce' ? h * k : -h * k, -D * k, 'v');
		const [rej] = roots(...normal);
		const tv = q(D, v), tw = q(D, w);
		return {
			story: `moto-${dir}`,
			data: { context: ci, D, k, h },
			prose: `${ctx.who} percorre ${D} km a velocità costante. Se andasse ${k} km/h più ${dir === 'veloce' ? 'veloce' : 'piano'}, ci metterebbe ${hours(h)} ${dir === 'veloce' ? 'di meno' : 'in più'}. A che velocità va, in km/h?`,
			unknown: `${t('Chiama ')} v ${t(' la velocità, in km/h, con ')} v > ${dir === 'veloce' ? 0 : k}${t(': il tempo è lo spazio diviso la velocità')}`,
			equation: dir === 'veloce' ? `\\frac{${D}}{v} - \\frac{${D}}{v + ${k}} = ${h}` : `\\frac{${D}}{v - ${k}} - \\frac{${D}}{v} = ${h}`,
			ce:
				dir === 'veloce'
					? `${t('C.E.: ')} v \\neq 0 ${t(' e ')} v \\neq ${-k}${t(', già escluse dalla limitazione. Moltiplica i due membri per ')} v(v + ${k})`
					: `${t('C.E.: ')} v \\neq 0 ${t(' e ')} v \\neq ${k}${t(', già escluse dalla limitazione. Moltiplica i due membri per ')} v(v - ${k})`,
			work,
			v: 'v',
			normal,
			verdict: [`${sx(rej)} ${t(' si scarta, perché una velocità non può essere negativa; ')} ${v} ${t(' è accettabile')}`],
			check: `\\frac{${D}}{${v}} = ${dec(tv)}${t(' ore, ')} \\frac{${D}}{${w}} = ${dec(tw)}${t(' ore: ')} ${dir === 'veloce' ? `${dec(tv)} - ${dec(tw)}` : `${dec(tw)} - ${dec(tv)}`} = ${h}`,
			solution: t(`Va a ${v} km/h`),
			answer: q(v),
			given: [D, k, h],
			// the rejected solution; the other speed; the time instead of the speed
			mistakes: [rej.toRational(), q(w), ...(tv.isInteger() ? [tv] : []), q(D, h), q(v + (dir === 'veloce' ? -k : k))],
			allowNegative: true,
		};
	}
}

const WORKERS = [
	{ intro: (T: number) => `Due rubinetti, aperti insieme, riempiono una vasca in ${T} ore.`, rest: (k: number) => `Da solo, il secondo ci mette ${k} ore più del primo.`, ask: (w: string) => `Quante ore ci mette il ${w} da solo?`, what: 'il tempo del primo rubinetto da solo' },
	{ intro: (T: number) => `Due operai, lavorando insieme, dipingono una recinzione in ${T} ore.`, rest: (k: number) => `Da solo, il secondo ci mette ${k} ore più del primo.`, ask: (w: string) => `Quante ore ci mette il ${w} da solo?`, what: 'il tempo del primo operaio da solo' },
	{ intro: (T: number) => `Due stampanti, insieme, stampano un lotto di volantini in ${T} ore.`, rest: (k: number) => `Da sola, la seconda ci mette ${k} ore più della prima.`, ask: (w: string) => `Quante ore ci mette la ${w === 'primo' ? 'prima' : 'seconda'} da sola?`, what: 'il tempo della prima stampante da sola' },
];

function lavoro(rng: Rng): Problem {
	const ci = rng.int(0, WORKERS.length - 1);
	const ctx = WORKERS[ci];
	for (;;) {
		const x = rng.int(2, 40);
		const k = rng.int(1, 30);
		if ((x * (x + k)) % (2 * x + k) !== 0) continue;
		const T = (x * (x + k)) / (2 * x + k);
		if (k === 2 * T || T < 2) continue;
		const asked = rng.pick(['primo', 'secondo'] as const);
		const ans = asked === 'primo' ? x : x + k;
		if (ans === T || ans === k) continue;
		const work = [`${T}(x + ${k}) + ${T}x = x(x + ${k})`, `${2 * T}x + ${T * k} = x^2 + ${k}x`];
		const normal = finish(work, 1, k - 2 * T, -T * k, 'x');
		const [rej] = roots(...normal);
		const sumWrong = q(T - k, 2);
		return {
			story: 'lavoro',
			data: { context: ci, T, k, asked },
			prose: `${ctx.intro(T)} ${ctx.rest(k)} ${ctx.ask(asked)}`,
			unknown: `${t('Chiama ')} x ${t(` ${ctx.what}, in ore, con `)} x > 0${t(ci === 2 ? ': la seconda ci mette ' : ': il secondo ci mette ')} x + ${k}${t('. In un\'ora fanno ')} \\frac{1}{x} ${t(' e ')} \\frac{1}{x + ${k}} ${t(' del lavoro, insieme ')} \\frac{1}{${T}}`,
			equation: `\\frac{1}{x} + \\frac{1}{x + ${k}} = \\frac{1}{${T}}`,
			ce: `${t('C.E.: ')} x \\neq 0 ${t(' e ')} x \\neq ${-k}${t('. Moltiplica i due membri per ')} ${T}x(x + ${k})`,
			work,
			v: 'x',
			normal,
			verdict: [`${sx(rej)} ${t(' si scarta, perché un tempo non può essere negativo; ')} ${x} ${t(' è accettabile')}`],
			toAnswer: asked === 'secondo' ? [`${t(ci === 2 ? 'La seconda ci mette ' : 'Il secondo ci mette ')} x + ${k} = ${x + k} ${t(' ore')}`] : undefined,
			check: `\\frac{1}{${x}} + \\frac{1}{${x + k}} = \\frac{${x + k} + ${x}}{${x * (x + k)}} = \\frac{1}{${T}}`,
			solution: t(`${asked === 'primo' ? (ci === 2 ? 'La prima' : 'Il primo') : ci === 2 ? 'La seconda' : 'Il secondo'} ci mette ${ans} ore`),
			answer: q(ans),
			given: [T, k],
			// the times added (x + (x + k) = T); the other one; twice the time together; the rejected solution
			mistakes: [...(sumWrong.sign() > 0 ? [sumWrong.add(q(asked === 'secondo' ? k : 0))] : []), q(asked === 'primo' ? x + k : x), q(2 * T), rej.toRational().add(q(asked === 'secondo' ? k : 0))],
			allowNegative: true,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: two equal percentage changes, solved as a pura

const RISES = [
	{ intro: (P0: number) => `Il prezzo di una bici era ${P0} euro.`, change: (P2: number) => `È aumentato due volte della stessa percentuale, e ora è ${P2} euro.`, ask: 'Di che percentuale è aumentato ogni volta?', min: 100, max: 2000, step: 10 },
	{ intro: (P0: number) => `L'abbonamento annuale a una palestra costava ${P0} euro.`, change: (P2: number) => `In due anni è aumentato ogni anno della stessa percentuale, e ora costa ${P2} euro.`, ask: 'Di che percentuale è aumentato ogni anno?', min: 100, max: 900, step: 4 },
	{ intro: (P0: number) => `Un paese aveva ${P0} abitanti.`, change: (P2: number) => `In due anni gli abitanti sono aumentati ogni anno della stessa percentuale, e ora sono ${P2}.`, ask: 'Di che percentuale sono aumentati ogni anno?', min: 400, max: 20000, step: 100 },
];
const DROPS = [
	{ intro: (P0: number) => `Un televisore costava ${P0} euro.`, change: (P2: number) => `È stato scontato due volte della stessa percentuale, e ora costa ${P2} euro.`, ask: 'Di che percentuale è stato scontato ogni volta?', min: 100, max: 2000, step: 10 },
	{ intro: (P0: number) => `Un'auto nuova valeva ${P0} euro.`, change: (P2: number) => `In due anni il suo valore è calato ogni anno della stessa percentuale, e ora vale ${P2} euro.`, ask: 'Di che percentuale è calato ogni anno?', min: 8000, max: 40000, step: 500 },
];

function percentuali(rng: Rng, up: boolean): Problem {
	const ctxs = up ? RISES : DROPS;
	const ci = rng.int(0, ctxs.length - 1);
	const ctx = ctxs[ci];
	for (;;) {
		const x = rng.pick(up ? [5, 10, 15, 20, 25, 30, 40, 50] : [5, 10, 15, 20, 25, 30, 40, 50]);
		const P0 = ctx.min + ctx.step * rng.int(0, Math.floor((ctx.max - ctx.min) / ctx.step));
		const f = up ? 100 + x : 100 - x;
		if ((P0 * f * f) % 10000 !== 0) continue;
		const P2 = (P0 * f * f) / 10000;
		if (P2 === P0) continue;
		const r = q(f, 100);
		const s = up ? '+' : '-';
		const rejected = up ? -200 - x : 200 - x;
		// normal form of P0 (1 ± x/100)^2 = P2 times 10000/P0: (100 ± x)^2 = f^2
		const normal: [number, number, number] = up ? [1, 200, 10000 - f * f] : [1, -200, 10000 - f * f];
		const total = up ? q(P2 - P0, P0).mul(q(100)) : q(P0 - P2, P0).mul(q(100));
		const plusX = up ? r.sub(q(1)) : q(1).sub(r);
		const minusX = up ? r.neg().sub(q(1)) : q(1).add(r);
		const solve = [
			`\\left(1 ${s} \\frac{x}{100}\\right)^2 = \\frac{${P2}}{${P0}} = ${dec(r.mul(r))}`,
			`1 ${s} \\frac{x}{100} = \\pm ${dec(r)}`,
			`${t('Con il più: ')} \\frac{x}{100} = ${dec(plusX)}${t(', quindi ')} x = ${x}`,
			`${t('Con il meno: ')} \\frac{x}{100} = ${dec(minusX)}${t(', quindi ')} x = ${rejected}`,
		];
		const unit = ci === 2 && up ? '' : ' euro';
		return {
			story: up ? 'aumenti' : 'sconti',
			data: { context: ci, P0, P2 },
			prose: `${ctx.intro(P0)} ${ctx.change(P2)} ${ctx.ask}`,
			unknown: `${t('Chiama ')} x ${t(up ? " la percentuale di aumento, con " : ' la percentuale di calo, con ')} ${up ? 'x > 0' : '0 < x < 100'}${t(': ogni volta il valore si moltiplica per ')} 1 ${s} \\frac{x}{100}`,
			equation: `${P0}\\left(1 ${s} \\frac{x}{100}\\right)^2 = ${P2}`,
			work: [],
			solve,
			v: 'x',
			normal,
			verdict: [`${rejected} ${t(up ? ' si scarta, perché ' : ' si scarta, perché un calo non può superare il ')}${up ? `x ${t(' è un aumento')}` : '100\\%'}${t('; ')} ${x} ${t(' è accettabile')}`],
			check: `${P0} \\cdot ${dec(r)} = ${dec(r.mul(q(P0)))}, \\quad ${dec(r.mul(q(P0)))} \\cdot ${dec(r)} = ${P2}${unit ? t(unit) : ''}`,
			solution: `${t(up ? 'Ogni volta è aumentato del ' : 'Ogni volta è calato del ')} ${x}\\%`,
			answer: q(x),
			given: [P0, P2],
			// the total change halved (two rises of 10% are 21%, not 20%); the total change; the rejected solution; x/100
			mistakes: [total.div(q(2)), total, q(rejected), r.sub(q(1)).abs()],
			allowNegative: true,
			percent: true,
		};
	}
}

// ---------------------------------------------------------------------------

const BUILDERS: Record<string, (rng: Rng) => Problem> = {
	consecutivi,
	quadrato,
	quadrati,
	'somma-prodotto': sommaProdotto,
	'consecutivi-interi': consecutiviInteri,
	'quadrato-intero': quadratoIntero,
	sasso,
	rettangolo,
	triangolo: (rng) => triangolo(rng, 'triangolo'),
	rombo: (rng) => triangolo(rng, 'rombo'),
	'triangolo-irr': (rng) => sideIrr(rng, 'triangolo-irr'),
	'rettangolo-irr': (rng) => sideIrr(rng, 'rettangolo-irr'),
	'perimetro-area': perimetroArea,
	cornice,
	pitagora,
	'moto-veloce': (rng) => moto(rng, 'veloce'),
	'moto-lento': (rng) => moto(rng, 'lento'),
	lavoro,
	aumenti: (rng) => percentuali(rng, true),
	sconti: (rng) => percentuali(rng, false),
};

const CHOICE_LEVELS = [2, 4];

function problemSteps(p: Problem): string[] {
	const solve = p.solve ?? solveSteps(p.v, ...p.normal);
	return [
		p.unknown,
		`${t("Traduci il testo in un'equazione: ")} ${p.equation}`,
		...(p.ce ? [p.ce] : []),
		...p.work,
		...solve,
		...p.verdict,
		...(p.toAnswer ?? []),
		...(p.check ? [`${t('Controllo sul testo: ')} ${p.check}`] : []),
	];
}

const nice = (r: Rational) => Number.isFinite(r.num) && r.den > 0 && r.den <= 20 && Math.abs(r.num) <= 100000;

function numberChoice(rng: Rng, p: Problem, level: number): ChoiceAnswer {
	const ans = p.answer as Rational;
	// Wrong answers as the student would write them: integers on level 1 (natural numbers), else at most one decimal.
	const ok = (m: Rational) =>
		nice(m) && !m.equals(ans) && (m.sign() > 0 || (p.allowNegative && m.sign() < 0)) && (level === 1 ? m.isInteger() : m.mul(q(10)).isInteger());
	const near: Rational[] = [];
	const stepN = ans.isInteger() && ans.num >= 20 ? 2 : 1;
	for (let d = 1; d < 40; d++) near.push(ans.add(q(d * stepN)), ans.sub(q(d * stepN)));
	const ch = assembleChoice(
		rng,
		numOpt(ans, p.percent),
		[...(p.mistakes ?? []), ...near].filter(ok).map((m) => numOpt(m, p.percent)),
		4,
	);
	if (!ch) throw new Error(`${ID}: not enough options`);
	return ch;
}

const PROMPT = "Risolvi il problema con un'equazione di secondo grado e controlla quali soluzioni sono accettabili.";

const FORBIDDEN: { name: string; re: RegExp }[] = [
	{ name: '1x', re: /(?<![\d},])1\s*[xtv](?![a-z])/ },
	{ name: '0x', re: /(?<![\d},])0\s*[xtv](?![a-z])/ },
	{ name: '+ -', re: /\+\s*-/ },
	{ name: '- -', re: /-\s*-/ },
	{ name: '+ +', re: /\+\s*\+/ },
	{ name: '^{1}', re: /\^\{?1(?!\d)/ },
];

function generateLevel(rng: Rng, level: number): Sample {
	const stories = STORIES[level];
	for (let attempt = 0; attempt < 1000; attempt++) {
		const story = rng.pick(stories);
		const p = BUILDERS[story](rng);
		if (p.answer && p.given?.some((g) => p.answer!.equals(q(g)))) continue;
		const isChoice = CHOICE_LEVELS.includes(level);
		let choice: ChoiceAnswer | null;
		if (isChoice) {
			choice = assembleChoice(rng, p.correct as ChoiceOption, p.distractors ?? [], 4);
			if (!choice) continue;
		} else choice = numberChoice(rng, p, level);
		const rs = roots(...p.normal);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: PROMPT,
			problem: textBlock(p.prose),
			solution: p.solution,
			steps: problemSteps(p),
			answer: isChoice ? choice : { kind: 'number', value: (p.answer as Rational).toString() },
			params: {
				story: p.story,
				...Object.fromEntries(Object.entries(p.data).map(([k, v]) => [k, String(v)])),
				equation: p.equation,
				variable: p.v,
				normal: p.normal.map(String),
				roots: rs.map(String),
				...(p.case ? { case: p.case } : {}),
			},
		};
		if (!isChoice) sample.choice = choice;
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	const lvl = sample.level;
	if (!STORIES[lvl]?.includes(String(p.story))) return [`storia ${String(p.story)} fuori dal livello ${lvl}`];
	const normal = (p.normal as string[]).map(Number);
	if (normal.length !== 3 || normal[0] <= 0 || normal.some((c) => !Number.isInteger(c))) return ['forma normale non valida'];
	if (gcd(gcd(normal[0], normal[1]), normal[2]) !== 1) v.push('forma normale non ridotta');
	const rs = roots(normal[0], normal[1], normal[2]);
	if (rs.map(String).join(',') !== (p.roots as string[]).join(',')) v.push('radici diverse dalla forma normale');
	for (const { name, re } of FORBIDDEN) if (re.test(String(p.equation))) v.push(`equazione con ${name}: ${String(p.equation)}`);
	if (!sample.steps.some((s) => s.includes(String(p.equation)))) v.push("l'equazione non è nei passaggi");
	if (/—|piuttosto che/.test(sample.problem)) v.push('parole vietate nel testo');
	const choiceLevel = CHOICE_LEVELS.includes(lvl);
	const ch = choiceLevel ? (sample.answer as ChoiceAnswer) : sample.choice;
	if (!ch || ch.kind !== 'choice' || ch.options.length !== 4) return [...v, 'servono quattro opzioni'];
	const keys = ch.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== 4 || new Set(ch.options.map((o) => o.latex)).size !== 4) v.push('opzioni ripetute');
	if (!choiceLevel) {
		const val = (sample.answer as { value: string }).value;
		if (keys[ch.correct] !== val) v.push('opzione giusta sbagliata');
		if (!rs.some((r) => r.isRational())) v.push('nessuna soluzione razionale');
		const x = Rational.parse(val);
		if (x.sign() <= 0) v.push('la risposta non è positiva');
	} else {
		const imp = p.case === 'nessuna' || p.case === 'impossibile';
		if ((keys[ch.correct] === IMPOSSIBLE) !== imp) v.push('opzione giusta sbagliata');
		if (imp && rs.length > 0) v.push('impossibile con soluzioni reali');
	}
	return v;
}

const choiceOf = (sample: Sample): ChoiceAnswer => {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.choice) return sample.choice;
	throw new Error(`${ID}: sample without choice`);
};

export const equazioniSecondoGradoProblemi: Generator = {
	id: ID,
	title: 'Problemi di secondo grado',
	levels: {
		1: { label: 'Problemi sui numeri', constraints: ['consecutivi con prodotto dato, il quadrato di un numero e il suo multiplo, la somma dei quadrati', 'una soluzione naturale, l\'altra negativa da scartare'] },
		2: { label: 'Una, due o nessuna risposta', constraints: ['somma e prodotto (una coppia, o nessuna con Δ < 0), interi consecutivi e numeri interi (due risposte), il sasso lanciato in alto (due tempi, o mai)'] },
		3: { label: 'Aree di rettangoli, triangoli e rombi', constraints: ['area data e un lato espresso con l\'altro', 'si chiede il perimetro, un lato, una diagonale; soluzione negativa da scartare'] },
		4: { label: 'Lati irrazionali e rettangoli impossibili', constraints: ['soluzione irrazionale accettabile (√13 − 1)', 'perimetro e area: lati irrazionali o Δ < 0'] },
		5: { label: 'Cornici e teorema di Pitagora', constraints: ['cornice o vialetto di larghezza costante, prodotto di due binomi', 'cateti x e x + d con ipotenusa data, quadrato del binomio'] },
		6: { label: 'Moto e lavoro', constraints: ['equazione fratta con le C.E.', 'velocità aumentata e tempo diminuito, due rubinetti o due operai'] },
		7: { label: 'Due aumenti o due sconti uguali', constraints: ['P(1 ± x/100)^2 = P\', risolta come una pura', 'la seconda soluzione si scarta'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!STORIES[level]) throw new Error(`${ID}: unknown level ${level}`);
		return generateLevel(rng, level);
	},
	check,
	toChoice: choiceOf,
};

export default equazioniSecondoGradoProblemi;
