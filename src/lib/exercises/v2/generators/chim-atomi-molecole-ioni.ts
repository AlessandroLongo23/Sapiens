/**
 * Atomi, molecole e ioni. Spec: specs/exercises/chim-atomi-molecole-ioni.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/27-chim-atomi-molecole-ioni.md), all multiple choice on
 * particles drawn from the lesson's tables: what a formula is (an atom, a molecule of an element or of a compound, an
 * ion); the ion an atom forms when it loses or gains electrons; the electrons an ion has lost or gained; the name of an
 * ion; the particles a substance is made of. Distractors from the lesson's warnings: the sign of the charge upside down
 * ("perdere dà meno"), the charge written as an index, the anion named like the element, the metal taken for a
 * molecular substance, the ammonium salt taken for a molecular one.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, NAME, checkCommon, choose, formulaOpt, fx, generateWith, pf, shuffle, t, textBlock, textOpt } from '../chim-trasformazioni';

export const ID = 'chim-atomi-molecole-ioni';

// ---------------------------------------------------------------------------
// Level 1: atom, molecule or ion

const KINDS = ['atomo', 'molecola di un elemento', 'molecola di un composto', 'ione'] as const;
type Kind = (typeof KINDS)[number];
const LABEL: Record<Kind, string> = { atomo: 'Un atomo', 'molecola di un elemento': 'Una molecola di un elemento', 'molecola di un composto': 'Una molecola di un composto', ione: 'Uno ione' };
const PARTICLES: Record<Kind, string[]> = {
	atomo: ['He', 'Ne', 'Ar', 'Na', 'Fe', 'Cu', 'Mg', 'C', 'S', 'Ca'],
	'molecola di un elemento': ['H2', 'O2', 'N2', 'Cl2', 'O3', 'P4', 'S8', 'Br2', 'F2', 'I2'],
	'molecola di un composto': ['H2O', 'CO2', 'NH3', 'CH4', 'HCl', 'SO2', 'C2H6O', 'NO2', 'H2O2', 'CO'],
	ione: ['Na^+', 'Cl^-', 'Mg^2+', 'O^2-', 'NH4^+', 'SO4^2-', 'OH^-', 'Al^3+', 'NO3^-', 'S^2-', 'CO3^2-', 'K^+', 'Ca^2+'],
};
const WHY: Record<Kind, string> = {
	atomo: 'Un solo simbolo, senza indice e senza carica: è un atomo.',
	'molecola di un elemento': 'Più atomi, tutti dello stesso elemento, senza carica: è una molecola di un elemento.',
	'molecola di un composto': 'Atomi di elementi diversi legati, senza carica: è una molecola di un composto.',
	ione: 'La formula ha una carica: è uno ione.',
};

function level1(rng: Rng): Built {
	const kind = rng.pick(KINDS);
	const f = rng.pick(PARTICLES[kind]);
	return {
		prompt: 'Riconosci la particella.',
		problem: textBlock(`Che cos'è la particella ${pf(f)}?`),
		solution: t(LABEL[kind]),
		steps: [t(WHY[kind])],
		answer: choose(rng, textOpt(LABEL[kind], kind), shuffle(rng, KINDS.filter((k) => k !== kind)).map((k) => textOpt(LABEL[k], k))),
		params: { case: kind, particle: f },
	};
}

// ---------------------------------------------------------------------------
// Levels 2-4: ions

type Ion = { el: string; q: number; nome: string };
const SIMPLE: Ion[] = [
	{ el: 'Na', q: 1, nome: 'sodio' },
	{ el: 'K', q: 1, nome: 'potassio' },
	{ el: 'Mg', q: 2, nome: 'magnesio' },
	{ el: 'Ca', q: 2, nome: 'calcio' },
	{ el: 'Al', q: 3, nome: 'alluminio' },
	{ el: 'Fe', q: 2, nome: 'ferro(II)' },
	{ el: 'Fe', q: 3, nome: 'ferro(III)' },
	{ el: 'F', q: -1, nome: 'fluoruro' },
	{ el: 'Cl', q: -1, nome: 'cloruro' },
	{ el: 'Br', q: -1, nome: 'bromuro' },
	{ el: 'I', q: -1, nome: 'ioduro' },
	{ el: 'O', q: -2, nome: 'ossido' },
	{ el: 'S', q: -2, nome: 'solfuro' },
	{ el: 'N', q: -3, nome: 'nitruro' },
];
/** "Mg^2+", "Cl^-". */
const ionF = (el: string, q: number) => `${el}^${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`;
const electrons = (n: number) => (n === 1 ? 'un elettrone' : `${n} elettroni`);

