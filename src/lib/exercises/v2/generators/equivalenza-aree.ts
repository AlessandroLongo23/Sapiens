/**
 * Equivalenza e aree. Spec: specs/exercises/equivalenza-aree.md
 *
 * Six levels from the lesson (docs/lezioni/riscritte/98-equivalenza-aree.md), all on the text alone (no figure):
 * the area of a rectangle, square, parallelogram, triangle, trapezio or rhombus from its data; changing the unit of
 * an area (also a rectangle with sides in different units); a measure from the area (a height, a base, a
 * diagonal); the second height of a parallelogram or of a triangle and the height on the hypotenuse; the area of a
 * regular polygon from side (or perimeter) and apothem; composite and equivalent figures. Every level has a number
 * answer, an exact terminating decimal ("48/5" is 9,6), and a multiple-choice variant whose distractors are the
 * mistakes the lesson warns about (the oblique side as the height, the missing "diviso due", factor 10 for areas).
 *
 * Numbers are built backwards: the figure first, then the data. Decimal comma {,}, thousands with \, from five
 * digits (35\,000, 5400), lengths "$12$ cm" and areas "$96\ \text{cm}^2$" as in the lesson.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { Rational, q } from '../rational';

export const ID = 'equivalenza-aree';

type R = Rational;
const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Terminating decimals

/** Number of decimal digits of r, or Infinity if its decimal expansion does not end. */
function decimals(r: R): number {
	let d = r.den;
	let k2 = 0;
	let k5 = 0;
	while (d % 2 === 0) {
		d /= 2;
		k2++;
	}
	while (d % 5 === 0) {
		d /= 5;
		k5++;
	}
	return d === 1 ? Math.max(k2, k5) : Infinity;
}

/** A non-negative terminating decimal in LaTeX: 9{,}6, 5400, 35\,000, 0{,}0035. */
function dec(r: R): string {
	const k = decimals(r);
	if (!Number.isFinite(k) || r.sign() < 0) throw new Error(`${ID}: ${r} is not a positive terminating decimal`);
	const scaled = String(r.num * (10 ** k / r.den)).padStart(k + 1, '0');
	let int = scaled.slice(0, scaled.length - k);
	const frac = scaled.slice(scaled.length - k);
	if (int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return frac ? `${int}{,}${frac}` : int;
}

const len = (r: R, u = 'cm') => `${dec(r)}\\ \\text{${u}}`;
const sq = (r: R, u = 'cm') => `${dec(r)}\\ \\text{${u}}^2`;
/** In prose: "$12$ cm" and "$96\ \text{cm}^2$". */
const pLen = (r: R, u = 'cm') => `$${dec(r)}$ ${u}`;
const pSq = (r: R, u = 'cm') => `$${sq(r, u)}$`;
const n = (x: number) => q(x);
const nice = (r: R, maxDec = 2) => r.sign() > 0 && decimals(r) <= maxDec;

/** An integer from lo to hi, or with probability pDec a number with one decimal digit in the same range. */
function measure(rng: Rng, lo: number, hi: number, pDec: number): R {
	if (rng.next() >= pDec) return n(rng.int(lo, hi));
	for (;;) {
		const x = rng.int(lo * 10 + 1, hi * 10 - 1);
		if (x % 10) return q(x, 10);
	}
}

// ---------------------------------------------------------------------------
// Multiple choice: the mistakes first, then values near the answer

function numberOptions(rng: Rng, value: R, mistakes: R[], unit: string, square: boolean, maxDec: number): ChoiceAnswer {
	const fmt = (r: R) => (square ? sq(r, unit) : len(r, unit));
	const seen = new Set([value.toString()]);
	const opts: ChoiceOption[] = [{ latex: fmt(value), values: [value.toString()] }];
	const e = Math.floor(Math.log10(value.num / value.den)) - 1;
	const stepD = Math.max(e >= 0 ? 0 : -e, decimals(value));
	const step = e >= 0 && stepD === 0 ? n(10 ** e) : q(1, 10 ** Math.min(stepD, 4));
	const near = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((k) => [value.add(step.mul(n(k))), value.sub(step.mul(n(k)))]);
	for (const c of [...mistakes, ...near]) {
		if (opts.length >= 4) break;
		if (!(c.sign() > 0 && decimals(c) <= maxDec && c.compare(n(1e9)) < 0) || seen.has(c.toString())) continue;
		seen.add(c.toString());
		opts.push({ latex: fmt(c), values: [c.toString()] });
	}
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: R;
	unit: string;
	square: boolean;
	mistakes: R[];
	params: Record<string, unknown>;
}

const AREA = "Calcola l'area.";
const FIND = 'Trova la misura.';

// ---------------------------------------------------------------------------
// Level 1: the area of a figure from its data

const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[6, 8, 10],
	[5, 12, 13],
	[9, 12, 15],
	[8, 15, 17],
	[12, 16, 20],
	[15, 20, 25],
	[7, 24, 25],
	[10, 24, 26],
	[20, 21, 29],
	[18, 24, 30],
];

