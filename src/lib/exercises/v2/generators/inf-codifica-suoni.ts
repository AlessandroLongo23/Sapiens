/**
 * La codifica dei suoni. Spec: specs/exercises/inf-codifica-suoni.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/12-inf-codifica-suoni.md): the samples
 * of a recording; the sampling rule (a rate at least twice the highest frequency); levels and bits per sample; the
 * size in bytes of a mono recording; the size with channels, minutes and multiples of the byte; inverse problems
 * (how long a recording fits, the bit rate). Rates are the usual ones (8 to 96 kHz), stored in hertz.
 */
import type { Rng } from '../types';
import { type Built, chance, decTex, defineGenerator, fmtInt, numberBuilt, textBlock, tx } from '../inf-codifica';

export const ID = 'inf-codifica-suoni';

/** Sampling rates in hertz. */
const RATES = [8000, 11025, 16000, 22050, 32000, 44100, 48000, 96000];
const hz = (f: number) => `$${fmtInt(f)}\\,\\text{Hz}$`;
const khz = (f: number) => `$${decTex(f, 1000)}\\,\\text{kHz}$`;
const KHZ = '$1\\,\\text{kHz} = 1000\\,\\text{Hz}$';
const short = (list: [number, number][]) => list.filter(([p, q]) => (p * 1000) % q === 0);

// ---------------------------------------------------------------------------
// Level 1: how many samples

function level1(rng: Rng): Built {
	const f = rng.pick(RATES);
	const t = rng.int(2, 120);
	const inKhz = chance(rng, 0.6);
	const n = f * t;
	return numberBuilt(
		{
			prompt: 'Scrivi il numero di campioni.',
			problem: textBlock(
				`Un suono viene campionato a ${inKhz ? khz(f) : hz(f)} per $${t}$ secondi, su un solo canale. Quanti campioni si ottengono?${inKhz ? ` Ricorda: ${KHZ}.` : ''}`,
			),
			steps: [
				tx(`La frequenza di campionamento dice quanti campioni si prendono in un secondo: ${inKhz ? `${khz(f)} sono ` : ''}$${fmtInt(f)}$ campioni al secondo.`),
				tx(`In $${t}$ secondi: $${fmtInt(f)} \\cdot ${t} = ${fmtInt(n)}$ campioni.`),
			],
			params: { f, t, khz: inKhz },
		},
		n,
		1,
		short([
			[f * t, 1000],
			[f, t],
			[f * t * 2, 1],
			[f * t * 8, 1],
			[f + t, 1],
			[f * t, 10],
			[f * t * 10, 1],
		]),
	);
}

// ---------------------------------------------------------------------------
// Level 2: the sampling rule

function level2(rng: Rng): Built {
	const inKhz = chance(rng, 0.5);
	const unit = inKhz ? 'kHz' : 'Hz';
	const show = (f: number) => (inKhz ? khz(f) : hz(f));
	if (chance(rng, 0.5)) {
		// the highest frequency of the sound: the rate must be at least twice as much
		const fmax = inKhz ? 100 * rng.int(5, 200) : 50 * rng.int(2, 400);
		const q = inKhz ? 1000 : 1;
		return numberBuilt(
			{
				prompt: `Scrivi la frequenza in ${unit}.`,
				problem: textBlock(`Un suono contiene frequenze fino a ${show(fmax)}. Qual è la più piccola frequenza di campionamento che permette di registrarlo senza perderle?`),
				steps: [tx('La frequenza di campionamento deve essere almeno il doppio della frequenza più alta del suono.'), tx(`$2 \\cdot ${decTex(fmax, q)} = ${decTex(2 * fmax, q)}$: servono almeno ${show(2 * fmax)}.`)],
				params: { case: 'minima', f: fmax, khz: inKhz },
			},
			2 * fmax,
			q,
			short([
				[fmax, 2 * q],
				[fmax, q],
				[4 * fmax, q],
				[3 * fmax, q],
				[20 * fmax, q],
			]),
			unit,
		);
	}
	// 11 025 Hz is left out: its half is not a whole number of hertz
	const fc = chance(rng, 0.5) ? rng.pick(RATES.filter((r) => r % 2 === 0)) : 200 * rng.int(20, 480);
	const q = inKhz ? 1000 : 1;
	return numberBuilt(
		{
			prompt: `Scrivi la frequenza in ${unit}.`,
			problem: textBlock(`Un registratore campiona a ${show(fc)}. Qual è la frequenza più alta che un suono può avere per essere registrato correttamente?`),
			steps: [tx('La frequenza di campionamento deve essere almeno il doppio della frequenza più alta: la frequenza più alta è la metà di quella di campionamento.'), tx(`$${decTex(fc, q)} : 2 = ${decTex(fc, 2 * q)}$: fino a ${inKhz ? khz(fc / 2) : hz(fc / 2)}.`)],
			params: { case: 'massima', f: fc, khz: inKhz },
		},
		fc,
		2 * q,
		short([
			[2 * fc, q],
			[fc, q],
			[fc, 4 * q],
			[4 * fc, q],
			[fc, 8 * q],
		]),
		unit,
	);
}

// ---------------------------------------------------------------------------
// Level 3: levels and bits per sample

function level3(rng: Rng): Built {
	if (chance(rng, 0.4)) {
		const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24]);
		const levels = 2 ** n;
		return numberBuilt(
			{
				prompt: 'Scrivi il numero di livelli.',
				problem: textBlock(`Ogni campione di un suono è quantizzato con $${n}$ bit. Quanti livelli diversi può assumere un campione?`),
				steps: [tx('Con $n$ bit le combinazioni sono $2^n$, e ogni combinazione è un livello.'), tx(`$2^{${n}} = ${fmtInt(levels)}$ livelli.`)],
				params: { case: 'livelli', n },
			},
			levels,
			1,
			[2 * n, n * n, levels / 2, levels * 2, 8 * n, levels - 1],
		);
	}
	const levels = chance(rng, 0.35) ? 2 ** rng.int(2, 16) + rng.pick([0, 0, 1]) : rng.int(3, 70000);
	let n = 1;
	while (2 ** n < levels) n++;
	return numberBuilt(
		{
			prompt: 'Scrivi il numero di bit.',
			problem: textBlock(`Per quantizzare un suono si vogliono usare almeno $${fmtInt(levels)}$ livelli. Quanti bit per campione servono, come minimo?`),
			steps: [
				tx(`Servono $n$ bit con $2^n$ maggiore o uguale a $${fmtInt(levels)}$.`),
				tx(`$2^{${n - 1}} = ${fmtInt(2 ** (n - 1))}$ non basta; $2^{${n}} = ${fmtInt(2 ** n)}$ sì.`),
				tx(`Servono $${n}$ bit per campione.`),
			],
			params: { case: 'bit', levels },
		},
		n,
		1,
		[n - 1, n + 1, n + 2, n - 2, 8, 16].filter((x) => x > 0),
	);
}

// ---------------------------------------------------------------------------
// Level 4: the size in bytes, one channel

function level4(rng: Rng): Built {
	const f = rng.pick(RATES.slice(0, 7));
	const depth = rng.pick([8, 16, 24]);
	const t = rng.int(2, 60);
	const samples = f * t;
	const bytes = (samples * depth) / 8;
	return numberBuilt(
		{
			prompt: 'Scrivi la dimensione in byte.',
			problem: textBlock(`Una registrazione non compressa dura $${t}$ secondi, su un solo canale, con frequenza di campionamento ${hz(f)} e $${depth}$ bit per campione. Quanti byte occupa?`),
			steps: [
				tx(`Campioni: $${fmtInt(f)} \\cdot ${t} = ${fmtInt(samples)}$.`),
				tx(`Bit: $${fmtInt(samples)} \\cdot ${depth} = ${fmtInt(samples * depth)}$.`),
				tx(`Byte: $${fmtInt(samples * depth)} : 8 = ${fmtInt(bytes)}$.`),
			],
			params: { f, depth, t },
		},
		bytes,
		1,
		[samples * depth, samples, bytes * 2, (f * depth) / 8, samples * 8, bytes / 2].filter(Number.isInteger),
		'B',
	);
}

// ---------------------------------------------------------------------------
// Level 5: channels, minutes, multiples of the byte

const FACTOR: Record<string, number> = { kB: 1000, MB: 1000 ** 2, KiB: 1024 };
const FACTOR_TEX: Record<string, string> = {
	kB: '$1\\,\\text{kB} = 1000\\,\\text{B}$',
	MB: '$1\\,\\text{MB} = 1\\,000\\,000\\,\\text{B}$',
	KiB: '$1\\,\\text{KiB} = 1024\\,\\text{B}$',
};
const channelWords = (ch: number) => (ch === 2 ? 'stereo (2 canali)' : 'mono (1 canale)');

function level5(rng: Rng): Built {
	const unit = rng.pick(['kB', 'MB', 'KiB']);
	const fct = FACTOR[unit];
	for (;;) {
		const f = rng.pick(RATES.slice(0, 7));
		const depth = rng.pick([8, 16, 24]);
		const ch = chance(rng, 0.7) ? 2 : 1;
		const minutes = chance(rng, 0.5) ? rng.int(1, 12) : 0;
		const t = minutes ? minutes * 60 : rng.int(4, 240);
		const bytes = (f * t * depth * ch) / 8;
		// at most three decimals, and a size one would write in that unit
		if ((bytes * 1000) % fct !== 0 || bytes / fct < 1 || bytes / fct >= 100000) continue;
		const perSecond = (f * depth * ch) / 8;
		const duration = minutes ? `$${minutes}$ ${minutes === 1 ? 'minuto' : 'minuti'}` : `$${t}$ secondi`;
		return numberBuilt(
			{
				prompt: `Scrivi la dimensione in ${unit}.`,
				problem: textBlock(
					`Una registrazione non compressa dura ${duration}, è ${channelWords(ch)}, con frequenza di campionamento ${khz(f)} e $${depth}$ bit per campione. Quanti ${unit} occupa? Usa ${KHZ} e ${FACTOR_TEX[unit]}.`,
				),
				steps: [
					tx(`In un secondo: $${fmtInt(f)} \\cdot ${depth} \\cdot ${ch} = ${fmtInt(f * depth * ch)}$ bit, cioè $${fmtInt(perSecond)}\\,\\text{B}$.`),
					tx(`${minutes ? `La durata è $${minutes} \\cdot 60 = ${t}$ secondi. ` : ''}In tutto: $${fmtInt(perSecond)} \\cdot ${t} = ${fmtInt(bytes)}\\,\\text{B}$.`),
					tx(`In ${unit}: $${fmtInt(bytes)} : ${fmtInt(fct)} = ${decTex(bytes, fct)}\\,\\text{${unit}}$.`),
				],
				params: { case: unit, f, depth, ch, t, minutes: minutes > 0 },
			},
			bytes,
			fct,
			short([
				[bytes * 8, fct],
				ch === 2 ? [bytes, 2 * fct] : [bytes * 2, fct],
				minutes ? [bytes, 60 * fct] : [bytes * 60, fct],
				[bytes, fct * 1000],
				[bytes * 10, fct],
				[bytes, fct * 10],
				[bytes * 4, fct],
			]),
			unit,
		);
	}
}

// ---------------------------------------------------------------------------
// Level 6: inverse problems

function level6(rng: Rng): Built {
	const f = rng.pick(RATES.slice(0, 7));
	const depth = rng.pick([8, 16, 24]);
	const ch = chance(rng, 0.6) ? 2 : 1;
	const bitRate = f * depth * ch;
	if (chance(rng, 0.5)) {
		return numberBuilt(
			{
				prompt: 'Scrivi il risultato in kbit/s.',
				problem: textBlock(
					`Un suono non compresso è ${channelWords(ch)}, con frequenza di campionamento ${khz(f)} e $${depth}$ bit per campione. Quanti kbit servono per ogni secondo di suono? Usa ${KHZ} e $1\\,\\text{kbit} = 1000\\,\\text{bit}$.`,
				),
				steps: [
					tx(`In un secondo ci sono $${fmtInt(f)}$ campioni per canale.`),
					tx(`Bit in un secondo: $${fmtInt(f)} \\cdot ${depth} \\cdot ${ch} = ${fmtInt(bitRate)}$.`),
					tx(`$${fmtInt(bitRate)} : 1000 = ${decTex(bitRate, 1000)}\\,\\text{kbit/s}$.`),
				],
				params: { case: 'kbit al secondo', f, depth, ch },
			},
			bitRate,
			1000,
			short([
				[bitRate, 8000],
				ch === 2 ? [bitRate, 2000] : [bitRate * 2, 1000],
				[f * ch, 1000],
				[bitRate, 1],
				[bitRate * 8, 1000],
				[bitRate, 100],
			]),
			'kbit/s',
		);
	}
	const mb = rng.int(1, 700);
	const perSecond = bitRate / 8;
	const seconds = Math.floor((mb * 1e6) / perSecond);
	const exact = (mb * 1e6) % perSecond === 0;
	return numberBuilt(
		{
			prompt: 'Scrivi la durata in secondi interi.',
			problem: textBlock(
				`In una memoria ci sono $${mb}\\,\\text{MB}$ liberi. Quanti secondi interi di suono non compresso ci stanno, se il suono è ${channelWords(ch)}, con frequenza di campionamento ${khz(f)} e $${depth}$ bit per campione? Usa ${KHZ} e $1\\,\\text{MB} = 1\\,000\\,000\\,\\text{B}$.`,
			),
			steps: [
				tx(`Un secondo occupa $${fmtInt(f)} \\cdot ${depth} \\cdot ${ch} : 8 = ${fmtInt(perSecond)}\\,\\text{B}$.`),
				tx(`Spazio libero: $${fmtInt(mb * 1e6)}\\,\\text{B}$.`),
				tx(`$${fmtInt(mb * 1e6)} : ${fmtInt(perSecond)}$ fa $${fmtInt(seconds)}$${exact ? '' : ' con il resto'}: ci stanno $${fmtInt(seconds)}$ secondi.`),
			],
			params: { case: 'durata', f, depth, ch, mb },
		},
		seconds,
		1,
		[seconds + 1, Math.floor((mb * 1e6) / bitRate), ch === 2 ? seconds * 2 : Math.floor(seconds / 2), Math.floor(seconds / 60), seconds * 8, seconds - 1].filter((x) => x > 0),
		's',
	);
}

export const infCodificaSuoni = defineGenerator(ID, 'La codifica dei suoni', {
	1: { label: 'Quanti campioni', constraints: ['frequenze di campionamento da 8 a 96 kHz, in Hz o in kHz', 'durata da 2 a 120 secondi, un canale'], make: level1 },
	2: { label: 'La regola del campionamento', constraints: ['metà: la frequenza di campionamento minima, il doppio della frequenza più alta', 'metà: la frequenza più alta registrabile, la metà di quella di campionamento'], make: level2 },
	3: { label: 'Livelli e bit per campione', constraints: ['4 su 10: quanti livelli con n bit (da 2 a 24)', '6 su 10: i bit che servono per un numero di livelli fino a 70 000'], make: level3 },
	4: { label: 'La dimensione in byte, un canale', constraints: ['frequenza per secondi per bit per campione, diviso 8', '8, 16 o 24 bit, da 2 a 60 secondi'], make: level4 },
	5: { label: 'Stereo, minuti e multipli del byte', constraints: ['mono o stereo, secondi o minuti', 'in kB, MB o KiB con il fattore nel testo, al più tre cifre decimali'], make: level5 },
	6: { label: 'Bit al secondo e durata in una memoria', constraints: ['metà: i kbit per secondo di suono', 'metà: i secondi interi che stanno in una memoria da 1 a 700 MB'], make: level6 },
});

export default infCodificaSuoni;
