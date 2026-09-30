/**
 * La formula chimica e il suo significato. Spec: specs/exercises/chim-formula-chimica.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/28-chim-formula-chimica.md), each one step harder: the
 * atoms of one element read from its index; all the atoms of a formula, with the indices 1 that are not written; a
 * coefficient in front; brackets; hydrates; the formula of an ionic compound from its two ions. Distractors from the
 * lesson's warnings: the coefficient added to the index, the bracket's index forgotten or added, the water of a
 * hydrate counted once, the unwritten indices skipped, the ions not crossed, the brackets left out.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, NAME, atomsOf, cfx, checkCommon, choose, formulaOpt, fx, gcd, generateWith, intOpt, pf, t, textBlock, totalAtoms } from '../chim-trasformazioni';

export const ID = 'chim-formula-chimica';

/** Formulas without brackets; `ionic` for the ones whose particles are ions (unità formula). */
const SIMPLE: { f: string; nome: string; ionic?: boolean }[] = [
	{ f: 'H2O', nome: 'acqua' },
	{ f: 'CO2', nome: 'anidride carbonica' },
	{ f: 'NH3', nome: 'ammoniaca' },
	{ f: 'CH4', nome: 'metano' },
	{ f: 'H2SO4', nome: 'acido solforico' },
	{ f: 'HNO3', nome: 'acido nitrico' },
	{ f: 'H3PO4', nome: 'acido fosforico' },
	{ f: 'C6H12O6', nome: 'glucosio' },
	{ f: 'C2H6O', nome: 'etanolo' },
	{ f: 'C3H8', nome: 'propano' },
	{ f: 'C2H4O2', nome: 'acido acetico' },
	{ f: 'C12H22O11', nome: 'saccarosio' },
	{ f: 'C8H10N4O2', nome: 'caffeina' },
	{ f: 'C9H8O4', nome: 'acido acetilsalicilico' },
	{ f: 'H2O2', nome: 'acqua ossigenata' },
	{ f: 'SO3', nome: 'anidride solforica' },
	{ f: 'N2O5', nome: 'pentossido di diazoto' },
	{ f: 'CaCO3', nome: 'carbonato di calcio', ionic: true },
	{ f: 'Na2SO4', nome: 'solfato di sodio', ionic: true },
	{ f: 'KNO3', nome: 'nitrato di potassio', ionic: true },
	{ f: 'Na3PO4', nome: 'fosfato di sodio', ionic: true },
	{ f: 'NaHCO3', nome: 'idrogenocarbonato di sodio', ionic: true },
	{ f: 'Fe2O3', nome: 'ossido di ferro(III)', ionic: true },
	{ f: 'Al2O3', nome: 'ossido di alluminio', ionic: true },
	{ f: 'CaCl2', nome: 'cloruro di calcio', ionic: true },
	{ f: 'K2CO3', nome: 'carbonato di potassio', ionic: true },
	{ f: 'MgCl2', nome: 'cloruro di magnesio', ionic: true },
];

const BRACKETS: { f: string; nome: string }[] = [
	{ f: 'Ca(OH)2', nome: 'idrossido di calcio' },
	{ f: 'Mg(OH)2', nome: 'idrossido di magnesio' },
	{ f: 'Al(OH)3', nome: 'idrossido di alluminio' },
	{ f: 'Fe(OH)3', nome: 'idrossido di ferro(III)' },
	{ f: 'Ca(NO3)2', nome: 'nitrato di calcio' },
	{ f: 'Mg(NO3)2', nome: 'nitrato di magnesio' },
	{ f: 'Al(NO3)3', nome: 'nitrato di alluminio' },
	{ f: 'Fe(NO3)3', nome: 'nitrato di ferro(III)' },
	{ f: 'Al2(SO4)3', nome: 'solfato di alluminio' },
	{ f: 'Fe2(SO4)3', nome: 'solfato di ferro(III)' },
	{ f: '(NH4)2SO4', nome: 'solfato di ammonio' },
	{ f: '(NH4)3PO4', nome: 'fosfato di ammonio' },
	{ f: '(NH4)2CO3', nome: 'carbonato di ammonio' },
	{ f: 'Ca3(PO4)2', nome: 'fosfato di calcio' },
	{ f: 'Mg3(PO4)2', nome: 'fosfato di magnesio' },
	{ f: 'Ca(HCO3)2', nome: 'idrogenocarbonato di calcio' },
	{ f: 'Al2(CO3)3', nome: 'carbonato di alluminio' },
];

