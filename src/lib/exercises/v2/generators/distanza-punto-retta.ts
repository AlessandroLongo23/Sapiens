/**
 * Distanza di un punto da una retta. Spec: specs/exercises/distanza-punto-retta.md
 *
 * Six levels in the order of lesson 85: a line parallel to an axis (or an axis), the formula with the
 * line in implicit form and an integer result, the line in explicit form with a result to rationalise,
 * fractional coefficients and a negative numerator (and the distance from the origin), the distance
 * between two parallel lines, the height and the area of a triangle given its vertices.
 *
 * Built backwards: at level 2 the distance is chosen first and the constant term c is computed from it;
 * at level 5 a point of one line is chosen first and the line is written through it; at level 6 the
 * vertices are chosen and the area is half the cross product. Every distance is N/√S with N rational and
 * S a positive integer, written as a Surd (k√r/d), so the value is exact and the form is rationalised.
 * Distractors are the mistakes the lesson names in its ad-warning boxes.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd } from '../surd';
import { polyToLatex, poly } from '../latex';
import { shuffle } from '../insiemi';

export const ID = 'distanza-punto-retta';

const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: '1x', re: /(?<![\d}])1\s*[xy]/ },
	{ name: '0x', re: /(?<![\d}])0\s*[xy]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo', re: /[+-]\s*0(?![\d])/ },
];

// ---------------------------------------------------------------------------
// Helpers

const t = (s: string) => `\\text{${s}}`;

function nonZero(rng: Rng, a: number, b: number): number {
	let v = 0;
	while (v === 0) v = rng.int(a, b);
	return v;
}

/** N / √S as an exact Surd, rationalised: N√S / S. S must be positive. */
function over(n: Rational, s: number): Surd {
	if (s <= 0) throw new Error(`over: radicand ${s}`);
	return Surd.of(0, n.num, s, s * n.den);
}

/** Integer in parentheses when negative, for substitutions: 3 \cdot (-2). */
function par(n: number | Rational): string {
	const r = typeof n === 'number' ? q(n) : n;
	if (r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}

const pt = (name: string, x: number | Rational, y: number | Rational) => `${name}(${typeof x === 'number' ? x : x.toLatex()}, ${typeof y === 'number' ? y : y.toLatex()})`;

/** ax + by + c = 0 with integer coefficients, never "1x", "+ -", "0y". */
function implicitLatex(a: number, b: number, c: number): string {
	let out = '';
	const term = (k: number, v: string) => {
		if (k === 0) return;
		const abs = Math.abs(k);
		const body = v === '' ? `${abs}` : `${abs === 1 ? '' : abs}${v}`;
		if (out === '') out = (k < 0 ? '-' : '') + body;
		else out += (k < 0 ? ' - ' : ' + ') + body;
	};
	term(a, 'x');
	term(b, 'y');
	term(c, '');
	return `${out} = 0`;
}

/** y = mx + q with rational m, q (m != 0). */
function explicitLatex(m: Rational, qq: Rational): string {
	const a = m.abs();
	const coef = a.isOne() ? '' : a.toLatex();
	let out = `y = ${m.sign() < 0 ? '-' : ''}${coef}x`;
	if (!qq.isZero()) out += qq.sign() < 0 ? ` - ${qq.abs().toLatex()}` : ` + ${qq.toLatex()}`;
	return out;
}

/** "a \cdot x0 + b \cdot y0 + c" as the lesson writes the numerator, before computing it. */
function substitution(a: number, b: number, c: number, x0: number | Rational, y0: number | Rational): string {
	const parts: string[] = [];
	const push = (k: number, v: number | Rational | null) => {
		if (k === 0) return;
		const abs = Math.abs(k);
		const body = v === null ? `${abs}` : abs === 1 ? par(v) : `${abs} \\cdot ${par(v)}`;
		if (parts.length === 0) parts.push((k < 0 ? '-' : '') + body);
		else parts.push((k < 0 ? '- ' : '+ ') + body);
	};
	push(a, x0);
	push(b, y0);
	push(c, null);
	return parts.join(' ');
}

/** √(a² + b²) written out: \sqrt{3^2 + (-4)^2}. */
function rootSum(a: number, b: number): string {
	return `\\sqrt{${par(a)}^2 + ${par(b)}^2}`;
}

/** The value of √S simplified, as LaTeX: 5, 2\sqrt{5}, \sqrt{10}. */
function sqrtLatex(s: number): string {
	return Surd.of(0, 1, s, 1).toLatex();
}

/** \frac{N}{\sqrt{S}} with the root simplified: \frac{9}{2\sqrt{5}}, or \frac{10}{5} when S is a square. */
function fracRoot(n: Rational, s: number): string {
	return `\\frac{${n.toLatex()}}{${sqrtLatex(s)}}`;
}

/** Steps that turn N/√S (N a non-negative integer) into the final value: rationalise when a root is left. */
function finishSteps(label: string, n: Rational, s: number): string[] {
	const v = over(n, s);
	const root = Surd.of(0, 1, s, 1);
	if (root.isRational()) return [`${label} = ${fracRoot(n, s)}${fracRoot(n, s) === v.toLatex() ? '' : ` = ${v.toLatex()}`}`];
	const k = root.b; // √s = k√r
	const r = root.r;
	const numer = n.num === 1 ? `\\sqrt{${r}}` : `${n.num}\\sqrt{${r}}`;
	const mid = `\\frac{${numer}}{${k === 1 ? r : `${k} \\cdot ${r}`}}`;
	return [`${label} = ${fracRoot(n, s)}`, `${t('Razionalizza: ')} ${fracRoot(n, s)} = ${mid}${mid === v.toLatex() ? '' : ` = ${v.toLatex()}`}`];
}

interface Wrong {
	value: string;
	latex: string;
	why: string;
}

function wrong(v: Surd | null, why: string): Wrong | null {
	if (!v || v.isZero()) return null;
	return { value: v.toString(), latex: v.toLatex(), why };
}

function answerOf(v: Surd): Sample['answer'] {
	if (v.isRational()) return { kind: 'number', value: v.toString() };
	return { kind: 'expression', value: v.toString(), latex: v.toLatex(), form: 'rationalized' };
}

function sample(level: number, rng: Rng, prompt: string, problem: string, v: Surd, label: string, steps: string[], params: Record<string, unknown>, wrongs: (Wrong | null)[]): Sample {
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt,
		problem,
		solution: `${label} = ${v.toLatex()}`,
		steps,
		answer: answerOf(v),
		params: { ...params, distance: v.toString(), wrong: wrongs.filter((w): w is Wrong => w !== null) },
	};
}

