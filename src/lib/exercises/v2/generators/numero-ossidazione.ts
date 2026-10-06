/**
 * Valenza e numero di ossidazione. Spec: specs/exercises/numero-ossidazione.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/76-numero-ossidazione.md), each one step harder: free
 * elements and ions of one atom; a compound of two elements; a compound of three; a polyatomic ion, where the sum is
 * the charge; the exceptions of hydrogen and oxygen (hydrides of metals, peroxides, OF2) among ordinary compounds; the
 * formula from two oxidation numbers, crossed and reduced. In levels 1-5 the answer is a whole number with its sign
 * (it can be typed); level 6 is a choice among formulas.
 */
import type { Generator, Rng } from '../types';
import { type Built, NOMI, checkSample, choose, crossed, del, formulaTex, gcd, generateWith, il, numberAnswer, oxidationNumbers, ruleOf, signed, species, sumEquation, texOpt, textBlock, toChoice, wrongFormula, type Species } from '../chim3-i';

export const ID = 'numero-ossidazione';

const question = (sym: string, sp: Species) => textBlock(`Qual è il numero di ossidazione ${del(NOMI[sym])} in $${sp.tex}$?`);

// ---------------------------------------------------------------------------
// Level 1: free elements and ions of one atom

/** Free elements as they are written, with the oxidation number students give them by habit. */
export const FREE: [string, number][] = [['Na', 1], ['Fe', 3], ['Cu', 2], ['Al', 3], ['Zn', 2], ['Mg', 2], ['O2', -2], ['Cl2', -1], ['N2', -3], ['H2', 1], ['S8', -2], ['P4', -3], ['Br2', -1], ['I2', -1]];
export const ONE_ATOM_IONS: [string, number][] = [['Na', 1], ['K', 1], ['Ag', 1], ['Cu', 1], ['Ca', 2], ['Mg', 2], ['Zn', 2], ['Fe', 2], ['Cu', 2], ['Al', 3], ['Fe', 3], ['Cl', -1], ['Br', -1], ['F', -1], ['O', -2], ['S', -2], ['N', -3]];

function level1(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const [plain, habit] = rng.pick(FREE);
		const sp = species(plain);
		const [sym, n] = sp.atoms[0];
		const { answer, wrong } = numberAnswer(0, [habit, -habit, n === 1 ? habit + 1 : n, habit - 1]);
		return {
			prompt: 'Trova il numero di ossidazione.',
			problem: question(sym, sp),
			solution: '0',
			steps: [textBlock(`$${sp.tex}$ è un elemento non combinato${n > 1 ? `: gli atomi sono tutti uguali, e nessuno attira gli elettroni più degli altri` : ''}. Il numero di ossidazione è $0$.`)],
			answer,
			params: { case: 'libero', plain, charge: 0, target: sym, wrong },
		};
	}
	const [sym, q] = rng.pick(ONE_ATOM_IONS);
	const sp = species(sym, q);
	const { answer, wrong } = numberAnswer(q, [0, -q, q > 0 ? q + 1 : q - 1, q > 0 ? q - 1 : q + 1]);
	return {
		prompt: 'Trova il numero di ossidazione.',
		problem: question(sym, sp),
		solution: signed(q),
		steps: [textBlock(`$${sp.tex}$ è uno ione fatto da un solo atomo: il numero di ossidazione è la sua carica, $${signed(q)}$.`)],
		answer,
		params: { case: 'ione', plain: sym, charge: q, target: sym, wrong },
	};
}

// ---------------------------------------------------------------------------
// Levels 2-4: the number that the rules do not fix, from the sum

