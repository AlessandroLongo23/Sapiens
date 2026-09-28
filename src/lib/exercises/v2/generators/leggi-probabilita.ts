/**
 * Probabilità della somma e dell'evento contrario (lesson slug leggi-probabilita).
 * Spec: specs/exercises/leggi-probabilita.md
 *
 * Six levels in the order of the lesson: the complementary event (a die, the 40-card deck, an urn,
 * or a probability given as a number); "at least one" with two dice or with coins; the union of
 * incompatible events; the union of compatible events with one die or the deck; the union of two
 * events on two dice (compatible or not); a two-way table with "A or B" and "neither A nor B".
 * Every answer is a reduced fraction strictly between 0 and 1, counted on an explicit sample space.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { shuffle, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'leggi-probabilita';

// ---------------------------------------------------------------------------
// Numbers

/** A probability in LaTeX: 0, 1, \dfrac{7}{10}, -\dfrac{7}{10}. Always reduced. */
function fr(r: Rational): string {
	if (r.isInteger()) return `${r.num}`;
	return `${r.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(r.num)}}{${r.den}}`;
}

/** k/n as counted, then reduced when it simplifies: \dfrac{12}{40} = \dfrac{3}{10}. */
function counted(k: number, n: number): string {
	const r = q(k, n);
	const raw = `\\dfrac{${k}}{${n}}`;
	return r.den === n ? raw : `${raw} = ${fr(r)}`;
}

const t = (s: string) => `\\text{${s}}`;
const casi = (k: number) => `${k} ${k === 1 ? 'caso' : 'casi'}`;
const WORDS = ['zero', 'una', 'due', 'tre', 'quattro'];

// ---------------------------------------------------------------------------
// Sample spaces and events

type Die = number;
interface Card {
	v: number;
	s: string;
}
type Pair = [number, number];

const FACES: Die[] = [1, 2, 3, 4, 5, 6];
const SUITS = ['coppe', 'denari', 'bastoni', 'spade'];
const DECK: Card[] = SUITS.flatMap((s) => Array.from({ length: 10 }, (_, i) => ({ v: i + 1, s })));
const PAIRS: Pair[] = FACES.flatMap((a) => FACES.map((b): Pair => [a, b]));

interface Ev<T> {
	/** Kind of event, so two events of a question are never of the same kind. */
	kind: string;
	/** After "esce" / "esca": "un numero pari", "una carta di coppe". For two dice: a whole clause in the subjunctive. */
	what: string;
	test: (o: T) => boolean;
}

const count = <T>(omega: readonly T[], e: Ev<T>) => omega.filter(e.test).length;
const both = <T>(omega: readonly T[], a: Ev<T>, b: Ev<T>) => omega.filter((o) => a.test(o) && b.test(o)).length;

/** The events on one die of the lesson: a face, even, odd, greater or less than k, multiple of 3, prime. */
function dieEvents(): Ev<Die>[] {
	const out: Ev<Die>[] = FACES.map((k) => ({
		kind: 'faccia',
		what: `${k}`,
		test: (x: Die) => x === k,
	}));
	out.push({ kind: 'pari', what: 'un numero pari', test: (x) => x % 2 === 0 });
	out.push({
		kind: 'dispari',
		what: 'un numero dispari',
		test: (x) => x % 2 === 1,
	});
	for (let k = 1; k <= 4; k++)
		out.push({
			kind: 'maggiore',
			what: `un numero maggiore di ${k}`,
			test: (x) => x > k,
		});
	for (let k = 3; k <= 6; k++)
		out.push({
			kind: 'minore',
			what: `un numero minore di ${k}`,
			test: (x) => x < k,
		});
	out.push({
		kind: 'multiplo',
		what: 'un multiplo di 3',
		test: (x) => x % 3 === 0,
	});
	out.push({
		kind: 'primo',
		what: 'un numero primo',
		test: (x) => [2, 3, 5].includes(x),
	});
	return out;
}
const DIE_EVENTS = dieEvents();

function valueName(v: number): string {
	return v === 1 ? 'un asso' : v === 8 ? 'un fante' : v === 9 ? 'un cavallo' : v === 10 ? 'un re' : `un ${v}`;
}
function cardName(v: number, s: string): string {
	const n = v === 1 ? "l'asso" : v === 8 ? 'il fante' : v === 9 ? 'il cavallo' : v === 10 ? 'il re' : `il ${v}`;
	return `${n} di ${s}`;
}
const valueEv = (v: number): Ev<Card> => ({
	kind: 'valore',
	what: valueName(v),
	test: (c) => c.v === v,
});
const suitEv = (s: string): Ev<Card> => ({
	kind: 'seme',
	what: `una carta di ${s}`,
	test: (c) => c.s === s,
});
const FIGURE: Ev<Card> = {
	kind: 'figura',
	what: 'una figura',
	test: (c) => c.v >= 8,
};

