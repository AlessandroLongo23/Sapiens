/**
 * Rette perpendicolari e parallele. Spec: specs/exercises/geometria-perpendicolari-parallele.md
 *
 * Seven levels in the order of the lesson: the names of the pairs of angles formed by two lines and a
 * transversal, the eight angles with two parallels, parallel or not from two angles, the angles with an
 * equation, the angles of a triangle, the exterior angle, the angles of a convex polygon. Everything is
 * text, without a drawing: the eight angles are numbered as in the lesson (1 to 4 at the point on a, 5 to
 * 8 at the point on b, counterclockwise from the one above a and to the right of t), and the problem
 * recalls that numbering. Built backwards: the answer is chosen first, then the data.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { assembleChoice, shuffle, textBlock } from '../insiemi';

export const ID = 'geometria-perpendicolari-parallele';

const t = (s: string) => `\\text{${s}}`;
const deg = (n: number) => `${n}^\\circ`;
const ang = (k: number | string) => `\\hat{${k}}`;
/** An angle inside prose. */
const angP = (k: number | string) => `$\\hat{${k}}$`;
const degP = (n: number) => `$${n}^\\circ$`;

// ---------------------------------------------------------------------------
// The eight angles, as in the lesson's figure and table

export type PairType = 'alterni-interni' | 'alterni-esterni' | 'corrispondenti' | 'coniugati-interni' | 'coniugati-esterni';
export const PAIR_TYPES: PairType[] = ['alterni-interni', 'alterni-esterni', 'corrispondenti', 'coniugati-interni', 'coniugati-esterni'];
const PAIR_NAME: Record<PairType, string> = {
	'alterni-interni': 'alterni interni',
	'alterni-esterni': 'alterni esterni',
	corrispondenti: 'corrispondenti',
	'coniugati-interni': 'coniugati interni',
	'coniugati-esterni': 'coniugati esterni',
};
/** The lesson's table. */
const PAIRS: Record<PairType, [number, number][]> = {
	'alterni-interni': [[3, 5], [4, 6]],
	'alterni-esterni': [[1, 7], [2, 8]],
	corrispondenti: [[1, 5], [2, 6], [3, 7], [4, 8]],
	'coniugati-interni': [[4, 5], [3, 6]],
	'coniugati-esterni': [[1, 8], [2, 7]],
};
const CONGRUENT: Record<PairType, boolean> = {
	'alterni-interni': true,
	'alterni-esterni': true,
	corrispondenti: true,
	'coniugati-interni': false,
	'coniugati-esterni': false,
};

function pairType(i: number, j: number): PairType | null {
	for (const ty of PAIR_TYPES) for (const [p, q] of PAIRS[ty]) if ((p === i && q === j) || (p === j && q === i)) return ty;
	return null;
}

/** Where angle k is: the line, above or below it, right or left of t. */
const POS: Record<number, { line: 'a' | 'b'; v: 'sopra' | 'sotto'; s: 'destra' | 'sinistra' }> = {
	1: { line: 'a', v: 'sopra', s: 'destra' },
	2: { line: 'a', v: 'sopra', s: 'sinistra' },
	3: { line: 'a', v: 'sotto', s: 'sinistra' },
	4: { line: 'a', v: 'sotto', s: 'destra' },
	5: { line: 'b', v: 'sopra', s: 'destra' },
	6: { line: 'b', v: 'sopra', s: 'sinistra' },
	7: { line: 'b', v: 'sotto', s: 'sinistra' },
	8: { line: 'b', v: 'sotto', s: 'destra' },
};
const interno = (k: number) => k >= 3 && k <= 6;
/** With a ∥ b the odd angles are congruent to each other (acute in the lesson's figure), and so are the even ones. */
const sameClass = (i: number, j: number) => i % 2 === j % 2;

/** "sotto a, a destra di t": where the angle is, in words. */
const whereWords = (k: number) => `${POS[k].v} $${POS[k].line}$ a ${POS[k].s} di $t$`;

const NUMBERING = 'Gli angoli sono numerati come nella lezione: da $\\hat{1}$ a $\\hat{4}$ nel punto su $a$, da $\\hat{5}$ a $\\hat{8}$ nel punto su $b$, in senso antiorario a partire da quello sopra la retta e a destra di $t$.';

// ---------------------------------------------------------------------------
// Options

const nameOption = (ty: PairType): ChoiceOption => ({ latex: t(PAIR_NAME[ty]), values: [ty] });
const angleOption = (k: number): ChoiceOption => ({ latex: ang(k), values: [String(k)] });
export type Unit = 'deg' | 'x' | 'n';
const numLatex = (n: number, unit: Unit) => (unit === 'deg' ? deg(n) : unit === 'x' ? `x = ${n}` : String(n));
const numOption = (n: number, unit: Unit): ChoiceOption => ({ latex: numLatex(n, unit), values: [String(n)] });
const NONE: ChoiceOption = { latex: t('Il triangolo non esiste'), values: ['none'] };

/** Level 3: the verdict with the property it rests on. */
export type Verdict = 'si-congruenti' | 'si-supplementari' | 'no-congruenti' | 'no-supplementari' | 'non-si-puo';
const VERDICT_TEXT: Record<Verdict, string> = {
	'si-congruenti': 'Sì: sono congruenti',
	'si-supplementari': 'Sì: sono supplementari',
	'no-congruenti': 'No: non sono congruenti',
	'no-supplementari': 'No: non sono supplementari',
	'non-si-puo': 'Non si può stabilire',
};
const verdictOption = (v: Verdict): ChoiceOption => ({ latex: t(VERDICT_TEXT[v]), values: [v] });