// ---------------------------------------------------------------------------
// Level 1: a line parallel to an axis, or an axis

function level1(rng: Rng): Sample {
	const x0 = nonZero(rng, -8, 8);
	const y0 = nonZero(rng, -8, 8);
	const P = pt('P', x0, y0);
	const u = rng.next();
	const abs = (n: number) => Surd.of(Math.abs(n), 0, 1, 1);
	const num = (n: number) => Surd.of(n, 0, 1, 1);
	if (u < 0.35) {
		const k = nonZero(rng, -8, 8);
		const d = Math.abs(y0 - k);
		return sample(1, rng, 'Calcola la distanza del punto P dalla retta r.', `${P} \\quad r\\colon y = ${k}`, abs(y0 - k), 'd(P, r)', [
			`${t('La retta ')} y = ${k} ${t(' è orizzontale: si confrontano le ordinate.')}`,
			`d(P, r) = |${y0} - ${par(k)}| = |${y0 - k}| = ${d}`,
		], { case: 'orizzontale', P: [`${x0}`, `${y0}`], line: ['0', '1', `${-k}`] }, [
			wrong(abs(x0 - k), "confronta l'ascissa con la k della retta"),
			y0 - k < 0 ? wrong(num(y0 - k), 'dimentica il valore assoluto') : null,
			wrong(abs(y0 + k), 'somma invece di sottrarre'),
			wrong(abs(y0), "misura dall'asse x"),
		]);
	}
	if (u < 0.7) {
		const h = nonZero(rng, -8, 8);
		const d = Math.abs(x0 - h);
		return sample(1, rng, 'Calcola la distanza del punto P dalla retta r.', `${P} \\quad r\\colon x = ${h}`, abs(x0 - h), 'd(P, r)', [
			`${t('La retta ')} x = ${h} ${t(' è verticale: si confrontano le ascisse.')}`,
			`d(P, r) = |${x0} - ${par(h)}| = |${x0 - h}| = ${d}`,
		], { case: 'verticale', P: [`${x0}`, `${y0}`], line: ['1', '0', `${-h}`] }, [
			wrong(abs(y0 - h), "confronta l'ordinata con la h della retta"),
			x0 - h < 0 ? wrong(num(x0 - h), 'dimentica il valore assoluto') : null,
			wrong(abs(x0 + h), 'somma invece di sottrarre'),
			wrong(abs(x0), "misura dall'asse y"),
		]);
	}
	const axisX = rng.next() < 0.5;
	const own = axisX ? y0 : x0;
	const other = axisX ? x0 : y0;
	return sample(1, rng, `Calcola la distanza del punto P dall'asse ${axisX ? 'x' : 'y'}.`, P, abs(own), 'd', [
		`${t("L'asse ")} ${axisX ? 'x' : 'y'} ${t(' ha equazione ')} ${axisX ? 'y' : 'x'} = 0${t(axisX ? ": la distanza è il valore assoluto dell'ordinata." : ": la distanza è il valore assoluto dell'ascissa.")}`,
		`d = |${own}| = ${Math.abs(own)}`,
	], { case: 'asse', P: [`${x0}`, `${y0}`], line: axisX ? ['0', '1', '0'] : ['1', '0', '0'] }, [
		wrong(abs(other), 'usa la coordinata sbagliata'),
		own < 0 ? wrong(num(own), 'dimentica il valore assoluto') : null,
		wrong(Surd.of(0, 1, x0 * x0 + y0 * y0, 1), "calcola la distanza dall'origine"),
		wrong(abs(Math.abs(x0) + Math.abs(y0)), 'somma le due coordinate'),
	]);
}

