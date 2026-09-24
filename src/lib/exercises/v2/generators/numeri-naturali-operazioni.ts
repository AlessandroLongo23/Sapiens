/**
 * Operazioni in ℕ. Spec: specs/exercises/numeri-naturali-operazioni.md
 *
 * Seven levels in the order of the lesson: which property of the operations was used; zero in the
 * division and division with remainder; expressions without brackets (priorities); with tonde; with
 * tonde and quadre; with tonde, quadre and graffe; word problems solved with one expression of two or
 * three operations. Expressions are built backwards from their value
 * (naturali.ts), so every intermediate result is a natural number and every division is exact.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import {
	type BuildOpts,
	type Node,
	type Opt,
	G,
	MISTAKE,
	N,
	O,
	ascii,
	assertWellFormed,
	bracketHeight,
	buildSum,
	chain,
	countOps,
	evaluate,
	exprSteps,
	fmt,
	isOp,
	latex,
	literals,
	makeChoice,
	mistakeOpt,
	nearNumbers,
	numOpt,
	parseAscii,
	sumTerms,
	textOpt,
	trace,
	withBrackets,
} from '../naturali';
import { textBlock } from '../insiemi';

export const ID = 'numeri-naturali-operazioni';

// ---------------------------------------------------------------------------
// Level 1: properties

export type Property = 'commutativa' | 'associativa' | 'dissociativa' | 'distributiva' | 'invariantiva' | 'neutro' | 'assorbente';

export const PROPERTY_TEXT: Record<Property, string> = {
	commutativa: 'proprietà commutativa',
	associativa: 'proprietà associativa',
	dissociativa: 'proprietà dissociativa',
	distributiva: 'proprietà distributiva',
	invariantiva: 'proprietà invariantiva',
	neutro: 'elemento neutro',
	assorbente: 'elemento assorbente',
};

/** Properties a student confuses with each one, most likely first. */
const CONFUSED: Record<Property, Property[]> = {
	commutativa: ['associativa', 'dissociativa', 'distributiva', 'invariantiva'],
	associativa: ['dissociativa', 'commutativa', 'distributiva', 'invariantiva'],
	dissociativa: ['associativa', 'distributiva', 'commutativa', 'invariantiva'],
	distributiva: ['associativa', 'dissociativa', 'commutativa', 'invariantiva'],
	invariantiva: ['distributiva', 'dissociativa', 'associativa', 'commutativa'],
	neutro: ['assorbente', 'commutativa', 'invariantiva', 'associativa'],
	assorbente: ['neutro', 'commutativa', 'distributiva', 'associativa'],
};

interface PropBuilt {
	lhs: Node;
	rhs: Node;
	property: Property;
	/** Why, in words, for the steps. */
	why: string;
}

const add = (a: Node | number, b: Node | number) => O('+', typeof a === 'number' ? N(a) : a, typeof b === 'number' ? N(b) : b);
const mul = (a: Node | number, b: Node | number) => O('*', typeof a === 'number' ? N(a) : a, typeof b === 'number' ? N(b) : b);
const nums = (xs: number[], op: '+' | '*') => chain(xs.map(N), xs.slice(1).map(() => op));
const t = (s: string) => `\\text{${s}}`;

