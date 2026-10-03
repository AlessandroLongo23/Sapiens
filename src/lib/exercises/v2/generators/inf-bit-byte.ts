/**
 * Bit, byte e unità di misura. Spec: specs/exercises/inf-bit-byte.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/03-inf-bit-byte.md): bit and byte;
 * decimal multiples (kB = 1000 B); binary multiples (KiB = 1024 B); how many values n bits or k bytes hold; the
 * time to download a file; data, minutes and speed of a transfer. Every exercise is built backwards from a result
 * that is a whole number or a short decimal, and writes the factor it needs in its text.
 *
 * The answer is always a number (in the unit the question names); the choice shows it with the unit, and its
 * distractors are the mistakes of the lesson: the wrong direction, 1000 for 1024, the factor 8 forgotten.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { Rational, q } from '../rational';
import { BANNED, NAMES, checkChoice, choose, dec, int, numOpt, pw, withUnit } from '../inf-informazione';

export const ID = 'inf-bit-byte';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	value: Rational;
	/** Unit shown in the options (none for a pure count). */
	unit?: string;
	mistakes: Rational[];
	params: Record<string, unknown>;
}

const BYTE = '$1\\,\\text{B} = 8\\,\\text{bit}$';

/** A positive number an option can show: at most four decimals, below 10^13. */
function showable(r: Rational): boolean {
	if (r.sign() <= 0 || r.compare(q(10 ** 13)) >= 0) return false;
	let x = r;
	for (let k = 0; k <= 4; k++) {
		if (x.isInteger()) return true;
		x = x.mul(q(10));
	}
	return false;
}

const pow = (b: number, e: number) => q(b ** e);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Level 1: bit and byte

