/**
 * Il principio di Avogadro. Spec: specs/exercises/chim-principio-avogadro.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/34-chim-principio-avogadro.md), each one step harder:
 * the volume of a gas that reacts or forms, from the coefficients of the equation (all gases at the same temperature
 * and pressure); the number of particles in a volume of another gas; the relative molecular mass of a gas from the
 * masses of equal volumes; which gas it is, from how many times its density is that of a reference gas; the formula
 * of the only product, from the combining volumes. Distractors from the lesson's warnings: the ratio upside down, the
 * volumes added, the ratio of the masses without the mass of the reference, the volume ratio taken as the formula.
 *
 * Relative molecular masses from the table of lesson 01 (H 1,01, C 12,01, N 14,01, O 16,00, S 32,07, Cl 35,45); He and
 * F are written in the text where they appear.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, answerOf, checkChoice, choiceOf, dec, formulaOpt, generateWith, pqs, shuffle, sig, t, tex, textBlock, two } from '../chim-gas';

export const ID = 'chim-principio-avogadro';

const A: Record<string, number> = { H: 1.01, C: 12.01, N: 14.01, O: 16.0, S: 32.07, Cl: 35.45 };
/** Relative molecular mass of a formula like "CO_2", from the table of lesson 01. */
function mass(f: string): number {
	let m = 0;
	for (const [, el, n] of f.matchAll(/([A-Z][a-z]?)(?:_(\d+))?/g)) m += A[el] * (n ? Number(n) : 1);
	return Math.round(m * 100) / 100;
}
const mf = (f: string) => `$\\mathrm{${f}}$`;

// ---------------------------------------------------------------------------
// Level 1: combining volumes

type Sp = { f: string; c: number; side: 'r' | 'p' };
const REACTIONS: Sp[][] = [
	[{ f: 'N_2', c: 1, side: 'r' }, { f: 'H_2', c: 3, side: 'r' }, { f: 'NH_3', c: 2, side: 'p' }],
	[{ f: 'H_2', c: 2, side: 'r' }, { f: 'O_2', c: 1, side: 'r' }, { f: 'H_2O', c: 2, side: 'p' }],
	[{ f: 'H_2', c: 1, side: 'r' }, { f: 'Cl_2', c: 1, side: 'r' }, { f: 'HCl', c: 2, side: 'p' }],
	[{ f: 'CH_4', c: 1, side: 'r' }, { f: 'O_2', c: 2, side: 'r' }, { f: 'CO_2', c: 1, side: 'p' }, { f: 'H_2O', c: 2, side: 'p' }],
	[{ f: 'CO', c: 2, side: 'r' }, { f: 'O_2', c: 1, side: 'r' }, { f: 'CO_2', c: 2, side: 'p' }],
	[{ f: 'SO_2', c: 2, side: 'r' }, { f: 'O_2', c: 1, side: 'r' }, { f: 'SO_3', c: 2, side: 'p' }],
	[{ f: 'C_3H_8', c: 1, side: 'r' }, { f: 'O_2', c: 5, side: 'r' }, { f: 'CO_2', c: 3, side: 'p' }, { f: 'H_2O', c: 4, side: 'p' }],
	[{ f: 'N_2', c: 1, side: 'r' }, { f: 'O_2', c: 1, side: 'r' }, { f: 'NO', c: 2, side: 'p' }],
	[{ f: 'NO', c: 2, side: 'r' }, { f: 'O_2', c: 1, side: 'r' }, { f: 'NO_2', c: 2, side: 'p' }],
];
const term = (s: Sp) => `${s.c > 1 ? `${s.c}\\,` : ''}\\mathrm{${s.f}}`;
export const equation = (r: Sp[]) => `${r.filter((s) => s.side === 'r').map(term).join(' + ')} \\longrightarrow ${r.filter((s) => s.side === 'p').map(term).join(' + ')}`;