function mustChoice(rng: Rng, correct: ChoiceOption, distractors: (ChoiceOption | null)[]): ChoiceAnswer {
	const ch = assembleChoice(rng, correct, distractors);
	if (!ch) throw new Error(`${ID}: not enough distractors`);
	return ch;
}

// ---------------------------------------------------------------------------
// Building a sample

interface Built {
	prompt: string;
	prose: string;
	solution: string;
	steps: string[];
	/** A number answer (with its unit) or a choice. */
	value?: number;
	unit?: Unit;
	choice?: ChoiceAnswer;
	params: Record<string, unknown>;
}

const str = (o: Record<string, number | string | boolean>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)]));

// Level 1: names of the pairs ---------------------------------------------------

const SIBLING: Record<PairType, PairType> = {
	'alterni-interni': 'alterni-esterni',
	'alterni-esterni': 'alterni-interni',
	corrispondenti: 'alterni-interni',
	'coniugati-interni': 'coniugati-esterni',
	'coniugati-esterni': 'coniugati-interni',
};
const CROSS: Record<PairType, PairType> = {
	'alterni-interni': 'coniugati-interni',
	'alterni-esterni': 'coniugati-esterni',
	corrispondenti: 'coniugati-interni',
	'coniugati-interni': 'alterni-interni',
	'coniugati-esterni': 'alterni-esterni',
};

function nameDistractors(rng: Rng, ty: PairType): ChoiceOption[] {
	const rest = shuffle(rng, PAIR_TYPES.filter((x) => x !== ty && x !== SIBLING[ty] && x !== CROSS[ty]));
	return [SIBLING[ty], CROSS[ty], ...rest].map(nameOption);
}

/** Steps that place the two angles and name the pair. */
function placeSteps(i: number, j: number): string[] {
	const one = (k: number) => `${ang(k)} ${t(` è ${interno(k) ? 'interno' : 'esterno'}, a ${POS[k].s} di `)} t`;
	const ty = pairType(i, j)!;
	const why: Record<PairType, string> = {
		'alterni-interni': 'Tutti e due interni, da parti opposte di ',
		'alterni-esterni': 'Tutti e due esterni, da parti opposte di ',
		corrispondenti: 'Dalla stessa parte di ',
		'coniugati-interni': 'Tutti e due interni, dalla stessa parte di ',
		'coniugati-esterni': 'Tutti e due esterni, dalla stessa parte di ',
	};
	const tail = ty === 'corrispondenti' ? t(', uno interno e uno esterno, nella stessa posizione: sono corrispondenti') : t(`: sono ${PAIR_NAME[ty]}`);
	return [one(i), one(j), `${t(why[ty])} t ${tail}`];
}

function level1(rng: Rng): Built {
	const kind = rng.pick(['nome', 'posizione', 'trova'] as const);
	if (kind === 'trova') {
		const i = rng.int(1, 8);
		const partners = [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => POS[k].line !== POS[i].line);
		const named = partners.filter((k) => pairType(i, k));
		const j = rng.pick(named);
		const ty = pairType(i, j)!;
		const choice = mustChoice(rng, angleOption(j), partners.filter((k) => k !== j).map(angleOption));
		return {
			prompt: 'Rispondi con la numerazione della lezione.',
			prose: `Le rette $a$ e $b$ sono tagliate dalla trasversale $t$. ${NUMBERING} Quale angolo forma con ${angP(i)} una coppia di angoli ${PAIR_NAME[ty]}?`,
			solution: ang(j),
			steps: [`${t("L'angolo cercato sta nell'altro punto, quello su ")} ${POS[j].line}`, ...placeSteps(i, j)],
			choice,
			params: { case: 'trova', angle: String(i), type: ty, answer: String(j) },
		};
	}
	const ty = rng.pick(PAIR_TYPES);
	const pair = rng.pick(PAIRS[ty]);
	const [i, j] = rng.int(0, 1) ? pair : [pair[1], pair[0]];
	const choice = mustChoice(rng, nameOption(ty), nameDistractors(rng, ty));
	const prose =
		kind === 'nome'
			? `Le rette $a$ e $b$ sono tagliate dalla trasversale $t$. ${NUMBERING} Come si chiama la coppia di angoli ${angP(i)} e ${angP(j)}?`
			: `Le rette $a$ e $b$, con $a$ sopra $b$, sono tagliate dalla trasversale $t$. Nel punto su $${POS[i].line}$ prendi l'angolo ${whereWords(i)}; nel punto su $${POS[j].line}$ prendi l'angolo ${whereWords(j)}. Come si chiama la coppia?`;
	const steps =
		kind === 'nome'
			? placeSteps(i, j)
			: [
					`${t(`L'angolo ${POS[i].v} `)} ${POS[i].line} ${t(` è ${interno(i) ? 'interno' : 'esterno'}, l'angolo ${POS[j].v} `)} ${POS[j].line} ${t(` è ${interno(j) ? 'interno' : 'esterno'}`)}`,
					`${t(POS[i].s === POS[j].s ? 'Stanno dalla stessa parte di ' : 'Stanno da parti opposte di ')} t`,
					`${t(`Quindi sono ${PAIR_NAME[ty]}: nella numerazione della lezione, `)} ${ang(i)} ${t(' e ')} ${ang(j)}`,
				];
	return {
		prompt: 'Rispondi con i nomi della lezione.',
		prose,
		solution: t(PAIR_NAME[ty]),
		steps,
		choice,
		params: { case: kind, i: String(i), j: String(j), type: ty },
	};
}