// ---------------------------------------------------------------------------
// Shared: distance of an integer point from ax + by + c = 0, with the steps and the formula mistakes

interface Formula {
	value: Surd;
	signed: Rational;
	steps: string[];
	wrongs: (Wrong | null)[];
}

/**
 * The formula applied to P(x0, y0) and ax + by + c = 0 (integer a, b, c). Steps: numerator, denominator,
 * value, rationalisation. Wrongs, in the order the lesson warns about them.
 */
function formula(a: number, b: number, c: number, x0: number, y0: number, label: string): Formula {
	const signed = q(a * x0 + b * y0 + c);
	const N = signed.abs();
	const S = a * a + b * b;
	const value = over(N, S);
	const steps = [
		`${t('Numeratore: ')} |${substitution(a, b, c, x0, y0)}| = |${signed.toLatex()}| = ${N.toLatex()}`,
		`${t('Denominatore: ')} ${rootSum(a, b)} = \\sqrt{${S}}${Surd.of(0, 1, S, 1).toLatex() === `\\sqrt{${S}}` ? '' : ` = ${sqrtLatex(S)}`}`,
		...finishSteps(label, N, S),
	];
	const wrongs = [
		signed.sign() < 0 ? wrong(over(signed, S), 'dimentica il valore assoluto') : null,
		wrong(Surd.rational(N.div(q(Math.abs(a) + Math.abs(b)))), 'spezza la radice: |a| + |b| al denominatore'),
		wrong(Surd.rational(N.div(q(S))), 'dimentica la radice al denominatore'),
		wrong(over(N, S + c * c), 'mette c sotto la radice'),
		a * a - b * b > 0 && b < 0 ? wrong(over(N, a * a - b * b), '(-b)^2 letto come -b^2') : null,
	];
	return { value, signed, steps, wrongs };
}

// ---------------------------------------------------------------------------
// Level 2: implicit form, integer result (Pythagorean a, b)

const PYTH: [number, number, number][] = [
	[3, 4, 5],
	[4, 3, 5],
	[6, 8, 10],
	[8, 6, 10],
	[5, 12, 13],
	[12, 5, 13],
];

function level2(rng: Rng): Sample {
	const [pa, pb, h] = rng.pick(PYTH);
	const a = pa;
	const b = rng.next() < 0.5 ? pb : -pb;
	const x0 = rng.int(-6, 6);
	const y0 = rng.int(-6, 6);
	const d = rng.int(1, h === 5 ? 5 : h === 10 ? 3 : 2);
	const sign = rng.next() < 0.5 ? 1 : -1;
	const c = sign * d * h - a * x0 - b * y0;
	const f = formula(a, b, c, x0, y0, 'd(P, r)');
	const line = implicitLatex(a, b, c);
	return sample(2, rng, 'Calcola la distanza del punto P dalla retta r.', `${pt('P', x0, y0)} \\quad r\\colon ${line}`, f.value, 'd(P, r)', [
		`${t('La retta è in forma implicita: ')} a = ${a},\\ b = ${b},\\ c = ${c}`,
		...f.steps,
	], { case: 'implicita', P: [`${x0}`, `${y0}`], line: [`${a}`, `${b}`, `${c}`] }, [
		f.wrongs[0],
		f.wrongs[1],
		f.wrongs[2],
		f.wrongs[3],
		f.wrongs[4],
		wrong(Surd.rational(q(Math.abs(a * x0 + b * y0), h)), 'dimentica c al numeratore'),
	]);
}

