/**
 * La legge di Pascal e il torchio idraulico. Spec: specs/exercises/fis-legge-pascal.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/27-fis-legge-pascal.md): the rise of pressure a piston
 * gives to a liquid, the same everywhere; the force on the big piston of a hydraulic press, F2 = F1 · S2/S1; the force
 * on the small piston that holds up a load (its weight, the areas sometimes in cm² and m²); the pistons given by their
 * diameters, the areas in the ratio of their squares; how far the pistons move, S1 · s1 = S2 · s2. Data with two
 * significant figures, answers rounded to two (never a tie), multiple choice with the unit in the option and the
 * lesson's mistakes: the ratio upside down, the other area, the cm² not converted, the diameters' ratio not squared,
 * the mass taken for the weight. From level 2 on, a scene draws the press with its data.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type R, G, G_TEX, approx, choiceOf, commonCheck, datum, dec, generateWith, n, p10, pd, plain, round2, roundSig, sig, t, two, withU } from '../fis-fluidi';

export const ID = 'fis-legge-pascal';
const S2 = { kind: 'sig', s: 2 } as const;
const r2 = (x: R) => round2(x, 2);
const num = (r: R) => r.num / r.den;

/** The press drawn with its data: areas (or diameters), the pistons' names, a force, a load, a push. */
function press(opts: { aree?: [R, R]; diametri?: [R, R]; etichette: [string, string]; forza?: string; carico?: string; spostamento?: string; alt: string }): SceneRef {
	const data: Record<string, unknown> = { etichette: opts.etichette };
	if (opts.aree) data.aree = opts.aree.map(num);
	if (opts.diametri) data.diametri = opts.diametri.map(num);
	if (opts.forza) data.forza = opts.forza;
	if (opts.carico) data.carico = opts.carico;
	if (opts.spostamento) data.spostamento = opts.spostamento;
	return { type: 'torchio-idraulico', data, alt: opts.alt };
}

// ---------------------------------------------------------------------------
// Level 1: the pressure passed on