// Level 2: the eight angles with a ∥ b ------------------------------------------

/** How angle j follows from angle i when a ∥ b: one or two steps. */
function relationSteps(i: number, j: number, vi: number, vj: number): string[] {
	const same = sameClass(i, j);
	const eq = same ? `${ang(j)} = ${ang(i)} = ${deg(vj)}` : `${ang(j)} = 180^\\circ - ${deg(vi)} = ${deg(vj)}`;
	if (POS[i].line === POS[j].line) {
		const name = same ? 'sono opposti al vertice, quindi congruenti' : 'sono adiacenti, quindi supplementari';
		return [`${ang(i)} ${t(' e ')} ${ang(j)} ${t(` ${name}`)}`, eq];
	}
	const ty = pairType(i, j);
	if (ty) {
		const rule = CONGRUENT[ty] ? 'congruenti' : 'supplementari';
		return [`${ang(i)} ${t(' e ')} ${ang(j)} ${t(` sono ${PAIR_NAME[ty]}, e con due parallele sono ${rule}`)}`, eq];
	}
	// Not a named pair: through the angle at the same point as i that corresponds to j.
	const k = j > 4 ? j - 4 : j + 4;
	const vk = vj;
	const first = sameClass(i, k)
		? `${ang(k)} = ${ang(i)} = ${deg(vk)} ${t(' (opposti al vertice)')}`
		: `${ang(k)} = 180^\\circ - ${deg(vi)} = ${deg(vk)} ${t(' (adiacenti)')}`;
	return [first, `${ang(j)} ${t(' e ')} ${ang(k)} ${t(' sono corrispondenti, e con due parallele sono congruenti')}`, `${ang(j)} = ${deg(vj)}`];
}

function level2(rng: Rng): Built {
	const alpha = rng.int(15, 85);
	const value = (k: number) => (k % 2 === 1 ? alpha : 180 - alpha);
	const i = rng.int(1, 8);
	const j = rng.pick([1, 2, 3, 4, 5, 6, 7, 8].filter((k) => k !== i));
	const vi = value(i), vj = value(j);
	const mistakes = [180 - vj, Math.abs(90 - vj)];
	return {
		prompt: "Trova l'ampiezza dell'angolo.",
		prose: `Le rette parallele $a$ e $b$ sono tagliate dalla trasversale $t$. ${NUMBERING} Si sa che ${angP(i)} misura ${degP(vi)}. Quanto misura ${angP(j)}?`,
		solution: `${ang(j)} = ${deg(vj)}`,
		steps: relationSteps(i, j, vi, vj),
		value: vj,
		unit: 'deg',
		params: { case: POS[i].line === POS[j].line ? 'stesso-punto' : 'altro-punto', ...str({ i, j, given: vi, answer: vj }), mistakes: mistakes.map(String) },
	};
}

// Level 3: parallel or not ---------------------------------------------------------

function level3(rng: Rng): Built {
	const ty = rng.pick(PAIR_TYPES);
	const pair = rng.pick(PAIRS[ty]);
	const [i, j] = rng.int(0, 1) ? pair : [pair[1], pair[0]];
	const cong = CONGRUENT[ty];
	const roll = rng.int(0, 3);
	const kind = roll < 2 ? 'parallele' : roll === 2 ? 'trappola' : 'vicine';
	let p: number, q: number;
	for (;;) {
		p = rng.int(20, 160);
		if (p === 90) continue;
		if (kind === 'parallele') q = cong ? p : 180 - p;
		else if (kind === 'trappola') q = cong ? 180 - p : p;
		else {
			const d = rng.pick([-12, -10, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8, 10, 12]);
			q = (cong ? p : 180 - p) + d;
			if (q === p || p + q === 180) continue;
		}
		if (q >= 15 && q <= 165) break;
	}
	const parallel = cong ? p === q : p + q === 180;
	const correct: Verdict = parallel ? (cong ? 'si-congruenti' : 'si-supplementari') : cong ? 'no-congruenti' : 'no-supplementari';
	// The "no" that rests on the wrong property is a distractor only when it is false as arithmetic.
	const otherNo: Verdict = cong ? 'no-supplementari' : 'no-congruenti';
	const otherNoFalse = cong ? p + q === 180 : p === q;
	const pool: Verdict[] = ['si-congruenti', 'si-supplementari', 'no-congruenti', 'no-supplementari'].filter((v) => v !== correct && v !== otherNo) as Verdict[];
	pool.push(parallel || otherNoFalse ? otherNo : 'non-si-puo');
	const choice = mustChoice(rng, verdictOption(correct), pool.map(verdictOption));
	const rule = cong ? 'congruenti' : 'supplementari';
	const calc = cong ? (p === q ? `${deg(p)} = ${deg(q)}` : `${deg(p)} \\neq ${deg(q)}`) : p + q === 180 ? `${deg(p)} + ${deg(q)} = 180^\\circ` : `${deg(p)} + ${deg(q)} = ${deg(p + q)} \\neq 180^\\circ`;
	return {
		prompt: 'Stabilisci se le rette sono parallele.',
		prose: `Le rette $a$ e $b$ sono tagliate dalla trasversale $t$. ${NUMBERING} Si sa che ${angP(i)} misura ${degP(p)} e ${angP(j)} misura ${degP(q)}. Le rette $a$ e $b$ sono parallele?`,
		solution: parallel ? `a \\parallel b` : `a \\not\\parallel b`,
		steps: [
			`${ang(i)} ${t(' e ')} ${ang(j)} ${t(` sono ${PAIR_NAME[ty]}: le rette sono parallele se e solo se sono ${rule}`)}`,
			calc,
			parallel ? `${t(`Sono ${rule}, quindi `)} a \\parallel b` : `${t(`Non sono ${rule}, quindi le rette non sono parallele`)}`,
		],
		choice,
		params: { case: kind, i: String(i), j: String(j), type: ty, p: String(p), q: String(q), answer: correct },
	};
}