export const BINARY = ['SO2', 'SO3', 'CO', 'CO2', 'NO', 'NO2', 'N2O', 'N2O3', 'N2O5', 'P2O3', 'P2O5', 'Cl2O', 'Cl2O3', 'Cl2O5', 'Cl2O7', 'FeO', 'Fe2O3', 'Cu2O', 'CuO', 'PbO2', 'SnO2', 'MnO2', 'Cr2O3', 'CrO3', 'Mn2O7', 'NH3', 'CH4', 'H2S', 'FeCl2', 'FeCl3', 'CuCl', 'CuCl2', 'SnCl4', 'PbCl2', 'AuCl3', 'Na2S', 'K2S', 'CaS', 'Al2S3', 'Mg3N2', 'Li3N', 'SF6', 'CaF2', 'AlCl3', 'NaBr', 'KI', 'ZnO', 'Ag2O', 'NiO', 'Ni2O3', 'CoO', 'Au2O3', 'SiO2', 'B2O3', 'I2O5', 'Br2O'];
export const TERNARY = ['H2SO4', 'H2SO3', 'HNO3', 'HNO2', 'H3PO4', 'H3PO3', 'H2CO3', 'HClO', 'HClO2', 'HClO3', 'HClO4', 'KMnO4', 'K2Cr2O7', 'K2CrO4', 'Na2SO4', 'Na2SO3', 'Na2CO3', 'CaCO3', 'KNO3', 'NaNO2', 'NaClO', 'KClO3', 'KClO4', 'Na3PO4', 'CaSO4', 'BaSO4', 'Al2(SO4)3', 'Ca3(PO4)2', 'Mg(NO3)2', 'Ca(ClO)2', 'Fe(OH)3', 'Fe(OH)2', 'Cu(OH)2', 'Pb(OH)4', 'KIO3', 'KBrO3', 'Na2SiO3', 'H3BO3'];
export const IONS: [string, number][] = [['SO4', -2], ['SO3', -2], ['NO3', -1], ['NO2', -1], ['PO4', -3], ['CO3', -2], ['ClO', -1], ['ClO2', -1], ['ClO3', -1], ['ClO4', -1], ['MnO4', -1], ['Cr2O7', -2], ['CrO4', -2], ['NH4', 1], ['HCO3', -1], ['HSO4', -1], ['H2PO4', -1], ['HPO4', -2], ['IO3', -1], ['BrO3', -1], ['SiO3', -2], ['H3O', 1], ['OH', -1], ['BO3', -3], ['IO4', -1]];

function fromSum(sp: Species, kase: string): Built {
	const { values, solved } = oxidationNumbers(sp);
	const x = values[solved];
	const n = sp.atoms.find((a) => a[0] === solved)![1];
	const others = sp.atoms.filter((a) => a[0] !== solved);
	const total = others.reduce((s, [sym, k]) => s + values[sym] * k, 0);
	// the mistakes of the lesson: the two atoms counted together; the charge forgotten (or invented); the indices of
	// the other atoms forgotten; the sign lost
	const noIndex = sp.charge - others.reduce((s, [sym]) => s + values[sym], 0);
	const zeroSum = -total;
	const flipped = -sp.charge - total;
	const cand = [n > 1 ? x * n : NaN, sp.charge !== 0 && zeroSum % n === 0 ? zeroSum / n : NaN, sp.charge !== 0 && flipped % n === 0 ? flipped / n : NaN, noIndex % n === 0 ? noIndex / n : NaN, -x, x + 2, x - 2, x + 1, x - 1];
	const { answer, wrong } = numberAnswer(x, cand.filter((c) => !Number.isNaN(c)));
	const steps = [
		textBlock(others.map(([sym]) => ruleOf(sym)!.text).join(' ')),
		textBlock(`Con $x$ per ${il(NOMI[solved])}, la somma dei numeri di ossidazione deve fare ${sp.charge === 0 ? '$0$' : `$${signed(sp.charge)}$, la carica dello ione`}:`, 46, [sumEquation(sp, values, solved)]),
	];
	if (n > 1) steps.push(`${n}x = ${sp.charge - total}`);
	steps.push(`x = ${signed(x)}`);
	return { prompt: 'Trova il numero di ossidazione.', problem: question(solved, sp), solution: signed(x), steps, answer, params: { case: kase, plain: sp.plain, charge: sp.charge, target: solved, wrong } };
}

