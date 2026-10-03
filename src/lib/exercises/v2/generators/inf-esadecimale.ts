/**
 * Il sistema esadecimale. Spec: specs/exercises/inf-esadecimale.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/06-inf-esadecimale.md): from hexadecimal
 * to decimal with the weights; from decimal to hexadecimal with the divisions by 16; from binary to hexadecimal and
 * back with the groups of four bits; the octal system (groups of three bits); the components of a colour written
 * as #RRGGBB. The number is drawn first and every writing comes from it.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Opt, binTex, cell, choiceViolations, choose, divisionTable, divisions, hexTex, near, numOpt, numTex, sameValue, shuffle, table, toBase, tx, valueOpt, weightsTable } from '../inf-basi';

export const ID = 'inf-esadecimale';

const hasLetter = (s: string) => /[A-F]/.test(s);
const reversed = (s: string) => [...s].reverse().join('');
const val = (c: string) => parseInt(c, 16);
/** The digits in groups of `size` from the right, the first group padded with zeros. */
function groups(bits: string, size: number): string[] {
	const padded = bits.padStart(Math.ceil(bits.length / size) * size, '0');
	return padded.match(new RegExp(`.{${size}}`, 'g')) ?? [];
}
/** One letter of a hexadecimal number moved by one, the mistake of who counts A as 11. */
function letterOff(hex: string): string | null {
	const i = [...hex].findIndex((c) => /[A-F]/.test(c));
	if (i < 0) return null;
	const d = val(hex[i]);
	const moved = d === 15 ? 14 : d + 1;
	return hex.slice(0, i) + toBase(moved, 16) + hex.slice(i + 1);
}

// ---------------------------------------------------------------------------
// Level 1: from hexadecimal to decimal

function level1(rng: Rng): Sample {
	for (;;) {
		const n = rng.next() < 0.7 ? rng.int(16, 255) : rng.int(256, 4095);
		const hex = toBase(n, 16);
		if (!hasLetter(hex) && rng.next() < 0.75) continue;
		const ds = [...hex];
		const len = ds.length;
		const letters = [...new Set(ds.filter((c) => /[A-F]/.test(c)))];
		const products = ds.map((c, k) => `${val(c)} \\cdot ${16 ** (len - 1 - k)}`);
		const values = ds.map((c, k) => val(c) * 16 ** (len - 1 - k));
		return {
			generatorId: ID,
			level: 1,
			seed: rng.seed,
			prompt: 'Converti in base dieci.',
			problem: hexTex(n),
			solution: `${hexTex(n)} = ${n}_{10}`,
			steps: [
				...(letters.length ? [tx(`Le cifre da A a F valgono da $10$ a $15$: ${letters.map((c) => `$\\mathrm{${c}} = ${val(c)}$`).join(', ')}.`)] : []),
				tx(`Scrivi sopra ogni cifra il peso della sua posizione, cioè le potenze di $16$ da destra:`),
				weightsTable(hex, 16),
				tx(`Moltiplica il valore di ogni cifra per il suo peso e somma: $${products.join(' + ')} = ${values.join(' + ')} = ${n}$.`),
			],
			answer: { kind: 'number', value: String(n) },
			params: { hex, value: String(n) },
		};
	}
}

function level1Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const hex = String(sample.params.hex);
	const n = parseInt(hex, 16);
	const ds = [...hex].map(val), len = ds.length;
	const cands: Opt[] = [
		numOpt(parseInt(reversed(hex), 16)), // weights from the left
		numOpt(ds.reduce((a, d, k) => a + (d > 9 ? d + 1 : d) * 16 ** (len - 1 - k), 0)), // A counted as 11
		numOpt(Number(ds.join(''))), // the values written one after the other
		numOpt(ds.reduce((a, d, k) => a + d * 10 ** (len - 1 - k), 0)), // weights of base ten
		numOpt(ds.reduce((a, d) => a + d, 0) * 16), // digits added, then times 16
		numOpt(ds.reduce((a, d) => a + d, 0)),
		...near(rng, n).map(numOpt),
	];
	return choose(rng, numOpt(n)!, cands);
}

// ---------------------------------------------------------------------------
// Level 2: from decimal to hexadecimal