// Level 4: the angles with an equation ---------------------------------------------

/** a·x + b as LaTeX: "3x + 10", "x - 5", "4x". */
export function lin(a: number, b: number): string {
	const ax = a === 1 ? 'x' : `${a}x`;
	return b === 0 ? ax : `${ax} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
}
const angleExpr = (a: number, b: number) => (b === 0 ? `${lin(a, b)}^\\circ` : `(${lin(a, b)})^\\circ`);
/** a·x = c with a written as in the lesson: "-2x = -40", "6x = 150". */
const axEq = (a: number, c: number) => `${a === 1 ? '' : a === -1 ? '-' : a}x = ${c}`;

function level4(rng: Rng): Built {
	for (;;) {
		const ty = rng.pick(PAIR_TYPES);
		const cong = CONGRUENT[ty];
		const x = rng.int(5, 40);
		let a = rng.int(1, 7), c = rng.int(1, 7);
		if (cong && a === c) continue;
		const th1 = rng.int(25, 155);
		if (th1 === 90) continue;
		const th2 = cong ? th1 : 180 - th1;
		if (th2 < 25 || th2 > 155) continue;
		let b = th1 - a * x, d = th2 - c * x;
		if (Math.abs(b) > 100 || Math.abs(d) > 100) continue;
		if (b === 0 && d === 0 && cong) continue;
		// Either angle may come first in the text; the steps follow the text.
		if (rng.int(0, 1)) [a, b, c, d] = [c, d, a, b];
		const A = angleExpr(a, b), B = angleExpr(c, d);
		const steps: string[] = [];
		let wrong: number;
		let slip: number;
		if (cong) {
			steps.push(`${t(`Con due parallele gli angoli ${PAIR_NAME[ty]} sono congruenti`)}`);
			steps.push(`${lin(a, b)} = ${lin(c, d)}`);
			steps.push(axEq(a - c, d - b));
			wrong = (180 - b - d) / (a + c);
			slip = (d + b) / (a - c);
		} else {
			steps.push(`${t(`Con due parallele gli angoli ${PAIR_NAME[ty]} sono supplementari`)}`);
			steps.push(`${lin(a, b)} + ${lin(c, d)} = 180`);
			steps.push(axEq(a + c, 180 - b - d));
			wrong = a !== c ? (d - b) / (a - c) : NaN;
			slip = (180 + b + d) / (a + c);
		}
		steps.push(`x = ${x}`);
		const v1 = a * x + b, v2 = c * x + d;
		steps.push(`${t('Gli angoli misurano ')} ${deg(v1)} ${t(' e ')} ${deg(v2)}`);
		const mistakes = [wrong, slip, a * x + b, x + 1, x - 1];
		return {
			prompt: "Scrivi l'equazione e trova x.",
			prose: `Le rette $a$ e $b$ sono parallele e sono tagliate da una trasversale. Due angoli ${PAIR_NAME[ty]} misurano $${A}$ e $${B}$. Trova $x$.`,
			solution: `x = ${x}`,
			steps,
			value: x,
			unit: 'x',
			params: { case: cong ? 'congruenti' : 'supplementari', type: ty, ...str({ a, b, c, d, x }), mistakes: mistakes.filter((m) => Number.isInteger(m) && m > 0 && m !== x).map(String) },
		};
	}
}

// Level 5: the angles of a triangle -----------------------------------------------

const VERTS = ['A', 'B', 'C'] as const;
const hatV = (v: string) => `\\hat{${v}}`;

/** Triples k1 ≤ k2 ≤ k3, not all equal, with k1 + k2 + k3 dividing 180. */
const PROPORTIONS: [number, number, number][] = [];
for (let k1 = 1; k1 <= 9; k1++)
	for (let k2 = k1; k2 <= 9; k2++)
		for (let k3 = k2; k3 <= 9; k3++) if (!(k1 === k2 && k2 === k3) && 180 % (k1 + k2 + k3) === 0) PROPORTIONS.push([k1, k2, k3]);

const kx = (k: number) => (k === 1 ? 'x' : `${k}x`);

function level5(rng: Rng): Built {
	const roll = rng.int(0, 19);
	const kind = roll < 4 ? 'terzo' : roll < 7 ? 'non-esiste' : roll < 10 ? 'base' : roll < 13 ? 'vertice' : roll < 16 ? 'rettangolo' : 'proporzione';
	const prompt = 'Usa la somma degli angoli del triangolo.';
	if (kind === 'terzo' || kind === 'non-esiste') {
		const [U, W, V] = shuffle(rng, [...VERTS]);
		let p: number, q: number;
		for (;;) {
			if (kind === 'terzo') {
				p = rng.int(15, 140);
				q = rng.int(15, 150);
				if (180 - p - q >= 10) break;
			} else {
				p = rng.int(60, 150);
				q = rng.int(20, 150);
				if (p + q >= 180 && p + q <= 260) break;
			}
		}
		const r = 180 - p - q;
		const prose = `In un triangolo $ABC$ l'angolo $\\hat{${U}}$ misura ${degP(p)} e l'angolo $\\hat{${W}}$ misura ${degP(q)}. Quanto misura $\\hat{${V}}$?`;
		if (kind === 'terzo') {
			return {
				prompt,
				prose,
				solution: `${hatV(V)} = ${deg(r)}`,
				steps: [`${hatV(U)} + ${hatV(W)} + ${hatV(V)} = 180^\\circ`, `${hatV(V)} = 180^\\circ - ${deg(p)} - ${deg(q)} = ${deg(r)}`],
				value: r,
				unit: 'deg',
				params: { case: kind, ...str({ U, W, V, p, q, answer: r }), mistakes: [360 - p - q, p + q, 180 - p].map(String), none: 'true' },
			};
		}
		const nums = [Math.abs(r), 360 - p - q, 180 - p, 180 - q].filter((n) => n >= 0 && n < 360);
		const choice = mustChoice(rng, NONE, nums.map((n) => numOption(n, 'deg')));
		return {
			prompt,
			prose,
			solution: t('Il triangolo non esiste'),
			steps: [
				`${deg(p)} + ${deg(q)} = ${deg(p + q)}`,
				`${t('I due angoli insieme ')} ${p + q === 180 ? t('fanno già ') : t('superano ')} 180^\\circ ${t(': per il terzo angolo non resta niente')}`,
			],
			choice,
			params: { case: kind, ...str({ U, W, V, p, q }), answer: 'none' },
		};
	}
	if (kind === 'base') {
		const V = 2 * rng.int(10, 80);
		const b = (180 - V) / 2;
		return {
			prompt,
			prose: `In un triangolo isoscele l'angolo al vertice misura ${degP(V)}. Quanto misura ciascun angolo alla base?`,
			solution: deg(b),
			steps: [`${t('Gli angoli alla base sono congruenti e insieme fanno ')} 180^\\circ - ${deg(V)} = ${deg(180 - V)}`, `${deg(180 - V)} : 2 = ${deg(b)}`],
			value: b,
			unit: 'deg',
			params: { case: kind, ...str({ vertex: V, answer: b }), mistakes: [180 - V, V / 2, 180 - 2 * V].map(String) },
		};
	}
	if (kind === 'vertice') {
		const b = rng.int(15, 85);
		const V = 180 - 2 * b;
		return {
			prompt,
			prose: `In un triangolo isoscele un angolo alla base misura ${degP(b)}. Quanto misura l'angolo al vertice?`,
			solution: deg(V),
			steps: [`${t("Anche l'altro angolo alla base misura ")} ${deg(b)}`, `180^\\circ - 2 \\cdot ${deg(b)} = ${deg(V)}`],
			value: V,
			unit: 'deg',
			params: { case: kind, ...str({ base: b, answer: V }), mistakes: [180 - b, (180 - b) / 2, 90 - b].map(String) },
		};
	}
	if (kind === 'rettangolo') {
		const al = rng.int(10, 80);
		return {
			prompt,
			prose: `In un triangolo rettangolo un angolo acuto misura ${degP(al)}. Quanto misura l'altro angolo acuto?`,
			solution: deg(90 - al),
			steps: [t('In un triangolo rettangolo gli angoli acuti sono complementari'), `90^\\circ - ${deg(al)} = ${deg(90 - al)}`],
			value: 90 - al,
			unit: 'deg',
			params: { case: kind, ...str({ acute: al, answer: 90 - al }), mistakes: [180 - al, 90 + al, al].map(String) },
		};
	}
	// In increasing order, as in the lesson (x, 2x, 3x).
	const ks = rng.pick(PROPORTIONS);
	const s = ks[0] + ks[1] + ks[2];
	const x = 180 / s;
	const asked = rng.pick(['maggiore', 'minore'] as const);
	const kAsked = asked === 'maggiore' ? Math.max(...ks) : Math.min(...ks);
	const ans = kAsked * x;
	const kOther = asked === 'maggiore' ? Math.min(...ks) : Math.max(...ks);
	const sumTex = ks.map(kx).join(' + ');
	return {
		prompt,
		prose: `Gli angoli di un triangolo misurano $${kx(ks[0])}$, $${kx(ks[1])}$ e $${kx(ks[2])}$. Quanto misura il ${asked} dei tre angoli?`,
		solution: deg(ans),
		steps: [`${sumTex} = 180^\\circ`, `${s}x = 180^\\circ`, `x = ${deg(x)}`, `${t(`Il ${asked} è `)} ${kx(kAsked)} = ${kAsked === 1 ? '' : `${kAsked} \\cdot ${x}^\\circ = `}${deg(ans)}`],
		value: ans,
		unit: 'deg',
		params: { case: kind, ks: ks.map(String), asked, answer: String(ans), mistakes: [x, kOther * x, 180 - ans, (180 - x) / 2].map(String) },
	};
}