function level1(rng: Rng): Built {
	const k = rng.int(2, 125);
	const toBit = rng.next() < 0.5;
	const b = 8 * k;
	if (toBit)
		return {
			prompt: 'Converti in bit.',
			problem: textBlock(`Quanti bit sono ${pw(int(k), 'B')}? Ricorda che ${BYTE}.`),
			solution: `${withUnit(int(k), 'B')} = ${withUnit(int(b), 'bit')}`,
			steps: [textBlock('Dai byte ai bit si moltiplica per 8.'), `${k} \\cdot 8 = ${b}`],
			value: q(b),
			unit: 'bit',
			mistakes: [...(k % 8 === 0 ? [q(k, 8)] : []), q(k * 10), q(k + 8), q(k * 4), q(k * 16)],
			params: { case: 'in-bit', given: String(k) },
		};
	return {
		prompt: 'Converti in byte.',
		problem: textBlock(`Quanti byte sono ${pw(int(b), 'bit')}? Ricorda che ${BYTE}.`),
		solution: `${withUnit(int(b), 'bit')} = ${withUnit(int(k), 'B')}`,
		steps: [textBlock('Dai bit ai byte si divide per 8.'), `${b} : 8 = ${k}`],
		value: q(k),
		unit: 'B',
		mistakes: [q(b * 8), ...(k % 5 === 0 ? [q(b, 10)] : []), q(b - 8), q(b, 4), ...(k % 2 === 0 ? [q(b, 16)] : [])],
		params: { case: 'in-byte', given: String(b) },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: decimal and binary multiples

const DECIMAL = ['B', 'kB', 'MB', 'GB', 'TB'];
const BINARY = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

function convert(units: string[], factor: number, i: number, d: number, s: Rational, toSmaller: boolean): Built {
	const small = units[i];
	const large = units[i + d];
	const name = (u: string) => (u === 'B' ? 'byte' : u);
	const big = s.mul(pow(factor, d));
	const reminders = Array.from({ length: d }, (_, j) => `$1\\,\\text{${units[i + d - j]}} = ${factor}\\,\\text{${units[i + d - j - 1]}}$`).join(' e ');
	const times = Array(d).fill(String(factor));
	const other = factor === 1000 ? 1024 : 1000;
	if (toSmaller)
		return {
			prompt: `Converti in ${name(small)}.`,
			problem: textBlock(`Quanti ${name(small)} sono ${pw(dec(s), large)}? Ricorda che ${reminders}.`),
			solution: `${withUnit(dec(s), large)} = ${withUnit(dec(big), small)}`,
			steps: [textBlock(d === 1 ? `Il ${name(small)} è l'unità più piccola: si moltiplica per ${factor}.` : `Il ${name(small)} è l'unità più piccola e i passi sono due: si moltiplica due volte per ${factor}.`), `${dec(s)} \\cdot ${times.join(' \\cdot ')} = ${dec(big)}`],
			value: big,
			unit: small,
			mistakes: [s.div(pow(factor, d)), s.mul(pow(other, d)), s.mul(pow(factor, d - 1)), s.mul(pow(factor, d + 1)), s.mul(pow(100, d)), s.mul(q(20))],
			params: { case: 'moltiplica', from: large, to: small, given: s.toString(), steps: d },
		};
	return {
		prompt: `Converti in ${name(large)}.`,
		problem: textBlock(`Quanti ${name(large)} sono ${pw(dec(big), small)}? Ricorda che ${reminders}.`),
		solution: `${withUnit(dec(big), small)} = ${withUnit(dec(s), large)}`,
		steps: [textBlock(d === 1 ? `Il ${large} è l'unità più grande: si divide per ${factor}.` : `Il ${large} è l'unità più grande e i passi sono due: si divide due volte per ${factor}.`), `${dec(big)} : ${times.join(' : ')} = ${dec(s)}`],
		value: s,
		unit: large,
		mistakes: [big.mul(pow(factor, d)), big.div(pow(other, d)), big.div(pow(factor, d - 1)), big.div(pow(factor, d + 1)), big.div(pow(100, d)), big.div(q(512))],
		params: { case: 'dividi', from: small, to: large, given: big.toString(), steps: d },
	};
}

function level2(rng: Rng): Built {
	const d = rng.next() < 0.65 ? 1 : 2;
	const i = rng.int(0, 4 - d);
	const k = rng.pick([0, 0, 1, 1, 2]);
	let m: number;
	do m = rng.int(k === 0 ? 2 : 1, d === 2 ? 99 * 10 ** Math.min(k, 1) : 999);
	while (k > 0 && m % 10 === 0);
	return convert(DECIMAL, 1000, i, d, q(m, 10 ** k), rng.next() < 0.5);
}

const BINARY_COUNTS = [q(1, 4), q(1, 2), q(3, 4), q(5, 4), q(3, 2), q(5, 2), q(7, 2), q(9, 2), q(15, 2), q(25, 2)];

function level3(rng: Rng): Built {
	const i = rng.int(0, 3);
	const s = rng.next() < 0.3 ? rng.pick(BINARY_COUNTS) : q(rng.int(2, 40));
	return convert(BINARY, 1024, i, 1, s, rng.next() < 0.5);
}

// ---------------------------------------------------------------------------
// Level 4: how many values

const STORED = ['il livello di un personaggio', 'il numero di vite', 'il punteggio di una partita', 'il numero di passi', "il volume dell'audio", 'la luminosità dello schermo', 'il numero di un canale', 'il numero di messaggi non letti'];

function level4(rng: Rng): Built {
	const what = rng.pick(STORED);
	const inBytes = rng.next() < 0.35;
	const count = inBytes ? rng.int(1, 3) : rng.int(3, 16);
	const n = inBytes ? 8 * count : count;
	const space = `${count} ${inBytes ? 'byte' : 'bit'}`;
	const all = 2 ** n;
	const max = rng.next() < 0.5;
	const first = inBytes ? [textBlock(`${cap(space)} sono $${count} \\cdot 8 = ${n}$ bit.`)] : [];
	if (max)
		return {
			prompt: 'Trova il valore più grande.',
			problem: textBlock(`Un programma conserva ${what} in ${space}, come numero intero a partire da 0. Qual è il valore più grande che può conservare?`),
			solution: `2^{${n}} - 1 = ${int(all - 1)}`,
			steps: [...first, textBlock(`Con ${n} bit i valori diversi sono $2^{${n}} = ${int(all)}$.`), textBlock(`Uno dei valori è lo zero, quindi il più grande è $${int(all)} - 1 = ${int(all - 1)}$.`)],
			value: q(all - 1),
			mistakes: [q(all), q(all / 2), q(2 * n), q(all + 1), q(all / 2 - 1), ...(inBytes ? [q(2 ** count - 1), q(256 * count - 1)] : [])],
			params: { case: 'massimo', bits: n, inBytes },
		};
	return {
		prompt: 'Conta i valori.',
		problem: textBlock(`Un programma conserva ${what} in ${space}. Quanti valori diversi può distinguere?`),
		solution: `2^{${n}} = ${int(all)}`,
		steps: [...first, textBlock(`Con $n$ bit i valori diversi sono $2^n$.`), `2^{${n}} = ${int(all)}`],
		value: q(all),
		mistakes: [...(inBytes ? [q(256 * count), q(2 ** count), q(16 * count)] : []), q(2 * n), q(n * n), q(all - 1), q(all / 2), q(all * 2)],
		params: { case: 'valori', bits: n, inBytes },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: transmission speed

const SPEEDS = [8, 10, 16, 20, 24, 40, 50, 80, 100, 200];

/** Something to download that fits its size in MB. */
function item(rng: Rng, mb: number): string {
	if (mb < 15) return rng.pick(['una foto', 'una canzone', 'un documento']);
	if (mb <= 500) return rng.pick(['un video', 'un aggiornamento', "un'app"]);
	return rng.pick(['un gioco', 'un film']);
}

/** A speed and a whole number of seconds whose data are a whole number of MB. */
function transfer(rng: Rng): { v: number; t: number; D: number } {
	for (;;) {
		const v = rng.pick(SPEEDS);
		const t = rng.int(2, 120);
		if ((v * t) % 8 === 0 && (v * t) / 8 <= 3000) return { v, t, D: (v * t) / 8 };
	}
}

function level5(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const { v, t, D } = transfer(rng);
	return {
		prompt: 'Calcola il tempo di scaricamento.',
		problem: textBlock(`${N} scarica ${item(rng, D)} di ${pw(int(D), 'MB')} con una connessione da ${pw(int(v), 'Mbit/s')}. Quanti secondi servono? Ricorda che ${BYTE}.`),
		solution: withUnit(int(t), 's'),
		steps: [textBlock('La velocità è in megabit: porta i megabyte in megabit moltiplicando per 8.'), `${int(D)} \\cdot 8 = ${withUnit(int(8 * D), 'Mbit')}`, textBlock('Dividi i dati per la velocità.'), `t = ${int(8 * D)} : ${v} = ${withUnit(int(t), 's')}`],
		value: q(t),
		unit: 's',
		mistakes: [q(D, v), q(D, 8 * v), q(D * v, 8), q(8 * t), q(v, 8)],
		params: { case: 'tempo', D, v },
	};
}

function level6(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const kind = rng.pick(['dati', 'minuti', 'velocita'] as const);
	if (kind === 'dati') {
		const { v, t, D } = transfer(rng);
		return {
			prompt: 'Calcola quanti dati si scaricano.',
			problem: textBlock(`Quanti MB si scaricano in ${pw(int(t), 's')} con una connessione da ${pw(int(v), 'Mbit/s')}? Ricorda che ${BYTE}.`),
			solution: withUnit(int(D), 'MB'),
			steps: [textBlock('I dati sono la velocità per il tempo.'), `${v} \\cdot ${t} = ${withUnit(int(v * t), 'Mbit')}`, textBlock('Dai megabit ai megabyte si divide per 8.'), `${int(v * t)} : 8 = ${withUnit(int(D), 'MB')}`],
			value: q(D),
			unit: 'MB',
			mistakes: [q(v * t), q(v * t * 8), q(v, t), q(v, 8), q(t, 8)],
			params: { case: kind, v, t },
		};
	}
	if (kind === 'velocita') {
		const { v, t, D } = transfer(rng);
		return {
			prompt: 'Calcola la velocità che serve.',
			problem: textBlock(`${N} vuole scaricare ${item(rng, D)} di ${pw(int(D), 'MB')} in ${pw(int(t), 's')}. Quale velocità serve, in megabit al secondo? Ricorda che ${BYTE}.`),
			solution: withUnit(int(v), 'Mbit/s'),
			steps: [textBlock('Porta i megabyte in megabit moltiplicando per 8.'), `${int(D)} \\cdot 8 = ${withUnit(int(8 * D), 'Mbit')}`, textBlock('La velocità è la quantità di dati divisa per il tempo.'), `v = ${int(8 * D)} : ${t} = ${withUnit(int(v), 'Mbit/s')}`],
			value: q(v),
			unit: 'Mbit/s',
			mistakes: [q(D, t), q(D, 8 * t), q(D * t, 8), q(8 * v), q(8 * D)],
			params: { case: kind, D, t },
		};
	}
	// minutes: D GB = v · 60 m / 8000, with at most two decimals
	let v: number, m: number, gb: Rational;
	do {
		v = rng.pick([20, 40, 50, 80, 100, 200, 400]);
		m = rng.int(1, 60);
		gb = q(3 * v * m, 400);
	} while ((v * m) % 4 !== 0 || gb.compare(q(100)) > 0);
	const mb = gb.mul(q(1000));
	const mbit = mb.mul(q(8));
	const secs = 60 * m;
	return {
		prompt: 'Calcola il tempo in minuti.',
		problem: textBlock(`${N} scarica ${rng.pick(['un gioco', 'un film', 'una serie', 'un archivio di foto'])} di ${pw(dec(gb), 'GB')} con una connessione da ${pw(int(v), 'Mbit/s')}. Quanti minuti servono? Ricorda che $1\\,\\text{GB} = 1000\\,\\text{MB}$ e ${BYTE}.`),
		solution: withUnit(int(m), 'min'),
		steps: [
			textBlock('Porta i gigabyte in megabyte, e poi in megabit moltiplicando per 8.'),
			`${dec(gb)} \\cdot 1000 = ${withUnit(dec(mb), 'MB')} \\qquad ${dec(mb)} \\cdot 8 = ${withUnit(dec(mbit), 'Mbit')}`,
			textBlock('Dividi per la velocità: trovi i secondi. Poi dividi per 60.'),
			`${dec(mbit)} : ${v} = ${withUnit(int(secs), 's')} \\qquad ${int(secs)} : 60 = ${withUnit(int(m), 'min')}`,
		],
		value: q(m),
		unit: 'min',
		mistakes: [q(secs), q(m, 8), q(secs, 8), q(8 * m), mb.div(q(v)), q(m, 2)],
		params: { case: kind, gb: gb.toString(), v },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const v = b.value;
		// fallbacks, should the mistakes of the lesson give fewer than three different numbers
		const fill = [v.mul(q(2)), v.mul(q(10)), v.div(q(2)), v.div(q(10)), v.add(q(1)), v.mul(q(4)), v.add(q(2))];
		const mistakes = [...b.mistakes, ...fill].filter((r) => showable(r) && !r.equals(v)).map((r) => r.toString());
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: { kind: 'number', value: v.toString() },
			params: { ...b.params, value: v.toString(), unit: b.unit ?? '', mistakes },
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const unit = (sample.params.unit as string) || undefined;
	const v = Rational.parse(sample.params.value as string);
	return choose(
		rng,
		numOpt(v, unit),
		(sample.params.mistakes as string[]).map((s) => numOpt(Rational.parse(s), unit)),
	);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'number') return [...v, 'la risposta deve essere un numero'];
	const value = Rational.parse(a.value);
	if (!showable(value)) v.push('risposta non scrivibile con al più quattro decimali');
	if (sample.level !== 2 && sample.level !== 3 && !value.isInteger()) v.push('la risposta deve essere intera');
	if (sample.level >= 2 && sample.level !== 4 && !/Ricorda che/.test(sample.problem)) v.push('manca il fattore nel testo');
	if ((sample.params.mistakes as string[]).length < 3) v.push('meno di tre distrattori');
	checkChoice(sample.choice, v);
	return v;
}

export const infBitByte: Generator = {
	id: ID,
	title: 'Bit, byte e unità di misura',
	levels: {
		1: { label: 'Bit e byte', constraints: ['da 2 a 125 byte, in bit o al contrario; 1 B = 8 bit scritto nel testo'] },
		2: { label: 'Multipli decimali', constraints: ['B, kB, MB, GB, TB con fattore 1000 scritto nel testo; uno o due passi; al più due decimali'] },
		3: { label: 'Multipli binari', constraints: ['B, KiB, MiB, GiB, TiB con fattore 1024 scritto nel testo; un passo; interi da 2 a 40 o quarti e mezzi'] },
		4: { label: 'Quanti valori con n bit', constraints: ['da 3 a 16 bit o da 1 a 3 byte; i valori diversi 2^n oppure il più grande 2^n - 1'] },
		5: { label: 'Tempo di scaricamento', constraints: ['MB e Mbit/s; tempo intero da 2 a 120 secondi; 1 B = 8 bit scritto nel testo'] },
		6: { label: 'Dati, minuti e velocità', constraints: ['i MB scaricati in un tempo, i minuti per un file in GB, la velocità che serve: circa 1 su 3 ciascuno'] },
	},
	generate,
	check,
	toChoice,
};

export default infBitByte;
