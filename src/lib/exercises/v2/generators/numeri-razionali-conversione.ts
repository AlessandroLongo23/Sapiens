/**
 * Numeri decimali e frazioni. Spec: specs/exercises/numeri-razionali-conversione.md
 *
 * Five levels in the order of the lesson: limited decimal to fraction, simple periodic to
 * fraction, mixed periodic to fraction, predicting the kind of decimal from the denominator,
 * fraction to decimal. The decimal is built digit by digit (levels 1-3) or the fraction is chosen
 * from a denominator of the right kind (levels 4-5); the value is always exact.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import {
	type Decimal,
	buildChoice,
	decimalLatex,
	decimalValue,
	divisionSteps,
	factorLatex,
	primeFactors,
	ratOption,
	toDecimal,
	weighted,
} from '../razionali';

export const ID = 'numeri-razionali-conversione';

export type Kind = 'intero' | 'limitato' | 'periodico semplice' | 'periodico misto';
export const KINDS: Kind[] = ['intero', 'limitato', 'periodico semplice', 'periodico misto'];
const KIND_LATEX: Record<Kind, string> = {
	intero: '\\text{un numero intero}',
	limitato: '\\text{un decimale limitato}',
	'periodico semplice': '\\text{un decimale periodico semplice}',
	'periodico misto': '\\text{un decimale periodico misto}',
};

// Denominators (reduced) for levels 4 and 5.
const DEN_LIMITATO = [2, 4, 5, 8, 10, 16, 20, 25, 40, 50];
const DEN_SEMPLICE = [3, 7, 9, 11, 13, 21, 27, 33, 37];
const DEN_MISTO = [6, 12, 14, 15, 18, 22, 24, 30, 35, 36, 44, 45, 60, 66, 75, 90];
const L5_LIMITATO = [2, 4, 5, 8, 16, 20, 25, 40, 50, 125];
const L5_SEMPLICE = [3, 9, 11, 27, 33, 37];
const L5_MISTO = [6, 12, 15, 18, 22, 24, 30, 36, 44, 45, 60, 66, 75, 90];

// ---------------------------------------------------------------------------
// Classification and small helpers

export function kindOf(r: Rational): Kind {
	if (r.isInteger()) return 'intero';
	const ps = primeFactors(r.den).map(([p]) => p);
	const other = ps.some((p) => p !== 2 && p !== 5);
	if (!other) return 'limitato';
	return ps.some((p) => p === 2 || p === 5) ? 'periodico misto' : 'periodico semplice';
}

const digit = (rng: Rng) => String(rng.int(0, 9));
const digits = (rng: Rng, n: number) => Array.from({ length: n }, () => digit(rng)).join('');

/** A period is minimal when it is not a shorter block repeated ("33", "1212"). */
export function minimalPeriod(p: string): boolean {
	for (let t = 1; t < p.length; t++) if (p.length % t === 0 && p.slice(0, t).repeat(p.length / t) === p) return false;
	return true;
}

const allSame = (s: string, c: string) => s.length > 0 && [...s].every((x) => x === c);
const ones = (k: number) => ['', 'una cifra', 'due cifre', 'tre cifre'][k] ?? `${k} cifre`;
const nines = (p: number, a: number) => '9'.repeat(p) + '0'.repeat(a);
/** Signed fraction n/d as written, not reduced. */
const sfrac = (neg: boolean, n: string | number, d: string | number) => `${neg ? '-' : ''}\\frac{${n}}{${d}}`;

function reduceStep(neg: boolean, n: number, d: number): string {
	const g = gcd(n, d);
	const r = q(neg ? -n : n, d);
	if (g === 1) return `\\text{La frazione } ${sfrac(neg, n, d)} \\text{ è già ridotta ai minimi termini}`;
	return `\\text{Riduci dividendo per } \\text{MCD}(${n}, ${d}) = ${g}\\text{: } ${sfrac(neg, n, d)} = ${sfrac(neg, `${n} : ${g}`, `${d} : ${g}`)} = ${r.toLatex()}`;
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	params: Record<string, unknown>;
	problem: string;
	prompt: string;
	steps: string[];
	solution: string;
	answer: NumberAnswer | ChoiceAnswer;
}

