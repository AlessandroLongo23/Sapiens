/**
 * Il modello particellare della materia. Spec: specs/exercises/chim-modello-particellare.md
 *
 * Four levels from the lesson (docs/lezioni/chimica/riscritte/15-chim-modello-particellare.md), each one step harder:
 * which sentence describes the particles of a solid, a liquid or a gas; which explanation of a phenomenon the model
 * gives; a temperature from degrees Celsius to kelvin or back; which of four samples, with temperatures in both
 * scales, has the particles with the largest (or smallest) mean agitation. Distractors from the lesson's warnings:
 * particles at rest in a solid, particles that grow or melt, air between the particles, 273 subtracted instead of
 * added, the largest number taken without converting.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { choose, sample, t, textBlock, textOpt } from '../chim-materia';

export const ID = 'chim-modello-particellare';

type State = 'solido' | 'liquido' | 'aeriforme';
const STATES: State[] = ['solido', 'liquido', 'aeriforme'];

// ---------------------------------------------------------------------------
// Level 1: the particles in the three states

/** Sentences true for the particles of one state only. */
export const ONLY: Record<State, string[]> = {
	solido: ['Vibrano attorno a posizioni fisse', 'Non possono cambiare posto'],
	liquido: ['Sono a contatto ma scorrono le une sulle altre', 'Restano a contatto ma cambiano posto di continuo'],
	aeriforme: ['Sono lontane e corrono in tutte le direzioni', "Tra loro c'è moltissimo spazio vuoto", 'Si attraggono pochissimo'],
};
/** Sentences false in every state: the misconceptions of the lesson. */
export const NEVER = ['Sono ferme', 'Diventano più grandi quando si scaldano', "Tra loro c'è aria", 'Si fondono quando il solido fonde'];

const EXAMPLES: Record<State, string[]> = {
	solido: ['un cubetto di ghiaccio', 'un chiodo di ferro', 'un cristallo di sale', 'una moneta di rame'],
	liquido: ["l'acqua di un bicchiere", "l'alcol di un flacone", "l'olio di una bottiglia"],
	aeriforme: ["l'aria di una stanza", "l'elio di un palloncino", 'il vapore sopra una pentola che bolle'],
};

function level1(rng: Rng): Built {
	const state = rng.pick(STATES);
	const what = rng.pick(EXAMPLES[state]);
	const right = rng.pick(ONLY[state]);
	const others = STATES.filter((s) => s !== state).flatMap((s) => ONLY[s]);
	const nNever = rng.int(1, 2);
	const wrong = [...sample(rng, NEVER, nNever), ...sample(rng, others, 3 - nNever)];
	return {
		prompt: 'Trova la frase giusta.',
		problem: textBlock(`${what.charAt(0).toUpperCase()}${what.slice(1)} è ${state === 'aeriforme' ? 'un aeriforme' : `un ${state}`}. Quale frase descrive le sue particelle?`),
		solution: t(right),
		steps: [
			textBlock(
				state === 'solido'
					? 'Nel solido le particelle sono a contatto e legate a posizioni fisse, attorno a cui vibrano senza fermarsi mai.'
					: state === 'liquido'
						? 'Nel liquido le particelle sono a contatto, ma le attrazioni non bastano a tenerle ferme: scorrono le une sulle altre.'
						: "Nell'aeriforme le particelle sono lontanissime, si attraggono pochissimo e corrono in tutte le direzioni.",
			),
		],
		answer: choose(rng, textOpt(right), wrong.map((x) => textOpt(x))),
		params: { case: state, sample: what },
	};
}

// ---------------------------------------------------------------------------
// Level 2: explaining a phenomenon

