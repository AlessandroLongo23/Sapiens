/**
 * Le leggi di Gay-Lussac. Spec: specs/exercises/fis-leggi-gay-lussac.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/103-fis-leggi-gay-lussac.md), each one step harder: the
 * volume at t degrees Celsius from the volume at 0 °C, V = V0 (1 + t/273); the temperature at which the pressure of a
 * gas in a rigid vessel reaches a given value, from the pressure at 0 °C (the second law, solved for t); the first law
 * between two states with the temperatures to turn into kelvin; the second law solved for the final temperature, to
 * give back in degrees Celsius; how far a free piston rises when the gas is heated (heights in place of volumes, and
 * a difference). Multiple choice with the unit in the option and the lesson's mistakes: the ratio of the Celsius
 * temperatures, the "1 +" forgotten, the initial volume used as V0, kelvin given as degrees Celsius.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type Fmt, type R, INT, SIG2, SIG3, ZERO_C, ambiguous, checkCommon, cylinder, fmt, fmtExact, generateWith, options, pu, q, tie, wu } from '../fis-gas-leggi';

export const ID = 'fis-leggi-gay-lussac';

const ONE_DEC: Fmt = { kind: 'fixed', d: 1 };
const lab = (r: R, f: Fmt) => fmt(r, f).replace('{,}', ',').replace('-', '−');
/** A value with three figures and two decimals, 1,01 to 9,99, not ending in zero. */
function hundredths(rng: Rng): R {
	for (;;) {
		const k = rng.int(101, 999);
		if (k % 10) return q(k, 100);
	}
}
/** A whole pressure in kilopascals between lo and hi, not ending in zero. */
function kpa(rng: Rng, lo: number, hi: number): R {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return q(k);
	}
}
const kelvin = (t: R) => t.add(ZERO_C);
const toK = (name: string, t: R) => `${name} = ${fmtExact(t)} + 273 = ${wu(fmtExact(kelvin(t)), 'K')}`;

// ---------------------------------------------------------------------------
// Level 1: the volume, starting from 0 °C

