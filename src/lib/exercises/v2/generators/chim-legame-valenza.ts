/**
 * Teoria del legame di valenza: legami sigma e pi greco. Spec: specs/exercises/chim-legame-valenza.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/70-chim-legame-valenza.md), each one step harder: which
 * orbitals overlap in a diatomic molecule; the facts about sigma and pi bonds; what a single, a double and a triple
 * bond are made of; how many pi bonds a molecule has; how many sigma bonds (the C-H bonds of a condensed formula
 * included); both together. Levels 4 and 5 have a whole number as the answer and can be asked as an open answer.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type BuiltG, checkG, choose, generateG, shuffled, textBlock, textOpt, texOpt, toChoiceG } from '../chim3-g';

export const ID = 'chim-legame-valenza';

// ---------------------------------------------------------------------------
// Level 1: which orbitals overlap

/** Symbol → name, configuration as the lessons write it, level of the half-filled orbital, its letter. */
export const ATOMS: Record<string, { nome: string; config: string; n: number; l: 's' | 'p' }> = {
	H: { nome: "l'idrogeno", config: '1s^1', n: 1, l: 's' },
	F: { nome: 'il fluoro', config: '[\\text{He}]\\,2s^2\\,2p^5', n: 2, l: 'p' },
	Cl: { nome: 'il cloro', config: '[\\text{Ne}]\\,3s^2\\,3p^5', n: 3, l: 'p' },
	Br: { nome: 'il bromo', config: '[\\text{Ar}]\\,4s^2\\,3d^{10}\\,4p^5', n: 4, l: 'p' },
	I: { nome: 'lo iodio', config: '[\\text{Kr}]\\,5s^2\\,4d^{10}\\,5p^5', n: 5, l: 'p' },
};
export const DIATOMIC: [string, string][] = [['H', 'H'], ['H', 'F'], ['H', 'Cl'], ['H', 'Br'], ['H', 'I'], ['F', 'F'], ['Cl', 'Cl'], ['Br', 'Br'], ['I', 'I'], ['Cl', 'F'], ['Br', 'F'], ['Br', 'Cl'], ['I', 'Cl'], ['I', 'Br']];

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

function level1(rng: Rng): BuiltG {
	const [a, b] = rng.pick(DIATOMIC);
	const A = ATOMS[a], B = ATOMS[b];
	const formula = a === b ? `\\mathrm{${a}_2}` : `\\mathrm{${a}${b}}`;
	const orb = (n: number, l: string) => `${n}${l}`;
	/** An option: the orbital of the first atom and the orbital of the second. */
	const opt = (x: string, y: string): ChoiceOption => (a === b ? textOpt(`$${x}$ e $${y}$`, `${x}-${y}`) : textOpt(`$${x}$ di $\\mathrm{${a}}$ e $${y}$ di $\\mathrm{${b}}$`, `${x}-${y}`));
	const ra = orb(A.n, A.l), rb = orb(B.n, B.l);
	const others: ChoiceOption[] = [];
	if (a === 'H' && b === 'H') others.push(opt('1s', '2s'), opt('2s', '2s'), opt('1s', '2p'), opt('2p', '2p'));
	else if (a === 'H') others.push(opt('1s', orb(B.n, 's')), opt('1s', orb(B.n + 1, 'p')), opt('1s', '1s'), opt('2s', rb));
	else if (a === b) others.push(opt(orb(A.n, 's'), orb(A.n, 's')), opt(orb(A.n, 's'), ra), opt(orb(A.n - 1, A.n === 2 ? 's' : 'p'), orb(A.n - 1, A.n === 2 ? 's' : 'p')), opt(orb(A.n + 1, 'p'), orb(A.n + 1, 'p')));
	else others.push(opt(rb, ra), opt(orb(A.n, 's'), orb(B.n, 's')), opt(orb(A.n, 's'), rb), opt(ra, orb(B.n, 's')));
	const configs = a === b ? `${cap(A.nome)} ha configurazione $${A.config}$.` : a === 'H' ? `${cap(B.nome)} ha configurazione $${B.config}$.` : `${cap(A.nome)} ha configurazione $${A.config}$, ${B.nome} $${B.config}$.`;
	const why = (X: (typeof ATOMS)[string]) => (X.l === 's' ? `${X.nome} ha il suo unico elettrone nell'orbitale $1s$` : `${X.nome} ha un solo elettrone spaiato, in un orbitale $${orb(X.n, 'p')}$`);
	const right = opt(ra, rb);
	return {
		prompt: 'Scegli gli orbitali.',
		problem: textBlock(`Quali orbitali si sovrappongono nel legame della molecola $${formula}$? ${configs}`),
		solution: right.latex,
		steps: [
			textBlock(a === b ? `Ogni atomo partecipa con l'orbitale che contiene un elettrone spaiato: ${why(A)}.` : `Ogni atomo partecipa con l'orbitale che contiene un elettrone spaiato: ${why(A)}, ${why(B)}.`),
			textBlock(`Si sovrappongono lungo l'asse che unisce i due nuclei: è un legame $\\sigma$.`),
		],
		answer: choose(rng, right, shuffled(rng, others)),
		params: { case: a === 'H' ? (b === 'H' ? 'HH' : 'HX') : a === b ? 'XX' : 'XY', a, b },
	};
}

// ---------------------------------------------------------------------------
// Level 2: sigma and pi, the facts

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: 'Come si sovrappongono gli orbitali in un legame $\\sigma$?', a: "Di testa, lungo l'asse di legame", wrong: ["Di fianco, sopra e sotto l'asse", 'Non si sovrappongono', "Solo sopra l'asse di legame"], why: "In un legame $\\sigma$ i due orbitali si vengono incontro lungo l'asse che unisce i nuclei." },
	{ q: 'Come si sovrappongono gli orbitali in un legame $\\pi$?', a: "Di fianco, sopra e sotto l'asse", wrong: ["Di testa, lungo l'asse di legame", 'Non si sovrappongono', "Solo lungo l'asse di legame"], why: "In un legame $\\pi$ due orbitali $p$ paralleli si toccano di fianco: le zone di sovrapposizione sono due, sopra e sotto l'asse." },
	{ q: 'Quali orbitali possono formare un legame $\\pi$?', a: 'Due orbitali $p$ paralleli', wrong: ['Due orbitali $s$', 'Un orbitale $s$ e un $p$', 'Due orbitali $p$ di testa'], why: "Solo due orbitali $p$ paralleli tra loro e perpendicolari all'asse di legame si sovrappongono di fianco." },
	{ q: 'Due orbitali $s$ si sovrappongono. Che legame formano?', a: 'Un legame $\\sigma$', wrong: ['Un legame $\\pi$', 'Nessun legame', 'Un legame doppio'], why: "Due orbitali $s$ si sovrappongono sull'asse, tra i nuclei: è un legame $\\sigma$, come in $\\mathrm{H_2}$." },
	{ q: "Un orbitale $s$ si sovrappone a un orbitale $p$ diretto lungo l'asse di legame. Che legame formano?", a: 'Un legame $\\sigma$', wrong: ['Un legame $\\pi$', 'Nessun legame', 'Un legame doppio'], why: "La sovrapposizione sta sull'asse: è un legame $\\sigma$, come in $\\mathrm{HF}$." },
	{ q: "Due orbitali $p$ si sovrappongono di testa, lungo l'asse di legame. Che legame formano?", a: 'Un legame $\\sigma$', wrong: ['Un legame $\\pi$', 'Nessun legame', 'Due legami $\\pi$'], why: "Di testa la sovrapposizione sta sull'asse: è un legame $\\sigma$, come in $\\mathrm{F_2}$." },
	{ q: 'Due orbitali $p$ paralleli si sovrappongono di fianco. Che legame formano?', a: 'Un legame $\\pi$', wrong: ['Un legame $\\sigma$', 'Nessun legame', 'Due legami $\\pi$'], why: "Di fianco le zone di sovrapposizione sono sopra e sotto l'asse: è un legame $\\pi$, uno solo, con una coppia di elettroni." },
	{ q: 'Tra gli stessi due atomi, quale legame è più forte?', a: 'Il legame $\\sigma$', wrong: ['Il legame $\\pi$', 'Sono forti uguale', 'Dipende dalla temperatura'], why: 'Due orbitali che si vengono incontro si sovrappongono più di due orbitali affiancati: il $\\sigma$ è più forte del $\\pi$.' },
	{ q: 'Attorno a quale legame gli atomi possono ruotare liberamente?', a: 'Attorno a un legame singolo', wrong: ['Attorno a un legame doppio', 'Attorno a un legame triplo', 'Attorno a nessun legame'], why: 'Un legame singolo è un $\\sigma$, e ruotando la sovrapposizione non cambia. In un legame doppio la rotazione romperebbe il $\\pi$.' },
	{ q: 'Quante coppie di elettroni contiene un legame $\\pi$?', a: 'Una', wrong: ['Due', 'Tre', 'Quattro'], why: 'Il legame $\\pi$ ha due zone di sovrapposizione, ma è un legame solo, con una coppia di elettroni.' },
	{ q: 'Quanti legami $\\sigma$ possono esserci tra due atomi?', a: 'Uno solo', wrong: ['Fino a due', 'Fino a tre', 'Uno per ogni elettrone spaiato'], why: "L'asse di legame è uno, e c'è posto per un solo $\\sigma$: gli altri legami tra gli stessi atomi sono $\\pi$." },
	{ q: 'Che spin hanno i due elettroni di un legame covalente?', a: 'Opposto', wrong: ['Uguale', 'Nullo', 'Qualunque'], why: 'Nella zona di sovrapposizione i due elettroni hanno spin opposto, per il principio di esclusione di Pauli.' },
	{ q: 'Secondo la teoria del legame di valenza, quanti legami forma un atomo?', a: 'Quanti sono i suoi elettroni spaiati', wrong: ['Quanti sono i suoi elettroni di valenza', 'Quante sono le sue coppie solitarie', 'Quanti sono i suoi orbitali pieni'], why: 'Ogni legame usa un orbitale con un elettrone spaiato: gli orbitali già pieni sono le coppie solitarie.' },
	{ q: 'Dove si trova la zona di sovrapposizione di un legame $\\sigma$?', a: "Sull'asse, tra i due nuclei", wrong: ["Sopra e sotto l'asse", "Fuori dall'asse, da un lato solo", 'Lontano dai due nuclei'], why: "In un legame $\\sigma$ la sovrapposizione sta sull'asse di legame, tra i due nuclei." },
	{ q: 'Un orbitale $s$ può formare un legame $\\pi$?', a: 'No, mai', wrong: ['Sì, con un altro $s$', 'Sì, con un $p$', 'Sì, sempre'], why: 'Un orbitale $s$ affiancato a un $p$ si sovrappone a due lobi di segno opposto, e i contributi si annullano: i legami $\\pi$ sono solo tra orbitali $p$.' },
];

