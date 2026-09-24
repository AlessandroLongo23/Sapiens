/**
 * Potenze in ℕ. Spec: specs/exercises/numeri-naturali-potenze.md
 *
 * Five levels in the order of the lesson: the value of a power (with exponent 0 and 1, base 0, 1
 * and 10, and 0^0 that has no meaning); properties with the same base; with the same exponent;
 * bases to rewrite as powers of the same base; expressions with powers and brackets. Exponents are
 * chosen so that every quotient of powers has the larger exponent first (the result stays in ℕ).
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import {
	type BuildOpts,
	type Node,
	type Op,
	type Opt,
	G,
	MISTAKE,
	P,
	ascii,
	assertWellFormed,
	bracketHeight,
	buildSum,
	chain,
	countOps,
	evaluate,
	expLatex,
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
	power,
	shuffle,
	sumTerms,
	textOpt,
	trace,
	withBrackets,
} from '../naturali';

export const ID = 'numeri-naturali-potenze';

const t = (s: string) => `\\text{${s}}`;
const pw = (a: number, e: number | Node) => `${fmt(a)}${expLatex(e)}`;
const SYMBOL: Record<'*' | ':', string> = { '*': '\\cdot', ':': ':' };
const NO_MEANING = 'non ha significato';

// ---------------------------------------------------------------------------
// Level 1: the value of a power

/** Largest exponent for each base so that the power stays at most 1024. */
const MAX_EXP: Record<number, number> = { 2: 10, 3: 6, 4: 5, 5: 4, 6: 3, 7: 3, 8: 3, 9: 3, 11: 2, 12: 2, 13: 2, 15: 2, 20: 2 };

type L1Case = 'potenza' | 'esponente-0' | 'esponente-1' | 'base-0' | 'base-1' | 'base-10' | 'zero-zero';

function powerValueSample(rng: Rng, seed: number): Sample {
	const u = rng.next();
	const c: L1Case = u < 0.6 ? 'potenza' : u < 0.87 ? rng.pick(['esponente-0', 'esponente-1', 'base-0', 'base-1', 'base-10'] as const) : 'zero-zero';
	const base = { generatorId: ID, level: 1, seed };
	if (c === 'zero-zero') {
		const pool = shuffle(rng, [`0^${rng.int(1, 5)}`, `${rng.int(2, 9)}^0`, '1^0', `1^${rng.int(2, 9)}`, `0^1`]);
		const others = [...new Set(pool)].slice(0, 3);
		const opt = (s: string): Opt => ({ latex: s, values: [s] });
		const choice = makeChoice(rng, opt('0^0'), others.map(opt));
		const val = (s: string) => {
			const [b, e] = s.split('^').map(Number);
			return power(b, e);
		};
		return {
			...base,
			prompt: 'Quale di queste potenze non ha significato?',
			problem: '',
			solution: `0^0 ${t(' non ha significato')}`,
			steps: [
				`0^0 ${t(' non ha significato: non le si assegna nessun valore, perché porterebbe a ')}0 : 0${t(', che è indeterminata')}`,
				`${t('Le altre si calcolano: ')}${others.map((s) => `${s} = ${val(s)}`).join(',\\quad ')}`,
			],
			answer: choice,
			params: { options: choice.options.map((o) => o.values[0]), case: c },
		};
	}
	let a: number, n: number;
	switch (c) {
		case 'potenza': {
			a = rng.pick(Object.keys(MAX_EXP).map(Number));
			n = rng.int(2, MAX_EXP[a]);
			break;
		}
		case 'esponente-0':
			[a, n] = [rng.int(2, 30), 0];
			break;
		case 'esponente-1':
			[a, n] = [rng.int(2, 30), 1];
			break;
		case 'base-0':
			[a, n] = [0, rng.int(2, 9)];
			break;
		case 'base-1':
			[a, n] = [1, rng.int(2, 9)];
			break;
		default:
			[a, n] = [10, rng.int(2, 6)];
	}
	const v = power(a, n)!;
	let why: string;
	if (c === 'esponente-0') why = `${t('Ogni numero diverso da zero elevato a 0 fa 1: ')}${pw(a, 0)} = 1`;
	else if (c === 'esponente-1') why = `${t('Un numero elevato a 1 è il numero stesso: ')}${pw(a, 1)} = ${a}`;
	else if (c === 'base-0') why = `${t('Un solo fattore 0 rende nullo il prodotto: ')}${pw(0, n)} = 0`;
	else if (c === 'base-1') why = `${t('Il prodotto di fattori tutti uguali a 1 fa 1: ')}${pw(1, n)} = 1`;
	else if (c === 'base-10') why = `${t('Una potenza di 10 è 1 seguito da tanti zeri quanti dice l’esponente: ')}${pw(10, n)} = ${fmt(v)}`;
	else if (n <= 6) why = `${t('Moltiplica ')}${n}${t(' fattori uguali a ')}${a}${t(': ')}${pw(a, n)} = ${Array(n).fill(fmt(a)).join(' \\cdot ')} = ${fmt(v)}`;
	else why = `${t('Moltiplica ')}${n}${t(' fattori uguali a ')}${a}${t(': ')}${pw(a, n)} = ${pw(a, 5)} \\cdot ${pw(a, n - 5)} = ${fmt(power(a, 5)!)} \\cdot ${fmt(power(a, n - 5)!)} = ${fmt(v)}`;
	return {
		...base,
		prompt: 'Calcola la potenza.',
		problem: pw(a, n),
		solution: `${pw(a, n)} = ${fmt(v)}`,
		steps: [why],
		answer: { kind: 'number', value: String(v) },
		params: { base: String(a), exponent: String(n), value: String(v), case: c },
	};
}

function powerValueChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = Number(sample.params.base), n = Number(sample.params.exponent);
	const v = power(a, n)!;
	const c = sample.params.case as L1Case;
	const no = textOpt(NO_MEANING, NO_MEANING);
	let cands: (Opt | null)[];
	switch (c) {
		case 'esponente-0':
			cands = [numOpt(0), numOpt(a), no];
			break;
		case 'esponente-1':
			cands = [numOpt(1), numOpt(0)];
			break;
		case 'base-0':
			cands = [numOpt(1), numOpt(n), no];
			break;
		case 'base-1':
			cands = [numOpt(n), numOpt(0)];
			break;
		case 'base-10':
			cands = [numOpt(10 * n), numOpt(power(10, n - 1)!), numOpt(power(10, n + 1)!)];
			break;
		default:
			// 2^3 = 6, base and exponent swapped, one factor too few or too many
			cands = [numOpt(a * n), mistakeOpt(power(n, a)), numOpt(power(a, n - 1)!), mistakeOpt(power(a, n + 1))];
	}
	return makeChoice(rng, numOpt(v), cands, nearNumbers(rng, v));
}

// ---------------------------------------------------------------------------
// Levels 2-4: chains of powers with the properties

/** One factor of a chain: base^exp, or (base^exp)^outer for a power of a power. */
interface Item {
	base: number;
	exp: number;
	outer?: number;
}

const itemNode = (it: Item): Node => (it.outer === undefined ? P(it.base, it.exp) : P(G(P(it.base, it.exp)), it.outer));
const chainNode = (items: Item[], ops: Op[]): Node => withBrackets(chain(items.map(itemNode), ops));

/** Largest final exponent for each base: the value stays at most 1024 (10 000 for base 10). */
const FINAL_MAX: Record<number, number> = { 2: 10, 3: 6, 5: 4, 7: 3, 10: 4 };

/** Exponent arithmetic of a same-base chain, with the mistakes for the distractors. */
function exponentOf(items: { exp: number; outer?: number }[], ops: Op[], mistake: 'none' | 'powSum' | 'prodMul' | 'allSum' | 'zeroIsZero' = 'none'): number | null {
	const e = items.map((it) => (it.outer === undefined ? it.exp : mistake === 'powSum' ? it.exp + it.outer : it.exp * it.outer));
	let acc = e[0];
	for (let i = 0; i < ops.length; i++) {
		if (ops[i] === '*' || mistake === 'allSum') acc = mistake === 'prodMul' && ops[i] === '*' ? acc * e[i + 1] : acc + e[i + 1];
		else {
			if (acc < e[i + 1]) return null;
			acc -= e[i + 1];
		}
	}
	return acc;
}

