/**
 * What the four generators of the first half of the chemistry chapter on nomenclature share (chemistry, third year,
 * group I: numero-ossidazione, chim-ossidi, chim-idruri-idracidi, chim-idrossidi), and what the interactive figures
 * of the same lessons use to name the compound the student builds.
 *
 * The conventions are those of lessons 76-79 (docs/lezioni/chimica/riscritte/) and of the brief of the lot
 * (docs/lezioni/chimica/brief-terzo-anno.md):
 * - every compound has three names, in this order: traditional (ossido ferrico, anidride solforica), Stock (ossido
 *   di ferro(III), with the Roman numeral only when the element has more than one oxidation number in the tables
 *   below), IUPAC (triossido di diferro);
 * - IUPAC prefixes di, tri, tetra, penta, esa, epta, written without dropping a vowel (pentaossido, triidrossido);
 *   the 1 is not said, except in "monossido" when the atoms are one to one and the element has more than one oxide;
 * - in a formula the metal comes first, and the subscripts are the oxidation numbers crossed and reduced.
 *
 * This file has no runtime imports, so a figure that uses it does not pull the exercise code into its chunk.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';

// ---------------------------------------------------------------------------
// Elements

export interface Metal {
	sym: string;
	nome: string;
	/** Oxidation numbers, ascending. */
	ox: number[];
	/** Root of the traditional adjectives, when there are two oxidation numbers: ferr → ferroso, ferrico. */
	root?: string;
}

export const METALS: Metal[] = [
	{ sym: 'Li', nome: 'litio', ox: [1] },
	{ sym: 'Na', nome: 'sodio', ox: [1] },
	{ sym: 'K', nome: 'potassio', ox: [1] },
	{ sym: 'Ag', nome: 'argento', ox: [1] },
	{ sym: 'Mg', nome: 'magnesio', ox: [2] },
	{ sym: 'Ca', nome: 'calcio', ox: [2] },
	{ sym: 'Ba', nome: 'bario', ox: [2] },
	{ sym: 'Zn', nome: 'zinco', ox: [2] },
	{ sym: 'Al', nome: 'alluminio', ox: [3] },
	{ sym: 'Fe', nome: 'ferro', ox: [2, 3], root: 'ferr' },
	{ sym: 'Cu', nome: 'rame', ox: [1, 2], root: 'rame' },
	{ sym: 'Sn', nome: 'stagno', ox: [2, 4], root: 'stann' },
	{ sym: 'Pb', nome: 'piombo', ox: [2, 4], root: 'piomb' },
	{ sym: 'Co', nome: 'cobalto', ox: [2, 3], root: 'cobalt' },
	{ sym: 'Ni', nome: 'nichel', ox: [2, 3], root: 'nichel' },
	{ sym: 'Cr', nome: 'cromo', ox: [2, 3], root: 'crom' },
	{ sym: 'Mn', nome: 'manganese', ox: [2, 3], root: 'mangan' },
	{ sym: 'Au', nome: 'oro', ox: [1, 3], root: 'aur' },
];

export interface NonMetal {
	sym: string;
	nome: string;
	/** Root of the traditional adjective of the anhydride: solfor → solforosa, solforica. */
	root: string;
	/** Positive oxidation numbers with an anhydride, ascending. */
	ox: number[];
	/** A halogen: the four names go with +1, +3, +5, +7 whichever of them the table has. */
	halogen?: boolean;
	/** The Stock name has the Roman numeral though the table has one anhydride (carbon also has CO). */
	roman?: boolean;
}