/** Subsets of the faces for "at least one ... with two dice". */
const FACE_SETS: { what: string; none: string; faces: number[] }[] = [
	...FACES.map((k) => ({ what: `${k}`, none: `${k}`, faces: [k] })),
	{ what: 'numero pari', none: 'un numero pari', faces: [2, 4, 6] },
	{ what: 'numero dispari', none: 'un numero dispari', faces: [1, 3, 5] },
	...[2, 3, 4].map((k) => ({
		what: `numero maggiore di ${k}`,
		none: `un numero maggiore di ${k}`,
		faces: FACES.filter((x) => x > k),
	})),
	...[3, 4, 5].map((k) => ({
		what: `numero minore di ${k}`,
		none: `un numero minore di ${k}`,
		faces: FACES.filter((x) => x < k),
	})),
	{ what: 'multiplo di 3', none: 'un multiplo di 3', faces: [3, 6] },
];

/** Events on two dice, each a clause in the subjunctive after "che". */
function pairEvents(): Ev<Pair>[] {
	const out: Ev<Pair>[] = [{ kind: 'doppio', what: 'esca un doppio', test: ([a, b]) => a === b }];
	for (let s = 3; s <= 11; s++)
		out.push({
			kind: 'somma',
			what: `la somma sia ${s}`,
			test: ([a, b]) => a + b === s,
		});
	for (let s = 7; s <= 10; s++)
		out.push({
			kind: 'somma-maggiore',
			what: `la somma sia maggiore di ${s}`,
			test: ([a, b]) => a + b > s,
		});
	for (let s = 4; s <= 7; s++)
		out.push({
			kind: 'somma-minore',
			what: `la somma sia minore di ${s}`,
			test: ([a, b]) => a + b < s,
		});
	for (let k = 1; k <= 6; k++)
		out.push({
			kind: 'primo-dado',
			what: `il primo dado dia ${k}`,
			test: ([a]) => a === k,
		});
	for (let k = 1; k <= 6; k++)
		out.push({
			kind: 'secondo-dado',
			what: `il secondo dado dia ${k}`,
			test: ([, b]) => b === k,
		});
	for (let k = 1; k <= 6; k++)
		out.push({
			kind: 'almeno',
			what: `esca almeno un ${k}`,
			test: ([a, b]) => a === k || b === k,
		});
	out.push({
		kind: 'due-pari',
		what: 'escano due numeri pari',
		test: ([a, b]) => a % 2 === 0 && b % 2 === 0,
	});
	out.push({
		kind: 'due-dispari',
		what: 'escano due numeri dispari',
		test: ([a, b]) => a % 2 === 1 && b % 2 === 1,
	});
	return out;
}
const PAIR_EVENTS = pairEvents();

/** Two events of different kinds, compatible (common outcomes, neither inside the other) or incompatible; the union is never all of Ω. */
function eventPairs<T>(omega: readonly T[], evs: Ev<T>[], compatible: boolean): [Ev<T>, Ev<T>][] {
	const out: [Ev<T>, Ev<T>][] = [];
	for (const a of evs)
		for (const b of evs) {
			if (a.kind.split('-')[0] === b.kind.split('-')[0]) continue;
			const na = count(omega, a),
				nb = count(omega, b),
				nab = both(omega, a, b);
			if (na === 0 || nb === 0 || na + nb - nab === omega.length) continue;
			if (compatible ? nab === 0 || nab === na || nab === nb : nab !== 0) continue;
			out.push([a, b]);
		}
	return out;
}
const DIE_COMPATIBLE = eventPairs(FACES, DIE_EVENTS, true);
const DIE_INCOMPATIBLE = eventPairs(FACES, DIE_EVENTS, false);
const PAIR_COMPATIBLE = eventPairs(PAIRS, PAIR_EVENTS, true);
const PAIR_INCOMPATIBLE = eventPairs(PAIRS, PAIR_EVENTS, false);

// ---------------------------------------------------------------------------
// Urns

const COLOURS: { one: string; many: string }[] = [
	{ one: 'rossa', many: 'rosse' },
	{ one: 'blu', many: 'blu' },
	{ one: 'verde', many: 'verdi' },
	{ one: 'gialla', many: 'gialle' },
	{ one: 'bianca', many: 'bianche' },
	{ one: 'nera', many: 'nere' },
];

/** "a, b e c" */
const listIt = (xs: string[]) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);
/** "a, b o c" */
const orList = (xs: string[]) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} o ${xs[xs.length - 1]}`);

function drawUrn(rng: Rng, k: number): { colours: typeof COLOURS; counts: number[] } {
	for (let i = 0; i < 1000; i++) {
		const colours = shuffle(rng, COLOURS).slice(0, k);
		const counts = colours.map(() => rng.int(2, 9));
		const n = counts.reduce((a, b) => a + b, 0);
		if (n >= 10 && n <= 24 && new Set(counts).size >= k - 1) return { colours, counts };
	}
	throw new Error(`${ID}: no urn`);
}

function urnProse(colours: typeof COLOURS, counts: number[]): string {
	const parts = colours.map((c, i) => (i === 0 ? `${counts[i]} palline ${c.many}` : `${counts[i]} ${c.many}`));
	return `Un'urna contiene ${listIt(parts)}. Si estrae una pallina senza guardare.`;
}

