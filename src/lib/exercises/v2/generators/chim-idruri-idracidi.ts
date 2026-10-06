/**
 * Idruri e idracidi. Spec: specs/exercises/chim-idruri-idracidi.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/78-chim-idruri-idracidi.md), each one step harder: the
 * family of a binary compound of hydrogen; the oxidation numbers in it (a whole number, it can be typed); the hydrides,
 * from the formula to the name and back; the hydracids, both ways. Names from v2/chim3-i.ts.
 */
import type { Generator, Rng } from '../types';
import {
	type Built, type Compound, type Nomenclatura, COVALENT_HYDRIDES, HYDRACIDS, NOMI, PREFIX,
	allMetalHydrides, cap, checkSample, choose, del, formulaQuestion, generateWith, il, nameQuestion, numberAnswer, oxidationNumbers, ruleOf, signed, species, sumEquation, textBlock, textOpt, toChoice, wrongKey,
} from '../chim3-i';

export const ID = 'chim-idruri-idracidi';

const METALLIC = allMetalHydrides();
/** The hydracids of the lesson: the four halogens and sulfur. */
const ACIDS = HYDRACIDS.filter((c) => c.sym !== 'Se');
const texOf = (key: string) => species(key).tex;

// ---------------------------------------------------------------------------
// Level 1: the family

const KINDS: [string, string][] = [['Idruro metallico', 'metallico'], ['Idruro covalente', 'covalente'], ['Idracido', 'idracido'], ['Ossido', 'ossido']];
export const OXIDES = ['Na2O', 'CaO', 'SO2', 'CO2', 'Al2O3', 'MgO', 'SO3', 'K2O'];
/** What the element of a covalent hydride or of a hydracid is, and its group. */
export const PLACE: Record<string, [string, number]> = { C: ['non metallo', 14], Si: ['semimetallo', 14], N: ['non metallo', 15], P: ['non metallo', 15], As: ['semimetallo', 15], S: ['non metallo', 16], F: ['non metallo', 17], Cl: ['non metallo', 17], Br: ['non metallo', 17], I: ['non metallo', 17] };