function level1(rng: Rng): Built {
	const r = rng.pick(REACTIONS);
	const [i, j] = shuffle(rng, r.map((_, k) => k)).slice(0, 2);
	const a = r[i], b = r[j];
	if (a.c === b.c) throw new Error('retry');
	const V = two(rng);
	const exact = (Number(V) * b.c) / a.c;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	const water = r.some((s) => s.f === 'H_2O') ? " L'acqua si forma come vapore." : '';
	const q =
		b.side === 'p' && a.side === 'r'
			? `Quanti litri di ${mf(b.f)} si formano da ${pqs(V, 'L')} di ${mf(a.f)}?`
			: b.side === 'r' && a.side === 'p'
				? `Quanti litri di ${mf(b.f)} servono per ottenere ${pqs(V, 'L')} di ${mf(a.f)}?`
				: a.side === 'r'
					? `Quanti litri di ${mf(b.f)} reagiscono con ${pqs(V, 'L')} di ${mf(a.f)}?`
					: `Quanti litri di ${mf(b.f)} si formano insieme a ${pqs(V, 'L')} di ${mf(a.f)}?`;
	return {
		prompt: 'Trova il volume dai coefficienti.',
		problem: textBlock(`Nella reazione $${equation(r)}$ tutti i gas sono alla stessa temperatura e pressione.${water} ${q}`),
		solution: `V_{\\mathrm{${b.f}}} \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t('Alla stessa temperatura e pressione i volumi stanno come i coefficienti:'),
			`V_{\\mathrm{${b.f}}} = V_{\\mathrm{${a.f}}} \\cdot \\dfrac{${b.c}}{${a.c}} = ${tex(V)}\\,\\text{L} \\cdot \\dfrac{${b.c}}{${a.c}} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the ratio upside down; the same volume; the two volumes added
		answer: answerOf(rng, ans, exact, [(Number(V) * a.c) / b.c, Number(V), Number(V) + exact], 2, 'L'),
		params: { case: `${a.side}${b.side}`, reaction: r.map((s) => `${s.c}${s.f}${s.side}`).join(' '), from: a.f, to: b.f, V },
	};
}

// ---------------------------------------------------------------------------
// Level 2: equal volumes, equal numbers

const GASES2 = ['He', 'N_2', 'O_2', 'CO_2', 'CH_4', 'Cl_2', 'H_2', 'NH_3'];
const MASS2: Record<string, number> = { He: 4.0, N_2: 28.02, O_2: 32.0, CO_2: 44.01, CH_4: 16.05, Cl_2: 70.9, H_2: 2.02, NH_3: 17.04 };