export const NON_METALS: NonMetal[] = [
	{ sym: 'B', nome: 'boro', root: 'bor', ox: [3] },
	{ sym: 'C', nome: 'carbonio', root: 'carbon', ox: [4], roman: true },
	{ sym: 'Si', nome: 'silicio', root: 'silic', ox: [4] },
	{ sym: 'N', nome: 'azoto', root: 'nitr', ox: [3, 5] },
	{ sym: 'P', nome: 'fosforo', root: 'fosfor', ox: [3, 5] },
	{ sym: 'S', nome: 'zolfo', root: 'solfor', ox: [4, 6] },
	{ sym: 'Cl', nome: 'cloro', root: 'clor', ox: [1, 3, 5, 7], halogen: true },
	{ sym: 'Br', nome: 'bromo', root: 'brom', ox: [1, 5], halogen: true },
	{ sym: 'I', nome: 'iodio', root: 'iod', ox: [1, 5, 7], halogen: true },
];

export const metal = (sym: string) => {
	const m = METALS.find((x) => x.sym === sym);
	if (!m) throw new Error(`chim3-i: no metal ${sym}`);
	return m;
};
export const nonMetal = (sym: string) => {
	const m = NON_METALS.find((x) => x.sym === sym);
	if (!m) throw new Error(`chim3-i: no non-metal ${sym}`);
	return m;
};

// ---------------------------------------------------------------------------
// Writing

export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
/** IUPAC prefixes; the 1 is not said. */
export const PREFIX = ['', '', 'di', 'tri', 'tetra', 'penta', 'esa', 'epta'];

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** An oxidation number as the lessons write it: +2, -1, 0. */
export const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/** The subscripts of a binary compound from the two oxidation numbers, crossed and reduced: (+3, -2) → [2, 3]. */
export function crossed(pos: number, neg: number): [number, number] {
	const p = Math.abs(pos);
	const q = Math.abs(neg);
	const g = gcd(p, q);
	return [q / g, p / g];
}

const part = (s: string, k: number) => (k === 1 ? s : `${s}_${k}`);
/** A formula in LaTeX from its parts: [['Fe', 2], ['O', 3]] → \mathrm{Fe_2O_3}. A part in brackets is written "(OH)". */
export const formulaTex = (parts: [string, number][]) => `\\mathrm{${parts.map(([s, k]) => (s.startsWith('(') && k === 1 ? s.slice(1, -1) : part(s, k))).join('')}}`;

export type Classe = 'ossido basico' | 'ossido acido' | 'perossido' | 'ossido' | 'idruro metallico' | 'idruro covalente' | 'idracido' | 'idrossido';

export interface Compound {
	/** Plain key, unique: Fe2O3, Ca(OH)2. */
	key: string;
	tex: string;
	trad: string;
	stock: string;
	iupac: string;
	classe: Classe;
	/** The element that gives the name, and its oxidation number in the compound. */
	sym: string;
	nome: string;
	no: number;
	/** Atoms of the element and of its partner (O, H, or the OH group). */
	count: [number, number];
}

const plain = (parts: [string, number][]) => parts.map(([s, k]) => (s.startsWith('(') && k === 1 ? s.slice(1, -1) : `${s}${k === 1 ? '' : k}`)).join('');

/** ferroso / ferrico for a metal with two oxidation numbers, "di sodio" for a metal with one. */
export function metalAdjective(m: Metal, n: number): string {
	if (m.ox.length === 1 || !m.root) return `di ${m.nome}`;
	return `${m.root}${n === m.ox[0] ? 'oso' : 'ico'}`;
}

/** "di ferro(III)" when the metal has more than one oxidation number, "di sodio" when it has one. */
export const stockOf = (el: { nome: string; ox: number[]; roman?: boolean }, n: number) => `di ${el.nome}${el.ox.length > 1 || el.roman ? `(${ROMAN[n]})` : ''}`;

/** The oxide of a metal: ossido ferrico, ossido di ferro(III), triossido di diferro. */
export function basicOxide(m: Metal, n: number): Compound {
	const [a, b] = crossed(n, -2);
	const parts: [string, number][] = [[m.sym, a], ['O', b]];
	const mono = a === 1 && b === 1 && m.ox.length > 1;
	return {
		key: plain(parts),
		tex: formulaTex(parts),
		trad: `ossido ${metalAdjective(m, n)}`,
		stock: `ossido ${stockOf(m, n)}`,
		iupac: `${mono ? 'mon' : PREFIX[b]}ossido di ${PREFIX[a]}${m.nome}`,
		classe: 'ossido basico',
		sym: m.sym,
		nome: m.nome,
		no: n,
		count: [a, b],
	};
}

/** solforosa / solforica, and with the halogens ipoclorosa, clorosa, clorica, perclorica. */
export function anhydrideAdjective(x: NonMetal, n: number): string {
	if (x.halogen) return { 1: `ipo${x.root}osa`, 3: `${x.root}osa`, 5: `${x.root}ica`, 7: `per${x.root}ica` }[n] as string;
	if (x.ox.length === 1) return `${x.root}ica`;
	return `${x.root}${n === x.ox[0] ? 'osa' : 'ica'}`;
}

/** The oxide of a non-metal: anidride solforica, ossido di zolfo(VI), triossido di zolfo. */
export function anhydride(x: NonMetal, n: number): Compound {
	const [a, b] = crossed(n, -2);
	const parts: [string, number][] = [[x.sym, a], ['O', b]];
	return {
		key: plain(parts),
		tex: formulaTex(parts),
		trad: `anidride ${anhydrideAdjective(x, n)}`,
		stock: `ossido ${stockOf(x, n)}`,
		iupac: `${PREFIX[b]}ossido di ${PREFIX[a]}${x.nome}`,
		classe: 'ossido acido',
		sym: x.sym,
		nome: x.nome,
		no: n,
		count: [a, b],
	};
}

/** The hydroxide of a metal: idrossido ferrico, idrossido di ferro(III), triidrossido di ferro. */
export function hydroxide(m: Metal, n: number): Compound {
	const parts: [string, number][] = [[m.sym, 1], ['(OH)', n]];
	return {
		key: plain(parts),
		tex: formulaTex(parts),
		trad: `idrossido ${metalAdjective(m, n)}`,
		stock: `idrossido ${stockOf(m, n)}`,
		iupac: `${PREFIX[n]}idrossido di ${m.nome}`,
		classe: 'idrossido',
		sym: m.sym,
		nome: m.nome,
		no: n,
		count: [1, n],
	};
}

/** The hydride of a metal: idruro di calcio, idruro di calcio, diidruro di calcio. */
export function metalHydride(m: Metal, n: number): Compound {
	const parts: [string, number][] = [[m.sym, 1], ['H', n]];
	return {
		key: plain(parts),
		tex: formulaTex(parts),
		trad: `idruro ${metalAdjective(m, n)}`,
		stock: `idruro ${stockOf(m, n)}`,
		iupac: `${PREFIX[n]}idruro di ${m.nome}`,
		classe: 'idruro metallico',
		sym: m.sym,
		nome: m.nome,
		no: n,
		count: [1, n],
	};
}

/** Metals whose hydrides the lesson names: groups 1 and 2 and aluminium. */
export const HYDRIDE_METALS = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Ba', 'Al'];

const fixed = (key: string, tex: string, trad: string, stock: string, iupac: string, classe: Classe, sym: string, nome: string, no: number, count: [number, number]): Compound => ({ key, tex: `\\mathrm{${tex}}`, trad, stock, iupac, classe, sym, nome, no, count });

/**
 * Covalent hydrides: the formula in use, the name everybody says (their traditional name), the IUPAC name. `no` is of the other element: negative
 * where it is more electronegative than hydrogen (C, N) or counted so by convention (P, As), +4 for silicon, which is
 * less electronegative than hydrogen (lesson 78, the note on electronegativity).
 */
