/**
 * Eventi e probabilità (lesson slug concetti-probabilita). Spec: specs/exercises/concetti-probabilita.md
 *
 * Seven levels in the order of the lesson: the classical probability of an event on a die or on an
 * urn of numbered balls; certain, impossible and elementary events, and compatible or incompatible
 * events; two or three coins (and a die with a coin), where the outcomes are ordered; an urn of
 * coloured balls, where the outcomes are the balls and not the colours; the deck of 40 cards; the sum
 * of two dice; the relative frequency as an estimate of a probability. Every probability is counted
 * on an enumerated sample space, and the favourable outcomes go in params.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { buildChoice, decimalLatex, toDecimal } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'concetti-probabilita';

// ---------------------------------------------------------------------------
// Helpers

const t = (s: string) => `\\text{${s}}`;
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
/** A number inside prose: from five digits with a thin space, as inline math ($10\\,000$). */
const big = (n: number) => (n >= 10000 ? `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')}$` : String(n));

/** A probability as the lesson writes it: 0, 1 or \dfrac{p}{q}. */
function fracTex(r: Rational): string {
	return r.isInteger() ? `${r.num}` : `\\dfrac{${r.num}}{${r.den}}`;
}

/** "\dfrac{3}{6} = \dfrac{1}{2}": the count, then the reduced value when it differs. */
function countTex(k: number, n: number): string {
	const r = q(k, n);
	const raw = `\\dfrac{${k}}{${n}}`;
	return r.num === k && r.den === n ? raw : `${raw} = ${fracTex(r)}`;
}

/** Items of a list as separate formulas with text commas between them, so a long list wraps. */
const inline = (items: string[]) => items.join(t(', '));

function setTex(items: string[]): string {
	return items.length ? `\\{${items.join(', ')}\\}` : '\\emptyset';
}

function isPrime(n: number): boolean {
	if (n < 2) return false;
	for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
	return true;
}

function weighted<T>(rng: Rng, items: [T, number][]): T {
	const total = items.reduce((s, [, w]) => s + w, 0);
	let u = rng.next() * total;
	for (const [v, w] of items) {
		if (u < w) return v;
		u -= w;
	}
	return items[items.length - 1][0];
}

// ---------------------------------------------------------------------------
// Events on one number (a die, an urn of numbered balls)

interface NumEvent {
	kind: string;
	/** The noun after "esce": "un numero pari", "un multiplo di 3", "5". */
	noun: string;
	members: number[];
}

/** Every event of the catalogue on the numbers 1..n. */
function numberEvents(n: number, die: boolean): NumEvent[] {
	const all = range(1, n);
	const out: NumEvent[] = [];
	const add = (kind: string, noun: string, f: (x: number) => boolean) => out.push({ kind, noun, members: all.filter(f) });
	add('pari', 'un numero pari', (x) => x % 2 === 0);
	add('dispari', 'un numero dispari', (x) => x % 2 === 1);
	add('primo', 'un numero primo', isPrime);
	for (const m of die ? [3, 4, 5, 7] : [3, 4, 5, 6, 7, 10, 40]) add('multiplo', `un multiplo di ${m}`, (x) => x % m === 0);
	for (let k = 0; k <= n + 2; k++) add('maggiore', `un numero maggiore di ${k}`, (x) => x > k);
	for (let k = 1; k <= n + 4; k++) add('minore', `un numero minore di ${k}`, (x) => x < k);
	for (let k = 1; k <= n; k++) add('diverso', `un numero diverso da ${k}`, (x) => x !== k);
	for (let k = 0; k <= n + 1; k++) add('esatto', `${k}`, (x) => x === k);
	for (const d of die ? [4, 6, 12] : [12, 16, 18, 20, 24, 30]) add('divisore', `un divisore di ${d}`, (x) => d % x === 0);
	if (!die) add('quadrato', 'un quadrato perfetto', (x) => Number.isInteger(Math.sqrt(x)));
	return out;
}

/** Picks a kind first, then one of its events, among those that pass `ok`. */
function pickEvent(rng: Rng, events: NumEvent[], ok: (e: NumEvent) => boolean): NumEvent {
	const good = events.filter(ok);
	const kinds = [...new Set(good.map((e) => e.kind))];
	if (!kinds.length) throw new Error(`${ID}: no event`);
	const kind = rng.pick(kinds);
	return rng.pick(good.filter((e) => e.kind === kind));
}

// ---------------------------------------------------------------------------
// Multiple choice

function probOption(r: Rational): ChoiceOption {
	return { latex: fracTex(r), values: [r.toString()] };
}

/** The answer, the mistakes strictly between 0 and 1 (0 and 1 would give themselves away), then neighbours k ± d over n. */
function probChoice(rng: Rng, answer: Rational, mistakes: Rational[], k: number, n: number): ChoiceAnswer {
	const inRange = (r: Rational) => r.sign() > 0 && r.compare(q(1)) < 0;
	return buildChoice(
		rng,
		probOption(answer),
		mistakes.filter(inRange).map(probOption),
		(i) => {
			// Neighbours k ± d over n; with few outcomes (two coins) they run out, then other small fractions.
			if (i < 2 * n) {
				const d = Math.floor(i / 2) + 1;
				const kk = i % 2 ? k - d : k + d;
				return kk > 0 && kk < n ? probOption(q(kk, n)) : null;
			}
			const extra = [q(1, 3), q(2, 3), q(1, 8), q(3, 8), q(1, 6), q(5, 8)];
			return i - 2 * n < extra.length ? probOption(extra[i - 2 * n]) : null;
		},
	);
}

