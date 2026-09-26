/**
 * Problemi con le equazioni. Spec: specs/exercises/equazioni-problemi.md
 *
 * Seven levels in the order of the lesson's worked examples, each a new kind of problem: numbers and
 * ages (the order of the words, even and odd numbers, "anni fa"), geometry (the area asked after the
 * side, x^2 that cancels), percentages one after the other, motion, mixtures, work (the answer in
 * hours and minutes) and, last, the limitations of the unknown: is the solution acceptable?
 *
 * Every story is built backwards: the value of the unknown first, then the data of the text. `params`
 * hold the data as the text states them, so the checker (scripts/exercises/checkers/
 * equazioni_problemi.py) rebuilds the equation from the story and solves it on its own.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, lcm, q } from '../rational';
import { assembleChoice, numberOption, textBlock } from '../insiemi';

export const ID = 'equazioni-problemi';

const NAMES_F = ['Giulia', 'Sara', 'Chiara', 'Marta', 'Anna', 'Elena', 'Sofia', 'Laura', 'Francesca', 'Alice', 'Beatrice', 'Irene'];
const NAMES_M = ['Luca', 'Marco', 'Paolo', 'Pietro', 'Davide', 'Matteo', 'Tommaso', 'Giorgio', 'Lorenzo', 'Filippo', 'Riccardo', 'Nicola'];
const TIMES: Record<number, string> = { 2: 'doppio', 3: 'triplo', 4: 'quadruplo', 5: 'quintuplo' };
const PART: Record<number, string> = { 2: 'metà', 3: 'terza parte' };
const NUM_WORD: Record<number, string> = { 2: 'due', 3: 'tre' };

export const STORIES: Record<number, readonly string[]> = {
	1: ['ordine', 'pari-dispari', 'somma-due', 'eta-fa', 'eta-somma'],
	2: ['rettangolo-area', 'isoscele', 'quadrato', 'rettangolo-cambia'],
	3: ['sconto', 'resto', 'aumento', 'parti'],
	4: ['incontro', 'inseguimento', 'andata-ritorno'],
	5: ['miscela', 'aggiunta', 'diluizione'],
	6: ['insieme', 'svuota', 'dopo'],
	7: ['consecutivi', 'eta', 'rettangolo', 'miscela', 'divisione'],
};

const t = (s: string) => `\\text{${s}}`;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const pctProse = (p: number) => `$${p}\\%$`;

/** A finite decimal as LaTeX with the decimal comma: 0{,}25, 1{,}2, -3. */
export function dec(r: Rational): string {
	let a = r.abs();
	let k = 0;
	while (!a.isInteger()) {
		a = a.mul(q(10));
		if (++k > 6) throw new Error(`dec: ${r.toString()} is not a finite decimal`);
	}
	const s = String(a.num).padStart(k + 1, '0');
	const body = k === 0 ? s : `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
	return (r.sign() < 0 ? '-' : '') + body;
}
/** Coefficient times a variable, never 1x: x, -x, 3x, 0{,}8x. */
const cx = (r: Rational | number, v = 'x') => {
	const c = typeof r === 'number' ? q(r) : r;
	return c.isOne() ? v : c.equals(q(-1)) ? `-${v}` : `${dec(c)}${v}`;
};
/** A rational as LaTeX: 12, -\frac{1}{2}. */
const rl = (r: Rational) => r.toLatex();

function pickName(rng: Rng, not: string[] = []): { name: string; f: boolean } {
	for (;;) {
		const f = rng.int(0, 1) === 1;
		const name = rng.pick(f ? NAMES_F : NAMES_M);
		if (!not.includes(name)) return { name, f };
	}
}

interface Problem {
	story: string;
	data: Record<string, string | number>;
	prose: string;
	/** What x (or t) is, with its limitations. */
	unknown: string;
	equation: string;
	/** Equivalent equations after the translation; the last one is `x = …`. */
	work: string[];
	v: string;
	x: Rational;
	/** Normal form a·x = b. */
	normal: [Rational, Rational];
	/** The number asked (minutes for level 6); null when the problem is impossible (level 7). */
	answer: Rational | null;
	toAnswer?: string[];
	/** The check on the text, or the reason the solution is rejected. */
	check: string;
	solution: string;
	/** Numbers written in the text: the answer must not be one of them. */
	given: number[];
	/** Wrong answers from real mistakes, in order of preference, in the unit of the answer. */
	mistakes: Rational[];
	/** Level 6: unit of the times in the text. */
	unit?: 'h' | 'min';
}

/** `x = value` as the last line of the work, with the division shown when it is not immediate. */
function solveLine(a: Rational, b: Rational, v = 'x'): string[] {
	const x = b.div(a);
	if (a.isOne()) return [];
	if (a.isInteger() && b.isInteger()) return [`${v} = ${rl(x)}`];
	return [`${v} = \\frac{${dec(b)}}{${dec(a)}} = ${rl(x)}`];
}
const normalLine = (a: Rational, b: Rational, v = 'x') => `${cx(a, v)} = ${a.isInteger() && b.isInteger() ? b.num : dec(b)}`;

// ---------------------------------------------------------------------------
// Level 1: numbers and ages

type OrderForm = 'kpiu' | 'piuk' | 'kmeno' | 'menok' | 'metapiu' | 'piumeta';
const ORDER_FORMS: OrderForm[] = ['kpiu', 'piuk', 'kmeno', 'menok', 'metapiu', 'piumeta'];

/** The expression of the form, as a function of x, for the other reading of the same words. */
export function orderValue(form: OrderForm, k: number, c: number, x: Rational): Rational {
	switch (form) {
		case 'kpiu':
			return x.add(q(c)).mul(q(k));
		case 'piuk':
			return x.mul(q(k)).add(q(c));
		case 'kmeno':
			return x.sub(q(c)).mul(q(k));
		case 'menok':
			return x.mul(q(k)).sub(q(c));
		case 'metapiu':
			return x.add(q(c)).div(q(k));
		case 'piumeta':
			return x.div(q(k)).add(q(c));
	}
}
const OTHER_READING: Record<OrderForm, OrderForm> = { kpiu: 'piuk', piuk: 'kpiu', kmeno: 'menok', menok: 'kmeno', metapiu: 'piumeta', piumeta: 'metapiu' };

function ordine(rng: Rng): Problem {
	for (;;) {
		const form = rng.pick(ORDER_FORMS);
		const half = form === 'metapiu' || form === 'piumeta';
		const k = half ? rng.pick([2, 3]) : rng.int(2, 5);
		const c = rng.int(2, 12);
		const x = rng.int(3, 30);
		const Rv = orderValue(form, k, c, q(x));
		if (!Rv.isInteger() || Rv.num < 2 || Rv.num > 200) continue;
		const Rn = Rv.num;
		const phrase = {
			kpiu: `il ${TIMES[k]} della somma di un numero e ${c}`,
			piuk: `la somma del ${TIMES[k]} di un numero e ${c}`,
			kmeno: `il ${TIMES[k]} della differenza tra un numero e ${c}`,
			menok: `la differenza tra il ${TIMES[k]} di un numero e ${c}`,
			metapiu: `la ${PART[k]} della somma di un numero e ${c}`,
			piumeta: `la somma della ${PART[k]} di un numero e ${c}`,
		}[form];
		const eq = {
			kpiu: `${k}(x + ${c}) = ${Rn}`,
			piuk: `${k}x + ${c} = ${Rn}`,
			kmeno: `${k}(x - ${c}) = ${Rn}`,
			menok: `${k}x - ${c} = ${Rn}`,
			metapiu: `\\frac{x + ${c}}{${k}} = ${Rn}`,
			piumeta: `\\frac{x}{${k}} + ${c} = ${Rn}`,
		}[form];
		let work: string[];
		let a: number, b: number;
		switch (form) {
			case 'kpiu':
				[a, b] = [k, Rn - k * c];
				work = [`${k}x + ${k * c} = ${Rn}`, `${k}x = ${b}`];
				break;
			case 'piuk':
				[a, b] = [k, Rn - c];
				work = [`${k}x = ${b}`];
				break;
			case 'kmeno':
				[a, b] = [k, Rn + k * c];
				work = [`${k}x - ${k * c} = ${Rn}`, `${k}x = ${b}`];
				break;
			case 'menok':
				[a, b] = [k, Rn + c];
				work = [`${k}x = ${b}`];
				break;
			case 'metapiu':
				[a, b] = [1, k * Rn - c];
				work = [`x + ${c} = ${k * Rn}`];
				break;
			case 'piumeta':
				[a, b] = [1, k * (Rn - c)];
				work = [`\\frac{x}{${k}} = ${Rn - c}`];
				break;
		}
		work.push(`x = ${x}`);
		// The other reading of the same words, solved: kpiu read as piuk and so on.
		const other = OTHER_READING[form];
		const wrong = {
			kpiu: q(Rn - c, k),
			piuk: q(Rn, k).sub(q(c)),
			kmeno: q(Rn + c, k),
			menok: q(Rn, k).add(q(c)),
			metapiu: q(k * (Rn - c)),
			piumeta: q(k * Rn - c),
		}[form];
		if (!orderValue(other, k, c, wrong).equals(Rv)) throw new Error('ordine: wrong reading');
		return {
			story: 'ordine',
			data: { form, k, c, R: Rn },
			prose: `${cap(phrase)} è ${Rn}. Qual è il numero?`,
			unknown: `${t('Chiama ')} x ${t(' il numero. Leggi la frase dalla fine: ')} ${eq.split(' = ')[0]}`,
			equation: eq,
			work,
			v: 'x',
			x: q(x),
			normal: [q(a), q(b)],
			answer: q(x),
			check: `${
				{
					kpiu: `${k} \\cdot (${x} + ${c})`,
					piuk: `${k} \\cdot ${x} + ${c}`,
					kmeno: `${k} \\cdot (${x} - ${c})`,
					menok: `${k} \\cdot ${x} - ${c}`,
					metapiu: `\\frac{${x} + ${c}}{${k}}`,
					piumeta: `\\frac{${x}}{${k}} + ${c}`,
				}[form]
			} = ${Rn}`,
			solution: `${t('Il numero è ')} ${x}`,
			given: [k, c, Rn],
			mistakes: [wrong, q(Rn, k), q(Rn - c), q(x * k)],
		};
	}
}

function pariDispari(rng: Rng): Problem {
	const kind = rng.pick(['pari', 'dispari'] as const);
	const n = rng.pick([2, 3]);
	const off = kind === 'pari' ? 0 : 1;
	const x = rng.int(5, 49);
	const nums = Array.from({ length: n }, (_, i) => 2 * x + off + 2 * i);
	const S = nums.reduce((s, v) => s + v, 0);
	const shift = S - 2 * n * x;
	const asked = rng.pick(['piccolo', 'grande'] as const);
	const answer = asked === 'piccolo' ? nums[0] : nums[n - 1];
	const terms = nums.map((_, i) => {
		const k = off + 2 * i;
		return k === 0 ? '2x' : `(2x + ${k})`;
	});
	const eq = `${terms.join(' + ')} = ${S}`;
	const askedTerm = asked === 'piccolo' ? (off === 0 ? '2x' : '2x + 1') : `2x + ${off + 2 * (n - 1)}`;
	return {
		story: 'pari-dispari',
		data: { kind, n, S, asked },
		prose: `La somma di ${NUM_WORD[n]} numeri ${kind} consecutivi è ${S}. Qual è il più ${asked} dei ${NUM_WORD[n]} numeri?`,
		unknown: `${t('Chiama ')} x ${t(' un numero naturale: i numeri sono ')} ${nums.map((_, i) => (off + 2 * i === 0 ? '2x' : `2x + ${off + 2 * i}`)).join(',\\ ')}`,
		equation: eq,
		work: [`${2 * n}x + ${shift} = ${S}`, `${2 * n}x = ${S - shift}`, `x = ${x}`],
		v: 'x',
		x: q(x),
		normal: [q(2 * n), q(S - shift)],
		answer: q(answer),
		toAnswer: [`${t(`Il più ${asked} è `)} ${askedTerm} = ${answer}`],
		check: `${nums.join(' + ')} = ${S}`,
		solution: `${t(`Il più ${asked} è `)} ${answer}`,
		given: [S],
		// stopping at x; the number at the other end; consecutive numbers instead of even or odd
		mistakes: [q(x), q(asked === 'piccolo' ? nums[n - 1] : nums[0]), q(S - (n * (n - 1)) / 2, n), ...(n === 3 ? [q(nums[1])] : [])],
	};
}

function sommaDue(rng: Rng): Problem {
	for (;;) {
		const k = rng.int(2, 4);
		const rel = rng.pick(['A', 'B'] as const);
		const x = rng.int(5, 40);
		const d = rng.int(1, 20);
		// A: k·smaller = larger + d; B: larger = k·smaller + d.
		const y = rel === 'A' ? k * x - d : k * x + d;
		const S = x + y;
		if (y <= x || S > 200) continue;
		const asked = rng.pick(['piccolo', 'grande'] as const);
		const answer = asked === 'piccolo' ? x : y;
		const relText = rel === 'A' ? `il ${TIMES[k]} del più piccolo supera di ${d} il più grande` : `il più grande supera di ${d} il ${TIMES[k]} del più piccolo`;
		const eq = rel === 'A' ? `${k}x = ${S} - x + ${d}` : `${S} - x = ${k}x + ${d}`;
		const work = rel === 'A' ? [`${k}x + x = ${S} + ${d}`, `${k + 1}x = ${S + d}`, `x = ${x}`] : [`-x - ${k}x = ${d} - ${S}`, `-${k + 1}x = ${d - S}`, `x = ${x}`];
		const normal: [Rational, Rational] = rel === 'A' ? [q(k + 1), q(S + d)] : [q(-(k + 1)), q(d - S)];
		// "chi supera chi": the excess on the wrong side
		const swapped = rel === 'A' ? q(S - d, k + 1) : q(S + d, k + 1);
		const swappedAns = asked === 'piccolo' ? swapped : q(S).sub(swapped);
		return {
			story: 'somma-due',
			data: { rel, k, d, S, asked },
			prose: `La somma di due numeri naturali è ${S}, e ${relText}. Qual è il più ${asked} dei due numeri?`,
			unknown: `${t('Chiama ')} x ${t(' il più piccolo: il più grande è ')} ${S} - x`,
			equation: eq,
			work,
			v: 'x',
			x: q(x),
			normal,
			answer: q(answer),
			toAnswer: asked === 'grande' ? [`${t('Il più grande è ')} ${S} - ${x} = ${y}`] : undefined,
			check: rel === 'A' ? `${k} \\cdot ${x} = ${k * x} = ${y} + ${d}` : `${y} = ${k} \\cdot ${x} + ${d}`,
			solution: `${t(`Il più ${asked} è `)} ${answer}`,
			given: [k, d, S],
			mistakes: [q(asked === 'piccolo' ? y : x), swappedAns, q(S, 2), asked === 'grande' ? q(x) : q(y + d)],
		};
	}
}

function parentChild(rng: Rng): { P: string; C: string; rel: string } {
	const parent = pickName(rng);
	const child = pickName(rng, [parent.name]);
	return { P: parent.name, C: child.name, rel: child.f ? 'sua figlia' : 'suo figlio' };
}

function etaFa(rng: Rng): Problem {
	for (;;) {
		const k = rng.int(3, 5);
		const c = rng.int(4, 16);
		const x = rng.int(1, c - 1);
		const p = x + k * (c - x);
		if (p - c < 20 || p - c > 45 || p > 65) continue;
		const { P, C, rel } = parentChild(rng);
		const work = [`${p} - x = ${k * c} - ${k}x`, `-x + ${k}x = ${k * c} - ${p}`, `${k - 1}x = ${k * c - p}`];
		if (k - 1 !== 1) work.push(`x = ${x}`);
		return {
			story: 'eta-fa',
			data: { k, parent: p, child: c, P, C },
			prose: `Oggi ${P} ha ${p} anni e ${rel} ${C} ne ha ${c}. Quanti anni fa ${P} aveva il ${TIMES[k]} degli anni di ${C}?`,
			unknown: `${t('Chiama ')} x ${t(' il numero di anni fa, con ')} 0 < x < ${c}${t(`: allora ${P} aveva `)} ${p} - x ${t(` anni e ${C} `)} ${c} - x`,
			equation: `${p} - x = ${k}(${c} - x)`,
			work,
			v: 'x',
			x: q(x),
			normal: [q(k - 1), q(k * c - p)],
			answer: q(x),
			check: `${t(`${x} anni fa ${P} aveva `)} ${p - x} ${t(` anni e ${C} `)} ${c - x}${t(', e ')} ${k} \\cdot ${c - x} = ${p - x}`,
			solution: t(`${x} ann${x === 1 ? 'o' : 'i'} fa`),
			given: [k, p, c],
			// the parent goes back and the child stays; the ages then instead of the years; no division
			mistakes: [q(p - k * c), q(c - x), q(p - x), q(k * c - p), q(x + 1)],
		};
	}
}

function etaSomma(rng: Rng): Problem {
	for (;;) {
		const x = rng.int(3, 18);
		const d = rng.int(22, 40);
		const when = rng.pick(['tra', 'fa'] as const);
		const n = rng.int(2, 12);
		if (x + d > 60 || (when === 'fa' && n >= x) || d <= 2 * n) continue;
		const S = when === 'tra' ? 2 * x + d + 2 * n : 2 * x + d - 2 * n;
		const { P, C, rel } = parentChild(rng);
		const askChild = rng.int(0, 1) === 1;
		const answer = askChild ? x : x + d;
		const sgn = when === 'tra' ? '+' : '-';
		const k0 = when === 'tra' ? d + 2 * n : d - 2 * n;
		const whenText = when === 'tra' ? `Tra ${n} anni la somma delle loro età sarà ${S}.` : `${n} anni fa la somma delle loro età era ${S}.`;
		return {
			story: 'eta-somma',
			data: { when, n, d, S, P, C, asked: askChild ? 'figlio' : 'genitore' },
			prose: `${P} ha ${d} anni più di ${rel} ${C}. ${whenText} Quanti anni ha oggi ${askChild ? C : P}?`,
			unknown: `${t('Chiama ')} x ${t(` l'età di ${C} oggi, con `)} x > ${when === 'fa' ? n : 0}${t(`: ${P} ha `)} x + ${d}${t(`. ${when === 'tra' ? `Tra ${n} anni avranno` : `${n} anni fa avevano`} `)} x ${sgn} ${n} ${t(' e ')} x + ${d} ${sgn} ${n}`,
			equation: `(x ${sgn} ${n}) + (x + ${d} ${sgn} ${n}) = ${S}`,
			work: [`2x + ${k0} = ${S}`, `2x = ${S - k0}`, `x = ${x}`],
			v: 'x',
			x: q(x),
			normal: [q(2), q(S - k0)],
			answer: q(answer),
			toAnswer: askChild ? undefined : [`${t(`${P} ha `)} x + ${d} = ${x + d} ${t(' anni')}`],
			check: `(${x} ${sgn} ${n}) + (${x + d} ${sgn} ${n}) = ${when === 'tra' ? x + n : x - n} + ${when === 'tra' ? x + d + n : x + d - n} = ${S}`,
			solution: t(`${askChild ? C : P} ha ${answer} anni`),
			given: [n, d, S],
			// time passing for one person only; time forgotten; the other person; the age then
			mistakes: [
				askChild ? q(when === 'tra' ? S - n - d : S + n - d, 2) : q(when === 'tra' ? S - n - d : S + n - d, 2).add(q(d)),
				askChild ? q(S - d, 2) : q(S - d, 2).add(q(d)),
				q(askChild ? x + d : x),
				q(when === 'tra' ? answer + n : answer - n),
			],
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: geometry

const sq = (u: string) => `$\\text{${u}}^2$`;

const RECT_NOUNS = [
	{ noun: 'un foglio rettangolare', of: 'del foglio', u: 'cm', h: [5, 25], maxB: 45 },
	{ noun: "un'aiuola rettangolare", of: "dell'aiuola", u: 'm', h: [2, 12], maxB: 30 },
	{ noun: 'un tavolo rettangolare', of: 'del tavolo', u: 'cm', h: [40, 90], maxB: 200 },
	{ noun: 'un cortile rettangolare', of: 'del cortile', u: 'm', h: [6, 30], maxB: 60 },
];

function rettangoloArea(rng: Rng): Problem {
	const ci = rng.int(0, RECT_NOUNS.length - 1);
	const ctx = RECT_NOUNS[ci];
	for (;;) {
		const rel = rng.pick(['piu', 'volte', 'doppiopiu'] as const);
		const x = rng.int(ctx.h[0], ctx.h[1]);
		const d = rng.int(2, Math.max(3, Math.floor(ctx.h[1] / 2)));
		const k = rng.pick([2, 3]);
		const b = rel === 'piu' ? x + d : rel === 'volte' ? k * x : 2 * x + d;
		if (b > ctx.maxB) continue;
		const P = 2 * (x + b);
		const A = x * b;
		const u = ctx.u;
		const relText = rel === 'piu' ? `la base supera l'altezza di ${d} ${u}` : rel === 'volte' ? `la base è il ${TIMES[k]} dell'altezza` : `la base supera di ${d} ${u} il doppio dell'altezza`;
		const bx = rel === 'piu' ? `x + ${d}` : rel === 'volte' ? `${k}x` : `2x + ${d}`;
		const a = rel === 'piu' ? 4 : rel === 'volte' ? 2 * k + 2 : 6;
		const c0 = rel === 'volte' ? 0 : 2 * d;
		const work = [c0 ? `${a}x + ${c0} = ${P}` : `${a}x = ${P}`, ...(c0 ? [`${a}x = ${P - c0}`] : []), `x = ${x}`];
		// the perimeter taken as base plus height
		const half = rel === 'volte' ? q(P, k + 1) : q(P - d, rel === 'piu' ? 2 : 3);
		const halfB = rel === 'piu' ? half.add(q(d)) : rel === 'volte' ? half.mul(q(k)) : half.mul(q(2)).add(q(d));
		return {
			story: 'rettangolo-area',
			data: rel === 'volte' ? { context: ci, rel, k, P } : { context: ci, rel, d, P },
			prose: `Il perimetro di ${ctx.noun} è ${P} ${u}, e ${relText}. Calcola l'area ${ctx.of}, in ${sq(u)}.`,
			unknown: `${t('Chiama ')} x ${t(` l'altezza, in ${u}, con `)} x > 0${t(': la base è ')} ${bx}`,
			equation: `2(x + ${bx}) = ${P}`,
			work,
			v: 'x',
			x: q(x),
			normal: [q(a), q(P - c0)],
			answer: q(A),
			toAnswer: [`${t("L'altezza è ")} ${x} ${t(' e la base ')} ${b}${t(": l'area è ")} ${b} \\cdot ${x} = ${A}`],
			check: `2 \\cdot (${x} + ${b}) = ${P}`,
			solution: `${t("L'area è ")} ${A}\\ \\text{${u}}^2`,
			given: rel === 'volte' ? [k, P] : [d, P],
			// stopping at x; the base; the semiperimeter mistake; a square with the same perimeter
			mistakes: [q(x), q(b), half.mul(halfB), q(P * P, 16), q(x + b)],
		};
	}
}

