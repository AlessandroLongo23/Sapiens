/**
 * Conversioni tra binario e decimale. Spec: specs/exercises/inf-binario-decimale.md
 *
 * Five levels in the order of the lesson (docs/lezioni/informatica/riscritte/05-inf-binario-decimale.md): from binary
 * to decimal with the weights, short numbers and then up to 10 bits; from decimal to binary with the successive
 * divisions (numbers up to 127) and by subtracting the powers of two (up to 1023); how many bits a number needs and
 * what n bits can hold. Unsigned integers only. The number is drawn first; both writings come from it.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { type Opt, binTex, choiceViolations, choose, divisionTable, divisions, near, numOpt, sameValue, shuffle, toBase, tx, valueOpt, weightsTable } from '../inf-basi';

export const ID = 'inf-binario-decimale';

const ones = (bits: string) => [...bits].filter((c) => c === '1').length;
const pw2 = (k: number) => (k < 10 ? `2^${k}` : `2^{${k}}`);
const reversed = (bits: string) => [...bits].reverse().join('');
/** The weights of the bits that are 1, largest first. */
const weightsOf = (bits: string) => [...bits].map((c, i) => (c === '1' ? 2 ** (bits.length - 1 - i) : 0)).filter((w) => w > 0);

// ---------------------------------------------------------------------------
// Levels 1 and 2: from binary to decimal

function toDecimal(rng: Rng, level: 1 | 2): Sample {
	for (;;) {
		const n = level === 1 ? rng.int(8, 127) : rng.int(128, 1023);
		const bits = toBase(n, 2);
		if (ones(bits) < 2) continue;
		if (ones(bits) === bits.length && rng.next() < 0.5) continue; // all ones: a few, they are the 2^n - 1 of the lesson
		const ws = weightsOf(bits);
		return {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: 'Converti in base dieci.',
			problem: binTex(n),
			solution: `${binTex(n)} = ${n}_{10}`,
			steps: [
				tx(`Scrivi sopra ogni bit il peso della sua posizione: le potenze di due, da destra, partendo da $1$.`),
				weightsTable(bits, 2),
				tx(`Somma i pesi dei bit che valgono $1$: $${ws.join(' + ')} = ${n}$.`),
			],
			answer: { kind: 'number', value: String(n) },
			params: { bits, value: String(n) },
		};
	}
}

function toDecimalChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const bits = String(sample.params.bits);
	const n = parseInt(bits, 2);
	const ws = weightsOf(bits);
	const cands: Opt[] = [
		numOpt(parseInt(reversed(bits), 2)), // weights from the left
		numOpt(2 * n), // weights from 2 instead of 1
		numOpt(n - ws.at(-1)!), // the last 1 forgotten
		numOpt([...bits].reduce((a, c, i) => a + (c === '1' ? bits.length - i : 0), 0)), // positions added instead of weights
		numOpt(n - ws[0] + ws[0] / 2), // the first weight wrong by one position
		...near(rng, n).map(numOpt),
	];
	return choose(rng, numOpt(n)!, cands);
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: from decimal to binary

