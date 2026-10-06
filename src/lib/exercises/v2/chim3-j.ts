/**
 * Nomenclature of oxoacids, binary salts and ternary salts (chemistry, third year, group J: chim-ossiacidi,
 * chim-sali-binari, chim-sali-ternari). The data and the rules of the lessons 80-82 (docs/lezioni/chimica/riscritte/),
 * with no dependency: the three generators and the interactive figures of the three lessons read the same tables, so a
 * name is written in one place only.
 *
 * Conventions (docs/lezioni/chimica/brief-terzo-anno.md):
 * - traditional name: acido solforico, cloruro ferrico, solfato di sodio, solfato ferrico;
 * - Stock: the metal with its oxidation number in Roman numerals when it has more than one, cloruro di ferro(III),
 *   solfato di ferro(III); for an oxoacid the Roman numeral is inside the IUPAC name, and there is no Stock name;
 * - IUPAC: tricloruro di ferro, acido tetraossosolforico(VI), tetraossosolfato(VI) di disodio,
 *   tris[tetraossosolfato(VI)] di diferro. The prefix mono- is written only in monosso-.
 */

export const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
/** di-, tri-, tetra-…; nothing for 1. */
export const PREFIX = ['', '', 'di', 'tri', 'tetra', 'penta', 'esa', 'epta', 'otta', 'nona', 'deca'];
/** bis, tris, tetrakis: how many times a group with a composite name is taken. */
export const MULT = ['', '', 'bis', 'tris', 'tetrakis'];
/** monosso-, diosso-, triosso-, tetraosso-… */
export const osso = (n: number) => (n === 1 ? 'monosso' : `${PREFIX[n]}osso`);

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

// ---------------------------------------------------------------------------
// Cations

export interface Metal {
	sym: string;
	nome: string;
	/** The charges of its ions, ascending. */
	charges: number[];
	/** With two charges, the adjectives of the traditional name: [ferroso, ferrico]. */
	adj?: [string, string];
	/** A polyatomic cation (ammonium): brackets in a formula when taken more than once. */
	poly?: boolean;
}

export const METALS: Metal[] = [
	{ sym: 'Li', nome: 'litio', charges: [1] },
	{ sym: 'Na', nome: 'sodio', charges: [1] },
	{ sym: 'K', nome: 'potassio', charges: [1] },
	{ sym: 'Ag', nome: 'argento', charges: [1] },
	{ sym: 'Mg', nome: 'magnesio', charges: [2] },
	{ sym: 'Ca', nome: 'calcio', charges: [2] },
	{ sym: 'Ba', nome: 'bario', charges: [2] },
	{ sym: 'Zn', nome: 'zinco', charges: [2] },
	{ sym: 'Al', nome: 'alluminio', charges: [3] },
	{ sym: 'Fe', nome: 'ferro', charges: [2, 3], adj: ['ferroso', 'ferrico'] },
	{ sym: 'Cu', nome: 'rame', charges: [1, 2], adj: ['rameoso', 'rameico'] },
	{ sym: 'Sn', nome: 'stagno', charges: [2, 4], adj: ['stannoso', 'stannico'] },
	{ sym: 'Pb', nome: 'piombo', charges: [2, 4], adj: ['piomboso', 'piombico'] },
];
export const AMMONIUM: Metal = { sym: 'NH_4', nome: 'ammonio', charges: [1], poly: true };

export const metal = (sym: string): Metal => {
	const m = sym === AMMONIUM.sym ? AMMONIUM : METALS.find((x) => x.sym === sym);
	if (!m) throw new Error(`chim3-j: unknown metal ${sym}`);
	return m;
};

/** The ion in LaTeX, without \mathrm: Fe^{3+}, Na^+, NH_4^+. */
export const chargeTex = (q: number) => (Math.abs(q) === 1 ? `^${q > 0 ? '+' : '-'}` : `^{${Math.abs(q)}${q > 0 ? '+' : '-'}}`);
export const ionTex = (sym: string, q: number) => `${sym}${chargeTex(q)}`;

