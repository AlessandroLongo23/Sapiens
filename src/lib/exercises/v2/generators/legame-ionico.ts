/**
 * Il legame ionico. Spec: specs/exercises/legame-ionico.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/65-legame-ionico.md), each one step harder:
 * which pair of elements makes an ionic bond; the ion an element forms, from its group; the formula from the two
 * ions; how many ions there are in a mass of compound (the formula unit); which of two compounds has the larger
 * lattice energy, and why; the properties of ionic compounds. Every level is a multiple choice: the answers are
 * formulas, names or numbers in scientific notation.
 */
import type { Generator, Rng } from '../types';
import {
	ANION_NAME,
	IONIC_RADIUS,
	N_A,
	type BuiltF,
	art,
	cap,
	checkF,
	choose,
	elF,
	generateF,
	hund,
	idx,
	ionCharge,
	ionTex,
	ionicFormula,
	gcd,
	shuffle,
	sig3,
	texOpt,
	textBlock,
	textOpt,
	toChoiceF,
	valenceF,
} from '../chim3-f';

export const ID = 'legame-ionico';

// ---------------------------------------------------------------------------
// Level 1: which pair makes an ionic bond

/** Metal and non-metal with Δχ of at least 1,9: both criteria of the lesson agree. */
export const IONIC_PAIRS: [string, string][] = [
	['Na', 'Cl'], ['K', 'Cl'], ['Mg', 'O'], ['Ca', 'O'], ['Na', 'F'], ['K', 'Br'], ['Li', 'F'], ['Ca', 'F'],
	['Na', 'O'], ['K', 'F'], ['Li', 'O'], ['K', 'O'], ['Ca', 'Cl'], ['Li', 'Cl'], ['Na', 'Br'], ['Mg', 'F'],
];
/** Two non-metals: a covalent bond. The first three have hydrogen, the pair students most often take for ionic. */
export const COVALENT_PAIRS: [string, string][] = [['H', 'Cl'], ['H', 'O'], ['H', 'F'], ['C', 'O'], ['N', 'H'], ['C', 'H'], ['S', 'O'], ['C', 'Cl'], ['P', 'Cl'], ['N', 'O']];
/** Two atoms of the same non-metal. */
export const SAME_PAIRS: [string, string][] = [['Cl', 'Cl'], ['O', 'O'], ['N', 'N'], ['H', 'H'], ['F', 'F'], ['Br', 'Br']];
/** Two metals. */
export const METAL_PAIRS: [string, string][] = [['Na', 'K'], ['Cu', 'Zn'], ['Mg', 'Al'], ['Fe', 'Ni'], ['Li', 'Na'], ['Ca', 'Mg']];

const pairLabel = ([a, b]: [string, string]) => (a === b ? `Due atomi di ${elF(a).nome}` : cap(`${elF(a).nome} e ${elF(b).nome}`));
const pairValue = ([a, b]: [string, string]) => `${a}-${b}`;

