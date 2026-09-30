/**
 * Trasformazioni fisiche e trasformazioni chimiche. Spec: specs/exercises/chim-trasformazioni-fisiche-chimiche.md
 *
 * Four levels from the lesson (docs/lezioni/chimica/riscritte/21-chim-trasformazioni-fisiche-chimiche.md), all
 * multiple choice on everyday situations: the chemical (or the physical) change among four; the reactants (or the
 * products) of a reaction told in words; the clue of a reaction that a story shows (a gas, a precipitate, a colour,
 * heat and light); whether a clue that looks like a reaction means a new substance, with the reason.
 *
 * The situations come from small tables written from the lesson; the checker has its own copy of the classification.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, choose, generateWith, pickDistinct, shuffle, t, textBlock, textOpt } from '../chim-leggi-ponderali';

export const ID = 'chim-trasformazioni-fisiche-chimiche';

// ---------------------------------------------------------------------------
// Level 1: the chemical change among four, or the physical one

/** Situations with the reason of their kind, for the solution. */
export const CHEMICAL: [string, string][] = [
	['Il ferro che arrugginisce', 'la ruggine è una sostanza nuova, diversa dal ferro'],
	['Il legno che brucia', "si formano gas e cenere, che prima non c'erano"],
	["L'uovo che cuoce", "si formano sostanze nuove, e l'uovo non torna crudo"],
	['Il latte che inacidisce', "si forma un acido che prima non c'era"],
	['Il mosto che fermenta', 'lo zucchero del mosto diventa alcol e diossido di carbonio'],
	['Lo zucchero che caramella', 'il caramello è una sostanza nuova, bruna e amara'],
	['La mela tagliata che annerisce', "la parte scura è una sostanza nuova, che si forma all'aria"],
	['Il gas del fornello che brucia', 'il metano diventa diossido di carbonio e acqua'],
	["L'aceto versato sul bicarbonato", 'si forma diossido di carbonio, un gas nuovo'],
	['Il pane che si tosta', 'la crosta bruna è fatta di sostanze nuove'],
	["L'argento che annerisce", 'lo strato nero è una sostanza nuova, non argento'],
	['Il rame del tetto che diventa verde', 'lo strato verde è una sostanza nuova, non rame'],
	["L'acqua decomposta con la corrente", "l'acqua diventa idrogeno e ossigeno"],
	['Il cemento che fa presa', "il cemento e l'acqua formano sostanze nuove, dure"],
];
export const PHYSICAL: [string, string][] = [
	['Il ghiaccio che fonde', "l'acqua cambia stato, ma resta acqua"],
	["L'acqua che bolle", "l'acqua passa allo stato di vapore, ma resta acqua"],
	['Lo zucchero che si scioglie nel tè', 'lo zucchero sciolto è ancora zucchero'],
	['La pozzanghera che si asciuga', "l'acqua evapora, ma resta acqua"],
	['Il caffè in grani macinato', 'cambia la forma, non la sostanza'],
	['Il filo di rame piegato', 'cambia la forma, non la sostanza'],
	['Il bicchiere che si rompe', 'i pezzi sono ancora vetro'],
	['Il vapore che si condensa sullo specchio', 'il vapore torna acqua liquida'],
	['La cera fusa che si solidifica', 'la cera cambia stato, ma resta cera'],
	['La naftalina che sublima', 'la naftalina passa allo stato di vapore, ma resta naftalina'],
	["La sabbia filtrata dall'acqua", 'si separa un miscuglio, i componenti restano gli stessi'],
	['Il ferro separato con la calamita', 'si separa un miscuglio, il ferro resta ferro'],
	['Il cioccolato che fonde in mano', 'il cioccolato cambia stato, ma resta cioccolato'],
	["Il sale che si scioglie nell'acqua", 'il sale sciolto è ancora sale'],
];

