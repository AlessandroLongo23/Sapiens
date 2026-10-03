/**
 * I sistemi di numerazione posizionali. Spec: specs/exercises/inf-sistemi-posizionali.md
 *
 * Five levels in the order of the lesson (docs/lezioni/informatica/riscritte/04-inf-sistemi-posizionali.md): reading
 * a Roman numeral (an additive system); which digits a base allows; the value of one digit of a number; the
 * polynomial form; the value in base ten of a number written in another base. Every number is drawn first and the
 * text is written from it.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Opt, choiceViolations, choose, near, numOpt, numTex, sub, tx, weightsTable } from '../inf-basi';

export const ID = 'inf-sistemi-posizionali';

// ---------------------------------------------------------------------------
// Level 1: Roman numerals

const ROMAN: [number, string][] = [
	[1000, 'M'],
	[900, 'CM'],
	[500, 'D'],
	[400, 'CD'],
	[100, 'C'],
	[90, 'XC'],
	[50, 'L'],
	[40, 'XL'],
	[10, 'X'],
	[9, 'IX'],
	[5, 'V'],
	[4, 'IV'],
	[1, 'I'],
];
const SYMBOL: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/** The pieces of the Roman writing of n, largest first: 1990 -> M, CM, XC. */
export function romanParts(n: number): { s: string; v: number }[] {
	const out: { s: string; v: number }[] = [];
	let rest = n;
	for (const [v, s] of ROMAN) {
		while (rest >= v) {
			out.push({ s, v });
			rest -= v;
		}
	}
	return out;
}

export function romanValue(s: string): number {
	let total = 0;
	for (let i = 0; i < s.length; i++) {
		const v = SYMBOL[s[i]], next = SYMBOL[s[i + 1]] ?? 0;
		total += v < next ? -v : v;
	}
	return total;
}

function level1(rng: Rng): Sample {
	for (;;) {
		const n = rng.int(4, 2100);
		const parts = romanParts(n);
		const roman = parts.map((p) => p.s).join('');
		const subtractive = parts.some((p) => p.s.length === 2);
		if (roman.length < 2 || roman.length > 7) continue;
		if (!subtractive && rng.next() < 0.5) continue;
		// equal symbols in a row are read together: MM = 2000, XXX = 30
		const groups: { s: string; v: number }[] = [];
		for (const p of parts) {
			const last = groups.at(-1);
			if (last && p.s.length === 1 && last.s[0] === p.s && last.s.length < 3 && [...last.s].every((c) => c === p.s)) {
				last.s += p.s;
				last.v += p.v;
			} else groups.push({ ...p });
		}
		const steps = [
			tx(`Leggi i simboli da sinistra: ${groups.map((g) => `$\\mathrm{${g.s}} = ${g.v}$`).join(', ')}.`),
			...(subtractive ? [tx(`Un simbolo scritto prima di uno più grande si sottrae: ${parts.filter((p) => p.s.length === 2).map((p) => `$\\mathrm{${p.s}} = ${SYMBOL[p.s[1]]} - ${SYMBOL[p.s[0]]} = ${p.v}$`).join(', ')}.`)] : []),
			groups.length > 1 ? tx(`Somma i valori: $${groups.map((g) => g.v).join(' + ')} = ${n}$.`) : tx(`Il numero è $${n}$.`),
		];
		return {
			generatorId: ID,
			level: 1,
			seed: rng.seed,
			prompt: 'Scrivi in cifre il numero romano.',
			problem: `\\mathrm{${roman}}`,
			solution: `\\mathrm{${roman}} = ${n}`,
			steps,
			answer: { kind: 'number', value: String(n) },
			params: { roman, value: String(n), case: subtractive ? 'sottrattivo' : 'additivo' },
		};
	}
}