// ---------------------------------------------------------------------------
// Level 3: explicit form y = mx + q, result to rationalise

function level3(rng: Rng): Sample {
	const m = rng.pick([1, 2, 3, 4]) * (rng.next() < 0.5 ? 1 : -1);
	const qq = nonZero(rng, -6, 6);
	const x0 = rng.int(-5, 5);
	const y0 = rng.int(-5, 5);
	// implicit form: mx - y + q = 0, as in the lesson
	const f = formula(m, -1, qq, x0, y0, 'd(P, r)');
	const S = m * m + 1;
	const N = f.signed.abs();
	const plus = q(Math.abs(m * x0 + y0 + qq));
	return sample(3, rng, 'Calcola la distanza del punto P dalla retta r. Se al denominatore resta una radice, razionalizza.', `${pt('P', x0, y0)} \\quad r\\colon ${explicitLatex(q(m), q(qq))}`, f.value, 'd(P, r)', [
		`${t('Porta la retta in forma implicita: ')} ${implicitLatex(m, -1, qq)}${t(', quindi ')} a = ${m},\\ b = -1,\\ c = ${qq}`,
		...f.steps,
	], { case: 'esplicita', P: [`${x0}`, `${y0}`], m: `${m}`, q: `${qq}`, line: [`${m}`, '-1', `${qq}`] }, [
		wrong(over(plus, S), 'prende b = 1 senza portare y a primo membro'),
		f.wrongs[0],
		f.wrongs[1],
		Math.abs(m) >= 2 ? wrong(over(N, m * m - 1), '(-1)^2 letto come -1') : null,
		f.wrongs[2],
		f.wrongs[3],
	]);
}

// ---------------------------------------------------------------------------
// Level 4: fractional coefficients, negative numerator; the distance from the origin

function level4(rng: Rng): Sample {
	const s = rng.pick([2, 3, 4]);
	let p = 0;
	while (p === 0 || gcd(p, s) !== 1 || Number.isInteger(Math.sqrt(p * p + s * s))) p = rng.int(-5, 5);
	const tt = nonZero(rng, -9, 9);
	const m = q(p, s);
	const qq = q(tt, s);
	// s·y = p·x + t, so p·x - s·y + t = 0
	const [a, b, c] = [p, -s, tt];
	const origin = rng.next() < 0.3;
	let x0 = 0;
	let y0 = 0;
	// P below the line in the form px - sy + t = 0: the numerator is negative, as in example 4
	while (!origin && (a * x0 + b * y0 + c >= 0 || (x0 === 0 && y0 === 0))) {
		x0 = rng.int(-5, 5);
		y0 = rng.int(-5, 5);
	}
	const name = origin ? 'O' : 'P';
	const label = `d(${name}, r)`;
	const f = formula(a, b, c, x0, y0, label);
	const S = a * a + b * b;
	const rhs = polyToLatex(poly(tt, p));
	const steps = [
		`${t('Moltiplica per ')} ${s} ${t(' tutti e due i membri: ')} ${s}y = ${rhs}${t(', cioè ')} ${implicitLatex(a, b, c)}`,
		`a = ${a},\\ b = ${b},\\ c = ${c}`,
		...(origin ? [`${t("Per l'origine il numeratore è ")} |c| = |${c}| = ${Math.abs(c)}`, `${t('Denominatore: ')} ${rootSum(a, b)} = \\sqrt{${S}}`, ...finishSteps(label, q(Math.abs(c)), S)] : f.steps),
	];
	// mistake: c not multiplied by s (a = p, b = -s, c = q)
	const cNot = qq.add(q(a * x0 + b * y0)).abs();
	// mistake: numerator from the fractional form, denominator from the integer one
	const mixed = m.mul(q(x0)).sub(q(y0)).add(qq).abs();
	const problem = `${pt(name, x0, y0)} \\quad r\\colon ${explicitLatex(m, qq)}`;
	return sample(4, rng, origin ? "Calcola la distanza dell'origine O dalla retta r. Se al denominatore resta una radice, razionalizza." : 'Calcola la distanza del punto P dalla retta r. Se al denominatore resta una radice, razionalizza.', problem, f.value, label, steps, {
		case: origin ? 'origine' : 'frazionari',
		P: [`${x0}`, `${y0}`],
		m: m.toString(),
		q: qq.toString(),
		line: [`${a}`, `${b}`, `${c}`],
	}, [
		f.wrongs[0],
		qq.isInteger() ? null : wrong(over(cNot, S), 'moltiplica per il denominatore solo x e y, non il termine noto'),
		!origin ? wrong(over(mixed, S), 'numeratore con la forma frazionaria, denominatore con quella intera') : null,
		f.wrongs[1],
		f.wrongs[2],
		f.wrongs[3],
	]);
}