function level2(rng: Rng): Sample {
	for (;;) {
		const n = rng.next() < 0.6 ? rng.int(26, 255) : rng.int(256, 4095);
		const hex = toBase(n, 16);
		if (!hasLetter(hex) && rng.next() < 0.8) continue;
		const rems = divisions(n, 16).map((d) => d.r);
		const rev = reversed(hex);
		const cands: Opt[] = shuffle(rng, [
			rev !== hex && rev[0] !== '0' ? valueOpt(parseInt(rev, 16), 16) : null, // remainders read from the top
			hasLetter(hex) ? valueOpt(parseInt([...hex].map((c) => String(val(c))).join(''), 16), 16) : null, // 12 written instead of C
			valueOpt(parseInt(letterOff(hex) ?? hex, 16), 16), // a letter wrong by one
		]);
		const fill = shuffle(rng, [n + 1, n - 1, n + 16, n - 16, n + 2, n + 17]).map((x) => valueOpt(x, 16));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, valueOpt(n, 16)!, [...cands, ...fill], sameValue(16));
		} catch {
			continue;
		}
		return {
			generatorId: ID,
			level: 2,
			seed: rng.seed,
			prompt: 'Converti in esadecimale.',
			problem: String(n),
			solution: `${n}_{10} = ${hexTex(n)}`,
			steps: [
				tx(`Dividi per $16$ finché il quoziente diventa $0$, segnando ogni resto; i resti da $10$ a $15$ diventano le cifre da A a F:`),
				divisionTable(n, 16),
				tx(`Leggi i resti dal basso verso l'alto: $${[...rems].reverse().map((r) => cell(toBase(r, 16))).join('\\ ')}$. Quindi $${n} = ${hexTex(n)}$.`),
			],
			answer: choice,
			params: { value: String(n), hex },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: binary and hexadecimal, groups of four bits

function level3(rng: Rng): Sample {
	for (;;) {
		const len = rng.pick([5, 6, 7, 8, 8, 8, 9, 10, 11, 12]);
		const n = rng.int(2 ** (len - 1), 2 ** len - 1);
		const bits = toBase(n, 2), hex = toBase(n, 16);
		if (!hasLetter(hex) && rng.next() < 0.7) continue;
		const gs = groups(bits, 4);
		const fromLeft = len % 4 ? parseInt(bits.padEnd(Math.ceil(len / 4) * 4, '0'), 2) : null; // groups made from the left
		const rev = reversed(hex);
		const cands: Opt[] = shuffle(rng, [
			valueOpt(fromLeft, 16),
			hasLetter(hex) ? valueOpt(parseInt([...hex].map((c) => String(val(c))).join(''), 16), 16) : null, // 13 written instead of D
			valueOpt(parseInt(letterOff(hex) ?? hex, 16), 16),
			rev !== hex && rev[0] !== '0' ? valueOpt(parseInt(rev, 16), 16) : null,
		]);
		const fill = shuffle(rng, [n + 1, n - 1, n + 16, n - 16, n ^ 2, n ^ 32]).map((x) => valueOpt(x, 16));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, valueOpt(n, 16)!, [...cands, ...fill], sameValue(16));
		} catch {
			continue;
		}
		const pad = gs[0] !== bits.slice(0, bits.length - 4 * (gs.length - 1));
		return {
			generatorId: ID,
			level: 3,
			seed: rng.seed,
			prompt: 'Converti in esadecimale.',
			problem: binTex(n),
			solution: `${binTex(n)} = ${hexTex(n)}`,
			steps: [
				tx(`Dividi i bit in gruppi di quattro partendo da destra${pad ? '; al gruppo più a sinistra aggiungi gli zeri che mancano' : ''}. Sotto ogni gruppo scrivi la cifra esadecimale che vale quanto il gruppo:`),
				table(gs.map(() => 'c').join('|'), [gs, [...hex.padStart(gs.length, '0')].map(cell)]),
				tx(`Leggi le cifre di seguito: $${binTex(n)} = ${hexTex(n)}$.`),
			],
			answer: choice,
			params: { bits, hex },
		};
	}
}