const level2 = (rng: Rng) => fromSum(species(rng.pick(BINARY)), 'binario');
const level3 = (rng: Rng) => fromSum(species(rng.pick(TERNARY)), 'ternario');
function level4(rng: Rng): Built {
	const [plain, q] = rng.pick(IONS);
	return fromSum(species(plain, q), 'ione poliatomico');
}

// ---------------------------------------------------------------------------
// Level 5: hydrogen and oxygen, with their exceptions

/** [formula, the element asked, why]: the species where hydrogen or oxygen do not have their usual number. */
export const EXCEPTIONS: [string, string, string][] = [
	['NaH', 'H', 'idruro'], ['KH', 'H', 'idruro'], ['LiH', 'H', 'idruro'], ['CaH2', 'H', 'idruro'], ['MgH2', 'H', 'idruro'], ['BaH2', 'H', 'idruro'], ['AlH3', 'H', 'idruro'],
	['H2O2', 'O', 'perossido'], ['Na2O2', 'O', 'perossido'], ['K2O2', 'O', 'perossido'], ['BaO2', 'O', 'perossido'], ['CaO2', 'O', 'perossido'],
	['OF2', 'O', 'fluoro'],
];
export const ORDINARY: [string, string][] = [['H2O', 'O'], ['H2O', 'H'], ['Na2O', 'O'], ['CaO', 'O'], ['BaO', 'O'], ['K2O', 'O'], ['Al2O3', 'O'], ['HCl', 'H'], ['NH3', 'H'], ['CH4', 'H'], ['H2S', 'H'], ['HF', 'H'], ['NaOH', 'O'], ['KOH', 'O'], ['MgO', 'O'], ['Li2O', 'O'], ['HBr', 'H']];

const WHY: Record<string, string> = {
	idruro: "La regola sul metallo viene prima di quella sull'idrogeno: è un idruro di un metallo, e l'idrogeno ha $-1$.",
	perossido: "La regola sull'altro elemento viene prima di quella sull'ossigeno: è un perossido, e l'ossigeno ha $-1$.",
	fluoro: "La regola sul fluoro viene prima di quella sull'ossigeno: solo qui l'ossigeno ha un numero positivo, $+2$.",
};

function level5(rng: Rng): Built {
	const exception = rng.next() < 0.6;
	const [plain, target, why] = exception ? rng.pick(EXCEPTIONS) : [...rng.pick(ORDINARY), ''];
	const sp = species(plain);
	const { values, solved } = oxidationNumbers(sp);
	const x = values[target];
	const pool = target === 'O' ? [-2, -1, 2, 0, 1] : [1, -1, 0, -2, 2];
	const { answer, wrong } = numberAnswer(x, pool);
	const others = sp.atoms.filter((a) => a[0] !== solved);
	const steps =
		solved === target
			? [textBlock(others.map(([sym]) => ruleOf(sym)!.text).join(' ')), textBlock(`Con $x$ per ${il(NOMI[target])}:`, 46, [sumEquation(sp, values, solved)]), `x = ${signed(x)}`]
			: [textBlock(`${ruleOf(target)!.text} Nessuna regola che viene prima lo cambia: ${il(NOMI[solved])} non è un metallo.`)];
	if (why) steps.push(textBlock(WHY[why]));
	else if (solved === target) steps.push(textBlock(`È il valore solito ${del(NOMI[target])}: qui non c'è nessuna eccezione.`));
	return { prompt: 'Trova il numero di ossidazione.', problem: question(target, sp), solution: signed(x), steps, answer, params: { case: exception ? 'eccezione' : 'solito', plain, charge: 0, target, wrong } };
}

// ---------------------------------------------------------------------------
// Level 6: the formula from the two oxidation numbers