function level2(rng: Rng): BuiltG {
	const k = rng.int(0, FACTS.length - 1);
	const f = FACTS[k];
	const right = textOpt(f.a);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: right.latex,
		steps: [textBlock(f.why)],
		answer: choose(rng, right, f.wrong.map((x) => textOpt(x))),
		params: { case: 'fatto', k },
	};
}

// ---------------------------------------------------------------------------
// Level 3: single, double and triple bonds

export const BONDS: [string, string, number][] = [
	['C', 'H', 1], ['C', 'C', 1], ['C', 'Cl', 1], ['N', 'H', 1], ['O', 'H', 1], ['C', 'O', 1],
	['C', 'C', 2], ['C', 'O', 2], ['O', 'O', 2], ['C', 'N', 2], ['N', 'N', 2], ['N', 'O', 2],
	['C', 'C', 3], ['C', 'N', 3], ['N', 'N', 3],
];
const LINK = ['', '{-}', '{=}', '{\\equiv}'];
/** "1 σ e 2 π" as an option. */
function sp(sigma: number, pi: number): ChoiceOption {
	const parts = [sigma ? `${sigma}\\,\\sigma` : '', pi ? `${pi}\\,\\pi` : ''].filter(Boolean);
	return texOpt(parts.join('\\text{ e }'), `${sigma},${pi}`);
}
const ORDER_NAME = ['', 'singolo', 'doppio', 'triplo'];

function level3(rng: Rng): BuiltG {
	const order = rng.next() < 0.25 ? 1 : rng.next() < 0.5 ? 2 : 3;
	const [a, b] = rng.pick(BONDS.filter((x) => x[2] === order));
	const tex = `\\mathrm{${a}${LINK[order]}${b}}`;
	const right = sp(1, order - 1);
	const others = order === 1 ? [sp(0, 1), sp(1, 1), sp(2, 0)] : order === 2 ? [sp(2, 0), sp(0, 2), sp(1, 2)] : [sp(3, 0), sp(2, 1), sp(0, 3)];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Di quali legami è fatto il legame $${tex}$?`),
		solution: right.latex,
		steps: [textBlock(`È un legame ${ORDER_NAME[order]}. Tra due atomi c'è sempre un solo legame $\\sigma$${order === 1 ? ', e un legame singolo è fatto solo di quello.' : `: ${order === 2 ? "l'altro legame è un $\\pi$." : 'gli altri due legami sono $\\pi$.'}`}`)],
		answer: choose(rng, right, others),
		params: { case: ORDER_NAME[order], a, b },
	};
}

// ---------------------------------------------------------------------------
// Levels 4, 5 and 6: counting in a molecule

/** A molecule as a condensed formula, with its sigma and pi bonds, the bonds drawn in the formula, the multiple bonds. */
export const MOLECULES: { tex: string; sigma: number; pi: number; drawn: number; multiple: number }[] = [
	{ tex: 'N{\\equiv}N', sigma: 1, pi: 2, drawn: 1, multiple: 1 },
	{ tex: 'O{=}O', sigma: 1, pi: 1, drawn: 1, multiple: 1 },
	{ tex: 'O{=}C{=}O', sigma: 2, pi: 2, drawn: 2, multiple: 2 },
	{ tex: 'H{-}C{\\equiv}N', sigma: 2, pi: 2, drawn: 2, multiple: 1 },
	{ tex: 'H_2C{=}O', sigma: 3, pi: 1, drawn: 1, multiple: 1 },
	{ tex: 'CH_2{=}CH_2', sigma: 5, pi: 1, drawn: 1, multiple: 1 },
	{ tex: 'HC{\\equiv}CH', sigma: 3, pi: 2, drawn: 1, multiple: 1 },
	{ tex: 'CH_3{-}CH_3', sigma: 7, pi: 0, drawn: 1, multiple: 0 },
	{ tex: 'CH_3{-}CH{=}CH_2', sigma: 8, pi: 1, drawn: 2, multiple: 1 },
	{ tex: 'CH_3{-}C{\\equiv}CH', sigma: 6, pi: 2, drawn: 2, multiple: 1 },
	{ tex: 'CH_2{=}CH{-}CH{=}CH_2', sigma: 9, pi: 2, drawn: 3, multiple: 2 },
	{ tex: 'CH_2{=}C{=}CH_2', sigma: 6, pi: 2, drawn: 2, multiple: 2 },
	{ tex: 'CH_3{-}CH{=}O', sigma: 6, pi: 1, drawn: 2, multiple: 1 },
	{ tex: 'CH_3{-}CH_2{-}CH_3', sigma: 10, pi: 0, drawn: 2, multiple: 0 },
	{ tex: 'CH_3{-}C{\\equiv}N', sigma: 5, pi: 2, drawn: 2, multiple: 1 },
	{ tex: 'CH_3{-}CH{=}CH{-}CH_3', sigma: 11, pi: 1, drawn: 3, multiple: 1 },
	{ tex: 'CH_2{=}CHCl', sigma: 5, pi: 1, drawn: 1, multiple: 1 },
	{ tex: 'HC{\\equiv}C{-}C{\\equiv}CH', sigma: 5, pi: 4, drawn: 3, multiple: 2 },
	{ tex: 'CH_2{=}CH{-}C{\\equiv}N', sigma: 6, pi: 3, drawn: 3, multiple: 2 },
];
const numOpt = (k: number) => texOpt(String(k), String(k));
const mol = (x: (typeof MOLECULES)[number]) => `\\mathrm{${x.tex}}`;
const doubles = (x: (typeof MOLECULES)[number]) => (x.tex.match(/\{=\}/g) ?? []).length;
const triples = (x: (typeof MOLECULES)[number]) => (x.tex.match(/\{\\equiv\}/g) ?? []).length;
const plural = (n: number, one: string, many: string) => (n === 1 ? `$1$ ${one}` : `$${n}$ ${many}`);

/** The count of pi bonds, in words. */
function piSteps(x: (typeof MOLECULES)[number]): string {
	const d = doubles(x), tr = triples(x);
	if (!d && !tr) return 'Nella molecola ci sono solo legami singoli: nessun legame $\\pi$.';
	const parts = [d ? `${plural(d, 'legame doppio', 'legami doppi')}, con un $\\pi$ ciascuno` : '', tr ? `${plural(tr, 'legame triplo', 'legami tripli')}, con due $\\pi$ ciascuno` : ''].filter(Boolean);
	return `Nella molecola ci sono ${parts.join(', e ')}: in tutto $${x.pi}$ legami $\\pi$.`.replace('in tutto $1$ legami', 'in tutto $1$ legame');
}
/** The count of sigma bonds, in words. */
function sigmaSteps(x: (typeof MOLECULES)[number]): string {
	const hidden = x.sigma - x.drawn;
	return hidden
		? `Ogni coppia di atomi legati ha un legame $\\sigma$. Nella formula sono disegnati $${x.drawn}$ legami tra atomi; i legami con l'idrogeno che la formula condensata non disegna sono $${hidden}$. In tutto $${x.drawn} + ${hidden} = ${x.sigma}$ legami $\\sigma$.`
		: `Ogni coppia di atomi legati ha un legame $\\sigma$, qualunque sia il tipo di legame: le coppie sono $${x.sigma}$, quindi i legami $\\sigma$ sono $${x.sigma}$.`;
}

function level4(rng: Rng): BuiltG {
	const x = rng.pick(MOLECULES);
	const others = [x.multiple, x.pi + x.multiple, x.pi + 1, x.pi - 1, x.sigma, x.pi + 2].filter((k) => k >= 0 && k !== x.pi).map(numOpt);
	return {
		prompt: 'Conta i legami.',
		problem: textBlock(`Quanti legami $\\pi$ ci sono nella molecola $${mol(x)}$?`),
		solution: String(x.pi),
		steps: [textBlock(piSteps(x))],
		answer: choose(rng, numOpt(x.pi), others),
		number: x.pi,
		params: { case: x.pi === 0 ? 'nessuno' : 'pi', tex: x.tex },
	};
}

function level5(rng: Rng): BuiltG {
	const x = rng.pick(MOLECULES);
	const others = [x.drawn, x.sigma + x.pi, x.drawn + x.pi, x.sigma - 1, x.sigma + 1, x.sigma + 2].filter((k) => k > 0 && k !== x.sigma).map(numOpt);
	return {
		prompt: 'Conta i legami.',
		problem: textBlock(`Quanti legami $\\sigma$ ci sono nella molecola $${mol(x)}$?`),
		solution: String(x.sigma),
		steps: [textBlock(sigmaSteps(x))],
		answer: choose(rng, numOpt(x.sigma), others),
		number: x.sigma,
		params: { case: x.sigma === x.drawn ? 'disegnati' : 'nascosti', tex: x.tex },
	};
}

function level6(rng: Rng): BuiltG {
	const x = rng.pick(MOLECULES.filter((y) => y.pi > 0));
	const pair = (s: number, p: number) => texOpt(`${s}\\,\\sigma\\text{ e }${p}\\,\\pi`, `${s},${p}`);
	const others = [pair(x.drawn, x.pi), pair(x.sigma + x.pi, x.pi), pair(x.sigma, x.multiple), pair(x.pi, x.sigma), pair(x.sigma - x.pi, x.pi), pair(x.sigma, x.pi + x.multiple), pair(x.sigma + 1, x.pi), pair(x.sigma, x.pi + 1)].filter((o) => !o.values[0].startsWith('0,') && !o.values[0].startsWith('-'));
	const right = pair(x.sigma, x.pi);
	return {
		prompt: 'Conta i legami.',
		problem: textBlock(`Quanti legami $\\sigma$ e quanti legami $\\pi$ ci sono nella molecola $${mol(x)}$?`),
		solution: right.latex,
		steps: [textBlock(sigmaSteps(x)), textBlock(piSteps(x))],
		answer: choose(rng, right, others),
		params: { case: 'entrambi', tex: x.tex },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltG> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkG(sample);
}

export const chimLegameValenza: Generator = {
	id: ID,
	title: 'Teoria del legame di valenza: legami sigma e pi greco',
	levels: {
		1: { label: 'Quali orbitali si sovrappongono', constraints: ['molecole biatomiche di idrogeno e alogeni', "l'orbitale con l'elettrone spaiato"] },
		2: { label: 'Legame sigma e legame pi greco', constraints: ['quindici domande della lezione'] },
		3: { label: 'Singolo, doppio e triplo', constraints: ['un σ sempre, i π in più'] },
		4: { label: 'Contare i legami pi greco', constraints: ['uno per ogni doppio, due per ogni triplo', 'risposta: un numero'] },
		5: { label: 'Contare i legami sigma', constraints: ['uno per ogni coppia di atomi legati, idrogeni compresi', 'risposta: un numero'] },
		6: { label: 'Sigma e pi greco insieme', constraints: ['molecole con almeno un legame multiplo'] },
	},
	generate: generateG(ID, LEVELS, check),
	check,
	toChoice: toChoiceG,
};

export default chimLegameValenza;