function level4(rng: Rng): Sample {
	for (;;) {
		const n = rng.next() < 0.6 ? rng.int(16, 255) : rng.int(256, 4095);
		const hex = toBase(n, 16), bits = toBase(n, 2);
		if (!hasLetter(hex) && rng.next() < 0.7) continue;
		const nibbles = [...hex].map((c) => toBase(val(c), 2, 4));
		const noPad = parseInt([...hex].map((c) => toBase(val(c), 2)).join(''), 2); // 5 written as 101 instead of 0101
		const k = rng.int(0, hex.length - 1);
		const flipped = nibbles.map((g, i) => (i === k ? reversed(g) : g)).join(''); // one group read backwards
		const cands: Opt[] = shuffle(rng, [
			valueOpt(noPad, 2),
			valueOpt(parseInt(letterOff(hex) ?? hex, 16), 2), // a letter wrong by one
			valueOpt(parseInt([...nibbles].reverse().join(''), 2), 2), // groups in the wrong order
			valueOpt(parseInt(flipped, 2), 2),
		]);
		const fill = shuffle(rng, [n ^ 1, n ^ 4, n ^ 16, n ^ 2, n ^ 8]).map((x) => valueOpt(x, 2));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, valueOpt(n, 2)!, [...cands, ...fill], sameValue(2));
		} catch {
			continue;
		}
		const zeros = nibbles.join('').length - bits.length;
		return {
			generatorId: ID,
			level: 4,
			seed: rng.seed,
			prompt: 'Converti in binario.',
			problem: hexTex(n),
			solution: `${hexTex(n)} = ${binTex(n)}`,
			steps: [
				tx(`Ogni cifra esadecimale diventa un gruppo di quattro bit, con gli zeri a sinistra che servono per arrivare a quattro:`),
				table(nibbles.map(() => 'c').join('|'), [[...hex].map(cell), nibbles]),
				zeros > 0
					? tx(`Scrivi i gruppi di seguito e togli ${zeros === 1 ? 'lo zero iniziale' : `i $${zeros}$ zeri iniziali`}, che non cambiano il valore: $${hexTex(n)} = ${binTex(n)}$.`)
					: tx(`Scrivi i gruppi di seguito: $${hexTex(n)} = ${binTex(n)}$.`),
			],
			answer: choice,
			params: { hex, bits },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the octal system

type OctCase = 'ott-dec' | 'bin-ott' | 'ott-bin';

function level5(rng: Rng): Sample {
	for (;;) {
		const c = rng.pick(['ott-dec', 'bin-ott', 'ott-bin'] as OctCase[]);
		const n = rng.int(9, 511);
		const oct = toBase(n, 8), bits = toBase(n, 2);
		if ([...oct].filter((d) => d !== '0').length < 2 && rng.next() < 0.8) continue;
		const base = { generatorId: ID, level: 5, seed: rng.seed };
		const len = oct.length;
		if (c === 'ott-dec') {
			const ds = [...oct].map(Number);
			return {
				...base,
				prompt: 'Converti in base dieci.',
				problem: numTex(oct, 8),
				solution: `${numTex(oct, 8)} = ${n}_{10}`,
				steps: [
					tx(`In base $8$ i pesi sono le potenze di $8$:`),
					weightsTable(oct, 8),
					tx(`Moltiplica ogni cifra per il suo peso e somma: $${ds.map((d, k) => `${d} \\cdot ${8 ** (len - 1 - k)}`).join(' + ')} = ${n}$.`),
				],
				answer: { kind: 'number', value: String(n) },
				params: { case: c, oct, value: String(n) },
			};
		}
		const gs = groups(bits, 3);
		let choice: ChoiceAnswer;
		try {
			if (c === 'bin-ott') {
				const hex = toBase(n, 16);
				const fromLeft = bits.length % 3 ? parseInt(bits.padEnd(Math.ceil(bits.length / 3) * 3, '0'), 2) : null;
				const rev = reversed(oct);
				const cands: Opt[] = shuffle(rng, [
					/^[0-7]+$/.test(hex) ? valueOpt(parseInt(hex, 8), 8) : null, // groups of four, as for the hexadecimal
					valueOpt(fromLeft, 8), // groups made from the left
					rev !== oct && rev[0] !== '0' ? valueOpt(parseInt(rev, 8), 8) : null,
				]);
				const fill = shuffle(rng, [n + 1, n - 1, n + 8, n - 8, n ^ 2, n ^ 16]).map((x) => valueOpt(x, 8));
				choice = choose(rng, valueOpt(n, 8)!, [...cands, ...fill], sameValue(8));
			} else {
				const four = parseInt([...oct].map((d) => toBase(Number(d), 2, 4)).join(''), 2); // four bits for each digit
				const noPad = parseInt([...oct].map((d) => toBase(Number(d), 2)).join(''), 2); // 2 written as 10 instead of 010
				const cands: Opt[] = shuffle(rng, [valueOpt(four, 2), valueOpt(noPad, 2), valueOpt(parseInt([...gs].reverse().join(''), 2), 2)]);
				const fill = shuffle(rng, [n ^ 1, n ^ 2, n ^ 4, n ^ 8, n ^ 16]).map((x) => valueOpt(x, 2));
				choice = choose(rng, valueOpt(n, 2)!, [...cands, ...fill], sameValue(2));
			}
		} catch {
			continue;
		}
		const tri = gs.join('\\,');
		if (c === 'bin-ott') {
			const pad = gs.join('').length > bits.length;
			return {
				...base,
				prompt: 'Converti in ottale.',
				problem: binTex(n),
				solution: `${binTex(n)} = ${numTex(oct, 8)}`,
				steps: [
					tx(`Poiché $8 = 2^3$, ogni cifra ottale vale quanto un gruppo di tre bit. Dividi i bit in gruppi di tre partendo da destra${pad ? ', aggiungendo a sinistra gli zeri che mancano' : ''}: $${tri}$.`),
					tx(`Sotto ogni gruppo scrivi il suo valore, da $0$ a $7$:`),
					table(gs.map(() => 'c').join('|'), [gs, [...oct]]),
					tx(`Leggi le cifre di seguito: $${binTex(n)} = ${numTex(oct, 8)}$.`),
				],
				answer: choice,
				params: { case: c, bits, oct },
			};
		}
		const zeros = gs.join('').length - bits.length;
		return {
			...base,
			prompt: 'Converti in binario.',
			problem: numTex(oct, 8),
			solution: `${numTex(oct, 8)} = ${binTex(n)}`,
			steps: [
				tx(`Poiché $8 = 2^3$, ogni cifra ottale diventa un gruppo di tre bit:`),
				table(gs.map(() => 'c').join('|'), [[...oct], gs]),
				zeros > 0
					? tx(`Scrivi i gruppi di seguito e togli ${zeros === 1 ? 'lo zero iniziale' : `i $${zeros}$ zeri iniziali`}: $${numTex(oct, 8)} = ${binTex(n)}$.`)
					: tx(`Scrivi i gruppi di seguito: $${numTex(oct, 8)} = ${binTex(n)}$.`),
			],
			answer: choice,
			params: { case: c, oct, bits },
		};
	}
}

function level5Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const oct = String(sample.params.oct);
	const n = parseInt(oct, 8);
	const ds = [...oct].map(Number), len = ds.length;
	const cands: Opt[] = [
		numOpt(Number(oct)), // read as a decimal number
		numOpt(parseInt(reversed(oct), 8)), // weights from the left
		numOpt(parseInt(oct, 16)), // weights of base 16
		numOpt(8 * n), // exponents from 1
		numOpt(ds.reduce((a, d, k) => a + d * 8 * (len - 1 - k), 0)),
		...near(rng, n).map(numOpt),
	];
	return choose(rng, numOpt(n)!, cands);
}

