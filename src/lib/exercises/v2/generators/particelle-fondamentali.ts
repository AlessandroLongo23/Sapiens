/**
 * Elettroni, protoni e neutroni. Spec: specs/exercises/particelle-fondamentali.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/40-particelle-fondamentali.md), each one step harder: the
 * particle a property belongs to; who discovered what, and when; the charge of a group of particles; the mass of a
 * nucleus or of some electrons from the table of the lesson; the charges of Millikan's drops, whole multiples of e.
 * Distractors from the lesson's warnings: neutrons counted in the charge, the relative charge read as coulombs, equal
 * charge taken for equal mass, a mass number for a mass, a charge that is not a multiple of e.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkChoice, choose, decTex, generateWith, sig, t, textBlock, textOpt, texOpt } from '../chim-atomo';

export const ID = 'particelle-fondamentali';

// ---------------------------------------------------------------------------
// Level 1: which particle

const PARTICLES = ['Elettrone', 'Protone', 'Neutrone', 'Nessuna delle tre'] as const;
type Who = (typeof PARTICLES)[number];

export const PROPERTIES: Record<Who, string[]> = {
	Elettrone: [
		'ha carica relativa $-1$',
		'ha la massa più piccola',
		'forma i raggi catodici',
		'fu scoperta da J. J. Thomson nel 1897',
		'ha massa $9{,}11 \\cdot 10^{-31}\\,\\text{kg}$',
		'ha massa $0{,}000549\\,\\text{u}$',
		'si trova intorno al nucleo, non dentro',
	],
	Protone: [
		'ha carica relativa $+1$',
		'ha carica $+1{,}60 \\cdot 10^{-19}\\,\\text{C}$',
		'ricevette il suo nome da Rutherford nel 1920',
		'coincide con lo ione idrogeno dei raggi canale',
		'ha massa $1{,}673 \\cdot 10^{-27}\\,\\text{kg}$',
		'ha massa $1{,}007\\,\\text{u}$',
	],
	Neutrone: [
		'non ha carica elettrica',
		'fu scoperta da Chadwick nel 1932',
		'ha massa $1{,}009\\,\\text{u}$',
		'ha massa $1{,}675 \\cdot 10^{-27}\\,\\text{kg}$',
		'ha massa appena più grande di quella del protone e nessuna carica',
	],
	'Nessuna delle tre': [
		'ha carica relativa $+2$',
		'ha carica relativa $-2$',
		'ha massa di circa $4\\,\\text{u}$',
		'ha carica $-1{,}60 \\cdot 10^{-19}\\,\\text{C}$ e massa di circa $1\\,\\text{u}$',
		'fu scoperta da Millikan nel 1909',
	],
};

const WHY: Record<Who, string> = {
	Elettrone: "L'elettrone ha carica $-e$, cioè carica relativa $-1$, e massa $9{,}11 \\cdot 10^{-31}\\,\\text{kg}$, pari a $0{,}000549\\,\\text{u}$: la più piccola delle tre. Lo scoprì Thomson nel 1897 studiando i raggi catodici.",
	Protone: 'Il protone ha carica $+e = +1{,}60 \\cdot 10^{-19}\\,\\text{C}$, carica relativa $+1$, e massa $1{,}673 \\cdot 10^{-27}\\,\\text{kg}$, pari a $1{,}007\\,\\text{u}$. È lo ione idrogeno; il nome glielo diede Rutherford nel 1920.',
	Neutrone: 'Il neutrone non ha carica e ha massa $1{,}675 \\cdot 10^{-27}\\,\\text{kg}$, pari a $1{,}009\\,\\text{u}$, appena più del protone. Lo scoprì Chadwick nel 1932.',
	'Nessuna delle tre': 'Le cariche relative delle tre particelle sono $-1$, $+1$ e $0$, e le loro masse sono circa $0$, $1$ e $1\\,\\text{u}$. Millikan misurò la carica elementare, ma non scoprì nessuna particella.',
};

function level1(rng: Rng): Built {
	const who = rng.pick(PARTICLES);
	const k = rng.int(0, PROPERTIES[who].length - 1);
	const prop = PROPERTIES[who][k];
	return {
		prompt: 'Riconosci la particella.',
		problem: textBlock(`Quale particella subatomica ${prop}?`),
		solution: t(who),
		steps: [textBlock(WHY[who])],
		answer: choose(rng, textOpt(who), PARTICLES.filter((x) => x !== who).map((x) => textOpt(x))),
		params: { case: who, prop: k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: discoveries

export const DISCOVERIES = [
	{ who: 'Crookes', what: 'costruì i tubi quasi vuoti in cui si osservano i raggi catodici', year: 0 },
	{ who: 'Goldstein', what: 'osservò per primo i raggi canale', year: 1886 },
	{ who: 'Stoney', what: 'chiamò elettrone la porzione elementare di carica', year: 1891 },
	{ who: 'J. J. Thomson', what: "misurò il rapporto tra la carica e la massa dell'elettrone", year: 1897 },
	{ who: 'Millikan', what: "misurò la carica elementare con le gocce d'olio", year: 1909 },
	{ who: 'Rutherford', what: 'trovò il protone tra i frammenti di atomi di azoto', year: 1919 },
	{ who: 'Chadwick', what: 'scoprì il neutrone', year: 1932 },
];

function level2(rng: Rng): Built {
	const askWho = rng.next() < 0.5;
	const pool = askWho ? DISCOVERIES : DISCOVERIES.filter((d) => d.year > 0);
	const d = rng.pick(pool);
	const others = pool.filter((x) => x !== d);
	const shuffled = others.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
	if (askWho)
		return {
			prompt: 'Scegli lo scienziato.',
			problem: textBlock(`Chi ${d.what}?`),
			solution: t(d.who),
			steps: [textBlock(`Fu ${d.who}${d.year ? `, nel ${d.year}` : ', negli anni Settanta dell\'Ottocento'}.`)],
			answer: choose(rng, textOpt(d.who), shuffled.map((x) => textOpt(x.who))),
			params: { case: 'chi', who: d.who },
		};
	return {
		prompt: "Scegli l'anno.",
		problem: textBlock(`In che anno ${d.who} ${d.what}?`),
		solution: t(String(d.year)),
		steps: [textBlock(`Nel ${d.year}.`)],
		answer: choose(rng, texOpt(String(d.year), String(d.year)), shuffled.map((x) => texOpt(String(x.year), String(x.year)))),
		params: { case: 'quando', who: d.who },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the charge of a group of particles

/** A charge that is k elementary charges, with its sign: +3{,}20 \cdot 10^{-19}\,\text{C}. */
function chargeOpt(k: number) {
	if (k === 0) return texOpt('0\\,\\text{C}', '0');
	const r = sig(Math.abs(k) * 1.6e-19, 3)!;
	return texOpt(`${k > 0 ? '+' : '-'}${r.tex}\\,\\text{C}`, `${k > 0 ? '' : '-'}${r.value}`);
}