export const PHENOMENA: { id: string; text: string; right: string; wrong: string[] }[] = [
	{
		id: 'siringa',
		text: "Una siringa piena d'aria e tappata si comprime; piena d'acqua, quasi per niente.",
		right: "Tra le particelle dell'aria c'è molto spazio vuoto",
		wrong: ["Le particelle dell'aria si schiacciano", "Le particelle dell'aria sono più piccole di quelle dell'acqua", "Le particelle dell'acqua sono ferme", "Tra le particelle dell'acqua c'è aria"],
	},
	{
		id: 'profumo',
		text: "Il profumo spruzzato in un angolo di una stanza con l'aria ferma si sente dall'altra parte.",
		right: "Le particelle del profumo si muovono e si mescolano con quelle dell'aria",
		wrong: ['Le particelle del profumo si ingrandiscono fino a riempire la stanza', 'Le particelle del profumo si moltiplicano', "Il profumo spinge via l'aria della stanza", "Le particelle dell'aria sono ferme e il profumo scivola tra loro"],
	},
	{
		id: 'inchiostro',
		text: "Una goccia d'inchiostro si allarga più in fretta nell'acqua calda che in quella fredda.",
		right: 'A temperatura più alta le particelle si muovono più in fretta',
		wrong: ["Nell'acqua calda le particelle d'inchiostro si rimpiccioliscono", "Il calore scioglie le particelle d'inchiostro", "Nell'acqua fredda le particelle sono ferme", "Nell'acqua calda le particelle d'acqua diventano più grandi"],
	},
	{
		id: 'forma',
		text: "L'acqua prende la forma del bicchiere in cui la versi.",
		right: 'Le particelle del liquido scorrono le une sulle altre',
		wrong: ["Tra le particelle dell'acqua c'è moltissimo spazio vuoto", "Le particelle dell'acqua sono morbide e si deformano", "Le particelle dell'acqua non si attraggono affatto", "Le particelle dell'acqua sono ferme"],
	},
	{
		id: 'ghiaccio',
		text: 'Un cubetto di ghiaccio mantiene la sua forma.',
		right: 'Le particelle del solido restano legate a posizioni fisse',
		wrong: ['Le particelle del ghiaccio sono ferme', 'Le particelle del ghiaccio sono dure e fredde', "Tra le particelle del ghiaccio c'è aria che le sostiene", "Le particelle del ghiaccio sono più grandi di quelle dell'acqua"],
	},
	{
		id: 'dilatazione',
		text: "Una sfera di metallo scaldata non passa più nell'anello in cui passava da fredda.",
		right: "Le particelle vibrano di più e si allontanano un po' tra loro",
		wrong: ['Le particelle del metallo diventano più grandi', 'Il calore aggiunge nuove particelle al metallo', 'Le particelle del metallo si fermano', 'Il metallo scaldato diventa liquido'],
	},
	{
		id: 'volumi',
		text: "Mescolando 50 mL di alcol e 50 mL d'acqua si ottengono meno di 100 mL.",
		right: "Le particelle di un liquido occupano in parte gli spazi tra quelle dell'altro",
		wrong: ["Una parte dell'alcol sparisce", 'Le particelle si rimpiccioliscono quando si mescolano', "Una parte dell'acqua diventa alcol", "Le particelle d'acqua si schiacciano"],
	},
	{
		id: 'pallone',
		text: 'Un pallone gonfiato resta gonfio.',
		right: "Le particelle dell'aria urtano di continuo la parete interna",
		wrong: ["Le particelle dell'aria sono attaccate alla gomma", "Le particelle dell'aria sono ferme e fanno da sostegno", "Le particelle dell'aria si sono ingrandite", "L'aria dentro il pallone è più leggera"],
	},
	{
		id: 'browniano',
		text: "Al microscopio, granelli minuscoli sospesi nell'acqua si agitano senza fermarsi mai.",
		right: "Sono urtati di continuo dalle particelle d'acqua in movimento",
		wrong: ['I granelli sono vivi e nuotano', 'La luce del microscopio spinge i granelli', 'I granelli si respingono tra loro', "Le particelle dei granelli si dilatano e si restringono"],
	},
	{
		id: 'pozzanghera',
		text: "Una pozzanghera si asciuga anche d'inverno, senza bollire.",
		right: 'Le particelle più veloci sfuggono dalla superficie del liquido',
		wrong: ["Le particelle d'acqua si rimpiccioliscono fino a sparire", "Il freddo distrugge le particelle d'acqua", "L'acqua si trasforma in aria", "Il terreno scioglie le particelle d'acqua"],
	},
];