/** Steps for a chain of powers with the same base a (exponents already in base a). */
function sameBaseSteps(a: number, items: Item[], ops: Op[]): string[] {
	const out: string[] = [];
	const pp = items.filter((it) => it.outer !== undefined);
	let exps = items.map((it) => (it.outer === undefined ? it.exp : it.exp * it.outer));
	let curOps = [...ops];
	const show = () => exps.map((e, i) => (i === 0 ? pw(a, e) : ` ${SYMBOL[curOps[i - 1] as '*' | ':']} ${pw(a, e)}`)).join('');
	if (pp.length) {
		const parts = pp.map((it) => `(${pw(it.base, it.exp)})${expLatex(it.outer!)} = ${fmt(a)}^{${it.exp} \\cdot ${it.outer}} = ${pw(a, it.exp * it.outer!)}`);
		out.push(`${t('Potenza di una potenza, si moltiplicano gli esponenti: ')}${parts.join(',\\quad ')}${exps.length > 1 ? `${t('; resta ')}${show()}` : ''}`);
	}
	while (exps.length > 1) {
		const [x, y] = exps;
		const op = curOps[0];
		const r = op === '*' ? x + y : x - y;
		const sign = op === '*' ? '+' : '-';
		const what = op === '*' ? t('Prodotto di potenze con la stessa base, si sommano gli esponenti: ') : t('Quoziente di potenze con la stessa base, si sottraggono gli esponenti: ');
		const body = `${pw(a, x)} ${SYMBOL[op as '*' | ':']} ${pw(a, y)} = ${fmt(a)}^{${x} ${sign} ${y}} = ${pw(a, r)}`;
		exps = [r, ...exps.slice(2)];
		curOps = curOps.slice(1);
		out.push(`${what}${body}${exps.length > 1 ? `${t('; resta ')}${show()}` : ''}`);
	}
	return out;
}

/** The last step: the power left at the end, calculated. */
function finalStep(a: number, k: number): string {
	const v = power(a, k)!;
	if (k === 0) return `${pw(a, 0)} = 1`;
	if (k === 1) return `${pw(a, 1)} = ${fmt(a)}`;
	return `${pw(a, k)} = ${fmt(v)}`;
}

type SameBaseTemplate = 'prodotto-quoziente' | 'quoziente-prodotto' | 'potenza-di-potenza' | 'con-esponente-0' | 'quoziente-di-potenza' | 'due-quozienti';

function sameBaseSample(rng: Rng, seed: number): Sample {
	for (;;) {
		const a = rng.pick([2, 2, 3, 3, 5, 7, 10]);
		const r = () => rng.int(2, 9);
		const tpl = rng.pick(['prodotto-quoziente', 'quoziente-prodotto', 'potenza-di-potenza', 'con-esponente-0', 'quoziente-di-potenza', 'due-quozienti'] as SameBaseTemplate[]);
		let items: Item[], ops: Op[];
		switch (tpl) {
			case 'prodotto-quoziente':
				[items, ops] = [[{ base: a, exp: r() }, { base: a, exp: r() }, { base: a, exp: r() }], ['*', ':']];
				break;
			case 'quoziente-prodotto':
				[items, ops] = [[{ base: a, exp: r() }, { base: a, exp: r() }, { base: a, exp: r() }], [':', '*']];
				break;
			case 'potenza-di-potenza':
				[items, ops] = [[{ base: a, exp: r(), outer: rng.int(2, 4) }, { base: a, exp: r() }], [':']];
				break;
			case 'con-esponente-0':
				[items, ops] = [[{ base: a, exp: r(), outer: rng.int(2, 4) }, { base: a, exp: r() }, { base: a, exp: 0 }], [':', '*']];
				break;
			case 'quoziente-di-potenza':
				[items, ops] = [[{ base: a, exp: r() }, { base: a, exp: r() }, { base: a, exp: rng.int(2, 4), outer: rng.int(2, 3) }], ['*', ':']];
				break;
			default:
				[items, ops] = [[{ base: a, exp: rng.int(6, 15) }, { base: a, exp: r() }, { base: a, exp: r() }], [':', ':']];
		}
		const k = exponentOf(items, ops);
		if (k === null || k > FINAL_MAX[a] || items.some((it) => it.exp * (it.outer ?? 1) > 15)) continue;
		if (k <= 1 && rng.next() < 0.6) continue; // a few results 1 or a, most a real power
		const x = chainNode(items, ops);
		const v = power(a, k)!;
		return {
			generatorId: ID,
			level: 2,
			seed,
			prompt: 'Calcola usando le proprietà delle potenze.',
			problem: latex(x),
			solution: `${pw(a, k)} = ${fmt(v)}`,
			steps: [...sameBaseSteps(a, items, ops), finalStep(a, k)],
			answer: { kind: 'number', value: String(v) },
			params: { expr: ascii(x), base: String(a), exponent: String(k), value: String(v), template: tpl },
		};
	}
}

