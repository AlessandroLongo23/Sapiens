/**
 * Ossidi basici e ossidi acidi. Spec: specs/exercises/chim-ossidi.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/77-chim-ossidi.md), each one step harder: the kind of
 * oxide from the formula; the oxides of metals, from the formula to the name and back; the anhydrides, both ways; the
 * peroxides and the oxides the two rules do not cover. Names in the three nomenclatures, from v2/chim3-i.ts. Every
 * answer is a multiple choice: names and formulas are not typed.
 */
import type { ChoiceOption, Generator, Rng } from '../types';
import {
	type Built, type Compound, type Metal, type NonMetal, type Nomenclatura, METALS, NON_METALS, PEROXIDES, PREFIX, ROMAN,
	anhydride, basicOxide, cap, checkSample, choose, del, formulaQuestion, gcd, generateWith, il, nameQuestion, signed, species, texOpt, textBlock, textOpt, threeNames, toChoice, wrongFormula,
} from '../chim3-i';

export const ID = 'chim-ossidi';

const shuffled = <T,>(rng: Rng, xs: readonly T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
const atoms = (k: number, nome: string) => (k === 1 ? `un atomo di ${nome}` : `$${k}$ atomi di ${nome}`);
const texOf = (key: string) => species(key).tex;

/** The oxidation number of the element of an oxide, as a sentence with its sum. */
function oxSentence(c: Compound): string {
	const [a, b] = c.count;
	return `Numero di ossidazione ${a === 1 ? del(c.nome) : `di ogni atomo di ${c.nome}`}: $${a === 1 ? '' : a}x + ${b === 1 ? '' : `${b} \\cdot `}(-2) = 0$, quindi $x = ${signed(c.no)}$.`;
}

/** Why the element takes that suffix, or none. */
function suffixSentence(el: Metal | NonMetal, n: number, female: boolean): string {
	const nome = cap(il(el.nome));
	const [o, i] = female ? ['-osa', '-ica'] : ['-oso', '-ico'];
	if ('halogen' in el && el.halogen) return `Per gli alogeni i nomi seguono il numero di ossidazione: $+1$ ipo- e -osa, $+3$ -osa, $+5$ -ica, $+7$ per- e -ica.`;
	if (el.ox.length === 1) return female ? `${nome} forma una sola anidride: il suffisso è -ica.` : `${nome} ha un solo numero di ossidazione: il nome non ha suffissi.`;
	return `${nome} ha ${el.ox.map((k) => `$${signed(k)}$`).join(' e ')}: $${signed(n)}$ è il più ${n === el.ox[0] ? `basso, e il suffisso è ${o}` : `alto, e il suffisso è ${i}`}.`;
}

/** The IUPAC name of an oxide with i atoms of the element and j of oxygen (right or wrong). */
const iupacOxide = (nome: string, i: number, j: number, mono: boolean) => `${j === 1 ? (mono && i === 1 ? 'mon' : '') : PREFIX[j]}ossido di ${PREFIX[i]}${nome}`;

/** Wrong IUPAC names: the prefixes turned round, one dropped, one more atom. */
function wrongIupac(c: Compound, mono: boolean): string[] {
	const [a, b] = c.count;
	const pairs: [number, number][] = [[b, a], [1, b], [a, 1], [a, c.no], [a + 1, b], [a, b + 1], [2, 2], [1, 2], [2, 1]];
	return pairs.filter(([i, j]) => (i !== a || j !== b) && i >= 1 && i <= 7 && j >= 1 && j <= 7).map(([i, j]) => iupacOxide(c.nome, i, j, mono));
}

/** Wrong Stock names: the other oxidation numbers, then the subscripts read as the number. */
function wrongStock(c: Compound, ox: number[]): string[] {
	const [a, b] = c.count;
	const ns = [...ox.filter((k) => k !== c.no), a, b, a * b, c.no + 1, c.no - 1, c.no + 2, c.no + 3, 4, 6].filter((k) => k >= 1 && k <= 7 && k !== c.no);
	return [...new Set(ns)].map((k) => `ossido di ${c.nome}(${ROMAN[k]})`);
}

/** Wrong formulas of an oxide: the other oxides of the element, not reduced, turned round, the number kept on its element. */
function wrongOxides(c: Compound, others: Compound[]): [string, string][] {
	const [a, b] = c.count;
	const g = gcd(c.no, 2);
	const f = (i: number, j: number) => wrongFormula(c.sym, i, 'O', j);
	return [...others.filter((o) => o.key !== c.key).map((o) => wrongFormula(o.sym, o.count[0], 'O', o.count[1])), ...(g > 1 ? [f(2, c.no)] : []), ...(a !== b ? [f(b, a)] : []), f(c.no, 2), f(1, 1), f(2, 1), f(1, 2), f(2, 3), f(1, 3)];
}

/** How a name leads to the formula. */
function fromNameSteps(c: Compound, which: Nomenclatura, el: Metal | NonMetal, female: boolean): string[] {
	const [a, b] = c.count;
	if (which === 'iupac') return [`Nel nome IUPAC i prefissi dicono gli indici: ${atoms(a, c.nome)} e ${atoms(b, 'ossigeno')}.`];
	const first = which === 'stock' ? (c.stock.includes('(') ? `Il numero romano dice il numero di ossidazione ${del(c.nome)}: $${signed(c.no)}$.` : `${cap(il(c.nome))} ha un solo numero di ossidazione, $${signed(c.no)}$.`) : `${suffixSentence(el, c.no, female)} Il numero di ossidazione è $${signed(c.no)}$.`;
	const g = gcd(c.no, 2);
	const raw = `\\mathrm{${wrongFormula(c.sym, 2, 'O', c.no)[0]}}`;
	return [first, g > 1 ? `Incrocio con l'ossigeno a $-2$: $${raw}$, e gli indici si dividono per $${g}$: $${c.tex}$.` : `Incrocio con l'ossigeno a $-2$: $${c.tex}$.`];
}

// ---------------------------------------------------------------------------
// Level 1: the kind of oxide

const KINDS: [string, string][] = [['Ossido basico', 'basico'], ['Ossido acido (anidride)', 'acido'], ['Perossido', 'perossido'], ['Non è un ossido', 'nessuno']];
/** Formulas that are not oxides, with the reason. */
export const NOT_OXIDES: [string, string][] = [
	['OF2', "L'ossigeno è legato al fluoro, più elettronegativo di lui, e ha numero di ossidazione $+2$: in un ossido ha $-2$."],
	['NaOH', 'Gli elementi sono tre: è un composto ternario, e un ossido è binario.'],
	['Ca(OH)2', 'Gli elementi sono tre: è un composto ternario, e un ossido è binario.'],
	['H2SO4', 'Gli elementi sono tre: è un composto ternario, e un ossido è binario.'],
	['HNO3', 'Gli elementi sono tre: è un composto ternario, e un ossido è binario.'],
	['CaCO3', 'Gli elementi sono tre: è un composto ternario, e un ossido è binario.'],
	['HCl', 'Non contiene ossigeno.'],
	['NaCl', 'Non contiene ossigeno.'],
	['H2S', 'Non contiene ossigeno.'],
	['NH3', 'Non contiene ossigeno.'],
	['CaH2', 'Non contiene ossigeno.'],
	['FeCl3', 'Non contiene ossigeno.'],
];
/** Aluminium and zinc are left out of level 1: their oxides are amphoteric. */
const PLAIN_METALS = METALS.filter((m) => m.sym !== 'Al' && m.sym !== 'Zn');

function level1(rng: Rng): Built {
	const r = rng.next();
	let key: string;
	let value: string;
	let why: string;
	if (r < 0.3) {
		const m = rng.pick(PLAIN_METALS);
		const c = basicOxide(m, rng.pick(m.ox));
		[key, value, why] = [c.key, 'basico', `${cap(il(m.nome))} è un metallo, e l'ossigeno ha $-2$: è un ossido basico.`];
	} else if (r < 0.6) {
		const x = rng.pick(NON_METALS);
		const c = anhydride(x, rng.pick(x.ox));
		[key, value, why] = [c.key, 'acido', `${cap(il(x.nome))} è un non metallo, e l'ossigeno ha $-2$: è un ossido acido, cioè un'anidride.`];
	} else if (r < 0.8) {
		const p = rng.pick(PEROXIDES);
		[key, value, why] = [p.key, 'perossido', `${cap(il(p.nome))} ha sempre $${signed(p.no)}$: perché la somma faccia zero, l'ossigeno deve avere $-1$. È un perossido.`];
	} else {
		const [k, reason] = rng.pick(NOT_OXIDES);
		[key, value, why] = [k, 'nessuno', reason];
	}
	const right = KINDS.find((k) => k[1] === value)!;
	return {
		prompt: 'Riconosci il tipo di composto.',
		problem: textBlock(`Che tipo di composto è $${texOf(key)}$?`),
		solution: `\\text{${right[0]}}`,
		steps: [textBlock(why)],
		answer: choose(rng, textOpt(right[0], right[1]), KINDS.filter((k) => k[1] !== value).map(([l, v]) => textOpt(l, v))),
		params: { case: value, key },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: the oxides of metals

/** The nomenclatures worth asking for a compound: not the IUPAC name when it is the traditional one again. */
function askable(c: Compound, many: boolean): Nomenclatura[] {
	if (many) return ['trad', 'stock', 'iupac'];
	return c.iupac === c.trad ? ['trad'] : ['trad', 'iupac'];
}

function wrongTradMetal(m: Metal, n: number): string[] {
	if (m.ox.length === 1) return [`perossido di ${m.nome}`, `idrossido di ${m.nome}`, `idruro di ${m.nome}`, `anidride di ${m.nome}`];
	const [mine, other] = n === m.ox[0] ? ['oso', 'ico'] : ['ico', 'oso'];
	return [`ossido ${m.root}${other}`, `anidride ${m.root}${mine.replace(/o$/, 'a')}`, `idrossido ${m.root}${mine}`, `perossido di ${m.nome}`];
}

function level2(rng: Rng): Built {
	const m = rng.pick(METALS);
	const n = rng.pick(m.ox);
	const c = basicOxide(m, n);
	const many = m.ox.length > 1;
	const which = rng.pick(askable(c, many));
	const wrong = which === 'trad' ? wrongTradMetal(m, n) : which === 'stock' ? wrongStock(c, m.ox) : wrongIupac(c, many);
	return nameQuestion(rng, c, which, wrong, [oxSentence(c), suffixSentence(m, n, false), threeNames(c)], which);
}

function level3(rng: Rng): Built {
	const m = rng.pick(METALS);
	const n = rng.pick(m.ox);
	const c = basicOxide(m, n);
	const which = rng.pick(askable(c, m.ox.length > 1));
	return formulaQuestion(rng, c, which, wrongOxides(c, m.ox.map((k) => basicOxide(m, k))), fromNameSteps(c, which, m, false), which);
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the anhydrides

function wrongTradNonMetal(x: NonMetal, n: number): string[] {
	const all = [`anidride ipo${x.root}osa`, `anidride ${x.root}osa`, `anidride ${x.root}ica`, `anidride per${x.root}ica`];
	const right = anhydride(x, n).trad;
	const masc = right.replace('anidride', 'ossido').replace(/a$/, 'o');
	if (x.halogen) return [...all.filter((a) => a !== right), masc];
	// the other suffix first, then "ossido" with the adjective, then the two prefixes
	return [all[1], all[2], masc, all[0], all[3]].filter((a) => a !== right);
}

const stockAsked = (x: NonMetal) => x.ox.length > 1 || x.roman === true;

function level4(rng: Rng): Built {
	const x = rng.pick(NON_METALS);
	const n = rng.pick(x.ox);
	const c = anhydride(x, n);
	const which = rng.pick<Nomenclatura>(stockAsked(x) ? ['trad', 'stock', 'iupac'] : ['trad', 'iupac']);
	const wrong = which === 'trad' ? wrongTradNonMetal(x, n) : which === 'stock' ? wrongStock(c, x.ox) : wrongIupac(c, false);
	return nameQuestion(rng, c, which, wrong, [oxSentence(c), suffixSentence(x, n, true), threeNames(c)], which);
}

function level5(rng: Rng): Built {
	const x = rng.pick(NON_METALS);
	const n = rng.pick(x.ox);
	const c = anhydride(x, n);
	const which = rng.pick<Nomenclatura>(stockAsked(x) ? ['trad', 'stock', 'iupac'] : ['trad', 'iupac']);
	return formulaQuestion(rng, c, which, wrongOxides(c, x.ox.map((k) => anhydride(x, k))), fromNameSteps(c, which, x, true), which);
}

// ---------------------------------------------------------------------------
// Level 6: peroxides and the oxides outside the two rules

/** Oxides with two atoms of oxygen that are not peroxides, with the oxidation number of the element. */
export const DIOXIDES: [string, string, number][] = [['PbO2', 'piombo', 4], ['SnO2', 'stagno', 4], ['MnO2', 'manganese', 4], ['CO2', 'carbonio', 4], ['SO2', 'zolfo', 4], ['SiO2', 'silicio', 4]];
export const PLAIN_OXIDES = ['Na2O', 'K2O', 'BaO', 'CaO', 'MgO', 'Li2O'];
/** Wrong formulas for the name of each peroxide. */
export const PEROXIDE_WRONG: Record<string, string[]> = {
	H2O2: ['H2O', 'HO', 'HO2', 'H2O3'],
	Na2O2: ['Na2O', 'NaO', 'NaO2', 'NaOH'],
	K2O2: ['K2O', 'KO', 'KO2', 'KOH'],
	BaO2: ['BaO', 'Ba2O2', 'Ba2O', 'Ba(OH)2'],
	CaO2: ['CaO', 'Ca2O2', 'Ca2O', 'Ca(OH)2'],
};

type Opt = { text: string } | { key: string };
const opt = (o: Opt): ChoiceOption => ('text' in o ? textOpt(o.text) : texOpt(texOf(o.key), o.key));
const T = (text: string): Opt => ({ text });
const F = (key: string): Opt => ({ key });

/** The questions on the oxides of chromium and manganese, on CO and NO, on the amphoteric oxides: lesson 77. */
export const SPECIAL: { q: string; right: Opt; wrong: Opt[]; why: string }[] = [
	{ q: 'Qual è il nome tradizionale di $\\mathrm{CrO_3}$?', right: T('anidride cromica'), wrong: [T('ossido cromico'), T('ossido cromoso'), T('anidride cromosa')], why: 'Il cromo ha $+6$: con un numero di ossidazione così alto il suo ossido è acido, e si chiama anidride cromica. Ossido cromico è $\\mathrm{Cr_2O_3}$.' },
	{ q: 'Qual è il nome di $\\mathrm{CrO_3}$ nella notazione di Stock?', right: T('ossido di cromo(VI)'), wrong: [T('ossido di cromo(III)'), T('ossido di cromo(II)'), T('ossido di cromo(IV)')], why: 'Numero di ossidazione del cromo: $x + 3 \\cdot (-2) = 0$, quindi $x = +6$.' },
	{ q: 'Qual è il nome tradizionale di $\\mathrm{Mn_2O_7}$?', right: T('anidride permanganica'), wrong: [T('ossido manganico'), T('anidride manganosa'), T('ossido permanganico')], why: 'Il manganese ha $+7$: con un numero di ossidazione così alto il suo ossido è acido, e si chiama anidride permanganica.' },
	{ q: 'Qual è il nome di $\\mathrm{Mn_2O_7}$ nella notazione di Stock?', right: T('ossido di manganese(VII)'), wrong: [T('ossido di manganese(II)'), T('ossido di manganese(III)'), T('ossido di manganese(IV)')], why: 'Numero di ossidazione del manganese: $2x + 7 \\cdot (-2) = 0$, quindi $x = +7$.' },
	{ q: 'Qual è il nome di $\\mathrm{MnO_2}$ nella notazione di Stock?', right: T('ossido di manganese(IV)'), wrong: [T('ossido di manganese(II)'), T('ossido di manganese(III)'), T('ossido di manganese(VII)')], why: 'Numero di ossidazione del manganese: $x + 2 \\cdot (-2) = 0$, quindi $x = +4$.' },
	{ q: 'Qual è il nome IUPAC di $\\mathrm{CO}$?', right: T('monossido di carbonio'), wrong: [T('diossido di carbonio'), T('ossido di dicarbonio'), T('anidride carbonica')], why: 'Un atomo di carbonio e uno di ossigeno: monossido di carbonio. Il prefisso mono- si scrive perché il carbonio ha anche il diossido, $\\mathrm{CO_2}$.' },
	{ q: 'Qual è la formula del composto che ha questo nome: anidride cromica?', right: F('CrO3'), wrong: [F('Cr2O3'), F('CrO'), F('CrO2')], why: "L'anidride cromica è l'ossido del cromo a $+6$: l'incrocio dà $\\mathrm{Cr_2O_6}$, che si semplifica in $\\mathrm{CrO_3}$." },
	{ q: 'Qual è la formula del composto che ha questo nome: anidride permanganica?', right: F('Mn2O7'), wrong: [F('MnO2'), F('Mn2O3'), F('MnO')], why: "L'anidride permanganica è l'ossido del manganese a $+7$: l'incrocio dà $\\mathrm{Mn_2O_7}$." },
	{ q: 'Qual è la formula del composto che ha questo nome: monossido di azoto?', right: F('NO'), wrong: [F('N2O'), F('NO2'), F('N2O3')], why: 'Un atomo di azoto e uno di ossigeno: $\\mathrm{NO}$.' },
	{ q: 'Quale di questi ossidi è anfotero?', right: F('Al2O3'), wrong: [F('Na2O'), F('SO3'), F('CaO')], why: "L'ossido di alluminio si comporta da ossido basico con gli acidi e da ossido acido con le basi." },
	{ q: 'Quale di questi ossidi è anfotero?', right: F('ZnO'), wrong: [F('K2O'), F('CO2'), F('MgO')], why: "L'ossido di zinco si comporta da ossido basico con gli acidi e da ossido acido con le basi." },
	{ q: 'Quale di questi ossidi di un metallo è un ossido acido?', right: F('CrO3'), wrong: [F('CrO'), F('Cr2O3'), F('FeO')], why: 'In $\\mathrm{CrO_3}$ il cromo ha $+6$: un metallo con un numero di ossidazione molto alto si comporta da non metallo, e il suo ossido è acido.' },
	{ q: 'Quale di questi ossidi di un metallo è un ossido acido?', right: F('Mn2O7'), wrong: [F('MnO'), F('Mn2O3'), F('CuO')], why: 'In $\\mathrm{Mn_2O_7}$ il manganese ha $+7$: un metallo con un numero di ossidazione molto alto si comporta da non metallo, e il suo ossido è acido.' },
	{ q: "Quale di questi ossidi di un non metallo non è un'anidride?", right: F('CO'), wrong: [F('CO2'), F('SO2'), F('N2O5')], why: "Il monossido di carbonio non reagisce con l'acqua per dare un acido: non è né acido né basico." },
	{ q: "Quale di questi ossidi di un non metallo non è un'anidride?", right: F('NO'), wrong: [F('N2O3'), F('SO3'), F('P2O5')], why: "Il monossido di azoto non reagisce con l'acqua per dare un acido: non è né acido né basico." },
];

function level6(rng: Rng): Built {
	const r = rng.next();
	if (r < 0.35) {
		const p = rng.pick(PEROXIDES);
		const two = shuffled(rng, DIOXIDES).slice(0, 2);
		const one = rng.pick(p.sym === 'H' ? PLAIN_OXIDES : PLAIN_OXIDES.filter((k) => !k.startsWith(p.sym)));
		return {
			prompt: 'Trova il perossido.',
			problem: textBlock('Quale di questi composti è un perossido?'),
			solution: p.tex,
			steps: [
				textBlock(`In $${p.tex}$ ${il(p.nome)} ha sempre $${signed(p.no)}$: perché la somma faccia zero, l'ossigeno deve avere $-1$. È un perossido.`),
				textBlock(`Negli altri l'ossigeno ha $-2$: in $${texOf(two[0][0])}$ ${il(two[0][1])} ha $+${two[0][2]}$, in $${texOf(two[1][0])}$ ${il(two[1][1])} ha $+${two[1][2]}$. Due atomi di ossigeno nella formula non fanno un perossido.`),
			],
			answer: choose(rng, texOpt(p.tex, p.key), [...two.map(([k]) => texOpt(texOf(k), k)), texOpt(texOf(one), one)]),
			params: { case: 'quale perossido', key: p.key },
		};
	}
	if (r < 0.65) {
		const p = rng.pick(PEROXIDES);
		const name = `perossido di ${p.nome}`;
		if (rng.next() < 0.5)
			return {
				prompt: 'Scegli il nome del composto.',
				problem: textBlock(`Che nome ha $${p.tex}$?`),
				solution: `\\text{${name}}`,
				steps: [textBlock(`${cap(il(p.nome))} ha sempre $${signed(p.no)}$, quindi l'ossigeno ha $-1$: è un perossido, e il nome è perossido di ${p.nome}.`)],
				answer: choose(rng, textOpt(name), [`ossido di ${p.nome}`, `idrossido di ${p.nome}`, `anidride di ${p.nome}`, `idruro di ${p.nome}`].map((w) => textOpt(w))),
				params: { case: 'perossido nome', key: p.key },
			};
		return {
			prompt: 'Scegli la formula del composto.',
			problem: textBlock(`Qual è la formula del composto che ha questo nome: ${name}?`),
			solution: p.tex,
			steps: [textBlock(`In un perossido l'ossigeno ha $-1$ e gli atomi di ossigeno sono due, legati tra loro. Con ${il(p.nome)} a $${signed(p.no)}$ la formula è $${p.tex}$, e gli indici non si semplificano.`)],
			answer: choose(rng, texOpt(p.tex, p.key), PEROXIDE_WRONG[p.key].map((k) => texOpt(texOf(k), k))),
			params: { case: 'perossido formula', key: p.key },
		};
	}
	const k = rng.int(0, SPECIAL.length - 1);
	const s = SPECIAL[k];
	const right = opt(s.right);
	return { prompt: 'Scegli la risposta giusta.', problem: textBlock(s.q), solution: right.latex, steps: [textBlock(s.why)], answer: choose(rng, right, s.wrong.map(opt)), params: { case: 'particolari', k } };
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimOssidi: Generator = {
	id: ID,
	title: 'Ossidi basici e ossidi acidi',
	levels: {
		1: { label: 'Che tipo di ossido è', constraints: ['ossido basico, ossido acido, perossido, oppure non è un ossido'] },
		2: { label: 'Ossidi basici: dalla formula al nome', constraints: ['una delle tre nomenclature'] },
		3: { label: 'Ossidi basici: dal nome alla formula', constraints: ['una delle tre nomenclature'] },
		4: { label: 'Anidridi: dalla formula al nome', constraints: ['una delle tre nomenclature'] },
		5: { label: 'Anidridi: dal nome alla formula', constraints: ['una delle tre nomenclature'] },
		6: { label: 'Perossidi e ossidi particolari', constraints: ['perossidi, cromo e manganese, CO e NO, anfoteri'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default chimOssidi;
