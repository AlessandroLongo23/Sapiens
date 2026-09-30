/**
 * Miscele di gas e pressioni parziali. Spec: specs/exercises/chim-pressioni-parziali.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/38-chim-pressioni-parziali.md), each one step harder:
 * Dalton's law as a sum (the total, or the partial pressure missing); the partial pressure from the moles and the
 * total pressure (the mole fraction); partial and total pressures from the equation of state; a mixture given in
 * grams; a gas collected over water, whose pressure is the atmospheric one minus the vapour pressure of water.
 * Distractors from the lesson's warnings: the moles used without the mole fraction, the mass fraction for the mole
 * fraction, the temperature in °C, the vapour pressure not subtracted, a pressure forgotten in the sum.
 *
 * Vapour pressure of water, mmHg, 18-30 °C: the table of the CRC Handbook as the Italian textbooks print it (to be
 * checked by Andrea: docs/lezioni/chimica/note/38-chim-pressioni-parziali.md); the text of the exercise gives it.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, R_ATM, answerOf, checkCommon, choiceOf, formulaTex, generateWith, molar100, pq, q, sig, t, textBlock, three, noZero } from '../chim-mole';

export const ID = 'chim-pressioni-parziali';

/** Gases, their names and the article of "la pressione parziale dell'azoto". */
const GASES: [string, string, string][] = [
	['N2', 'azoto', "dell'"],
	['O2', 'ossigeno', "dell'"],
	['H2', 'idrogeno', "dell'"],
	['CO2', 'anidride carbonica', "dell'"],
	['CH4', 'metano', 'del '],
	['NH3', 'ammoniaca', "dell'"],
	['CO', 'monossido di carbonio', 'del '],
	['Cl2', 'cloro', 'del '],
	['SO2', 'anidride solforosa', "dell'"],
	['C3H8', 'propano', 'del '],
];
const VAPOUR: Record<number, string> = { 18: '15.5', 19: '16.5', 20: '17.5', 21: '18.7', 22: '19.8', 23: '21.1', 24: '22.4', 25: '23.8', 26: '25.2', 27: '26.7', 28: '28.3', 30: '31.8' };

const tex = (s: string) => s.replace('.', '{,}');
const fx = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
const deg = (tc: number) => pq(String(tc), 'C');
/** Two or three different gases. */
function gases(rng: Rng, k: number) {
	const out: { f: string; name: string; of: string; T: string; M: number }[] = [];
	while (out.length < k) {
		const [f, name, art] = rng.pick(GASES);
		if (!out.some((g) => g.f === f)) out.push({ f, name, of: `${art}${name}`, T: formulaTex(f), M: molar100(f) / 100 });
	}
	return out;
}
/** "di azoto, $\mathrm{N_2}$" */
const di = (g: { name: string; T: string }) => `di ${g.name}, $${g.T}$`;
/** "p_{\mathrm{N_2}}" */
const pOf = (g: { T: string }) => `p_{${g.T}}`;

// ---------------------------------------------------------------------------
// Level 1: the sum

/** A pressure in kPa with one decimal, as tenths. */
const kpa = (rng: Rng, lo: number, hi: number) => noZero(rng, lo * 10, hi * 10);
const kpaStr = (tenths: number) => (tenths / 10).toFixed(1);
const kpaOpt = (tenths: number): ChoiceOption => ({ latex: q(tex(kpaStr(tenths)), 'kPa'), values: [kpaStr(tenths)] });

function level1(rng: Rng): Built {
	const gs = gases(rng, 3);
	const [a, b, c] = [kpa(rng, 5, 60), kpa(rng, 5, 60), kpa(rng, 1, 30)];
	if (rng.next() < 0.5) {
		const tot = a + b + c;
		return {
			prompt: 'Trova la pressione totale.',
			problem: textBlock(`Una miscela contiene ${gs[0].name}, ${gs[1].name} e ${gs[2].name}, con pressioni parziali ${pq(tex(kpaStr(a)), 'kPa')}, ${pq(tex(kpaStr(b)), 'kPa')} e ${pq(tex(kpaStr(c)), 'kPa')}. Qual è la pressione totale della miscela?`),
			solution: `p_{tot} = ${q(tex(kpaStr(tot)), 'kPa')}`,
			steps: [t('Per la legge di Dalton la pressione totale è la somma delle pressioni parziali:'), `p_{tot} = ${tex(kpaStr(a))} + ${tex(kpaStr(b))} + ${tex(kpaStr(c))} = ${q(tex(kpaStr(tot)), 'kPa')}`],
			// a pressure forgotten
			answer: choiceOf(rng, kpaOpt(tot), [kpaOpt(a + b), kpaOpt(b + c), kpaOpt(a + c)].filter((o) => o.values[0] !== kpaStr(tot))),
			params: { case: 'totale', a: kpaStr(a), b: kpaStr(b), c: kpaStr(c) },
		};
	}
	const tot = a + b + c;
	return {
		prompt: 'Trova la pressione parziale.',
		problem: textBlock(`Una miscela di ${gs[0].name}, ${gs[1].name} e ${gs[2].name} ha pressione totale ${pq(tex(kpaStr(tot)), 'kPa')}. Le pressioni parziali dei primi due gas sono ${pq(tex(kpaStr(a)), 'kPa')} e ${pq(tex(kpaStr(b)), 'kPa')}. Qual è la pressione parziale ${gs[2].of}?`),
		solution: `${pOf(gs[2])} = ${q(tex(kpaStr(c)), 'kPa')}`,
		steps: [`${pOf(gs[2])} = p_{tot} - ${pOf(gs[0])} - ${pOf(gs[1])} = ${tex(kpaStr(tot))} - ${tex(kpaStr(a))} - ${tex(kpaStr(b))} = ${q(tex(kpaStr(c)), 'kPa')}`],
		// one pressure not subtracted; the two known ones added to the total; the sum of the known ones
		answer: choiceOf(rng, kpaOpt(c), [kpaOpt(tot - a), kpaOpt(tot - b), kpaOpt(tot + a + b), kpaOpt(a + b)].filter((o) => o.values[0] !== kpaStr(c))),
		params: { case: 'mancante', tot: kpaStr(tot), a: kpaStr(a), b: kpaStr(b) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the mole fraction

function level2(rng: Rng): Built {
	const [g1, g2] = gases(rng, 2);
	const n1 = three(rng, 0.1, 5), n2 = three(rng, 0.1, 5);
	if (n1 === n2) throw new Error('equal');
	const ptot = three(rng, 0.5, 5);
	const nt = Number(n1) + Number(n2);
	const x = Number(n1) / nt;
	const exact = x * Number(ptot);
	return {
		prompt: 'Trova la pressione parziale.',
		problem: textBlock(`Una miscela contiene ${pq(tex(n1), 'mol')} ${di(g1)}, e ${pq(tex(n2), 'mol')} ${di(g2)}, alla pressione totale di ${pq(tex(ptot), 'atm')}. Qual è la pressione parziale ${g1.of}?`),
		solution: `${pOf(g1)} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`,
		steps: [`x = \\dfrac{n_1}{n_{tot}} = \\dfrac{${tex(n1)}}{${tex(n1)} + ${tex(n2)}} = ${fx(x, 4)}`, `${pOf(g1)} = x \\cdot p_{tot} = ${fx(x, 4)} \\cdot ${tex(ptot)}\\,\\text{atm} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`],
		// the moles times the total pressure; the ratio to the other gas; the other gas's share
		answer: answerOf(rng, exact, [Number(n1) * Number(ptot), (Number(n1) / Number(n2)) * Number(ptot), (Number(n2) / nt) * Number(ptot)], 3, 'atm'),
		params: { case: 'frazione molare', n1, n2, ptot, gases: [g1.f, g2.f] },
	};
}

// ---------------------------------------------------------------------------
// Level 3: with the equation of state

function level3(rng: Rng): Built {
	const [g1, g2] = gases(rng, 2);
	const n1 = three(rng, 0.1, 2), n2 = three(rng, 0.1, 2);
	const V = three(rng, 1, 99.9);
	const tc = noZero(rng, 1, 99);
	const T = tc + 273;
	const total = rng.next() < 0.5;
	const nt = Number(n1) + Number(n2);
	const exact = ((total ? nt : Number(n1)) * R_ATM * T) / Number(V);
	return {
		prompt: total ? 'Trova la pressione totale.' : 'Trova la pressione parziale.',
		problem: textBlock(`Un recipiente di ${pq(tex(V), 'L')} contiene ${pq(tex(n1), 'mol')} ${di(g1)}, e ${pq(tex(n2), 'mol')} ${di(g2)}, a ${deg(tc)}. Qual è ${total ? 'la pressione totale della miscela' : `la pressione parziale ${g1.of}`}?`),
		solution: `${total ? 'p_{tot}' : pOf(g1)} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`,
		steps: total
			? [t('La miscela si comporta come un solo gas con tutte le moli:'), `p_{tot} = \\dfrac{n_{tot}\\,R\\,T}{V} = \\dfrac{${fx(nt, 3)} \\cdot 0{,}0821 \\cdot ${T}}{${tex(V)}}\\,\\text{atm} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`]
			: [t('Il gas occupa da solo tutto il recipiente:'), `${pOf(g1)} = \\dfrac{n_1\\,R\\,T}{V} = \\dfrac{${tex(n1)} \\cdot 0{,}0821 \\cdot ${T}}{${tex(V)}}\\,\\text{atm} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`],
		// the temperature in °C; partial and total confused; the other gas
		answer: answerOf(rng, exact, [((total ? nt : Number(n1)) * R_ATM * tc) / Number(V), ((total ? Number(n1) : nt) * R_ATM * T) / Number(V), (Number(n2) * R_ATM * T) / Number(V)], 3, 'atm'),
		params: { case: total ? 'totale' : 'parziale', n1, n2, V, t: tc, gases: [g1.f, g2.f] },
	};
}

// ---------------------------------------------------------------------------
// Level 4: a mixture in grams

function level4(rng: Rng): Built {
	const [g1, g2] = gases(rng, 2);
	const m1 = three(rng, 1, 99.9), m2 = three(rng, 1, 99.9);
	const ptot = three(rng, 0.5, 5);
	const n1 = Number(m1) / g1.M, n2 = Number(m2) / g2.M;
	const x = n1 / (n1 + n2);
	const exact = x * Number(ptot);
	const massFrac = Number(m1) / (Number(m1) + Number(m2));
	return {
		prompt: 'Trova la pressione parziale.',
		problem: textBlock(`Una bombola contiene ${pq(tex(m1), 'g')} ${di(g1)}, e ${pq(tex(m2), 'g')} ${di(g2)}, alla pressione totale di ${pq(tex(ptot), 'atm')}. Qual è la pressione parziale ${g1.of}?`),
		solution: `${pOf(g1)} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`,
		steps: [
			`n_1 = \\dfrac{${tex(m1)}}{${fx(g1.M, 2)}} = ${fx(n1, 4)}\\,\\text{mol} \\qquad n_2 = \\dfrac{${tex(m2)}}{${fx(g2.M, 2)}} = ${fx(n2, 4)}\\,\\text{mol}`,
			`x = \\dfrac{${fx(n1, 4)}}{${fx(n1 + n2, 4)}} = ${fx(x, 4)} \\qquad ${pOf(g1)} = x \\cdot p_{tot} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`,
		],
		// the mass fraction; the moles times the total; the other gas
		answer: answerOf(rng, exact, [massFrac * Number(ptot), n1 * Number(ptot), (1 - x) * Number(ptot)], 3, 'atm'),
		params: { case: 'grammi', m1, m2, ptot, gases: [g1.f, g2.f] },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a gas collected over water

function level5(rng: Rng): Built {
	for (;;) {
		const tc = rng.pick(Object.keys(VAPOUR).map(Number));
		const pw = VAPOUR[tc];
		const patm = noZero(rng, 735, 775);
		const V = three(rng, 100, 999); // mL
		const T = tc + 273;
		const pgas = patm - Number(pw);
		const exact = ((pgas / 760) * (Number(V) / 1000)) / (R_ATM * T);
		if (!sig(exact, 3)) continue;
		const gas = rng.pick(['idrogeno', 'ossigeno', 'azoto']);
		return {
			prompt: 'Trova le moli di gas.',
			problem: textBlock(
				`Si raccolgono ${pq(tex(V), 'mL')} di ${gas} sopra l'acqua, a ${deg(tc)}, con la pressione atmosferica di ${pq(String(patm), 'mmHg')}. A ${deg(tc)} la tensione di vapore dell'acqua è ${pq(tex(pw), 'mmHg')}. Quante moli di ${gas} sono state raccolte?`,
			),
			solution: `n \\approx ${q(sig(exact, 3)!.tex, 'mol')}`,
			steps: [
				`p_{gas} = p_{atm} - p_{\\mathrm{H_2O}} = ${patm} - ${tex(pw)} = ${fx(pgas, 1)}\\,\\text{mmHg} = ${fx(pgas / 760, 4)}\\,\\text{atm}`,
				`n = \\dfrac{p\\,V}{R\\,T} = \\dfrac{${fx(pgas / 760, 4)} \\cdot ${tex(sig(Number(V) / 1000, 3)!.value)}}{0{,}0821 \\cdot ${T}}\\,\\text{mol} \\approx ${q(sig(exact, 3)!.tex, 'mol')}`,
			],
			// the vapour not subtracted; added; the temperature in °C
			answer: answerOf(rng, exact, [((patm / 760) * (Number(V) / 1000)) / (R_ATM * T), (((patm + Number(pw)) / 760) * (Number(V) / 1000)) / (R_ATM * T), ((pgas / 760) * (Number(V) / 1000)) / (R_ATM * tc)], 3, 'mol'),
			params: { case: 'sopra l’acqua', V, t: tc, patm, pw },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimPressioniParziali: Generator = {
	id: ID,
	title: 'Miscele di gas e pressioni parziali',
	levels: {
		1: { label: 'La legge di Dalton', constraints: ['pressioni in kPa con un decimale', 'la totale o una parziale'] },
		2: { label: 'La frazione molare', constraints: ['p = x · p_tot'] },
		3: { label: "Con l'equazione di stato", constraints: ['pressione parziale o totale da n, V, T'] },
		4: { label: 'Una miscela in grammi', constraints: ['prima le moli'] },
		5: { label: "Un gas raccolto sopra l'acqua", constraints: ['tensione di vapore da togliere'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimPressioniParziali;