type SameExpTemplate = 'prodotto' | 'quoziente' | 'prodotto-quoziente';

function sameExponentSample(rng: Rng, seed: number): Sample {
	for (;;) {
		const tpl = rng.pick(['prodotto', 'quoziente', 'quoziente', 'prodotto-quoziente'] as SameExpTemplate[]);
		const n = rng.int(2, 4);
		let bases: number[], ops: Op[], q: number;
		if (tpl === 'prodotto') {
			bases = [rng.int(2, 9), rng.int(2, 9)];
			ops = ['*'];
			q = bases[0] * bases[1];
		} else if (tpl === 'quoziente') {
			const b = rng.int(2, 10), qq = rng.int(2, 5);
			bases = [b * qq, b];
			ops = [':'];
			q = qq;
		} else {
			const c = rng.pick([6, 10, 12, 15, 20]);
			const a = rng.int(2, 9), qq = rng.int(2, 4);
			if ((c * qq) % a !== 0) continue;
			bases = [a, (c * qq) / a, c];
			ops = ['*', ':'];
			q = qq;
		}
		if (new Set(bases).size !== bases.length || bases.some((b) => b < 2)) continue;
		const vals = bases.map((b) => power(b, n)!);
		const v = power(q, n)!;
		if (vals.some((w) => w > 10000) || v > 10000 || q < 2) continue;
		const x = withBrackets(chain(bases.map((b) => P(b, n)), ops));
		if ((evaluate(x) ?? -1) !== v || trace(x).some((s) => s.r > 100000)) continue;
		const inside = bases.map((b, i) => (i === 0 ? fmt(b) : ` ${SYMBOL[ops[i - 1] as '*' | ':']} ${fmt(b)}`)).join('');
		const what =
			tpl === 'prodotto'
				? t('Prodotto di potenze con lo stesso esponente, si moltiplicano le basi: ')
				: tpl === 'quoziente'
					? t('Quoziente di potenze con lo stesso esponente, si dividono le basi: ')
					: t('Le potenze hanno lo stesso esponente, quindi si opera sulle basi: ');
		return {
			generatorId: ID,
			level: 3,
			seed,
			prompt: 'Calcola usando le proprietà delle potenze.',
			problem: latex(x),
			solution: `${pw(q, n)} = ${fmt(v)}`,
			steps: [`${what}${latex(x)} = (${inside})${expLatex(n)} = ${pw(q, n)}`, `${pw(q, n)} = ${fmt(v)}`],
			answer: { kind: 'number', value: String(v) },
			params: { expr: ascii(x), exponent: String(n), base: String(q), value: String(v), template: tpl },
		};
	}
}

/** Powers of 2, 3, 5 that students rewrite: 4 = 2^2, 8 = 2^3, ... */
const REWRITE: Record<number, [number, number][]> = {
	2: [
		[4, 2],
		[8, 3],
		[16, 4],
		[32, 5],
	],
	3: [
		[9, 2],
		[27, 3],
	],
	5: [[25, 2]],
};