export const COVALENT_HYDRIDES: Compound[] = [
	fixed('CH4', 'CH_4', 'metano', 'idruro di carbonio', 'tetraidruro di carbonio', 'idruro covalente', 'C', 'carbonio', -4, [1, 4]),
	fixed('SiH4', 'SiH_4', 'silano', 'idruro di silicio', 'tetraidruro di silicio', 'idruro covalente', 'Si', 'silicio', 4, [1, 4]),
	fixed('NH3', 'NH_3', 'ammoniaca', 'idruro di azoto', 'triidruro di azoto', 'idruro covalente', 'N', 'azoto', -3, [1, 3]),
	fixed('PH3', 'PH_3', 'fosfina', 'idruro di fosforo', 'triidruro di fosforo', 'idruro covalente', 'P', 'fosforo', -3, [1, 3]),
	fixed('AsH3', 'AsH_3', 'arsina', 'idruro di arsenico', 'triidruro di arsenico', 'idruro covalente', 'As', 'arsenico', -3, [1, 3]),
];

/** Hydracids: hydrogen first; acido …idrico in water, …uro di idrogeno as a pure compound. `no` is of the non-metal. */
export const HYDRACIDS: Compound[] = [
	fixed('HF', 'HF', 'acido fluoridrico', 'fluoruro di idrogeno', 'fluoruro di idrogeno', 'idracido', 'F', 'fluoro', -1, [1, 1]),
	fixed('HCl', 'HCl', 'acido cloridrico', 'cloruro di idrogeno', 'cloruro di idrogeno', 'idracido', 'Cl', 'cloro', -1, [1, 1]),
	fixed('HBr', 'HBr', 'acido bromidrico', 'bromuro di idrogeno', 'bromuro di idrogeno', 'idracido', 'Br', 'bromo', -1, [1, 1]),
	fixed('HI', 'HI', 'acido iodidrico', 'ioduro di idrogeno', 'ioduro di idrogeno', 'idracido', 'I', 'iodio', -1, [1, 1]),
	fixed('H2S', 'H_2S', 'acido solfidrico', 'solfuro di idrogeno', 'solfuro di diidrogeno', 'idracido', 'S', 'zolfo', -2, [1, 2]),
	fixed('H2Se', 'H_2Se', 'acido selenidrico', 'seleniuro di idrogeno', 'seleniuro di diidrogeno', 'idracido', 'Se', 'selenio', -2, [1, 2]),
];

/** Peroxides: the group O₂ with oxygen at -1; the subscripts are not reduced. `no` is of the metal (or hydrogen). */
export const PEROXIDES: Compound[] = [
	fixed('H2O2', 'H_2O_2', 'acqua ossigenata', 'perossido di idrogeno', 'diossido di diidrogeno', 'perossido', 'H', 'idrogeno', 1, [2, 2]),
	fixed('Na2O2', 'Na_2O_2', 'perossido di sodio', 'perossido di sodio', 'diossido di disodio', 'perossido', 'Na', 'sodio', 1, [2, 2]),
	fixed('K2O2', 'K_2O_2', 'perossido di potassio', 'perossido di potassio', 'diossido di dipotassio', 'perossido', 'K', 'potassio', 1, [2, 2]),
	fixed('BaO2', 'BaO_2', 'perossido di bario', 'perossido di bario', 'diossido di bario', 'perossido', 'Ba', 'bario', 2, [1, 2]),
	fixed('CaO2', 'CaO_2', 'perossido di calcio', 'perossido di calcio', 'diossido di calcio', 'perossido', 'Ca', 'calcio', 2, [1, 2]),
];

/**
 * Oxides the two rules of lesson 77 do not name: the oxides of carbon and nitrogen that are not anhydrides, and the
 * oxides of chromium and manganese at their highest oxidation numbers, which are acidic though the element is a metal.
 */