function isoscele(rng: Rng): Problem {
	for (;;) {
		const rel = rng.pick(['base', 'lato'] as const);
		const x = rng.int(4, 40);
		const d = rng.int(2, 20);
		const leg = rel === 'base' ? x : x + d;
		const base = rel === 'base' ? x + d : x;
		if (base >= 2 * leg || base + 2 * leg > 150) continue;
		const P = base + 2 * leg;
		const asked = rng.pick(['base', 'lato'] as const);
		const answer = asked === 'base' ? base : leg;
		const relText = rel === 'base' ? `la base supera di ${d} cm ciascun lato obliquo` : `ciascun lato obliquo supera di ${d} cm la base`;
		const eq = rel === 'base' ? `2x + (x + ${d}) = ${P}` : `x + 2(x + ${d}) = ${P}`;
		const work = rel === 'base' ? [`3x + ${d} = ${P}`, `3x = ${P - d}`, `x = ${x}`] : [`x + 2x + ${2 * d} = ${P}`, `3x = ${P - 2 * d}`, `x = ${x}`];
		const other = rel === 'base' ? 'x + ' + d : 'x + ' + d;
		const toAnswer = (rel === 'base') === (asked === 'base') ? [`${t(asked === 'base' ? 'La base è ' : 'Il lato obliquo è ')} ${other} = ${answer}`] : undefined;
		// each oblique side counted once
		const once = q(P - d, 2);
		const onceAns = (rel === 'base') === (asked === 'base') ? once.add(q(d)) : once;
		return {
			story: 'isoscele',
			data: { rel, d, P, asked },
			prose: `Un triangolo isoscele ha il perimetro di ${P} cm, e ${relText}. Quanto misura ${asked === 'base' ? 'la base' : 'ciascun lato obliquo'}?`,
			unknown: `${t('Chiama ')} x ${t(rel === 'base' ? ' il lato obliquo, in cm: la base è ' : ' la base, in cm: ciascun lato obliquo è ')} x + ${d}`,
			equation: eq,
			work,
			v: 'x',
			x: q(x),
			normal: [q(3), q(rel === 'base' ? P - d : P - 2 * d)],
			answer: q(answer),
			toAnswer,
			check: `${base} + 2 \\cdot ${leg} = ${P}`,
			solution: t(`${asked === 'base' ? 'La base' : 'Ciascun lato obliquo'} misura ${answer} cm`),
			given: [d, P],
			mistakes: [q(asked === 'base' ? leg : base), onceAns, q(P, 3), q(P - d, 3)],
		};
	}
}