function level2(rng: Rng): Built {
	const ph = rng.pick(PHENOMENA);
	return {
		prompt: 'Trova la spiegazione.',
		problem: textBlock(`${ph.text} Quale spiegazione dà il modello particellare?`),
		solution: t(ph.right),
		steps: [textBlock(`${ph.right}.`)],
		answer: choose(rng, textOpt(ph.right), sample(rng, ph.wrong, 3).map((x) => textOpt(x))),
		params: { case: ph.id },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from Celsius to kelvin and back

const K = (x: number) => `${x}\\,\\text{K}`;
const C = (x: number) => `${x}\\,^\\circ\\text{C}`;
const kOpt = (x: number) => ({ latex: K(x), values: [`${x} K`] });
const cOpt = (x: number) => ({ latex: C(x), values: [`${x} C`] });

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const x = rng.int(-260, 500);
		if (Math.abs(x) < 5) throw new Error('retry');
		const T = x + 273;
		return {
			prompt: 'Converti in kelvin.',
			problem: textBlock(`Scrivi in kelvin la temperatura $${C(x)}$.`),
			solution: K(T),
			steps: [`T = t + 273 = ${x < 0 ? `(${x})` : x} + 273 = ${K(T)}`],
			// 273 subtracted; the difference taken the other way; the number not converted; a slip of ten
			answer: choose(rng, kOpt(T), [kOpt(x - 273), kOpt(273 - x), kOpt(x), kOpt(T + 10), kOpt(T - 10), kOpt(T + 100)]),
			params: { case: 'kelvin', t: x },
		};
	}
	const T = rng.int(10, 800);
	if (Math.abs(T - 273) < 5) throw new Error('retry');
	const x = T - 273;
	return {
		prompt: 'Converti in gradi Celsius.',
		problem: textBlock(`Scrivi in gradi Celsius la temperatura $${K(T)}$.`),
		solution: C(x),
		steps: [`t = T - 273 = ${T} - 273 = ${C(x)}`],
		// 273 added; the difference taken the other way; the number not converted
		answer: choose(rng, cOpt(x), [cOpt(T + 273), cOpt(273 - T), cOpt(T), cOpt(x + 10), cOpt(x - 10), cOpt(x + 100)]),
		params: { case: 'celsius', T },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the largest (or smallest) agitation

const NAMES = ['acqua', 'elio', 'ferro', 'azoto', 'etanolo', 'rame', 'ossigeno', 'aria', 'alluminio', 'mercurio'];

function level4(rng: Rng): Built {
	const most = rng.next() < 0.5;
	const trap = rng.next() < 0.7;
	// The case is drawn first and kept: the temperatures are drawn again until they fit it.
	for (let attempt = 0; attempt < 500; attempt++) {
		const names = sample(rng, NAMES, 4);
		const Ks: number[] = [];
		for (let i = 0; Ks.length < 4 && i < 200; i++) {
			const T = rng.int(60, 700);
			if (Ks.every((y) => Math.abs(y - T) >= 8)) Ks.push(T);
		}
		if (Ks.length < 4) continue;
		// Each sample in kelvin or in degrees Celsius, both scales present.
		const inK = Ks.map(() => rng.next() < 0.5);
		if (inK.every(Boolean) || inK.every((x) => !x)) continue;
		const shown = Ks.map((T, i) => (inK[i] ? T : T - 273));
		const target = most ? Math.max(...Ks) : Math.min(...Ks);
		const iRight = Ks.indexOf(target);
		const iNumber = shown.indexOf(most ? Math.max(...shown) : Math.min(...shown));
		if (trap !== (iNumber !== iRight)) continue;
		return build4(rng, most, trap, names, Ks, inK, shown, iRight);
	}
	throw new Error('retry');
}

function build4(rng: Rng, most: boolean, trap: boolean, names: string[], Ks: number[], inK: boolean[], shown: number[], iRight: number): Built {
	const label = (i: number) => `${names[i]} a ${inK[i] ? `$${K(shown[i])}$` : `$${C(shown[i])}$`}`;
	const opt = (i: number) => ({ latex: `\\text{${names[i].charAt(0).toUpperCase()}${names[i].slice(1)} a }${inK[i] ? K(shown[i]) : C(shown[i])}`, values: [names[i]] });
	return {
		prompt: most ? 'Trova il campione più caldo.' : 'Trova il campione più freddo.',
		problem: textBlock(`Quattro campioni: ${label(0)}, ${label(1)}, ${label(2)}, ${label(3)}. In quale le particelle hanno l'agitazione media più ${most ? 'grande' : 'piccola'}?`),
		solution: opt(iRight).latex,
		steps: [
			t("L'agitazione media dipende solo dalla temperatura: si portano tutte in kelvin."),
			...Ks.map((T, i) => (inK[i] ? `\\text{${names[i]}: } ${K(T)}` : `\\text{${names[i]}: } ${shown[i] < 0 ? `(${shown[i]})` : shown[i]} + 273 = ${K(T)}`)),
			t(`L'agitazione media più ${most ? 'grande' : 'piccola'} è quella del campione più ${most ? 'caldo' : 'freddo'}: ${names[iRight]}.`),
		],
		answer: choose(rng, opt(iRight), [0, 1, 2, 3].filter((i) => i !== iRight).map(opt)),
		params: { case: trap ? 'trappola' : 'diretto', most },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample).filter((x) => x !== 'due opzioni con lo stesso numero');
	if (sample.answer.kind === 'choice' && new Set(sample.answer.options.map((o) => o.values.join('|'))).size !== 4) v.push('due opzioni con lo stesso valore');
	return v;
}

export const chimModelloParticellare: Generator = {
	id: ID,
	title: 'Il modello particellare della materia',
	levels: {
		1: { label: 'Le particelle nei tre stati', constraints: ['una frase vera solo per quello stato, tre sbagliate'] },
		2: { label: 'Spiegare un fenomeno', constraints: ['dieci fenomeni della lezione, spiegazioni sbagliate dagli errori veri'] },
		3: { label: 'Dai gradi Celsius ai kelvin', constraints: ['metà verso i kelvin, metà verso i gradi Celsius', 'T = t + 273'] },
		4: { label: 'Chi si agita di più', constraints: ['quattro campioni, temperature in tutte e due le scale'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimModelloParticellare;