function buildProperty(rng: Rng): PropBuilt {
	const u = rng.next();
	if (u < 0.17) {
		// commutativa
		const isMul = rng.int(0, 1) === 1;
		const three = rng.int(0, 1) === 1;
		const r = () => (isMul ? rng.int(2, 15) : rng.int(2, 60));
		const xs = three ? [r(), r(), r()] : [r(), r()];
		if (new Set(xs).size < xs.length) return buildProperty(rng);
		const ys = three ? [xs[0], xs[2], xs[1]] : [xs[1], xs[0]];
		const op = isMul ? '*' : '+';
		const what = isMul ? 'i fattori' : 'gli addendi';
		return {
			lhs: nums(xs, op),
			rhs: nums(ys, op),
			property: 'commutativa',
			why: `${t(`È cambiato solo l'ordine ${isMul ? 'dei fattori' : 'degli addendi'}: ${what} sono gli stessi. È la proprietà commutativa ${isMul ? 'della moltiplicazione' : "dell'addizione"}.`)}`,
		};
	}
	if (u < 0.34) {
		// associativa: two neighbours replaced by their result, or the bracketed form
		const isMul = rng.int(0, 1) === 1;
		const a = isMul ? rng.int(2, 12) : rng.int(2, 60);
		let b: number, c: number;
		if (isMul) {
			[b, c] = rng.pick([[2, 5], [5, 2], [4, 25], [25, 4], [2, 50], [5, 20], [4, 5], [3, 10], [2, 3], [3, 4]]);
		} else {
			c = rng.int(1, 9);
			b = rng.int(1, 9) * 10 + (10 - c);
			if (rng.int(0, 1)) [b, c] = [c, b];
		}
		const opn = isMul ? '*' : '+';
		const d = isMul ? b * c : b + c;
		if (rng.int(0, 2) === 0) {
			const lhs = O(opn, G(O(opn, N(a), N(b))), N(c));
			const rhs = O(opn, N(a), G(O(opn, N(b), N(c))));
			return {
				lhs,
				rhs,
				property: 'associativa',
				why: t(`Gli stessi ${isMul ? 'fattori' : 'addendi'}, nello stesso ordine, raggruppati in un altro modo: è la proprietà associativa ${isMul ? 'della moltiplicazione' : "dell'addizione"}.`),
			};
		}
		return {
			lhs: nums([a, b, c], opn),
			rhs: O(opn, N(a), N(d)),
			property: 'associativa',
			why: `${t(`${isMul ? 'I due fattori vicini' : 'I due addendi vicini'} `)}${fmt(b)}${t(' e ')}${fmt(c)}${t(` sono stati sostituiti ${isMul ? 'dal loro prodotto' : 'dalla loro somma'} `)}${fmt(d)}${t(`: è la proprietà associativa ${isMul ? 'della moltiplicazione' : "dell'addizione"}.`)}`,
		};
	}
	if (u < 0.49) {
		// dissociativa: one term split in two whose sum (product) is that term
		const isMul = rng.int(0, 1) === 1;
		let a: number, b: number, c: number;
		if (isMul) {
			a = rng.pick([5, 15, 25, 50, 35, 45]);
			b = a % 2 === 1 ? 2 : 4;
			if (a === 25 || a === 50) b = 4;
			c = rng.int(2, 9);
		} else {
			a = rng.int(1, 9) * 10 + rng.int(1, 9);
			b = 10 - (a % 10);
			c = rng.int(1, 9);
		}
		const d = isMul ? b * c : b + c;
		const opn = isMul ? '*' : '+';
		return {
			lhs: O(opn, N(a), N(d)),
			rhs: nums([a, b, c], opn),
			property: 'dissociativa',
			why: `${t(`${isMul ? 'Il fattore' : "L'addendo"} `)}${fmt(d)}${t(' è stato scomposto in ')}${fmt(b)} ${isMul ? '\\cdot' : '+'} ${fmt(c)}${t(': è la proprietà dissociativa.')}`,
		};
	}
	if (u < 0.66) {
		// distributiva
		const v = rng.int(0, 2);
		if (v < 2) {
			const a = rng.int(2, 9);
			let b = rng.int(2, 30), c = rng.int(2, 30);
			const minus = v === 1;
			if (minus && b <= c) [b, c] = [c + 1, b];
			if (b === c) return buildProperty(rng);
			const opn = minus ? '-' : '+';
			return {
				lhs: mul(a, G(O(opn, N(b), N(c)))),
				rhs: O(opn, mul(a, b), mul(a, c)),
				property: 'distributiva',
				why: `${fmt(a)}${t(` moltiplica ciascun termine ${minus ? 'della differenza' : 'della somma'}: è la proprietà distributiva della moltiplicazione rispetto ${minus ? 'alla sottrazione' : "all'addizione"}.`)}`,
			};
		}
		const c = rng.int(2, 9);
		const a = c * rng.int(2, 12), b = c * rng.int(2, 12);
		if (a === b) return buildProperty(rng);
		return {
			lhs: O(':', G(add(a, b)), N(c)),
			rhs: add(O(':', N(a), N(c)), O(':', N(b), N(c))),
			property: 'distributiva',
			why: `${t('Si divide per ')}${c}${t(" ciascun addendo del dividendo: è la proprietà distributiva della divisione rispetto all'addizione.")}`,
		};
	}
	if (u < 0.82) {
		// invariantiva
		if (rng.int(0, 1)) {
			const round = rng.pick([100, 200, 300, 500, 1000, 50, 80, 60, 40]);
			const n = rng.int(1, 5);
			const b = round - n;
			const a = b + rng.int(2, round);
			return {
				lhs: O('-', N(a), N(b)),
				rhs: O('-', N(a + n), N(round)),
				property: 'invariantiva',
				why: `${t('Si è aggiunto ')}${n}${t(' sia al minuendo sia al sottraendo: la differenza non cambia. È la proprietà invariantiva della sottrazione.')}`,
			};
		}
		const n = rng.pick([2, 5, 10, 10, 3, 4]);
		const b2 = rng.int(2, 9), q = rng.int(2, 12);
		const b = b2 * n, a = b * q;
		return {
			lhs: O(':', N(a), N(b)),
			rhs: O(':', N(a / n), N(b2)),
			property: 'invariantiva',
			why: `${t('Dividendo e divisore sono stati divisi entrambi per ')}${n}${t(': il quoziente non cambia. È la proprietà invariantiva della divisione.')}`,
		};
	}
	if (u < 0.91) {
		const a = rng.int(2, 99);
		const isMul = rng.int(0, 1) === 1;
		const e = isMul ? 1 : 0;
		const lhs = rng.int(0, 1) ? O(isMul ? '*' : '+', N(a), N(e)) : O(isMul ? '*' : '+', N(e), N(a));
		return {
			lhs,
			rhs: N(a),
			property: 'neutro',
			why: `${t(isMul ? 'Moltiplicare per ' : 'Sommare ')}${e}${t(` lascia il numero com'era: ${e} è l'elemento neutro ${isMul ? 'della moltiplicazione' : "dell'addizione"}.`)}`,
		};
	}
	const a = rng.int(2, 99);
	return {
		lhs: rng.int(0, 1) ? mul(a, 0) : mul(0, a),
		rhs: N(0),
		property: 'assorbente',
		why: t("Qualunque numero moltiplicato per 0 dà 0: 0 è l'elemento assorbente della moltiplicazione."),
	};
}