function level1(rng: Rng): Built {
	const askChem = rng.next() < 0.5;
	const [right] = pickDistinct(rng, askChem ? CHEMICAL : PHYSICAL, 1);
	const others = pickDistinct(rng, askChem ? PHYSICAL : CHEMICAL, 3);
	const kind = askChem ? 'chimica' : 'fisica';
	return {
		prompt: `Scegli la trasformazione ${kind}.`,
		problem: textBlock(`Quale di queste trasformazioni è ${kind}?`),
		solution: t(right[0]),
		steps: [
			textBlock(`${right[0]}: ${askChem ? 'è una trasformazione chimica' : 'è una trasformazione fisica'}, perché ${right[1]}. ${askChem ? "Le altre tre sono fisiche: alla fine le sostanze sono le stesse dell'inizio." : 'Le altre tre sono chimiche: si formano sostanze nuove.'}`),
		],
		answer: choose(rng, textOpt(right[0]), others.map((o) => textOpt(o[0]))),
		params: { case: kind, right: right[0], others: others.map((o) => o[0]) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: reactants and products

export interface Reaction {
	story: string;
	reagenti: string[];
	prodotti: string[];
}
export const REACTIONS: Reaction[] = [
	{ story: "Il metano del fornello brucia con l'ossigeno dell'aria, e si formano diossido di carbonio e acqua.", reagenti: ['metano', 'ossigeno'], prodotti: ['diossido di carbonio', 'acqua'] },
	{ story: "Il ferro, all'aria umida, reagisce con l'ossigeno e con l'acqua e si trasforma in ruggine.", reagenti: ['ferro', 'ossigeno', 'acqua'], prodotti: ['ruggine'] },
	{ story: 'Scaldando il carbonato di calcio si ottengono ossido di calcio e diossido di carbonio.', reagenti: ['carbonato di calcio'], prodotti: ['ossido di calcio', 'diossido di carbonio'] },
	{ story: "Il magnesio brucia nell'ossigeno e forma ossido di magnesio.", reagenti: ['magnesio', 'ossigeno'], prodotti: ['ossido di magnesio'] },
	{ story: "Con la corrente elettrica l'acqua si decompone in idrogeno e ossigeno.", reagenti: ['acqua'], prodotti: ['idrogeno', 'ossigeno'] },
	{ story: "Il bicarbonato di sodio reagisce con l'acido acetico dell'aceto, e si formano acetato di sodio, acqua e diossido di carbonio.", reagenti: ['bicarbonato di sodio', 'acido acetico'], prodotti: ['acetato di sodio', 'acqua', 'diossido di carbonio'] },
	{ story: 'Scaldati insieme, il ferro e lo zolfo formano solfuro di ferro.', reagenti: ['ferro', 'zolfo'], prodotti: ['solfuro di ferro'] },
	{ story: "Nelle foglie, alla luce, il diossido di carbonio e l'acqua si trasformano in glucosio e ossigeno.", reagenti: ['diossido di carbonio', 'acqua'], prodotti: ['glucosio', 'ossigeno'] },
	{ story: "Lo zinco immerso nell'acido cloridrico si consuma, e si formano cloruro di zinco e idrogeno.", reagenti: ['zinco', 'acido cloridrico'], prodotti: ['cloruro di zinco', 'idrogeno'] },
	{ story: 'Il sodio reagisce con il cloro e forma cloruro di sodio.', reagenti: ['sodio', 'cloro'], prodotti: ['cloruro di sodio'] },
	{ story: "Scaldato, l'ossido di mercurio si decompone in mercurio e ossigeno.", reagenti: ['ossido di mercurio'], prodotti: ['mercurio', 'ossigeno'] },
	{ story: 'Nella fermentazione il glucosio del mosto si trasforma in alcol etilico e diossido di carbonio.', reagenti: ['glucosio'], prodotti: ['alcol etilico', 'diossido di carbonio'] },
	{ story: "L'idrogeno brucia nell'ossigeno e forma acqua.", reagenti: ['idrogeno', 'ossigeno'], prodotti: ['acqua'] },
];

/** "a", "a e b", "a, b e c". */
export const list = (xs: string[]) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const listOpt = (xs: string[]) => textOpt(cap(list(xs)), [...xs].sort().join('+'));

function level2(rng: Rng): Built {
	const i = rng.int(0, REACTIONS.length - 1);
	const r = REACTIONS[i];
	const askR = rng.next() < 0.5;
	const right = askR ? r.reagenti : r.prodotti;
	const other = askR ? r.prodotti : r.reagenti;
	// the other side; one substance swapped with one of the other side; everything
	const swaps: string[][] = [];
	for (const a of right) for (const b of other) swaps.push(right.map((x) => (x === a ? b : x)));
	const mistakes = [other, ...shuffle(rng, swaps), [...right, ...other]].filter((xs) => new Set(xs).size === xs.length);
	const word = askR ? 'reagenti' : 'prodotti';
	return {
		prompt: `Trova i ${word}.`,
		problem: textBlock(`${r.story} Quali sono i ${word}?`),
		solution: t(cap(list(right))),
		steps: [
			textBlock(`I reagenti sono le sostanze di partenza: ${list(r.reagenti)}. I prodotti sono le sostanze che si formano: ${list(r.prodotti)}.`),
		],
		answer: choose(rng, listOpt(right), mistakes.map(listOpt)),
		params: { case: word, reaction: i },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the clue

export const CLUES = ['Si sviluppa un gas', 'Si forma un precipitato', 'Cambia il colore', 'Si liberano calore e luce'] as const;
export const CLUE_STORIES: Record<(typeof CLUES)[number], string[]> = {
	'Si sviluppa un gas': [
		"Si mette una compressa effervescente in un bicchiere d'acqua: l'acqua si riempie di bollicine.",
		'Si versano alcune gocce di acido cloridrico su un pezzo di marmo: il marmo si copre di bollicine e fa schiuma.',
		"Si immerge un pezzetto di zinco nell'acido cloridrico: dalla superficie del metallo salgono bollicine.",
		"Si versa dell'aceto su un cucchiaino di bicarbonato: il liquido fa schiuma.",
	],
	'Si forma un precipitato': [
		"Si soffia con una cannuccia nell'acqua di calce, limpida: il liquido si intorbida e sul fondo si deposita un solido.",
		"Si mescolano due soluzioni limpide, una di nitrato d'argento e una di cloruro di sodio: il liquido si intorbida e sul fondo si deposita un solido.",
		'Si mescolano due soluzioni limpide, una di cloruro di calcio e una di carbonato di sodio: il liquido si intorbida e sul fondo si deposita un solido.',
	],
	'Cambia il colore': [
		"Si taglia una mela e la si lascia all'aria: dopo mezz'ora la polpa è diventata scura.",
		"Una moneta di rame lasciata a lungo all'aperto diventa verde.",
		"Si aggiungono alcune gocce di tintura di iodio, bruna, a un po' di amido sciolto in acqua: il liquido diventa blu scuro.",
		"Una collana d'argento lasciata a lungo in un cassetto diventa nera.",
	],
	'Si liberano calore e luce': [
		'Si avvicina una fiamma a un nastro di magnesio: il magnesio brucia con una luce bianca abbagliante.',
		'Si strofina un fiammifero sulla scatola: la capocchia prende fuoco.',
		'Si accende il gas del fornello: si forma una fiamma azzurra che scalda la pentola.',
		"Un fuoco d'artificio esplode e illumina il cielo.",
	],
};
const CLUE_WHY: Record<(typeof CLUES)[number], string> = {
	'Si sviluppa un gas': 'le bollicine sono un gas che si forma nella reazione',
	'Si forma un precipitato': 'il solido che intorbida il liquido limpido e si deposita è un precipitato',
	'Cambia il colore': 'il colore nuovo è quello di una sostanza nuova',
	'Si liberano calore e luce': 'la reazione libera energia come calore e luce',
};

function level3(rng: Rng): Built {
	const clue = rng.pick(CLUES);
	const k = rng.int(0, CLUE_STORIES[clue].length - 1);
	const story = CLUE_STORIES[clue][k];
	return {
		prompt: "Riconosci l'indizio della reazione.",
		problem: textBlock(`${story} Quale indizio di una reazione chimica si osserva?`),
		solution: t(clue),
		steps: [textBlock(`${clue}: ${CLUE_WHY[clue]}.`)],
		answer: choose(rng, textOpt(clue), CLUES.filter((c) => c !== clue).map((c) => textOpt(c))),
		params: { case: clue, story: k },
	};
}

// ---------------------------------------------------------------------------
// Level 4: a clue is not a proof

export interface Tricky {
	story: string;
	chimica: boolean;
	right: string;
	wrong: [string, string, string];
}
export const TRICKY: Tricky[] = [
	{ story: "In una pentola sul fornello l'acqua comincia a bollire e si riempie di bollicine.", chimica: false, right: 'No: le bollicine sono vapore acqueo, cioè ancora acqua', wrong: ['Sì: si sviluppa un gas, e un gas è sempre una sostanza nuova', "Sì: l'acqua assorbe calore, e questo è un segno di reazione", "No: le bollicine sono l'aria che stava sul fondo della pentola"] },
	{ story: 'Si apre una bottiglia di acqua gassata: il liquido si riempie di bollicine.', chimica: false, right: "No: esce il gas che era già sciolto nell'acqua", wrong: ['Sì: si sviluppa un gas, e un gas è sempre una sostanza nuova', "Sì: aprendo la bottiglia l'acqua si trasforma in gas", 'No: le bollicine sono vapore acqueo che si forma nella bottiglia'] },
	{ story: "Si versa una goccia di inchiostro blu in un bicchiere d'acqua: dopo qualche minuto tutta l'acqua è azzurra.", chimica: false, right: "No: l'inchiostro si mescola all'acqua senza cambiare", wrong: ["Sì: cambia il colore dell'acqua, quindi c'è una reazione", "Sì: l'acqua si trasforma in inchiostro", 'No: in una reazione il colore non cambia mai'] },
	{ story: "Si accende una lampadina a incandescenza: il filamento diventa rovente e fa luce, e spento torna com'era.", chimica: false, right: 'No: il filamento resta lo stesso metallo di prima', wrong: ['Sì: si libera luce, quindi il filamento sta reagendo', 'Sì: si libera calore, quindi il filamento sta reagendo', 'No: senza una fiamma non avviene mai una reazione'] },
	{ story: 'Si lascia evaporare al sole un piattino di acqua salata: sul fondo compaiono dei cristalli bianchi.', chimica: false, right: "No: i cristalli sono il sale che era sciolto nell'acqua", wrong: ['Sì: si forma un solido, quindi è un precipitato nuovo', "Sì: al sole l'acqua si trasforma in sale", "No: i cristalli sono acqua ghiacciata rimasta sul fondo"] },
	{ story: "Si versa dell'aceto sul bicarbonato: il liquido fa schiuma.", chimica: true, right: 'Sì: il gas è diossido di carbonio, una sostanza nuova', wrong: ["Sì: ogni volta che si formano bollicine c'è una reazione", "No: le bollicine sono vapore acqueo che esce dall'aceto", "No: il gas era già sciolto nell'aceto, come nell'acqua gassata"] },
	{ story: 'Si immerge un chiodo di ferro in una soluzione azzurra di solfato di rame: il chiodo si copre di uno strato rossiccio e la soluzione schiarisce.', chimica: true, right: 'Sì: si formano sostanze nuove, come il rame sul chiodo', wrong: ['Sì: il ferro cambia stato, e per questo diventa rossiccio', "No: la soluzione schiarisce perché si diluisce nell'acqua", 'No: il chiodo si sporca del colore della soluzione'] },
	{ story: "Si soffia con una cannuccia nell'acqua di calce, limpida: il liquido si intorbida.", chimica: true, right: 'Sì: si forma un solido nuovo, il carbonato di calcio', wrong: ['Sì: ogni liquido che diventa torbido sta reagendo', "No: le bollicine d'aria soffiata rendono torbido il liquido", 'No: si solleva la polvere che era sul fondo'] },
	{ story: 'Si avvicina una fiamma a un nastro di magnesio: brucia con una luce abbagliante e lascia una polvere bianca.', chimica: true, right: 'Sì: la polvere bianca è una sostanza nuova, un ossido', wrong: ['Sì: ogni corpo che fa luce sta reagendo', 'No: il magnesio fonde e poi torna solido come polvere', 'No: la luce è quella della fiamma che lo scalda'] },
	{ story: 'Il latte lasciato per giorni fuori dal frigorifero diventa acido e cambia odore.', chimica: true, right: 'Sì: si formano sostanze nuove, come un acido', wrong: ['Sì: il latte cambia stato e diventa più denso', "No: l'acqua del latte evapora e il resto si concentra", 'No: il latte si scalda ma resta latte'] },
];

function level4(rng: Rng): Built {
	const chem = rng.next() < 0.5;
	const pool = TRICKY.map((x, i) => ({ x, i })).filter((o) => o.x.chimica === chem);
	const { x, i } = rng.pick(pool);
	return {
		prompt: 'Decidi se si è formata una sostanza nuova.',
		problem: textBlock(`${x.story} Si è formata una sostanza nuova?`),
		solution: t(x.right.split(':')[0]),
		steps: [textBlock(`${x.right}. Un indizio non basta: decide se alla fine ci sono sostanze nuove, con proprietà diverse.`), t(chem ? 'È una trasformazione chimica.' : 'È una trasformazione fisica.')],
		answer: choose(rng, textOpt(x.right), x.wrong.map((w) => textOpt(w))),
		params: { case: chem ? 'chimica' : 'fisica', situation: i },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimTrasformazioniFisicheChimiche: Generator = {
	id: ID,
	title: 'Trasformazioni fisiche e trasformazioni chimiche',
	levels: {
		1: { label: 'Fisica o chimica', constraints: ["una trasformazione del tipo chiesto e tre dell'altro tipo"] },
		2: { label: 'Reagenti e prodotti', constraints: ['una reazione raccontata a parole'] },
		3: { label: 'Gli indizi', constraints: ['un solo indizio per storia'] },
		4: { label: "L'indizio non basta", constraints: ['metà trasformazioni fisiche con un indizio, metà chimiche'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimTrasformazioniFisicheChimiche;

