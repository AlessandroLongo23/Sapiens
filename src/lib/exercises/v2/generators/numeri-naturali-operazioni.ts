/**
 * Operazioni in ℕ. Spec: specs/exercises/numeri-naturali-operazioni.md
 *
 * Six levels in the order of the lesson: which property of the operations was used; zero in the
 * division and division with remainder; expressions without brackets (priorities); with tonde; with
 * tonde and quadre; with tonde, quadre and graffe. Expressions are built backwards from their value
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
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
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
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const s = level === 1 ? propertySample(rng, rng.seed) : level === 2 ? divisionSample(rng, rng.seed) : EXPR_LEVELS[level] ? exprSample(rng, level, rng.seed) : null;
			if (!s) throw new Error(`${ID}: unknown level ${level}`);
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriNaturaliOperazioni;