function propertySample(rng: Rng, seed: number): Sample {
	const b = buildProperty(rng);
	const lhs = withBrackets(b.lhs), rhs = withBrackets(b.rhs);
	const vl = evaluate(lhs), vr = evaluate(rhs);
	const conf = CONFUSED[b.property];
	const others = [conf[0], conf[1], rng.pick(conf.slice(2))];
	const choice = makeChoice(
		rng,
		textOpt(b.property, PROPERTY_TEXT[b.property]),
		others.map((p) => textOpt(p, PROPERTY_TEXT[p])),
	);
	return {
		generatorId: ID,
		level: 1,
		seed,
		prompt: 'Quale proprietà è stata usata?',
		problem: `${latex(lhs)} = ${latex(rhs)}`,
		solution: t(PROPERTY_TEXT[b.property].replace(/^./, (c) => c.toUpperCase())),
		steps: [b.why, `${t('Controllo: entrambi i membri valgono ')}${fmt(vl ?? -1)}${vl === vr ? '' : t(' (errore)')}`],
		answer: choice,
		params: { lhs: ascii(lhs), rhs: ascii(rhs), property: b.property, case: b.property },
	};
}

// ---------------------------------------------------------------------------
// Level 2: zero in the division, division with remainder

type DivCase = 'zero-diviso' | 'diviso-zero' | 'zero-zero' | 'resto';

const qrOpt = (q: number, r: number): Opt => ({ latex: `q = ${fmt(q)},\\ r = ${fmt(r)}`, values: [String(q), String(r)] });

function divisionSample(rng: Rng, seed: number): Sample {
	const u = rng.next();
	const c: DivCase = u < 0.1 ? 'zero-diviso' : u < 0.2 ? 'diviso-zero' : u < 0.3 ? 'zero-zero' : 'resto';
	const base = { generatorId: ID, level: 2, seed };
	if (c !== 'resto') {
		const n = rng.int(2, 30);
		const a = c === 'zero-diviso' || c === 'zero-zero' ? 0 : n;
		const b = c === 'zero-diviso' ? n : 0;
		const imp = textOpt('impossibile', 'impossibile'), ind = textOpt('indeterminata', 'indeterminata');
		let correct: Opt, others: Opt[], why: string;
		if (c === 'zero-diviso') {
			correct = numOpt(0);
			others = [numOpt(n), imp, ind];
			why = `${t('Il quoziente moltiplicato per il divisore deve dare il dividendo: ')}0 \\cdot ${n} = 0${t(', quindi ')}0 : ${n} = 0`;
		} else if (c === 'diviso-zero') {
			correct = imp;
			others = [numOpt(0), numOpt(n), ind];
			why = `${t('Nessun numero moltiplicato per 0 dà ')}${n}${t(', perché ogni prodotto per 0 fa 0: la divisione è impossibile')}`;
		} else {
			correct = ind;
			others = [numOpt(0), numOpt(1), imp];
			why = t('Qualunque numero moltiplicato per 0 dà 0: non c\'è un solo quoziente, la divisione è indeterminata');
		}
		const choice = makeChoice(rng, correct, others);
		return {
			...base,
			prompt: 'Calcola, se è possibile.',
			problem: `${a} : ${b}`,
			solution: correct.latex,
			steps: [why],
			answer: choice,
			params: { a: String(a), b: String(b), case: c },
		};
	}
	// a = b·q + r with 0 <= r < b
	const b = rng.int(3, 12);
	const v = rng.next();
	const q = v < 0.1 ? 0 : rng.int(2, 15);
	const r = v < 0.1 ? rng.int(1, b - 1) : v < 0.2 ? 0 : rng.int(1, b - 1);
	const a = b * q + r;
	const cands: (Opt | null)[] = [];
	if (q >= 1) cands.push(qrOpt(q - 1, r + b)); // remainder not smaller than the divisor
	if (r > 0) cands.push(qrOpt(q + 1, b - r)); // the multiple after the dividend
	cands.push(qrOpt(q, r + 1), r > 0 ? qrOpt(q, r - 1) : qrOpt(q + 1, r), qrOpt(q + 1, r), q >= 1 ? qrOpt(q - 1, r) : null, qrOpt(q, r + 2));
	const correct = qrOpt(q, r);
	const choice = makeChoice(rng, correct, cands);
	const steps =
		q === 0
			? [`${t('Il divisore ')}${b}${t(' è più grande del dividendo ')}${a}${t(': ci sta 0 volte, e il resto è tutto il dividendo')}`]
			: [`${t('Il più grande multiplo di ')}${b}${t(' che non supera ')}${fmt(a)}${t(' è ')}${fmt(b * q)} = ${b} \\cdot ${q}${t(', quindi il quoziente è ')}${q}`, `${t('Il resto è ')}${fmt(a)} - ${fmt(b * q)} = ${r}`];
	steps.push(`${t('Controllo: ')}${b} \\cdot ${q} + ${r} = ${fmt(a)}${t(', e ')}${r} < ${b}`);
	return {
		...base,
		prompt: 'Trova il quoziente e il resto della divisione.',
		problem: `${fmt(a)} : ${b}`,
		solution: correct.latex,
		steps,
		answer: choice,
		params: { a: String(a), b: String(b), q: String(q), r: String(r), case: 'resto' },
	};
}