function level1Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const roman = String(sample.params.roman);
	const n = Number(sample.params.value);
	const additive = [...roman].reduce((a, c) => a + SYMBOL[c], 0); // every symbol added, IV read as 6
	const parts = romanParts(n);
	// one subtractive pair read the other way round: XC as CX
	const pair = parts.find((p) => p.s.length === 2);
	const swapped = pair ? n - pair.v + SYMBOL[pair.s[0]] + SYMBOL[pair.s[1]] : null;
	// a pair forgotten, or the last symbol left out
	const dropLast = n - parts.at(-1)!.v;
	return choose(rng, numOpt(n)!, [additive !== n ? numOpt(additive) : null, swapped !== additive ? numOpt(swapped) : null, dropLast > 0 ? numOpt(dropLast) : null, ...near(rng, n).map(numOpt)]);
}

// ---------------------------------------------------------------------------
// Level 2: the digits a base allows

const BASES2 = [2, 3, 4, 5, 6, 7, 8] as const;

function digitString(rng: Rng, len: number, maxDigit: number, minTop = 1): string {
	let s = String(rng.int(minTop, Math.max(minTop, maxDigit)));
	while (s.length < len) s += String(rng.int(0, maxDigit));
	return s;
}

const validIn = (digits: string, base: number) => [...digits].every((c) => Number(c) < base);