/** A decimal with at most three digits after the comma, or null. */
function decTex(r: Rational): string | null {
	const d = toDecimal(r, 3, 0);
	if (!d) return null;
	const s = decimalLatex(d);
	const m = /^(-?)(\d+)(.*)$/.exec(s)!;
	return m[2].length >= 5 ? `${m[1]}${m[2].replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')}${m[3]}` : s;
}

function decChoice(rng: Rng, answer: Rational, mistakes: Rational[], step: Rational): ChoiceAnswer {
	const opt = (r: Rational): ChoiceOption | null => {
		const s = decTex(r);
		return s !== null && r.sign() >= 0 ? { latex: s, values: [r.toString()] } : null;
	};
	return buildChoice(rng, opt(answer)!, mistakes.map(opt), (i) => {
		const d = Math.floor(i / 2) + 1;
		return opt(i % 2 ? answer.sub(step.mul(q(d))) : answer.add(step.mul(q(d))));
	});
}

// ---------------------------------------------------------------------------
// Levels

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: Answer;
	mistakes?: Rational[];
	params: Record<string, unknown>;
}

const PROMPT = "Calcola la probabilità dell'evento.";

/** The common steps of a classical probability: cases possible, cases favourable, the ratio. */
function classical(possible: string, favourable: string[], k: number, n: number, name = 'p'): string[] {
	return [
		possible,
		k === 0 ? t('Nessun esito è favorevole.') : `${t(k === 1 ? 'Il caso favorevole è ' : `I casi favorevoli sono ${k}: `)}${inline(favourable)}`,
		`${name} = \\dfrac{${t('casi favorevoli')}}{${t('casi possibili')}} = ${countTex(k, n)}`,
	];
}

// Level 1: one die or an urn of numbered balls ---------------------------------

function level1(rng: Rng): Built {
	const die = rng.next() < 0.5;
	const n = die ? 6 : rng.pick([10, 12, 15, 16, 18, 20, 24, 25, 30]);
	const e = pickEvent(rng, numberEvents(n, die), (x) => x.members.length >= 2 && x.members.length < n && x.kind !== 'esatto');
	const k = e.members.length;
	const p = q(k, n);
	const setting = die ? 'Si lancia un dado non truccato.' : `Un'urna contiene ${n} palline numerate da 1 a ${n}, tutte uguali al tatto. Se ne estrae una senza guardare.`;
	return {
		prompt: PROMPT,
		problem: textBlock(`${setting} Evento: "esce ${e.noun}".`),
		steps: classical(`${t('I casi possibili sono le ')}${n}${t(die ? ' facce, tutte equiprobabili.' : ' palline, tutte equiprobabili.')}`, e.members.map(String), k, n),
		solution: `p = ${fracTex(p)}`,
		answer: { kind: 'number', value: p.toString() },
		mistakes: [q(n - k, n), q(1, 2), q(k, n - k), q(1, n)],
		params: { case: die ? 'dado' : 'urna', total: n, event: e.noun, favorable: e.members.map(String) },
	};
}

// Level 2: certain, impossible, elementary; compatible or incompatible --------

const TYPE_OPTIONS = [
	{ key: 'certo', latex: t('evento certo') },
	{ key: 'impossibile', latex: t('evento impossibile') },
	{ key: 'elementare', latex: t('evento elementare') },
	{ key: 'nessuno', latex: t('nessuno dei tre') },
];

interface CoinEvent {
	phrase: string;
	members: string[];
}

/** Events on two coins, with Ω = {TT, TC, CT, CC}. */
function twoCoinEvents(): CoinEvent[] {
	const omega = ['TT', 'TC', 'CT', 'CC'];
	const heads = (w: string) => [...w].filter((c) => c === 'T').length;
	const ev = (phrase: string, f: (w: string) => boolean): CoinEvent => ({ phrase, members: omega.filter(f) });
	return [
		ev('escono due teste', (w) => heads(w) === 2),
		ev('escono due croci', (w) => heads(w) === 0),
		ev('escono una testa e una croce', (w) => heads(w) === 1),
		ev('esce almeno una testa', (w) => heads(w) >= 1),
		ev('esce almeno una croce', (w) => heads(w) <= 1),
		ev('escono due facce uguali', (w) => w[0] === w[1]),
		ev('escono due facce diverse', (w) => w[0] !== w[1]),
		ev('la prima moneta dà testa', (w) => w[0] === 'T'),
		ev('la prima moneta dà croce', (w) => w[0] === 'C'),
		ev('la seconda moneta dà testa', (w) => w[1] === 'T'),
		ev('la seconda moneta dà croce', (w) => w[1] === 'C'),
		ev('non esce nessuna testa', (w) => heads(w) === 0),
		ev('escono tre teste', () => false),
		ev('escono al massimo due teste', () => true),
		ev('escono al massimo due croci', () => true),
	];
}

function typeOf(size: number, n: number): string {
	return size === 0 ? 'impossibile' : size === n ? 'certo' : size === 1 ? 'elementare' : 'nessuno';
}

const TYPE_WHY: Record<string, string> = {
	certo: "Contiene tutti gli esiti: è l'evento certo, si verifica sempre.",
	impossibile: "Non contiene nessun esito: è l'evento impossibile, non si verifica mai.",
	elementare: 'Contiene un solo esito: è un evento elementare.',
	nessuno: 'Contiene più di un esito ma non tutti: non è né certo, né impossibile, né elementare.',
};