// Level 6: the exterior angle -----------------------------------------------------

function level6(rng: Rng): Built {
	const kind = rng.pick(['da-interni', 'adiacente', 'altro', 'interno'] as const);
	const [V, U, W] = shuffle(rng, [...VERTS]);
	for (;;) {
		const u = rng.int(15, 110), w = rng.int(15, 110);
		const v = 180 - u - w;
		if (v < 15) continue;
		const ext = u + w;
		const extP = `l'angolo esterno in $${V}$`;
		let prose: string, ans: number, given: number[], mistakes: number[], steps: string[], asked: string;
		if (kind === 'da-interni') {
			asked = 'esterno';
			ans = ext;
			given = [u, w];
			prose = `In un triangolo $ABC$ si ha $\\hat{${U}} = ${deg(u)}$ e $\\hat{${W}} = ${deg(w)}$. Quanto misura ${extP}?`;
			steps = [`${t("L'angolo esterno in ")} ${V} ${t(' è la somma degli angoli interni non adiacenti, in ')} ${U} ${t(' e in ')} ${W}`, `${deg(u)} + ${deg(w)} = ${deg(ext)}`];
			mistakes = [180 - ext, 180 - u, 180 - w];
		} else if (kind === 'adiacente') {
			asked = 'esterno';
			ans = ext;
			given = [v, u];
			prose = `In un triangolo $ABC$ si ha $\\hat{${V}} = ${deg(v)}$ e $\\hat{${U}} = ${deg(u)}$. Quanto misura ${extP}?`;
			steps = [`${t("L'angolo esterno in ")} ${V} ${t(' è adiacente a ')} ${hatV(V)} ${t(', quindi è il suo supplementare')}`, `180^\\circ - ${deg(v)} = ${deg(ext)}`];
			mistakes = [v + u, 180 - u, 180 - v - u];
		} else if (kind === 'altro') {
			asked = W;
			ans = w;
			given = [ext, u];
			prose = `In un triangolo $ABC$ ${extP} misura ${degP(ext)} e $\\hat{${U}} = ${deg(u)}$. Quanto misura $\\hat{${W}}$?`;
			steps = [`${t("L'angolo esterno in ")} ${V} ${t(' è la somma degli angoli in ')} ${U} ${t(' e in ')} ${W}: ${hatV(U)} + ${hatV(W)} = ${deg(ext)}`, `${hatV(W)} = ${deg(ext)} - ${deg(u)} = ${deg(w)}`];
			mistakes = [180 - ext, ext + u, 180 - u - ext, 180 - u];
		} else {
			asked = V;
			ans = v;
			given = [ext, u];
			prose = `In un triangolo $ABC$ ${extP} misura ${degP(ext)} e $\\hat{${U}} = ${deg(u)}$. Quanto misura $\\hat{${V}}$?`;
			steps = [`${t("L'angolo interno in ")} ${V} ${t(" è adiacente all'angolo esterno, quindi è il suo supplementare")}`, `${hatV(V)} = 180^\\circ - ${deg(ext)} = ${deg(v)}`];
			mistakes = [ext - u, ext, 180 - u];
		}
		if (given.includes(ans)) continue;
		return {
			prompt: "Usa l'angolo esterno del triangolo.",
			prose,
			solution: asked === 'esterno' ? deg(ans) : `${hatV(asked)} = ${deg(ans)}`,
			steps,
			value: ans,
			unit: 'deg',
			params: { case: kind, ...str({ V, U, W, u, w, answer: ans }), mistakes: mistakes.map(String) },
		};
	}
}

// Level 7: convex polygons -------------------------------------------------------

/** n with an integer angle in the regular polygon. */
export const REGULAR = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
const POLY_NAME: Record<number, string> = { 4: 'quadrilatero', 5: 'pentagono', 6: 'esagono' };
const COUNT_WORD: Record<number, string> = { 3: 'tre', 4: 'quattro', 5: 'cinque' };
const ORDINAL: Record<number, string> = { 4: 'quarto', 5: 'quinto', 6: 'sesto' };

function level7(rng: Rng): Built {
	const kind = rng.pick(['somma', 'lati', 'regolare', 'lati-regolare', 'ultimo'] as const);
	const prompt = 'Usa la somma degli angoli del poligono.';
	const S = (n: number) => (n - 2) * 180;
	if (kind === 'somma') {
		const n = rng.int(4, 20);
		return {
			prompt,
			prose: `Un poligono convesso ha ${n} lati. Quanto vale la somma dei suoi angoli interni?`,
			solution: deg(S(n)),
			steps: [`S = (n - 2) \\cdot 180^\\circ`, `S = (${n} - 2) \\cdot 180^\\circ = ${n - 2} \\cdot 180^\\circ = ${deg(S(n))}`],
			value: S(n),
			unit: 'deg',
			params: { case: kind, n: String(n), answer: String(S(n)), mistakes: [n * 180, (n - 1) * 180, (n - 3) * 180].map(String) },
		};
	}
	if (kind === 'lati') {
		const n = rng.int(5, 20);
		return {
			prompt,
			prose: `La somma degli angoli interni di un poligono convesso è ${degP(S(n))}. Quanti lati ha?`,
			solution: `n = ${n}`,
			steps: [`(n - 2) \\cdot 180^\\circ = ${deg(S(n))}`, `n - 2 = ${S(n)} : 180 = ${n - 2}`, `n = ${n}`],
			value: n,
			unit: 'n',
			params: { case: kind, sum: String(S(n)), answer: String(n), mistakes: [n - 2, n - 1, n + 1, n - 4].map(String) },
		};
	}
	if (kind === 'regolare') {
		const n = rng.pick(REGULAR);
		const a = S(n) / n;
		return {
			prompt,
			prose: `Quanto misura ciascun angolo di un poligono regolare con ${n} lati?`,
			solution: deg(a),
			steps: [`S = (${n} - 2) \\cdot 180^\\circ = ${deg(S(n))}`, `${t('Gli angoli sono congruenti: ')} ${deg(S(n))} : ${n} = ${deg(a)}`],
			value: a,
			unit: 'deg',
			params: { case: kind, n: String(n), answer: String(a), mistakes: [360 / n, 180, S(n)].map(String) },
		};
	}
	if (kind === 'lati-regolare') {
		const n = rng.pick(REGULAR.filter((k) => k >= 5));
		const a = S(n) / n;
		const e = 180 - a;
		return {
			prompt,
			prose: `Ogni angolo di un poligono regolare misura ${degP(a)}. Quanti lati ha?`,
			solution: `n = ${n}`,
			steps: [`${t('Ogni angolo esterno misura ')} 180^\\circ - ${deg(a)} = ${deg(e)}`, `${t('Gli angoli esterni insieme fanno ')} 360^\\circ ${t(', quindi sono ')} 360^\\circ : ${deg(e)} = ${n}`],
			value: n,
			unit: 'n',
			params: { case: kind, angle: String(a), answer: String(n), mistakes: [e, n / 2, n - 2, n + 2].map(String) },
		};
	}
	const n = rng.pick([4, 5, 6]);
	for (;;) {
		const known = Array.from({ length: n - 1 }, () => rng.int(n === 4 ? 50 : 80, 170));
		const sum = known.reduce((s, k) => s + k, 0);
		const last = S(n) - sum;
		if (last < 40 || last > 170) continue;
		const list = known.map(degP);
		const listP = `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
		return {
			prompt,
			prose: `Un ${POLY_NAME[n]} convesso ha ${COUNT_WORD[n - 1]} angoli di ${listP}. Quanto misura il ${ORDINAL[n]} angolo?`,
			solution: deg(last),
			steps: [
				`S = (${n} - 2) \\cdot 180^\\circ = ${deg(S(n))}`,
				`${known.map(deg).join(' + ')} = ${deg(sum)}`,
				`${deg(S(n))} - ${deg(sum)} = ${deg(last)}`,
			],
			value: last,
			unit: 'deg',
			params: { case: kind, n: String(n), known: known.map(String), answer: String(last), mistakes: [n * 180 - sum, 360 - sum, (n - 1) * 180 - sum].map(String) },
		};
	}
}

const BUILDERS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function assemble(rng: Rng, level: number): Sample {
	const b = BUILDERS[level](rng);
	const answer = b.choice ?? { kind: 'number' as const, value: String(b.value) };
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: b.prompt,
		problem: textBlock(b.prose),
		solution: b.solution,
		steps: b.steps,
		answer,
		params: { ...b.params, ...(b.unit ? { unit: b.unit } : {}) },
	};
}

// ---------------------------------------------------------------------------
// Checks

const n = (x: unknown) => Number(x);

/** The answer recomputed from params, as a choice value or a number. */
function truth(sample: Sample): string | null {
	const p = sample.params;
	switch (sample.level) {
		case 1:
			if (p.case === 'trova') {
				const i = n(p.angle);
				const js = [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => pairType(i, k) === p.type);
				return js.length === 1 ? String(js[0]) : null;
			}
			return pairType(n(p.i), n(p.j));
		case 2: {
			const i = n(p.i), j = n(p.j), g = n(p.given);
			return String(sameClass(i, j) ? g : 180 - g);
		}
		case 3: {
			const ty = p.type as PairType;
			if (pairType(n(p.i), n(p.j)) !== ty) return null;
			const cong = CONGRUENT[ty];
			const par = cong ? n(p.p) === n(p.q) : n(p.p) + n(p.q) === 180;
			return par ? (cong ? 'si-congruenti' : 'si-supplementari') : cong ? 'no-congruenti' : 'no-supplementari';
		}
		case 4: {
			const cong = CONGRUENT[p.type as PairType];
			const a = n(p.a), b = n(p.b), c = n(p.c), d = n(p.d);
			const x = cong ? (d - b) / (a - c) : (180 - b - d) / (a + c);
			return Number.isInteger(x) ? String(x) : null;
		}
		case 5:
			switch (p.case) {
				case 'terzo':
					return String(180 - n(p.p) - n(p.q));
				case 'non-esiste':
					return n(p.p) + n(p.q) >= 180 ? 'none' : null;
				case 'base':
					return String((180 - n(p.vertex)) / 2);
				case 'vertice':
					return String(180 - 2 * n(p.base));
				case 'rettangolo':
					return String(90 - n(p.acute));
				case 'proporzione': {
					const ks = (p.ks as string[]).map(Number);
					const x = 180 / (ks[0] + ks[1] + ks[2]);
					return String((p.asked === 'maggiore' ? Math.max(...ks) : Math.min(...ks)) * x);
				}
			}
			return null;
		case 6: {
			const u = n(p.u), w = n(p.w), v = 180 - u - w;
			return String(p.case === 'da-interni' || p.case === 'adiacente' ? u + w : p.case === 'altro' ? w : v);
		}
		case 7:
			switch (p.case) {
				case 'somma':
					return String((n(p.n) - 2) * 180);
				case 'lati':
					return String(n(p.sum) / 180 + 2);
				case 'regolare':
					return String(((n(p.n) - 2) * 180) / n(p.n));
				case 'lati-regolare':
					return String(360 / (180 - n(p.angle)));
				case 'ultimo': {
					const k = (p.known as string[]).map(Number);
					return String((n(p.n) - 2) * 180 - k.reduce((s, x) => s + x, 0));
				}
			}
			return null;
	}
	return null;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const tr = truth(sample);
	if (tr === null) return ['risposta non ricalcolabile dai parametri'];
	const ans = sample.answer;
	if (ans.kind === 'choice') {
		const vals = ans.options.map((o) => o.values.join('|'));
		if (ans.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(vals).size !== vals.length) v.push('opzioni ripetute');
		if (vals[ans.correct] !== tr) v.push(`opzione giusta ${vals[ans.correct]}, attesa ${tr}`);
	} else if (ans.kind === 'number') {
		if (ans.value !== tr) v.push(`risposta ${ans.value}, attesa ${tr}`);
		if (!(Number(tr) > 0) || !Number.isInteger(Number(tr))) v.push('risposta non intera positiva');
	} else v.push('tipo di risposta inatteso');
	switch (sample.level) {
		case 1:
			if (p.case === 'posizione' && /\\hat\{\d\}/.test(sample.problem)) v.push('la descrizione a parole non usa i numeri');
			break;
		case 2: {
			const g = n(p.given), i = n(p.i);
			if ((i % 2 === 1) !== g < 90 || g < 15 || g > 165) v.push('angolo dato fuori dalla figura della lezione');
			break;
		}
		case 3:
			if (n(p.p) === 90 || n(p.q) === 90) v.push('angolo retto: congruenti e supplementari insieme');
			break;
		case 4: {
			const a = n(p.a), b = n(p.b), c = n(p.c), d = n(p.d), x = Number(tr);
			const v1 = a * x + b, v2 = c * x + d;
			if (v1 < 25 || v1 > 155 || v2 < 25 || v2 > 155 || v1 === 90) v.push('ampiezze fuori intervallo');
			if (Math.abs(b) > 100 || Math.abs(d) > 100 || x < 5 || x > 40) v.push('numeri troppo grandi');
			break;
		}
		case 5:
			if (p.case === 'terzo' && Number(tr) < 10) v.push('terzo angolo troppo piccolo');
			break;
		case 6: {
			const u = n(p.u), w = n(p.w);
			if (u < 15 || w < 15 || 180 - u - w < 15) v.push('angoli troppo piccoli');
			break;
		}
		case 7:
			if (p.case === 'ultimo') {
				const k = [...(p.known as string[]).map(Number), Number(tr)];
				if (k.some((x) => x >= 180 || x < 40)) v.push('poligono non convesso o angolo troppo piccolo');
			}
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: unexpected answer kind`);
	const p = sample.params;
	const unit = p.unit as Unit;
	const value = Number(sample.answer.value);
	const mistakes = ((p.mistakes as string[]) ?? []).map(Number);
	const cands: (ChoiceOption | null)[] = [];
	if (p.none === 'true') cands.push(NONE);
	// An angle is under 360°; a sum of angles (level 7) is a multiple of 180°.
	const isSum = unit === 'deg' && value >= 360;
	for (const m of mistakes) if (Number.isInteger(m) && m > 0 && m !== value && (unit !== 'deg' || isSum || m < 360)) cands.push(numOption(m, unit));
	const steps = isSum ? [180, 360, 540] : unit === 'deg' ? [10, 5, 20, 15] : [1, 2, 3, 4];
	for (const s of steps) for (const m of [value + s, value - s]) if (m > 0 && (unit !== 'n' || m >= 3)) cands.push(numOption(m, unit));
	return mustChoice(rng, numOption(value, unit), cands);
}

