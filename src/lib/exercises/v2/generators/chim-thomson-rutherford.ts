/**
 * I modelli atomici di Thomson e di Rutherford. Spec: specs/exercises/chim-thomson-rutherford.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/41-chim-thomson-rutherford.md), each one step harder: the
 * model a statement belongs to (Dalton, Thomson, Rutherford or none); the gold foil, from an observation to its
 * explanation and back, and what Thomson's model predicted; how many times the atom is bigger than its nucleus; the atom
 * of a scale model; the fraction of the atom's volume the nucleus fills. Distractors from the lesson's warnings: the
 * ratio turned upside down, the powers of ten summed, the volumes taken as the radii, the centimetres not converted.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, decTex, generateWith, sig, t, textBlock, textOpt, texOpt } from '../chim-atomo';

export const ID = 'chim-thomson-rutherford';

const some = <T,>(xs: (T | null)[]) => xs.filter((x): x is T => x !== null);
const shuffled = <T,>(rng: Rng, xs: T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);

// ---------------------------------------------------------------------------
// Level 1: which model

const MODELS = ['Modello di Dalton', 'Modello di Thomson', 'Modello di Rutherford', 'Nessuno dei tre'] as const;
type Model = (typeof MODELS)[number];

export const STATEMENTS: Record<Model, string[]> = {
	'Modello di Dalton': ["l'atomo è una sfera piena e indivisibile", "l'atomo non contiene cariche elettriche", "l'atomo non contiene particelle più piccole"],
	'Modello di Thomson': ["la carica positiva è distribuita in modo uniforme in tutto l'atomo", 'gli elettroni sono immersi in una sfera di carica positiva', "l'atomo somiglia a un panettone con l'uvetta"],
	'Modello di Rutherford': ['la carica positiva è concentrata in un nucleo piccolissimo', "quasi tutta la massa dell'atomo è nel nucleo", 'gli elettroni girano intorno al nucleo come i pianeti intorno al Sole', "l'atomo è quasi tutto vuoto"],
	'Nessuno dei tre': ['gli elettroni stanno nel nucleo e la carica positiva intorno', "la carica negativa è concentrata al centro dell'atomo", "l'atomo intero ha carica positiva"],
};

const MODEL_WHY: Record<Model, string> = {
	'Modello di Dalton': "Per Dalton l'atomo è una pallina piena e indivisibile, senza cariche e senza parti.",
	'Modello di Thomson': "Per Thomson l'atomo è una sfera di carica positiva uniforme, con gli elettroni immersi dentro: il modello a panettone.",
	'Modello di Rutherford': "Per Rutherford la carica positiva e quasi tutta la massa sono in un nucleo piccolissimo, e gli elettroni gli girano intorno, lontani: l'atomo è quasi tutto vuoto.",
	'Nessuno dei tre': "In tutti e tre i modelli l'atomo è neutro, e in quelli con le cariche gli elettroni non stanno al centro: né Thomson né Rutherford hanno descritto un atomo così.",
};

function level1(rng: Rng): Built {
	const m = rng.pick(MODELS);
	const k = rng.int(0, STATEMENTS[m].length - 1);
	return {
		prompt: 'Riconosci il modello atomico.',
		problem: textBlock(`In quale modello atomico ${STATEMENTS[m][k]}?`),
		solution: t(m),
		steps: [textBlock(MODEL_WHY[m])],
		answer: choose(rng, textOpt(m), MODELS.filter((x) => x !== m).map((x) => textOpt(x))),
		params: { case: m, k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the gold foil

export const OBSERVATIONS = ['Quasi tutte le particelle alfa attraversano la lamina senza deviare', 'Alcune particelle alfa sono deviate di angoli grandi', 'Pochissime particelle alfa tornano indietro'];
export const CONCLUSIONS = ["L'atomo è quasi tutto vuoto", 'La carica positiva è concentrata in un nucleo piccolissimo', "Il nucleo contiene quasi tutta la massa dell'atomo"];
const WRONG_CONCLUSIONS = ['Gli elettroni sono più pesanti delle particelle alfa', "La carica positiva è sparsa in tutto l'atomo", 'Le particelle alfa hanno carica negativa'];
const WRONG_OBSERVATIONS = ['Tutte le particelle alfa si fermano nella lamina', 'Le particelle alfa sono attratte dagli atomi della lamina'];
const PREDICTIONS = ['Passano quasi tutte dritte, con deviazioni piccolissime', 'Molte tornano indietro', 'Si fermano tutte nella lamina', 'Sono deviate tutte di angoli grandi'];

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function level2(rng: Rng): Built {
	const kind = rng.pick(['conclusione', 'osservazione', 'previsione'] as const);
	if (kind === 'previsione') {
		return {
			prompt: 'Prevedi il risultato con il modello di Thomson.',
			problem: textBlock("Particelle alfa sono sparate contro una lamina d'oro sottilissima. Secondo il modello di Thomson, che cosa succede alle particelle alfa?"),
			solution: textOpt(PREDICTIONS[0]).latex,
			steps: [textBlock("Nel modello di Thomson la carica positiva è sparsa in tutto l'atomo: le forze sulle particelle alfa sono deboli, e gli elettroni sono troppo leggeri per deviarle. Le particelle passano quasi dritte.")],
			answer: choose(rng, textOpt(PREDICTIONS[0], 'dritte'), PREDICTIONS.slice(1).map((x, i) => textOpt(x, `p${i}`))),
			params: { case: kind },
		};
	}
	const i = rng.int(0, 2);
	if (kind === 'conclusione') {
		const others = [...CONCLUSIONS.filter((_, j) => j !== i), rng.pick(WRONG_CONCLUSIONS)];
		return {
			prompt: "Spiega l'osservazione con il modello di Rutherford.",
			problem: textBlock(`Nell'esperimento della lamina d'oro si osserva questo: ${lower(OBSERVATIONS[i])}. Che cosa ne dedusse Rutherford?`),
			solution: textOpt(CONCLUSIONS[i]).latex,
			steps: [textBlock(`${OBSERVATIONS[i]}: ${lower(CONCLUSIONS[i])}.`)],
			answer: choose(rng, textOpt(CONCLUSIONS[i], `c${i}`), shuffled(rng, others).map((x) => textOpt(x, x))),
			params: { case: kind, i },
		};
	}
	const others = [...OBSERVATIONS.filter((_, j) => j !== i), rng.pick(WRONG_OBSERVATIONS)];
	return {
		prompt: "Trova l'osservazione che lo mostra.",
		problem: textBlock(`Quale osservazione dell'esperimento della lamina d'oro mostra che ${lower(CONCLUSIONS[i])}?`),
		solution: textOpt(OBSERVATIONS[i]).latex,
		steps: [textBlock(`${OBSERVATIONS[i]}: ${lower(CONCLUSIONS[i])}.`)],
		answer: choose(rng, textOpt(OBSERVATIONS[i], `o${i}`), shuffled(rng, others).map((x) => textOpt(x, x))),
		params: { case: kind, i },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 5: the radii

/** A mantissa in tenths (14 → 1{,}4) times 10^e, in metres. */
const lenTex = (tenths: number, e: number) => `${decTex((tenths / 10).toFixed(1))} \\cdot 10^{${e}}\\,\\text{m}`;
const numOpt = (x: number) => {
	const r = sig(x, 2);
	return r ? texOpt(r.tex, r.value) : null;
};