function level2(rng: Rng): Built {
	const ion = rng.pick(SIMPLE.filter((i) => i.el !== 'Fe'));
	const n = Math.abs(ion.q);
	const loses = ion.q > 0;
	const right = ionF(ion.el, ion.q);
	const mistakes = [ionF(ion.el, -ion.q), `${ion.el}${n === 1 ? 2 : n}`, ionF(ion.el, ion.q > 0 ? ion.q + 1 : ion.q - 1), ionF(ion.el, -(n === 1 ? 2 : n + 1) * Math.sign(ion.q))];
	return {
		prompt: 'Scegli lo ione.',
		problem: textBlock(`Un atomo di ${NAME[ion.el]} ${loses ? 'perde' : 'acquista'} ${electrons(n)}. Che ione si forma?`),
		solution: fx(right),
		steps: [
			t(loses ? `Gli elettroni sono negativi: perdendone ${n}, l'atomo resta con ${n} ${n === 1 ? 'carica positiva' : 'cariche positive'} in più.` : `Gli elettroni sono negativi: acquistandone ${n}, l'atomo ha ${n} ${n === 1 ? 'carica negativa' : 'cariche negative'} in più.`),
			t(`Si forma ${loses ? 'un catione' : 'un anione'}, lo ione ${ion.nome}:`) + ` \\ ${fx(right)}`,
		],
		// the sign upside down; the number as an index; one electron more; the sign upside down and one more
		answer: choose(rng, formulaOpt(right), mistakes.map(formulaOpt)),
		params: { case: loses ? 'perde' : 'acquista', element: ion.el, n },
	};
}