// ---------------------------------------------------------------------------
// Built exercise

interface Built {
	problem: string;
	steps: string[];
	solution: string;
	answer: Rational;
	/** Wrong answers from the mistakes of the lesson, in order of preference. */
	mistakes: Rational[];
	/** The natural denominator (the number of outcomes), for the neighbouring distractors. */
	den: number;
	params: Record<string, unknown>;
}

const DECK_PROSE = 'Si pesca una carta dal mazzo di 40 carte napoletane.';

// Level 1: the complementary event ------------------------------------------

function level1(rng: Rng): Built {
	const kind = weighted<string>(rng, [
		['dado', 1],
		['mazzo', 1],
		['urna', 1],
		['astratto', 1],
	]);
	if (kind === 'astratto') {
		const den = rng.int(5, 12);
		let num = rng.int(1, den - 1);
		while (q(num, den).den !== den || 2 * num === den) num = rng.int(1, den - 1);
		const given = q(num, den);
		const ans = q(1).sub(given);
		const reverse = rng.next() < 0.5;
		const [gl, al] = reverse ? ['p(\\overline{E})', 'p(E)'] : ['p(E)', 'p(\\overline{E})'];
		return {
			problem: textBlock(`Di un evento $E$ si conosce la probabilità${reverse ? " dell'evento contrario" : ''}.`, 46, [`${gl} = ${fr(given)}`, `${al} = \\ ?`]),
			steps: [`${t('La somma delle probabilità di un evento e del suo contrario è ')}1`, `${al} = 1 - ${fr(given)} = ${fr(ans)}`],
			solution: `${al} = ${fr(ans)}`,
			answer: ans,
			mistakes: [given, given.sub(q(1))],
			den,
			params: { case: kind, given: given.toString(), reverse },
		};
	}
	let prose = '',
		what = '',
		k = 1,
		n = 2,
		space = '';
	// "p(E)" would be a distractor equal to the answer when k = n/2.
	for (let tries = 0; 2 * k === n; tries++) {
		if (tries > 1000) throw new Error(`${ID}: no level 1 event`);
		if (kind === 'dado') {
			const ev = rng.pick(DIE_EVENTS);
			prose = 'Si lancia un dado.';
			what = ev.what;
			k = count(FACES, ev);
			n = 6;
			space = t('le 6 facce del dado');
		} else if (kind === 'mazzo') {
			const type = rng.pick(['figura', 'valore', 'seme', 'figura-seme', 'carta']);
			const s = rng.pick(SUITS);
			const v = rng.int(1, 10);
			const ev: Ev<Card> =
				type === 'figura'
					? FIGURE
					: type === 'valore'
						? valueEv(v)
						: type === 'seme'
							? suitEv(s)
							: type === 'figura-seme'
								? {
										kind: type,
										what: `una figura di ${s}`,
										test: (c) => c.v >= 8 && c.s === s,
									}
								: {
										kind: type,
										what: cardName(v, s),
										test: (c) => c.v === v && c.s === s,
									};
			prose = DECK_PROSE;
			what = ev.what;
			k = count(DECK, ev);
			n = 40;
			space = t('le 40 carte');
		} else {
			const { colours, counts } = drawUrn(rng, 3);
			const i = rng.int(0, 2);
			prose = urnProse(colours, counts);
			n = counts.reduce((a, b) => a + b, 0);
			k = counts[i];
			what = colours[i].one;
			space = t(`le ${n} palline`);
		}
	}
	const urn = kind === 'urna';
	const question = urn ? `Qual è la probabilità che la pallina estratta non sia ${what}?` : `Qual è la probabilità che non esca ${what}?`;
	const pE = q(k, n);
	const ans = q(1).sub(pE);
	return {
		problem: textBlock(`${prose} ${question}`),
		steps: [
			`${t('Gli esiti equiprobabili sono ')}${space}`,
			`E${t(urn ? `: la pallina è ${what}, ${k} casi favorevoli` : `: esce ${what}, ${k} ${k === 1 ? 'caso favorevole' : 'casi favorevoli'}`)}`,
			`p(E) = ${counted(k, n)}`,
			`p(\\overline{E}) = 1 - ${fr(pE)} = ${fr(ans)}`,
			`${t('Controllo contando: ')}${n} - ${k} = ${n - k}${t(' casi, e ')}${counted(n - k, n)}`,
		],
		solution: `p(\\overline{E}) = ${fr(ans)}`,
		answer: ans,
		mistakes: [pE, pE.sub(q(1))],
		den: n,
		params: { case: kind, favourable: String(k), total: String(n) },
	};
}

