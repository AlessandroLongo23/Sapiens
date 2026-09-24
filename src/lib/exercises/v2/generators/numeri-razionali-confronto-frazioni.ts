/**
 * Confronto tra frazioni. Spec: specs/exercises/numeri-razionali-confronto-frazioni.md
 *
 * Six levels in the order of the lesson: equivalent fractions, same denominator, same numerator,
 * different numerators and denominators (common denominator or cross product), negative fractions,
 * ordering. Levels 2-5 ask for the greatest or the least of four fractions, so the four options are
 * the fractions themselves and the wrong ones are exactly what a student picks with the wrong rule;
 * level 6 asks for the ascending order, with the orders produced by the typical mistakes.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, rawFrac, shuffle, weighted } from '../razionali';

export const ID = 'numeri-razionali-confronto-frazioni';

type Ask = 'maggiore' | 'minore';
interface F {
	n: number;
	d: number;
}

const val = (f: F) => q(f.n, f.d);
const tex = (f: F) => rawFrac(f.n, f.d);
const str = (f: F) => `${f.n}/${f.d}`;
const listLatex = (fs: F[]) => fs.map(tex).join(',\\quad ');
const cmp = (a: F, b: F) => val(a).compare(val(b));
const sortAsc = (fs: F[]) => [...fs].sort(cmp);
const chain = (fs: F[]) => fs.map(tex).join(' < ');

function parseF(s: unknown): F | null {
	if (typeof s !== 'string') return null;
	const m = /^(-?\d+)\/(\d+)$/.exec(s);
	return m ? { n: Number(m[1]), d: Number(m[2]) } : null;
}

// ---------------------------------------------------------------------------
// Steps

/** Common denominator: MCM, the equivalent fractions, the numerators in order. */
function commonDenSteps(fs: F[]): string[] {
	const m = fs.reduce((acc, f) => lcm(acc, f.d), 1);
	const dens = [...new Set(fs.map((f) => f.d))];
	const out = [`\\text{MCM}(${dens.join(', ')}) = ${m}`];
	out.push(fs.map((f) => (f.d === m ? `${tex(f)}` : `${tex(f)} = ${rawFrac(f.n * (m / f.d), m)}`)).join(' \\qquad '));
	const nums = sortAsc(fs).map((f) => f.n * (m / f.d));
	out.push(`\\text{Confronta i numeratori: } ${nums.map((x) => `${x}`).join(' < ')}`);
	return out;
}

function answerStep(fs: F[], ask: Ask): string {
	const s = sortAsc(fs);
	const pick = ask === 'maggiore' ? s[s.length - 1] : s[0];
	return `\\text{La frazione ${ask} è } ${tex(pick)}`;
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	fractions: F[];
	ask: Ask | null;
	case: string;
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: ChoiceAnswer;
	extra?: Record<string, unknown>;
}

function pickChoice(rng: Rng, fs: F[], ask: Ask): ChoiceAnswer {
	const s = sortAsc(fs);
	const right = ask === 'maggiore' ? s[s.length - 1] : s[0];
	const opt = (f: F): ChoiceOption => ({ latex: tex(f), values: [val(f).toString()] });
	return buildChoice(rng, opt(right), fs.filter((f) => f !== right).map(opt));
}

/** Four distinct integers from a generator, or null after many tries. */
function distinct4<T>(gen: () => T | null, key: (t: T) => string, n = 4): T[] | null {
	const out: T[] = [];
	const seen = new Set<string>();
	for (let i = 0; i < 400 && out.length < n; i++) {
		const t = gen();
		if (t === null || seen.has(key(t))) continue;
		seen.add(key(t));
		out.push(t);
	}
	return out.length === n ? out : null;
}

