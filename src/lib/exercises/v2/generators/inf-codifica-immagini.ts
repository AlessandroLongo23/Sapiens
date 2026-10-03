/**
 * La codifica delle immagini: pixel e colori. Spec: specs/exercises/inf-codifica-immagini.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/11-inf-codifica-immagini.md): the
 * pixels of an image; colours and bits per pixel; the colour of an RGB triple; the size in bytes of an
 * uncompressed image; the size in kB, MB, KiB or MiB, with the factor in the text; inverse problems (how many
 * photos fit, how many bits per pixel). Sizes are drawn so that every result is an integer or a short decimal.
 */
import type { Rng } from '../types';
import { type Built, chance, choose, decTex, defineGenerator, fmtInt, numberBuilt, shuffle, textBlock, textOpt, tx } from '../inf-codifica';

export const ID = 'inf-codifica-immagini';

const size = (w: number, h: number) => `$${fmtInt(w)} \\times ${fmtInt(h)}$`;
/** Wrong values with at most three decimals, so they can be written. */
const short = (list: [number, number][]) => list.filter(([p, q]) => (p * 1000) % q === 0);

// ---------------------------------------------------------------------------
// Level 1: how many pixels

function level1(rng: Rng): Built {
	const w = 20 * rng.int(2, 60);
	const h = 10 * rng.int(3, 90);
	const n = w * h;
	return numberBuilt(
		{
			prompt: 'Scrivi il numero di pixel.',
			problem: textBlock(`Un'immagine raster è larga $${fmtInt(w)}$ pixel e alta $${fmtInt(h)}$ pixel. Quanti pixel ha in tutto?`),
			steps: [tx('I pixel formano una griglia: si moltiplica la larghezza per l\'altezza.'), tx(`$${fmtInt(w)} \\cdot ${fmtInt(h)} = ${fmtInt(n)}$ pixel.`)],
			params: { w, h },
		},
		n,
		1,
		[w + h, 2 * (w + h), n / 10, n * 10, n / 2, 3 * n],
	);
}

// ---------------------------------------------------------------------------
// Level 2: colours and bits per pixel

const DEPTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 24];

function level2(rng: Rng): Built {
	if (chance(rng, 0.4)) {
		const n = rng.pick(DEPTHS);
		const colours = 2 ** n;
		return numberBuilt(
			{
				prompt: 'Scrivi il numero di colori.',
				problem: textBlock(`Un'immagine usa $${n}$ bit per ogni pixel. Quanti colori diversi può avere un pixel?`),
				steps: [tx(`Con $n$ bit le combinazioni sono $2^n$, e ogni combinazione è un colore.`), tx(`$2^{${n}} = ${fmtInt(colours)}$ colori.`)],
				params: { case: 'colori', n },
			},
			colours,
			1,
			[2 * n, n * n, colours / 2, colours * 2, 8 * n, colours - 1, 10 * n],
		);
	}
	const edge = chance(rng, 0.35);
	const colours = edge ? 2 ** rng.int(1, 12) + rng.pick([0, 0, 1]) : rng.int(3, 5000);
	let n = 1;
	while (2 ** n < colours) n++;
	return numberBuilt(
		{
			prompt: 'Scrivi il numero di bit.',
			problem: textBlock(`Un'immagine deve poter mostrare $${fmtInt(colours)}$ colori diversi. Quanti bit per pixel servono, come minimo?`),
			steps: [
				tx(`Servono $n$ bit con $2^n$ maggiore o uguale a $${fmtInt(colours)}$.`),
				tx(n > 1 ? `$2^{${n - 1}} = ${fmtInt(2 ** (n - 1))}$ non basta; $2^{${n}} = ${fmtInt(2 ** n)}$ sì.` : `$2^1 = 2$ è sufficiente.`),
				tx(`Servono $${n}$ bit per pixel.`),
			],
			params: { case: 'bit', colours },
		},
		n,
		1,
		[n - 1, n + 1, n + 2, n - 2, 8, n + 3].filter((x) => x > 0),
	);
}

// ---------------------------------------------------------------------------
// Level 3: the colour of an RGB triple

