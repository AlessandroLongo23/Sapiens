/**
 * Similitudine. Spec: specs/exercises/similitudine.md
 *
 * Eight levels, from the "Per il generatore" section of the lesson's note (its nine proposals, with the
 * shadow of a tree joined to the line parallel to a side, and the map in scale joined to perimeters and
 * areas): similar rectangles and the ratio k, the correspondence of vertices from two angles, the line
 * parallel to a side and the shadow, the second and third criteria, homologous sides of a turned triangle,
 * the diagonals of a trapezoid, perimeters and areas, Euclid's theorems with numbers. No figures: every
 * exercise stands on its text. Levels 1, 2 and 4 answer with a choice; level 8 with a number or an exact
 * radical (expression); the others with a number, and a multiple-choice variant whose distractors are the
 * mistakes the lesson warns about.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { Surd } from '../surd';
import { buildChoice, shuffle } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'similitudine';

const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Numbers

const SR = (r: Rational) => Surd.rational(r);
/** √n for a positive integer n, simplified. */
const sqrtN = (n: number) => Surd.of(0, 1, n, 1);

const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

/** Decimal places of a rational with a finite expansion, or null if periodic. */
function decimals(r: Rational): number | null {
	let d = r.den;
	let e2 = 0;
	let e5 = 0;
	for (; d % 2 === 0; e2++) d /= 2;
	for (; d % 5 === 0; e5++) d /= 5;
	return d === 1 ? Math.max(e2, e5) : null;
}

/** 12, 3{,}5, \frac{5}{3}: a positive rational as the lesson writes it. */
function numTex(r: Rational): string {
	if (r.isInteger()) return r.num >= 10000 ? thousands(r.num) : String(r.num);
	const k = decimals(r);
	if (k === null) return `\\frac{${r.num}}{${r.den}}`;
	const s = String(Math.round((r.num * 10 ** k) / r.den)).padStart(k + 1, '0');
	return `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

/** n/d written as a fraction, followed by its value when that reads differently: \frac{30}{10} = 3. */
function ratioTex(n: number, d: number): string {
	const f = `\\frac{${n}}{${d}}`;
	const v = numTex(q(n, d));
	return v === f ? f : `${f} = ${v}`;
}

/** A value as the lesson writes it: a rational, or k√r. */
function valTex(v: Surd): string {
	return v.isRational() ? numTex(v.toRational()) : v.toLatex();
}

type Unit = 'cm' | 'cm2' | 'm' | 'm2' | '';
const UNIT_TEX: Record<Unit, string> = { cm: '\\text{ cm}', cm2: '\\text{ cm}^2', m: '\\text{ m}', m2: '\\text{ m}^2', '': '' };
const withUnit = (v: Surd, u: Unit) => `${valTex(v)}${UNIT_TEX[u]}`;
const cmR = (r: Rational) => `${numTex(r)}\\text{ cm}`;
const deg = (n: number) => `${n}^\\circ`;
const hat = (v: string) => `\\hat{${v}}`;
const seg = (s: string) => `\\overline{${s}}`;
/** "e" or "ed" before a letter, as the lesson writes "ed $\hat{E}$". */
const and = (letter: string) => (letter.startsWith('E') ? 'ed' : 'e');

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: { kind: 'value'; value: Surd; wrong: Surd[]; unit: Unit } | { kind: 'choice'; choice: ChoiceAnswer };
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: similar rectangles

const K1 = [q(1, 2), q(3, 4), q(4, 3), q(3, 2), q(5, 3), q(2), q(5, 2), q(3)];

function level1(rng: Rng): Built {
	const similar = rng.next() < 0.5;
	for (;;) {
		const b = rng.int(2, 9);
		const a = rng.int(b + 1, 14);
		let c: Rational;
		let d: Rational;
		let mode: string;
		if (similar) {
			const k = rng.pick(K1);
			c = q(a).mul(k);
			d = q(b).mul(k);
			mode = 'simili';
		} else if (rng.next() < 0.5) {
			const s = rng.int(1, 6);
			c = q(a + s);
			d = q(b + s);
			mode = 'stessa differenza';
		} else {
			const k = rng.pick(K1);
			c = q(a).mul(k);
			d = q(b).mul(k).add(q(rng.pick([-1, 1])));
			mode = 'quasi';
		}
		if (!c.isInteger() || !d.isInteger() || d.num < 2 || c.num > 40 || c.compare(d) <= 0) continue;
		if (!similar && c.mul(q(b)).equals(d.mul(q(a)))) continue;
		const r1 = rng.next() < 0.5 ? [a, b] : [b, a];
		const r2 = rng.next() < 0.5 ? [c.num, d.num] : [d.num, c.num];
		const k = c.div(q(a));
		const opt = (x: Rational | null): ChoiceOption | null => {
			if (x === null) return { latex: t('non simili'), values: ['non simili'] };
			if (x.sign() <= 0 || x.isOne()) return null;
			return { latex: `${t('simili, ')}k = ${numTex(x)}`, values: ['simili', x.toString()] };
		};
		const diff = c.sub(q(a));
		// Mistakes: the ratio of non-homologous sides, the difference of the sides, k the wrong way round.
		const choice = similar
			? buildChoice(rng, opt(k) as ChoiceOption, [opt(c.div(q(b))), opt(diff), opt(null), opt(q(a).div(c)), opt(d.div(q(a)))])
			: buildChoice(rng, opt(null) as ChoiceOption, [opt(c.div(q(a))), opt(d.div(q(b))), opt(diff), opt(c.div(q(b))), opt(d.div(q(a)))]);
		const steps = [
			t('Tutti i rettangoli hanno gli angoli retti: resta da controllare i lati'),
			t('I lati omologhi sono il lungo con il lungo e il corto con il corto'),
			`${ratioTex(c.num, a)}${t(', ')}${ratioTex(d.num, b)}`,
		];
		if (similar) steps.push(t('I rapporti sono uguali: ') + `R_2${t(' è simile a ')}R_1${t(' con ')}k = ${numTex(k)}`);
		else steps.push(`${c.num} \\cdot ${b} = ${c.num * b} \\neq ${a} \\cdot ${d.num} = ${a * d.num}${t(': i lati non sono in proporzione')}`);
		return {
			case: similar ? 'simili' : 'non simili',
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(
				`Il rettangolo $R_1$ ha i lati di $${r1[0]}$ cm e $${r1[1]}$ cm, il rettangolo $R_2$ di $${r2[0]}$ cm e $${r2[1]}$ cm. Sono simili? Se lo sono, $k$ è il rapporto tra un lato di $R_2$ e il suo omologo in $R_1$.`,
			),
			solution: similar ? `${t('simili, ')}k = ${numTex(k)}` : t('non simili'),
			steps,
			answer: { kind: 'choice', choice },
			params: { r1, r2, mode },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: two angles, and which vertices correspond

const PERMS = [
	[0, 1, 2],
	[0, 2, 1],
	[1, 0, 2],
	[1, 2, 0],
	[2, 0, 1],
	[2, 1, 0],
];
const permKey = (p: number[]) => p.map((i) => 'DEF'[i]).join('');

/** Three distinct angles, multiples of 5, at least 20 degrees. */
function scaleneAngles(rng: Rng): number[] {
	for (;;) {
		const x = 5 * rng.int(4, 28);
		const y = 5 * rng.int(4, 28);
		const z = 180 - x - y;
		if (z < 20 || x === y || y === z || x === z) continue;
		return [x, y, z];
	}
}

function level2(rng: Rng): Built {
	const similar = rng.next() < 0.75;
	const abc = scaleneAngles(rng);
	let def: number[];
	let perm: number[] = [];
	let shared = -1;
	if (similar) {
		perm = rng.pick(PERMS.slice(1)); // A -> 'DEF'[perm[0]], ...; never the alphabetical order
		def = [0, 0, 0];
		perm.forEach((j, i) => (def[j] = abc[i]));
	} else {
		for (;;) {
			const i0 = rng.int(0, 2);
			const j0 = rng.int(0, 2);
			const u = 5 * rng.int(4, 28);
			const w = 180 - abc[i0] - u;
			if (w < 20 || u === w || abc.includes(u) || abc.includes(w)) continue;
			const rest = [0, 1, 2].filter((j) => j !== j0);
			def = [0, 0, 0];
			def[j0] = abc[i0];
			def[rest[0]] = u;
			def[rest[1]] = w;
			shared = i0;
			perm = PERMS.find((p) => p[i0] === j0 && p !== PERMS[0]) ?? PERMS[1];
			break;
		}
	}
	const hideA = rng.int(0, 2);
	const hideD = rng.int(0, 2);
	const showA = [0, 1, 2].filter((i) => i !== hideA);
	const showD = [0, 1, 2].filter((i) => i !== hideD);
	const L1 = 'ABC';
	const L2 = 'DEF';
	const data = (L: string, ang: number[], show: number[]) =>
		`$${hat(L[show[0]])} = ${deg(ang[show[0]])}$ ${and(L[show[1]])} $${hat(L[show[1]])} = ${deg(ang[show[1]])}$`;
	const stmt = (p: number[]): ChoiceOption => ({ latex: `\\triangle ABC \\sim \\triangle ${permKey(p)}`, values: [`ABC~${permKey(p)}`] });
	const none: ChoiceOption = { latex: t('non sono simili'), values: ['non simili'] };
	let choice: ChoiceAnswer;
	if (similar) {
		const others = shuffle(
			rng,
			PERMS.filter((p) => p !== perm && p !== PERMS[0]),
		);
		choice = buildChoice(rng, stmt(perm), [stmt(PERMS[0]), stmt(others[0]), none]);
	} else {
		const others = shuffle(
			rng,
			PERMS.filter((p) => p !== perm && p !== PERMS[0]),
		);
		choice = buildChoice(rng, none, [stmt(PERMS[0]), stmt(perm), stmt(others[0])]);
	}
	const steps = [
		`${hat(L1[hideA])} = 180^\\circ - ${deg(abc[showA[0]])} - ${deg(abc[showA[1]])} = ${deg(abc[hideA])}`,
		`${hat(L2[hideD])} = 180^\\circ - ${deg(def[showD[0]])} - ${deg(def[showD[1]])} = ${deg(def[hideD])}`,
	];
	const sorted = (xs: number[]) => [...xs].sort((u, v) => u - v).map(deg).join(', ');
	if (similar) {
		steps.push(t('I due triangoli hanno gli angoli di ') + sorted(abc) + t(': per il primo criterio sono simili'));
		steps.push(
			t('Si corrispondono i vertici con angoli congruenti: ') +
				[0, 1, 2].map((i) => `${L1[i]} \\to ${L2[perm[i]]}`).join(',\\ '),
		);
	} else {
		steps.push(t('Gli angoli di ') + `ABC${t(' sono ')}${sorted(abc)}${t(', quelli di ')}DEF${t(' sono ')}${sorted(def)}`);
		steps.push(t('Un solo angolo congruente non basta: i triangoli non sono simili'));
	}
	return {
		case: similar ? 'simili' : 'non simili',
		prompt: "Scegli l'affermazione vera.",
		problem: textBlock(`Il triangolo $ABC$ ha ${data(L1, abc, showA)}; il triangolo $DEF$ ha ${data(L2, def, showD)}. Quale affermazione è vera?`),
		solution: similar ? `\\triangle ABC \\sim \\triangle ${permKey(perm)}` : t('non sono simili'),
		steps,
		answer: { kind: 'choice', choice },
		params: { abc, def, shared, correspondence: similar ? permKey(perm) : null },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a line parallel to a side, and the shadow

const PQ: [number, number][] = [
	[1, 2],
	[1, 3],
	[2, 3],
	[1, 4],
	[3, 4],
	[2, 5],
	[3, 5],
	[1, 5],
	[4, 5],
];

const STICKS = [q(1), q(6, 5), q(3, 2), q(8, 5), q(9, 5), q(2)];
const SHADOWS = [q(4, 5), q(1), q(6, 5), q(3, 2), q(8, 5), q(2), q(5, 2), q(3)];
const OBJECTS: [string, string, string, boolean][] = [
	['un albero', "l'albero", "dell'albero", false],
	['un lampione', 'il lampione', 'del lampione', false],
	['un campanile', 'il campanile', 'del campanile', false],
	['una torre', 'la torre', 'della torre', true],
];

function level3(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.3) {
		for (;;) {
			const h = rng.pick(STICKS);
			const s = rng.pick(SHADOWS);
			if (h.equals(s)) continue;
			const S = q(rng.int(4, 30));
			const x = h.mul(S).div(s);
			const dx = decimals(x);
			if (dx === null || dx > 2 || x.compare(q(3)) < 0 || x.compare(q(60)) > 0) continue;
			const [obj, the, of, fem] = rng.pick(OBJECTS);
			const askHeight = rng.next() < 0.6;
			const alto = fem ? 'alta' : 'alto';
			const intro = `Un bastone verticale alto $${numTex(h)}$ m fa un'ombra lunga $${numTex(s)}$ m.`;
			const steps = [
				t('I raggi del sole sono paralleli: i due triangoli (oggetto, ombra, raggio) hanno un angolo retto e un angolo acuto congruenti, e sono simili'),
			];
			if (askHeight) {
				steps.push(`x : ${numTex(S)} = ${numTex(h)} : ${numTex(s)}`);
				steps.push(`x = \\frac{${numTex(S)} \\cdot ${numTex(h)}}{${numTex(s)}} = ${numTex(x)}`);
				return {
					case: 'ombra',
					prompt: 'Risolvi il problema.',
					problem: textBlock(`${intro} Nello stesso momento l'ombra di ${obj} è lunga $${numTex(S)}$ m. Quanto è ${alto} ${the}?`),
					solution: `x = ${numTex(x)}\\text{ m}`,
					steps,
					// Mistakes: the ratio the wrong way round, the difference added instead of the ratio, the product.
					answer: { kind: 'value', value: SR(x), wrong: [SR(s.mul(S).div(h)), SR(h.add(S).sub(s)), SR(h.mul(s).div(S)), SR(S.sub(h))], unit: 'm' },
					params: { stick: h.toString(), shadow: s.toString(), given: 'ombra', x: S.toString() },
				};
			}
			steps.push(`${numTex(x)} : x = ${numTex(h)} : ${numTex(s)}`);
			steps.push(`x = \\frac{${numTex(x)} \\cdot ${numTex(s)}}{${numTex(h)}} = ${numTex(S)}`);
			return {
				case: 'ombra',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} Nello stesso momento ${obj} ${alto} $${numTex(x)}$ m fa ombra. Quanto è lunga l'ombra ${of}?`),
				solution: `x = ${numTex(S)}\\text{ m}`,
				steps,
				answer: { kind: 'value', value: SR(S), wrong: [SR(x.mul(h).div(s)), SR(x.sub(h).add(s)), SR(h.mul(s).div(x)), SR(x.sub(s))], unit: 'm' },
				params: { stick: h.toString(), shadow: s.toString(), given: 'altezza', x: x.toString() },
			};
		}
	}
	for (;;) {
		const [p, qq] = rng.pick(PQ);
		const m = rng.int(1, 6);
		const n = rng.int(1, 8);
		if (m * qq > 30 || n * qq > 30 || n * qq < 4) continue;
		const onAB = rng.next() < 0.5;
		const [V, W] = onAB ? ['D', 'B'] : ['E', 'C'];
		const AV = `A${V}`;
		const VW = `${V}${W}`;
		const AW = `A${W}`;
		const ad = q(m * p);
		const db = q(m * (qq - p));
		const ab = q(m * qq);
		const bc = q(n * qq);
		const de = q(n * p);
		const intro = 'Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$.';
		const similar = t('I triangoli ') + `ADE${t(' e ')}ABC${t(" hanno l'angolo ")}${hat('A')}${t(' in comune e gli angoli corrispondenti in ')}D${t(' e ')}B${t(' congruenti: sono simili')}`;
		if (u < 0.65) {
			return {
				case: 'DE',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} Sai che $${seg(AV)} = ${numTex(ad)}$ cm, $${seg(VW)} = ${numTex(db)}$ cm e $${seg('BC')} = ${numTex(bc)}$ cm. Quanto è lungo $DE$?`),
				solution: `${seg('DE')} = ${cmR(de)}`,
				steps: [
					similar,
					`${seg(AW)} = ${numTex(ad)} + ${numTex(db)} = ${cmR(ab)}`,
					`DE : BC = ${AV} : ${AW}`,
					`x = \\frac{${numTex(bc)} \\cdot ${numTex(ad)}}{${numTex(ab)}} = ${numTex(de)}`,
				],
				// Mistakes: AD : DB instead of AD : AB, DB in place of AD, the ratio upside down, BC minus DB.
				answer: { kind: 'value', value: SR(de), wrong: [SR(bc.mul(ad).div(db)), SR(bc.mul(db).div(ab)), SR(bc.mul(ab).div(ad)), SR(bc.sub(db))], unit: 'cm' },
				params: { side: onAB ? 'AB' : 'AC', given: { [AV]: ad.toString(), [VW]: db.toString(), BC: bc.toString() }, ask: 'DE' },
			};
		}
		return {
			case: 'parte',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${intro} Sai che $${seg(AV)} = ${numTex(ad)}$ cm, $${seg('DE')} = ${numTex(de)}$ cm e $${seg('BC')} = ${numTex(bc)}$ cm. Quanto è lungo $${VW}$?`),
			solution: `${seg(VW)} = ${cmR(db)}`,
			steps: [
				similar,
				`${AW} : ${AV} = BC : DE`,
				`${seg(AW)} = \\frac{${numTex(bc)} \\cdot ${numTex(ad)}}{${numTex(de)}} = ${cmR(ab)}`,
				`${seg(VW)} = ${numTex(ab)} - ${numTex(ad)} = ${cmR(db)}`,
			],
			// Mistakes: the whole side instead of its part, the ratio upside down, the difference BC - DE.
			answer: { kind: 'value', value: SR(db), wrong: [SR(ab), SR(ad.mul(de).div(bc)), SR(bc.sub(de)), SR(ad.mul(de).div(bc).sub(ad).abs())], unit: 'cm' },
			params: { side: onAB ? 'AB' : 'AC', given: { [AV]: ad.toString(), DE: de.toString(), BC: bc.toString() }, ask: VW },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the second and the third criterion

interface Tri {
	sides: number[];
}

const SIDES = ['AB', 'BC', 'CA'];

const isTriangle = (s: number[]) => {
	const [a, b, c] = [...s].sort((x, y) => x - y);
	return a > 0 && a + b > c;
};
const sortedKey = (s: number[]) => [...s].sort((x, y) => x - y).join(',');
function proportional(s1: number[], s2: number[]): boolean {
	const a = [...s1].sort((x, y) => x - y);
	const b = [...s2].sort((x, y) => x - y);
	return a.every((x, i) => x * b[0] === a[0] * b[i]);
}

function level4(rng: Rng): Built {
	const lll = rng.next() < 0.5;
	for (;;) {
		const s1 = rng.int(1, 4);
		const s2 = rng.int(1, 4);
		if (s1 === s2) continue;
		const V = ['A', 'B', 'C'];
		if (lll) {
			const x = rng.int(2, 7);
			const y = rng.int(x + 1, 8);
			const z = rng.int(y + 1, 9);
			if (x + y <= z) continue;
			const abc = [x, y, z].map((v) => v * s1);
			const good = [x, y, z].map((v) => v * s2);
			if (good[2] > 36 || abc[2] > 36) continue;
			const cands: Tri[] = [];
			for (const dl of shuffle(rng, [1, -1, 2])) cands.push({ sides: [good[0], good[1], good[2] + dl] });
			const add = rng.int(1, 6);
			cands.push({ sides: abc.map((v) => v + add) });
			for (const dl of shuffle(rng, [1, -1])) cands.push({ sides: [good[0] + dl, good[1], good[2]] });
			const ok = cands.filter((c) => isTriangle(c.sides) && c.sides.every((v) => v > 0) && !proportional(c.sides, abc));
			const opt = (sides: number[]): ChoiceOption => {
				const shown = shuffle(rng, sides);
				return { latex: `${t('lati di ')}${shown[0]}, ${shown[1]}${t(' e ')}${shown[2]}${t(' cm')}`, values: sortedKey(sides).split(',') };
			};
			// One ratio wrong out of three (the longest side, then the shortest), the same length added to every side.
			const picks = [ok.find((c) => c.sides[2] !== good[2]), ok.find((c) => c.sides[0] !== good[0] && c.sides[1] === good[1]), ok.find((c) => c.sides[0] === abc[0] + add)];
			const cand = [...picks, ...ok].filter((c): c is Tri => !!c).map((c) => opt(c.sides));
			let choice: ChoiceAnswer;
			try {
				choice = buildChoice(rng, opt(good), cand);
			} catch {
				continue;
			}
			const order = shuffle(rng, [0, 1, 2]);
			const names = ['AB', 'BC', 'CA'];
			const given = order.map((i, j) => [names[j], abc[i]] as [string, number]);
			const ga = [...abc];
			const gg = [...good];
			return {
				case: 'terzo criterio',
				prompt: 'Scegli il triangolo simile.',
				problem: textBlock(
					`Il triangolo $ABC$ ha i lati $${seg(given[0][0])} = ${given[0][1]}$ cm, $${seg(given[1][0])} = ${given[1][1]}$ cm e $${seg(given[2][0])} = ${given[2][1]}$ cm. Quale di questi triangoli, dati con i tre lati, è simile ad $ABC$?`,
				),
				solution: `${t('lati di ')}${gg.join(', ')}${t(' cm')}`,
				steps: [
					t('I lati si mettono in ordine, dal più corto al più lungo, e si confrontano i rapporti'),
					`\\frac{${gg[0]}}{${ga[0]}} = \\frac{${gg[1]}}{${ga[1]}} = \\frac{${gg[2]}}{${ga[2]}} = ${numTex(q(s2, s1))}`,
					t('I tre lati sono in proporzione: per il terzo criterio i triangoli sono simili'),
					t('Negli altri triangoli almeno un rapporto è diverso'),
				],
				answer: { kind: 'choice', choice },
				params: { criterion: 'LLL', abc: given.map(([n, v]) => [n, v]), good },
			};
		}
		const x = rng.int(2, 9);
		const y = rng.int(2, 9);
		if (x === y) continue;
		const alpha = 5 * rng.int(4, 30);
		const abc = [x * s1, y * s1];
		const good = [x * s2, y * s2];
		if (Math.max(...good, ...abc) > 36) continue;
		const add = rng.int(1, 5);
		const dAlpha = rng.pick([-20, -10, 10, 20]);
		const opt = (a: number, pair: number[]): ChoiceOption => {
			const [u, w] = shuffle(rng, pair);
			return { latex: `${deg(a)}${t(' tra i lati di ')}${u}${t(' e ')}${w}${t(' cm')}`, values: [String(a), ...[...pair].sort((m, n) => m - n).map(String)] };
		};
		const dl = rng.pick([-1, 1, 2]);
		const cands = [opt(alpha, [good[0], good[1] + dl]), opt(alpha, [abc[0] + add, abc[1] + add]), alpha + dAlpha >= 15 && alpha + dAlpha <= 160 ? opt(alpha + dAlpha, good) : null, opt(alpha, [good[0] + 1, good[1]])];
		if (good[1] + dl <= 0 || (good[1] + dl) * abc[0] === good[0] * abc[1]) continue;
		let choice: ChoiceAnswer;
		try {
			choice = buildChoice(rng, opt(alpha, good), cands);
		} catch {
			continue;
		}
		const at = rng.pick(V);
		const [s1n, s2n] = shuffle(rng, SIDES.filter((n) => n.includes(at)));
		return {
			case: 'secondo criterio',
			prompt: 'Scegli il triangolo simile.',
			problem: textBlock(
				`Il triangolo $ABC$ ha $${hat(at)} = ${deg(alpha)}$, compreso tra i lati $${seg(s1n)} = ${abc[0]}$ cm e $${seg(s2n)} = ${abc[1]}$ cm. Quale di questi triangoli, dati con un angolo e i due lati che lo comprendono, è simile ad $ABC$?`,
			),
			solution: `${deg(alpha)}${t(' tra i lati di ')}${good[0]}${t(' e ')}${good[1]}${t(' cm')}`,
			steps: [
				t('Serve un angolo di ') + deg(alpha) + t(' compreso tra due lati in proporzione con ') + `${abc[0]}${t(' e ')}${abc[1]}`,
				`\\frac{${good[0]}}{${abc[0]}} = \\frac{${good[1]}}{${abc[1]}} = ${numTex(q(s2, s1))}`,
				t('Per il secondo criterio i triangoli sono simili'),
				t("Negli altri triangoli l'angolo è diverso o i due rapporti non sono uguali"),
			],
			answer: { kind: 'choice', choice },
			params: { criterion: 'LAL', angle: alpha, at, abc, good },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: homologous sides of a turned triangle

const K5 = [q(1, 2), q(3, 2), q(2), q(5, 2), q(3)];
const DSIDES = ['DE', 'EF', 'FD'];

/** The side of DEF with the two given letters, as the lesson names them: DE, EF, FD. */
function dSide(x: string, y: string): string {
	return DSIDES.find((s) => s.includes(x) && s.includes(y)) as string;
}

function level5(rng: Rng): Built {
	for (;;) {
		const len = [rng.int(3, 14), rng.int(3, 14), rng.int(3, 14)]; // AB, BC, CA
		if (new Set(len).size < 3 || !isTriangle(len)) continue;
		const k = rng.pick(K5);
		const perm = rng.pick(PERMS.slice(1));
		const img = (v: string) => 'DEF'[perm['ABC'.indexOf(v)]];
		const homolog = (s: string) => dSide(img(s[0]), img(s[1])); // side of ABC -> side of DEF
		const back = (d: string) => SIDES.find((s) => homolog(s) === d) as string; // side of DEF -> side of ABC
		const L = (s: string) => q(len[SIDES.indexOf(s)]);
		const [given, ask] = shuffle(rng, DSIDES);
		const gv = L(back(given)).mul(k);
		const value = L(back(ask)).mul(k);
		if ((decimals(gv) ?? 9) > 1 || gv.compare(q(40)) > 0) continue;
		// The angles given: two vertices of ABC and their images.
		const shown = shuffle(rng, ['A', 'B', 'C']).slice(0, 2).sort();
		const third = ['A', 'B', 'C'].find((v) => !shown.includes(v)) as string;
		// Mistakes: the sides paired by position (DE with AB, EF with BC, FD with CA), k upside down, the wrong homologous side.
		const alpha = (d: string) => SIDES[DSIDES.indexOf(d)];
		const kAlpha = gv.div(L(alpha(given)));
		const other = SIDES.find((s) => s !== back(given) && s !== back(ask)) as string;
		const wrong = [SR(kAlpha.mul(L(alpha(ask)))), SR(L(back(ask)).div(k)), SR(L(other).mul(k)), SR(L(alpha(ask)).mul(k))];
		const corr = `\\triangle ABC \\sim \\triangle ${img('A')}${img('B')}${img('C')}`;
		const angles = shown.map((v) => `$${hat(img(v))} \\cong ${hat(v)}$`).join(', ');
		return {
			case: 'lati omologhi',
			prompt: 'Risolvi il problema.',
			problem: textBlock(
				`Il triangolo $ABC$ ha $${seg('AB')} = ${len[0]}$ cm, $${seg('BC')} = ${len[1]}$ cm e $${seg('CA')} = ${len[2]}$ cm. Il triangolo $DEF$ ha ${angles} ${and(given)} $${seg(given)} = ${numTex(gv)}$ cm. Quanto è lungo $${ask}$?`,
			),
			solution: `${seg(ask)} = ${cmR(value)}`,
			steps: [
				t('Per il primo criterio i triangoli sono simili, e anche ') + `${hat(img(third))} \\cong ${hat(third)}`,
				t('La corrispondenza è ') + `${['A', 'B', 'C'].map((v) => `${v} \\to ${img(v)}`).join(',\\ ')}${t(': ')}${corr}`,
				t('Lati omologhi: ') + `${back(given)}${t(' e ')}${given}${t(', ')}${back(ask)}${t(' e ')}${ask}`,
				`k = \\frac{${given}}{${back(given)}} = \\frac{${numTex(gv)}}{${numTex(L(back(given)))}} = ${numTex(k)}`,
				`${seg(ask)} = ${numTex(k)} \\cdot ${numTex(L(back(ask)))} = ${cmR(value)}`,
			],
			answer: { kind: 'value', value: SR(value), wrong, unit: 'cm' },
			params: { sides: len, correspondence: `${img('A')}${img('B')}${img('C')}`, shown, given, ask, x: gv.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the diagonals of a trapezoid

const PQ6: [number, number][] = [
	[2, 1],
	[3, 1],
	[3, 2],
	[4, 1],
	[4, 3],
	[5, 2],
	[5, 3],
	[5, 4],
];

function level6(rng: Rng): Built {
	for (;;) {
		const [p, qq] = rng.pick(PQ6);
		const g = rng.int(1, 10);
		const m = rng.int(1, 8);
		const a = g * p;
		const b = g * qq;
		const L = m * (p + qq);
		if (a > 30 || b < 2 || L > 40 || 2 * L <= a + b + 2) continue;
		const onAC = rng.next() < 0.5;
		// Near the major base: A on AC, B on BD.
		const [X, Y] = onAC ? ['A', 'C'] : ['B', 'D'];
		const big = q(m * p);
		const small = q(m * qq);
		const XO = `${X}O`;
		const OY = `O${Y}`;
		const intro = 'Nel trapezio $ABCD$ la base maggiore è $AB$ e la base minore è $CD$; le diagonali si incontrano in $O$.';
		const steps = [
			t('Le basi sono parallele: ') + `\\triangle AOB \\sim \\triangle COD${t(' per il primo criterio (angoli alterni interni)')}`,
		];
		if (rng.next() < 0.7) {
			const askBig = rng.next() < 0.5;
			const asked = askBig ? XO : OY;
			const value = askBig ? big : small;
			steps.push(`${XO} : ${OY} = AB : CD = ${a} : ${b} = ${p} : ${qq}`);
			steps.push(`${seg(asked)} = \\frac{${L} \\cdot ${askBig ? p : qq}}{${p + qq}} = ${cmR(value)}`);
			return {
				case: 'parte',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} Sai che $${seg('AB')} = ${a}$ cm, $${seg('CD')} = ${b}$ cm e che la diagonale $${X}${Y}$ misura $${L}$ cm. Quanto è lungo $${asked}$?`),
				solution: `${seg(asked)} = ${cmR(value)}`,
				steps,
				// Mistakes: the other part (ratio the wrong way round), half the diagonal, the diagonal minus a base.
				answer: { kind: 'value', value: SR(value), wrong: [SR(askBig ? small : big), SR(q(L, 2)), SR(q(L - b)), SR(q(L - a))].filter((w) => w.value() > 0 && w.value() < L), unit: 'cm' },
				params: { AB: a, CD: b, diagonal: `${X}${Y}`, length: L, ask: asked },
			};
		}
		const askAB = rng.next() < 0.5;
		const value = q(askAB ? a : b);
		const known = askAB ? b : a;
		steps.push(`AB : CD = ${XO} : ${OY} = ${m * p} : ${m * qq} = ${p} : ${qq}`);
		steps.push(askAB ? `${seg('AB')} = \\frac{${b} \\cdot ${p}}{${qq}} = ${cmR(value)}` : `${seg('CD')} = \\frac{${a} \\cdot ${qq}}{${p}} = ${cmR(value)}`);
		const inv = askAB ? q(b * qq, p) : q(a * p, qq);
		const diff = askAB ? q(b + m * (p - qq)) : q(a - m * (p - qq));
		return {
			case: 'base',
			prompt: 'Risolvi il problema.',
			problem: textBlock(
				`${intro} Sai che $${seg(askAB ? 'CD' : 'AB')} = ${known}$ cm, $${seg(XO)} = ${m * p}$ cm e $${seg(OY)} = ${m * qq}$ cm. Quanto è lunga la base $${askAB ? 'AB' : 'CD'}$?`,
			),
			solution: `${seg(askAB ? 'AB' : 'CD')} = ${cmR(value)}`,
			steps,
			// Mistakes: the ratio the wrong way round, the difference of the parts added to the base.
			answer: { kind: 'value', value: SR(value), wrong: [SR(inv), SR(diff), SR(q(known + m * p)), SR(q(m * (p + qq)))].filter((w) => w.value() > 0), unit: 'cm' },
			params: { known: askAB ? 'CD' : 'AB', length: known, parts: [XO, m * p, OY, m * qq], ask: askAB ? 'AB' : 'CD' },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: perimeters, areas and maps

const K7 = [q(1, 2), q(3, 2), q(2), q(5, 2), q(3), q(4, 3), q(2, 3)];
const MAPS: [string, number[]][] = [
	['una stanza', [50, 100, 200]],
	['un giardino', [200, 250, 500]],
	['un parco', [1000, 2000]],
];
const HALVES = [2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap((n) => [q(n), q(2 * n + 1, 2)]);

function level7(rng: Rng): Built {
	const kind = rng.pick(['perimetro', 'area', 'aree', 'mappa'] as const);
	for (;;) {
		if (kind === 'mappa') {
			const [what, scales] = rng.pick(MAPS);
			const n = rng.pick(scales);
			const w = rng.pick(HALVES);
			const h = rng.pick(HALVES);
			if (w.equals(h)) continue;
			const W = w.mul(q(n, 100));
			const H = h.mul(q(n, 100));
			const area = W.mul(H);
			if ((decimals(area) ?? 9) > 2 || (decimals(W) ?? 9) > 2 || (decimals(H) ?? 9) > 2) continue;
			const drawn = w.mul(h);
			return {
				case: 'mappa',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`Su una pianta in scala $1 : ${numTex(q(n))}$ ${what} è un rettangolo di $${numTex(w)}$ cm per $${numTex(h)}$ cm. Quanto misura l'area vera, in metri quadrati?`),
				solution: `${withUnit(SR(area), 'm2')}`,
				steps: [
					t('La figura vera è simile al disegno con ') + `k = ${numTex(q(n))}`,
					`${numTex(w)} \\cdot ${numTex(q(n))} = ${numTex(w.mul(q(n)))}${t(' cm')} = ${numTex(W)}${t(' m')}`,
					`${numTex(h)} \\cdot ${numTex(q(n))} = ${numTex(h.mul(q(n)))}${t(' cm')} = ${numTex(H)}${t(' m')}`,
					`${numTex(W)} \\cdot ${numTex(H)} = ${withUnit(SR(area), 'm2')}`,
				],
				// Mistakes: the drawn area times n instead of n squared, cm2 turned into m2 dividing by 100, one side only.
				answer: { kind: 'value', value: SR(area), wrong: [SR(drawn.mul(q(n, 10000))), SR(area.mul(q(100))), SR(W.mul(h)), SR(drawn.mul(q(n)).mul(q(n)).div(q(100)))], unit: 'm2' },
				params: { scale: n, w: w.toString(), h: h.toString() },
			};
		}
		const k = rng.pick(K7);
		const a = rng.int(2, 12);
		const b = q(a).mul(k);
		if ((decimals(b) ?? 9) > 1) continue;
		const intro = `I triangoli $ABC$ e $A'B'C'$ sono simili. Il lato $AB$ misura $${a}$ cm e il suo omologo $A'B'$ misura $${numTex(b)}$ cm.`;
		const kStep = `k = \\frac{A'B'}{AB} = \\frac{${numTex(b)}}{${a}} = ${numTex(k)}`;
		if (kind === 'perimetro') {
			const P = q(rng.int(2 * a + 2, 60));
			const value = P.mul(k);
			if ((decimals(value) ?? 9) > 1) continue;
			return {
				case: 'perimetro',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} Il perimetro di $ABC$ è $${numTex(P)}$ cm. Quanto misura il perimetro di $A'B'C'$?`),
				solution: `2p' = ${cmR(value)}`,
				steps: [kStep, t('Il perimetro cambia come i lati: ') + `2p' = ${numTex(k)} \\cdot ${numTex(P)} = ${cmR(value)}`],
				// Mistakes: the difference of the sides added, k upside down, k squared.
				answer: { kind: 'value', value: SR(value), wrong: [SR(P.add(b).sub(q(a))), SR(P.div(k)), SR(P.mul(k).mul(k))], unit: 'cm' },
				params: { AB: a, "A'B'": b.toString(), perimeter: P.toString() },
			};
		}
		if (kind === 'area') {
			const S = q(rng.int(3, 60));
			const value = S.mul(k).mul(k);
			if ((decimals(value) ?? 9) > 2 || value.compare(q(400)) > 0) continue;
			return {
				case: 'area',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} L'area di $ABC$ è $${numTex(S)}\\ \\text{cm}^2$. Quanto misura l'area di $A'B'C'$?`),
				solution: `\\mathcal{A}' = ${withUnit(SR(value), 'cm2')}`,
				steps: [kStep, t("L'area cambia con ") + `k^2${t(': ')}\\mathcal{A}' = ${k.isInteger() ? `${numTex(k)}^2` : `\\left(${numTex(k)}\\right)^2`} \\cdot ${numTex(S)} = ${withUnit(SR(value), 'cm2')}`],
				// Mistakes: the area times k (as the sides), k squared upside down, k cubed.
				answer: { kind: 'value', value: SR(value), wrong: [SR(S.mul(k)), SR(S.div(k.mul(k))), SR(value.mul(k))], unit: 'cm2' },
				params: { AB: a, "A'B'": b.toString(), area: S.toString() },
			};
		}
		// From the two areas back to k, or to a side.
		const [p, qq] = rng.pick(PQ6.concat(PQ6.map(([x, y]) => [y, x] as [number, number])));
		const u = rng.int(1, 6);
		const S1 = u * qq * qq;
		const S2 = u * p * p;
		if (S1 > 200 || S2 > 200) continue;
		const kk = q(p, qq);
		const ratio = q(S2, S1);
		const areas = `Due triangoli simili $ABC$ e $A'B'C'$ hanno le aree di $${S1}\\ \\text{cm}^2$ e $${S2}\\ \\text{cm}^2$.`;
		const st = [`\\frac{\\mathcal{A}'}{\\mathcal{A}} = \\frac{${S2}}{${S1}} = ${ratio.toLatex()} = k^2`, `k = \\sqrt{${ratio.toLatex()}} = ${kk.isInteger() || numTex(kk) === kk.toLatex() ? kk.toLatex() : `${kk.toLatex()} = ${numTex(kk)}`}`];
		if (rng.next() < 0.5) {
			return {
				case: 'aree',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${areas} Qual è il rapporto di similitudine $k$ di $A'B'C'$ rispetto ad $ABC$?`),
				solution: `k = ${numTex(kk)}`,
				steps: st,
				// Mistakes: k equal to the ratio of the areas, k upside down, half the ratio of the areas.
				answer: { kind: 'value', value: SR(kk), wrong: [SR(ratio), SR(q(qq, p)), SR(ratio.mul(q(1, 2)))], unit: '' },
				params: { areas: [S1, S2], ask: 'k' },
			};
		}
		const side = qq * rng.int(1, 4);
		const value = q(side).mul(kk);
		if (side > 20) continue;
		return {
			case: 'aree',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${areas} Il lato $AB$ misura $${side}$ cm. Quanto misura il lato omologo $A'B'$?`),
			solution: `${seg("A'B'")} = ${cmR(value)}`,
			steps: [...st, `${seg("A'B'")} = ${kk.toLatex()} \\cdot ${side} = ${cmR(value)}`],
			// Mistakes: the side times the ratio of the areas, k upside down.
			answer: { kind: 'value', value: SR(value), wrong: [SR(q(side).mul(ratio)), SR(q(side).mul(q(qq, p))), SR(q(side).mul(ratio).mul(q(1, 2)))], unit: 'cm' },
			params: { areas: [S1, S2], ask: 'lato', AB: side },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 8: Euclid's theorems

function level8(rng: Rng): Built {
	const kind = rng.pick(['altezza', 'cateto', 'proiezione'] as const);
	const intro = "Il triangolo $ABC$ è rettangolo in $C$ e $CH$ è l'altezza relativa all'ipotenusa $AB$.";
	const wantRational = rng.next() < 0.5;
	for (;;) {
		if (kind === 'altezza') {
			const u = rng.int(1, 16);
			const v = rng.int(1, 16);
			if (u === v || u * v > 200) continue;
			const value = sqrtN(u * v);
			// Half of the time a whole number, as in the lesson's example.
			if (value.isRational() !== wantRational) continue;
			return {
				case: 'altezza',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} Sai che $${seg('AH')} = ${u}$ cm e $${seg('HB')} = ${v}$ cm. Quanto è lunga l'altezza $CH$?`),
				solution: `${seg('CH')} = ${withUnit(value, 'cm')}`,
				steps: [
					t("Secondo teorema di Euclide: l'altezza è media proporzionale tra le proiezioni"),
					`${seg('CH')}^{\\,2} = ${u} \\cdot ${v} = ${u * v}`,
					`${seg('CH')} = \\sqrt{${u * v}} = ${withUnit(value, 'cm')}`,
				],
				// Mistakes: no square root, the mean of the projections, a cathetus (first theorem) instead of the height.
				answer: { kind: 'value', value, wrong: [SR(q(u * v)), SR(q(u + v, 2)), sqrtN(u * (u + v)), sqrtN(v * (u + v))], unit: 'cm' },
				params: { AH: u, HB: v, ask: 'CH' },
			};
		}
		if (kind === 'cateto') {
			const u = rng.int(1, 16);
			const v = rng.int(1, 16);
			const c = u + v;
			if (u === v || c * Math.max(u, v) > 300) continue;
			const askAC = rng.next() < 0.5;
			const proj = askAC ? u : v;
			const other = askAC ? v : u;
			const leg = askAC ? 'AC' : 'BC';
			const P = askAC ? 'AH' : 'HB';
			const value = sqrtN(c * proj);
			const giveHyp = rng.next() < 0.5;
			const data = giveHyp
				? `Sai che $${seg('AB')} = ${c}$ cm e $${seg(P)} = ${proj}$ cm.`
				: `Sai che $${seg('AH')} = ${u}$ cm e $${seg('HB')} = ${v}$ cm.`;
			const steps = [t('Primo teorema di Euclide: il cateto è medio proporzionale tra l\'ipotenusa e la sua proiezione')];
			if (!giveHyp) steps.push(`${seg('AB')} = ${u} + ${v} = ${cmR(q(c))}`);
			steps.push(`${seg(leg)}^{\\,2} = ${c} \\cdot ${proj} = ${c * proj}`);
			steps.push(`${seg(leg)} = \\sqrt{${c * proj}} = ${withUnit(value, 'cm')}`);
			return {
				case: 'cateto',
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${intro} ${data} Quanto è lungo il cateto $${leg}$?`),
				solution: `${seg(leg)} = ${withUnit(value, 'cm')}`,
				steps,
				// Mistakes: the projection of the other cathetus, the height (second theorem), no square root.
				answer: { kind: 'value', value, wrong: [sqrtN(c * other), sqrtN(u * v), SR(q(c * proj)), sqrtN(c * c - proj * proj)], unit: 'cm' },
				params: giveHyp ? { AB: c, [P]: proj, ask: leg } : { AH: u, HB: v, ask: leg },
			};
		}
		// A cathetus and the hypotenuse give the projection: triangles similar to 3-4-5, 5-12-13, 8-15-17.
		const [l1, l2, h] = rng.pick([
			[3, 4, 5],
			[6, 8, 10],
			[5, 12, 13],
			[8, 15, 17],
			[7, 24, 25],
			[20, 21, 29],
		]);
		const s = rng.pick([q(1), q(1), q(2), q(3), q(1, 2)]);
		const askAC = rng.next() < 0.5;
		const legLen = q(askAC ? l1 : l2).mul(s);
		const hyp = q(h).mul(s);
		const value = legLen.mul(legLen).div(hyp);
		if ((decimals(value) ?? 9) > 2 || (decimals(hyp) ?? 9) > 1 || hyp.compare(q(40)) > 0) continue;
		const leg = rng.pick(['AC', 'BC']);
		const P = leg === 'AC' ? 'AH' : 'HB';
		const O = leg === 'AC' ? 'HB' : 'AH';
		const otherLeg = q(askAC ? l2 : l1).mul(s);
		return {
			case: 'proiezione',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${intro} Sai che $${seg(leg)} = ${numTex(legLen)}$ cm e $${seg('AB')} = ${numTex(hyp)}$ cm. Quanto è lunga la proiezione $${P}$?`),
			solution: `${seg(P)} = ${cmR(value)}`,
			steps: [
				t("Primo teorema di Euclide: ") + `${seg(leg)}^{\\,2} = ${seg('AB')} \\cdot ${seg(P)}`,
				`${seg(P)} = \\frac{${numTex(legLen)}^2}{${numTex(hyp)}} = \\frac{${numTex(legLen.mul(legLen))}}{${numTex(hyp)}} = ${cmR(value)}`,
			],
			// Mistakes: the other projection, the other cathetus, the hypotenuse over the cathetus squared the wrong way.
			answer: { kind: 'value', value: SR(value), wrong: [SR(hyp.sub(value)), SR(otherLeg), SR(hyp.sub(legLen)), SR(legLen.div(q(2)))], unit: 'cm' },
			params: { [leg]: legLen.toString(), AB: hyp.toString(), ask: P, other: O },
		};
	}
}

// ---------------------------------------------------------------------------

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng);
		case 7:
			return level7(rng);
		case 8:
			return level8(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

/** The exact value of a string written by Surd.toString(): "p", "p/q", "k*sqrt(r)", "sqrt(r)". */
function parseValue(s: string): Surd {
	const m = /^(?:(\d+)\*)?sqrt\((\d+)\)$/.exec(s);
	if (m) return Surd.of(0, Number(m[1] ?? 1), Number(m[2]), 1);
	return SR(Rational.parse(s));
}

function valueOption(v: Surd, unit: Unit): ChoiceOption {
	return { latex: withUnit(v, unit), values: [v.toString()] };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (lvl === 1 || lvl === 2 || lvl === 4) {
		const a = sample.answer;
		if (a.kind !== 'choice') return ['risposta non a scelta'];
		if (a.options.length !== 4) v.push('servono 4 opzioni');
		const right = a.options[a.correct].values;
		if (lvl === 1) {
			const [r1, r2] = [p.r1 as number[], p.r2 as number[]];
			const [a1, b1] = [...r1].sort((x, y) => y - x);
			const [a2, b2] = [...r2].sort((x, y) => y - x);
			const sim = a2 * b1 === a1 * b2;
			if (sim !== (right[0] === 'simili')) v.push('opzione giusta sbagliata');
			if (sim && right[1] !== q(a2, a1).toString()) v.push('k sbagliato');
		}
		if (lvl === 2) {
			const abc = p.abc as number[];
			const def = p.def as number[];
			if (abc.reduce((s, x) => s + x, 0) !== 180 || def.reduce((s, x) => s + x, 0) !== 180) v.push('angoli che non sommano 180');
			const sim = sortedKey(abc) === sortedKey(def);
			if (!sim && right[0] !== 'non simili') v.push('opzione giusta sbagliata');
			if (sim) {
				const want = abc.map((x) => 'DEF'[def.indexOf(x)]).join('');
				if (right[0] !== `ABC~${want}`) v.push('corrispondenza sbagliata');
			}
		}
		if (lvl === 4) {
			const good = (p.good as number[]).map(Number);
			const abc = p.criterion === 'LLL' ? (p.abc as [string, number][]).map((x) => x[1]) : (p.abc as number[]);
			if (!proportional(good, abc) && p.criterion === 'LLL') v.push('triangolo giusto non simile');
			const sims = a.options.filter((o) => {
				if (p.criterion === 'LLL') return proportional(o.values.map(Number), abc);
				const [ang, s1, s2] = o.values.map(Number);
				return ang === p.angle && proportional([s1, s2], abc);
			});
			if (sims.length !== 1) v.push(`${sims.length} opzioni simili`);
			if (p.criterion === 'LLL' && a.options.some((o) => !isTriangle(o.values.map(Number)))) v.push('triangolo che non esiste');
		}
		return v;
	}
	const ans = sample.answer;
	if (ans.kind !== 'number' && ans.kind !== 'expression') return ['risposta non numerica'];
	const value = parseValue(ans.value);
	if (value.value() <= 0) v.push('risposta non positiva');
	if (value.isRational()) {
		const r = value.toRational();
		if ((decimals(r) ?? 9) > 2 && !(lvl === 7 && p.case === 'aree')) v.push('risposta con troppi decimali');
	} else if (lvl !== 8) v.push('radicale fuori dal livello 8');
	if (lvl === 3 && p.case !== 'ombra') {
		const g = p.given as Record<string, string>;
		if (Object.values(g).some((x) => !Rational.parse(x).isInteger())) v.push('dato non intero');
	}
	if (lvl === 5) {
		const s = p.sides as number[];
		if (!isTriangle(s) || new Set(s).size < 3) v.push('triangolo non scaleno o impossibile');
		if (p.correspondence === 'DEF') v.push('corrispondenza alfabetica');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const value = parseValue((sample.answer as { value: string }).value);
	const unit = sample.params.unit as Unit;
	const wrong = ((sample.params.wrong as string[]) ?? []).map(parseValue);
	const rational = value.isRational();
	const vr = rational ? value.toRational() : null;
	const finite = vr !== null && decimals(vr) !== null;
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const sgn = i % 2 ? -1 : 1;
		if (!rational) {
			const w = Surd.of(0, value.b + sgn * k, value.r, 1);
			return w.value() > 0 ? valueOption(w, unit) : null;
		}
		const step = (vr as Rational).isInteger() ? q(1) : q(1, 2);
		const w = (vr as Rational).add(step.mul(q(sgn * k)));
		return w.sign() > 0 ? valueOption(SR(w), unit) : null;
	};
	return buildChoice(
		rng,
		valueOption(value, unit),
		wrong
			.filter((w) => !w.equals(value) && w.value() > 0)
			.filter((w) => !finite || !w.isRational() || decimals(w.toRational()) !== null)
			.filter((w) => !w.isRational() || (decimals(w.toRational()) ?? 0) <= 2)
			.map((w) => valueOption(w, unit)),
		fallback,
	);
}

export const similitudine: Generator = {
	id: ID,
	title: 'Similitudine',
	levels: {
		1: { label: 'Rettangoli simili', constraints: ['metà simili e metà no', 'k come lato di R2 diviso il suo omologo in R1'] },
		2: { label: 'Due angoli e i vertici corrispondenti', constraints: ['angoli multipli di 5, tutti diversi', 'tre volte su quattro simili, mai con la corrispondenza alfabetica'] },
		3: { label: 'Parallela a un lato e ombre', constraints: ['DE o la parte di un lato dalla parallela', "tre volte su dieci l'altezza o l'ombra"] },
		4: { label: 'Secondo e terzo criterio', constraints: ['un solo triangolo simile tra le quattro opzioni', 'metà con i tre lati, metà con un angolo e due lati'] },
		5: { label: 'Lati omologhi', constraints: ['triangolo scaleno, corrispondenza mai alfabetica', 'k tra 1/2 e 3'] },
		6: { label: 'Le diagonali del trapezio', constraints: ['parti della diagonale nel rapporto delle basi', 'tre volte su dieci la base dalle parti'] },
		7: { label: 'Perimetri, aree e scale', constraints: ['perimetro, area, k o lato dalle aree, area vera dalla pianta'] },
		8: { label: 'I teoremi di Euclide', constraints: ['altezza dalle proiezioni, cateto, proiezione', 'radicali ridotti'] },
	},
	generate(rng: Rng, level: number): Sample {
		rng.next(); // with consecutive seeds the first draw is not uniform
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			const answer = b.answer;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer:
					answer.kind === 'choice'
						? answer.choice
						: answer.value.isRational()
							? { kind: 'number', value: answer.value.toString() }
							: { kind: 'expression', value: answer.value.toString(), latex: answer.value.toLatex(), form: 'simplified' },
				params: { case: b.case, ...b.params },
			};
			if (answer.kind === 'value') {
				sample.params.unit = answer.unit;
				const seen = new Set<string>([answer.value.toString()]);
				sample.params.wrong = answer.wrong
					.filter((w) => {
						const k = w.toString();
						if (seen.has(k)) return false;
						seen.add(k);
						return true;
					})
					.map((w) => w.toString());
			}
			if (check(sample).length > 0) continue;
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

export default similitudine;