function level1(rng: Rng): Built {
	for (;;) {
		const V0 = hundredths(rng);
		const t = q(rng.int(10, 200));
		const V = V0.mul(kelvin(t)).div(ZERO_C);
		if (tie(V, SIG3) || ambiguous(V, SIG3)) continue;
		return {
			prompt: 'Trova il volume del gas.',
			problem: textBlock(`Un gas occupa ${pu(fmt(V0, SIG3), 'L')} a ${pu('0', 'C')}. Viene scaldato a pressione costante fino a ${pu(fmtExact(t), 'C')}. Che volume occupa?`),
			solution: `V \\approx ${wu(fmt(V, SIG3), 'L')}`,
			steps: ['V = V_0\\,(1 + \\alpha\\,t), \\quad \\alpha = \\dfrac{1}{273}\\,^\\circ\\text{C}^{-1}', `V = ${wu(fmt(V0, SIG3), 'L')} \\cdot \\left(1 + \\dfrac{${fmtExact(t)}}{273}\\right) \\approx ${wu(fmt(V, SIG3), 'L')}`],
			// the "1 +" forgotten; 1/100 in place of 1/273; the minus sign
			answer: options(rng, V, [V0.mul(t).div(ZERO_C), V0.mul(q(100).add(t)).div(q(100)), V0.mul(ZERO_C.sub(t)).div(ZERO_C)], 'L', SIG3),
			params: { V0: V0.toString(), t: t.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the temperature from the pressure

function level2(rng: Rng): Built {
	for (;;) {
		const p0 = kpa(rng, 101, 299);
		const p = kpa(rng, p0.num + 6, 2 * p0.num);
		const t = ZERO_C.mul(p.div(p0).sub(q(1)));
		if (t.compare(q(15)) < 0 || t.compare(q(270)) > 0 || tie(t, INT)) continue;
		return {
			prompt: 'Trova la temperatura.',
			problem: textBlock(`Un recipiente rigido contiene gas alla pressione di ${pu(fmtExact(p0), 'kPa')} quando è a ${pu('0', 'C')}. A quale temperatura la pressione arriva a ${pu(fmtExact(p), 'kPa')}?`),
			solution: `t \\approx ${wu(fmt(t, INT), 'C')}`,
			steps: [
				'p = p_0\\,(1 + \\alpha\\,t) \\quad\\Rightarrow\\quad t = \\dfrac{1}{\\alpha}\\left(\\dfrac{p}{p_0} - 1\\right)',
				`t = 273\\,^\\circ\\text{C} \\cdot \\left(\\dfrac{${wu(fmtExact(p), 'kPa')}}{${wu(fmtExact(p0), 'kPa')}} - 1\\right) \\approx ${wu(fmt(t, INT), 'C')}`,
			],
			// the "− 1" forgotten; 100 in place of 273; the kelvin given as degrees Celsius
			answer: options(rng, t, [ZERO_C.mul(p).div(p0), q(100).mul(p.div(p0).sub(q(1))), t.add(ZERO_C)], 'C', INT, false, q(10)),
			params: { p0: p0.toString(), p: p.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the first law in kelvin

function level3(rng: Rng): Built {
	for (;;) {
		const V1 = hundredths(rng);
		const t1 = q(rng.int(5, 40));
		const t2 = q(rng.int(-40, 250));
		if (Math.abs(t2.num - t1.num) < 20 || t2.num === 0) continue;
		const V2 = V1.mul(kelvin(t2)).div(kelvin(t1));
		if (tie(V2, SIG3) || ambiguous(V2, SIG3)) continue;
		const verb = t2.compare(t1) > 0 ? 'scaldato' : 'raffreddato';
		return {
			prompt: 'Trova il volume finale.',
			problem: textBlock(`Un gas, sotto un pistone libero di scorrere, occupa ${pu(fmt(V1, SIG3), 'L')} a ${pu(fmtExact(t1), 'C')}. A pressione costante viene ${verb} fino a ${pu(fmtExact(t2), 'C')}. Che volume occupa?`),
			solution: `V_2 \\approx ${wu(fmt(V2, SIG3), 'L')}`,
			steps: [
				`${toK('T_1', t1)}, \\quad ${toK('T_2', t2)}`,
				'\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}',
				`V_2 = V_1 \\cdot \\dfrac{T_2}{T_1} = ${wu(fmt(V1, SIG3), 'L')} \\cdot \\dfrac{${wu(fmtExact(kelvin(t2)), 'K')}}{${wu(fmtExact(kelvin(t1)), 'K')}} \\approx ${wu(fmt(V2, SIG3), 'L')}`,
			],
			// the ratio of the Celsius temperatures; the ratio upside down; the initial volume used as V0
			answer: options(rng, V2, [V1.mul(t2).div(t1), V1.mul(kelvin(t1)).div(kelvin(t2)), V1.mul(kelvin(t2)).div(ZERO_C)], 'L', SIG3),
			params: { V1: V1.toString(), t1: t1.toString(), t2: t2.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the final temperature at constant volume

function level4(rng: Rng): Built {
	for (;;) {
		const p1 = kpa(rng, 101, 299);
		const p2 = kpa(rng, p1.num + 11, 2 * p1.num);
		const t1 = q(rng.int(5, 35));
		const T2 = kelvin(t1).mul(p2).div(p1);
		const t2 = T2.sub(ZERO_C);
		if (p2.div(p1).compare(q(11, 10)) < 0 || tie(t2, INT)) continue;
		return {
			prompt: 'Trova la temperatura finale.',
			problem: textBlock(`Una bombola rigida contiene gas alla pressione di ${pu(fmtExact(p1), 'kPa')} a ${pu(fmtExact(t1), 'C')}. A quale temperatura, in gradi Celsius, la pressione raggiunge ${pu(fmtExact(p2), 'kPa')}?`),
			solution: `t_2 \\approx ${wu(fmt(t2, INT), 'C')}`,
			steps: [
				toK('T_1', t1),
				'\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}',
				`T_2 = T_1 \\cdot \\dfrac{p_2}{p_1} = ${wu(fmtExact(kelvin(t1)), 'K')} \\cdot \\dfrac{${wu(fmtExact(p2), 'kPa')}}{${wu(fmtExact(p1), 'kPa')}} \\approx ${wu(fmt(T2, INT), 'K')}`,
				`t_2 = T_2 - 273 \\approx ${wu(fmt(t2, INT), 'C')}`,
			],
			// the kelvin given as degrees Celsius; the ratio of the Celsius temperatures; the ratio upside down
			answer: options(rng, t2, [T2, t1.mul(p2).div(p1), kelvin(t1).mul(p1).div(p2).sub(ZERO_C)], 'C', INT, true, q(10)),
			params: { p1: p1.toString(), p2: p2.toString(), t1: t1.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: how far the piston rises

function level5(rng: Rng): Built {
	for (;;) {
		const h1 = q(rng.int(150, 400), 10);
		const t1 = q(rng.int(10, 40));
		const t2 = t1.add(q(rng.int(30, 250)));
		const h2 = h1.mul(kelvin(t2)).div(kelvin(t1));
		const dh = h2.sub(h1);
		if (dh.compare(q(1)) < 0 || tie(dh, SIG2) || ambiguous(dh, SIG2) || tie(h2, SIG3)) continue;
		const h1Tex = fmt(h1, ONE_DEC);
		const scala = Math.max(45, (h2.num / h2.den) * 1.05);
		return {
			prompt: 'Trova di quanto sale il pistone.',
			problem: textBlock(`Un cilindro con un pistone libero di scorrere contiene gas a ${pu(fmtExact(t1), 'C')}, e il pistone è a ${pu(h1Tex, 'cm')} dal fondo. Il gas viene scaldato fino a ${pu(fmtExact(t2), 'C')}. Di quanto sale il pistone?`),
			solution: `\\Delta h \\approx ${wu(fmt(dh, SIG2), 'cm')}`,
			steps: [
				`${toK('T_1', t1)}, \\quad ${toK('T_2', t2)}`,
				'\\dfrac{h_1}{T_1} = \\dfrac{h_2}{T_2} \\quad \\text{(pressione costante, l\'area si semplifica)}',
				`h_2 = h_1 \\cdot \\dfrac{T_2}{T_1} = ${wu(h1Tex, 'cm')} \\cdot \\dfrac{${wu(fmtExact(kelvin(t2)), 'K')}}{${wu(fmtExact(kelvin(t1)), 'K')}} \\approx ${wu(fmt(h2, SIG3), 'cm')}`,
				`\\Delta h = h_2 - h_1 \\approx ${wu(fmt(dh, SIG2), 'cm')}`,
			],
			// the final height in place of the rise; the Celsius temperature in the denominator; T2 in the denominator
			answer: options(rng, dh, [h2, h1.mul(t2.sub(t1)).div(t1), h1.mul(t2.sub(t1)).div(kelvin(t2))], 'cm', SIG2),
			params: { h1: h1.toString(), t1: t1.toString(), t2: t2.toString() },
			scene: cylinder(
				{ altezza: h1.num / h1.den, scala, etichette: { h: `h_1 = ${lab(h1, ONE_DEC)} cm`, gas: `t_1 = ${lab(t1, INT)} °C` } },
				`Un cilindro verticale con il gas a ${lab(t1, INT)} gradi Celsius chiuso da un pistone libero, a ${lab(h1, ONE_DEC)} centimetri dal fondo`,
			),
			solutionScene: cylinder(
				{ altezza: h2.num / h2.den, scala, prima: h1.num / h1.den, caldo: true, etichette: { h: `h_2 = ${lab(h2, SIG3)} cm`, gas: `t_2 = ${lab(t2, INT)} °C` } },
				`Lo stesso cilindro con il gas a ${lab(t2, INT)} gradi Celsius: il pistone è salito a ${lab(h2, SIG3)} centimetri dal fondo, e una linea tratteggiata segna dov'era prima`,
			),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 5 && (!sample.scene || !sample.solutionScene)) v.push('manca la scena');
	return v;
}

export const fisLeggiGayLussac: Generator = {
	id: ID,
	title: 'Le leggi di Gay-Lussac',
	levels: {
		1: { label: 'Il volume partendo da 0 °C', constraints: ['V = V0 (1 + t/273)', 'pressione costante'] },
		2: { label: 'La temperatura dalla pressione', constraints: ['t = 273 (p/p0 − 1)', 'volume costante'] },
		3: { label: 'Il volume con i kelvin', constraints: ['V1/T1 = V2/T2', 'temperature in gradi Celsius da convertire'] },
		4: { label: 'La temperatura finale della bombola', constraints: ['p1/T1 = p2/T2', 'risposta in gradi Celsius'] },
		5: { label: 'Di quanto sale il pistone', constraints: ['h1/T1 = h2/T2', 'Δh = h2 − h1', 'scena cilindro-pistone'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisLeggiGayLussac;
