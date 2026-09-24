/**
 * MCD e MCM in ℕ. Spec: specs/exercises/numeri-naturali-mcm-mcd.md
 *
 * Six levels in the order of the lesson: divisibility criteria; prime factorisation; MCD or MCM of
 * two numbers; of three numbers; MCD with Euclid's algorithm; word problems (tiles, ribbons, bags,
 * buses, lighthouses, swimming pool). Numbers are built from their factorisation, so they stay
 * small and the MCD and MCM are what the exercise needs.
 */
import type { ChoiceAnswer, ExpressionAnswer, Generator, Rng, Sample } from '../types';
import {
	type Opt,
	divisionTable,
	factorize,
	factorsAscii,
	factorsLatex,
	fmt,
	gcdN,
	isPrime,
	lcmN,
	makeChoice,
	mistakeOpt,
	nearNumbers,
	numOpt,
	shuffle,
} from '../naturali';

export const ID = 'numeri-naturali-mcm-mcd';

const t = (s: string) => `\\text{${s}}`;
const gcdAll = (xs: number[]) => xs.reduce(gcdN);
const lcmAll = (xs: number[]) => xs.reduce(lcmN);
const fn = (name: 'MCD' | 'MCM', xs: number[]) => `\\text{${name}}(${xs.map(fmt).join(', ')})`;
/** "84 = 2^2 \cdot 3 \cdot 7", or "13 è primo". */
const factorLine = (x: number) => (isPrime(x) ? `${fmt(x)}${t(' è primo')}` : `${fmt(x)} = ${factorsLatex(factorize(x))}`);
/** "MCD(84, 120) = 2^2 \cdot 3 = 12", without "= 2 = 2" when the product is a single prime. */
const result = (name: 'MCD' | 'MCM', xs: number[], used: [number, number][], v: number) => {
	const prod = factorsLatex(used);
	return `${fn(name, xs)} = ${used.length && prod !== fmt(v) ? `${prod} = ` : ''}${fmt(v)}`;
};

// ---------------------------------------------------------------------------
// Level 1: divisibility criteria

export const CRITERIA = [2, 3, 4, 5, 9, 10, 11, 25];

const digits = (n: number) => String(n).split('').map(Number);

/** Why n is (or is not) divisible by d, with the criterion of the lesson. */
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
			const s = ds.reduce((a, b) => a + b, 0);
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
			const list = (xs: number[]) => xs.join(t(' e '));
			return `${t('Da destra, le cifre di posto dispari sono ')}${list(odd)}${t(' (somma ')}${so}${t('), quelle di posto pari ')}${list(even)}${t(' (somma ')}${se}${t('); la differenza è ')}${hi} - ${lo} = ${diff}${diff === 0 ? '' : t(diff % 11 === 0 ? ', multiplo di 11' : ', che non è multiplo di 11')}${tail(yes)}`;
		}
	}
	throw new Error(`no criterion for ${d}`);
}

/** Divisors a hurried student would wrongly accept for n. */
function isTrap(n: number, d: number): boolean {
	if (n % d === 0) return false;
	switch (d) {
		case 4:
			return n % 2 === 0;
		case 9:
			return n % 3 === 0;
		case 3:
			return [3, 6, 9].includes(n % 10);
		case 25:
		case 10:
			return n % 5 === 0;
		default:
			return false;
	}
}

function divisibilitySample(rng: Rng, seed: number): Sample {
	for (;;) {
		const d = rng.pick(CRITERIA);
		const n = d * rng.int(Math.ceil(100 / d), Math.floor(9999 / d));
		const pool = CRITERIA.filter((c) => c !== d && n % c !== 0);
		const traps = shuffle(rng, pool.filter((c) => isTrap(n, c))).slice(0, 2);
		if (traps.length === 0) continue;
		const others = shuffle(rng, pool.filter((c) => !traps.includes(c)));
		const wrong = [...traps, ...others].slice(0, 3);
		if (wrong.length < 3) continue;
		const choice = makeChoice(rng, numOpt(d), wrong.map(numOpt));
		const shown = [d, ...wrong].sort((a, b) => a - b);
		return {
			generatorId: ID,
			level: 1,
			seed,
			prompt: 'Per quale di questi numeri è divisibile? Usa i criteri di divisibilità.',
			problem: fmt(n),
			solution: `${fmt(n)}${t(' è divisibile per ')}${d}`,
			steps: shown.map((c) => criterionStep(n, c)),
			answer: choice,
			params: { n: String(n), divisor: String(d), options: shown.map(String), case: String(d) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: prime factorisation

const SMALL_PRIMES = [2, 3, 5, 7, 11, 13];

function factorSample(rng: Rng, seed: number): Sample {
	for (;;) {
		const k = rng.pick([2, 2, 3, 3, 3, 4]);
		const primes = shuffle(rng, SMALL_PRIMES.slice(0, k === 4 ? 4 : 6)).slice(0, k).sort((a, b) => a - b);
		const fs: [number, number][] = primes.map((p) => [p, p <= 3 ? rng.int(1, 4) : p <= 7 ? rng.int(1, 2) : 1]);
		const n = fs.reduce((acc, [p, e]) => acc * p ** e, 1);
		const mult = fs.reduce((a, [, e]) => a + e, 0);
		if (n < 48 || n > 1000 || mult < 3 || !fs.some(([, e]) => e >= 2)) continue;
		const answer: ExpressionAnswer = { kind: 'expression', value: factorsAscii(fs), latex: factorsLatex(fs), form: 'factored' };
		const expanded = fs.flatMap(([p, e]) => Array(e).fill(String(p))).join(' \\cdot ');
		return {
			generatorId: ID,
			level: 2,
			seed,
			prompt: 'Scomponi in fattori primi.',
			problem: fmt(n),
			solution: `${fmt(n)} = ${factorsLatex(fs)}`,
			steps: [
				`${t('Dividi per il più piccolo primo che divide il numero, e ripeti sul quoziente fino a 1:')}\\quad ${divisionTable(n)}`,
				`${fmt(n)} = ${expanded} = ${factorsLatex(fs)}`,
			],
			answer,
			params: { n: String(n), factors: fs.map(([p, e]) => [String(p), String(e)]) },
		};
	}
}

/** Distractors: a composite factor left in, stopping too early, an exponent off by one, exponents swapped. */
function factorChoice(n: number, rng: Rng): ChoiceAnswer {
	const fs = factorize(n);
	const opt = (xs: [number, number][]): Opt => {
		const s = [...xs].sort((a, b) => a[0] - b[0]);
		return { latex: factorsLatex(s), values: [factorsAscii(s)] };
	};
	const cands: Opt[] = [];
	const sq = fs.filter(([, e]) => e >= 2);
	if (sq.length) {
		const [p, e] = rng.pick(sq);
		cands.push(opt([...fs.filter(([q]) => q !== p), ...(e > 2 ? ([[p, e - 2]] as [number, number][]) : []), [p * p, 1]]));
	}
	const [p0, e0] = fs[0];
	const rest = n / p0 ** e0;
	if (!isPrime(rest)) cands.push({ latex: `${factorsLatex([[p0, e0]])} \\cdot ${fmt(rest)}`, values: [`${factorsAscii([[p0, e0]])}*${rest}`] });
	const i = rng.int(0, fs.length - 1);
	const wrong: Opt[] = [opt(fs.map(([p, e], j) => [p, j === i ? e + 1 : e]))];
	const two = fs.findIndex(([, e]) => e >= 2);
	wrong.push(opt(fs.map(([p, e], j) => [p, j === two ? e - 1 : e])));
	const a = fs.findIndex(([, e]) => e !== fs[0][1]);
	if (a > 0) wrong.push(opt(fs.map(([p, e], j) => [p, j === 0 ? fs[a][1] : j === a ? fs[0][1] : e])));
	wrong.push(opt(fs.map(([p, e], j) => [p, j === fs.length - 1 ? e + 1 : e])));
	return makeChoice(rng, opt(fs), [...cands, ...shuffle(rng, wrong)]);
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: MCD or MCM of two or three numbers

const EXP_POOL: [number, number[]][] = [
	[2, [0, 1, 1, 2, 2, 3, 3, 4]],
	[3, [0, 0, 1, 1, 2, 2, 3]],
	[5, [0, 0, 0, 1, 1, 2]],
	[7, [0, 0, 0, 0, 1]],
	[11, [0, 0, 0, 0, 0, 1]],
	[13, [0, 0, 0, 0, 0, 0, 1]],
];

function randomNumber(rng: Rng): number {
	return EXP_POOL.reduce((acc, [p, es]) => acc * p ** rng.pick(es), 1);
}

type Which = 'MCD' | 'MCM';

/** The mistaken selections of factors. */
function selections(xs: number[]) {
	const fz = xs.map((x) => new Map(factorize(x)));
	const primes = [...new Set(fz.flatMap((m) => [...m.keys()]))].sort((a, b) => a - b);
	const exps = (p: number) => fz.map((m) => m.get(p) ?? 0);
	const common = primes.filter((p) => exps(p).every((e) => e > 0));
	const prod = (ps: [number, number][]) => ps.reduce((a, [p, e]) => a * p ** e, 1);
	return {
		fz,
		primes,
		mcdFactors: common.map((p) => [p, Math.min(...exps(p))] as [number, number]),
		mcmFactors: primes.map((p) => [p, Math.max(...exps(p))] as [number, number]),
		/** only the common factors, with the largest exponent */
		commonMax: prod(common.map((p) => [p, Math.max(...exps(p))])),
		/** all the factors, with the smallest exponent where they appear */
		allMin: prod(primes.map((p) => [p, Math.min(...exps(p).filter((e) => e > 0))])),
	};
}

function mcdMcmSample(rng: Rng, level: 3 | 4, seed: number): Sample {
	const count = level === 3 ? 2 : 3;
	const max = level === 3 ? 400 : 300;
	const coprime = rng.next() < 0.1; // numbers with MCD 1: about 1 in 10
	for (;;) {
		const xs = Array.from({ length: count }, () => randomNumber(rng));
		if (xs.some((x) => x < 12 || x > max) || new Set(xs).size < count) continue;
		if (xs.some((a) => xs.some((b) => a !== b && b % a === 0))) continue;
		const g = gcdAll(xs), m = lcmAll(xs);
		if (m > 3000) continue;
		if ((g === 1) !== coprime) continue;
		const which: Which = rng.int(0, 1) ? 'MCD' : 'MCM';
		const sel = selections(xs);
		const truth = which === 'MCD' ? g : m;
		const scomp = xs.map(factorLine).join(',\\quad ');
		const steps = [`${t('Scomponi in fattori primi: ')}${scomp}`];
		if (which === 'MCD') {
			if (sel.mcdFactors.length === 0) steps.push(t('Non ci sono fattori primi comuni: il MCD è 1 e i numeri sono primi tra loro'));
			else steps.push(`${t("Prendi solo i fattori comuni, ciascuno con l'esponente più piccolo: ")}${factorsLatex(sel.mcdFactors)}`);
		} else {
			steps.push(`${t("Prendi tutti i fattori, comuni e non comuni, ciascuno con l'esponente più grande: ")}${factorsLatex(sel.mcmFactors)}`);
		}
		const used = which === 'MCD' ? sel.mcdFactors : sel.mcmFactors;
		steps.push(result(which, xs, used, truth));
		return {
			generatorId: ID,
			level,
			seed,
			prompt: which === 'MCD' ? 'Calcola il MCD.' : 'Calcola il MCM.',
			problem: fn(which, xs),
			solution: `${fn(which, xs)} = ${fmt(truth)}`,
			steps,
			answer: { kind: 'number', value: String(truth) },
			params: { numbers: xs.map(String), which, value: String(truth), case: which },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: Euclid

function euclid(a: number, b: number): { a: number; b: number; q: number; r: number }[] {
	const out = [];
	while (b !== 0) {
		out.push({ a, b, q: Math.floor(a / b), r: a % b });
		[a, b] = [b, a % b];
	}
	return out;
}

function euclidSample(rng: Rng, seed: number): Sample {
	for (;;) {
		const g = rng.int(2, 40);
		const v = rng.int(5, 60), u = rng.int(v + 1, 3 * v);
		if (gcdN(u, v) !== 1) continue;
		const a = g * u, b = g * v;
		if (b < 60 || a > 999) continue;
		const divs = euclid(a, b);
		if (divs.length < 3 || divs.length > 6) continue;
		return {
			generatorId: ID,
			level: 5,
			seed,
			prompt: "Calcola il MCD con l'algoritmo di Euclide.",
			problem: fn('MCD', [a, b]),
			solution: `${fn('MCD', [a, b])} = ${g}`,
			steps: [
				t('Dividi il maggiore per il minore; poi il divisore diventa il dividendo e il resto il divisore, finché il resto è 0.'),
				...divs.map((d) => `${fmt(d.a)} = ${fmt(d.b)} \\cdot ${d.q} + ${d.r}`),
				`${t("L'ultima divisione, quella con resto 0, ha divisore ")}${g}${t(': ')}${fn('MCD', [a, b])} = ${g}`,
			],
			answer: { kind: 'number', value: String(g) },
			params: { numbers: [String(a), String(b)], value: String(g), divisions: String(divs.length) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: word problems

export type Story = 'piastrelle' | 'nastri' | 'sacchetti' | 'autobus' | 'fari' | 'piscina';
const MCD_STORIES: Story[] = ['piastrelle', 'nastri', 'sacchetti'];
const MCM_STORIES: Story[] = ['autobus', 'fari', 'piscina'];

function story(s: Story, a: number, b: number): { prompt: string; data: string; unit: string } {
	switch (s) {
		case 'piastrelle':
			return {
				prompt: `Un pavimento rettangolare misura ${a} cm per ${b} cm. Lo si vuole coprire con piastrelle quadrate tutte uguali, le più grandi possibili, senza tagliarne nessuna. Quanti centimetri misura il lato di una piastrella?`,
				data: `${a}\\ \\text{cm} \\times ${b}\\ \\text{cm}`,
				unit: '\\ \\text{cm}',
			};
		case 'nastri':
			return {
				prompt: `Due nastri, lunghi ${a} cm e ${b} cm, vanno tagliati in pezzi tutti della stessa lunghezza, la più grande possibile, senza avanzi. Quanti centimetri è lungo ogni pezzo?`,
				data: `${a}\\ \\text{cm} \\quad ${b}\\ \\text{cm}`,
				unit: '\\ \\text{cm}',
			};
		case 'sacchetti':
			return {
				prompt: `Per una festa ci sono ${a} caramelle e ${b} cioccolatini. Si vogliono preparare sacchetti tutti uguali, il maggior numero possibile, usando tutti i dolci. Quanti sacchetti si preparano?`,
				data: `${a}\\ \\text{caramelle} \\quad ${b}\\ \\text{cioccolatini}`,
				unit: '\\ \\text{sacchetti}',
			};
		case 'autobus':
			return {
				prompt: `Dal capolinea partono due linee di autobus: la prima ogni ${a} minuti, la seconda ogni ${b} minuti. Sono appena partite insieme. Dopo quanti minuti ripartiranno di nuovo insieme?`,
				data: `\\text{ogni } ${a}\\ \\text{min} \\quad \\text{ogni } ${b}\\ \\text{min}`,
				unit: '\\ \\text{minuti}',
			};
		case 'fari':
			return {
				prompt: `Due fari lampeggiano, uno ogni ${a} secondi e l'altro ogni ${b} secondi. Si sono appena accesi insieme. Dopo quanti secondi si riaccenderanno insieme?`,
				data: `\\text{ogni } ${a}\\ \\text{s} \\quad \\text{ogni } ${b}\\ \\text{s}`,
				unit: '\\ \\text{secondi}',
			};
		case 'piscina':
			return {
				prompt: `Luca va in piscina ogni ${a} giorni, Marta ogni ${b} giorni. Oggi ci sono andati tutti e due. Fra quanti giorni si ritroveranno in piscina?`,
				data: `\\text{ogni } ${a}\\ \\text{giorni} \\quad \\text{ogni } ${b}\\ \\text{giorni}`,
				unit: '\\ \\text{giorni}',
			};
	}
}

function problemSample(rng: Rng, seed: number): Sample {
	for (;;) {
		const isMcd = rng.int(0, 1) === 1;
		const s = rng.pick(isMcd ? MCD_STORIES : MCM_STORIES);
		let a: number, b: number;
		if (isMcd) {
			const g = rng.pick([4, 5, 6, 8, 9, 10, 12, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40]);
			const u = rng.int(2, 16), v = rng.int(2, 16);
			if (u === v || gcdN(u, v) !== 1) continue;
			[a, b] = [g * Math.max(u, v), g * Math.min(u, v)];
			if (a > 400 || b < 20) continue;
		} else {
			a = rng.int(4, 30);
			b = rng.int(4, 30);
			if (a === b || a % b === 0 || b % a === 0) continue;
			[a, b] = [Math.min(a, b), Math.max(a, b)];
			if (lcmN(a, b) > 360 || (gcdN(a, b) === 1 && rng.next() < 0.7)) continue;
		}
		const g = gcdN(a, b), m = lcmN(a, b);
		const truth = isMcd ? g : m;
		const st = story(s, a, b);
		const which: Which = isMcd ? 'MCD' : 'MCM';
		const sel = selections([a, b]);
		const why = isMcd
			? t('Serve la misura più grande che sta un numero intero di volte in entrambi i numeri: è il MCD.')
			: t('Serve il primo momento in cui le due ripetizioni si ritrovano insieme: è il MCM.');
		const used = isMcd ? sel.mcdFactors : sel.mcmFactors;
		return {
			generatorId: ID,
			level: 6,
			seed,
			prompt: st.prompt,
			problem: st.data,
			solution: `${fmt(truth)}${st.unit}`,
			steps: [
				why,
				`${factorLine(a)},\\quad ${factorLine(b)}`,
				result(which, [a, b], used, truth),
			],
			answer: { kind: 'number', value: String(truth) },
			params: { story: s, numbers: [String(a), String(b)], which, value: String(truth), case: which },
		};
	}
}

// ---------------------------------------------------------------------------
// Check and choice

const factorsOf = (x: unknown): [number, number][] => (Array.isArray(x) ? x.map((f) => [Number(f[0]), Number(f[1])] as [number, number]) : []);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const choiceOk = (ch: ChoiceAnswer | undefined, key: string) => {
		if (!ch) return v.push('manca la scelta multipla');
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		const keys = ch.options.map((o) => o.values.join('|'));
		if (new Set(keys).size !== 4) v.push('opzioni ripetute');
		if (keys[ch.correct] !== key || keys.filter((k) => k === key).length !== 1) v.push('opzione corretta sbagliata');
	};
	switch (sample.level) {
		case 1: {
			const n = Number(p.n), d = Number(p.divisor);
			if (n % d !== 0) v.push('il numero non è divisibile per il divisore giusto');
			if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
			const opts = sample.answer.options.map((o) => Number(o.values[0]));
			if (opts.filter((c) => n % c === 0).length !== 1) v.push('non esattamente un divisore tra le opzioni');
			if (!opts.every((c) => CRITERIA.includes(c))) v.push('opzione senza criterio');
			if (!opts.some((c) => isTrap(n, c))) v.push('nessun distrattore trabocchetto');
			choiceOk(sample.answer, String(d));
			break;
		}
		case 2: {
			const n = Number(p.n);
			const fs = factorsOf(p.factors);
			if (factorsAscii(fs) !== factorsAscii(factorize(n))) v.push('scomposizione sbagliata');
			if (n < 48 || n > 1000) v.push('numero fuori intervallo');
			if (sample.answer.kind !== 'expression' || sample.answer.value !== factorsAscii(factorize(n))) v.push('risposta diversa dalla scomposizione');
			if (sample.choice) choiceOk(sample.choice, factorsAscii(factorize(n)));
			break;
		}
		case 3:
		case 4:
		case 6: {
			const xs = (p.numbers as string[]).map(Number);
			const truth = p.which === 'MCD' ? gcdAll(xs) : lcmAll(xs);
			if (sample.answer.kind !== 'number' || sample.answer.value !== String(truth)) v.push('risposta diversa');
			if (sample.level === 3 && (xs.length !== 2 || xs.some((x) => x < 12 || x > 400))) v.push('servono due numeri da 12 a 400');
			if (sample.level === 4 && (xs.length !== 3 || xs.some((x) => x < 12 || x > 300))) v.push('servono tre numeri da 12 a 300');
			if (lcmAll(xs) > 3000) v.push('MCM troppo grande');
			if (sample.choice) choiceOk(sample.choice, String(truth));
			break;
		}
		case 5: {
			const [a, b] = (p.numbers as string[]).map(Number);
			if (sample.answer.kind !== 'number' || sample.answer.value !== String(gcdN(a, b))) v.push('risposta diversa');
			if (euclid(a, b).length < 3) v.push('meno di tre divisioni');
			if (sample.choice) choiceOk(sample.choice, String(gcdN(a, b)));
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params;
	if (sample.level === 2) return factorChoice(Number(p.n), rng);
	const xs = (p.numbers as string[]).map(Number);
	const g = gcdAll(xs), m = lcmAll(xs);
	const sel = selections(xs);
	const truth = sample.level === 5 || p.which === 'MCD' ? g : m;
	const smaller = g > 1 && !isPrime(g) ? g / factorize(g)[0][0] : null; // a common divisor, not the greatest
	let cands: (Opt | null)[];
	if (sample.level === 5) {
		const divs = euclid(xs[0], xs[1]);
		const last = divs[divs.length - 1];
		// the dividend of the last division, the first remainder, the last quotient
		cands = [last.a, divs[0].r, last.q, smaller].map((c) => mistakeOpt(c));
	} else if (sample.level === 6) {
		const [a, b] = xs;
		const s = p.story as Story;
		// the other quantity the story mentions
		const extra = s === 'piastrelle' ? [(a / g) * (b / g)] : s === 'nastri' ? [a / g + b / g] : s === 'sacchetti' ? [b / g, a / g] : [a + b];
		const raw = p.which === 'MCD' ? [m, ...extra, smaller] : [g, a * b, ...extra, sel.commonMax];
		cands = raw.map((c) => mistakeOpt(c, 1_000_000));
	} else {
		const prod = xs.reduce((u, w) => u * w, 1);
		const two = xs.slice(0, 2);
		const raw =
			p.which === 'MCD'
				? [m, sel.commonMax, sel.allMin, xs.length === 3 ? gcdAll(two) : null, smaller]
				: // the formula MCD · MCM = a · b used with three numbers; only the first two numbers
					[g, xs.length === 3 ? prod / g : prod, sel.commonMax, xs.length === 3 ? lcmAll(two) : sel.allMin];
		cands = raw.map((c) => (c !== null && Number.isInteger(c) ? mistakeOpt(c, 1_000_000) : null));
	}
	return makeChoice(rng, numOpt(truth), cands, nearNumbers(rng, truth));
}

export const numeriNaturaliMcmMcd: Generator = {
	id: ID,
	title: 'MCD e MCM in ℕ',
	levels: {
		1: { label: 'Criteri di divisibilità', constraints: ['numero da 100 a 9999', 'quattro divisori tra 2, 3, 4, 5, 9, 10, 11, 25: uno solo divide il numero, almeno un trabocchetto'] },
		2: { label: 'Scomposizione in fattori primi', constraints: ['numero da 48 a 1000 con almeno tre fattori primi, uno almeno al quadrato'] },
		3: { label: 'MCD o MCM di due numeri', constraints: ['numeri da 12 a 400, nessuno multiplo dell’altro', 'MCM fino a 3000'] },
		4: { label: 'MCD o MCM di tre numeri', constraints: ['numeri da 12 a 300, nessuno multiplo di un altro', 'MCM fino a 3000'] },
		5: { label: 'Algoritmo di Euclide', constraints: ['due numeri fino a 999, da tre a sei divisioni'] },
		6: { label: 'Problemi con MCD e MCM', constraints: ['metà problemi di MCD (piastrelle, nastri, sacchetti), metà di MCM (autobus, fari, piscina)'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			let s: Sample;
			switch (level) {
				case 1:
					s = divisibilitySample(rng, rng.seed);
					break;
				case 2:
					s = factorSample(rng, rng.seed);
					break;
				case 3:
				case 4:
					s = mcdMcmSample(rng, level, rng.seed);
					break;
				case 5:
					s = euclidSample(rng, rng.seed);
					break;
				case 6:
					s = problemSample(rng, rng.seed);
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

export default numeriNaturaliMcmMcd;