// ---------------------------------------------------------------------------
// Levels 3-6: expressions

interface ExprLevel {
	depth: number;
	opts: BuildOpts;
	minNumbers: number;
	maxNumbers: number;
	result: [number, number];
}

export const EXPR_LEVELS: Record<number, ExprLevel> = {
	3: { depth: 0, opts: { maxLit: 60, maxVal: 150, maxFactor: 10, groupP: 0 }, minNumbers: 3, maxNumbers: 6, result: [2, 40] },
	4: { depth: 1, opts: { maxLit: 60, maxVal: 200, maxFactor: 10, groupP: 0.2 }, minNumbers: 4, maxNumbers: 7, result: [2, 50] },
	5: { depth: 2, opts: { maxLit: 60, maxVal: 200, maxFactor: 10, groupP: 0.2 }, minNumbers: 5, maxNumbers: 9, result: [2, 50] },
	6: { depth: 3, opts: { maxLit: 60, maxVal: 250, maxFactor: 10, groupP: 0.15 }, minNumbers: 6, maxNumbers: 11, result: [1, 50] },
};

/** Violations of the size and shape rules for an expression of that level. */
function exprViolations(x: Node, level: number): string[] {
	const L = EXPR_LEVELS[level];
	const v: string[] = [];
	try {
		assertWellFormed(x);
	} catch (e) {
		return [`albero non valido: ${(e as Error).message}`];
	}
	const value = evaluate(x);
	if (value === null) return ['un passaggio esce da ℕ'];
	if (value < 1) v.push('risultato nullo');
	for (const s of trace(x)) {
		if (s.r > L.opts.maxVal) v.push(`risultato intermedio ${s.r} oltre ${L.opts.maxVal}`);
		if (s.op === '*' && (Math.min(s.a, s.b) > L.opts.maxFactor || Math.min(s.a, s.b) < 2)) v.push(`prodotto ${s.a} · ${s.b} fuori misura`);
		if (s.op === ':' && (s.b < 2 || s.b > L.opts.maxFactor)) v.push(`divisore ${s.b} fuori misura`);
		if ((s.op === '+' || s.op === '-') && s.b < 1) v.push('addendo nullo');
	}
	const lits = literals(x);
	if (lits.some((n) => n > L.opts.maxLit)) v.push('numero troppo grande nel testo');
	if (lits.length > L.maxNumbers || lits.length < L.minNumbers) v.push(`numeri nel testo: ${lits.length}, attesi da ${L.minNumbers} a ${L.maxNumbers}`);
	if (bracketHeight(x) !== L.depth - 1) v.push(`parentesi fino al tipo ${bracketHeight(x)}, attese fino al tipo ${L.depth - 1}`);
	if (countOps(x, isOp('*', ':')) === 0 || countOps(x, isOp('+', '-')) === 0) v.push('servono sia \\cdot o : sia + o -');
	// every bracket holds a sum or a difference
	const bad = countOps(x, (y) => y.t === 'g' && sumTerms(y.c).length < 2);
	if (bad) v.push('parentesi inutile');
	if (level === 3 && evaluate(x, MISTAKE.leftToRight) === value) v.push('le priorità non cambiano il risultato');
	if (level >= 4 && evaluate(x, MISTAKE.noBrackets) === value) v.push('le parentesi non cambiano il risultato');
	return v;
}

function exprSample(rng: Rng, level: number, seed: number): Sample {
	const L = EXPR_LEVELS[level];
	for (let attempt = 0; attempt < 5000; attempt++) {
		const R = rng.int(L.result[0], L.result[1]);
		const raw = buildSum(rng, R, L.depth, true, L.opts, true);
		if (!raw) continue;
		let x: Node;
		try {
			x = withBrackets(raw);
		} catch {
			continue;
		}
		if (exprViolations(x, level).length) continue;
		const value = evaluate(x)!;
		return {
			generatorId: ID,
			level,
			seed,
			prompt: "Calcola il valore dell'espressione.",
			problem: latex(x),
			solution: fmt(value),
			steps: exprSteps(x),
			answer: { kind: 'number', value: String(value) },
			params: { expr: ascii(x), value: String(value) },
		};
	}
	throw new Error(`${ID}: no expression for level ${level}, seed ${seed}`);
}

// ---------------------------------------------------------------------------
// Level 7: word problems

export type Story = 'resto' | 'mercato' | 'gruppi' | 'risparmi' | 'pullman' | 'sala' | 'gita' | 'piscina' | 'punti';
export const STORIES: Story[] = ['resto', 'mercato', 'gruppi', 'risparmi', 'pullman', 'sala', 'gita', 'piscina', 'punti'];

/** The numbers of each story, as keys of params. */
export const DATA_KEYS: Record<Story, string[]> = {
	resto: ['n', 'p', 'B'],
	mercato: ['a', 'p', 'b', 'q'],
	gruppi: ['a', 'b', 'c'],
	risparmi: ['B', 'S', 'R'],
	pullman: ['n', 'k', 'a', 'C'],
	sala: ['f', 'p', 'r', 'g'],
	gita: ['X', 'n', 'm'],
	piscina: ['L', 'g', 'h'],
	punti: ['G', 'v', 'p'],
};