function level1(rng: Rng): Built {
	const kind = rng.pick(['rettangolo', 'quadrato', 'parallelogramma', 'triangolo', 'trapezio', 'rombo'] as const);
	const Q = "Quanto misura l'area?";
	const base = { prompt: AREA, unit: 'cm', square: true };
	switch (kind) {
		case 'rettangolo': {
			const b = rng.int(3, 25);
			let h = rng.int(3, 25);
			while (h === b) h = rng.int(3, 25);
			const A = n(b * h);
			return {
				...base,
				problem: textBlock(`Un rettangolo ha la base di ${pLen(n(b))} e l'altezza di ${pLen(n(h))}. ${Q}`),
				solution: `A = ${sq(A)}`,
				steps: [`A = b \\cdot h = ${b} \\cdot ${h} = ${sq(A)}`],
				answer: A,
				// the perimeter; divided by two as a triangle; the sum of the sides
				mistakes: [n(2 * (b + h)), q(b * h, 2), n(b + h)],
				params: { case: kind, b, h },
			};
		}
		case 'quadrato': {
			if (rng.next() < 0.5) {
				const l = rng.int(3, 25);
				return {
					...base,
					problem: textBlock(`Un quadrato ha il lato di ${pLen(n(l))}. ${Q}`),
					solution: `A = ${sq(n(l * l))}`,
					steps: [`A = \\ell^2 = ${l}^2 = ${sq(n(l * l))}`],
					answer: n(l * l),
					// the perimeter; half the square; twice the side
					mistakes: [n(4 * l), q(l * l, 2), n(2 * l)],
					params: { case: kind, sub: 'lato', l },
				};
			}
			const d = 2 * rng.int(2, 13);
			const A = q(d * d, 2);
			return {
				...base,
				problem: textBlock(`Un quadrato ha la diagonale di ${pLen(n(d))}. ${Q}`),
				solution: `A = ${sq(A)}`,
				steps: [
					`${t('Le diagonali del quadrato sono perpendicolari e congruenti: ')} A = \\dfrac{d^2}{2}`,
					`A = \\dfrac{${d}^2}{2} = \\dfrac{${d * d}}{2} = ${sq(A)}`,
				],
				answer: A,
				// the diagonal squared as if it were the side; divided by four; twice the diagonal
				mistakes: [n(d * d), q(d * d, 4), n(2 * d)],
				params: { case: kind, sub: 'diagonale', d },
			};
		}
		case 'parallelogramma': {
			const b = rng.int(6, 25);
			let s = rng.int(4, 20);
			while (s === b) s = rng.int(4, 20);
			const h = rng.int(2, s - 1);
			const A = n(b * h);
			return {
				...base,
				problem: textBlock(
					`Nel parallelogramma $ABCD$ la base $AB$ misura ${pLen(n(b))}, il lato $AD$ misura ${pLen(n(s))} e l'altezza $DH$ relativa ad $AB$ misura ${pLen(n(h))}. ${Q}`,
				),
				solution: `A = ${sq(A)}`,
				steps: [
					`${t("L'altezza relativa ad ")} AB ${t(' è ')} DH${t(': il lato ')} AD ${t(' è obliquo e non serve')}`,
					`A = \\overline{AB} \\cdot \\overline{DH} = ${b} \\cdot ${h} = ${sq(A)}`,
				],
				answer: A,
				// the oblique side as the height; halved as a triangle; the perimeter
				mistakes: [n(b * s), q(b * h, 2), n(2 * (b + s))],
				params: { case: kind, b, s, h },
			};
		}
		case 'triangolo': {
			if (rng.next() < 0.5) {
				let b: number, h: number;
				do {
					b = rng.int(4, 24);
					h = rng.int(3, 20);
				} while ((b * h) % 2 || b === h);
				const A = q(b * h, 2);
				return {
					...base,
					problem: textBlock(`Un triangolo ha la base di ${pLen(n(b))} e l'altezza relativa alla base di ${pLen(n(h))}. ${Q}`),
					solution: `A = ${sq(A)}`,
					steps: [`A = \\dfrac{b \\cdot h}{2} = \\dfrac{${b} \\cdot ${h}}{2} = ${sq(A)}`],
					answer: A,
					// without the "diviso due"; divided by four; the sum
					mistakes: [n(b * h), q(b * h, 4), n(b + h)],
					params: { case: kind, sub: 'base-altezza', b, h },
				};
			}
			const [x, y, z] = rng.pick(TRIPLES);
			const [a, c] = rng.next() < 0.5 ? [x, y] : [y, x];
			const A = q(a * c, 2);
			return {
				...base,
				problem: textBlock(
					`Il triangolo $ABC$ è rettangolo in $C$: i cateti misurano $\\overline{AC} = ${a}$ cm e $\\overline{BC} = ${c}$ cm, l'ipotenusa $\\overline{AB} = ${z}$ cm. ${Q}`,
				),
				solution: `A = ${sq(A)}`,
				steps: [
					`${t("I cateti sono perpendicolari: uno è l'altezza relativa all'altro")}`,
					`A = \\dfrac{\\overline{AC} \\cdot \\overline{BC}}{2} = \\dfrac{${a} \\cdot ${c}}{2} = ${sq(A)}`,
				],
				answer: A,
				// without the "diviso due"; the hypotenuse with a leg
				mistakes: [n(a * c), q(a * z, 2), q(c * z, 2)],
				params: { case: kind, sub: 'rettangolo', a, c, ip: z },
			};
		}
		case 'trapezio': {
			let B: number, b: number, h: number;
			do {
				B = rng.int(8, 25);
				b = rng.int(3, B - 2);
				h = rng.int(3, 15);
			} while (((B + b) * h) % 2);
			const A = q((B + b) * h, 2);
			return {
				...base,
				problem: textBlock(`Un trapezio ha le basi di ${pLen(n(B))} e di ${pLen(n(b))} e l'altezza di ${pLen(n(h))}. ${Q}`),
				solution: `A = ${sq(A)}`,
				steps: [`A = \\dfrac{(B + b) \\cdot h}{2} = \\dfrac{(${B} + ${b}) \\cdot ${h}}{2} = \\dfrac{${B + b} \\cdot ${h}}{2} = ${sq(A)}`],
				answer: A,
				// one base only; without the "diviso due"; the difference of the bases
				mistakes: [q(B * h, 2), n((B + b) * h), q((B - b) * h, 2)],
				params: { case: kind, B, b, h },
			};
		}
		case 'rombo': {
			let d1: number, d2: number;
			do {
				d1 = rng.int(4, 24);
				d2 = rng.int(4, 24);
			} while ((d1 * d2) % 2 || d1 === d2);
			const A = q(d1 * d2, 2);
			return {
				...base,
				problem: textBlock(`Un rombo ha le diagonali di ${pLen(n(d1))} e di ${pLen(n(d2))}. ${Q}`),
				solution: `A = ${sq(A)}`,
				steps: [
					`${t('Le diagonali del rombo sono perpendicolari: ')} A = \\dfrac{d_1 \\cdot d_2}{2}`,
					`A = \\dfrac{${d1} \\cdot ${d2}}{2} = ${sq(A)}`,
				],
				answer: A,
				// without the "diviso due"; divided by four; twice the sum
				mistakes: [n(d1 * d2), q(d1 * d2, 4), n(2 * (d1 + d2))],
				params: { case: kind, d1, d2 },
			};
		}
	}
}

