/**
 * Divisibilità e numeri primi. Spec: specs/exercises/numeri-naturali-divisibilita.md
 *
 * Six levels in the order of the lesson: divisible or not with the division; one criterion at a
 * time (2, 3, 5, 9, 10); all the criteria of the table on one number; prime or composite, trying
 * the primes up to the square root; prime factorisation; divisibility and number of divisors from
 * the factorisation. Numbers are built from what the answer must be (a multiple, a product of
 * chosen primes), and every multiple-choice level carries at least one trap from the lesson's
 * warnings.
 */
import type { ChoiceAnswer, ExpressionAnswer, Generator, Rng, Sample, SetAnswer } from '../types';
import { type Opt, divisionTable, factorize, factorsAscii, factorsLatex, fmt, isPrime, makeChoice, mistakeOpt, nearNumbers, numOpt, shuffle, textOpt } from '../naturali';

export const ID = 'numeri-naturali-divisibilita';

const t = (s: string) => `\\text{${s}}`;
const digits = (n: number) => String(n).split('').map(Number);
const digitSum = (n: number) => digits(n).reduce((a, b) => a + b, 0);
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const list = (xs: number[]) => (xs.length === 1 ? fmt(xs[0]) : `${xs.slice(0, -1).map(fmt).join(', ')}\\text{ e }${fmt(xs[xs.length - 1])}`);

/** The table of the lesson, in its order. */
export const CRITERIA = [2, 3, 4, 5, 9, 10, 11, 25];

// ---------------------------------------------------------------------------
// Criteria, as the lesson words them

function criterionStep(n: number, d: number): string {
	const yes = n % d === 0;
	const ds = digits(n);
	const last = ds[ds.length - 1];
	const lastTwo = n % 100;
	const tail = (ok: boolean) => (ok ? t(': divisibile per ') : t(': non divisibile per ')) + d;
	switch (d) {
		case 2:
			return `${t("L'ultima cifra, ")}${last}${t(yes ? ', è pari' : ', è dispari')}${tail(yes)}`;
		case 3:
		case 9: {
			const s = digitSum(n);
			return `${t('La somma delle cifre è ')}${ds.join(' + ')} = ${s}${t(s % d === 0 ? ', multiplo di ' : ', che non è multiplo di ')}${d}${tail(yes)}`;
		}
		case 4:
			if (lastTwo === 0) return `${t('Le ultime due cifre sono ')}00${tail(true)}`;
			return `${t('Le ultime due cifre formano ')}${lastTwo}${t(lastTwo % 4 === 0 ? ', multiplo di ' : ', che non è multiplo di ')}4${tail(yes)}`;
		case 5:
			return `${t("L'ultima cifra è ")}${last}${yes ? '' : t(', non 0 né 5')}${tail(yes)}`;
		case 10:
			return `${t("L'ultima cifra è ")}${last}${yes ? '' : t(', non 0')}${tail(yes)}`;
		case 25: {
			const two = String(lastTwo).padStart(2, '0');
			return `${t('Le ultime due cifre sono ')}${two}${yes ? '' : t(', non 00, 25, 50 o 75')}${tail(yes)}`;
		}
		case 11: {
			const rev = [...ds].reverse();
			const odd = rev.filter((_, i) => i % 2 === 0), even = rev.filter((_, i) => i % 2 === 1);
			const so = odd.reduce((a, b) => a + b, 0), se = even.reduce((a, b) => a + b, 0);
			const [hi, lo] = so >= se ? [so, se] : [se, so];
			const diff = hi - lo;
			const l = (xs: number[]) => xs.join(t(' e '));
			return `${t('Da destra, le cifre di posto dispari sono ')}${l(odd)}${t(' (somma ')}${so}${t('), quelle di posto pari ')}${l(even)}${t(' (somma ')}${se}${t('); la differenza è ')}${hi} - ${lo} = ${diff}${diff === 0 ? '' : t(diff % 11 === 0 ? ', multiplo di 11' : ', che non è multiplo di 11')}${tail(yes)}`;
		}
	}
	throw new Error(`no criterion for ${d}`);
}

/**
 * A number a hurried student would wrongly call divisible by d: the traps of the lesson
 * (only the last digit for 4, a multiple of 3 for 9, the last digit 3, 6 or 9 for 3, a final 5
 * for 10 and 25), plus, for the division level, the factors of d (a multiple of 4 for 8, of 2 or 3
 * for 6) and a final 7 for 7.
 */
export function isTrap(n: number, d: number, level: number): boolean {
	if (n % d === 0) return false;
	const last = n % 10;
	switch (d) {
		case 2:
			return Number(String(n)[0]) % 2 === 0; // looks at the first digit
		case 3:
			return [3, 6, 9].includes(last);
		case 4:
			return n % 2 === 0;
		case 5:
			return String(n).slice(0, -1).includes('5') || String(n).slice(0, -1).includes('0');
		case 6:
			return n % 2 === 0 || n % 3 === 0;
		case 7:
			return last === 7;
		case 8:
			return n % 4 === 0;
		case 9:
			return n % 3 === 0;
		case 10:
			return last === 5 || (level === 2 && String(n).slice(0, -1).includes('0'));
		case 25:
			return n % 5 === 0;
		default:
			return false;
	}
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: which of these numbers is divisible by d

const L1_DIVISORS = [3, 4, 6, 7, 7, 8, 9];
const L2_DIVISORS = [2, 3, 3, 5, 9, 9, 10];

function whichDivisibleSample(rng: Rng, level: 1 | 2, seed: number): Sample | null {
	const d = rng.pick(level === 1 ? L1_DIVISORS : L2_DIVISORS);
	const [lo, hi] = level === 2 ? [1000, 9999] : rng.next() < 0.4 ? [20, 99] : [100, 999];
	const m = d * rng.int(Math.ceil(lo / d), Math.floor(hi / d));
	const pool = range(lo, hi).filter((x) => x % d !== 0);
	const traps = shuffle(rng, pool.filter((x) => isTrap(x, d, level))).slice(0, rng.int(1, 2));
	if (traps.length === 0) return null;
	// the other distractors are close to the right number, so size does not give it away
	const near = pool.filter((x) => !traps.includes(x) && !isTrap(x, d, level) && Math.abs(x - m) <= (level === 1 ? 3 * d : 300));
	const others = shuffle(rng, near).slice(0, 3 - traps.length);
	const wrong = [...traps, ...others];
	if (wrong.length < 3) return null;
	const shown = [m, ...wrong].sort((a, b) => a - b);
	const choice = makeChoice(rng, numOpt(m), wrong.map(numOpt));
	const steps =
		level === 1
			? [
					t('Dividi ogni numero per ') + d + t(': è divisibile solo se il resto è 0.'),
					...shown.map((x) => `${fmt(x)} : ${d} = ${Math.floor(x / d)}${t(' resto ')}${x % d}${x % d === 0 ? t(': divisibile') : t(': non divisibile')}`),
				]
			: shown.map((x) => `${fmt(x)}\\text{: }${criterionStep(x, d)}`);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: level === 1 ? `Quale di questi numeri è divisibile per ${d}? Fai la divisione.` : `Quale di questi numeri è divisibile per ${d}? Usa il criterio di divisibilità.`,
		problem: shown.map(fmt).join(' \\qquad '),
		solution: `${fmt(m)} = ${d} \\cdot ${fmt(m / d)}${t(': è divisibile per ')}${d}`,
		steps,
		answer: choice,
		params: { d: String(d), n: String(m), options: shown.map(String), case: String(d) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: all the criteria on one number

const divisorsAmong = (n: number) => CRITERIA.filter((c) => n % c === 0);
const setLatex = (xs: number[]) => xs.join(', ');
const setOpt = (xs: number[]): Opt => {
	const s = [...xs].sort((a, b) => a - b);
	return { latex: setLatex(s), values: s.map(String) };
};

function allCriteriaSample(rng: Rng, seed: number): Sample | null {
	const m = rng.next() < 0.3 ? 11 * rng.pick([1, 2, 3, 4, 5, 9, 25]) : rng.pick([1, 4, 6, 9, 12, 15, 18, 20, 25, 36, 45, 50, 75, 100]);
	const u = rng.next();
	const [lo, hi] = u < 0.2 ? [100, 999] : u < 0.7 ? [1000, 9999] : [10000, 99999];
	if (Math.ceil(lo / m) > Math.floor(hi / m)) return null;
	const n = m * rng.int(Math.ceil(lo / m), Math.floor(hi / m));
	const truth = divisorsAmong(n);
	if (truth.length === 0 || truth.length > 6) return null;
	if (!CRITERIA.some((c) => isTrap(n, c, 3))) return null;
	const answer: SetAnswer = { kind: 'set', values: truth.map(String), latex: setLatex(truth) };
	return {
		generatorId: ID,
		level: 3,
		seed,
		prompt: 'Per quali tra 2, 3, 4, 5, 9, 10, 11 e 25 è divisibile questo numero? Usa i criteri di divisibilità.',
		problem: fmt(n),
		solution: `${fmt(n)}${t(' è divisibile per ')}${list(truth)}`,
		steps: CRITERIA.map((c) => criterionStep(n, c)),
		answer,
		params: { n: String(n), divisors: truth.map(String), case: n % 11 === 0 ? '11' : 'senza 11' },
	};
}

function allCriteriaChoice(n: number, rng: Rng): ChoiceAnswer {
	const truth = divisorsAmong(n);
	const add = (c: number) => setOpt([...truth, c]);
	const drop = (c: number) => (truth.length > 1 ? setOpt(truth.filter((x) => x !== c)) : null);
	const traps = shuffle(rng, CRITERIA.filter((c) => isTrap(n, c, 3)));
	const hard = shuffle(rng, truth.filter((c) => [4, 9, 11, 25].includes(c)));
	const cands: (Opt | null)[] = [];
	for (let i = 0; i < 3; i++) {
		if (traps[i] !== undefined) cands.push(add(traps[i]));
		if (hard[i] !== undefined) cands.push(drop(hard[i]));
	}
	cands.push(truth.includes(11) ? drop(11) : add(11));
	const fill = shuffle(rng, CRITERIA).map((c) => (truth.includes(c) ? drop(c) : add(c))).filter((o): o is Opt => o !== null);
	return makeChoice(rng, setOpt(truth), cands, fill);
}

// ---------------------------------------------------------------------------
// Level 4: prime or composite

const PRIMES = range(2, 400).filter(isPrime);
/** Odd composites whose smallest prime factor is at least 7: the criteria for 2, 3, 5 do not catch them. */
const HIDDEN_COMPOSITES = range(49, 400).filter((n) => !isPrime(n) && factorize(n)[0][0] >= 7);
const L4_PRIMES = PRIMES.filter((p) => p >= 49);
const smallestFactor = (n: number) => factorize(n)[0][0];

function primeSteps(n: number): string[] {
	const out = [
		`${t("Non è divisibile per 2 (l'ultima cifra è ")}${n % 10}${t('), né per 3 (la somma delle cifre è ')}${digitSum(n)}${t('), né per 5')}`,
	];
	for (const p of PRIMES.filter((p) => p >= 7)) {
		if (p * p > n) {
			out.push(`${t('Il primo successivo è ')}${p}${t(', e ')}${p} \\cdot ${p} = ${p * p}${t(' supera ')}${n}${t(': puoi fermarti, ')}${n}${t(' è primo')}`);
			break;
		}
		const q = Math.floor(n / p), r = n % p;
		out.push(`${n} = ${p} \\cdot ${q}${r ? ` + ${r}` : ''}`);
		if (r === 0) {
			out.push(`${n}${t(' è divisibile per ')}${p}${t(': è composto')}`);
			break;
		}
	}
	return out;
}

const primoOpt = textOpt('primo', 'È primo');
const divOpt = (p: number): Opt => ({ latex: `${t('È divisibile per ')}${p}`, values: [`div:${p}`] });

function primeSample(rng: Rng, seed: number): Sample {
	const composite = rng.int(0, 1) === 1;
	const n = rng.pick(composite ? HIDDEN_COMPOSITES : L4_PRIMES);
	const p = composite ? smallestFactor(n) : null;
	const correct = p ? divOpt(p) : primoOpt;
	// primes a student would try: 3 first (the criterion is often misapplied), then 7, 11, 13, ...
	const tries = [3, ...shuffle(rng, [7, 11, 13, 17, 19, 23].filter((r) => r * r <= 3 * n))].filter((r) => n % r !== 0);
	const wrong: Opt[] = [...(composite ? [primoOpt] : []), ...tries.map(divOpt)];
	const choice = makeChoice(rng, correct, wrong);
	return {
		generatorId: ID,
		level: 4,
		seed,
		prompt: 'Quale di queste affermazioni è vera? Prova a dividere per i numeri primi, in ordine.',
		problem: String(n),
		solution: p ? `${n} = ${p} \\cdot ${n / p}${t(': è composto')}` : `${n}${t(' è primo')}`,
		steps: primeSteps(n),
		answer: choice,
		params: { n: String(n), smallest: p ? String(p) : 'primo', case: composite ? 'composto' : 'primo' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: prime factorisation

type F = [number, number][];
const valueOf = (fs: F) => fs.reduce((a, [p, e]) => a * p ** e, 1);

function factorSample(rng: Rng, seed: number, big: boolean): Sample | null {
	const fs: F = [];
	if (big) {
		for (const p of shuffle(rng, [7, 11, 13]).slice(0, rng.pick([1, 1, 2]))) fs.push([p, p === 7 ? rng.int(1, 2) : 1]);
		for (const p of shuffle(rng, [2, 3, 5]).slice(0, rng.int(1, 2))) fs.push([p, p === 2 ? rng.int(1, 4) : rng.int(1, 3)]);
	} else {
		for (const p of shuffle(rng, [2, 3, 5]).slice(0, rng.int(2, 3))) fs.push([p, p === 2 ? rng.int(1, 5) : p === 3 ? rng.int(1, 4) : rng.int(1, 3)]);
	}
	fs.sort((a, b) => a[0] - b[0]);
	const n = valueOf(fs);
	const mult = fs.reduce((a, [, e]) => a + e, 0);
	if (n < 60 || n > 5000 || mult < 3 || !fs.some(([, e]) => e >= 2)) return null;
	const answer: ExpressionAnswer = { kind: 'expression', value: factorsAscii(fs), latex: factorsLatex(fs), form: 'factored' };
	const expanded = fs.flatMap(([p, e]) => Array(e).fill(String(p))).join(' \\cdot ');
	return {
		generatorId: ID,
		level: 5,
		seed,
		prompt: 'Scomponi in fattori primi.',
		problem: fmt(n),
		solution: `${fmt(n)} = ${factorsLatex(fs)}`,
		steps: [
			`${t('Dividi per il più piccolo primo che divide il numero, e riparti dal quoziente fino a 1:')}\\quad ${divisionTable(n)}`,
			`${fmt(n)} = ${expanded} = ${factorsLatex(fs)}`,
		],
		answer,
		params: { n: String(n), factors: fs.map(([p, e]) => [String(p), String(e)]), case: big ? 'con 7, 11 o 13' : 'solo 2, 3, 5' },
	};
}

/** Distractors: a composite factor left in, stopping too early, an exponent off by one, exponents swapped. */
function factorChoice(n: number, rng: Rng): ChoiceAnswer {
	const fs = factorize(n);
	const opt = (xs: F): Opt => {
		const s = [...xs].sort((a, b) => a[0] - b[0]);
		return { latex: factorsLatex(s), values: [factorsAscii(s)] };
	};
	const cands: Opt[] = [];
	const sq = fs.filter(([, e]) => e >= 2);
	if (sq.length) {
		const [p, e] = rng.pick(sq);
		cands.push(opt([...fs.filter(([q]) => q !== p), ...(e > 2 ? ([[p, e - 2]] as F) : []), [p * p, 1]]));
	}
	const [p0, e0] = fs[0];
	const rest = n / p0 ** e0;
	if (rest > 1 && !isPrime(rest)) cands.push({ latex: `${factorsLatex([[p0, e0]])} \\cdot ${fmt(rest)}`, values: [`${factorsAscii([[p0, e0]])}*${rest}`] });
	const wrong: Opt[] = [];
	const i = rng.int(0, fs.length - 1);
	wrong.push(opt(fs.map(([p, e], j) => [p, j === i ? e + 1 : e])));
	const two = fs.findIndex(([, e]) => e >= 2);
	if (two >= 0) wrong.push(opt(fs.map(([p, e], j) => [p, j === two ? e - 1 : e])));
	const a = fs.findIndex(([, e]) => e !== fs[0][1]);
	if (a > 0) wrong.push(opt(fs.map(([p, e], j) => [p, j === 0 ? fs[a][1] : j === a ? fs[0][1] : e])));
	wrong.push(opt(fs.map(([p, e], j) => [p, j === fs.length - 1 ? e + 1 : e])));
	wrong.push(opt(fs.map(([p, e]) => [p, e + 1])));
	return makeChoice(rng, opt(fs), [...cands, ...shuffle(rng, wrong)]);
}

// ---------------------------------------------------------------------------
// Level 6: from the factorisation

const countDivisors = (fs: F) => fs.reduce((a, [, e]) => a * (e + 1), 1);
const divides = (b: number, n: number) => n % b === 0;
/** The article before a number: "l'11", "il 5". */
const il = (p: number) => (p === 11 || p === 8 ? "l'" : 'il ');

function divisorCountSample(rng: Rng, seed: number): Sample | null {
	const maxE: Record<number, number> = { 2: 4, 3: 3, 5: 2, 7: 2 };
	const primes = shuffle(rng, [2, 3, 5, 7]).slice(0, rng.pick([2, 2, 3, 3, 4])).sort((a, b) => a - b);
	const fs: F = primes.map((p) => [p, rng.int(1, maxE[p])]);
	const n = valueOf(fs);
	if (n > 10000 || n < 20 || !fs.some(([, e]) => e >= 2)) return null;
	const k = countDivisors(fs);
	const plus = fs.map(([, e]) => `(${e} + 1)`).join(' \\cdot ');
	return {
		generatorId: ID,
		level: 6,
		seed,
		prompt: 'Quanti divisori ha questo numero? Usa la scomposizione.',
		problem: `${fmt(n)} = ${factorsLatex(fs)}`,
		solution: `${fmt(n)}${t(' ha ')}${k}${t(' divisori')}`,
		steps: [
			`${t("Ogni divisore si ottiene prendendo ciascun primo con un esponente da 0 fino a quello della scomposizione: ")}${fs.map(([p, e]) => `${e + 1}${t(' scelte per il ')}${p}`).join(',\\ ')}`,
			`${plus} = ${fs.map(([, e]) => e + 1).join(' \\cdot ')} = ${k}`,
		],
		answer: { kind: 'number', value: String(k) },
		params: { n: String(n), factors: fs.map(([p, e]) => [String(p), String(e)]), case: 'numero di divisori' },
	};
}

function divisibleFromFactorsSample(rng: Rng, seed: number): Sample | null {
	const maxE: Record<number, number> = { 2: 4, 3: 3, 5: 2, 7: 2, 11: 1 };
	const primes = shuffle(rng, [2, 3, 5, 7, 11]).slice(0, rng.int(3, 4)).sort((a, b) => a - b);
	const fs: F = primes.map((p) => [p, rng.int(1, maxE[p])]);
	const n = valueOf(fs);
	if (n > 20000 || !fs.some(([, e]) => e >= 2)) return null;
	// the right divisor: at least two prime factors, not n itself
	const bf: F = fs.map(([p, e]) => [p, rng.int(0, e)]);
	const b = valueOf(bf);
	if (bf.reduce((a, [, e]) => a + e, 0) < 2 || b === n || b > 1000) return null;
	const cands: number[] = [];
	// an exponent larger than in n
	for (const [p, e] of shuffle(rng, fs)) cands.push(p ** (e + 1) * (rng.int(0, 1) ? 1 : fs.find(([q]) => q !== p)![0]));
	// a prime that is not in n
	const missing = [2, 3, 5, 7, 11, 13].filter((q) => !primes.includes(q));
	for (const q of shuffle(rng, missing).slice(0, 2)) cands.push(q * rng.pick(primes));
	// the right divisor with one factor too many
	for (const [p, e] of fs) {
		const inB = bf.find(([q]) => q === p)![1];
		if (inB === e) cands.push(b * p);
	}
	const wrong = shuffle(rng, [...new Set(cands)].filter((x) => x > 3 && x <= 2000 && !divides(x, n) && x !== b));
	if (wrong.length < 3) return null;
	const picked = wrong.slice(0, 3);
	const shown = [b, ...picked].sort((x, y) => x - y);
	const choice = makeChoice(rng, numOpt(b), picked.map(numOpt));
	const why = (x: number) => {
		const xf = factorize(x);
		const nm = new Map(fs);
		const bad = xf.find(([p, e]) => (nm.get(p) ?? 0) < e);
		if (!bad) return `${fmt(x)} = ${factorsLatex(xf)}${t(': ogni fattore compare in ')}${fmt(n)}${t(' con esponente almeno uguale, divisibile; il quoziente è ')}${fmt(n / x)}`;
		const [p] = bad;
		const has = nm.get(p) ?? 0;
		return `${fmt(x)} = ${factorsLatex(xf)}${has === 0 ? t(`: ${il(p)}${p} non compare nella scomposizione, non divisibile`) : t(`: nella scomposizione ${il(p)}${p} ha esponente ${has}, non divisibile`)}`;
	};
	return {
		generatorId: ID,
		level: 6,
		seed,
		prompt: `Per quale tra ${shown.slice(0, -1).join(', ')} e ${shown[shown.length - 1]} è divisibile questo numero? Usa la scomposizione.`,
		problem: `${fmt(n)} = ${factorsLatex(fs)}`,
		solution: `${fmt(n)}${t(' è divisibile per ')}${b}${t(': ')}${fmt(n)} = ${b} \\cdot ${fmt(n / b)}`,
		steps: shown.map(why),
		answer: choice,
		params: { n: String(n), factors: fs.map(([p, e]) => [String(p), String(e)]), divisor: String(b), options: shown.map(String), case: 'divisibilità' },
	};
}

// ---------------------------------------------------------------------------
// Check and choice

const factorsOf = (x: unknown): F => (Array.isArray(x) ? x.map((f) => [Number(f[0]), Number(f[1])] as [number, number]) : []);
const numsOf = (x: unknown): number[] => (Array.isArray(x) ? x.map(Number) : []);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const choiceOk = (ch: ChoiceAnswer | undefined, key: string) => {
		if (!ch) return v.push('manca la scelta multipla');
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		const keys = ch.options.map((o) => o.values.join('|'));
		if (new Set(keys).size !== keys.length) v.push('opzioni ripetute');
		if (keys[ch.correct] !== key || keys.filter((k) => k === key).length !== 1) v.push('opzione corretta sbagliata');
	};
	const n = Number(p.n);
	switch (sample.level) {
		case 1:
		case 2: {
			const d = Number(p.d);
			const allowed = sample.level === 1 ? L1_DIVISORS : L2_DIVISORS;
			if (!allowed.includes(d)) v.push('divisore non previsto');
			if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
			const opts = sample.answer.options.map((o) => Number(o.values[0]));
			const [lo, hi] = sample.level === 2 ? [1000, 9999] : [20, 999];
			if (opts.some((x) => x < lo || x > hi)) v.push('numero fuori intervallo');
			if (sample.level === 1 && !(opts.every((x) => x < 100) || opts.every((x) => x >= 100))) v.push('opzioni con un numero di cifre diverso');
			const good = opts.filter((x) => x % d === 0);
			if (good.length !== 1 || good[0] !== n) v.push('non esattamente un multiplo tra le opzioni');
			if (!opts.some((x) => isTrap(x, d, sample.level))) v.push('nessun trabocchetto');
			choiceOk(sample.answer, String(n));
			break;
		}
		case 3: {
			const truth = divisorsAmong(n);
			if (n < 100 || n > 99999) v.push('numero fuori intervallo');
			if (truth.length === 0 || truth.length > 6) v.push('da 1 a 6 divisori tra i criteri');
			if (!CRITERIA.some((c) => isTrap(n, c, 3))) v.push('nessun trabocchetto');
			const a = sample.answer;
			if (a.kind !== 'set' || a.values.join(',') !== truth.join(',')) v.push('risposta diversa');
			if (sample.choice) choiceOk(sample.choice, truth.join('|'));
			break;
		}
		case 4: {
			const prime = isPrime(n);
			if (n < 49 || n > 400) v.push('numero fuori intervallo');
			if (!prime && smallestFactor(n) < 7) v.push('composto riconoscibile con i criteri di 2, 3, 5');
			if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
			const key = prime ? 'primo' : `div:${smallestFactor(n)}`;
			const trueOpts = sample.answer.options.filter((o) => {
				const k = o.values[0];
				return k === 'primo' ? prime : n % Number(k.slice(4)) === 0;
			});
			if (trueOpts.length !== 1) v.push('non esattamente un’affermazione vera');
			choiceOk(sample.answer, key);
			break;
		}
		case 5: {
			const fs = factorsOf(p.factors);
			const canon = factorsAscii(factorize(n));
			if (factorsAscii(fs) !== canon) v.push('scomposizione sbagliata');
			if (n < 60 || n > 5000) v.push('numero fuori intervallo');
			const f = factorize(n);
			if (f.length < 2 || f.reduce((a, [, e]) => a + e, 0) < 3 || !f.some(([, e]) => e >= 2) || f.some(([q]) => q > 13)) v.push('servono almeno due primi fino a 13, tre fattori, un esponente almeno 2');
			if (sample.answer.kind !== 'expression' || sample.answer.value !== canon) v.push('risposta diversa dalla scomposizione');
			if (sample.choice) choiceOk(sample.choice, canon);
			break;
		}
		case 6: {
			const fs = factorsOf(p.factors);
			if (factorsAscii(fs) !== factorsAscii(factorize(n))) v.push('scomposizione mostrata sbagliata');
			if (!fs.some(([, e]) => e >= 2)) v.push('serve un esponente almeno 2');
			if (p.case === 'numero di divisori') {
				const k = countDivisors(factorize(n));
				if (sample.answer.kind !== 'number' || sample.answer.value !== String(k)) v.push('numero di divisori sbagliato');
				if (sample.choice) choiceOk(sample.choice, String(k));
			} else {
				if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
				const opts = sample.answer.options.map((o) => Number(o.values[0]));
				const good = opts.filter((x) => n % x === 0);
				if (good.length !== 1 || String(good[0]) !== p.divisor) v.push('non esattamente un divisore tra le opzioni');
				if (numsOf(p.options).sort((a, b) => a - b).join() !== [...opts].sort((a, b) => a - b).join()) v.push('opzioni diverse dal testo');
				choiceOk(sample.answer, String(p.divisor));
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const n = Number(sample.params.n);
	if (sample.level === 3) return allCriteriaChoice(n, rng);
	if (sample.level === 5) return factorChoice(n, rng);
	// level 6, number of divisors
	const fs = factorize(n);
	const k = countDivisors(fs);
	const es = fs.map(([, e]) => e);
	const prod = es.reduce((a, b) => a * b, 1);
	const sum = es.reduce((a, b) => a + b, 0);
	// forgot the +1; added the (e + 1) instead of multiplying; +1 once at the end; the exponents added
	const cands = [prod, sum + es.length, prod + 1, sum, sum + 1].map((c) => mistakeOpt(c));
	return makeChoice(rng, numOpt(k), cands, nearNumbers(rng, k));
}

export const numeriNaturaliDivisibilita: Generator = {
	id: ID,
	title: 'Divisibilità e numeri primi',
	levels: {
		1: { label: 'Divisibile o no, con la divisione', constraints: ['divisore 3, 4, 6, 7, 8 o 9', 'quattro numeri tutti a due o tutti a tre cifre, uno solo multiplo, almeno un trabocchetto'] },
		2: { label: 'Un criterio alla volta', constraints: ['divisore 2, 3, 5, 9 o 10', 'quattro numeri da 1000 a 9999, uno solo divisibile, almeno un trabocchetto'] },
		3: { label: 'Tutti i criteri su un numero', constraints: ['numero da 100 a 99 999', 'divisibile per 1-6 tra 2, 3, 4, 5, 9, 10, 11, 25, con almeno un trabocchetto', 'circa un terzo multipli di 11'] },
		4: { label: 'Primo o composto', constraints: ['numero da 49 a 400, metà primi', 'i composti non hanno fattori 2, 3, 5'] },
		5: { label: 'Scomposizione in fattori primi', constraints: ['numero da 60 a 5000, almeno due primi e tre fattori, un esponente almeno 2', 'metà con 7, 11 o 13'] },
		6: { label: 'Dalla scomposizione', constraints: ['metà: quanti divisori, con la regola (a + 1)(b + 1)', 'metà: per quale di quattro numeri è divisibile, confrontando gli esponenti'] },
	},
	generate(rng: Rng, level: number): Sample {
		// the case is drawn once, so rejections inside one case do not change the shares
		const half = rng.int(0, 1) === 1;
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let s: Sample | null;
			switch (level) {
				case 1:
				case 2:
					s = whichDivisibleSample(rng, level, rng.seed);
					break;
				case 3:
					s = allCriteriaSample(rng, rng.seed);
					break;
				case 4:
					s = primeSample(rng, rng.seed);
					break;
				case 5:
					s = factorSample(rng, rng.seed, half);
					break;
				case 6:
					s = half ? divisorCountSample(rng, rng.seed) : divisibleFromFactorsSample(rng, rng.seed);
					break;
				default:
					throw new Error(`${ID}: unknown level ${level}`);
			}
			if (s && check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriNaturaliDivisibilita;