const NAMES = ['Marta', 'Luca', 'Giulia', 'Matteo', 'Sara', 'Davide', 'Chiara', 'Francesco', 'Elena', 'Lorenzo', 'Sofia', 'Tommaso'];

/** The answer of each story from its data: the formula the text asks for, written once here. */
export function storyValue(story: Story, d: Record<string, number>): number {
	switch (story) {
		case 'resto':
			return d.B - d.n * d.p;
		case 'mercato':
			return d.a * d.p + d.b * d.q;
		case 'gruppi':
			return (d.a + d.b) / d.c;
		case 'risparmi':
			return (d.B - d.S) / d.R;
		case 'pullman':
			return d.C - (d.n * d.k + d.a);
		case 'sala':
			return (d.f * d.p - d.r) / d.g;
		case 'gita':
			return d.X / d.n + d.m;
		case 'piscina':
			return d.L * (d.g + d.h);
		case 'punti':
			return 3 * d.v + d.p;
	}
}

/** Plausibility of the data of each story (sizes a reader would find normal). */
function storyViolations(story: Story, d: Record<string, number>, value: number): string[] {
	const v: string[] = [];
	const within = (name: string, lo: number, hi: number) => {
		if (!(d[name] >= lo && d[name] <= hi)) v.push(`${name} = ${d[name]} fuori da ${lo}-${hi}`);
	};
	if (!Number.isInteger(value) || value < 1) v.push('risultato non naturale o nullo');
	switch (story) {
		case 'resto':
			within('n', 2, 6);
			within('p', 2, 15);
			if (![10, 20, 50, 100].includes(d.B)) v.push('banconota inesistente');
			if (d.n * d.p >= d.B) v.push('la banconota non basta');
			// the smallest banknote that covers the cost
			if ([10, 20, 50, 100].some((b) => b < d.B && b > d.n * d.p)) v.push('banconota più grande del necessario');
			break;
		case 'mercato':
			within('a', 2, 5);
			within('b', 2, 5);
			within('p', 1, 4);
			within('q', 1, 4);
			if (d.p === d.q) v.push('stesso prezzo al kg');
			break;
		case 'gruppi':
			within('a', 18, 28);
			within('b', 18, 28);
			within('c', 4, 8);
			if ((d.a + d.b) % d.c) v.push('gruppi non esatti');
			break;
		case 'risparmi':
			within('B', 40, 400);
			within('S', 10, 200);
			within('R', 5, 25);
			if (d.B % 10 || d.R % 5) v.push('prezzo o risparmio non tondi');
			if ((d.B - d.S) % d.R) v.push('settimane non esatte');
			if (value < 3 || value > 20) v.push('settimane fuori misura');
			break;
		case 'pullman':
			within('n', 2, 3);
			within('k', 18, 25);
			within('a', 2, 6);
			if (![50, 52, 54, 80].includes(d.C)) v.push('pullman di misura strana');
			if (value > 12) v.push('troppi posti liberi');
			break;
		case 'sala':
			within('f', 8, 15);
			within('p', 10, 20);
			within('r', 4, 30);
			within('g', 3, 6);
			if ((d.f * d.p - d.r) % d.g) v.push('posti non divisibili');
			if (value < 18 || value > 30) v.push('posti per classe fuori misura');
			break;
		case 'gita':
			within('n', 18, 28);
			within('m', 3, 10);
			if (d.X % d.n || d.X % 10) v.push('costo del pullman non divisibile o non tondo');
			if (d.X / d.n < 8 || d.X / d.n > 25) v.push('quota del pullman fuori misura');
			break;
		case 'piscina':
			if (d.L !== 25 && d.L !== 50) v.push('vasca di misura strana');
			within('g', 8, 30);
			within('h', 8, 30);
			if (d.g === d.h) v.push('stesso numero di vasche');
			break;
		case 'punti':
			within('G', 15, 38);
			within('v', 2, 30);
			within('p', 1, 15);
			if (d.v + d.p >= d.G) v.push('nessuna sconfitta o partite in più');
			break;
	}
	return v;
}

interface StoryBuilt {
	prose: string;
	expr: Node;
	data: Record<string, number>;
	unit: string;
	/** What each operation means, in words, before the expression. */
	plan: string;
	/** Answers from real mistakes: a datum used twice, the wrong operation, a different question. */
	mistakes: (number | null)[];
	extra?: Record<string, string>;
}

const nat = (v: number): number | null => (Number.isInteger(v) && v >= 0 ? v : null);

