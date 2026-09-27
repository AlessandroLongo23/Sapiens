import { fail, type Outcome, type ResultRow, type Step } from './types';
import {
	findUnit,
	fmt,
	grouped,
	howTex,
	q,
	readDatum,
	rel,
	safely,
	solveProduct,
	unit,
	unitsStep,
	vu,
	vuText,
	type Datum,
	type ProductSpec,
	type Quantity,
	type Tagged,
	type Unit,
	type Val,
	Q
} from './grandezze';

/**
 * Chemistry of the first two years: the molar mass of a formula (brackets and hydrates), grams to moles and particles,
 * molarity and dilution. Molar masses are exact sums of atomic masses with two decimals, so M(H₂O) = 18,02 g/mol as
 * in the books and in the Sapiens lesson on the mole.
 */

// ---------------------------------------------------------------------------------------------------------------
// The elements.

/**
 * Standard atomic weights, IUPAC CIAAW 2021 (Prohaska et al., Pure Appl. Chem. 94, 2022), rounded to two decimals as
 * in the Italian school books. Where IUPAC gives an interval, the conventional value: H 1,01, C 12,01, N 14,01,
 * O 16,00, Cl 35,45. Sulphur is 32,07 as in the books and the Sapiens lesson (IUPAC: 32,06). Elements with no stable
 * isotope have the mass number of their longest-lived isotope, in square brackets in the tables.
 */
const ELEMENT_DATA = `H Idrogeno 1.01|He Elio 4.00|Li Litio 6.94|Be Berillio 9.01|B Boro 10.81|C Carbonio 12.01|N Azoto 14.01|O Ossigeno 16.00|F Fluoro 19.00|Ne Neon 20.18|Na Sodio 22.99|Mg Magnesio 24.31|Al Alluminio 26.98|Si Silicio 28.09|P Fosforo 30.97|S Zolfo 32.07|Cl Cloro 35.45|Ar Argon 39.95|K Potassio 39.10|Ca Calcio 40.08|Sc Scandio 44.96|Ti Titanio 47.87|V Vanadio 50.94|Cr Cromo 52.00|Mn Manganese 54.94|Fe Ferro 55.85|Co Cobalto 58.93|Ni Nichel 58.69|Cu Rame 63.55|Zn Zinco 65.38|Ga Gallio 69.72|Ge Germanio 72.63|As Arsenico 74.92|Se Selenio 78.97|Br Bromo 79.90|Kr Kripton 83.80|Rb Rubidio 85.47|Sr Stronzio 87.62|Y Ittrio 88.91|Zr Zirconio 91.22|Nb Niobio 92.91|Mo Molibdeno 95.95|Tc Tecnezio [98]|Ru Rutenio 101.07|Rh Rodio 102.91|Pd Palladio 106.42|Ag Argento 107.87|Cd Cadmio 112.41|In Indio 114.82|Sn Stagno 118.71|Sb Antimonio 121.76|Te Tellurio 127.60|I Iodio 126.90|Xe Xeno 131.29|Cs Cesio 132.91|Ba Bario 137.33|La Lantanio 138.91|Ce Cerio 140.12|Pr Praseodimio 140.91|Nd Neodimio 144.24|Pm Promezio [145]|Sm Samario 150.36|Eu Europio 151.96|Gd Gadolinio 157.25|Tb Terbio 158.93|Dy Disprosio 162.50|Ho Olmio 164.93|Er Erbio 167.26|Tm Tulio 168.93|Yb Itterbio 173.05|Lu Lutezio 174.97|Hf Afnio 178.49|Ta Tantalio 180.95|W Tungsteno 183.84|Re Renio 186.21|Os Osmio 190.23|Ir Iridio 192.22|Pt Platino 195.08|Au Oro 196.97|Hg Mercurio 200.59|Tl Tallio 204.38|Pb Piombo 207.20|Bi Bismuto 208.98|Po Polonio [209]|At Astato [210]|Rn Radon [222]|Fr Francio [223]|Ra Radio [226]|Ac Attinio [227]|Th Torio 232.04|Pa Protoattinio 231.04|U Uranio 238.03|Np Nettunio [237]|Pu Plutonio [244]|Am Americio [243]|Cm Curio [247]|Bk Berkelio [247]|Cf Californio [251]|Es Einsteinio [252]|Fm Fermio [257]|Md Mendelevio [258]|No Nobelio [259]|Lr Laurenzio [266]|Rf Rutherfordio [267]|Db Dubnio [268]|Sg Seaborgio [269]|Bh Bohrio [270]|Hs Hassio [269]|Mt Meitnerio [278]|Ds Darmstadtio [281]|Rg Roentgenio [282]|Cn Copernicio [285]|Nh Nihonio [286]|Fl Flerovio [289]|Mc Moscovio [290]|Lv Livermorio [293]|Ts Tennesso [294]|Og Oganesson [294]`;