export const POSITIVE: [string, number, 'metal' | 'non-metal'][] = [
	['Na', 1, 'metal'], ['K', 1, 'metal'], ['Li', 1, 'metal'], ['Ag', 1, 'metal'], ['Cu', 1, 'metal'], ['Ca', 2, 'metal'], ['Mg', 2, 'metal'], ['Ba', 2, 'metal'], ['Zn', 2, 'metal'], ['Fe', 2, 'metal'], ['Cu', 2, 'metal'], ['Sn', 2, 'metal'], ['Pb', 2, 'metal'],
	['Al', 3, 'metal'], ['Fe', 3, 'metal'], ['Cr', 3, 'metal'], ['Au', 3, 'metal'], ['Sn', 4, 'metal'], ['Pb', 4, 'metal'],
	['N', 3, 'non-metal'], ['P', 3, 'non-metal'], ['C', 4, 'non-metal'], ['S', 4, 'non-metal'], ['Si', 4, 'non-metal'], ['N', 5, 'non-metal'], ['P', 5, 'non-metal'], ['S', 6, 'non-metal'], ['Cl', 1, 'non-metal'], ['Cl', 7, 'non-metal'],
];
/** The partner with the negative number; a non-metal with a positive number is paired with oxygen only. */
export const NEGATIVE: [string, number][] = [['O', -2], ['O', -2], ['O', -2], ['S', -2], ['Cl', -1], ['Br', -1], ['F', -1]];

function level6(rng: Rng): Built {
	const [e, p, kind] = rng.pick(POSITIVE);
	const [x, q] = kind === 'metal' ? rng.pick(NEGATIVE) : ['O', -2];
	const [a, b] = crossed(p, q);
	const g = gcd(p, q);
	const f = (i: number, j: number) => texOpt(formulaTex([[e, i], [x, j]]), wrongFormula(e, i, x, j)[1]);
	// not reduced; the numbers kept on their own element; the reduced formula turned round; one to one; one atom more
	const others = [f(-q, p), f(p, -q), f(b, a), f(1, 1), f(a, b + 1), f(a + 1, b), f(2, 1), f(1, 2), f(2, 3)];
	const steps = [textBlock(`Regola dell'incrocio: ${p === 1 ? "l'" : 'il '}$${p}$ ${del(NOMI[e])} diventa l'indice ${del(NOMI[x])}, ${q === -1 ? "l'" : 'il '}$${-q}$ ${del(NOMI[x])} diventa l'indice ${del(NOMI[e])}.`, 46, [formulaTex([[e, -q], [x, p]])])];
	if (g > 1) steps.push(textBlock(`I due indici si dividono per $${g}$:`, 46, [formulaTex([[e, a], [x, b]])]));
	steps.push(textBlock('Controllo: la somma dei numeri di ossidazione fa zero.', 46, [`${a === 1 ? '' : `${a} \\cdot `}(${signed(p)}) + ${b === 1 ? '' : `${b} \\cdot `}(${signed(q)}) = 0`]));
	return {
		prompt: 'Scrivi la formula.',
		problem: textBlock(`Che formula ha il composto tra ${il(NOMI[e])}, con numero di ossidazione $${signed(p)}$, e ${il(NOMI[x])}, con numero di ossidazione $${signed(q)}$?`),
		solution: formulaTex([[e, a], [x, b]]),
		steps,
		answer: choose(rng, f(a, b), others),
		params: { case: g > 1 ? 'da semplificare' : 'già ridotta', pos: e, p, neg: x, q },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const numeroOssidazione: Generator = {
	id: ID,
	title: 'Valenza e numero di ossidazione',
	levels: {
		1: { label: 'Elementi liberi e ioni di un solo atomo', constraints: ['0 per un elemento non combinato, la carica per uno ione monoatomico'] },
		2: { label: 'Composti di due elementi', constraints: ['un solo numero non fissato dalle regole, intero'] },
		3: { label: 'Composti di tre elementi', constraints: ['un solo numero non fissato dalle regole, intero'] },
		4: { label: 'Ioni poliatomici', constraints: ['la somma è la carica'] },
		5: { label: 'Idruri, perossidi e altri casi', constraints: ['idrogeno o ossigeno, in composti con e senza eccezione'] },
		6: { label: 'Dai numeri di ossidazione alla formula', constraints: ['incrocio e riduzione ai minimi termini'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default numeroOssidazione;