function buildStory(rng: Rng, story: Story): StoryBuilt | null {
	const name = rng.pick(NAMES);
	switch (story) {
		case 'resto': {
			const [item, lo, hi] = rng.pick<[string, number, number]>([
				['quaderni', 2, 4],
				['astucci', 6, 12],
				['biglietti del cinema', 7, 9],
				['panini', 3, 5],
				['libri', 9, 15],
			]);
			const n = rng.int(2, 6), p = rng.int(lo, hi);
			const cost = n * p;
			const B = [10, 20, 50, 100].find((b) => b > cost);
			if (!B) return null;
			return {
				prose: `${name} compra ${n} ${item} da ${p} euro ciascuno e paga con una banconota da ${B} euro. Quanti euro riceve di resto?`,
				expr: O('-', N(B), mul(n, p)),
				data: { n, p, B },
				unit: 'euro',
				plan: `${t('La spesa è ')}${n} \\cdot ${p}${t(' (lo stesso prezzo ripetuto ')}${n}${t(' volte); il resto è quello che manca alla banconota: ')}${B} - ${n} \\cdot ${p}`,
				mistakes: [cost, nat((B - n) * p), B - p, nat(B - n - p)],
				extra: { name, item },
			};
		}
		case 'mercato': {
			const fruits: [string, number, number][] = [
				['mele', 2, 3],
				['pere', 2, 3],
				['arance', 1, 3],
				['patate', 1, 2],
				['pomodori', 2, 4],
			];
			const [f1, f2] = [rng.pick(fruits), rng.pick(fruits)];
			if (f1[0] === f2[0]) return null;
			const a = rng.int(2, 5), b = rng.int(2, 5);
			const p = rng.int(f1[1], f1[2]), q = rng.int(f2[1], f2[2]);
			if (p === q) return null;
			return {
				prose: `Al mercato ${name} compra ${a} kg di ${f1[0]} a ${p} euro al kg e ${b} kg di ${f2[0]} a ${q} euro al kg. Quanti euro spende in tutto?`,
				expr: O('+', mul(a, p), mul(b, q)),
				data: { a, p, b, q },
				unit: 'euro',
				plan: `${t(`Le ${f1[0]} costano `)}${a} \\cdot ${p}${t(`, le ${f2[0]} `)}${b} \\cdot ${q}${t('; la spesa è la somma')}`,
				mistakes: [(a + b) * p, (a + b) * q, a * p + b, a + p + b + q, (a * p + b) * q],
				extra: { name, f1: f1[0], f2: f2[0] },
			};
		}
		case 'gruppi': {
			const a = rng.int(18, 28), b = rng.int(18, 28), c = rng.int(4, 8);
			if ((a + b) % c) return null;
			return {
				prose: `Due classi, una di ${a} e una di ${b} studenti, vanno in gita al museo. La guida divide tutti gli studenti in gruppi da ${c}. Quanti gruppi si formano?`,
				expr: O(':', G(add(a, b)), N(c)),
				data: { a, b, c },
				unit: 'gruppi',
				plan: `${t('Prima si contano gli studenti, ')}${a} + ${b}${t(', poi si vede quante volte il ')}${c}${t(' ci sta: ')}(${a} + ${b}) : ${c}`,
				mistakes: [a + b, b % c ? null : a + b / c, a % c ? null : a / c + b, (a + b) * c],
				extra: {},
			};
		}
		case 'risparmi': {
			const [item, lo, hi] = rng.pick<[string, number, number]>([
				['una bicicletta', 15, 30],
				['un monopattino', 20, 35],
				['delle cuffie', 6, 15],
				['una chitarra', 10, 25],
			]);
			const B = rng.int(lo, hi) * 10;
			const R = rng.pick([5, 10, 15, 20, 25]);
			const W = rng.int(3, 16);
			const S = B - R * W;
			if (S < 10 || S > 200) return null;
			return {
				prose: `${name} vuole comprare ${item} da ${B} euro. Ha già messo da parte ${S} euro e ogni settimana ne risparmia altri ${R}. Quante settimane deve ancora risparmiare?`,
				expr: O(':', G(O('-', N(B), N(S))), N(R)),
				data: { B, S, R },
				unit: 'settimane',
				plan: `${t('Mancano ')}${B} - ${S}${t(' euro; le settimane sono quante volte ci stanno i ')}${R}${t(' euro: ')}(${B} - ${S}) : ${R}`,
				mistakes: [B % R ? null : B / R, B - S, S % R ? null : nat(B - S / R), (B + S) % R ? null : (B + S) / R],
				extra: { name, item },
			};
		}
		case 'pullman': {
			const n = rng.int(2, 3), k = rng.int(18, 25), a = rng.int(2, 6);
			const people = n * k + a;
			const C = n === 2 ? [50, 52, 54].find((c) => c > people && c - people <= 12) : 80;
			if (!C || C - people < 1 || C - people > 12) return null;
			return {
				prose: `Per una gita, ${n} classi da ${k} studenti ciascuna e ${a} insegnanti salgono su un pullman da ${C} posti. Quanti posti restano liberi?`,
				expr: O('-', N(C), G(O('+', mul(n, k), N(a)))),
				data: { n, k, a, C },
				unit: 'posti',
				plan: `${t('Salgono ')}${n} \\cdot ${k} + ${a}${t(' persone; i posti liberi sono quelli che restano: ')}${C} - (${n} \\cdot ${k} + ${a})`,
				mistakes: [C - n * k + a, C - n * k, people, nat(C - (k + a)), nat(C - n - k - a)],
				extra: {},
			};
		}
		case 'sala': {
			const g = rng.int(3, 6), v = rng.int(18, 28);
			const f = rng.int(8, 15), p = rng.int(10, 20);
			const r = f * p - g * v;
			if (r < 4 || r > 30) return null;
			return {
				prose: `L'aula magna della scuola ha ${f} file da ${p} posti. I docenti occupano ${r} posti e gli altri sono divisi in parti uguali tra ${g} classi. Quanti posti spettano a ogni classe?`,
				expr: O(':', G(O('-', mul(f, p), N(r))), N(g)),
				data: { f, p, r, g },
				unit: 'posti',
				plan: `${t('I posti sono ')}${f} \\cdot ${p}${t('; tolti quelli dei docenti, il resto si divide per ')}${g}${t(': ')}(${f} \\cdot ${p} - ${r}) : ${g}`,
				mistakes: [r % g ? null : nat(f * p - r / g), f * p - r, (f * p) % g ? null : (f * p) / g, (f * p + r) % g ? null : (f * p + r) / g],
				extra: {},
			};
		}
		case 'gita': {
			const n = rng.int(18, 28), u = rng.int(8, 25), m = rng.int(3, 10);
			const X = n * u;
			if (X % 10) return null;
			return {
				prose: `Per la gita di fine anno il pullman costa ${X} euro, da dividere in parti uguali tra i ${n} studenti della classe. Il biglietto del museo costa ${m} euro a testa. Quanti euro spende ogni studente?`,
				expr: O('+', O(':', N(X), N(n)), N(m)),
				data: { X, n, m },
				unit: 'euro',
				plan: `${t('La quota del pullman è ')}${fmt(X)} : ${n}${t('; a ogni studente si aggiunge il biglietto: ')}${fmt(X)} : ${n} + ${m}`,
				mistakes: [X / n, (X + m) % n ? null : (X + m) / n, X % (n + m) ? null : X / (n + m), X / n + m * n],
				extra: {},
			};
		}
		case 'piscina': {
			const L = rng.pick([25, 25, 50]), g = rng.int(8, 30), h = rng.int(8, 30);
			if (g === h) return null;
			const [d1, d2] = rng.pick([
				['lunedì', 'mercoledì'],
				['martedì', 'giovedì'],
				['mercoledì', 'venerdì'],
				['sabato', 'domenica'],
			]);
			return {
				prose: `${name} si allena in una piscina con la vasca da ${L} metri: ${d1} nuota ${g} vasche e ${d2} ne nuota ${h}. Quanti metri nuota in tutto?`,
				expr: O('*', N(L), G(add(g, h))),
				data: { L, g, h },
				unit: 'metri',
				plan: `${t('In tutto nuota ')}${g} + ${h}${t(' vasche, ognuna da ')}${L}${t(' metri: ')}${L} \\cdot (${g} + ${h})`,
				mistakes: [L * g + h, g + h, L * g, L * h],
				extra: { name, d1, d2 },
			};
		}
		case 'punti': {
			const G_ = rng.int(15, 38), v = rng.int(2, 30), p = rng.int(1, 15);
			if (v + p >= G_) return null;
			return {
				prose: `La squadra di calcio di ${name} ha giocato ${G_} partite di campionato: ne ha vinte ${v}, pareggiate ${p} e perse le altre. Una vittoria vale 3 punti, un pareggio 1 punto e una sconfitta 0. Quanti punti ha la squadra?`,
				expr: O('+', mul(3, v), N(p)),
				data: { G: G_, v, p },
				unit: 'punti',
				plan: `${t('Le vittorie danno ')}3 \\cdot ${v}${t(' punti, i pareggi ')}${p}${t(', le sconfitte nessuno: ')}3 \\cdot ${v} + ${p}`,
				mistakes: [3 * v, v + p, 3 * (v + p), 3 * v + p + (G_ - v - p), 3 * G_],
				extra: { name },
			};
		}
	}
}