/** ione sodio; ione ferroso (traditional), ione ferro(III) (Stock). */
export function cationName(m: Metal, q: number, style: 'trad' | 'stock'): string {
	if (m.charges.length === 1) return `ione ${m.nome}`;
	return style === 'trad' ? `ione ${m.adj![m.charges.indexOf(q)]}` : `ione ${m.nome}(${ROMAN[q]})`;
}

// ---------------------------------------------------------------------------
// Anions of the hydracids

export interface Simple {
	sym: string;
	/** fluoruro, cloruro… */
	nome: string;
	/** The size of the charge: 1 or 2. */
	charge: number;
	/** The acid it comes from: acido cloridrico. */
	acid: string;
	acidTex: string;
	elemento: string;
}

export const SIMPLE: Simple[] = [
	{ sym: 'F', nome: 'fluoruro', charge: 1, acid: 'acido fluoridrico', acidTex: 'HF', elemento: 'fluoro' },
	{ sym: 'Cl', nome: 'cloruro', charge: 1, acid: 'acido cloridrico', acidTex: 'HCl', elemento: 'cloro' },
	{ sym: 'Br', nome: 'bromuro', charge: 1, acid: 'acido bromidrico', acidTex: 'HBr', elemento: 'bromo' },
	{ sym: 'I', nome: 'ioduro', charge: 1, acid: 'acido iodidrico', acidTex: 'HI', elemento: 'iodio' },
	{ sym: 'S', nome: 'solfuro', charge: 2, acid: 'acido solfidrico', acidTex: 'H_2S', elemento: 'zolfo' },
];
export const simple = (sym: string): Simple => {
	const a = SIMPLE.find((x) => x.sym === sym);
	if (!a) throw new Error(`chim3-j: unknown anion ${sym}`);
	return a;
};

// ---------------------------------------------------------------------------
// Formulas

const idx = (n: number) => (n === 1 ? '' : `_${n}`);

/** How many cations of charge +p and anions of charge −q make a neutral unit: the smallest whole numbers. */
export function counts(p: number, q: number): [number, number] {
	const g = gcd(p, q);
	return [q / g, p / g];
}

/** A group of atoms taken n times: brackets around a polyatomic one when n > 1. */
const group = (tex: string, n: number, poly: boolean) => (n === 1 ? tex : poly ? `(${tex})_${n}` : `${tex}_${n}`);

/** FeCl_3, Na_2S, Al_2(SO_4)_3, (NH_4)_2SO_4: LaTeX without \mathrm. */
export function saltTex(catTex: string, nCat: number, catPoly: boolean, anTex: string, nAn: number, anPoly: boolean): string {
	return group(catTex, nCat, catPoly) + group(anTex, nAn, anPoly);
}

export const mathrm = (tex: string) => `\\mathrm{${tex}}`;

// ---------------------------------------------------------------------------
// Binary salts

export interface Names {
	trad: string;
	stock: string;
	iupac: string;
}

export interface Salt extends Names {
	/** LaTeX without \mathrm. */
	tex: string;
	nCat: number;
	nAn: number;
}

function metalParts(m: Metal, q: number, anion: string) {
	const variable = m.charges.length > 1;
	return {
		trad: variable ? `${anion} ${m.adj![m.charges.indexOf(q)]}` : `${anion} di ${m.nome}`,
		stock: variable ? `${anion} di ${m.nome}(${ROMAN[q]})` : `${anion} di ${m.nome}`,
	};
}

/** The binary salt of a metal ion of charge +q and a simple anion. */
export function binarySalt(m: Metal, q: number, a: Simple): Salt {
	const [nCat, nAn] = counts(q, a.charge);
	return {
		tex: saltTex(m.sym, nCat, !!m.poly, a.sym, nAn, false),
		nCat,
		nAn,
		...metalParts(m, q, a.nome),
		iupac: `${PREFIX[nAn]}${a.nome} di ${PREFIX[nCat]}${m.nome}`,
	};
}