const decParams = (d: Decimal) => ({ neg: d.neg, int: d.int, ante: d.ante, period: d.period });

function buildLimited(rng: Rng): Built | null {
	const k = rng.pick([1, 2, 2, 3, 3]);
	const intPart = rng.next() < 0.5 ? 0 : rng.int(1, 9);
	let dec = digits(rng, k - 1) + rng.pick(['2', '4', '5', '6', '8']);
	if (k >= 2 && rng.next() < 0.3) dec = '0' + dec.slice(1);
	const d: Decimal = { neg: rng.next() < 0.2, int: String(intPart), ante: dec, period: '' };
	const N = Number(d.int + d.ante), den = 10 ** k;
	const value = decimalValue(d);
	const where = ['', 'decimi', 'centesimi', 'millesimi'][k];
	const steps = [
		`\\text{${k === 1 ? 'Una cifra' : ones(k).replace(/^./, (c) => c.toUpperCase())} dopo la virgola: sono ${where}, quindi il denominatore è } ${den}\\text{: } ${decimalLatex(d)} = ${sfrac(d.neg, N, den)}`,
		reduceStep(d.neg, N, den),
	];
	return {
		params: { decimal: decParams(d), value: value.toString() },
		problem: decimalLatex(d),
		prompt: 'Scrivi il numero decimale come frazione ridotta ai minimi termini.',
		steps,
		solution: `${decimalLatex(d)} = ${value.toLatex()}`,
		answer: { kind: 'number', value: value.toString() },
	};
}

function buildPeriodic(rng: Rng, mixed: boolean): Built | null {
	const intPart = rng.next() < 0.5 ? 0 : rng.int(1, 9);
	let a = 0, p: number;
	if (mixed) {
		a = rng.int(1, 2);
		p = a === 2 ? 1 : rng.int(1, 2);
	} else {
		p = weighted(rng, [
			[1, 5],
			[2, 4],
			[3, 1],
		]);
	}
	const d: Decimal = { neg: false, int: String(intPart), ante: digits(rng, a), period: digits(rng, p) };
	if (!minimalPeriod(d.period) || allSame(d.period, '9') || allSame(d.period, '0')) return null;
	if (mixed && d.ante[a - 1] === d.period[p - 1]) return null;
	const N = Number(d.int + d.ante + d.period), M = Number(d.int + d.ante);
	const den = nines(p, a);
	const value = decimalValue(d);
	const before = a === 0 ? (intPart === 0 ? `\\text{c'è } 0` : `\\text{c'è la parte intera } ${M}`) : `\\text{c'è } ${M}`;
	const denText = a === 0 ? `\\text{Il periodo ha ${ones(p)}: al denominatore } ${den}` : `\\text{Il periodo ha ${ones(p)} e l'antiperiodo ${ones(a)}: al denominatore } ${den}`;
	const steps = [
		`\\text{Il numero senza virgola e senza barra è } ${N}\\text{; prima del periodo } ${before}`,
		denText,
		`${decimalLatex(d)} = \\frac{${N} - ${M}}{${den}} = \\frac{${N - M}}{${den}}`,
		reduceStep(false, N - M, Number(den)),
	];
	return {
		params: { decimal: decParams(d), value: value.toString() },
		problem: decimalLatex(d),
		prompt: 'Scrivi la frazione generatrice, ridotta ai minimi termini.',
		steps,
		solution: `${decimalLatex(d)} = ${value.toLatex()}`,
		answer: { kind: 'number', value: value.toString() },
	};
}