function quadrato(rng: Rng): Problem {
	const u = rng.pick(['cm', 'm']);
	for (;;) {
		const dir = rng.pick(['allunga', 'accorcia'] as const);
		const a = rng.int(1, 6);
		const x = rng.int(a + 2, 25);
		const D = dir === 'allunga' ? 2 * a * x + a * a : 2 * a * x - a * a;
		const asked = rng.pick(['lato', 'nuovo'] as const);
		const nuovo = dir === 'allunga' ? x + a : x - a;
		const answer = asked === 'lato' ? x : nuovo;
		const s = dir === 'allunga' ? '+' : '-';
		const eq = `(x ${s} ${a})^2 = x^2 ${s} ${D}`;
		const work =
			dir === 'allunga'
				? [`x^2 + ${2 * a}x + ${a * a} = x^2 + ${D}`, `${2 * a}x = ${D} - ${a * a}`, `${2 * a}x = ${D - a * a}`, `x = ${x}`]
				: [`x^2 - ${2 * a}x + ${a * a} = x^2 - ${D}`, `-${2 * a}x = -${D} - ${a * a}`, `-${2 * a}x = ${-D - a * a}`, `x = ${x}`];
		const verb = dir === 'allunga' ? 'allunghi' : 'accorci';
		const change = dir === 'allunga' ? 'aumenta' : 'diminuisce';
		// the square of the binomial without the double product is (x + a)^2 = x^2 + a^2; the last term forgotten; the sign of a^2
		const noSq = q(D, 2 * a);
		const wrongSign = q(dir === 'allunga' ? D + a * a : D - a * a, 2 * a);
		const toNew = (v: Rational) => (asked === 'lato' ? v : dir === 'allunga' ? v.add(q(a)) : v.sub(q(a)));
		return {
			story: 'quadrato',
			data: { dir, a, D, u, asked },
			prose: `Se ${verb} di ${a} ${u} il lato di un quadrato, la sua area ${change} di ${D} ${sq(u)}. Quanto è lungo il lato del quadrato ${asked === 'lato' ? 'di partenza' : dir === 'allunga' ? 'allungato' : 'accorciato'}?`,
			unknown: `${t('Chiama ')} x ${t(` il lato di partenza, in ${u}, con `)} x > ${dir === 'allunga' ? 0 : a}${t(': il lato nuovo è ')} x ${s} ${a}`,
			equation: eq,
			work,
			v: 'x',
			x: q(x),
			normal: dir === 'allunga' ? [q(2 * a), q(D - a * a)] : [q(-2 * a), q(-D - a * a)],
			answer: q(answer),
			toAnswer: asked === 'nuovo' ? [`${t('Il lato nuovo è ')} x ${s} ${a} = ${nuovo}`] : undefined,
			check: `${nuovo}^2 - ${x}^2 = ${nuovo * nuovo} - ${x * x} = ${dir === 'allunga' ? D : -D}`,
			solution: t(`Il lato è lungo ${answer} ${u}`),
			given: [a, D],
			mistakes: [q(asked === 'lato' ? nuovo : x), toNew(noSq), toNew(wrongSign), q(D, a)],
		};
	}
}

function rettangoloCambia(rng: Rng): Problem {
	for (;;) {
		const x = rng.int(4, 25);
		const d = rng.int(2, 15);
		const e = rng.int(1, 4);
		const a = rng.int(e + 1, 9);
		const D = (a - e) * x - e * (d + a);
		if (D === 0 || Math.abs(D) > 150 || x <= e) continue;
		const asked = rng.pick(['altezza', 'base'] as const);
		const answer = asked === 'altezza' ? x : x + d;
		const s = D > 0 ? '+' : '-';
		const eq = `(x + ${d + a})(x - ${e}) = x(x + ${d}) ${s} ${Math.abs(D)}`;
		const work = [`x^2 - ${cx(e)} + ${d + a}x - ${e * (d + a)} = x^2 + ${d}x ${s} ${Math.abs(D)}`, `-${cx(e)} + ${d + a}x - ${d}x = ${D} + ${e * (d + a)}`, `${cx(a - e)} = ${D + e * (d + a)}`];
		if (a - e !== 1) work.push(`x = ${x}`);
		// the product -e·(d + a) forgotten
		const noProd = q(D, a - e);
		return {
			story: 'rettangolo-cambia',
			data: { d, a, e, D, asked },
			prose: `In un rettangolo la base supera l'altezza di ${d} cm. Se allunghi la base di ${a} cm e accorci l'altezza di ${e} cm, l'area ${D > 0 ? 'aumenta' : 'diminuisce'} di ${Math.abs(D)} ${sq('cm')}. Quanto misura ${asked === 'altezza' ? "l'altezza" : 'la base'} del rettangolo?`,
			unknown: `${t('Chiama ')} x ${t(" l'altezza, in cm, con ")} x > ${e}${t(': la base è ')} x + ${d}${t(', la base nuova ')} x + ${d + a} ${t(" e l'altezza nuova ")} x - ${e}`,
			equation: eq,
			work,
			v: 'x',
			x: q(x),
			normal: [q(a - e), q(D + e * (d + a))],
			answer: q(answer),
			toAnswer: asked === 'base' ? [`${t('La base è ')} x + ${d} = ${x + d}`] : undefined,
			check: `${x + d + a} \\cdot ${x - e} - ${x + d} \\cdot ${x} = ${(x + d + a) * (x - e)} - ${(x + d) * x} = ${D}`,
			solution: t(`${asked === 'altezza' ? "L'altezza" : 'La base'} misura ${answer} cm`),
			given: [d, a, e, Math.abs(D)],
			mistakes: [q(asked === 'altezza' ? x + d : x), asked === 'altezza' ? noProd : noProd.add(q(d)), q(asked === 'altezza' ? x - e : x + d + a), q(Math.abs(D), a)],
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: percentages

const PCT = (p: number) => q(p, 100);

const SALE_ITEMS = [
	{ item: 'un giubbotto', the: 'il giubbotto', agr: 'scontato', price: [40, 200] },
	{ item: 'uno zaino', the: 'lo zaino', agr: 'scontato', price: [20, 90] },
	{ item: 'una borsa', the: 'la borsa', agr: 'scontata', price: [30, 150] },
	{ item: 'una felpa', the: 'la felpa', agr: 'scontata', price: [20, 80] },
];
const SALE_EXTRAS = ['una sciarpa', 'un paio di calzini', 'un portachiavi', 'un cappellino'];

function sconto(rng: Rng): Problem {
	const ci = rng.int(0, SALE_ITEMS.length - 1);
	const ctx = SALE_ITEMS[ci];
	for (;;) {
		const p = rng.pick([10, 15, 20, 25, 30, 40, 50]);
		const x = rng.int(ctx.price[0], ctx.price[1]);
		if ((x * (100 - p)) % 100 !== 0) continue;
		const paid = (x * (100 - p)) / 100;
		const e = rng.int(3, 25);
		const T = paid + e;
		const ei = rng.int(0, SALE_EXTRAS.length - 1);
		const { name } = pickName(rng);
		const f = PCT(p), keep = PCT(100 - p);
		return {
			story: 'sconto',
			data: { context: ci, extra: ei, p, e, T, name },
			prose: `${name} compra ${ctx.item} ${ctx.agr} del ${pctProse(p)} e ${SALE_EXTRAS[ei]} da ${e} euro, e spende in tutto ${T} euro. Quanto costava ${ctx.the} prima dello sconto?`,
			unknown: `${t('Chiama ')} x ${t(` il prezzo prima dello sconto, in euro, con `)} x > 0${t(': lo sconto è ')} ${cx(f)}`,
			equation: `x - ${cx(f)} + ${e} = ${T}`,
			work: [`${cx(keep)} + ${e} = ${T}`, normalLine(keep, q(T - e)), ...solveLine(keep, q(T - e))],
			v: 'x',
			x: q(x),
			normal: [keep, q(T - e)],
			answer: q(x),
			check: `${x} - ${dec(f)} \\cdot ${x} + ${e} = ${x} - ${x - paid} + ${e} = ${T}`,
			solution: t(`${cap(ctx.the)} costava ${x} euro`),
			given: [p, e, T],
			// the discounted price; the percentage added back; the extra forgotten; the discount itself
			mistakes: [q(paid), q(paid).mul(q(100 + p, 100)), q(T).div(keep), q(x - paid), q(T - e).mul(q(100 + p, 100)).add(q(e))],
		};
	}
}

const REST_CTX = [
	{
		prose: (N: string, p1: number, p2: number, Rr: number) =>
			`${N} spende il ${pctProse(p1)} dei suoi risparmi per un libro e poi il ${pctProse(p2)} di quello che gli resta per un gioco. Alla fine ha ancora ${Rr} euro. Quanto aveva all'inizio?`,
		unit: 'euro',
		what: 'i risparmi iniziali, in euro',
		answer: (x: number) => `All'inizio aveva ${x} euro`,
	},
	{
		prose: (N: string, p1: number, p2: number, Rr: number) =>
			`Un contadino vende al mercato il ${pctProse(p1)} delle sue mele e poi il ${pctProse(p2)} di quelle rimaste a un negozio. Gli restano ${Rr} kg di mele. Quanti chili di mele aveva?`,
		unit: 'kg',
		what: 'i chili di mele iniziali',
		answer: (x: number) => `Aveva ${x} kg di mele`,
	},
	{
		prose: (N: string, p1: number, p2: number, Rr: number) =>
			`In un viaggio ${N} percorre il primo giorno il ${pctProse(p1)} del percorso e il secondo giorno il ${pctProse(p2)} della strada che resta. Gli mancano ancora ${Rr} km. Quanto è lungo il percorso?`,
		unit: 'km',
		what: 'la lunghezza del percorso, in km',
		answer: (x: number) => `Il percorso è lungo ${x} km`,
	},
];

function resto(rng: Rng): Problem {
	const ci = rng.int(0, REST_CTX.length - 1);
	const ctx = REST_CTX[ci];
	const name = rng.pick(NAMES_M);
	for (;;) {
		const p1 = rng.pick([10, 20, 25, 30, 40, 50, 60]);
		const p2 = rng.pick([10, 20, 25, 30, 40, 50, 60, 75]);
		const x = rng.int(4, 100) * 10;
		if ((x * p1) % 100 !== 0) continue;
		const left1 = (x * (100 - p1)) / 100;
		if ((left1 * p2) % 100 !== 0) continue;
		const Rr = (left1 * (100 - p2)) / 100;
		if (Rr < 5) continue;
		const f1 = PCT(p1), f2 = PCT(p2), k1 = PCT(100 - p1);
		const second = f2.mul(k1);
		const final = k1.sub(second);
		return {
			story: 'resto',
			data: { context: ci, p1, p2, R: Rr, name },
			prose: ctx.prose(name, p1, p2, Rr),
			unknown: `${t('Chiama ')} x ${t(` ${ctx.what}, con `)} x > 0${t(': dopo la prima parte resta ')} ${cx(k1)}`,
			equation: `x - ${cx(f1)} - ${dec(f2)} \\cdot ${cx(k1)} = ${Rr}`,
			work: [`${cx(k1)} - ${cx(second)} = ${Rr}`, normalLine(final, q(Rr)), ...solveLine(final, q(Rr))],
			v: 'x',
			x: q(x),
			normal: [final, q(Rr)],
			answer: q(x),
			check: `${x} - ${(x * p1) / 100} = ${left1},\\ ${left1} - ${(left1 * p2) / 100} = ${Rr}`,
			solution: t(ctx.answer(x)),
			given: [p1, p2, Rr],
			// the percentages added; the second one only; the first part
			mistakes: [...(p1 + p2 < 100 ? [q(Rr * 100, 100 - p1 - p2)] : []), q(Rr * 100, 100 - p2), q(left1), q((x * p1) / 100)],
		};
	}
}

const RISE_CTX = [
	{ item: 'una bicicletta', the: 'la bicicletta', verb: 'costava', unit: 'euro' },
	{ item: 'un telefono', the: 'il telefono', verb: 'costava', unit: 'euro' },
	{ item: "l'abbonamento annuale a una palestra", the: "l'abbonamento", verb: 'costava', unit: 'euro' },
];

function aumento(rng: Rng): Problem {
	const ci = rng.int(0, RISE_CTX.length - 1);
	const ctx = RISE_CTX[ci];
	for (;;) {
		const p = rng.pick([10, 20, 25, 50]);
		const d = rng.pick([10, 20, 25, 40, 50]);
		if (p === d) continue;
		const x = rng.int(4, 60) * 10;
		const up = (x * (100 + p)) / 100;
		if (!Number.isInteger(up) || (up * d) % 100 !== 0) continue;
		const F = (up * (100 - d)) / 100;
		if (F === x) continue;
		const fp = PCT(p), fd = PCT(d), k = PCT(100 + p);
		const final = k.mul(PCT(100 - d));
		const prose =
			ci === 2
				? `Il prezzo dell'abbonamento annuale a una palestra aumenta del ${pctProse(p)}; poi, con una promozione, cala del ${pctProse(d)}, e ora è ${F} euro. Quanto costava l'abbonamento prima dell'aumento?`
				: `Il prezzo di ${ctx.item} aumenta del ${pctProse(p)} e poi, durante i saldi, cala del ${pctProse(d)}: ora è ${F} euro. Quanto costava ${ctx.the} prima dell'aumento?`;
		return {
			story: 'aumento',
			data: { context: ci, p, d, F },
			prose,
			unknown: `${t('Chiama ')} x ${t(' il prezzo prima, in euro, con ')} x > 0${t(": dopo l'aumento è ")} ${cx(k)}`,
			equation: `x + ${cx(fp)} - ${dec(fd)} \\cdot ${cx(k)} = ${F}`,
			work: [`${cx(k)} - ${cx(fd.mul(k))} = ${F}`, normalLine(final, q(F)), ...solveLine(final, q(F))],
			v: 'x',
			x: q(x),
			normal: [final, q(F)],
			answer: q(x),
			check: `${x} + ${(x * p) / 100} = ${up},\\ ${up} - ${(up * d) / 100} = ${F}`,
			solution: t(`${cap(ctx.the)} costava ${x} euro`),
			given: [p, d, F],
			// the two percentages combined as one change; the price after the rise; the decrease undone only
			mistakes: [p !== d ? q(F * 100, 100 + p - d) : q(0), q(up), q(F * 100, 100 - d), q(F * (100 + d), 100)],
		};
	}
}

const PARTS_CTX = [
	{
		prose: (p1: number, p2: number, Rr: number, asked: string) =>
			`In una scuola il ${pctProse(p1)} degli studenti arriva in autobus, il ${pctProse(p2)} in bicicletta e gli altri ${Rr} a piedi. ${asked === 'totale' ? 'Quanti sono gli studenti della scuola?' : 'Quanti studenti arrivano in autobus?'}`,
		answer: (v: number, asked: string) => (asked === 'totale' ? `Gli studenti sono ${v}` : `In autobus arrivano ${v} studenti`),
		what: 'il numero degli studenti',
	},
	{
		prose: (p1: number, p2: number, Rr: number, asked: string) =>
			`In una biblioteca il ${pctProse(p1)} dei libri sono romanzi, il ${pctProse(p2)} sono fumetti e gli altri ${Rr} sono saggi. ${asked === 'totale' ? 'Quanti libri ci sono in tutto?' : 'Quanti sono i romanzi?'}`,
		answer: (v: number, asked: string) => (asked === 'totale' ? `I libri sono ${v}` : `I romanzi sono ${v}`),
		what: 'il numero dei libri',
	},
	{
		prose: (p1: number, p2: number, Rr: number, asked: string) =>
			`In un sondaggio il ${pctProse(p1)} dei ragazzi preferisce il gelato al cioccolato, il ${pctProse(p2)} quello alla fragola e gli altri ${Rr} quello al limone. ${asked === 'totale' ? 'Quanti ragazzi hanno risposto?' : 'Quanti preferiscono il cioccolato?'}`,
		answer: (v: number, asked: string) => (asked === 'totale' ? `Hanno risposto ${v} ragazzi` : `Preferiscono il cioccolato ${v} ragazzi`),
		what: 'il numero dei ragazzi',
	},
];

function parti(rng: Rng): Problem {
	const ci = rng.int(0, PARTS_CTX.length - 1);
	const ctx = PARTS_CTX[ci];
	for (;;) {
		const p1 = rng.int(3, 12) * 5;
		const p2 = rng.int(2, 10) * 5;
		const r = 100 - p1 - p2;
		if (r < 10 || p1 === p2) continue;
		const x = rng.int(4, 60) * 20;
		if ((x * p1) % 100 !== 0 || (x * p2) % 100 !== 0) continue;
		const Rr = (x * r) / 100;
		const g1 = (x * p1) / 100, g2 = (x * p2) / 100;
		const asked = rng.pick(['totale', 'primo'] as const);
		const answer = asked === 'totale' ? x : g1;
		const f1 = PCT(p1), f2 = PCT(p2), fr = PCT(r);
		return {
			story: 'parti',
			data: { context: ci, p1, p2, R: Rr, asked },
			prose: ctx.prose(p1, p2, Rr, asked),
			unknown: `${t('Chiama ')} x ${t(` ${ctx.what}, un intero positivo`)}`,
			equation: `x - ${cx(f1)} - ${cx(f2)} = ${Rr}`,
			work: [normalLine(fr, q(Rr)), ...solveLine(fr, q(Rr))],
			v: 'x',
			x: q(x),
			normal: [fr, q(Rr)],
			answer: q(answer),
			toAnswer: asked === 'primo' ? [`${dec(f1)} \\cdot ${x} = ${g1}`] : undefined,
			check: `${g1} + ${g2} + ${Rr} = ${x}`,
			solution: t(ctx.answer(answer, asked)),
			given: [p1, p2, Rr],
			// the other question; the second group; the rest divided by the known share
			mistakes: [q(asked === 'totale' ? g1 : x), q(g2), q(Rr * 100, p1 + p2), q(Rr + p1 + p2)],
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: motion. Speeds in km/h, times in hours in the equation, the answer in minutes or km.

const MEET_CTX = [
	{ a: "un'auto", b: 'un camion', A: "l'auto", v: [50, 110], step: 10, D: [60, 400] },
	{ a: 'un ciclista', b: 'una ciclista', A: 'il ciclista', v: [12, 30], step: 2, D: [10, 80] },
	{ a: 'Marco, a piedi,', b: 'Sara, a piedi,', A: 'Marco', v: [3, 6], step: 1, D: [3, 20] },
	{ a: 'un treno regionale', b: 'un treno merci', A: 'il treno regionale', v: [60, 120], step: 10, D: [80, 400] },
];

function hoursLatex(r: Rational): string {
	return rl(r);
}

function incontro(rng: Rng): Problem {
	const ci = rng.int(0, MEET_CTX.length - 1);
	const ctx = MEET_CTX[ci];
	const nv = Math.floor((ctx.v[1] - ctx.v[0]) / ctx.step);
	for (;;) {
		const v1 = ctx.v[0] + rng.int(0, nv) * ctx.step;
		const v2 = ctx.v[0] + rng.int(0, nv) * ctx.step;
		const m = rng.int(4, 48) * 5;
		if (v1 === v2) continue;
		if ((v1 * m) % 60 !== 0 || (v2 * m) % 60 !== 0) continue;
		const s1 = (v1 * m) / 60, s2 = (v2 * m) / 60;
		const D = s1 + s2;
		if (D < ctx.D[0] || D > ctx.D[1] || m % 60 === 0) continue;
		const asked = rng.pick(['minuti', 'km'] as const);
		const tt = q(m, 60);
		const answer = asked === 'minuti' ? m : s1;
		const question = asked === 'minuti' ? 'Dopo quanti minuti si incontrano?' : 'A quanti chilometri da $A$ si incontrano?';
		const prose = `Due paesi $A$ e $B$ distano ${D} km. ${cap(ctx.a)} parte da $A$ verso $B$ a ${v1} km/h e nello stesso momento ${ctx.b} parte da $B$ verso $A$ a ${v2} km/h. ${question}`;
		return {
			story: 'incontro',
			data: { context: ci, D, v1, v2, asked },
			prose,
			unknown: `${t('Chiama ')} t ${t(' il tempo fino all\'incontro, in ore, con ')} t > 0${t(`: in quel tempo si percorrono `)} ${v1}t ${t(' e ')} ${v2}t ${t(' km')}`,
			equation: `${v1}t + ${v2}t = ${D}`,
			work: [`${v1 + v2}t = ${D}`, `t = \\frac{${D}}{${v1 + v2}} = ${hoursLatex(tt)}`],
			v: 't',
			x: tt,
			normal: [q(v1 + v2), q(D)],
			answer: q(answer),
			toAnswer: [asked === 'minuti' ? `${hoursLatex(tt)} \\cdot 60 = ${m} ${t(' minuti')}` : `${v1} \\cdot ${hoursLatex(tt)} = ${s1} ${t(' km da ')} A`],
			check: `${v1} \\cdot ${hoursLatex(tt)} + ${v2} \\cdot ${hoursLatex(tt)} = ${s1} + ${s2} = ${D}`,
			solution: asked === 'minuti' ? t(`Si incontrano dopo ${m} minuti`) : `${t(`Si incontrano a ${s1} km da `)} A`,
			given: [D, v1, v2],
			mistakes:
				asked === 'minuti'
					? [...(misread(tt) !== null ? [q(misread(tt) as number)] : []), q(D * 60, v1), q(D * 60, Math.abs(v1 - v2)), q(D * 60, v2)]
					: [q(s2), q(D, 2), q(v1), q(D * v1, v2)],
		};
	}
}

const CHASE_CTX = [
	{ first: 'un ciclista', the: 'il ciclista', second: 'uno scooter', second2: 'lo scooter', v1: [12, 24], v2: [30, 60] },
	{ first: 'un camion', the: 'il camion', second: "un'auto", second2: "l'auto", v1: [50, 80], v2: [90, 130] },
	{ first: 'Luca, a piedi,', the: 'Luca', second: 'sua sorella in bicicletta', second2: 'la sorella', v1: [4, 6], v2: [10, 20] },
];

function inseguimento(rng: Rng): Problem {
	const ci = rng.int(0, CHASE_CTX.length - 1);
	const ctx = CHASE_CTX[ci];
	for (;;) {
		const v1 = rng.int(ctx.v1[0], ctx.v1[1]);
		const v2 = rng.int(ctx.v2[0], ctx.v2[1]);
		const dh = rng.pick([1, 2]);
		const h0 = rng.int(7, 15);
		const tt = q(v1 * dh, v2 - v1);
		const m = tt.mul(q(60));
		const km = tt.mul(q(v2));
		if (!m.isInteger() || !km.isInteger() || m.num > 240 || m.num < 10 || m.num % 60 === 0) continue;
		const asked = rng.pick(['minuti', 'km'] as const);
		const answer = asked === 'minuti' ? m.num : km.num;
		const question = asked === 'minuti' ? `Quanti minuti dopo la sua partenza ${ctx.second2} raggiunge ${ctx.the}?` : `A quanti chilometri dal punto di partenza ${ctx.second2} raggiunge ${ctx.the}?`;
		const prose = `Alle ${h0} ${ctx.first} parte e viaggia a ${v1} km/h. Alle ${h0 + dh}, dallo stesso punto e sulla stessa strada, parte ${ctx.second} a ${v2} km/h. ${question}`;
		return {
			story: 'inseguimento',
			data: { context: ci, h0, dh, v1, v2, asked },
			prose,
			unknown: `${t('Chiama ')} t ${t(' il tempo dalla seconda partenza, in ore, con ')} t > 0${t(': il primo ha viaggiato per ')} t + ${dh} ${t(' ore')}`,
			equation: `${v2}t = ${v1}(t + ${dh})`,
			work: [`${v2}t = ${v1}t + ${v1 * dh}`, `${v2 - v1}t = ${v1 * dh}`, ...(v2 - v1 === 1 ? [] : [`t = ${rl(tt)}`])],
			v: 't',
			x: tt,
			normal: [q(v2 - v1), q(v1 * dh)],
			answer: q(answer),
			toAnswer: [asked === 'minuti' ? `${rl(tt)} \\cdot 60 = ${m.num} ${t(' minuti')}` : `${v2} \\cdot ${rl(tt)} = ${km.num} ${t(' km')}`],
			check: `${v2} \\cdot ${rl(tt)} = ${km.num} ${t(' e ')} ${v1} \\cdot ${rl(tt.add(q(dh)))} = ${km.num}`,
			solution: asked === 'minuti' ? t(`Dopo ${m.num} minuti`) : t(`A ${km.num} km dalla partenza`),
			given: [h0, h0 + dh, dh, v1, v2],
			// the speeds added; the time counted from the first departure; the head start in km
			mistakes:
				asked === 'minuti'
					? [q(60 * v1 * dh, v1 + v2), m.add(q(60 * dh)), q(60 * v1 * dh, v2), m.add(q(30))]
					: [q(v1 * dh), km.add(q(v1 * dh)), q(v1 * dh * v2, v1 + v2), km.sub(q(v1))],
		};
	}
}

const TRIP_CTX = [
	{ prose: (N: string, v1: number, v2: number, T: number) => `${N} va a scuola in bicicletta a ${v1} km/h e torna a casa a ${v2} km/h. Tra andata e ritorno pedala in tutto ${T} minuti. Quanti chilometri ci sono da casa a scuola?`, v: [9, 24] },
	{ prose: (N: string, v1: number, v2: number, T: number) => `${N} va a piedi fino al lago a ${v1} km/h e torna a ${v2} km/h. Tra andata e ritorno cammina ${T} minuti. Quanti chilometri ci sono fino al lago?`, v: [3, 6] },
	{ prose: (N: string, v1: number, v2: number, T: number) => `${N} va in barca fino a un'isola a ${v1} km/h e torna, con il vento contro, a ${v2} km/h. Tra andata e ritorno naviga ${T} minuti. Quanto dista l'isola, in km?`, v: [8, 30] },
];

function andataRitorno(rng: Rng): Problem {
	const ci = rng.int(0, TRIP_CTX.length - 1);
	const ctx = TRIP_CTX[ci];
	const { name } = pickName(rng);
	for (;;) {
		const v1 = rng.int(ctx.v[0], ctx.v[1]);
		const v2 = rng.int(ctx.v[0], ctx.v[1]);
		if (v1 === v2) continue;
		const x = rng.int(1, 30);
		const hours = q(x, v1).add(q(x, v2));
		const T = hours.mul(q(60));
		if (!T.isInteger() || T.num < 20 || T.num > 300) continue;
		const L = lcm(lcm(v1, v2), hours.den);
		const c1 = L / v1, c2 = L / v2, rhs = hours.mul(q(L)).num;
		const rhsL = hours.isInteger() ? `${hours.num}` : rl(hours);
		// the average of the speeds for the whole time, both ways; the total distance
		const avg = q((v1 + v2) * T.num, 2 * 60 * 2);
		return {
			story: 'andata-ritorno',
			data: { context: ci, v1, v2, T: T.num, name },
			prose: ctx.prose(name, v1, v2, T.num),
			unknown: `${t('Chiama ')} x ${t(' la distanza, in km, con ')} x > 0${t(`: l'andata dura `)} \\frac{x}{${v1}} ${t(' ore e il ritorno ')} \\frac{x}{${v2}} ${t(' ore')}`,
			equation: `\\frac{x}{${v1}} + \\frac{x}{${v2}} = ${rhsL}`,
			work: [`${cx(c1)} + ${cx(c2)} = ${rhs}`, `${cx(c1 + c2)} = ${rhs}`, ...(c1 + c2 === 1 ? [] : [`x = ${x}`])],
			v: 'x',
			x: q(x),
			normal: [q(c1 + c2), q(rhs)],
			answer: q(x),
			check: `\\frac{${x}}{${v1}} + \\frac{${x}}{${v2}} = ${rl(q(x, v1))} + ${rl(q(x, v2))} = ${rhsL} ${t(' ore, cioè ')} ${T.num} ${t(' minuti')}`,
			solution: t(`La distanza è ${x} km`),
			given: [v1, v2, T.num],
			mistakes: [q(2 * x), avg, q(v1 * T.num, 120), q(v2 * T.num, 120)],
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: mixtures

const GOODS = [
	{ name: 'caffè', p: [8, 30] },
	{ name: 'tè', p: [16, 60] },
	{ name: 'frutta secca', p: [10, 36] },
	{ name: 'caramelle', p: [6, 20] },
];

function miscela(rng: Rng): Problem {
	const gi = rng.int(0, GOODS.length - 1);
	const g = GOODS[gi];
	for (;;) {
		const p1 = rng.int(g.p[0], g.p[1] - 4);
		const p2 = rng.int(p1 + 3, g.p[1]);
		const Q = rng.int(2, 12) * 5;
		const x = rng.int(1, Q - 1);
		const tot = p1 * x + p2 * (Q - x);
		if (tot % Q !== 0 || 2 * x === Q) continue;
		const pm = tot / Q;
		const askFirst = rng.int(0, 1) === 1;
		const answer = askFirst ? x : Q - x;
		const eq = `${p1}x + ${p2}(${Q} - x) = ${pm} \\cdot ${Q}`;
		// the total price written without the quantity
		const noQ = q(p2 * Q - pm, p2 - p1);
		return {
			story: 'miscela',
			data: { good: gi, p1, p2, Q, pm, asked: askFirst ? 'primo' : 'secondo' },
			prose: `Un negoziante mescola ${g.name} da ${p1} euro al chilo con ${g.name} da ${p2} euro al chilo, e vuole ottenere ${Q} kg di miscela da vendere a ${pm} euro al chilo. Quanti chili di ${g.name} da ${askFirst ? p1 : p2} euro deve usare?`,
			unknown: `${t('Chiama ')} x ${t(` i chili da ${p1} euro, con `)} 0 \\leq x \\leq ${Q}${t(`: quelli da ${p2} euro sono `)} ${Q} - x`,
			equation: eq,
			work: [`${p1}x + ${p2 * Q} - ${p2}x = ${pm * Q}`, `-${p2 - p1}x = ${pm * Q - p2 * Q}`, `x = ${x}`],
			v: 'x',
			x: q(x),
			normal: [q(p1 - p2), q(pm * Q - p2 * Q)],
			answer: q(answer),
			toAnswer: askFirst ? undefined : [`${t(`Chili da ${p2} euro: `)} ${Q} - ${x} = ${Q - x}`],
			check: `${p1} \\cdot ${x} + ${p2} \\cdot ${Q - x} = ${p1 * x} + ${p2 * (Q - x)} = ${pm * Q} = ${pm} \\cdot ${Q}`,
			solution: t(`${answer} kg di ${g.name} da ${askFirst ? p1 : p2} euro`),
			given: [p1, p2, Q, pm],
			mistakes: [q(askFirst ? Q - x : x), q(Q, 2), askFirst ? noQ : q(Q).sub(noQ), q(Math.abs(pm - p1))],
		};
	}
}

function aggiunta(rng: Rng): Problem {
	const gi = rng.int(0, GOODS.length - 1);
	const g = GOODS[gi];
	for (;;) {
		const pa = rng.int(g.p[0], g.p[1]);
		const pb = rng.int(g.p[0], g.p[1]);
		if (Math.abs(pa - pb) < 3) continue;
		const m = rng.int(2, 10) * 5;
		const x = rng.int(1, 12) * 5;
		const tot = pa * m + pb * x;
		if (tot % (m + x) !== 0 || x === m) continue;
		const pm = tot / (m + x);
		const lo = Math.min(pa, pb), hi = Math.max(pa, pb);
		if (pm <= lo || pm >= hi) continue;
		// the new weight forgotten: pa·m + pb·x = pm·m
		const noGrow = q((pm - pa) * m, pb);
		return {
			story: 'aggiunta',
			data: { good: gi, pa, m, pb, pm },
			prose: `Un negoziante ha ${m} kg di ${g.name} da ${pa} euro al chilo. Quanti chili di ${g.name} da ${pb} euro al chilo deve aggiungere per ottenere una miscela da ${pm} euro al chilo?`,
			unknown: `${t('Chiama ')} x ${t(' i chili da aggiungere, con ')} x > 0${t(': la miscela pesa ')} ${m} + x ${t(' kg')}`,
			equation: `${pa} \\cdot ${m} + ${pb}x = ${pm}(${m} + x)`,
			work: [`${pa * m} + ${pb}x = ${pm * m} + ${pm}x`, `${pb}x - ${pm}x = ${pm * m} - ${pa * m}`, `${cx(pb - pm)} = ${(pm - pa) * m}`, ...(pb - pm === 1 ? [] : [`x = ${x}`])],
			v: 'x',
			x: q(x),
			normal: [q(pb - pm), q((pm - pa) * m)],
			answer: q(x),
			check: `${pa} \\cdot ${m} + ${pb} \\cdot ${x} = ${tot} = ${pm} \\cdot ${m + x}`,
			solution: t(`${x} kg`),
			given: [m, pa, pb, pm],
			mistakes: [noGrow, q(m + x), q(m), q(Math.abs((pm - pa) * m), Math.abs(pb - pa))],
		};
	}
}

const DILUTE_CTX = [
	{ what: 'bibita', part: 'succo', prose: (m: number, c1: number, c2: number) => `In una caraffa ci sono ${m} litri di bibita con il ${pctProse(c1)} di succo di frutta. Quanti litri di acqua devi aggiungere perché il succo diventi il ${pctProse(c2)} della bibita?` },
	{ what: 'soluzione', part: 'sale', prose: (m: number, c1: number, c2: number) => `In laboratorio ci sono ${m} litri di acqua salata con il ${pctProse(c1)} di sale. Quanti litri di acqua distillata bisogna aggiungere perché il sale scenda al ${pctProse(c2)}?` },
	{ what: 'sciroppo', part: 'zucchero', prose: (m: number, c1: number, c2: number) => `Un pasticciere ha ${m} litri di sciroppo con il ${pctProse(c1)} di zucchero. Quanti litri di acqua deve aggiungere per avere uno sciroppo con il ${pctProse(c2)} di zucchero?` },
];

function diluizione(rng: Rng): Problem {
	const ci = rng.int(0, DILUTE_CTX.length - 1);
	const ctx = DILUTE_CTX[ci];
	for (;;) {
		const c1 = rng.pick(ci === 1 ? [4, 5, 6, 8, 10, 12] : [20, 25, 30, 40, 50, 60]);
		const c2 = rng.pick(ci === 1 ? [2, 3, 4, 5, 6] : [10, 15, 20, 25, 30, 40]);
		if (c2 >= c1) continue;
		const m = rng.int(2, 30);
		const num = m * (c1 - c2);
		if (num % c2 !== 0) continue;
		const x = num / c2;
		if (x < 1 || x > 60 || x === m) continue;
		const f1 = PCT(c1), f2 = PCT(c2);
		const lhs = f1.mul(q(m)), right = f2.mul(q(m));
		return {
			story: 'diluizione',
			data: { context: ci, m, c1, c2 },
			prose: ctx.prose(m, c1, c2),
			unknown: `${t('Chiama ')} x ${t(' i litri di acqua, con ')} x > 0${t(`: il ${ctx.part} resta lo stesso e il liquido diventa `)} ${m} + x ${t(' litri')}`,
			equation: `${dec(f1)} \\cdot ${m} = ${dec(f2)}(${m} + x)`,
			work: [`${dec(lhs)} = ${dec(right)} + ${cx(f2)}`, `${cx(f2)} = ${dec(lhs.sub(right))}`, ...solveLine(f2, lhs.sub(right))],
			v: 'x',
			x: q(x),
			normal: [f2, lhs.sub(right)],
			answer: q(x),
			check: `${dec(f2)} \\cdot ${m + x} = ${dec(f2.mul(q(m + x)))} = ${dec(f1)} \\cdot ${m}`,
			solution: t(`${x} litri di acqua`),
			given: [m, c1, c2],
			// the difference of the percentages on the starting amount; the final amount; the ratio the wrong way
			mistakes: [f1.sub(f2).mul(q(m)), q(m + x), q(m * c2, c1), q(m * c1, c2)],
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: work. Times in the unit of the text; the answer in minutes, shown as hours and minutes.

interface WorkCtx {
	unit: 'h' | 'min';
	r: [number, number];
	prose: (a: number, b: number, h: number) => string;
}
const WORK_CTX: Record<'insieme' | 'svuota' | 'dopo', WorkCtx[]> = {
	insieme: [
		{ unit: 'h', r: [2, 12], prose: (a: number, b: number) => `Un rubinetto riempie una vasca in ${a} ore, un altro in ${b} ore. Aperti insieme, in quanto tempo la riempiono?` },
		{ unit: 'h', r: [2, 12], prose: (a: number, b: number) => `Un imbianchino dipinge una stanza in ${a} ore, un suo collega in ${b} ore. Lavorando insieme, in quanto tempo la dipingono?` },
		{ unit: 'h', r: [2, 10], prose: (a: number, b: number) => `Un trattore ara un campo in ${a} ore, un trattore più piccolo in ${b} ore. Lavorando insieme, in quanto tempo arano il campo?` },
		{ unit: 'min', r: [10, 90], prose: (a: number, b: number) => `Una stampante stampa i volantini della festa in ${a} minuti, una più vecchia in ${b} minuti. Usandole insieme, in quanto tempo si stampano i volantini?` },
		{ unit: 'min', r: [6, 60], prose: (a: number, b: number) => `Per la festa Sara prepara i sacchetti di caramelle in ${a} minuti, suo fratello in ${b} minuti. Lavorando insieme, in quanto tempo li preparano?` },
	],
	svuota: [
		{ unit: 'h', r: [2, 12], prose: (a: number, b: number) => `Un rubinetto riempie una vasca in ${a} ore, e lo scarico aperto la svuota in ${b} ore. Se apri il rubinetto e lasci aperto lo scarico, in quanto tempo si riempie la vasca vuota?` },
		{ unit: 'h', r: [3, 16], prose: (a: number, b: number) => `Una pompa riempie una piscina in ${a} ore, ma per una perdita la piscina piena si svuoterebbe in ${b} ore. Con la pompa accesa e la perdita, in quanto tempo si riempie la piscina vuota?` },
		{ unit: 'min', r: [4, 60], prose: (a: number, b: number) => `Con il tappo messo, un rubinetto riempie un lavandino in ${a} minuti; senza tappo, il lavandino pieno si svuota in ${b} minuti. Se apri il rubinetto e dimentichi di mettere il tappo, in quanto tempo si riempie il lavandino?` },
		{ unit: 'min', r: [6, 60], prose: (a: number, b: number) => `Una pompa riempie un serbatoio in ${a} minuti, e il rubinetto in fondo lo svuota in ${b} minuti. Se la pompa lavora con il rubinetto aperto, in quanto tempo si riempie il serbatoio vuoto?` },
	],
	dopo: [
		{ unit: 'h', r: [3, 12], prose: (a: number, b: number, h: number) => `Un imbianchino da solo dipinge un appartamento in ${a} ore, un suo collega in ${b} ore. Il primo lavora da solo per ${h} ${h === 1 ? 'ora' : 'ore'}, poi arriva il collega e finiscono insieme. Quanto tempo lavorano insieme?` },
		{ unit: 'h', r: [3, 12], prose: (a: number, b: number, h: number) => `Un rubinetto riempie una vasca in ${a} ore, un altro in ${b} ore. Il primo resta aperto da solo per ${h} ${h === 1 ? 'ora' : 'ore'}, poi si apre anche il secondo. Da quel momento, in quanto tempo si riempie la vasca?` },
		{ unit: 'min', r: [10, 60], prose: (a: number, b: number, h: number) => `Una stampante stampa le pagelle di una scuola in ${a} minuti, un'altra in ${b} minuti. La prima lavora da sola per ${h} minuti, poi si accende anche la seconda. Da quel momento, in quanto tempo finiscono le pagelle?` },
	],
};

/** Minutes as the answer is written: 2 h 24 min, 3 h, 45 min. */
export function timeLatex(min: number): string {
	const h = Math.floor(min / 60), m = min % 60;
	if (h === 0) return `${m} \\text{ min}`;
	if (m === 0) return `${h} \\text{ h}`;
	return `${h} \\text{ h } ${m} \\text{ min}`;
}
const timeWords = (min: number) => {
	const h = Math.floor(min / 60), m = min % 60;
	const hs = h === 1 ? "un'ora" : `${h} ore`;
	const ms = m === 1 ? 'un minuto' : `${m} minuti`;
	return h === 0 ? ms : m === 0 ? hs : `${hs} e ${ms}`;
};

/** "2,4 hours read as 2 hours and 40 minutes": the decimal digits taken as minutes. */
function misread(xh: Rational): number | null {
	if (xh.isInteger()) return null;
	let s: string;
	try {
		s = dec(xh);
	} catch {
		return null;
	}
	const [h, f] = s.split('{,}');
	if (!f || f.length > 2) return null;
	const mm = Number(f.length === 1 ? `${f}0` : f);
	return mm < 60 ? Number(h) * 60 + mm : null;
}

function lavoro(rng: Rng, kind: 'insieme' | 'svuota' | 'dopo'): Problem {
	const ctxs = WORK_CTX[kind];
	const ci = rng.int(0, ctxs.length - 1);
	const ctx = ctxs[ci];
	const unit = ctx.unit;
	const toMin = unit === 'h' ? 60 : 1;
	for (;;) {
		const a = rng.int(ctx.r[0], ctx.r[1]);
		const b = rng.int(ctx.r[0], ctx.r[1]);
		if (a >= b) continue;
		const h = kind === 'dopo' ? rng.int(1, a - 1) : 0;
		const L = lcm(a, b);
		const ca = L / a, cb = L / b;
		let xv: Rational, eq: string, work: string[], normal: [Rational, Rational];
		if (kind === 'insieme') {
			xv = q(a * b, a + b);
			eq = `\\frac{x}{${a}} + \\frac{x}{${b}} = 1`;
			work = [`${cx(ca)} + ${cx(cb)} = ${L}`, `${cx(ca + cb)} = ${L}`];
			normal = [q(ca + cb), q(L)];
		} else if (kind === 'svuota') {
			xv = q(a * b, b - a);
			eq = `\\frac{x}{${a}} - \\frac{x}{${b}} = 1`;
			work = [`${cx(ca)} - ${cx(cb)} = ${L}`, `${cx(ca - cb)} = ${L}`];
			normal = [q(ca - cb), q(L)];
		} else {
			xv = q((a - h) * b, a + b);
			eq = `\\frac{x + ${h}}{${a}} + \\frac{x}{${b}} = 1`;
			work = [`${ca === 1 ? '' : ca}(x + ${h}) + ${cx(cb)} = ${L}`, `${cx(ca)} + ${ca * h} + ${cx(cb)} = ${L}`, `${cx(ca + cb)} = ${L - ca * h}`];
			normal = [q(ca + cb), q(L - ca * h)];
		}
		if (!normal[0].isOne()) work.push(`x = ${rl(xv)}`);
		const minutes = xv.mul(q(toMin));
		if (!minutes.isInteger() || minutes.num < 5) continue;
		if (unit === 'h' && (xv.isInteger() || minutes.num > 12 * 60)) continue;
		if (unit === 'min' && minutes.num > 180) continue;
		const M = minutes.num;
		const whole = Math.floor(xv.num / xv.den);
		const frac = xv.sub(q(whole));
		const toAnswer =
			unit === 'h'
				? [whole === 0 ? `${rl(xv)} \\text{ h} = ${rl(xv)} \\cdot 60 \\text{ min} = ${M} \\text{ min}` : `${rl(xv)} = ${whole} + ${rl(frac)}${t(', e ')} ${rl(frac)} \\cdot 60 = ${(frac.num * 60) / frac.den} ${t(' minuti')}`]
				: M >= 60
					? [`${M} \\text{ min} = ${timeLatex(M)}`]
					: undefined;
		const mistakes: Rational[] = [];
		const mr = unit === 'h' ? misread(xv) : null;
		if (kind === 'insieme') mistakes.push(q((a + b) * toMin), q((a + b) * toMin, 2), ...(mr ? [q(mr)] : []), ...(unit === 'h' ? [q(whole * 60)] : []), q(a * toMin, 2));
		else if (kind === 'svuota') mistakes.push(q(a * b * toMin, a + b), q((b - a) * toMin), ...(mr ? [q(mr)] : []), q((a + b) * toMin));
		else mistakes.push(q(a * b * toMin, a + b), minutes.add(q(h * toMin)), ...(mr ? [q(mr)] : []), q((a - h) * toMin), q((a + b - 2 * h) * toMin, 2));
		const u = unit === 'h' ? 'ore' : 'minuti';
		return {
			story: kind,
			data: kind === 'dopo' ? { context: ci, a, b, h, unit } : { context: ci, a, b, unit },
			prose: ctx.prose(a, b, h),
			unknown:
				kind === 'dopo'
					? `${t(`Chiama `)} x ${t(` il tempo insieme, in ${u}, con `)} x > 0${t(`: il primo lavora per `)} x + ${h} ${t(` ${u}, e in ${unit === 'h' ? "un'ora" : 'un minuto'} fa `)} \\frac{1}{${a}} ${t(' del lavoro')}`
					: `${t('Chiama ')} x ${t(` il tempo, in ${u}, con `)} x > 0${t(`: in ${unit === 'h' ? "un'ora" : 'un minuto'} uno fa `)} \\frac{1}{${a}} ${t(" del lavoro e l'altro ")} \\frac{1}{${b}}`,
			equation: eq,
			work: [`${t('Moltiplica per ')} ${L}\\text{: } ${work[0]}`, ...work.slice(1)],
			v: 'x',
			x: xv,
			normal,
			answer: q(M),
			toAnswer,
			check:
				kind === 'dopo'
					? `\\frac{1}{${a}} \\cdot ${rl(xv.add(q(h)))} + \\frac{1}{${b}} \\cdot ${rl(xv)} = ${rl(xv.add(q(h)).div(q(a)))} + ${rl(xv.div(q(b)))} = 1`
					: `\\frac{1}{${a}} \\cdot ${rl(xv)} ${kind === 'svuota' ? '-' : '+'} \\frac{1}{${b}} \\cdot ${rl(xv)} = ${rl(xv.div(q(a)))} ${kind === 'svuota' ? '-' : '+'} ${rl(xv.div(q(b)))} = 1`,
			solution: t(cap(timeWords(M))),
			given: [],
			mistakes,
			unit,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: is the solution acceptable? About half the problems are impossible.

const IMPOSSIBLE = 'impossibile';

function accConsecutivi(rng: Rng, ok: boolean): Problem {
	for (;;) {
		const n = rng.pick([2, 3]);
		const shift = (n * (n - 1)) / 2;
		const S = rng.int(20, 300);
		const xv = q(S - shift, n);
		if (xv.isInteger() !== ok) continue;
		const nums = ok ? Array.from({ length: n }, (_, i) => xv.num + i) : [];
		const eq = n === 2 ? `x + (x + 1) = ${S}` : `x + (x + 1) + (x + 2) = ${S}`;
		const fl = Math.floor(xv.num / xv.den);
		return {
			story: 'consecutivi',
			data: { n, S },
			prose: `La somma di ${NUM_WORD[n]} numeri naturali consecutivi è ${S}. Qual è il più piccolo dei ${NUM_WORD[n]} numeri?`,
			unknown: `${t('Chiama ')} x ${t(' il più piccolo: ')} x ${t(' deve essere un numero naturale')}`,
			equation: eq,
			work: [`${n}x + ${shift} = ${S}`, `${n}x = ${S - shift}`, `x = ${rl(xv)}`],
			v: 'x',
			x: xv,
			normal: [q(n), q(S - shift)],
			answer: ok ? xv : null,
			check: ok ? `${nums.join(' + ')} = ${S}` : `${rl(xv)} ${t(' non è un numero intero: la soluzione non è accettabile')}`,
			solution: ok ? `${t('Il più piccolo è ')} ${xv.num}` : t('Il problema è impossibile'),
			given: [S],
			mistakes: ok ? [q(xv.num + n - 1), q(S, n), q(S - shift)] : [xv, q(fl), q(fl + 1), q(S, n)],
		};
	}
}

function accEta(rng: Rng, ok: boolean): Problem {
	for (;;) {
		const k = rng.int(3, 5);
		const c = rng.int(4, 16);
		// ok: 0 < x < c; not ok: x < 0, the moment is in the future
		const x = ok ? rng.int(1, c - 1) : -rng.int(1, 8);
		const p = x + k * (c - x);
		if (p - c < 20 || p - c > 45 || p > 65) continue;
		const { P, C, rel } = parentChild(rng);
		const xv = q(x);
		return {
			story: 'eta',
			data: { k, parent: p, child: c, P, C },
			prose: `Oggi ${P} ha ${p} anni e ${rel} ${C} ne ha ${c}. Quanti anni fa ${P} aveva il ${TIMES[k]} degli anni di ${C}?`,
			unknown: `${t('Chiama ')} x ${t(' il numero di anni fa, con ')} 0 < x < ${c}`,
			equation: `${p} - x = ${k}(${c} - x)`,
			work: [`${p} - x = ${k * c} - ${k}x`, `${k - 1}x = ${k * c - p}`, `x = ${x}`],
			v: 'x',
			x: xv,
			normal: [q(k - 1), q(k * c - p)],
			answer: ok ? xv : null,
			check: ok
				? `${t(`${x} anni fa: `)} ${p - x} = ${k} \\cdot ${c - x}`
				: `${x} ${t(` non è accettabile: ${P} avrà il ${TIMES[k]} degli anni di ${C} tra ${-x} anni, non l'ha avuto in passato`)}`,
			solution: ok ? t(`${x} ann${x === 1 ? 'o' : 'i'} fa`) : t('Il problema è impossibile'),
			given: [k, p, c],
			mistakes: ok ? [q(c - x), q(p - x), q(k * c - p + 1)] : [xv, q(-x), q(c - x)],
		};
	}
}

function accRettangolo(rng: Rng, ok: boolean): Problem {
	for (;;) {
		const P = rng.int(5, 40) * 2;
		const d = ok ? rng.int(2, P / 2 - 2) : rng.int(P / 2 + 1, P);
		const xv = q(P - 2 * d, 4);
		if (ok && !xv.isInteger()) continue;
		const u = rng.pick(['cm', 'm']);
		return {
			story: 'rettangolo',
			data: { P, d, u },
			prose: `Un rettangolo ha il perimetro di ${P} ${u}, e la base supera l'altezza di ${d} ${u}. Quanto misura l'altezza, in ${u}?`,
			unknown: `${t('Chiama ')} x ${t(` l'altezza, in ${u}, con `)} x > 0${t(': la base è ')} x + ${d}`,
			equation: `2(x + x + ${d}) = ${P}`,
			work: [`4x + ${2 * d} = ${P}`, `4x = ${P - 2 * d}`, `x = ${rl(xv)}`],
			v: 'x',
			x: xv,
			normal: [q(4), q(P - 2 * d)],
			answer: ok ? xv : null,
			check: ok
				? `2 \\cdot (${xv.num} + ${xv.num + d}) = ${P}`
				: `${rl(xv)} ${t(` non è accettabile: un'altezza non può essere ${xv.isZero() ? 'nulla' : 'negativa'}`)}`,
			solution: ok ? t(`L'altezza misura ${xv.num} ${u}`) : t('Il problema è impossibile'),
			given: [P, d],
			mistakes: ok ? [q(xv.num + d), q(P - d, 2), q(P, 4)] : [xv, xv.abs(), xv.add(q(d)), q(P - d, 2).abs()],
		};
	}
}

function accMiscela(rng: Rng, ok: boolean): Problem {
	const gi = rng.int(0, GOODS.length - 1);
	const g = GOODS[gi];
	for (;;) {
		const p1 = rng.int(g.p[0], g.p[1] - 4);
		const p2 = rng.int(p1 + 3, g.p[1]);
		const Q = rng.int(2, 12) * 5;
		// ok: 0 < x < Q; not ok: the price of the mixture outside [p1, p2]
		const pm = ok ? rng.int(p1 + 1, p2 - 1) : rng.pick([rng.int(p2 + 1, p2 + 8), rng.int(Math.max(1, p1 - 8), p1 - 1)]);
		const xv = q((p2 - pm) * Q, p2 - p1);
		if (!xv.isInteger() || xv.num === 0 || xv.num === Q || (ok && 2 * xv.num === Q)) continue;
		if (ok !== (xv.num > 0 && xv.num < Q)) continue;
		const x = xv.num;
		return {
			story: 'miscela',
			data: { good: gi, p1, p2, Q, pm },
			prose: `Un negoziante mescola ${g.name} da ${p1} euro al chilo con ${g.name} da ${p2} euro al chilo, e vuole ottenere ${Q} kg di miscela da vendere a ${pm} euro al chilo. Quanti chili di ${g.name} da ${p1} euro deve usare?`,
			unknown: `${t('Chiama ')} x ${t(` i chili da ${p1} euro, con `)} 0 \\leq x \\leq ${Q}${t(`: quelli da ${p2} euro sono `)} ${Q} - x`,
			equation: `${p1}x + ${p2}(${Q} - x) = ${pm} \\cdot ${Q}`,
			work: [`${p1}x + ${p2 * Q} - ${p2}x = ${pm * Q}`, `-${p2 - p1}x = ${pm * Q - p2 * Q}`, `x = ${x}`],
			v: 'x',
			x: xv,
			normal: [q(p1 - p2), q(pm * Q - p2 * Q)],
			answer: ok ? xv : null,
			check: ok
				? `${p1} \\cdot ${x} + ${p2} \\cdot ${Q - x} = ${pm * Q}`
				: `${x} ${t(` non è accettabile: ${x < 0 ? 'i chili non possono essere negativi' : `supera i ${Q} kg della miscela`}. Una miscela non può costare ${pm > p2 ? 'più del più caro' : 'meno del meno caro'} dei due prodotti`)}`,
			solution: ok ? t(`${x} kg`) : t('Il problema è impossibile'),
			given: [p1, p2, Q, pm],
			mistakes: ok ? [q(Q - x), q(Q, 2), q(Math.abs(pm - p1))] : [xv, xv.abs(), q(Q - x).abs()],
		};
	}
}

function accDivisione(rng: Rng, ok: boolean): Problem {
	for (;;) {
		const T = rng.int(10, 120);
		const d = rng.int(2, 60);
		const xv = q(T - d, 2);
		const good = xv.isInteger() && xv.num > 0;
		if (good !== ok || xv.isZero()) continue;
		const n1 = pickName(rng);
		const n2 = pickName(rng, [n1.name]);
		return {
			story: 'divisione',
			data: { T, d, A: n1.name, B: n2.name },
			prose: `${n1.name} ${n2.name.startsWith('E') ? 'ed' : 'e'} ${n2.name} hanno in tutto ${T} figurine, e ${n2.name} ne ha ${d} più di ${n1.name}. Quante figurine ha ${n1.name}?`,
			unknown: `${t('Chiama ')} x ${t(` le figurine di ${n1.name}, un numero naturale: quelle di ${n2.name} sono `)} x + ${d}`,
			equation: `x + (x + ${d}) = ${T}`,
			work: [`2x + ${d} = ${T}`, `2x = ${T - d}`, `x = ${rl(xv)}`],
			v: 'x',
			x: xv,
			normal: [q(2), q(T - d)],
			answer: ok ? xv : null,
			check: ok
				? `${xv.num} + ${xv.num + d} = ${T}`
				: `${rl(xv)} ${t(` non è accettabile: ${xv.sign() < 0 ? 'le figurine non possono essere negative' : 'le figurine si contano con i numeri interi'}`)}`,
			solution: ok ? t(`${n1.name} ha ${xv.num} figurine`) : t('Il problema è impossibile'),
			given: [T, d],
			mistakes: ok ? [q(xv.num + d), q(T, 2), q(T + d, 2)] : [xv, xv.abs(), q(Math.floor(xv.num / xv.den)).abs(), q(T + d, 2)],
		};
	}
}

const ACC_BUILDERS: Record<string, (rng: Rng, ok: boolean) => Problem> = {
	consecutivi: accConsecutivi,
	eta: accEta,
	rettangolo: accRettangolo,
	miscela: accMiscela,
	divisione: accDivisione,
};

// ---------------------------------------------------------------------------

const BUILDERS: Record<string, (rng: Rng) => Problem> = {
	ordine,
	'pari-dispari': pariDispari,
	'somma-due': sommaDue,
	'eta-fa': etaFa,
	'eta-somma': etaSomma,
	'rettangolo-area': rettangoloArea,
	isoscele,
	quadrato,
	'rettangolo-cambia': rettangoloCambia,
	sconto,
	resto,
	aumento,
	parti,
	incontro,
	inseguimento,
	'andata-ritorno': andataRitorno,
	miscela,
	aggiunta,
	diluizione,
	insieme: (rng) => lavoro(rng, 'insieme'),
	svuota: (rng) => lavoro(rng, 'svuota'),
	dopo: (rng) => lavoro(rng, 'dopo'),
};

function problemSteps(p: Problem): string[] {
	return [p.unknown, `${t("Traduci il testo in un'equazione: ")} ${p.equation}`, ...p.work, ...(p.toAnswer ?? []), p.answer === null ? p.check : `${t('Controllo sul testo: ')} ${p.check}`];
}

const numOpt = (r: Rational): ChoiceOption => (r.isInteger() ? numberOption(r.num) : { latex: rl(r), values: [r.toString()] });
const impossibleOpt: ChoiceOption = { latex: '\\text{Il problema è impossibile}', values: [IMPOSSIBLE] };
const timeOpt = (r: Rational): ChoiceOption => ({ latex: timeLatex(r.num), values: [String(r.num)] });

function nearby(r: Rational): Rational[] {
	const out: Rational[] = [];
	for (let d = 1; d < 40; d++) out.push(r.add(q(d)), r.sub(q(d)));
	return out;
}

function buildChoice(rng: Rng, p: Problem, level: number): ChoiceAnswer {
	const valid = (m: Rational) => Number.isFinite(m.num) && m.den > 0;
	if (level === 7) {
		const correct = p.answer === null ? impossibleOpt : numOpt(p.answer);
		const ds = p.mistakes.filter(valid).map(numOpt);
		const pool = p.answer === null ? ds : [impossibleOpt, ...ds];
		// Always three numbers and "impossibile": an impossible problem gets the rejected solution first.
		const extra = nearby(p.answer ?? p.x).filter((r) => r.sign() > 0 && r.isInteger()).map(numOpt);
		const ch = assembleChoice(rng, correct, [...pool, ...extra], 4);
		if (!ch) throw new Error('equazioni-problemi: not enough options');
		if (!ch.options.some((o) => o.values[0] === IMPOSSIBLE)) throw new Error('equazioni-problemi: no impossible option');
		return ch;
	}
	const ans = p.answer as Rational;
	const good = (m: Rational) => valid(m) && m.isInteger() && m.num > 0 && !m.equals(ans);
	if (level === 6) {
		// Times rounded to five minutes around the answer after the mistakes.
		const near: Rational[] = [];
		for (let d = 5; d < 200; d += 5) near.push(ans.add(q(d)), ans.sub(q(d)));
		const ch = assembleChoice(rng, timeOpt(ans), [...p.mistakes, ...near].filter(good).map(timeOpt), 4);
		if (!ch) throw new Error('equazioni-problemi: not enough options');
		return ch;
	}
	const ch = assembleChoice(rng, numOpt(ans), [...p.mistakes, ...nearby(ans)].filter(good).map(numOpt), 4);
	if (!ch) throw new Error('equazioni-problemi: not enough options');
	return ch;
}

const PROMPT = "Risolvi il problema con un'equazione.";
const PROMPT_7 = "Risolvi il problema con un'equazione e controlla che la soluzione sia accettabile.";

const FORBIDDEN: { name: string; re: RegExp }[] = [
	{ name: '1x', re: /(?<![\d},])1\s*[xt]/ },
	{ name: '0x', re: /(?<![\d},])0\s*[xt]/ },
	{ name: '+ -', re: /\+\s*-/ },
	{ name: '- -', re: /-\s*-/ },
	{ name: '+ +', re: /\+\s*\+/ },
	{ name: '^{1}', re: /\^\{?1(?!\d)/ },
	{ name: '1(', re: /(?<![\d},])1\(/ },
];

function generateLevel(rng: Rng, level: number): Sample {
	const stories = STORIES[level];
	for (let attempt = 0; attempt < 1000; attempt++) {
		const story = rng.pick(stories);
		const p = level === 7 ? ACC_BUILDERS[story](rng, rng.int(0, 1) === 1) : BUILDERS[story](rng);
		if (p.answer !== null && level <= 5 && p.given.some((g) => p.answer!.equals(q(g)))) continue;
		if (!p.normal[0].mul(p.x).equals(p.normal[1])) throw new Error(`${ID}: normal form of ${story} is wrong`);
		const choice = buildChoice(rng, p, level);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: level === 7 ? PROMPT_7 : PROMPT,
			problem: textBlock(p.prose),
			solution: p.solution,
			steps: problemSteps(p),
			answer: level >= 6 ? choice : { kind: 'number', value: (p.answer as Rational).toString() },
			params: {
				story: p.story,
				...Object.fromEntries(Object.entries(p.data).map(([k, v]) => [k, String(v)])),
				equation: p.equation,
				variable: p.v,
				x: p.x.toString(),
				normal: { a: p.normal[0].toString(), b: p.normal[1].toString() },
				...(level === 7 ? { case: p.answer === null ? 'impossibile' : 'accettabile' } : {}),
			},
		};
		if (level <= 5) sample.choice = choice;
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	const lvl = sample.level;
	if (!STORIES[lvl]?.includes(String(p.story))) return [`storia ${String(p.story)} fuori dal livello ${lvl}`];
	const normal = p.normal as { a: string; b: string };
	const a = Rational.parse(normal.a), b = Rational.parse(normal.b), x = Rational.parse(String(p.x));
	if (a.isZero() || !a.mul(x).equals(b)) v.push('forma normale sbagliata');
	for (const { name, re } of FORBIDDEN) if (re.test(String(p.equation))) v.push(`equazione con ${name}: ${String(p.equation)}`);
	if (!sample.steps.some((s) => s.includes(String(p.equation)))) v.push("l'equazione non è nei passaggi");
	if (/—|piuttosto che/.test(sample.problem)) v.push('parole vietate nel testo');
	const ch = lvl >= 6 ? (sample.answer as ChoiceAnswer) : sample.choice;
	if (!ch || ch.kind !== 'choice' || ch.options.length !== 4) v.push('servono quattro opzioni');
	else {
		const keys = ch.options.map((o) => o.values.join('|'));
		if (new Set(keys).size !== 4 || new Set(ch.options.map((o) => o.latex)).size !== 4) v.push('opzioni ripetute');
		if (lvl <= 5) {
			const val = (sample.answer as { value: string }).value;
			if (keys[ch.correct] !== val) v.push('opzione giusta sbagliata');
			if (!/^[1-9]\d*$/.test(val)) v.push('la risposta non è un intero positivo');
		}
		if (lvl === 7) {
			const imp = p.case === 'impossibile';
			if ((keys[ch.correct] === IMPOSSIBLE) !== imp) v.push('opzione giusta sbagliata');
			if (!imp && keys[ch.correct] !== x.toString()) v.push('la risposta non è la soluzione');
			if (!keys.includes(IMPOSSIBLE)) v.push('manca l\'opzione "impossibile"');
		}
		if (lvl === 6 && ch.options.some((o) => o.latex !== timeLatex(Number(o.values[0])))) v.push('tempo scritto male');
	}
	return v;
}

export const equazioniProblemi: Generator = {
	id: ID,
	title: 'Problemi con le equazioni',
	levels: {
		1: { label: 'Numeri ed età', constraints: ["l'ordine delle parole, numeri pari e dispari consecutivi, due numeri con somma nota", 'età: "anni fa" con 0 < x < età del figlio, e la somma delle età'] },
		2: { label: 'Problemi di geometria', constraints: ["l'area chiesta dopo i lati, triangoli isosceli, quadrati e rettangoli con i lati che cambiano", 'x^2 che si cancella'] },
		3: { label: 'Percentuali', constraints: ['sconto con una spesa aggiunta, percentuali sul resto, aumento e calo, parti di un totale', 'coefficienti decimali con la virgola'] },
		4: { label: 'Problemi di moto', constraints: ['incontro, inseguimento con partenza ritardata, andata e ritorno', 's = v · t, risposta in minuti o in km'] },
		5: { label: 'Miscele', constraints: ['due prodotti a prezzi diversi, una quantità da aggiungere, una soluzione da diluire'] },
		6: { label: 'Problemi di lavoro', constraints: ["incognita solo al numeratore, risposta in ore e minuti", 'insieme, riempire con lo scarico aperto, uno comincia prima'] },
		7: { label: 'Soluzione accettabile?', constraints: ['circa metà dei problemi impossibili: soluzione negativa, non intera o fuori dai limiti', "un'opzione è sempre \"Il problema è impossibile\""] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!STORIES[level]) throw new Error(`${ID}: unknown level ${level}`);
		return generateLevel(rng, level);
	},
	check,
	toChoice(sample: Sample): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (sample.choice) return sample.choice;
		throw new Error(`${ID}: sample without choice`);
	},
};

export default equazioniProblemi;