function radii(rng: Rng) {
	for (;;) {
		const a = rng.int(5, 25); // atom radius a/10 · 10^-10 m
		const b = rng.int(10, 99); // nucleus radius b/10 · 10^-15 m
		if (b % 10 === 0 && rng.next() < 0.7) continue;
		const ratio = (a / b) * 1e5;
		if (!sig(ratio, 2)) continue;
		return { a, b, ratio };
	}
}

function level3(rng: Rng): Built {
	const { a, b, ratio } = radii(rng);
	const r = sig(ratio, 2)!;
	return {
		prompt: 'Confronta le dimensioni.',
		problem: textBlock(`Il raggio di un atomo è $${lenTex(a, -10)}$, quello del suo nucleo $${lenTex(b, -15)}$. Quante volte il raggio dell'atomo è più grande di quello del nucleo?`),
		solution: r.tex,
		steps: [`\\dfrac{r_{atomo}}{r_{nucleo}} = \\dfrac{${lenTex(a, -10)}}{${lenTex(b, -15)}} = \\dfrac{${decTex((a / 10).toFixed(1))}}{${decTex((b / 10).toFixed(1))}} \\cdot 10^{5} \\approx ${r.tex}`],
		// upside down; the exponent's sign lost; the exponents summed; a power of ten off
		answer: choose(rng, texOpt(r.tex, r.value), some([numOpt(1 / ratio), numOpt(ratio * 1e-10), numOpt(ratio * 1e20), numOpt(ratio * 10), numOpt(ratio / 10)])),
		params: { case: 'rapporto', a, b },
	};
}