export interface Element {
	z: number;
	symbol: string;
	name: string;
	/** In hundredths of u: 1,01 is 101. */
	mass: Q;
	/** True for the mass number of an element with no stable isotope. */
	radioactive: boolean;
}

export const ELEMENTS: Element[] = ELEMENT_DATA.split('|').map((entry, i) => {
	const [symbol, name, m] = entry.split(' ');
	const radioactive = m.startsWith('[');
	const value = radioactive ? q(Number(m.slice(1, -1))) : q(Math.round(Number(m) * 100), 100);
	return { z: i + 1, symbol, name, mass: value, radioactive };
});

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));

// ---------------------------------------------------------------------------------------------------------------
// Reading a formula.

type Node = { kind: 'el'; el: Element; count: number } | { kind: 'group'; open: string; items: Node[]; count: number };

export interface Formula {
	/** The parts of a hydrate, with their coefficient: CuSO4·5H2O is [1, CuSO4] and [5, H2O]. */
	parts: { coef: number; items: Node[] }[];
	/** Atoms of each element, in the order they first appear. */
	atoms: [Element, number][];
	tex: string;
	text: string;
	hasGroups: boolean;
}

const MAX_COUNT = 999;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const subText = (n: number) => (n === 1 ? '' : String(n).replace(/\d/g, (d) => SUB[Number(d)]));

