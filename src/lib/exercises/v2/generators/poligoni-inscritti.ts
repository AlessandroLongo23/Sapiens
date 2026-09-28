/**
 * Poligoni inscritti e circoscritti. Spec: specs/exercises/poligoni-inscritti.md
 *
 * Seven levels, from the "Per il generatore" section of the lesson's note (its eight proposals, with the
 * right triangle and the isosceles trapezoid joined in the last level): the angles of an inscribed
 * quadrilateral, recognising an inscribable quadrilateral from its angles, the missing side and the
 * perimeter of a circumscribed quadrilateral, which quadrilaterals are inscribable or circumscribable, the
 * central angle of a regular polygon and the hexagon, apothem and side with radicals (hexagon and square),
 * the radii of a right triangle and of a circumscribed isosceles trapezoid. No figures: every exercise
 * stands on its text. Levels 2 and 4 answer with a choice; level 6 with an exact radical (expression);
 * the others with a number, and a multiple-choice variant whose distractors are the lesson's warnings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Surd } from '../surd';
import { buildChoice, shuffle } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'poligoni-inscritti';

const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Numbers

/** A rational n/d as a Surd. */
const S = (n: number, d = 1) => Surd.of(n, 0, 1, d);
/** k·√r / d. */
const root = (k: number, r: number, d = 1) => Surd.of(0, k, r, d);

/** Decimal places of a rational n/d with a finite expansion, or null if periodic. */
function decimals(den: number): number | null {
	let d = den;
	let e2 = 0;
	let e5 = 0;
	for (; d % 2 === 0; e2++) d /= 2;
	for (; d % 5 === 0; e5++) d /= 5;
	return d === 1 ? Math.max(e2, e5) : null;
}

/** 12, 3{,}5, \frac{10}{3}, 3\sqrt{3}, \frac{5\sqrt{2}}{2}: a positive length as the lesson writes it. */
function valTex(v: Surd): string {
	if (!v.isRational()) return v.toLatex();
	const r = v.toRational();
	if (r.isInteger()) return String(r.num);
	const k = decimals(r.den);
	if (k === null) return r.toLatex();
	const s = String(Math.round((r.num * 10 ** k) / r.den)).padStart(k + 1, '0');
	return `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

type Unit = 'deg' | 'cm' | 'lati';

const deg = (n: number) => `${n}^\\circ`;
const cm = (v: Surd) => `${valTex(v)}\\text{ cm}`;
const hat = (v: string) => `\\hat{${v}}`;
const seg = (s: string) => `\\overline{${s}}`;

function unitTex(v: Surd, unit: Unit): string {
	if (unit === 'deg') return deg(v.toRational().num);
	if (unit === 'lati') return `${v.toRational().num}\\text{ lati}`;
	return cm(v);
}

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: { kind: 'value'; value: Surd; wrong: Surd[]; unit: Unit } | { kind: 'choice'; choice: ChoiceAnswer };
	params: Record<string, unknown>;
}

const V = ['A', 'B', 'C', 'D'];

// ---------------------------------------------------------------------------
// Level 1: the angles of an inscribed quadrilateral

function level1(rng: Rng): Built {
	const intro = 'Il quadrilatero $ABCD$ è inscritto in una circonferenza';
	if (rng.next() < 0.65) {
		const i = rng.int(0, 3);
		const j = (i + 1) % 4;
		let x: number;
		let y: number;
		do {
			x = 5 * rng.int(10, 26);
			y = 5 * rng.int(10, 26);
		} while (x === y || x + y === 180 || x === 90 || y === 90);
		const ang: Record<number, number> = { [i]: x, [j]: y };
		const k = rng.pick([(i + 2) % 4, (j + 2) % 4]);
		const opp = (k + 2) % 4;
		const near = opp === i ? j : i;
		const value = 180 - ang[opp];
		const shown = [i, j].sort((a, b) => a - b);
		const data = shown.map((v) => `$${hat(V[v])} = ${deg(ang[v])}$`).join(' e ');
		return {
			case: 'consecutivi',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${intro}, con ${data}. Quanto misura $${hat(V[k])}$?`),
			solution: `${hat(V[k])} = ${deg(value)}`,
			steps: [
				`${t('Gli angoli opposti di un quadrilatero inscritto sono supplementari: ')}${hat(V[k])} + ${hat(V[opp])} = 180^\\circ`,
				`${hat(V[k])} = 180^\\circ - ${deg(ang[opp])} = ${deg(value)}`,
			],
			// The consecutive angle used instead of the opposite one; the sum of the two unknown angles; the opposite angle itself.
			answer: { kind: 'value', value: S(value), wrong: [S(180 - ang[near]), S(360 - x - y), S(ang[opp]), S(ang[near])], unit: 'deg' },
			params: { angles: shown.map((v) => [V[v], ang[v]]), asked: V[k] },
		};
	}
	const p = rng.int(0, 1); // the pair A, C or B, D
	const [u, w] = shuffle(rng, [V[p], V[p + 2]]);
	const d = 10 * rng.int(1, 10);
	const big = (180 + d) / 2;
	const small = (180 - d) / 2;
	const askBig = rng.next() < 0.5;
	const asked = askBig ? u : w;
	const value = askBig ? big : small;
	const steps = [
		`${t('Gli angoli opposti sono supplementari: ')}${hat(u)} + ${hat(w)} = 180^\\circ${t(', e ')}${hat(u)} - ${hat(w)} = ${deg(d)}`,
		`${hat(w)} = (180^\\circ - ${deg(d)}) : 2 = ${deg(small)}`,
	];
	if (askBig) steps.push(`${hat(u)} = ${deg(small)} + ${deg(d)} = ${deg(big)}`);
	return {
		case: 'differenza',
		prompt: 'Risolvi il problema.',
		problem: textBlock(`${intro}, e l'angolo $${hat(u)}$ supera di $${deg(d)}$ l'angolo $${hat(w)}$. Quanto misura $${hat(asked)}$?`),
		solution: `${hat(asked)} = ${deg(value)}`,
		steps,
		// The other angle of the pair, 180 minus the difference, the two halves without the difference.
		answer: { kind: 'value', value: S(value), wrong: [S(askBig ? small : big), S(180 - d), S(90), S(d)], unit: 'deg' },
		params: { bigger: u, smaller: w, difference: d, asked },
	};
}