function level3(rng: Rng): Built {
	const ion = rng.pick(SIMPLE);
	const n = Math.abs(ion.q);
	const lost = ion.q > 0;
	const say = (l: boolean, k: number) => `Ha ${l ? 'perso' : 'acquistato'} ${electrons(k)}`;
	const val = (l: boolean, k: number) => `${l ? 'perso' : 'acquistato'} ${k}`;
	const other = n === 1 ? 2 : n - 1;
	return {
		prompt: 'Conta gli elettroni.',
		problem: textBlock(`L'atomo da cui viene lo ione ${pf(ionF(ion.el, ion.q))} ha perso o acquistato elettroni? Quanti?`),
		solution: t(say(lost, n)),
		steps: [t(`La carica è ${lost ? 'positiva' : 'negativa'} e vale ${n}: gli elettroni sono negativi, quindi l'atomo ${lost ? 'ne ha persi' : 'ne ha acquistati'} ${n}.`)],
		// the sign read upside down; one electron less or more
		answer: choose(rng, textOpt(say(lost, n), val(lost, n)), [textOpt(say(!lost, n), val(!lost, n)), textOpt(say(lost, other), val(lost, other)), textOpt(say(!lost, other), val(!lost, other))]),
		params: { case: lost ? 'catione' : 'anione', ion: ionF(ion.el, ion.q) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the name of an ion

const NAMES: { f: string; nome: string; near: string[] }[] = [
	{ f: 'Na^+', nome: 'ione sodio', near: ['ione soduro'] },
	{ f: 'K^+', nome: 'ione potassio', near: ['ione potassuro'] },
	{ f: 'Mg^2+', nome: 'ione magnesio', near: ['ione magnesuro'] },
	{ f: 'Ca^2+', nome: 'ione calcio', near: ['ione calciuro', 'ione carbonato'] },
	{ f: 'Al^3+', nome: 'ione alluminio', near: ['ione alluminuro'] },
	{ f: 'F^-', nome: 'ione fluoruro', near: ['ione fluoro'] },
	{ f: 'Cl^-', nome: 'ione cloruro', near: ['ione cloro'] },
	{ f: 'Br^-', nome: 'ione bromuro', near: ['ione bromo'] },
	{ f: 'I^-', nome: 'ione ioduro', near: ['ione iodio'] },
	{ f: 'O^2-', nome: 'ione ossido', near: ['ione ossigeno', 'ione idrossido'] },
	{ f: 'S^2-', nome: 'ione solfuro', near: ['ione zolfo', 'ione solfato'] },
	{ f: 'N^3-', nome: 'ione nitruro', near: ['ione azoto', 'ione nitrato'] },
	{ f: 'NH4^+', nome: 'ione ammonio', near: ['ione ammoniaca', 'ione azoto'] },
	{ f: 'OH^-', nome: 'ione idrossido', near: ['ione ossido', 'ione idrogeno'] },
	{ f: 'NO3^-', nome: 'ione nitrato', near: ['ione nitruro', 'ione azoto'] },
	{ f: 'SO4^2-', nome: 'ione solfato', near: ['ione solfuro', 'ione zolfo'] },
	{ f: 'CO3^2-', nome: 'ione carbonato', near: ['ione carbonio', 'ione idrogenocarbonato'] },
	{ f: 'HCO3^-', nome: 'ione idrogenocarbonato', near: ['ione carbonato', 'ione carbonio'] },
	{ f: 'PO4^3-', nome: 'ione fosfato', near: ['ione fosforo', 'ione fosfuro'] },
	{ f: 'H^+', nome: 'ione idrogeno', near: ['ione idruro', 'ione idrossido'] },
];

function level4(rng: Rng): Built {
	const ion = rng.pick(NAMES);
	const others = shuffle(rng, NAMES.filter((x) => x !== ion).map((x) => x.nome));
	const body = ion.f.split('^')[0];
	const poly = /\d/.test(body) || (body.match(/[A-Z]/g) ?? []).length > 1;
	const anion = ion.f.endsWith('-');
	const why = !anion ? (poly ? 'È uno ione poliatomico: il suo nome si impara con la tabella della lezione.' : "Il catione prende il nome dell'elemento.") : poly ? 'È uno ione poliatomico: il suo nome si impara con la tabella della lezione.' : ion.f.startsWith('O^') ? 'Lo ione dell\'ossigeno si chiama ione ossido.' : "L'anione di un solo atomo prende la desinenza -uro.";
	return {
		prompt: 'Scegli il nome.',
		problem: textBlock(`Come si chiama lo ione ${pf(ion.f)}?`),
		solution: t(ion.nome),
		steps: [t(why)],
		answer: choose(rng, textOpt(ion.nome), ion.near.map((x) => textOpt(x)), others.map((x) => textOpt(x))),
		params: { case: !anion ? 'catione' : poly ? 'poliatomico' : 'anione', ion: ion.f },
	};
}

// ---------------------------------------------------------------------------
// Level 5: what a substance is made of

const MADE = ['atomi isolati', 'atomi di un metallo', 'molecole', 'ioni'] as const;
type Made = (typeof MADE)[number];
const MADE_LABEL: Record<Made, string> = { 'atomi isolati': 'Atomi isolati', 'atomi di un metallo': 'Atomi impacchettati di un metallo', molecole: 'Molecole', ioni: 'Ioni' };
const SUBSTANCES: Record<Made, { nome: string; f: string }[]> = {
	'atomi isolati': [
		{ nome: "l'elio", f: 'He' },
		{ nome: 'il neon', f: 'Ne' },
		{ nome: "l'argon", f: 'Ar' },
	],
	'atomi di un metallo': [
		{ nome: 'il ferro', f: 'Fe' },
		{ nome: 'il rame', f: 'Cu' },
		{ nome: "l'alluminio", f: 'Al' },
		{ nome: 'il sodio', f: 'Na' },
		{ nome: 'il magnesio', f: 'Mg' },
	],
	molecole: [
		{ nome: "l'ossigeno", f: 'O2' },
		{ nome: "l'azoto", f: 'N2' },
		{ nome: 'il cloro', f: 'Cl2' },
		{ nome: "l'acqua", f: 'H2O' },
		{ nome: "l'anidride carbonica", f: 'CO2' },
		{ nome: "l'ammoniaca", f: 'NH3' },
		{ nome: 'il metano', f: 'CH4' },
		{ nome: 'lo zolfo', f: 'S8' },
		{ nome: 'il bromo', f: 'Br2' },
		{ nome: 'il glucosio', f: 'C6H12O6' },
	],
	ioni: [
		{ nome: 'il cloruro di sodio', f: 'NaCl' },
		{ nome: 'il bromuro di potassio', f: 'KBr' },
		{ nome: 'il cloruro di calcio', f: 'CaCl2' },
		{ nome: "l'ossido di magnesio", f: 'MgO' },
		{ nome: 'il nitrato di potassio', f: 'KNO3' },
		{ nome: 'il carbonato di calcio', f: 'CaCO3' },
		{ nome: 'il cloruro di ammonio', f: 'NH4Cl' },
		{ nome: 'il solfato di sodio', f: 'Na2SO4' },
		{ nome: 'il fluoruro di potassio', f: 'KF' },
	],
};
const MADE_WHY: Record<Made, string> = {
	'atomi isolati': 'è un gas nobile: i suoi atomi stanno da soli.',
	'atomi di un metallo': 'è un metallo: atomi tutti uguali impacchettati, senza molecole separate.',
	molecole: 'contiene solo non metalli: le sue particelle sono molecole.',
	ioni: 'contiene un metallo e un non metallo, o uno ione poliatomico: è un composto ionico.',
};

function level5(rng: Rng): Built {
	const made = rng.pick(MADE);
	const s = rng.pick(SUBSTANCES[made]);
	const cap = s.nome.charAt(0).toUpperCase() + s.nome.slice(1);
	return {
		prompt: 'Scegli le particelle.',
		problem: textBlock(`Di che particelle è fatta la sostanza ${pf(s.f)}, ${s.nome.replace(/^(il |lo |la |l')/, '')}?`),
		solution: t(MADE_LABEL[made]),
		steps: [t(`${cap} ${MADE_WHY[made]}`)],
		answer: choose(rng, textOpt(MADE_LABEL[made], made), shuffle(rng, MADE.filter((m) => m !== made)).map((m) => textOpt(MADE_LABEL[m], m))),
		params: { case: made, substance: s.f },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimAtomiMolecoleIoni: Generator = {
	id: ID,
	title: 'Atomi, molecole e ioni',
	levels: {
		1: { label: 'Atomo, molecola o ione', constraints: ['particelle delle tabelle della lezione'] },
		2: { label: "Dall'atomo allo ione", constraints: ['elettroni persi o acquistati, da 1 a 3'] },
		3: { label: 'Gli elettroni di uno ione', constraints: ['cationi e anioni di un solo atomo'] },
		4: { label: 'Il nome dello ione', constraints: ['ioni di un atomo e poliatomici'] },
		5: { label: 'Di che particelle è fatta', constraints: ['gas nobili, metalli, sostanze molecolari, composti ionici'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimAtomiMolecoleIoni;
