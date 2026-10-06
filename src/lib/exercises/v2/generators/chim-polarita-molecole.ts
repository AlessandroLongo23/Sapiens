/**
 * Molecole polari e apolari. Spec: specs/exercises/chim-polarita-molecole.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/69-chim-polarita-molecole.md), each one step harder: the
 * dipole of a bond from the two electronegativities; which molecule is polar among molecules whose central atom is
 * bound to equal atoms; the same with different atoms around the centre; the sum of two equal bond dipoles at an
 * angle, 2 μ cos(θ/2); what follows from polarity (solubility, the charged rod). Electronegativities from
 * src/lib/tools/elementi.json, in hundredths.
 */
import type { Generator, Rng, Sample } from '../types';
import { type BuiltG, cap, checkG, choose, dec, generateG, shuffled, textBlock, textOpt, texOpt, toChoiceG } from '../chim3-g';

export const ID = 'chim-polarita-molecole';

/** Symbol → name and Pauling electronegativity in hundredths. */
export const EL: Record<string, { nome: string; chi: number }> = {
	H: { nome: 'idrogeno', chi: 220 },
	B: { nome: 'boro', chi: 204 },
	C: { nome: 'carbonio', chi: 255 },
	N: { nome: 'azoto', chi: 304 },
	O: { nome: 'ossigeno', chi: 344 },
	F: { nome: 'fluoro', chi: 398 },
	Si: { nome: 'silicio', chi: 190 },
	P: { nome: 'fosforo', chi: 219 },
	S: { nome: 'zolfo', chi: 258 },
	Cl: { nome: 'cloro', chi: 316 },
	Br: { nome: 'bromo', chi: 296 },
	I: { nome: 'iodio', chi: 266 },
};
/** "il carbonio", "l'ossigeno", "lo zolfo", "lo iodio" */
export function art(name: string) {
	if (name === 'iodio' || /^(z|s[^aeiou])/.test(name)) return `lo ${name}`;
	if (/^[aeiou]/.test(name)) return `l'${name}`;
	return `il ${name}`;
}
const chiTex = (k: number) => dec(k / 100, 2);

// ---------------------------------------------------------------------------
// Level 1: the dipole of a bond

export const POLAR_BONDS: [string, string][] = [
	['H', 'F'], ['H', 'Cl'], ['H', 'Br'], ['H', 'I'], ['O', 'H'], ['N', 'H'], ['C', 'O'], ['C', 'N'], ['C', 'F'], ['C', 'Cl'], ['S', 'O'], ['P', 'Cl'],
	['P', 'O'], ['Si', 'O'], ['Si', 'Cl'], ['B', 'Cl'], ['B', 'O'], ['N', 'F'], ['O', 'F'], ['S', 'F'], ['S', 'Cl'], ['P', 'F'], ['I', 'Cl'], ['Br', 'F'], ['Cl', 'F'],
];
export const APOLAR_BONDS: [string, string][] = [['C', 'H'], ['P', 'H'], ['C', 'S'], ['N', 'Cl'], ['C', 'I'], ['Si', 'H'], ['B', 'H'], ['Cl', 'Br'], ['Br', 'I']];