/** Binary salts the lessons and the exercises leave out: they are not stable compounds. */
export const UNSTABLE = new Set(['Fe3+I', 'Cu2+I', 'Pb4+I', 'Pb4+Br', 'Pb4+S', 'Cu1+F']);
export const stable = (m: Metal, q: number, a: Simple) => !UNSTABLE.has(`${m.sym}${q}+${a.sym}`);

// ---------------------------------------------------------------------------
// Oxoacids

export interface Oxoacid {
	/** H, central atoms, O. */
	h: number;
	x: string;
	nX: number;
	o: number;
	/** Oxidation number of the central atom. */
	no: number;
	elemento: string;
	/** The adjective of the traditional name: solforico, ipocloroso, metafosforico. */
	trad: string;
	/** The root that takes -ico in the IUPAC name: solfor, clor, fosfor. */
	root: string;
	/** The traditional name of the anion without hydrogen: solfato, ipoclorito. */
	anion: string;
	/** The root that takes -ato in the IUPAC name of the anion: solf, clor, fosf. */
	anionRoot: string;
	/** The oxide it comes from, LaTeX without \mathrm, and the molecules of water added to one of it. */
	oxide: string;
	oxideName: string;
	water: number;
	/** Acids made from one oxide: how many molecules of acid (HNO3: 2 from N2O5 + H2O). */
	made: number;
	/** meta, piro, orto: the same oxide with a different number of water molecules. */
	family?: 'meta' | 'piro' | 'orto';
}

const A = (h: number, x: string, nX: number, o: number, no: number, elemento: string, trad: string, root: string, anion: string, anionRoot: string, oxide: string, oxideName: string, water: number, made: number, family?: Oxoacid['family']): Oxoacid => ({ h, x, nX, o, no, elemento, trad, root, anion, anionRoot, oxide, oxideName, water, made, family });

export const OXOACIDS: Oxoacid[] = [
	A(2, 'C', 1, 3, 4, 'carbonio', 'carbonico', 'carbon', 'carbonato', 'carbon', 'CO_2', 'anidride carbonica', 1, 1),
	A(1, 'N', 1, 2, 3, 'azoto', 'nitroso', 'nitr', 'nitrito', 'nitr', 'N_2O_3', 'anidride nitrosa', 1, 2),
	A(1, 'N', 1, 3, 5, 'azoto', 'nitrico', 'nitr', 'nitrato', 'nitr', 'N_2O_5', 'anidride nitrica', 1, 2),
	A(2, 'S', 1, 3, 4, 'zolfo', 'solforoso', 'solfor', 'solfito', 'solf', 'SO_2', 'anidride solforosa', 1, 1),
	A(2, 'S', 1, 4, 6, 'zolfo', 'solforico', 'solfor', 'solfato', 'solf', 'SO_3', 'anidride solforica', 1, 1),
	A(1, 'Cl', 1, 1, 1, 'cloro', 'ipocloroso', 'clor', 'ipoclorito', 'clor', 'Cl_2O', 'anidride ipoclorosa', 1, 2),
	A(1, 'Cl', 1, 2, 3, 'cloro', 'cloroso', 'clor', 'clorito', 'clor', 'Cl_2O_3', 'anidride clorosa', 1, 2),
	A(1, 'Cl', 1, 3, 5, 'cloro', 'clorico', 'clor', 'clorato', 'clor', 'Cl_2O_5', 'anidride clorica', 1, 2),
	A(1, 'Cl', 1, 4, 7, 'cloro', 'perclorico', 'clor', 'perclorato', 'clor', 'Cl_2O_7', 'anidride perclorica', 1, 2),
	A(1, 'Br', 1, 1, 1, 'bromo', 'ipobromoso', 'brom', 'ipobromito', 'brom', 'Br_2O', 'anidride ipobromosa', 1, 2),
	A(1, 'Br', 1, 3, 5, 'bromo', 'bromico', 'brom', 'bromato', 'brom', 'Br_2O_5', 'anidride bromica', 1, 2),
	A(1, 'I', 1, 1, 1, 'iodio', 'ipoiodoso', 'iod', 'ipoiodito', 'iod', 'I_2O', 'anidride ipoiodosa', 1, 2),
	A(1, 'I', 1, 3, 5, 'iodio', 'iodico', 'iod', 'iodato', 'iod', 'I_2O_5', 'anidride iodica', 1, 2),
	A(1, 'I', 1, 4, 7, 'iodio', 'periodico', 'iod', 'periodato', 'iod', 'I_2O_7', 'anidride periodica', 1, 2),
	A(3, 'P', 1, 4, 5, 'fosforo', 'fosforico', 'fosfor', 'fosfato', 'fosf', 'P_2O_5', 'anidride fosforica', 3, 2, 'orto'),
	A(2, 'Cr', 1, 4, 6, 'cromo', 'cromico', 'crom', 'cromato', 'crom', 'CrO_3', 'anidride cromica', 1, 1),
	A(1, 'Mn', 1, 4, 7, 'manganese', 'permanganico', 'mangan', 'permanganato', 'mangan', 'Mn_2O_7', 'anidride permanganica', 1, 2),
];

