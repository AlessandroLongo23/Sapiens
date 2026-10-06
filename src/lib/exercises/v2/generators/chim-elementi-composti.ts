/**
 * Elementi, composti e simboli chimici. Spec: specs/exercises/chim-elementi-composti.md
 *
 * Four levels from the lesson (docs/lezioni/chimica/riscritte/22-chim-elementi-composti.md): the symbol of an element
 * or the element of a symbol, with the confusions the lesson warns about (Na and S, K and P, Co and CO); the compound
 * (or the element) among four substances named in words; a substance described by what it does when it is heated,
 * split or separated, to be classified as element, compound, homogeneous or heterogeneous mixture; how many elements
 * a formula contains, counted by its capital letters.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, choose, generateWith, intOpt, pickDistinct, t, textBlock, textOpt } from '../chim-leggi-ponderali';

export const ID = 'chim-elementi-composti';

// ---------------------------------------------------------------------------
// Level 1: symbols

/** The elements of the lesson's table, with the wrong symbols and names a student gives. */
export const SYMBOLS: { nome: string; simbolo: string; wrongSym: [string, string, string]; wrongName: [string, string, string] }[] = [
	{ nome: 'sodio', simbolo: 'Na', wrongSym: ['S', 'So', 'N'], wrongName: ['azoto', 'neon', 'nichel'] },
	{ nome: 'potassio', simbolo: 'K', wrongSym: ['P', 'Po', 'Pt'], wrongName: ['fosforo', 'calcio', 'kripton'] },
	{ nome: 'ferro', simbolo: 'Fe', wrongSym: ['F', 'Fr', 'Fo'], wrongName: ['fluoro', 'fosforo', 'francio'] },
	{ nome: 'rame', simbolo: 'Cu', wrongSym: ['Ra', 'R', 'Co'], wrongName: ['cobalto', 'curio', 'calcio'] },
	{ nome: 'argento', simbolo: 'Ag', wrongSym: ['Ar', 'Au', 'At'], wrongName: ['oro', 'argon', 'alluminio'] },
	{ nome: 'oro', simbolo: 'Au', wrongSym: ['Or', 'O', 'Ag'], wrongName: ['argento', 'alluminio', 'ossigeno'] },
	{ nome: 'mercurio', simbolo: 'Hg', wrongSym: ['Me', 'Mr', 'Mg'], wrongName: ['magnesio', 'idrogeno', 'elio'] },
	{ nome: 'piombo', simbolo: 'Pb', wrongSym: ['P', 'Pi', 'Po'], wrongName: ['fosforo', 'polonio', 'platino'] },
	{ nome: 'zolfo', simbolo: 'S', wrongSym: ['Z', 'Zn', 'So'], wrongName: ['sodio', 'silicio', 'stagno'] },
	{ nome: 'azoto', simbolo: 'N', wrongSym: ['Az', 'A', 'Na'], wrongName: ['sodio', 'neon', 'nichel'] },
	{ nome: 'fosforo', simbolo: 'P', wrongSym: ['F', 'Fo', 'Ph'], wrongName: ['potassio', 'piombo', 'fluoro'] },
	{ nome: 'calcio', simbolo: 'Ca', wrongSym: ['C', 'Cl', 'Co'], wrongName: ['carbonio', 'cloro', 'cobalto'] },
	{ nome: 'cloro', simbolo: 'Cl', wrongSym: ['C', 'Co', 'Ca'], wrongName: ['carbonio', 'calcio', 'cobalto'] },
	{ nome: 'carbonio', simbolo: 'C', wrongSym: ['Ca', 'Co', 'Cr'], wrongName: ['calcio', 'cloro', 'cobalto'] },
	{ nome: 'magnesio', simbolo: 'Mg', wrongSym: ['Mn', 'M', 'Ma'], wrongName: ['manganese', 'mercurio', 'molibdeno'] },
	{ nome: 'manganese', simbolo: 'Mn', wrongSym: ['Mg', 'Ma', 'M'], wrongName: ['magnesio', 'mercurio', 'molibdeno'] },
	{ nome: 'idrogeno', simbolo: 'H', wrongSym: ['I', 'Id', 'He'], wrongName: ['elio', 'iodio', 'mercurio'] },
	{ nome: 'cobalto', simbolo: 'Co', wrongSym: ['Cb', 'C', 'Cu'], wrongName: ['carbonio', 'rame', 'cloro'] },
	{ nome: 'silicio', simbolo: 'Si', wrongSym: ['S', 'Sc', 'Sl'], wrongName: ['zolfo', 'sodio', 'stagno'] },
	{ nome: 'zinco', simbolo: 'Zn', wrongSym: ['Z', 'Zi', 'Sn'], wrongName: ['stagno', 'zolfo', 'zirconio'] },
	{ nome: 'iodio', simbolo: 'I', wrongSym: ['Io', 'J', 'Id'], wrongName: ['idrogeno', 'indio', 'iridio'] },
	{ nome: 'alluminio', simbolo: 'Al', wrongSym: ['A', 'Am', 'Ag'], wrongName: ['argento', 'argon', 'oro'] },
	{ nome: 'elio', simbolo: 'He', wrongSym: ['H', 'El', 'E'], wrongName: ['idrogeno', 'mercurio', 'afnio'] },
	{ nome: 'ossigeno', simbolo: 'O', wrongSym: ['Os', 'Ox', 'Au'], wrongName: ['oro', 'osmio', 'azoto'] },
];
const symOpt = (s: string): ChoiceOption => ({ latex: `\\mathrm{${s}}`, values: [s] });
/** "del sodio", "dello zolfo", "dell'idrogeno". */
export const del = (x: string) => (/^(z|s[^aeiou]|i[aeiou])/.test(x) ? `dello ${x}` : /^[aeiou]/.test(x) ? `dell'${x}` : `del ${x}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function level1(rng: Rng): Built {
	const i = rng.int(0, SYMBOLS.length - 1);
	const e = SYMBOLS[i];
	const toSymbol = rng.next() < 0.5;
	if (toSymbol) {
		return {
			prompt: 'Scegli il simbolo.',
			problem: textBlock(`Qual è il simbolo chimico ${del(e.nome)}?`),
			solution: `\\mathrm{${e.simbolo}}`,
			steps: [textBlock(`Il simbolo ${del(e.nome)} è $\\mathrm{${e.simbolo}}$: la prima lettera è maiuscola e l'eventuale seconda minuscola.`)],
			answer: choose(rng, symOpt(e.simbolo), e.wrongSym.map(symOpt)),
			params: { case: 'simbolo', element: e.nome },
		};
	}
	return {
		prompt: "Scegli l'elemento.",
		problem: textBlock(`Quale elemento ha il simbolo $\\mathrm{${e.simbolo}}$?`),
		solution: t(e.nome),
		steps: [textBlock(`$\\mathrm{${e.simbolo}}$ è il simbolo ${del(e.nome)}.`)],
		answer: choose(rng, textOpt(e.nome), e.wrongName.map((n) => textOpt(n))),
		params: { case: 'nome', element: e.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 2: element or compound

export const ELEMENTS = ['ossigeno', 'azoto', 'ferro', 'rame', 'oro', 'argento', 'zolfo', 'mercurio', 'elio', 'alluminio', 'idrogeno', 'carbonio', 'magnesio', 'iodio', 'piombo', 'zinco', 'sodio', 'cloro'];
export const COMPOUNDS = ['acqua', 'cloruro di sodio', 'diossido di carbonio', 'ammoniaca', 'metano', 'glucosio', 'carbonato di calcio', 'ossido di magnesio', 'solfuro di ferro', 'ossido di mercurio', 'bicarbonato di sodio', 'monossido di carbonio'];

function level2(rng: Rng): Built {
	const askCompound = rng.next() < 0.5;
	const [right] = pickDistinct(rng, askCompound ? COMPOUNDS : ELEMENTS, 1);
	const others = pickDistinct(rng, askCompound ? ELEMENTS : COMPOUNDS, 3);
	const kind = askCompound ? 'composto' : 'elemento';
	return {
		prompt: `Trova ${askCompound ? 'il composto' : "l'elemento"}.`,
		problem: textBlock(`Quale di queste sostanze è ${askCompound ? 'un composto' : 'un elemento'}?`),
		solution: t(right),
		steps: [
			textBlock(
				askCompound
					? `${cap(right)} è un composto: è formato da più elementi, e con una reazione si scompone in sostanze più semplici. Le altre tre sostanze sono elementi, che non si scompongono.`
					: `${cap(right)} è un elemento: nessuna reazione lo scompone in sostanze più semplici. Le altre tre sostanze sono composti.`,
			),
		],
		answer: choose(rng, textOpt(right), others.map((o) => textOpt(o))),
		params: { case: kind, right, others },
	};
}

// ---------------------------------------------------------------------------
// Level 3: element, compound or mixture, from a description

export const KINDS = ['Un elemento', 'Un composto', 'Un miscuglio omogeneo', 'Un miscuglio eterogeneo'] as const;
type Kind = (typeof KINDS)[number];

const COLOURS = ['bianca', 'grigia', 'gialla', 'rossa', 'nera'];
const METAL_COLOURS = ['grigio', 'argenteo', 'giallo', 'rossiccio'];

/** Descriptions for each kind; numbers and colours are drawn. */
function describe(rng: Rng, kind: Kind): { text: string; k: number } {
	const T = rng.int(12, 95) * 10 + rng.pick([0, 5]);
	const tl = rng.int(20, 90) * 10;
	const col = rng.pick(COLOURS);
	const mcol = rng.pick(METAL_COLOURS);
	const texts: Record<Kind, string[]> = {
		'Un elemento': [
			`Una polvere ${col} fonde sempre a $${T}\\,^\\circ\\text{C}$, e né il calore né la corrente elettrica la scompongono in sostanze più semplici.`,
			`Un metallo ${mcol} fonde sempre a $${T}\\,^\\circ\\text{C}$; con molte sostanze forma composti, ma nessuna reazione lo scompone in sostanze più semplici.`,
			`Un gas incolore si trasforma in liquido sempre alla stessa temperatura, e non si riesce a scomporre in sostanze più semplici con nessuna reazione.`,
		],
		'Un composto': [
			`Una polvere ${col} fonde sempre a $${tl}\\,^\\circ\\text{C}$; scaldata più forte, si scompone in un metallo e in un gas, sempre nella stessa proporzione in massa.`,
			`Un liquido incolore bolle sempre alla stessa temperatura; con la corrente elettrica si scompone in due gas diversi.`,
			`Un solido ${col.replace(/a$/, 'o')} ha sempre la stessa composizione in massa; scaldato, si decompone in un solido e in un gas con proprietà diverse dalle sue.`,
		],
		'Un miscuglio omogeneo': [
			`Un liquido limpido e uniforme, fatto evaporare, lascia sul fondo un residuo solido; campioni diversi lasciano quantità diverse di residuo.`,
			`Un metallo ${mcol}, lucido e uniforme anche al microscopio, contiene due metalli in proporzioni che cambiano da un pezzo all'altro.`,
			`Un gas uniforme, raffreddato fino a diventare liquido, si separa per distillazione in due gas, in proporzioni che cambiano da un campione all'altro.`,
		],
		'Un miscuglio eterogeneo': [
			`In una polvere si vedono granelli di due colori, e una calamita ne porta via una parte.`,
			`Un liquido torbido, filtrato, lascia sulla carta da filtro un solido e passa limpido.`,
			`Un liquido lasciato fermo in un recipiente si separa in due strati.`,
		],
	};
	const k = rng.int(0, texts[kind].length - 1);
	return { text: texts[kind][k], k };
}
const WHY: Record<Kind, string> = {
	'Un elemento': 'è una sostanza pura, perché ha proprietà costanti, e nessuna reazione la scompone: è un elemento',
	'Un composto': 'è una sostanza pura, con proprietà e composizione costanti, e con una reazione si scompone in sostanze più semplici: è un composto',
	'Un miscuglio omogeneo': "ha un aspetto uniforme, ma si separa con metodi fisici e la composizione cambia da un campione all'altro: è un miscuglio omogeneo",
	'Un miscuglio eterogeneo': 'si vedono parti diverse, o si separano con metodi fisici come la filtrazione o la calamita: è un miscuglio eterogeneo',
};

function level3(rng: Rng): Built {
	const kind = rng.pick(KINDS);
	const { text, k } = describe(rng, kind);
	return {
		prompt: 'Classifica la sostanza.',
		problem: textBlock(`${text} Che cos'è?`),
		solution: t(kind),
		steps: [textBlock(`Il materiale ${WHY[kind]}.`)],
		answer: choose(rng, textOpt(kind), KINDS.filter((x) => x !== kind).map((x) => textOpt(x))),
		params: { case: kind, description: k },
	};
}

// ---------------------------------------------------------------------------
// Level 4: how many elements in a formula

/** Formulas as the lessons write them, with their name. */
export const FORMULAS: [string, string, string][] = [
	// [LaTeX body, plain letters for the count of letters, name]
	['NaCl', 'NaCl', 'cloruro di sodio'],
	['H_2O', 'HO', 'acqua'],
	['CO_2', 'CO', 'diossido di carbonio'],
	['CaCO_3', 'CaCO', 'carbonato di calcio'],
	['NaHCO_3', 'NaHCO', 'bicarbonato di sodio'],
	['H_2SO_4', 'HSO', 'acido solforico'],
	['KMnO_4', 'KMnO', 'permanganato di potassio'],
	['C_6H_{12}O_6', 'CHO', 'glucosio'],
	['NH_3', 'NH', 'ammoniaca'],
	['CH_4', 'CH', 'metano'],
	['HNO_3', 'HNO', 'acido nitrico'],
	['MgO', 'MgO', 'ossido di magnesio'],
	['Fe_2O_3', 'FeO', 'ossido di ferro'],
	['CuSO_4', 'CuSO', 'solfato di rame'],
	['NaOH', 'NaOH', 'idrossido di sodio'],
	['KNO_3', 'KNO', 'nitrato di potassio'],
	['C_2H_5OH', 'CHOH', 'alcol etilico'],
	['NH_4Cl', 'NHCl', 'cloruro di ammonio'],
	['CO', 'CO', 'monossido di carbonio'],
	['Co', 'Co', 'cobalto'],
	['CoCl_2', 'CoCl', 'cloruro di cobalto'],
	['HCl', 'HCl', 'acido cloridrico'],
	['CaCl_2', 'CaCl', 'cloruro di calcio'],
	['Na_2CO_3', 'NaCO', 'carbonato di sodio'],
];

/** Symbols in a formula body, in order, repeated ones included: "C_2H_5OH" → C, H, O, H. */
export const symbolsOf = (body: string) => body.match(/[A-Z][a-z]?/g) ?? [];
/** Atoms in a formula body: the sum of the subscripts (1 when missing). */
export function atomsOf(body: string): number {
	let n = 0;
	for (const m of body.matchAll(/([A-Z][a-z]?)(?:_(\d)|_\{(\d+)\})?/g)) n += Number(m[2] ?? m[3] ?? 1);
	return n;
}

function level4(rng: Rng): Built {
	const i = rng.int(0, FORMULAS.length - 1);
	const [body, letters, name] = FORMULAS[i];
	const syms = symbolsOf(body);
	const distinct = [...new Set(syms)];
	const n = distinct.length;
	// letters counted as elements; every symbol counted, repeated ones too; atoms; one more
	const mistakes = [letters.length, syms.length, atomsOf(body), n + 1, n - 1, n + 2].filter((x) => x >= 1);
	return {
		prompt: 'Conta gli elementi.',
		problem: textBlock(`Quanti elementi diversi ci sono nella sostanza $\\mathrm{${body}}$?`),
		solution: String(n),
		steps: [
			textBlock(`Ogni simbolo comincia con una lettera maiuscola: in $\\mathrm{${body}}$ i simboli sono ${syms.map((s) => `$\\mathrm{${s}}$`).join(', ')}.`),
			textBlock(`Gli elementi diversi sono ${n}${n === 1 ? ': è un elemento, il ' + name : ''}${n > 1 ? ` (${name})` : ''}. I numeri in basso non sono elementi.`),
		],
		answer: choose(rng, intOpt(n), mistakes.map(intOpt)),
		params: { case: n === 1 ? 'elemento' : 'composto', formula: body },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimElementiComposti: Generator = {
	id: ID,
	title: 'Elementi, composti e simboli chimici',
	levels: {
		1: { label: 'I simboli chimici', constraints: ['dal nome al simbolo o dal simbolo al nome'] },
		2: { label: 'Elemento o composto', constraints: ['quattro sostanze con il loro nome'] },
		3: { label: 'Elemento, composto o miscuglio', constraints: ['una sostanza descritta da come si comporta'] },
		4: { label: 'Gli elementi di una formula', constraints: ['si contano le maiuscole'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimElementiComposti;