/** Reads a chemical formula: "H2O", "Ca(OH)2", "CuSO4·5H2O", "[Cu(NH3)4]SO4". An error sentence when it is not one. */
export function parseFormula(input: string): Formula | string {
	const s = input.trim().replace(/\s+/g, '').replace(/[₀-₉]/g, (c) => String(SUB.indexOf(c)));
	const example = 'Scrivi una formula chimica, per esempio H2O oppure Ca(OH)2.';
	if (!s) return example;
	if (s.length > 60) return 'La formula è troppo lunga: al massimo 60 caratteri.';
	if (/[+^]|-/.test(s)) return 'Scrivi la formula senza cariche: per esempio SO4 al posto di SO4^2-.';
	if (!/[A-Z]/.test(s)) return 'I simboli degli elementi cominciano con la maiuscola: scrivi per esempio H2O oppure NaCl.';
	let i = 0;
	const readInt = (): number | null => {
		const m = /^\d+/.exec(s.slice(i));
		if (!m) return null;
		i += m[0].length;
		return Number(m[0]);
	};
	const CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
	let hasGroups = false;
	const readItems = (close: string | null): Node[] | string => {
		const items: Node[] = [];
		while (i < s.length) {
			const c = s[i];
			if (close && c === close) return items;
			if (c in CLOSE) {
				i++;
				hasGroups = true;
				const inner = readItems(CLOSE[c]);
				if (typeof inner === 'string') return inner;
				if (s[i] !== CLOSE[c]) return `Manca la parentesi chiusa "${CLOSE[c]}".`;
				i++;
				if (!inner.length) return 'Una parentesi è vuota: scrivi gli atomi dentro, per esempio (OH)2.';
				const n = readInt() ?? 1;
				if (n === 0 || n > MAX_COUNT) return 'Il numero dopo una parentesi deve essere tra 1 e 999.';
				items.push({ kind: 'group', open: c, items: inner, count: n });
				continue;
			}
			if (/[A-Z]/.test(c)) {
				const m = /^[A-Z][a-z]?/.exec(s.slice(i))!;
				let sym = m[0];
				// "Co" is cobalt, but "CO" is carbon and oxygen: a lower-case letter belongs to the symbol only if it exists.
				if (sym.length === 2 && !BY_SYMBOL.has(sym)) sym = sym[0];
				const el = BY_SYMBOL.get(sym);
				if (!el) return `Non esiste un elemento con simbolo ${m[0]}. Controlla maiuscole e minuscole: Co è il cobalto, CO sono carbonio e ossigeno.`;
				i += sym.length;
				const n = readInt() ?? 1;
				if (n === 0 || n > MAX_COUNT) return 'Il numero di atomi deve essere tra 1 e 999.';
				items.push({ kind: 'el', el, count: n });
				continue;
			}
			if (/[a-z]/.test(c)) return `Dopo ${s.slice(0, i) || 'l’inizio'} c’è una lettera minuscola che non forma un simbolo: controlla maiuscole e minuscole.`;
			if (/\d/.test(c)) return 'Un numero va dopo il simbolo a cui si riferisce: H2O, non 2HO. Il coefficiente si scrive solo nell’idrato, dopo il punto.';
			if (/[)\]}]/.test(c)) return `C’è una parentesi chiusa "${c}" senza quella aperta.`;
			if (/[·.*•∙]/.test(c)) return items;
			return `Il carattere "${c}" non si usa nelle formule. Scrivi per esempio CuSO4·5H2O.`;
		}
		if (close) return `Manca la parentesi chiusa "${close}".`;
		return items;
	};

	const parts: Formula['parts'] = [];
	while (i <= s.length) {
		let coef = 1;
		if (parts.length) {
			coef = readInt() ?? 1;
			if (coef === 0 || coef > MAX_COUNT) return 'Il coefficiente dell’idrato deve essere tra 1 e 999, per esempio CuSO4·5H2O.';
		}
		const items = readItems(null);
		if (typeof items === 'string') return items;
		if (!items.length) return parts.length ? 'Dopo il punto dell’idrato scrivi la molecola, per esempio ·5H2O.' : example;
		parts.push({ coef, items });
		if (i >= s.length) break;
		i++; // the hydrate dot
		if (parts.length > 4) return 'Troppe parti separate dal punto: scrivi al massimo un sale e le sue molecole d’acqua.';
		if (i >= s.length) return 'Dopo il punto dell’idrato scrivi la molecola, per esempio ·5H2O.';
	}

	const atoms = new Map<Element, number>();
	const count = (nodes: Node[], k: number) => {
		for (const n of nodes) {
			if (n.kind === 'el') atoms.set(n.el, (atoms.get(n.el) ?? 0) + n.count * k);
			else count(n.items, k * n.count);
		}
	};
	for (const p of parts) count(p.items, p.coef);
	const total = [...atoms.values()].reduce((a, b) => a + b, 0);
	if (total > 100_000) return 'La formula ha troppi atomi per questo strumento.';

	const CLOSE_TEX: Record<string, [string, string]> = { '(': ['(', ')'], '[': ['[', ']'], '{': ['\\{', '\\}'] };
	const nodeTex = (nodes: Node[]): string =>
		nodes
			.map((n) => {
				const sub = n.count === 1 ? '' : `_{${n.count}}`;
				if (n.kind === 'el') return `${n.el.symbol}${sub}`;
				const [o, c] = CLOSE_TEX[n.open];
				return `${o}${nodeTex(n.items)}${c}${sub}`;
			})
			.join('');
	const nodeText = (nodes: Node[]): string =>
		nodes
			.map((n) => {
				if (n.kind === 'el') return `${n.el.symbol}${subText(n.count)}`;
				return `${n.open}${nodeText(n.items)}${CLOSE[n.open]}${subText(n.count)}`;
			})
			.join('');
	const tex = parts.map((p) => `${p.coef === 1 ? '' : p.coef}${nodeTex(p.items)}`).join(' \\cdot ');
	const text = parts.map((p) => `${p.coef === 1 ? '' : p.coef}${nodeText(p.items)}`).join('·');
	return { parts, atoms: [...atoms.entries()], tex: `\\mathrm{${tex}}`, text, hasGroups };
}

// ---------------------------------------------------------------------------------------------------------------
// Molar mass.


/** An atomic mass as the tables print it: "1,01", "[98]". */
const massTex = (e: Element) => (e.radioactive ? `[${e.mass.n}]` : fmtMass(e.mass));
/** Masses keep their two decimals, as in the tables: 16,00. */
function fmtMass(x: Q): string {
	const cents = x.mul(q(100));
	if (cents.d !== 1n) return fmt(x).tex;
	const s = (cents.n < 0n ? -cents.n : cents.n).toString().padStart(3, '0');
	const int = s.slice(0, -2);
	const body = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : int;
	return `${cents.n < 0n ? '-' : ''}${body}{,}${s.slice(-2)}`;
}
const fmtMassText = (x: Q) => fmtMass(x).replace('{,}', ',').replace(/\\,/g, ' ');

export interface MolarMass {
	formula: Formula;
	M: Q;
	steps: Step[];
}

/** The molar mass and its steps: count the atoms, multiply by the atomic masses, add up. */
export function molarMass(input: string): MolarMass | string {
	const f = parseFormula(input);
	if (typeof f === 'string') return f;
	const M = f.atoms.reduce((acc, [e, n]) => acc.add(e.mass.mul(q(n))), q(0));
	const steps: Step[] = [];
	const notes: string[] = [];
	if (f.hasGroups) notes.push('Il numero dopo una parentesi moltiplica tutti gli atomi dentro la parentesi.');
	if (f.parts.length > 1) notes.push('Il numero dopo il punto moltiplica tutta la molecola che segue.');
	steps.push({
		say: 'Conta gli atomi di ogni elemento.',
		table: { head: ['Elemento', 'Simbolo', 'Atomi'], rows: f.atoms.map(([e, n]) => [e.name, `$\\mathrm{${e.symbol}}$`, `$${n}$`]) },
		then: notes.length ? notes.join(' ') : undefined
	});
	steps.push({
		say: 'Moltiplica gli atomi per la massa atomica di ogni elemento.',
		table: {
			head: ['Elemento', 'Atomi', 'Massa atomica', 'Contributo'],
			rows: f.atoms.map(([e, n]) => [`$\\mathrm{${e.symbol}}$`, `$${n}$`, `$${massTex(e)}$`, `$${n === 1 ? '' : `${n} \\cdot ${massTex(e)} = `}${fmtMass(e.mass.mul(q(n)))}$`])
		},
		then: f.atoms.some(([e]) => e.radioactive) ? 'Tra parentesi quadre c’è il numero di massa dell’isotopo più stabile: l’elemento non ha isotopi stabili.' : 'Le masse atomiche sono quelle della tavola periodica, con due decimali.'
	});
	const contributions = f.atoms.map(([e, n]) => fmtMass(e.mass.mul(q(n))));
	const lines = [`M(${f.tex}) = ${f.atoms.map(([e, n]) => (n === 1 ? massTex(e) : `${n} \\cdot ${massTex(e)}`)).join(' + ')}`];
	if (f.atoms.some(([, n]) => n > 1) && f.atoms.length > 1) lines.push(`= ${contributions.join(' + ')}`);
	lines.push(`= \\hl{${fmtMass(M)}\\ \\text{g/mol}}`);
	steps.push({ say: 'Somma i contributi.', math: lines, then: 'La massa molare si misura in grammi per mole.' });
	return { formula: f, M, steps };
}

export function massaMolare(input: string): Outcome {
	return safely(() => {
		const r = molarMass(input);
		if (typeof r === 'string') return fail(r);
		const { formula: f, M } = r;
		const one = f.parts.length === 1 && f.atoms.length === 1;
		return {
			ok: true,
			rows: [
				{ label: `Massa molare di ${f.text}`, value: `$${fmtMass(M)}\\ \\text{g/mol}$` },
				{ label: one && f.atoms[0][1] === 1 ? 'Massa atomica' : 'Massa molecolare (o massa formula)', value: `$${fmtMass(M)}\\ \\text{u}$` }
			],
			copy: `${fmtMassText(M)} g/mol`,
			steps: r.steps
		};
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Grams, moles and particles: n = m / M, N = n · N_A.

/** Avogadro's constant as the books round it: 6,022 · 10^23 per mole (exact SI value 6,022 140 76 · 10^23). */
export const AVOGADRO = q(6022n * 10n ** 20n);
const NA_TEX = '6{,}022 \\cdot 10^{23}\\ \\text{mol}^{-1}';

export const MASS_G: Quantity = {
	key: 'x',
	sym: 'm',
	name: 'massa',
	the: 'la massa',
	units: [unit('g', 'g', '\\text{g}'), unit('mg', 'mg', '\\text{mg}', q(1, 1000)), unit('kg', 'kg', '\\text{kg}', q(1000))],
	sign: 'pos',
	example: '36'
};
export const MOLES: Quantity = { key: 'x', sym: 'n', name: 'quantità di sostanza', the: 'il numero di moli', units: [unit('mol', 'mol', '\\text{mol}'), unit('mmol', 'mmol', '\\text{mmol}', q(1, 1000))], sign: 'pos', example: '2' };
export const PARTICLES: Quantity = { key: 'x', sym: 'N', name: 'numero di particelle', the: 'il numero di particelle', units: [unit('n', '', '')], sign: 'pos', example: '3,011e23' };

export type MoliMode = 'g' | 'mol' | 'N';
export const MOLI_GIVEN: Record<MoliMode, Quantity> = { g: MASS_G, mol: MOLES, N: PARTICLES };

const G_UNIT = MASS_G.units[0];
const MOL_UNIT = MOLES.units[0];

/** "molecole", "atomi" or "unità formula", for the particles of a formula. */
function particlesOf(f: Formula): string {
	if (f.parts.length === 1 && f.atoms.length === 1 && f.atoms[0][1] === 1) return 'atomi';
	return 'particelle';
}

export function moli(state: { f: string; da: string; x: string; u: string }): Outcome {
	return safely(() => {
		const mode: MoliMode = state.da === 'mol' || state.da === 'N' ? state.da : 'g';
		const mm = molarMass(state.f);
		if (typeof mm === 'string') return fail(mm);
		const given = MOLI_GIVEN[mode];
		const d = readDatum(given, state.x, state.u);
		if (typeof d === 'string') return fail(d);
		const { formula: f, M } = mm;
		const Mtex = `${fmtMass(M)}\\ \\text{g/mol}`;
		const who = particlesOf(f);

		const steps: Tagged[] = [];
		// The molar mass, in one step.
		const sum = `M = ${f.atoms.map(([e, n]) => (n === 1 ? massTex(e) : `${n} \\cdot ${massTex(e)}`)).join(' + ')}`;
		steps.push({
			say: `Conta gli atomi di $${f.tex}$ e cerca le masse atomiche.`,
			table: { head: ['Elemento', 'Atomi', 'Massa atomica'], rows: f.atoms.map(([e, n]) => [`$\\mathrm{${e.symbol}}$`, `$${n}$`, `$${massTex(e)}$`]) },
			part: 'La massa molare'
		});
		const single = f.atoms.length === 1 && f.atoms[0][1] === 1;
		steps.push({ say: 'Somma le masse per avere la massa molare.', math: single ? [`M = \\hl{${Mtex}}`] : [sum, `= \\hl{${Mtex}}`] });
		const conv = unitsStep([d], 'Porta il dato nell’unità della formula.');
		if (conv) steps.push(conv);

		let m: Val, n: Val, N: Val;
		const x = d.base;
		if (mode === 'g') {
			m = x;
			n = { q: m.q.div(M), approx: false };
			N = { q: n.q.mul(AVOGADRO), approx: false };
			steps.push({ say: 'Dividi la massa per la massa molare.', math: ['n = \\dfrac{m}{M}', `n = \\dfrac{${vu(m, G_UNIT)}}{${Mtex}}`, `${rel(n)} \\hl{${vu(n, MOL_UNIT)}}`], part: 'Le moli' });
			steps.push({ say: `Moltiplica le moli per la costante di Avogadro.`, math: ['N = n \\cdot N_A', `N ${rel(n)} ${vu(n, MOL_UNIT)} \\cdot ${NA_TEX}`, `${rel(N)} \\hl{${fmt(N).tex}}`], then: who === 'atomi' ? undefined : 'Le particelle sono molecole, atomi o ioni, secondo la sostanza.', part: 'Le particelle' });
		} else if (mode === 'mol') {
			n = x;
			m = { q: n.q.mul(M), approx: false };
			N = { q: n.q.mul(AVOGADRO), approx: false };
			steps.push({ say: 'Moltiplica le moli per la massa molare.', math: ['m = n \\cdot M', `m = ${vu(n, MOL_UNIT)} \\cdot ${Mtex}`, `${rel(m)} \\hl{${vu(m, G_UNIT)}}`], part: 'La massa' });
			steps.push({ say: `Moltiplica le moli per la costante di Avogadro.`, math: ['N = n \\cdot N_A', `N = ${vu(n, MOL_UNIT)} \\cdot ${NA_TEX}`, `${rel(N)} \\hl{${fmt(N).tex}}`], part: 'Le particelle' });
		} else {
			N = x;
			n = { q: N.q.div(AVOGADRO), approx: false };
			m = { q: n.q.mul(M), approx: false };
			steps.push({ say: 'Dividi le particelle per la costante di Avogadro.', math: ['n = \\dfrac{N}{N_A}', `n = \\dfrac{${fmt(N).tex}}{${NA_TEX}}`, `${rel(n)} \\hl{${vu(n, MOL_UNIT)}}`], part: 'Le moli' });
			steps.push({ say: 'Moltiplica le moli per la massa molare.', math: ['m = n \\cdot M', `m ${rel(n)} ${vu(n, MOL_UNIT)} \\cdot ${Mtex}`, `${rel(m)} \\hl{${vu(m, G_UNIT)}}`], part: 'La massa' });
		}
		const approx = (v: Val) => (fmt(v).exact ? '' : '\\approx ');
		const rowM: ResultRow = { label: `Massa di ${f.text}`, value: `$${approx(m)}${vu(m, G_UNIT)}$` };
		const rowN: ResultRow = { label: 'Moli', value: `$${approx(n)}${vu(n, MOL_UNIT)}$` };
		const rowP: ResultRow = { label: `Numero di ${who}`, value: `$${approx(N)}${fmt(N).tex}$` };
		const rowMM: ResultRow = { label: 'Massa molare', value: `$${Mtex}$` };
		const rows = mode === 'g' ? [rowN, rowP, rowMM] : mode === 'mol' ? [rowM, rowP, rowMM] : [rowN, rowM, rowMM];
		const copy = mode === 'g' ? vuText(n, MOL_UNIT) : mode === 'mol' ? vuText(m, G_UNIT) : vuText(n, MOL_UNIT);
		return { ok: true, rows, copy, steps: grouped(steps) };
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Molarity: M = n / V.

const LITRE = unit('L', 'L', '\\text{L}');
const ML = unit('mL', 'mL', '\\text{mL}', q(1, 1000));
const MOLL = unit('M', 'mol/L', '\\text{mol/L}');
const MMOLL = unit('mM', 'mmol/L', '\\text{mmol/L}', q(1, 1000));

export const MOLARITA: ProductSpec = {
	p: { key: 'n', sym: 'n', name: 'moli di soluto', the: 'il numero di moli', units: [unit('mol', 'mol', '\\text{mol}'), unit('mmol', 'mmol', '\\text{mmol}', q(1, 1000))], sign: 'pos', example: '0,5' },
	a: { key: 'M', sym: 'M', name: 'molarità', the: 'la molarità', units: [MOLL, MMOLL], sign: 'pos', example: '0,2' },
	b: { key: 'V', sym: 'V', name: 'volume della soluzione', the: 'il volume della soluzione', units: [LITRE, ML], sign: 'pos', example: '250' },
	main: 'a'
};

export const molarita = (state: Record<string, string>): Outcome => safely(() => solveProduct(MOLARITA, state.trova, state).outcome);

// ---------------------------------------------------------------------------------------------------------------
// Dilution: M1 · V1 = M2 · V2.

const conc = (i: 1 | 2): Quantity => ({ key: `M${i}`, sym: `M_${i}`, name: i === 1 ? 'molarità iniziale' : 'molarità finale', the: i === 1 ? 'la molarità iniziale' : 'la molarità finale', units: [MOLL, MMOLL], sign: 'pos', example: i === 1 ? '2' : '0,5' });
const vol = (i: 1 | 2): Quantity => ({ key: `V${i}`, sym: `V_${i}`, name: i === 1 ? 'volume iniziale' : 'volume finale', the: i === 1 ? 'il volume iniziale' : 'il volume finale', units: [LITRE, ML], sign: 'pos', example: i === 1 ? '50' : '200' });
export const DILUIZIONE: Quantity[] = [conc(1), vol(1), conc(2), vol(2)];

export function diluizione(state: Record<string, string>): Outcome {
	return safely(() => {
		const unknown = DILUIZIONE.find((x) => x.key === state.trova) ?? DILUIZIONE[3];
		const known = DILUIZIONE.filter((x) => x !== unknown);
		const read: Record<string, Datum> = {};
		for (const qt of known) {
			const d = readDatum(qt, state[qt.key], state[`u${qt.key}`]);
			if (typeof d === 'string') return fail(d);
			read[qt.key] = d;
		}
		// The equation holds in any unit, as long as the two sides use the same: keep the student's units when they
		// already match (mL and mL), else work in mol/L and L.
		const volumes = DILUIZIONE.filter((x) => x.key.startsWith('V'));
		const concs = DILUIZIONE.filter((x) => x.key.startsWith('M'));
		const unitsOf = (qts: Quantity[]) => qts.map((x) => (x === unknown ? findUnit(x, state[`u${x.key}`]) : read[x.key].unit));
		const same = (us: Unit[]) => us.every((u) => u.id === us[0].id);
		const vUnit = same(unitsOf(volumes)) ? unitsOf(volumes)[0] : LITRE;
		const cUnit = same(unitsOf(concs)) ? unitsOf(concs)[0] : MOLL;
		const workIn = (qt: Quantity) => (qt.key.startsWith('V') ? vUnit : cUnit);
		const val = (k: string): Val => {
			const d = read[k];
			const u = workIn(d.qt);
			return { q: d.raw.mul(d.unit.factor).div(u.factor), approx: false };
		};
		const moved = known.filter((x) => read[x.key].unit.id !== workIn(x).id);

		const steps: Tagged[] = [];
		const hl = (k: string) => (k === unknown.key ? `\\hl{${DILUIZIONE.find((x) => x.key === k)!.sym}}` : DILUIZIONE.find((x) => x.key === k)!.sym);
		steps.push({
			say: 'Scrivi la formula della diluizione.',
			math: [`${hl('M1')} \\cdot ${hl('V1')} = ${hl('M2')} \\cdot ${hl('V2')}`],
			table: { head: ['Simbolo', 'Grandezza', 'Unità'], rows: DILUIZIONE.map((x) => [`$${x.sym}$`, x.name, `$${workIn(x).tex}$`]) },
			then: 'Le moli di soluto non cambiano: aggiungi solo acqua.',
			part: 'La formula'
		});
		const sym = (qt: Quantity) => qt.sym;
		const idx = DILUIZIONE.indexOf(unknown);
		const partner = DILUIZIONE[idx % 2 === 0 ? idx + 1 : idx - 1];
		const [o1, o2] = DILUIZIONE.filter((x) => x !== unknown && x !== partner);
		steps.push({ say: `Ricava ${unknown.the}.`, math: [`\\hl{${sym(unknown)}} = \\dfrac{${sym(o1)} \\cdot ${sym(o2)}}{${sym(partner)}}`], then: `Dividi i due membri per $${sym(partner)}$.` });
		if (moved.length) {
			steps.push({
				say: 'Porta i dati nelle stesse unità.',
				table: {
					head: ['Grandezza', 'Dato', 'Come', 'Nella formula'],
					rows: moved.map((x) => {
						const d = read[x.key];
						const f = d.unit.factor.div(workIn(x).factor);
						return [`$${x.sym}$`, `$${vu(d.raw, d.unit)}$`, `$${howTex(f)}$`, `$${vu(val(x.key), workIn(x))}$`];
					})
				},
				part: 'I dati'
			});
		}
		const top = val(o1.key).q.mul(val(o2.key).q);
		const result: Val = { q: top.div(val(partner.key).q), approx: false };
		const ru = workIn(unknown);
		steps.push({
			say: 'Sostituisci i valori, con le loro unità.',
			math: [`${sym(unknown)} = \\dfrac{${vu(val(o1.key), workIn(o1))} \\cdot ${vu(val(o2.key), workIn(o2))}}{${vu(val(partner.key), workIn(partner))}}`, `${rel(result)} \\hl{${vu(result, ru)}}`],
			part: 'Il calcolo'
		});
		// The result in the unit the student chose, when it is another.
		const target = findUnit(unknown, state[`u${unknown.key}`]);
		let final = result;
		let finalUnit = ru;
		if (target.id !== ru.id) {
			const f = ru.factor.div(target.factor);
			final = { q: result.q.mul(f), approx: false };
			finalUnit = target;
			steps.push({ say: `Scrivi il risultato in ${target.label}.`, math: [`${sym(unknown)} ${rel(result)} ${vu(result, ru)}`, `= ${fmt(result).tex} ${howTex(f)}\\ ${target.tex}`, `${rel(final)} \\hl{${vu(final, target)}}`], part: 'Il risultato' });
		}
		const approx = (v: Val) => (fmt(v).exact ? '' : '\\approx ');
		const rows: ResultRow[] = [{ label: unknown.name.charAt(0).toUpperCase() + unknown.name.slice(1), value: `$${approx(final)}${vu(final, finalUnit)}$` }];

		// Volumes in litres, to say how much water to add.
		const litres = (k: string): Q => (k === unknown.key ? final.q.mul(finalUnit.factor) : read[k].raw.mul(read[k].unit.factor));
		const c = litres;
		const V1 = litres('V1');
		const V2 = litres('V2');
		const water = V2.sub(V1);
		const wUnit = vUnit;
		const w: Val = { q: water.div(wUnit.factor), approx: false };
		if (c('M2').cmp(c('M1')) > 0) {
			steps[steps.length - 1] = { ...steps[steps.length - 1], then: 'La molarità finale è maggiore di quella iniziale: è una concentrazione, non una diluizione.' };
		} else if (water.sign() > 0) {
			steps.push({ say: 'Calcola l’acqua da aggiungere.', math: [`V_2 - V_1 = ${vu({ q: V2.div(wUnit.factor), approx: false }, wUnit)} - ${vu({ q: V1.div(wUnit.factor), approx: false }, wUnit)}`, `${rel(w)} \\hl{${vu(w, wUnit)}}`], part: 'L’acqua' });
			rows.push({ label: 'Acqua da aggiungere', value: `$${approx(w)}${vu(w, wUnit)}$` });
		}
		return { ok: true, rows, copy: vuText(final, finalUnit), steps: grouped(steps) };
	});
}
