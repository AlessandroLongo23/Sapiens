/**
 * Indici di variabilità. Spec: specs/exercises/statistica-variabilita.md
 *
 * Seven levels in the order of the lesson: the range, the deviations from the mean, the mean absolute
 * deviation S, the standard deviation with an exact root, the standard deviation rounded to the
 * hundredth, the standard deviation from a frequency table, two series with the same mean compared.
 * Everything is built backwards from the deviations: a list of integers (or halves, for a mean like 5,5)
 * with sum zero, then a mean that keeps the data in the range of the story. So the mean is exact, the
 * variance is a finite decimal and σ is either exact or rounded as the prompt asks.
 * The wrong options are the mistakes the lesson warns about: the minimum subtracted without its sign,
 * the deviations averaged with their sign (0), stopping at the variance, dividing by the rows of a
 * frequency table, the signs of the deviations swapped, the range taken as the measure of spread.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { buildChoice, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'statistica-variabilita';

const t = (s: string) => `\\text{${s}}`;
const LIST_SEP = ',\\quad ';
const NUM_WORD: Record<number, string> = { 4: 'quattro', 5: 'cinque', 6: 'sei', 7: 'sette', 8: 'otto' };
const NAMES = ['Marta', 'Luca', 'Anna', 'Bea', 'Giulia', 'Paolo', 'Sara', 'Marco', 'Elena', 'Davide', 'Chiara', 'Matteo'];

// ---------------------------------------------------------------------------
// Numbers

/** Digits after the comma of a finite decimal, or null if the decimal is periodic. */
function decimals(r: Rational): number | null {
	for (let k = 0; k <= 8; k++) if (10 ** k % r.den === 0) return k;
	return null;
}

/** A finite decimal as the lesson writes it: 1{,}5, -2{,}25, 4. */
function dec(r: Rational): string {
	const k = decimals(r);
	if (k === null) throw new Error(`dec: ${r} is not a finite decimal`);
	const scaled = r.num * (10 ** k / r.den);
	const s = String(Math.abs(scaled)).padStart(k + 1, '0');
	const int = s.slice(0, s.length - k), frac = s.slice(s.length - k);
	return `${scaled < 0 ? '-' : ''}${int}${k ? `{,}${frac}` : ''}`;
}

/** Hundredths with two digits after the comma, as a rounded value is written: 1{,}90. */
const fixed2 = (h: number) => `${Math.floor(h / 100)}{,}${String(h % 100).padStart(2, '0')}`;

/** 100·√r truncated and rounded to an integer, with exact integer comparisons. */
function sqrt100(r: Rational): { round: number; trunc: number } {
	let k = Math.floor(100 * Math.sqrt(r.num / r.den));
	while (k > 0 && k * k * r.den > 10000 * r.num) k--;
	while ((k + 1) * (k + 1) * r.den <= 10000 * r.num) k++;
	const round = (2 * k + 1) ** 2 * r.den <= 40000 * r.num ? k + 1 : k;
	return { round, trunc: k };
}

/** Exact square root of a rational with a finite decimal root of at most two digits, else null. */
function niceSqrt(r: Rational): Rational | null {
	const { trunc } = sqrt100(r);
	const s = q(trunc, 100);
	return s.mul(s).equals(r) ? s : null;
}

/** A signed sum as the lesson writes it: -3 - 1 + 0 + 2 + 2. */
function sumTex(xs: Rational[]): string {
	return xs.map((x, i) => (i === 0 ? dec(x) : x.sign() < 0 ? ` - ${dec(x.neg())}` : ` + ${dec(x)}`)).join('');
}

/** x - m with the parentheses a negative m needs: 4 - 7, -2 - (-1), 3 - 5{,}5. */
const diffTex = (x: Rational, m: Rational) => `${dec(x)} - ${m.sign() < 0 ? `(${dec(m)})` : dec(m)}`;
const sq = (x: Rational) => x.mul(x);
const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), q(0));

// ---------------------------------------------------------------------------
// Stories

interface Ctx {
	key: string;
	lo: number;
	hi: number;
	/** Unit after a number, as LaTeX; singular for exactly 1. */
	unit: string;
	unit1: string;
	intro: (w: string, who: string) => string;
}