function level1(rng: Rng): Built {
	for (;;) {
		const S = two(rng, rng.pick([0, 1])); // cm², the plunger
		const St = two(rng, -1); // cm², the cap: 0,10 to 0,99
		const F = two(rng, rng.pick([0, 1])); // N
		const exact = F.div(S.mul(p10(-4)));
		const p = r2(exact);
		if (!p) continue;
		return {
			prompt: "Calcola l'aumento di pressione.",
			problem: textBlock(
				`Una siringa piena d'acqua ha lo stantuffo di area ${pd(S, 'cm^2')} e la punta chiusa da un tappo di area ${pd(St, 'cm^2')}. Si spinge lo stantuffo con una forza di ${pd(F, 'N')}. Di quanto aumenta la pressione dell'acqua vicino al tappo?`,
			),
			solution: `p = ${withU(sig(p, 2), 'Pa')}`,
			steps: [
				t("Per la legge di Pascal l'aumento di pressione è lo stesso in ogni punto dell'acqua:"),
				`p = \\dfrac{F}{S} = \\dfrac{${withU(datum(F), 'N')}}{${withU(sig(S.mul(p10(-4)), 2), 'm^2')}} ${approx(exact, 2, 'Pa')}`,
			],
			answer: p,
			unit: 'Pa',
			format: S2,
			// the cap's area; the cm² not converted; force times area
			mistakes: [F.div(St.mul(p10(-4))), F.div(S), F.mul(S.mul(p10(-4)))],
			params: { case: 'siringa', F: F.toString(), S: S.toString(), St: St.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the force on the big piston

/** Areas of a press in cm²: S1 from 1,0 to 99, S2 from 5 to 200 times bigger, both with two figures. */
function areas(rng: Rng): [R, R] {
	for (;;) {
		const S1 = two(rng, rng.pick([0, 1]));
		const S2a = two(rng, rng.pick([1, 2, 3]));
		const k = S2a.div(S1);
		if (k.compare(n(5)) >= 0 && k.compare(n(200)) <= 0) return [S1, S2a];
	}
}

function level2(rng: Rng): Built {
	for (;;) {
		const [S1, Sb] = areas(rng);
		const F1 = two(rng, rng.pick([1, 2]));
		const exact = F1.mul(Sb).div(S1);
		const F2 = r2(exact);
		if (!F2) continue;
		const e: [string, string] = [`S_1 = ${plain(datum(S1), 'cm^2')}`, `S_2 = ${plain(datum(Sb), 'cm^2')}`];
		const fl = `F_1 = ${plain(datum(F1), 'N')}`;
		return {
			prompt: 'Calcola la forza sul pistone grande.',
			problem: textBlock(
				`In un torchio idraulico il pistone piccolo ha l'area di ${pd(S1, 'cm^2')} e quello grande di ${pd(Sb, 'cm^2')}. Sul pistone piccolo si spinge con una forza di ${pd(F1, 'N')}. Quanto vale la forza che il liquido esercita sul pistone grande?`,
			),
			solution: `F_2 = ${withU(sig(F2, 2), 'N')}`,
			steps: [
				`\\dfrac{F_1}{S_1} = \\dfrac{F_2}{S_2} \\quad\\Rightarrow\\quad F_2 = F_1 \\cdot \\dfrac{S_2}{S_1}`,
				`F_2 = ${withU(datum(F1), 'N')} \\cdot \\dfrac{${withU(datum(Sb), 'cm^2')}}{${withU(datum(S1), 'cm^2')}} ${approx(exact, 2, 'N')}`,
			],
			answer: F2,
			unit: 'N',
			format: S2,
			// the ratio upside down; the same force; the pressure in N/cm² taken for the force
			mistakes: [F1.mul(S1).div(Sb), F1, F1.div(S1)],
			params: { case: 'forza-grande', F1: F1.toString(), S1: S1.toString(), S2: Sb.toString() },
			scene: press({ aree: [S1, Sb], etichette: e, forza: fl, alt: `Un torchio idraulico: sul pistone piccolo, di area ${e[0].slice(6)}, agisce verso il basso la forza di ${plain(datum(F1), 'N')}; il pistone grande ha l'area di ${e[1].slice(6)}` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the force that holds up a load

const LOADS: [string, string, number, number][] = [
	["un'auto", 'appoggiata', 800, 2000],
	['un furgone', 'appoggiato', 2000, 3500],
	['una cassa', 'appoggiata', 200, 900],
	['una moto', 'appoggiata', 150, 300],
];

function level3(rng: Rng): Built {
	for (;;) {
		const [what, lying, lo, hi] = rng.pick(LOADS);
		const M = roundSig(n(rng.int(lo, hi)), 2); // kg, two figures
		if (M.compare(n(lo)) < 0 || M.compare(n(hi)) > 0) continue;
		const mixed = rng.next() < 0.5;
		const S1 = two(rng, rng.pick([0, 1])); // cm²
		const Sbc = two(rng, mixed ? rng.pick([2, 3]) : 2); // cm²: 100 to 990, or 0,010 to 0,99 m²
		const k = Sbc.div(S1);
		if (k.compare(n(10)) < 0 || k.compare(n(500)) > 0) continue;
		const Sbm = Sbc.mul(p10(-4)); // m²
		const W = M.mul(G);
		const exact = W.mul(S1).div(Sbc);
		const F1 = r2(exact);
		if (!F1) continue;
		const S1m = S1.mul(p10(-4));
		const bigTex = mixed ? `$${withU(sig(Sbm, 2), 'm^2')}$` : pd(Sbc, 'cm^2');
		const e: [string, string] = [`S_1 = ${plain(datum(S1), 'cm^2')}`, mixed ? `S_2 = ${plain(sig(Sbm, 2), 'm^2')}` : `S_2 = ${plain(datum(Sbc), 'cm^2')}`];
		return {
			prompt: 'Calcola la forza sul pistone piccolo.',
			problem: textBlock(
				`Un sollevatore idraulico regge ${what} di ${pd(M, 'kg')}, ${lying} su un pistone di area ${bigTex}. Il pistone piccolo ha l'area di ${pd(S1, 'cm^2')}. Con che forza bisogna spingere sul pistone piccolo?`,
			),
			solution: `F_1 = ${withU(sig(F1, 2), 'N')}`,
			steps: [
				`F_2 = m \\cdot g = ${withU(datum(M), 'kg')} \\cdot ${G_TEX} = ${withU(dec(W), 'N')}`,
				...(mixed ? [`S_1 = ${withU(datum(S1), 'cm^2')} = ${withU(sig(S1m, 2), 'm^2')}`] : []),
				`F_1 = F_2 \\cdot \\dfrac{S_1}{S_2} = ${withU(dec(W), 'N')} \\cdot \\dfrac{${mixed ? withU(sig(S1m, 2), 'm^2') : withU(datum(S1), 'cm^2')}}{${mixed ? withU(sig(Sbm, 2), 'm^2') : withU(datum(Sbc), 'cm^2')}} ${approx(exact, 2, 'N')}`,
			],
			answer: F1,
			unit: 'N',
			format: S2,
			// the mass taken for the weight; the ratio upside down; with mixed units the numbers divided as they are
			// (otherwise a hundred times the answer); the whole weight
			mistakes: [M.mul(S1).div(Sbc), W.mul(Sbc).div(S1), mixed ? W.mul(S1).div(Sbm) : exact.mul(n(100)), W],
			params: { case: mixed ? 'unita-diverse' : 'stesse-unita', M: M.toString(), S1: S1.toString(), S2cm2: Sbc.toString() },
			scene: press({ aree: [S1, Sbc], etichette: e, carico: `${datum(M)} kg`, alt: `Un torchio idraulico con ${what} di ${datum(M)} kg sul pistone grande, di area ${e[1].slice(6)}; il pistone piccolo ha l'area di ${e[0].slice(6)}` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the diameters

function level4(rng: Rng): Built {
	for (;;) {
		const D1 = two(rng, 0); // cm, 1,0 to 9,9
		const D2 = two(rng, rng.pick([0, 1])); // cm
		const k = D2.div(D1);
		if (k.compare(n(2)) < 0 || k.compare(n(15)) > 0) continue;
		const F1 = two(rng, rng.pick([1, 2]));
		const exact = F1.mul(k).mul(k);
		const F2 = r2(exact);
		if (!F2) continue;
		const e: [string, string] = [`D_1 = ${plain(datum(D1), 'cm')}`, `D_2 = ${plain(datum(D2), 'cm')}`];
		return {
			prompt: 'Calcola la forza sul pistone grande.',
			problem: textBlock(
				`In un torchio idraulico i pistoni hanno i diametri di ${pd(D1, 'cm')} e di ${pd(D2, 'cm')}. Sul pistone piccolo agisce una forza di ${pd(F1, 'N')}. Quanto vale la forza sul pistone grande?`,
			),
			solution: `F_2 = ${withU(sig(F2, 2), 'N')}`,
			steps: [
				`\\dfrac{S_2}{S_1} = \\left(\\dfrac{D_2}{D_1}\\right)^2 = \\left(\\dfrac{${withU(datum(D2), 'cm')}}{${withU(datum(D1), 'cm')}}\\right)^2`,
				`F_2 = F_1 \\cdot \\left(\\dfrac{D_2}{D_1}\\right)^2 = ${withU(datum(F1), 'N')} \\cdot \\left(\\dfrac{${datum(D2)}}{${datum(D1)}}\\right)^2 ${approx(exact, 2, 'N')}`,
			],
			answer: F2,
			unit: 'N',
			format: S2,
			// the diameters' ratio not squared; the ratio upside down, squared or not
			mistakes: [F1.mul(k), F1.div(k).div(k), F1.div(k)],
			params: { case: 'diametri', F1: F1.toString(), D1: D1.toString(), D2: D2.toString() },
			scene: press({ diametri: [D1, D2], etichette: e, forza: `F_1 = ${plain(datum(F1), 'N')}`, alt: `Un torchio idraulico con i pistoni di diametro ${e[0].slice(6)} e ${e[1].slice(6)}; sul pistone piccolo agisce verso il basso la forza di ${plain(datum(F1), 'N')}` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: how far the pistons move

function level5(rng: Rng): Built {
	const up = rng.next() < 0.5;
	for (;;) {
		const [S1, Sb] = areas(rng);
		const k = Sb.div(S1);
		if (k.compare(n(50)) > 0) continue;
		const e: [string, string] = [`S_1 = ${plain(datum(S1), 'cm^2')}`, `S_2 = ${plain(datum(Sb), 'cm^2')}`];
		if (up) {
			const s1 = two(rng, 1); // cm, 10 to 99
			const exact = s1.mul(S1).div(Sb);
			const s2 = r2(exact);
			if (!s2) continue;
			return {
				prompt: 'Calcola lo spostamento del pistone grande.',
				problem: textBlock(
					`In un torchio idraulico il pistone piccolo ha l'area di ${pd(S1, 'cm^2')} e quello grande di ${pd(Sb, 'cm^2')}. Il pistone piccolo scende di ${pd(s1, 'cm')}. Di quanto sale il pistone grande?`,
				),
				solution: `s_2 = ${withU(sig(s2, 2), 'cm')}`,
				steps: [
					t('Il volume di liquido che esce dal cilindro piccolo entra nel grande:'),
					`S_1 \\cdot s_1 = S_2 \\cdot s_2 \\quad\\Rightarrow\\quad s_2 = s_1 \\cdot \\dfrac{S_1}{S_2} = ${withU(datum(s1), 'cm')} \\cdot \\dfrac{${withU(datum(S1), 'cm^2')}}{${withU(datum(Sb), 'cm^2')}} ${approx(exact, 2, 'cm')}`,
				],
				answer: s2,
				unit: 'cm',
				format: S2,
				// the ratio upside down; the same displacement; the ratio of the areas alone
				mistakes: [s1.mul(k), s1, k],
				params: { case: 'sale', s1: s1.toString(), S1: S1.toString(), S2: Sb.toString() },
				scene: press({ aree: [S1, Sb], etichette: e, spostamento: `s_1 = ${plain(datum(s1), 'cm')}`, alt: `Un torchio idraulico: il pistone piccolo, di area ${e[0].slice(6)}, è spinto verso il basso di ${plain(datum(s1), 'cm')}; il pistone grande ha l'area di ${e[1].slice(6)}` }),
			};
		}
		const s2 = two(rng, rng.pick([-1, 0])); // cm, 0,10 to 9,9
		const exact = s2.mul(k);
		const s1 = r2(exact);
		if (!s1 || exact.compare(n(990)) > 0) continue;
		return {
			prompt: 'Calcola lo spostamento del pistone piccolo.',
			problem: textBlock(
				`In un torchio idraulico il pistone piccolo ha l'area di ${pd(S1, 'cm^2')} e quello grande di ${pd(Sb, 'cm^2')}. Di quanto deve scendere il pistone piccolo perché quello grande salga di ${pd(s2, 'cm')}?`,
			),
			solution: `s_1 = ${withU(sig(s1, 2), 'cm')}`,
			steps: [
				t('Il volume di liquido che esce dal cilindro piccolo entra nel grande:'),
				`S_1 \\cdot s_1 = S_2 \\cdot s_2 \\quad\\Rightarrow\\quad s_1 = s_2 \\cdot \\dfrac{S_2}{S_1} = ${withU(datum(s2), 'cm')} \\cdot \\dfrac{${withU(datum(Sb), 'cm^2')}}{${withU(datum(S1), 'cm^2')}} ${approx(exact, 2, 'cm')}`,
			],
			answer: s1,
			unit: 'cm',
			format: S2,
			// the ratio upside down; the same displacement; the ratio of the areas alone
			mistakes: [s2.div(k), s2, k],
			params: { case: 'scende', s2: s2.toString(), S1: S1.toString(), S2: Sb.toString() },
			scene: press({ aree: [S1, Sb], etichette: e, alt: `Un torchio idraulico con il pistone piccolo di area ${e[0].slice(6)} e quello grande di area ${e[1].slice(6)}` }),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	if (sample.level >= 2 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisLeggePascal: Generator = {
	id: ID,
	title: 'La legge di Pascal e il torchio idraulico',
	levels: {
		1: { label: 'La pressione trasmessa', constraints: ['siringa: stantuffo e tappo in cm², forza in N', "l'aumento di pressione in Pa, uguale dappertutto"] },
		2: { label: 'La forza sul pistone grande', constraints: ['F2 = F1 · S2/S1, aree in cm²', 'rapporto delle aree da 5 a 200'] },
		3: { label: 'La forza per reggere un carico', constraints: ['il peso del carico, g = 9,8 N/kg', 'area grande in cm² o in m² (metà)'] },
		4: { label: 'I diametri dei pistoni', constraints: ['aree nel rapporto dei quadrati dei diametri', 'rapporto dei diametri da 2 a 15'] },
		5: { label: 'Gli spostamenti dei pistoni', constraints: ['S1 · s1 = S2 · s2', 'quanto sale il grande o quanto scende il piccolo (metà)'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceOf(sample, rng, ID),
};

export default fisLeggePascal;