/** The acids of phosphorus, boron and silicon with meta-, piro-, orto- (lesson 80, last section), and the dichromic acid. */
export const FAMILIES: Oxoacid[] = [
	A(1, 'P', 1, 3, 5, 'fosforo', 'metafosforico', 'fosfor', 'metafosfato', 'fosf', 'P_2O_5', 'anidride fosforica', 1, 2, 'meta'),
	A(4, 'P', 2, 7, 5, 'fosforo', 'pirofosforico', 'fosfor', 'pirofosfato', 'fosf', 'P_2O_5', 'anidride fosforica', 2, 1, 'piro'),
	A(3, 'P', 1, 4, 5, 'fosforo', 'ortofosforico', 'fosfor', 'ortofosfato', 'fosf', 'P_2O_5', 'anidride fosforica', 3, 2, 'orto'),
	A(1, 'P', 1, 2, 3, 'fosforo', 'metafosforoso', 'fosfor', 'metafosfito', 'fosf', 'P_2O_3', 'anidride fosforosa', 1, 2, 'meta'),
	A(4, 'P', 2, 5, 3, 'fosforo', 'pirofosforoso', 'fosfor', 'pirofosfito', 'fosf', 'P_2O_3', 'anidride fosforosa', 2, 1, 'piro'),
	A(3, 'P', 1, 3, 3, 'fosforo', 'ortofosforoso', 'fosfor', 'ortofosfito', 'fosf', 'P_2O_3', 'anidride fosforosa', 3, 2, 'orto'),
	A(1, 'B', 1, 2, 3, 'boro', 'metaborico', 'bor', 'metaborato', 'bor', 'B_2O_3', 'anidride borica', 1, 2, 'meta'),
	A(4, 'B', 2, 5, 3, 'boro', 'piroborico', 'bor', 'piroborato', 'bor', 'B_2O_3', 'anidride borica', 2, 1, 'piro'),
	A(3, 'B', 1, 3, 3, 'boro', 'ortoborico', 'bor', 'ortoborato', 'bor', 'B_2O_3', 'anidride borica', 3, 2, 'orto'),
	A(2, 'Si', 1, 3, 4, 'silicio', 'metasilicico', 'silic', 'metasilicato', 'silic', 'SiO_2', 'anidride silicica', 1, 1, 'meta'),
	A(4, 'Si', 1, 4, 4, 'silicio', 'ortosilicico', 'silic', 'ortosilicato', 'silic', 'SiO_2', 'anidride silicica', 2, 1, 'orto'),
];