/** Which components are on, for each colour name. */
const HUES: Record<string, [number, number, number]> = {
	rosso: [1, 0, 0],
	verde: [0, 1, 0],
	blu: [0, 0, 1],
	giallo: [1, 1, 0],
	ciano: [0, 1, 1],
	magenta: [1, 0, 1],
};
const LEVELS_ON = [96, 128, 150, 160, 180, 192, 200, 224, 240, 255];
const GREYS = [32, 64, 80, 96, 128, 150, 160, 192, 200, 224];
export const COLOURS = [...Object.keys(HUES), 'grigio', 'bianco', 'nero'];
/** The names a student is most likely to choose by mistake, for each colour. */
const CONFUSED: Record<string, string[]> = {
	rosso: ['verde', 'blu', 'magenta', 'giallo'],
	verde: ['rosso', 'blu', 'giallo', 'ciano'],
	blu: ['rosso', 'verde', 'ciano', 'magenta'],
	giallo: ['rosso', 'verde', 'blu', 'bianco', 'ciano'],
	ciano: ['verde', 'blu', 'rosso', 'bianco', 'magenta'],
	magenta: ['rosso', 'blu', 'verde', 'bianco', 'giallo'],
	grigio: ['bianco', 'nero', 'giallo', 'blu'],
	bianco: ['nero', 'grigio', 'giallo', 'rosso'],
	nero: ['bianco', 'grigio', 'blu', 'rosso'],
};