function level5(rng: Rng): Built {
	const { a, b, ratio } = radii(rng);
	const f = 1 / ratio ** 3;
	const r = sig(f, 2);
	if (!r) throw new Error('tie');
	const rr = sig(1 / ratio, 2)!;
	return {
		prompt: 'Trova la frazione del volume.',
		problem: textBlock(`Il raggio di un atomo è $${lenTex(a, -10)}$, quello del suo nucleo $${lenTex(b, -15)}$. Quale frazione del volume dell'atomo occupa il nucleo?`),
		solution: r.tex,
		steps: [
			textBlock('Il volume di una sfera è proporzionale al cubo del raggio: il rapporto dei volumi è il cubo del rapporto dei raggi.'),
			`\\dfrac{r_{nucleo}}{r_{atomo}} \\approx ${rr.tex}, \\qquad \\dfrac{V_{nucleo}}{V_{atomo}} = \\left(\\dfrac{r_{nucleo}}{r_{atomo}}\\right)^3 \\approx ${r.tex}`,
		],
		// the radii only; squared; the atom over the nucleus; three times the ratio
		answer: choose(rng, texOpt(r.tex, r.value), some([numOpt(1 / ratio), numOpt(1 / ratio ** 2), numOpt(ratio ** 3), numOpt(3 / ratio)])),
		params: { case: 'volume', a, b },
	};
}

// ---------------------------------------------------------------------------
// Level 4: a scale model

export const OBJECTS = [
	{ what: 'una capocchia di spillo', d: 0.2, show: '2{,}0\\,\\text{mm}' },
	{ what: 'una biglia', d: 1, show: '1{,}0\\,\\text{cm}' },
	{ what: 'una pallina da ping pong', d: 4, show: '4{,}0\\,\\text{cm}' },
	{ what: "un'arancia", d: 8, show: '8{,}0\\,\\text{cm}' },
	{ what: 'un pallone da calcio', d: 22, show: '22\\,\\text{cm}' },
];
const RATIOS = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100]; // times 10^3

/** A length in metres as an option: in m below 1000 m, in km from there; two significant figures. */
function lengthOpt(m: number) {
	const km = m >= 999.5;
	const r = sig(km ? m / 1000 : m, 2);
	return r ? texOpt(`${r.tex}\\,\\text{${km ? 'km' : 'm'}}`, `${r.value}${km ? 'km' : 'm'}`) : null;
}

function level4(rng: Rng): Built {
	const o = rng.pick(OBJECTS);
	const k = rng.pick(RATIOS);
	const R = k * 1000;
	const Rtex = sig(R, 2)!.tex;
	const dm = (o.d * R) / 100; // metres
	const right = lengthOpt(dm);
	if (!right) throw new Error('tie');
	return {
		prompt: 'Trova la grandezza del modello in scala.',
		problem: textBlock(`Il diametro di un atomo è $${Rtex}$ volte quello del suo nucleo. In un modello in scala il nucleo è ${o.what}, con un diametro di $${o.show}$. Quanto è grande il diametro dell'atomo nel modello?`),
		solution: right.latex,
		steps: [
			textBlock('In un modello in scala tutte le lunghezze si moltiplicano per lo stesso numero.'),
			`d = ${Rtex} \\cdot ${o.show} = ${right.latex}`,
		],
		// the centimetres read as metres; the cube of the ratio; divided; a factor ten
		answer: choose(rng, right, some([lengthOpt(dm * 100), lengthOpt(dm * R * R), lengthOpt(o.d / 100 / R), lengthOpt(dm * 10), lengthOpt(dm / 10)])),
		params: { case: o.what, d: o.d, R },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimThomsonRutherford: Generator = {
	id: ID,
	title: 'I modelli atomici di Thomson e di Rutherford',
	levels: {
		1: { label: 'I modelli atomici', constraints: ['una frase: Dalton, Thomson, Rutherford o nessuno'] },
		2: { label: "La lamina d'oro", constraints: ["dall'osservazione alla conclusione, o il contrario, o la previsione di Thomson"] },
		3: { label: 'Atomo e nucleo', constraints: ['rapporto dei raggi, due cifre'] },
		4: { label: 'Il modello in scala', constraints: ['diametro del modello in m o km'] },
		5: { label: 'Il volume del nucleo', constraints: ['cubo del rapporto dei raggi'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimThomsonRutherford;