const HYDRATES: { f: string; nome: string }[] = [
	{ f: 'CuSO4.5H2O', nome: 'solfato di rame pentaidrato' },
	{ f: 'MgSO4.7H2O', nome: 'solfato di magnesio eptaidrato' },
	{ f: 'CaSO4.2H2O', nome: 'gesso' },
	{ f: 'Na2CO3.10H2O', nome: 'carbonato di sodio decaidrato' },
	{ f: 'CoCl2.6H2O', nome: 'cloruro di cobalto esaidrato' },
	{ f: 'FeSO4.7H2O', nome: 'solfato di ferro(II) eptaidrato' },
	{ f: 'Na2SO4.10H2O', nome: 'solfato di sodio decaidrato' },
	{ f: 'BaCl2.2H2O', nome: 'cloruro di bario diidrato' },
	{ f: 'CaCl2.6H2O', nome: 'cloruro di calcio esaidrato' },
	{ f: 'ZnSO4.7H2O', nome: 'solfato di zinco eptaidrato' },
];

/** "atomi di ossigeno", with "atomi d'…" never used: the lesson writes "atomi di". */
const of = (el: string) => `atomi di ${NAME[el]}`;
/** Positive integers from the list, without the answer, for fallbacks. */
const around = (n: number) => [n + 1, n - 1, n + 2, n + 3, n - 2, 2 * n].filter((x) => x > 0);
const ints = (xs: number[]) => xs.filter((x) => Number.isInteger(x) && x > 0).map(intOpt);
/** "una molecola" or "un'unità formula", for the particle a formula describes. */
function particle(ionic?: boolean) {
	return ionic ? "un'unità formula" : 'una molecola';
}

// ---------------------------------------------------------------------------
// Level 1: one element

function level1(rng: Rng): Built {
	const s = rng.pick(SIMPLE);
	const atoms = atomsOf(s.f);
	const els = Object.keys(atoms);
	const el = rng.pick(els);
	const n = atoms[el];
	const others = els.filter((e) => e !== el).map((e) => atoms[e]);
	return {
		prompt: 'Conta gli atomi.',
		problem: textBlock(`Quanti ${of(el)} ci sono in ${particle(s.ionic)} di ${s.nome}, ${pf(s.f)}?`),
		solution: `${n}`,
		steps: [t(`L'indice che segue il simbolo ${el} dice quanti atomi ci sono${n === 1 ? ': non è scritto, quindi vale 1.' : `: ${n}.`}`)],
		// the index of another element; all the atoms; neighbours
		answer: choose(rng, intOpt(n), ints([...others, totalAtoms(s.f)]), ints(around(n))),
		params: { case: s.ionic ? 'ionico' : 'molecolare', formula: s.f, element: el },
	};
}

// ---------------------------------------------------------------------------
// Level 2: all the atoms