function level3(rng: Rng): Built {
	const p = rng.int(3, 20);
	const q = rng.pick([-3, -2, -1, 1, 2, 3]);
	const n = p + rng.int(0, 4);
	const e = p - q;
	const right = chargeOpt(q);
	return {
		prompt: 'Trova la carica.',
		problem: textBlock(`Un gruppo di particelle è formato da $${p}$ protoni, $${n}$ neutroni e $${e}$ elettroni. Quanto vale la sua carica totale? La carica elementare è $e = 1{,}60 \\cdot 10^{-19}\\,\\text{C}$.`),
		solution: right.latex,
		steps: [
			textBlock(`In unità $e$: ogni protone vale $+1$, ogni elettrone $-1$, i neutroni $0$. La carica è $${p} - ${e} = ${q}$.`),
			`Q = ${q} \\cdot 1{,}60 \\cdot 10^{-19}\\,\\text{C} = ${right.latex}`,
		],
		// the sign turned; the neutrons counted as positive; protons and electrons summed; the relative charge as coulombs
		answer: choose(rng, right, [chargeOpt(-q), chargeOpt(q + n), chargeOpt(p + e), texOpt(`${q > 0 ? '+' : '-'}${Math.abs(q)}\\,\\text{C}`, `rel${q}`)]),
		params: { case: q > 0 ? 'positiva' : 'negativa', p, n, e },
	};
}