function level2Type(rng: Rng): Built {
	const want = rng.pick(['certo', 'impossibile', 'elementare', 'nessuno']);
	const coins = rng.next() < 0.25;
	let phrase: string, members: string[], setting: string;
	if (coins) {
		const e = rng.pick(twoCoinEvents().filter((x) => typeOf(x.members.length, 4) === want));
		phrase = e.phrase;
		members = e.members;
		setting = 'Si lanciano due monete, con esiti TT, TC, CT, CC.';
	} else {
		const e = pickEvent(rng, numberEvents(6, true), (x) => typeOf(x.members.length, 6) === want);
		phrase = `esce ${e.noun}`;
		members = e.members.map(String);
		setting = 'Si lancia un dado.';
	}
	const opts = TYPE_OPTIONS.map((o) => ({ latex: o.latex, values: [o.key] }));
	return {
		prompt: "Che tipo di evento è?",
		problem: textBlock(`${setting} Evento: "${phrase}".`),
		steps: [`E = ${setTex(members)}`, t(TYPE_WHY[want])],
		solution: TYPE_OPTIONS.find((o) => o.key === want)!.latex,
		answer: { kind: 'choice', options: opts, correct: opts.findIndex((o) => o.values[0] === want) },
		params: { case: 'tipo', type: want, experiment: coins ? 'due-monete' : 'dado', event: phrase, favorable: members },
	};
}

function pairOption(set: string[], compatible: boolean): ChoiceOption {
	return {
		latex: `\\begin{gathered} A \\cap B = ${setTex(set)} \\\\ ${t(compatible ? 'compatibili' : 'incompatibili')} \\end{gathered}`,
		values: [set.join(',') || 'vuoto', compatible ? 'compatibili' : 'incompatibili'],
	};
}

function level2Compat(rng: Rng, compatible: boolean): Built {
	const coins = rng.next() < 0.3;
	const order = coins ? ['TT', 'TC', 'CT', 'CC'] : range(1, 6).map(String);
	const pool: { phrase: string; members: string[] }[] = coins
		? twoCoinEvents().filter((e) => e.members.length >= 1 && e.members.length <= 3)
		: numberEvents(6, true)
				.filter((e) => e.members.length >= 1 && e.members.length <= 4 && e.kind !== 'diverso')
				.map((e) => ({ phrase: `esce ${e.noun}`, members: e.members.map(String) }));
	for (let i = 0; i < 20000; i++) {
		const A = rng.pick(pool), B = rng.pick(pool);
		const key = (m: string[]) => m.join(',');
		if (key(A.members) === key(B.members) || A.phrase === B.phrase) continue;
		if (A.members.length + B.members.length < 3) continue;
		const I = order.filter((w) => A.members.includes(w) && B.members.includes(w));
		const U = order.filter((w) => A.members.includes(w) || B.members.includes(w));
		if ((I.length > 0) !== compatible) continue;
		const setting = coins ? 'Si lanciano due monete, con esiti TT, TC, CT, CC.' : 'Si lancia un dado.';
		const right = pairOption(I, compatible);
		const choice = compatible
			? buildChoice(rng, right, [pairOption(I, false), pairOption([], false), pairOption(U, true)])
			: buildChoice(rng, right, [pairOption([], true), pairOption(U, true), pairOption(U, false)]);
		return {
			prompt: "Trova A ∩ B e di' se gli eventi sono compatibili.",
			problem: textBlock(`${setting} $A$ = "${A.phrase}", $B$ = "${B.phrase}".`),
			steps: [
				`A = ${setTex(A.members)}${t(', ')}B = ${setTex(B.members)}`,
				`A \\cap B = ${setTex(I)}`,
				compatible
					? t(`Hanno ${I.length === 1 ? 'un esito' : 'degli esiti'} in comune: con ${I.join(' o con ')} si verificano tutti e due, quindi sono compatibili.`)
					: t('Non hanno esiti in comune: non possono verificarsi insieme, quindi sono incompatibili.'),
			],
			solution: `A \\cap B = ${setTex(I)}${t(compatible ? ': compatibili' : ': incompatibili')}`,
			answer: choice,
			params: { case: compatible ? 'compatibili' : 'incompatibili', experiment: coins ? 'due-monete' : 'dado', A: A.phrase, B: B.phrase, inter: I, union: U },
		};
	}
	throw new Error(`${ID}: no pair of events`);
}

function level2(rng: Rng): Built {
	const u = rng.next();
	return u < 0.4 ? level2Type(rng) : level2Compat(rng, u < 0.7);
}

// Level 3: coins, and a die with a coin ---------------------------------------

interface WordEvent {
	phrase: string;
	members: string[];
	/** The event depends only on how many heads: the "results without order" mistake applies. */
	byHeads?: number;
}

function threeCoinEvents(): WordEvent[] {
	const omega = ['TTT', 'TTC', 'TCT', 'TCC', 'CTT', 'CTC', 'CCT', 'CCC'];
	const heads = (w: string) => [...w].filter((c) => c === 'T').length;
	const out: WordEvent[] = [];
	const ev = (phrase: string, f: (h: number, w: string) => boolean, sym = true) => {
		const members = omega.filter((w) => f(heads(w), w));
		out.push({ phrase, members, byHeads: sym ? [0, 1, 2, 3].filter((h) => omega.some((w) => heads(w) === h && f(h, w))).length : undefined });
	};
	for (const [face, other] of [['testa', 'croce'], ['croce', 'testa']] as const) {
		const count = (h: number) => (face === 'testa' ? h : 3 - h);
		const pl = face === 'testa' ? 'teste' : 'croci';
		ev(`esce esattamente una ${face}`, (h) => count(h) === 1);
		ev(`escono esattamente due ${pl}`, (h) => count(h) === 2);
		ev(`escono tre ${pl}`, (h) => count(h) === 3);
		ev(`non esce nessuna ${face}`, (h) => count(h) === 0);
		ev(`esce almeno una ${face}`, (h) => count(h) >= 1);
		ev(`escono almeno due ${pl}`, (h) => count(h) >= 2);
		ev(`esce al massimo una ${face}`, (h) => count(h) <= 1);
		ev(`escono al massimo due ${pl}`, (h) => count(h) <= 2);
		ev(`la prima moneta dà ${face}`, (_, w) => w[0] === face[0].toUpperCase(), false);
		void other;
	}
	ev('escono tre facce uguali', (h) => h === 0 || h === 3);
	return out;
}