function rewriteSample(rng: Rng, seed: number): Sample {
	for (;;) {
		const a = rng.pick([2, 2, 3, 5]);
		const len = rng.pick([2, 3, 3]);
		const items: { base: number; exp: number; mult: number }[] = [];
		for (let i = 0; i < len; i++) {
			if (rng.next() < 0.6) {
				const [b, m] = rng.pick(REWRITE[a]);
				items.push({ base: b, exp: rng.int(2, 5), mult: m });
			} else items.push({ base: a, exp: rng.int(2, 9), mult: 1 });
		}
		if (!items.some((it) => it.mult > 1) || new Set(items.map((it) => it.base)).size < 2) continue;
		const ops: Op[] = Array.from({ length: len - 1 }, () => (rng.int(0, 1) ? '*' : ':'));
		const inA = items.map((it) => ({ exp: it.exp * it.mult }));
		if (inA.some((e) => e.exp > 15)) continue;
		const k = exponentOf(inA, ops);
		if (k === null || k > FINAL_MAX[a] || (k <= 1 && rng.next() < 0.7)) continue;
		const x = withBrackets(chain(items.map((it) => P(it.base, it.exp)), ops));
		const v = power(a, k)!;
		const conv = items.filter((it) => it.mult > 1);
		const convText = [...new Map(conv.map((it) => [`${it.base}^${it.exp}`, it])).values()]
			.map((it) => `${pw(it.base, it.exp)} = (${pw(a, it.mult)})${expLatex(it.exp)} = ${pw(a, it.exp * it.mult)}`)
			.join(',\\quad ');
		const inAItems: Item[] = inA.map((e) => ({ base: a, exp: e.exp }));
		const rest = inAItems.map((it, i) => (i === 0 ? pw(a, it.exp) : ` ${SYMBOL[ops[i - 1] as '*' | ':']} ${pw(a, it.exp)}`)).join('');
		return {
			generatorId: ID,
			level: 4,
			seed,
			prompt: 'Riporta le potenze alla stessa base e calcola.',
			problem: latex(x),
			solution: `${pw(a, k)} = ${fmt(v)}`,
			steps: [`${t('Scrivi le basi come potenze di ')}${a}${t(': ')}${convText}${t('; resta ')}${rest}`, ...sameBaseSteps(a, inAItems, ops), finalStep(a, k)],
			answer: { kind: 'number', value: String(v) },
			params: { expr: ascii(x), base: String(a), exponent: String(k), value: String(v) },
		};
	}
}

/** Distractors of levels 2-4, from the exponent arithmetic done wrong. */
function chainChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const x = parseAscii(String(sample.params.expr));
	const v = evaluate(x)!;
	const cands: (number | null)[] = [];
	// the factors of the chain, as (base, exp, outer)
	const factors: { base: number; exp: number; outer?: number }[] = [];
	const ops: Op[] = [];
	const walk = (y: Node) => {
		if (y.t === 'op') {
			walk(y.l);
			ops.push(y.op);
			walk(y.r);
		} else if (y.t === 'pow' && y.b.t === 'g' && y.b.c.t === 'pow') factors.push({ base: (y.b.c.b as { v: number }).v, exp: (y.b.c.e as { v: number }).v, outer: (y.e as { v: number }).v });
		else if (y.t === 'pow') factors.push({ base: (y.b as { v: number }).v, exp: (y.e as { v: number }).v });
	};
	walk(x);
	if (sample.level === 3) {
		const n = Number(sample.params.exponent), q = Number(sample.params.base);
		const onlyProd = ops.every((o) => o === '*');
		cands.push(q * n); // q^n computed as q · n
		if (onlyProd) cands.push(power(q, 2 * n)); // exponents added
		else cands.push(1); // exponents subtracted: (a : b)^0
		cands.push(q, power(q, n + 1), power(q, n - 1));
	} else {
		const a = Number(sample.params.base);
		const k = Number(sample.params.exponent);
		const REW = (b: number) => (b === a ? 1 : Math.round(Math.log(b) / Math.log(a)));
		const inA = (mist: 'none' | 'noRewrite' | 'rewriteSum') =>
			factors.map((f) => {
				const m = REW(f.base);
				const e = mist === 'noRewrite' ? f.exp : mist === 'rewriteSum' && m > 1 ? f.exp + m : f.exp * m;
				return { exp: e, outer: f.outer };
			});
		const val = (e: number | null) => (e === null ? null : power(a, e));
		cands.push(a * k); // a^k computed as a · k
		if (sample.level === 4) {
			cands.push(val(exponentOf(inA('rewriteSum'), ops)), val(exponentOf(inA('noRewrite'), ops)));
		} else {
			cands.push(val(exponentOf(inA('none'), ops, 'powSum')), val(exponentOf(inA('none'), ops, 'prodMul')));
			if (factors.some((f) => f.exp === 0)) cands.push(0); // a^0 taken as 0
			cands.push(val(exponentOf(inA('none'), ops, 'allSum')));
		}
		cands.push(val(k + 1), k >= 1 ? val(k - 1) : null);
	}
	return makeChoice(
		rng,
		numOpt(v),
		cands.map((c) => mistakeOpt(c)),
		nearNumbers(rng, v),
	);
}