// ---------------------------------------------------------------------------
// Level 4: masses

const M_P = 1.007, M_E = 0.000549; // u (the neutron, 1,009, only in the text)
const KG_P = 1.673e-27, KG_N = 1.675e-27, KG_E = 9.11e-31;

/** An exact number of thousandths of u as LaTeX with three decimals: 12{,}096\,\text{u}. */
const uOpt = (thousandths: number) => texOpt(`${decTex((thousandths / 1000).toFixed(3))}\\,\\text{u}`, (thousandths / 1000).toFixed(3));
const sigOpt = (x: number, n: number, unit: string) => {
	const r = sig(x, n);
	return r ? texOpt(`${r.tex}\\,\\text{${unit}}`, r.value) : null;
};
const some = <T,>(xs: (T | null)[]) => xs.filter((x): x is T => x !== null);

function level4(rng: Rng): Built {
	const kind = rng.pick(['u', 'kg', 'elettroni'] as const);
	const TABLE = 'Usa le masse della tabella della lezione: protone $1{,}007\\,\\text{u}$, neutrone $1{,}009\\,\\text{u}$, elettrone $0{,}000549\\,\\text{u}$.';
	const TABLE_KG = 'Protone $1{,}673 \\cdot 10^{-27}\\,\\text{kg}$, neutrone $1{,}675 \\cdot 10^{-27}\\,\\text{kg}$, elettrone $9{,}11 \\cdot 10^{-31}\\,\\text{kg}$.';
	if (kind === 'elettroni') {
		const e = rng.int(2, 30);
		const x = e * M_E;
		const r = sig(x, 3);
		if (!r) throw new Error('tie');
		const right = texOpt(`${r.tex}\\,\\text{u}`, r.value);
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`Un atomo ha $${e}$ elettroni. Quanto vale, in unità di massa atomica, la massa di tutti i suoi elettroni? ${TABLE}`),
			solution: right.latex,
			steps: [`m = ${e} \\cdot 0{,}000549\\,\\text{u} = ${decTex(x.toFixed(6).replace(/0+$/, ''))}\\,\\text{u} \\approx ${right.latex}`, textBlock('È una frazione piccolissima della massa dell\'atomo, che è quasi tutta nel nucleo.')],
			// electrons weighed as protons; a factor ten; one electron only
			answer: choose(rng, right, some([sigOpt(e * M_P, 3, 'u'), sigOpt(x * 10, 3, 'u'), sigOpt(x / 10, 3, 'u'), sigOpt(M_E, 3, 'u')])),
			params: { case: 'elettroni', e },
		};
	}
	// nuclei like the real ones: about as many neutrons as protons, a few more in the heavier ones
	const p = rng.int(1, 20);
	const n = p === 1 ? rng.int(0, 1) : p + rng.int(0, Math.max(1, Math.floor(p / 4)));
	if (kind === 'u') {
		const th = p * 1007 + n * 1009;
		const right = uOpt(th);
		return {
			prompt: 'Trova la massa del nucleo.',
			problem: textBlock(`Un nucleo contiene $${p}$ protoni e $${n}$ neutroni. Quanto vale la sua massa, sommando le masse delle particelle? ${TABLE}`),
			solution: right.latex,
			steps: [`m = ${p} \\cdot 1{,}007\\,\\text{u} + ${n} \\cdot 1{,}009\\,\\text{u} = ${right.latex}`],
			// the mass number; the neutrons forgotten; all weighed as neutrons; the two masses swapped
			answer: choose(rng, right, [uOpt((p + n) * 1000), uOpt(p * 1007), uOpt((p + n) * 1009), uOpt(p * 1009 + n * 1007), uOpt((p + n) * 1007)]),
			params: { case: 'u', p, n },
		};
	}
	const x = p * KG_P + n * KG_N;
	const right = sigOpt(x, 3, 'kg');
	if (!right) throw new Error('tie');
	return {
		prompt: 'Trova la massa del nucleo.',
		problem: textBlock(`Un nucleo contiene $${p}$ protoni e $${n}$ neutroni. Quanto vale la sua massa in chilogrammi, sommando le masse delle particelle? ${TABLE_KG}`),
		solution: right.latex,
		steps: [`m = ${p} \\cdot 1{,}673 \\cdot 10^{-27}\\,\\text{kg} + ${n} \\cdot 1{,}675 \\cdot 10^{-27}\\,\\text{kg} \\approx ${right.latex}`],
		// the neutrons forgotten; the electron's mass for the neutrons; a power of ten lost
		answer: choose(rng, right, some([sigOpt(p * KG_P, 3, 'kg'), sigOpt(p * KG_P + n * KG_E, 3, 'kg'), sigOpt(x * 10, 3, 'kg'), sigOpt(x / 10, 3, 'kg')])),
		params: { case: 'kg', p, n },
	};
}