// Level 2: at least one ------------------------------------------------------

function level2(rng: Rng): Built {
	if (rng.next() < 0.6) {
		const set = rng.next() < 0.5 ? FACE_SETS[rng.int(0, 5)] : rng.pick(FACE_SETS.slice(6));
		const m = set.faces.length;
		const none = (6 - m) ** 2;
		const ans = q(36 - none, 36);
		const exactlyOne = 2 * m * (6 - m);
		const single = m === 1;
		return {
			problem: textBlock(`Si lanciano due dadi. Qual è la probabilità che esca almeno un ${set.what}?`),
			steps: [
				`${t('Gli esiti equiprobabili sono le ')}36${t(' coppie ')}(a, b)`,
				`${t("L'evento contrario è: nessuno dei due dadi dà ")}${t(set.none)}`,
				`${t('Ogni dado ha ')}${6 - m}${t(` facce che non ${single ? `sono ${set.none}` : 'vanno bene'}, quindi le coppie sono `)}${6 - m} \\cdot ${6 - m} = ${none}`,
				`p(\\overline{E}) = ${counted(none, 36)}`,
				`p(E) = 1 - ${fr(q(none, 36))} = ${fr(ans)}`,
			],
			solution: `p = ${fr(ans)}`,
			answer: ans,
			mistakes: [q(2 * m, 6), q(exactlyOne, 36), q(none, 36), q(36 - exactlyOne, 36)],
			den: 36,
			params: { case: 'dadi', faces: set.faces.map(String) },
		};
	}
	const coins = weighted(rng, [
		[2, 1],
		[3, 2],
		[4, 1],
	]);
	const face = rng.pick(['testa', 'croce']);
	const other = face === 'testa' ? 'C' : 'T';
	const total = 2 ** coins;
	const ans = q(total - 1, total);
	return {
		problem: textBlock(`Si lanciano ${WORDS[coins]} monete. Qual è la probabilità che esca almeno una ${face}?`),
		steps: [
			`${t('Gli esiti equiprobabili sono ')}${Array.from({ length: coins }, () => '2').join(' \\cdot ')} = ${total}`,
			`${t(`L'evento contrario è: non esce nessuna ${face}, cioè l'unico esito `)}${other.repeat(coins)}`,
			`p(\\overline{E}) = \\dfrac{1}{${total}}`,
			`p(E) = 1 - \\dfrac{1}{${total}} = ${fr(ans)}`,
		],
		solution: `p = ${fr(ans)}`,
		answer: ans,
		mistakes: [q(1, total), q(coins, total), q(total - coins, total), q(coins, 2)],
		den: total,
		params: { case: 'monete', coins: String(coins), face },
	};
}

// Level 3: union of incompatible events --------------------------------------

function unionSteps(names: string[], ks: number[], n: number, inter: number | null): string[] {
	const sum = ks.reduce((a, b) => a + b, 0) - (inter ?? 0);
	const terms = ks.map((k) => `\\dfrac{${k}}{${n}}`).join(' + ') + (inter ? ` - \\dfrac{${inter}}{${n}}` : '');
	const lhs = names.length === 2 ? `p(A \\cup B)` : `p(${names.join(' \\cup ')})`;
	return [`${lhs} = ${terms}`, `= ${counted(sum, n)}`];
}

