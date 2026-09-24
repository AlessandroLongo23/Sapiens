/**
 * Numeri interi e valore assoluto. Spec: specs/exercises/numeri-interi-valore-assoluto.md
 *
 * Six levels in the order of the lesson: sign and membership (ℕ, ℤ); the opposite and the absolute
 * value of one number, also with a double sign; comparing two integers; ordering five to seven
 * integers; ordering expressions with opposites and absolute values; the integers between two
 * endpoints and the successor or predecessor of a negative. Every level is multiple choice; the
 * counting and successor questions of level 6 have a number answer and build the choice from params.
 * The wrong options are the mistakes the lesson warns about: negatives compared as if they were
 * positive, absolute values compared in place of the numbers, the minus outside |…| ignored.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { buildChoice, shuffle, weighted } from '../razionali';

export const ID = 'numeri-interi-valore-assoluto';

const t = (s: string) => `\\text{${s}}`;
const N = '\\mathbb{N}';
const Z = '\\mathbb{Z}';
const LIST_SEP = ',\\quad ';

function distinctInts(rng: Rng, n: number, gen: () => number, key: (v: number) => number = (v) => v): number[] | null {
	const out: number[] = [];
	const seen = new Set<number>();
	for (let i = 0; i < 400 && out.length < n; i++) {
		const v = gen();
		if (seen.has(key(v))) continue;
		seen.add(key(v));
		out.push(v);
	}
	return out.length === n ? out : null;
}

const asc = (xs: number[]) => [...xs].sort((a, b) => a - b);

/** Ascending order with the negatives ordered as if they were positive: -1, -7, -15, 0, 3. */
function signMistake(xs: number[]): number[] {
	const neg = xs.filter((v) => v < 0).sort((a, b) => b - a);
	return [...neg, ...asc(xs.filter((v) => v >= 0))];
}

/** Ascending by absolute value (the absolute values compared in place of the numbers). */
const byAbs = (xs: number[]) => [...xs].sort((a, b) => Math.abs(a) - Math.abs(b) || a - b);

/** Orders obtained from `xs` by swapping two adjacent items: fallback distractors. */
const adjacentSwaps = (xs: number[]): number[][] =>
	xs.slice(0, -1).map((_, i) => {
		const ys = [...xs];
		[ys[i], ys[i + 1]] = [ys[i + 1], ys[i]];
		return ys;
	});

// ---------------------------------------------------------------------------
// Level 1: sign and membership

type Sign = 'positivo' | 'negativo' | 'nullo';
type Member = 'NZ' | 'Z' | 'N';

const SIGN_TEXT: Record<Sign, string> = { positivo: 'è positivo', negativo: 'è negativo', nullo: 'non è né positivo né negativo' };
const MEMBER_LATEX: Record<Member, string> = {
	NZ: `${t(' e appartiene a ')}${N}${t(' e a ')}${Z}`,
	Z: `${t(' e appartiene a ')}${Z}${t(' ma non a ')}${N}`,
	N: `${t(' e appartiene a ')}${N}${t(' ma non a ')}${Z}`,
};
const statementOpt = (s: Sign, m: Member): ChoiceOption => ({ latex: `${t(SIGN_TEXT[s])}${MEMBER_LATEX[m]}`, values: [s, m] });