export const geometriaPerpendicolariParallele: Generator = {
	id: ID,
	title: 'Rette perpendicolari e parallele',
	levels: {
		1: { label: 'I nomi delle coppie di angoli', constraints: ['due rette e una trasversale, numerazione della lezione', 'dal numero o dalla posizione a parole al nome, o dal nome all\'angolo', 'solo le 12 coppie della tabella della lezione'] },
		2: { label: 'Gli otto angoli con due parallele', constraints: ['a ∥ b, un angolo dato tra 15° e 85° o il suo supplementare', 'angoli dispari acuti, pari ottusi, come nella figura della lezione'] },
		3: { label: 'Parallele o no', constraints: ['due angoli di una coppia con nome', 'parallele metà, trappola un quarto (alterni supplementari, coniugati congruenti), vicine un quarto', 'niente angoli retti'] },
		4: { label: "Le ampiezze con un'equazione", constraints: ['a ∥ b, due angoli con nome come (ax + b)°', 'x intero da 5 a 40, ampiezze da 25° a 155°'] },
		5: { label: 'Gli angoli del triangolo', constraints: ['terzo angolo, triangolo che non esiste, isoscele, rettangolo, angoli in proporzione', 'risposte intere'] },
		6: { label: "L'angolo esterno", constraints: ["l'esterno dai due interni, dall'interno adiacente, un interno dall'esterno", 'angoli interni di almeno 15°'] },
		7: { label: 'Gli angoli dei poligoni', constraints: ['somma, numero dei lati, poligono regolare, angolo mancante', 'n da 4 a 20, regolari con angolo intero'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!BUILDERS[level]) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 200; attempt++) {
			const sample = assemble(rng, level);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default geometriaPerpendicolariParallele;