function level3(rng: Rng): Built {
	const kind = weighted<string>(rng, [
		['mazzo', 1],
		['urna', 1],
		['dado', 1],
	]);
	if (kind === 'urna') {
		const three = rng.next() < 0.25;
		const { colours, counts } = drawUrn(rng, three ? 4 : 3);
		const idx = shuffle(
			rng,
			colours.map((_, i) => i),
		).slice(0, three ? 3 : 2);
		const n = counts.reduce((a, b) => a + b, 0);
		const ks = idx.map((i) => counts[i]);
		const S = ks.reduce((a, b) => a + b, 0);
		const ans = q(S, n);
		const names = three ? ['A', 'B', 'C'] : ['A', 'B'];
		return {
			problem: textBlock(`${urnProse(colours, counts)} Qual è la probabilità che la pallina estratta sia ${orList(idx.map((i) => colours[i].one))}?`),
			steps: [
				`${idx.map((i, j) => `${names[j]}${t(`: la pallina è ${colours[i].one}, ${counts[i]} casi`)}`).join(',\\ ')}`,
				`${t(three ? 'Gli eventi sono incompatibili a due a due: una pallina ha un solo colore' : 'Gli eventi sono incompatibili: una pallina ha un solo colore')}`,
				...unionSteps(names, ks, n, null),
			],
			solution: `p = ${fr(ans)}`,
			answer: ans,
			mistakes: [ks.reduce((a, k) => a.mul(q(k, n)), q(1)), q(S, n * ks.length), q(1).sub(ans), q(ks[0], n)],
			den: n,
			params: {
				case: 'urna',
				colours: colours.map((c) => c.one),
				counts: counts.map(String),
				asked: idx.map((i) => colours[i].one),
			},
		};
	}
	let a: Ev<Card> | Ev<Die>, b: Ev<Card> | Ev<Die>, n: number, ka: number, kb: number, prose: string;
	if (kind === 'mazzo') {
		const type = rng.pick(['valori', 'valore-figura', 'semi']);
		let ea: Ev<Card>, eb: Ev<Card>;
		if (type === 'valori') {
			const [v1, v2] = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
			[ea, eb] = [valueEv(v1), valueEv(v2)];
		} else if (type === 'valore-figura') {
			[ea, eb] = [valueEv(rng.int(1, 7)), FIGURE];
			if (rng.next() < 0.5) [ea, eb] = [eb, ea];
		} else {
			const [s1, s2] = shuffle(rng, SUITS);
			[ea, eb] = [suitEv(s1), suitEv(s2)];
		}
		[a, b, n, ka, kb, prose] = [ea, eb, 40, count(DECK, ea), count(DECK, eb), DECK_PROSE];
	} else {
		const [ea, eb] = rng.pick(DIE_INCOMPATIBLE);
		[a, b, n, ka, kb, prose] = [ea, eb, 6, count(FACES, ea), count(FACES, eb), 'Si lancia un dado.'];
	}
	const ans = q(ka + kb, n);
	return {
		problem: textBlock(`${prose} Qual è la probabilità che esca ${a.what} o ${b.what}?`),
		steps: [
			`A${t(`: esce ${a.what}, ${casi(ka)}`)},\\ B${t(`: esce ${b.what}, ${casi(kb)}`)}`,
			`${t('Nessun esito sta in tutti e due: gli eventi sono incompatibili, e ')}A \\cap B = \\emptyset`,
			...unionSteps(['A', 'B'], [ka, kb], n, null),
		],
		solution: `p(A \\cup B) = ${fr(ans)}`,
		answer: ans,
		mistakes: [q(ka, n).mul(q(kb, n)), q(ka + kb, 2 * n), q(1).sub(ans), q(Math.max(ka, kb), n)],
		den: n,
		params: { case: kind, a: a.what, b: b.what },
	};
}

// Level 4: union of compatible events, one die or the deck -------------------

function level4(rng: Rng): Built {
	const deck = rng.next() < 0.5;
	let a: Ev<Card> | Ev<Die>, b: Ev<Card> | Ev<Die>, n: number, ka: number, kb: number, kab: number, prose: string, interLine: string;
	if (deck) {
		const s = rng.pick(SUITS);
		const other = rng.next() < 0.4 ? FIGURE : valueEv(rng.int(1, 10));
		let [ea, eb] = [suitEv(s), other];
		if (rng.next() < 0.5) [ea, eb] = [eb, ea];
		[a, b, n, prose] = [ea, eb, 40, DECK_PROSE];
		[ka, kb, kab] = [count(DECK, ea), count(DECK, eb), both(DECK, ea, eb)];
		const common = other === FIGURE ? `le figure di ${s}` : cardName(DECK.find((c) => other.test(c) && c.s === s)!.v, s);
		interLine = `A \\cap B${t(`: ${common}, ${kab} ${kab === 1 ? 'carta' : 'carte'}`)}`;
	} else {
		const [ea, eb] = rng.pick(DIE_COMPATIBLE);
		[a, b, n, prose] = [ea, eb, 6, 'Si lancia un dado.'];
		[ka, kb, kab] = [count(FACES, ea), count(FACES, eb), both(FACES, ea, eb)];
		const set = (e: Ev<Die>) => `\\{${FACES.filter(e.test).join(', ')}\\}`;
		interLine = `A = ${set(ea)},\\quad B = ${set(eb)},\\quad A \\cap B = \\{${FACES.filter((x) => ea.test(x) && eb.test(x)).join(', ')}\\}`;
	}
	const ans = q(ka + kb - kab, n);
	return {
		problem: textBlock(`${prose} Qual è la probabilità che esca ${a.what} o ${b.what}?`),
		steps: [
			`A${t(`: esce ${a.what}, ${casi(ka)}`)},\\ B${t(`: esce ${b.what}, ${casi(kb)}`)}`,
			interLine,
			`${t('Gli eventi sono compatibili: gli esiti comuni si tolgono una volta')}`,
			...unionSteps(['A', 'B'], [ka, kb], n, kab),
		],
		solution: `p(A \\cup B) = ${fr(ans)}`,
		answer: ans,
		mistakes: [q(ka + kb, n), q(ka + kb - 2 * kab, n), q(kab, n), q(1).sub(ans)],
		den: n,
		params: { case: deck ? 'mazzo' : 'dado', a: a.what, b: b.what },
	};
}

