/**
 * Le formule di Lewis delle molecole. Spec: specs/exercises/chim-formule-lewis.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/67-chim-formule-lewis.md), each one step
 * harder: the valence electrons of a molecule; the lone pairs of its central atom; how many bonding pairs the formula
 * that respects the octet has; the valence electrons of a polyatomic ion; a formal charge; which exception to the
 * octet a species is. Levels 1 to 4 ask for a whole number (open answer, with a multiple choice from
 * `params.options`); levels 5 and 6 are multiple choices.
 */
import type { Generator, Rng } from '../types';
import { type BuiltF, art, cap, checkF, choose, elF, generateF, texOpt, textBlock, textOpt, toChoiceF, valenceF } from '../chim3-f';

export const ID = 'chim-formule-lewis';

/** A species: the body of its formula as in \mathrm ("H_2CO_3"), its charge, and for some the central atom. */
export interface Species {
	body: string;
	charge: number;
	/** The central atom, where there is one and the level needs it. */
	center?: string;
}

const sp = (body: string, charge = 0, center?: string): Species => ({ body, charge, center });

/** [symbol, count] in the order of the formula. */
export function atomsOf(body: string): [string, number][] {
	return [...body.matchAll(/([A-Z][a-z]?)(?:_(\d))?/g)].map((m) => [m[1], m[2] ? Number(m[2]) : 1]);
}

export function speciesTex(s: Species): string {
	const n = Math.abs(s.charge);
	const sign = s.charge > 0 ? '+' : '-';
	const q = s.charge === 0 ? '' : n === 1 ? `^${sign}` : `^{${n}${sign}}`;
	return `\\mathrm{${s.body}${q}}`;
}

const valenceTotal = (s: Species) => atomsOf(s.body).reduce((t, [e, n]) => t + n * valenceF(elF(e)), 0) - s.charge;
const octetNeed = (s: Species) => atomsOf(s.body).reduce((t, [e, n]) => t + n * (e === 'H' ? 2 : 8), 0);
const atomCount = (s: Species) => atomsOf(s.body).reduce((t, [, n]) => t + n, 0);

/** "2 \cdot 1 + 4 + 3 \cdot 6": the sum of the valence electrons, atom by atom. */
const valenceSum = (s: Species) =>
	atomsOf(s.body)
		.map(([e, n]) => (n === 1 ? `${valenceF(elF(e))}` : `${n} \\cdot ${valenceF(elF(e))}`))
		.join(' + ');

// ---------------------------------------------------------------------------
// Level 1: the valence electrons of a molecule

export const MOLECULES_1: Species[] = [
	'H_2O', 'NH_3', 'CH_4', 'CO_2', 'HCN', 'CH_2O', 'H_2S', 'PCl_3', 'CCl_4', 'SO_2', 'SO_3', 'BF_3', 'H_2CO_3', 'HClO', 'HBrO', 'H_2SO_4', 'HNO_3',
	'N_2', 'O_2', 'Cl_2', 'HCl', 'HF', 'OF_2', 'NF_3', 'CS_2', 'C_2H_4', 'C_2H_2', 'PH_3', 'SiH_4', 'HClO_4', 'N_2O_3', 'COCl_2', 'PCl_5', 'SF_6',
].map((b) => sp(b));

/** The atomic numbers, for the distractor "all the electrons". */
const Z: Record<string, number> = { H: 1, B: 5, C: 6, N: 7, O: 8, F: 9, Si: 14, P: 15, S: 16, Cl: 17, Br: 35 };