function level1(rng: Rng): BuiltG {
	const polar = rng.next() < 0.75;
	const pair = rng.pick(polar ? POLAR_BONDS : APOLAR_BONDS);
	const [a, b] = rng.next() < 0.5 ? pair : [pair[1], pair[0]];
	const ask = rng.pick(['freccia', 'meno', 'piu'] as const);
	const A = EL[a], B = EL[b];
	const [hi, lo] = A.chi > B.chi ? [a, b] : [b, a];
	const d = EL[hi].chi - EL[lo].chi;
	const question = ask === 'freccia' ? 'verso quale atomo punta la freccia del momento dipolare?' : `quale atomo ha la carica parziale $\\delta^${ask === 'meno' ? '-' : '+'}$?`;
	const opt = (sym: string) => textOpt(ask === 'freccia' ? `Verso ${art(EL[sym].nome)}` : cap(art(EL[sym].nome)), sym);
	const none = textOpt(ask === 'freccia' ? 'Nessuna freccia: il legame è apolare' : 'Nessuno: il legame è apolare', 'nessuno');
	const fourth = textOpt(ask === 'freccia' ? 'Dipende dalla forma della molecola' : 'Tutti e due', 'altro');
	const rightSym = ask === 'piu' ? lo : hi;
	const wrongSym = ask === 'piu' ? hi : lo;
	const delta = `$\\Delta\\chi = ${chiTex(EL[hi].chi)} - ${chiTex(EL[lo].chi)} = ${chiTex(d)}$`;
	const right = polar ? opt(rightSym) : none;
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Nel legame tra un atomo di ${A.nome} ($\\chi = ${chiTex(A.chi)}$) e un atomo di ${B.nome} ($\\chi = ${chiTex(B.chi)}$), ${question}`),
		solution: right.latex,
		steps: polar
			? [
					textBlock(`${delta}: la differenza è almeno $0{,}4$ e il legame è polare.`),
					textBlock(
						`${cap(art(EL[hi].nome))} è più elettronegativo: prende la carica $\\delta^-$, e la freccia del dipolo punta verso di lui. ${cap(art(EL[lo].nome))} ha la carica $\\delta^+$.`,
					),
				]
			: [textBlock(`${delta}: la differenza è sotto $0{,}4$ e il legame si considera apolare. Non ci sono cariche parziali e non c'è dipolo.`)],
		answer: polar ? choose(rng, right, [opt(wrongSym), none, fourth]) : choose(rng, right, [opt(hi), opt(lo), fourth]),
		params: { case: polar ? 'polare' : 'apolare', a, b, ask },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: which molecule is polar

interface Mol {
	key: string;
	tex: string;
	why: string;
}
const m = (key: string, tex: string, why: string): Mol => ({ key, tex: `\\mathrm{${tex}}`, why });

/** Central atom bound to equal atoms, no lone pairs: apolar. */
export const APOLARI: Mol[] = [
	m('CO2', 'CO_2', 'è lineare, con due legami uguali e opposti: i dipoli si annullano'),
	m('CS2', 'CS_2', 'è lineare, con due legami uguali e opposti: la somma è zero'),
	m('BF3', 'BF_3', 'è triangolare planare, con tre legami uguali a $120^\\circ$: i dipoli si annullano'),
	m('BCl3', 'BCl_3', 'è triangolare planare, con tre legami uguali a $120^\\circ$: i dipoli si annullano'),
	m('SO3', 'SO_3', 'è triangolare planare, con tre legami uguali a $120^\\circ$: i dipoli si annullano'),
	m('CH4', 'CH_4', 'è tetraedrico, con quattro legami uguali: la somma è zero'),
	m('CCl4', 'CCl_4', 'è tetraedrico, con quattro legami uguali: i dipoli si annullano'),
	m('CF4', 'CF_4', 'è tetraedrico, con quattro legami uguali: i dipoli si annullano'),
	m('SiCl4', 'SiCl_4', 'è tetraedrico, con quattro legami uguali: i dipoli si annullano'),
	m('SiH4', 'SiH_4', 'è tetraedrico, con quattro legami uguali: la somma è zero'),
];
/** Central atom bound to equal atoms, with lone pairs: polar. */
export const POLARI: Mol[] = [
	m('H2O', 'H_2O', "l'ossigeno ha due coppie solitarie e la molecola è piegata: i due dipoli non si annullano"),
	m('NH3', 'NH_3', "l'azoto ha una coppia solitaria e la molecola è piramidale triangolare: i tre dipoli non si annullano"),
	m('SO2', 'SO_2', 'lo zolfo ha una coppia solitaria e la molecola è piegata: i due dipoli non si annullano'),
	m('NF3', 'NF_3', "l'azoto ha una coppia solitaria e la molecola è piramidale triangolare: i tre dipoli non si annullano"),
	m('PCl3', 'PCl_3', 'il fosforo ha una coppia solitaria e la molecola è piramidale triangolare: i tre dipoli non si annullano'),
	m('PF3', 'PF_3', 'il fosforo ha una coppia solitaria e la molecola è piramidale triangolare: i tre dipoli non si annullano'),
	m('OF2', 'OF_2', "l'ossigeno ha due coppie solitarie e la molecola è piegata: i due dipoli non si annullano"),
	m('SCl2', 'SCl_2', 'lo zolfo ha due coppie solitarie e la molecola è piegata: i due dipoli non si annullano'),
];
/** Different atoms around the centre: polar even in a symmetric geometry. */
export const MISTE: Mol[] = [
	m('CHCl3', 'CHCl_3', 'è tetraedrico, ma i quattro atomi legati al carbonio non sono uguali: i dipoli non si annullano'),
	m('CH2Cl2', 'CH_2Cl_2', 'è tetraedrico, ma i quattro atomi legati al carbonio non sono uguali: i dipoli non si annullano'),
	m('CH3Cl', 'CH_3Cl', 'è tetraedrico, ma i quattro atomi legati al carbonio non sono uguali: il dipolo del legame con il cloro non è compensato'),
	m('CH3F', 'CH_3F', 'è tetraedrico, ma i quattro atomi legati al carbonio non sono uguali: il dipolo del legame con il fluoro non è compensato'),
	m('CHF3', 'CHF_3', 'è tetraedrico, ma i quattro atomi legati al carbonio non sono uguali: i dipoli non si annullano'),
	m('CH2F2', 'CH_2F_2', 'è tetraedrico, ma i quattro atomi legati al carbonio non sono uguali: i dipoli non si annullano'),
	m('HCN', 'HCN', "è lineare, ma il carbonio è legato a due atomi diversi: il dipolo verso l'azoto non è compensato"),
	m('CH2O', 'CH_2O', "è triangolare planare, ma i tre atomi legati al carbonio non sono uguali: il dipolo verso l'ossigeno non è compensato"),
];

const molOpt = (x: Mol) => texOpt(x.tex, x.key);

function whichMolecule(rng: Rng, wantPolar: boolean, right: Mol, others: Mol[], kase: string): BuiltG {
	return {
		prompt: 'Scegli la molecola.',
		problem: textBlock(`Quale di queste molecole è ${wantPolar ? 'polare' : 'apolare'}?`),
		solution: right.tex,
		steps: [textBlock(`$${right.tex}$: ${right.why}. È ${wantPolar ? 'polare' : 'apolare'}.`), ...others.map((o) => textBlock(`$${o.tex}$: ${o.why}. È ${wantPolar ? 'apolare' : 'polare'}.`))],
		answer: choose(rng, molOpt(right), others.map(molOpt)),
		params: { case: kase, mode: wantPolar ? 'polare' : 'apolare', right: right.key, others: others.map((o) => o.key) },
	};
}

function level2(rng: Rng): BuiltG {
	const wantPolar = rng.next() < 0.5;
	const right = rng.pick(wantPolar ? POLARI : APOLARI);
	const others = shuffled(rng, wantPolar ? APOLARI : POLARI).slice(0, 3);
	return whichMolecule(rng, wantPolar, right, others, 'uguali');
}

function level3(rng: Rng): BuiltG {
	const wantPolar = rng.next() < 0.5;
	if (wantPolar) return whichMolecule(rng, true, rng.pick(MISTE), shuffled(rng, APOLARI).slice(0, 3), 'miste');
	const mixed = shuffled(rng, MISTE);
	const third = rng.next() < 0.5 ? mixed[2] : rng.pick(POLARI);
	return whichMolecule(rng, false, rng.pick(APOLARI), [mixed[0], mixed[1], third], 'miste');
}

// ---------------------------------------------------------------------------
// Level 4: the sum of two equal bond dipoles

export const ANGLES = [90, 100, 104.5, 109.5, 120, 130, 140, 150, 180];

function level4(rng: Rng): BuiltG {
	const k = rng.int(8, 20); // the bond dipole in tenths of a debye
	const theta = rng.pick(ANGLES);
	const mu = k / 10;
	const half = (theta / 2) * (Math.PI / 180);
	const exact = theta === 180 ? 0 : 2 * mu * Math.cos(half);
	// no value close to a tie at the second decimal
	const frac = exact * 100 - Math.floor(exact * 100);
	if (Math.abs(frac - 0.5) < 0.03) throw new Error('tie');
	const D = (x: number) => {
		const s = x.toFixed(2);
		return texOpt(`${Number(s) === 0 ? '0' : s.replace('.', '{,}')}\\,\\text{D}`, s);
	};
	const right = D(exact);
	const others = shuffled(rng, [2 * mu, mu * Math.cos(half), Math.abs(2 * mu * Math.cos(2 * half)), 2 * mu * Math.sin(half), 0]).map(D);
	const halfTex = dec(theta / 2, Number.isInteger(theta / 2) ? 0 : 2);
	const thetaTex = dec(theta, Number.isInteger(theta) ? 0 : 1);
	return {
		prompt: 'Calcola il momento dipolare della molecola.',
		problem: textBlock(
			`In una molecola un atomo centrale è legato a due atomi uguali. Ogni legame ha un dipolo di $${dec(mu, 1)}\\,\\text{D}$ e i due legami formano un angolo di $${thetaTex}^\\circ$. Quanto vale il momento dipolare della molecola?`,
		),
		solution: right.latex,
		steps: [
			textBlock('I due dipoli sono vettori uguali: la loro somma sta sulla bisettrice e vale'),
			`\\mu = 2\\,\\mu_{leg}\\cos\\dfrac{\\theta}{2} = 2 \\cdot ${dec(mu, 1)}\\,\\text{D} \\cdot \\cos ${halfTex}^\\circ`,
			theta === 180 ? textBlock('Il coseno di $90^\\circ$ è zero: i due dipoli sono opposti e si annullano.') : `\\mu = ${right.latex}`,
		],
		answer: choose(rng, right, [...others, D(mu), D(mu / 2), D(1.5 * mu)]),
		params: { case: theta === 180 ? 'opposti' : 'angolo', k, theta },
	};
}

// ---------------------------------------------------------------------------
// Level 5: what follows from polarity

interface Sub {
	key: string;
	nome: string;
	tex: string;
}
const s = (key: string, nome: string, tex: string): Sub => ({ key, nome, tex });
export const SOLUBLE_POLAR: Sub[] = [s('NH3', 'ammoniaca', 'NH_3'), s('HCl', 'cloruro di idrogeno', 'HCl'), s('HF', 'fluoruro di idrogeno', 'HF'), s('SO2', 'diossido di zolfo', 'SO_2'), s('CH2O', 'formaldeide', 'CH_2O'), s('HCN', 'cianuro di idrogeno', 'HCN')];
export const SOLUBLE_APOLAR: Sub[] = [s('CH4', 'metano', 'CH_4'), s('CCl4', 'tetraclorometano', 'CCl_4'), s('I2', 'iodio', 'I_2'), s('N2', 'azoto', 'N_2'), s('O2', 'ossigeno', 'O_2'), s('C6H14', 'esano', 'C_6H_{14}'), s('CS2', 'solfuro di carbonio', 'CS_2'), s('H2', 'idrogeno', 'H_2')];
export const HEXANE_APOLAR: Sub[] = [s('I2', 'iodio', 'I_2'), s('CCl4', 'tetraclorometano', 'CCl_4'), s('CH4', 'metano', 'CH_4'), s('CS2', 'solfuro di carbonio', 'CS_2'), s('Br2', 'bromo', 'Br_2')];
export const HEXANE_POLAR: Sub[] = [s('NH3', 'ammoniaca', 'NH_3'), s('HCl', 'cloruro di idrogeno', 'HCl'), s('HF', 'fluoruro di idrogeno', 'HF'), s('H2O', 'acqua', 'H_2O')];
export const LIQUID_POLAR: Sub[] = [s('H2O', 'acqua', 'H_2O'), s('CHCl3', 'triclorometano', 'CHCl_3'), s('CH2Cl2', 'diclorometano', 'CH_2Cl_2')];
export const LIQUID_APOLAR: Sub[] = [s('CCl4', 'tetraclorometano', 'CCl_4'), s('C6H14', 'esano', 'C_6H_{14}'), s('CS2', 'solfuro di carbonio', 'CS_2'), s('Br2', 'bromo', 'Br_2')];

/** "ammoniaca, NH₃" as an option, on two lines when the name is long. */
function subOpt(x: Sub) {
	const formula = `\\mathrm{${x.tex}}`;
	const latex = x.nome.length > 14 ? `\\begin{gathered} \\text{${x.nome}} \\\\ ${formula} \\end{gathered}` : `\\text{${x.nome}, }${formula}`;
	return texOpt(latex, x.key);
}

function level5(rng: Rng): BuiltG {
	const kind = rng.pick(['acqua', 'esano', 'bacchetta'] as const);
	const [rights, wrongs] = kind === 'acqua' ? [SOLUBLE_POLAR, SOLUBLE_APOLAR] : kind === 'esano' ? [HEXANE_APOLAR, HEXANE_POLAR] : [LIQUID_POLAR, LIQUID_APOLAR];
	const right = rng.pick(rights);
	const others = shuffled(rng, wrongs).slice(0, 3);
	const question =
		kind === 'acqua'
			? 'Quale di queste sostanze si scioglie meglio in acqua?'
			: kind === 'esano'
				? "Quale di queste sostanze si scioglie meglio nell'esano, un solvente apolare?"
				: 'Quale di questi liquidi, fatto scendere in un filo sottile, devia di più vicino a una bacchetta elettrizzata?';
	const f = (x: Sub) => `$\\mathrm{${x.tex}}$`;
	const steps =
		kind === 'acqua'
			? [textBlock("Il simile scioglie il simile: l'acqua è polare e scioglie bene le sostanze polari."), textBlock(`${f(right)} (${right.nome}) ha molecole polari. Le altre tre sostanze hanno molecole apolari.`)]
			: kind === 'esano'
				? [textBlock("Il simile scioglie il simile: l'esano è apolare e scioglie bene le sostanze apolari."), textBlock(`${f(right)} (${right.nome}) ha molecole apolari. Le altre tre sostanze hanno molecole polari.`)]
				: [textBlock('Un corpo carico attira le molecole polari, che gli rivolgono il polo di segno opposto.'), textBlock(`${f(right)} (${right.nome}) ha molecole polari e devia. Gli altri tre liquidi hanno molecole apolari e scendono quasi diritti.`)];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(question),
		solution: subOpt(right).latex,
		steps,
		answer: choose(rng, subOpt(right), others.map(subOpt)),
		params: { case: kind, right: right.key, others: others.map((o) => o.key) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltG> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkG(sample);
}

export const chimPolaritaMolecole: Generator = {
	id: ID,
	title: 'Molecole polari e apolari',
	levels: {
		1: { label: 'Il dipolo di un legame', constraints: ['due atomi con le loro elettronegatività', 'polare da 0,45 in su, apolare fino a 0,35'] },
		2: { label: 'Molecole con atomi legati uguali', constraints: ['una polare tra tre apolari, o una apolare tra tre polari'] },
		3: { label: 'Atomi diversi attorno al centro', constraints: ['almeno una molecola con atomi legati diversi'] },
		4: { label: 'La somma di due dipoli', constraints: ['due dipoli uguali, 2 μ cos(θ/2), in debye con due decimali'] },
		5: { label: 'Solubilità e bacchetta elettrizzata', constraints: ['il simile scioglie il simile; il liquido polare devia'] },
	},
	generate: generateG(ID, LEVELS, check),
	check,
	toChoice: toChoiceG,
};

export default chimPolaritaMolecole;