export const SPECIAL_OXIDES: Compound[] = [
	fixed('CO', 'CO', 'ossido di carbonio', 'ossido di carbonio(II)', 'monossido di carbonio', 'ossido', 'C', 'carbonio', 2, [1, 1]),
	fixed('NO', 'NO', 'ossido di azoto', 'ossido di azoto(II)', 'monossido di azoto', 'ossido', 'N', 'azoto', 2, [1, 1]),
	fixed('MnO2', 'MnO_2', 'biossido di manganese', 'ossido di manganese(IV)', 'diossido di manganese', 'ossido', 'Mn', 'manganese', 4, [1, 2]),
	fixed('CrO3', 'CrO_3', 'anidride cromica', 'ossido di cromo(VI)', 'triossido di cromo', 'ossido acido', 'Cr', 'cromo', 6, [1, 3]),
	fixed('Mn2O7', 'Mn_2O_7', 'anidride permanganica', 'ossido di manganese(VII)', 'eptaossido di dimanganese', 'ossido acido', 'Mn', 'manganese', 7, [2, 7]),
];

export const allBasicOxides = () => METALS.flatMap((m) => m.ox.map((n) => basicOxide(m, n)));
export const allAnhydrides = () => NON_METALS.flatMap((x) => x.ox.map((n) => anhydride(x, n)));
export const allHydroxides = () => METALS.flatMap((m) => m.ox.map((n) => hydroxide(m, n)));
export const allMetalHydrides = () => HYDRIDE_METALS.map((s) => metalHydride(metal(s), metal(s).ox[0]));

export type Nomenclatura = 'trad' | 'stock' | 'iupac';
export const NOMENCLATURE: { id: Nomenclatura; label: string; dir: string }[] = [
	{ id: 'trad', label: 'tradizionale', dir: 'nome tradizionale' },
	{ id: 'stock', label: 'Stock', dir: 'nome nella notazione di Stock' },
	{ id: 'iupac', label: 'IUPAC', dir: 'nome IUPAC' },
];

// ---------------------------------------------------------------------------
// Species and the rules of the oxidation numbers (lesson 76)

/** Italian names of the elements the exercises use. */
export const NOMI: Record<string, string> = {
	H: 'idrogeno', Li: 'litio', B: 'boro', C: 'carbonio', N: 'azoto', O: 'ossigeno', F: 'fluoro', Na: 'sodio', Mg: 'magnesio', Al: 'alluminio',
	Si: 'silicio', P: 'fosforo', S: 'zolfo', Cl: 'cloro', K: 'potassio', Ca: 'calcio', Cr: 'cromo', Mn: 'manganese', Fe: 'ferro', Co: 'cobalto',
	Ni: 'nichel', Cu: 'rame', Zn: 'zinco', As: 'arsenico', Se: 'selenio', Br: 'bromo', Ag: 'argento', Sn: 'stagno', I: 'iodio', Ba: 'bario',
	Au: 'oro', Pb: 'piombo',
};

/** "il ferro", "l'ossigeno", "lo zolfo", "lo stagno", "lo iodio". */
export function il(nome: string): string {
	if (nome === 'iodio' || /^(z|s[^aeiou])/.test(nome)) return `lo ${nome}`;
	if (/^[aeiou]/.test(nome)) return `l'${nome}`;
	return `il ${nome}`;
}
/** "del ferro", "dell'ossigeno", "dello zolfo". */
export const del = (nome: string) => il(nome).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface Species {
	plain: string;
	charge: number;
	/** Atoms of each element, in the order of the formula, brackets multiplied out. */
	atoms: [string, number][];
	tex: string;
}

/** A molecule, a formula unit or an ion from its plain formula: species('Ca3(PO4)2'), species('SO4', -2). */
export function species(plain: string, charge = 0): Species {
	const atoms: [string, number][] = [];
	const add = (sym: string, n: number) => {
		const found = atoms.find((a) => a[0] === sym);
		if (found) found[1] += n;
		else atoms.push([sym, n]);
	};
	let tex = '';
	const re = /([A-Z][a-z]?)(\d*)|\(([A-Za-z0-9]+)\)(\d*)/g;
	let m: RegExpExecArray | null;
	let seen = 0;
	while ((m = re.exec(plain))) {
		seen += m[0].length;
		if (m[1]) {
			add(m[1], Number(m[2] || 1));
			tex += m[1] + (m[2] ? `_${m[2]}` : '');
		} else {
			const k = Number(m[4] || 1);
			const inner = species(m[3]);
			for (const [s, n] of inner.atoms) add(s, n * k);
			tex += `(${inner.tex.slice(8, -1)})${m[4] ? `_${m[4]}` : ''}`;
		}
	}
	if (seen !== plain.length) throw new Error(`species: cannot read ${plain}`);
	const q = charge === 0 ? '' : `^{${Math.abs(charge) === 1 ? '' : Math.abs(charge)}${charge > 0 ? '+' : '-'}}`;
	return { plain, charge, atoms, tex: `\\mathrm{${tex}${q}}` };
}

const GROUP1 = ['Li', 'Na', 'K'];
const GROUP2 = ['Mg', 'Ca', 'Ba'];
const HALOGENS = ['Cl', 'Br', 'I'];

/** The rule of lesson 76 that fixes an element, with its place in the order of precedence; null if none does. */
export function ruleOf(sym: string): { order: number; value: number; text: string } | null {
	const nome = NOMI[sym];
	if (sym === 'F') return { order: 4, value: -1, text: 'Il fluoro ha sempre $-1$.' };
	if (GROUP1.includes(sym)) return { order: 5, value: 1, text: `${cap(il(nome))} è un metallo del gruppo 1: ha sempre $+1$.` };
	if (GROUP2.includes(sym)) return { order: 5, value: 2, text: `${cap(il(nome))} è un metallo del gruppo 2: ha sempre $+2$.` };
	if (sym === 'Al') return { order: 5, value: 3, text: "L'alluminio ha sempre $+3$." };
	if (sym === 'Zn') return { order: 5, value: 2, text: 'Lo zinco ha sempre $+2$.' };
	if (sym === 'Ag') return { order: 5, value: 1, text: "L'argento ha sempre $+1$." };
	if (sym === 'H') return { order: 6, value: 1, text: "L'idrogeno ha $+1$." };
	if (sym === 'O') return { order: 7, value: -2, text: "L'ossigeno ha $-2$." };
	if (HALOGENS.includes(sym)) return { order: 8, value: -1, text: `${cap(il(nome))}, con l'idrogeno e con i metalli, ha $-1$.` };
	return null;
}

/**
 * The oxidation numbers of a species by the rules of lesson 76 in their order of precedence: every element takes the
 * value of its rule, except the one whose rule comes last (or that has none), which is found from the sum. Returns
 * the values and which element was found from the sum; throws when two elements have no rule or the number is not whole.
 */
export function oxidationNumbers(sp: Species): { values: Record<string, number>; solved: string } {
	if (sp.atoms.length === 1) {
		const [sym, n] = sp.atoms[0];
		if (sp.charge % n !== 0) throw new Error(`oxidationNumbers: ${sp.plain} not whole`);
		return { values: { [sym]: sp.charge / n }, solved: sym };
	}
	const ranked = sp.atoms.map(([sym, n]) => ({ sym, n, rule: ruleOf(sym) })).sort((a, b) => (a.rule?.order ?? 99) - (b.rule?.order ?? 99));
	if (ranked.filter((e) => !e.rule).length > 1) throw new Error(`oxidationNumbers: two elements without a rule in ${sp.plain}`);
	const last = ranked[ranked.length - 1];
	const values: Record<string, number> = {};
	let total = 0;
	for (const e of ranked.slice(0, -1)) {
		values[e.sym] = e.rule!.value;
		total += e.rule!.value * e.n;
	}
	const rest = sp.charge - total;
	if (rest % last.n !== 0) throw new Error(`oxidationNumbers: ${sp.plain} not whole`);
	values[last.sym] = rest / last.n;
	return { values, solved: last.sym };
}