function level1(rng: Rng): BuiltF {
	const s = rng.pick(MOLECULES_1);
	const atoms = atomsOf(s.body);
	const total = valenceTotal(s);
	const noIndices = atoms.reduce((t, [e]) => t + valenceF(elF(e)), 0);
	const groups = atoms.reduce((t, [e, n]) => t + n * elF(e).group, 0);
	const all = atoms.reduce((t, [e, n]) => t + n * Z[e], 0);
	return {
		prompt: 'Conta gli elettroni di valenza.',
		problem: textBlock(`Quanti elettroni di valenza ha in tutto la molecola $${speciesTex(s)}$?`),
		solution: String(total),
		steps: [textBlock('Gli elettroni di valenza di ogni atomo si leggono dal gruppo; si sommano quelli di tutti gli atomi, contando gli indici.'), `${valenceSum(s)} = ${total}`],
		// the indices forgotten; the group numbers summed; all the electrons; two more, two less
		numbers: [total, noIndices, groups, all, total + 2, total - 2],
		params: { case: 'molecola', species: s.body },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the lone pairs of the central atom

/** Molecules with one central atom; the others are its terminal atoms. */
export const MOLECULES_2: Species[] = [
	sp('H_2O', 0, 'O'), sp('NH_3', 0, 'N'), sp('CH_4', 0, 'C'), sp('CO_2', 0, 'C'), sp('HCN', 0, 'C'), sp('CH_2O', 0, 'C'), sp('H_2S', 0, 'S'),
	sp('PCl_3', 0, 'P'), sp('CCl_4', 0, 'C'), sp('SO_2', 0, 'S'), sp('OF_2', 0, 'O'), sp('NF_3', 0, 'N'), sp('CS_2', 0, 'C'), sp('PH_3', 0, 'P'),
	sp('SiH_4', 0, 'Si'), sp('HClO', 0, 'O'), sp('HBrO', 0, 'O'), sp('BF_3', 0, 'B'), sp('SCl_2', 0, 'S'), sp('COCl_2', 0, 'C'), sp('CF_4', 0, 'C'),
	sp('NCl_3', 0, 'N'), sp('SO_3', 0, 'S'), sp('CHCl_3', 0, 'C'),
];

/** The terminal atoms of a species with one central atom: every atom but one of the central element. */
function terminals(s: Species): string[] {
	const out: string[] = [];
	let skipped = false;
	for (const [e, n] of atomsOf(s.body))
		for (let i = 0; i < n; i++) {
			if (e === s.center && !skipped) skipped = true;
			else out.push(e);
		}
	return out;
}

function level2(rng: Rng): BuiltF {
	const s = rng.pick(MOLECULES_2);
	const c = elF(s.center!);
	const ts = terminals(s);
	const total = valenceTotal(s);
	const skeleton = 2 * ts.length;
	const heavy = ts.filter((e) => e !== 'H').length;
	const left = total - skeleton - 6 * heavy;
	const pairs = left / 2;
	return {
		prompt: "Conta le coppie solitarie dell'atomo centrale.",
		problem: textBlock(`Nella formula di Lewis di $${speciesTex(s)}$, quante coppie solitarie ha l'atomo centrale, ${art(c.nome)}?`),
		solution: String(pairs),
		steps: [
			textBlock(`Gli elettroni di valenza sono $${valenceSum(s)} = ${total}$. Lo scheletro ha $${ts.length}$ legami semplici, che ne usano $${skeleton}$.`),
			textBlock(
				heavy === 0
					? `Gli idrogeni sono a posto con il loro legame: ${left === 0 ? 'non resta nessun elettrone' : `restano $${total} - ${skeleton} = ${left}$ elettroni`} per l'atomo centrale.`
					: `Per completare l'ottetto ${heavy === 1 ? "dell'atomo esterno diverso dall'idrogeno" : `dei $${heavy}$ atomi esterni diversi dall'idrogeno`} servono $${6 * heavy}$ elettroni: ${left === 0 ? "non ne resta nessuno per l'atomo centrale" : `ne restano $${total} - ${skeleton} - ${6 * heavy} = ${left}$ per l'atomo centrale`}.`,
			),
			textBlock(pairs === 0 ? `${cap(art(c.nome))} non ha coppie solitarie.` : `${cap(art(c.nome))} ha ${pairs === 1 ? 'una coppia solitaria' : `$${pairs}$ coppie solitarie`}.`),
		],
		numbers: [pairs, 0, 1, 2, 3],
		params: { case: `coppie-${pairs}`, species: s.body, center: s.center },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the bonding pairs of the formula that respects the octet

export const MOLECULES_3: Species[] = [
	'H_2O', 'NH_3', 'CH_4', 'CO_2', 'HCN', 'CH_2O', 'N_2', 'O_2', 'Cl_2', 'HCl', 'H_2S', 'PCl_3', 'CCl_4', 'OF_2', 'NF_3', 'CS_2', 'C_2H_4', 'C_2H_2',
	'H_2CO_3', 'HNO_3', 'HClO', 'HBrO', 'COCl_2', 'O_3', 'SO_2', 'SO_3', 'H_2SO_4',
].map((b) => sp(b));

function level3(rng: Rng): BuiltF {
	const s = rng.pick(MOLECULES_3);
	const total = valenceTotal(s);
	const need = octetNeed(s);
	const bonds = (need - total) / 2;
	const needSum = atomsOf(s.body)
		.map(([e, n]) => (n === 1 ? `${e === 'H' ? 2 : 8}` : `${n} \\cdot ${e === 'H' ? 2 : 8}`))
		.join(' + ');
	return {
		prompt: 'Conta le coppie di legame.',
		problem: textBlock(`Nella formula di Lewis di $${speciesTex(s)}$ che rispetta la regola dell'ottetto, quante coppie di legame ci sono in tutto? Un legame doppio conta per due, un triplo per tre.`),
		solution: String(bonds),
		steps: [
			textBlock(`Se nessun atomo condividesse elettroni, per gli ottetti ne servirebbero $${needSum} = ${need}$ ($8$ per atomo, $2$ per l'idrogeno).`),
			textBlock(`Gli elettroni di valenza sono $${valenceSum(s)} = ${total}$.`),
			`\\dfrac{${need} - ${total}}{2} = ${bonds}`,
		],
		// the skeleton only; all the pairs; one more, one less; half the electrons needed
		numbers: [bonds, atomCount(s) - 1, total / 2, bonds + 1, bonds - 1, need / 2],
		params: { case: bonds > atomCount(s) - 1 ? 'multipli' : 'semplici', species: s.body },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the valence electrons of a polyatomic ion

export const IONS_4: Species[] = [
	sp('CN', -1), sp('NH_4', 1), sp('H_3O', 1), sp('OH', -1), sp('CO_3', -2), sp('NO_3', -1), sp('SO_4', -2), sp('NO_2', -1), sp('PO_4', -3), sp('ClO', -1),
	sp('ClO_4', -1), sp('HCO_3', -1), sp('SO_3', -2), sp('ClO_3', -1), sp('NH_2', -1), sp('HSO_4', -1), sp('ClO_2', -1), sp('BF_4', -1), sp('PH_4', 1), sp('NO_2', 1),
];

function level4(rng: Rng): BuiltF {
	const s = rng.pick(IONS_4);
	const total = valenceTotal(s);
	const neutral = total + s.charge;
	const n = Math.abs(s.charge);
	return {
		prompt: 'Conta gli elettroni di valenza dello ione.',
		problem: textBlock(`Quanti elettroni di valenza ha in tutto lo ione $${speciesTex(s)}$?`),
		solution: String(total),
		steps: [
			textBlock(`Gli atomi portano $${valenceSum(s)} = ${neutral}$ elettroni di valenza.`),
			textBlock(s.charge < 0 ? `La carica negativa aggiunge ${n === 1 ? 'un elettrone' : `$${n}$ elettroni`}.` : `La carica positiva toglie ${n === 1 ? 'un elettrone' : `$${n}$ elettroni`}.`),
			`${neutral} ${s.charge < 0 ? '+' : '-'} ${n} = ${total}`,
		],
		// the charge forgotten; the charge with the wrong sign; two more, two less
		numbers: [total, neutral, neutral + s.charge, total + 2, total - 2],
		params: { case: s.charge < 0 ? 'anione' : 'catione', species: s.body, charge: s.charge },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a formal charge

/** An atom in a formula of the lesson: where, the element, its lone pairs and its bonds [single, double, triple]. */
export const FORMAL: { where: string; el: string; pairs: number; bonds: [number, number, number]; who?: string }[] = [
	{ where: 'Nello ione $\\mathrm{CN^-}$', el: 'C', pairs: 1, bonds: [0, 0, 1] },
	{ where: 'Nello ione $\\mathrm{CN^-}$', el: 'N', pairs: 1, bonds: [0, 0, 1] },
	{ where: 'Nello ione $\\mathrm{NH_4^+}$', el: 'N', pairs: 0, bonds: [4, 0, 0] },
	{ where: 'Nello ione $\\mathrm{H_3O^+}$', el: 'O', pairs: 1, bonds: [3, 0, 0] },
	{ where: 'Nello ione $\\mathrm{OH^-}$', el: 'O', pairs: 3, bonds: [1, 0, 0] },
	{ where: 'In una formula limite dello ione $\\mathrm{CO_3^{2-}}$', el: 'C', pairs: 0, bonds: [2, 1, 0] },
	{ where: 'In una formula limite dello ione $\\mathrm{NO_3^-}$', el: 'N', pairs: 0, bonds: [2, 1, 0] },
	{ where: "Nella formula di $\\mathrm{H_2SO_4}$ che rispetta l'ottetto", el: 'S', pairs: 0, bonds: [4, 0, 0] },
	{ where: "In una formula limite di $\\mathrm{SO_3}$ che rispetta l'ottetto", el: 'S', pairs: 0, bonds: [2, 1, 0] },
	{ where: 'Nella molecola $\\mathrm{NH_3}$', el: 'N', pairs: 1, bonds: [3, 0, 0] },
	{ where: 'Nella molecola $\\mathrm{CO_2}$', el: 'C', pairs: 0, bonds: [0, 2, 0] },
	{ where: 'Nella molecola $\\mathrm{H_2O}$', el: 'O', pairs: 2, bonds: [2, 0, 0] },
	{ where: 'Nello ione $\\mathrm{BF_4^-}$', el: 'B', pairs: 0, bonds: [4, 0, 0] },
	{ where: 'Nello ione $\\mathrm{NH_2^-}$', el: 'N', pairs: 2, bonds: [2, 0, 0] },
	{ where: 'Nella molecola $\\mathrm{BF_3}$', el: 'B', pairs: 0, bonds: [3, 0, 0] },
	{ where: "Nella formula di $\\mathrm{HClO_4}$ che rispetta l'ottetto", el: 'Cl', pairs: 0, bonds: [4, 0, 0] },
	{ where: 'Nella molecola $\\mathrm{HCN}$', el: 'N', pairs: 1, bonds: [0, 0, 1] },
	{ where: 'Nella molecola $\\mathrm{HCN}$', el: 'C', pairs: 0, bonds: [1, 0, 1] },
	{ where: "In una formula limite dell'ozono $\\mathrm{O_3}$", el: 'O', pairs: 1, bonds: [1, 1, 0], who: "l'ossigeno al centro" },
	{ where: 'In una formula di $\\mathrm{CO_2}$ con un legame triplo e uno semplice', el: 'C', pairs: 0, bonds: [1, 0, 1] },
];

const NUM = ['', 'un', 'due', 'tre', 'quattro'];
const KIND = [
	['semplice', 'semplici'],
	['doppio', 'doppi'],
	['triplo', 'tripli'],
];

/** "tre legami semplici", "un legame doppio e due semplici", "un legame triplo" */
export function bondWords(b: [number, number, number]): string {
	const parts: string[] = [];
	b.forEach((n, k) => {
		if (n === 0) return;
		const first = parts.length === 0;
		parts.push(`${NUM[n]} ${first ? (n === 1 ? 'legame ' : 'legami ') : ''}${KIND[k][n === 1 ? 0 : 1]}`);
	});
	return parts.join(' e ');
}

const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `-${-n}` : '0');

function level5(rng: Rng): BuiltF {
	const k = rng.int(0, FORMAL.length - 1);
	const f = FORMAL[k];
	const e = elF(f.el);
	const v = valenceF(e);
	const bonds = f.bonds[0] + 2 * f.bonds[1] + 3 * f.bonds[2];
	const fc = v - 2 * f.pairs - bonds;
	const pairsText = f.pairs === 0 ? 'non ha coppie solitarie' : f.pairs === 1 ? 'ha una coppia solitaria' : `ha ${NUM[f.pairs]} coppie solitarie`;
	const subject = `${f.where} ${f.who ?? art(e.nome)}`;
	const opt = (n: number) => texOpt(signed(n), String(n));
	return {
		prompt: 'Calcola la carica formale.',
		problem: textBlock(`${subject} ${pairsText} e forma ${bondWords(f.bonds)}. Qual è la sua carica formale?`),
		solution: signed(fc),
		steps: [
			textBlock(`${cap(art(e.nome))} ha $${v}$ elettroni di valenza. ${f.pairs === 0 ? 'Non ha coppie solitarie' : `Nelle coppie solitarie ci sono $${2 * f.pairs}$ elettroni`}, e i legami sono $${bonds}$${f.bonds[1] + f.bonds[2] > 0 ? ' (un doppio conta per due, un triplo per tre)' : ''}.`),
			`${v} - ${2 * f.pairs} - ${bonds} = ${signed(fc)}`,
		],
		// the pairs counted instead of their electrons; the bonding electrons all counted; the sign swapped; one more, one less
		answer: choose(rng, opt(fc), [opt(v - f.pairs - bonds), opt(v - 2 * f.pairs - 2 * bonds), opt(-fc), opt(fc + 1), opt(fc - 1), opt(fc + 2)]),
		params: { case: fc === 0 ? 'zero' : fc > 0 ? 'positiva' : 'negativa', k },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the exceptions to the octet

export const OCTET_CASES: Record<string, Species[]> = {
	rispetta: ['CH_4', 'NH_3', 'H_2O', 'CCl_4', 'PCl_3', 'OF_2', 'NF_3', 'H_2S', 'CF_4', 'SiCl_4', 'PH_3', 'SCl_2', 'CO_2', 'HCN'].map((b) => sp(b)),
	incompleto: ['BF_3', 'BCl_3', 'BH_3', 'BeCl_2', 'BeH_2'].map((b) => sp(b)),
	espanso: ['PCl_5', 'PF_5', 'SF_6', 'SF_4', 'ClF_3'].map((b) => sp(b)),
	dispari: ['NO', 'NO_2', 'ClO_2'].map((b) => sp(b)),
};
export const OCTET_LABEL: Record<string, string> = { rispetta: 'Sì', incompleto: 'No: ottetto incompleto', espanso: 'No: ottetto espanso', dispari: 'No: elettroni dispari' };

/** The central atom of the species of level 6: the first element with one atom that is not hydrogen. */
const centerOf = (s: Species) => atomsOf(s.body).find(([e, n]) => n === 1 && e !== 'H')![0];

function level6(rng: Rng): BuiltF {
	const kind = rng.pick(Object.keys(OCTET_CASES));
	const s = rng.pick(OCTET_CASES[kind]);
	const total = valenceTotal(s);
	const c = elF(centerOf(s));
	const ts = terminals({ ...s, center: c.sym });
	// electrons around the central atom: its own, plus one from each bond of a terminal atom (O two, N three)
	const fromTerminals = ts.reduce((t, e) => t + (e === 'O' || e === 'S' ? 2 : e === 'N' ? 3 : 1), 0);
	const around = valenceF(c) + fromTerminals;
	const why =
		kind === 'dispari'
			? `Gli elettroni di valenza sono $${valenceSum(s)} = ${total}$, un numero dispari: un elettrone resta spaiato, e un atomo non può avere l'ottetto.`
			: kind === 'incompleto'
				? `${cap(art(c.nome))} ha $${valenceF(c)}$ elettroni di valenza e forma $${ts.length}$ legami semplici: ha intorno $${around}$ elettroni, meno di otto.`
				: kind === 'espanso'
					? `${cap(art(c.nome))} ha $${valenceF(c)}$ elettroni di valenza e forma $${ts.length}$ legami semplici: ha intorno $${around}$ elettroni, più di otto. È un atomo del terzo periodo.`
					: `${cap(art(c.nome))} ha $${valenceF(c)}$ elettroni di valenza e ne riceve $${fromTerminals}$ nei legami: ne ha intorno $${around}$.`;
	const all = Object.keys(OCTET_LABEL);
	return {
		prompt: "Controlla la regola dell'ottetto.",
		problem: textBlock(`Nella formula di Lewis di $${speciesTex(s)}$ l'atomo centrale rispetta la regola dell'ottetto?`),
		solution: textOpt(OCTET_LABEL[kind]).latex,
		steps: [textBlock(why)],
		answer: choose(rng, textOpt(OCTET_LABEL[kind], kind), all.filter((x) => x !== kind).map((x) => textOpt(OCTET_LABEL[x], x))),
		params: { case: kind, species: s.body },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltF> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimFormuleLewis: Generator = {
	id: ID,
	title: 'Le formule di Lewis delle molecole',
	levels: {
		1: { label: 'Elettroni di valenza di una molecola', constraints: ['molecole neutre; risposta numerica'] },
		2: { label: "Coppie solitarie dell'atomo centrale", constraints: ['molecole con un solo atomo centrale; risposta da 0 a 2'] },
		3: { label: 'Quante coppie di legame', constraints: ["molecole che rispettano l'ottetto; (elettroni per gli ottetti − elettroni di valenza) : 2"] },
		4: { label: 'Elettroni di valenza di uno ione', constraints: ['ioni poliatomici con carica da −3 a +1'] },
		5: { label: 'La carica formale', constraints: ['atomi delle formule della lezione; carica da −1 a +3'] },
		6: { label: "Le eccezioni all'ottetto", constraints: ['quattro casi con la stessa frequenza'] },
	},
	generate: generateF(ID, LEVELS),
	check: checkF,
	toChoice: toChoiceF,
};

export default chimFormuleLewis;