/** Violations of the rules of level 7 that do not depend on the story. */
function problemViolations(x: Node, story: Story, d: Record<string, number>): string[] {
	const v: string[] = [];
	const value = evaluate(x);
	if (value === null) return ['un passaggio esce da ℕ'];
	const ops = trace(x).length;
	if (ops < 2 || ops > 3) v.push(`${ops} operazioni, attese da 2 a 3`);
	if (value !== storyValue(story, d)) v.push("l'espressione non risponde alla domanda");
	for (const s of trace(x)) if (s.op === ':' && s.b < 2) v.push('divisione per 0 o per 1');
	v.push(...storyViolations(story, d, value));
	return v;
}

function problemSample(rng: Rng, seed: number): Sample {
	// the story first, then its numbers: every story comes out about as often, however many tries it needs
	const story = rng.pick(STORIES);
	for (let attempt = 0; attempt < 5000; attempt++) {
		const b = buildStory(rng, story);
		if (!b) continue;
		const x = withBrackets(b.expr);
		if (problemViolations(x, story, b.data).length) continue;
		const value = evaluate(x)!;
		const mistakes = [...new Set(b.mistakes.filter((m): m is number => m !== null && m >= 0 && m !== value))];
		return {
			generatorId: ID,
			level: 7,
			seed,
			prompt: 'Risolvi il problema.',
			problem: textBlock(b.prose),
			solution: `${fmt(value)}${t(` ${b.unit}`)}`,
			steps: [b.plan, ...exprSteps(x), `${t('Risposta: ')}${fmt(value)}${t(` ${b.unit}`)}`],
			answer: { kind: 'number', value: String(value) },
			params: {
				story,
				case: story,
				...Object.fromEntries(Object.entries(b.data).map(([k, n]) => [k, String(n)])),
				...b.extra,
				expr: ascii(x),
				value: String(value),
				mistakes: mistakes.map(String),
			},
		};
	}
	throw new Error(`${ID}: no word problem for seed ${seed}`);
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	const choiceOk = (ch: ChoiceAnswer, key: string) => {
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		const keys = ch.options.map((o) => o.values.join('|'));
		if (new Set(keys).size !== keys.length) v.push('opzioni ripetute');
		if (keys[ch.correct] !== key) v.push('opzione corretta sbagliata');
		if (keys.filter((k) => k === key).length !== 1) v.push('più di una opzione corretta');
	};
	if (lvl === 1) {
		const lhs = parseAscii(String(p.lhs)), rhs = parseAscii(String(p.rhs));
		const a = evaluate(lhs), b = evaluate(rhs);
		if (a === null || a !== b) v.push('i due membri non sono uguali');
		if (sample.answer.kind !== 'choice') return [...v, 'risposta non a scelta'];
		choiceOk(sample.answer, String(p.property));
		if (!(String(p.property) in PROPERTY_TEXT)) v.push('proprietà sconosciuta');
	} else if (lvl === 2) {
		const a = Number(p.a), b = Number(p.b);
		if (sample.answer.kind !== 'choice') return [...v, 'risposta non a scelta'];
		let key: string;
		if (b === 0) key = a === 0 ? 'indeterminata' : 'impossibile';
		else key = p.case === 'resto' ? `${Math.floor(a / b)}|${a % b}` : String(a / b);
		if (p.case === 'resto' && (b < 3 || b > 12 || a > 12 * 15 + 11)) v.push('numeri fuori misura');
		if (p.case !== 'resto' && a !== 0 && b !== 0) v.push('caso con lo zero senza zero');
		choiceOk(sample.answer, key);
	} else if (EXPR_LEVELS[lvl]) {
		const x = parseAscii(String(p.expr));
		if (latex(x) !== sample.problem) v.push('il testo non corrisponde a params.expr');
		v.push(...exprViolations(x, lvl));
		const value = evaluate(x);
		if (sample.answer.kind !== 'number' || sample.answer.value !== String(value)) v.push('risposta diversa dal valore');
		if (sample.choice) choiceOk(sample.choice, String(value));
	} else if (lvl === 7) {
		const story = String(p.story) as Story;
		if (!STORIES.includes(story)) return [...v, `storia sconosciuta ${story}`];
		const d = Object.fromEntries(DATA_KEYS[story].map((k) => [k, Number(p[k])]));
		const x = parseAscii(String(p.expr));
		v.push(...problemViolations(x, story, d));
		const truth = storyValue(story, d);
		if (sample.answer.kind !== 'number' || sample.answer.value !== String(truth)) v.push('risposta diversa dal valore');
		const text = sample.problem.replace(/\\,/g, '');
		for (const k of DATA_KEYS[story]) if (!new RegExp(`(^|[^0-9])${d[k]}([^0-9]|$)`).test(text)) v.push(`il numero ${d[k]} non è nel testo`);
		if (sample.choice) choiceOk(sample.choice, String(truth));
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.level === 7) {
		const value = Number(sample.params.value);
		const mistakes = ((sample.params.mistakes ?? []) as string[]).map((m) => mistakeOpt(Number(m), 100_000));
		return makeChoice(rng, numOpt(value), mistakes, nearNumbers(rng, value));
	}
	const x = parseAscii(String(sample.params.expr));
	const value = evaluate(x)!;
	const cands = [MISTAKE.leftToRight, MISTAKE.noBrackets, MISTAKE.mulFirst, MISTAKE.addFirst].map((m) => {
		const w = evaluate(x, m);
		return mistakeOpt(w, 5000);
	});
	return makeChoice(rng, numOpt(value), cands, nearNumbers(rng, value));
}

