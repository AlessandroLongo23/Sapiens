/**
 * Parallelogrammi e trapezi. Spec: specs/exercises/geometria-quadrilateri.md
 *
 * Seven levels in the order of the lesson, all on the text alone (no figure): the angles of a quadrilateral and of a
 * parallelogram, sides and diagonals, angles made by the diagonals of rectangles and rhombi, the angles of trapezi
 * (also with an equation, as in example 5), recognising a quadrilateral from what is known about it, true and false
 * statements on the families, the justification of a step of a proof of the lesson. Levels 1-4 have a number as
 * the answer (degrees or centimetres), built backwards from it; levels 5-7 are born as multiple choice.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';

export const ID = 'geometria-quadrilateri';

const t = (s: string) => `\\text{${s}}`;
const deg = (n: number) => `${n}^\\circ`;
const cmTex = (n: number) => `${n}\\ \\text{cm}`;
const hat = (v: string) => `\\hat{${v}}`;
const wh = (s: string) => `\\widehat{${s}}`;
const V = ['A', 'B', 'C', 'D'];
const opp = (i: number) => (i + 2) % 4;

type Unit = 'deg' | 'cm';
interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: number;
	unit: Unit;
	mistakes: number[];
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Multiple choice for a number: the mistakes first, then values 5, 10, 15, 20 away.

function numberOptions(rng: Rng, value: number, mistakes: number[], unit: Unit): ChoiceAnswer {
	const fmt = unit === 'deg' ? deg : cmTex;
	const max = unit === 'deg' ? 359 : 400;
	const seen = new Set([value]);
	const opts: ChoiceOption[] = [{ latex: fmt(value), values: [String(value)] }];
	const near = unit === 'deg' ? [10, 20, 5, 30, 15, 40] : [2, 1, 4, 3, 6, 5];
	const cands = [...mistakes, ...near.flatMap((d) => [value + d, value - d])];
	for (const c of cands) {
		if (opts.length >= 4) break;
		if (!Number.isInteger(c) || c <= 0 || c > max || seen.has(c)) continue;
		seen.add(c);
		opts.push({ latex: fmt(c), values: [String(c)] });
	}
	return finish(rng, opts);
}

function finish(rng: Rng, opts: ChoiceOption[]): ChoiceAnswer {
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

const multipleOf = (rng: Rng, lo: number, hi: number, k: number) => k * rng.int(Math.ceil(lo / k), Math.floor(hi / k));

// ---------------------------------------------------------------------------
// Level 1: the fourth angle of a quadrilateral; an angle of a parallelogram from another

function level1(rng: Rng): Built {
	const kind = rng.pick(['quadrilatero', 'opposto', 'consecutivo'] as const);
	if (kind === 'quadrilatero') {
		for (;;) {
			const miss = rng.int(0, 3);
			const d = multipleOf(rng, 45, 150, 5);
			const a = multipleOf(rng, 45, 150, 5), b = multipleOf(rng, 45, 150, 5);
			const c = 360 - d - a - b;
			if (c < 45 || c > 150) continue;
			const given = [a, b, c];
			if ([...given, d].every((x) => x === 90)) continue;
			const names = V.filter((_, i) => i !== miss);
			const sum = a + b + c;
			return {
				prompt: "Trova la misura dell'angolo.",
				problem: textBlock(
					`Nel quadrilatero $ABCD$ gli angoli $${hat(names[0])}$, $${hat(names[1])}$ e $${hat(names[2])}$ misurano $${deg(a)}$, $${deg(b)}$ e $${deg(c)}$. Quanto misura l'angolo $${hat(V[miss])}$?`,
				),
				solution: `${hat(V[miss])} = ${deg(d)}`,
				steps: [
					`${t('La somma degli angoli di un quadrilatero è ')} ${deg(360)}`,
					`${hat(V[miss])} = ${deg(360)} - (${deg(a)} + ${deg(b)} + ${deg(c)}) = ${deg(360)} - ${deg(sum)} = ${deg(d)}`,
				],
				answer: d,
				unit: 'deg',
				// the sum of a triangle (180) instead of 360; a slip of ten degrees
				mistakes: [sum - 180, d + 10, d - 10],
				params: { case: kind, given: names.map((n, i) => [n, String(given[i])]), asked: V[miss] },
			};
		}
	}
	let a = rng.int(25, 155);
	while (a === 90) a = rng.int(25, 155);
	const g = rng.int(0, 3);
	const q = kind === 'opposto' ? opp(g) : (g + rng.pick([1, 3])) % 4;
	const ans = kind === 'opposto' ? a : 180 - a;
	const steps =
		kind === 'opposto'
			? [`${t('Gli angoli opposti di un parallelogramma sono congruenti: ')} ${hat(V[q])} = ${hat(V[g])} = ${deg(a)}`]
			: [
					`${t('Gli angoli consecutivi di un parallelogramma sono supplementari: ')} ${hat(V[g])} + ${hat(V[q])} = ${deg(180)}`,
					`${hat(V[q])} = ${deg(180)} - ${deg(a)} = ${deg(ans)}`,
				];
	const other = kind === 'opposto' ? 180 - a : a;
	return {
		prompt: "Trova la misura dell'angolo.",
		problem: textBlock(`Nel parallelogramma $ABCD$ l'angolo $${hat(V[g])}$ misura $${deg(a)}$. Quanto misura l'angolo $${hat(V[q])}$?`),
		solution: `${hat(V[q])} = ${deg(ans)}`,
		steps,
		answer: ans,
		unit: 'deg',
		// consecutive taken as congruent (or opposite as supplementary); complementary instead of supplementary; 360 minus
		mistakes: [other, Math.abs(90 - a), 360 - a],
		params: { case: kind, given: [[V[g], String(a)]], asked: V[q] },
	};
}

// ---------------------------------------------------------------------------
// Level 2: sides, perimeter and diagonals

const SIDES = ['AB', 'BC', 'CD', 'DA'];

function level2(rng: Rng): Built {
	const kind = rng.pick(['lati', 'diagonali'] as const);
	const P = "Trova la misura.";
	if (kind === 'lati') {
		const sub = rng.pick(['perimetro', 'lato', 'rombo-lato', 'rombo-perimetro'] as const);
		if (sub === 'perimetro' || sub === 'lato') {
			const i = rng.int(0, 3);
			const s1 = SIDES[i], s2 = SIDES[(i + 1) % 4];
			const a = rng.int(4, 20);
			let b = rng.int(3, 18);
			while (b === a) b = rng.int(3, 18);
			const per = 2 * (a + b);
			if (sub === 'perimetro') {
				return {
					prompt: P,
					problem: textBlock(`Nel parallelogramma $ABCD$ il lato $${s1}$ misura $${a}$ cm e il lato $${s2}$ misura $${b}$ cm. Quanto misura il perimetro?`),
					solution: `2p = ${cmTex(per)}`,
					steps: [
						`${t('I lati opposti sono congruenti: ')} ${SIDES[(i + 2) % 4]} = ${cmTex(a)} ${t(' e ')} ${SIDES[(i + 3) % 4]} = ${cmTex(b)}`,
						`2p = 2 \\cdot (${a} + ${b}) = ${cmTex(per)}`,
					],
					answer: per,
					unit: 'cm',
					// two sides only; three sides; the first side four times
					mistakes: [a + b, 2 * a + b, a + 2 * b, 4 * a],
					params: { case: kind, sub, given: [[s1, String(a)], [s2, String(b)]], asked: 'perimetro' },
				};
			}
			return {
				prompt: P,
				problem: textBlock(`Il parallelogramma $ABCD$ ha il perimetro di $${per}$ cm e il lato $${s1}$ di $${a}$ cm. Quanto misura il lato $${s2}$?`),
				solution: `${s2} = ${cmTex(b)}`,
				steps: [
					`${t('I lati opposti sono congruenti, quindi il semiperimetro è la somma di due lati consecutivi: ')} ${s1} + ${s2} = ${per} : 2 = ${cmTex(per / 2)}`,
					`${s2} = ${per / 2} - ${a} = ${cmTex(b)}`,
				],
				answer: b,
				unit: 'cm',
				// perimeter minus one side; the semiperimeter; perimeter minus two sides (two sides left)
				mistakes: [per - a, per / 2, per - 2 * a],
				params: { case: kind, sub, given: [['perimetro', String(per)], [s1, String(a)]], asked: s2 },
			};
		}
		const l = rng.int(3, 25);
		const s = rng.pick(SIDES);
		if (sub === 'rombo-lato') {
			return {
				prompt: P,
				problem: textBlock(`Il rombo $ABCD$ ha il perimetro di $${4 * l}$ cm. Quanto misura il lato $${s}$?`),
				solution: `${s} = ${cmTex(l)}`,
				steps: [`${t('I quattro lati del rombo sono congruenti: ')} ${s} = ${4 * l} : 4 = ${cmTex(l)}`],
				answer: l,
				unit: 'cm',
				// divided by 2 as in a parallelogram; divided by 3; the perimeter itself
				mistakes: [2 * l, (4 * l) / 3, 4 * l],
				params: { case: kind, sub, given: [['perimetro', String(4 * l)]], asked: s },
			};
		}
		return {
			prompt: P,
			problem: textBlock(`Nel rombo $ABCD$ il lato $${s}$ misura $${l}$ cm. Quanto misura il perimetro?`),
			solution: `2p = ${cmTex(4 * l)}`,
			steps: [`${t('I quattro lati del rombo sono congruenti: ')} 2p = 4 \\cdot ${l} = ${cmTex(4 * l)}`],
			answer: 4 * l,
			unit: 'cm',
			mistakes: [2 * l, 3 * l, l + 4],
			params: { case: kind, sub, given: [[s, String(l)]], asked: 'perimetro' },
		};
	}
	const sub = rng.pick(['par-meta', 'par-doppio', 'rett-diagonale', 'rett-meta', 'rett-doppio'] as const);
	const d = 2 * rng.int(4, 16);
	const m = d / 2;
	const M = "le diagonali si incontrano nel punto $M$ e";
	switch (sub) {
		case 'par-meta': {
			const [diag, half] = rng.pick([
				['AC', rng.pick(['AM', 'MC'])],
				['BD', rng.pick(['BM', 'MD'])],
			]);
			return {
				prompt: P,
				problem: textBlock(`Nel parallelogramma $ABCD$ ${M} la diagonale $${diag}$ misura $${d}$ cm. Quanto misura il segmento $${half}$?`),
				solution: `${half} = ${cmTex(m)}`,
				steps: [`${t('Le diagonali si tagliano a metà: ')} ${half} = ${d} : 2 = ${cmTex(m)}`],
				answer: m,
				unit: 'cm',
				// the whole diagonal; doubled instead of halved; a quarter
				mistakes: [d, 2 * d, d / 4],
				params: { case: kind, sub, fig: 'parallelogramma', given: [[diag, String(d)]], asked: half },
			};
		}
		case 'par-doppio': {
			const [diag, half] = rng.pick([
				['AC', rng.pick(['AM', 'MC'])],
				['BD', rng.pick(['BM', 'MD'])],
			]);
			return {
				prompt: P,
				problem: textBlock(`Nel parallelogramma $ABCD$ ${M} il segmento $${half}$ misura $${m}$ cm. Quanto misura la diagonale $${diag}$?`),
				solution: `${diag} = ${cmTex(d)}`,
				steps: [`${t('Le diagonali si tagliano a metà, quindi ')} ${half} ${t(' è metà di ')} ${diag}\\text{: } ${diag} = 2 \\cdot ${m} = ${cmTex(d)}`],
				answer: d,
				unit: 'cm',
				mistakes: [m, m / 2, 4 * m],
				params: { case: kind, sub, fig: 'parallelogramma', given: [[half, String(m)]], asked: diag },
			};
		}
		case 'rett-diagonale': {
			const [g, a] = rng.pick([
				['AC', 'BD'],
				['BD', 'AC'],
			]);
			return {
				prompt: P,
				problem: textBlock(`Nel rettangolo $ABCD$ la diagonale $${g}$ misura $${d}$ cm. Quanto misura la diagonale $${a}$?`),
				solution: `${a} = ${cmTex(d)}`,
				steps: [`${t('Le diagonali del rettangolo sono congruenti: ')} ${a} = ${g} = ${cmTex(d)}`],
				answer: d,
				unit: 'cm',
				// halved; doubled
				mistakes: [m, 2 * d, d + 2],
				params: { case: kind, sub, fig: 'rettangolo', given: [[g, String(d)]], asked: a },
			};
		}
		case 'rett-meta': {
			const [g, a] = rng.pick([
				['AC', rng.pick(['BM', 'MD'])],
				['BD', rng.pick(['AM', 'MC'])],
			]);
			return {
				prompt: P,
				problem: textBlock(`Nel rettangolo $ABCD$ ${M} la diagonale $${g}$ misura $${d}$ cm. Quanto misura il segmento $${a}$?`),
				solution: `${a} = ${cmTex(m)}`,
				steps: [
					`${t('Le diagonali del rettangolo sono congruenti e si tagliano a metà, quindi le quattro metà sono congruenti: ')} AM = BM = CM = DM`,
					`${a} = ${d} : 2 = ${cmTex(m)}`,
				],
				answer: m,
				unit: 'cm',
				mistakes: [d, 2 * d, d / 4],
				params: { case: kind, sub, fig: 'rettangolo', given: [[g, String(d)]], asked: a },
			};
		}
		case 'rett-doppio': {
			const [half, a] = rng.pick([
				[rng.pick(['AM', 'MC']), 'BD'],
				[rng.pick(['BM', 'MD']), 'AC'],
			]);
			return {
				prompt: P,
				problem: textBlock(`Nel rettangolo $ABCD$ ${M} il segmento $${half}$ misura $${m}$ cm. Quanto misura la diagonale $${a}$?`),
				solution: `${a} = ${cmTex(d)}`,
				steps: [
					`${t('Le diagonali del rettangolo sono congruenti e si tagliano a metà, quindi le quattro metà sono congruenti: ')} AM = BM = CM = DM = ${cmTex(m)}`,
					`${a} = 2 \\cdot ${m} = ${cmTex(d)}`,
				],
				answer: d,
				unit: 'cm',
				mistakes: [m, m / 2, 4 * m],
				params: { case: kind, sub, fig: 'rettangolo', given: [[half, String(m)]], asked: a },
			};
		}
	}
}

// ---------------------------------------------------------------------------
// Level 3: angles made by the diagonals (rhombus: bisectors and right angle; rectangle: isosceles triangles)

function level3(rng: Rng): Built {
	const kind = rng.pick(['rombo', 'rettangolo'] as const);
	const P = "Trova la misura dell'angolo.";
	const intro = (fig: string, given: string, v: number) => `Nel ${fig} $ABCD$ le diagonali si incontrano nel punto $M$ e l'angolo $${given}$ misura $${deg(v)}$.`;
	if (kind === 'rombo') {
		const sub = rng.pick(['meta', 'altro', 'inverso-lato', 'inverso-meta'] as const);
		// the triangle ABM: at A half of Â, at B half of B̂, at M a right angle
		const v = rng.pick(['A', 'B']);
		const w = v === 'A' ? 'B' : 'A';
		const at = (x: string) => (x === 'A' ? wh('BAM') : wh('ABM'));
		if (sub === 'meta' || sub === 'altro') {
			let a = 2 * rng.int(15, 75);
			while (a === 90) a = 2 * rng.int(15, 75);
			const half = a / 2, other = 90 - a / 2;
			const asked = sub === 'meta' ? at(v) : at(w);
			const ans = sub === 'meta' ? half : other;
			const steps = [`${t('Le diagonali del rombo sono bisettrici degli angoli: ')} ${at(v)} = ${deg(a)} : 2 = ${deg(half)}`];
			if (sub === 'altro')
				steps.push(
					`${t('Le diagonali sono perpendicolari: ')} \\widehat{AMB} = ${deg(90)}`,
					`${t('Nel triangolo ')} ABM\\text{: } ${at(w)} = ${deg(180)} - ${deg(90)} - ${deg(half)} = ${deg(other)}`,
				);
			return {
				prompt: P,
				problem: textBlock(`${intro('rombo', hat(v), a)} Quanto misura l'angolo $${asked}$?`),
				solution: `${asked} = ${deg(ans)}`,
				steps,
				answer: ans,
				unit: 'deg',
				// the whole angle; the other angle of the triangle; the supplementary of the given angle
				mistakes: sub === 'meta' ? [a, other, 180 - a] : [half, 180 - a, 90 - a],
				params: { case: kind, sub, given: [[`hat:${v}`, String(a)]], asked: asked },
			};
		}
		// inverse: an angle of the triangle ABM given, a whole angle of the rhombus asked
		let u = rng.int(15, 75);
		while (u === 45) u = rng.int(15, 75);
		const askV = sub === 'inverso-meta' ? v : w;
		const ans = sub === 'inverso-meta' ? 2 * u : 180 - 2 * u;
		const steps = [`${t('Le diagonali del rombo sono bisettrici degli angoli: ')} ${hat(v)} = 2 \\cdot ${deg(u)} = ${deg(2 * u)}`];
		if (sub === 'inverso-lato')
			steps.push(`${t('Gli angoli consecutivi del rombo sono supplementari: ')} ${hat(w)} = ${deg(180)} - ${deg(2 * u)} = ${deg(ans)}`);
		return {
			prompt: P,
			problem: textBlock(`${intro('rombo', at(v), u)} Quanto misura l'angolo $${hat(askV)}$?`),
			solution: `${hat(askV)} = ${deg(ans)}`,
			steps,
			answer: ans,
			unit: 'deg',
			// not doubled; the third angle of the triangle; the supplementary of the given angle
			mistakes: sub === 'inverso-meta' ? [u, 180 - 2 * u, 90 - u] : [2 * u, 90 - u, 180 - u],
			params: { case: kind, sub, given: [[at(v), String(u)]], asked: `hat:${askV}` },
		};
	}
	const sub = rng.pick(['base', 'adiacente', 'mad', 'amb', 'mad-da-mab'] as const);
	if (sub === 'base' || sub === 'adiacente' || sub === 'mad') {
		let m = 2 * rng.int(10, 80);
		while (m === 90) m = 2 * rng.int(10, 80);
		const base = (180 - m) / 2;
		const asked = sub === 'base' ? wh('MAB') : sub === 'adiacente' ? wh('AMD') : wh('MAD');
		const ans = sub === 'base' ? base : sub === 'adiacente' ? 180 - m : m / 2;
		const steps: string[] = [];
		if (sub === 'adiacente') steps.push(`${wh('AMD')} ${t(' è adiacente ad ')} ${wh('AMB')}\\text{: } ${wh('AMD')} = ${deg(180)} - ${deg(m)} = ${deg(ans)}`);
		else {
			steps.push(
				`${t('Le diagonali del rettangolo sono congruenti e si tagliano a metà: ')} AM = BM${t(', quindi il triangolo ')} AMB ${t(' è isoscele sulla base ')} AB`,
				`${wh('MAB')} = \\dfrac{${deg(180)} - ${deg(m)}}{2} = ${deg(base)}`,
			);
			if (sub === 'mad') steps.push(`${t('L\'angolo ')} ${hat('A')} ${t(' è retto: ')} ${wh('MAD')} = ${deg(90)} - ${deg(base)} = ${deg(ans)}`);
		}
		return {
			prompt: P,
			problem: textBlock(`${intro('rettangolo', wh('AMB'), m)} Quanto misura l'angolo $${asked}$?`),
			solution: `${asked} = ${deg(ans)}`,
			steps,
			answer: ans,
			unit: 'deg',
			// not halved; the other angle at A; the given angle
			mistakes: sub === 'base' ? [180 - m, m / 2, m] : sub === 'mad' ? [base, 180 - m, m] : [m, m / 2, base],
			params: { case: kind, sub, given: [[wh('AMB'), String(m)]], asked },
		};
	}
	let u = rng.int(10, 80);
	while (u === 45 || u === 30 || u === 60) u = rng.int(10, 80);
	const asked = sub === 'amb' ? wh('AMB') : wh('MAD');
	const ans = sub === 'amb' ? 180 - 2 * u : 90 - u;
	const steps =
		sub === 'amb'
			? [
					`${t('Le diagonali del rettangolo sono congruenti e si tagliano a metà: ')} AM = BM${t(', quindi ')} ${wh('MBA')} = ${wh('MAB')} = ${deg(u)}`,
					`${t('Nel triangolo ')} AMB\\text{: } ${wh('AMB')} = ${deg(180)} - 2 \\cdot ${deg(u)} = ${deg(ans)}`,
				]
			: [`${t('L\'angolo ')} ${hat('A')} ${t(' è retto: ')} ${wh('MAD')} = ${deg(90)} - ${deg(u)} = ${deg(ans)}`];
	return {
		prompt: P,
		problem: textBlock(`${intro('rettangolo', wh('MAB'), u)} Quanto misura l'angolo $${asked}$?`),
		solution: `${asked} = ${deg(ans)}`,
		steps,
		answer: ans,
		unit: 'deg',
		// one base angle only; the complementary; the supplementary
		mistakes: sub === 'amb' ? [180 - u, 90 - u, 2 * u] : [u, 180 - 2 * u, 180 - u],
		params: { case: kind, sub, given: [[wh('MAB'), String(u)]], asked },
	};
}

// ---------------------------------------------------------------------------
// Level 4: angles of a trapezio, given one angle or with an equation (example 5)

const ISO = 'Nel trapezio isoscele $ABCD$, con le basi $AB$ e $DC$,';
const RETT = 'Nel trapezio rettangolo $ABCD$, con le basi $AB$ e $DC$ e gli angoli retti in $A$ e in $D$,';

/** px + q as the lesson writes an angle: 3x, x + 20°, 2x - 10°. */
function linTex(p: number, q: number): string {
	const head = p === 1 ? 'x' : `${p}x`;
	return q === 0 ? head : q > 0 ? `${head} + ${deg(q)}` : `${head} - ${deg(-q)}`;
}