// ---------------------------------------------------------------------------
// Level 6: colours

export const COMPONENTS = ['rossa', 'verde', 'blu'] as const;

function level6(rng: Rng): Sample {
	for (;;) {
		const rgb = [0, 0, 0].map(() => (rng.next() < 0.15 ? rng.pick([0, 255, 128]) : rng.int(0, 255)));
		const k = rng.int(0, 2);
		if (new Set(rgb).size < 3) continue;
		const pair = toBase(rgb[k], 16, 2);
		if (pair[0] === pair[1] && rng.next() < 0.7) continue;
		const code = rgb.map((x) => toBase(x, 16, 2)).join('');
		const hi = val(pair[0]), lo = val(pair[1]);
		const where = ['nelle prime due cifre', 'nelle due cifre centrali', 'nelle ultime due cifre'][k];
		return {
			generatorId: ID,
			level: 6,
			seed: rng.seed,
			prompt: 'Rispondi in base dieci.',
			problem: textBlock(`Nel colore $\\texttt{\\#${code}}$ quanto vale la componente ${COMPONENTS[k]}?`),
			solution: `${numTex(pair, 16)} = ${rgb[k]}`,
			steps: [
				tx(`Le sei cifre si leggono a coppie: rosso, verde, blu. La componente ${COMPONENTS[k]} sta ${where}: $${numTex(pair, 16)}$.`),
				tx(`Converti in base dieci: $${numTex(pair, 16)} = ${hi} \\cdot 16 + ${lo} = ${rgb[k]}$.`),
			],
			answer: { kind: 'number', value: String(rgb[k]) },
			params: { code, component: COMPONENTS[k], value: String(rgb[k]) },
		};
	}
}

