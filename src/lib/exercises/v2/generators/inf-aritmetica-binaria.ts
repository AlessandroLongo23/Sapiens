/**
 * Addizione e moltiplicazione in binario. Spec: specs/exercises/inf-aritmetica-binaria.md
 *
 * Five levels in the order of the lesson (docs/lezioni/informatica/riscritte/07-inf-aritmetica-binaria.md): additions
 * with single carries; additions with a column 1 + 1 + 1; additions in a register of 4 or 8 bits, with or without
 * overflow; products by a power of two (a shift); products as sums of shifted copies. Unsigned integers only. The
 * two numbers are drawn first, the columns and the answer are computed from them.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Opt, binTex, choiceViolations, choose, numTex, sameValue, shuffle, table, toBase, tx, valueOpt } from '../inf-basi';

export const ID = 'inf-aritmetica-binaria';

const bit = (n: number, i: number) => (n >> i) & 1;
const ones = (n: number) => [...toBase(n, 2)].filter((c) => c === '1').length;

/** carry[i] is the carry that enters column i (column 0 is the rightmost). */
export function carries(a: number, b: number, width: number): number[] {
	const c = [0];
	for (let i = 0; i < width; i++) c.push(bit(a, i) + bit(b, i) + c[i] >= 2 ? 1 : 0);
	return c;
}
/** Distractors as long as the result, or one bit off: a much shorter number is discarded at a glance. */
const plausible = (n: number, cands: Opt[]): Opt[] => cands.filter((o) => o && Math.abs(o.values[0].length - toBase(n, 2).length) <= 1);
const hasCarry = (a: number, b: number) => (a & b) !== 0;
/** A column with 1 + 1 and a carry coming in. */
const hasTriple = (a: number, b: number) => {
	const c = carries(a, b, 12);
	return c.some((ci, i) => ci === 1 && bit(a, i) === 1 && bit(b, i) === 1);
};

/**
 * The addition in columns: the carries in small above, the two numbers, the sum. `width` is the number of columns;
 * `pad` writes the leading zeros of the addends (a register) up to that many bits.
 */