function level1(rng: Rng): Built {
	const r = rng.next();
	let key: string;
	let value: string;
	let why: string;
	if (r < 0.3) {
		const c = rng.pick(METALLIC);
		[key, value, why] = [c.key, 'metallico', `${cap(il(c.nome))} è un metallo: il composto è un idruro metallico, con l'idrogeno a $-1$.`];
	} else if (r < 0.55) {
		const c = rng.pick(COVALENT_HYDRIDES);
		[key, value, why] = [c.key, 'covalente', `${cap(il(c.nome))} è un ${PLACE[c.sym][0]} del gruppo ${PLACE[c.sym][1]}, e l'idrogeno è scritto a destra: è un idruro covalente.`];
	} else if (r < 0.8) {
		const c = rng.pick(ACIDS);
		[key, value, why] = [c.key, 'idracido', `${cap(il(c.nome))} è un non metallo del gruppo ${PLACE[c.sym][1]}, e l'idrogeno è scritto a sinistra: è un idracido.`];
	} else {
		key = rng.pick(OXIDES);
		[value, why] = ['ossido', "Non contiene idrogeno: è un composto binario dell'ossigeno, un ossido."];
	}
	const right = KINDS.find((k) => k[1] === value)!;
	return {
		prompt: 'Riconosci la famiglia del composto.',
		problem: textBlock(`A quale famiglia appartiene $${texOf(key)}$?`),
		solution: `\\text{${right[0]}}`,
		steps: [textBlock(why)],
		answer: choose(rng, textOpt(right[0], right[1]), KINDS.filter((k) => k[1] !== value).map(([l, v]) => textOpt(l, v))),
		params: { case: value, key },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the oxidation numbers

/** The compounds of level 2: silane, phosphine and arsine are left out (lesson 78, the note on electronegativity). */
export const NUMBERED = [...METALLIC.map((c) => c.key), ...ACIDS.map((c) => c.key), 'NH3', 'CH4'];

function level2(rng: Rng): Built {
	const sp = species(rng.pick(NUMBERED));
	const target = rng.pick(sp.atoms)[0];
	const { values, solved } = oxidationNumbers(sp);
	const x = values[target];
	const other = sp.atoms.find((a) => a[0] !== target)!;
	const pool = target === 'H' ? [1, -1, 0, 2, -2] : [-x, 0, x + 1, x - 1, 2 * x, other[1]];
	const { answer, wrong } = numberAnswer(x, pool);
	const hydride = values.H === -1;
	const steps =
		solved === target
			? [textBlock(ruleOf(other[0])!.text), textBlock(`Con $x$ per ${il(NOMI[target])}:`, 46, [sumEquation(sp, values, solved)]), `x = ${signed(x)}`]
			: [textBlock(`${ruleOf(target)!.text}${target === 'H' ? ` ${cap(il(NOMI[other[0]]))} non è un metallo, e la regola vale.` : ''}`)];
	if (hydride) steps.push(textBlock("È un idruro di un metallo: l'idrogeno è più elettronegativo del metallo e ha $-1$."));
	return {
		prompt: 'Trova il numero di ossidazione.',
		problem: textBlock(`Qual è il numero di ossidazione ${del(NOMI[target])} in $${sp.tex}$?`),
		solution: signed(x),
		steps,
		answer,
		params: { case: hydride ? 'idruro metallico' : 'idrogeno a +1', plain: sp.plain, charge: 0, target, wrong },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: the hydrides

const USE_NAMES = COVALENT_HYDRIDES.map((c) => c.trad);

function hydrideSteps(c: Compound): string[] {
	const n = c.count[1];
	if (c.classe === 'idruro metallico')
		return [`${cap(il(c.nome))} è un metallo: il composto è un idruro metallico. ${cap(il(c.nome))} ha sempre $${signed(c.no)}$ e l'idrogeno $-1$, quindi gli atomi di idrogeno sono $${n}$.`, `Nome tradizionale e di Stock: ${c.trad}. Nome IUPAC: ${c.iupac}.`];
	return [`${cap(il(c.nome))} è un ${PLACE[c.sym][0]} del gruppo ${PLACE[c.sym][1]}: il composto è un idruro covalente, con $${n}$ atomi di idrogeno.`, `Nome tradizionale: ${c.trad}. Nome IUPAC: ${c.iupac}.`];
}

function level3(rng: Rng): Built {
	const metallic = rng.next() < 0.55;
	const c = rng.pick(metallic ? METALLIC : COVALENT_HYDRIDES);
	const n = c.count[1];
	const which: Nomenclatura = c.iupac === c.trad || rng.next() < 0.5 ? 'trad' : 'iupac';
	let wrong: string[];
	if (metallic && which === 'trad') wrong = [`idrossido di ${c.nome}`, `ossido di ${c.nome}`, `perossido di ${c.nome}`, `anidride di ${c.nome}`];
	else if (which === 'trad') wrong = USE_NAMES.filter((x) => x !== c.trad);
	else wrong = [`idruro di ${PREFIX[n]}${c.nome}`, `${PREFIX[n + 1]}idruro di ${c.nome}`, `${PREFIX[n]}idrossido di ${c.nome}`, `${PREFIX[n]}ossido di ${c.nome}`, `${PREFIX[n + 2]}idruro di ${c.nome}`];
	return nameQuestion(rng, c, which, wrong, hydrideSteps(c), metallic ? 'metallico' : 'covalente');
}

function level4(rng: Rng): Built {
	const metallic = rng.next() < 0.55;
	const c = rng.pick(metallic ? METALLIC : COVALENT_HYDRIDES);
	const n = c.count[1];
	const which: Nomenclatura = c.iupac === c.trad || rng.next() < 0.5 ? 'trad' : 'iupac';
	const s = c.sym;
	const keys = metallic
		? [n === 1 ? `${s}H2` : `${s}H`, `${s}${n === 1 ? 2 : n}H`, `${s}H${n + 1}`, n === 1 ? `${s}OH` : `${s}(OH)${n}`, `${s}2H${n + 2}`]
		: [`${s}H${n + 1}`, `${s}H${n - 1}`, `${s}${n}H`, `${s}2H${n}`, `${s}H${n + 2}`];
	const first = which === 'iupac' ? `Nel nome IUPAC il prefisso dice quanti sono gli atomi di idrogeno: $${n}$.` : metallic ? `${cap(il(c.nome))} ha sempre $${signed(c.no)}$ e negli idruri dei metalli l'idrogeno ha $-1$: ${n === 1 ? 'serve un atomo' : `servono $${n}$ atomi`} di idrogeno.` : `${cap(c.trad)} è il nome tradizionale dell'idruro ${del(c.nome)}, un elemento del gruppo ${PLACE[c.sym][1]}: gli atomi di idrogeno sono $${n}$.`;
	return formulaQuestion(rng, c, which, keys.map(wrongKey), [first, `Negli idruri l'idrogeno si scrive a destra: $${c.tex}$.`], metallic ? 'metallico' : 'covalente');
}

// ---------------------------------------------------------------------------
// Level 5: the hydracids

/** The root of the name of the hydracid, and the root of the oxyacids of the same element (the wrong names). */
export const STEM: Record<string, [string, string]> = { F: ['fluor', 'fluor'], Cl: ['clor', 'clor'], Br: ['brom', 'brom'], I: ['iod', 'iod'], S: ['solf', 'solfor'] };

function level5(rng: Rng): Built {
	const c = rng.pick(ACIDS);
	const [stem, oxy] = STEM[c.sym];
	const h = c.count[1];
	const which: Nomenclatura = rng.next() < 0.5 ? 'trad' : 'iupac';
	const facts = `${cap(il(c.nome))} è un non metallo del gruppo ${PLACE[c.sym][1]} e ha numero di ossidazione $${signed(c.no)}$; l'idrogeno ha $+1$ ed è scritto a sinistra: è un idracido.`;
	if (rng.next() < 0.5) {
		const wrong = which === 'trad' ? [`acido ${oxy}ico`, `acido ${oxy}oso`, `idruro di ${c.nome}`, `acido ipo${oxy}oso`] : [`idruro di ${c.nome}`, h === 1 ? `${stem}uro di diidrogeno` : `di${stem}uro di idrogeno`, `${stem}ato di ${PREFIX[h]}idrogeno`, `${stem}ito di ${PREFIX[h]}idrogeno`];
		return nameQuestion(rng, c, which, wrong, [facts, `Nome tradizionale, per la soluzione in acqua: ${c.trad}. Nome IUPAC, per il composto puro: ${c.iupac}.`], 'formula-nome');
	}
	const s = c.sym;
	const keys = h === 1 ? [`H2${s}`, `H${s}O3`, `H${s}2`, `H${s}O`] : [`H${s}`, `H2${s}O4`, `H${s}2`, `H2${s}O3`];
	const first = which === 'trad' ? `Il suffisso -idrico indica un idracido, senza ossigeno, e la radice ${stem}- indica ${il(c.nome)}.` : `Il suffisso -uro e le parole "di idrogeno" indicano il composto ${del(c.nome)} con l'idrogeno, senza ossigeno.`;
	return formulaQuestion(rng, c, which, keys.map(wrongKey), [first, `${cap(il(c.nome))} ha $${signed(c.no)}$ e l'idrogeno $+1$: ${h === 1 ? 'serve un atomo' : `servono $${h}$ atomi`} di idrogeno, a sinistra. La formula è $${c.tex}$.`], 'nome-formula');
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

export const chimIdruriIdracidi: Generator = {
	id: ID,
	title: 'Idruri e idracidi',
	levels: {
		1: { label: 'Idruro metallico, idruro covalente o idracido', constraints: ['la famiglia dalla formula'] },
		2: { label: 'I numeri di ossidazione', constraints: ['idrogeno a -1 con i metalli, a +1 con i non metalli'] },
		3: { label: 'Idruri: dalla formula al nome', constraints: ['nome tradizionale o nome IUPAC'] },
		4: { label: 'Idruri: dal nome alla formula', constraints: ['nome tradizionale o nome IUPAC'] },
		5: { label: 'Idracidi: nomi e formule', constraints: ['acido -idrico e -uro di idrogeno, nei due sensi'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default chimIdruriIdracidi;