function toBinary(rng: Rng, level: 3 | 4): Sample {
	for (;;) {
		const n = level === 3 ? rng.int(8, 127) : rng.int(128, 1023);
		const bits = toBase(n, 2);
		if (ones(bits) < 2 && rng.next() < 0.8) continue; // a few powers of two
		const right = valueOpt(n, 2)!;
		const cands: Opt[] = shuffle(rng, [
			n % 2 === 1 && bits !== reversed(bits) ? valueOpt(parseInt(reversed(bits), 2), 2) : null, // remainders read from the top
			bits[1] === '1' ? valueOpt(parseInt(bits.slice(1), 2), 2) : null, // the last division forgotten
			valueOpt(n ^ (1 << rng.int(1, bits.length - 2)), 2), // one bit wrong
		]);
		const fill: Opt[] = shuffle(rng, [n + 1, n - 1, 2 * n, Math.floor(n / 2), n ^ 1 ^ 2, n + 2]).map((x) => valueOpt(x, 2));
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, right, [...cands, ...fill], sameValue(2));
		} catch {
			continue;
		}
		const ws = weightsOf(bits);
		const check = tx(`Controllo con i pesi: $${ws.join(' + ')} = ${n}$.`);
		let steps: string[];
		if (level === 3) {
			const rems = divisions(n, 2).map((d) => d.r);
			steps = [
				tx(`Dividi per $2$ finché il quoziente diventa $0$, segnando ogni resto:`),
				divisionTable(n, 2),
				tx(`Leggi i resti dal basso verso l'alto: $${[...rems].reverse().join('\\ ')}$. Quindi $${n} = ${binTex(n)}$.`),
				check,
			];
		} else {
			const top = 2 ** (bits.length - 1);
			let rest = n;
			const walk = [...bits].map((c, i) => {
				const w = 2 ** (bits.length - 1 - i);
				if (c === '1') {
					rest -= w;
					return `$${w}$ sì, resta $${rest}$`;
				}
				return `$${w}$ no`;
			});
			steps = [
				tx(`La più grande potenza di due che non supera $${n}$ è $${pw2(bits.length - 1)} = ${top}$: servono $${bits.length}$ bit.`),
				tx(`Scendi lungo le potenze di due e sottrai quelle che ci stanno: ${walk.join('; ')}.`),
				tx(`Scrivi $1$ per ogni sì e $0$ per ogni no: $${n} = ${binTex(n)}$.`),
				check,
			];
		}
		return {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: 'Converti in binario.',
			problem: String(n),
			solution: `${n}_{10} = ${binTex(n)}`,
			steps,
			answer: choice,
			params: { value: String(n), bits },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: how many bits

type L5Case = 'bit-necessari' | 'massimo' | 'quanti';

function howManyBits(rng: Rng): Sample {
	const u = rng.next();
	const c: L5Case = u < 0.6 ? 'bit-necessari' : u < 0.8 ? 'massimo' : 'quanti';
	const base = { generatorId: ID, level: 5, seed: rng.seed };
	if (c === 'bit-necessari') {
		// the numbers around a power of two are the ones that go wrong: 255 needs 8 bits, 256 needs 9
		const k0 = rng.int(3, 9);
		const n = rng.next() < 0.4 ? 2 ** k0 + rng.pick([-1, 0, 1]) : rng.int(5, 1023);
		const k = toBase(n, 2).length;
		return {
			...base,
			prompt: 'Quanti bit servono, come minimo, per scrivere il numero in binario?',
			problem: String(n),
			solution: `${k}\\ \\text{bit}`,
			steps: [
				tx(`Con $n$ bit si scrivono i numeri da $0$ a $2^n - 1$.`),
				tx(`Con $${k - 1}$ bit si arriva fino a $${pw2(k - 1)} - 1 = ${2 ** (k - 1) - 1}$, che è meno di $${n}$: non bastano.`),
				tx(`Con $${k}$ bit si arriva fino a $${pw2(k)} - 1 = ${2 ** k - 1}$: $${n}$ ci sta. Servono $${k}$ bit, e infatti $${n} = ${binTex(n)}$.`),
			],
			answer: { kind: 'number', value: String(k) },
			params: { case: c, number: String(n), value: String(k) },
		};
	}
	const n = rng.int(2, 10);
	if (c === 'massimo') {
		const v = 2 ** n - 1;
		return {
			...base,
			prompt: 'Qual è il numero più grande che si può scrivere con questi bit? Rispondi in base dieci.',
			problem: `${n}\\ \\text{bit}`,
			solution: `${pw2(n)} - 1 = ${v}`,
			steps: [
				tx(`Il numero più grande ha tutti i bit a $1$: $${binTex(v)}$.`),
				tx(`Aggiungendo $1$ si ottiene $1$ seguito da $${n}$ zeri, cioè $${pw2(n)} = ${2 ** n}$: il numero cercato è $${pw2(n)} - 1 = ${v}$.`),
			],
			answer: { kind: 'number', value: String(v) },
			params: { case: c, bits: String(n), value: String(v) },
		};
	}
	const v = 2 ** n;
	return {
		...base,
		prompt: 'Quanti numeri diversi si possono scrivere con questi bit?',
		problem: `${n}\\ \\text{bit}`,
		solution: `${pw2(n)} = ${v}`,
		steps: [
			tx(`Ogni bit può valere $0$ oppure $1$: due possibilità per ognuno degli $${n}$ bit.`),
			tx(`Le combinazioni sono $${Array(Math.min(n, 4)).fill('2').join(' \\cdot ')}${n > 4 ? ' \\cdot \\ldots' : ''} = ${pw2(n)} = ${v}$: i numeri da $0$ a $${v - 1}$.`),
		],
		answer: { kind: 'number', value: String(v) },
		params: { case: c, bits: String(n), value: String(v) },
	};
}

function howManyBitsChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const c = sample.params.case as L5Case;
	const v = Number(sample.params.value);
	let cands: Opt[];
	if (c === 'bit-necessari') {
		const n = Number(sample.params.number);
		// one bit too few (256 "fits" in 8 bits), one too many, the decimal digits, the ones of the number
		cands = [numOpt(v - 1), numOpt(v + 1), numOpt(String(n).length), numOpt(ones(toBase(n, 2))), numOpt(v + 2), numOpt(v - 2)];
	} else {
		const n = Number(sample.params.bits);
		cands = c === 'massimo' ? [numOpt(2 ** n), numOpt(2 ** (n - 1)), numOpt(2 * n), numOpt(2 ** (n - 1) - 1), numOpt(2 ** (n + 1) - 1), numOpt(n * n)] : [numOpt(2 ** n - 1), numOpt(2 * n), numOpt(2 ** (n - 1)), numOpt(n * n), numOpt(2 ** (n + 1)), numOpt(2 ** n + 1)];
	}
	return choose(rng, numOpt(v)!, [...cands, ...near(rng, v).map(numOpt)]);
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
		case 1:
		case 2: {
			const bits = String(p.bits);
			const n = parseInt(bits, 2);
			if (!/^1[01]*$/.test(bits)) v.push('bit non validi');
			if (sample.level === 1 ? n < 8 || n > 127 : n < 128 || n > 1023) v.push('numero fuori dal livello');
			if (ones(bits) < 2) v.push('serve più di un bit a 1');
			if (sample.problem !== binTex(n)) v.push('il testo non corrisponde ai parametri');
			numberIs(n);
			break;
		}
		case 3:
		case 4: {
			if (sample.answer.kind !== 'choice') return ['risposta non a scelta'];
			const n = Number(p.value);
			if (sample.level === 3 ? n < 8 || n > 127 : n < 128 || n > 1023) v.push('numero fuori dal livello');
			if (sample.problem !== String(n)) v.push('il testo non corrisponde ai parametri');
			v.push(...choiceViolations(sample.answer, toBase(n, 2)));
			if (new Set(sample.answer.options.map((o) => parseInt(o.values[0], 2))).size !== 4) v.push('due opzioni sono lo stesso numero');
			break;
		}
		case 5: {
			if (p.case === 'bit-necessari') {
				const n = Number(p.number);
				if (n < 5 || n > 1023) v.push('numero fuori misura');
				numberIs(toBase(n, 2).length);
			} else {
				const n = Number(p.bits);
				if (n < 2 || n > 10) v.push('bit fuori misura');
				numberIs(p.case === 'massimo' ? 2 ** n - 1 : 2 ** n);
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
	return sample.level === 5 ? howManyBitsChoice(sample, rng) : toDecimalChoice(sample, rng);
}

export const infBinarioDecimale: Generator = {
	id: ID,
	title: 'Conversioni tra binario e decimale',
	levels: {
		1: { label: 'Da binario a decimale, fino a 7 bit', constraints: ['numeri da 8 a 127, almeno due bit a 1'] },
		2: { label: 'Da binario a decimale, fino a 10 bit', constraints: ['numeri da 128 a 1023, bit raggruppati a quattro'] },
		3: { label: 'Da decimale a binario con le divisioni', constraints: ['numeri da 8 a 127', 'risposta a scelta tra quattro numeri binari diversi'] },
		4: { label: 'Da decimale a binario, numeri grandi', constraints: ['numeri da 128 a 1023, soluzione con le potenze di due'] },
		5: { label: 'Quanti bit servono', constraints: ['bit necessari per un numero fino a 1023, spesso vicino a una potenza di due', 'numero più grande e quantità di numeri con n bit, n da 2 a 10'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 200; attempt++) {
			let s: Sample;
			switch (level) {
				case 1:
				case 2:
					s = toDecimal(rng, level);
					break;
				case 3:
				case 4:
					s = toBinary(rng, level);
					break;
				case 5:
					s = howManyBits(rng);
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

export default infBinarioDecimale;