// ---------------------------------------------------------------------------
// Level 5: two parallel lines

function level5(rng: Rng): Sample {
	if (rng.next() < 0.6) {
		// implicit: r: ax + by + c = 0, s: k(ax + by) + c' = 0
		let a: number;
		let b: number;
		if (rng.next() < 0.4) {
			[a, b] = rng.pick([
				[3, 4],
				[4, 3],
			]);
		} else {
			do {
				a = rng.int(1, 5);
				b = rng.int(1, 5);
			} while (gcd(a, b) !== 1 || a * b === 0);
		}
		if (rng.next() < 0.5) b = -b;
		const k = rng.pick([2, 3]);
		// a point of the simple line on an axis
		const onY = rng.next() < 0.5;
		const coord = nonZero(rng, -4, 4);
		const [x1, y1] = onY ? [0, coord] : [coord, 0];
		const c = -(a * x1 + b * y1);
		let c2 = 0;
		while (c2 === 0 || c2 % k === 0 || c2 === k * c) c2 = rng.int(-20, 20);
		const simpleIsR = rng.next() < 0.7;
		const lineS = implicitLatex(k * a, k * b, c2);
		const lineSimple = implicitLatex(a, b, c);
		const [nr, ns] = simpleIsR ? ['r', 's'] : ['s', 'r'];
		const problem = simpleIsR ? `r\\colon ${lineSimple} \\quad s\\colon ${lineS}` : `r\\colon ${lineS} \\quad s\\colon ${lineSimple}`;
		const S = k * k * (a * a + b * b);
		const signed = q(k * a * x1 + k * b * y1 + c2);
		const N = signed.abs();
		const v = over(N, S);
		const S1 = a * a + b * b;
		const steps = [
			`${t('I coefficienti di ')} x ${t(' e di ')} y ${t(' sono proporzionali, ')} \\frac{${k * a}}{${a}} = \\frac{${k * b}}{${b}} = ${k}${t(', i termini noti no: le rette sono parallele e distinte.')}`,
			`${t('Un punto di ')} ${nr} ${t(' è ')} ${pt('P', x1, y1)}${t('. Si calcola la sua distanza da ')} ${ns}${t('.')}`,
			`${t('Numeratore: ')} |${substitution(k * a, k * b, c2, x1, y1)}| = |${signed.toLatex()}| = ${N.toLatex()}`,
			`${t('Denominatore: ')} ${rootSum(k * a, k * b)} = \\sqrt{${S}}${Surd.of(0, 1, S, 1).toLatex() === `\\sqrt{${S}}` ? '' : ` = ${sqrtLatex(S)}`}`,
			...finishSteps('d(r, s)', N, S),
		];
		return sample(5, rng, 'Le rette r e s sono parallele. Calcola la loro distanza.', problem, v, 'd(r, s)', steps, {
			case: 'implicite',
			r: simpleIsR ? [`${a}`, `${b}`, `${c}`] : [`${k * a}`, `${k * b}`, `${c2}`],
			s: simpleIsR ? [`${k * a}`, `${k * b}`, `${c2}`] : [`${a}`, `${b}`, `${c}`],
			k: `${k}`,
			point: [`${x1}`, `${y1}`],
		}, [
			wrong(over(q(Math.abs(c - c2)), S1), 'formula diretta senza rendere uguali a e b'),
			wrong(over(q(Math.abs(c - c2)), S), 'formula diretta con i coefficienti della seconda retta'),
			wrong(over(N, S1), 'moltiplica il termine noto ma non divide la radice'),
			wrong(Surd.rational(N.div(q(k * (Math.abs(a) + Math.abs(b))))), 'spezza la radice: |a| + |b| al denominatore'),
			wrong(Surd.rational(N.div(q(S))), 'dimentica la radice al denominatore'),
		]);
	}
	// explicit: y = mx + q1, y = mx + q2
	const m = rng.pick([1, 2, 3]) * (rng.next() < 0.5 ? 1 : -1);
	const q1 = nonZero(rng, -8, 8);
	let q2 = q1;
	while (q2 === q1) q2 = rng.int(-8, 8);
	const S = m * m + 1;
	const N = q(Math.abs(q1 - q2));
	const v = over(N, S);
	const steps = [
		`${t('Le due rette hanno lo stesso coefficiente angolare ')} m = ${m}${t(' e ordinate all\'origine diverse: sono parallele.')}`,
		`${t('In forma implicita: ')} ${implicitLatex(m, -1, q1)} ${t(' e ')} ${implicitLatex(m, -1, q2)}${t(', con gli stessi ')} a ${t(' e ')} b`,
		`${t('Formula diretta: ')} d(r, s) = \\frac{|${q1} - ${par(q2)}|}{${rootSum(m, -1)}} = ${fracRoot(N, S)}`,
		...finishSteps('d(r, s)', N, S).slice(1),
	];
	return sample(5, rng, 'Le rette r e s sono parallele. Calcola la loro distanza.', `r\\colon ${explicitLatex(q(m), q(q1))} \\quad s\\colon ${explicitLatex(q(m), q(q2))}`, v, 'd(r, s)', steps, {
		case: 'esplicite',
		r: [`${m}`, '-1', `${q1}`],
		s: [`${m}`, '-1', `${q2}`],
	}, [
		wrong(Surd.rational(N), 'prende la differenza delle q'),
		wrong(over(q(Math.abs(q1 + q2)), S), 'sbaglia il segno di c'),
		wrong(Surd.rational(N.div(q(Math.abs(m) + 1))), 'spezza la radice: |a| + |b| al denominatore'),
		wrong(Surd.rational(N.div(q(S))), 'dimentica la radice al denominatore'),
		Math.abs(m) >= 2 ? wrong(over(N, m * m - 1), '(-1)^2 letto come -1') : null,
	]);
}