function additionTable(a: number, b: number, width: number, pad = 0): string {
	const c = carries(a, b, width);
	const cols = Array.from({ length: width }, (_, k) => width - 1 - k);
	const digit = (n: number, i: number, len: number) => (i < len ? String(bit(n, i)) : '');
	const la = Math.max(pad, toBase(a, 2).length), lb = Math.max(pad, toBase(b, 2).length);
	const s = a + b;
	return table(
		`r${'c'.repeat(width)}`,
		[
			['', ...cols.map((i) => (c[i] ? '\\scriptstyle 1' : ''))],
			['', ...cols.map((i) => digit(a, i, la))],
			['+', ...cols.map((i) => digit(b, i, lb))],
			['', ...cols.map((i) => digit(s, i, width))],
		],
		[2],
	);
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: additions

function addition(rng: Rng, level: 1 | 2): Sample {
	for (;;) {
		const [a, b] = level === 1 ? [rng.int(2, 31), rng.int(2, 31)] : [rng.int(16, 255), rng.int(16, 255)];
		if (!hasCarry(a, b)) continue;
		if (level === 1 ? hasTriple(a, b) : !hasTriple(a, b)) continue;
		const s = a + b;
		const width = toBase(s, 2).length;
		const cands: Opt[] = shuffle(rng, [
			valueOpt(a ^ b, 2), // no carry at all: 1 + 1 written as 0
			valueOpt(a | b, 2), // 1 + 1 written as 1
			level === 2 ? valueOpt(s - 2 * (a & b & (carries(a, b, 12).reduce((m, ci, i) => m | (ci << i), 0))), 2) : null, // 1 + 1 + 1 written as 1 without its carry
			width > Math.max(toBase(a, 2).length, toBase(b, 2).length) ? valueOpt(s ^ (1 << (width - 1)) || null, 2) : null, // the last carry not written
		]);
		const fill = shuffle(rng, [s + 2, s - 2, s ^ 4, s + 1, s - 1, s ^ 8]).map((x) => valueOpt(x, 2));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, valueOpt(s, 2)!, plausible(s, [...cands, ...fill]), sameValue(2));
		} catch {
			continue;
		}
		const problem = `${binTex(a)} + ${binTex(b)}`;
		return {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: 'Calcola la somma in binario.',
			problem,
			solution: `${problem} = ${binTex(s)}`,
			steps: [
				tx(`Metti i numeri in colonna, allineati a destra, e somma da destra: $1 + 1 = 10_2$, scrivi $0$ e riporti $1$${level === 2 ? '; $1 + 1 + 1 = 11_2$, scrivi $1$ e riporti $1$' : ''}. I riporti sono scritti in piccolo sopra la colonna in cui entrano.`),
				additionTable(a, b, width),
				tx(`Il risultato è $${binTex(s)}$.`),
				tx(`Controllo in base dieci: $${a} + ${b} = ${s}$.`),
			],
			answer: choice,
			params: { a: toBase(a, 2), b: toBase(b, 2), sum: toBase(s, 2) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: overflow in a register

const FLAG = { si: 'con traboccamento', no: 'senza traboccamento' } as const;
type Flag = keyof typeof FLAG;

const registerOpt = (bits: string, flag: Flag): ChoiceOption => ({ latex: `\\begin{gathered} ${numTex(bits, 2)} \\\\ \\text{${FLAG[flag]}} \\end{gathered}`, values: [bits, flag] });

function overflow(rng: Rng): Sample {
	const wantOverflow = rng.next() < 0.5;
	for (;;) {
		const n = rng.pick([4, 8]);
		const max = 2 ** n - 1;
		const a = rng.int(n === 4 ? 3 : 20, max), b = rng.int(n === 4 ? 3 : 20, max);
		const s = a + b;
		if (s > max !== wantOverflow || !hasCarry(a, b)) continue;
		const kept = s & max;
		if (wantOverflow && kept === 0 && rng.next() < 0.8) continue;
		const pad = (x: number) => toBase(x, 2, n);
		const right = registerOpt(pad(kept), wantOverflow ? 'si' : 'no');
		const cands: ChoiceOption[] = wantOverflow
			? [
					registerOpt(pad(kept), 'no'), // the lost carry not noticed
					registerOpt(toBase(s, 2), 'no'), // one bit more than the register has
					registerOpt(pad(max), 'si'), // the register "stops at the maximum"
					registerOpt(pad((a ^ b) & max), 'no'),
				]
			: [
					registerOpt(pad(s), 'si'), // any carry taken for an overflow
					registerOpt(pad(a ^ b), 'no'), // carries forgotten
					registerOpt(pad(s ^ (1 << rng.int(1, n - 2))), 'no'),
					registerOpt(pad(a ^ b), 'si'),
				];
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, right, cands);
		} catch {
			continue;
		}
		const problem = `${numTex(pad(a), 2)} + ${numTex(pad(b), 2)}`;
		const width = wantOverflow ? n + 1 : n;
		return {
			generatorId: ID,
			level: 3,
			seed: rng.seed,
			prompt: `Un registro di ${n} bit somma i due numeri senza segno. Che cosa contiene alla fine?`,
			problem,
			solution: right.latex,
			steps: [
				tx(`Somma in colonna, con i riporti in piccolo:`),
				additionTable(a, b, width, n),
				wantOverflow
					? tx(`La somma ha $${n + 1}$ bit, ma il registro ne ha $${n}$: il riporto dell'ultima colonna si perde e nel registro restano gli ultimi $${n}$ bit, $${numTex(pad(kept), 2)}$. C'è traboccamento.`)
					: tx(`L'ultima colonna a sinistra non dà riporto: la somma sta in $${n}$ bit e il registro contiene $${numTex(pad(kept), 2)}$. Non c'è traboccamento.`),
				wantOverflow
					? tx(`In base dieci: $${a} + ${b} = ${s}$, più del massimo $${max}$ che sta in $${n}$ bit. Nel registro resta $${s} - ${max + 1} = ${kept}$.`)
					: tx(`In base dieci: $${a} + ${b} = ${s}$, che non supera il massimo $${max}$.`),
			],
			answer: choice,
			params: { bits: n, a: pad(a), b: pad(b), case: wantOverflow ? 'trabocca' : 'non-trabocca' },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: products by a power of two

function shiftProduct(rng: Rng): Sample {
	for (;;) {
		const a = rng.int(5, 63);
		const k = rng.int(1, 4);
		if (ones(a) < 2) continue;
		const p = a * 2 ** k;
		if (p > 1023) continue;
		const cands: Opt[] = shuffle(rng, [
			valueOpt(a * 2 ** (k + 1), 2), // one zero too many: the digits of the multiplier counted
			k > 1 ? valueOpt(a * 2 ** (k - 1), 2) : null,
			valueOpt(a + 2 ** k, 2), // added instead of multiplied
			valueOpt(a * 2 ** k + 2 ** k - 1, 2), // ones added instead of zeros
		]);
		const fill = shuffle(rng, [p + 1, p + 2 ** k, a * 2 ** (k + 2), p ^ (1 << k)]).map((x) => valueOpt(x, 2));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, valueOpt(p, 2)!, plausible(p, [...cands, ...fill]), sameValue(2));
		} catch {
			continue;
		}
		const problem = `${binTex(a)} \\cdot ${binTex(2 ** k)}`;
		return {
			generatorId: ID,
			level: 4,
			seed: rng.seed,
			prompt: 'Calcola il prodotto in binario.',
			problem,
			solution: `${problem} = ${binTex(p)}`,
			steps: [
				tx(`$${binTex(2 ** k)}$ è $1$ seguito da $${k}$ ${k === 1 ? 'zero' : 'zeri'}, cioè $2^${k} = ${2 ** k}$.`),
				tx(`Moltiplicare per $2^${k}$ sposta le cifre di $${k}$ ${k === 1 ? 'posto' : 'posti'} a sinistra: ${k === 1 ? 'si aggiunge uno zero' : `si aggiungono $${k}$ zeri`} a destra. $${binTex(a)} \\cdot ${binTex(2 ** k)} = ${binTex(p)}$.`),
				tx(`Controllo in base dieci: $${a} \\cdot ${2 ** k} = ${p}$.`),
			],
			answer: choice,
			params: { a: toBase(a, 2), b: toBase(2 ** k, 2), product: toBase(p, 2) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: products as sums of shifted copies

function product(rng: Rng): Sample {
	for (;;) {
		const a = rng.int(5, 31), b = rng.int(5, 15);
		if (ones(b) < 2 || ones(a) < 2) continue;
		const p = a * b;
		if (p > 511) continue;
		const positions = [...Array(4).keys()].filter((i) => bit(b, i) === 1);
		const partials = positions.map((i) => a << i);
		const cands: Opt[] = shuffle(rng, [
			valueOpt(a * positions.length, 2), // copies not shifted
			valueOpt(partials.reduce((x, y) => x ^ y, 0), 2), // copies added without carries
			valueOpt(p - partials[0], 2), // one copy forgotten
			valueOpt(p - partials.at(-1)! + (partials.at(-1)! >> 1), 2), // the last copy shifted one place too few
		]);
		const fill = shuffle(rng, [p + 2, p - 2, p ^ 4, p + a, p ^ 8]).map((x) => valueOpt(x, 2));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, valueOpt(p, 2)!, plausible(p, [...cands, ...fill]), sameValue(2));
		} catch {
			continue;
		}
		const problem = `${binTex(a)} \\cdot ${binTex(b)}`;
		const list = positions.map((i, j) => `posizione $${i}$: $${toBase(partials[j], 2)}$`).join('; ');
		const column = table('r', [[toBase(a, 2)], [`\\cdot\\ ${toBase(b, 2)}`], ...partials.map((x) => [toBase(x, 2)]), [toBase(p, 2)]], [1, 1 + partials.length]);
		return {
			generatorId: ID,
			level: 5,
			seed: rng.seed,
			prompt: 'Calcola il prodotto in binario.',
			problem,
			solution: `${problem} = ${binTex(p)}`,
			steps: [
				tx(`Guarda i bit del moltiplicatore $${binTex(b)}$ da destra: per ogni bit $1$ scrivi una copia di $${binTex(a)}$ spostata a sinistra di tanti posti quanti ne dice la posizione del bit; per ogni bit $0$ non scrivi niente. Qui: ${list}.`),
				tx(`Somma le copie in colonna:`),
				column,
				tx(`Il risultato è $${binTex(p)}$. Controllo in base dieci: $${a} \\cdot ${b} = ${p}$.`),
			],
			answer: choice,
			params: { a: toBase(a, 2), b: toBase(b, 2), product: toBase(p, 2) },
		};
	}
}

// ---------------------------------------------------------------------------

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
	const a = parseInt(String(p.a), 2), b = parseInt(String(p.b), 2);
	const binaryIs = (n: number) => {
		v.push(...choiceViolations(sample.answer.kind === 'choice' ? sample.answer : undefined, toBase(n, 2)));
		if (sample.answer.kind === 'choice' && new Set(sample.answer.options.map((o) => parseInt(o.values[0], 2))).size !== 4) v.push('due opzioni sono lo stesso numero');
	};
	switch (sample.level) {
		case 1:
		case 2: {
			if (!hasCarry(a, b)) v.push('nessun riporto');
			if (sample.level === 1 ? hasTriple(a, b) || a > 31 || b > 31 || a < 2 || b < 2 : !hasTriple(a, b) || a > 255 || b > 255 || a < 16 || b < 16) v.push('addendi fuori dal livello');
			if (sample.problem !== `${binTex(a)} + ${binTex(b)}`) v.push('il testo non corrisponde ai parametri');
			binaryIs(a + b);
			break;
		}
		case 3: {
			const n = Number(p.bits);
			if (![4, 8].includes(n) || String(p.a).length !== n || String(p.b).length !== n) v.push('registro o addendi non validi');
			if (!hasCarry(a, b)) v.push('nessun riporto');
			const s = a + b, max = 2 ** n - 1;
			if ((s > max) !== (p.case === 'trabocca')) v.push('caso sbagliato');
			v.push(...choiceViolations(sample.answer, `${toBase(s & max, 2, n)}|${s > max ? 'si' : 'no'}`));
			break;
		}
		case 4: {
			if (ones(b) !== 1 || b < 2 || b > 16 || a < 5 || a > 63 || ones(a) < 2 || a * b > 1023) v.push('fattori fuori dal livello');
			if (sample.problem !== `${binTex(a)} \\cdot ${binTex(b)}`) v.push('il testo non corrisponde ai parametri');
			binaryIs(a * b);
			break;
		}
		case 5: {
			if (ones(b) < 2 || ones(a) < 2 || a < 5 || a > 31 || b < 5 || b > 15 || a * b > 511) v.push('fattori fuori dal livello');
			if (sample.problem !== `${binTex(a)} \\cdot ${binTex(b)}`) v.push('il testo non corrisponde ai parametri');
			binaryIs(a * b);
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export const infAritmeticaBinaria: Generator = {
	id: ID,
	title: 'Addizione e moltiplicazione in binario',
	levels: {
		1: { label: 'Addizioni con il riporto', constraints: ['addendi da 2 a 5 bit', 'almeno un riporto, nessuna colonna 1 + 1 + 1'] },
		2: { label: 'Addizioni con riporti in catena', constraints: ['addendi da 5 a 8 bit', 'almeno una colonna 1 + 1 + 1'] },
		3: { label: 'Il traboccamento', constraints: ['registro di 4 o 8 bit, addendi scritti con tutti i bit', 'metà delle somme trabocca'] },
		4: { label: 'Moltiplicare per una potenza di due', constraints: ['moltiplicatore 10, 100, 1000 o 10000', 'prodotto fino a 10 bit'] },
		5: { label: 'Moltiplicazioni in colonna', constraints: ['moltiplicando da 3 a 5 bit, moltiplicatore da 3 a 4 bit con almeno due 1', 'prodotto fino a 9 bit'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 200; attempt++) {
			let s: Sample;
			switch (level) {
				case 1:
				case 2:
					s = addition(rng, level);
					break;
				case 3:
					s = overflow(rng);
					break;
				case 4:
					s = shiftProduct(rng);
					break;
				case 5:
					s = product(rng);
					break;
				default:
					throw new Error(`${ID}: unknown level ${level}`);
			}
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice: (sample: Sample) => sample.answer as ChoiceAnswer,
};

export default infAritmeticaBinaria;