// ---------------------------------------------------------------------------
// Level 5: Millikan's drops

/** k/2 elementary charges (k even for a whole number), as a charge with three significant figures. */
function dropTex(halves: number): { tex: string; value: string } {
	const r = sig((halves / 2) * 1.6e-19, 3)!;
	return { tex: `${r.tex}\\,\\text{C}`, value: r.value };
}

function level5(rng: Rng): Built {
	const E = 'La carica elementare è $e = 1{,}60 \\cdot 10^{-19}\\,\\text{C}$.';
	if (rng.next() < 0.5) {
		const k = rng.int(2, 15);
		const d = dropTex(2 * k);
		const int = (x: number) => texOpt(String(x), String(x));
		return {
			prompt: 'Conta le cariche elementari.',
			problem: textBlock(`Nell'esperimento di Millikan una goccia d'olio ha una carica di $${d.tex}$, in valore assoluto. Quante cariche elementari porta? ${E}`),
			solution: String(k),
			steps: [`\\dfrac{${d.tex}}{1{,}60 \\cdot 10^{-19}\\,\\text{C}} = ${k}`],
			// one more or one less; a power of ten lost in the division
			answer: choose(rng, int(k), [int(k + 1), int(k - 1), int(10 * k), int(k + 2)].filter((o) => Number(o.values[0]) > 0)),
			params: { case: 'quante', k },
		};
	}
	// three drops with whole multiples and one that is not
	const ks = new Set<number>();
	while (ks.size < 3) ks.add(rng.int(1, 12));
	let bad = 0;
	while (!bad || ks.has(bad / 2)) bad = 2 * rng.int(1, 11) + 1; // halves: an odd number of half charges
	const wrong = [...ks].map((k) => dropTex(2 * k));
	const right = dropTex(bad);
	return {
		prompt: 'Trova la carica impossibile.',
		problem: textBlock(`Quale di queste cariche non può essere la carica di una goccia d'olio di Millikan? ${E}`),
		solution: right.tex,
		steps: [
			textBlock('Ogni carica è un multiplo intero di $e$: si divide ciascuna carica per $e$.'),
			`\\dfrac{${right.tex}}{1{,}60 \\cdot 10^{-19}\\,\\text{C}} = ${decTex((bad / 2).toFixed(1))}`,
			textBlock(`Le altre danno ${[...ks].map((k) => `$${k}$`).join(', ').replace(/, ([^,]*)$/, ' e $1')}: numeri interi.`),
		],
		answer: choose(rng, texOpt(right.tex, right.value), wrong.map((w) => texOpt(w.tex, w.value))),
		params: { case: 'impossibile', bad: bad / 2, ks: [...ks] },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const particelleFondamentali: Generator = {
	id: ID,
	title: 'Elettroni, protoni e neutroni',
	levels: {
		1: { label: 'Le tre particelle', constraints: ['una proprietà: elettrone, protone, neutrone o nessuna delle tre'] },
		2: { label: 'Chi e quando', constraints: ['lo scienziato o l\'anno di una scoperta'] },
		3: { label: 'La carica di un gruppo di particelle', constraints: ['protoni, neutroni, elettroni', 'carica in coulomb, tre cifre'] },
		4: { label: 'Le masse', constraints: ['un nucleo in u o in kg, o gli elettroni in u'] },
		5: { label: 'Le gocce di Millikan', constraints: ['quante cariche elementari, o la carica impossibile'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default particelleFondamentali;