function level2(rng: Rng): Built {
	const [ga, gb] = shuffle(rng, GASES2).slice(0, 2);
	const k = rng.int(11, 99);
	if (k % 10 === 0) throw new Error('retry');
	const e = rng.int(21, 23);
	const N1 = (k / 10) * 10 ** e;
	const V1 = two(rng), V2 = two(rng);
	if (Math.abs(Number(V2) / Number(V1) - 1) < 0.3) throw new Error('retry');
	const exact = (N1 * Number(V2)) / Number(V1);
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	const Ntex = `${tex(dec(k, 1))} \\cdot 10^{${e}}`;
	return {
		prompt: 'Trova il numero di particelle.',
		problem: textBlock(`Un recipiente di ${pqs(V1, 'L')} contiene $${Ntex}$ particelle di ${mf(ga)}. Quante particelle di ${mf(gb)} ci sono in ${pqs(V2, 'L')} di ${mf(gb)}, alla stessa temperatura e pressione?`),
		solution: `N_2 \\approx ${ans.tex}`,
		steps: [
			t('Per il principio di Avogadro il numero di particelle dipende dal volume, non dal gas:'),
			`N_2 = N_1 \\cdot \\dfrac{V_2}{V_1} = ${Ntex} \\cdot \\dfrac{${tex(V2)}}{${tex(V1)}} \\approx ${ans.tex}`,
		],
		// the ratio upside down; the same number; the masses of the particles counted as well
		answer: answerOf(rng, ans, exact, [(N1 * Number(V1)) / Number(V2), N1, (exact * MASS2[ga]) / MASS2[gb]], 2, 'n'),
		params: { case: 'particelle', ga, gb, k, e, V1, V2 },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: masses of molecules from equal volumes

const REFS = ['O_2', 'N_2', 'H_2'];
const UNKNOWN = ['CO_2', 'CH_4', 'NH_3', 'SO_2', 'Cl_2', 'C_3H_8', 'C_2H_6', 'HCl', 'H_2S', 'NO', 'NO_2', 'C_2H_4'];

function level3(rng: Rng): Built {
	const ref = rng.pick(REFS);
	const x = rng.pick(UNKNOWN);
	const vol = rng.pick(['1.00', '2.00', '0.500']);
	// masses of equal volumes at normal conditions, 22,4 L/mol (only to make the data realistic), three figures
	const mr = sig((mass(ref) * Number(vol)) / 22.4, 3), mx = sig((mass(x) * Number(vol)) / 22.4, 3);
	if (!mr || !mx) throw new Error('retry');
	const Mr = mass(ref);
	const exact = (Mr * Number(mx.value)) / Number(mr.value);
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	const Mtex = tex(Mr.toFixed(2));
	return {
		prompt: 'Trova la massa molecolare relativa.',
		problem: textBlock(`Alla stessa temperatura e pressione, ${pqs(vol, 'L')} di un gas sconosciuto ${vol === '2.00' ? 'hanno' : 'ha'} una massa di $${mx.tex}\\,\\text{g}$, e ${pqs(vol, 'L')} di ${mf(ref)} una massa di $${mr.tex}\\,\\text{g}$. La massa molecolare relativa di ${mf(ref)} è $${Mtex}$. Quanto vale quella del gas sconosciuto?`),
		solution: `M_x \\approx ${ans.tex}`,
		steps: [
			t('Volumi uguali contengono lo stesso numero di molecole: le masse stanno come le masse delle molecole.'),
			`M_x = M_{\\mathrm{${ref}}} \\cdot \\dfrac{m_x}{m_{\\mathrm{${ref}}}} = ${Mtex} \\cdot \\dfrac{${mx.tex}}{${mr.tex}} \\approx ${ans.tex}`,
		],
		// the ratio of the masses alone; the ratio upside down; the difference of the masses added to M
		answer: answerOf(rng, ans, exact, [Number(mx.value) / Number(mr.value), (Mr * Number(mr.value)) / Number(mx.value), Mr + Number(mx.value) - Number(mr.value)], 3, 'n'),
		params: { case: ref, x, vol, mx: mx.value, mr: mr.value },
	};
}

const TABLE = 'Masse atomiche: $\\mathrm{H}$ $1{,}01$, $\\mathrm{C}$ $12{,}01$, $\\mathrm{N}$ $14{,}01$, $\\mathrm{O}$ $16{,}00$, $\\mathrm{S}$ $32{,}07$, $\\mathrm{Cl}$ $35{,}45$.';
const REF_NAME: Record<string, string> = { O_2: 'ossigeno', N_2: 'azoto', H_2: 'idrogeno' };

function level4(rng: Rng): Built {
	const ref = rng.pick(REFS);
	const x = rng.pick(UNKNOWN);
	const ratio = sig(mass(x) / mass(ref), 3);
	if (!ratio) throw new Error('retry');
	const others = shuffle(
		rng,
		UNKNOWN.filter((g) => Math.abs(mass(g) - mass(x)) >= 3),
	).slice(0, 3);
	if (others.length < 3) throw new Error('retry');
	const answer = choiceOf(rng, formulaOpt(x, x), others.map((g) => formulaOpt(g, g)) as ChoiceOption[]);
	const Mx = mass(ref) * Number(ratio.value);
	return {
		prompt: 'Riconosci il gas.',
		problem: textBlock(`Alla stessa temperatura e pressione, un volume di un gas sconosciuto ha una massa $${ratio.tex}$ volte quella di un ugual volume di ${REF_NAME[ref]} ${mf(ref)}. Quale gas è? ${TABLE}`),
		solution: `\\mathrm{${x}}`,
		steps: [
			t(`Le masse di volumi uguali stanno come le masse delle molecole:`),
			`M_x = ${ratio.tex} \\cdot M_{\\mathrm{${ref}}} = ${ratio.tex} \\cdot ${tex(mass(ref).toFixed(2))} \\approx ${tex(Mx.toFixed(1))}`,
			`M_{\\mathrm{${x}}} = ${tex(mass(x).toFixed(2))}`,
		],
		answer,
		params: { case: ref, x, ratio: ratio.value },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the formula from the volumes

type Syn = { a: string; b: string; ca: number; cb: number; cp: number; order: [string, string] };
/** Two gases give one product, ca : cb : cp in volume; `order` is how the product's formula is written. */
const SYNTHESES: Syn[] = [
	{ a: 'H_2', b: 'Cl_2', ca: 1, cb: 1, cp: 2, order: ['H', 'Cl'] },
	{ a: 'H_2', b: 'O_2', ca: 2, cb: 1, cp: 2, order: ['H', 'O'] },
	{ a: 'N_2', b: 'H_2', ca: 1, cb: 3, cp: 2, order: ['N', 'H'] },
	{ a: 'N_2', b: 'O_2', ca: 1, cb: 1, cp: 2, order: ['N', 'O'] },
	{ a: 'N_2', b: 'O_2', ca: 1, cb: 2, cp: 2, order: ['N', 'O'] },
	{ a: 'N_2', b: 'O_2', ca: 2, cb: 1, cp: 2, order: ['N', 'O'] },
	{ a: 'H_2', b: 'F_2', ca: 1, cb: 1, cp: 2, order: ['H', 'F'] },
	{ a: 'CO', b: 'O_2', ca: 2, cb: 1, cp: 2, order: ['C', 'O'] },
	{ a: 'NO', b: 'O_2', ca: 2, cb: 1, cp: 2, order: ['N', 'O'] },
	{ a: 'SO_2', b: 'O_2', ca: 2, cb: 1, cp: 2, order: ['S', 'O'] },
];

/** The formula with the counts of the two elements in the given order: ('N', 1), ('H', 3) → "NH_3". */
function formula(order: [string, string], counts: Record<string, number>) {
	return order.map((el) => (counts[el] ? `${el}${counts[el] > 1 ? `_${counts[el]}` : ''}` : '')).join('');
}

function level5(rng: Rng): Built {
	const s = rng.pick(SYNTHESES);
	const k = rng.int(1, 4);
	// atoms in the reactants' molecules: element → count per molecule of a, of b (a molecule like CO or SO2 has both)
	const perA: Record<string, number> = {}, perB: Record<string, number> = {};
	for (const [, el, n] of s.a.matchAll(/([A-Z][a-z]?)(?:_(\d+))?/g)) perA[el] = n ? Number(n) : 1;
	for (const [, el, n] of s.b.matchAll(/([A-Z][a-z]?)(?:_(\d+))?/g)) perB[el] = n ? Number(n) : 1;
	const total: Record<string, number> = {};
	for (const el of s.order) total[el] = (perA[el] ?? 0) * s.ca + (perB[el] ?? 0) * s.cb;
	const right: Record<string, number> = {};
	for (const el of s.order) right[el] = total[el] / s.cp;
	if (s.order.some((el) => !Number.isInteger(right[el]))) throw new Error('retry');
	const r = formula(s.order, right);
	// the atoms not divided among the molecules; the volumes taken as the formula; the formula doubled; one atom more
	const wrong = [
		formula(s.order, total),
		formula(s.order, { [s.order[0]]: s.ca, [s.order[1]]: s.cb }),
		formula(s.order, { [s.order[0]]: right[s.order[0]] * 2, [s.order[1]]: right[s.order[1]] * 2 }),
		formula(s.order, { [s.order[0]]: right[s.order[0]], [s.order[1]]: right[s.order[1]] + 1 }),
		formula(s.order, { [s.order[0]]: right[s.order[0]] + 1, [s.order[1]]: right[s.order[1]] }),
	].filter((f, i, all) => f !== r && all.indexOf(f) === i);
	const answer = choiceOf(rng, formulaOpt(r, r), wrong.map((f) => formulaOpt(f, f)));
	const va = s.ca * k, vb = s.cb * k, vp = s.cp * k;
	return {
		prompt: 'Trova la formula del prodotto.',
		problem: textBlock(`Alla stessa temperatura e pressione, $${va}\\,\\text{L}$ di ${mf(s.a)} ${va === 1 ? 'reagisce' : 'reagiscono'} con $${vb}\\,\\text{L}$ di ${mf(s.b)} e si formano $${vp}\\,\\text{L}$ di un solo gas. Qual è la formula delle sue molecole?`),
		solution: `\\mathrm{${r}}`,
		steps: [
			textBlock(`Per il principio di Avogadro i volumi stanno come i numeri di molecole: ${s.ca} di ${mf(s.a)} e ${s.cb} di ${mf(s.b)} danno ${s.cp} molecole del prodotto.`),
			textBlock(`Gli atomi sono ${s.order.map((el) => `${total[el]} di ${el}`).join(' e ')}, divisi in ${s.cp} molecole: ogni molecola è ${mf(r)}.`),
		],
		answer,
		params: { case: `${s.a}+${s.b}`, k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimPrincipioAvogadro: Generator = {
	id: ID,
	title: 'Il principio di Avogadro',
	levels: {
		1: { label: 'I volumi nelle reazioni', constraints: ['i volumi stanno come i coefficienti'] },
		2: { label: 'Stesso volume, stesse particelle', constraints: ['gas diversi alla stessa temperatura e pressione'] },
		3: { label: 'La massa delle molecole', constraints: ['masse di volumi uguali', 'tre cifre significative'] },
		4: { label: 'Quale gas è', constraints: ['rapporto delle densità', 'formule da confrontare'] },
		5: { label: 'La formula dai volumi', constraints: ['un solo prodotto gassoso'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimPrincipioAvogadro;