// ---------------------------------------------------------------------------
// Level 2: units of area

const U = ['m', 'dm', 'cm', 'mm'];
const pow = (b: number, k: number) => (k >= 0 ? n(b ** k) : q(1, b ** -k));
const factorTex = (k: number) => Array(Math.abs(k)).fill('100').join(' \\cdot ');

function level2(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const i = rng.int(0, 3);
			const j = rng.int(0, 3);
			if (i === j) continue;
			const m = rng.int(2, 999);
			if (m % 10 === 0) continue;
			const src = q(m, 10 ** rng.int(0, 2));
			const k = j - i; // > 0: towards a smaller unit, multiply by 100 at each step
			const tgt = src.mul(pow(100, k));
			if (decimals(tgt) > 4 || tgt.compare(n(1e7)) > 0) continue;
			const steps = Math.abs(k);
			const f = n(100 ** steps);
			const passi = steps === 1 ? "c'è un passo" : `ci sono ${steps === 2 ? 'due' : 'tre'} passi`;
			const verso = k > 0 ? "verso l'unità più piccola: si moltiplica per" : "verso l'unità più grande: si divide per";
			const fTex = steps === 1 ? '100' : `${factorTex(k)} = ${dec(f)}`;
			const sgn = Math.sign(k);
			return {
				prompt: "Cambia l'unità di misura.",
				problem: textBlock(`Esprimi ${pSq(src, U[i])} in $\\text{${U[j]}}^2$.`),
				solution: `${sq(src, U[i])} = ${sq(tgt, U[j])}`,
				steps: [
					`${t('Da ')} \\text{${U[i]}}^2 ${t(' a ')} \\text{${U[j]}}^2 ${t(` ${passi} ${verso} `)} ${fTex}`,
					`${dec(src)} ${k > 0 ? '\\cdot' : ':'} ${dec(f)} = ${sq(tgt, U[j])}`,
				],
				answer: tgt,
				unit: U[j],
				square: true,
				// factor 10 at each step (as for lengths); the wrong direction; one step less or more
				mistakes: [src.mul(pow(10, k)), src.mul(pow(100, -k)), src.mul(pow(100, k - sgn)), src.mul(pow(100, k + sgn))],
				params: { case: 'conversione', from: U[i], to: U[j], value: src.toString() },
			};
		}
	}
	const i = rng.int(0, 2);
	const j = i + rng.int(1, Math.min(2, 3 - i));
	let m = rng.int(11, 99);
	while (m % 10 === 0) m = rng.int(11, 99);
	const b = q(m, 10);
	const h = rng.int(5, 95);
	const bJ = b.mul(pow(10, j - i));
	const areaJ = bJ.mul(n(h));
	const askSmall = rng.next() < 2 / 3;
	const ask = askSmall ? j : i;
	const ans = askSmall ? areaJ : areaJ.mul(pow(100, i - j));
	const raw = b.mul(n(h));
	const wrongLen = b.mul(pow(100, j - i)).mul(n(h)); // the side converted with the factor of areas
	const steps = [
		`${t('Le due misure vanno portate alla stessa unità: ')} ${len(b, U[i])} = ${len(bJ, U[j])}`,
		`A = ${dec(bJ)} \\cdot ${h} = ${sq(areaJ, U[j])}`,
	];
	if (!askSmall) steps.push(`${sq(areaJ, U[j])} = ${dec(areaJ)} : ${dec(pow(100, j - i))} = ${sq(ans, U[i])}`);
	return {
		prompt: AREA,
		problem: textBlock(`Un rettangolo ha la base di ${pLen(b, U[i])} e l'altezza di ${pLen(n(h), U[j])}. Quanto misura l'area in $\\text{${U[ask]}}^2$?`),
		solution: `A = ${sq(ans, U[ask])}`,
		steps,
		answer: ans,
		unit: U[ask],
		square: true,
		// the product of the numbers as they are; the side converted with 100 per step; not converted back (or with 10)
		mistakes: askSmall
			? [raw, wrongLen, areaJ.mul(pow(10, i - j))]
			: [raw, areaJ, areaJ.mul(pow(10, i - j)), wrongLen.mul(pow(100, i - j))],
		params: { case: 'rettangolo', base: [b.toString(), U[i]], altezza: [String(h), U[j]], ask: U[ask] },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a measure from the area

function level3(rng: Rng): Built {
	const kind = rng.pick(['triangolo', 'trapezio', 'rombo', 'parallelogramma'] as const);
	const base = { prompt: FIND, unit: 'cm', square: false };
	switch (kind) {
		case 'triangolo': {
			let b: R, h: R, A: R;
			do {
				b = n(rng.int(4, 20));
				h = measure(rng, 3, 25, 0.3);
				A = b.mul(h).div(n(2));
			} while (!A.isInteger() || b.equals(h));
			const askH = rng.next() < 0.6;
			const [known, ans] = askH ? [b, h] : [h, b];
			const problem = askH
				? `Un triangolo ha l'area di ${pSq(A)} e la base di ${pLen(b)}. Quanto misura l'altezza relativa alla base?`
				: `Un triangolo ha l'area di ${pSq(A)} e l'altezza relativa alla base di ${pLen(h)}. Quanto misura la base?`;
			const x = askH ? 'h' : 'b';
			return {
				...base,
				problem: textBlock(problem),
				solution: `${x} = ${len(ans)}`,
				steps: [
					`\\dfrac{b \\cdot h}{2} = A \\quad\\Rightarrow\\quad \\dfrac{${dec(known)} \\cdot ${x}}{2} = ${dec(A)}`,
					`${t("Si moltiplica per 2 l'area: ")} ${dec(known)} \\cdot ${x} = ${dec(A.mul(n(2)))}`,
					`${x} = ${dec(A.mul(n(2)))} : ${dec(known)} = ${len(ans)}`,
				],
				answer: ans,
				// the area divided without the 2; divided by 2 twice; twice the answer
				mistakes: [A.div(known), A.div(known).div(n(2)), ans.mul(n(2))],
				params: { case: kind, sub: askH ? 'altezza' : 'base', A: A.toString(), b: b.toString(), h: h.toString() },
			};
		}
		case 'trapezio': {
			let B: number, b: number, h: R, A: R;
			do {
				B = rng.int(8, 24);
				b = rng.int(3, B - 2);
				h = measure(rng, 3, 20, 0.3);
				A = n(B + b).mul(h).div(n(2));
			} while (!A.isInteger());
			if (rng.next() < 0.65) {
				return {
					...base,
					problem: textBlock(`Un trapezio ha l'area di ${pSq(A)} e le basi di ${pLen(n(B))} e di ${pLen(n(b))}. Quanto misura l'altezza?`),
					solution: `h = ${len(h)}`,
					steps: [
						`\\dfrac{(${B} + ${b}) \\cdot h}{2} = ${dec(A)}`,
						`${t('Si moltiplica per 2: ')} ${B + b} \\cdot h = ${dec(A.mul(n(2)))}`,
						`h = ${dec(A.mul(n(2)))} : ${B + b} = ${len(h)}`,
					],
					answer: h,
					// without the 2; one base only (the larger, the smaller)
					mistakes: [A.div(n(B + b)), A.mul(n(2)).div(n(B)), A.mul(n(2)).div(n(b))],
					params: { case: kind, sub: 'altezza', A: A.toString(), B, b, h: h.toString() },
				};
			}
			const S = A.mul(n(2)).div(h);
			return {
				...base,
				problem: textBlock(`Un trapezio ha l'area di ${pSq(A)}, la base maggiore di ${pLen(n(B))} e l'altezza di ${pLen(h)}. Quanto misura la base minore?`),
				solution: `b = ${len(n(b))}`,
				steps: [
					`\\dfrac{(${B} + b) \\cdot ${dec(h)}}{2} = ${dec(A)}`,
					`${t('Si moltiplica per 2 e si divide per ')} ${dec(h)}\\text{: } ${B} + b = ${dec(A.mul(n(2)))} : ${dec(h)} = ${dec(S)}`,
					`b = ${dec(S)} - ${B} = ${len(n(b))}`,
				],
				answer: n(b),
				// without the 2; the sum of the bases; the area over the height
				mistakes: [A.div(h).sub(n(B)), S, A.div(h)],
				params: { case: kind, sub: 'base', A: A.toString(), B, b, h: h.toString() },
			};
		}
		case 'rombo': {
			let d1: number, d2: R, A: R;
			do {
				d1 = rng.int(4, 24);
				d2 = measure(rng, 4, 24, 0.25);
				A = n(d1).mul(d2).div(n(2));
			} while (!A.isInteger() || d2.equals(n(d1)));
			return {
				...base,
				problem: textBlock(`Un rombo ha l'area di ${pSq(A)} e la diagonale $AC$ di ${pLen(n(d1))}. Quanto misura la diagonale $BD$?`),
				solution: `\\overline{BD} = ${len(d2)}`,
				steps: [
					`\\dfrac{\\overline{AC} \\cdot \\overline{BD}}{2} = A \\quad\\Rightarrow\\quad \\dfrac{${d1} \\cdot \\overline{BD}}{2} = ${dec(A)}`,
					`${d1} \\cdot \\overline{BD} = ${dec(A.mul(n(2)))}`,
					`\\overline{BD} = ${dec(A.mul(n(2)))} : ${d1} = ${len(d2)}`,
				],
				answer: d2,
				// without the 2; divided by 2 twice; twice the answer
				mistakes: [A.div(n(d1)), A.div(n(2 * d1)), d2.mul(n(2))],
				params: { case: kind, A: A.toString(), d1, d2: d2.toString() },
			};
		}
		case 'parallelogramma': {
			let b: number, h: R, A: R;
			do {
				b = rng.int(4, 20);
				h = measure(rng, 3, 25, 0.3);
				A = n(b).mul(h);
			} while (!A.isInteger() || h.equals(n(b)));
			return {
				...base,
				problem: textBlock(`Un parallelogramma ha l'area di ${pSq(A)} e la base di ${pLen(n(b))}. Quanto misura l'altezza relativa alla base?`),
				solution: `h = ${len(h)}`,
				steps: [`b \\cdot h = A \\quad\\Rightarrow\\quad ${b} \\cdot h = ${dec(A)}`, `h = ${dec(A)} : ${b} = ${len(h)}`],
				answer: h,
				// the triangle formula (times 2); halved; the area minus the base
				mistakes: [A.mul(n(2)).div(n(b)), A.div(n(2 * b)), A.sub(n(b))],
				params: { case: kind, A: A.toString(), b, h: h.toString() },
			};
		}
	}
}

// ---------------------------------------------------------------------------
// Level 4: the other height of a parallelogram or a triangle, the height on the hypotenuse

function level4(rng: Rng): Built {
	const kind = rng.pick(['parallelogramma', 'triangolo', 'rettangolo'] as const);
	const base = { prompt: FIND, unit: 'cm', square: false };
	if (kind === 'parallelogramma') {
		for (;;) {
			const b = rng.int(6, 25);
			const s = rng.int(4, 20);
			if (s === b) continue;
			const h = rng.int(2, s - 1);
			const k = q(b * h, s);
			if (!nice(k)) continue;
			const A = n(b * h);
			const intro = `Nel parallelogramma $ABCD$ il lato $AB$ misura ${pLen(n(b))}, il lato $AD$ misura ${pLen(n(s))} e`;
			if (rng.next() < 0.6) {
				return {
					...base,
					problem: textBlock(`${intro} l'altezza $DH$ relativa ad $AB$ misura ${pLen(n(h))}. Quanto misura l'altezza $BK$ relativa ad $AD$?`),
					solution: `\\overline{BK} = ${len(k)}`,
					steps: [
						`A = \\overline{AB} \\cdot \\overline{DH} = ${b} \\cdot ${h} = ${sq(A)}`,
						`${t('La stessa area con il lato ')} AD\\text{: } ${s} \\cdot \\overline{BK} = ${b * h}`,
						`\\overline{BK} = ${b * h} : ${s} = ${len(k)}`,
						`${t('Controllo: ')} \\overline{BK} < \\overline{AB}${t(', perché ')} BA ${t(' è obliquo rispetto alla retta ')} AD`,
					],
					answer: k,
					// the ratio upside down (longer than AB: impossible); the sides swapped; halved as a triangle
					mistakes: [q(b * s, h), q(s * h, b), q(b * h, 2 * s)],
					params: { case: kind, sub: 'BK', b, s, h, k: k.toString() },
				};
			}
			return {
				...base,
				problem: textBlock(`${intro} l'altezza $BK$ relativa ad $AD$ misura ${pLen(k)}. Quanto misura l'altezza $DH$ relativa ad $AB$?`),
				solution: `\\overline{DH} = ${len(n(h))}`,
				steps: [
					`A = \\overline{AD} \\cdot \\overline{BK} = ${s} \\cdot ${dec(k)} = ${sq(A)}`,
					`${t('La stessa area con il lato ')} AB\\text{: } ${b} \\cdot \\overline{DH} = ${b * h}`,
					`\\overline{DH} = ${b * h} : ${b} = ${len(n(h))}`,
					`${t('Controllo: ')} \\overline{DH} < \\overline{AD}${t(', perché ')} AD ${t(' è obliquo rispetto alla retta ')} AB`,
				],
				answer: n(h),
				// the ratio upside down; the sides swapped; halved as a triangle
				mistakes: [n(s).mul(n(b)).div(k), n(b).mul(k).div(n(s)), n(h).div(n(2))],
				params: { case: kind, sub: 'DH', b, s, h, k: k.toString() },
			};
		}
	}
	if (kind === 'triangolo') {
		for (;;) {
			const c = rng.int(6, 25);
			const a = rng.int(4, 20);
			if (a === c) continue;
			const h = rng.int(2, a - 1);
			const ak = q(c * h, a);
			if (!nice(ak)) continue;
			const A = q(c * h, 2);
			return {
				...base,
				problem: textBlock(
					`Nel triangolo $ABC$ il lato $AB$ misura ${pLen(n(c))}, il lato $BC$ misura ${pLen(n(a))} e l'altezza $CH$ relativa ad $AB$ misura ${pLen(n(h))}. Quanto misura l'altezza $AK$ relativa a $BC$?`,
				),
				solution: `\\overline{AK} = ${len(ak)}`,
				steps: [
					`A = \\dfrac{\\overline{AB} \\cdot \\overline{CH}}{2} = \\dfrac{${c} \\cdot ${h}}{2} = ${sq(A)}`,
					`${t('La stessa area con la base ')} BC\\text{: } \\dfrac{${a} \\cdot \\overline{AK}}{2} = ${dec(A)}${t(', cioè ')} ${a} \\cdot \\overline{AK} = ${c * h}`,
					`\\overline{AK} = ${c * h} : ${a} = ${len(ak)}`,
				],
				answer: ak,
				// the ratio upside down; without the 2; the sides swapped
				mistakes: [q(c * a, h), q(c * h, 2 * a), q(a * h, c)],
				params: { case: kind, c, a, h },
			};
		}
	}
	if (rng.next() < 0.5) {
		const [x, y, z] = rng.pick([
			[3, 4, 5],
			[7, 24, 25],
		]);
		const k = rng.int(1, x === 3 ? 10 : 2);
		const [a, b] = rng.next() < 0.5 ? [x * k, y * k] : [y * k, x * k];
		const c = z * k;
		const ch = q(a * b, c);
		return {
			...base,
			problem: textBlock(
				`Il triangolo $ABC$ è rettangolo in $C$: i cateti misurano $\\overline{AC} = ${a}$ cm e $\\overline{BC} = ${b}$ cm, l'ipotenusa $\\overline{AB} = ${c}$ cm. Quanto misura l'altezza $CH$ relativa all'ipotenusa?`,
			),
			solution: `\\overline{CH} = ${len(ch)}`,
			steps: [
				`${t('Con i cateti come base e altezza: ')} A = \\dfrac{${a} \\cdot ${b}}{2} = ${sq(q(a * b, 2))}`,
				`${t("Con l'ipotenusa come base: ")} \\dfrac{${c} \\cdot \\overline{CH}}{2} = ${dec(q(a * b, 2))}${t(', cioè ')} ${c} \\cdot \\overline{CH} = ${a * b}`,
				`\\overline{CH} = ${a * b} : ${c} = ${len(ch)}`,
			],
			answer: ch,
			// the area divided by the hypotenuse without the 2; the area; half the hypotenuse
			mistakes: [q(a * b, 2 * c), q(a * b, 2), q(c, 2)],
			params: { case: kind, sub: 'cateti', a, b, c },
		};
	}
	for (;;) {
		const c = rng.int(5, 30);
		const A = rng.int(6, Math.floor((c * c - 1) / 4));
		const ch = q(2 * A, c);
		if (!nice(ch) || 16 * A * A >= c ** 4) continue;
		return {
			...base,
			problem: textBlock(`Un triangolo rettangolo ha l'area di ${pSq(n(A))} e l'ipotenusa di ${pLen(n(c))}. Quanto misura l'altezza relativa all'ipotenusa?`),
			solution: `h = ${len(ch)}`,
			steps: [
				`${t("Con l'ipotenusa come base: ")} \\dfrac{${c} \\cdot h}{2} = ${A}`,
				`${c} \\cdot h = ${2 * A} \\quad\\Rightarrow\\quad h = ${2 * A} : ${c} = ${len(ch)}`,
			],
			answer: ch,
			// without the 2; half the hypotenuse; divided by 2 twice
			mistakes: [q(A, c), q(c, 2), q(A, 2 * c)],
			params: { case: kind, sub: 'area', A, c },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: regular polygons

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** The fixed number (apothem over side, to the thousandth) and the sides that keep the area to two decimals. */
const POLY: Record<number, { name: string; fixed: R; ell: number[] }> = {
	3: { name: 'triangolo equilatero', fixed: q(289, 1000), ell: [10, 20, 30, 40] },
	5: { name: 'pentagono regolare', fixed: q(688, 1000), ell: range(4, 24) },
	6: { name: 'esagono regolare', fixed: q(866, 1000), ell: [5, 10, 15, 20, 25, 30] },
};

function level5(rng: Rng): Built {
	const r = rng.next();
	const kind = r < 0.5 ? 'lato' : r < 0.75 ? 'perimetro' : 'numero-fisso';
	const nn = rng.pick([3, 5, 6]);
	const poly = POLY[nn];
	const base = { prompt: AREA, unit: 'cm', square: true };
	if (kind === 'numero-fisso') {
		const l = rng.pick(poly.ell);
		const a = poly.fixed.mul(n(l));
		const P = n(nn * l);
		const A = P.mul(a).div(n(2));
		return {
			...base,
			problem: textBlock(
				`In un ${poly.name} l'apotema è circa $${dec(poly.fixed)}$ volte il lato. Quanto misura l'area di un ${poly.name} con il lato di ${pLen(n(l))}?`,
			),
			solution: `A = ${sq(A)}`,
			steps: [
				`a = ${dec(poly.fixed)} \\cdot ${l} = ${len(a)}`,
				`P = ${nn} \\cdot ${l} = ${len(P)}`,
				`A = \\dfrac{P \\cdot a}{2} = \\dfrac{${dec(P)} \\cdot ${dec(a)}}{2} = ${sq(A)}`,
			],
			answer: A,
			// without the "diviso due"; one triangle only; the fixed number used as the apothem
			mistakes: [P.mul(a), n(l).mul(a).div(n(2)), P.mul(poly.fixed).div(n(2))],
			params: { case: kind, n: nn, l, fixed: poly.fixed.toString() },
		};
	}
	for (;;) {
		const l = rng.int(4, 30);
		if ((nn * l) % 2) continue;
		const exact = (l / 2) / Math.tan(Math.PI / nn);
		const c = exact * 100;
		if (Math.abs(c - Math.floor(c) - 0.5) < 0.02 || Math.round(c) % 10 === 0) continue;
		const a = q(Math.round(c), 100);
		const P = n(nn * l);
		const A = P.mul(a).div(n(2));
		if (kind === 'lato') {
			return {
				...base,
				problem: textBlock(`Un ${poly.name} ha il lato di ${pLen(n(l))} e l'apotema di ${pLen(a)} (arrotondato ai centesimi). Quanto misura l'area?`),
				solution: `A = ${sq(A)}`,
				steps: [
					`P = ${nn} \\cdot ${l} = ${len(P)}`,
					`A = \\dfrac{P \\cdot a}{2} = \\dfrac{${dec(P)} \\cdot ${dec(a)}}{2} = ${sq(A)}`,
					t("L'apotema è arrotondato, e anche l'area lo è"),
				],
				answer: A,
				// one triangle only (the number of sides forgotten); without the 2; the side times the apothem
				mistakes: [n(l).mul(a).div(n(2)), P.mul(a), n(l).mul(a), P.mul(a).div(n(4))],
				params: { case: kind, n: nn, l, a: a.toString() },
			};
		}
		return {
			...base,
			problem: textBlock(`Un ${poly.name} ha il perimetro di ${pLen(P)} e l'apotema di ${pLen(a)} (arrotondato ai centesimi). Quanto misura l'area?`),
			solution: `A = ${sq(A)}`,
			steps: [`A = \\dfrac{P \\cdot a}{2} = \\dfrac{${dec(P)} \\cdot ${dec(a)}}{2} = ${sq(A)}`, t("L'apotema è arrotondato, e anche l'area lo è")],
			answer: A,
			// without the 2; with the semiperimeter and the 2; the perimeter taken as the side of one triangle
			mistakes: [P.mul(a), P.mul(a).div(n(4)), n(l).mul(a).div(n(2)), n(l).mul(a)],
			params: { case: kind, n: nn, l, a: a.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: composite figures and equivalent figures

type Fig = 'triangolo' | 'rettangolo' | 'quadrato' | 'rombo' | 'parallelogramma';

function level6(rng: Rng): Built {
	const r = rng.next();
	const kind = r < 1 / 3 ? 'somma' : r < 2 / 3 ? 'differenza' : 'equivalenti';
	const base = { prompt: AREA, unit: 'cm', square: true };
	if (kind === 'somma') {
		for (;;) {
			const b = rng.int(4, 20);
			const h = rng.int(3, 15);
			const tt = rng.int(2, 12);
			const onDC = rng.next() < 0.6;
			const side = onDC ? b : h;
			if ((side * tt) % 2 || b === h) continue;
			const rect = b * h;
			const tri = q(side * tt, 2);
			const A = tri.add(n(rect));
			const [tn, sn, other] = onDC ? ['DCE', 'DC', h] : ['BCE', 'BC', b];
			return {
				...base,
				problem: textBlock(
					`Una figura è formata dal rettangolo $ABCD$, con $\\overline{AB} = ${b}$ cm e $\\overline{BC} = ${h}$ cm, e dal triangolo $${tn}$, esterno al rettangolo, che ha la base $${sn}$ e l'altezza relativa a $${sn}$ di ${pLen(n(tt))}. Quanto misura l'area della figura?`,
				),
				solution: `A = ${sq(A)}`,
				steps: [
					`${t('La figura è la somma del rettangolo e del triangolo; il triangolo ha per base ')} ${sn} = ${len(n(side))}`,
					`A = ${b} \\cdot ${h} + \\dfrac{${side} \\cdot ${tt}}{2} = ${rect} + ${dec(tri)} = ${sq(A)}`,
				],
				answer: A,
				// without the "diviso due"; the other side as the base; the triangle subtracted
				mistakes: [n(rect + side * tt), n(rect).add(q(other * tt, 2)), n(rect).sub(tri)],
				params: { case: kind, sub: onDC ? 'DC' : 'BC', b, h, t: tt },
			};
		}
	}
	if (kind === 'differenza') {
		for (;;) {
			const b = rng.int(6, 20);
			const h = rng.int(4, 15);
			if (b === h) continue;
			const rect = b * h;
			if (rng.next() < 0.55) {
				const x = rng.int(2, b - 1);
				if ((h * x) % 2) continue;
				const tri = q(h * x, 2);
				const A = n(rect).sub(tri);
				return {
					...base,
					problem: textBlock(
						`Dal rettangolo $ABCD$, con $\\overline{AB} = ${b}$ cm e $\\overline{BC} = ${h}$ cm, si toglie il triangolo $BCE$, con $E$ sul lato $DC$ e $\\overline{CE} = ${x}$ cm. Quanto misura l'area della parte che resta?`,
					),
					solution: `A = ${sq(A)}`,
					steps: [
						`${t('Il triangolo ')} BCE ${t(' è rettangolo in ')} C${t(': i cateti sono ')} BC ${t(' e ')} CE`,
						`A = ${b} \\cdot ${h} - \\dfrac{${h} \\cdot ${x}}{2} = ${rect} - ${dec(tri)} = ${sq(A)}`,
					],
					answer: A,
					// without the "diviso due"; the triangle added; the triangle only
					mistakes: [n(rect - h * x), n(rect).add(tri), tri],
					params: { case: kind, sub: 'triangolo', b, h, x },
				};
			}
			const s = rng.int(2, Math.min(b, h) - 1);
			const A = n(rect - s * s);
			return {
				...base,
				problem: textBlock(
					`Dal rettangolo $ABCD$, con $\\overline{AB} = ${b}$ cm e $\\overline{BC} = ${h}$ cm, si toglie il quadrato $CEFG$ di lato ${pLen(n(s))}, con $E$ sul lato $CD$ e $G$ sul lato $CB$. Quanto misura l'area della parte che resta?`,
				),
				solution: `A = ${sq(A)}`,
				steps: [`A = ${b} \\cdot ${h} - ${s}^2 = ${rect} - ${s * s} = ${sq(A)}`],
				answer: A,
				// the perimeter of the square subtracted; twice the side; the square added
				mistakes: [n(rect - 4 * s), n(rect - 2 * s), n(rect + s * s)],
				params: { case: kind, sub: 'quadrato', b, h, s },
			};
		}
	}
	return equivalent(rng);
}

/** Two measures p != q from 2 to 30 with p * q = target, or null. */
function factorPair(rng: Rng, target: number): [number, number] | null {
	const pairs: [number, number][] = [];
	for (let p = 2; p <= 30; p++) if (target % p === 0 && target / p !== p && target / p >= 2 && target / p <= 30) pairs.push([p, target / p]);
	return pairs.length ? rng.pick(pairs) : null;
}

function equivalent(rng: Rng): Built {
	for (;;) {
		const g = rng.pick(['triangolo-altezza', 'triangolo-base', 'rettangolo', 'parallelogramma', 'rombo', 'quadrato'] as const);
		const f: Fig = rng.pick(['rettangolo', 'quadrato', 'triangolo', 'rombo'] as const);
		const gFig = g.startsWith('triangolo') ? 'triangolo' : g;
		if (gFig === f) continue;
		// the asked figure: a known measure and the answer, both integers
		const ans = rng.int(3, 20);
		const known = rng.int(3, 24);
		let A: number;
		let gText: string, asked: string, eq: string, solve: string;
		const mistakes: R[] = [];
		switch (g) {
			case 'triangolo-altezza':
			case 'triangolo-base':
				if ((ans * known) % 2 || ans === known) continue;
				A = (ans * known) / 2;
				if (g === 'triangolo-altezza') {
					gText = `Un triangolo con la base di ${pLen(n(known))}`;
					asked = "l'altezza del triangolo relativa alla base";
					eq = `\\dfrac{${known} \\cdot h}{2} = ${A}`;
					solve = `h = ${2 * A} : ${known}`;
				} else {
					gText = `Un triangolo con l'altezza relativa alla base di ${pLen(n(known))}`;
					asked = 'la base del triangolo';
					eq = `\\dfrac{b \\cdot ${known}}{2} = ${A}`;
					solve = `b = ${2 * A} : ${known}`;
				}
				mistakes.push(q(A, known)); // without the 2
				break;
			case 'rettangolo':
			case 'parallelogramma':
				if (ans === known) continue;
				A = ans * known;
				gText = `Un ${g} con la base di ${pLen(n(known))}`;
				asked = g === 'rettangolo' ? "l'altezza del rettangolo" : "l'altezza del parallelogramma relativa alla base";
				eq = `${known} \\cdot h = ${A}`;
				solve = `h = ${A} : ${known}`;
				mistakes.push(q(2 * A, known)); // the triangle formula
				break;
			case 'rombo':
				if ((ans * known) % 2 || ans === known) continue;
				A = (ans * known) / 2;
				gText = `Un rombo con una diagonale di ${pLen(n(known))}`;
				asked = "l'altra diagonale del rombo";
				eq = `\\dfrac{${known} \\cdot d}{2} = ${A}`;
				solve = `d = ${2 * A} : ${known}`;
				mistakes.push(q(A, known));
				break;
			case 'quadrato':
				A = ans * ans;
				gText = 'Un quadrato';
				asked = 'il lato del quadrato';
				eq = `\\ell^2 = ${A}`;
				solve = `\\ell = \\sqrt{${A}}`;
				mistakes.push(q(A, 4), q(A, 2)); // the area over 4 as with the perimeter; half the area
				break;
		}
		let fText: string, fArea: string;
		if (f === 'quadrato') {
			const l = Math.round(Math.sqrt(A));
			if (l * l !== A) continue;
			fText = `un quadrato di lato ${pLen(n(l))}`;
			fArea = `${l}^2`;
		} else if (f === 'rettangolo') {
			const pr = factorPair(rng, A);
			if (!pr) continue;
			fText = `un rettangolo di ${pLen(n(pr[0]))} per ${pLen(n(pr[1]))}`;
			fArea = `${pr[0]} \\cdot ${pr[1]}`;
		} else {
			const pr = factorPair(rng, 2 * A);
			if (!pr) continue;
			fText =
				f === 'triangolo'
					? `un triangolo con la base di ${pLen(n(pr[0]))} e l'altezza relativa alla base di ${pLen(n(pr[1]))}`
					: `un rombo con le diagonali di ${pLen(n(pr[0]))} e di ${pLen(n(pr[1]))}`;
			fArea = `\\dfrac{${pr[0]} \\cdot ${pr[1]}}{2}`;
			if (g !== 'quadrato') mistakes.push(n(2 * ans)); // the area of F without the "diviso due"
		}
		mistakes.push(n(2 * ans), q(ans, 2));
		const Fname = f === 'triangolo' ? 'Il triangolo' : f === 'quadrato' ? 'Il quadrato' : f === 'rombo' ? 'Il rombo' : 'Il rettangolo';
		return {
			prompt: FIND,
			problem: textBlock(`${gText} è equivalente a ${fText}. Quanto misura ${asked}?`),
			solution: `${solve.split(' = ')[0]} = ${len(n(ans))}`,
			steps: [
				`${t(`Figure equivalenti hanno la stessa area. ${Fname} ha l'area di `)} ${fArea} = ${sq(n(A))}`,
				eq,
				`${solve} = ${len(n(ans))}`,
			],
			answer: n(ans),
			unit: 'cm',
			square: false,
			mistakes,
			params: { case: 'equivalenti', asked: g, given: f, A },
		};
	}
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function assemble(level: number, seed: number, b: Built): Sample {
	return {
		generatorId: ID,
		level,
		seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: b.solution,
		steps: b.steps,
		answer: { kind: 'number', value: b.answer.toString() },
		params: {
			...b.params,
			unit: b.unit,
			square: b.square,
			answer: b.answer.toString(),
			mistakes: b.mistakes.filter((m) => m.sign() > 0 && Number.isFinite(decimals(m)) && !m.equals(b.answer)).map(String),
		},
	};
}

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		const sample = assemble(level, rng.seed, make(rng));
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(sample.problem + sample.steps.join(' '))) v.push('parole vietate');
	if (sample.answer.kind !== 'number') return ['la risposta deve essere un numero'];
	const value = sample.answer.value;
	const ans = Rational.parse(value);
	if (ans.sign() <= 0) v.push('risposta non positiva');
	const maxDec = sample.level === 2 ? 4 : 2;
	if (decimals(ans) > maxDec) v.push(`risposta ${ans} con più di ${maxDec} decimali`);
	if (p.answer !== value) v.push('params.answer diverso dalla risposta');
	if (((p.mistakes as string[]) ?? []).filter((m) => m !== value).length < 2) v.push('meno di due errori tipici');
	if (sample.choice) {
		const ch = sample.choice;
		if (ch.options.length !== 4 || new Set(ch.options.map((o) => o.values[0])).size !== 4) v.push('scelta: servono quattro opzioni diverse');
		if (ch.options[ch.correct]?.values[0] !== value) v.push("scelta: l'opzione giusta non è la risposta");
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
	const mistakes = ((sample.params.mistakes ?? []) as string[]).map((s) => Rational.parse(s));
	return numberOptions(rng, Rational.parse(sample.answer.value), mistakes, sample.params.unit as string,
		sample.params.square as boolean,
		// a distractor with more decimals than the answer gives itself away (conversions excepted: 0,0941 is a real mistake)
		sample.level === 2 ? 6 : Math.max(2, decimals(Rational.parse(sample.answer.value))),
	);
}

export const equivalenzaAree: Generator = {
	id: ID,
	title: 'Equivalenza e aree',
	levels: {
		1: { label: "L'area delle figure", constraints: ['rettangolo, quadrato, parallelogramma, triangolo, trapezio, rombo, circa 1 su 6 ciascuno', 'dati e area interi, in cm'] },
		2: { label: 'Unità di misura delle aree', constraints: ['conversioni tra m², dm², cm², mm² (metà); rettangolo con i lati in unità diverse (metà)', 'al più 4 decimali'] },
		3: { label: "Una misura dall'area", constraints: ['altezza o base del triangolo, altezza o base minore del trapezio, diagonale del rombo, altezza del parallelogramma', 'area intera, risposta con al più un decimale'] },
		4: { label: "Le due altezze e l'altezza sull'ipotenusa", constraints: ["l'altra altezza del parallelogramma o del triangolo, l'altezza relativa all'ipotenusa", 'altezza minore del lato obliquo, risposta con al più due decimali'] },
		5: { label: 'Poligoni regolari', constraints: ['triangolo equilatero, pentagono, esagono; lato o perimetro e apotema arrotondato, oppure il numero fisso', 'area con al più due decimali'] },
		6: { label: 'Figure composte ed equivalenti', constraints: ['somma o differenza di un rettangolo e di un triangolo o un quadrato; una misura di una figura equivalente a un\'altra', 'dati interi'] },
	},
	generate,
	check,
	toChoice,
};

export default equivalenzaAree;