// Level 5: union with two dice -----------------------------------------------

function level5(rng: Rng): Built {
	const compatible = rng.next() < 0.75;
	const [a, b] = rng.pick(compatible ? PAIR_COMPATIBLE : PAIR_INCOMPATIBLE);
	const ka = count(PAIRS, a),
		kb = count(PAIRS, b),
		kab = both(PAIRS, a, b);
	const ans = q(ka + kb - kab, 36);
	const common = PAIRS.filter((o) => a.test(o) && b.test(o)).map(([x, y]) => `(${x}, ${y})`);
	const commonLine =
		kab === 0
			? `${t('Nessuna coppia sta in tutti e due: gli eventi sono incompatibili, e ')}A \\cap B = \\emptyset`
			: kab <= 3
				? `A \\cap B = \\{${common.join(',\\ ')}\\}${t(`: ${kab} ${kab === 1 ? 'coppia' : 'coppie'}`)}`
				: `A \\cap B${t(`: ${kab} coppie, `)}${common.slice(0, 2).join(',\\ ')},\\ \\dots`;
	const mistakes = compatible
		? [q(ka + kb, 36), q(ka + kb - 2 * kab, 36), q(kab, 36), q(1).sub(ans)]
		: [q(ka + kb - 1, 36), q(ka, 36).mul(q(kb, 36)), q(1).sub(ans), q(Math.max(ka, kb), 36)];
	return {
		problem: textBlock(`Si lanciano due dadi. Qual è la probabilità che ${a.what} o che ${b.what}?`),
		steps: [
			`${t('Gli esiti equiprobabili sono le ')}36${t(' coppie ')}(a, b)`,
			`A${t(
				`: ${a.what
					.replace(/\bsia\b/, 'è')
					.replace(/\bdia\b/, 'dà')
					.replace(/^esca\b/, 'esce')
					.replace(/^escano\b/, 'escono')}, ${ka} coppie`,
			)}`,
			`B${t(
				`: ${b.what
					.replace(/\bsia\b/, 'è')
					.replace(/\bdia\b/, 'dà')
					.replace(/^esca\b/, 'esce')
					.replace(/^escano\b/, 'escono')}, ${kb} coppie`,
			)}`,
			commonLine,
			...unionSteps(['A', 'B'], [ka, kb], 36, kab),
		],
		solution: `p(A \\cup B) = ${fr(ans)}`,
		answer: ans,
		mistakes,
		den: 36,
		params: {
			case: compatible ? 'compatibili' : 'incompatibili',
			a: a.what,
			b: b.what,
		},
	};
}

// Level 6: two-way table -----------------------------------------------------

interface TableCtx {
	id: string;
	/** Prose with the four numbers, as in example 8. */
	text: (N: number, x: number, z: number, w: number) => string;
	/** Prose before a full table. */
	intro: (N: number) => string;
	pick: string;
	groups: [string, string];
	/** Clause after "che": "sia una ragazza". */
	is: [string, string];
	/** Clause after "che": "porti gli occhiali". */
	has: string;
	cols: [string, string];
}

const TABLE_CTX: TableCtx[] = [
	{
		id: 'classe',
		text: (N, x, z, w) => `In una classe di ${N} studenti ci sono ${x} ragazze e ${N - x} ragazzi; portano gli occhiali ${z} studenti, di cui ${w} ragazze.`,
		intro: (N) => `La tabella descrive i ${N} studenti di una classe.`,
		pick: 'Si sceglie a caso uno studente.',
		groups: ['Ragazze', 'Ragazzi'],
		is: ['sia una ragazza', 'sia un ragazzo'],
		has: 'porti gli occhiali',
		cols: ['Occhiali', 'Senza'],
	},
	{
		id: 'atletica',
		text: (N, x, z, w) => `In una squadra di atletica di ${N} atleti ci sono ${x} ragazze e ${N - x} ragazzi; fanno anche nuoto ${z} atleti, di cui ${w} ragazze.`,
		intro: (N) => `La tabella descrive i ${N} atleti di una squadra di atletica, e chi fa anche nuoto.`,
		pick: 'Si sceglie a caso un atleta.',
		groups: ['Ragazze', 'Ragazzi'],
		is: ['sia una ragazza', 'sia un ragazzo'],
		has: 'faccia anche nuoto',
		cols: ['Nuoto', 'Senza'],
	},
	{
		id: 'gita',
		text: (N, x, z, w) => `Alla gita scolastica partecipano ${N} studenti, ${x} di prima e ${N - x} di seconda; ${z} portano il pranzo al sacco, di cui ${w} di prima.`,
		intro: (N) => `La tabella descrive i ${N} studenti di una gita scolastica, e chi porta il pranzo al sacco.`,
		pick: 'Si sceglie a caso uno studente.',
		groups: ['Prima', 'Seconda'],
		is: ['sia di prima', 'sia di seconda'],
		has: 'porti il pranzo al sacco',
		cols: ['Pranzo', 'Senza'],
	},
	{
		id: 'fumetti',
		text: (N, x, z, w) => `Si intervistano ${N} studenti, ${x} del biennio e ${N - x} del triennio; ${z} leggono fumetti, di cui ${w} del biennio.`,
		intro: (N) => `La tabella descrive ${N} studenti intervistati, e chi legge fumetti.`,
		pick: 'Si sceglie a caso uno degli intervistati.',
		groups: ['Biennio', 'Triennio'],
		is: ['sia del biennio', 'sia del triennio'],
		has: 'legga fumetti',
		cols: ['Fumetti', 'Senza'],
	},
];

