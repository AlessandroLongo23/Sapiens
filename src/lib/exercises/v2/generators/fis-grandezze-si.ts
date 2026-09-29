/**
 * Grandezze fisiche e unità del Sistema Internazionale. Spec: specs/exercises/fis-grandezze-si.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/02-fis-grandezze-si.md), all multiple choice with the
 * unit in the option: the SI units, the correct writing of a measure and the value of a prefix; one prefix to or
 * from the unit; scientific notation; changing between two prefixes, answer in scientific notation; hours, minutes
 * and seconds and km/h to m/s; the order of magnitude. Distractors are the mistakes the lesson warns about: the
 * exponent with the wrong sign, one step too many or too few, the zeros counted instead of the places, 1,5 h read
 * as 1 h 50 min, 3,6 used the wrong way.
 *
 * Numbers are built backwards from the answer: a mantissa with one to three significant digits and an exponent.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { Rational, q } from '../rational';
import { BANNED, choose, dec, decimals, pow10, pow10Tex, pw, sci, sciParts, sciRaw, t, unitTex, withUnit, type R } from '../fis-grandezze';

export const ID = 'fis-grandezze-si';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

/** A mantissa with 1 to 3 significant digits, from 1 to 9,99 (never ending in 0 after the comma). */
function mantissa(rng: Rng, sig = rng.int(1, 3)): R {
	for (;;) {
		const x = sig === 1 ? rng.int(1, 9) : sig === 2 ? rng.int(10, 99) : rng.int(100, 999);
		if (sig > 1 && x % 10 === 0) continue;
		return q(x, 10 ** (sig - 1));
	}
}

const valOpt = (r: R, u: string, form: 'dec' | 'sci' = 'dec'): ChoiceOption => ({ latex: withUnit(form === 'dec' ? dec(r) : sci(r), u), values: [r.toString()] });
const ok = (r: R, maxDec = 6) => r.sign() > 0 && decimals(r) <= maxDec && r.compare(q(1e10)) < 0;

// ---------------------------------------------------------------------------
// Level 1: units, writing, prefixes

export const SI: [string, string, string, string][] = [
	['la lunghezza', 'metro', 'm', 'il '],
	['la massa', 'chilogrammo', 'kg', 'il '],
	["l'intervallo di tempo", 'secondo', 's', 'il '],
	['la temperatura', 'kelvin', 'K', 'il '],
	["l'intensità di corrente elettrica", 'ampere', 'A', "l'"],
	['la quantità di sostanza', 'mole', 'mol', 'la '],
	["l'intensità luminosa", 'candela', 'cd', 'la '],
];
const WRONG_UNITS: Record<string, [string, string][]> = {
	m: [['centimetro', 'cm'], ['chilometro', 'km'], ['litro', 'L'], ['secondo', 's']],
	kg: [['grammo', 'g'], ['newton', 'N'], ['litro', 'L'], ['tonnellata', 't']],
	s: [['minuto', 'min'], ['ora', 'h'], ['metro', 'm'], ['kelvin', 'K']],
	K: [['grado Celsius', '°C'], ['chilogrammo', 'kg'], ['candela', 'cd'], ['ampere', 'A']],
	A: [['kelvin', 'K'], ['mole', 'mol'], ['newton', 'N'], ['candela', 'cd']],
	mol: [['chilogrammo', 'kg'], ['candela', 'cd'], ['litro', 'L'], ['grammo', 'g']],
	cd: [['kelvin', 'K'], ['mole', 'mol'], ['ampere', 'A'], ['metro', 'm']],
};
/** Wrong writings of a symbol, as the lesson lists them. */
export const WRONG_WRITING: Record<string, string[]> = {
	kg: ['Kg', 'kgs', 'kg.', 'KG'],
	m: ['mt', 'm.', 'mtr', 'mt.'],
	s: ['sec', 's.', 'sec.', 'secs'],
	g: ['gr', 'gr.', 'grs', 'g.'],
	km: ['Km', 'KM', 'km.', 'kms'],
	cm: ['Cm', 'cm.', 'cms', 'CM'],
};
export const PREFIXES: [string, string, number][] = [
	['giga', 'G', 9],
	['mega', 'M', 6],
	['kilo', 'k', 3],
	['etto', 'h', 2],
	['deci', 'd', -1],
	['centi', 'c', -2],
	['milli', 'm', -3],
	['micro', 'μ', -6],
	['nano', 'n', -9],
];

