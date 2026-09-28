/**
 * Teoremi di Pitagora e di Euclide. Spec: specs/exercises/teorema-di-pitagora.md
 *
 * Seven levels in the order of lesson 100 (docs/lezioni/riscritte/100-teorema-di-pitagora.md): the hypotenuse
 * from the legs, a leg from the hypotenuse, irrational results to simplify, the converse of Pythagoras, the two
 * theorems of Euclid, the square, the equilateral triangle and the 45° and 30°-60° triangles, problems on
 * rectangles, rhombi and trapezi. No figures: every exercise stands on its text, with the triangle ABC right in C
 * as in the lesson. Integer lengths are a `number`, lengths that may carry a radical an `expression` in reduced
 * form, the converse a `choice` among four fixed labels. Distractors are the mistakes of the lesson's warnings.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Surd } from '../surd';
import { buildChoice, shuffle, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'teorema-di-pitagora';

const t = (s: string) => `\\text{${s}}`;
const ov = (s: string) => `\\overline{${s}}`;
const ov2 = (s: string) => `\\overline{${s}}^{\\,2}`;

// ---------------------------------------------------------------------------
// Exact lengths

/** √n, reduced: root(32) = 4√2, root(36) = 6. */
const root = (n: number): Surd => Surd.of(0, 1, n, 1);
const int = (n: number): Surd => Surd.of(n, 0, 1, 1);
const frac = (n: number, d: number): Surd => Surd.of(n, 0, 1, d);
/** k√r / d. */
const kr = (k: number, r: number, d = 1): Surd => Surd.of(0, k, r, d);

type Unit = 'cm' | 'cm2';
const UNIT_TEX: Record<Unit, string> = { cm: '\\ \\text{cm}', cm2: '\\ \\text{cm}^2' };
const withUnit = (s: Surd, u: Unit) => `${s.toLatex()}${UNIT_TEX[u]}`;
const cm = (s: Surd | number) => withUnit(typeof s === 'number' ? int(s) : s, 'cm');

/** √N with its simplification: \sqrt{32} = \sqrt{16 \cdot 2} = 4\sqrt{2}, or \sqrt{144} = 12. */
function rootSteps(n: number): string {
	const s = root(n);
	if (s.isRational()) return `\\sqrt{${n}} = ${s.toLatex()}`;
	if (s.b === 1) return `\\sqrt{${n}}`;
	return `\\sqrt{${n}} = \\sqrt{${s.b * s.b} \\cdot ${s.r}} = ${s.toLatex()}`;
}

/** 7^2, or (2\sqrt{5})^2 for a radical. */
const sqTex = (s: Surd) => (s.isRational() ? `${s.toLatex()}^2` : `\\left(${s.toLatex()}\\right)^2`);

// ---------------------------------------------------------------------------
// Pythagorean triples of the lesson and their multiples

const BASE: [number, number, number][] = [
	[3, 4, 5],
	[5, 12, 13],
	[8, 15, 17],
	[7, 24, 25],
];
const FAMILY_WEIGHT = [4, 3, 2, 2];

interface Triple {
	a: number;
	b: number;
	c: number;
	k: number;
	base: [number, number, number];
}

function pickTriple(rng: Rng, maxHyp: number): Triple {
	const fams = BASE.map((b, i) => [i, b[2] <= maxHyp ? FAMILY_WEIGHT[i] : 0] as [number, number]).filter(([, w]) => w > 0);
	const base = BASE[weighted(rng, fams)];
	const k = rng.int(1, Math.floor(maxHyp / base[2]));
	return { a: k * base[0], b: k * base[1], c: k * base[2], k, base };
}

const tripleNote = (T: Triple) => (T.k > 1 ? [t(`È la terna ${T.base.join(', ')} moltiplicata per ${T.k}`)] : []);

// ---------------------------------------------------------------------------

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	/** The exact answer, for the choice variant. */
	value?: Surd;
	unit?: Unit;
	/** Distractors from the lesson's mistakes. */
	wrong?: Surd[];
	params: Record<string, unknown>;
}

const INTRO = 'Nel triangolo $ABC$, rettangolo in $C$,';

/** The sides as the steps write them: \overline{AB} for the named triangle, a, b, c (lesson) for the plain one. */
const PLAIN: Record<string, string> = { AB: 'c', AC: 'b', BC: 'a' };
const side = (plain: boolean) => (s: string) => (plain ? PLAIN[s] : ov(s));
const side2 = (plain: boolean) => (s: string) => (plain ? `${PLAIN[s]}^2` : ov2(s));

function numberAnswer(v: Surd): Answer {
	return { kind: 'number', value: v.toString() };
}
function exprAnswer(v: Surd): Answer {
	return { kind: 'expression', value: v.toString(), latex: v.toLatex(), form: 'simplified' };
}

/** The two legs of the named triangle, in random order. */
const legsData = (rng: Rng, a: number, b: number) =>
	rng.next() < 0.5 ? `il cateto $AC$ misura $${b}$ cm e il cateto $BC$ misura $${a}$ cm` : `il cateto $BC$ misura $${a}$ cm e il cateto $AC$ misura $${b}$ cm`;

// ---------------------------------------------------------------------------
// Level 1: the hypotenuse from the legs (integer triples)

function level1(rng: Rng): Built {
	const T = pickTriple(rng, 60);
	const [a, b] = rng.next() < 0.5 ? [T.a, T.b] : [T.b, T.a]; // a = BC, b = AC
	const plain = rng.next() < 0.4;
	const [S, S2] = [side(plain), side2(plain)];
	const n = a * a + b * b;
	return {
		case: 'ipotenusa',
		prompt: "Calcola l'ipotenusa con il teorema di Pitagora.",
		problem: textBlock(plain ? `Un triangolo rettangolo ha i cateti di $${b}$ cm e $${a}$ cm. Quanto misura l'ipotenusa?` : `${INTRO} ${legsData(rng, a, b)}. Quanto misura l'ipotenusa $AB$?`),
		solution: `${S('AB')} = ${cm(T.c)}`,
		steps: [
			`${S2('AB')} = ${S2('AC')} + ${S2('BC')}`,
			`${S('AB')} = \\sqrt{${b}^2 + ${a}^2} = \\sqrt{${b * b} + ${a * a}}`,
			`${S('AB')} = \\sqrt{${n}} = ${cm(T.c)}`,
			...tripleNote(T),
		],
		answer: numberAnswer(int(T.c)),
		value: int(T.c),
		unit: 'cm',
		// The sum of the legs (warning "La radice di una somma"), the legs subtracted, the square taken as a double
		// (a^2 = 2a), and last the root forgotten.
		wrong: [int(a + b), ...(a !== b ? [root(Math.abs(a * a - b * b))] : []), root(2 * (a + b)), int(n)],
		params: { AC: b, BC: a, AB: T.c },
	};
}

const hypLegPlain = (c: number, b: number) => `Un triangolo rettangolo ha l'ipotenusa di $${c}$ cm e un cateto di $${b}$ cm. Quanto misura l'altro cateto?`;
const hypLegData = (rng: Rng, c: number, K: string, b: number) =>
	rng.next() < 0.5 ? `l'ipotenusa $AB$ misura $${c}$ cm e il cateto $${K}$ misura $${b}$ cm` : `il cateto $${K}$ misura $${b}$ cm e l'ipotenusa $AB$ misura $${c}$ cm`;

// ---------------------------------------------------------------------------
// Level 2: a leg from the hypotenuse and the other leg

function level2(rng: Rng): Built {
	const T = pickTriple(rng, 60);
	const [known, asked] = rng.next() < 0.5 ? [T.a, T.b] : [T.b, T.a];
	const plain = rng.next() < 0.4;
	// In the plain text the known leg is b and the asked one a.
	const [K, X] = plain || rng.next() < 0.5 ? ['AC', 'BC'] : ['BC', 'AC'];
	const [S, S2] = [side(plain), side2(plain)];
	const n = T.c * T.c - known * known;
	return {
		case: 'cateto',
		prompt: 'Calcola il cateto con il teorema di Pitagora.',
		problem: textBlock(plain ? hypLegPlain(T.c, known) : `${INTRO} ${hypLegData(rng, T.c, K, known)}. Quanto misura il cateto $${X}$?`),
		solution: `${S(X)} = ${cm(asked)}`,
		steps: [
			`${S2(X)} = ${S2('AB')} - ${S2(K)}`,
			`${S(X)} = \\sqrt{${T.c}^2 - ${known}^2} = \\sqrt{${T.c * T.c} - ${known * known}}`,
			`${S(X)} = \\sqrt{${n}} = ${cm(asked)}`,
			...tripleNote(T),
		],
		answer: numberAnswer(int(asked)),
		value: int(asked),
		unit: 'cm',
		// The squares added (warning "Per il cateto si sottrae"), the lengths subtracted, the square taken as a
		// double, and last the root forgotten.
		wrong: [root(T.c * T.c + known * known), int(T.c - known), root(2 * (T.c - known)), int(n)],
		params: { AB: T.c, [K]: known, [X]: asked },
	};
}

// ---------------------------------------------------------------------------
// Level 3: irrational results to simplify

const L3_HYP: [number, number][] = [];
const L3_CAT: [number, number][] = [];
{
	const ok = (n: number) => {
		const s = root(n);
		return !s.isRational() && s.b >= 2 && s.b <= 12 && s.r <= 30;
	};
	for (let a = 1; a <= 15; a++) for (let b = a; b <= 15; b++) if (ok(a * a + b * b)) L3_HYP.push([a, b]);
	for (let c = 3; c <= 20; c++) for (let b = 1; b < c; b++) if (ok(c * c - b * b)) L3_CAT.push([c, b]);
}

function level3(rng: Rng): Built {
	const c = weighted(rng, [
		['ipotenusa', 1],
		['cateto', 1],
	] as [string, number][]);
	if (c === 'ipotenusa') {
		const [p, r] = rng.pick(L3_HYP);
		const [a, b] = rng.next() < 0.5 ? [p, r] : [r, p]; // a = BC, b = AC
		const n = a * a + b * b;
		const v = root(n);
		const plain = rng.next() < 0.4;
		const S = side(plain);
		return {
			case: c,
			prompt: "Calcola l'ipotenusa e semplifica il radicale.",
			problem: textBlock(plain ? `Un triangolo rettangolo ha i cateti di $${b}$ cm e $${a}$ cm. Quanto misura l'ipotenusa?` : `${INTRO} ${legsData(rng, a, b)}. Quanto misura l'ipotenusa $AB$?`),
			solution: `${S('AB')} = ${cm(v)}`,
			steps: [`${S('AB')} = \\sqrt{${b}^2 + ${a}^2} = \\sqrt{${b * b} + ${a * a}}`, `${S('AB')} = ${rootSteps(n)}${UNIT_TEX.cm}`],
			answer: exprAnswer(v),
			value: v,
			unit: 'cm',
			// The square taken out instead of its root, the sum of the legs, the legs subtracted, no root.
			wrong: [kr(v.b * v.b, v.r), int(a + b), ...(a !== b ? [root(Math.abs(a * a - b * b))] : []), int(n)],
			params: { AC: b, BC: a, radicand: n },
		};
	}
	const [h, known] = rng.pick(L3_CAT);
	const plain = rng.next() < 0.4;
	const [K, X] = plain || rng.next() < 0.5 ? ['AC', 'BC'] : ['BC', 'AC'];
	const S = side(plain);
	const n = h * h - known * known;
	const v = root(n);
	return {
		case: c,
		prompt: 'Calcola il cateto e semplifica il radicale.',
		problem: textBlock(plain ? hypLegPlain(h, known) : `${INTRO} ${hypLegData(rng, h, K, known)}. Quanto misura il cateto $${X}$?`),
		solution: `${S(X)} = ${cm(v)}`,
		steps: [`${S(X)} = \\sqrt{${h}^2 - ${known}^2} = \\sqrt{${h * h} - ${known * known}}`, `${S(X)} = ${rootSteps(n)}${UNIT_TEX.cm}`],
		answer: exprAnswer(v),
		value: v,
		unit: 'cm',
		wrong: [kr(v.b * v.b, v.r), int(h - known), root(h * h + known * known), int(n)],
		params: { AB: h, [K]: known, radicand: n },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the converse. Is the triangle right, and where?

const VERTEX_OPTIONS: ChoiceOption[] = [
	{ latex: `${t('Rettangolo in ')}A`, values: ['A'] },
	{ latex: `${t('Rettangolo in ')}B`, values: ['B'] },
	{ latex: `${t('Rettangolo in ')}C`, values: ['C'] },
	{ latex: t('Non è rettangolo'), values: ['no'] },
];
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

/** Three squared sides make a proper triangle with a single longest side. */
function sidesOk(sq: number[]): boolean {
	const s = [...sq].sort((x, y) => x - y);
	if (s[1] === s[2]) return false;
	const l = s.map(Math.sqrt);
	return l[0] + l[1] > l[2] + 1e-9;
}
const isRight = (sq: number[]) => {
	const s = [...sq].sort((x, y) => x - y);
	return s[0] + s[1] === s[2];
};

/** The case is drawn once; only the numbers are drawn again, so the shares stay those of the spec. */
function retry(rng: Rng, fn: () => Built | null): Built | null {
	for (let i = 0; i < 500; i++) {
		const b = fn();
		if (b) return b;
	}
	return null;
}

function level4(rng: Rng): Built | null {
	const c = weighted(rng, [
		['rettangolo', 1],
		['non rettangolo', 1],
	] as [string, number][]);
	const radical = rng.next() < 0.3;
	return retry(rng, () => build4(rng, c, radical));
}

function build4(rng: Rng, c: string, radical: boolean): Built | null {
	let sq: number[];
	if (c === 'rettangolo') {
		if (!radical) {
			const T = pickTriple(rng, 50);
			sq = [T.a * T.a, T.b * T.b, T.c * T.c];
		} else if (rng.next() < 0.5) {
			const a = rng.int(1, 9);
			const b = rng.int(1, 9);
			if (isSquare(a * a + b * b)) return null;
			sq = [a * a, b * b, a * a + b * b];
		} else {
			const h = rng.int(3, 12);
			const b = rng.int(1, h - 1);
			if (isSquare(h * h - b * b)) return null;
			sq = [h * h, b * b, h * h - b * b];
		}
	} else if (!radical) {
		if (rng.next() < 0.7) {
			const T = pickTriple(rng, 40);
			const s = [T.a, T.b, T.c];
			const i = rng.int(0, 2);
			s[i] += rng.pick([-2, -1, 1, 2]);
			sq = s.map((x) => x * x);
		} else sq = [rng.int(3, 30), rng.int(3, 30), rng.int(3, 30)].map((x) => x * x);
	} else {
		const a = rng.int(1, 9);
		const b = rng.int(2, 9);
		const n = a * a + b * b + rng.pick([-3, -2, -1, 1, 2, 3]);
		if (n < 2 || isSquare(n)) return null;
		sq = [a * a, b * b, n];
	}
	if (sq.some((x) => x <= 0) || !sidesOk(sq) || isRight(sq) !== (c === 'rettangolo')) return null;
	// Sides BC (opposite A), CA (opposite B), AB (opposite C), in random order.
	const names = ['BC', 'CA', 'AB'];
	const opposite: Record<string, string> = { BC: 'A', CA: 'B', AB: 'C' };
	const perm = shuffle(rng, [0, 1, 2]);
	const len: Record<string, Surd> = {};
	const sqOf: Record<string, number> = {};
	names.forEach((nm, i) => {
		sqOf[nm] = sq[perm[i]];
		len[nm] = root(sq[perm[i]]);
	});
	const listed = shuffle(rng, names);
	const given = listed.map((nm) => `$${ov(nm)} = ${len[nm].toLatex()}$ cm`);
	const problem = textBlock(`I lati del triangolo $ABC$ misurano ${given[0]}, ${given[1]} e ${given[2]}. Il triangolo è rettangolo? Se sì, in quale vertice?`);
	const longest = names.reduce((m, nm) => (sqOf[nm] > sqOf[m] ? nm : m));
	const others = names.filter((nm) => nm !== longest);
	const sum = sqOf[others[0]] + sqOf[others[1]];
	const truth = sum === sqOf[longest] ? opposite[longest] : 'no';
	const steps = [
		t('Il lato più lungo è ') + longest,
		`${sqTex(len[others[0]])} + ${sqTex(len[others[1]])} = ${sqOf[others[0]]} + ${sqOf[others[1]]} = ${sum}`,
		`${sqTex(len[longest])} = ${sqOf[longest]}`,
		truth === 'no'
			? `${sum} \\neq ${sqOf[longest]}: ` + t('non è rettangolo')
			: `${sum} = ${sqOf[longest]}: ` + t(`rettangolo in ${truth}, opposto al lato ${longest}`),
	];
	const answer: ChoiceAnswer = { kind: 'choice', options: VERTEX_OPTIONS, correct: VERTEX_OPTIONS.findIndex((o) => o.values[0] === truth) };
	return {
		case: c,
		prompt: 'Stabilisci se il triangolo è rettangolo.',
		problem,
		solution: truth === 'no' ? `ABC ${t(' non è rettangolo')}` : `ABC ${t(` è rettangolo in ${truth}`)}`,
		steps,
		answer,
		params: { sides: sqOf, radicale: radical, right: truth },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the theorems of Euclid

interface Pq {
	p: number;
	q: number;
}
const L5: Record<string, Pq[]> = { catInt: [], catRad: [], proj: [], hInt: [], hRad: [], proj2: [] };
{
	const small = (s: Surd) => s.isRational() || (s.b <= 30 && s.r <= 30);
	for (let p = 1; p <= 36; p++)
		for (let q = 1; q <= 36; q++) {
			const c = p + q;
			if (c > 40) continue;
			const cp = c * p;
			if (isSquare(cp)) {
				L5.catInt.push({ p, q });
				L5.proj.push({ p, q });
			} else if (small(root(cp))) L5.catRad.push({ p, q });
			const pq = p * q;
			if (isSquare(pq)) {
				if (p !== q) L5.hInt.push({ p, q });
				if (p !== q && Math.sqrt(pq) <= 40) L5.proj2.push({ p, q });
			} else if (small(root(pq))) L5.hRad.push({ p, q });
		}
}

function level5(rng: Rng): Built {
	const c = weighted(rng, [
		['cateto', 3],
		['proiezione', 2],
		['altezza', 3],
		['proiezione da altezza', 2],
	] as [string, number][]);
	// The near side: the leg, its projection and the other projection, on the side of A or of B.
	const [N, NP, FP] = rng.next() < 0.5 ? ['AC', 'AH', 'HB'] : ['BC', 'HB', 'AH'];
	const intro = `${INTRO} $CH$ è l'altezza relativa all'ipotenusa.`;
	let problem: string;
	let steps: string[];
	let v: Surd;
	let asked: string;
	let wrong: Surd[];
	let params: Record<string, unknown>;
	if (c === 'cateto') {
		const { p, q } = rng.pick(rng.next() < 0.5 ? L5.catInt : L5.catRad);
		const h = p + q;
		const far = rng.next() < 0.3;
		asked = N;
		v = root(h * p);
		problem = textBlock(
			far
				? `${intro} L'ipotenusa $AB$ misura $${h}$ cm e la proiezione $${FP}$ misura $${q}$ cm. Quanto misura il cateto $${N}$?`
				: `${intro} L'ipotenusa $AB$ misura $${h}$ cm e la proiezione $${NP}$ misura $${p}$ cm. Quanto misura il cateto $${N}$?`,
		);
		steps = [
			...(far ? [`${ov(NP)} = ${ov('AB')} - ${ov(FP)} = ${h} - ${q} = ${p}`] : []),
			`${ov2(N)} = ${ov('AB')} \\cdot ${ov(NP)} = ${h} \\cdot ${p} = ${h * p}`,
			`${ov(N)} = ${rootSteps(h * p)}${UNIT_TEX.cm}`,
		];
		// The other projection (warning "La proiezione giusta"), no root, Pythagoras with the projection.
		wrong = [root(h * q), int(h * p), root(h * h - p * p)];
		params = { AB: h, [far ? FP : NP]: far ? q : p };
	} else if (c === 'proiezione') {
		const { p, q } = rng.pick(L5.proj);
		const h = p + q;
		const b = Math.sqrt(h * p);
		asked = NP;
		v = int(p);
		problem = textBlock(`${intro} L'ipotenusa $AB$ misura $${h}$ cm e il cateto $${N}$ misura $${b}$ cm. Quanto misura la proiezione $${NP}$?`);
		steps = [`${ov2(N)} = ${ov('AB')} \\cdot ${ov(NP)}`, `${ov(NP)} = \\dfrac{${ov2(N)}}{${ov('AB')}} = \\dfrac{${b * b}}{${h}} = ${cm(p)}`];
		// The other projection, the square not divided, the other leg.
		wrong = [int(q), int(b * b), root(h * h - b * b)];
		params = { AB: h, [N]: b };
	} else if (c === 'altezza') {
		const { p, q } = rng.pick(rng.next() < 0.5 ? L5.hInt : L5.hRad);
		const [ah, hb] = NP === 'AH' ? [p, q] : [q, p];
		asked = 'CH';
		v = root(p * q);
		problem = textBlock(`${intro} La proiezione $AH$ misura $${ah}$ cm e la proiezione $HB$ misura $${hb}$ cm. Quanto misura l'altezza $CH$?`);
		steps = [`${ov2('CH')} = ${ov('AH')} \\cdot ${ov('HB')} = ${ah} \\cdot ${hb} = ${p * q}`, `${ov('CH')} = ${rootSteps(p * q)}${UNIT_TEX.cm}`];
		// The mean of the projections, no root, a leg (first theorem), the root of the sum.
		wrong = [frac(p + q, 2), int(p * q), root((p + q) * p), root(p + q)];
		params = { AH: ah, HB: hb };
	} else {
		const { p, q } = rng.pick(L5.proj2);
		const h = Math.sqrt(p * q);
		asked = FP;
		v = int(q);
		problem = textBlock(`${intro} L'altezza $CH$ misura $${h}$ cm e la proiezione $${NP}$ misura $${p}$ cm. Quanto misura la proiezione $${FP}$?`);
		steps = [`${ov2('CH')} = ${ov('AH')} \\cdot ${ov('HB')}`, `${ov(FP)} = \\dfrac{${ov2('CH')}}{${ov(NP)}} = \\dfrac{${h * h}}{${p}} = ${cm(q)}`];
		// The leg of the triangle with CH and the projection, the square not divided, CH as a hypotenuse.
		wrong = [root(h * h + p * p), int(h * h), ...(h !== p ? [root(Math.abs(h * h - p * p))] : []), frac(p * p, h)];
		params = { CH: h, [NP]: p };
	}
	return {
		case: c,
		prompt: 'Usa i teoremi di Euclide.',
		problem,
		solution: `${ov(asked)} = ${cm(v)}`,
		steps,
		answer: exprAnswer(v),
		value: v,
		unit: 'cm',
		wrong,
		params: { ...params, asked },
	};
}

// ---------------------------------------------------------------------------
// Level 6: square, equilateral triangle, 45° and 30°-60° triangles

function level6(rng: Rng): Built {
	const c = weighted(rng, [
		['quadrato', 2.5],
		['equilatero', 2.5],
		['30-60', 3],
		['45', 2],
	] as [string, number][]);
	let text: string;
	let v: Surd;
	let unit: Unit = 'cm';
	let steps: string[];
	let wrong: Surd[];
	let sub: string;
	if (c === 'quadrato') {
		if (rng.next() < 0.5) {
			const l = rng.int(2, 20);
			sub = 'diagonale';
			v = kr(l, 2);
			text = `In un quadrato il lato misura $${l}$ cm. Calcola la diagonale.`;
			steps = [`d = \\ell\\sqrt{2}`, `d = ${cm(v)}`];
			// The two sides added, no root (d^2 = 2l^2), the constant of the equilateral triangle.
			wrong = [int(2 * l), int(2 * l * l), kr(l, 3)];
		} else {
			const d = rng.int(2, 20);
			sub = 'lato';
			v = kr(d, 2, 2);
			text = `In un quadrato la diagonale misura $${d}$ cm. Calcola il lato.`;
			steps = [`\\ell = \\dfrac{d}{\\sqrt{2}} = \\dfrac{${d}}{\\sqrt{2}} = \\dfrac{${d}\\sqrt{2}}{2}`, `\\ell = ${cm(v)}`];
			// Multiplied instead of divided, half the diagonal, the root forgotten (l^2 = d^2 / 2).
			wrong = [kr(d, 2), frac(d, 2), frac(d * d, 2)];
		}
	} else if (c === 'equilatero') {
		const w = rng.int(0, 2);
		if (w === 0) {
			const l = rng.int(2, 20);
			sub = 'altezza';
			v = kr(l, 3, 2);
			text = `In un triangolo equilatero il lato misura $${l}$ cm. Calcola l'altezza.`;
			steps = [`h = \\dfrac{\\ell\\sqrt{3}}{2}`, `h = \\dfrac{${l}\\sqrt{3}}{2} = ${cm(v)}`];
			// Not halved, the constant of the square, no root (h^2 = 3l^2 / 4).
			wrong = [kr(l, 3), kr(l, 2, 2), frac(3 * l * l, 4)];
		} else if (w === 1) {
			const l = rng.int(2, 16);
			sub = 'area';
			v = kr(l * l, 3, 4);
			unit = 'cm2';
			text = `In un triangolo equilatero il lato misura $${l}$ cm. Calcola l'area.`;
			steps = [`h = \\dfrac{${l}\\sqrt{3}}{2} = ${kr(l, 3, 2).toLatex()}`, `A = \\dfrac{\\ell \\cdot h}{2} = \\dfrac{\\ell^2\\sqrt{3}}{4} = ${withUnit(v, 'cm2')}`];
			// Base by height not halved, the height itself, the side squared times root 3.
			wrong = [kr(l * l, 3, 2), kr(l, 3, 2), kr(l * l, 3)];
		} else {
			const k = rng.int(1, 10);
			sub = 'lato da altezza';
			v = int(2 * k);
			text = `In un triangolo equilatero l'altezza misura $${kr(k, 3).toLatex()}$ cm. Calcola il lato.`;
			steps = [`\\dfrac{\\ell\\sqrt{3}}{2} = ${kr(k, 3).toLatex()}`, `\\ell = ${cm(2 * k)}`];
			// Half the side, the height times two, the height times root 3 halved.
			wrong = [int(k), kr(2 * k, 3), frac(3 * k, 2)];
		}
	} else if (c === '30-60') {
		const angle = rng.pick([30, 60]);
		const head = `Un triangolo rettangolo ha un angolo di $${angle}^\\circ$.`;
		const opp = (a: number) => `il cateto opposto all'angolo di $${a}^\\circ$`;
		const Opp = (a: number) => `Il cateto opposto all'angolo di $${a}^\\circ$`;
		const w = rng.int(0, 5);
		if (w <= 1) {
			// The hypotenuse is given: the short leg (even hypotenuse) or the long one.
			const l = w === 0 ? 2 * rng.int(1, 10) : rng.int(2, 20);
			sub = w === 0 ? 'ipotenusa-corto' : 'ipotenusa-lungo';
			text = `${head} L'ipotenusa misura $${l}$ cm. Calcola ${opp(w === 0 ? 30 : 60)}.`;
			if (w === 0) {
				v = int(l / 2);
				steps = [t("È metà di un triangolo equilatero di lato ") + String(l), `${t('cateto opposto a ')}30^\\circ = \\dfrac{${l}}{2} = ${cm(v)}`];
				// The long leg instead of the short one (warning "Il cateto opposto all'angolo di 30°").
				wrong = [kr(l, 3, 2), kr(l, 2, 2), int(2 * l)];
			} else {
				v = kr(l, 3, 2);
				steps = [t("È metà di un triangolo equilatero di lato ") + String(l), `${t('cateto opposto a ')}60^\\circ = \\dfrac{${l}\\sqrt{3}}{2} = ${cm(v)}`];
				wrong = [frac(l, 2), kr(l, 3), kr(l, 2, 2)];
			}
		} else if (w <= 3) {
			// The short leg is given.
			const s = rng.int(1, 12);
			const hyp = w === 2;
			sub = hyp ? 'corto-ipotenusa' : 'corto-lungo';
			text = `${head} ${Opp(30)} misura $${s}$ cm. Calcola ${hyp ? "l'ipotenusa" : opp(60)}.`;
			steps = [t("L'ipotenusa è il doppio del cateto opposto a ") + '30^\\circ' + `: ${2 * s}`];
			if (hyp) {
				v = int(2 * s);
				wrong = [kr(s, 3), frac(s, 2), kr(s, 2)];
			} else {
				v = kr(s, 3);
				steps.push(`${t('cateto opposto a ')}60^\\circ = \\dfrac{${2 * s}\\sqrt{3}}{2} = ${cm(v)}`);
				wrong = [int(2 * s), kr(s, 3, 2), kr(s, 2)];
			}
		} else {
			// The long leg is given as k√3.
			const k = rng.int(1, 12);
			const hyp = w === 4;
			sub = hyp ? 'lungo-ipotenusa' : 'lungo-corto';
			text = `${head} ${Opp(60)} misura $${kr(k, 3).toLatex()}$ cm. Calcola ${hyp ? "l'ipotenusa" : opp(30)}.`;
			steps = [`\\dfrac{\\ell\\sqrt{3}}{2} = ${kr(k, 3).toLatex()} \\quad \\ell = ${2 * k}`];
			if (hyp) {
				v = int(2 * k);
				steps.push(`${t('ipotenusa')} = ${cm(v)}`);
				wrong = [int(k), kr(2 * k, 3), kr(k, 6)];
			} else {
				v = int(k);
				steps.push(`${t('cateto opposto a ')}30^\\circ = \\dfrac{${2 * k}}{2} = ${cm(v)}`);
				wrong = [kr(k, 3, 2), int(2 * k), frac(3 * k, 2)];
			}
		}
	} else {
		const iso = rng.next() < 0.5;
		const head = iso ? 'Un triangolo rettangolo è isoscele.' : 'Un triangolo rettangolo ha un angolo di $45^\\circ$.';
		if (rng.next() < 0.5) {
			const l = rng.int(2, 20);
			sub = 'ipotenusa';
			v = kr(l, 2);
			text = `${head} Un cateto misura $${l}$ cm. Calcola l'ipotenusa.`;
			steps = [t('È metà di un quadrato di lato ') + String(l), `${t('ipotenusa')} = \\ell\\sqrt{2} = ${cm(v)}`];
			wrong = [int(2 * l), kr(l, 3), kr(l, 2, 2)];
		} else {
			const h = rng.int(2, 20);
			sub = 'cateto';
			v = kr(h, 2, 2);
			text = `${head} L'ipotenusa misura $${h}$ cm. Calcola un cateto.`;
			steps = [t("L'ipotenusa è la diagonale del quadrato: ") + `\\ell = \\dfrac{${h}}{\\sqrt{2}}`, `\\ell = ${cm(v)}`];
			wrong = [kr(h, 2), frac(h, 2), kr(h, 3, 2)];
		}
	}
	return {
		case: c,
		prompt: 'Calcola la misura richiesta.',
		problem: textBlock(text),
		solution: withUnit(v, unit),
		steps,
		answer: exprAnswer(v),
		value: v,
		unit,
		wrong,
		params: { sub },
	};
}

// ---------------------------------------------------------------------------
// Level 7: problems with quadrilaterals

function level7(rng: Rng): Built | null {
	const c = weighted(rng, [
		['rettangolo', 1],
		['rombo', 1],
		['trapezio isoscele', 1],
		['trapezio rettangolo', 1],
	] as [string, number][]);
	return retry(rng, () => build7(rng, c));
}

function build7(rng: Rng, c: string): Built | null {
	const T = pickTriple(rng, 30);
	const [x, y] = rng.next() < 0.5 ? [T.a, T.b] : [T.b, T.a];
	const l = T.c;
	let text: string;
	let v: Surd;
	let unit: Unit = 'cm';
	let steps: string[];
	let wrong: Surd[];
	let ask: string;
	const r = rng.int(0, 2);
	if (c === 'rettangolo') {
		const [b, h] = [x, y];
		if (r < 2) {
			ask = rng.pick(['altezza', 'perimetro', 'area']);
			text = `Un rettangolo ha la base di $${b}$ cm e la diagonale di $${l}$ cm. Calcola ${ask === 'altezza' ? "l'altezza" : ask === 'area' ? "l'area" : 'il perimetro'}.`;
			steps = [`h = \\sqrt{${l}^2 - ${b}^2} = \\sqrt{${l * l - b * b}} = ${cm(h)}`];
			if (ask === 'altezza') {
				v = int(h);
				wrong = [int(l - b), root(l * l + b * b), int(l * l - b * b)];
			} else if (ask === 'perimetro') {
				v = int(2 * (b + h));
				steps.push(`2p = 2 \\cdot (${b} + ${h}) = ${cm(v)}`);
				// The diagonal as a side, half the perimeter, the area.
				wrong = [int(2 * (b + l)), int(b + h), int(b * h)];
			} else {
				v = int(b * h);
				unit = 'cm2';
				steps.push(`A = ${b} \\cdot ${h} = ${withUnit(v, 'cm2')}`);
				wrong = [int(b * l), frac(b * h, 2), int(2 * (b + h))];
			}
		} else {
			ask = 'diagonale';
			text = `Un rettangolo ha la base di $${b}$ cm e l'altezza di $${h}$ cm. Calcola la diagonale.`;
			v = int(l);
			steps = [`d = \\sqrt{${b}^2 + ${h}^2} = \\sqrt{${b * b + h * h}} = ${cm(l)}`];
			wrong = [int(b + h), root(Math.abs(b * b - h * h)), int(b * b + h * h)];
		}
	} else if (c === 'rombo') {
		const [D, d] = [2 * x, 2 * y];
		if (r < 2) {
			ask = rng.pick(['lato', 'perimetro']);
			text = `Un rombo ha le diagonali di $${D}$ cm e $${d}$ cm. Calcola ${ask === 'lato' ? 'il lato' : 'il perimetro'}.`;
			steps = [t('Le semidiagonali misurano ') + `${x}\\ ${t('e')}\\ ${y}`, `\\ell = \\sqrt{${x}^2 + ${y}^2} = \\sqrt{${x * x + y * y}} = ${cm(l)}`];
			if (ask === 'lato') {
				v = int(l);
				// The whole diagonals instead of the halves, the mean of the diagonals, the area.
				wrong = [int(2 * l), frac(D + d, 2), int((D * d) / 2)];
			} else {
				v = int(4 * l);
				steps.push(`2p = 4 \\cdot ${l} = ${cm(v)}`);
				wrong = [int(8 * l), int(2 * (D + d)), int(2 * l)];
			}
		} else {
			ask = rng.pick(['altra diagonale', 'area']);
			text = `Un rombo ha il lato di $${l}$ cm e una diagonale di $${D}$ cm. Calcola ${ask === 'area' ? "l'area" : "l'altra diagonale"}.`;
			steps = [`${t('semidiagonale')} = \\sqrt{${l}^2 - ${x}^2} = \\sqrt{${l * l - x * x}} = ${y}`, `d = 2 \\cdot ${y} = ${cm(d)}`];
			if (ask === 'altra diagonale') {
				v = int(d);
				// Only the half, the whole diagonal used as a leg.
				wrong = [int(y), root(4 * (l * l + x * x)), ...(l * l !== D * D ? [root(Math.abs(l * l - D * D))] : [])];
			} else {
				v = int((D * d) / 2);
				unit = 'cm2';
				steps.push(`A = \\dfrac{${D} \\cdot ${d}}{2} = ${withUnit(v, 'cm2')}`);
				wrong = [int(D * d), int(x * y), int(l * D)];
			}
		}
	} else if (c === 'trapezio isoscele') {
		const [e, h] = [x, y];
		// The long base stays within 60 cm.
		const b = rng.int(2, Math.min(20, 60 - 2 * e));
		const B = b + 2 * e;
		if (r < 2) {
			ask = rng.pick(['altezza', 'area']);
			text = `Un trapezio isoscele ha le basi di $${B}$ cm e $${b}$ cm e i lati obliqui di $${l}$ cm. Calcola ${ask === 'area' ? "l'area" : "l'altezza"}.`;
			steps = [`\\dfrac{${B} - ${b}}{2} = ${e}`, `h = \\sqrt{${l}^2 - ${e}^2} = \\sqrt{${l * l - e * e}} = ${cm(h)}`];
			if (ask === 'altezza') {
				v = int(h);
				const noHalf = l * l - (B - b) * (B - b);
				// The difference of the bases not halved, the legs subtracted, the squares added.
				wrong = [...(noHalf > 0 ? [root(noHalf)] : []), int(l - e), root(l * l + e * e)];
			} else {
				v = frac((B + b) * h, 2);
				unit = 'cm2';
				steps.push(`A = \\dfrac{(${B} + ${b}) \\cdot ${h}}{2} = ${withUnit(v, 'cm2')}`);
				// The slanted side instead of the height (warning "Il lato obliquo non è l'altezza"), not halved.
				wrong = [frac((B + b) * l, 2), int((B + b) * h), frac((B - b) * h, 2)];
			}
		} else {
			ask = rng.pick(['lato obliquo', 'perimetro']);
			text = `Un trapezio isoscele ha le basi di $${B}$ cm e $${b}$ cm e l'altezza di $${h}$ cm. Calcola ${ask === 'perimetro' ? 'il perimetro' : 'il lato obliquo'}.`;
			steps = [`\\dfrac{${B} - ${b}}{2} = ${e}`, `\\ell = \\sqrt{${e}^2 + ${h}^2} = \\sqrt{${e * e + h * h}} = ${cm(l)}`];
			if (ask === 'lato obliquo') {
				v = int(l);
				wrong = [root((B - b) * (B - b) + h * h), int(e + h), ...(h !== e ? [root(Math.abs(h * h - e * e))] : [])];
			} else {
				v = int(B + b + 2 * l);
				steps.push(`2p = ${B} + ${b} + 2 \\cdot ${l} = ${cm(v)}`);
				wrong = [int(B + b + l), int(B + b + 2 * h), int(B + b + 2 * (e + h))];
			}
		}
	} else {
		const b = rng.int(2, 20);
		const [e, h] = [x, y];
		const B = b + e;
		if (r < 2) {
			ask = rng.pick(['lato obliquo', 'perimetro']);
			text = `Un trapezio rettangolo ha le basi di $${B}$ cm e $${b}$ cm e l'altezza di $${h}$ cm. Calcola ${ask === 'perimetro' ? 'il perimetro' : 'il lato obliquo'}.`;
			steps = [`${B} - ${b} = ${e}`, `\\ell = \\sqrt{${e}^2 + ${h}^2} = \\sqrt{${e * e + h * h}} = ${cm(l)}`];
			if (ask === 'lato obliquo') {
				v = int(l);
				// The long base instead of the difference, the legs added, the short base.
				wrong = [root(B * B + h * h), int(e + h), root(b * b + h * h)];
			} else {
				v = int(B + b + h + l);
				steps.push(`2p = ${B} + ${b} + ${h} + ${l} = ${cm(v)}`);
				// The height forgotten, the slanted side counted twice, the height counted twice.
				wrong = [int(B + b + l), int(B + b + 2 * l), int(B + b + 2 * h)];
			}
		} else {
			ask = rng.pick(['altezza', 'area']);
			text = `Un trapezio rettangolo ha le basi di $${B}$ cm e $${b}$ cm e il lato obliquo di $${l}$ cm. Calcola ${ask === 'area' ? "l'area" : "l'altezza"}.`;
			steps = [`${B} - ${b} = ${e}`, `h = \\sqrt{${l}^2 - ${e}^2} = \\sqrt{${l * l - e * e}} = ${cm(h)}`];
			if (ask === 'altezza') {
				v = int(h);
				wrong = [root(l * l + e * e), int(l - e), ...(l * l !== B * B ? [root(Math.abs(l * l - B * B))] : [])];
			} else {
				if (((B + b) * h) % 2 !== 0) return null;
				v = int(((B + b) * h) / 2);
				unit = 'cm2';
				steps.push(`A = \\dfrac{(${B} + ${b}) \\cdot ${h}}{2} = ${withUnit(v, 'cm2')}`);
				wrong = [frac((B + b) * l, 2), int((B + b) * h), int(B * h)];
			}
		}
	}
	if (!v.isRational() || v.toRational().den !== 1) return null;
	return {
		case: c,
		prompt: 'Risolvi il problema con il teorema di Pitagora.',
		problem: textBlock(text),
		solution: withUnit(v, unit),
		steps,
		answer: numberAnswer(v),
		value: v,
		unit,
		wrong,
		params: { ask },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

const FORBIDDEN: [string, RegExp][] = [
	['+ -', /\+\s*-/],
	['- -', /-\s*-/],
	['1\\sqrt', /(?<!\d)1\\sqrt/],
	['trattino lungo', /—/],
	['piuttosto che', /piuttosto che/],
];

const ANSWER_KIND: Record<number, string> = { 1: 'number', 2: 'number', 3: 'expression', 4: 'choice', 5: 'expression', 6: 'expression', 7: 'number' };

const surdOf = (a: [number, number, number, number]) => Surd.of(a[0], a[1], a[2], a[3]);
const surdArr = (s: Surd): [number, number, number, number] => [s.a, s.b, s.r, s.d];

function check(sample: Sample): string[] {
	const v: string[] = [];
	for (const [name, rx] of FORBIDDEN) if (rx.test(sample.problem)) v.push(`testo con '${name}'`);
	if (!sample.steps.length || !sample.solution) v.push('passaggi o soluzione mancanti');
	const a = sample.answer;
	if (ANSWER_KIND[sample.level] !== a.kind) v.push(`risposta ${a.kind} al livello ${sample.level}`);
	if (a.kind === 'choice' && a.options.length !== 4) v.push('servono quattro opzioni');
	if (a.kind === 'number' || a.kind === 'expression') {
		const val = surdOf(sample.params.surd as [number, number, number, number]);
		if (val.value() <= 0) v.push('misura non positiva');
		if (val.toString() !== a.value) v.push('valore diverso da params.surd');
		if (a.kind === 'number' && (!val.isRational() || val.toRational().den !== 1)) v.push('risposta non intera');
		if (a.kind === 'expression' && a.form !== 'simplified') v.push('forma richiesta mancante');
		if (sample.level === 3 && (val.isRational() || val.b < 2)) v.push('radicale che non si semplifica');
	}
	const c = sample.choice;
	if (c) {
		if (c.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(c.options.map((o) => o.values.join('|'))).size !== c.options.length) v.push('opzioni ripetute');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'choice') return a;
	const unit = sample.params.unit as Unit;
	const val = surdOf(sample.params.surd as [number, number, number, number]);
	const opt = (s: Surd): ChoiceOption => ({ latex: withUnit(s, unit), values: [s.toString()] });
	const wrong = ((sample.params.wrong as [number, number, number, number][]) ?? []).map(surdOf).filter((w) => w.value() > 0 && !w.equals(val));
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const sign = i % 2 ? -1 : 1;
		const s = val.isRational() ? Surd.of(val.a + sign * k * val.d, 0, 1, val.d) : Surd.of(0, val.b + sign * k, val.r, val.d);
		return s.value() > 0 ? opt(s) : null;
	};
	return buildChoice(rng, opt(val), wrong.map(opt), fallback);
}

export const teoremaDiPitagora: Generator = {
	id: ID,
	title: 'Teoremi di Pitagora e di Euclide',
	levels: {
		1: { label: "L'ipotenusa dai cateti", constraints: ['terne pitagoriche della lezione e loro multipli, ipotenusa fino a 60'] },
		2: { label: "Un cateto dall'ipotenusa", constraints: ['terne pitagoriche della lezione e loro multipli, ipotenusa fino a 60'] },
		3: { label: 'Radicali da semplificare', constraints: ['metà ipotenusa, metà cateto', 'risultato k√r con k da 2 a 12 e r fino a 30'] },
		4: { label: "L'inverso di Pitagora", constraints: ['metà rettangoli, metà no', '3 su 10 con un lato radicale'] },
		5: { label: 'I teoremi di Euclide', constraints: ['cateto 3, proiezione 2, altezza 3, proiezione dall’altezza 2 su 10', 'ipotenusa fino a 40'] },
		6: { label: 'Quadrato, equilatero, 45° e 30°-60°', constraints: ['quadrato 2,5, equilatero 2,5, 30°-60° 3, 45° 2 su 10'] },
		7: { label: 'Problemi con i quadrilateri', constraints: ['rettangolo, rombo, trapezio isoscele e rettangolo, un quarto ciascuno', 'risposta intera'] },
	},
	generate(rng: Rng, level: number): Sample {
		const fn = LEVELS[level];
		if (!fn) throw new Error(`${ID}: unknown level ${level}`);
		// With consecutive seeds the first draws of rng.ts are not uniform: skip two before the case.
		rng.next();
		rng.next();
		for (let attempt = 0; attempt < 2000; attempt++) {
			const b = fn(rng);
			if (!b) continue;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params: { case: b.case, ...b.params },
			};
			if (b.value) {
				sample.params.surd = surdArr(b.value);
				sample.params.unit = b.unit;
				sample.params.wrong = (b.wrong ?? []).map(surdArr);
			}
			if (check(sample).length) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default teoremaDiPitagora;