function twoWay(ctx: TableCtx, N: number, x: number, z: number, w: number): string {
	const rows = [
		[t(ctx.groups[0]), w, x - w, x],
		[t(ctx.groups[1]), z - w, N - x - (z - w), N - x],
	];
	const body = rows.map((r) => r.join(' & ')).join(' \\\\ ');
	return `\\begin{array}{c|c|c|c} & ${t(ctx.cols[0])} & ${t(ctx.cols[1])} & ${t('Totale')} \\\\ \\hline ${body} \\\\ \\hline ${t('Totale')} & ${z} & ${N - z} & ${N} \\end{array}`;
}

function level6(rng: Rng): Built {
	const ctx = rng.pick(TABLE_CTX);
	const table = rng.next() < 0.5;
	const neither = rng.next() < 0.5;
	const g = rng.next() < 0.5 ? 0 : 1;
	for (let i = 0; i < 10000; i++) {
		const N = rng.int(20, 32);
		const x = rng.int(6, N - 6);
		const z = rng.int(5, N - 5);
		const w = rng.int(2, Math.min(x, z) - 1);
		const cells = [w, x - w, z - w, N - x - z + w];
		if (cells.some((c) => c < 1) || new Set(cells).size < 3) continue;
		const nA = g === 0 ? x : N - x;
		const nAB = g === 0 ? w : z - w;
		const nU = nA + z - nAB;
		const nNone = N - nU;
		const ans = q(neither ? nNone : nU, N);
		if (ans.num === 1 && ans.den === 1) continue;
		const clause = neither ? `non ${ctx.is[g]} né ${ctx.has}` : `${ctx.is[g]} o ${ctx.has}`;
		const question = `${ctx.pick} Qual è la probabilità che ${clause}?`;
		const problem = table ? textBlock(`${ctx.intro(N)} ${question}`, 46, [twoWay(ctx, N, x, z, w)]) : textBlock(`${ctx.text(N, x, z, w)} ${question}`);
		const steps: string[] = [];
		if (!table) steps.push(t('Si completa la tabella, con le differenze:'), twoWay(ctx, N, x, z, w));
		steps.push(
			`A${t(`: ${ctx.is[g].replace(/^sia /, 'è ')}, ${nA} casi`)},\\ B${t(
				`: ${ctx.has
					.replace(/^porti/, 'porta')
					.replace(/^faccia/, 'fa')
					
					.replace(/^legga/, 'legge')}, ${z} casi`,
			)}`,
			`A \\cap B${t(`: ${nAB} casi, nella riga ${ctx.groups[g]}, colonna ${ctx.cols[0]}`)}`,
			...unionSteps(['A', 'B'], [nA, z], N, nAB),
		);
		if (neither)
			steps.push(
				`${t('Il contrario di ')}A \\cup B${t(' è né ')}A${t(' né ')}B\\text{: }p = 1 - ${fr(q(nU, N))} = ${fr(ans)}`,
				`${t(`Controllo nella tabella: riga ${ctx.groups[1 - g]}, colonna ${ctx.cols[1]}: `)}${nNone}`,
			);
		const mistakes = neither
			? [q(nU, N), q(N - nA - z, N), q(nAB, N), q(N - nA - z + 2 * nAB, N)]
			: [q(nA + z, N), q(nAB, N), q(nA + z - 2 * nAB, N), q(nNone, N), ...(g === 1 ? [q(nA + z - w, N)] : [])];
		return {
			problem,
			steps,
			solution: `p = ${fr(ans)}`,
			answer: ans,
			mistakes,
			den: N,
			params: {
				case: `${table ? 'tabella' : 'testo'}-${neither ? 'nessuno' : 'unione'}`,
				context: ctx.id,
				group: String(g),
				total: String(N),
				first: String(x),
				attribute: String(z),
				both: String(w),
			},
		};
	}
	throw new Error(`${ID}: no table`);
}

// ---------------------------------------------------------------------------
// Assembly

const LEVELS = [level1, level2, level3, level4, level5, level6];