function level3(rng: Rng): Built {
	const u = rng.next();
	let colour: string;
	let rgb: [number, number, number];
	if (u < 0.72) {
		colour = rng.pick(Object.keys(HUES));
		const v = rng.pick(LEVELS_ON);
		rgb = HUES[colour].map((on) => on * v) as [number, number, number];
	} else if (u < 0.86) {
		colour = 'grigio';
		const v = rng.pick(GREYS);
		rgb = [v, v, v];
	} else {
		colour = chance(rng, 0.5) ? 'bianco' : 'nero';
		rgb = colour === 'bianco' ? [255, 255, 255] : [0, 0, 0];
	}
	const hexa = chance(rng, 0.4);
	const show = (x: number) => (hexa ? x.toString(16).toUpperCase().padStart(2, '0') : String(x));
	const [r, g, b] = rgb.map(show);
	const on = ['rossa', 'verde', 'blu'].filter((_, i) => rgb[i] > 0);
	const why: Record<string, string> = {
		rosso: 'È accesa solo la componente rossa: il pixel è rosso.',
		verde: 'È accesa solo la componente verde: il pixel è verde.',
		blu: 'È accesa solo la componente blu: il pixel è blu.',
		giallo: 'Sono accese allo stesso livello la componente rossa e la verde, la blu è spenta: luce rossa e luce verde insieme danno il giallo.',
		ciano: 'Sono accese allo stesso livello la componente verde e la blu, la rossa è spenta: insieme danno il ciano.',
		magenta: 'Sono accese allo stesso livello la componente rossa e la blu, la verde è spenta: insieme danno il magenta.',
		grigio: 'Le tre componenti sono uguali, né tutte al minimo né tutte al massimo: il pixel è grigio.',
		bianco: 'Le tre componenti sono tutte al massimo: il pixel è bianco.',
		nero: 'Le tre componenti sono tutte a zero, cioè nessuna luce: il pixel è nero.',
	};
	return {
		prompt: 'Scegli il colore.',
		problem: textBlock(
			`Un pixel ha colore RGB con R = ${r}, G = ${g}, B = ${b}${hexa ? ', scritti in esadecimale' : ''}. Ogni componente va da ${hexa ? '00 a FF' : '0 a 255'}. Di che colore è il pixel?`,
		),
		solution: textOpt(colour).latex,
		steps: [
			...(hexa ? [tx(`In base dieci: R = $${rgb[0]}$, G = $${rgb[1]}$, B = $${rgb[2]}$.`)] : []),
			tx(on.length === 0 || on.length === 3 ? 'Le tre componenti hanno lo stesso valore.' : `Componenti accese: ${on.join(' e ')}.`),
			tx(why[colour]),
		],
		answer: choose(rng, textOpt(colour), [...CONFUSED[colour].slice(0, 2), ...shuffle(rng, CONFUSED[colour].slice(2))].map((c) => textOpt(c))),
		params: { case: colour, rgb, hex: hexa },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the size in bytes

function level4(rng: Rng): Built {
	const w = 20 * rng.int(1, 40);
	const h = 10 * rng.int(1, 60);
	const depth = chance(rng, 0.2) ? rng.pick([1, 4]) : rng.pick([8, 16, 24, 32]);
	const pixels = w * h;
	const bitsTotal = pixels * depth;
	const bytes = bitsTotal / 8;
	return numberBuilt(
		{
			prompt: 'Scrivi la dimensione in byte.',
			problem: textBlock(`Un'immagine non compressa di ${size(w, h)} pixel ha una profondità di colore di $${depth}$ bit per pixel. Quanti byte occupa?`),
			steps: [
				tx(`Pixel: $${fmtInt(w)} \\cdot ${fmtInt(h)} = ${fmtInt(pixels)}$.`),
				tx(`Bit: $${fmtInt(pixels)} \\cdot ${depth} = ${fmtInt(bitsTotal)}$.`),
				tx(`Byte: $${fmtInt(bitsTotal)} : 8 = ${fmtInt(bytes)}$.`),
			],
			params: { w, h, depth },
		},
		bytes,
		1,
		[bitsTotal, pixels, pixels * 8, pixels / 8, (w + h) * depth, bytes * 10, bytes / 10].filter(Number.isInteger),
		'B',
	);
}

// ---------------------------------------------------------------------------
// Level 5: the size in a multiple of the byte

const FACTOR: Record<string, number> = { kB: 1000, MB: 1000 ** 2, KiB: 1024, MiB: 1024 ** 2 };
const FACTOR_TEX: Record<string, string> = {
	kB: '$1\\,\\text{kB} = 1000\\,\\text{B}$',
	MB: '$1\\,\\text{MB} = 1\\,000\\,000\\,\\text{B}$',
	KiB: '$1\\,\\text{KiB} = 1024\\,\\text{B}$',
	MiB: '$1\\,\\text{MiB} = 1024 \\cdot 1024\\,\\text{B} = 1\\,048\\,576\\,\\text{B}$',
};

function level5(rng: Rng): Built {
	const binary = chance(rng, 0.5);
	const unit = binary ? rng.pick(['KiB', 'MiB']) : rng.pick(['kB', 'MB']);
	for (;;) {
		const w = binary ? 64 * rng.int(1, 64) : 50 * rng.int(2, 80);
		const h = binary ? 64 * rng.int(1, 48) : 50 * rng.int(2, 60);
		const depth = rng.pick([8, 16, 24, 32]);
		const bytes = (w * h * depth) / 8;
		const f = FACTOR[unit];
		// at most two decimals, and a size one would write in that unit
		if ((bytes * 100) % f !== 0 || bytes / f < 0.1 || bytes / f >= 10000) continue;
		const otherStep = unit.startsWith('M') ? (binary ? 1024 : 1000) : binary ? 1024 ** 2 : 1000 ** 2;
		return numberBuilt(
			{
				prompt: `Scrivi la dimensione in ${unit}.`,
				problem: textBlock(`Un'immagine non compressa di ${size(w, h)} pixel ha una profondità di colore di $${depth}$ bit per pixel. Quanti ${unit} occupa? Usa ${FACTOR_TEX[unit]}.`),
				steps: [
					tx(`Pixel: $${fmtInt(w)} \\cdot ${fmtInt(h)} = ${fmtInt(w * h)}$.`),
					tx(`Ogni pixel occupa $${depth} : 8 = ${depth / 8}$ byte: $${fmtInt(w * h)} \\cdot ${depth / 8} = ${fmtInt(bytes)}\\,\\text{B}$.`),
					tx(`In ${unit}: $${fmtInt(bytes)} : ${fmtInt(f)} = ${decTex(bytes, f)}\\,\\text{${unit}}$.`),
				],
				params: { case: unit, w, h, depth },
			},
			bytes,
			f,
			short([
				[bytes * 8, f],
				[w * h, f],
				[bytes, otherStep],
				[bytes * 10, f],
				[bytes, f * 10],
				[bytes * 2, f],
				[bytes, f * 2],
			]),
			unit,
		);
	}
}

// ---------------------------------------------------------------------------
// Level 6: inverse problems

/** Photo sizes whose 24-bit size is a whole number of MB (1 MB = 1 000 000 B). */
const PHOTOS: [number, number][] = [
	[4000, 3000],
	[2000, 1500],
	[3000, 2000],
	[1000, 1000],
	[2000, 1000],
	[5000, 4000],
	[2500, 2000],
	[4000, 2500],
	[6000, 4000],
	[5000, 3000],
	[2000, 2000],
	[3000, 3000],
	[4000, 2000],
	[5000, 2000],
	[8000, 5000],
];

function level6(rng: Rng): Built {
	if (chance(rng, 0.5)) {
		const [w, h] = rng.pick(PHOTOS);
		const gb = rng.int(1, 64);
		const mb = (w * h * 3) / 1e6;
		const count = Math.floor((gb * 1000) / mb);
		const exact = (gb * 1000) % mb === 0;
		return numberBuilt(
			{
				prompt: 'Scrivi il numero di foto.',
				problem: textBlock(
					`Una scheda di memoria ha $${gb}\\,\\text{GB}$ liberi. Quante foto non compresse di ${size(w, h)} pixel, a $24$ bit per pixel, ci stanno? Usa $1\\,\\text{MB} = 1\\,000\\,000\\,\\text{B}$ e $1\\,\\text{GB} = 1000\\,\\text{MB}$.`,
				),
				steps: [
					tx(`Una foto: $${fmtInt(w)} \\cdot ${fmtInt(h)} \\cdot 3 = ${fmtInt(w * h * 3)}\\,\\text{B} = ${mb}\\,\\text{MB}$.`),
					tx(`Spazio libero: $${gb}\\,\\text{GB} = ${fmtInt(gb * 1000)}\\,\\text{MB}$.`),
					tx(
						exact
							? `$${fmtInt(gb * 1000)} : ${mb} = ${fmtInt(count)}$ foto.`
							: `$${fmtInt(gb * 1000)} : ${mb}$ fa $${fmtInt(count)}$ con il resto: una foto a metà non si salva, quindi ci stanno $${fmtInt(count)}$ foto.`,
					),
				],
				params: { case: 'quante foto', w, h, gb },
			},
			count,
			1,
			[count + 1, count * 3, Math.floor(count / 8), Math.floor((gb * 1024) / mb), count - 1, Math.floor(count / 3), count * 8].filter((x) => x > 0),
		);
	}
	const depth = rng.pick([1, 4, 8, 16, 24, 32]);
	const w = 40 * rng.int(1, 30);
	const h = 20 * rng.int(1, 40);
	const bytes = (w * h * depth) / 8;
	return numberBuilt(
		{
			prompt: 'Scrivi i bit per pixel.',
			problem: textBlock(`Un'immagine non compressa di ${size(w, h)} pixel occupa $${fmtInt(bytes)}\\,\\text{B}$. Qual è la sua profondità di colore, in bit per pixel?`),
			steps: [
				tx(`Bit in tutto: $${fmtInt(bytes)} \\cdot 8 = ${fmtInt(bytes * 8)}$.`),
				tx(`Pixel: $${fmtInt(w)} \\cdot ${fmtInt(h)} = ${fmtInt(w * h)}$.`),
				tx(`Bit per pixel: $${fmtInt(bytes * 8)} : ${fmtInt(w * h)} = ${depth}$.`),
			],
			params: { case: 'profondità', w, h, bytes },
		},
		depth,
		1,
		[depth >= 8 ? depth / 8 : depth * 8, depth * 8, 2 ** Math.min(depth, 8), depth * 2, depth === 24 ? 32 : 24, 16, 8, 3],
	);
}

export const infCodificaImmagini = defineGenerator(ID, 'La codifica delle immagini: pixel e colori', {
	1: { label: 'Quanti pixel ha un\'immagine', constraints: ['larghezza da 40 a 1200 pixel, altezza da 30 a 900'], make: level1 },
	2: { label: 'Colori e bit per pixel', constraints: ['4 su 10: quanti colori con n bit (da 1 a 24)', '6 su 10: i bit che servono per un numero di colori fino a 5000'], make: level2 },
	3: { label: 'Riconoscere un colore RGB', constraints: ['rosso, verde, blu, giallo, ciano, magenta, grigio, bianco, nero', 'componenti in base dieci (6 su 10) o in esadecimale'], make: level3 },
	4: { label: 'La dimensione in byte', constraints: ['pixel per bit per pixel diviso 8', 'profondità 8, 16, 24, 32 bit; 1 su 5 a 1 o 4 bit'], make: level4 },
	5: { label: 'La dimensione in kB, MB, KiB, MiB', constraints: ['il fattore è scritto nel testo', 'risultato con al più due cifre decimali'], make: level5 },
	6: { label: 'Foto in una memoria e bit per pixel', constraints: ['metà: quante foto a 24 bit stanno in una memoria da 1 a 64 GB', 'metà: la profondità di colore dalla dimensione'], make: level6 },
});

export default infCodificaImmagini;