function level2(rng: Rng): Built {
	for (;;) {
		const s = rng.pick(SIMPLE);
		const atoms = atomsOf(s.f);
		const ones = Object.values(atoms).filter((n) => n === 1).length;
		if (!ones) continue;
		const n = totalAtoms(s.f);
		const written = n - ones; // the unwritten 1s skipped
		const kinds = Object.keys(atoms).length;
		const detail = Object.entries(atoms).map(([e, k]) => `${k}\\ \\mathrm{${e}}`).join(' + ');
		return {
			prompt: 'Conta gli atomi.',
			problem: textBlock(`Quanti atomi ci sono in tutto in ${particle(s.ionic)} di ${s.nome}, ${pf(s.f)}?`),
			solution: `${n}`,
			steps: [t("Si sommano gli indici di tutti gli elementi; dove l'indice non è scritto vale 1."), `${detail} = ${n}`],
			// the unwritten 1s skipped; the number of elements; one more
			answer: choose(rng, intOpt(n), ints([written, kinds]), ints(around(n))),
			params: { case: s.ionic ? 'ionico' : 'molecolare', formula: s.f },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a coefficient

function level3(rng: Rng): Built {
	for (;;) {
		const s = rng.pick(SIMPLE);
		const k = rng.int(2, 5);
		const atoms = atomsOf(s.f);
		const el = rng.pick(Object.keys(atoms));
		const i = atoms[el];
		const n = k * i;
		if (n > 40) continue;
		const what = s.ionic ? 'unità formula' : 'molecole';
		return {
			prompt: 'Conta gli atomi.',
			problem: textBlock(`Quanti ${of(el)} ci sono in $${cfx(k, s.f)}$, cioè in $${k}$ ${what} di ${s.nome}?`),
			solution: `${n}`,
			steps: [t(`In ${particle(s.ionic)} ${i === 1 ? "c'è 1 atomo" : `ci sono ${i} atomi`} di ${NAME[el]}; il coefficiente moltiplica tutta la formula:`), `${k} \\cdot ${i} = ${n}`],
			// the coefficient added to the index; the index alone; the coefficient times all the atoms
			answer: choose(rng, intOpt(n), ints([k + i, i, k * totalAtoms(s.f), k]), ints(around(n))),
			params: { case: s.ionic ? 'ionico' : 'molecolare', formula: s.f, k, element: el },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: brackets

function level4(rng: Rng): Built {
	for (;;) {
		const s = rng.pick(BRACKETS);
		const m = /\(([^)]*)\)(\d+)/.exec(s.f)!;
		const inner = atomsOf(m[1]);
		const outer = Number(m[2]);
		const all = atomsOf(s.f);
		const askTotal = rng.next() < 0.25;
		if (askTotal) {
			const n = totalAtoms(s.f);
			const noBracket = totalAtoms(s.f.replace(/\(([^)]*)\)\d+/, '$1')); // the bracket's index forgotten
			return {
				prompt: 'Conta gli atomi.',
				problem: textBlock(`Quanti atomi ci sono in tutto in un'unità formula di ${s.nome}, ${pf(s.f)}?`),
				solution: `${n}`,
				steps: [t(`L'indice ${outer} fuori dalla parentesi moltiplica gli atomi che ci sono dentro:`), Object.entries(all).map(([e, k]) => `${k}\\ \\mathrm{${e}}`).join(' + ') + ` = ${n}`],
				answer: choose(rng, intOpt(n), ints([noBracket, noBracket + outer, n - 1]), ints(around(n))),
				params: { case: 'tutti', formula: s.f },
			};
		}
		const el = rng.pick(Object.keys(inner));
		const n = all[el];
		const i = inner[el];
		if (n !== i * outer) continue; // the element only inside the bracket
		return {
			prompt: 'Conta gli atomi.',
			problem: textBlock(`Quanti ${of(el)} ci sono in un'unità formula di ${s.nome}, ${pf(s.f)}?`),
			solution: `${n}`,
			steps: [t(`Gli atomi di ${NAME[el]} sono dentro la parentesi, con indice ${i}, e la parentesi ha indice ${outer}:`), `${i} \\cdot ${outer} = ${n}`],
			// the bracket's index forgotten; added; the bracket's index alone
			answer: choose(rng, intOpt(n), ints([i, i + outer, outer]), ints(around(n))),
			params: { case: 'elemento', formula: s.f, element: el },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: hydrates

function level5(rng: Rng): Built {
	const s = rng.pick(HYDRATES);
	const [salt, water] = s.f.split('.');
	const w = Number(/^(\d+)/.exec(water)![1]);
	const a = atomsOf(salt);
	const all = atomsOf(s.f);
	const ask = rng.pick(['O', 'H', 'tutti'] as const);
	const tex = `$${fx(s.f)}$`;
	if (ask === 'tutti') {
		const n = totalAtoms(s.f);
		const saltN = totalAtoms(salt);
		return {
			prompt: 'Conta gli atomi.',
			problem: textBlock(`Quanti atomi ci sono in tutto in un'unità formula di ${s.nome}, ${tex}?`),
			solution: `${n}`,
			steps: [t(`Nel sale ci sono ${saltN} atomi; ogni molecola d'acqua ne ha 3, e le molecole sono ${w}:`), `${saltN} + ${w} \\cdot 3 = ${n}`],
			// the salt only; one water molecule; the coefficient added as atoms
			answer: choose(rng, intOpt(n), ints([saltN, saltN + 3, saltN + w, saltN + 3 + w]), ints(around(n))),
			params: { case: 'tutti', formula: s.f },
		};
	}
	const el = ask;
	const n = all[el];
	const inSalt = a[el] ?? 0;
	const perWater = el === 'H' ? 2 : 1;
	return {
		prompt: 'Conta gli atomi.',
		problem: textBlock(`Quanti ${of(el)} ci sono in un'unità formula di ${s.nome}, ${tex}?`),
		solution: `${n}`,
		steps: [
			t(`Nel sale: ${inSalt}. Nell'acqua: ${w} molecole con ${perWater} ${perWater === 1 ? 'atomo' : 'atomi'} di ${NAME[el]} ciascuna.`),
			`${inSalt} + ${w} \\cdot ${perWater} = ${n}`,
		],
		// the salt only; the water counted once; the water forgotten to multiply by its index
		answer: choose(rng, intOpt(n), ints([inSalt, inSalt + perWater, inSalt + w + perWater, w * perWater]), ints(around(n))),
		params: { case: el, formula: s.f, element: el },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the formula from the ions

type Ion = { f: string; q: number; nome: string; poly?: boolean };
const CATIONS: Ion[] = [
	{ f: 'Na', q: 1, nome: 'sodio' },
	{ f: 'K', q: 1, nome: 'potassio' },
	{ f: 'NH4', q: 1, nome: 'ammonio', poly: true },
	{ f: 'Mg', q: 2, nome: 'magnesio' },
	{ f: 'Ca', q: 2, nome: 'calcio' },
	{ f: 'Fe', q: 2, nome: 'ferro(II)' },
	{ f: 'Fe', q: 3, nome: 'ferro(III)' },
	{ f: 'Al', q: 3, nome: 'alluminio' },
];
const ANIONS: Ion[] = [
	{ f: 'F', q: 1, nome: 'fluoruro' },
	{ f: 'Cl', q: 1, nome: 'cloruro' },
	{ f: 'Br', q: 1, nome: 'bromuro' },
	{ f: 'OH', q: 1, nome: 'idrossido', poly: true },
	{ f: 'NO3', q: 1, nome: 'nitrato', poly: true },
	{ f: 'O', q: 2, nome: 'ossido' },
	{ f: 'S', q: 2, nome: 'solfuro' },
	{ f: 'SO4', q: 2, nome: 'solfato', poly: true },
	{ f: 'CO3', q: 2, nome: 'carbonato', poly: true },
	{ f: 'N', q: 3, nome: 'nitruro' },
	{ f: 'PO4', q: 3, nome: 'fosfato', poly: true },
];
/** Pairs that are not real compounds, or not first-year ones. */
function allowed(c: Ion, a: Ion) {
	if (c.f === 'NH4' && ['OH', 'O', 'N', 'F'].includes(a.f)) return false;
	if (a.f === 'N' && !['Mg', 'Ca', 'Al'].includes(c.f)) return false;
	if (a.f === 'CO3' && c.q === 3) return false;
	if (a.f === 'S' && c.q === 3) return false;
	return true;
}
/** The formula of x cations and y anions, brackets around a polyatomic ion with an index. */
function compound(c: Ion, a: Ion, x: number, y: number, brackets = true) {
	const part = (i: Ion, n: number) => (n === 1 ? i.f : i.poly && brackets ? `(${i.f})${n}` : `${i.f}${n}`);
	return part(c, x) + part(a, y);
}

function level6(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(CATIONS), a = rng.pick(ANIONS);
		if (!allowed(c, a)) continue;
		const l = (c.q * a.q) / gcd(c.q, a.q);
		const x = l / c.q, y = l / a.q;
		const right = compound(c, a, x, y);
		const cands = [
			compound(c, a, y, x), // indices swapped (charges copied, not crossed)
			compound(c, a, 1, 1), // one of each
			compound(c, a, x, y, false), // brackets left out
			compound(c, a, a.q, c.q), // crossed without simplifying
			compound(c, a, x, y + 1),
			compound(c, a, x + 1, y),
		];
		const key = (f: string) => JSON.stringify(Object.entries(atomsOf(f)).sort());
		// a distractor with the same atoms as the answer would be right too: dropped
		const mistakes = cands.filter((f) => key(f) !== key(right));
		const cation = `${c.f}^${c.q === 1 ? '' : c.q}+`, anion = `${a.f}^${a.q === 1 ? '' : a.q}-`;
		const cTex = pf(cation), aTex = pf(anion);
		return {
			prompt: 'Scegli la formula.',
			problem: textBlock(`Qual è la formula del composto formato dagli ioni ${cTex} e ${aTex} (${a.nome} di ${c.nome})?`),
			solution: fx(right),
			steps: [
				t(`Le cariche positive devono compensare quelle negative: servono ${x} ${x === 1 ? 'ione' : 'ioni'} ${c.nome} e ${y} ${y === 1 ? 'ione' : 'ioni'} ${a.nome}.`),
				`${x} \\cdot (+${c.q}) + ${y} \\cdot (-${a.q}) = 0`,
				...(right.includes('(') ? [t("Lo ione poliatomico con un indice va tra parentesi.")] : []),
			],
			answer: choose(rng, formulaOpt(right), mistakes.map(formulaOpt)),
			params: { case: a.poly || c.poly ? 'poliatomico' : 'monoatomico', cation, anion },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimFormulaChimica: Generator = {
	id: ID,
	title: 'La formula chimica e il suo significato',
	levels: {
		1: { label: 'Leggere gli indici', constraints: ['formule senza parentesi', 'molecole e unità formula'] },
		2: { label: 'Tutti gli atomi', constraints: ["almeno un indice 1 non scritto"] },
		3: { label: 'Il coefficiente', constraints: ['coefficiente da 2 a 5'] },
		4: { label: 'Le parentesi', constraints: ["l'elemento dentro la parentesi, o tutti gli atomi"] },
		5: { label: 'Gli idrati', constraints: ["ossigeno, idrogeno o tutti gli atomi"] },
		6: { label: 'La formula dagli ioni', constraints: ['ioni del biennio, composti che esistono'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimFormulaChimica;
