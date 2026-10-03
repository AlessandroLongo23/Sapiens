/**
 * Numeri interi con segno e complemento a due. Spec: specs/exercises/inf-interi-segno.md
 *
 * Five levels in the order of the lesson (docs/lezioni/informatica/riscritte/08-inf-interi-segno.md): reading a
 * sign-and-magnitude byte; the range of n bits and the bits a number needs; reading a two's complement byte;
 * writing a number (or the opposite of a byte) in two's complement; the sum on 8 bits, with overflow.
 * Every exercise is drawn backwards from the integer it is about.
 */
import type { Rng } from '../types';
import { type Built, bitOpt, bits, bitsTex, chance, choose, defineGenerator, fmtInt, numberBuilt, textBlock, tx } from '../inf-codifica';

export const ID = 'inf-interi-segno';

const invert = (s: string) => [...s].map((c) => (c === '0' ? '1' : '0')).join('');
/** Two's complement of v on 8 bits. */
const c2 = (v: number) => bits(((v % 256) + 256) % 256, 8);
/** Sign and magnitude of v on 8 bits. */
const ms = (v: number) => (v < 0 ? '1' : '0') + bits(Math.abs(v), 7);
const signed = (n: number) => (n < 0 ? `(${fmtInt(n)})` : fmtInt(n));

// ---------------------------------------------------------------------------
// Level 1: reading sign and magnitude

function level1(rng: Rng): Built {
	const u = rng.next();
	const kind = u < 0.06 ? 'zero-negativo' : u < 0.64 ? 'negativo' : 'positivo';
	const m = kind === 'zero-negativo' ? 0 : rng.int(1, 127);
	const sign = kind === 'positivo' ? 0 : 1;
	const s = `${sign}${bits(m, 7)}`;
	const value = sign ? -m : m;
	const unsigned = parseInt(s, 2);
	const wrong = sign ? [unsigned, unsigned - 256, m, -(127 - m), value - 1, value + 1, -128] : [-m, m + 128, m - 128, value + 1, value - 1];
	return numberBuilt(
		{
			prompt: 'Scrivi in base dieci il numero rappresentato.',
			problem: textBlock('Questi 8 bit rappresentano un numero intero in modulo e segno. Quale?', [bitsTex(s)]),
			steps: [
				tx(`Il bit più significativo è $${sign}$: il numero è ${sign ? 'negativo' : 'positivo'}.`),
				tx(`Gli altri 7 bit sono il modulo: $${bitsTex(bits(m, 7))}_2 = ${m}$.`),
				tx(kind === 'zero-negativo' ? 'Il modulo è zero: è lo zero con il segno meno, che vale comunque $0$.' : `Il numero è $${fmtInt(value)}$.`),
			],
			params: { case: kind, bits: s },
		},
		value,
		1,
		wrong,
	);
}

// ---------------------------------------------------------------------------
// Level 2: the range of n bits, the bits a number needs

type RangeCase = 'min-c2' | 'max-c2' | 'quanti-c2' | 'min-ms' | 'max-ms' | 'quanti-ms';
const RANGE_CASES: RangeCase[] = ['min-c2', 'max-c2', 'quanti-c2', 'min-ms', 'max-ms', 'quanti-ms'];
const EDGE = [127, 128, -128, -129, 255, 256, -256, -257, 63, 64, -64, -65, 511, 512, -512, -513, 1023, 1024, -1024, -1025];

/** The fewest bits of a two's complement that holds x. */
export function bitsNeeded(x: number): number {
	let n = 1;
	while (x < -(2 ** (n - 1)) || x > 2 ** (n - 1) - 1) n++;
	return n;
}

function level2(rng: Rng): Built {
	if (chance(rng, 0.5)) {
		const x = chance(rng, 0.3) ? rng.pick(EDGE) : rng.int(5, 2000) * (chance(rng, 0.5) ? -1 : 1);
		const n = bitsNeeded(x);
		const lo = -(2 ** (n - 1));
		const hi = 2 ** (n - 1) - 1;
		return numberBuilt(
			{
				prompt: 'Scrivi il numero di bit.',
				problem: textBlock(`Quanti bit servono, come minimo, per scrivere $${fmtInt(x)}$ in complemento a due?`),
				steps: [
					tx(`Con $n$ bit il complemento a due va da $-2^{n-1}$ a $2^{n-1} - 1$.`),
					tx(`Con $${n - 1}$ bit l'intervallo va da $${fmtInt(-(2 ** (n - 2)))}$ a $${fmtInt(2 ** (n - 2) - 1)}$: $${fmtInt(x)}$ resta fuori.`),
					tx(`Con $${n}$ bit va da $${fmtInt(lo)}$ a $${fmtInt(hi)}$: $${fmtInt(x)}$ ci sta. Servono $${n}$ bit.`),
				],
				params: { case: 'bit-minimi', x },
			},
			n,
			1,
			[n - 1, n + 1, n - 2, n + 2],
		);
	}
	const kind = rng.pick(RANGE_CASES);
	const n = rng.int(3, 16);
	const half = 2 ** (n - 1);
	const c2rep = kind.endsWith('c2');
	const name = c2rep ? 'in complemento a due' : 'in modulo e segno';
	let value: number;
	let question: string;
	let why: string[];
	let wrong: number[];
	if (kind.startsWith('min')) {
		value = c2rep ? -half : -(half - 1);
		question = `Qual è il numero più piccolo che si può scrivere con $${n}$ bit ${name}?`;
		why = c2rep
			? [tx(`Con $n$ bit il complemento a due parte da $-2^{n-1}$.`), tx(`$-2^{${n - 1}} = ${fmtInt(value)}$.`)]
			: [tx(`Un bit va al segno e ne restano $${n - 1}$ per il modulo, che arriva a $2^{${n - 1}} - 1 = ${fmtInt(half - 1)}$.`), tx(`Il numero più piccolo è $${fmtInt(value)}$.`)];
		wrong = [c2rep ? -(half - 1) : -half, -(2 * half), -(2 * half - 1), -n, 0];
	} else if (kind.startsWith('max')) {
		value = half - 1;
		question = `Qual è il numero più grande che si può scrivere con $${n}$ bit ${name}?`;
		why = c2rep
			? [tx(`Con $n$ bit il complemento a due arriva a $2^{n-1} - 1$.`), tx(`$2^{${n - 1}} - 1 = ${fmtInt(value)}$.`)]
			: [tx(`Un bit va al segno e ne restano $${n - 1}$ per il modulo.`), tx(`Il modulo più grande è $2^{${n - 1}} - 1 = ${fmtInt(value)}$.`)];
		wrong = [half, 2 * half - 1, 2 * half, half - 2];
	} else {
		value = c2rep ? 2 * half : 2 * half - 1;
		question = `Quanti numeri interi diversi si possono scrivere con $${n}$ bit ${name}?`;
		why = c2rep
			? [tx(`Le sequenze di $${n}$ bit sono $2^{${n}} = ${fmtInt(2 * half)}$, e ognuna rappresenta un numero diverso.`)]
			: [tx(`Le sequenze di $${n}$ bit sono $2^{${n}} = ${fmtInt(2 * half)}$, ma due rappresentano lo zero.`), tx(`I numeri diversi sono $${fmtInt(2 * half)} - 1 = ${fmtInt(value)}$.`)];
		wrong = [c2rep ? 2 * half - 1 : 2 * half, half, half - 1, 2 * n, 2 * half - 2];
	}
	return numberBuilt({ prompt: 'Scrivi il numero in base dieci.', problem: textBlock(question), steps: why, params: { case: kind, n } }, value, 1, wrong);
}

// ---------------------------------------------------------------------------
// Level 3: reading two's complement