export const DICHROMIC: Oxoacid = A(2, 'Cr', 2, 7, 6, 'cromo', 'dicromico', 'crom', 'dicromato', 'crom', 'CrO_3', 'anidride cromica', 1, 1);

/** H_2SO_4, HClO, H_4P_2O_7: LaTeX without \mathrm. */
export const acidTex = (a: Oxoacid) => `H${idx(a.h)}${a.x}${idx(a.nX)}O${idx(a.o)}`;
/** acido solforico */
export const acidTrad = (a: Oxoacid) => `acido ${a.trad}`;
/** acido tetraossosolforico(VI), acido eptaossodifosforico(V) */
export const acidIupac = (a: Oxoacid) => `acido ${osso(a.o)}${PREFIX[a.nX]}${a.root}ico(${ROMAN[a.no]})`;
/** The oxidation number of the central atom from the formula: (2·O − H) / atoms. */
export const centralNo = (h: number, nX: number, o: number) => (2 * o - h) / nX;

// ---------------------------------------------------------------------------
// Anions of the oxoacids, and ternary salts

export interface Oxoanion {
	acid: Oxoacid;
	/** Hydrogen atoms the anion keeps: 0 for the anion of a neutral salt. */
	kept: number;
	charge: number;
	/** SO_4, HCO_3, H_2PO_4: LaTeX without \mathrm and without the charge. */
	tex: string;
	/** solfato, idrogenocarbonato, diidrogenofosfato */
	trad: string;
	/** tetraossosolfato(VI), idrogenotriossocarbonato(IV) */
	iupac: string;
}

export function oxoanion(acid: Oxoacid, kept = 0): Oxoanion {
	if (kept < 0 || kept >= acid.h) throw new Error('chim3-j: an anion keeps fewer hydrogens than the acid has');
	const hy = kept === 0 ? '' : `${PREFIX[kept]}idrogeno`;
	return {
		acid,
		kept,
		charge: acid.h - kept,
		tex: `${kept === 0 ? '' : `H${idx(kept)}`}${acid.x}${idx(acid.nX)}O${idx(acid.o)}`,
		trad: `${hy}${acid.anion}`,
		iupac: `${hy}${osso(acid.o)}${PREFIX[acid.nX]}${acid.anionRoot}ato(${ROMAN[acid.no]})`,
	};
}

/** The salt of a metal ion of charge +q and the anion of an oxoacid. */
export function ternarySalt(m: Metal, q: number, an: Oxoanion): Salt {
	const [nCat, nAn] = counts(q, an.charge);
	return {
		tex: saltTex(m.sym, nCat, !!m.poly, an.tex, nAn, true),
		nCat,
		nAn,
		...metalParts(m, q, an.trad),
		iupac: `${nAn === 1 ? an.iupac : `${MULT[nAn]}[${an.iupac}]`} di ${PREFIX[nCat]}${m.nome}`,
	};
}

/** The acid salt of a simple anion that keeps a hydrogen: NaHS, idrogenosolfuro di sodio. Only the sulfide has one. */
export function hydrogenSulfide(m: Metal, q: number): Salt {
	const [nCat, nAn] = counts(q, 1);
	return {
		tex: saltTex(m.sym, nCat, !!m.poly, 'HS', nAn, true),
		nCat,
		nAn,
		...metalParts(m, q, 'idrogenosolfuro'),
		iupac: `${nAn === 1 ? 'idrogenosolfuro' : `${MULT[nAn]}[idrogenosolfuro]`} di ${PREFIX[nCat]}${m.nome}`,
	};
}

/** monoidrato, diidrato, pentaidrato… */
export const hydrateWord = (n: number) => `${n === 1 ? 'mono' : PREFIX[n]}idrato`;
/** CuSO_4 \cdot 5H_2O */
export const hydrateTex = (saltTexNoMathrm: string, n: number) => `${saltTexNoMathrm} \\cdot ${n === 1 ? '' : n}H_2O`;