function twoCoinWordEvents(): WordEvent[] {
	return twoCoinEvents()
		.filter((e) => e.members.length > 0 && e.members.length < 4)
		.map((e) => {
			const heads = (w: string) => [...w].filter((c) => c === 'T').length;
			const sym = !/prima|seconda/.test(e.phrase);
			const hs = new Set(e.members.map(heads));
			return { ...e, byHeads: sym ? hs.size : undefined };
		});
}

function level3(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.75) {
		const three = u >= 0.3;
		const pool = three ? threeCoinEvents() : twoCoinWordEvents();
		const n = three ? 8 : 4;
		const e = rng.pick(pool.filter((x) => x.members.length > 0 && x.members.length < n));
		const k = e.members.length;
		const p = q(k, n);
		const omega = three ? ['TTT', 'TTC', 'TCT', 'TCC', 'CTT', 'CTC', 'CCT', 'CCC'] : ['TT', 'TC', 'CT', 'CC'];
		const results = three ? 4 : 3;
		const mistakes = [...(e.byHeads !== undefined ? [q(e.byHeads, results)] : []), q(1, n), q(n - k, n), q(1, 2)];
		return {
			prompt: PROMPT,
			problem: textBlock(`Si lanciano ${three ? 'tre' : 'due'} monete non truccate. Evento: "${e.phrase}".`),
			steps: [
				...classical(`${t(`Gli esiti equiprobabili sono ${n}, scritti in ordine: `)}${inline(omega)}`, e.members, k, n),
				t(`Contando solo quante teste escono si avrebbero ${results} risultati, ma non sono equiprobabili: si contano gli esiti.`),
			],
			solution: `p = ${fracTex(p)}`,
			answer: { kind: 'number', value: p.toString() },
			mistakes,
			params: { case: three ? 'tre-monete' : 'due-monete', total: n, event: e.phrase, favorable: e.members },
		};
	}
	// A die and a coin: 12 outcomes (T, 1), ..., (C, 6).
	const face = rng.pick(['testa', 'croce']);
	const e = pickEvent(rng, numberEvents(6, true), (x) => x.members.length >= 1 && x.members.length <= 4 && x.kind !== 'diverso');
	const noun = e.kind === 'esatto' ? `il numero ${e.noun}` : e.noun;
	const F = face[0].toUpperCase();
	const members = e.members.map((x) => `(${F}, ${x})`);
	const k = members.length;
	const p = q(k, 12);
	return {
		prompt: PROMPT,
		problem: textBlock(`Si lanciano un dado e una moneta, non truccati. Evento: "esce ${face} e ${noun}".`),
		steps: classical(`${t('Un esito è una coppia (moneta, dado): i casi possibili sono ')}2 \\cdot 6 = 12`, members, k, 12),
		solution: `p = ${fracTex(p)}`,
		answer: { kind: 'number', value: p.toString() },
		mistakes: [q(k, 8), q(k, 6), q(1, 12), q(12 - k, 12)],
		params: { case: 'dado-moneta', total: 12, event: `esce ${face} e ${noun}`, favorable: members },
	};
}

// Level 4: an urn of coloured balls -------------------------------------------

interface Colour {
	one: string;
	many: string;
}

const COLOUR_CTX: { id: string; noun: [string, string]; art: string; kinds: string; colours: Colour[]; setting: (list: string) => string }[] = [
	{
		id: 'palline',
		noun: ['pallina', 'palline'],
		art: 'una',
		kinds: 'colori',
		colours: [
			{ one: 'rossa', many: 'rosse' },
			{ one: 'blu', many: 'blu' },
			{ one: 'verde', many: 'verdi' },
			{ one: 'gialla', many: 'gialle' },
			{ one: 'bianca', many: 'bianche' },
			{ one: 'nera', many: 'nere' },
		],
		setting: (list) => `Un'urna contiene ${list}, tutte uguali al tatto. Se ne estrae una senza guardare.`,
	},
	{
		id: 'caramelle',
		noun: ['caramella', 'caramelle'],
		art: 'una',
		kinds: 'gusti',
		colours: [
			{ one: 'alla fragola', many: 'alla fragola' },
			{ one: 'alla menta', many: 'alla menta' },
			{ one: 'al limone', many: 'al limone' },
			{ one: "all'arancia", many: "all'arancia" },
			{ one: 'alla liquirizia', many: 'alla liquirizia' },
		],
		setting: (list) => `Un sacchetto contiene ${list}, tutte della stessa forma. Se ne prende una senza guardare.`,
	},
	{
		id: 'penne',
		noun: ['penna', 'penne'],
		art: 'una',
		kinds: 'colori',
		colours: [
			{ one: 'nera', many: 'nere' },
			{ one: 'blu', many: 'blu' },
			{ one: 'rossa', many: 'rosse' },
			{ one: 'verde', many: 'verdi' },
		],
		setting: (list) => `Un astuccio contiene ${list}, tutte uguali tranne il colore. Se ne prende una senza guardare.`,
	},
];