function level1(rng: Rng): BuiltF {
	const ionic = rng.pick(IONIC_PAIRS);
	const cov = rng.pick(COVALENT_PAIRS);
	const same = rng.pick(SAME_PAIRS);
	const metals = rng.pick(METAL_PAIRS);
	const [m, x] = ionic.map(elF);
	const d = x.chi - m.chi;
	return {
		prompt: 'Scegli la coppia giusta.',
		problem: textBlock('Quale di queste coppie di elementi forma un legame ionico?'),
		solution: `\\text{${pairLabel(ionic)}}`,
		steps: [
			textBlock(`Il legame ionico si forma tra un metallo, che cede elettroni, e un non metallo, che li acquista: ${art(m.nome)} è un metallo, ${art(x.nome)} un non metallo.`),
			`\\Delta\\chi = ${hund(x.chi)} - ${hund(m.chi)} = ${hund(d)} > 1{,}9`,
			textBlock(`${pairLabel(cov)}: due non metalli, legame covalente. ${pairLabel(same)}: lo stesso non metallo, legame covalente puro. ${pairLabel(metals)}: due metalli, legame metallico.`),
		],
		answer: choose(rng, textOpt(pairLabel(ionic), pairValue(ionic)), [textOpt(pairLabel(cov), pairValue(cov)), textOpt(pairLabel(same), pairValue(same)), textOpt(pairLabel(metals), pairValue(metals))]),
		params: { case: 'coppia', ionic: pairValue(ionic) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the ion from the group

export const ION_ELEMENTS = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Ba', 'Al', 'N', 'O', 'S', 'F', 'Cl', 'Br', 'I'];

function level2(rng: Rng): BuiltF {
	const e = elF(rng.pick(ION_ELEMENTS));
	const v = valenceF(e);
	const q = ionCharge(e);
	// the sign swapped; the valence electrons, or those missing to eight, taken for the charge
	const wrong = e.metal ? [-v, -(8 - v), 8 - v] : [8 - v, -v, v];
	const why = e.metal
		? `${cap(art(e.nome))} è un metallo con ${v === 1 ? 'un elettrone' : `$${v}$ elettroni`} di valenza: ${v === 1 ? 'lo perde' : 'li perde tutti'} e resta con ${v === 1 ? 'una carica positiva' : `$${v}$ cariche positive`} in più.`
		: `${cap(art(e.nome))} è un non metallo con $${v}$ elettroni di valenza: per arrivare a otto ne acquista $8 - ${v} = ${8 - v}$, e ha ${8 - v === 1 ? 'una carica negativa' : `$${8 - v}$ cariche negative`} in più.`;
	return {
		prompt: 'Trova lo ione.',
		problem: textBlock(`${cap(art(e.nome))} è nel gruppo $${e.group}$ della tavola periodica. Quale ione forma in un composto ionico?`),
		solution: ionTex(e.sym, q),
		steps: [textBlock(why), ionTex(e.sym, q)],
		answer: choose(rng, texOpt(ionTex(e.sym, q), String(q)), wrong.map((w) => texOpt(ionTex(e.sym, w), String(w)))),
		params: { case: e.metal ? 'metallo' : 'non-metallo', sym: e.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the formula from the two ions

export const CATIONS_3: [string, number][] = [['Li', 1], ['Na', 1], ['K', 1], ['Mg', 2], ['Ca', 2], ['Ba', 2], ['Al', 3]];
export const ANIONS_3: [string, number][] = [['F', 1], ['Cl', 1], ['Br', 1], ['I', 1], ['O', 2], ['S', 2], ['N', 3]];
/** Nitrides that do not exist as simple ionic solids: left out. */
const NO_NITRIDE = new Set(['Na', 'K']);

const rawFormula = (c: string, nc: number, a: string, na: number) => `\\mathrm{${c}${idx(nc)}${a}${idx(na)}}`;

function level3(rng: Rng): BuiltF {
	const [c, qc] = rng.pick(CATIONS_3);
	const [a, qa] = rng.pick(ANIONS_3);
	if (a === 'N' && NO_NITRIDE.has(c)) throw new Error('retry');
	const { tex, nc, na } = ionicFormula(c, qc, a, qa);
	const l = nc * qc;
	const opt = (x: number, y: number) => texOpt(rawFormula(c, x, a, y), `${x}:${y}`);
	// the cross not simplified; the indices swapped; one of each; then other small ratios
	const others = [...(gcd(qc, qa) > 1 ? [opt(qa, qc)] : []), opt(na, nc), opt(1, 1), opt(2, 1), opt(1, 2), opt(2, 3), opt(3, 2), opt(1, 3), opt(3, 1)];
	return {
		prompt: 'Scrivi la formula del composto ionico.',
		problem: textBlock(`Qual è la formula del composto ionico formato dagli ioni $${ionTex(c, qc)}$ e $${ionTex(a, -qa)}$?`),
		solution: tex,
		steps: [
			textBlock(`Il composto è neutro. Il minimo comune multiplo delle cariche $${qc}$ e $${qa}$ è $${l}$: ${nc === 1 ? 'serve uno ione' : `servono $${nc}$ ioni`} $${ionTex(c, qc)}$ e ${na === 1 ? 'uno ione' : `$${na}$ ioni`} $${ionTex(a, -qa)}$.`),
			`${nc} \\cdot (+${qc}) + ${na} \\cdot (-${qa}) = 0`,
			tex,
		],
		answer: choose(rng, opt(nc, na), others),
		params: { case: gcd(qc, qa) > 1 ? 'da-semplificare' : qc === qa ? 'uno-a-uno' : 'incrocio', cation: c, anion: a },
	};
}

// ---------------------------------------------------------------------------
// Level 4: how many ions in a mass of compound

/** Compounds of the lesson's ions: cation, anion. */
export const COMPOUNDS_4: [string, string][] = [
	['Na', 'Cl'], ['K', 'Cl'], ['Ca', 'Cl'], ['Mg', 'Cl'], ['Na', 'O'], ['K', 'O'], ['Ca', 'F'], ['Mg', 'O'],
	['Al', 'O'], ['Na', 'S'], ['K', 'Br'], ['Na', 'F'], ['Li', 'F'], ['Ca', 'Br'], ['Li', 'O'], ['Mg', 'F'],
];
export const MOLES_4 = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5];

function level4(rng: Rng): BuiltF {
	const [c, a] = rng.pick(COMPOUNDS_4);
	const ec = elF(c), ea = elF(a);
	const { tex, nc, na } = ionicFormula(c, ionCharge(ec), a, -ionCharge(ea));
	const M = (nc * ec.mass + na * ea.mass) / 100;
	const n = rng.pick(MOLES_4);
	const mass = sig3(n * M);
	const m = Number(mass.value);
	// the mass, rounded to three figures, must give back the same amount of substance
	if (sig3(m / M).value !== sig3(n).value) throw new Error('retry');
	const k = nc + na;
	const right = sig3(n * N_A * k);
	const opt = (x: number) => {
		const s = sig3(x);
		return texOpt(s.tex, s.value);
	};
	// the formula units; only the anions, only the cations; the molar mass divided by the mass; the mass not divided
	const others = [opt(n * N_A), opt(n * N_A * na), opt(n * N_A * nc), opt((M / m) * N_A * k), opt(m * N_A * k)];
	const name = `${ANION_NAME[a]} di ${ec.nome}`;
	const Mtex = M.toFixed(2).replace('.', '{,}');
	const count = (n1: number, sym: string, q: number) => `${n1 === 1 ? 'uno ione' : `$${n1}$ ioni`} $${ionTex(sym, q)}$`;
	return {
		prompt: 'Conta gli ioni.',
		problem: textBlock(
			`Quanti ioni ci sono in tutto in $${mass.tex}\\,\\text{g}$ di ${name}, $${tex}$? Le masse atomiche sono $${hund(ec.mass)}$ per $\\mathrm{${c}}$ e $${hund(ea.mass)}$ per $\\mathrm{${a}}$; usa $N_A = 6{,}02 \\cdot 10^{23}\\,\\text{mol}^{-1}$.`,
		),
		solution: right.tex,
		steps: [
			`M = ${nc === 1 ? '' : `${nc} \\cdot `}${hund(ec.mass)} + ${na === 1 ? '' : `${na} \\cdot `}${hund(ea.mass)} = ${Mtex}\\,\\text{g/mol}`,
			`n = \\dfrac{${mass.tex}\\,\\text{g}}{${Mtex}\\,\\text{g/mol}} = ${sig3(n).tex}\\,\\text{mol}`,
			textBlock(`Le unità formula sono $${sig3(n).tex} \\cdot 6{,}02 \\cdot 10^{23} = ${sig3(n * N_A).tex}$. Ogni unità formula contiene ${count(nc, c, ionCharge(ec))} e ${count(na, a, ionCharge(ea))}: $${k}$ ioni.`),
			`${k} \\cdot ${sig3(n * N_A).tex} = ${right.tex}`,
		],
		answer: choose(rng, texOpt(right.tex, right.value), others),
		params: { case: `ioni-${k}`, cation: c, anion: a, moles: sig3(n).value },
	};
}

// ---------------------------------------------------------------------------
// Level 5: which of two compounds has the larger lattice energy

/** Pairs that differ only in the distance: the same charges, one ion in common, the other of the same group. */
export const DISTANCE_PAIRS: [[string, string], [string, string]][] = [
	[['Li', 'F'], ['Na', 'F']], [['Na', 'F'], ['K', 'F']], [['Li', 'Cl'], ['Na', 'Cl']], [['Na', 'Cl'], ['K', 'Cl']], [['Li', 'Br'], ['K', 'Br']],
	[['Na', 'F'], ['Na', 'Cl']], [['Na', 'Cl'], ['Na', 'Br']], [['K', 'F'], ['K', 'Cl']], [['K', 'F'], ['K', 'Br']], [['Li', 'F'], ['Li', 'Cl']],
	[['Mg', 'O'], ['Ca', 'O']], [['Li', 'F'], ['K', 'F']], [['Na', 'F'], ['Na', 'Br']],
];
/** Pairs that differ in the charges: one compound of ions with charge 1, one of ions with charge 2. */
export const CHARGE_PAIRS: [[string, string], [string, string]][] = [
	[['Mg', 'O'], ['Na', 'Cl']], [['Ca', 'O'], ['Na', 'F']], [['Mg', 'O'], ['Li', 'F']], [['Ca', 'O'], ['K', 'F']], [['Mg', 'O'], ['Na', 'F']],
	[['Ca', 'O'], ['Li', 'F']], [['Ca', 'O'], ['Na', 'Cl']], [['Mg', 'O'], ['K', 'Cl']], [['Ca', 'O'], ['K', 'Br']],
];

const compound = ([c, a]: [string, string]) => ionicFormula(c, ionCharge(elF(c)), a, -ionCharge(elF(a))).tex;
const distance = ([c, a]: [string, string]) => IONIC_RADIUS[c] + IONIC_RADIUS[a];

function level5(rng: Rng): BuiltF {
	const byCharge = rng.next() < 0.4;
	const [big, small] = byCharge ? rng.pick(CHARGE_PAIRS) : rng.pick(DISTANCE_PAIRS);
	const [first, second] = rng.next() < 0.5 ? [big, small] : [small, big];
	const B = compound(big), S = compound(small);
	const reason = byCharge ? 'cariche più alte' : 'ioni più piccoli';
	const opt = (formula: string, why: string, value: string) => textOpt(`$${formula}$: ${why}`, value);
	const qb = ionCharge(elF(big[0])), qs = ionCharge(elF(small[0]));
	const steps = byCharge
		? [
				textBlock(`In $${B}$ gli ioni hanno carica $${qb}$, in $${S}$ carica $${qs}$: il prodotto delle cariche vale $${qb * qb}$ contro $${qs * qs}$.`),
				textBlock(`Le distanze tra gli ioni, $${distance(big)}\\,\\text{pm}$ e $${distance(small)}\\,\\text{pm}$, cambiano molto meno del prodotto delle cariche: decidono le cariche, e l'energia reticolare maggiore è quella di $${B}$.`),
			]
		: [
				textBlock(`I due composti hanno ioni con le stesse cariche. La distanza tra i centri degli ioni è $${distance(big)}\\,\\text{pm}$ in $${B}$ e $${distance(small)}\\,\\text{pm}$ in $${S}$.`),
				textBlock(`Ioni più piccoli stanno più vicini e si attraggono di più: l'energia reticolare maggiore è quella di $${B}$.`),
			];
	const others = byCharge
		? [opt(S, 'ioni più piccoli', 'S-piccoli'), opt(S, 'cariche più alte', 'S-cariche'), opt(B, 'ioni più grandi', 'B-grandi')]
		: [opt(S, 'ioni più grandi', 'S-grandi'), opt(B, 'ioni più grandi', 'B-grandi'), opt(S, 'ioni più piccoli', 'S-piccoli')];
	return {
		prompt: 'Confronta le energie reticolari.',
		problem: textBlock(`Quale dei due composti ha l'energia reticolare maggiore, $${compound(first)}$ o $${compound(second)}$, e perché?`),
		solution: opt(B, reason, 'giusta').latex,
		steps,
		answer: choose(rng, opt(B, reason, byCharge ? 'B-cariche' : 'B-piccoli'), others),
		params: { case: byCharge ? 'cariche' : 'distanza', big: big.join('-'), small: small.join('-') },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the properties of ionic compounds

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: 'Perché un cristallo ionico colpito si spacca?', a: 'Cariche uguali finiscono di fronte', wrong: ['Il legame ionico è debole', 'Gli ioni sono liberi di muoversi', 'Le molecole si staccano'], why: 'Lo scorrimento di uno strato porta ioni dello stesso segno uno di fronte all\'altro: la repulsione stacca i due blocchi.' },
	{ q: 'Il cloruro di sodio solido conduce la corrente elettrica?', a: 'No: gli ioni sono bloccati', wrong: ['Sì: è fatto di ioni', 'Sì: ha elettroni liberi', 'No: non contiene cariche'], why: 'Nel solido le cariche ci sono, ma gli ioni sono fermi nel reticolo: senza cariche che si spostano non passa corrente.' },
	{ q: 'In quali condizioni un composto ionico conduce la corrente?', a: 'Fuso o sciolto in acqua', wrong: ['Solo allo stato solido', 'In qualunque stato', 'Mai'], why: 'Allo stato fuso e in soluzione gli ioni sono liberi di muoversi e trasportano la carica.' },
	{ q: 'Nel cloruro di sodio fuso, quali particelle trasportano la carica?', a: 'Gli ioni', wrong: ['Gli elettroni liberi', 'Le molecole di sale', 'I protoni'], why: 'I cationi vanno verso il polo negativo e gli anioni verso quello positivo. Non ci sono elettroni liberi.' },
	{ q: 'Perché i composti ionici hanno punti di fusione alti?', a: 'Ogni ione attrae tutti i vicini', wrong: ['Le loro molecole sono pesanti', 'Hanno elettroni liberi', 'Gli ioni sono grandi'], why: 'Per fondere il solido bisogna vincere le attrazioni tra ogni ione e tutti gli ioni di segno opposto che ha intorno.' },
	{ q: 'Di che cosa è fatto un cristallo di cloruro di sodio?', a: 'Di ioni in un reticolo', wrong: ['Di molecole di cloruro di sodio', 'Di atomi neutri', 'Di ioni ed elettroni liberi'], why: 'Cationi e anioni si alternano in un reticolo cristallino: nel sale non ci sono molecole.' },
	{ q: 'Che cosa indica la formula di un composto ionico?', a: 'Il rapporto tra gli ioni', wrong: ['Gli atomi di una molecola', 'Il numero di ioni del cristallo', 'La carica totale'], why: 'La formula di un composto ionico è il rapporto più piccolo tra cationi e anioni, cioè la sua unità formula.' },
	{ q: 'Quanto vale il numero di coordinazione nel cloruro di sodio?', a: '6', wrong: ['1', '4', '8'], why: 'Ogni ione sodio è a contatto con sei ioni cloruro, e ogni ione cloruro con sei ioni sodio.' },
	{ q: 'Che cosa succede agli elettroni quando si forma un legame ionico?', a: 'Passano dal metallo al non metallo', wrong: ['Sono condivisi a coppie', 'Passano dal non metallo al metallo', 'Si muovono liberi nel solido'], why: 'Il metallo cede elettroni e diventa un catione, il non metallo li acquista e diventa un anione.' },
	{ q: 'Che cos\'è l\'energia reticolare?', a: 'L\'energia liberata formando il solido dagli ioni', wrong: ['L\'energia per togliere un elettrone', 'L\'energia di un legame covalente', 'L\'energia per fondere il solido'], why: 'È l\'energia liberata quando una mole di solido ionico si forma dai suoi ioni allo stato gassoso.' },
	{ q: 'A parità di cariche, quale reticolo ionico è più stabile?', a: 'Quello con gli ioni più piccoli', wrong: ['Quello con gli ioni più grandi', 'Quello con più elettroni', 'Sono tutti uguali'], why: 'Ioni più piccoli stanno più vicini e si attraggono di più: l\'energia reticolare cresce circa come il prodotto delle cariche diviso per la distanza.' },
	{ q: 'Un solido bianco fonde a temperatura alta, da solido non conduce e fuso conduce. Che cos\'è?', a: 'Un composto ionico', wrong: ['Un metallo', 'Un solido fatto di molecole', 'Un gas nobile solido'], why: 'Le cariche ci sono già nel solido, ma sono bloccate, e si liberano con la fusione: è un composto ionico.' },
	{ q: 'Tra quali elementi si forma di solito un legame ionico?', a: 'Un metallo e un non metallo', wrong: ['Due non metalli', 'Due metalli', 'Due atomi uguali'], why: 'Il metallo ha una bassa energia di ionizzazione e cede elettroni; il non metallo, molto elettronegativo, li acquista.' },
	{ q: 'Perché molti composti ionici si sciolgono in acqua?', a: 'Le molecole d\'acqua circondano gli ioni', wrong: ['L\'acqua rompe le molecole', 'Gli ioni diventano atomi neutri', 'L\'acqua è apolare'], why: 'Le molecole d\'acqua, polari, circondano gli ioni e li staccano dal reticolo.' },
];

function level6(rng: Rng): BuiltF {
	const k = rng.int(0, FACTS.length - 1);
	const f = FACTS[k];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: textOpt(f.a).latex,
		steps: [textBlock(f.why)],
		answer: choose(rng, textOpt(f.a), shuffle(rng, f.wrong).map((x) => textOpt(x))),
		params: { case: 'fatto', k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltF> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const legameIonico: Generator = {
	id: ID,
	title: 'Il legame ionico',
	levels: {
		1: { label: 'Quale coppia forma un legame ionico', constraints: ['un metallo e un non metallo con Δχ ≥ 1,9; tre coppie che non lo sono'] },
		2: { label: 'Lo ione dal gruppo', constraints: ['elementi dei gruppi 1, 2, 13, 15, 16, 17'] },
		3: { label: 'La formula dai due ioni', constraints: ['cariche da 1 a 3, indici minimi'] },
		4: { label: 'Quanti ioni in una massa', constraints: ['massa a tre cifre, N_A = 6,02 · 10²³'] },
		5: { label: 'Energia reticolare a confronto', constraints: ['due composti che differiscono per le cariche o per la distanza'] },
		6: { label: 'Le proprietà dei composti ionici', constraints: ['domande della lezione'] },
	},
	generate: generateF(ID, LEVELS),
	check: checkF,
	toChoice: toChoiceF,
};

export default legameIonico;