// ---------------------------------------------------------------------------
// Level 5: expressions with powers

export const EXPR_OPTS: BuildOpts = { maxLit: 50, maxVal: 300, maxFactor: 12, groupP: 0.2, pow: { p: 0.7, maxValue: 125, maxExp: 5 } };

function exprViolations(x: Node): string[] {
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
		if (s.r > EXPR_OPTS.maxVal) v.push(`risultato intermedio ${s.r} oltre ${EXPR_OPTS.maxVal}`);
		if (s.op === '*' && (Math.min(s.a, s.b) > EXPR_OPTS.maxFactor || Math.min(s.a, s.b) < 2)) v.push(`prodotto ${s.a} · ${s.b} fuori misura`);
		if (s.op === ':' && (s.b < 2 || s.b > EXPR_OPTS.maxFactor)) v.push(`divisore ${s.b} fuori misura`);
		if ((s.op === '+' || s.op === '-') && s.b < 1) v.push('addendo nullo');
		if (s.op === '^' && (s.r > 125 || s.a < 2 || s.b < 2 || s.b > 5)) v.push(`potenza ${s.a}^${s.b} fuori misura`);
	}
	const lits = literals(x);
	if (lits.some((n) => n > EXPR_OPTS.maxLit)) v.push('numero troppo grande nel testo');
	if (lits.length < 4 || lits.length > 9) v.push(`numeri nel testo: ${lits.length}, attesi da 4 a 9`);
	const h = bracketHeight(x);
	if (h < 0 || h > 1) v.push('servono tonde, al massimo quadre');
	if (countOps(x, (y) => y.t === 'pow') === 0) v.push('serve almeno una potenza');
	if (countOps(x, isOp('*', ':')) === 0 || countOps(x, isOp('+', '-')) === 0) v.push('servono sia \\cdot o : sia + o -');
	if (countOps(x, (y) => y.t === 'g' && sumTerms(y.c).length < 2)) v.push('parentesi inutile');
	if (evaluate(x, MISTAKE.powTimes) === value) v.push('2^3 = 6 dà lo stesso risultato');
	if (evaluate(x, MISTAKE.noBrackets) === value) v.push('le parentesi non cambiano il risultato');
	return v;
}

function exprSample(rng: Rng, seed: number): Sample {
	for (let attempt = 0; attempt < 20000; attempt++) {
		const raw = buildSum(rng, rng.int(2, 60), rng.pick([1, 2]), true, EXPR_OPTS, true);
		if (!raw) continue;
		let x: Node;
		try {
			x = withBrackets(raw);
		} catch {
			continue;
		}
		if (exprViolations(x).length) continue;
		const value = evaluate(x)!;
		return {
			generatorId: ID,
			level: 5,
			seed,
			prompt: "Calcola il valore dell'espressione.",
			problem: latex(x),
			solution: fmt(value),
			steps: exprSteps(x),
			answer: { kind: 'number', value: String(value) },
			params: { expr: ascii(x), value: String(value) },
		};
	}
	throw new Error(`${ID}: no expression, seed ${seed}`);
}

function exprChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const x = parseAscii(String(sample.params.expr));
	const value = evaluate(x)!;
	const cands = [MISTAKE.powTimes, MISTAKE.leftToRight, MISTAKE.powDistrib, MISTAKE.noBrackets, MISTAKE.mulFirst].map((m) => mistakeOpt(evaluate(x, m), 5000));
	return makeChoice(rng, numOpt(value), cands, nearNumbers(rng, value));
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const choiceOk = (ch: ChoiceAnswer | undefined, key: string) => {
		if (!ch) return;
		const keys = ch.options.map((o) => o.values.join('|'));
		if (keys.length !== 4 || new Set(keys).size !== 4) v.push('servono 4 opzioni distinte');
		if (keys[ch.correct] !== key || keys.filter((k) => k === key).length !== 1) v.push('opzione corretta sbagliata');
	};
	switch (sample.level) {
		case 1: {
			if (p.case === 'zero-zero') {
				if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
				const undef = sample.answer.options.filter((o) => o.values[0] === '0^0');
				if (undef.length !== 1) v.push('serve esattamente una 0^0');
				choiceOk(sample.answer, '0^0');
				break;
			}
			const a = Number(p.base), n = Number(p.exponent);
			const val = power(a, n);
			if (val === null || sample.answer.kind !== 'number' || sample.answer.value !== String(val)) v.push('risposta diversa');
			if (val !== null && (p.case === 'base-10' ? n > 6 : val > 1024)) v.push('potenza troppo grande');
			choiceOk(sample.choice, String(val));
			break;
		}
		case 2:
		case 3:
		case 4: {
			const x = parseAscii(String(p.expr));
			if (latex(x) !== sample.problem) v.push('il testo non corrisponde a params.expr');
			const val = evaluate(x);
			if (val === null) v.push('un passaggio esce da ℕ');
			if (sample.answer.kind !== 'number' || sample.answer.value !== String(val)) v.push('risposta diversa');
			if (val !== null && val > 10000) v.push('risultato troppo grande');
			choiceOk(sample.choice, String(val));
			break;
		}
		case 5: {
			const x = parseAscii(String(p.expr));
			if (latex(x) !== sample.problem) v.push('il testo non corrisponde a params.expr');
			v.push(...exprViolations(x));
			const val = evaluate(x);
			if (sample.answer.kind !== 'number' || sample.answer.value !== String(val)) v.push('risposta diversa');
			choiceOk(sample.choice, String(val));
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.level === 1) return powerValueChoice(sample, rng);
	if (sample.level === 5) return exprChoice(sample, rng);
	return chainChoice(sample, rng);
}

export const numeriNaturaliPotenze: Generator = {
	id: ID,
	title: 'Potenze in ℕ',
	levels: {
		1: { label: 'Il valore di una potenza', constraints: ['potenze fino a 1024; esponente 0 e 1, base 0, 1 e 10', 'circa 1 su 8: quale potenza non ha significato (0^0)'] },
		2: { label: 'Proprietà con la stessa base', constraints: ['prodotto, quoziente, potenza di potenza, esponente 0', 'esponente finale con valore fino a 1024'] },
		3: { label: 'Proprietà con lo stesso esponente', constraints: ['prodotto e quoziente di potenze con lo stesso esponente', 'risultato fino a 10 000'] },
		4: { label: 'Basi da riportare alla stessa base', constraints: ['basi 4, 8, 16, 32, 9, 27, 25 da scrivere come potenze di 2, 3, 5'] },
		5: { label: 'Espressioni con le potenze', constraints: ['potenze fino a 125, tonde e al massimo quadre', 'ogni passaggio in ℕ'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			let s: Sample;
			switch (level) {
				case 1:
					s = powerValueSample(rng, rng.seed);
					break;
				case 2:
					s = sameBaseSample(rng, rng.seed);
					break;
				case 3:
					s = sameExponentSample(rng, rng.seed);
					break;
				case 4:
					s = rewriteSample(rng, rng.seed);
					break;
				case 5:
					s = exprSample(rng, rng.seed);
					break;
				default:
					throw new Error(`${ID}: unknown level ${level}`);
			}
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriNaturaliPotenze;