function buildEquivalent(rng: Rng): Built | null {
	const b = rng.int(2, 10);
	const a = rng.int(1, b + 3);
	if (a === b || gcd(a, b) !== 1) return null;
	const k = rng.int(2, 6);
	if (k * b > 60) return null;
	const target: F = { n: a, d: b };
	const right = { n: k * a, d: k * b };
	const opt = (n: number, d: number): ChoiceOption => ({ latex: rawFrac(n, d), values: [q(n, d).toString()] });
	const cands = [
		opt(a + k, b + k), // the same number added instead of multiplied
		opt(k * a, b), // only the numerator multiplied
		opt(k * a, (k + 1) * b), // numerator and denominator multiplied by different numbers
		opt(k * a, b + k), // denominator increased by k
		opt(k * b, k * a), // numerator and denominator swapped
		opt(k * a + 1, k * b),
	].filter((o) => !/^-?\d+$/.test(o.latex) && Rational.parse(o.values[0]).den !== 1);
	const answer = buildChoice(rng, opt(right.n, right.d), cands);
	return {
		fractions: [target],
		ask: null,
		case: 'equivalenti',
		prompt: 'Quale frazione è equivalente a quella data?',
		problem: tex(target),
		steps: [
			`\\text{Moltiplica numeratore e denominatore per lo stesso numero, } ${k}\\text{: } ${tex(target)} = \\frac{${a} \\cdot ${k}}{${b} \\cdot ${k}} = ${rawFrac(right.n, right.d)}`,
			`\\text{Controllo con il prodotto in croce: } ${a} \\cdot ${right.d} = ${a * right.d} = ${b} \\cdot ${right.n}`,
		],
		solution: `${tex(target)} = ${rawFrac(right.n, right.d)}`,
		answer,
		extra: { k: String(k), equivalent: `${right.n}/${right.d}` },
	};
}

function buildSameDen(rng: Rng): Built | null {
	const d = rng.int(3, 13);
	const signs = weighted(rng, [
		['positive', 6],
		['negative', 2],
		['miste', 2],
	] as ['positive' | 'negative' | 'miste', number][]);
	const fs = distinct4<F>(() => {
		let n = rng.int(1, 2 * d);
		if (n % d === 0 || gcd(n, d) !== 1) return null;
		if (signs === 'negative' || (signs === 'miste' && rng.int(0, 1))) n = -n;
		return { n, d };
	}, str);
	if (!fs) return null;
	if (signs === 'miste') {
		// At least one of each sign: flip the first fraction when they all came out alike.
		const negs = fs.filter((f) => f.n < 0).length;
		if (negs === 0 || negs === 4) fs[0] = { n: -fs[0].n, d };
		if (new Set(fs.map(str)).size < 4) return null;
	}
	const ask: Ask = rng.int(0, 1) ? 'maggiore' : 'minore';
	const s = sortAsc(fs);
	return {
		fractions: fs,
		ask,
		case: signs,
		prompt: `Qual è la frazione ${ask}?`,
		problem: listLatex(fs),
		steps: [
			`\\text{Il denominatore è lo stesso, } ${d}\\text{: confronta i numeratori, } ${s.map((f) => f.n).join(' < ')}`,
			`${chain(s)}`,
			answerStep(fs, ask),
		],
		solution: chain(s),
		answer: pickChoice(rng, fs, ask),
	};
}

function buildSameNum(rng: Rng): Built | null {
	const n = rng.int(1, 9);
	const fs = distinct4<F>(() => {
		const d = rng.int(2, 15);
		return d !== n && gcd(n, d) === 1 ? { n, d } : null;
	}, str);
	if (!fs) return null;
	const ask: Ask = rng.int(0, 1) ? 'maggiore' : 'minore';
	const s = sortAsc(fs);
	return {
		fractions: fs,
		ask,
		case: ask,
		prompt: `Qual è la frazione ${ask}?`,
		problem: listLatex(fs),
		steps: [
			`\\text{Il numeratore è lo stesso, } ${n}\\text{: è maggiore la frazione con il denominatore minore}`,
			`\\text{Denominatori: } ${[...fs].map((f) => f.d).sort((x, y) => y - x).join(' > ')}\\text{, quindi } ${chain(s)}`,
			answerStep(fs, ask),
		],
		solution: chain(s),
		answer: pickChoice(rng, fs, ask),
	};
}

/** Four positive reduced fractions with different numerators and denominators. */
function positives(rng: Rng, count: number, maxDen = 12): F[] | null {
	const fs = distinct4<F>(
		() => {
			const d = rng.int(2, maxDen);
			const n = rng.int(1, Math.floor(1.6 * d));
			return gcd(n, d) === 1 && n !== d ? { n, d } : null;
		},
		(f) => val(f).toString(),
		count,
	);
	if (!fs) return null;
	if (new Set(fs.map((f) => f.n)).size < count || new Set(fs.map((f) => f.d)).size < count) return null;
	return fs;
}