// ---------------------------------------------------------------------------
// Level 2: which quadrilateral is inscribable

type Quad = [number, number, number, number];
const a5 = (rng: Rng) => 5 * rng.int(9, 27); // 45..135

function inscribable(rng: Rng): Quad {
	for (;;) {
		const a = a5(rng);
		const b = a5(rng);
		if (a === 90 && b === 90) continue;
		return [a, b, 180 - a, 180 - b];
	}
}

/** Angles with sum 360 whose opposite angles are not supplementary. */
function notInscribable(rng: Rng, kind: 'parallelogramma' | 'consecutivi' | 'generico'): Quad {
	for (;;) {
		let qd: Quad;
		if (kind === 'parallelogramma') {
			const a = a5(rng);
			qd = [a, 180 - a, a, 180 - a];
		} else if (kind === 'consecutivi') {
			const a = a5(rng);
			const c = a5(rng);
			if (c === a) continue;
			qd = [a, 180 - a, c, 180 - c];
		} else {
			const a = a5(rng);
			const b = a5(rng);
			const c = a5(rng);
			qd = [a, b, c, 360 - a - b - c];
			if (qd[3] < 45 || qd[3] > 135) continue;
		}
		if (qd[0] + qd[2] !== 180) return qd;
	}
}

const quadOption = (qd: Quad): ChoiceOption => ({ latex: qd.map(deg).join(',\\ '), values: [qd.join(',')] });

function level2(rng: Rng): Built {
	const yes = rng.next() < 0.6;
	const kinds = ['parallelogramma', 'consecutivi', 'generico'] as const;
	const right = yes ? inscribable(rng) : notInscribable(rng, rng.pick(kinds));
	const wrong = yes ? kinds.map((k) => notInscribable(rng, k)) : [inscribable(rng), inscribable(rng), inscribable(rng)];
	const fallback = () => quadOption(yes ? notInscribable(rng, rng.pick(kinds)) : inscribable(rng));
	const choice = buildChoice(rng, quadOption(right), wrong.map(quadOption), fallback);
	const quads = choice.options.map((o) => o.values[0].split(',').map(Number));
	const steps = [t('Un quadrilatero è inscrivibile se e solo se gli angoli opposti sono supplementari: basta controllare ') + `${hat('A')} + ${hat('C')}`];
	for (const qd of quads) steps.push(`${deg(qd[0])} + ${deg(qd[2])} = ${deg(qd[0] + qd[2])}${qd[0] + qd[2] === 180 ? t(': inscrivibile') : t(': non inscrivibile')}`);
	steps.push(t('La somma dei quattro angoli è sempre ') + `360^\\circ${t(', quindi da sola non dice nulla')}`);
	return {
		case: yes ? 'inscrivibile' : 'non inscrivibile',
		prompt: 'Scegli il quadrilatero giusto.',
		problem: textBlock(
			`Di quattro quadrilateri convessi $ABCD$ sono dati gli angoli $${hat('A')}$, $${hat('B')}$, $${hat('C')}$, $${hat('D')}$, in quest'ordine. Quale ${yes ? 'è' : 'non è'} inscrivibile in una circonferenza?`,
		),
		solution: `${quadOption(right).latex}`,
		steps,
		answer: { kind: 'choice', choice },
		params: { right: right.join(',') },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the circumscribed quadrilateral

const SIDES = ['AB', 'BC', 'CD', 'DA'];

function level3(rng: Rng): Built {
	let s: number[];
	for (;;) {
		const a = rng.int(3, 20);
		const b = rng.int(3, 20);
		const c = rng.int(3, 20);
		const d = a + c - b;
		if (d < 3 || d > 20) continue;
		if (a === b && b === c) continue;
		s = [a, b, c, d];
		break;
	}
	const intro = 'Il quadrilatero $ABCD$ è circoscritto a una circonferenza';
	const eq = `${seg('AB')} + ${seg('CD')} = ${seg('BC')} + ${seg('DA')}`;
	const u = rng.next();
	if (u < 0.6) {
		const k = rng.int(0, 3);
		const n = (i: number) => s[(k + i) % 4];
		const known = [0, 1, 2, 3].filter((i) => i !== k);
		const data = known.map((i) => `$${seg(SIDES[i])} = ${s[i]}$ cm`).join(', ');
		const term = (i: number) => (i === k ? 'x' : String(s[i]));
		return {
			case: 'lato',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${intro}, con ${data.replace(/, ([^,]*)$/, ' e $1')}. Quanto misura il lato $${SIDES[k]}$?`),
			solution: `${seg(SIDES[k])} = ${cm(S(s[k]))}`,
			steps: [
				t('Le somme dei lati opposti sono uguali: ') + eq,
				`${term(0)} + ${term(2)} = ${term(1)} + ${term(3)}`,
				`x = ${n(1)} + ${n(3)} - ${n(2)} = ${cm(S(s[k]))}`,
			],
			// Consecutive sides paired (the lesson's warning, both ways), the opposite side, the three sides added.
			answer: { kind: 'value', value: S(s[k]), wrong: [S(n(1) + n(2) - n(3)), S(n(3) + n(2) - n(1)), S(n(2)), S(n(1) + n(2) + n(3))].filter((w) => w.value() > 0), unit: 'cm' },
			params: { sides: s, missing: SIDES[k] },
		};
	}
	const pair = rng.int(0, 1); // AB, CD or BC, DA
	const value = 2 * (s[pair] + s[pair + 2]);
	if (u < 0.8) {
		const data = `$${seg(SIDES[pair])} = ${s[pair]}$ cm e $${seg(SIDES[pair + 2])} = ${s[pair + 2]}$ cm`;
		return {
			case: 'perimetro',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${intro}, con ${data}. Quanto misura il perimetro?`),
			solution: `2p = ${cm(S(value))}`,
			steps: [t('Le somme dei lati opposti sono uguali: ') + eq, t('Il perimetro è il doppio della somma di due lati opposti: ') + `2p = 2 \\cdot (${s[pair]} + ${s[pair + 2]}) = ${cm(S(value))}`],
			// The sum not doubled, the sum plus one of the two sides (a side forgotten), four times one side (as in a rhombus).
			answer: { kind: 'value', value: S(value), wrong: [S(value / 2), S(value / 2 + s[pair]), S(value / 2 + s[pair + 2]), S(4 * s[pair])], unit: 'cm' },
			params: { sides: s, given: [SIDES[pair], SIDES[pair + 2]] },
		};
	}
	const k = rng.int(0, 3);
	const known = [0, 1, 2, 3].filter((i) => i !== k);
	const data = known.map((i) => `$${seg(SIDES[i])} = ${s[i]}$ cm`).join(', ').replace(/, ([^,]*)$/, ' e $1');
	const p0 = (k + 1) % 2; // the pair of opposite sides that does not contain the missing one
	const n = (i: number) => s[(k + i) % 4];
	return {
		case: 'perimetro',
		prompt: 'Risolvi il problema.',
		problem: textBlock(`${intro}, con ${data}. Quanto misura il perimetro?`),
		solution: `2p = ${cm(S(2 * (s[p0] + s[p0 + 2])))}`,
		steps: [
			t('Le somme dei lati opposti sono uguali: ') + eq,
			t('Il perimetro è il doppio della somma di due lati opposti noti: ') + `2p = 2 \\cdot (${s[p0]} + ${s[p0 + 2]}) = ${cm(S(2 * (s[p0] + s[p0 + 2])))}`,
		],
		// The three sides added; the fourth side from consecutive sides; the sum of two opposite sides.
		answer: {
			kind: 'value',
			value: S(2 * (s[p0] + s[p0 + 2])),
			wrong: [S(n(1) + n(2) + n(3)), S(n(1) + n(2) + n(3) + n(1) + n(2) - n(3)), S(s[p0] + s[p0 + 2]), S(n(1) + n(2) + n(3) + n(2))],
			unit: 'cm',
		},
		params: { sides: s, missing: SIDES[k] },
	};
}

// ---------------------------------------------------------------------------
// Level 4: which quadrilaterals are inscribable or circumscribable

type Fam =
	| 'rettangolo'
	| 'rombo'
	| 'quadrato'
	| 'trapezio isoscele'
	| 'trapezio rettangolo'
	| 'parallelogramma qualsiasi'
	| 'rombo non quadrato'
	| 'rettangolo non quadrato'
	| 'parallelogramma non rombo'
	| 'trapezio non isoscele';

const FAM_TEXT: Record<Fam, string[]> = {
	rettangolo: ['rettangolo'],
	rombo: ['rombo'],
	quadrato: ['quadrato'],
	'trapezio isoscele': ['trapezio isoscele'],
	'trapezio rettangolo': ['trapezio rettangolo'],
	'parallelogramma qualsiasi': ['parallelogramma qualsiasi'],
	'rombo non quadrato': ['rombo che non è un quadrato'],
	'rettangolo non quadrato': ['rettangolo che', 'non è un quadrato'],
	'parallelogramma non rombo': ['parallelogramma', 'che non è un rombo'],
	'trapezio non isoscele': ['trapezio non isoscele'],
};

/** Why, from the lesson: inscribable, circumscribable. */
const FAM_WHY: Record<Fam, [string, string]> = {
	rettangolo: ['il rettangolo è sempre inscrivibile', 'il rettangolo è circoscrivibile solo se è un quadrato'],
	rombo: ['il rombo è inscrivibile solo se è un quadrato', 'il rombo è sempre circoscrivibile'],
	quadrato: ['il quadrato è sempre inscrivibile', 'il quadrato è sempre circoscrivibile'],
	'trapezio isoscele': ['il trapezio isoscele è sempre inscrivibile', 'il trapezio isoscele è circoscrivibile solo se basi e lati obliqui hanno la stessa somma'],
	'trapezio rettangolo': ['il trapezio rettangolo non è isoscele, quindi non è mai inscrivibile', 'il trapezio rettangolo è circoscrivibile solo se basi e lati obliqui hanno la stessa somma'],
	'parallelogramma qualsiasi': ['un parallelogramma è inscrivibile solo se è un rettangolo', 'un parallelogramma è circoscrivibile solo se è un rombo'],
	'rombo non quadrato': ['un rombo che non è un quadrato non è mai inscrivibile', 'il rombo è sempre circoscrivibile'],
	'rettangolo non quadrato': ['il rettangolo è sempre inscrivibile', 'un rettangolo che non è un quadrato non è mai circoscrivibile'],
	'parallelogramma non rombo': ['un parallelogramma è inscrivibile solo se è un rettangolo', 'un parallelogramma che non è un rombo non è mai circoscrivibile'],
	'trapezio non isoscele': ['un trapezio non isoscele non è mai inscrivibile', 'un trapezio è circoscrivibile solo se basi e lati obliqui hanno la stessa somma'],
};

const QUESTIONS: { key: string; text: string; right: Fam[]; wrong: Fam[]; props: (0 | 1)[] }[] = [
	{ key: 'sempre inscrivibile', text: 'è sempre inscrivibile in una circonferenza', right: ['rettangolo', 'quadrato', 'trapezio isoscele'], wrong: ['rombo', 'parallelogramma qualsiasi', 'trapezio rettangolo', 'trapezio non isoscele'], props: [0] },
	{ key: 'sempre circoscrivibile', text: 'è sempre circoscrivibile a una circonferenza', right: ['rombo', 'quadrato'], wrong: ['rettangolo', 'trapezio isoscele', 'parallelogramma qualsiasi', 'trapezio rettangolo'], props: [1] },
	{ key: 'sempre entrambi', text: 'è sempre sia inscrivibile sia circoscrivibile', right: ['quadrato'], wrong: ['rettangolo', 'rombo', 'trapezio isoscele', 'parallelogramma qualsiasi'], props: [0, 1] },
	{ key: 'mai inscrivibile', text: 'non è mai inscrivibile in una circonferenza', right: ['trapezio rettangolo', 'trapezio non isoscele', 'rombo non quadrato'], wrong: ['rettangolo', 'quadrato', 'trapezio isoscele'], props: [0] },
	{ key: 'mai circoscrivibile', text: 'non è mai circoscrivibile a una circonferenza', right: ['rettangolo non quadrato', 'parallelogramma non rombo'], wrong: ['rombo', 'quadrato', 'trapezio isoscele', 'trapezio rettangolo'], props: [1] },
];

const famOption = (f: Fam): ChoiceOption => {
	const ls = FAM_TEXT[f];
	return { latex: ls.length === 1 ? t(ls[0]) : `\\begin{gathered} ${ls.map(t).join(' \\\\ ')} \\end{gathered}`, values: [f] };
};

function level4(rng: Rng): Built {
	const qn = rng.pick(QUESTIONS);
	const right = rng.pick(qn.right);
	const wrong = shuffle(rng, qn.wrong).slice(0, 3);
	const choice = buildChoice(rng, famOption(right), wrong.map(famOption));
	const why = (f: Fam) => qn.props.map((p) => FAM_WHY[f][p]).join(', e ');
	const steps = [t(`Dalla tabella della lezione: ${why(right)}`)];
	for (const f of wrong) steps.push(t(`Invece ${why(f)}`));
	return {
		case: qn.key,
		prompt: 'Scegli il quadrilatero giusto.',
		problem: textBlock(`Quale di questi quadrilateri ${qn.text}?`),
		solution: t(FAM_TEXT[right].join(' ')),
		steps,
		answer: { kind: 'choice', choice },
		params: { question: qn.key, right, wrong },
	};
}

// ---------------------------------------------------------------------------
// Level 5: regular polygons, central angle and the hexagon

const DIVISORS = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
const POLY_NAME: Record<number, string> = {
	3: 'un triangolo equilatero',
	4: 'un quadrato',
	5: 'un pentagono regolare',
	6: 'un esagono regolare',
	8: 'un ottagono regolare',
	10: 'un decagono regolare',
	12: 'un dodecagono regolare',
};
const polyName = (n: number) => POLY_NAME[n] ?? `un poligono regolare di $${n}$ lati`;

function level5(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.4) {
		const n = rng.pick(DIVISORS);
		const value = 360 / n;
		const inner = ((n - 2) * 180) / n;
		return {
			case: 'angolo al centro',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`Quanto misura l'angolo al centro di ${polyName(n)}?`),
			solution: `${deg(value)}`,
			steps: [t('I raggi dividono il poligono in ') + `${n}${t(" triangoli isosceli congruenti, e l'angolo al centro è ")}360^\\circ : n`, `360^\\circ : ${n} = ${deg(value)}`],
			// The interior angle (n - 2) · 180 : n, 180 : n (half a turn), twice or half the angle.
			answer: { kind: 'value', value: S(value), wrong: [S(inner), S(180, n), S(2 * value), S(value, 2)].filter((w) => w.isRational() && w.toRational().isInteger() && w.value() < 180), unit: 'deg' },
			params: { n },
		};
	}
	if (u < 0.7) {
		const n = rng.pick(DIVISORS.filter((x) => x >= 5));
		const a = 360 / n;
		return {
			case: 'numero di lati',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`L'angolo al centro di un poligono regolare misura $${deg(a)}$. Quanti lati ha il poligono?`),
			solution: `n = ${n}`,
			steps: [t("L'angolo al centro è ") + `360^\\circ : n${t(', quindi ')}n = 360^\\circ : ${deg(a)} = ${n}`],
			// 180 : angle (half the turn), twice the sides, n ± 2 (the interior-angle formula).
			answer: { kind: 'value', value: S(n), wrong: [S(n, 2), S(2 * n), S(n + 2), S(n - 2)].filter((w) => w.isRational() && w.toRational().isInteger() && w.value() >= 3), unit: 'lati' },
			params: { angle: a },
		};
	}
	const r = rng.int(2, 20);
	if (rng.next() < 0.5) {
		return {
			case: 'esagono',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`Un esagono regolare è inscritto in una circonferenza di raggio $${r}$ cm. Quanto misura il perimetro dell'esagono?`),
			solution: `2p = ${cm(S(6 * r))}`,
			steps: [t("Nell'esagono regolare il lato è congruente al raggio: ") + `\\ell = ${cm(S(r))}`, `2p = 6 \\cdot ${r} = ${cm(S(6 * r))}`],
			// The side taken as the diameter, as half the radius; six radii and a diameter.
			answer: { kind: 'value', value: S(6 * r), wrong: [S(12 * r), S(3 * r), S(5 * r), S(4 * r)], unit: 'cm' },
			params: { given: 'raggio', r },
		};
	}
	return {
		case: 'esagono',
		prompt: 'Risolvi il problema.',
		problem: textBlock(`Un esagono regolare ha il perimetro di $${6 * r}$ cm. Quanto misura il raggio della circonferenza circoscritta?`),
		solution: `r = ${cm(S(r))}`,
		steps: [`\\ell = ${6 * r} : 6 = ${cm(S(r))}`, t("Nell'esagono regolare il lato è congruente al raggio: ") + `r = ${cm(S(r))}`],
		// Radius as half the side (the side taken for the diameter), the perimeter over three, four or two.
		answer: { kind: 'value', value: S(r), wrong: [S(r, 2), S(2 * r), S(3 * r, 2), S(3 * r)], unit: 'cm' },
		params: { given: 'perimetro', p: 6 * r },
	};
}