function level3(rng: Rng): Built {
	const negative = chance(rng, 0.75);
	const v = negative ? rng.int(-128, -1) : rng.int(1, 127);
	const s = c2(v);
	const u = parseInt(s, 2);
	const steps = negative
		? [
				tx(`Il bit più significativo è $1$: il numero è negativo.`),
				v === -128
					? tx(`Il bit più significativo pesa $-128$ e gli altri sono tutti $0$: il numero è $-128$.`)
					: tx(`Inverti i bit e somma $1$: $${bitsTex(invert(s))} + 1 = ${bitsTex(c2(-v))}$, che vale $${-v}$.`),
				tx(`Il numero è $${v}$. Controllo con i pesi: $-128 + ${u - 128} = ${v}$.`),
			]
		: [tx(`Il bit più significativo è $0$: il numero è positivo e si legge come un numero binario.`), tx(`$${bitsTex(s)}_2 = ${v}$.`)];
	const wrong = negative ? [u, -(u - 128), v + 1, -v, v - 1, v + 2] : [-v, v - 128, -(128 - v), v + 1, v - 1];
	return numberBuilt(
		{
			prompt: 'Scrivi in base dieci il numero rappresentato.',
			problem: textBlock('Questi 8 bit rappresentano un numero intero in complemento a due. Quale?', [bitsTex(s)]),
			steps,
			params: { case: negative ? 'negativo' : 'positivo', bits: s },
		},
		v,
		1,
		wrong,
	);
}

// ---------------------------------------------------------------------------
// Level 4: writing two's complement, the opposite