function level1(rng: Rng): Built {
	const kind = rng.pick(['unita', 'scrittura', 'prefisso'] as const);
	if (kind === 'unita') {
		const [qty, name, sym, art] = rng.pick(SI);
		const o = (n: string, s: string) => ({ latex: t(`${n} (${s})`), values: [s] });
		return {
			prompt: "Scegli l'unità di misura.",
			problem: textBlock(`Qual è l'unità di misura del Sistema Internazionale per ${qty}?`),
			solution: t(`${name} (${sym})`),
			steps: [textBlock(`Nel SI l'unità di misura per ${qty} è ${art}${name}, simbolo ${sym}.`)],
			choice: choose(
				rng,
				o(name, sym),
				shuffle(rng, WRONG_UNITS[sym]).map(([n, s]) => o(n, s)),
			),
			params: { case: kind, qty },
		};
	}
	if (kind === 'scrittura') {
		const sym = rng.pick(Object.keys(WRONG_WRITING));
		const x = rng.next() < 0.7 ? String(rng.int(2, 95)) : `${rng.int(1, 9)},${rng.int(1, 9)}`;
		const right = { latex: t(`${x} ${sym}`), values: [sym] };
		const others = shuffle(rng, WRONG_WRITING[sym]).map((w) => ({ latex: t(`${x} ${w}`), values: [w] }));
		return {
			prompt: 'Scegli la scrittura corretta.',
			problem: textBlock('Quale di queste misure è scritta correttamente?'),
			solution: right.latex,
			steps: [textBlock(`Il simbolo si scrive ${sym}: niente punto, niente plurale, e le maiuscole e le minuscole non si cambiano.`)],
			choice: choose(rng, right, others),
			params: { case: kind, sym, x },
		};
	}
	const [name, sym, e] = rng.pick(PREFIXES);
	const o = (n: number) => ({ latex: pow10Tex(n), values: [String(n)] });
	const cands = [-e, e + 3, e - 3, e + 1, e - 1, e + 6, e - 6].filter((n) => n !== e && n !== 0 && Math.abs(n) <= 12);
	return {
		prompt: 'Scegli il valore del prefisso.',
		problem: textBlock(`Quanto vale il prefisso ${name}, di simbolo $${sym === 'μ' ? '\\mu' : `\\text{${sym}}`}$?`),
		solution: pow10Tex(e),
		steps: [`${t(`Il prefisso ${name} moltiplica l'unità per `)} ${pow10Tex(e)}`],
		choice: choose(
			rng,
			o(e),
			cands.map(o),
		),
		params: { case: kind, prefix: name },
	};
}

// ---------------------------------------------------------------------------
// Level 2: one prefix, to the unit or from it

const FAMILIES: { unit: string; name: string; prefixes: string[] }[] = [
	{ unit: 'm', name: 'metri', prefixes: ['k', 'd', 'c', 'm'] },
	{ unit: 'g', name: 'grammi', prefixes: ['k', 'h', 'm'] },
	{ unit: 's', name: 'secondi', prefixes: ['m'] },
	{ unit: 'L', name: 'litri', prefixes: ['h', 'd', 'c', 'm'] },
];
const EXP: Record<string, number> = { G: 9, M: 6, k: 3, h: 2, da: 1, '': 0, d: -1, c: -2, m: -3, μ: -6, n: -9 };

function level2(rng: Rng): Built {
	for (;;) {
		const F = rng.pick(FAMILIES);
		const p = rng.pick(F.prefixes);
		const e = EXP[p];
		const toUnit = rng.next() < 0.5;
		const x = mantissa(rng).mul(pow10(rng.int(-2, 2)));
		const from = toUnit ? p + F.unit : F.unit;
		const to = toUnit ? F.unit : p + F.unit;
		const k = toUnit ? e : -e; // the answer is x · 10^k
		const ans = x.mul(pow10(k));
		if (!ok(x, 3) || !ok(ans, 4) || ans.compare(q(1000000)) > 0) continue;
		const wrong = [x.mul(pow10(-k)), x.mul(pow10(k + 1)), x.mul(pow10(k - 1)), x.mul(pow10(k + 2)), x.mul(pow10(k - 2))].filter((r) => ok(r, 6));
		if (wrong.length < 3) continue;
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi ${pw(dec(x), from)} in $${unitTex(to)}$.`),
			solution: withUnit(dec(ans), to),
			steps: [
				`1\\,${unitTex(p + F.unit)} = ${pow10Tex(e)}\\,${unitTex(F.unit)}`,
				`${withUnit(dec(x), from)} = ${dec(x)} \\cdot ${pow10Tex(k)}\\,${unitTex(to)} = ${withUnit(dec(ans), to)}`,
			],
			choice: choose(
				rng,
				valOpt(ans, to),
				wrong.map((r) => valOpt(r, to)),
			),
			params: { case: toUnit ? 'verso-unita' : 'da-unita', unit: F.unit, prefix: p },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: scientific notation

const SCI_UNITS = ['m', 's', 'g', 'kg', 'L'];

function level3(rng: Rng): Built {
	for (;;) {
		const u = rng.pick(SCI_UNITS);
		const a = mantissa(rng);
		const n = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 3, 4, 5, 6, 7, 8, 9]);
		const x = a.mul(pow10(n));
		if (decimals(x) > 11) continue;
		if (rng.next() < 0.6) {
			// the zeros counted instead of the places the comma moves
			const digits = dec(x).replace(/\\,|\{,\}/g, '');
			const zeros = (digits.match(/0/g) ?? []).length;
			const wrongN = [-n, n > 0 ? zeros : -(zeros - 1), n + 1, n - 1, n > 0 ? zeros - 1 : -zeros].filter((m) => m !== n);
			const opts = wrongN.map((m) => ({ latex: withUnit(sciRaw(a, m), u), values: [a.mul(pow10(m)).toString()] }));
			return {
				prompt: 'Scrivi in notazione scientifica.',
				problem: textBlock(`Scrivi in notazione scientifica la misura ${pw(dec(x), u)}.`),
				solution: withUnit(sci(x), u),
				steps: [
					textBlock(`Si sposta la virgola di $${Math.abs(n)}$ posti verso ${n > 0 ? 'sinistra' : 'destra'} per avere $${dec(a)}$, con una sola cifra diversa da zero prima della virgola.`),
					textBlock(`Il numero era ${n > 0 ? 'grande, quindi l\'esponente è positivo' : 'minore di $1$, quindi l\'esponente è negativo'}: ${pw(sci(x), u)}.`),
				],
				choice: choose(rng, { latex: withUnit(sci(x), u), values: [x.toString()] }, opts),
				params: { case: 'scrivi', unit: u },
			};
		}
		// four writings of the same number: only one has 1 <= a < 10
		const alt = [-1, 1, -2, 2].map((d) => ({ a: a.mul(pow10(d)), n: n - d }));
		const opts = alt.filter((w) => decimals(w.a) <= 4 && w.a.compare(q(1000)) < 0).map((w) => ({ latex: withUnit(sciRaw(w.a, w.n), u), values: [`${w.a.toString()}e${w.n}`] }));
		if (opts.length < 3) continue;
		return {
			prompt: 'Riconosci la notazione scientifica.',
			problem: textBlock(`Quale di queste scritture è la notazione scientifica della misura ${pw(dec(x), u)}?`),
			solution: withUnit(sci(x), u),
			steps: [textBlock(`Tutte valgono ${pw(dec(x), u)}, ma solo in ${pw(sci(x), u)} il primo fattore è almeno $1$ e minore di $10$.`)],
			choice: choose(rng, { latex: withUnit(sci(x), u), values: [`${a.toString()}e${n}`] }, shuffle(rng, opts)),
			params: { case: 'riconosci', unit: u },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: between two prefixes, the answer in scientific notation

const FAMILIES4: { unit: string; prefixes: string[] }[] = [
	{ unit: 'm', prefixes: ['k', '', 'c', 'm', 'μ', 'n'] },
	{ unit: 'g', prefixes: ['k', '', 'm', 'μ'] },
	{ unit: 's', prefixes: ['', 'm', 'μ', 'n'] },
	{ unit: 'L', prefixes: ['', 'm', 'μ'] },
];

function level4(rng: Rng): Built {
	for (;;) {
		const F = rng.pick(FAMILIES4);
		const [p1, p2] = shuffle(rng, F.prefixes).slice(0, 2);
		const d = EXP[p1] - EXP[p2]; // 1 p1 = 10^d p2
		if (Math.abs(d) < 3 || Math.abs(d) > 9) continue;
		const x = mantissa(rng).mul(pow10(rng.int(-1, 2)));
		if (decimals(x) > 3) continue;
		const ans = x.mul(pow10(d));
		const { n } = sciParts(ans);
		if (Math.abs(n) < 2 || Math.abs(n) > 12) continue;
		const from = p1 + F.unit;
		const to = p2 + F.unit;
		const wrong = [-d, d + 3, d - 3, d + 1, d - 1].filter((k) => Math.abs(k) <= 12).map((k) => x.mul(pow10(k)));
		// the steps go through the unit: 1 p1 = 10^e1 u, 1 p2 = 10^e2 u
		const e1 = EXP[p1];
		const e2 = EXP[p2];
		const steps = [
			[p1 ? `1\\,${unitTex(from)} = ${pow10Tex(e1)}\\,${unitTex(F.unit)}` : '', p2 ? `1\\,${unitTex(to)} = ${pow10Tex(e2)}\\,${unitTex(F.unit)}` : ''].filter(Boolean).join(' \\qquad '),
			`1\\,${unitTex(from)} = \\dfrac{${pow10Tex(e1)}}{${pow10Tex(e2)}}\\,${unitTex(to)} = ${pow10Tex(d)}\\,${unitTex(to)}`,
			`${withUnit(dec(x), from)} = ${dec(x)} \\cdot ${pow10Tex(d)}\\,${unitTex(to)}${sciRaw(x, d) === sci(ans) ? '' : ` = ${withUnit(sci(ans), to)}`}`,
		];
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi ${pw(dec(x), from)} in $${unitTex(to)}$, in notazione scientifica.`),
			solution: withUnit(sci(ans), to),
			steps,
			choice: choose(
				rng,
				valOpt(ans, to, 'sci'),
				wrong.filter((r) => r.sign() > 0).map((r) => valOpt(r, to, 'sci')),
			),
			params: { case: F.unit, from, to },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: hours, minutes, seconds; km/h and m/s

function level5(rng: Rng): Built {
	const kind = rng.pick(['ore-minuti-secondi', 'ore-decimali', 'velocita'] as const);
	if (kind === 'ore-minuti-secondi') {
		const h = rng.int(1, 5);
		const m = 5 * rng.int(1, 11);
		const s = 3600 * h + 60 * m;
		const o = (x: number) => ({ latex: withUnit(dec(q(x)), 's'), values: [String(x)] });
		return {
			prompt: 'Esprimi il tempo in secondi.',
			problem: textBlock(`Esprimi in secondi il tempo $${h}\\,\\text{h}\\ ${m}\\,\\text{min}$.`),
			solution: withUnit(dec(q(s)), 's'),
			steps: [`${h}\\,\\text{h} = ${h} \\cdot 3600\\,\\text{s} = ${dec(q(3600 * h))}\\,\\text{s} \\qquad ${m}\\,\\text{min} = ${m} \\cdot 60\\,\\text{s} = ${60 * m}\\,\\text{s}`, `${dec(q(3600 * h))}\\,\\text{s} + ${60 * m}\\,\\text{s} = ${withUnit(dec(q(s)), 's')}`],
			// the minutes not converted; the whole time in minutes; h,mm read as a decimal number of hours; 100 s per minute
			choice: choose(rng, o(s), [o(3600 * h + m), o(60 * h + m), o(36 * (100 * h + m)), o(3600 * h + 100 * m)]),
			params: { case: kind, h, m },
		};
	}
	if (kind === 'ore-decimali') {
		const h = rng.int(1, 4);
		const frac = rng.pick([q(1, 4), q(1, 2), q(3, 4), q(1, 5), q(2, 5), q(3, 5), q(4, 5), q(1, 10), q(3, 10)]);
		const min = frac.mul(q(60));
		const hours = q(h).add(frac);
		const digitsAsMin = Number(dec(frac).split('{,}')[1]) * (dec(frac).split('{,}')[1].length === 1 ? 10 : 1);
		const o = (mm: number) => ({ latex: `${h}\\,\\text{h}\\ ${mm}\\,\\text{min}`, values: [String(60 * h + mm)] });
		const right = Number(min.toString());
		return {
			prompt: 'Esprimi il tempo in ore e minuti.',
			problem: textBlock(`Esprimi in ore e minuti il tempo ${pw(dec(hours), 'h')}.`),
			solution: o(right).latex,
			steps: [`${dec(frac)}\\,\\text{h} = ${dec(frac)} \\cdot 60\\,\\text{min} = ${right}\\,\\text{min}`, textBlock(`quindi ${pw(dec(hours), 'h')} sono $${h}\\,\\text{h}\\ ${right}\\,\\text{min}$.`)],
			// the decimals read as minutes; neighbouring quarters of an hour
			choice: choose(
				rng,
				o(right),
				[digitsAsMin, Math.round(digitsAsMin / 2), right + 15, right - 15, right + 10, right - 10].filter((x) => x > 0 && x < 60 && x !== right).map(o),
			),
			params: { case: kind, hours: hours.toString() },
		};
	}
	const toMs = rng.next() < 0.5;
	if (toMs) {
		const v = 18 * rng.int(1, 8);
		const ans = q(v * 10, 36);
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi in $\\text{m/s}$ la velocità ${pw(String(v), 'km/h')}.`),
			solution: withUnit(dec(ans), 'm/s'),
			steps: [`${withUnit(String(v), 'km/h')} = \\dfrac{${dec(q(v * 1000))}\\,\\text{m}}{3600\\,\\text{s}} = ${withUnit(dec(ans), 'm/s')}`, textBlock('Da $\\text{km/h}$ a $\\text{m/s}$ si divide per $3{,}6$.')],
			// times 3,6; km per minute; metres per minute; divided by 1000 only
			choice: choose(
				rng,
				valOpt(ans, 'm/s'),
				[q(v * 36, 10), q(v, 60), q(v * 1000, 60), q(v, 1000)].filter((r) => ok(r, 3)).map((r) => valOpt(r, 'm/s')),
			),
			params: { case: 'velocita', dir: 'kmh-ms', v },
		};
	}
	const v = rng.int(2, 40);
	const ans = q(v * 36, 10);
	return {
		prompt: 'Cambia unità di misura.',
		problem: textBlock(`Esprimi in $\\text{km/h}$ la velocità ${pw(String(v), 'm/s')}.`),
		solution: withUnit(dec(ans), 'km/h'),
		steps: [`${withUnit(String(v), 'm/s')} = \\dfrac{${v} \\cdot 3600\\,\\text{m}}{1\\,\\text{h}} = \\dfrac{${dec(q(v * 3600))}\\,\\text{m}}{1\\,\\text{h}} = ${withUnit(dec(ans), 'km/h')}`, textBlock('Da $\\text{m/s}$ a $\\text{km/h}$ si moltiplica per $3{,}6$.')],
		// divided by 3,6; times 3600 without the km; times 60
		choice: choose(
			rng,
			valOpt(ans, 'km/h'),
			[q(v * 10, 36), q(v * 3600), q(v * 60), q(v * 36, 100), q(v * 360)].filter((r) => ok(r, 3)).map((r) => valOpt(r, 'km/h')),
		),
		params: { case: 'velocita', dir: 'ms-kmh', v },
	};
}

// ---------------------------------------------------------------------------
// Level 6: order of magnitude

function level6(rng: Rng): Built {
	// half below 3, half from 6 up
	const low = rng.next() < 0.5;
	for (;;) {
		const u = rng.pick(['m', 's', 'kg', 'g', 'L']);
		const a = mantissa(rng, rng.int(2, 3));
		// away from the thresholds 3,16 and 5,5, where the books disagree
		if (low ? a.compare(q(3)) >= 0 : a.compare(q(6)) < 0) continue;
		const n = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		const x = a.mul(pow10(n));
		const asSci = rng.next() < 0.5 || decimals(x) > 6 || x.compare(q(1e7)) > 0;
		const shown = asSci ? sci(x) : dec(x);
		const up = a.compare(q(5)) >= 0;
		const ord = up ? n + 1 : n;
		if (ord === 0) continue;
		const o = (m: number) => ({ latex: withUnit(pow10Tex(m), u), values: [String(m)] });
		return {
			prompt: "Trova l'ordine di grandezza.",
			problem: textBlock(`Qual è l'ordine di grandezza della misura ${pw(shown, u)}?`),
			solution: withUnit(pow10Tex(ord), u),
			steps: [
				...(asSci ? [] : [textBlock(`In notazione scientifica la misura è ${pw(sci(x), u)}.`)]),
				textBlock(`Il primo fattore, $${dec(a)}$, è ${up ? 'almeno $5$' : 'minore di $5$'}: l'ordine di grandezza è ${pw(pow10Tex(ord), u)}.`),
			],
			// the other side of the rule; one power off; the sign of the exponent
			choice: choose(rng, o(ord), [o(up ? n : n + 1), o(ord - 1), o(ord + 1), o(-ord)].filter((c) => c.values[0] !== '0')),
			params: { case: up ? 'sopra' : 'sotto', unit: u },
		};
	}
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch (e) {
			if (/only \d distinct options/.test(String(e))) continue;
			throw e;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.choice, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
	if (ch.options.some((o) => /^\d+\/\d+$/.test(o.values[0]) && !Number.isFinite(decimals(Rational.parse(o.values[0])))))
		v.push('opzione non decimale');
	return v;
}

export const fisGrandezzeSi: Generator = {
	id: ID,
	title: 'Grandezze fisiche e unità del Sistema Internazionale',
	levels: {
		1: { label: 'Unità e prefissi', constraints: ["l'unità del SI di una grandezza, la scrittura corretta di una misura, il valore di un prefisso"] },
		2: { label: "Un prefisso e l'unità", constraints: ['da un multiplo o sottomultiplo all\'unità o viceversa (m, g, s, L)', 'risposta decimale, al più 4 decimali'] },
		3: { label: 'Notazione scientifica', constraints: ['scrivere in notazione scientifica (60%) o riconoscerla tra quattro scritture uguali (40%)', 'esponente da -9 a 9, mai -1, 0, 1, 2'] },
		4: { label: 'Tra due prefissi', constraints: ['tra due prefissi distanti almeno 10^3, risposta in notazione scientifica'] },
		5: { label: 'Ore, minuti e km/h', constraints: ['ore e minuti in secondi, ore decimali in ore e minuti, km/h e m/s, un terzo ciascuno'] },
		6: { label: 'Ordine di grandezza', constraints: ['primo fattore minore di 3 o almeno 6, dove le regole dei libri coincidono'] },
	},
	generate,
	check,
};

export default fisGrandezzeSi;