// ---------------------------------------------------------------------------
// Level 6: height and area of a triangle

function level6(rng: Rng): Sample {
	const xA = rng.int(-4, 4);
	const yA = rng.int(-4, 4);
	const dx = nonZero(rng, -6, 6);
	const dy = nonZero(rng, -6, 6);
	const xB = xA + dx;
	const yB = yA + dy;
	const xC = rng.int(-4, 6);
	const yC = rng.int(-4, 6);
	const g = gcd(dx, dy);
	// line AB: dy·x - dx·y + (dx·yA - dy·xA) = 0, divided by g, with a > 0
	let a = dy / g;
	let b = -dx / g;
	let c = (dx * yA - dy * xA) / g;
	if (a < 0) [a, b, c] = [-a, -b, -c];
	const S = a * a + b * b;
	const L2 = dx * dx + dy * dy;
	const cross = dx * (yC - yA) - dy * (xC - xA);
	const signed = q(a * xC + b * yC + c);
	const N = signed.abs();
	const area = q(Math.abs(cross), 2);
	const h = over(N, S);
	const ask = rng.next() < 0.6 ? 'area' : 'altezza';
	const AB = Surd.of(0, 1, L2, 1);
	const hRaw = fracRoot(N, S);
	const steps = [
		`\\overline{AB} = \\sqrt{${par(dx)}^2 + ${par(dy)}^2} = \\sqrt{${L2}}${AB.toLatex() === `\\sqrt{${L2}}` ? '' : ` = ${AB.toLatex()}`}`,
		`${t('La retta ')} AB ${t(' in forma implicita è ')} ${implicitLatex(a, b, c)}`,
		`h = \\frac{|${substitution(a, b, c, xC, yC)}|}{${rootSum(a, b)}} = ${hRaw}`,
	];
	const BC2 = (xC - xB) ** 2 + (yC - yB) ** 2;
	const bsignN = q(Math.abs(a * xC - b * yC + c));
	const problem = `${pt('A', xA, yA)} \\quad ${pt('B', xB, yB)} \\quad ${pt('C', xC, yC)}`;
	const params = { case: ask, A: [`${xA}`, `${yA}`], B: [`${xB}`, `${yB}`], C: [`${xC}`, `${yC}`], line: [`${a}`, `${b}`, `${c}`] };
	if (ask === 'area') {
		steps.push(`${t('Area')} = \\frac{1}{2} \\cdot ${AB.toLatex()} \\cdot ${hRaw} = ${area.toLatex()}`);
		return sample(6, rng, 'Calcola l\'area del triangolo ABC.', problem, Surd.rational(area), t('Area'), steps, params, [
			wrong(Surd.rational(area.mul(q(2))), 'dimentica di dividere per 2'),
			wrong(Surd.rational(bsignN.mul(q(g, 2))), 'sbaglia il segno di b al numeratore'),
			wrong(Surd.of(0, g * N.num, S, 2 * (Math.abs(a) + Math.abs(b))), 'spezza la radice: |a| + |b| al denominatore'),
			wrong(Surd.of(0, g * N.num, S, 2 * S), "dimentica la radice al denominatore dell'altezza"),
		]);
	}
	if (Surd.of(0, 1, S, 1).isRational()) {
		if (h.toLatex() !== hRaw) steps.push(`h = ${h.toLatex()}`);
	}
	else steps.push(...finishSteps('h', N, S).slice(1));
	return sample(6, rng, "Calcola l'altezza del triangolo ABC relativa al lato AB. Se al denominatore resta una radice, razionalizza.", problem, h, 'h', steps, params, [
		BC2 > 0 ? wrong(over(q(Math.abs(cross)), BC2), 'calcola la distanza di A dalla retta BC') : null,
		wrong(over(bsignN, S), 'sbaglia il segno di b al numeratore'),
		wrong(Surd.rational(N.div(q(Math.abs(a) + Math.abs(b)))), 'spezza la radice: |a| + |b| al denominatore'),
		wrong(Surd.rational(N.div(q(S))), 'dimentica la radice al denominatore'),
		signed.sign() < 0 ? wrong(over(signed, S), 'dimentica il valore assoluto') : null,
	]);
}

// ---------------------------------------------------------------------------
// Choice

function options(sample: Sample): { correct: ChoiceOption; distractors: ChoiceOption[] } {
	const a = sample.answer;
	const correct: ChoiceOption = a.kind === 'number' ? { latex: Rational.parse(a.value).toLatex(), values: [a.value] } : { latex: (a as { latex: string }).latex, values: [(a as { value: string }).value] };
	const seen = new Set([correct.values[0]]);
	const latexSeen = new Set([correct.latex]);
	const distractors: ChoiceOption[] = [];
	for (const w of (sample.params.wrong ?? []) as Wrong[]) {
		if (distractors.length === 3) break;
		if (seen.has(w.value) || latexSeen.has(w.latex)) continue;
		seen.add(w.value);
		latexSeen.add(w.latex);
		distractors.push({ latex: w.latex, values: [w.value] });
	}
	return { correct, distractors };
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const { correct, distractors } = options(sample);
	if (distractors.length < 3) throw new Error(`${ID}: fewer than 3 distractors`);
	const all = [correct, ...distractors];
	const order = shuffle(
		rng,
		all.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => all[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Check

const int = (s: unknown) => Number(s);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const f of FORBIDDEN_PATTERNS) if (f.re.test(sample.problem)) v.push(`problema con ${f.name}: ${sample.problem}`);
	if (!sample.steps.length) v.push('nessun passaggio');
	const { distractors } = options(sample);
	if (distractors.length < 3) v.push('meno di tre distrattori distinti');
	const dist = String(p.distance);
	const ans = sample.answer;
	if (ans.kind === 'number' && ans.value !== dist) v.push('risposta diversa dalla distanza');
	if (ans.kind === 'expression' && (ans.value !== dist || ans.form !== 'rationalized')) v.push('risposta espressione non coerente');
	const lvl = sample.level;
	const P = (p.P ?? []) as string[];
	const line = (p.line ?? []) as string[];
	// recompute with the formula
	const recompute = (L: string[], X: number, Y: number) => {
		const [a, b, c] = L.map(int);
		return over(q(Math.abs(a * X + b * Y + c)), a * a + b * b).toString();
	};
	if (lvl <= 4) {
		if (recompute(line, int(P[0]), int(P[1])) !== dist) v.push('distanza ricalcolata diversa');
		if (dist === '0') v.push('il punto sta sulla retta');
	}
	if (lvl === 1 || lvl === 2) {
		if (!/^\d+$/.test(dist)) v.push(`livello ${lvl}: distanza non intera`);
	}
	if (lvl === 2) {
		const [a, b, c] = line.map(int);
		if (c === 0 || Math.abs(c) > 30) v.push(`c = ${c} fuori da [-30, 30] o nullo`);
		if (gcd(gcd(a, b), c) !== 1) v.push('coefficienti con un fattore comune');
	}
	if (lvl === 3 || lvl === 4) {
		const [a, b] = line.map(int);
		if (Surd.of(0, 1, a * a + b * b, 1).isRational()) v.push('radice che si estrae');
		const N = Math.abs(int(line[0]) * int(P[0]) + int(line[1]) * int(P[1]) + int(line[2]));
		if (N > 30) v.push(`numeratore ${N} > 30`);
	}
	if (lvl === 4 && p.case === 'frazionari') {
		const [a, b, c] = line.map(int);
		if (a * int(P[0]) + b * int(P[1]) + c >= 0) v.push('livello 4: numeratore non negativo');
	}
	if (lvl === 5) {
		const r = (p.r as string[]).map(int);
		const s = (p.s as string[]).map(int);
		if (r[0] * s[1] !== r[1] * s[0]) v.push('rette non parallele');
		if (r[0] * s[2] === r[2] * s[0] && r[1] * s[2] === r[2] * s[1]) v.push('rette coincidenti');
		// a point of r on an axis, then its distance from s
		const [a, b, c] = r;
		const X = b !== 0 ? q(0) : q(-c, a);
		const Y = b !== 0 ? q(-c, b) : q(0);
		const signed = X.mul(q(s[0])).add(Y.mul(q(s[1]))).add(q(s[2]));
		if (over(signed.abs(), s[0] * s[0] + s[1] * s[1]).toString() !== dist) v.push('distanza tra le rette ricalcolata diversa');
		if (Math.abs(s[2]) > 30 || Math.abs(r[2]) > 30) v.push('termine noto oltre 30');
	}
	if (lvl === 6) {
		const [A, B, C] = [p.A, p.B, p.C].map((x) => (x as string[]).map(int));
		const cross = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
		if (cross === 0) v.push('triangolo degenere');
		if (B[0] === A[0] || B[1] === A[1]) v.push('AB parallelo a un asse');
		const L2 = (B[0] - A[0]) ** 2 + (B[1] - A[1]) ** 2;
		const truth = p.case === 'area' ? q(Math.abs(cross), 2).toString() : over(q(Math.abs(cross)), L2).toString();
		if (truth !== dist) v.push('area o altezza ricalcolata diversa');
		if (Math.abs(cross) > 60) v.push('area oltre 30');
		if ([...A, ...B, ...C].some((k) => Math.abs(k) > 10)) v.push('coordinate oltre 10');
	}
	return v;
}

// ---------------------------------------------------------------------------

const BUILDERS: Record<number, (rng: Rng) => Sample> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const distanzaPuntoRetta: Generator = {
	id: ID,
	title: 'Distanza di un punto da una retta',
	levels: {
		1: { label: 'Rette parallele agli assi', constraints: ['P a coordinate intere non nulle tra -8 e 8', 'retta y = k (35%), x = h (35%) o un asse (30%)'] },
		2: { label: 'La formula, forma implicita', constraints: ['a, b da una terna pitagorica, risultato intero', '|c| <= 30, coefficienti senza fattori comuni'] },
		3: { label: 'Retta in forma esplicita', constraints: ['y = mx + q con m in ±{1, 2, 3, 4}', 'risultato da razionalizzare'] },
		4: { label: 'Coefficienti frazionari', constraints: ['m = p/s con s in {2, 3, 4}', 'numeratore negativo; un esercizio su tre chiede la distanza dall\'origine'] },
		5: { label: 'Distanza tra rette parallele', constraints: ['forme implicite con coefficienti multipli (60%) o esplicite con lo stesso m (40%)'] },
		6: { label: 'Altezza e area di un triangolo', constraints: ['vertici interi, AB non parallelo agli assi', 'area (60%) o altezza relativa ad AB (40%)'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			const s = build(rng);
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check(sample: Sample): string[] {
		const v = check(sample);
		const ch = sample.choice;
		if (ch) {
			const vals = ch.options.map((o) => o.values[0]);
			if (new Set(vals).size !== 4) v.push('opzioni non distinte');
			if (vals[ch.correct] !== String(sample.params.distance)) v.push("l'opzione giusta non è la distanza");
		}
		return v;
	},
	toChoice,
};

export default distanzaPuntoRetta;