function level6Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const code = String(sample.params.code);
	const k = COMPONENTS.indexOf(sample.params.component as (typeof COMPONENTS)[number]);
	const pairs = [code.slice(0, 2), code.slice(2, 4), code.slice(4, 6)];
	const v = parseInt(pairs[k], 16);
	const hi = val(pairs[k][0]), lo = val(pairs[k][1]);
	const others = pairs.filter((_, i) => i !== k).map((p) => numOpt(parseInt(p, 16)));
	const cands: Opt[] = [
		...shuffle(rng, others), // another pair of digits
		numOpt(lo * 16 + hi), // weights swapped
		numOpt(hi * 10 + lo), // weights of base ten
		numOpt(hi + lo),
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
	const choiceIs = (digits: string, base: number) => {
		if (sample.answer.kind !== 'choice') {
			v.push('risposta non a scelta');
			return;
		}
		v.push(...choiceViolations(sample.answer, digits));
		if (new Set(sample.answer.options.map((o) => parseInt(o.values[0], base))).size !== 4) v.push('due opzioni sono lo stesso numero');
	};
	switch (sample.level) {
		case 1: {
			const n = parseInt(String(p.hex), 16);
			if (n < 16 || n > 4095) v.push('numero fuori misura');
			if (sample.problem !== hexTex(n)) v.push('il testo non corrisponde ai parametri');
			numberIs(n);
			break;
		}
		case 2: {
			const n = Number(p.value);
			if (n < 26 || n > 4095) v.push('numero fuori misura');
			if (sample.problem !== String(n)) v.push('il testo non corrisponde ai parametri');
			choiceIs(toBase(n, 16), 16);
			break;
		}
		case 3: {
			const bits = String(p.bits);
			const n = parseInt(bits, 2);
			if (bits.length < 5 || bits.length > 12 || bits[0] !== '1') v.push('da 5 a 12 bit');
			if (sample.problem !== binTex(n)) v.push('il testo non corrisponde ai parametri');
			choiceIs(toBase(n, 16), 16);
			break;
		}
		case 4: {
			const n = parseInt(String(p.hex), 16);
			if (n < 16 || n > 4095) v.push('numero fuori misura');
			if (sample.problem !== hexTex(n)) v.push('il testo non corrisponde ai parametri');
			choiceIs(toBase(n, 2), 2);
			break;
		}
		case 5: {
			const n = parseInt(String(p.oct), 8);
			if (n < 9 || n > 511) v.push('numero fuori misura');
			if (p.case === 'ott-dec') numberIs(n);
			else if (p.case === 'bin-ott') choiceIs(toBase(n, 8), 8);
			else choiceIs(toBase(n, 2), 2);
			break;
		}
		case 6: {
			const code = String(p.code);
			const k = COMPONENTS.indexOf(p.component as (typeof COMPONENTS)[number]);
			if (!/^[0-9A-F]{6}$/.test(code) || k < 0) v.push('colore non valido');
			if (!sample.problem.includes(`\\#${code}`)) v.push('il testo non corrisponde ai parametri');
			numberIs(parseInt(code.slice(2 * k, 2 * k + 2), 16));
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
	if (sample.level === 5) return level5Choice(sample, rng);
	return level6Choice(sample, rng);
}

export const infEsadecimale: Generator = {
	id: ID,
	title: 'Il sistema esadecimale',
	levels: {
		1: { label: 'Da esadecimale a decimale', constraints: ['numeri di 2 o 3 cifre esadecimali, da 16 a 4095', 'quasi sempre con almeno una cifra da A a F'] },
		2: { label: 'Da decimale a esadecimale', constraints: ['numeri da 26 a 4095, divisioni successive per 16', 'risposta a scelta tra quattro numeri esadecimali diversi'] },
		3: { label: 'Da binario a esadecimale', constraints: ['da 5 a 12 bit, gruppi di quattro da destra', 'metà dei numeri ha il primo gruppo da completare con gli zeri'] },
		4: { label: 'Da esadecimale a binario', constraints: ['numeri di 2 o 3 cifre esadecimali', 'risultato senza zeri iniziali'] },
		5: { label: 'Il sistema ottale', constraints: ['numeri da 9 a 511', 'un terzo ciascuno: da ottale a decimale, da binario a ottale, da ottale a binario'] },
		6: { label: 'Le componenti di un colore', constraints: ['colore di sei cifre esadecimali con tre componenti diverse', 'si chiede il valore in base dieci di una componente'] },
	},
	generate(rng: Rng, level: number): Sample {
		const make = [level1, level2, level3, level4, level5, level6][level - 1];
		if (!make) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 200; attempt++) {
			const s = make(rng);
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default infEsadecimale;