function listPhrase(noun: string, counts: number[], colours: Colour[]): string {
	const parts = counts.map((c, i) => `${c} ${i === 0 ? `${noun} ` : ''}${c === 1 ? colours[i].one : colours[i].many}`);
	return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`;
}

function level4(rng: Rng): Built {
	const ctx = rng.pick(COLOUR_CTX);
	const which = weighted(rng, [
		['colore', 0.5],
		['non-colore', 0.25],
		['due-colori', 0.25],
	] as [string, number][]);
	for (let i = 0; i < 20000; i++) {
		const c = rng.next() < 0.6 ? 3 : 4;
		const colours = [...ctx.colours];
		for (let j = colours.length - 1; j > 0; j--) {
			const r = rng.int(0, j);
			[colours[j], colours[r]] = [colours[r], colours[j]];
		}
		const used = colours.slice(0, c);
		const counts = used.map(() => rng.int(1, 9));
		const n = counts.reduce((a, b) => a + b, 0);
		if (n < 6 || n > 24 || counts[0] === 1) continue;
		const a = rng.int(0, c - 1);
		let b = rng.int(0, c - 2);
		if (b >= a) b++;
		let phrase: string, fav: number[], naive: Rational;
		if (which === 'colore') {
			phrase = `esce ${ctx.art} ${ctx.noun[0]} ${used[a].one}`;
			fav = [a];
			naive = q(1, c);
		} else if (which === 'non-colore') {
			phrase = `esce ${ctx.art} ${ctx.noun[0]} che non è ${used[a].one}`;
			fav = range(0, c - 1).filter((j) => j !== a);
			naive = q(c - 1, c);
		} else {
			const [x, y] = a < b ? [a, b] : [b, a];
			phrase = `esce ${ctx.art} ${ctx.noun[0]} ${used[x].one} o ${used[y].one}`;
			fav = [x, y];
			naive = q(2, c);
		}
		const k = fav.reduce((s, j) => s + counts[j], 0);
		const p = q(k, n);
		if (p.equals(naive)) continue;
		const favTerms = fav.map((j) => counts[j]);
		const problem = textBlock(`${ctx.setting(listPhrase(ctx.noun[1], counts, used))} Evento: "${phrase}".`);
		return {
			prompt: PROMPT,
			problem,
			steps: [
				`${t(`Gli esiti equiprobabili sono le ${n} ${ctx.noun[1]}, non i ${c} ${ctx.kinds}: `)}${counts.join(' + ')} = ${n}`,
				fav.length === 1 ? `${t('I casi favorevoli sono ')}${k}` : `${t('I casi favorevoli sono ')}${favTerms.join(' + ')} = ${k}`,
				`p = ${countTex(k, n)}`,
			],
			solution: `p = ${fracTex(p)}`,
			answer: { kind: 'number', value: p.toString() },
			mistakes: [naive, q(k, n - k), q(n - k, n), q(1, n)],
			params: { case: which, context: ctx.id, counts: counts.map(String), colours: used.map((x) => x.one), event: phrase, favorable: String(k), total: n },
		};
	}
	throw new Error(`${ID}: no urn`);
}

// Level 5: the deck of 40 cards -----------------------------------------------

const SUITS = ['coppe', 'denari', 'bastoni', 'spade'];
const RANK_NOUN: Record<number, string> = { 1: 'un asso', 8: 'un fante', 9: 'un cavallo', 10: 'un re' };
const RANK_THE: Record<number, string> = { 1: "l'asso", 8: 'il fante', 9: 'il cavallo', 10: 'il re' };

interface Card {
	v: number;
	s: string;
}
const DECK: Card[] = SUITS.flatMap((s) => range(1, 10).map((v) => ({ v, s })));

interface DeckEvent {
	kind: string;
	phrase: string;
	test: (c: Card) => boolean;
	/** The event does not name a suit: counting one suit only is a mistake. */
	anySuit: boolean;
}

function deckEvents(rng: Rng): DeckEvent[] {
	const s1 = rng.pick(SUITS);
	const s2 = rng.pick(SUITS.filter((s) => s !== s1));
	const [sa, sb] = SUITS.indexOf(s1) < SUITS.indexOf(s2) ? [s1, s2] : [s2, s1];
	const r = rng.pick([1, 8, 9, 10]);
	const v = rng.int(2, 7);
	const lim = rng.int(3, 8);
	const over = rng.int(3, 8);
	const [r1, r2] = rng.pick([
		[1, 10],
		[1, 8],
		[8, 9],
		[9, 10],
	]);
	const fig = (c: Card) => c.v >= 8;
	return [
		{ kind: 'rango', phrase: `esce ${RANK_NOUN[r]}`, test: (c) => c.v === r, anySuit: true },
		{ kind: 'valore', phrase: `esce un ${v}`, test: (c) => c.v === v, anySuit: true },
		{ kind: 'figura', phrase: 'esce una figura', test: fig, anySuit: true },
		{ kind: 'seme', phrase: `esce una carta di ${s1}`, test: (c) => c.s === s1, anySuit: false },
		{ kind: 'carta', phrase: `esce ${RANK_THE[r]} di ${s1}`, test: (c) => c.v === r && c.s === s1, anySuit: false },
		{ kind: 'figura-seme', phrase: `esce una figura di ${s1}`, test: (c) => fig(c) && c.s === s1, anySuit: false },
		{ kind: 'due-semi', phrase: `esce una carta di ${sa} o di ${sb}`, test: (c) => c.s === sa || c.s === sb, anySuit: false },
		{ kind: 'due-ranghi', phrase: `esce ${RANK_NOUN[r1]} o ${RANK_NOUN[r2]}`, test: (c) => c.v === r1 || c.v === r2, anySuit: true },
		{ kind: 'non-figura', phrase: 'esce una carta che non è una figura', test: (c) => !fig(c), anySuit: true },
		{ kind: 'seme-non-figura', phrase: `esce una carta di ${s1} che non è una figura`, test: (c) => c.s === s1 && !fig(c), anySuit: false },
		{ kind: 'minore', phrase: `esce una carta di valore minore di ${lim}`, test: (c) => c.v < lim, anySuit: true },
		{ kind: 'maggiore', phrase: `esce una carta di valore maggiore di ${over}`, test: (c) => c.v > over, anySuit: true },
	];
}

function level5(rng: Rng): Built {
	const e = rng.pick(deckEvents(rng));
	const fav = DECK.filter(e.test);
	const k = fav.length;
	const p = q(k, 40);
	const mistakes = [q(k, 52), ...(e.anySuit ? [q(k / 4, 40)] : []), q(40 - k, 40), q(k, 10)];
	const top = Number(/\d+$/.exec(e.phrase)?.[0]) - 1;
	const how: Record<string, [string, string?]> = {
		rango: ['una carta per ciascuno dei 4 semi'],
		valore: ['una carta per ciascuno dei 4 semi'],
		figura: ['fante, cavallo e re per ognuno dei 4 semi, ', '3 \\cdot 4 = 12'],
		seme: ['le 10 carte di quel seme'],
		carta: ['quella carta'],
		'figura-seme': ['fante, cavallo e re di quel seme'],
		'due-semi': ['10 carte per ciascuno dei due semi, ', '10 + 10 = 20'],
		'due-ranghi': ['4 carte per ciascuno dei due valori, ', '4 + 4 = 8'],
		'non-figura': ['le 40 carte meno le 12 figure, ', '40 - 12 = 28'],
		'seme-non-figura': ["dall'asso al 7 di quel seme"],
		minore: [`4 carte per ciascuno dei valori da 1 a ${top}, `, `4 \\cdot ${top} = ${k}`],
		maggiore: [`4 carte per ciascuno dei valori da ${top + 2} a 10, `, `4 \\cdot ${10 - top - 1} = ${k}`],
	};
	const [whyText, whyMath] = how[e.kind];
	return {
		prompt: PROMPT,
		problem: textBlock(`Si pesca una carta da un mazzo di 40 carte napoletane ben mescolato. Evento: "${e.phrase}".`),
		steps: [
			`${t('I casi possibili sono le ')}40${t(' carte.')}`,
			k === 1 ? t(`Il caso favorevole è uno solo: ${whyText}.`) : `${t(`I casi favorevoli sono ${k}: ${whyText}`)}${whyMath ?? ''}`,
			`p = ${countTex(k, 40)}`,
		],
		solution: `p = ${fracTex(p)}`,
		answer: { kind: 'number', value: p.toString() },
		mistakes,
		params: { case: e.kind, event: e.phrase, favorable: String(k), total: 40 },
	};
}

// Level 6: two dice -----------------------------------------------------------

const PAIRS: [number, number][] = range(1, 6).flatMap((a) => range(1, 6).map((b) => [a, b] as [number, number]));
const pairTex = ([a, b]: [number, number]) => `(${a}, ${b})`;

function level6(rng: Rng): Built {
	const which = weighted(rng, [
		['somma', 0.4],
		['disuguaglianza', 0.2],
		['doppio', 0.1],
		['almeno', 0.15],
		['altro', 0.15],
	] as [string, number][]);
	let phrase: string, test: (p: [number, number]) => boolean, mistakes: Rational[];
	let explain: string | null = null;
	if (which === 'somma') {
		const s = rng.int(3, 11);
		phrase = `la somma è ${s}`;
		test = ([a, b]) => a + b === s;
		const unordered = PAIRS.filter(([a, b]) => a <= b && a + b === s).length;
		mistakes = [q(1, 11), q(unordered, 36), q(unordered, 21), q(1, 6)];
	} else if (which === 'disuguaglianza') {
		const less = rng.next() < 0.5;
		const s = rng.int(4, 10);
		phrase = `la somma è ${less ? 'minore' : 'maggiore'} di ${s}`;
		test = ([a, b]) => (less ? a + b < s : a + b > s);
		const sums = range(2, 12).filter((x) => (less ? x < s : x > s)).length;
		const k = PAIRS.filter(test).length;
		const eq = PAIRS.filter(([a, b]) => a + b === s).length;
		mistakes = [q(sums, 11), q(k + eq, 36), q(36 - k, 36), q(k - 1, 36)];
		explain = less ? `somme da 2 a ${s - 1}` : `somme da ${s + 1} a 12`;
	} else if (which === 'doppio') {
		phrase = 'escono due numeri uguali';
		test = ([a, b]) => a === b;
		mistakes = [q(6, 21), q(1, 36), q(5, 6), q(1, 11)];
	} else if (which === 'altro') {
		const others: [string, (p: [number, number]) => boolean][] = [
			['la somma è pari', ([a, b]) => (a + b) % 2 === 0],
			['la somma è dispari', ([a, b]) => (a + b) % 2 === 1],
			...[3, 4, 5].map((m): [string, (p: [number, number]) => boolean] => [`la somma è un multiplo di ${m}`, ([a, b]) => (a + b) % m === 0]),
			['il primo dado dà un numero maggiore del secondo', ([a, b]) => a > b],
			['il primo dado dà un numero minore del secondo', ([a, b]) => a < b],
			...[1, 2, 3, 4].map((d): [string, (p: [number, number]) => boolean] => [`i due numeri differiscono di ${d}`, ([a, b]) => Math.abs(a - b) === d]),
			...[4, 6, 12].map((m): [string, (p: [number, number]) => boolean] => [`il prodotto è ${m}`, ([a, b]) => a * b === m]),
			['escono due numeri pari', ([a, b]) => a % 2 === 0 && b % 2 === 0],
			['escono due numeri dispari', ([a, b]) => a % 2 === 1 && b % 2 === 1],
		];
		[phrase, test] = rng.pick(others);
		const k = PAIRS.filter(test).length;
		const unordered = PAIRS.filter(([a, b]) => a <= b && test([a, b])).length;
		mistakes = [q(unordered, 36), q(unordered, 21), q(36 - k, 36), q(1, 2)];
	} else {
		const v = rng.int(1, 6);
		phrase = `esce almeno un ${v}`;
		test = ([a, b]) => a === v || b === v;
		mistakes = [q(12, 36), q(10, 36), q(1, 6), q(25, 36)];
	}
	const fav = PAIRS.filter(test);
	const k = fav.length;
	const p = q(k, 36);
	const favStep =
		which === 'disuguaglianza'
			? `${t(`Casi favorevoli, per ogni somma (${explain}): `)}${range(2, 12)
					.map((x) => ({ x, c: fav.filter(([a, b]) => a + b === x).length }))
					.filter((o) => o.c > 0)
					.map((o) => o.c)
					.join(' + ')} = ${k}`
			: `${t(`I casi favorevoli sono ${k}: `)}${inline(fav.map(pairTex))}`;
	const steps = [`${t('Gli esiti equiprobabili sono le coppie ordinate')} (a, b)${t(': ')}6 \\cdot 6 = 36`, favStep, `p = ${countTex(k, 36)}`];
	if (which === 'somma') steps.push(t('Le somme possibili sono 11, ma non sono equiprobabili: si contano le coppie.'));
	if (which === 'almeno') steps.push(`${t('La coppia ')}(${phrase.slice(-1)}, ${phrase.slice(-1)})${t(' si conta una volta sola.')}`);
	return {
		prompt: PROMPT,
		problem: textBlock(`Si lanciano due dadi non truccati. Evento: "${phrase}".`),
		steps,
		solution: `p = ${fracTex(p)}`,
		answer: { kind: 'number', value: p.toString() },
		mistakes,
		params: { case: which, event: phrase, favorable: fav.map(pairTex), total: 36 },
	};
}

// Level 7: relative frequency --------------------------------------------------

const FREQ_CTX: { id: string; setting: (N: number, f: number) => string; ask: string; what: (M: number) => string; unit: string }[] = [
	{ id: 'lampadine', setting: (N, f) => `Una ditta controlla ${N} lampadine prese dalla produzione di un giorno e ne trova ${f} difettose.`, ask: 'la probabilità che una lampadina sia difettosa', what: (M) => `Quante lampadine difettose ci si aspetta su ${big(M)}?`, unit: 'lampadine' },
	{ id: 'semi', setting: (N, f) => `Un vivaio pianta ${N} semi di basilico e ${f} germogliano.`, ask: 'la probabilità che un seme germogli', what: (M) => `Quanti semi germoglieranno, circa, su ${big(M)}?`, unit: 'semi' },
	{ id: 'puntina', setting: (N, f) => `Una puntina da disegno lanciata ${N} volte cade ${f} volte con la punta in su.`, ask: 'la probabilità che cada con la punta in su', what: (M) => `Quante volte cadrà con la punta in su, circa, in ${big(M)} lanci?`, unit: 'volte' },
	{ id: 'tiri', setting: (N, f) => `In una stagione una giocatrice di basket tira ${N} tiri liberi e ne segna ${f}.`, ask: 'la probabilità che segni un tiro libero', what: (M) => `Quanti tiri liberi segnerà, circa, su ${big(M)}?`, unit: 'tiri' },
	{ id: 'pezzi', setting: (N, f) => `Un controllo su ${N} bulloni prodotti da una macchina ne trova ${f} difettosi.`, ask: 'la probabilità che un bullone sia difettoso', what: (M) => `Quanti bulloni difettosi ci si aspetta su ${big(M)}?`, unit: 'bulloni' },
];

const LOW: Record<string, boolean> = { lampadine: true, semi: false, puntina: false, tiri: false, pezzi: true };

function level7(rng: Rng): Built {
	const ctx = rng.pick(FREQ_CTX);
	const estimate = rng.next() < 0.4;
	for (let i = 0; i < 20000; i++) {
		const N = rng.pick([50, 80, 100, 125, 200, 250, 400, 500, 800, 1000]);
		const f = LOW[ctx.id] ? rng.int(1, Math.floor(N * 0.12)) : rng.int(Math.ceil(N * 0.2), Math.floor(N * 0.9));
		const fr = q(f, N);
		if (decTex(fr) === null || f === 0) continue;
		const pct = fr.mul(q(100));
		if (!estimate) {
			return {
				prompt: 'Stima la probabilità con la frequenza relativa.',
				problem: textBlock(`${ctx.setting(N, f)} Stima ${ctx.ask}.`),
				steps: [
					`${t('Le prove sono ')}N = ${decTex(q(N))}${t(", e l'evento si verifica ")}f_a = ${f}${t(' volte.')}`,
					`f_r = \\dfrac{f_a}{N} = \\dfrac{${f}}{${decTex(q(N))}} = ${decTex(fr)}`,
					`${t('La probabilità si stima in ')}${decTex(fr)}${t(', cioè il ')}${decTex(pct) ?? ''}\\%`,
				],
				solution: `p \\approx ${decTex(fr)}`,
				answer: { kind: 'number', value: fr.toString() },
				mistakes: [q(N, f), pct, q(N - f, N), fr.mul(q(10)), q(f, N - f)],
				params: { case: 'frequenza', context: ctx.id, trials: String(N), successes: String(f) },
			};
		}
		const M = rng.pick([1000, 2000, 5000, 10000, 3000, 600, 1500].filter((m) => m !== N));
		const exp = fr.mul(q(M));
		if (!exp.isInteger() || exp.isZero()) continue;
		return {
			prompt: 'Stima con la frequenza relativa.',
			problem: textBlock(`${ctx.setting(N, f)} ${ctx.what(M)}`),
			steps: [
				`f_r = \\dfrac{${f}}{${decTex(q(N))}} = ${decTex(fr)}`,
				`${t('Su ')}${decTex(q(M))}${t(' prove ci si aspetta circa ')}${decTex(fr)} \\cdot ${decTex(q(M))} = ${decTex(exp)}`,
				t("È una stima: su altre prove il numero può essere un po' diverso."),
			],
			solution: `${decTex(exp)}${t(` ${ctx.unit}, circa`)}`,
			answer: { kind: 'number', value: exp.toString() },
			mistakes: [q(M - exp.num), exp.mul(q(10)), q(f * 10), exp.add(q(f))],
			params: { case: 'stima', context: ctx.id, trials: String(N), successes: String(f), target: String(M) },
		};
	}
	throw new Error(`${ID}: no frequency`);
}

// ---------------------------------------------------------------------------
// Assembly

const LEVELS = [level1, level2, level3, level4, level5, level6, level7];

function generate(rng: Rng, level: number): Sample {
	const f = LEVELS[level - 1];
	if (!f) throw new Error(`${ID}: unknown level ${level}`);
	const b = f(rng);
	const params = { ...b.params, ...(b.mistakes ? { mistakes: b.mistakes.map((m) => m.toString()) } : {}) };
	return { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params };
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.answer.kind !== 'number') throw new Error(`${ID}: no choice for level ${s.level}`);
	const answer = Rational.parse(s.answer.value);
	const mistakes = ((s.params.mistakes as string[]) ?? []).map((m) => Rational.parse(m));
	if (s.level === 7) {
		const step = s.params.case === 'stima' ? q(Math.max(1, Math.round(answer.num / 10))) : answer.den >= 1000 ? q(1, 1000) : answer.den >= 100 ? q(1, 100) : q(1, 10);
		return decChoice(rng, answer, mistakes, step);
	}
	const n = Number(s.params.total);
	const k = s.level === 4 || s.level === 5 ? Number(s.params.favorable) : (s.params.favorable as string[]).length;
	return probChoice(rng, answer, mistakes, k, n);
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, unknown>;
	if (!s.steps.length) v.push('passaggi mancanti');
	if (/—|piuttosto che/.test(s.problem + s.steps.join(' ') + s.solution)) v.push('parole vietate');
	if (/\d\.\d/.test(s.problem)) v.push('punto decimale nel problema');
	if (s.answer.kind === 'number') {
		const a = Rational.parse(s.answer.value);
		if (s.level < 7 || p.case === 'frequenza') {
			if (a.sign() <= 0 || a.compare(q(1)) >= 0) v.push(`probabilità ${a.toString()} non tra 0 e 1 esclusi`);
		}
		if (s.level <= 6) {
			const n = Number(p.total);
			const k = s.level === 4 || s.level === 5 ? Number(p.favorable) : (p.favorable as string[]).length;
			if (!a.equals(q(k, n))) v.push(`risposta ${a.toString()} invece di ${k}/${n}`);
		}
		if (s.level === 7) {
			const fr = q(Number(p.successes), Number(p.trials));
			const want = p.case === 'stima' ? fr.mul(q(Number(p.target))) : fr;
			if (!a.equals(want)) v.push('risposta sbagliata');
		}
	}
	if (s.level === 1 && (p.favorable as string[]).length < 2) v.push('evento elementare al livello 1');
	if (s.level === 2 && s.answer.kind !== 'choice') v.push('risposta non a scelta');
	return v;
}

export const concettiProbabilita: Generator = {
	id: ID,
	title: 'Eventi e probabilità',
	levels: {
		1: { label: 'Un dado o un’urna di palline numerate', constraints: ['dado a sei facce (50%) o urna con 10-30 palline numerate (50%)', 'evento a parole con almeno 2 casi favorevoli e non certo'] },
		2: { label: 'Eventi certi, impossibili, compatibili', constraints: ['40% che tipo di evento è (certo, impossibile, elementare, nessuno dei tre)', '60% intersezione di due eventi e compatibili o incompatibili, metà ciascuno'] },
		3: { label: 'Monete e esiti ordinati', constraints: ['due monete 30%, tre monete 45%, un dado e una moneta 25%', 'probabilità strettamente tra 0 e 1'] },
		4: { label: 'Urna con palline di più colori', constraints: ['3 o 4 colori, da 1 a 9 per colore, da 6 a 24 in tutto', 'la probabilità è diversa da quella che si ottiene contando i colori'] },
		5: { label: 'Una carta dal mazzo di 40', constraints: ['mazzo napoletano: asso, 2-7, fante, cavallo, re', 'dodici tipi di evento'] },
		6: { label: 'La somma di due dadi', constraints: ['36 coppie ordinate', 'somma data 40%, somma minore o maggiore 20%, doppio 10%, almeno un numero 15%, altri eventi 15%'] },
		7: { label: 'Frequenza relativa e stima', constraints: ['frequenza relativa con al massimo tre decimali (60%)', 'numero atteso su un altro totale, intero (40%)'] },
	},
	generate,
	check,
	toChoice,
};

export default concettiProbabilita;