function level2(rng: Rng): Sample {
	for (;;) {
		const base = rng.pick(BASES2);
		const which = rng.next() < 0.6 ? 'non-valida' : 'valida';
		const len = () => rng.int(3, 4);
		const valid = () => digitString(rng, len(), base - 1);
		const invalid = () => {
			// a digit equal to the base is the mistake to catch; sometimes a larger one
			const bad = rng.next() < 0.7 ? base : rng.int(base, 9);
			const s = [...valid()];
			s[rng.int(0, s.length - 1)] = String(bad);
			return s.join('');
		};
		const right = which === 'non-valida' ? invalid() : valid();
		const others = Array.from({ length: 3 }, () => (which === 'non-valida' ? valid() : invalid()));
		const all = [right, ...others];
		if (new Set(all).size !== 4) continue;
		// a valid string must use the largest digit somewhere among the valid ones, so the question is about the limit
		const valids = all.filter((s) => validIn(s, base));
		if (base > 2 && !valids.some((s) => s.includes(String(base - 1)))) continue;
		const opt = (s: string): ChoiceOption => ({ latex: s, values: [s] });
		const choice = choose(rng, opt(right), others.map(opt));
		const allowed = Array.from({ length: base }, (_, i) => i).join(', ');
		const bad = (s: string) => [...new Set([...s].filter((c) => Number(c) >= base))].join(' e ');
		const invalids = all.filter((s) => !validIn(s, base));
		return {
			generatorId: ID,
			level: 2,
			seed: rng.seed,
			prompt: which === 'non-valida' ? `Quale di queste scritture non può essere un numero in base ${base}?` : `Quale di queste scritture può essere un numero in base ${base}?`,
			problem: '',
			solution: right,
			steps: [
				tx(`In base $${base}$ le cifre sono $${base}$: $${allowed}$. La cifra più grande è $${base - 1}$.`),
				which === 'non-valida'
					? tx(`$${right}$ contiene la cifra $${bad(right)}$, che in base $${base}$ non esiste. Le altre scritture usano solo cifre ammesse.`)
					: tx(`${invalids.map((s) => `$${s}$ contiene la cifra $${bad(s)}$`).join('; ')}: nessuna è una scrittura in base $${base}$. Resta $${right}$, che usa solo cifre ammesse.`),
			],
			answer: choice,
			params: { base: String(base), case: which, options: choice.options.map((o) => o.values[0]) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the value of one digit

function level3(rng: Rng): Sample {
	for (;;) {
		const base = rng.next() < 0.3 ? 10 : rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
		const len = base === 10 ? rng.int(3, 4) : base === 2 ? rng.int(4, 8) : rng.int(3, 5);
		const digits = digitString(rng, len, base - 1);
		const i = rng.int(0, len - 1); // index from the left
		const d = Number(digits[i]);
		const pos = len - 1 - i;
		if (d === 0) continue;
		const weight = base ** pos;
		if (weight > 5000) continue;
		if (pos === 0 && rng.next() < 0.6) continue; // the units are the easy case: keep a few
		const value = d * weight;
		// the digits one by one, so the grouping of a binary number does not hide the underlined one
		const shown = [...digits].map((c, k) => (k === i ? `\\underline{${c}}` : c));
		const body = base === 2 && len > 4 ? shown.map((c, k) => ((len - k) % 4 === 0 && k > 0 ? `\\,${c}` : c)).join('') : shown.join('');
		const problem = base === 10 ? body : `${body}${sub(base)}`;
		const wTex = pos === 0 ? `${base}^0 = 1` : pos === 1 ? `${base}^1 = ${base}` : `${base}^${pos} = ${weight}`;
		return {
			generatorId: ID,
			level: 3,
			seed: rng.seed,
			prompt: base === 10 ? 'Quanto vale la cifra sottolineata?' : 'Quanto vale, in base dieci, la cifra sottolineata?',
			problem,
			solution: `${d} \\cdot ${weight} = ${value}`,
			steps: [
				tx(`Conta le posizioni da destra, partendo da $0$: la cifra $${d}$ è nella posizione $${pos}$.`),
				tx(`In base $${base}$ il peso della posizione $${pos}$ è $${wTex}$.`),
				tx(`Il valore della cifra è la cifra per il peso: $${d} \\cdot ${weight} = ${value}$.`),
			],
			answer: { kind: 'number', value: String(value) },
			params: { digits, base: String(base), index: i, value: String(value) },
		};
	}
}

function level3Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const digits = String(sample.params.digits), base = Number(sample.params.base), i = Number(sample.params.index);
	const len = digits.length, d = Number(digits[i]), pos = len - 1 - i;
	const v = d * base ** pos;
	const cands: Opt[] = [
		numOpt(d * base ** (pos + 1)), // positions counted from 1
		numOpt(d * base ** i), // positions counted from the left
		base !== 10 ? numOpt(d * 10 ** pos) : null, // weights of base ten
		numOpt(d), // the digit alone
		d !== 1 ? numOpt(base ** pos) : null, // the weight alone
		pos > 0 ? numOpt(d * base ** (pos - 1)) : null,
		numOpt(d * base * pos), // base times position instead of the power
		...near(rng, v).map(numOpt),
	];
	return choose(rng, numOpt(v)!, cands);
}

// ---------------------------------------------------------------------------
// Level 4: the polynomial form

type Term = { c: number; b: number; e: number };
const termTex = (x: Term) => `${x.c} \\cdot ${x.b}^${x.e}`;
const termKey = (x: Term) => `${x.c}*${x.b}^${x.e}`;

/** Three terms on a line; four on two lines, to fit an answer button on a phone. */
function polyTex(terms: Term[]): string {
	const parts = terms.map(termTex);
	if (parts.length <= 3) return parts.join(' + ');
	return `\\begin{gathered} ${parts.slice(0, 2).join(' + ')} + {} \\\\ ${parts.slice(2).join(' + ')} \\end{gathered}`;
}
const polyOpt = (terms: Term[]): ChoiceOption => ({ latex: polyTex(terms), values: terms.map(termKey) });
/** The value of an option, read back from its terms: a distractor must not be worth the number itself. */
const polyValue = (o: ChoiceOption) => o.values.reduce((a, k) => a + Number(k.split('*')[0]) * Number(k.split('*')[1].split('^')[0]) ** Number(k.split('^')[1]), 0);

function level4(rng: Rng): Sample {
	for (;;) {
		const base = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 10]);
		const len = rng.next() < 0.6 ? 3 : 4;
		const digits = digitString(rng, len, base - 1);
		if (digits === [...digits].reverse().join('')) continue; // reversed exponents must give another number
		if (base === 2 && !digits.includes('0')) continue;
		const ds = [...digits].map(Number);
		const right: Term[] = ds.map((c, k) => ({ c, b: base, e: len - 1 - k }));
		const cands: ChoiceOption[] = [
			polyOpt(ds.map((c, k) => ({ c, b: base, e: len - k }))), // exponents from 1
			polyOpt(ds.map((c, k) => ({ c, b: base, e: k }))), // exponents from the left
			...(base !== 10 ? [polyOpt(ds.map((c, k) => ({ c, b: 10, e: len - 1 - k })))] : []), // powers of ten
			...(ds.every((c) => c >= 2) ? [polyOpt(ds.map((c, k) => ({ c: base, b: c, e: len - 1 - k })))] : []), // digit and base swapped
			polyOpt(ds.map((c, k) => ({ c, b: base, e: k + 1 }))), // from the left and from 1
			polyOpt(ds.map((c, k) => ({ c, b: base === 10 ? 2 : base + 1, e: len - 1 - k }))),
		];
		const value = parseInt(digits, base);
		const wrong = cands.filter((o) => polyValue(o) !== value);
		if (wrong.length < 3) continue;
		const choice = choose(rng, polyOpt(right), wrong);
		const number = base === 10 ? digits : numTex(digits, base);
		return {
			generatorId: ID,
			level: 4,
			seed: rng.seed,
			prompt: 'Scegli la forma polinomiale del numero.',
			problem: number,
			solution: `${number} = ${right.map(termTex).join(' + ')}`,
			steps: [
				tx(`Il numero ha $${len}$ cifre: le posizioni, da destra, vanno da $0$ a $${len - 1}$.`),
				tx(`Ogni cifra si moltiplica per la base $${base}$ elevata alla sua posizione: la prima cifra a sinistra, $${ds[0]}$, è nella posizione $${len - 1}$ e l'ultima, $${ds[len - 1]}$, nella posizione $0$.`),
				`${number} = ${right.map(termTex).join(' + ')}`,
			],
			answer: choice,
			params: { digits, base: String(base) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the value in base ten

function level5(rng: Rng): Sample {
	for (;;) {
		const base = rng.pick([2, 3, 4, 5, 5, 6, 7, 8, 8, 9]);
		const len = base === 2 ? rng.int(3, 5) : base <= 4 ? rng.int(3, 4) : 3;
		const digits = digitString(rng, len, base - 1);
		const value = parseInt(digits, base);
		if (value > 1000) continue;
		if (digits === [...digits].reverse().join('')) continue;
		if ([...digits].filter((c) => c !== '0').length < 2) continue;
		const ds = [...digits].map(Number);
		const products = ds.map((c, k) => `${c} \\cdot ${base ** (len - 1 - k)}`);
		const values = ds.map((c, k) => c * base ** (len - 1 - k));
		return {
			generatorId: ID,
			level: 5,
			seed: rng.seed,
			prompt: 'Scrivi il numero in base dieci.',
			problem: numTex(digits, base),
			solution: `${numTex(digits, base)} = ${value}_{10}`,
			steps: [
				tx(`Scrivi sopra ogni cifra il peso della sua posizione, cioè le potenze di $${base}$ da destra:`),
				weightsTable(digits, base),
				tx(`Moltiplica ogni cifra per il suo peso: $${products.join(' + ')}$.`),
				tx(`Somma: $${values.join(' + ')} = ${value}$.`),
			],
			answer: { kind: 'number', value: String(value) },
			params: { digits, base: String(base), value: String(value) },
		};
	}
}

function level5Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const digits = String(sample.params.digits), base = Number(sample.params.base);
	const v = parseInt(digits, base);
	const ds = [...digits].map(Number), len = ds.length;
	const cands: Opt[] = [
		numOpt(parseInt([...digits].reverse().join(''), base)), // weights from the left
		numOpt(v * base), // exponents from 1
		numOpt(Number(digits)), // read as a decimal number
		numOpt(ds.reduce((a, c) => a + c, 0) * base), // digits added, then times the base
		numOpt(ds.reduce((a, c, k) => a + c * base * (len - 1 - k), 0)), // base times position instead of the power
		numOpt(ds.reduce((a, c) => a + c, 0)),
		...near(rng, v).map(numOpt),
	];
	return choose(rng, numOpt(v)!, cands);
}

// ---------------------------------------------------------------------------

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const numberIs = (n: number) => {
		if (sample.answer.kind !== 'number' || sample.answer.value !== String(n)) v.push('risposta diversa');
		v.push(...choiceViolations(sample.choice, String(n)));
	};
	switch (sample.level) {
		case 1: {
			const roman = String(p.roman);
			const n = romanValue(roman);
			if (romanParts(n).map((x) => x.s).join('') !== roman) v.push('numero romano non in forma canonica');
			if (n < 4 || n > 2100 || roman.length < 2 || roman.length > 7) v.push('numero romano fuori misura');
			if (sample.problem !== `\\mathrm{${roman}}`) v.push('il testo non corrisponde a params.roman');
			numberIs(n);
			break;
		}
		case 2: {
			if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
			const base = Number(p.base);
			const opts = sample.answer.options.map((o) => o.values[0]);
			const ok = opts.filter((s) => validIn(s, base));
			const wanted = p.case === 'valida' ? ok : opts.filter((s) => !validIn(s, base));
			if (wanted.length !== 1) v.push('serve una sola scrittura giusta');
			else v.push(...choiceViolations(sample.answer, wanted[0]));
			if (opts.some((s) => s.length < 3 || s.length > 4 || s[0] === '0')) v.push('scritture di 3 o 4 cifre, senza zero iniziale');
			break;
		}
		case 3: {
			const digits = String(p.digits), base = Number(p.base), i = Number(p.index);
			const d = Number(digits[i]), pos = digits.length - 1 - i;
			if (!validIn(digits, base) || digits[0] === '0') v.push('cifre non ammesse');
			if (d === 0) v.push('cifra sottolineata nulla');
			if (base ** pos > 5000) v.push('peso troppo grande');
			if (!sample.problem.includes(`\\underline{${d}}`)) v.push('manca la cifra sottolineata');
			numberIs(d * base ** pos);
			break;
		}
		case 4: {
			if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
			const digits = String(p.digits), base = Number(p.base);
			if (!validIn(digits, base) || digits[0] === '0') v.push('cifre non ammesse');
			if (digits === [...digits].reverse().join('')) v.push('numero palindromo');
			const key = [...digits].map((c, k) => `${c}*${base}^${digits.length - 1 - k}`).join('|');
			v.push(...choiceViolations(sample.answer, key));
			if (sample.answer.options.some((o) => o.values.join('|') !== key && polyValue(o) === parseInt(digits, base))) v.push('un distrattore vale quanto il numero');
			break;
		}
		case 5: {
			const digits = String(p.digits), base = Number(p.base);
			if (!validIn(digits, base) || digits[0] === '0') v.push('cifre non ammesse');
			const n = parseInt(digits, base);
			if (n > 1000) v.push('valore oltre 1000');
			if (sample.problem !== numTex(digits, base)) v.push('il testo non corrisponde ai parametri');
			numberIs(n);
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.level === 1) return level1Choice(sample, rng);
	if (sample.level === 3) return level3Choice(sample, rng);
	return level5Choice(sample, rng);
}

export const infSistemiPosizionali: Generator = {
	id: ID,
	title: 'I sistemi di numerazione posizionali',
	levels: {
		1: { label: 'Leggere un numero romano', constraints: ['numeri da 4 a 2100, al massimo 7 simboli', 'almeno metà con un simbolo che si sottrae (IV, IX, XL, XC, CD, CM)'] },
		2: { label: 'Le cifre di una base', constraints: ['basi da 2 a 8, scritture di 3 o 4 cifre', 'una sola scrittura giusta: quella che non è ammessa, oppure la sola ammessa'] },
		3: { label: 'Il valore di una cifra', constraints: ['basi da 2 a 10, cifra sottolineata diversa da zero', 'peso della posizione fino a 5000'] },
		4: { label: 'La forma polinomiale', constraints: ['basi da 2 a 10, numeri di 3 o 4 cifre non palindromi', 'tutte le cifre nella forma, anche gli zeri'] },
		5: { label: 'Da una base alla base dieci', constraints: ['basi da 2 a 9, numeri di 3-5 cifre', 'valore fino a 1000, almeno due cifre diverse da zero'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 200; attempt++) {
			let s: Sample;
			switch (level) {
				case 1:
					s = level1(rng);
					break;
				case 2:
					s = level2(rng);
					break;
				case 3:
					s = level3(rng);
					break;
				case 4:
					s = level4(rng);
					break;
				case 5:
					s = level5(rng);
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

export default infSistemiPosizionali;
