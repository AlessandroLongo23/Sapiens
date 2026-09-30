/**
 * L'accelerazione centripeta. Spec: specs/exercises/fis-accelerazione-centripeta.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/48-fis-accelerazione-centripeta.md), each one step
 * harder: a_c = v²/r with the speed in m/s; the same with the speed in km/h, to convert first; a_c = 4π²r/T² from the
 * period; the greatest speed for a given acceleration, v = √(a r); how the acceleration changes when the speed, the
 * radius at the same speed, or the radius at the same period changes. Data with two significant figures, answers with
 * two. Distractors from the lesson's warnings: the square forgotten, km/h not converted, the speed taken for the
 * acceleration, the linear rule for the quadratic one.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, TWO_PI, checkCommon, choiceOf, cutQ, dec2, decTex, generateWith, near, pqU as pq, qOptU as qOpt, qu as qty, r2, rel, res, t, unitOpts } from '../fis-moti-piano';

export const ID = 'fis-accelerazione-centripeta';

const A = unitOpts('m/s^2');
const MS = unitOpts('m/s');
const aq = (s: string) => qty(s, 'm/s^2');

// ---------------------------------------------------------------------------
// Level 1: a = v²/r

function level1(rng: Rng): Built {
	for (;;) {
		const v = dec2(rng, 2.0, 30), r = dec2(rng, 11, 99);
		const V = Number(v), R = Number(r);
		const a = (V * V) / R;
		const ans = r2(a);
		// a car: at most about g
		if (ans === null || a < 0.1 || a > 9.9) continue;
		return {
			prompt: "Trova l'accelerazione centripeta.",
			problem: textBlock(`Un'auto percorre una curva di raggio ${pq(r, 'm')} alla velocità costante di ${pq(v, 'm/s')}. Quanto vale la sua accelerazione centripeta?`),
			solution: `a_c ${rel(a, ans)} ${aq(ans)}`,
			steps: [`a_c = \\dfrac{v^2}{r} = \\dfrac{(${qty(v, 'm/s')})^2}{${qty(r, 'm')}} = ${res(a, ans, 'm/s^2')}`],
			// the square forgotten; the fraction upside down; v²·r (when it fits)
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), A([r2(V / R), r2(R / (V * V)), r2(V * V * R)]), near(a, 'm/s^2')),
			params: { v, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the speed in km/h

function level2(rng: Rng): Built {
	for (;;) {
		const v = dec2(rng, 11, 99), r = dec2(rng, 11, 99);
		const K = Number(v), R = Number(r);
		const ms = K / 3.6;
		const a = (ms * ms) / R;
		const ans = r2(a);
		if (ans === null || a < 0.1 || a > 9.9) continue;
		return {
			prompt: "Trova l'accelerazione centripeta.",
			problem: textBlock(`Un'auto percorre una rotonda di raggio ${pq(r, 'm')} alla velocità costante di ${pq(v, 'km/h')}. Quanto vale la sua accelerazione centripeta?`),
			solution: `a_c ${rel(a, ans)} ${aq(ans)}`,
			steps: [
				`v = \\dfrac{${decTex(v)}}{3{,}6}\\,\\text{m/s} = ${cutQ(ms, 'm/s')}`,
				`a_c = \\dfrac{v^2}{r} = \\dfrac{(${cutQ(ms, 'm/s')})^2}{${qty(r, 'm')}} = ${res(a, ans, 'm/s^2')}`,
			],
			// km/h not converted; the square forgotten; converted only once (v²/3,6)
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), A([r2((K * K) / R), r2(ms / R), r2((K * K) / 3.6 / R)]), near(a, 'm/s^2')),
			params: { v, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: from the period

function level3(rng: Rng): Built {
	for (;;) {
		const r = dec2(rng, 0.2, 2.0), T = dec2(rng, 0.3, 3.0);
		const R = Number(r), P = Number(T);
		const a = (4 * Math.PI * Math.PI * R) / (P * P);
		const ans = r2(a);
		if (ans === null || a < 0.5) continue;
		return {
			prompt: "Trova l'accelerazione centripeta.",
			problem: textBlock(`Un sasso legato a una corda è fatto girare su una circonferenza orizzontale di raggio ${pq(r, 'm')}, e fa un giro in ${pq(T, 's')}. Quanto vale la sua accelerazione centripeta?`),
			solution: `a_c ${rel(a, ans)} ${aq(ans)}`,
			steps: [
				`v = \\dfrac{2\\pi r}{T} = \\dfrac{2\\pi \\cdot ${qty(r, 'm')}}{${qty(T, 's')}} = ${cutQ((TWO_PI * R) / P, 'm/s')}`,
				`a_c = \\dfrac{v^2}{r} = \\dfrac{4\\pi^2 r}{T^2} = ${res(a, ans, 'm/s^2')}`,
			],
			// the speed for the acceleration; T not squared; 2π for 4π²
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), A([r2((TWO_PI * R) / P), r2((4 * Math.PI * Math.PI * R) / P), r2((TWO_PI * R) / (P * P))]), near(a, 'm/s^2')),
			params: { r, T },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the greatest speed

function level4(rng: Rng): Built {
	for (;;) {
		const a = dec2(rng, 1.1, 9.9), r = dec2(rng, 11, 99);
		const Aa = Number(a), R = Number(r);
		const v = Math.sqrt(Aa * R);
		const ans = r2(v);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità massima.',
			problem: textBlock(`Le gomme di un'auto permettono un'accelerazione centripeta di ${pq(a, 'm/s^2')} al massimo. Con quale velocità massima l'auto può percorrere una curva di raggio ${pq(r, 'm')}?`),
			solution: `v ${rel(v, ans)} ${qty(ans, 'm/s')}`,
			steps: [`a_c = \\dfrac{v^2}{r} \\quad\\Rightarrow\\quad v = \\sqrt{a_c\\,r} = \\sqrt{${qty(a, 'm/s^2')} \\cdot ${qty(r, 'm')}} = ${res(v, ans, 'm/s')}`],
			// the root forgotten; √(r/a)
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(Aa * R), r2(Math.sqrt(R / Aa))]), near(v, 'm/s')),
			params: { a, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: how the acceleration changes

type Change = 'velocità' | 'raggio' | 'periodo';
const FACTORS = [
	{ k: 2, f: 'doppia', m: 'doppio' },
	{ k: 3, f: 'tripla', m: 'triplo' },
	{ k: 0.5, f: 'dimezzata', m: 'dimezzato' },
];

function level5(rng: Rng): Built {
	const kind: Change = rng.pick(['velocità', 'raggio', 'periodo'] as const);
	for (;;) {
		const a1 = dec2(rng, 0.5, 9.9);
		const A1 = Number(a1);
		const F = rng.pick(FACTORS);
		const k = F.k;
		const a2 = kind === 'velocità' ? A1 * k * k : kind === 'raggio' ? A1 / k : A1 * k;
		const ans = r2(a2);
		if (ans === null) continue;
		const problem =
			kind === 'velocità'
				? `Un'auto percorre una curva con un'accelerazione centripeta di ${pq(a1, 'm/s^2')}. Quanto vale la sua accelerazione se percorre la stessa curva a velocità ${F.f}?`
				: kind === 'raggio'
					? `Un'auto percorre una curva con un'accelerazione centripeta di ${pq(a1, 'm/s^2')}. Quanto vale la sua accelerazione se percorre, alla stessa velocità, una curva di raggio ${F.m}?`
					: `Su una giostra un bambino ha un'accelerazione centripeta di ${pq(a1, 'm/s^2')}. Quanto vale l'accelerazione di un bambino sulla stessa giostra, a una distanza dal centro ${F.f}?`;
		const kt = decTex(String(k));
		const step =
			kind === 'velocità'
				? [t('Stessa curva, stesso raggio:'), `a_c = \\dfrac{v^2}{r} \\quad\\Rightarrow\\quad a_2 = a_1 \\cdot ${kt}^2`, `a_2 = ${aq(a1)} \\cdot ${decTex(String(k * k))} = ${res(a2, ans, 'm/s^2')}`]
				: kind === 'raggio'
					? [t('Stessa velocità:'), `a_c = \\dfrac{v^2}{r} \\quad\\Rightarrow\\quad a_2 = \\dfrac{a_1}{${kt}}`, `a_2 = \\dfrac{${aq(a1)}}{${kt}} = ${res(a2, ans, 'm/s^2')}`]
					: [t('Sulla stessa giostra la velocità angolare è la stessa:'), `a_c = \\omega^2 r \\quad\\Rightarrow\\quad a_2 = a_1 \\cdot ${kt}`, `a_2 = ${aq(a1)} \\cdot ${kt} = ${res(a2, ans, 'm/s^2')}`];
		return {
			prompt: "Trova la nuova accelerazione.",
			problem: textBlock(problem),
			solution: `a_2 ${rel(a2, ans)} ${aq(ans)}`,
			steps: step,
			// the other rules: proportional, quadratic, inverse, inverse square
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), A([r2(A1 * k), r2(A1 * k * k), r2(A1 / k), r2(A1 / (k * k))]), near(a2, 'm/s^2')),
			params: { case: kind, a1, k },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisAccelerazioneCentripeta: Generator = {
	id: ID,
	title: "L'accelerazione centripeta",
	levels: {
		1: { label: 'Dalla velocità e dal raggio', constraints: ['a = v²/r, velocità in m/s'] },
		2: { label: 'Con la velocità in km/h', constraints: ['la velocità va convertita prima'] },
		3: { label: 'Dal periodo', constraints: ['a = 4π²r/T²'] },
		4: { label: 'La velocità massima in curva', constraints: ['v = √(a r)'] },
		5: { label: "Come cambia l'accelerazione", constraints: ['velocità, raggio a velocità fissa, raggio a periodo fisso: un terzo ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisAccelerazioneCentripeta;
