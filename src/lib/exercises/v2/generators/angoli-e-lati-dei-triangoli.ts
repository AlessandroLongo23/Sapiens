/**
 * Triangoli e criteri di congruenza. Spec: specs/exercises/angoli-e-lati-dei-triangoli.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/59-angoli-e-lati-dei-triangoli.md), all on
 * the text, without figures: classifying triangles by sides or by angles; corresponding sides and angles
 * of two congruent triangles (the order of the vertices); which congruence criterion applies, or none;
 * the missing step or the reason of a step in a proof modelled on the lesson's examples; the triangle
 * inequality; the third angle; the angles of an isosceles triangle. Levels 1-5 are multiple choice, levels
 * 6 and 7 have a number answer (degrees, possibly with a half degree) and a multiple-choice variant.
 *
 * The answer is picked first (the class, the correspondence, the criterion, the step, the measure) and the
 * problem is built around it. Notation of the lesson: \hat{A} for an interior angle, \widehat{ABC} for an
 * angle with three letters, \triangle ABC, \cong for congruence, lengths in cm, degrees with ^\circ and the
 * decimal comma written {,}.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample } from '../types';
import { pickDistinct, shuffle } from '../insiemi';

export const ID = 'angoli-e-lati-dei-triangoli';

// ---------------------------------------------------------------------------
// Small helpers

type Tri = [number, number, number];

const sorted = (t: readonly number[]) => [...t].sort((a, b) => a - b);
const multisetKey = (t: readonly number[]) => sorted(t).join(',');

/** A measure in degrees, integer or with a half: 67{,}5^\circ. */
function degTex(v: number): string {
	return Number.isInteger(v) ? `${v}^\\circ` : `${Math.floor(v)}{,}5^\\circ`;
}
/** The exact value of a measure for the checker: "65" or "135/2". */
const degValue = (v: number): string => (Number.isInteger(v) ? String(v) : `${Math.round(v * 2)}/2`);

function shuffledChoice(rng: Rng, options: ChoiceOption[]): ChoiceAnswer {
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => options[i]), correct: order.indexOf(0) };
}

const ordinal = ['primo', 'secondo', 'terzo'];

// ---------------------------------------------------------------------------
// Level 1: classifying a triangle

type SideClass = 'scaleno' | 'isoscele' | 'equilatero';
type AngleClass = 'acutangolo' | 'rettangolo' | 'ottusangolo';

function sideClass(t: Tri): SideClass {
	const [a, b, c] = sorted(t);
	if (a === c) return 'equilatero';
	return a === b || b === c ? 'isoscele' : 'scaleno';
}
function angleClass(t: Tri): AngleClass {
	const m = Math.max(...t);
	return m < 90 ? 'acutangolo' : m === 90 ? 'rettangolo' : 'ottusangolo';
}
const triangleExists = (t: readonly number[]) => {
	const [a, b, c] = sorted(t);
	return a > 0 && c < a + b;
};

function scalene(rng: Rng): Tri {
	for (;;) {
		const t: Tri = [rng.int(3, 15), rng.int(3, 15), rng.int(3, 15)];
		if (new Set(t).size === 3 && triangleExists(t)) return t;
	}
}
/** Isosceles, not equilateral; `baseMiddle` writes the base between the two legs (7, 4, 7). */
function isosceles(rng: Rng, baseMiddle = false): Tri {
	for (;;) {
		const leg = rng.int(3, 12);
		const base = rng.int(2, Math.min(15, 2 * leg - 1));
		if (base === leg) continue;
		if (baseMiddle) return [leg, base, leg];
		const t: Tri = [leg, leg, leg];
		t[rng.int(0, 2)] = base;
		return t;
	}
}
const equilateral = (rng: Rng): Tri => {
	const s = rng.int(3, 15);
	return [s, s, s];
};

/** Three angles, integers of at least 10 degrees, adding to 180, with the largest one `m` at a random place. */
function anglesWithMax(rng: Rng, m: number): Tri {
	for (;;) {
		const x = rng.int(10, 170 - m);
		const y = 180 - m - x;
		if (y < 10 || x > m || y > m) continue;
		const t: Tri = [x, y, m];
		return shuffle(rng, t) as Tri;
	}
}

const sidesTex = (t: Tri) => t.map((v) => `${v}\\text{ cm}`).join(',\\ ');
const anglesTex = (t: Tri) => t.map((v) => `${v}^\\circ`).join(',\\ ');
const sidesWords = (t: Tri) => `${t[0]} cm, ${t[1]} cm e ${t[2]} cm`;
const anglesInline = (t: Tri) => `${t[0]}^\\circ\\text{, } ${t[1]}^\\circ \\text{ e } ${t[2]}^\\circ`;

function sideReason(t: Tri): string {
	const k = sideClass(t);
	if (k === 'equilatero') return 'tre lati congruenti, equilatero';
	if (k === 'isoscele') return 'due lati congruenti, isoscele';
	return 'tre lati diversi, scaleno';
}
function angleReason(t: Tri): string {
	const k = angleClass(t);
	if (k === 'rettangolo') return 'un angolo retto, rettangolo';
	if (k === 'ottusangolo') return `un angolo ottuso (${Math.max(...t)}°), ottusangolo`;
	return 'tre angoli acuti, acutangolo';
}

function level1(rng: Rng): Sample {
	const by = rng.pick(['lati', 'angoli'] as const);
	let target: string;
	let tris: Tri[];
	let trick = false;
	if (by === 'lati') {
		target = rng.pick(['scaleno', 'isoscele', 'equilatero']);
		if (target === 'isoscele') {
			trick = rng.next() < 1 / 3; // the equilateral triangle is isosceles too
			tris = [trick ? equilateral(rng) : isosceles(rng), scalene(rng), scalene(rng), scalene(rng)];
		} else if (target === 'scaleno') tris = [scalene(rng), isosceles(rng, true), isosceles(rng), equilateral(rng)];
		else tris = [equilateral(rng), isosceles(rng), isosceles(rng, true), isosceles(rng)];
	} else {
		target = rng.pick(['acutangolo', 'rettangolo', 'ottusangolo']);
		if (target === 'acutangolo') tris = [anglesWithMax(rng, rng.int(70, 89)), anglesWithMax(rng, 90), anglesWithMax(rng, rng.int(91, 99)), anglesWithMax(rng, rng.int(100, 140))];
		else if (target === 'rettangolo') tris = [anglesWithMax(rng, 90), anglesWithMax(rng, rng.int(91, 99)), anglesWithMax(rng, rng.int(80, 89)), anglesWithMax(rng, rng.int(100, 140))];
		else tris = [anglesWithMax(rng, rng.int(91, 150)), anglesWithMax(rng, 90), anglesWithMax(rng, rng.int(84, 89)), anglesWithMax(rng, rng.int(60, 83))];
	}
	const opts: ChoiceOption[] = tris.map((t) => ({ latex: by === 'lati' ? sidesTex(t) : anglesTex(t), values: [by, ...t.map(String)] }));
	const answer = shuffledChoice(rng, opts);
	const listed = answer.options.map((o) => o.values.slice(1).map(Number) as Tri);
	const steps = listed.map((t) => (by === 'lati' ? `\\text{Lati ${sidesWords(t)}: ${sideReason(t)}.}` : `\\text{Angoli } ${anglesInline(t)}\\text{: ${angleReason(t)}.}`));
	if (trick) steps.push('\\text{Il triangolo equilatero ha tre lati congruenti, quindi almeno due: è anche isoscele.}');
	const right = listed[answer.correct];
	const what = by === 'lati' ? `con i lati ${sidesWords(right)}` : '';
	return {
		generatorId: ID,
		level: 1,
		seed: rng.seed,
		prompt: by === 'lati' ? 'Classifica i triangoli rispetto ai lati.' : 'Classifica i triangoli rispetto agli angoli.',
		problem: `\\text{Quale di questi triangoli, dati i tre ${by}, è ${target}?}`,
		solution: by === 'lati' ? `\\text{È ${target} il triangolo ${what}}` : `\\text{È ${target} il triangolo con gli angoli } ${anglesInline(right)}`,
		steps,
		answer,
		params: { by, target, triangles: listed.map((t) => t.map(String)) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: corresponding elements, the order of the vertices

const FIRST = [
	['A', 'B', 'C'],
	['P', 'Q', 'R'],
	['L', 'M', 'N'],
];
const SECOND = [
	['D', 'E', 'F'],
	['S', 'T', 'U'],
	['X', 'Y', 'Z'],
];
const PERMS = [
	[0, 1, 2],
	[0, 2, 1],
	[1, 0, 2],
	[1, 2, 0],
	[2, 0, 1],
	[2, 1, 0],
];
const SIDES: [number, number][] = [
	[0, 1],
	[1, 2],
	[0, 2],
];
const segKey = (letters: string[], i: number, j: number) => [letters[i], letters[j]].sort().join('');

/** A side written with its two letters in the order of the triangle's name (AB, BC, CA). */
function sideName(letters: string[], i: number, j: number): string {
	const [a, b] = (i === 0 && j === 2) || (i === 2 && j === 0) ? [2, 0] : [Math.min(i, j), Math.max(i, j)];
	return letters[a] + letters[b];
}

function level2(rng: Rng): Sample {
	const T1 = rng.pick(FIRST);
	const T2 = rng.pick(SECOND);
	const sub = rng.next() < 0.5 ? 'trova' : 'scrivi';
	if (sub === 'trova') {
		const perm = rng.pick(PERMS.slice(1));
		const name2 = perm.map((k) => T2[k]).join('');
		const kind = rng.pick(['lato', 'angolo'] as const);
		type St = { i: number[]; k: number[] };
		const truth = (s: St) => (kind === 'lato' ? segKey(T2, s.k[0], s.k[1]) === segKey(T2, perm[s.i[0]], perm[s.i[1]]) : s.k[0] === perm[s.i[0]]);
		const all: St[] = kind === 'lato' ? SIDES.flatMap((s) => SIDES.map((t) => ({ i: s, k: t }))) : [0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => ({ i: [a], k: [b] })));
		const correct = rng.pick(all.filter(truth));
		const alphabetical = all.filter((s) => !truth(s) && (kind === 'lato' ? segKey(T2, s.k[0], s.k[1]) === segKey(T2, s.i[0], s.i[1]) : s.k[0] === s.i[0]));
		const others = all.filter((s) => !truth(s) && !alphabetical.includes(s));
		const wrong = [...pickDistinct(rng, alphabetical, Math.min(2, alphabetical.length))];
		wrong.push(...pickDistinct(rng, others, 3 - wrong.length));
		const texOf = (s: St) => {
			if (kind === 'angolo') return `\\hat{${T1[s.i[0]]}} \\cong \\hat{${T2[s.k[0]]}}`;
			const k = rng.next() < 0.5 ? s.k : [s.k[1], s.k[0]];
			return `${sideName(T1, s.i[0], s.i[1])} \\cong ${T2[k[0]]}${T2[k[1]]}`;
		};
		const valOf = (s: St) => (kind === 'lato' ? ['lato', segKey(T1, s.i[0], s.i[1]), segKey(T2, s.k[0], s.k[1])] : ['angolo', T1[s.i[0]], T2[s.k[0]]]);
		const answer = shuffledChoice(
			rng,
			[correct, ...wrong].map((s) => ({ latex: texOf(s), values: valOf(s) })),
		);
		const pairs = [0, 1, 2].map((i) => `${T1[i]} \\text{ con } ${T2[perm[i]]}`).join('\\text{, }');
		const c = answer.options[answer.correct];
		return {
			generatorId: ID,
			level: 2,
			seed: rng.seed,
			prompt: 'Trova la congruenza vera.',
			problem: `\\begin{array}{l} \\text{Sai che $\\triangle ${T1.join('')} \\cong \\triangle ${name2}$.} \\\\ \\text{Quale di queste congruenze è vera?} \\end{array}`,
			solution: c.latex,
			steps: [
				`\\text{I vertici si corrispondono nell'ordine in cui sono scritti: } ${pairs}\\text{.}`,
				kind === 'lato'
					? '\\text{Un lato corrisponde al lato che ha per estremi i vertici corrispondenti ai suoi.}'
					: "\\text{L'angolo in un vertice corrisponde all'angolo nel vertice corrispondente.}",
				`\\text{Quindi } ${c.latex}\\text{; le altre congruenze accoppiano vertici che non si corrispondono.}`,
			],
			answer,
			params: { sub, T1, T2, perm: perm.map(String), kind, name2 },
		};
	}
	// 'scrivi': the congruent elements are given, the congruence is to be written with the right order.
	const perm = rng.pick(PERMS);
	const name2 = perm.map((k) => T2[k]).join('');
	const crit = rng.next() < 0.6 ? 'terzo' : 'primo';
	const facts: string[] = [];
	const factVals: string[][] = [];
	const side = (i: number, j: number) => {
		const k = rng.next() < 0.5 ? [perm[i], perm[j]] : [perm[j], perm[i]];
		facts.push(`${sideName(T1, i, j)} \\cong ${T2[k[0]]}${T2[k[1]]}`);
		factVals.push(['lato', segKey(T1, i, j), segKey(T2, perm[i], perm[j])]);
	};
	if (crit === 'terzo') for (const [i, j] of SIDES) side(i, j);
	else {
		const v = rng.int(0, 2);
		const [a, b] = [0, 1, 2].filter((i) => i !== v);
		side(v, a);
		facts.push(`\\hat{${T1[v]}} \\cong \\hat{${T2[perm[v]]}}`);
		factVals.push(['angolo', T1[v], T2[perm[v]]]);
		side(v, b);
	}
	const order = shuffle(
		rng,
		[0, 1, 2],
	);
	const givens = order.map((i) => facts[i]);
	const names = [name2];
	if (!names.includes(T2.join(''))) names.push(T2.join(''));
	for (const p of shuffle(rng, PERMS)) {
		const n = p.map((k) => T2[k]).join('');
		if (names.length < 4 && !names.includes(n)) names.push(n);
	}
	const answer = shuffledChoice(
		rng,
		names.map((n) => ({ latex: `\\triangle ${T1.join('')} \\cong \\triangle ${n}`, values: [n] })),
	);
	const pairs = [0, 1, 2].map((i) => `${T1[i]} \\text{ con } ${T2[perm[i]]}`).join('\\text{, }');
	return {
		generatorId: ID,
		level: 2,
		seed: rng.seed,
		prompt: 'Scrivi la congruenza con i vertici nell’ordine giusto.',
		problem: `\\begin{array}{l} \\text{I triangoli $${T1.join('')}$ e $${T2.join('')}$ hanno:} \\\\ ${givens.join(',\\quad ')} \\\\ \\text{Sono congruenti per il ${crit} criterio. Quale scrittura è giusta?} \\end{array}`,
		solution: `\\triangle ${T1.join('')} \\cong \\triangle ${name2}`,
		steps: [
			crit === 'terzo'
				? '\\text{Un vertice corrisponde al vertice comune ai due lati corrispondenti: i due lati che partono da un vertice vanno nei due lati che partono dal vertice corrispondente.}'
				: "\\text{L'angolo dato dice subito una coppia di vertici; gli altri due vengono dai lati.}",
			`\\text{Le corrispondenze sono } ${pairs}\\text{.}`,
			`\\text{Scrivendo i vertici in quest'ordine: } \\triangle ${T1.join('')} \\cong \\triangle ${name2}\\text{.}`,
		],
		answer,
		params: { sub, T1, T2, perm: perm.map(String), crit, facts: order.map((i) => factVals[i]), name2 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: which criterion

type Crit = 'primo' | 'secondo' | 'terzo' | 'nessuno';
const CRITS: Crit[] = ['primo', 'secondo', 'terzo', 'nessuno'];
const CRIT_OPTIONS: Record<Crit, ChoiceOption> = {
	primo: { latex: '\\text{primo criterio}', values: ['primo'] },
	secondo: { latex: '\\text{secondo criterio}', values: ['secondo'] },
	terzo: { latex: '\\text{terzo criterio}', values: ['terzo'] },
	nessuno: { latex: '\\text{nessun criterio}', values: ['nessuno'] },
};
function critAnswer(c: Crit): ChoiceAnswer {
	return { kind: 'choice', options: CRITS.map((k) => ({ ...CRIT_OPTIONS[k], values: [...CRIT_OPTIONS[k].values] })), correct: CRITS.indexOf(c) };
}

/** An element of a triangle by vertex indices: a side [i, j] or an angle [i]. */
type El = number[];

function level3(rng: Rng): Sample {
	const T1 = rng.pick([
		['A', 'B', 'C'],
		['P', 'Q', 'R'],
	]);
	const T2 = rng.next() < 0.5 ? T1.map((l) => `${l}'`) : rng.pick(SECOND);
	const crit = rng.pick(CRITS);
	let els: El[];
	let sub: string = crit;
	if (crit === 'primo') {
		const v = rng.int(0, 2);
		const [a, b] = [0, 1, 2].filter((i) => i !== v);
		els = [[v, a], [v, b], [v]];
	} else if (crit === 'secondo') {
		const [i, j] = rng.pick(SIDES);
		els = [[i, j], [i], [j]];
	} else if (crit === 'terzo') els = SIDES.map((s) => [...s]);
	else if (rng.next() < 2 / 3) {
		sub = 'lla';
		const v = rng.int(0, 2);
		const [a, b] = [0, 1, 2].filter((i) => i !== v);
		els = [[v, a], [v, b], [rng.pick([a, b])]];
	} else {
		sub = 'aaa';
		els = [[0], [1], [2]];
	}
	els = shuffle(rng, els);
	const oriented = els.map((e) => (e.length === 2 && rng.next() < 0.5 ? [e[1], e[0]] : e));
	/** \\hat{A}' for a primed vertex, as in the lesson. */
	const hat = (l: string) => (l.endsWith("'") ? `\\hat{${l[0]}}'` : `\\hat{${l}}`);
	const tex = (L: string[], e: El) => (e.length === 1 ? hat(L[e[0]]) : `${L[e[0]]}${L[e[1]]}`);
	const givens = oriented.map((e) => `${tex(T1, e)} \\cong ${tex(T2, e)}`);
	const n1 = T1.join(''),
		n2 = T2.join('');
	const steps: string[] = [];
	const sides = oriented.filter((e) => e.length === 2);
	const angles = oriented.filter((e) => e.length === 1);
	const sideT = (e: El) => `${T1[e[0]]}${T1[e[1]]}`;
	if (crit === 'primo') {
		const v = angles[0][0];
		steps.push(`\\text{Due lati, } ${sideT(sides[0])} \\text{ e } ${sideT(sides[1])}\\text{, e un angolo, } \\hat{${T1[v]}}\\text{.}`);
		steps.push(`\\text{I due lati hanno in comune il vertice } ${T1[v]}\\text{: l'angolo } \\hat{${T1[v]}} \\text{ è compreso tra loro.}`);
		steps.push(`\\text{Due lati e l'angolo compreso: primo criterio, } \\triangle ${n1} \\cong \\triangle ${n2}\\text{.}`);
	} else if (crit === 'secondo') {
		const s = sides[0];
		steps.push(`\\text{Un lato, } ${sideT(s)}\\text{, e due angoli, } \\hat{${T1[angles[0][0]]}} \\text{ e } \\hat{${T1[angles[1][0]]}}\\text{.}`);
		steps.push(`\\text{I due angoli hanno il vertice negli estremi di } ${sideT(s)}\\text{: sono adiacenti a quel lato.}`);
		steps.push(`\\text{Un lato e i due angoli adiacenti: secondo criterio, } \\triangle ${n1} \\cong \\triangle ${n2}\\text{.}`);
	} else if (crit === 'terzo') {
		steps.push('\\text{Sono i tre lati, ordinatamente congruenti.}');
		steps.push(`\\text{Tre lati: terzo criterio, } \\triangle ${n1} \\cong \\triangle ${n2}\\text{.}`);
	} else if (sub === 'lla') {
		const common = sides[0].find((i) => sides[1].includes(i))!;
		const a = angles[0][0];
		steps.push(`\\text{Due lati, } ${sideT(sides[0])} \\text{ e } ${sideT(sides[1])}\\text{, e un angolo, } \\hat{${T1[a]}}\\text{.}`);
		steps.push(`\\text{I due lati hanno in comune il vertice } ${T1[common]}\\text{, ma l'angolo dato è } \\hat{${T1[a]}}\\text{: non è compreso tra loro.}`);
		steps.push('\\text{Due lati e un angolo non compreso non bastano: nessun criterio si applica.}');
	} else {
		steps.push('\\text{Sono tre angoli e nessun lato.}');
		steps.push('\\text{Due triangoli con gli stessi angoli possono avere dimensioni diverse: nei criteri c\'è sempre almeno un lato. Nessun criterio si applica.}');
	}
	return {
		generatorId: ID,
		level: 3,
		seed: rng.seed,
		prompt: 'Stabilisci quale criterio di congruenza si applica.',
		problem: `\\begin{array}{l} \\text{I triangoli $${n1}$ e $${n2}$ hanno:} \\\\ ${givens.join(',\\quad ')} \\end{array}`,
		solution: crit === 'nessuno' ? '\\text{Nessun criterio si applica}' : `\\text{${crit[0].toUpperCase()}${crit.slice(1)} criterio: } \\triangle ${n1} \\cong \\triangle ${n2}`,
		steps,
		answer: critAnswer(crit),
		params: { T1, T2, elements: oriented.map((e) => e.map(String)), crit, case: sub },
	};
}

// ---------------------------------------------------------------------------
// Level 4: proofs modelled on the lesson (examples 1-5 and the isosceles theorem)

/** Justifications. `comune` has no reason: the statement itself says "in comune". */
type Why = 'ipotesi' | 'vertice' | 'comune' | 'bisettrice' | 'supplementari' | 'base' | 'disegno' | 'tesi';
const WHY_SHORT: Record<Why, string> = {
	ipotesi: 'per ipotesi',
	vertice: 'opposti al vertice',
	comune: '',
	bisettrice: 'per la bisettrice',
	supplementari: 'supplementari di angoli congruenti',
	base: "angoli alla base dell'isoscele",
	disegno: 'si vede dal disegno',
	tesi: 'è la tesi',
};

/**
 * A step in canonical letters: `seg:AO=seg:OB`, `ang:AOC=ang:BOD` (three letters, vertex in the middle),
 * `ang:A=ang:A` for \hat{A}, `com:seg:AB` or `com:ang:A` for an element in common.
 */
interface Step {
	s: string;
	why: Why;
}
interface Template {
	id: string;
	roles: string[];
	text: (p: Record<string, string>) => string;
	ipotesi: string[];
	tesi: string;
	tri: [string, string];
	steps: [Step, Step, Step];
	crit: 1 | 2 | 3;
	/** Two wrong steps for each missing step. */
	wrong: [Step, Step][];
}

const st = (s: string, why: Why): Step => ({ s, why });
/** "ad" before a letter read with an a (A, acca), "a" otherwise, as in "rispetto ad $AB$" and "rispetto a $BR$". */
const ad = (letter: string) => (letter === 'A' || letter === 'H' ? 'ad' : 'a');

const TEMPLATES: Template[] = [
	{
		id: 'punto-medio-comune',
		roles: ['A', 'B', 'C', 'D', 'O'],
		text: (p) => `I segmenti $${p.A}${p.B}$ e $${p.C}${p.D}$ si incontrano nel punto $${p.O}$, che è il punto medio di tutti e due.`,
		ipotesi: ['seg:AO=seg:OB', 'seg:CO=seg:OD'],
		tesi: 'seg:AC=seg:BD',
		tri: ['AOC', 'BOD'],
		steps: [st('seg:AO=seg:OB', 'ipotesi'), st('seg:CO=seg:OD', 'ipotesi'), st('ang:AOC=ang:BOD', 'vertice')],
		crit: 1,
		wrong: [
			[st('seg:AO=seg:OD', 'ipotesi'), st('seg:AO=seg:OB', 'disegno')],
			[st('seg:CO=seg:OB', 'ipotesi'), st('seg:CO=seg:OD', 'disegno')],
			[st('ang:AOC=ang:AOD', 'vertice'), st('ang:AOC=ang:BOD', 'ipotesi')],
		],
	},
	{
		id: 'secondo-criterio-punto-medio',
		roles: ['A', 'B', 'C', 'D', 'M'],
		text: (p) =>
			`$${p.M}$ è il punto medio del segmento $${p.A}${p.B}$. Da $${p.A}$ e da $${p.B}$, da parti opposte rispetto ${ad(p.A)} $${p.A}${p.B}$, partono due semirette che formano con $${p.A}${p.B}$ angoli congruenti; una retta per $${p.M}$ le taglia in $${p.C}$ e in $${p.D}$.`,
		ipotesi: ['seg:AM=seg:MB', 'ang:MAC=ang:MBD'],
		tesi: 'seg:CM=seg:MD',
		tri: ['AMC', 'BMD'],
		steps: [st('seg:AM=seg:MB', 'ipotesi'), st('ang:MAC=ang:MBD', 'ipotesi'), st('ang:AMC=ang:BMD', 'vertice')],
		crit: 2,
		wrong: [
			[st('seg:AC=seg:BD', 'ipotesi'), st('seg:AM=seg:MB', 'disegno')],
			[st('ang:ACM=ang:BDM', 'ipotesi'), st('ang:MAC=ang:MBD', 'disegno')],
			[st('ang:AMC=ang:AMD', 'vertice'), st('ang:AMC=ang:BMD', 'ipotesi')],
		],
	},
	{
		id: 'aquilone',
		roles: ['A', 'B', 'C', 'D'],
		text: (p) => `I triangoli $${p.A}${p.B}${p.C}$ e $${p.A}${p.B}${p.D}$ hanno il lato $${p.A}${p.B}$ in comune e stanno da parti opposte rispetto ${ad(p.A)} $${p.A}${p.B}$.`,
		ipotesi: ['seg:AC=seg:AD', 'seg:BC=seg:BD'],
		tesi: 'ang:CAB=ang:DAB',
		tri: ['ABC', 'ABD'],
		steps: [st('seg:AC=seg:AD', 'ipotesi'), st('seg:BC=seg:BD', 'ipotesi'), st('com:seg:AB', 'comune')],
		crit: 3,
		wrong: [
			[st('seg:AC=seg:BD', 'ipotesi'), st('seg:AC=seg:AD', 'disegno')],
			[st('seg:BC=seg:AD', 'ipotesi'), st('seg:BC=seg:BD', 'disegno')],
			[st('com:seg:CD', 'comune'), st('com:seg:BC', 'comune')],
		],
	},
	{
		id: 'teorema-isoscele',
		roles: ['A', 'B', 'C', 'D'],
		text: (p) => `Nel triangolo $${p.A}${p.B}${p.C}$ i lati $${p.A}${p.B}$ e $${p.A}${p.C}$ sono congruenti. La bisettrice dell'angolo $\\hat{${p.A}}$ incontra il lato $${p.B}${p.C}$ in $${p.D}$.`,
		ipotesi: ['seg:AB=seg:AC'],
		tesi: 'ang:B=ang:C',
		tri: ['ABD', 'ACD'],
		steps: [st('seg:AB=seg:AC', 'ipotesi'), st('ang:BAD=ang:CAD', 'bisettrice'), st('com:seg:AD', 'comune')],
		crit: 1,
		wrong: [
			[st('seg:AB=seg:BC', 'ipotesi'), st('seg:AB=seg:AC', 'disegno')],
			[st('seg:BD=seg:DC', 'bisettrice'), st('ang:BAD=ang:CAD', 'ipotesi')],
			[st('com:seg:BC', 'comune'), st('com:seg:BD', 'comune')],
		],
	},
	{
		id: 'triangoli-sovrapposti',
		roles: ['A', 'B', 'C', 'D', 'E'],
		text: (p) =>
			`Nel triangolo isoscele $${p.A}${p.B}${p.C}$ di base $${p.B}${p.C}$ prendi un punto $${p.D}$ sul lato $${p.A}${p.B}$ e un punto $${p.E}$ sul lato $${p.A}${p.C}$, con $${p.A}${p.D} \\cong ${p.A}${p.E}$.`,
		ipotesi: ['seg:AB=seg:AC', 'seg:AD=seg:AE'],
		tesi: 'seg:BE=seg:CD',
		tri: ['ABE', 'ACD'],
		steps: [st('seg:AB=seg:AC', 'ipotesi'), st('seg:AE=seg:AD', 'ipotesi'), st('com:ang:A', 'comune')],
		crit: 1,
		wrong: [
			[st('seg:AB=seg:AE', 'ipotesi'), st('seg:AB=seg:AC', 'disegno')],
			[st('seg:DB=seg:EC', 'ipotesi'), st('seg:AE=seg:AD', 'disegno')],
			[st('com:seg:BC', 'comune'), st('com:seg:DE', 'comune')],
		],
	},
	{
		id: 'prolungamenti-base',
		roles: ['A', 'B', 'C', 'D', 'E'],
		text: (p) =>
			`Nel triangolo isoscele $${p.A}${p.B}${p.C}$ di base $${p.B}${p.C}$ prolunga la base oltre $${p.B}$ fino a un punto $${p.D}$ e oltre $${p.C}$ fino a un punto $${p.E}$, con $${p.B}${p.D} \\cong ${p.C}${p.E}$.`,
		ipotesi: ['seg:AB=seg:AC', 'seg:BD=seg:CE'],
		tesi: 'seg:AD=seg:AE',
		tri: ['ABD', 'ACE'],
		steps: [st('seg:AB=seg:AC', 'ipotesi'), st('seg:BD=seg:CE', 'ipotesi'), st('ang:ABD=ang:ACE', 'supplementari')],
		crit: 1,
		wrong: [
			[st('seg:AB=seg:BD', 'ipotesi'), st('seg:AB=seg:AC', 'disegno')],
			[st('seg:BD=seg:BC', 'ipotesi'), st('seg:BD=seg:CE', 'disegno')],
			[st('ang:D=ang:E', 'supplementari'), st('ang:ABD=ang:ACE', 'ipotesi')],
		],
	},
];

const LETTER_POOL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

/** Canonical letters to the letters of the exercise. */
const relabel = (s: string, p: Record<string, string>) => s.replace(/[A-Z]/g, (c) => p[c] ?? c);

function elemTex(e: string): string {
	const [kind, name] = e.split(':');
	if (kind === 'seg') return name;
	return name.length === 1 ? `\\hat{${name}}` : `\\widehat{${name}}`;
}
/** The statement of a step, in the letters of the exercise. */
function stmtTex(s: string): string {
	if (s.startsWith('com:')) return `${elemTex(s.slice(4))} \\text{ in comune}`;
	const [l, r] = s.split('=');
	return `${elemTex(l)} \\cong ${elemTex(r)}`;
}
function stepLine(step: Step): string {
	return step.why === 'comune' ? stmtTex(step.s) : `${stmtTex(step.s)}\\text{, ${WHY_SHORT[step.why]}}`;
}
/** The reason as lines that fit an answer button (270 px at 16 px would not). */
const whyLines = (w: Why): string[] => (w === 'supplementari' ? ['supplementari di', 'angoli congruenti'] : [WHY_SHORT[w]]);
/** A step as an answer option: the statement, and the reason below it. */
function stepOption(step: Step): ChoiceOption {
	const latex = step.why === 'comune' ? stmtTex(step.s) : `\\begin{gathered} ${[stmtTex(step.s), ...whyLines(step.why).map((l) => `\\text{${l}}`)].join(' \\\\ ')} \\end{gathered}`;
	return { latex, values: [step.s, step.why] };
}
/** A step in the problem: one line, or two when the reason is long (450 px at 18 px on one line). */
function problemStep(i: number, step: Step): string {
	if (step.why !== 'supplementari') return `${i + 1}.\\ ${stepLine(step)}`;
	return `\\begin{array}{l} ${i + 1}.\\ ${stmtTex(step.s)}\\text{,} \\\\ \\quad \\text{${WHY_SHORT[step.why]}} \\end{array}`;
}
const WHY_OPTION: Record<Why, string> = {
	ipotesi: 'per ipotesi',
	vertice: 'sono angoli opposti al vertice',
	comune: 'in comune',
	bisettrice: 'per la definizione di bisettrice',
	supplementari: 'supplementari di angoli congruenti',
	base: "angoli alla base dell'isoscele",
	disegno: 'si vede dal disegno',
	tesi: 'è la tesi',
};
const WHY_EXPLAIN: Record<Why, string> = {
	ipotesi: "lo dice l'ipotesi",
	vertice: 'sono angoli opposti al vertice, quindi congruenti',
	comune: 'è un elemento in comune ai due triangoli',
	bisettrice: "la bisettrice divide l'angolo in due angoli congruenti",
	supplementari: 'sono supplementari degli angoli alla base, che sono congruenti per il teorema del triangolo isoscele',
	base: 'nel triangolo isoscele gli angoli alla base sono congruenti',
	disegno: '',
	tesi: '',
};

function level4(rng: Rng): Sample {
	const t = rng.pick(TEMPLATES);
	const canonical = rng.next() < 0.4;
	const letters = canonical ? t.roles : pickDistinct(rng, LETTER_POOL, t.roles.length);
	const p: Record<string, string> = Object.fromEntries(t.roles.map((r, i) => [r, letters[i]]));
	const R = (s: string) => relabel(s, p);
	const steps = t.steps.map((s) => ({ s: R(s.s), why: s.why }));
	// The reason is asked only for a step that does not come from the hypothesis (written just above it).
	const eligibleWhy = [0, 1, 2].filter((k) => t.steps[k].why !== 'comune' && t.steps[k].why !== 'ipotesi');
	const sub = eligibleWhy.length && rng.next() < 0.5 ? 'perche' : 'passo';
	const k = sub === 'passo' ? rng.int(0, 2) : rng.pick(eligibleWhy);
	const tri1 = R(t.tri[0]),
		tri2 = R(t.tri[1]);
	const ipo = t.ipotesi.map((s) => stmtTex(R(s))).join(',\\ ');
	const tesi = stmtTex(R(t.tesi));
	const lines = steps.map((s, i) => {
		if (i !== k) return problemStep(i, s);
		return sub === 'passo' ? `${i + 1}.\\ \\ ?` : `${i + 1}.\\ ${stmtTex(s.s)}\\text{, perché?}`;
	});
	const problem = [
		`\\text{${t.text(p)}}`,
		`\\text{Ipotesi: $${ipo}$. Tesi: $${tesi}$.}`,
		`\\text{I triangoli $${tri1}$ e $${tri2}$ hanno:}`,
		...lines,
		`\\text{Per il ${ordinal[t.crit - 1]} criterio $\\triangle ${tri1} \\cong \\triangle ${tri2}$, quindi $${tesi}$.}`,
	];
	let answer: ChoiceAnswer;
	const right = steps[k];
	if (sub === 'passo') {
		const thesisStep: Step = { s: R(t.tesi), why: 'ipotesi' };
		const wrong = t.wrong[k].map((w) => ({ s: R(w.s), why: w.why }));
		answer = shuffledChoice(
			rng,
			[right, thesisStep, ...wrong].map(stepOption),
		);
	} else {
		const pool: Why[] = (['vertice', 'bisettrice', 'supplementari', 'base'] as Why[]).filter((w) => w !== right.why);
		const whys: Why[] = [right.why, 'ipotesi', rng.pick(['disegno', 'tesi'] as Why[]), rng.pick(pool)];
		answer = shuffledChoice(
			rng,
			whys.map((w) => ({ latex: w === 'supplementari' ? '\\begin{gathered} \\text{supplementari di} \\\\ \\text{angoli congruenti} \\end{gathered}' : `\\text{${WHY_OPTION[w]}}`, values: [w] })),
		);
	}
	const critWants = ["due lati e l'angolo compreso", 'un lato e i due angoli adiacenti', 'i tre lati'][t.crit - 1];
	const solSteps: string[] = [];
	if (sub === 'passo') {
		solSteps.push(`\\text{Il ${ordinal[t.crit - 1]} criterio vuole ${critWants}: i passi dati ne danno due, il passo mancante è il terzo elemento.}`);
		solSteps.push(`\\text{Il passo mancante è } ${stmtTex(right.s)}\\text{${right.why === 'comune' ? '' : `: ${WHY_EXPLAIN[right.why]}`}.}`);
		solSteps.push(`\\text{La tesi } ${tesi} \\text{ non si usa come passo: è quello che si deve dimostrare. Ogni passo viene dall'ipotesi, da una definizione o da un teorema, non dal disegno.}`);
	} else {
		solSteps.push(`\\text{Il passo } ${k + 1} \\text{ dice } ${stmtTex(right.s)}\\text{: ${WHY_EXPLAIN[right.why]}.}`);
		solSteps.push("\\text{La tesi non si può usare per dimostrare la tesi, e il disegno dà i nomi, non le proprietà.}");
	}
	return {
		generatorId: ID,
		level: 4,
		seed: rng.seed,
		prompt: sub === 'passo' ? 'Completa la dimostrazione: quale passo manca?' : `Completa la dimostrazione: perché vale il passo ${k + 1}?`,
		problem: `\\begin{array}{l} ${problem.join(' \\\\ ')} \\end{array}`,
		solution: sub === 'passo' ? `${k + 1}.\\ ${stepLine(right)}` : `\\text{Il passo ${k + 1} vale perché ${WHY_EXPLAIN[right.why]}}`,
		steps: solSteps,
		answer,
		params: { template: t.id, labels: p, sub, missing: String(k + 1), crit: String(t.crit), case: sub },
	};
}

// ---------------------------------------------------------------------------
// Level 5: triangle inequality

function tripleWith(rng: Rng, kind: 'valido' | 'vicino' | 'degenere' | 'lungo'): Tri {
	for (;;) {
		const x = rng.int(2, 12),
			y = rng.int(2, 12);
		const s = x + y;
		const m = kind === 'valido' ? rng.int(Math.max(x, y), s - 2) : kind === 'vicino' ? s - 1 : kind === 'degenere' ? s : s + rng.int(1, 6);
		if (m < Math.max(x, y) || m > 20 || x === y) continue;
		return shuffle(rng, [x, y, m]) as Tri;
	}
}
const tripleWords = (t: Tri) => `${t[0]} cm, ${t[1]} cm e ${t[2]} cm`;

function tripleStep(t: Tri): string {
	const [a, b, c] = sorted(t);
	const rel = a + b > c ? ` > ${c}` : a + b === c ? '' : ` < ${c}`;
	const end = a + b > c ? 'il triangolo esiste' : a + b === c ? 'uguale al lato più lungo, il triangolo non esiste' : 'minore del lato più lungo, il triangolo non esiste';
	return `\\text{${tripleWords(t)}: il lato più lungo è ${c} e } ${a} + ${b} = ${a + b}${rel}\\text{: ${end}.}`;
}

function level5(rng: Rng): Sample {
	const u = rng.next();
	const sub = u < 0.35 ? 'esiste' : u < 0.65 ? 'non-esiste' : 'intervallo';
	if (sub !== 'intervallo') {
		let tris: Tri[];
		for (;;) {
			if (sub === 'esiste') tris = [tripleWith(rng, rng.next() < 0.4 ? 'vicino' : 'valido'), tripleWith(rng, 'degenere'), tripleWith(rng, 'lungo'), tripleWith(rng, rng.pick(['degenere', 'lungo'] as const))];
			else tris = [tripleWith(rng, rng.pick(['degenere', 'lungo'] as const)), tripleWith(rng, 'vicino'), tripleWith(rng, 'valido'), tripleWith(rng, 'valido')];
			if (new Set(tris.map(multisetKey)).size === 4) break;
		}
		const answer = shuffledChoice(
			rng,
			tris.map((t) => ({ latex: sidesTex(t), values: t.map(String) })),
		);
		const listed = answer.options.map((o) => o.values.map(Number) as Tri);
		return {
			generatorId: ID,
			level: 5,
			seed: rng.seed,
			prompt: 'Usa la disuguaglianza triangolare.',
			problem: `\\text{Quale di queste terne ${sub === 'esiste' ? '' : 'non '}può essere quella dei lati di un triangolo?}`,
			solution: `\\text{${sub === 'esiste' ? 'Esiste' : 'Non esiste'} il triangolo con i lati ${tripleWords(listed[answer.correct])}}`,
			steps: ['\\text{Basta controllare che il lato più lungo sia minore della somma degli altri due.}', ...listed.map(tripleStep)],
			answer,
			params: { sub, triples: listed.map((t) => t.map(String)), case: sub },
		};
	}
	const a = rng.int(2, 12);
	const b = rng.int(a + 1, 15);
	const [first, second] = rng.next() < 0.5 ? [a, b] : [b, a];
	const lo = b - a,
		hi = a + b;
	const opts: ChoiceOption[] = [
		{ latex: `${lo} < x < ${hi}`, values: ['<', String(lo), String(hi)] },
		{ latex: `${lo} \\leq x \\leq ${hi}`, values: ['<=', String(lo), String(hi)] },
		{ latex: `0 < x < ${hi}`, values: ['<', '0', String(hi)] },
		{ latex: `${a} < x < ${b}`, values: ['<', String(a), String(b)] },
	];
	return {
		generatorId: ID,
		level: 5,
		seed: rng.seed,
		prompt: 'Usa la disuguaglianza triangolare.',
		problem: `\\begin{array}{l} \\text{Due lati di un triangolo sono lunghi $${first}$ cm e $${second}$ cm.} \\\\ \\text{Quali lunghezze $x$ (in cm) può avere il terzo lato?} \\end{array}`,
		solution: `${lo} < x < ${hi}`,
		steps: [
			'\\text{Il terzo lato è minore della somma degli altri due e maggiore della loro differenza.}',
			`${b} - ${a} < x < ${b} + ${a}`,
			`${lo} < x < ${hi}`,
			`\\text{Con } x = ${lo} \\text{ o } x = ${hi} \\text{ i tre punti sarebbero allineati: gli estremi sono esclusi.}`,
		],
		answer: shuffledChoice(rng, opts),
		params: { sub, a: String(first), b: String(second), case: sub },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the third angle; level 7: the angles of an isosceles triangle

const V = ['A', 'B', 'C'];

function numberSample(rng: Rng, level: number, prompt: string, problem: string, value: number, solution: string, steps: string[], params: Record<string, unknown>): Sample {
	const answer: NumberAnswer = { kind: 'number', value: degValue(value) };
	return { generatorId: ID, level, seed: rng.seed, prompt, problem, solution, steps, answer, params };
}

function level6(rng: Rng): Sample {
	if (rng.next() < 0.3) {
		const [right, given, unknown] = shuffle(rng, V);
		const b = rng.int(10, 80);
		const c = 90 - b;
		return numberSample(
			rng,
			6,
			'Trova l’angolo che manca.',
			`\\begin{array}{l} \\text{Il triangolo $ABC$ è rettangolo in $${right}$ e $\\hat{${given}} = ${b}^\\circ$.} \\\\ \\hat{${unknown}} = \\ ? \\end{array}`,
			c,
			`\\hat{${unknown}} = ${c}^\\circ`,
			[
				`\\text{In un triangolo rettangolo i due angoli acuti sono complementari: insieme fanno } 180^\\circ - 90^\\circ = 90^\\circ\\text{.}`,
				`\\hat{${unknown}} = 90^\\circ - ${b}^\\circ = ${c}^\\circ`,
			],
			{ sub: 'rettangolo', right, given, unknown, angle: String(b), case: 'rettangolo' },
		);
	}
	let angles: Tri;
	for (;;) {
		angles = [rng.int(15, 130), rng.int(15, 130), 0];
		angles[2] = 180 - angles[0] - angles[1];
		if (angles[2] >= 12) break;
	}
	const unknown = rng.int(0, 2);
	const given = [0, 1, 2].filter((i) => i !== unknown);
	const [g1, g2] = given.map((i) => angles[i]);
	const c = angles[unknown];
	const cls = angleClass(angles);
	return numberSample(
		rng,
		6,
		'Trova l’angolo che manca.',
		`\\begin{array}{l} \\text{In un triangolo $ABC$ si ha $\\hat{${V[given[0]]}} = ${g1}^\\circ$ e $\\hat{${V[given[1]]}} = ${g2}^\\circ$.} \\\\ \\hat{${V[unknown]}} = \\ ? \\end{array}`,
		c,
		`\\hat{${V[unknown]}} = ${c}^\\circ`,
		[
			'\\text{La somma degli angoli interni di un triangolo è } 180^\\circ\\text{.}',
			`\\hat{${V[unknown]}} = 180^\\circ - ${g1}^\\circ - ${g2}^\\circ = ${c}^\\circ`,
			`\\text{Il triangolo è ${cls}.}`,
		],
		{ sub: 'somma', given: given.map((i) => V[i]), values: [String(g1), String(g2)], unknown: V[unknown], case: 'somma' },
	);
}

function level7(rng: Rng): Sample {
	const u = rng.next();
	if (u < 0.4) {
		let v: number;
		do {
			v = rng.int(20, 160);
		} while (v === 60);
		const base = (180 - v) / 2;
		return numberSample(
			rng,
			7,
			'Trova l’angolo del triangolo isoscele.',
			`\\begin{array}{l} \\text{Nel triangolo isoscele $ABC$ di base $BC$ l'angolo al vertice misura $\\hat{A} = ${v}^\\circ$.} \\\\ \\hat{B} = \\ ? \\end{array}`,
			base,
			`\\hat{B} = ${degTex(base)}`,
			[
				'\\text{Gli angoli alla base sono congruenti: si divide in due parti uguali quello che resta di } 180^\\circ\\text{.}',
				`\\hat{B} = \\hat{C} = (180^\\circ - ${v}^\\circ) : 2 = ${degTex(base)}`,
			],
			{ sub: 'vertice', vertex: String(v), case: 'vertice' },
		);
	}
	if (u < 0.8) {
		let b: number;
		do {
			b = rng.int(10, 85);
		} while (b === 60);
		const apex = 180 - 2 * b;
		return numberSample(
			rng,
			7,
			'Trova l’angolo del triangolo isoscele.',
			`\\begin{array}{l} \\text{Nel triangolo isoscele $ABC$ di base $BC$ l'angolo alla base $\\hat{B}$ misura $${b}^\\circ$.} \\\\ \\hat{A} = \\ ? \\end{array}`,
			apex,
			`\\hat{A} = ${apex}^\\circ`,
			[
				`\\text{Gli angoli alla base sono congruenti: anche } \\hat{C} = ${b}^\\circ\\text{.}`,
				`\\hat{A} = 180^\\circ - 2 \\cdot ${b}^\\circ = ${apex}^\\circ`,
			],
			{ sub: 'base', base: String(b), case: 'base' },
		);
	}
	const v = rng.int(90, 160);
	const base = (180 - v) / 2;
	return numberSample(
		rng,
		7,
		'Trova l’angolo del triangolo isoscele.',
		`\\begin{array}{l} \\text{In un triangolo isoscele un angolo misura $${v}^\\circ$.} \\\\ \\text{Quanto misura ciascuno degli altri due angoli?} \\end{array}`,
		base,
		`\\text{Ciascuno misura } ${degTex(base)}`,
		[
			`\\text{Un angolo di } ${v}^\\circ \\text{ non può essere alla base: anche l'altro angolo alla base misurerebbe } ${v}^\\circ\\text{, e i due insieme farebbero già almeno } 180^\\circ\\text{.}`,
			`\\text{Allora } ${v}^\\circ \\text{ è l'angolo al vertice, e gli altri due sono gli angoli alla base.}`,
			`(180^\\circ - ${v}^\\circ) : 2 = ${degTex(base)}`,
		],
		{ sub: 'ottuso', angle: String(v), case: 'ottuso' },
	);
}

// ---------------------------------------------------------------------------
// Multiple choice for levels 6 and 7

function numberChoice(rng: Rng, value: number, mistakes: number[]): ChoiceAnswer {
	const vals = [value];
	const add = (w: number) => {
		if (vals.length < 4 && w > 0 && w < 180 && Number.isInteger(w * 2) && !vals.includes(w)) vals.push(w);
	};
	for (const w of mistakes) add(w);
	for (const d of [10, -10, 5, -5, 20, -20, 1, -1]) add(value + d);
	return shuffledChoice(
		rng,
		vals.map((w) => ({ latex: degTex(w), values: [degValue(w)] })),
	);
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params;
	const value = Number(eval1(sample.answer.kind === 'number' ? sample.answer.value : '0'));
	if (sample.level === 6) {
		if (p.sub === 'rettangolo') {
			const b = Number(p.angle);
			return numberChoice(rng, value, [180 - b, b, 90 + b]);
		}
		const [g1, g2] = (p.values as string[]).map(Number);
		return numberChoice(rng, value, [360 - g1 - g2, 180 - Math.max(g1, g2), rng.pick([value + 10, value - 10]), g1 + g2]);
	}
	if (sample.level === 7) {
		if (p.sub === 'vertice') {
			const v = Number(p.vertex);
			return numberChoice(rng, value, [v, 180 - v, 180 - 2 * v]);
		}
		if (p.sub === 'base') {
			const b = Number(p.base);
			return numberChoice(rng, value, [(180 - b) / 2, 180 - b, b, 90 - b]);
		}
		const v = Number(p.angle);
		return numberChoice(rng, value, [180 - v, v / 2, value + 10]);
	}
	throw new Error(`${ID}: no multiple choice for level ${sample.level}`);
}

/** "135/2" or "65" as a number. */
function eval1(s: string): number {
	const [n, d] = s.split('/');
	return Number(n) / (d ? Number(d) : 1);
}

// ---------------------------------------------------------------------------
// Checks from the spec

function checkChoice(ch: ChoiceAnswer | undefined, v: string[]) {
	if (!ch) return v.push('manca la scelta multipla');
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	const keys = ch.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) v.push('opzioni non distinte');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('indice della risposta fuori intervallo');
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (sample.steps.length === 0) v.push('nessun passaggio');
	if (!sample.problem) v.push('problema vuoto');
	switch (sample.level) {
		case 1: {
			const ans = sample.answer;
			if (ans.kind !== 'choice') return ['livello 1: risposta a scelta multipla'];
			checkChoice(ans, v);
			const tris = ans.options.map((o) => o.values.slice(1).map(Number) as Tri);
			const good = tris.map((t) => (p.by === 'lati' ? triangleExists(t) && (sideClass(t) === p.target || (p.target === 'isoscele' && sideClass(t) === 'equilatero')) : angleClass(t) === p.target));
			if (good.filter(Boolean).length !== 1 || !good[ans.correct]) v.push('una e una sola opzione deve essere giusta');
			for (const t of tris) {
				if (p.by === 'lati' && !triangleExists(t)) v.push(`lati ${t} non formano un triangolo`);
				if (p.by === 'angoli' && (t[0] + t[1] + t[2] !== 180 || Math.min(...t) < 10)) v.push(`angoli ${t} non validi`);
			}
			if (new Set(tris.map(multisetKey)).size !== 4) v.push('due terne uguali');
			break;
		}
		case 2:
		case 3:
		case 4:
		case 5: {
			if (sample.answer.kind !== 'choice') return [`livello ${sample.level}: risposta a scelta multipla`];
			checkChoice(sample.answer, v);
			if (sample.level === 5 && p.sub !== 'intervallo') {
				const tris = sample.answer.options.map((o) => o.values.map(Number) as Tri);
				const ok = tris.map(triangleExists);
				const want = p.sub === 'esiste';
				if (ok.filter((x) => x === want).length !== 1 || ok[sample.answer.correct] !== want) v.push('una e una sola terna giusta');
				if (tris.some((t) => Math.max(...t) > 20)) v.push('lati oltre 20');
			}
			break;
		}
		case 6:
		case 7: {
			if (sample.answer.kind !== 'number') return ['risposta numerica'];
			const x = eval1(sample.answer.value);
			if (!(x > 0 && x < 180)) v.push('angolo fuori da (0, 180)');
			if (sample.level === 6 && p.sub === 'somma') {
				const [a, b] = (p.values as string[]).map(Number);
				if (a + b + x !== 180 || Math.min(a, b, x) < 10) v.push('somma diversa da 180 o angolo troppo piccolo');
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------

const LEVELS = [level1, level2, level3, level4, level5, level6, level7];

export const angoliELatiDeiTriangoli: Generator = {
	id: ID,
	title: 'Triangoli e criteri di congruenza',
	levels: {
		1: { label: 'Classificare un triangolo dai lati o dagli angoli', constraints: ['quattro terne, una sola della classe chiesta', 'lati da 2 a 15 cm che formano un triangolo; angoli interi da almeno 10° con somma 180°'] },
		2: { label: "Elementi corrispondenti e ordine dei vertici", constraints: ['dalla scrittura △ABC ≅ △EFD alla congruenza vera', 'dagli elementi congruenti alla scrittura con i vertici nell’ordine giusto'] },
		3: { label: 'Quale criterio di congruenza', constraints: ['tre coppie di elementi ordinatamente congruenti', 'primo, secondo, terzo o nessuno (due lati e angolo non compreso, tre angoli), un quarto ciascuno'] },
		4: { label: 'Il passo mancante di una dimostrazione', constraints: ['le dimostrazioni degli esempi 1-5 e del teorema del triangolo isoscele', 'il passo mancante o la sua giustificazione'] },
		5: { label: 'Disuguaglianza triangolare', constraints: ['quale terna forma (o non forma) un triangolo, anche con la somma uguale al terzo lato', 'le lunghezze possibili del terzo lato'] },
		6: { label: 'Il terzo angolo', constraints: ['due angoli dati, somma 180°', 'triangolo rettangolo: angoli acuti complementari'] },
		7: { label: 'Gli angoli del triangolo isoscele', constraints: ['dato l’angolo al vertice o un angolo alla base', 'un angolo ottuso o retto è per forza al vertice'] },
	},
	generate(rng: Rng, level: number): Sample {
		const make = LEVELS[level - 1];
		if (!make) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 200; attempt++) {
			const sample = make(rng);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default angoliELatiDeiTriangoli;