// ---------------------------------------------------------------------------
// Level 6: apothem and side with radicals

function level6(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.4) {
		const k = rng.int(1, 10);
		const l = 2 * k;
		const byRadius = rng.next() < 0.3;
		const value = root(k, 3);
		const q3 = 3 * k * k;
		const problem = byRadius
			? `Un esagono regolare è inscritto in una circonferenza di raggio $${l}$ cm. Quanto misura l'apotema dell'esagono?`
			: `Un esagono regolare ha il lato di $${l}$ cm. Quanto misura l'apotema?`;
		const steps: string[] = [];
		if (byRadius) steps.push(t("Nell'esagono regolare il lato è congruente al raggio: ") + `\\ell = ${cm(S(l))}`);
		steps.push(t("Il triangolo OAB è equilatero, e l'apotema OH è la sua altezza, che cade nel punto medio di AB: ") + `${seg('AH')} = ${cm(S(k))}`);
		const rad = `\\sqrt{${l}^2 - ${k}^2} = \\sqrt{${q3}}`;
		steps.push(`a = ${rad}${`\\sqrt{${q3}}` === value.toLatex() ? '' : ` = ${value.toLatex()}`}\\text{ cm}`);
		return {
			case: 'esagono',
			prompt: 'Risolvi il problema.',
			problem: textBlock(problem),
			solution: `a = ${cm(value)}`,
			steps,
			// The apothem taken for the radius; the half forgotten (l√3); the legs added (√(l² + (l/2)²)); half of the side.
			answer: { kind: 'value', value, wrong: [S(l), root(l, 3), root(k, 5), S(k), root(k, 2)], unit: 'cm' },
			params: { given: byRadius ? 'raggio' : 'lato', l },
		};
	}
	const r = rng.int(2, 15);
	const side = root(r, 2);
	const sideSteps = [
		t('Le diagonali del quadrato sono diametri: ') + `${cm(S(2 * r))}`,
		`\\ell^2 + \\ell^2 = ${2 * r}^2${t(', quindi ')}\\ell^2 = ${2 * r * r}`,
		`\\ell = \\sqrt{${2 * r * r}} = ${cm(side)}`,
	];
	if (u < 0.7) {
		return {
			case: 'lato del quadrato',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`Un quadrato è inscritto in una circonferenza di raggio $${r}$ cm. Quanto misura il lato del quadrato?`),
			solution: `\\ell = ${cm(side)}`,
			steps: sideSteps,
			// The diagonal taken for the side; the side equal to the radius (as in the hexagon); the apothem; the diameter times √2.
			answer: { kind: 'value', value: side, wrong: [S(2 * r), S(r), root(r, 2, 2), root(2 * r, 2)], unit: 'cm' },
			params: { r },
		};
	}
	const value = root(r, 2, 2);
	return {
		case: 'apotema del quadrato',
		prompt: 'Risolvi il problema.',
		problem: textBlock(`Un quadrato è inscritto in una circonferenza di raggio $${r}$ cm. Quanto misura l'apotema del quadrato?`),
		solution: `a = ${cm(value)}`,
		steps: [...sideSteps, t("L'apotema va dal centro al punto medio di un lato, ed è metà del lato: ") + `a = ${cm(value)}`],
		// The side itself; the radius (radius and apothem swapped); half the radius; the hexagon's formula.
		answer: { kind: 'value', value, wrong: [side, S(r), S(r, 2), root(r, 3, 2)], unit: 'cm' },
		params: { r },
	};
}

// ---------------------------------------------------------------------------
// Level 7: radii of the right triangle and of the circumscribed isosceles trapezoid

const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[5, 12, 13],
	[8, 15, 17],
	[7, 24, 25],
	[20, 21, 29],
	[12, 35, 37],
	[9, 40, 41],
];

/** Bases B > b of an isosceles trapezoid with an inscribed circle and integer legs and height: B·b a square, B + b even. */
const TRAPEZIA: [number, number][] = (() => {
	const out: [number, number][] = [];
	for (let k = 1; k <= 40; k++)
		for (let m = 2; m <= 6; m++)
			for (let n = 1; n < m; n++) {
				const B = k * m * m;
				const b = k * n * n;
				if (B > 40 || b < 2 || (B + b) % 2) continue;
				if (!out.some(([x, y]) => x === B && y === b)) out.push([B, b]);
			}
	return out;
})();

function level7(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.5) {
		const inner = u < 0.25;
		let tri: [number, number, number];
		for (;;) {
			const base = rng.pick(TRIPLES);
			const k = rng.int(1, 8);
			tri = [base[0] * k, base[1] * k, base[2] * k];
			if (tri[2] <= 50) break;
		}
		const [a, b] = shuffle(rng, [tri[0], tri[1]]);
		const c = tri[2];
		const legsGiven = rng.next() < 0.7;
		const data = legsGiven ? `i cateti $${seg('AC')} = ${a}$ cm e $${seg('BC')} = ${b}$ cm` : `il cateto $${seg('AC')} = ${a}$ cm e l'ipotenusa $${seg('AB')} = ${c}$ cm`;
		const which = inner ? 'inscritta' : 'circoscritta';
		const steps: string[] = [];
		if (legsGiven) steps.push(`${seg('AB')} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${cm(S(c))}`);
		else if (inner) steps.push(`${seg('BC')} = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${c * c - a * a}} = ${cm(S(b))}`);
		const R = S(c, 2);
		const r = (a + b - c) / 2;
		if (!inner) {
			steps.push(t("L'angolo in C è retto, quindi insiste su una semicirconferenza: l'ipotenusa è un diametro"));
			steps.push(`R = ${c} : 2 = ${cm(R)}`);
		} else {
			steps.push(t('Da C i due segmenti di tangente sono lunghi r, e sull\'ipotenusa restano ') + `(${a} - r) + (${b} - r)`);
			steps.push(`(${a} - r) + (${b} - r) = ${c}${t(', quindi ')}${a + b} - 2r = ${c}`);
			steps.push(`r = ${a + b - c} : 2 = ${cm(S(r))}`);
		}
		return {
			case: inner ? 'r triangolo' : 'R triangolo',
			prompt: 'Risolvi il problema.',
			problem: textBlock(`Il triangolo $ABC$ è rettangolo in $C$, con ${data}. Quanto misura il raggio della circonferenza ${which}?`),
			solution: `${inner ? 'r' : 'R'} = ${cm(inner ? S(r) : R)}`,
			steps,
			// R: the hypotenuse as the radius, half the sum of the legs, half a leg. r: R instead, the tangent equation not halved, halved twice.
			answer: inner
				? { kind: 'value', value: S(r), wrong: [R, S(a + b - c), S(a + b - c, 4)], unit: 'cm' }
				: { kind: 'value', value: R, wrong: [S(c), S(a + b, 2), S(a, 2), S(b, 2)], unit: 'cm' },
			params: { legs: legsGiven },
		};
	}
	const [B, b] = rng.pick(TRAPEZIA);
	const l = (B + b) / 2;
	const p = (B - b) / 2;
	const h = Math.round(Math.sqrt(l * l - p * p));
	const ask = rng.pick(['lato obliquo', 'altezza', 'raggio'] as const);
	const steps = [t('La somma dei lati obliqui è uguale alla somma delle basi, e i lati obliqui sono congruenti: ') + `\\ell = (${B} + ${b}) : 2 = ${cm(S(l))}`];
	if (ask !== 'lato obliquo') {
		steps.push(t("Con l'altezza DH, la proiezione del lato obliquo è metà della differenza delle basi: ") + `${seg('AH')} = (${B} - ${b}) : 2 = ${cm(S(p))}`);
		steps.push(`${seg('DH')} = \\sqrt{${l}^2 - ${p}^2} = \\sqrt{${h * h}} = ${cm(S(h))}`);
	}
	if (ask === 'raggio') steps.push(t("Il diametro è la distanza tra le basi, cioè l'altezza: ") + `r = ${h} : 2 = ${cm(S(h, 2))}`);
	const value = ask === 'lato obliquo' ? S(l) : ask === 'altezza' ? S(h) : S(h, 2);
	const wrong = {
		'lato obliquo': [S(B + b), S(p), S(h), S(B - b)],
		// The height taken for the leg (the note's distractor), the projection, the radius.
		altezza: [S(l), S(p), S(h, 2), S(B - b)],
		raggio: [S(h), S(l, 2), S(p), S(p, 2)],
	}[ask];
	const question = { 'lato obliquo': 'i lati obliqui', altezza: "l'altezza", raggio: 'il raggio della circonferenza' }[ask];
	return {
		case: 'trapezio',
		prompt: 'Risolvi il problema.',
		problem: textBlock(`Un trapezio isoscele è circoscritto a una circonferenza, e le basi misurano $${B}$ cm e $${b}$ cm. ${ask === 'lato obliquo' ? 'Quanto misurano' : 'Quanto misura'} ${question}?`),
		solution: `${ask === 'lato obliquo' ? '\\ell' : ask === 'altezza' ? 'h' : 'r'} = ${cm(value)}`,
		steps,
		answer: { kind: 'value', value, wrong: wrong.filter((w) => decimals(w.d) !== null), unit: 'cm' },
		params: { bases: [B, b], ask },
	};
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
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const parseSurd = (s: string): Surd => {
	// "p", "p/q", "k*sqrt(r)", "sqrt(r)", "k*sqrt(r)/d", "sqrt(r)/d": the forms Surd.toString writes for these answers.
	const m = /^(?:(\d+)\*)?sqrt\((\d+)\)(?:\/(\d+))?$/.exec(s);
	if (m) return root(Number(m[1] ?? 1), Number(m[2]), Number(m[3] ?? 1));
	const [n, d] = s.split('/').map(Number);
	return S(n, d ?? 1);
};

function valueOption(v: Surd, unit: Unit): ChoiceOption {
	return { latex: unitTex(v, unit), values: [v.toString()] };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (lvl === 2 || lvl === 4) {
		const a = sample.answer;
		if (a.kind !== 'choice') return ['risposta non a scelta'];
		if (a.options.length !== 4) v.push('servono 4 opzioni');
		if (lvl === 2) {
			const quads = a.options.map((o) => o.values[0].split(',').map(Number));
			if (quads.some((qd) => qd.reduce((s, x) => s + x, 0) !== 360 || qd.some((x) => x < 45 || x > 135 || x % 5))) v.push('angoli fuori dai limiti');
			const good = quads.map((qd) => qd[0] + qd[2] === 180);
			const want = p.case === 'inscrivibile';
			if (good.filter((g) => g === want).length !== 1) v.push('non una sola opzione giusta');
			if (good[a.correct] !== want) v.push('opzione giusta sbagliata');
		}
		if (lvl === 4 && a.options[a.correct].values[0] !== p.right) v.push('opzione giusta sbagliata');
		return v;
	}
	const a = sample.answer;
	let value: Surd;
	if (a.kind === 'number') value = parseSurd(a.value);
	else if (a.kind === 'expression') {
		value = parseSurd(a.value);
		if (value.isRational()) v.push('espressione razionale');
		if (a.latex !== value.toLatex()) v.push('forma non ridotta');
	} else return ['risposta a scelta inattesa'];
	if (value.value() <= 0) v.push('risposta non positiva');
	if (lvl === 6 && a.kind !== 'expression') v.push('livello 6 senza radicale');
	if (lvl !== 6 && a.kind !== 'number') v.push('risposta non numerica');
	if (p.unit === 'deg' && (value.value() >= 180 || !value.isRational() || !value.toRational().isInteger())) v.push('angolo non intero o troppo grande');
	if (value.isRational() && decimals(value.d) === null) v.push('risposta periodica');
	if (lvl === 3) {
		const s = p.sides as number[];
		if (s[0] + s[2] !== s[1] + s[3]) v.push('lati opposti con somme diverse');
		if (s.some((x) => x < 3 || x > 20)) v.push('lato fuori dai limiti');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const answer = sample.answer;
	if (answer.kind === 'choice') return answer;
	if (answer.kind === 'set') throw new Error(`${ID}: unexpected set answer`);
	const value = parseSurd(answer.value);
	const unit = sample.params.unit as Unit;
	const wrong = ((sample.params.wrong as string[]) ?? []).map(parseSurd);
	const step = unit === 'deg' ? 10 : 1;
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const sgn = i % 2 ? -k : k;
		const w = value.isRational() ? value.add(value.toRational().isInteger() ? S(step * sgn).toRational() : S(sgn, 2).toRational()) : Surd.of(value.a, value.b + sgn * value.d, value.r, value.d);
		if (w.value() <= 0 || (unit === 'deg' && w.value() >= 180) || (unit === 'lati' && w.value() < 3)) return null;
		return valueOption(w, unit);
	};
	return buildChoice(
		rng,
		valueOption(value, unit),
		wrong.filter((w) => !w.equals(value) && w.value() > 0 && (unit !== 'deg' || w.value() < 180)).map((w) => valueOption(w, unit)),
		fallback,
	);
}

export const poligoniInscritti: Generator = {
	id: ID,
	title: 'Poligoni inscritti e circoscritti',
	levels: {
		1: { label: 'Gli angoli del quadrilatero inscritto', constraints: ['due angoli consecutivi dati, multipli di 5 tra 50 e 130 gradi, e uno degli altri due chiesto', 'oppure la differenza tra due angoli opposti'] },
		2: { label: 'Riconoscere il quadrilatero inscrivibile', constraints: ['quattro quaterne di angoli con somma 360 gradi', 'sei su dieci quale è inscrivibile, quattro su dieci quale non lo è'] },
		3: { label: 'Il quadrilatero circoscritto', constraints: ['lati interi da 3 a 20 cm con AB + CD = BC + DA', 'il lato mancante o il perimetro'] },
		4: { label: 'Quali quadrilateri sono inscrivibili o circoscrivibili', constraints: ['cinque domande sulla tabella della lezione', 'quattro opzioni, una sola giusta'] },
		5: { label: "Angolo al centro ed esagono", constraints: ["l'angolo al centro da n, n dall'angolo al centro, perimetro e raggio dell'esagono"] },
		6: { label: 'Apotema e lato con i radicali', constraints: ["apotema dell'esagono dal lato pari, lato e apotema del quadrato inscritto", 'radicali ridotti'] },
		7: { label: 'I raggi con il teorema di Pitagora', constraints: ['triangolo rettangolo da una terna pitagorica: R o r', 'trapezio isoscele circoscritto con altezza intera'] },
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

export default poligoniInscritti;