function level4(rng: Rng): Built {
	const kind = rng.int(1, 100) <= 35 ? 'un-angolo' : 'equazione';
	const P = "Trova la misura dell'angolo.";
	if (kind === 'un-angolo') {
		const fig = rng.pick(['isoscele', 'rettangolo'] as const);
		const a = rng.int(35, 85);
		// angles at A, B, C, D
		const angles = fig === 'isoscele' ? [a, a, 180 - a, 180 - a] : [90, a, 180 - a, 90];
		const pool = fig === 'isoscele' ? [0, 1, 2, 3] : [1, 2];
		const g = rng.pick(pool);
		const q = rng.pick(pool.filter((i) => i !== g));
		const ans = angles[q];
		const ga = angles[g];
		let steps: string[];
		if (fig === 'isoscele' && (g + q === 1 || g + q === 5))
			steps = [`${t('Nel trapezio isoscele gli angoli adiacenti a ciascuna base sono congruenti: ')} ${hat(V[q])} = ${hat(V[g])} = ${deg(ans)}`];
		else if (fig === 'isoscele' && g + q === 3)
			steps = [`${hat(V[g])} ${t(' e ')} ${hat(V[q])} ${t(' sono adiacenti a un lato obliquo, quindi sono supplementari: ')} ${hat(V[q])} = ${deg(180)} - ${deg(ga)} = ${deg(ans)}`];
		else if (fig === 'isoscele')
			steps = [`${t('Nel trapezio isoscele gli angoli opposti sono supplementari: ')} ${hat(V[q])} = ${deg(180)} - ${deg(ga)} = ${deg(ans)}`];
		else steps = [`${hat('B')} ${t(' e ')} ${hat('C')} ${t(' sono adiacenti al lato obliquo ')} BC${t(', quindi sono supplementari: ')} ${hat(V[q])} = ${deg(180)} - ${deg(ga)} = ${deg(ans)}`];
		return {
			prompt: P,
			problem: textBlock(`${fig === 'isoscele' ? ISO : RETT} l'angolo $${hat(V[g])}$ misura $${deg(ga)}$. Quanto misura l'angolo $${hat(V[q])}$?`),
			solution: `${hat(V[q])} = ${deg(ans)}`,
			steps,
			answer: ans,
			unit: 'deg',
			// the other kind (congruent for supplementary and back); complementary; 360 minus as for a whole quadrilateral
			mistakes: [ans === ga ? 180 - ga : ga, ga < 90 ? 90 - ga : NaN, 360 - 2 * ga, fig === 'rettangolo' ? 270 - ga : 360 - ga],
			params: { case: kind, fig, given: [[V[g], String(ga)]], asked: V[q] },
		};
	}
	for (;;) {
		const type = rng.pick(['iso-supplementari', 'iso-congruenti', 'rett-supplementari'] as const);
		const x = rng.int(8, 60);
		const a = rng.int(35, 85);
		const angles = type === 'rett-supplementari' ? [90, a, 180 - a, 90] : [a, a, 180 - a, 180 - a];
		const pairs: Record<typeof type, string[][]> = {
			'iso-supplementari': [
				['A', 'D'],
				['D', 'A'],
				['B', 'C'],
				['C', 'B'],
			],
			'iso-congruenti': [
				['A', 'B'],
				['B', 'A'],
				['D', 'C'],
				['C', 'D'],
			],
			'rett-supplementari': [
				['B', 'C'],
				['C', 'B'],
			],
		};
		const [n1, n2] = rng.pick(pairs[type]);
		const v1 = angles[V.indexOf(n1)];
		const v2 = angles[V.indexOf(n2)];
		const p1 = rng.int(1, 5), p2 = rng.int(1, 5);
		if (type === 'iso-congruenti' && p1 === p2) continue;
		const q1 = v1 - p1 * x, q2 = v2 - p2 * x;
		if (Math.abs(q1) > 60 || Math.abs(q2) > 60 || q1 % 5 !== 0 || q2 % 5 !== 0) continue;
		if (q1 === 0 && q2 === 0) continue;
		const pool = type === 'rett-supplementari' ? [1, 2] : [0, 1, 2, 3];
		const qi = rng.pick(pool);
		const ans = angles[qi];
		if (ans === x) continue;
		const e1 = linTex(p1, q1), e2 = linTex(p2, q2);
		const steps: string[] = [];
		let eq: string, k: number, r: number;
		if (type === 'iso-congruenti') {
			steps.push(`${hat(n1)} ${t(' e ')} ${hat(n2)} ${t(' sono adiacenti alla stessa base, quindi sono congruenti:')}`);
			eq = `${e1} = ${e2}`;
			// the side with the larger coefficient keeps x
			k = Math.abs(p1 - p2);
			r = p1 > p2 ? q2 - q1 : q1 - q2;
		} else {
			steps.push(`${hat(n1)} ${t(' e ')} ${hat(n2)} ${t(' sono adiacenti a un lato obliquo, quindi sono supplementari:')}`);
			eq = `${e1} + ${e2} = ${deg(180)}`;
			k = p1 + p2;
			r = 180 - q1 - q2;
		}
		steps.push(eq, `${k === 1 ? 'x' : `${k}x`} = ${deg(r)}`);
		if (k !== 1) steps.push(`x = ${deg(x)}`);
		steps.push(`${hat(n1)} = ${deg(v1)}${t(' e ')} ${hat(n2)} = ${deg(v2)}`);
		const asked = V[qi];
		if (asked !== n1 && asked !== n2) {
			// in an isosceles trapezio the other two angles are congruent to one of the two found, or supplementary
			const same = angles[qi] === v1 ? n1 : angles[qi] === v2 ? n2 : null;
			steps.push(
				same
					? `${hat(asked)} = ${hat(same)} = ${deg(ans)}${t(', perché sono adiacenti alla stessa base')}`
					: `${hat(asked)} = ${deg(180)} - ${deg(v1)} = ${deg(ans)}${t(', perché ')} ${hat(asked)} ${t(' e ')} ${hat(n1)} ${t(' sono adiacenti a un lato obliquo')}`,
			);
		}
		steps.push(`${t('Controllo: ')} ${angles.map(deg).join(' + ')} = ${deg(360)}`);
		return {
			prompt: P,
			problem: textBlock(
				`${type === 'rett-supplementari' ? RETT : ISO} l'angolo $${hat(n1)}$ misura $${e1}$ e l'angolo $${hat(n2)}$ misura $${e2}$. Quanto misura l'angolo $${hat(asked)}$?`,
			),
			solution: `${hat(asked)} = ${deg(ans)}`,
			steps,
			answer: ans,
			unit: 'deg',
			// x itself; the supplementary; p·x without the constant
			mistakes: [x, 180 - ans, p1 * x, p2 * x],
			params: {
				case: kind,
				type,
				x: String(x),
				given: [
					[n1, String(p1), String(q1)],
					[n2, String(p2), String(q2)],
				],
				asked,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Relabelling: the lesson calls the quadrilateral ABCD; levels 5 and 7 also use other letters.

const LABELS: Record<string, string>[] = [
	{ A: 'A', B: 'B', C: 'C', D: 'D', M: 'M', N: 'N', E: 'E' },
	{ A: 'P', B: 'Q', C: 'R', D: 'S', M: 'O', N: 'T', E: 'H' },
	{ A: 'E', B: 'F', C: 'G', D: 'H', M: 'O', N: 'K', E: 'L' },
	{ A: 'K', B: 'L', C: 'M', D: 'N', M: 'O', N: 'P', E: 'Q' },
];
/** Renames the points in a formula (capital letters only: the LaTeX commands are lowercase). */
const relabel = (math: string, L: Record<string, string>) => math.replace(/[ABCDEMN]/g, (c) => L[c]);
/** Renames the points inside the $…$ of a sentence. */
const relabelProse = (s: string, L: Record<string, string>) => s.replace(/\$([^$]*)\$/g, (_, m: string) => `$${relabel(m, L)}$`);

// ---------------------------------------------------------------------------
// Level 5: recognise the quadrilateral from what is known

type Family = 'par' | 'rett' | 'rombo' | 'quad' | 'trap' | 'trap-iso' | 'trap-rett' | 'nessuna';
const FAMILY_NAME: Record<Family, string> = {
	par: 'Parallelogramma',
	rett: 'Rettangolo',
	rombo: 'Rombo',
	quad: 'Quadrato',
	trap: 'Trapezio',
	'trap-iso': 'Trapezio isoscele',
	'trap-rett': 'Trapezio rettangolo',
	nessuna: 'Solo quadrilatero',
};
/** Each condition as the givens row writes it: one or more formulas. */
const COND: Record<string, string[]> = {
	'diag-meta': ['AM \\cong MC', 'BM \\cong MD'],
	'diag-cong': ['AC \\cong BD'],
	'diag-perp': ['AC \\perp BD'],
	'lati-opp': ['AB \\cong DC', 'AD \\cong BC'],
	'lati-4': ['AB \\cong BC \\cong CD \\cong DA'],
	'retti-4': ['\\hat{A} = \\hat{B} = \\hat{C} = \\hat{D} = 90^\\circ'],
	'ang-opp': ['\\hat{A} \\cong \\hat{C}', '\\hat{B} \\cong \\hat{D}'],
	'par-cong': ['AB \\parallel DC', 'AB \\cong DC'],
	'due-par': ['AB \\parallel DC', 'AD \\parallel BC'],
	'una-par': ['AB \\parallel DC', 'AD \\nparallel BC'],
	'obliqui': ['AD \\cong BC'],
	'retto-A': ['\\hat{A} = 90^\\circ'],
	'consec': ['AB \\cong BC'],
};
/** The condition sets, the answer the lesson gives and the distractors that come from its warnings. */
const RECOGNISE: { conds: string[]; answer: Family; wrong: Family[] }[] = [
	{ conds: ['diag-meta'], answer: 'par', wrong: ['rett', 'rombo', 'trap'] },
	{ conds: ['diag-meta', 'diag-cong'], answer: 'rett', wrong: ['quad', 'par', 'rombo'] },
	{ conds: ['diag-meta', 'diag-perp'], answer: 'rombo', wrong: ['quad', 'par', 'rett'] },
	{ conds: ['diag-meta', 'diag-cong', 'diag-perp'], answer: 'quad', wrong: ['rombo', 'rett', 'par'] },
	{ conds: ['diag-perp'], answer: 'nessuna', wrong: ['rombo', 'quad', 'par'] },
	{ conds: ['diag-cong'], answer: 'nessuna', wrong: ['rett', 'trap-iso', 'par'] },
	{ conds: ['diag-cong', 'diag-perp'], answer: 'nessuna', wrong: ['quad', 'rombo', 'rett'] },
	{ conds: ['lati-opp'], answer: 'par', wrong: ['rett', 'rombo', 'trap-iso'] },
	{ conds: ['lati-4'], answer: 'rombo', wrong: ['quad', 'par', 'rett'] },
	{ conds: ['retti-4'], answer: 'rett', wrong: ['quad', 'par', 'rombo'] },
	{ conds: ['ang-opp'], answer: 'par', wrong: ['rett', 'rombo', 'trap-iso'] },
	{ conds: ['par-cong'], answer: 'par', wrong: ['trap', 'rett', 'nessuna'] },
	{ conds: ['due-par'], answer: 'par', wrong: ['trap', 'rett', 'rombo'] },
	{ conds: ['lati-4', 'retto-A'], answer: 'quad', wrong: ['rombo', 'rett', 'par'] },
	{ conds: ['retti-4', 'consec'], answer: 'quad', wrong: ['rett', 'rombo', 'par'] },
	{ conds: ['una-par'], answer: 'trap', wrong: ['par', 'trap-iso', 'nessuna'] },
	{ conds: ['una-par', 'obliqui'], answer: 'trap-iso', wrong: ['par', 'trap', 'rett'] },
	{ conds: ['una-par', 'retto-A'], answer: 'trap-rett', wrong: ['rett', 'trap', 'par'] },
	{ conds: ['due-par', 'diag-cong'], answer: 'rett', wrong: ['par', 'quad', 'trap-iso'] },
	{ conds: ['due-par', 'diag-perp'], answer: 'rombo', wrong: ['par', 'quad', 'rett'] },
	{ conds: ['due-par', 'retto-A'], answer: 'rett', wrong: ['par', 'quad', 'trap-rett'] },
	{ conds: ['lati-opp', 'diag-perp'], answer: 'rombo', wrong: ['par', 'quad', 'rett'] },
	{ conds: ['retti-4', 'diag-perp'], answer: 'quad', wrong: ['rett', 'rombo', 'par'] },
	{ conds: ['lati-4', 'diag-cong'], answer: 'quad', wrong: ['rombo', 'rett', 'par'] },
	{ conds: ['due-par', 'consec'], answer: 'rombo', wrong: ['par', 'quad', 'rett'] },
	{ conds: ['lati-4', 'diag-perp'], answer: 'rombo', wrong: ['quad', 'par', 'rett'] },
	{ conds: ['par-cong', 'retto-A'], answer: 'rett', wrong: ['par', 'quad', 'trap-rett'] },
	{ conds: ['lati-opp', 'diag-cong'], answer: 'rett', wrong: ['par', 'quad', 'rombo'] },
];
/** Why, in the words of the lesson. */
const REASON: Record<string, string> = {
	'diag-meta': 'le diagonali che si tagliano a metà bastano per dire che è un parallelogramma',
	'lati-opp': 'i lati opposti congruenti a due a due bastano per dire che è un parallelogramma',
	'ang-opp': 'gli angoli opposti congruenti a due a due bastano per dire che è un parallelogramma',
	'par-cong': 'due lati opposti paralleli e congruenti bastano per dire che è un parallelogramma',
	'due-par': 'con i lati opposti paralleli è un parallelogramma, per definizione',
	'lati-4': 'con i quattro lati congruenti è un rombo, per definizione',
	'retti-4': 'con i quattro angoli retti è un rettangolo, per definizione',
	'una-par': 'con due soli lati opposti paralleli è un trapezio, per definizione',
};

/** The `\text{}` lines of a sentence, as `textBlock` breaks them. */
function proseLines(prose: string): string[] {
	const block = textBlock(prose);
	const m = /^\\begin\{array\}\{l\} (.*) \\end\{array\}$/.exec(block);
	return m ? m[1].split(' \\\\ ') : [block];
}

function level5(rng: Rng): { sample: Omit<Sample, 'generatorId' | 'level' | 'seed'> } {
	const item = rng.pick(RECOGNISE);
	const L = rng.pick(LABELS);
	const conds = shuffle(rng, item.conds);
	const items = conds.flatMap((c) => COND[c]).map((f) => relabel(f, L));
	const name = relabel('ABCD', L);
	const hasM = conds.includes('diag-meta');
	const intro = hasM
		? relabelProse('Le diagonali del quadrilatero $ABCD$ si incontrano nel punto $M$. Si sa soltanto che:', L)
		: relabelProse('Del quadrilatero $ABCD$ si sa soltanto che:', L);
	const question = 'Qual è il nome più preciso che gli si può dare con certezza?';
	const problem = `\\begin{array}{l} ${[...proseLines(intro), items.join(' \\quad '), ...proseLines(question)].join(' \\\\ ')} \\end{array}`;
	const steps = recogniseSteps(item.conds, item.answer, L);
	const opts: ChoiceOption[] = [item.answer, ...item.wrong].map((f) => ({ latex: t(FAMILY_NAME[f]), values: [f] }));
	return {
		sample: {
			prompt: 'Scegli la risposta corretta.',
			problem,
			solution: t(FAMILY_NAME[item.answer]),
			steps,
			answer: finish(rng, opts),
			params: { case: item.answer, conds: item.conds, labels: name, answer: item.answer },
		},
	};
}

function recogniseSteps(conds: string[], answer: Family, L: Record<string, string>): string[] {
	const r = (s: string) => proseTex(relabelProse(s, L));
	const has = (c: string) => conds.includes(c);
	const out: string[] = [];
	const base = conds.find((c) => REASON[c]);
	if (base) out.push(t(`Per la lezione, ${REASON[base]}.`));
	const diagOnly = conds.every((c) => c === 'diag-cong' || c === 'diag-perp');
	if (diagOnly) {
		out.push(t('Le diagonali non si tagliano per forza a metà, quindi non è detto che sia un parallelogramma.'));
		if (has('diag-perp')) out.push(t('Diagonali perpendicolari non vuol dire rombo: le ha anche un aquilone.'));
		if (has('diag-cong') && !has('diag-perp')) out.push(t('Diagonali congruenti le ha anche il trapezio isoscele, che non è un parallelogramma.'));
		out.push(t('Non si può dire di più: è un quadrilatero, senza una famiglia sicura.'));
		return out;
	}
	switch (answer) {
		case 'rett':
			if (has('diag-cong')) out.push(t('Un parallelogramma con le diagonali congruenti è un rettangolo.'));
			if (has('retto-A')) out.push(t('Gli angoli consecutivi di un parallelogramma sono supplementari: con un angolo retto lo sono tutti e quattro, ed è un rettangolo.'));
			if (has('retti-4')) out.push(t('Non sappiamo se i lati sono congruenti, quindi non possiamo dire che sia un quadrato.'));
			break;
		case 'rombo':
			if (has('diag-perp') && !has('lati-4')) out.push(t('Un parallelogramma con le diagonali perpendicolari è un rombo.'));
			if (has('consec')) out.push(r('I lati opposti sono congruenti, e con $AB \\cong BC$ lo sono tutti e quattro: è un rombo.'));
			if (has('lati-4') && has('diag-perp')) out.push(t('Le diagonali perpendicolari le hanno tutti i rombi: non dicono che sia un quadrato.'));
			if (has('lati-4') && !has('diag-perp')) out.push(t('Non sappiamo se gli angoli sono retti, quindi non possiamo dire che sia un quadrato.'));
			break;
		case 'quad':
			if (has('diag-meta')) out.push(t('Diagonali che si tagliano a metà, congruenti e perpendicolari: è un rettangolo e un rombo insieme, cioè un quadrato.'));
			else if (has('retto-A')) out.push(t('Un rombo è un parallelogramma, e con un angolo retto ha tutti gli angoli retti: è anche un rettangolo, quindi un quadrato.'));
			else if (has('consec')) out.push(r('Un rettangolo ha i lati opposti congruenti, e con $AB \\cong BC$ ha i quattro lati congruenti: è anche un rombo, quindi un quadrato.'));
			else if (has('diag-perp')) out.push(t('Un rettangolo con le diagonali perpendicolari è anche un rombo, quindi un quadrato.'));
			else out.push(t('Un rombo con le diagonali congruenti è anche un rettangolo, quindi un quadrato.'));
			break;
		case 'par':
			out.push(t('Non sappiamo nulla sugli angoli retti o sui lati consecutivi, quindi non si può dire di più.'));
			break;
		case 'trap':
			out.push(t('Non sappiamo nulla sui lati obliqui o sugli angoli, quindi non si può dire di più.'));
			break;
		case 'trap-iso':
			out.push(r('I lati obliqui $AD$ e $BC$ sono congruenti: il trapezio è isoscele.'));
			break;
		case 'trap-rett':
			out.push(r('Il lato obliquo $AD$ è perpendicolare alla base $AB$: il trapezio è rettangolo.'));
			break;
		default:
			break;
	}
	return out;
}

// ---------------------------------------------------------------------------
// Level 6: which statement is true (or false)

type Fam = 'par' | 'rett' | 'rombo' | 'quad' | 'trap' | 'trap-iso';
const NOUN: Record<Fam | 'quadrilatero', string> = {
	par: 'parallelogramma',
	rett: 'rettangolo',
	rombo: 'rombo',
	quad: 'quadrato',
	trap: 'trapezio',
	'trap-iso': 'trapezio isoscele',
	quadrilatero: 'quadrilatero',
};
const PROP: Record<string, string> = {
	'diag-meta': 'le diagonali si tagliano a metà',
	'diag-cong': 'le diagonali sono congruenti',
	'diag-perp': 'le diagonali sono perpendicolari',
	'diag-bis': 'le diagonali sono bisettrici degli angoli',
	'ang-opp-cong': 'gli angoli opposti sono congruenti',
	'ang-opp-supp': 'gli angoli opposti sono supplementari',
	'ang-cons-supp': 'gli angoli consecutivi sono supplementari',
	'ang-cons-cong': 'gli angoli consecutivi sono congruenti',
	'lati-opp': 'i lati opposti sono congruenti',
};
const HAS: Record<string, string> = {
	'diag-perp': 'le diagonali perpendicolari',
	'diag-cong': 'le diagonali congruenti',
	'diag-meta': 'le diagonali che si tagliano a metà',
	'due-par': 'due lati opposti paralleli',
	'par-cong': 'due lati opposti paralleli e congruenti',
	'retto': 'un angolo retto',
	'consec': 'due lati consecutivi congruenti',
};
type Stmt =
	| { k: 'ogni'; x: Fam; y: Fam }
	| { k: 'nessun'; x: Fam; y: Fam }
	| { k: 'prop'; x: Fam; p: string }
	| { k: 'se'; x: Fam | 'quadrilatero'; c: string; y: Fam };
const S = {
	ogni: (x: Fam, y: Fam): Stmt => ({ k: 'ogni', x, y }),
	nessun: (x: Fam, y: Fam): Stmt => ({ k: 'nessun', x, y }),
	prop: (x: Fam, p: string): Stmt => ({ k: 'prop', x, p }),
	se: (x: Fam | 'quadrilatero', c: string, y: Fam): Stmt => ({ k: 'se', x, c, y }),
};
/** True statements: the inclusions, the properties and the sufficient conditions of the lesson. */
const TRUE_STMTS: Stmt[] = [
	S.ogni('quad', 'rett'),
	S.ogni('quad', 'rombo'),
	S.ogni('rett', 'par'),
	S.ogni('rombo', 'par'),
	S.ogni('quad', 'par'),
	S.nessun('trap', 'par'),
	S.nessun('par', 'trap'),
	S.prop('par', 'diag-meta'),
	S.prop('rett', 'diag-cong'),
	S.prop('rombo', 'diag-perp'),
	S.prop('rombo', 'diag-bis'),
	S.prop('quad', 'diag-cong'),
	S.prop('quad', 'diag-perp'),
	S.prop('trap-iso', 'diag-cong'),
	S.prop('par', 'ang-opp-cong'),
	S.prop('par', 'ang-cons-supp'),
	S.prop('trap-iso', 'ang-opp-supp'),
	S.prop('rombo', 'lati-opp'),
	S.prop('rett', 'ang-cons-cong'),
	S.se('par', 'diag-cong', 'rett'),
	S.se('par', 'diag-perp', 'rombo'),
	S.se('quadrilatero', 'diag-meta', 'par'),
	S.se('quadrilatero', 'par-cong', 'par'),
	S.se('rett', 'consec', 'quad'),
	S.se('rombo', 'retto', 'quad'),
	S.se('par', 'retto', 'rett'),
	S.se('rombo', 'diag-cong', 'quad'),
];
/** False statements, most of them from the warnings of the lesson. */
const FALSE_STMTS: Stmt[] = [
	S.ogni('rett', 'quad'),
	S.ogni('rombo', 'quad'),
	S.ogni('rombo', 'rett'),
	S.ogni('rett', 'rombo'),
	S.ogni('par', 'rett'),
	S.ogni('par', 'rombo'),
	S.ogni('par', 'trap'),
	S.ogni('trap', 'par'),
	S.nessun('quad', 'rett'),
	S.nessun('quad', 'rombo'),
	S.nessun('rombo', 'rett'),
	S.nessun('rett', 'par'),
	S.prop('par', 'diag-cong'),
	S.prop('par', 'diag-perp'),
	S.prop('rett', 'diag-perp'),
	S.prop('rombo', 'diag-cong'),
	S.prop('trap-iso', 'diag-meta'),
	S.prop('par', 'ang-cons-cong'),
	S.prop('par', 'ang-opp-supp'),
	S.prop('rett', 'diag-bis'),
	S.se('quadrilatero', 'diag-perp', 'rombo'),
	S.se('quadrilatero', 'due-par', 'par'),
	S.se('quadrilatero', 'diag-cong', 'rett'),
	S.se('rombo', 'diag-perp', 'quad'),
	S.se('par', 'retto', 'quad'),
	S.se('rett', 'diag-cong', 'quad'),
];

function stmtText(s: Stmt): string {
	switch (s.k) {
		case 'ogni':
			return `Ogni ${NOUN[s.x]} è un ${NOUN[s.y]}`;
		case 'nessun':
			return `Nessun ${NOUN[s.x]} è un ${NOUN[s.y]}`;
		case 'prop':
			return `In ogni ${NOUN[s.x]} ${PROP[s.p]}`;
		case 'se':
			return `Se un ${NOUN[s.x]} ha ${HAS[s.c]}, è un ${NOUN[s.y]}`;
	}
}
const stmtKey = (s: Stmt) => Object.values(s).join(':');

/** Words split into lines of at most `width` characters, as a centred block for an answer button. */
function wrapOption(text: string, width = 28): string {
	const words = text.split(' ');
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && cur.length + 1 + w.length > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return out.length === 1 ? t(out[0]) : `\\begin{gathered} ${out.map(t).join(' \\\\ ')} \\end{gathered}`;
}

/** Why each statement is true or false, in the words of the lesson (keyed by stmtKey). */
const WHY: Record<string, string> = {
	'ogni:quad:rett': 'Vera: il quadrato ha i quattro angoli retti, quindi è un rettangolo.',
	'ogni:quad:rombo': 'Vera: il quadrato ha i quattro lati congruenti, quindi è un rombo.',
	'ogni:rett:par': 'Vera: il rettangolo ha gli angoli opposti congruenti, quindi è un parallelogramma.',
	'ogni:rombo:par': 'Vera: il rombo ha i lati opposti congruenti, quindi è un parallelogramma.',
	'ogni:quad:par': 'Vera: il quadrato è un rettangolo, e ogni rettangolo è un parallelogramma.',
	'nessun:trap:par': 'Vera: il trapezio ha due soli lati paralleli, il parallelogramma due coppie.',
	'nessun:par:trap': 'Vera: il parallelogramma ha due coppie di lati paralleli, il trapezio una sola.',
	'prop:par:diag-meta': 'Vera: è una proprietà di ogni parallelogramma.',
	'prop:rett:diag-cong': 'Vera: è una proprietà di ogni rettangolo.',
	'prop:rombo:diag-perp': 'Vera: è una proprietà di ogni rombo.',
	'prop:rombo:diag-bis': 'Vera: è una proprietà di ogni rombo.',
	'prop:quad:diag-cong': 'Vera: il quadrato è un rettangolo.',
	'prop:quad:diag-perp': 'Vera: il quadrato è un rombo.',
	'prop:trap-iso:diag-cong': 'Vera: è una proprietà del trapezio isoscele.',
	'prop:par:ang-opp-cong': 'Vera: è una proprietà di ogni parallelogramma.',
	'prop:par:ang-cons-supp': 'Vera: sono coniugati interni formati da due lati paralleli.',
	'prop:trap-iso:ang-opp-supp': 'Vera: è una proprietà del trapezio isoscele.',
	'prop:rombo:lati-opp': 'Vera: i lati del rombo sono tutti congruenti.',
	'prop:rett:ang-cons-cong': 'Vera: gli angoli del rettangolo sono tutti retti.',
	'se:par:diag-cong:rett': 'Vera: un parallelogramma con le diagonali congruenti è un rettangolo.',
	'se:par:diag-perp:rombo': 'Vera: un parallelogramma con le diagonali perpendicolari è un rombo.',
	'se:quadrilatero:diag-meta:par': 'Vera: è una delle condizioni per riconoscere un parallelogramma.',
	'se:quadrilatero:par-cong:par': 'Vera: è una delle condizioni per riconoscere un parallelogramma.',
	'se:rett:consec:quad': 'Vera: i lati opposti sono congruenti, quindi lo sono tutti e quattro.',
	'se:rombo:retto:quad': 'Vera: gli angoli consecutivi sono supplementari, quindi sono tutti retti.',
	'se:par:retto:rett': 'Vera: gli angoli consecutivi sono supplementari, quindi sono tutti retti.',
	'se:rombo:diag-cong:quad': 'Vera: il rombo è un parallelogramma, e con le diagonali congruenti è anche un rettangolo.',
	'ogni:rett:quad': 'Falsa: un rettangolo è un quadrato solo se ha anche i lati congruenti.',
	'ogni:rombo:quad': 'Falsa: un rombo è un quadrato solo se ha anche gli angoli retti.',
	'ogni:rombo:rett': 'Falsa: un rombo è un rettangolo solo se è un quadrato.',
	'ogni:rett:rombo': 'Falsa: un rettangolo è un rombo solo se è un quadrato.',
	'ogni:par:rett': 'Falsa: un parallelogramma è un rettangolo solo se ha gli angoli retti.',
	'ogni:par:rombo': 'Falsa: un parallelogramma è un rombo solo se ha i lati congruenti.',
	'ogni:par:trap': 'Falsa: il trapezio ha due soli lati paralleli, quindi un parallelogramma non è un trapezio.',
	'ogni:trap:par': 'Falsa: il trapezio ha due soli lati paralleli.',
	'nessun:quad:rett': 'Falsa: ogni quadrato è un rettangolo, perché ha i quattro angoli retti.',
	'nessun:quad:rombo': 'Falsa: ogni quadrato è un rombo, perché ha i quattro lati congruenti.',
	'nessun:rombo:rett': 'Falsa: il quadrato è sia un rombo sia un rettangolo.',
	'nessun:rett:par': 'Falsa: ogni rettangolo è un parallelogramma.',
	'prop:par:diag-cong': 'Falsa: le diagonali congruenti le ha il rettangolo, non ogni parallelogramma.',
	'prop:par:diag-perp': 'Falsa: le diagonali perpendicolari le ha il rombo, non ogni parallelogramma.',
	'prop:rett:diag-perp': 'Falsa: le diagonali di un rettangolo sono perpendicolari solo se è un quadrato.',
	'prop:rombo:diag-cong': 'Falsa: le diagonali di un rombo sono congruenti solo se è un quadrato.',
	'prop:trap-iso:diag-meta': 'Falsa: tagliarsi a metà è una proprietà dei parallelogrammi, e il trapezio non lo è.',
	'prop:par:ang-cons-cong': 'Falsa: gli angoli consecutivi sono supplementari, e sono congruenti solo se sono retti.',
	'prop:par:ang-opp-supp': 'Falsa: gli angoli opposti sono congruenti, e sono supplementari solo se sono retti.',
	'prop:rett:diag-bis': 'Falsa: le diagonali sono bisettrici nel rombo; un rettangolo le ha solo se è un quadrato.',
	'se:quadrilatero:diag-perp:rombo': "Falsa: anche l'aquilone ha le diagonali perpendicolari, e non è un rombo.",
	'se:quadrilatero:due-par:par': 'Falsa: un quadrilatero con due lati opposti paralleli può essere un trapezio.',
	'se:quadrilatero:diag-cong:rett': 'Falsa: anche il trapezio isoscele ha le diagonali congruenti.',
	'se:rombo:diag-perp:quad': 'Falsa: ogni rombo ha le diagonali perpendicolari, ma non ogni rombo è un quadrato.',
	'se:par:retto:quad': 'Falsa: con un angolo retto il parallelogramma è un rettangolo, ma i lati possono essere diversi.',
	'se:rett:diag-cong:quad': 'Falsa: ogni rettangolo ha le diagonali congruenti, ma non ogni rettangolo è un quadrato.',
};

function level6(rng: Rng): { sample: Omit<Sample, 'generatorId' | 'level' | 'seed'> } {
	const askTrue = rng.int(0, 1) === 1;
	const [one] = shuffle(rng, askTrue ? TRUE_STMTS : FALSE_STMTS);
	const others = shuffle(rng, askTrue ? FALSE_STMTS : TRUE_STMTS).slice(0, 3);
	const opts: ChoiceOption[] = [one, ...others].map((s) => ({ latex: wrapOption(stmtText(s)), values: [stmtKey(s)] }));
	const steps = [one, ...others].map((s) => {
		return t(`${stmtText(s)}. ${WHY[stmtKey(s)]}`);
	});
	return {
		sample: {
			prompt: 'Scegli la risposta corretta.',
			problem: t(askTrue ? 'Quale di queste affermazioni è vera?' : 'Quale di queste affermazioni è falsa?'),
			solution: t(`${stmtText(one)}`),
			steps,
			answer: finish(rng, opts),
			params: { case: askTrue ? 'vera' : 'falsa', ask: askTrue ? 'vera' : 'falsa', statements: [one, ...others].map(stmtKey) },
		},
	};
}

// ---------------------------------------------------------------------------
// Level 7: the justification of a step of a proof of the lesson

const JUST: Record<string, string> = {
	alterni: 'Sono angoli alterni interni',
	corrispondenti: 'Sono angoli corrispondenti',
	coniugati: 'Sono angoli coniugati interni',
	'opposti-vertice': 'Sono angoli opposti al vertice',
	crit1: 'Primo criterio di congruenza',
	crit2: 'Secondo criterio di congruenza',
	crit3: 'Terzo criterio di congruenza',
	ipotesi: 'Per ipotesi',
	'lati-opp': 'Lati opposti di un parallelogramma',
	retti: 'Sono entrambi angoli retti',
	'lati-rombo': 'I lati del rombo sono congruenti',
	'diag-meta': 'Le diagonali si tagliano a metà',
	adiacenti: 'Sono adiacenti e congruenti',
	meta: 'Metà di segmenti congruenti',
	'su-parallele': 'Stanno su due rette parallele',
	cond4: 'Due lati opposti paralleli e congruenti',
	cond1: 'Lati opposti congruenti a due a due',
	cond3: 'Diagonali che si tagliano a metà',
	'def-par': 'Ha i lati opposti paralleli',
	'base-isoscele': 'Angoli alla base di un triangolo isoscele',
	'base-trapezio': 'Angoli alla base del trapezio isoscele',
	'par-alterni': 'Alterni interni congruenti',
	'par-corrispondenti': 'Corrispondenti congruenti',
	'par-opposti': 'Opposti al vertice congruenti',
};

interface ProofStep {
	/** The step as a formula (points as in the lesson; relabelled when shown). */
	claim: string;
	/** What is already known, when the step uses it: a sentence with $…$. */
	known?: string;
	answer: string;
	wrong: string[];
	/** The justification in the steps of the solution, one sentence. */
	why: string;
}
interface Proof {
	id: string;
	context: string;
	steps: ProofStep[];
}

const PAIR_WRONG = (right: string) => ['alterni', 'corrispondenti', 'coniugati', 'opposti-vertice'].filter((j) => j !== right);
const CRIT_WRONG = (right: string, extra: string) => [...['crit1', 'crit2', 'crit3'].filter((j) => j !== right), extra];

const PROOFS: Proof[] = [
	{
		id: 'parallelogramma-proprieta',
		context: 'Ipotesi: $ABCD$ è un quadrilatero con $AB \\parallel DC$ e $AD \\parallel BC$. Si traccia la diagonale $AC$ e si confrontano i triangoli $ABC$ e $CDA$.',
		steps: [
			{ claim: '\\widehat{BAC} \\cong \\widehat{DCA}', answer: 'alterni', wrong: PAIR_WRONG('alterni'), why: 'Sono alterni interni, formati dalle parallele $AB$ e $DC$ con la trasversale $AC$.' },
			{ claim: '\\widehat{BCA} \\cong \\widehat{DAC}', answer: 'alterni', wrong: PAIR_WRONG('alterni'), why: 'Sono alterni interni, formati dalle parallele $AD$ e $BC$ con la trasversale $AC$.' },
			{
				claim: 'ABC \\cong CDA',
				known: 'Si sa già che $AC$ è in comune, $\\widehat{BAC} \\cong \\widehat{DCA}$ e $\\widehat{BCA} \\cong \\widehat{DAC}$.',
				answer: 'crit2',
				wrong: CRIT_WRONG('crit2', 'ipotesi'),
				why: 'Un lato e i due angoli adiacenti a esso: è il secondo criterio.',
			},
		],
	},
	{
		id: 'parallelogramma-diagonali',
		context: '$ABCD$ è un parallelogramma e le diagonali $AC$ e $BD$ si incontrano nel punto $M$. Si confrontano i triangoli $ABM$ e $CDM$.',
		steps: [
			{ claim: 'AB \\cong DC', answer: 'lati-opp', wrong: ['ipotesi', 'diag-meta', 'lati-rombo'], why: 'Sono lati opposti di un parallelogramma.' },
			{ claim: '\\widehat{MAB} \\cong \\widehat{MCD}', answer: 'alterni', wrong: PAIR_WRONG('alterni'), why: 'Sono alterni interni, formati dalle parallele $AB$ e $DC$ con la trasversale $AC$.' },
			{ claim: '\\widehat{MBA} \\cong \\widehat{MDC}', answer: 'alterni', wrong: PAIR_WRONG('alterni'), why: 'Sono alterni interni, formati dalle parallele $AB$ e $DC$ con la trasversale $BD$.' },
			{
				claim: 'ABM \\cong CDM',
				known: 'Si sa già che $AB \\cong DC$, $\\widehat{MAB} \\cong \\widehat{MCD}$ e $\\widehat{MBA} \\cong \\widehat{MDC}$.',
				answer: 'crit2',
				wrong: CRIT_WRONG('crit2', 'diag-meta'),
				why: 'Un lato e i due angoli adiacenti a esso: è il secondo criterio.',
			},
		],
	},
	{
		id: 'diagonali-parallelogramma',
		context: 'Ipotesi: le diagonali $AC$ e $BD$ del quadrilatero $ABCD$ si incontrano in $M$, con $AM \\cong MC$ e $BM \\cong MD$. Tesi: $AB \\parallel DC$. Si confrontano i triangoli $AMB$ e $CMD$.',
		steps: [
			{ claim: '\\widehat{AMB} \\cong \\widehat{CMD}', answer: 'opposti-vertice', wrong: PAIR_WRONG('opposti-vertice'), why: 'Sono angoli opposti al vertice.' },
			{
				claim: 'AMB \\cong CMD',
				known: 'Si sa già che $AM \\cong MC$, $BM \\cong MD$ e $\\widehat{AMB} \\cong \\widehat{CMD}$.',
				answer: 'crit1',
				wrong: CRIT_WRONG('crit1', 'ipotesi'),
				why: "Due lati e l'angolo compreso: è il primo criterio.",
			},
			{
				claim: 'AB \\parallel DC',
				known: 'Si sa già che $\\widehat{MAB} \\cong \\widehat{MCD}$, e $M$ sta su $AC$.',
				answer: 'par-alterni',
				wrong: ['par-corrispondenti', 'par-opposti', 'ipotesi'],
				why: 'Le rette $AB$ e $DC$ formano con la trasversale $AC$ angoli alterni interni congruenti: per il criterio di parallelismo sono parallele.',
			},
		],
	},
	{
		id: 'punti-medi',
		context: 'Ipotesi: $ABCD$ è un parallelogramma, $M$ è il punto medio di $AB$ e $N$ è il punto medio di $DC$. Tesi: $AMCN$ è un parallelogramma.',
		steps: [
			{ claim: 'AB \\cong DC', answer: 'lati-opp', wrong: ['ipotesi', 'meta', 'cond4'], why: 'Sono lati opposti di un parallelogramma.' },
			{ claim: 'AM \\cong NC', known: 'Si sa già che $AB \\cong DC$.', answer: 'meta', wrong: ['lati-opp', 'ipotesi', 'su-parallele'], why: '$AM$ è metà di $AB$ e $NC$ è metà di $DC$: metà di segmenti congruenti sono congruenti.' },
			{ claim: 'AM \\parallel NC', answer: 'su-parallele', wrong: ['meta', 'par-alterni', 'lati-opp'], why: '$AM$ sta sulla retta $AB$ e $NC$ sulla retta $DC$, che sono parallele.' },
			{
				claim: 'AMCN \\text{ è un parallelogramma}',
				known: 'Si sa già che $AM \\cong NC$ e $AM \\parallel NC$.',
				answer: 'cond4',
				wrong: ['cond1', 'cond3', 'def-par'],
				why: 'I lati opposti $AM$ e $NC$ sono paralleli e congruenti: è la condizione 4.',
			},
		],
	},
	{
		id: 'rettangolo-diagonali',
		context: '$ABCD$ è un rettangolo. Per dimostrare che $AC \\cong BD$ si confrontano i triangoli $ABC$ e $BAD$.',
		steps: [
			{ claim: 'BC \\cong AD', answer: 'lati-opp', wrong: ['ipotesi', 'diag-meta', 'lati-rombo'], why: 'Il rettangolo è un parallelogramma, e $BC$ e $AD$ sono lati opposti.' },
			{ claim: '\\widehat{ABC} \\cong \\widehat{BAD}', answer: 'retti', wrong: ['alterni', 'opposti-vertice', 'base-isoscele'], why: 'Sono due angoli del rettangolo, entrambi retti.' },
			{
				claim: 'ABC \\cong BAD',
				known: 'Si sa già che $AB$ è in comune, $BC \\cong AD$ e $\\widehat{ABC} \\cong \\widehat{BAD}$.',
				answer: 'crit1',
				wrong: CRIT_WRONG('crit1', 'lati-opp'),
				why: "Due lati e l'angolo compreso: è il primo criterio.",
			},
		],
	},
	{
		id: 'rombo-diagonali',
		context: '$ABCD$ è un rombo e le diagonali si incontrano nel punto $M$. Si confrontano i triangoli $AMB$ e $AMD$.',
		steps: [
			{ claim: 'AB \\cong AD', answer: 'lati-rombo', wrong: ['lati-opp', 'diag-meta', 'ipotesi'], why: 'I quattro lati del rombo sono congruenti.' },
			{ claim: 'BM \\cong MD', answer: 'diag-meta', wrong: ['lati-rombo', 'lati-opp', 'meta'], why: 'Il rombo è un parallelogramma, e le diagonali di un parallelogramma si tagliano a metà.' },
			{
				claim: 'AMB \\cong AMD',
				known: 'Si sa già che $AB \\cong AD$, $BM \\cong MD$ e $AM$ è in comune.',
				answer: 'crit3',
				wrong: CRIT_WRONG('crit3', 'lati-rombo'),
				why: 'Tre lati congruenti: è il terzo criterio.',
			},
			{
				claim: '\\widehat{AMB} = \\widehat{AMD} = 90^\\circ',
				known: 'Si sa già che $\\widehat{AMB} \\cong \\widehat{AMD}$.',
				answer: 'adiacenti',
				wrong: ['opposti-vertice', 'alterni', 'retti'],
				why: 'Sono adiacenti, quindi la somma è un angolo piatto; sono congruenti, quindi misurano $90^\\circ$ ciascuno.',
			},
		],
	},
	{
		id: 'trapezio-angoli',
		context: 'Ipotesi: $ABCD$ è un trapezio con le basi $AB$ e $DC$, e $AD \\cong BC$. Da $C$ si traccia la parallela al lato $AD$, che incontra $AB$ in $E$.',
		steps: [
			{ claim: 'AECD \\text{ è un parallelogramma}', known: 'Si sa già che $AE \\parallel DC$ e $AD \\parallel EC$.', answer: 'def-par', wrong: ['cond4', 'cond3', 'ipotesi'], why: 'Ha i lati opposti paralleli: è la definizione di parallelogramma.' },
			{ claim: 'EC \\cong AD', answer: 'lati-opp', wrong: ['ipotesi', 'lati-rombo', 'meta'], why: '$AECD$ è un parallelogramma, e $EC$ e $AD$ sono lati opposti.' },
			{ claim: '\\widehat{CEB} \\cong \\widehat{CBE}', known: 'Si sa già che $EC \\cong BC$.', answer: 'base-isoscele', wrong: ['base-trapezio', 'corrispondenti', 'alterni'], why: 'Il triangolo $EBC$ è isoscele sulla base $EB$: gli angoli alla base sono congruenti.' },
			{ claim: '\\widehat{CEB} \\cong \\widehat{DAB}', answer: 'corrispondenti', wrong: PAIR_WRONG('corrispondenti'), why: 'Sono corrispondenti, formati dalle parallele $AD$ e $EC$ con la trasversale $AB$.' },
		],
	},
	{
		id: 'trapezio-diagonali',
		context: '$ABCD$ è un trapezio isoscele con le basi $AB$ e $DC$. Per dimostrare che $AC \\cong BD$ si confrontano i triangoli $ABC$ e $BAD$.',
		steps: [
			{ claim: 'BC \\cong AD', answer: 'ipotesi', wrong: ['lati-opp', 'diag-meta', 'meta'], why: 'Sono i lati obliqui di un trapezio isoscele: sono congruenti per ipotesi.' },
			{ claim: '\\widehat{ABC} \\cong \\widehat{BAD}', answer: 'base-trapezio', wrong: ['base-isoscele', 'alterni', 'retti'], why: 'Sono gli angoli adiacenti alla base maggiore di un trapezio isoscele.' },
			{
				claim: 'ABC \\cong BAD',
				known: 'Si sa già che $AB$ è in comune, $BC \\cong AD$ e $\\widehat{ABC} \\cong \\widehat{BAD}$.',
				answer: 'crit1',
				wrong: CRIT_WRONG('crit1', 'ipotesi'),
				why: "Due lati e l'angolo compreso: è il primo criterio.",
			},
		],
	},
];

function level7(rng: Rng): { sample: Omit<Sample, 'generatorId' | 'level' | 'seed'> } {
	const proof = rng.pick(PROOFS);
	const si = rng.int(0, proof.steps.length - 1);
	const step = proof.steps[si];
	const L = rng.pick(LABELS);
	const prose = relabelProse(`${proof.context}${step.known ? ` ${step.known}` : ''} Un passo della dimostrazione dice:`, L);
	const claim = relabel(step.claim, L);
	const problem = textBlock(prose, 46, [claim, t('Perché vale questo passo?')]);
	const opts: ChoiceOption[] = [step.answer, ...step.wrong].map((j) => ({ latex: wrapOption(JUST[j]), values: [j] }));
	return {
		sample: {
			prompt: 'Scegli la giustificazione del passo.',
			problem,
			solution: t(JUST[step.answer]),
			steps: [proseTex(relabelProse(step.why, L))],
			answer: finish(rng, opts),
			params: { case: proof.id, proof: proof.id, step: String(si), labels: relabel('ABCDMNE', L), answer: step.answer },
		},
	};
}

/** A sentence with $…$ formulas as \text{} pieces and formulas between them (for a step of the solution). */
function proseTex(s: string): string {
	return s
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((part) => (part.startsWith('$') ? ` ${part.slice(1, -1)} ` : t(part)))
		.join('')
		.trim();
}

// ---------------------------------------------------------------------------
// Assembly and checks

function assemble(level: number, seed: number, b: Built): Sample {
	return {
		generatorId: ID,
		level,
		seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: b.solution,
		steps: b.steps,
		answer: { kind: 'number', value: String(b.answer) },
		params: {
			...b.params,
			unit: b.unit,
			answer: String(b.answer),
			mistakes: b.mistakes.filter((m) => Number.isInteger(m) && m > 0 && m !== b.answer).map(String),
		},
	};
}

const NUMBER_LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };
const CHOICE_LEVELS: Record<number, typeof level5> = { 5: level5, 6: level6, 7: level7 };

function generate(rng: Rng, level: number): Sample {
	for (let attempt = 0; attempt < 1000; attempt++) {
		let sample: Sample;
		if (NUMBER_LEVELS[level]) sample = assemble(level, rng.seed, NUMBER_LEVELS[level](rng));
		else if (CHOICE_LEVELS[level]) sample = { generatorId: ID, level, seed: rng.seed, ...CHOICE_LEVELS[level](rng).sample };
		else throw new Error(`${ID}: unknown level ${level}`);
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(sample.problem + sample.steps.join(' '))) v.push('parole vietate');
	if (sample.level <= 4) {
		if (sample.answer.kind !== 'number') return ['la risposta deve essere un numero'];
		const n = Number(sample.answer.value);
		if (!Number.isInteger(n) || n <= 0) v.push(`risposta ${n} non intera positiva`);
		if (p.unit === 'deg' && (n >= 180 || n < 5)) v.push(`angolo ${n} fuori da (0, 180)`);
		if (String(p.answer) !== sample.answer.value) v.push('params.answer diverso dalla risposta');
		if (sample.level === 4 && p.case === 'equazione') {
			const x = Number(p.x);
			for (const [, a, b] of p.given as string[][]) {
				const val = Number(a) * x + Number(b);
				if (val < 30 || val > 150) v.push(`angolo ${val} fuori da [30, 150]`);
			}
		}
	} else {
		if (sample.answer.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
		const ch = sample.answer;
		if (ch.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
		const right = sample.level === 6 ? (p.statements as string[])[0] : p.answer;
		if (ch.options[ch.correct]?.values[0] !== right) v.push("l'opzione giusta non è la risposta");
		if (sample.level === 6 && (p.statements as string[]).some((k) => !WHY[k])) v.push('affermazione senza spiegazione');
	}
	if (sample.choice) {
		const ch = sample.choice;
		if (ch.options.length !== 4 || new Set(ch.options.map((o) => o.values[0])).size !== 4) v.push('scelta: servono quattro opzioni diverse');
		const right = sample.answer.kind === 'number' ? sample.answer.value : sample.answer.kind === 'choice' ? sample.answer.options[sample.answer.correct].values[0] : '';
		if (ch.options[ch.correct]?.values[0] !== right) v.push("scelta: l'opzione giusta non è la risposta");
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
	const mistakes = ((sample.params.mistakes ?? []) as string[]).map(Number);
	return numberOptions(rng, Number(sample.answer.value), mistakes, sample.params.unit as Unit);
}

export const geometriaQuadrilateri: Generator = {
	id: ID,
	title: 'Parallelogrammi e trapezi',
	levels: {
		1: { label: 'Angoli del quadrilatero e del parallelogramma', constraints: ['quarto angolo di un quadrilatero (somma 360°) o un angolo del parallelogramma dato un altro', 'risposta intera tra 5° e 175°'] },
		2: { label: 'Lati e diagonali', constraints: ['perimetro e lati del parallelogramma e del rombo, metà delle diagonali, diagonali del rettangolo', 'misure intere in cm'] },
		3: { label: 'Angoli con le diagonali', constraints: ['rombo: diagonali bisettrici e perpendicolari; rettangolo: triangoli isosceli AMB e AMD', 'risposta intera'] },
		4: { label: 'Angoli dei trapezi', constraints: ['trapezio isoscele o rettangolo, dato un angolo (circa 1 su 3) o con un\'equazione come nell\'esempio 5', 'x intera, angoli tra 30° e 150°'] },
		5: { label: 'Riconoscere il quadrilatero', constraints: ['condizioni su lati, angoli e diagonali; il nome più preciso sicuro', 'distrattori dagli avvisi della lezione'] },
		6: { label: 'Vero o falso sulle famiglie', constraints: ['quattro affermazioni su inclusioni, proprietà e condizioni; una sola vera (o una sola falsa)'] },
		7: { label: 'Il passo di una dimostrazione', constraints: ['un passo delle dimostrazioni della lezione, da giustificare', 'quattro giustificazioni'] },
	},
	generate,
	check,
	toChoice,
};

export default geometriaQuadrilateri;