function kindSteps(r: Rational, kind: Kind): string[] {
	const out: string[] = [];
	if (kind === 'intero') {
		out.push(`\\text{Il denominatore è } 1\\text{: la frazione è il numero intero } ${r.num}`);
		return out;
	}
	const fs = primeFactors(r.den);
	out.push(fs.length === 1 && fs[0][1] === 1 ? `\\text{Il denominatore } ${r.den} \\text{ è primo}` : `\\text{Scomponi il denominatore: } ${r.den} = ${factorLatex(r.den)}`);
	const others = fs.map(([p]) => p).filter((p) => p !== 2 && p !== 5);
	const twoFive = fs.map(([p]) => p).filter((p) => p === 2 || p === 5);
	const list = (xs: number[]) => (xs.length === 1 ? `${xs[0]}` : `${xs.slice(0, -1).join(', ')} \\text{ e } ${xs[xs.length - 1]}`);
	if (kind === 'limitato') out.push(`\\text{Nel denominatore non ci sono fattori diversi da 2 e 5: il decimale è limitato}`);
	else if (kind === 'periodico semplice') out.push(`\\text{Non ci sono né 2 né 5, ${others.length === 1 ? "c'è il fattore" : 'ci sono i fattori'} } ${list(others)}\\text{: il decimale è periodico semplice}`);
	else out.push(`\\text{${others.length === 1 ? "C'è il fattore" : 'Ci sono i fattori'} } ${list(others)} \\text{ insieme a } ${list(twoFive)}\\text{: il decimale è periodico misto}`);
	return out;
}

function buildPredict(rng: Rng): Built | null {
	const kind = weighted<Kind>(rng, [
		['intero', 1],
		['limitato', 3],
		['periodico semplice', 3],
		['periodico misto', 3],
	]);
	// The kind is drawn once and the numbers are redrawn until they fit, so rejections do not skew the shares.
	let n = 0, d = 0, k = 1;
	for (let tries = 0; ; tries++) {
		if (tries > 1000) return null;
		const den = kind === 'intero' ? 1 : rng.pick(kind === 'limitato' ? DEN_LIMITATO : kind === 'periodico semplice' ? DEN_SEMPLICE : DEN_MISTO);
		const num = kind === 'intero' ? rng.int(2, 12) : rng.int(1, 2 * den);
		if (gcd(num, den) !== 1) continue;
		k = 1;
		if (kind === 'intero') k = rng.int(2, 9);
		else if (rng.next() < 0.5) {
			// A factor that hides the true kind: 21/30 looks periodic, 2/6 looks mixed.
			k = kind === 'limitato' ? rng.pick([3, 6, 7, 9]) : kind === 'periodico semplice' ? rng.pick([2, 4, 5, 10]) : rng.pick([2, 3, 5]);
		}
		n = num * k;
		d = den * k;
		if (d <= 120 && n <= 200 && d >= 2) break;
	}
	const r = q(n, d);
	if (kindOf(r) !== kind) throw new Error(`${ID}: classification mismatch`);
	const steps: string[] = [];
	if (k > 1) steps.push(`\\text{Prima riduci ai minimi termini, dividendo per } \\text{MCD}(${n}, ${d}) = ${k}\\text{: } \\frac{${n}}{${d}} = ${r.toLatex()}`);
	else steps.push(`\\text{La frazione } \\frac{${n}}{${d}} \\text{ è già ridotta ai minimi termini}`);
	steps.push(...kindSteps(r, kind));
	if (kind !== 'intero') {
		const dec = toDecimal(r, 8, 8);
		if (dec) steps.push(`\\text{Infatti } ${r.toLatex()} = ${decimalLatex(dec)}`);
	}
	const options: ChoiceOption[] = KINDS.map((kk) => ({ latex: KIND_LATEX[kk], values: [kk] }));
	return {
		params: { num: String(n), den: String(d), case: kind },
		problem: `\\frac{${n}}{${d}}`,
		prompt: 'Senza fare la divisione, stabilisci che numero dà la frazione.',
		steps,
		solution: `\\frac{${n}}{${d}} \\text{ dà ${KIND_LATEX[kind].slice(6, -1)}}`,
		answer: { kind: 'choice', options, correct: KINDS.indexOf(kind) },
	};
}