export const numeriNaturaliOperazioni: Generator = {
	id: ID,
	title: 'Operazioni in ℕ',
	levels: {
		1: { label: 'Proprietà delle operazioni', constraints: ['un’uguaglianza vera che mostra una sola proprietà', 'scelta tra quattro proprietà'] },
		2: { label: 'Lo zero e la divisione con resto', constraints: ['circa 3 su 10 divisioni con lo zero (0 : n, n : 0, 0 : 0)', 'le altre con resto: divisore da 3 a 12, quoziente fino a 15'] },
		3: { label: 'Espressioni senza parentesi', constraints: ['+, -, \\cdot e :, fino a 6 numeri', 'le priorità cambiano il risultato', 'ogni passaggio in ℕ'] },
		4: { label: 'Espressioni con le tonde', constraints: ['almeno una tonda che contiene una somma o una differenza', 'le parentesi cambiano il risultato'] },
		5: { label: 'Espressioni con tonde e quadre', constraints: ['almeno una quadra che contiene una tonda'] },
		6: { label: 'Espressioni con tonde, quadre e graffe', constraints: ['almeno una graffa che contiene una quadra'] },
		7: { label: 'Problemi con le quattro operazioni', constraints: ['un testo da tradurre in un’espressione di 2 o 3 operazioni', 'risultato naturale, divisioni esatte, numeri realistici'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const s =
				level === 1
					? propertySample(rng, rng.seed)
					: level === 2
						? divisionSample(rng, rng.seed)
						: EXPR_LEVELS[level]
							? exprSample(rng, level, rng.seed)
							: level === 7
								? problemSample(rng, rng.seed)
								: null;
			if (!s) throw new Error(`${ID}: unknown level ${level}`);
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriNaturaliOperazioni;