const deg = '\\ {}^{\\circ}\\mathrm{C}';
const CTX: Record<string, Ctx> = {
	voti: { key: 'voti', lo: 3, hi: 10, unit: '', unit1: '', intro: (w, who) => `I voti di ${who} nelle ultime ${w} verifiche sono:` },
	temperature: { key: 'temperature', lo: -9, hi: 15, unit: deg, unit1: deg, intro: (w) => `Le temperature minime di ${w} giorni, in gradi, sono state:` },
	ritardi: { key: 'ritardi', lo: 0, hi: 20, unit: `\\ ${t('minuti')}`, unit1: `\\ ${t('minuto')}`, intro: (w) => `In ${w} giorni un autobus è arrivato con questi minuti di ritardo:` },
	punti: { key: 'punti', lo: 0, hi: 30, unit: `\\ ${t('punti')}`, unit1: `\\ ${t('punto')}`, intro: (w, who) => `I punti segnati da ${who} in ${w} partite di basket sono:` },
	ore: { key: 'ore', lo: 4, hi: 10, unit: `\\ ${t('ore')}`, unit1: `\\ ${t('ora')}`, intro: (w, who) => `Le ore di sonno di ${who} in ${w} notti sono state:` },
	dati: { key: 'dati', lo: -20, hi: 20, unit: '', unit1: '', intro: () => '' },
};
const withUnit = (ctx: Ctx, v: string, one: boolean) => `${v}${one ? ctx.unit1 : ctx.unit}`;

/** The problem: the story in prose, then the data on one row. */
function dataProblem(ctx: Ctx, data: Rational[], who: string): string {
	const row = data.map(dec).join(LIST_SEP);
	const intro = ctx.intro(NUM_WORD[data.length], who);
	return intro ? textBlock(intro, 46, [row]) : row;
}

/** n integer deviations in [-m, m] with sum 0 (the last one balances the others), or null. */
function deviations(rng: Rng, n: number, m: number): number[] | null {
	const d = Array.from({ length: n - 1 }, () => rng.int(-m, m));
	const last = -d.reduce((a, b) => a + b, 0);
	if (Math.abs(last) > m) return null;
	d.splice(rng.int(0, n - 1), 0, last);
	return d;
}

/** A mean that keeps mean + d inside the story's range; `half` adds 0,5 (deviations then are e/2). */
function meanFor(rng: Rng, ctx: Ctx, dev: Rational[]): Rational | null {
	const lo = Math.max(...dev.map((d) => Math.ceil(ctx.lo - d.num / d.den)));
	const hi = Math.min(...dev.map((d) => Math.floor(ctx.hi - d.num / d.den)));
	if (lo > hi) return null;
	return q(rng.int(lo, hi));
}

// ---------------------------------------------------------------------------
// Worked steps shared by the levels

function meanStep(data: Rational[], mean: Rational): string {
	const n = data.length;
	const s = sum(data);
	return `${t('La media è ')} \\bar{x} = \\frac{${sumTex(data)}}{${n}} = \\frac{${dec(s)}}{${n}} = ${dec(mean)}`;
}

const devList = (data: Rational[], mean: Rational) => data.map((x) => `${diffTex(x, mean)} = ${dec(x.sub(mean))}`).join(', \\ ');

// ---------------------------------------------------------------------------
// Level 1: range

type L1Case = 'con negativi' | 'positivi';