function buildDifferent(rng: Rng): Built | null {
	const fs = positives(rng, 4);
	if (!fs) return null;
	const m = fs.reduce((acc, f) => lcm(acc, f.d), 1);
	if (m > 120) return null;
	const ask: Ask = rng.int(0, 1) ? 'maggiore' : 'minore';
	const s = sortAsc(fs);
	const right = ask === 'maggiore' ? s[3] : s[0];
	// The rule "compare only the numerators" must give a wrong answer.
	const byNum = [...fs].sort((x, y) => x.n - y.n);
	if ((ask === 'maggiore' ? byNum[3] : byNum[0]) === right) return null;
	return {
		fractions: fs,
		ask,
		case: ask,
		prompt: `Qual è la frazione ${ask}?`,
		problem: listLatex(fs),
		steps: [`\\text{Riduci allo stesso denominatore.}`, ...commonDenSteps(fs), `\\text{Quindi } ${chain(s)}`, answerStep(fs, ask)],
		solution: chain(s),
		answer: pickChoice(rng, fs, ask),
	};
}

function buildNegative(rng: Rng): Built | null {
	const allNeg = rng.int(0, 1) === 1;
	const nNeg = allNeg ? 4 : rng.int(2, 3);
	const base = positives(rng, 4);
	if (!base) return null;
	const fs = shuffle(
		rng,
		base.map((f, i) => (i < nNeg ? { n: -f.n, d: f.d } : f)),
	);
	const m = fs.reduce((acc, f) => lcm(acc, f.d), 1);
	if (m > 120) return null;
	const ask: Ask = allNeg ? (rng.int(0, 1) ? 'maggiore' : 'minore') : 'minore';
	const s = sortAsc(fs);
	const negs = fs.filter((f) => f.n < 0);
	const steps: string[] = [];
	if (allNeg) steps.push(`\\text{Sono tutte negative: la ${ask} è quella ${ask === 'maggiore' ? 'più vicina' : 'più lontana'} da zero}`);
	else steps.push(`\\text{Le frazioni negative sono minori di quelle positive: basta confrontare } ${negs.map(tex).join(',\\ ')}`);
	const considered = allNeg ? fs : negs;
	steps.push(`\\text{Riduci allo stesso denominatore, con il segno al numeratore.}`, ...commonDenSteps(considered));
	steps.push(`\\text{Quindi } ${chain(sortAsc(considered))}`, answerStep(fs, ask));
	return {
		fractions: fs,
		ask,
		case: allNeg ? 'tutte negative' : 'miste',
		prompt: `Qual è la frazione ${ask}?`,
		problem: listLatex(fs),
		steps,
		solution: chain(s),
		answer: pickChoice(rng, fs, ask),
	};
}