function generate(rng: Rng, level: number): Sample {
	const f = LEVELS[level - 1];
	if (!f) throw new Error(`${ID}: unknown level ${level}`);
	const b = f(rng);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Calcola la probabilità.',
		problem: b.problem,
		solution: b.solution,
		steps: b.steps,
		answer: { kind: 'number', value: b.answer.toString() },
		params: {
			...b.params,
			den: String(b.den),
			mistakes: b.mistakes.map((m) => m.toString()),
		},
	};
}

/** The answer, the mistakes that are different and at most 1 (a negative one only when it is 1 - p taken backwards), then neighbours k/n. */
function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${s.answer.kind}`);
	const ans = Rational.parse(s.answer.value);
	const opts: ChoiceOption[] = [{ latex: fr(ans), values: [ans.toString()] }];
	const add = (r: Rational, allowNegative = false) => {
		if (opts.length >= 4 || r.compare(q(1)) > 0 || r.isZero() || (r.sign() < 0 && !allowNegative)) return;
		if (opts.some((o) => o.values[0] === r.toString())) return;
		opts.push({ latex: fr(r), values: [r.toString()] });
	};
	const mistakes = ((s.params.mistakes as string[]) ?? []).map((m) => Rational.parse(m));
	mistakes.forEach((m) => add(m, s.level === 1));
	for (const n of [Number(s.params.den), 2 * Number(s.params.den)]) {
		const k = ans.mul(q(n));
		for (let d = 1; opts.length < 4 && d < n; d++) {
			for (const c of [k.add(q(d)), k.sub(q(d))]) if (c.sign() > 0 && c.compare(q(n)) < 0) add(c.div(q(n)));
		}
	}
	if (opts.length !== 4) throw new Error(`${ID}: ${opts.length} options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return {
		kind: 'choice',
		options: order.map((i) => opts[i]),
		correct: order.indexOf(0),
	};
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	if (s.answer.kind !== 'number') return ['risposta non numerica'];
	const ans = Rational.parse(s.answer.value);
	if (ans.sign() <= 0 || ans.compare(q(1)) >= 0) v.push(`probabilità ${ans.toString()} fuori da ]0, 1[`);
	if (!s.steps.length) v.push('passaggi mancanti');
	if (/—|piuttosto che/.test(s.problem + s.steps.join(' ') + s.solution)) v.push('parole vietate');
	if (!s.solution.endsWith(fr(ans))) v.push('la soluzione non dice la risposta');
	const p = s.params as Record<string, string>;
	const expect = (r: Rational) => {
		if (!r.equals(ans)) v.push(`risposta ${ans.toString()} invece di ${r.toString()}`);
	};
	switch (s.level) {
		case 1:
			if (p.case === 'astratto') expect(q(1).sub(Rational.parse(p.given)));
			else expect(q(Number(p.total) - Number(p.favourable), Number(p.total)));
			break;
		case 2:
			if (p.case === 'monete') expect(q(2 ** Number(p.coins) - 1, 2 ** Number(p.coins)));
			else expect(q(36 - (6 - (p.faces as unknown as string[]).length) ** 2, 36));
			break;
		case 6: {
			const [N, x, z, w, g] = [p.total, p.first, p.attribute, p.both, p.group].map(Number);
			const nA = g === 0 ? x : N - x,
				nAB = g === 0 ? w : z - w;
			const nU = nA + z - nAB;
			expect(q(p.case.endsWith('nessuno') ? N - nU : nU, N));
			break;
		}
	}
	return v;
}

export const leggiProbabilita: Generator = {
	id: ID,
	title: "Probabilità della somma e dell'evento contrario",
	levels: {
		1: {
			label: 'Evento contrario',
			constraints: ['un dado, il mazzo di 40 carte, un’urna o una probabilità data, un quarto ciascuno', 'risposta 1 - p(E), frazione ridotta tra 0 e 1'],
		},
		2: {
			label: 'Almeno uno',
			constraints: ['due dadi (60%) o da due a quattro monete (40%)', 'si conta il contrario, nessuno'],
		},
		3: {
			label: 'Unione di eventi incompatibili',
			constraints: ['mazzo, urna (anche tre colori) o dado, un terzo ciascuno', 'p(A) + p(B)'],
		},
		4: {
			label: 'Unione di eventi compatibili',
			constraints: ['mazzo (seme e figura o valore) o dado, metà ciascuno', 'p(A) + p(B) - p(A ∩ B), eventi non contenuti uno nell’altro'],
		},
		5: {
			label: 'Unione con due dadi',
			constraints: ['75% eventi compatibili, 25% incompatibili', 'unione mai uguale a tutto Ω'],
		},
		6: {
			label: 'Tabella a doppia entrata',
			constraints: ['testo o tabella, unione o né... né..., un quarto ciascuno', 'N tra 20 e 32, ogni casella almeno 1'],
		},
	},
	generate,
	check,
	toChoice,
};

export default leggiProbabilita;