function level1(rng: Rng): Built {
	const sign = weighted<Sign>(rng, [
		['positivo', 40],
		['negativo', 45],
		['nullo', 15],
	]);
	const a = rng.int(1, 30);
	const n = sign === 'positivo' ? a : sign === 'negativo' ? -a : 0;
	const plus = sign === 'positivo' && rng.int(0, 1) === 1;
	const shown = plus ? `+${n}` : `${n}`;
	const member: Member = sign === 'negativo' ? 'Z' : 'NZ';
	const wrong: [Sign, Member][] =
		sign === 'positivo'
			? [['positivo', 'N'], ['positivo', 'Z'], ['negativo', 'Z']]
			: sign === 'negativo'
				? [['negativo', 'NZ'], ['positivo', 'NZ'], ['negativo', 'N']]
				: [['positivo', 'NZ'], ['nullo', 'Z'], ['negativo', 'Z']];
	const answer = buildChoice(rng, statementOpt(sign, member), wrong.map(([s, m]) => statementOpt(s, m)));
	const steps: string[] = [];
	if (plus) steps.push(`${shown} = ${n}${t(': il segno + davanti a un positivo si può omettere')}`);
	if (sign === 'positivo') {
		steps.push(`${n} > 0${t(', quindi è positivo')}`);
		steps.push(`${n} \\in ${N}${t(' e, siccome ')}${N} \\subset ${Z}${t(', anche ')}${n} \\in ${Z}`);
	} else if (sign === 'negativo') {
		steps.push(`${n} < 0${t(', quindi è negativo')}`);
		steps.push(`${t('I naturali non sono mai negativi: ')}${n} \\notin ${N}${t(', mentre ')}${n} \\in ${Z}`);
	} else {
		steps.push(`${t('Lo zero non ha segno: non è né positivo né negativo')}`);
		steps.push(`0 \\in ${N}${t(' e quindi anche ')}0 \\in ${Z}`);
	}
	return {
		prompt: 'Quale affermazione sul numero è vera?',
		problem: shown,
		steps,
		solution: `${shown}${t(': ')}${answer.options[answer.correct].latex}`,
		answer,
		params: { number: String(n), shown, sign, member, case: sign },
	};
}

// ---------------------------------------------------------------------------
// Level 2: opposite and absolute value

type OppKind = '-(-a)' | '-(+a)' | '+(-a)';
type AbsKind = '|-a|' | '|+a|' | '-|-a|' | '-|a|';

const OPP: Record<OppKind, { latex: (a: number) => string; value: (a: number) => number; why: (a: number) => string }> = {
	'-(-a)': { latex: (a) => `-(-${a})`, value: (a) => a, why: (a) => `${t("l'opposto di ")}-${a}${t(' è ')}${a}` },
	'-(+a)': { latex: (a) => `-(+${a})`, value: (a) => -a, why: (a) => `${t("l'opposto di ")}${a}${t(' è ')}-${a}` },
	'+(-a)': { latex: (a) => `+(-${a})`, value: (a) => -a, why: () => t('il segno + lascia il numero com’è') },
};
const ABS: Record<AbsKind, { latex: (a: number) => string; value: (a: number) => number; why: (a: number) => string }> = {
	'|-a|': { latex: (a) => `|-${a}|`, value: (a) => a, why: (a) => `-${a}${t(' sta a ')}${a}${t(' unità da ')}0` },
	'|+a|': { latex: (a) => `|+${a}|`, value: (a) => a, why: (a) => `${a}${t(' sta a ')}${a}${t(' unità da ')}0` },
	'-|-a|': { latex: (a) => `-|-${a}|`, value: (a) => -a, why: (a) => `${t('prima ')}|-${a}| = ${a}${t(", poi l'opposto")}` },
	'-|a|': { latex: (a) => `-|${a}|`, value: (a) => -a, why: (a) => `${t('prima ')}|${a}| = ${a}${t(", poi l'opposto")}` },
};

const pairOpt = (u: number, v: number): ChoiceOption => ({ latex: `${u}${t(' e ')}${v}`, values: [String(u), String(v)] });

function level2(rng: Rng): Built {
	const a = rng.int(2, 20);
	const ok = weighted<OppKind>(rng, [
		['-(-a)', 4],
		['-(+a)', 2],
		['+(-a)', 2],
	]);
	const ak = weighted<AbsKind>(rng, [
		['|-a|', 3],
		['|+a|', 1],
		['-|-a|', 3],
		['-|a|', 2],
	]);
	const o = OPP[ok], b = ABS[ak];
	const u = o.value(a), v = b.value(a);
	const wrong = [pairOpt(-u, v), pairOpt(u, -v), pairOpt(-u, -v)];
	const answer = buildChoice(rng, pairOpt(u, v), wrong);
	return {
		prompt: 'Calcola le due espressioni.',
		problem: `${o.latex(a)} \\qquad ${b.latex(a)}`,
		steps: [`${o.latex(a)} = ${u}${t(': ')}${o.why(a)}`, `${b.latex(a)} = ${v}${t(': ')}${b.why(a)}`],
		solution: `${o.latex(a)} = ${u} \\qquad ${b.latex(a)} = ${v}`,
		answer,
		params: { base: String(a), opposite: ok, absolute: ak, values: [String(u), String(v)], case: ak.startsWith('-') ? 'meno fuori' : 'senza meno fuori' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: comparing two integers

type PairCase = 'negativi' | 'discordi' | 'positivi' | 'zero';

function pairOf(rng: Rng, c: PairCase): [number, number] | null {
	let x: number, y: number;
	if (c === 'negativi') [x, y] = [-rng.int(1, 20), -rng.int(1, 20)];
	else if (c === 'positivi') [x, y] = [rng.int(1, 20), rng.int(1, 20)];
	else if (c === 'zero') [x, y] = [0, rng.int(0, 1) ? rng.int(1, 20) : -rng.int(1, 20)];
	else {
		// the negative with the larger absolute value, so that comparing |…| gives the wrong answer
		const p = rng.int(1, 15);
		[x, y] = [-rng.int(p + 1, 20), p];
	}
	if (x === y) return null;
	return rng.int(0, 1) ? [x, y] : [y, x];
}

const relOf = (x: number, y: number) => (x < y ? '<' : '>');
const flip = (r: string) => (r === '<' ? '>' : '<');
const cmpOpt = (x: number, r: string, y: number): ChoiceOption => ({ latex: `${x} ${r} ${y}`, values: [String(x), r, String(y)] });

const RULE: Record<PairCase, string> = {
	negativi: 'tra due negativi è maggiore quello con il valore assoluto minore',
	discordi: 'un negativo è sempre minore di un positivo',
	positivi: 'tra due positivi è maggiore quello con il valore assoluto maggiore',
	zero: 'lo zero è maggiore di ogni negativo e minore di ogni positivo',
};

function level3(rng: Rng): Built | null {
	const c = weighted<PairCase>(rng, [
		['negativi', 40],
		['discordi', 30],
		['zero', 15],
		['positivi', 15],
	]);
	const right = pairOf(rng, c);
	const wrongCases: PairCase[] = ['negativi', 'discordi', rng.pick(['negativi', 'zero', 'positivi'] as PairCase[])];
	const wrongs = wrongCases.map((wc) => {
		const p = pairOf(rng, wc);
		return p ? { c: wc, p } : null;
	});
	if (!right || wrongs.some((w) => !w)) return null;
	const all = [{ c, p: right, truth: true }, ...wrongs.map((w) => ({ ...w!, truth: false }))];
	const used = new Set(all.map(({ p }) => [...p].sort((m, n) => m - n).join(',')));
	if (used.size !== 4) return null;
	const opt = (e: { p: [number, number]; truth: boolean }) => {
		const r = relOf(e.p[0], e.p[1]);
		return cmpOpt(e.p[0], e.truth ? r : flip(r), e.p[1]);
	};
	const [ro, ...wo] = all.map(opt);
	const answer = buildChoice(rng, ro, wo);
	const steps = answer.options.map((o) => {
		const e = all.find((f) => opt(f).latex === o.latex)!;
		const [x, y] = e.p;
		return e.truth ? `${o.latex}${t(': vero, ' + RULE[e.c])}` : `${o.latex}${t(': falso, ')}${x} ${relOf(x, y)} ${y}${t(' perché ' + RULE[e.c])}`;
	});
	return {
		prompt: 'Quale confronto è vero?',
		problem: '',
		steps,
		solution: ro.latex,
		answer,
		params: { right: right.map(String), case: c },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: ordering

type Dir = 'crescente' | 'decrescente';

function orderSteps(xs: number[], dir: Dir, name: (v: number) => string = (v) => `${v}`): string[] {
	const neg = asc(xs.filter((v) => v < 0));
	const pos = asc(xs.filter((v) => v > 0));
	const out: string[] = [];
	out.push(`${t('Negativi: ')}${neg.map(name).join(', ')}${t(', con valori assoluti ')}${neg.map((v) => Math.abs(v)).join(', ')}`);
	out.push(`${t('I negativi vanno dal valore assoluto maggiore al minore: ')}${neg.map(name).join(' < ')}`);
	if (xs.includes(0)) out.push(t('Poi viene lo zero'));
	out.push(`${t('I positivi vanno dal minore al maggiore: ')}${pos.map(name).join(' < ')}`);
	const a = asc(xs);
	out.push(`${t('In ordine crescente: ')}${a.map(name).join(' < ')}`);
	if (dir === 'decrescente') out.push(`${t('In ordine decrescente la stessa fila al contrario: ')}${[...a].reverse().map(name).join(' > ')}`);
	return out;
}

function level4(rng: Rng): Built | null {
	const n = rng.int(5, 7);
	const withZero = rng.int(0, 1) === 1;
	const k = withZero ? n - 1 : n;
	// distinct absolute values, so that ordering by |x| is a well-defined (wrong) order
	const xs = distinctInts(rng, k, () => (rng.int(0, 1) ? 1 : -1) * rng.int(1, 20), Math.abs);
	if (!xs) return null;
	const negs = xs.filter((v) => v < 0).length;
	if (negs < 2 || k - negs < 2) return null;
	if (withZero) xs.splice(rng.int(0, xs.length), 0, 0);
	const dir: Dir = rng.int(0, 1) ? 'crescente' : 'decrescente';
	const sym = dir === 'crescente' ? '<' : '>';
	const shown = (o: number[]) => (dir === 'crescente' ? o : [...o].reverse());
	const opt = (o: number[]): ChoiceOption => ({ latex: shown(o).join(` ${sym} `), values: shown(o).map(String) });
	const right = asc(xs);
	// the reversed order written with the same symbol: the wrong direction
	const reversed: ChoiceOption = { latex: [...shown(right)].reverse().join(` ${sym} `), values: [...shown(right)].reverse().map(String) };
	// fallback: two neighbours of the same sign swapped
	const sw = adjacentSwaps(right).filter((_, i) => Math.sign(right[i]) === Math.sign(right[i + 1]));
	const answer = buildChoice(rng, opt(right), [opt(signMistake(xs)), opt(byAbs(xs)), reversed], (i) => (i < sw.length ? opt(sw[i]) : null));
	return {
		prompt: `Ordina i numeri in ordine ${dir}.`,
		problem: xs.join(LIST_SEP),
		steps: orderSteps(xs, dir),
		solution: shown(right).join(` ${sym} `),
		answer,
		params: { numbers: xs.map(String), order: dir, case: dir },
	};
}

type ExprKind = '|-a|' | '|a|' | '-|-a|' | '-|a|' | '-(-a)' | '-(+a)';
interface Expr {
	kind: ExprKind;
	a: number;
}
const EXPR: Record<ExprKind, { latex: (a: number) => string; value: (a: number) => number; mistake: (a: number) => number }> = {
	'|-a|': { latex: (a) => `|-${a}|`, value: (a) => a, mistake: (a) => a },
	'|a|': { latex: (a) => `|${a}|`, value: (a) => a, mistake: (a) => a },
	'-|-a|': { latex: (a) => `-|-${a}|`, value: (a) => -a, mistake: (a) => a },
	'-|a|': { latex: (a) => `-|${a}|`, value: (a) => -a, mistake: (a) => -a },
	'-(-a)': { latex: (a) => `-(-${a})`, value: (a) => a, mistake: (a) => -a },
	'-(+a)': { latex: (a) => `-(+${a})`, value: (a) => -a, mistake: (a) => -a },
};
const exprVal = (e: Expr) => EXPR[e.kind].value(e.a);
const exprTex = (e: Expr) => EXPR[e.kind].latex(e.a);

function level5(rng: Rng): Built | null {
	const n = rng.int(4, 5);
	const bases = distinctInts(rng, n, () => rng.int(1, 15));
	if (!bases) return null;
	const kinds: ExprKind[] = ['-|-a|', '-(-a)'];
	const all: ExprKind[] = ['|-a|', '|a|', '-|-a|', '-|a|', '-(-a)', '-(+a)'];
	while (kinds.length < n) kinds.push(rng.pick(all));
	const es: Expr[] = shuffle(rng, kinds).map((kind, i) => ({ kind, a: bases[i] }));
	const vals = es.map(exprVal);
	const negs = vals.filter((v) => v < 0).length;
	if (negs < 2 || n - negs < 2) return null;
	const sortBy = (f: (e: Expr) => number) => [...es].sort((x, y) => f(x) - f(y));
	const opt = (o: Expr[]): ChoiceOption => ({ latex: o.map(exprTex).join(' < '), values: o.map((e) => String(exprVal(e))) });
	const right = sortBy(exprVal);
	// the minus outside |…| ignored; -(-a) read as negative; negatives ordered as if positive; descending
	const outer = sortBy((e) => (e.kind === '-|-a|' || e.kind === '-|a|' ? EXPR[e.kind].mistake(e.a) : exprVal(e)));
	const dbl = sortBy((e) => (e.kind === '-(-a)' ? EXPR[e.kind].mistake(e.a) : exprVal(e)));
	const signOrder = signMistake(vals).map((v) => es[vals.indexOf(v)]);
	const desc = [...right].reverse();
	const swaps = adjacentSwaps(right.map(exprVal)).map((o) => o.map((v) => es[vals.indexOf(v)]));
	const answer = buildChoice(rng, opt(right), [opt(outer), opt(dbl), opt(signOrder), opt(desc)], (i) => (i < swaps.length ? opt(swaps[i]) : null));
	return {
		prompt: 'Ordina in ordine crescente.',
		problem: es.map(exprTex).join(LIST_SEP),
		steps: [
			`${t('Prima calcola ogni numero: ')}${es.map((e) => `${exprTex(e)} = ${exprVal(e)}`).join(' \\qquad ')}`,
			...orderSteps(vals, 'crescente'),
			`${t('Con le espressioni: ')}${right.map(exprTex).join(' < ')}`,
		],
		solution: right.map(exprTex).join(' < '),
		answer,
		params: { expressions: es.map((e) => ({ kind: e.kind, a: String(e.a) })), values: vals.map(String), case: `${n} espressioni` },
	};
}

// ---------------------------------------------------------------------------
// Level 6: integers between two endpoints; successor and predecessor

type L6Case = 'conta' | 'insieme' | 'successivo';

const setTex = (xs: number[]) => `\\{${xs.join(', ')}\\}`;
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

function level6(rng: Rng): Built | null {
	const c = weighted<L6Case>(rng, [
		['conta', 40],
		['insieme', 40],
		['successivo', 20],
	]);
	if (c === 'conta') {
		const a = -rng.int(1, 15);
		const b = a + rng.int(3, 15);
		if (b > 12) return null;
		const incl = rng.next() < 0.35;
		const lo = incl ? a : a + 1, hi = incl ? b : b - 1;
		const count = hi - lo + 1;
		return {
			prompt: `Quanti numeri interi ci sono tra i due numeri, estremi ${incl ? 'inclusi' : 'esclusi'}?`,
			problem: `${a} \\quad ${t('e')} \\quad ${b}`,
			steps: [
				`${t(incl ? 'Sulla retta, da ' : 'Sulla retta, tra ')}${a}${t(incl ? ' a ' : ' e ')}${b}${t(incl ? ' compresi: ' : ' esclusi: ')}${range(lo, hi).join(', ')}`,
				`${t('Sono ')}${count}${t(' interi')}`,
			],
			solution: `${count}`,
			answer: { kind: 'number', value: String(count) },
			params: { a: String(a), b: String(b), endpoints: incl ? 'inclusi' : 'esclusi', case: c },
		};
	}
	if (c === 'insieme') {
		const a = -rng.int(1, 12);
		const b = a + rng.int(3, 8);
		if (b > 8) return null;
		const L = rng.int(0, 1) === 1, R = rng.int(0, 1) === 1; // true = ≤ (endpoint included)
		const list = (l: boolean, r: boolean) => range(l ? a : a + 1, r ? b : b - 1);
		const opt = (l: boolean, r: boolean): ChoiceOption => ({ latex: setTex(list(l, r)), values: list(l, r).map(String) });
		const answer = buildChoice(rng, opt(L, R), [opt(!L, R), opt(L, !R), opt(!L, !R)]);
		const sym = (inc: boolean) => (inc ? '\\leq' : '<');
		const problem = `\\{x \\in ${Z} \\mid ${a} ${sym(L)} x ${sym(R)} ${b}\\}`;
		return {
			prompt: "Quale elenco corrisponde all'insieme?",
			problem,
			steps: [
				`${t('Il segno ')}${sym(L)}${t(L ? ' include ' : ' esclude ')}${a}${t(', il segno ')}${sym(R)}${t(R ? ' include ' : ' esclude ')}${b}`,
				`${problem} = ${setTex(list(L, R))}`,
			],
			solution: `${problem} = ${setTex(list(L, R))}`,
			answer,
			params: { a: String(a), b: String(b), left: L ? '<=' : '<', right: R ? '<=' : '<', case: c },
		};
	}
	const n = -rng.int(2, 20);
	const succ = rng.int(0, 1) === 1;
	const v = succ ? n + 1 : n - 1;
	return {
		prompt: `Qual è il ${succ ? 'successivo' : 'precedente'} del numero?`,
		problem: `${n}`,
		steps: [
			succ
				? `${t('Il successivo sta subito a destra, verso lo zero: si aggiunge 1, ')}${n} + 1 = ${v}`
				: `${t('Il precedente sta subito a sinistra, lontano dallo zero: si toglie 1, ')}${n} - 1 = ${v}`,
		],
		solution: `${v}`,
		answer: { kind: 'number', value: String(v) },
		params: { number: String(n), ask: succ ? 'successivo' : 'precedente', case: c },
	};
}

const numOpt = (v: number): ChoiceOption => ({ latex: `${v}`, values: [String(v)] });

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params;
	if (p.case === 'conta') {
		const a = Number(p.a), b = Number(p.b);
		const incl = p.endpoints === 'inclusi';
		const right = incl ? b - a + 1 : b - a - 1;
		// b - a (one endpoint counted), the other convention, the minus of a ignored
		const absErr = b > 0 ? Math.abs(b - Math.abs(a)) + (incl ? 1 : -1) : null;
		const cands = [b - a, incl ? b - a - 1 : b - a + 1, absErr, incl ? b - a + 2 : b - a - 2];
		return buildChoice(rng, numOpt(right), cands.map((v) => (v === null || v < 0 ? null : numOpt(v))), (i) => numOpt(right + i + 3));
	}
	const n = Number(p.number);
	const succ = p.ask === 'successivo';
	const right = succ ? n + 1 : n - 1;
	return buildChoice(rng, numOpt(right), [numOpt(succ ? n - 1 : n + 1), numOpt(-right), numOpt(succ ? -(n - 1) : -(n + 1))]);
}

// ---------------------------------------------------------------------------

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

function build(rng: Rng, level: number): Built | null {
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
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

const isAsc = (xs: number[]) => xs.every((v, i) => i === 0 || xs[i - 1] < v);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const ans = sample.answer;
	const lvl = sample.level;
	if (!sample.steps.length) v.push('mancano i passaggi');
	if (ans.kind === 'choice') {
		if (ans.options.length !== 4) v.push('servono 4 opzioni');
		if (new Set(ans.options.map((o) => o.values.join('|'))).size !== ans.options.length) v.push('opzioni non distinte');
		if (new Set(ans.options.map((o) => o.latex)).size !== ans.options.length) v.push('opzioni con lo stesso testo');
		if (ans.correct < 0 || ans.correct >= ans.options.length) return [...v, 'indice della risposta fuori intervallo'];
	}
	const right = ans.kind === 'choice' ? ans.options[ans.correct].values : [];
	switch (lvl) {
		case 1: {
			const n = Number(p.number);
			const sign = n > 0 ? 'positivo' : n < 0 ? 'negativo' : 'nullo';
			if (right.join('|') !== `${sign}|${n < 0 ? 'Z' : 'NZ'}`) v.push('affermazione vera sbagliata');
			if (Math.abs(n) > 30) v.push('numero fuori intervallo');
			break;
		}
		case 2: {
			const a = Number(p.base);
			const u = OPP[p.opposite as OppKind].value(a), w = ABS[p.absolute as AbsKind].value(a);
			if (right.join('|') !== `${u}|${w}`) v.push('coppia di valori sbagliata');
			if (a < 2 || a > 20) v.push('base fuori intervallo');
			break;
		}
		case 3: {
			if (ans.kind !== 'choice') break;
			const truths = ans.options.filter((o) => {
				const [x, r, y] = o.values.map((s, i) => (i === 1 ? s : Number(s))) as [number, string, number];
				return r === '<' ? x < y : x > y;
			});
			if (truths.length !== 1 || truths[0] !== ans.options[ans.correct]) v.push('non esattamente un confronto vero');
			break;
		}
		case 4: {
			const xs = (p.numbers as string[]).map(Number);
			if (xs.length < 5 || xs.length > 7) v.push('servono da 5 a 7 numeri');
			if (new Set(xs.map(Math.abs)).size !== xs.length) v.push('valori assoluti ripetuti');
			if (xs.filter((x) => x < 0).length < 2 || xs.filter((x) => x > 0).length < 2) v.push('servono almeno due negativi e due positivi');
			const r = right.map(Number);
			const ok = p.order === 'crescente' ? isAsc(r) : isAsc([...r].reverse());
			if (!ok || [...r].sort((m, n) => m - n).join() !== asc(xs).join()) v.push('ordine giusto sbagliato');
			if (!sample.prompt.includes(String(p.order))) v.push('la domanda non dice crescente o decrescente');
			break;
		}
		case 5: {
			const vals = (p.values as string[]).map(Number);
			if (new Set(vals.map(Math.abs)).size !== vals.length) v.push('valori assoluti ripetuti');
			const kinds = (p.expressions as { kind: string }[]).map((e) => e.kind);
			if (!kinds.includes('-|-a|') || !kinds.includes('-(-a)')) v.push('servono -|-a| e -(-a)');
			const r = right.map(Number);
			if (!isAsc(r) || r.length !== vals.length) v.push('ordine giusto sbagliato');
			break;
		}
		case 6: {
			if (p.case === 'conta') {
				const a = Number(p.a), b = Number(p.b);
				const want = p.endpoints === 'inclusi' ? b - a + 1 : b - a - 1;
				if (ans.kind !== 'number' || Number(ans.value) !== want) v.push('conteggio sbagliato');
				if (a >= 0 || b - a < 3) v.push('estremi fuori specifica');
			} else if (p.case === 'insieme') {
				const a = Number(p.a), b = Number(p.b);
				const lo = p.left === '<=' ? a : a + 1, hi = p.right === '<=' ? b : b - 1;
				if (right.join() !== range(lo, hi).join()) v.push('elenco giusto sbagliato');
				if (a >= 0 || b - a < 3) v.push('estremi fuori specifica');
			} else if (p.case === 'successivo') {
				const n = Number(p.number);
				const want = p.ask === 'successivo' ? n + 1 : n - 1;
				if (ans.kind !== 'number' || Number(ans.value) !== want) v.push('successivo o precedente sbagliato');
				if (n > -2) v.push('serve un negativo');
			} else v.push('caso sconosciuto');
			break;
		}
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	return v;
}

export const numeriInteriValoreAssoluto: Generator = {
	id: ID,
	title: 'Numeri interi e valore assoluto',
	levels: {
		1: { label: 'Segno e appartenenza', constraints: ['un intero da -30 a 30, a volte con il segno +', 'positivo, negativo o nullo; in ℕ e ℤ o solo in ℤ'] },
		2: { label: 'Opposto e valore assoluto', constraints: ['-(-a), -(+a) o +(-a) insieme a |-a|, |+a|, -|-a| o -|a|, stessa a da 2 a 20'] },
		3: { label: 'Confronto tra due interi', constraints: ['quattro confronti, uno solo vero', 'i falsi sono gli errori tipici: negativi confrontati come positivi, valori assoluti al posto dei numeri'] },
		4: { label: 'Ordinare gli interi', constraints: ['da 5 a 7 interi da -20 a 20, almeno due negativi e due positivi, zero una volta su due', 'crescente o decrescente'] },
		5: { label: 'Ordinare con opposti e valori assoluti', constraints: ['4 o 5 espressioni tra |±a|, -|±a|, -(-a), -(+a), con almeno -|-a| e -(-a)', 'ordine crescente'] },
		6: { label: 'Interi tra due estremi', constraints: ['quanti interi tra a < 0 e b, estremi inclusi o esclusi', "l'elenco di {x ∈ ℤ | a ≤ x < b}", 'successivo o precedente di un negativo'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let b: Built | null;
			try {
				b = build(rng, level);
			} catch {
				b = null; // fewer than four distinct options: draw again
			}
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriInteriValoreAssoluto;