function buildOrder(rng: Rng): Built | null {
	const nNeg = rng.pick([2, 2, 3]);
	const base = positives(rng, 4, 10);
	if (!base) return null;
	const fs = shuffle(
		rng,
		base.map((f, i) => (i < nNeg ? { n: -f.n, d: f.d } : f)),
	);
	const m = fs.reduce((acc, f) => lcm(acc, f.d), 1);
	if (m > 120) return null;
	const s = sortAsc(fs);
	const negs = s.filter((f) => f.n < 0), poss = s.filter((f) => f.n > 0);
	// Mistakes: negatives ordered as if they were positive; everything ordered by the numerators.
	const signErr = [...[...negs].reverse(), ...poss];
	const byNum = [...fs].sort((x, y) => x.n - y.n || x.d - y.d);
	const both = [...[...negs].sort((x, y) => -x.n - -y.n || x.d - y.d), ...[...poss].sort((x, y) => x.n - y.n || x.d - y.d)];
	const desc = [...s].reverse();
	const key = (xs: F[]) => xs.map(str).join(' ');
	if (key(byNum) === key(s)) return null;
	const opt = (xs: F[]): ChoiceOption => ({ latex: chain(xs), values: xs.map((f) => val(f).toString()) });
	const answer = buildChoice(rng, opt(s), [opt(signErr), opt(byNum), opt(both), opt(desc)]);
	return {
		fractions: fs,
		ask: null,
		case: `${nNeg} negative`,
		prompt: 'Ordina le frazioni dalla minore alla maggiore.',
		problem: listLatex(fs),
		steps: [`\\text{Riduci tutte le frazioni allo stesso denominatore, con il segno al numeratore.}`, ...commonDenSteps(fs), `\\text{Quindi } ${chain(s)}`],
		solution: chain(s),
		answer,
	};
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildEquivalent(rng);
		case 2:
			return buildSameDen(rng);
		case 3:
			return buildSameNum(rng);
		case 4:
			return buildDifferent(rng);
		case 5:
			return buildNegative(rng);
		case 6:
			return buildOrder(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function check(sample: Sample): string[] {
	const v: string[] = [];
	const fs = (Array.isArray(sample.params.fractions) ? sample.params.fractions : []).map(parseF);
	if (fs.length === 0 || fs.some((f) => !f || f.d < 1)) return ['params.fractions non validi'];
	const F = fs as F[];
	if (sample.problem !== listLatex(F)) v.push('il testo non corrisponde a params.fractions');
	if (F.some((f) => gcd(f.n, f.d) !== 1 || f.d === 1)) v.push('frazione non ridotta o intera');
	const ans = sample.answer;
	if (ans.kind !== 'choice' || ans.options.length !== 4) return [...v, 'servono 4 opzioni a scelta multipla'];
	const keys = ans.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== 4) v.push('opzioni non distinte');
	const lvl = sample.level;
	const ask = sample.params.ask as Ask | null;
	const s = sortAsc(F);
	const nums = new Set(F.map((f) => f.n)), dens = new Set(F.map((f) => f.d));
	if (lvl === 1) {
		const t = F[0];
		const right = ans.options[ans.correct];
		if (!Rational.parse(right.values[0]).equals(val(t))) v.push('opzione corretta non equivalente');
		if (right.latex === tex(t)) v.push('l\'opzione corretta è la frazione data');
		if (ans.options.filter((o) => Rational.parse(o.values[0]).equals(val(t))).length !== 1) v.push('più di una opzione equivalente');
		if (t.n < 1 || t.d > 10) v.push('frazione data fuori intervallo');
	} else if (lvl >= 2 && lvl <= 5) {
		if (F.length !== 4 || new Set(F.map((f) => val(f).toString())).size !== 4) v.push('servono 4 frazioni diverse');
		const right = ask === 'maggiore' ? s[3] : s[0];
		if (ans.options[ans.correct]?.values[0] !== val(right).toString()) v.push('opzione corretta sbagliata');
		const optSet = [...keys].sort().join(',');
		if (optSet !== F.map((f) => val(f).toString()).sort().join(',')) v.push('le opzioni non sono le frazioni date');
		if (lvl === 2 && dens.size !== 1) v.push('serve lo stesso denominatore');
		if (lvl === 3 && (nums.size !== 1 || F.some((f) => f.n < 1))) v.push('serve lo stesso numeratore positivo');
		if (lvl === 4 && (nums.size !== 4 || dens.size !== 4 || F.some((f) => f.n < 1))) v.push('servono frazioni positive con numeratori e denominatori diversi');
		if (lvl === 5) {
			const negs = F.filter((f) => f.n < 0).length;
			if (negs < 2) v.push('servono almeno due frazioni negative');
			if (negs < 4 && ask !== 'minore') v.push('con frazioni miste si chiede la minore');
		}
		if (!sample.prompt.includes(ask ?? '?')) v.push('la domanda non dice maggiore o minore');
	} else if (lvl === 6) {
		const right = ans.options[ans.correct];
		if (right.values.join('|') !== s.map((f) => val(f).toString()).join('|')) v.push('ordine corretto sbagliato');
		for (const o of ans.options) if ([...o.values].sort().join('|') !== [...s.map((f) => val(f).toString())].sort().join('|')) v.push('opzione che non è un ordinamento delle frazioni');
		if (F.filter((f) => f.n < 0).length < 2) v.push('servono almeno due frazioni negative');
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

function toChoice(sample: Sample): ChoiceAnswer {
	return sample.answer as ChoiceAnswer;
}

export const numeriRazionaliConfrontoFrazioni: Generator = {
	id: ID,
	title: 'Confronto tra frazioni',
	levels: {
		1: { label: 'Frazioni equivalenti', constraints: ['frazione ridotta a/b con b fino a 10', 'la risposta giusta è a·k/b·k con k da 2 a 6'] },
		2: { label: 'Stesso denominatore', constraints: ['quattro frazioni ridotte con lo stesso denominatore', 'circa 4 su 10 con numeratori negativi'] },
		3: { label: 'Stesso numeratore', constraints: ['quattro frazioni positive con lo stesso numeratore'] },
		4: { label: 'Denominatore comune', constraints: ['quattro frazioni positive con numeratori e denominatori tutti diversi', 'confrontare solo i numeratori dà la risposta sbagliata'] },
		5: { label: 'Frazioni negative', constraints: ['metà tutte negative, metà miste con almeno due negative', 'con le miste si chiede la minore'] },
		6: { label: 'Ordinare più frazioni', constraints: ['quattro frazioni, due o tre negative', 'ordine crescente'] },
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
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params: { fractions: b.fractions.map(str), ask: b.ask, case: b.case, ...(b.extra ?? {}) },
			};
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRazionaliConfrontoFrazioni;
