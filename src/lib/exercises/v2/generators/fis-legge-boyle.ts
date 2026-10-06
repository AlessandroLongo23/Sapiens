/**
 * La legge di Boyle (fisica). Spec: specs/exercises/fis-legge-boyle.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/102-fis-legge-boyle.md), each one step harder: the
 * pressure of the gas under a piston that carries a body, p = p0 + m g / S; the final pressure of an isothermal
 * change, p2 = p1 V1 / V2, in kilopascals and litres; the height at which the piston stops when the body is put on
 * it (the two together, with heights in place of volumes); which of four states lies on the isotherm of a given one
 * (the same product p V); the bubble that rises from the bottom of a lake, with Stevin's law for the pressure.
 * Multiple choice with the unit in the option and the lesson's mistakes: the atmospheric pressure forgotten, the
 * ratio upside down, the area left in square centimetres.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { type Built, type Fmt, type R, G, P_ATM, SIG2, SIG3, ambiguous, checkCommon, cylinder, fmt, fmtExact, generateWith, options, plainDec, pu, pv, q, tie, wu } from '../fis-gas-leggi';

export const ID = 'fis-legge-boyle';

const ONE_DEC: Fmt = { kind: 'fixed', d: 1 };
const AREAS = [10, 20, 25, 40, 50]; // cm²
const P0_TEX = `$${wu('1{,}01 \\cdot 10^{5}', 'Pa')}$`;
const lab = (r: R, f: Fmt) => fmt(r, f).replace('{,}', ',');

/** A body of 1,0 to 9,5 kg on a piston of one of the areas: the pressure it adds, in pascals (exact). */
function piston(rng: Rng) {
	const S = q(rng.pick(AREAS));
	const m = q(rng.int(2, 19), 2);
	const extra = m.mul(G).div(S.div(q(10000)));
	return { S, m, extra, p: P_ATM.add(extra) };
}
const areaStep = (S: R) => `S = ${wu(fmtExact(S), 'cm2')} = ${fmt(S.div(q(10000)), SIG2)}\\,\\text{m}^2`;
const extraStep = (m: R, S: R, extra: R) =>
	`\\dfrac{m\\,g}{S} = \\dfrac{${wu(fmt(m, ONE_DEC), 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2}{${fmt(S.div(q(10000)), SIG2)}\\,\\text{m}^2} = ${wu(fmtExact(extra), 'Pa')}`;

// ---------------------------------------------------------------------------
// Level 1: the pressure under the piston

function level1(rng: Rng): Built {
	for (;;) {
		const { S, m, extra, p } = piston(rng);
		if (tie(p, SIG3)) continue;
		return {
			prompt: 'Trova la pressione del gas.',
			problem: textBlock(
				`Un cilindro è chiuso da un pistone di massa trascurabile e di area ${pu(fmtExact(S), 'cm2')}, su cui è appoggiato un corpo di ${pv(m, 'kg', ONE_DEC)}. Fuori c'è la pressione atmosferica, ${P0_TEX}. Quanto vale la pressione del gas? Usa $g = 9{,}8\\,\\text{m/s}^2$.`,
			),
			solution: `p \\approx ${wu(fmt(p, SIG3), 'Pa')}`,
			steps: [areaStep(S), extraStep(m, S, extra), `p = p_0 + \\dfrac{m\\,g}{S} = ${fmtExact(P_ATM)} + ${fmtExact(extra)} = ${wu(fmtExact(p), 'Pa')} \\approx ${wu(fmt(p, SIG3), 'Pa')}`],
			// the atmospheric pressure forgotten; the mass in place of the weight; the area left in cm² (p0 alone)
			answer: options(rng, p, [extra, P_ATM.add(m.div(S.div(q(10000)))), P_ATM], 'Pa', SIG3),
			params: { S: S.toString(), m: m.toString() },
			scene: cylinder(
				{ altezza: 26, scala: 40, corpo: true, etichette: { corpo: `m = ${lab(m, ONE_DEC)} kg`, S: `S = ${lab(S, { kind: 'int' })} cm²` } },
				`Un cilindro verticale con il gas chiuso da un pistone di area ${lab(S, { kind: 'int' })} centimetri quadrati, su cui è appoggiato un corpo di ${lab(m, ONE_DEC)} chilogrammi`,
			),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the final pressure

function level2(rng: Rng): Built {
	for (;;) {
		const p1 = q(rng.int(101, 299));
		const V1 = q(rng.int(11, 99), 10);
		const V2 = q(rng.int(11, 99), 10);
		if (p1.num % 10 === 0 || V1.num % 10 === 0 || V2.num % 10 === 0) continue;
		const ratio = V1.div(V2);
		if (ratio.compare(q(1, 4)) < 0 || ratio.compare(q(4)) > 0) continue;
		if (ratio.compare(q(9, 10)) > 0 && ratio.compare(q(10, 9)) < 0) continue;
		const p2 = p1.mul(ratio);
		if (tie(p2, SIG3) || ambiguous(p2, SIG3)) continue;
		const verb = V2.compare(V1) < 0 ? 'viene compresso lentamente' : 'viene lasciato espandere lentamente';
		return {
			prompt: 'Trova la pressione finale.',
			problem: textBlock(`Un gas occupa ${pv(V1, 'L', SIG2)} alla pressione di ${pu(fmtExact(p1), 'kPa')}. A temperatura costante ${verb} fino al volume di ${pv(V2, 'L', SIG2)}. Quanto vale la pressione finale?`),
			solution: `p_2 \\approx ${wu(fmt(p2, SIG3), 'kPa')}`,
			steps: ['p_1\\,V_1 = p_2\\,V_2', `p_2 = \\dfrac{p_1\\,V_1}{V_2} = \\dfrac{${wu(fmtExact(p1), 'kPa')} \\cdot ${wu(fmt(V1, SIG2), 'L')}}{${wu(fmt(V2, SIG2), 'L')}} \\approx ${wu(fmt(p2, SIG3), 'kPa')}`],
			// the ratio upside down; the division forgotten; the first volume forgotten
			answer: options(rng, p2, [p1.div(ratio), p1.mul(V1), p1.div(V2)], 'kPa', SIG3),
			params: { p1: p1.toString(), V1: V1.toString(), V2: V2.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: where the piston stops

function level3(rng: Rng): Built {
	for (;;) {
		const { S, m, extra, p } = piston(rng);
		const h1 = q(rng.int(200, 400), 10);
		const h2 = h1.mul(P_ATM).div(p);
		if (tie(h2, SIG3) || h1.sub(h2).compare(q(1)) < 0) continue;
		const h1Tex = fmt(h1, ONE_DEC);
		return {
			prompt: "Trova l'altezza finale del pistone.",
			problem: textBlock(
				`Un cilindro è chiuso da un pistone di massa trascurabile e di area ${pu(fmtExact(S), 'cm2')}. Il gas è alla pressione atmosferica, ${P0_TEX}, e il pistone è a ${pu(h1Tex, 'cm')} dal fondo. Si appoggia sul pistone un corpo di ${pv(m, 'kg', ONE_DEC)} e si aspetta che il gas torni alla temperatura iniziale. A che altezza dal fondo si ferma il pistone? Usa $g = 9{,}8\\,\\text{m/s}^2$.`,
			),
			solution: `h_2 \\approx ${wu(fmt(h2, SIG3), 'cm')}`,
			steps: [
				areaStep(S),
				`p_2 = p_0 + \\dfrac{m\\,g}{S} = ${fmtExact(P_ATM)} + ${fmtExact(extra)} = ${wu(fmtExact(p), 'Pa')}`,
				'p_1\\,h_1 = p_2\\,h_2 \\quad \\text{(l\'area si semplifica)}',
				`h_2 = \\dfrac{p_1\\,h_1}{p_2} = \\dfrac{${wu(fmtExact(P_ATM), 'Pa')} \\cdot ${wu(h1Tex, 'cm')}}{${wu(fmtExact(p), 'Pa')}} \\approx ${wu(fmt(h2, SIG3), 'cm')}`,
			],
			// the ratio upside down; the descent in place of the height; the atmospheric pressure forgotten in p2
			answer: options(rng, h2, [h1.mul(p).div(P_ATM), h1.sub(h2), h1.mul(P_ATM).div(extra)], 'cm', SIG3),
			params: { S: S.toString(), m: m.toString(), h1: h1.toString() },
			scene: cylinder(
				{ altezza: h1.num / h1.den, scala: 44, etichette: { h: `h_1 = ${lab(h1, ONE_DEC)} cm`, S: `S = ${lab(S, { kind: 'int' })} cm²` } },
				`Un cilindro verticale con il gas chiuso da un pistone di area ${lab(S, { kind: 'int' })} centimetri quadrati, a ${lab(h1, ONE_DEC)} centimetri dal fondo, senza niente sopra`,
			),
			solutionScene: cylinder(
				{ altezza: h2.num / h2.den, scala: 44, corpo: true, prima: h1.num / h1.den, etichette: { h: `h_2 = ${lab(h2, SIG3)} cm`, corpo: `m = ${lab(m, ONE_DEC)} kg` } },
				`Lo stesso cilindro con il corpo di ${lab(m, ONE_DEC)} chilogrammi sul pistone, che è sceso a ${lab(h2, SIG3)} centimetri dal fondo; una linea tratteggiata segna dov'era prima`,
			),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: on the same isotherm

const PA = [120, 150, 180, 240, 300, 360, 450, 600];
const VA = [q(3, 2), q(2), q(12, 5), q(3), q(4), q(6), q(8)];
const KS = [q(2), q(3), q(1, 2), q(1, 3), q(3, 2), q(2, 3), q(4), q(1, 4)];

type State = { p: R; V: R };
const fine = (s: State) => s.p.den === 1 && s.p.num >= 30 && s.p.num <= 1800 && s.V.mul(q(10)).den === 1 && s.V.compare(q(1, 2)) >= 0 && s.V.compare(q(30)) <= 0;
const stateTex = (s: State) => `${wu(fmtExact(s.p), 'kPa')};\\ ${wu(fmt(s.V, ONE_DEC), 'L')}`;
const stateOption = (s: State): ChoiceOption => ({ latex: stateTex(s), values: [plainDec(s.p.mul(s.V)), plainDec(s.p), plainDec(s.V)] });

function level4(rng: Rng): Built {
	for (;;) {
		const A: State = { p: q(rng.pick(PA)), V: rng.pick(VA) };
		const k = rng.pick(KS);
		const right: State = { p: A.p.mul(k), V: A.V.div(k) };
		const both: State = { p: A.p.mul(k), V: A.V.mul(k) };
		const inverse: State = { p: A.p.div(k), V: A.V.div(k) };
		const k2 = rng.pick([k.mul(q(3, 2)), k.mul(q(2, 3)), k.mul(q(2)), k.div(q(2))]);
		const other: State = { p: A.p.mul(k2), V: A.V.div(k) };
		const all = [right, both, inverse, other];
		if (!all.every(fine)) continue;
		const C = A.p.mul(A.V);
		if (new Set(all.map((s) => plainDec(s.p.mul(s.V)))).size !== 4) continue;
		const order = shuffle(rng, [0, 1, 2, 3]);
		const answer: ChoiceAnswer = { kind: 'choice', options: order.map((i) => stateOption(all[i])), correct: order.indexOf(0) };
		const wrong = order.filter((i) => i !== 0).map((i) => fmtExact(all[i].p.mul(all[i].V)));
		return {
			prompt: 'Scegli lo stato che sta sulla stessa isoterma.',
			problem: textBlock(`Un gas è nello stato $A$, con pressione ${pu(fmtExact(A.p), 'kPa')} e volume ${pv(A.V, 'L', ONE_DEC)}. In quale di questi stati lo stesso gas ha la temperatura che ha in $A$?`),
			solution: stateTex(right),
			steps: [
				`p_A\\,V_A = ${wu(fmtExact(A.p), 'kPa')} \\cdot ${wu(fmt(A.V, ONE_DEC), 'L')} = ${wu(fmtExact(C), 'J')}`,
				`${wu(fmtExact(right.p), 'kPa')} \\cdot ${wu(fmt(right.V, ONE_DEC), 'L')} = ${wu(fmtExact(C), 'J')} \\quad \\text{(stesso prodotto, stessa isoterma)}`,
				`\\text{Negli altri stati il prodotto vale } ${wrong.join('\\text{, }')}\\,\\text{J}`,
			],
			answer,
			params: { pA: A.p.toString(), VA: A.V.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the bubble in the lake

function level5(rng: Rng): Built {
	for (;;) {
		const h = q(rng.int(4, 45));
		const V1 = q(rng.int(11, 99), 10);
		if (h.num % 10 === 0 || V1.num % 10 === 0) continue;
		const water = q(1000).mul(G).mul(h);
		const p1 = P_ATM.add(water);
		const V2 = V1.mul(p1).div(P_ATM);
		if (tie(V2, SIG2) || ambiguous(V2, SIG2)) continue;
		return {
			prompt: 'Trova il volume della bolla in superficie.',
			problem: textBlock(
				`Sul fondo di un lago, a ${pu(fmtExact(h), 'm')} di profondità, si stacca una bolla d'aria di ${pv(V1, 'cm3', SIG2)}. Che volume ha quando arriva in superficie, se la temperatura dell'acqua è la stessa a tutte le profondità? Usa $d = 1000\\,\\text{kg/m}^3$, $g = 9{,}8\\,\\text{m/s}^2$ e $p_0 = ${wu('1{,}01 \\cdot 10^{5}', 'Pa')}$.`,
			),
			solution: `V_2 \\approx ${wu(fmt(V2, SIG2), 'cm3')}`,
			steps: [
				`p_1 = p_0 + d\\,g\\,h = ${fmtExact(P_ATM)} + 1000 \\cdot 9{,}8 \\cdot ${fmtExact(h)} = ${wu(fmtExact(p1), 'Pa')}`,
				'p_2 = p_0 \\quad \\text{(in superficie)}',
				`V_2 = \\dfrac{p_1\\,V_1}{p_2} = \\dfrac{${wu(fmtExact(p1), 'Pa')} \\cdot ${wu(fmt(V1, SIG2), 'cm3')}}{${wu(fmtExact(P_ATM), 'Pa')}} \\approx ${wu(fmt(V2, SIG2), 'cm3')}`,
			],
			// the atmospheric pressure forgotten on the bottom; the ratio upside down
			answer: options(rng, V2, [V1.mul(water).div(P_ATM), V1.mul(P_ATM).div(p1)], 'cm3', SIG2),
			params: { h: h.toString(), V1: V1.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 1 || sample.level === 3) && !sample.scene) v.push('manca la scena');
	if (sample.level === 3 && !sample.solutionScene) v.push('manca la scena della soluzione');
	return v;
}

export const fisLeggeBoyle: Generator = {
	id: ID,
	title: 'La legge di Boyle',
	levels: {
		1: { label: 'La pressione sotto il pistone', constraints: ['p = p0 + m g / S', 'area in cm² da convertire', 'scena cilindro-pistone'] },
		2: { label: 'La pressione finale', constraints: ['p2 = p1 V1 / V2', 'kilopascal e litri'] },
		3: { label: 'Dove si ferma il pistone', constraints: ['p2 dal corpo sul pistone', 'p1 h1 = p2 h2', 'scena cilindro-pistone'] },
		4: { label: 'Sulla stessa isoterma', constraints: ['stesso prodotto p V', 'quattro stati tra cui scegliere'] },
		5: { label: 'La bolla nel lago', constraints: ['p1 = p0 + d g h', 'V2 = p1 V1 / p0'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisLeggeBoyle;