/** The sum of the lesson with x for the element found from it: 2 \cdot (+1) + 2x + 7 \cdot (-2) = 0. */
export function sumEquation(sp: Species, values: Record<string, number>, unknown: string): string {
	const terms = sp.atoms.map(([sym, n]) => (sym === unknown ? `${n === 1 ? '' : n}x` : n === 1 ? `(${signed(values[sym])})` : `${n} \\cdot (${signed(values[sym])})`));
	return `${terms.join(' + ')} = ${sp.charge === 0 ? '0' : signed(sp.charge)}`;
}

// ---------------------------------------------------------------------------
// Samples: a level whose answer is a number keeps the number as the answer (it can be typed) and its wrong
// answers in `params.wrong`, from which `toChoice` builds the four options.

export const BANNED = /—|piuttosto che/;

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	params: Record<string, unknown>;
}

/** A number answer with its three distractors, in order of preference; throws when fewer than three differ. */
export function numberAnswer(value: number, wrong: number[]): { answer: Answer; wrong: number[] } {
	const out: number[] = [];
	for (const w of wrong) if (w !== value && !out.includes(w) && Number.isInteger(w)) out.push(w);
	if (out.length < 3) throw new Error('numberAnswer: fewer than three distractors');
	return { answer: { kind: 'number', value: String(value) }, wrong: out.slice(0, 3) };
}

function shuffleIdx(rng: Rng, n: number): number[] {
	const xs = Array.from({ length: n }, (_, i) => i);
	for (let i = n - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[xs[i], xs[j]] = [xs[j], xs[i]];
	}
	return xs;
}

/** The multiple choice of a sample: the answer itself when it is one, otherwise the number and `params.wrong`. */
export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error('toChoice: answer is neither a choice nor a number');
	const right = Number(sample.answer.value);
	const all = [right, ...(sample.params.wrong as number[])];
	const order = shuffleIdx(rng, all.length);
	return { kind: 'choice', options: order.map((i) => ({ latex: signed(all[i]), values: [String(all[i])] })), correct: order.indexOf(0) };
}

/** The checks every sample of these generators passes. */
export function checkSample(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.prompt, sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind === 'number') {
		if (!/^-?\d+$/.test(a.value)) v.push('la risposta non è un intero');
		const wrong = sample.params.wrong;
		if (!Array.isArray(wrong) || wrong.length !== 3 || new Set([Number(a.value), ...wrong]).size !== 4) v.push('servono tre distrattori diversi tra loro e dalla risposta');
		return v;
	}
	if (a.kind !== 'choice') return [...v, 'la risposta deve essere un numero o una scelta'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(a.options.map((o) => o.latex)).size !== a.options.length) v.push('due opzioni scritte uguali');
	if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** `generate` for a table of level builders: builds until the sample passes `check`. */
export function generateWith(id: string, levels: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]): Generator['generate'] {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		let last = '';
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: Built;
			try {
				b = make(rng);
			} catch (e) {
				last = String((e as Error).message ?? e);
				continue;
			}
			const sample: Sample = { generatorId: id, level, seed: rng.seed, ...b };
			const bad = check(sample);
			if (bad.length === 0) return sample;
			last = bad.join('; ');
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed} (${last})`);
	};
}

// ---------------------------------------------------------------------------
// Text, options and choices, written as the other chemistry generators write them (v2/chim-atomo.ts): prose as
// \text lines in an array, a long text option as a gathered of \text lines, four options with distinct values.

const visible = (x: string): number => x.replace(/\\[a-zA-Z]+\s?/g, 'x').replace(/[${}]/g, '').length;

/** Italian prose with inline $…$ as LaTeX lines of about `width` characters; extra LaTeX lines can follow. */
export function textBlock(prose: string, width = 46, extra: string[] = []): string {
	if (/[%&#_]/.test(prose.replace(/\$[^$]*\$/g, ''))) throw new Error(`textBlock: special character in "${prose}"`);
	const words = prose.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && visible(cur) + 1 + visible(w) > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	const all = [...out.map((l) => `\\text{${l}}`), ...extra];
	return all.length === 1 ? all[0] : `\\begin{array}{l} ${all.join(' \\\\ ')} \\end{array}`;
}

/** A text option, split on lines of at most `width` characters when longer (the answer button is 252 px wide). */
export function textOpt(label: string, value = label, width = 24): ChoiceOption {
	if (label.length <= width) return { latex: `\\text{${label}}`, values: [value] };
	const lines: string[] = [];
	for (const w of label.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return { latex: `\\begin{gathered} ${lines.map((l) => `\\text{${l}}`).join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

/** An option that is a formula already in LaTeX, with the value the checker reads. */
export const texOpt = (latex: string, value: string): ChoiceOption => ({ latex, values: [value] });

/** The right option, then the others in order of preference: the first three that differ from all before them. */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[]): ChoiceAnswer {
	const seenV = new Set([right.values.join('|')]);
	const seenL = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= 4) break;
		const k = o.values.join('|');
		if (seenV.has(k) || seenL.has(o.latex)) continue;
		seenV.add(k);
		seenL.add(o.latex);
		opts.push(o);
	}
	if (opts.length < 4) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffleIdx(rng, 4);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// The two questions of the lessons on nomenclature: from the formula to the name, from the name to the formula

export const ASK_NAME: Record<Nomenclatura, (tex: string) => string> = {
	trad: (f) => `Qual è il nome tradizionale di $${f}$?`,
	stock: (f) => `Qual è il nome di $${f}$ nella notazione di Stock?`,
	iupac: (f) => `Qual è il nome IUPAC di $${f}$?`,
};

/** The three names of a compound in a line, for the last step of a solution. */
export const threeNames = (c: Compound, first = 'Nome tradizionale') => `${first}: ${c.trad}. Notazione di Stock: ${c.stock}. Nome IUPAC: ${c.iupac}.`;

/**
 * From the formula to the name in one nomenclature. `wrong` are names in order of preference; those that are a right
 * name of the same compound in another nomenclature are dropped, because they would be a second right answer.
 */
export function nameQuestion(rng: Rng, c: Compound, which: Nomenclatura, wrong: string[], steps: string[], kase: string): Built {
	const valid = new Set([c.trad, c.stock, c.iupac]);
	const right = c[which];
	return {
		prompt: 'Scegli il nome del composto.',
		problem: textBlock(ASK_NAME[which](c.tex)),
		solution: `\\text{${right}}`,
		steps: steps.map((x) => textBlock(x)),
		answer: choose(rng, textOpt(right), wrong.filter((w) => !valid.has(w)).map((w) => textOpt(w))),
		params: { case: kase, key: c.key, which },
	};
}

/** From a name to the formula. `wrong` are formulas as [LaTeX without \mathrm, plain key], in order of preference. */
export function formulaQuestion(rng: Rng, c: Compound, which: Nomenclatura, wrong: [string, string][], steps: string[], kase: string, extra: string[] = []): Built {
	return {
		prompt: 'Scegli la formula del composto.',
		problem: textBlock(`Qual è la formula del composto che ha questo nome: ${c[which]}?`),
		solution: c.tex,
		steps: [...steps.map((x) => textBlock(x)), ...extra],
		answer: choose(rng, texOpt(c.tex, c.key), wrong.map(([tex, key]) => texOpt(`\\mathrm{${tex}}`, key))),
		params: { case: kase, key: c.key, which },
	};
}

/** A wrong formula from its plain writing, as formulaQuestion takes it: wrongKey('CaOH2') → ['CaOH_2', 'CaOH2']. */
export const wrongKey = (key: string): [string, string] => [species(key).tex.slice(8, -1), key];

/** A formula of two parts for a wrong option: wrongFormula('Fe', 3, 'O', 2) → ['Fe_3O_2', 'Fe3O2']. */
export function wrongFormula(a: string, i: number, b: string, j: number): [string, string] {
	const parts: [string, number][] = [[a, i], [b, j]];
	return [formulaTex(parts).slice(8, -1), plain(parts)];
}