function buildToDecimal(rng: Rng): Built | null {
	const kind = weighted<Kind>(rng, [
		['limitato', 4],
		['periodico semplice', 3],
		['periodico misto', 3],
	]);
	let num = 0, den = 0, r = q(0), dec: Decimal | null = null;
	for (let tries = 0; ; tries++) {
		if (tries > 1000) return null;
		den = rng.pick(kind === 'limitato' ? L5_LIMITATO : kind === 'periodico semplice' ? L5_SEMPLICE : L5_MISTO);
		num = rng.int(1, 2 * den);
		if (gcd(num, den) !== 1) continue;
		r = q(num, den);
		dec = toDecimal(r, 4, 3);
		if (dec && !(dec.period && dec.ante.length + dec.period.length > 4)) break;
	}
	if (!dec) return null;
	if (kindOf(r) !== kind) throw new Error(`${ID}: classification mismatch`);
	const I = Math.floor(num / den);
	const div = divisionSteps(num, den);
	const steps: string[] = [];
	steps.push(...kindSteps(r, kind).map((s) => s.replace(/: il decimale è/, ': ci si aspetta un decimale')));
	steps.push(`\\text{Dividi } ${num} : ${den}\\text{: la parte intera è } ${I}${I > 0 ? ` \\text{ con resto } ${num % den}` : ''}`);
	steps.push(`${div.lines.join(',\\ ')}`);
	if (div.repeated === null) steps.push(`\\text{Il resto è } 0 \\text{ e la divisione finisce: } ${r.toLatex()} = ${decimalLatex(dec)}`);
	else steps.push(`\\text{Il resto } ${div.repeated} \\text{ si è già presentato: da qui le cifre si ripetono, quindi } ${r.toLatex()} = ${decimalLatex(dec)}`);
	return {
		params: { num: String(num), den: String(den), decimal: decParams(dec), case: kind },
		problem: r.toLatex(),
		prompt: 'Scrivi la frazione come numero decimale.',
		steps,
		solution: `${r.toLatex()} = ${decimalLatex(dec)}`,
		answer: { kind: 'number', value: r.toString() },
	};
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildLimited(rng);
		case 2:
			return buildPeriodic(rng, false);
		case 3:
			return buildPeriodic(rng, true);
		case 4:
			return buildPredict(rng);
		case 5:
			return buildToDecimal(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function parseDecimal(x: unknown): Decimal | null {
	if (!x || typeof x !== 'object') return null;
	const o = x as Record<string, unknown>;
	if (typeof o.neg !== 'boolean' || ![o.int, o.ante, o.period].every((s) => typeof s === 'string' && /^\d*$/.test(s as string))) return null;
	return { neg: o.neg, int: o.int as string, ante: o.ante as string, period: o.period as string };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const ans = sample.answer;
	if (/\d\.\d/.test(sample.problem) || sample.steps.some((s) => /\d\.\d/.test(s))) v.push('punto decimale invece della virgola');
	const lvl = sample.level;
	if (lvl <= 3) {
		const d = parseDecimal(sample.params.decimal);
		if (!d) return ['params.decimal non valido'];
		if (sample.problem !== decimalLatex(d)) v.push('il testo non corrisponde a params.decimal');
		const value = decimalValue(d);
		if (ans.kind !== 'number' || ans.value !== value.toString()) v.push('risposta diversa dal valore del decimale');
		const a = d.ante.length, p = d.period.length;
		if (!/^\d$/.test(d.int)) v.push('parte intera fuori da 0-9');
		if (lvl === 1) {
			if (p !== 0 || a < 1 || a > 3 || d.ante.endsWith('0')) v.push('serve un decimale limitato con 1-3 cifre, l\'ultima diversa da 0');
			if (value.den === 10 ** a) v.push('la frazione non si riduce');
		} else {
			if (d.neg) v.push('periodico negativo');
			if (!minimalPeriod(d.period) || allSame(d.period, '9') || allSame(d.period, '0')) v.push('periodo non valido');
			if (lvl === 2 && (a !== 0 || p < 1 || p > 3)) v.push('serve un periodico semplice con periodo di 1-3 cifre');
			if (lvl === 3) {
				if (a < 1 || a > 2 || p < 1 || p > 2 || a + p > 3) v.push('serve un periodico misto con antiperiodo e periodo di 1-2 cifre, al massimo 3 decimali');
				if (d.ante[a - 1] === d.period[p - 1]) v.push('antiperiodo non minimo');
			}
		}
	} else if (lvl === 4) {
		const n = Number(sample.params.num), d = Number(sample.params.den);
		if (!Number.isInteger(n) || !Number.isInteger(d) || n < 1 || d < 2 || d > 120 || n > 200) return ['params.num/den non validi'];
		const kind = kindOf(q(n, d));
		if (sample.params.case !== kind) v.push('params.case sbagliato');
		if (ans.kind !== 'choice' || ans.options[ans.correct]?.values[0] !== kind) v.push('opzione corretta sbagliata');
		if (ans.kind === 'choice' && ans.options.length !== 4) v.push('servono 4 opzioni');
	} else if (lvl === 5) {
		const n = Number(sample.params.num), d = Number(sample.params.den);
		const dec = parseDecimal(sample.params.decimal);
		if (!dec || gcd(n, d) !== 1) return ['params non validi o frazione non ridotta'];
		const r = q(n, d);
		if (!decimalValue(dec).equals(r)) v.push('il decimale non vale la frazione');
		const canon = toDecimal(r, 4, 3);
		if (!canon || decimalLatex(canon) !== decimalLatex(dec)) v.push('decimale non in forma canonica o troppo lungo');
		if (ans.kind !== 'number' || ans.value !== r.toString()) v.push('risposta diversa dalla frazione');
		if (sample.params.case !== kindOf(r) || kindOf(r) === 'intero') v.push('params.case sbagliato');
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

function decOption(r: Rational): ChoiceOption | null {
	const d = toDecimal(r, 4, 6);
	return d ? { latex: decimalLatex(d), values: [r.toString()] } : null;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const lvl = sample.level;
	const cands: Rational[] = [];
	const safe = (f: () => Rational) => {
		try {
			cands.push(f());
		} catch {
			/* division by zero: skip */
		}
	};
	if (lvl <= 3) {
		const d = parseDecimal(sample.params.decimal)!;
		const value = decimalValue(d);
		const sg = d.neg ? -1 : 1;
		const a = d.ante.length, p = d.period.length;
		const N = Number(d.int + d.ante + d.period), M = Number(d.int + d.ante), I = Number(d.int);
		if (lvl === 1) {
			if (a >= 2) safe(() => q(sg * N, 10 ** (a - 1))); // one zero too few
			if (I !== 0) safe(() => q(sg * Number(d.ante), 10 ** a)); // integer part forgotten
			safe(() => q(sg * N, 10 ** (a + 1))); // one zero too many
			if (d.neg) cands.push(value.neg()); // sign lost
			const g = gcd(N, 10 ** a);
			safe(() => q(sg * (N / g), 10 ** a)); // only the numerator divided by the MCD
			safe(() => q(sg * N, 10 ** a / g)); // only the denominator divided by the MCD
		} else if (lvl === 2) {
			if (I !== 0) safe(() => q(N, Number(nines(p, 0)))); // integer part not subtracted
			safe(() => q(N, 10 ** p)); // read as a limited decimal
			if (I !== 0) safe(() => q(Number(d.period), Number(nines(p, 0)))); // integer part dropped
			safe(() => q(N - I, Number(nines(p + 1, 0)))); // one 9 too many
		} else {
			safe(() => q(N - M, Number(nines(p, 0)))); // zeros of the antiperiod forgotten
			safe(() => q(N - I, Number(nines(a + p, 0)))); // everything after the comma taken as period
			if (a !== p) safe(() => q(N - M, Number(nines(a, p)))); // nines and zeros swapped
			safe(() => q(N, Number(nines(p, a)))); // nothing subtracted
			safe(() => q(N, 10 ** (a + p))); // read as a limited decimal
		}
		const fallback = (i: number) => {
			const k = Math.floor(i / 2) + 1;
			return ratOption(q(value.num + (i % 2 ? -k : k), value.den));
		};
		return buildChoice(rng, ratOption(value), cands.filter((c) => !c.isZero()).map(ratOption), fallback);
	}
	// Level 5: options are decimals.
	const r = q(Number(sample.params.num), Number(sample.params.den));
	const d = parseDecimal(sample.params.decimal)!;
	const I = d.int;
	const opts: (ChoiceOption | null)[] = [];
	const fromDec = (x: Decimal) => {
		try {
			opts.push(decOption(decimalValue(x)));
		} catch {
			/* skip */
		}
	};
	if (d.period) {
		if (d.ante) fromDec({ neg: false, int: I, ante: '', period: d.ante + d.period }); // bar over every decimal
		fromDec({ neg: false, int: I, ante: d.ante + d.period, period: '' }); // bar forgotten
		if (d.ante) fromDec({ neg: false, int: I, ante: d.ante.slice(0, -1), period: d.ante.slice(-1) + d.period }); // bar one digit too early
		else fromDec({ neg: false, int: I, ante: '0', period: d.period }); // an extra zero after the comma
	} else {
		fromDec({ neg: false, int: I, ante: '', period: d.ante }); // limited read as periodic
		opts.push(decOption(r.mul(q(1, 10)))); // comma one place off
		opts.push(decOption(r.mul(q(10))));
	}
	const inv = toDecimal(q(r.den, r.num), 4, 3);
	if (inv) opts.push({ latex: decimalLatex(inv), values: [q(r.den, r.num).toString()] }); // division the wrong way round
	// Filler, if needed: the same decimal with its last digit changed, so it still looks like one.
	const fallback = (i: number): ChoiceOption | null => {
		const k = i % 2 ? -(Math.floor(i / 2) + 1) : Math.floor(i / 2) + 1;
		const bump = (s: string) => s.slice(0, -1) + String((Number(s.slice(-1)) + k + 20) % 10);
		const x: Decimal = d.period ? { ...d, period: bump(d.period) } : { ...d, ante: bump(d.ante) };
		if (x.period && (!minimalPeriod(x.period) || allSame(x.period, '9') || allSame(x.period, '0'))) return null;
		const val = decimalValue(x);
		return val.sign() > 0 ? decOption(val) : null;
	};
	return buildChoice(rng, decOption(r)!, opts, fallback);
}

// ---------------------------------------------------------------------------

export const numeriRazionaliConversione: Generator = {
	id: ID,
	title: 'Numeri decimali e frazioni',
	levels: {
		1: { label: 'Da decimale limitato a frazione', constraints: ['da 1 a 3 cifre dopo la virgola, l\'ultima diversa da 0', 'parte intera da 0 a 9, a volte negativo', 'la frazione si riduce'] },
		2: { label: 'Da periodico semplice a frazione', constraints: ['periodo di 1-3 cifre, minimo, mai 9', 'parte intera da 0 a 9'] },
		3: { label: 'Da periodico misto a frazione', constraints: ['antiperiodo e periodo di 1-2 cifre, al massimo 3 decimali', 'antiperiodo minimo'] },
		4: { label: 'Limitato o periodico', constraints: ['frazione anche non ridotta, denominatore fino a 120', 'circa 1 su 10 intero, 3 limitati, 3 periodici semplici, 3 misti'] },
		5: { label: 'Da frazione a decimale', constraints: ['frazione ridotta', 'limitato fino a 4 decimali; periodico con periodo fino a 3 cifre e al massimo 4 decimali scritti'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRazionaliConversione;