function level1(rng: Rng, c: L1Case): Built | null {
	const ctx = c === 'con negativi' ? CTX[rng.pick(['temperature', 'dati'])] : CTX[rng.pick(['voti', 'ritardi', 'punti', 'ore'])];
	const n = rng.int(4, 8);
	const xs = Array.from({ length: n }, () => rng.int(ctx.lo, ctx.hi));
	const max = Math.max(...xs), min = Math.min(...xs);
	const range = max - min;
	if (c === 'con negativi' && !(min < 0 && max > 0)) return null;
	if (range < 3) return null;
	const sorted = [...xs].sort((a, b) => a - b);
	if (sorted.join() === xs.join() || [...sorted].reverse().join() === xs.join()) return null;
	if (Math.abs(xs[n - 1] - xs[0]) === range) return null;
	const vals = [...new Set(sorted)];
	if (vals.length < 3) return null;
	const who = rng.pick(NAMES);
	const mistakes: Mistake[] = [];
	if (min < 0) mistakes.push({ value: q(max - Math.abs(min)), why: 'minimo senza segno' });
	mistakes.push({ value: q(Math.abs(xs[n - 1] - xs[0])), why: 'ultimo meno primo' });
	mistakes.push({ value: q(max - vals[1]), why: 'secondo più piccolo' });
	mistakes.push({ value: q(vals[vals.length - 2] - min), why: 'secondo più grande' });
	const minTex = min < 0 ? `(${min})` : `${min}`;
	const steps = [
		`${t('Il dato più grande è ')} ${max}${t(', il più piccolo è ')} ${min}`,
		min < 0 ? `x_{\\max} - x_{\\min} = ${max} - ${minTex} = ${max} + ${-min} = ${range}` : `x_{\\max} - x_{\\min} = ${max} - ${min} = ${range}`,
	];
	if (min < 0) steps.push(t('Il minimo si sottrae con il suo segno.'));
	return {
		prompt: 'Calcola il campo di variazione dei dati.',
		problem: dataProblem(ctx, xs.map((v) => q(v)), who),
		steps,
		solution: `x_{\\max} - x_{\\min} = ${withUnit(ctx, String(range), range === 1)}`,
		answer: { kind: 'number', value: String(range) },
		params: { data: xs.map(String), context: ctx.key, case: c, answerLatex: String(range), mistakes: mistakeParams(mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: deviations from the mean

const listOpt = (xs: Rational[]): ChoiceOption => ({ latex: xs.map(dec).join(', \\ '), values: xs.map(String) });

function pickCtx(rng: Rng): Ctx {
	return CTX[weighted(rng, [
		['voti', 3],
		['temperature', 2],
		['ritardi', 2],
		['punti', 2],
		['ore', 1],
		['dati', 2],
	])];
}

/** Integer deviations with sum zero, both signs, at least one of size 2, not all of the same size. */
function intDeviations(rng: Rng, n: number, m: number): Rational[] | null {
	const d = deviations(rng, n, m);
	if (!d) return null;
	if (!d.some((v) => v < 0) || !d.some((v) => v > 0)) return null;
	if (Math.max(...d.map(Math.abs)) < 2) return null;
	if (new Set(d.map(Math.abs)).size === 1) return null;
	return d.map((v) => q(v));
}

function median(xs: Rational[]): Rational {
	const s = [...xs].sort((a, b) => a.compare(b));
	const n = s.length;
	return n % 2 ? s[(n - 1) / 2] : s[n / 2 - 1].add(s[n / 2]).div(q(2));
}

function level2(rng: Rng): Built | null {
	const n = rng.int(4, 6);
	const ctx = pickCtx(rng);
	const dev = intDeviations(rng, n, 5);
	if (!dev) return null;
	const mean = meanFor(rng, ctx, dev);
	if (!mean) return null;
	const data = dev.map((d) => mean.add(d));
	const who = rng.pick(NAMES);
	const med = median(data);
	const right = listOpt(dev);
	const cands: (ChoiceOption | null)[] = [
		listOpt(dev.map((d) => d.neg())), // x̄ - x_i
		listOpt(dev.map((d) => d.abs())), // signs dropped
		med.equals(mean) ? null : listOpt(data.map((x) => x.sub(med))), // from the median
		listOpt(dev.map((d) => d.sub(q(1)))), // a mean one too big
	];
	const firstNeg = dev.findIndex((d) => d.sign() < 0);
	const answer = buildChoice(rng, right, cands, (i) => (i === 0 ? listOpt(dev.map((d, j) => (j === firstNeg ? d.neg() : d))) : listOpt(dev.map((d) => d.add(q(i + 1))))));
	return {
		prompt: 'Calcola gli scarti dalla media, nell’ordine in cui sono scritti i dati.',
		problem: dataProblem(ctx, data, who),
		steps: [meanStep(data, mean), `${t('Gli scarti sono ')} ${devList(data, mean)}`, `${t('Controllo, la somma degli scarti è zero: ')} ${sumTex(dev)} = 0`],
		solution: right.latex,
		answer,
		params: { data: data.map(String), context: ctx.key, case: `${n} dati` },
	};
}

// ---------------------------------------------------------------------------
// Level 3: mean absolute deviation

function level3(rng: Rng): Built | null {
	const n = rng.int(4, 6);
	const ctx = pickCtx(rng);
	const dev = intDeviations(rng, n, 5);
	if (!dev) return null;
	const abs = dev.map((d) => d.abs());
	const S = sum(abs).div(q(n));
	if (decimals(S) === null || decimals(S)! > 2) return null;
	const mean = meanFor(rng, ctx, dev);
	if (!mean) return null;
	const data = dev.map((d) => mean.add(d));
	const who = rng.pick(NAMES);
	const var2 = sum(dev.map(sq)).div(q(n));
	const mistakes: Mistake[] = [
		{ value: q(0), why: 'scarti con il segno' },
		{ value: sum(abs), why: 'non diviso per n' },
	];
	if (decimals(var2) !== null && decimals(var2)! <= 2) mistakes.push({ value: var2, why: 'varianza' });
	return {
		prompt: 'Calcola lo scarto semplice medio.',
		problem: dataProblem(ctx, data, who),
		steps: [
			meanStep(data, mean),
			`${t('Gli scarti sono ')} ${devList(data, mean)}`,
			`${t('I loro valori assoluti sono ')} ${abs.map(dec).join(', \\ ')}`,
			`S = \\frac{${abs.map(dec).join(' + ')}}{${n}} = \\frac{${dec(sum(abs))}}{${n}} = ${dec(S)}`,
		],
		solution: `S = ${withUnit(ctx, dec(S), S.equals(q(1)))}`,
		answer: { kind: 'number', value: S.toString() },
		params: { data: data.map(String), context: ctx.key, case: `${n} dati`, answerLatex: dec(S), mistakes: mistakeParams(mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: variance and standard deviation

function varianceSteps(data: Rational[], mean: Rational, dev: Rational[]): { steps: string[]; var2: Rational } {
	const n = data.length;
	const sqs = dev.map(sq);
	const SS = sum(sqs);
	const var2 = SS.div(q(n));
	return {
		var2,
		steps: [
			meanStep(data, mean),
			`${t('Gli scarti sono ')} ${devList(data, mean)}`,
			`${t('I loro quadrati sono ')} ${sqs.map(dec).join(', \\ ')}`,
			`\\sigma^2 = \\frac{${sqs.map(dec).join(' + ')}}{${n}} = \\frac{${dec(SS)}}{${n}} = ${dec(var2)}`,
		],
	};
}

type L4Case = 'intero' | 'decimale';

function level4(rng: Rng, c: L4Case): Built | null {
	const n = c === 'decimale' ? 8 : rng.int(4, 8);
	const ctx = pickCtx(rng);
	const dev = intDeviations(rng, n, 6);
	if (!dev) return null;
	const SS = sum(dev.map(sq));
	const var2 = SS.div(q(n));
	const sigma = niceSqrt(var2);
	if (!sigma) return null;
	if (c === 'intero' && !(sigma.isInteger() && sigma.num >= 2 && sigma.num <= 5)) return null;
	if (c === 'decimale' && (sigma.isInteger() || decimals(sigma) !== 1)) return null;
	const mean = meanFor(rng, ctx, dev);
	if (!mean) return null;
	const data = dev.map((d) => mean.add(d));
	const who = rng.pick(NAMES);
	const S = sum(dev.map((d) => d.abs())).div(q(n));
	const vs = varianceSteps(data, mean, dev);
	const mistakes: Mistake[] = [{ value: var2, why: 'varianza' }, { value: SS, why: 'non diviso per n' }];
	if (decimals(S) !== null && decimals(S)! <= 2) mistakes.push({ value: S, why: 'scarto semplice medio' });
	return {
		prompt: 'Calcola lo scarto quadratico medio.',
		problem: dataProblem(ctx, data, who),
		steps: [...vs.steps, `\\sigma = \\sqrt{${dec(var2)}} = ${dec(sigma)}${t(', perché ')} ${dec(sigma)}^2 = ${dec(var2)}`],
		solution: `\\sigma = ${withUnit(ctx, dec(sigma), sigma.equals(q(1)))}`,
		answer: { kind: 'number', value: sigma.toString() },
		params: { data: data.map(String), context: ctx.key, case: c, answerLatex: dec(sigma), mistakes: mistakeParams(mistakes) },
	};
}

type L5Case = 'media intera' | 'media con la virgola';

function level5(rng: Rng, c: L5Case): Built | null {
	const ctx = pickCtx(rng);
	let dev: Rational[] | null;
	let n: number;
	if (c === 'media intera') {
		n = rng.int(4, 6);
		dev = intDeviations(rng, n, 5);
	} else {
		// twice the deviations are odd: the data are integers and the mean ends in ,5
		n = rng.pick([4, 6]);
		const e = deviations(rng, n, 9);
		if (!e || e.some((v) => v % 2 === 0)) return null;
		if (new Set(e.map(Math.abs)).size === 1) return null;
		dev = e.map((v) => q(v, 2));
	}
	if (!dev) return null;
	const SS = sum(dev.map(sq));
	const var2 = SS.div(q(n));
	if (decimals(var2) === null || decimals(var2)! > 2) return null;
	if (niceSqrt(var2)) return null;
	const half = c === 'media con la virgola' ? q(1, 2) : q(0);
	const base = meanFor(rng, ctx, dev.map((d) => d.add(half)));
	if (!base) return null;
	const mean = base.add(half);
	const data = dev.map((d) => mean.add(d));
	if (data.some((x) => !x.isInteger() || x.num < ctx.lo || x.num > ctx.hi)) return null;
	const who = rng.pick(NAMES);
	const { round, trunc } = sqrt100(var2);
	const S = sum(dev.map((d) => d.abs())).div(q(n));
	const sx = sqrt100(SS.div(q(n - 1))).round;
	const vs = varianceSteps(data, mean, dev);
	const mistakes: Mistake[] = [{ value: var2, why: 'varianza' }];
	if (trunc !== round) mistakes.push({ value: q(trunc, 100), why: 'troncato', fixed: true });
	mistakes.push({ value: q(sqrt100(S.mul(S)).round, 100), why: 'scarto semplice medio', fixed: true });
	mistakes.push({ value: q(sx, 100), why: 'diviso per n - 1', fixed: true });
	return {
		prompt: 'Calcola lo scarto quadratico medio, arrotondato al centesimo.',
		problem: dataProblem(ctx, data, who),
		steps: [...vs.steps, `\\sigma = \\sqrt{${dec(var2)}} \\approx ${fixed2(round)}`],
		solution: `\\sigma \\approx ${withUnit(ctx, fixed2(round), false)}`,
		answer: { kind: 'number', value: q(round, 100).toString() },
		params: { data: data.map(String), context: ctx.key, case: c, answerLatex: fixed2(round), mistakes: mistakeParams(mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: frequency table

interface FreqCtx {
	key: string;
	xs: [number, number];
	head: string;
	fhead: string;
	intro: (n: number) => string;
	unit: string;
}
const FREQ: FreqCtx[] = [
	{ key: 'gol', xs: [0, 5], head: 'gol', fhead: 'partite', intro: (n) => `In ${n} partite una squadra ha segnato questi gol.`, unit: t('gol') },
	{ key: 'figli', xs: [0, 4], head: 'figli', fhead: 'famiglie', intro: (n) => `In un condominio di ${n} famiglie si è contato il numero di figli di ogni famiglia.`, unit: t('figli') },
	{ key: 'voti', xs: [4, 9], head: 'voto', fhead: 'studenti', intro: (n) => `Questi sono i voti dei ${n} studenti di una classe in una verifica.`, unit: '' },
	{ key: 'libri', xs: [0, 5], head: 'libri', fhead: 'studenti', intro: (n) => `A ${n} studenti è stato chiesto quanti libri hanno letto durante l'estate.`, unit: t('libri') },
];

function level6(rng: Rng): Built | null {
	const fc = rng.pick(FREQ);
	const k = rng.int(4, 5);
	const start = rng.int(fc.xs[0], fc.xs[1] - k + 1);
	const xs = Array.from({ length: k }, (_, i) => start + i);
	const fs = xs.map(() => rng.int(1, 8));
	const n = fs.reduce((a, b) => a + b, 0);
	if (n < 10 || n > 30) return null;
	const tot = xs.reduce((a, x, i) => a + x * fs[i], 0);
	if (tot % n !== 0) return null;
	const mean = tot / n;
	const sqs = xs.map((x) => (x - mean) ** 2);
	const prods = sqs.map((s, i) => s * fs[i]);
	const SS = prods.reduce((a, b) => a + b, 0);
	const var2 = q(SS, n);
	if (decimals(var2) === null || decimals(var2)! > 2 || niceSqrt(var2)) return null;
	const { round, trunc } = sqrt100(var2);
	const rows = sqrt100(q(SS, k)).round;
	const unweighted = sqrt100(q(sqs.reduce((a, b) => a + b, 0), k)).round;
	const mistakes: Mistake[] = [{ value: q(rows, 100), why: 'diviso per le righe', fixed: true }, { value: var2, why: 'varianza' }];
	if (unweighted !== rows) mistakes.push({ value: q(unweighted, 100), why: 'senza frequenze', fixed: true });
	if (trunc !== round) mistakes.push({ value: q(trunc, 100), why: 'troncato', fixed: true });
	const table = `\\begin{array}{c|${'c'.repeat(k)}} ${t(`${fc.head} `)} x_i & ${xs.join(' & ')} \\\\ \\hline ${t(`${fc.fhead} `)} f_i & ${fs.join(' & ')} \\end{array}`;
	return {
		prompt: 'Calcola lo scarto quadratico medio, arrotondato al centesimo.',
		problem: textBlock(fc.intro(n), 46, [table]),
		steps: [
			`${t('I dati sono ')} n = ${fs.join(' + ')} = ${n}${t(', la somma delle frequenze')}`,
			`${t('La media ponderata è ')} \\bar{x} = \\frac{${xs.map((x, i) => `${x} \\cdot ${fs[i]}`).join(' + ')}}{${n}} = \\frac{${tot}}{${n}} = ${mean}`,
			`${t('Quadrati degli scarti per le frequenze: ')} ${xs.map((x, i) => `${sqs[i]} \\cdot ${fs[i]} = ${prods[i]}`).join(', \\ ')}`,
			`\\sigma^2 = \\frac{${prods.join(' + ')}}{${n}} = \\frac{${SS}}{${n}} = ${dec(var2)}${t(': si divide per ')} ${n}${t(', non per le ')} ${k} ${t(' righe')}`,
			`\\sigma = \\sqrt{${dec(var2)}} \\approx ${fixed2(round)}`,
		],
		solution: `\\sigma \\approx ${fixed2(round)}${fc.unit ? `\\ ${fc.unit}` : ''}`,
		answer: { kind: 'number', value: q(round, 100).toString() },
		params: { xs: xs.map(String), fs: fs.map(String), context: fc.key, case: `${k} righe`, answerLatex: fixed2(round), mistakes: mistakeParams(mistakes) },
	};
}

// ---------------------------------------------------------------------------
// Level 7: two series with the same mean

type L7Case = 'stesso campo' | 'campo discorde';
type Ask = 'dispersi' | 'regolare';

interface L7Ctx {
	key: string;
	lo: number;
	hi: number;
	intro: (w: string, a: string, b: string) => string;
	unit: string;
}
const L7CTX: L7Ctx[] = [
	{ key: 'punti', lo: 0, hi: 30, intro: (w, a, b) => `In ${w} partite di basket ${a} ${b} hanno segnato questi punti.`, unit: t('punti') },
	{ key: 'voti', lo: 3, hi: 10, intro: (w, a, b) => `Questi sono i voti di ${a} ${b} nelle ultime ${w} verifiche.`, unit: '' },
	{ key: 'tragitto', lo: 5, hi: 40, intro: (w, a, b) => `In ${w} giorni ${a} ${b} hanno impiegato questi minuti per andare a scuola.`, unit: t('minuti') },
];

interface Series {
	name: string;
	dev: Rational[];
	var2: Rational;
	exact: Rational | null;
	round: number;
	range: number;
}

/** σ as an option shows it: = 2 when the root is exact, ≈ 2{,}53 otherwise. */
const sigmaTex = (s: Series) => (s.exact ? `= ${dec(s.exact)}` : `\\approx ${fixed2(s.round)}`);
const sigmaVal = (s: Series) => (s.exact ?? q(s.round, 100)).toString();

function series(rng: Rng, name: string, n: number): Series | null {
	const dev = intDeviations(rng, n, 6);
	if (!dev) return null;
	const var2 = sum(dev.map(sq)).div(q(n));
	if (decimals(var2) === null || decimals(var2)! > 2) return null;
	const ds = dev.map((d) => d.num);
	return { name, dev, var2, exact: niceSqrt(var2), round: sqrt100(var2).round, range: Math.max(...ds) - Math.min(...ds) };
}

function level7(rng: Rng, c: L7Case): Built | null {
	const ask: Ask = rng.int(0, 1) ? 'dispersi' : 'regolare';
	const ctx = rng.pick(L7CTX);
	const n = rng.pick([5, 5, 6]);
	const na = rng.pick(NAMES);
	const nb = rng.pick(NAMES.filter((x) => x !== na));
	const A = series(rng, na, n), B = series(rng, nb, n);
	if (!A || !B) return null;
	if (A.var2.equals(B.var2) || Math.abs(A.round - B.round) < 30) return null;
	if ([...A.dev].map(String).sort().join() === [...B.dev].map(String).sort().join()) return null;
	const [lo, hi] = A.var2.compare(B.var2) < 0 ? [A, B] : [B, A];
	if (c === 'stesso campo' && A.range !== B.range) return null;
	if (c === 'campo discorde' && !(lo.range > hi.range)) return null;
	const all = [...A.dev, ...B.dev];
	const mean = meanFor(rng, { key: ctx.key, lo: ctx.lo, hi: ctx.hi, unit: '', unit1: '', intro: () => '' }, all);
	if (!mean) return null;
	const dataA = A.dev.map((d) => mean.add(d)), dataB = B.dev.map((d) => mean.add(d));
	const right = ask === 'dispersi' ? hi : lo;
	const other = right === hi ? lo : hi;
	const opt = (s: Series): ChoiceOption => ({ latex: `${t(`${s.name}, con `)} \\sigma ${sigmaTex(s)}`, values: [s.name, sigmaVal(s)] });
	const cands: ChoiceOption[] = [
		opt(other),
		{ latex: `${t(`${right.name}, con `)} \\sigma = ${dec(right.var2)}`, values: [right.name, `varianza ${right.var2}`] },
		{ latex: t('Nessuna: stessa media'), values: ['nessuna'] },
	];
	const answer = buildChoice(rng, opt(right), cands);
	const line = (s: Series, d: Rational[]) => `${t(`${s.name}: `)} ${d.map(dec).join(', \\ ')}`;
	const sigmaStep = (s: Series) => {
		const sqs = s.dev.map(sq);
		const nm = `_{\\mathrm{${s.name}}}`;
		return `\\sigma^2${nm} = \\frac{${sqs.map(dec).join(' + ')}}{${n}} = ${dec(s.var2)}, \\quad \\sigma${nm} = \\sqrt{${dec(s.var2)}} ${sigmaTex(s)}`;
	};
	const rangeStep =
		c === 'stesso campo'
			? `${t('Anche il campo di variazione è lo stesso, ')} ${A.range}${t(': non basta a distinguere le due serie')}`
			: `${t(`Il campo di variazione di ${lo.name} è più grande, `)} ${lo.range} ${t(' contro ')} ${hi.range}${t(', ma guarda solo i due estremi: a decidere è ')} \\sigma`;
	const verdict =
		ask === 'dispersi'
			? `${t(`${hi.name} ha `)} \\sigma ${t(' più grande: i suoi dati sono più dispersi')}`
			: `${t(`${lo.name} ha `)} \\sigma ${t(' più piccolo: è più regolare')}`;
	return {
		prompt:
			ask === 'dispersi'
				? 'Chi ha i dati più dispersi? Confronta gli scarti quadratici medi, arrotondati al centesimo.'
				: 'Chi è più regolare? Confronta gli scarti quadratici medi, arrotondati al centesimo.',
		problem: textBlock(ctx.intro(NUM_WORD[n], na, /^[Ee]/.test(nb) ? `ed ${nb}` : `e ${nb}`), 46, [line(A, dataA), line(B, dataB)]),
		steps: [
			`${t('Le due serie hanno la stessa media, ')} \\bar{x} = \\frac{${dec(sum(dataA))}}{${n}} = ${dec(mean)}`,
			`${t(`Scarti di ${A.name}: `)} ${A.dev.map(dec).join(', \\ ')}${t(`; scarti di ${B.name}: `)} ${B.dev.map(dec).join(', \\ ')}`,
			sigmaStep(A),
			sigmaStep(B),
			rangeStep,
			verdict,
		],
		solution: `${t(`${right.name}, con `)} \\sigma ${sigmaTex(right)}${ctx.unit ? `\\ ${ctx.unit}` : ''}`,
		answer,
		params: {
			names: [A.name, B.name],
			dataA: dataA.map(String),
			dataB: dataB.map(String),
			context: ctx.key,
			ask,
			case: c,
		},
	};
}

// ---------------------------------------------------------------------------
// Multiple choice for the number levels

interface Mistake {
	value: Rational;
	why: string;
	/** Written with two digits after the comma, as a rounded value. */
	fixed?: boolean;
}

function mistakeParams(ms: Mistake[]): { value: string; latex: string; why: string }[] {
	return ms
		.filter((m) => m.value.sign() >= 0)
		.map((m) => ({ value: m.value.toString(), latex: m.fixed ? fixed2(Math.round((m.value.num * 100) / m.value.den)) : dec(m.value), why: m.why }));
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: unexpected answer kind`);
	const p = sample.params as { answerLatex: string; mistakes: { value: string; latex: string }[] };
	const right = Rational.parse(sample.answer.value);
	const correct: ChoiceOption = { latex: p.answerLatex, values: [right.toString()] };
	const cands = p.mistakes.map((m) => ({ latex: m.latex, values: [Rational.parse(m.value).toString()] }));
	// fallback: neighbours in the last digit the answer shows
	const fixed = /\{,\}\d\d$/.test(p.answerLatex);
	const step = fixed ? q(1, 100) : q(1, 10 ** (decimals(right) ?? 0));
	const near = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
	return buildChoice(rng, correct, cands, (i) => {
		if (i >= near.length) return null;
		const v = right.add(step.mul(q(near[i])));
		if (v.sign() < 0) return null;
		return { latex: fixed ? fixed2(Math.round((v.num * 100) / v.den)) : dec(v), values: [v.toString()] };
	});
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

/** Cases with a fixed share: drawn once per exercise, before the retries, so a case that is rejected more often keeps its share. */
const CASES: Record<number, [string, number][]> = {
	1: [
		['con negativi', 60],
		['positivi', 40],
	],
	4: [
		['intero', 75],
		['decimale', 25],
	],
	5: [
		['media intera', 70],
		['media con la virgola', 30],
	],
	7: [
		['stesso campo', 60],
		['campo discorde', 40],
	],
};

function build(rng: Rng, level: number, c: string): Built | null {
	switch (level) {
		case 1:
			return level1(rng, c as L1Case);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng, c as L4Case);
		case 5:
			return level5(rng, c as L5Case);
		case 6:
			return level6(rng);
		case 7:
			return level7(rng, c as L7Case);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

const R = (s: unknown) => Rational.parse(String(s));

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const ans = sample.answer;
	if (!sample.steps.length) v.push('mancano i passaggi');
	const choices = [ans, sample.choice].filter((a): a is ChoiceAnswer => a?.kind === 'choice');
	for (const ch of choices) {
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni non distinte');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
		if (ch.correct < 0 || ch.correct >= ch.options.length) v.push('indice della risposta fuori intervallo');
	}
	const num = ans.kind === 'number' ? R(ans.value) : null;
	const data = Array.isArray(p.data) ? (p.data as string[]).map(R) : [];
	const n = data.length;
	const mean = n ? sum(data).div(q(n)) : q(0);
	const dev = data.map((x) => x.sub(mean));
	const var2 = n ? sum(dev.map(sq)).div(q(n)) : q(0);
	switch (sample.level) {
		case 1: {
			const xs = data.map((x) => x.num);
			if (n < 4 || n > 8) v.push('servono da 4 a 8 dati');
			if (!num?.equals(q(Math.max(...xs) - Math.min(...xs)))) v.push('campo di variazione sbagliato');
			if (p.case === 'con negativi' && !xs.some((x) => x < 0)) v.push('manca un dato negativo');
			break;
		}
		case 2: {
			if (n < 4 || n > 6 || !mean.isInteger()) v.push('servono da 4 a 6 dati con media intera');
			if (ans.kind !== 'choice' || ans.options[ans.correct].values.join() !== dev.map(String).join()) v.push('scarti sbagliati');
			break;
		}
		case 3: {
			if (n < 4 || n > 6 || !mean.isInteger()) v.push('servono da 4 a 6 dati con media intera');
			const S = sum(dev.map((d) => d.abs())).div(q(n));
			if (!num?.equals(S)) v.push('scarto semplice medio sbagliato');
			break;
		}
		case 4: {
			if (!mean.isInteger()) v.push('media non intera');
			const s = niceSqrt(var2);
			if (!s || !num?.equals(s)) v.push('scarto quadratico medio sbagliato o non esatto');
			break;
		}
		case 5:
		case 6: {
			let v2 = var2;
			if (sample.level === 6) {
				const xs = (p.xs as string[]).map(Number), fs = (p.fs as string[]).map(Number);
				const nn = fs.reduce((a, b) => a + b, 0);
				const m = q(xs.reduce((a, x, i) => a + x * fs[i], 0), nn);
				if (!m.isInteger()) v.push('media non intera');
				v2 = sum(xs.map((x, i) => sq(q(x).sub(m)).mul(q(fs[i])))).div(q(nn));
			} else if (!mean.mul(q(2)).isInteger()) v.push('media non intera né con ,5');
			if (niceSqrt(v2)) v.push('radice esatta');
			if (!num?.equals(q(sqrt100(v2).round, 100))) v.push('arrotondamento sbagliato');
			break;
		}
		case 7: {
			const a = (p.dataA as string[]).map(R), b = (p.dataB as string[]).map(R);
			const m = a.length;
			if (!sum(a).equals(sum(b)) || a.length !== b.length) v.push('medie diverse');
			const va = sum(a.map((x) => sq(x.sub(sum(a).div(q(m)))))).div(q(m));
			const vb = sum(b.map((x) => sq(x.sub(sum(b).div(q(m)))))).div(q(m));
			const names = p.names as string[];
			const big = va.compare(vb) > 0 ? names[0] : names[1];
			const small = big === names[0] ? names[1] : names[0];
			const want = p.ask === 'dispersi' ? big : small;
			if (ans.kind !== 'choice' || ans.options[ans.correct].values[0] !== want) v.push('serie giusta sbagliata');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export const statisticaVariabilita: Generator = {
	id: ID,
	title: 'Indici di variabilità',
	levels: {
		1: { label: 'Campo di variazione', constraints: ['da 4 a 8 dati interi, non in ordine', 'con un dato negativo sei volte su dieci'] },
		2: { label: 'Scarti dalla media', constraints: ['da 4 a 6 dati con media intera', 'scarti tra -5 e 5, con somma zero'] },
		3: { label: 'Scarto semplice medio', constraints: ['da 4 a 6 dati con media intera', 'S decimale finito con al massimo due cifre dopo la virgola'] },
		4: { label: 'Scarto quadratico medio esatto', constraints: ['media intera', 'σ intero da 2 a 5, oppure con un decimale (8 dati)'] },
		5: { label: 'Scarto quadratico medio arrotondato', constraints: ['da 4 a 6 dati, media intera o con ,5', 'varianza con al massimo due decimali, σ arrotondato al centesimo'] },
		6: { label: 'Tabella di frequenze', constraints: ['4 o 5 valori consecutivi con frequenze da 1 a 8, n da 10 a 30', 'media intera, σ arrotondato al centesimo'] },
		7: { label: 'Confronto di due serie', constraints: ['due serie di 5 o 6 dati con la stessa media', 'stesso campo di variazione, oppure campo più grande nella serie con σ più piccolo'] },
	},
	generate(rng: Rng, level: number): Sample {
		const c = CASES[level] ? weighted(rng, CASES[level]) : '';
		for (let attempt = 0; attempt < 50_000; attempt++) {
			let b: Built | null;
			try {
				b = build(rng, level, c);
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

export default statisticaVariabilita;