function level4(rng: Rng): Built {
	if (chance(rng, 0.35)) {
		// the opposite of a byte
		let y = rng.int(-127, 127);
		if (y === 0) y = 96;
		const s = c2(y);
		const right = c2(-y);
		const inv = invert(s);
		const wrong = [inv, (s[0] === '0' ? '1' : '0') + s.slice(1), c2(-y + 1), c2(-y - 1), invert(right)].filter((w) => w !== s);
		return {
			prompt: "Scegli la sequenza di 8 bit che rappresenta l'opposto.",
			problem: textBlock('Questi 8 bit sono un numero in complemento a due. Quale sequenza rappresenta il suo opposto?', [bitsTex(s)]),
			solution: bitsTex(right),
			steps: [tx(`Inverti tutti i bit: $${bitsTex(inv)}$.`), tx(`Somma $1$: $${bitsTex(inv)} + 1 = ${bitsTex(right)}$.`), tx(`Controllo: la sequenza data vale $${y}$, quella trovata vale $${-y}$.`)],
			answer: choose(rng, bitOpt(right), wrong.map(bitOpt)),
			params: { case: 'opposto', bits: s },
		};
	}
	const negative = chance(rng, 0.8);
	const x = negative ? rng.int(-128, -1) : rng.int(1, 127);
	const right = c2(x);
	const a = Math.abs(x);
	const pos = bits(a, 8);
	const wrong = negative
		? [x === -128 ? '11111111' : ms(x), invert(pos), pos, c2(x + 1), c2(x - 1)]
		: ['1' + right.slice(1), c2(-x), invert(right), bits(x + 1, 8), bits(x - 1, 8)];
	const steps = negative
		? [tx(`Scrivi $${a}$ in binario su 8 bit: $${bitsTex(pos)}$.`), tx(`Inverti tutti i bit: $${bitsTex(invert(pos))}$.`), tx(`Somma $1$: $${bitsTex(right)}$.`)]
		: [tx(`Un numero positivo si scrive in binario, con gli zeri davanti fino a 8 bit.`), tx(`$${x} = ${bitsTex(right)}_2$: il bit più significativo è $0$.`)];
	return {
		prompt: 'Scegli la sequenza di 8 bit.',
		problem: textBlock(`Come si scrive $${x}$ in complemento a due su 8 bit?`),
		solution: bitsTex(right),
		steps,
		answer: choose(rng, bitOpt(right), wrong.map(bitOpt)),
		params: { case: negative ? 'negativo' : 'positivo', x },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the sum on 8 bits

function level5(rng: Rng): Built {
	const u = rng.next();
	const kind = u < 0.4 ? 'senza' : u < 0.7 ? 'oltre il massimo' : 'sotto il minimo';
	let a: number;
	let b: number;
	if (kind === 'senza') {
		do {
			a = rng.int(-120, 120);
			b = rng.int(-120, 120);
		} while (a === 0 || b === 0 || a + b < -128 || a + b > 127 || a === -b);
	} else if (kind === 'oltre il massimo') {
		a = rng.int(20, 127);
		b = rng.int(128 - a, 127);
	} else {
		a = rng.int(-128, -20);
		b = rng.int(-128, -129 - a);
	}
	const sum = a + b;
	const got = ((((sum + 128) % 256) + 256) % 256) - 128;
	const overflow = got !== sum;
	const wrong = overflow ? [sum, sum > 0 ? sum - 128 : sum + 128, -got, sum > 0 ? 127 : -128, got + 1, got - 1] : [sum > 0 ? sum - 256 : sum + 256, -sum, a - b, sum + 1, sum - 1];
	const steps = overflow
		? [
				tx(`La somma vera è $${a} + ${signed(b)} = ${sum}$, fuori dall'intervallo da $-128$ a $127$: c'è traboccamento.`),
				tx(`Gli 8 bit tengono solo il resto: il risultato si sposta di $256$.`),
				tx(`$${sum} ${sum > 0 ? '-' : '+'} 256 = ${got}$. Il calcolatore ottiene $${got}$, che è sbagliato.`),
			]
		: [tx(`La somma vera è $${a} + ${signed(b)} = ${sum}$.`), tx(`$${sum}$ sta tra $-128$ e $127$: non c'è traboccamento e il calcolatore ottiene $${sum}$.`)];
	return numberBuilt(
		{
			prompt: 'Scrivi in base dieci il numero che il calcolatore ottiene.',
			problem: textBlock(`Un calcolatore somma $${a}$ e $${b}$ su 8 bit in complemento a due. Che numero ottiene? Se c'è traboccamento, scrivi il risultato sbagliato che resta negli 8 bit.`),
			steps,
			params: { case: kind, a, b },
		},
		got,
		1,
		wrong,
	);
}

export const infInteriSegno = defineGenerator(ID, 'Numeri interi con segno e complemento a due', {
	1: { label: 'Leggere modulo e segno', constraints: ['8 bit in modulo e segno, il numero in base dieci', 'circa 6 su 10 negativi, ogni tanto lo zero negativo'], make: level1 },
	2: {
		label: 'Intervallo dei valori e bit necessari',
		constraints: ['minimo, massimo e quanti numeri con n bit (da 3 a 16) in modulo e segno e in complemento a due', 'metà degli esercizi: i bit che servono per un numero tra -2000 e 2000'],
		make: level2,
	},
	3: { label: 'Leggere il complemento a due', constraints: ['8 bit in complemento a due, il numero in base dieci', 'circa 3 su 4 negativi, compreso -128'], make: level3 },
	4: {
		label: 'Scrivere in complemento a due',
		constraints: ['un numero da -128 a 127 su 8 bit, circa 4 su 5 negativi', "circa 1 su 3: l'opposto di una sequenza data (mai -128 e mai 0)"],
		make: level4,
		check(s) {
			const p = s.params as { case: string; x?: number; bits?: string };
			if (p.case === 'opposto') return p.bits === '10000000' || p.bits === '00000000' ? ["l'opposto non si scrive o è lo stesso numero"] : [];
			return p.x !== undefined && p.x >= -128 && p.x <= 127 && p.x !== 0 ? [] : ['numero fuori da -128..127'];
		},
	},
	5: {
		label: 'Somma e traboccamento',
		constraints: ['due addendi da -128 a 127', 'circa 4 su 10 senza traboccamento, 3 oltre il massimo, 3 sotto il minimo'],
		make: level5,
		check(s) {
			const { a, b, case: c } = s.params as { a: number; b: number; case: string };
			const v: string[] = [];
			if (a < -128 || a > 127 || b < -128 || b > 127) v.push('addendo fuori da -128..127');
			if ((c === 'senza') !== (a + b >= -128 && a + b <= 127)) v.push('caso sbagliato');
			return v;
		},
	},
});

export default infInteriSegno;
