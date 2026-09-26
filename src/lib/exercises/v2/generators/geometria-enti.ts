/**
 * Enti geometrici, segmenti e angoli. Spec: specs/exercises/geometria-enti.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/58-geometria-enti.md), all on the text,
 * without figures: adjacent segments and midpoints, the kind of an angle from its measure, sums and
 * differences in degrees and minutes, complementary, supplementary and explementary angles, the same with
 * minutes, two intersecting lines and bisectors, and last the problems solved with an equation.
 *
 * Every exercise is built from the answer backwards, with small whole numbers as in the lesson's examples.
 * `params` hold the data as the text states them, so the checker (scripts/exercises/checkers/
 * geometria_enti.py) recomputes the answer on its own.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { assembleChoice, textBlock } from '../insiemi';

export const ID = 'geometria-enti';

const t = (s: string) => `\\text{${s}}`;

/** A finite decimal with the decimal comma: 6{,}5. */
function dec(r: Rational): string {
	let a = r.abs();
	let k = 0;
	while (!a.isInteger()) {
		a = a.mul(q(10));
		if (++k > 4) throw new Error(`dec: ${r.toString()} is not a finite decimal`);
	}
	const s = String(a.num).padStart(k + 1, '0');
	const body = k === 0 ? s : `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
	return (r.sign() < 0 ? '-' : '') + body;
}
const cm = (r: Rational) => `${dec(r)} \\text{ cm}`;
const deg = (n: number) => `${n}^\\circ`;
/** Degrees and minutes: 56^\circ 15'. Minutes 0 are left out. */
const dm = (d: number, m: number) => (m === 0 ? deg(d) : `${d}^\\circ ${m}'`);

const cmOption = (r: Rational): ChoiceOption => ({ latex: cm(r), values: [r.toString()] });
const degOption = (n: number): ChoiceOption => ({ latex: deg(n), values: [String(n)] });
const dmOption = (d: number, m: number): ChoiceOption => ({ latex: dm(d, m), values: [String(d), String(m)] });

function pickWeighted<T extends string>(rng: Rng, weights: Record<T, number>): T {
	const keys = Object.keys(weights) as T[];
	const total = keys.reduce((s, k) => s + weights[k], 0);
	let r = rng.next() * total;
	for (const k of keys) {
		r -= weights[k];
		if (r < 0) return k;
	}
	return keys[keys.length - 1];
}

function finish(rng: Rng, correct: ChoiceOption, distractors: ChoiceOption[]): ChoiceAnswer {
	const ch = assembleChoice(rng, correct, distractors, 4);
	if (!ch) throw new Error(`${ID}: not enough distractors`);
	return ch;
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	/** Number answer (levels with a length or a measure) or null when the answer is the choice. */
	value: Rational | null;
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: adjacent segments and midpoints (lesson, example 1 and the end of example 2)

export const SEGMENT_STORIES = ['mn', 'mc', 'an', 'mb'] as const;
type SegmentStory = (typeof SEGMENT_STORIES)[number];

/** Length options: the answer, then the mistakes, then lengths near it, always positive. */
function lengthChoice(rng: Rng, ans: Rational, mistakes: Rational[]): ChoiceAnswer {
	const near: Rational[] = [];
	for (let d = 1; d < 30; d++) near.push(ans.add(q(d)), ans.sub(q(d)));
	const ok = (r: Rational) => r.sign() > 0 && !r.equals(ans) && r.mul(q(2)).isInteger();
	return finish(rng, cmOption(ans), [...mistakes, ...near].filter(ok).map(cmOption));
}

function level1(rng: Rng): Built {
	const story = rng.pick(SEGMENT_STORIES) as SegmentStory;
	const half = (n: number) => q(n, 2);
	if (story === 'mb') {
		for (;;) {
			const s = rng.int(8, 30);
			const a = rng.int(1, s - 1);
			const ans = half(s).sub(q(a)).abs();
			if (ans.isZero() || ans.equals(q(a)) || ans.equals(q(s))) continue;
			const mBetween = q(a).compare(half(s)) > 0;
			const prose = `Il segmento $AC$ è lungo $${s}$ cm e il punto $B$ sta su $AC$, con $AB = ${a}$ cm. $M$ è il punto medio di $AC$. Quanto è lungo $MB$?`;
			const steps = [
				`AM = \\frac{AC}{2} = \\frac{${s}}{2} = ${cm(half(s))}`,
				mBetween
					? `${t('$B$ dista da $A$ più di $M$, quindi $M$ sta tra $A$ e $B$ e ')} MB = AB - AM`
					: `${t('$B$ dista da $A$ meno di $M$, quindi $B$ sta tra $A$ e $M$ e ')} MB = AM - AB`,
				mBetween ? `MB = ${a} - ${dec(half(s))} = ${cm(ans)}` : `MB = ${dec(half(s))} - ${a} = ${cm(ans)}`,
			];
			const mistakes = [q(s - a), half(s), half(a), half(s).add(q(a)), half(s - a)];
			return {
				prompt: 'Calcola la lunghezza del segmento.',
				problem: textBlock(prose),
				solution: `MB = ${cm(ans)}`,
				steps,
				value: ans,
				choice: lengthChoice(rng, ans, mistakes),
				params: { story, AC: String(s), AB: String(a) },
			};
		}
	}
	for (;;) {
		const a = rng.int(2, 20);
		const b = rng.int(2, 20);
		if (a === b) continue;
		const intro = `I segmenti $AB$ e $BC$ sono adiacenti, con $AB = ${a}$ cm e $BC = ${b}$ cm.`;
		let prose: string, ans: Rational, mistakes: Rational[], steps: string[], name: string;
		if (story === 'mn') {
			name = 'MN';
			ans = half(a + b);
			prose = `${intro} $M$ è il punto medio di $AB$ e $N$ è il punto medio di $BC$. Quanto è lungo $MN$?`;
			steps = [
				`${t('Tra $M$ e $N$ c\'è il punto $B$, quindi ')} MN = MB + BN`,
				`MB = \\frac{${a}}{2} = ${cm(half(a))} \\qquad BN = \\frac{${b}}{2} = ${cm(half(b))}`,
				`MN = ${dec(half(a))} + ${dec(half(b))} = ${cm(ans)}`,
			];
			mistakes = [q(a + b), half(a).add(q(b)), q(a).add(half(b)), half(Math.abs(a - b))];
		} else if (story === 'mc') {
			name = 'MC';
			ans = half(a).add(q(b));
			prose = `${intro} $M$ è il punto medio di $AB$. Quanto è lungo $MC$?`;
			steps = [
				`${t('Tra $M$ e $C$ c\'è il punto $B$, quindi ')} MC = MB + BC`,
				`MB = \\frac{${a}}{2} = ${cm(half(a))}`,
				`MC = ${dec(half(a))} + ${b} = ${cm(ans)}`,
			];
			mistakes = [q(a + b), half(a + b), half(a), q(a).add(half(b))];
		} else {
			name = 'AN';
			ans = q(a).add(half(b));
			prose = `${intro} $N$ è il punto medio di $BC$. Quanto è lungo $AN$?`;
			steps = [
				`${t('Tra $A$ e $N$ c\'è il punto $B$, quindi ')} AN = AB + BN`,
				`BN = \\frac{${b}}{2} = ${cm(half(b))}`,
				`AN = ${a} + ${dec(half(b))} = ${cm(ans)}`,
			];
			mistakes = [q(a + b), half(a + b), half(b), half(a).add(q(b))];
		}
		if (ans.equals(q(a)) || ans.equals(q(b))) continue;
		return {
			prompt: 'Calcola la lunghezza del segmento.',
			problem: textBlock(prose),
			solution: `${name} = ${cm(ans)}`,
			steps,
			value: ans,
			choice: lengthChoice(rng, ans, mistakes),
			params: { story, AB: String(a), BC: String(b) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the kind of an angle from its measure (the table of the lesson)

export const KINDS = ['nullo', 'acuto', 'retto', 'ottuso', 'piatto', 'concavo', 'giro'] as const;
type Kind = (typeof KINDS)[number];
const KIND_WEIGHTS: Record<Kind, number> = { nullo: 6, acuto: 22, retto: 10, ottuso: 22, piatto: 10, concavo: 20, giro: 10 };

export function kindOf(m: number): Kind {
	if (m === 0) return 'nullo';
	if (m < 90) return 'acuto';
	if (m === 90) return 'retto';
	if (m < 180) return 'ottuso';
	if (m === 180) return 'piatto';
	if (m < 360) return 'concavo';
	return 'giro';
}

const KIND_RULE: Record<Kind, string> = {
	nullo: `${t('Un angolo nullo misura ')} 0^\\circ`,
	acuto: `${t('Un angolo acuto misura tra ')} 0^\\circ ${t(' e ')} 90^\\circ`,
	retto: `${t('Un angolo retto misura ')} 90^\\circ`,
	ottuso: `${t('Un angolo ottuso misura tra ')} 90^\\circ ${t(' e ')} 180^\\circ`,
	piatto: `${t('Un angolo piatto misura ')} 180^\\circ`,
	concavo: `${t('Un angolo concavo misura tra ')} 180^\\circ ${t(' e ')} 360^\\circ`,
	giro: `${t('Un angolo giro misura ')} 360^\\circ`,
};

const kindOption = (k: Kind): ChoiceOption => ({ latex: t(k), values: [k] });

function level2(rng: Rng): Built {
	const kind = pickWeighted(rng, KIND_WEIGHTS);
	const m = { nullo: 0, acuto: rng.int(1, 89), retto: 90, ottuso: rng.int(91, 179), piatto: 180, concavo: rng.int(181, 359), giro: 360 }[kind];
	// \widehat{AOB} alone is the convex angle (lesson): the concave angle and the full angle get a Greek letter.
	const names = m <= 180 ? ['\\widehat{AOB}', '\\widehat{COD}', '\\widehat{PQR}', '\\alpha', '\\beta', '\\gamma'] : ['\\alpha', '\\beta', '\\gamma'];
	const name = rng.pick(names);
	const prose = `L'angolo $${name}$ misura $${deg(m)}$. Che tipo di angolo è?`;
	// Distractors: the kinds next to the answer in the table first (acuto and ottuso around retto, ottuso next to concavo).
	const i = KINDS.indexOf(kind);
	const others = KINDS.filter((k) => k !== kind)
		.map((k) => ({ k, d: Math.abs(KINDS.indexOf(k) - i) + rng.next() * 0.5 }))
		.sort((x, y) => x.d - y.d)
		.map((x) => kindOption(x.k));
	const cmpSteps =
		kind === 'acuto'
			? `0^\\circ < ${deg(m)} < 90^\\circ`
			: kind === 'ottuso'
				? `90^\\circ < ${deg(m)} < 180^\\circ`
				: kind === 'concavo'
					? `180^\\circ < ${deg(m)} < 360^\\circ`
					: `${name} = ${deg(m)}`;
	return {
		prompt: 'Riconosci il tipo di angolo.',
		problem: textBlock(prose),
		solution: `${name} ${t(` è un angolo ${kind}`)}`,
		steps: [KIND_RULE[kind], `${cmpSteps} ${t(`, quindi $${name}$ è un angolo ${kind}`)}`],
		value: null,
		choice: finish(rng, kindOption(kind), others),
		params: { name, measure: String(m), case: kind },
	};
}

// ---------------------------------------------------------------------------
// Level 3: sums and differences in degrees and minutes (example 3), always with a carry or a borrow

function dmNear(d: number, m: number): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	for (const [dd, mm] of [
		[1, 0],
		[-1, 0],
		[0, 10],
		[0, -10],
		[1, 10],
		[-1, -10],
		[0, 5],
		[0, -5],
		[2, 0],
		[-2, 0],
	])
		if (d + dd > 0 && m + mm > 0 && m + mm < 60) out.push(dmOption(d + dd, m + mm));
	return out;
}

function level3(rng: Rng): Built {
	const kase = rng.int(0, 1) === 0 ? 'somma' : 'differenza';
	if (kase === 'somma') {
		for (;;) {
			const g1 = rng.int(10, 80), g2 = rng.int(10, 80);
			const p1 = rng.int(10, 59), p2 = rng.int(10, 59);
			const ps = p1 + p2;
			if (ps <= 60) continue;
			const d = g1 + g2 + 1, m = ps - 60;
			const mistakes = [dmOption(g1 + g2, ps), dmOption(g1 + g2, m), ...(ps >= 100 ? [dmOption(d, ps - 100)] : []), dmOption(d, ps)];
			return {
				prompt: 'Calcola e scrivi il risultato in gradi e primi.',
				problem: `${dm(g1, p1)} + ${dm(g2, p2)}`,
				solution: dm(d, m),
				steps: [
					`${t('Somma i gradi con i gradi e i primi con i primi: ')} ${dm(g1 + g2, ps)}`,
					`${t('I primi sono più di 59: ')} ${ps}' = 60' + ${m}' = 1^\\circ ${m}'`,
					`${dm(g1 + g2, ps)} = ${dm(d, m)}`,
				],
				value: null,
				choice: finish(rng, dmOption(d, m), [...mistakes.filter((o) => o.latex !== dm(d, m)), ...dmNear(d, m)]),
				params: { case: kase, g1: String(g1), p1: String(p1), g2: String(g2), p2: String(p2) },
			};
		}
	}
	for (;;) {
		const A = rng.int(30, 150);
		const B = rng.int(5, A - 2);
		const a = rng.int(1, 57);
		const b = rng.int(a + 1, 59);
		const d = A - B - 1, m = a + 60 - b;
		const mistakes = [dmOption(A - B, m), dmOption(A - B, b - a), dmOption(d, a + 100 - b)];
		return {
			prompt: 'Calcola e scrivi il risultato in gradi e primi.',
			problem: `${dm(A, a)} - ${dm(B, b)}`,
			solution: dm(d, m),
			steps: [
				`${t(`I primi non bastano, perché $${a}' < ${b}'$: prendi in prestito un grado, `)} ${dm(A, a)} = ${dm(A - 1, a + 60)}`,
				`${dm(A - 1, a + 60)} - ${dm(B, b)} = ${dm(d, m)}`,
				`${t('Controllo: ')} ${dm(d, m)} + ${dm(B, b)} = ${dm(d + B, m + b)} = ${dm(A, a)}`,
			],
			value: null,
			choice: finish(rng, dmOption(d, m), [...mistakes, ...dmNear(d, m)]),
			params: { case: kase, g1: String(A), p1: String(a), g2: String(B), p2: String(b) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: complementary, supplementary and explementary angles, whole degrees

export const TARGETS = { complementare: 90, supplementare: 180, esplementare: 360 } as const;
type Target = keyof typeof TARGETS;
const TARGET_WEIGHTS: Record<Target, number> = { complementare: 35, supplementare: 40, esplementare: 25 };
const PAIR_WORD: Record<Target, string> = { complementare: 'complementari', supplementare: 'supplementari', esplementare: 'esplementari' };
const TARGET_NAME: Record<Target, string> = { complementare: 'un angolo retto', supplementare: 'un angolo piatto', esplementare: 'un angolo giro' };

function level4(rng: Rng): Built {
	const kase = pickWeighted(rng, TARGET_WEIGHTS);
	const T = TARGETS[kase];
	for (;;) {
		const a = rng.int(5, T - 5);
		const ans = T - a;
		if (ans === a) continue;
		const art = kase === 'esplementare' ? "l'" : 'il ';
		const phrasing = rng.int(0, 1) === 0 ? 'trova' : 'coppia';
		const prose =
			phrasing === 'trova'
				? `Trova ${art}${kase} di un angolo di $${deg(a)}$.`
				: `Gli angoli $\\alpha$ e $\\beta$ sono ${PAIR_WORD[kase]} e $\\alpha = ${deg(a)}$. Quanto misura $\\beta$?`;
		const mistakes = [90 - a, 180 - a, 360 - a, T + a, ans + 10, ans - 10].filter((n) => n > 0 && n !== ans);
		const near: number[] = [];
		for (let d = 1; d < 30; d++) near.push(ans + d, ans - d);
		return {
			prompt: "Calcola la misura dell'angolo.",
			problem: textBlock(prose),
			solution: phrasing === 'trova' ? deg(ans) : `\\beta = ${deg(ans)}`,
			steps: [
				`${t(`Due angoli ${PAIR_WORD[kase]} sommano a ${TARGET_NAME[kase]}, cioè a `)} ${deg(T)}`,
				`${deg(T)} - ${deg(a)} = ${deg(ans)}`,
				`${t('Controllo: ')} ${deg(ans)} + ${deg(a)} = ${deg(T)}`,
			],
			value: q(ans),
			choice: finish(rng, degOption(ans), [...mistakes, ...near].filter((n) => n > 0 && n !== ans).map(degOption)),
			params: { case: kase, angle: String(a), phrasing },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the same with minutes (example 4): 90° = 89°60'

function level5(rng: Rng): Built {
	const kase = pickWeighted(rng, TARGET_WEIGHTS);
	const T = TARGETS[kase];
	const B = rng.int(2, T - 3);
	const b = rng.int(1, 59);
	const d = T - 1 - B, m = 60 - b;
	const art = kase === 'esplementare' ? "l'" : 'il ';
	const prose = `Trova ${art}${kase} di un angolo di $${dm(B, b)}$.`;
	const mistakes = [dmOption(T - B, m), dmOption(d, 100 - b), dmOption(T - B, b)];
	for (const other of Object.values(TARGETS)) if (other !== T && other - 1 - B > 0) mistakes.push(dmOption(other - 1 - B, m));
	return {
		prompt: 'Calcola e scrivi il risultato in gradi e primi.',
		problem: textBlock(prose),
		solution: dm(d, m),
		steps: [
			`${t(`Due angoli ${PAIR_WORD[kase]} sommano a `)} ${deg(T)}${t(': per sottrarre i primi scrivi ')} ${deg(T)} = ${dm(T - 1, 60)}`,
			`${dm(T - 1, 60)} - ${dm(B, b)} = ${dm(d, m)}`,
			`${t('Controllo: ')} ${dm(d, m)} + ${dm(B, b)} = ${dm(T - 1, 60)} = ${deg(T)}`,
		],
		value: null,
		choice: finish(rng, dmOption(d, m), [...mistakes, ...dmNear(d, m)]),
		params: { case: kase, deg: String(B), min: String(b) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: two intersecting lines and bisectors (examples 6 and 7)

export const LINE_CASES = ['opposto', 'adiacente', 'bisettrici-adiacenti', 'bisettrici-consecutivi'] as const;
type LineCase = (typeof LINE_CASES)[number];
const GREEK = ['\\alpha', '\\beta', '\\gamma', '\\delta'];

function degreeChoice(rng: Rng, ans: number, mistakes: number[]): ChoiceAnswer {
	const near: number[] = [];
	for (let d = 1; d < 40; d++) near.push(ans + d * 5, ans - d * 5, ans + d, ans - d);
	return finish(rng, degOption(ans), [...mistakes, ...near].filter((n) => Number.isInteger(n) && n > 0 && n !== ans && n <= 360).map(degOption));
}

function level6(rng: Rng): Built {
	const kase = rng.pick(LINE_CASES) as LineCase;
	const prompt = "Calcola la misura dell'angolo.";
	if (kase === 'opposto' || kase === 'adiacente') {
		for (;;) {
			const a = rng.int(20, 160);
			if (a === 90) continue;
			const gi = rng.int(0, 3);
			const ai = kase === 'opposto' ? (gi + 2) % 4 : (gi + rng.pick([1, 3])) % 4;
			const g = GREEK[gi], s = GREEK[ai];
			const ans = kase === 'opposto' ? a : 180 - a;
			const prose = `Due rette incidenti in $O$ formano quattro angoli, $\\alpha$, $\\beta$, $\\gamma$ e $\\delta$, uno dopo l'altro intorno a $O$. Se $${g} = ${deg(a)}$, quanto misura $${s}$?`;
			const steps =
				kase === 'opposto'
					? [`${g} ${t(' e ')} ${s} ${t(' non sono uno accanto all\'altro: sono opposti al vertice, quindi congruenti')}`, `${s} = ${g} = ${deg(a)}`]
					: [`${g} ${t(' e ')} ${s} ${t(' sono uno accanto all\'altro: sono adiacenti, quindi supplementari')}`, `${s} = 180^\\circ - ${deg(a)} = ${deg(ans)}`];
			return {
				prompt,
				problem: textBlock(prose),
				solution: `${s} = ${deg(ans)}`,
				steps,
				value: q(ans),
				choice: degreeChoice(rng, ans, [kase === 'opposto' ? 180 - a : a, 360 - a, 90 - a, a - 90, 360 - 2 * a]),
				params: { case: kase, given: g, asked: s, angle: String(a) },
			};
		}
	}
	if (kase === 'bisettrici-adiacenti') {
		for (;;) {
			const a = 2 * rng.int(10, 80);
			if (a === 90) continue;
			const b = 180 - a;
			const prose = `Gli angoli $\\widehat{AOB}$ e $\\widehat{BOC}$ sono adiacenti e $\\widehat{AOB} = ${deg(a)}$. Quanto misura l'angolo formato dalle loro bisettrici?`;
			return {
				prompt,
				problem: textBlock(prose),
				solution: deg(90),
				steps: [
					`${t('Gli angoli adiacenti sono supplementari: ')} \\widehat{BOC} = 180^\\circ - ${deg(a)} = ${deg(b)}`,
					`${t('Le bisettrici li dividono a metà: ')} \\frac{${deg(a)}}{2} = ${deg(a / 2)} \\qquad \\frac{${deg(b)}}{2} = ${deg(b / 2)}`,
					`${t("L'angolo tra le bisettrici è una metà più l'altra: ")} ${deg(a / 2)} + ${deg(b / 2)} = 90^\\circ`,
				],
				value: q(90),
				choice: degreeChoice(rng, 90, [180, a / 2, b / 2, b, 45]),
				params: { case: kase, a: String(a) },
			};
		}
	}
	for (;;) {
		const a = 2 * rng.int(5, 70);
		const b = 2 * rng.int(5, 70);
		if (a === b || a + b >= 180) continue;
		const ans = (a + b) / 2;
		const prose = `Gli angoli consecutivi $\\widehat{AOB}$ e $\\widehat{BOC}$ misurano $${deg(a)}$ e $${deg(b)}$. Quanto misura l'angolo formato dalle loro bisettrici?`;
		return {
			prompt,
			problem: textBlock(prose),
			solution: deg(ans),
			steps: [
				`${t('Le bisettrici li dividono a metà: ')} \\frac{${deg(a)}}{2} = ${deg(a / 2)} \\qquad \\frac{${deg(b)}}{2} = ${deg(b / 2)}`,
				`${t("L'angolo tra le bisettrici è una metà più l'altra: ")} ${deg(a / 2)} + ${deg(b / 2)} = ${deg(ans)}`,
			],
			value: q(ans),
			choice: degreeChoice(rng, ans, [a + b, Math.abs(a - b) / 2, 90, a / 2 + b, a + b / 2]),
			params: { case: kase, a: String(a), b: String(b) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: problems solved with an equation (examples 2 and 5)

export const PROBLEM_STORIES = ['segmento-rapporto', 'segmento-differenza', 'angoli-rapporto', 'angoli-differenza', 'angolo-multiplo'] as const;
type ProblemStory = (typeof PROBLEM_STORIES)[number];
export const TIMES: Record<number, string> = { 2: 'doppio', 3: 'triplo', 4: 'quadruplo', 5: 'quintuplo', 6: 'sestuplo', 7: 'settuplo', 10: 'decuplo' };
const PAIRS = { complementari: 90, supplementari: 180, adiacenti: 180 } as const;
type Pair = keyof typeof PAIRS;

function level7(rng: Rng): Built {
	const story = rng.pick(PROBLEM_STORIES) as ProblemStory;
	const prompt = "Risolvi il problema con un'equazione.";
	if (story === 'segmento-rapporto') {
		const k = rng.int(2, 5);
		const x = rng.int(2, 15);
		const s = (k + 1) * x;
		const ask = rng.pick(['AB', 'BC']);
		const ans = ask === 'AB' ? k * x : x;
		const prose = `Il segmento $AC$ è lungo $${s}$ cm e il punto $B$ lo divide in due parti, con $AB$ ${TIMES[k]} di $BC$. Quanto è lungo $${ask}$?`;
		const equation = `${k}x + x = ${s}`;
		return {
			prompt,
			problem: textBlock(prose),
			solution: `${ask} = ${ans} \\text{ cm}`,
			steps: [
				`${t('Chiama $x$ la lunghezza di $BC$ in centimetri: allora ')} AB = ${k}x`,
				`${t('$AB$ e $BC$ sono adiacenti e la loro somma è $AC$: ')} ${equation}`,
				`${k + 1}x = ${s}`,
				`x = ${x}`,
				`BC = ${x} \\text{ cm} \\qquad AB = ${k} \\cdot ${x} = ${k * x} \\text{ cm}`,
				`${t('Controllo: ')} ${k * x} + ${x} = ${s}`,
			],
			value: q(ans),
			choice: lengthChoice(rng, q(ans), [q(ask === 'AB' ? x : k * x), q(s, k), q(s).sub(q(s, k)), q(s, 2)].filter((r) => r.isInteger())),
			params: { story, AC: String(s), k: String(k), ask, equation, x: String(x) },
		};
	}
	if (story === 'segmento-differenza') {
		for (;;) {
			const x = rng.int(2, 20);
			const d = rng.int(1, 15);
			if (d === x) continue;
			const s = 2 * x + d;
			const ask = rng.pick(['AB', 'BC']);
			const ans = ask === 'AB' ? x + d : x;
			const prose = `Il segmento $AC$ è lungo $${s}$ cm e il punto $B$ lo divide in due parti, con $AB$ più lungo di $BC$ di $${d}$ cm. Quanto è lungo $${ask}$?`;
			const equation = `x + ${d} + x = ${s}`;
			return {
				prompt,
				problem: textBlock(prose),
				solution: `${ask} = ${ans} \\text{ cm}`,
				steps: [
					`${t('Chiama $x$ la lunghezza di $BC$ in centimetri: allora ')} AB = x + ${d}`,
					`${t('$AB$ e $BC$ sono adiacenti e la loro somma è $AC$: ')} ${equation}`,
					`2x + ${d} = ${s}`,
					`2x = ${s - d}`,
					`x = ${x}`,
					`BC = ${x} \\text{ cm} \\qquad AB = ${x} + ${d} = ${x + d} \\text{ cm}`,
					`${t('Controllo: ')} ${x + d} + ${x} = ${s}`,
				],
				value: q(ans),
				choice: lengthChoice(rng, q(ans), [q(ask === 'AB' ? x : x + d), q(s - d), q(s, 2), q(s + d, 2), q(s - d, 2)].filter((r) => r.isInteger())),
				params: { story, AC: String(s), d: String(d), ask, equation, x: String(x) },
			};
		}
	}
	if (story === 'angoli-rapporto') {
		for (;;) {
			const pair = rng.pick(Object.keys(PAIRS)) as Pair;
			const T = PAIRS[pair];
			const k = rng.int(2, 5);
			if (T % (k + 1) !== 0) continue;
			const x = T / (k + 1);
			const ask = rng.pick(['maggiore', 'minore']);
			const ans = ask === 'maggiore' ? k * x : x;
			const prose = `Due angoli ${pair} sono uno il ${TIMES[k]} dell'altro. Quanto misura il ${ask}?`;
			const equation = `${k}x + x = ${T}`;
			return {
				prompt,
				problem: textBlock(prose),
				solution: deg(ans),
				steps: [
					`${t('Chiama $x$ la misura in gradi del minore: il maggiore misura ')} ${k}x`,
					`${t(pair === 'complementari' ? 'Due angoli complementari sommano a ' : pair === 'supplementari' ? 'Due angoli supplementari sommano a ' : 'Due angoli adiacenti sono supplementari e sommano a ')} ${deg(T)}${t(': ')} ${equation}`,
					`${k + 1}x = ${T}`,
					`x = ${x}`,
					`${t('Il minore misura ')} ${deg(x)}${t(', il maggiore ')} ${k} \\cdot ${deg(x)} = ${deg(k * x)}`,
					`${t('Controllo: ')} ${deg(k * x)} + ${deg(x)} = ${deg(T)}`,
				],
				value: q(ans),
				choice: degreeChoice(rng, ans, [ask === 'maggiore' ? x : k * x, T / k, T - T / k, T / 2, (180 + 90 - T) / (k + 1)].filter((n) => Number.isInteger(n))),
				params: { story, pair, k: String(k), ask, equation, x: String(x) },
			};
		}
	}
	if (story === 'angoli-differenza') {
		for (;;) {
			const pair = rng.pick(Object.keys(PAIRS)) as Pair;
			const T = PAIRS[pair];
			const x = rng.int(5, T / 2 - 2);
			const d = T - 2 * x;
			if (d === x || d > 150) continue;
			const ask = rng.pick(['maggiore', 'minore']);
			const ans = ask === 'maggiore' ? x + d : x;
			const prose = `Due angoli ${pair} differiscono di $${deg(d)}$. Quanto misura il ${ask}?`;
			const equation = `x + ${d} + x = ${T}`;
			return {
				prompt,
				problem: textBlock(prose),
				solution: deg(ans),
				steps: [
					`${t('Chiama $x$ la misura in gradi del minore: il maggiore misura ')} x + ${d}`,
					`${t(pair === 'complementari' ? 'Due angoli complementari sommano a ' : pair === 'supplementari' ? 'Due angoli supplementari sommano a ' : 'Due angoli adiacenti sono supplementari e sommano a ')} ${deg(T)}${t(': ')} ${equation}`,
					`2x + ${d} = ${T}`,
					`2x = ${T - d}`,
					`x = ${x}`,
					`${t('Il minore misura ')} ${deg(x)}${t(', il maggiore ')} ${deg(x)} + ${deg(d)} = ${deg(x + d)}`,
					`${t('Controllo: ')} ${deg(x + d)} + ${deg(x)} = ${deg(T)}`,
				],
				value: q(ans),
				choice: degreeChoice(rng, ans, [ask === 'maggiore' ? x : x + d, T - d, (T + d) / 2, (T - d) / 2, T / 2].filter((n) => Number.isInteger(n))),
				params: { story, pair, d: String(d), ask, equation, x: String(x) },
			};
		}
	}
	// angolo-multiplo: the supplementary is k times the complementary (example 5), or k times the angle, or the
	// complementary is k times the angle.
	const form = rng.pick(['sup-comp', 'sup-angolo', 'comp-angolo']);
	let k: number, x: number, prose: string, equation: string, work: string[], check: string, mistakes: number[];
	if (form === 'sup-comp') {
		k = rng.pick([3, 4, 6, 7, 10]);
		x = (90 * (k - 2)) / (k - 1);
		prose = `Trova l'angolo acuto il cui supplementare è il ${TIMES[k]} del suo complementare.`;
		equation = `180 - x = ${k}(90 - x)`;
		work = [`180 - x = ${90 * k} - ${k}x`, `${k}x - x = ${90 * k} - 180`, `${k - 1}x = ${90 * k - 180}`, `x = ${x}`];
		check = `${t('Controllo: il supplementare è ')} ${deg(180 - x)}${t(', il complementare è ')} ${deg(90 - x)}${t(' e ')} ${180 - x} = ${k} \\cdot ${90 - x}`;
		mistakes = [180 / (k + 1), 90 / (k + 1), 90 - x, 180 - x, 90 / (k - 1)];
	} else if (form === 'sup-angolo') {
		k = rng.pick([2, 3, 4, 5]);
		x = 180 / (k + 1);
		prose = `Trova l'angolo il cui supplementare è il ${TIMES[k]} dell'angolo stesso.`;
		equation = `180 - x = ${k}x`;
		work = [`${k + 1}x = 180`, `x = ${x}`];
		check = `${t('Controllo: il supplementare è ')} ${deg(180 - x)} ${t(' e ')} ${180 - x} = ${k} \\cdot ${x}`;
		mistakes = [180 / k, 90 / (k + 1), 180 - x, 90 - x];
	} else {
		k = rng.pick([2, 4, 5]);
		x = 90 / (k + 1);
		prose = `Trova l'angolo il cui complementare è il ${TIMES[k]} dell'angolo stesso.`;
		equation = `90 - x = ${k}x`;
		work = [`${k + 1}x = 90`, `x = ${x}`];
		check = `${t('Controllo: il complementare è ')} ${deg(90 - x)} ${t(' e ')} ${90 - x} = ${k} \\cdot ${x}`;
		mistakes = [90 / k, 180 / (k + 1), 90 - x, 180 - x];
	}
	return {
		prompt,
		problem: textBlock(prose),
		solution: deg(x),
		steps: [
			`${t("Chiama $x$ la misura dell'angolo in gradi: ")} ${form === 'sup-comp' ? '0 < x < 90' : form === 'sup-angolo' ? '0 < x < 180' : '0 < x < 90'}`,
			`${t(form === 'sup-comp' ? 'Il supplementare misura $180 - x$ e il complementare $90 - x$: ' : form === 'sup-angolo' ? 'Il supplementare misura $180 - x$: ' : 'Il complementare misura $90 - x$: ')} ${equation}`,
			...work,
			check,
		],
		value: q(x),
		choice: degreeChoice(rng, x, mistakes.filter((n) => Number.isInteger(n))),
		params: { story, form, k: String(k), equation, x: String(x) },
	};
}

// ---------------------------------------------------------------------------

const BUILDERS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };
/** Levels whose answer is the choice itself: the kind of an angle and the degrees with minutes. */
const CHOICE_LEVELS = new Set([2, 3, 5]);

function generateLevel(rng: Rng, level: number): Sample {
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = BUILDERS[level](rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: CHOICE_LEVELS.has(level) ? b.choice : { kind: 'number', value: (b.value as Rational).toString() },
			params: b.params,
		};
		if (!CHOICE_LEVELS.has(level)) sample.choice = b.choice;
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const lvl = sample.level;
	const ch = CHOICE_LEVELS.has(lvl) ? (sample.answer as ChoiceAnswer) : sample.choice;
	if (!ch || ch.kind !== 'choice' || ch.options.length !== 4) return ['servono quattro opzioni'];
	const keys = ch.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== 4 || new Set(ch.options.map((o) => o.latex)).size !== 4) v.push('opzioni ripetute');
	if (!CHOICE_LEVELS.has(lvl)) {
		const val = (sample.answer as { value: string }).value;
		if (keys[ch.correct] !== val) v.push('opzione giusta sbagliata');
		if (Rational.parse(val).sign() <= 0) v.push('la risposta non è positiva');
	}
	if (lvl === 3 || lvl === 5) {
		const [d, m] = ch.options[ch.correct].values.map(Number);
		if (!(m > 0 && m < 60 && d > 0)) v.push('risultato in gradi e primi non finito');
	}
	if (/—|piuttosto che/.test(sample.problem)) v.push('parole vietate nel testo');
	return v;
}

export const geometriaEnti: Generator = {
	id: ID,
	title: 'Enti geometrici, segmenti e angoli',
	levels: {
		1: { label: 'Segmenti adiacenti e punto medio', constraints: ['AB e BC adiacenti da 2 a 20 cm, oppure AC fino a 30 cm con B sopra', 'si chiede MN, MC, AN o MB: risposta intera o con ,5'] },
		2: { label: 'Che tipo di angolo è', constraints: ['nullo, acuto, retto, ottuso, piatto, concavo, giro dalla misura in gradi interi', 'distrattori: i tipi vicini nella tabella'] },
		3: { label: 'Gradi e primi', constraints: ['somma con riporto dei primi o differenza con prestito di un grado', 'risultato con i primi tra 1 e 59'] },
		4: { label: 'Complementare, supplementare, esplementare', constraints: ['gradi interi, angolo diverso dalla risposta', 'distrattori: gli altri due, la somma al posto della differenza'] },
		5: { label: 'Complementare e supplementare con i primi', constraints: ['90° = 89°60′, 180° = 179°60′, 360° = 359°60′', 'distrattori: grado non tolto, prestito di 100 primi'] },
		6: { label: 'Rette incidenti e bisettrici', constraints: ['quattro angoli di due rette incidenti: opposto o adiacente', 'angolo tra le bisettrici di angoli adiacenti o consecutivi'] },
		7: { label: "Problemi con un'equazione", constraints: ['segmento diviso con un rapporto o una differenza', "coppie di angoli con rapporto o differenza, l'angolo il cui supplementare è k volte il complementare"] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!BUILDERS[level]) throw new Error(`${ID}: unknown level ${level}`);
		return generateLevel(rng, level);
	},
	check,
	toChoice(sample: Sample): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (sample.choice) return sample.choice;
		throw new Error(`${ID}: sample without choice`);
	},
};

export default geometriaEnti;
