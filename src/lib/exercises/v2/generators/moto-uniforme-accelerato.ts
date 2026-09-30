/**
 * Il moto uniformemente accelerato. Spec: specs/exercises/moto-uniforme-accelerato.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/42-moto-uniforme-accelerato.md), each one step harder: the
 * velocity after a time (v = v0 + a t, speeding up or braking); the distance from rest (s = a t²/2); the full law
 * (Δs = v0 t + a t²/2, speeding up or braking); the relation without time (v² = v0² + 2 a Δs); the braking distance
 * or time from a speed in km/h; the stopping distance with the reaction time. Data with two significant figures,
 * answers rounded to two (never too close to a rounding boundary, always under 100). Distractors from the lesson's
 * warnings: the half forgotten, the square on the wrong term, the sign of a braking acceleration, km/h not converted,
 * the square root of a sum split, reaction or braking left out.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, t } from '../vettori';
import { type Built, checkCommon, generateWith, opts, r2 } from '../fisica-equilibrio';
import { acc, f3, mOpt, ms, msOpt, sOpt, two } from '../fis-moto-accelerato';

export const ID = 'moto-uniforme-accelerato';

const BODIES = [
	{ name: "Un'auto", e: 'a' },
	{ name: 'Uno scooter', e: 'o' },
	{ name: 'Un treno', e: 'o' },
	{ name: 'Una moto', e: 'a' },
];
/** Fallback options: the answer moved by 20% and 40% either way. */
const fall = (x: number, make: (s: string) => ReturnType<typeof mOpt>) => opts([r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)], make);
/** r2 of a positive value; a negative distractor (a speed or a distance below zero) would give itself away. */
const rp = (x: number) => (x > 0 ? r2(x) : null);
const kmh = (s: string) => `${decTex(s)}\\,\\text{km/h}`;
const REACTION = ['0.55', '0.65', '0.75', '0.85', '0.95', '1.1', '1.2', '1.3', '1.4', '1.5'];

// ---------------------------------------------------------------------------
// Level 1: the velocity after a time

function level1(rng: Rng): Built {
	const brake = rng.next() < 0.5;
	for (;;) {
		const v0 = two(rng, 5, 40), a = two(rng, 1.1, 4.9), tt = two(rng, 1.1, 20);
		const V0 = Number(v0), A = Number(a), T = Number(tt);
		const v = brake ? V0 - A * T : V0 + A * T;
		if (brake && v < 0.2 * V0) continue;
		const ans = r2(v);
		if (ans === null || v < 1) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(
				brake
					? `${b.name} viaggia a ${pq(v0, 'm/s')} e frena con un'accelerazione costante di modulo $${acc(a)}$. Che velocità ha dopo ${pq(tt, 's')}?`
					: `${b.name} viaggia a ${pq(v0, 'm/s')} e accelera per ${pq(tt, 's')} con un'accelerazione costante di $${acc(a)}$. Che velocità raggiunge?`,
			),
			solution: `v \\approx ${ms(ans)}`,
			steps: [
				brake ? t("Con l'asse nel verso del moto, in frenata l'accelerazione è negativa: ") + `a = -${acc(a)}` : t("L'accelerazione è positiva, nel verso del moto."),
				`v = v_0 + a\\,t = ${ms(v0)} ${brake ? '-' : '+'} ${acc(a)} \\cdot ${decTex(tt)}\\,\\text{s} = ${f3(v)}\\,\\text{m/s} \\approx ${ms(ans)}`,
			],
			// the time forgotten; v0 forgotten; the sign of the acceleration swapped
			answer: choiceOf(rng, msOpt(ans), opts([rp(brake ? V0 - A : V0 + A), rp(A * T), rp(brake ? V0 + A * T : V0 - A * T)], msOpt), fall(v, msOpt)),
			params: { case: brake ? 'frena' : 'accelera', v0, a, t: tt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: from rest

function level2(rng: Rng): Built {
	for (;;) {
		const a = two(rng, 1.1, 6), tt = two(rng, 1.1, 12);
		const A = Number(a), T = Number(tt);
		const s = 0.5 * A * T * T;
		const ans = r2(s);
		if (ans === null || s < 1) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: 'Trova lo spazio percorso.',
			problem: textBlock(`${b.name} parte da ferm${b.e} con un'accelerazione costante di $${acc(a)}$. Quanta strada percorre nei primi ${pq(tt, 's')}?`),
			solution: `s \\approx ${decTex(ans)}\\,\\text{m}`,
			steps: [
				t('Partendo da fermo, ') + ` v_0 = 0 ` + t(' e la legge oraria diventa ') + ` s = \\tfrac{1}{2}a\\,t^2`,
				`s = \\tfrac{1}{2} \\cdot ${acc(a)} \\cdot (${decTex(tt)}\\,\\text{s})^2 = ${f3(s)}\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`,
			],
			// the half forgotten; the square forgotten; the velocity a t
			answer: choiceOf(rng, mOpt(ans), opts([r2(A * T * T), r2(0.5 * A * T), r2(A * T)], mOpt), fall(s, mOpt)),
			params: { case: 'da-fermo', a, t: tt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the full law

function level3(rng: Rng): Built {
	const brake = rng.next() < 0.5;
	for (;;) {
		const v0 = two(rng, 1.1, 20), a = two(rng, 1.1, 4.9), tt = two(rng, 1.1, 9.9);
		const V0 = Number(v0), A = Number(a), T = Number(tt);
		const sg = brake ? -1 : 1;
		if (brake && V0 - A * T < 0.2 * V0) continue;
		const s = V0 * T + sg * 0.5 * A * T * T;
		const ans = r2(s);
		if (ans === null || s < 1) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: 'Trova lo spazio percorso.',
			problem: textBlock(
				brake
					? `${b.name} viaggia a ${pq(v0, 'm/s')} e frena con un'accelerazione costante di modulo $${acc(a)}$. Quanta strada percorre nei primi ${pq(tt, 's')} di frenata?`
					: `${b.name} viaggia a ${pq(v0, 'm/s')} e accelera per ${pq(tt, 's')} con un'accelerazione costante di $${acc(a)}$. Quanta strada percorre in quel tempo?`,
			),
			solution: `\\Delta s \\approx ${decTex(ans)}\\,\\text{m}`,
			steps: [
				brake ? t("In frenata, con l'asse nel verso del moto: ") + ` a = -${acc(a)}` : t("L'accelerazione è positiva, nel verso del moto."),
				`\\Delta s = v_0\\,t + \\tfrac{1}{2}a\\,t^2 = ${ms(v0)} \\cdot ${decTex(tt)}\\,\\text{s} ${brake ? '-' : '+'} \\tfrac{1}{2} \\cdot ${acc(a)} \\cdot (${decTex(tt)}\\,\\text{s})^2`,
				`\\Delta s = ${f3(V0 * T)}\\,\\text{m} ${brake ? '-' : '+'} ${f3(0.5 * A * T * T)}\\,\\text{m} = ${f3(s)}\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`,
			],
			// the half forgotten; the acceleration ignored; the sign swapped
			answer: choiceOf(rng, mOpt(ans), opts([rp(V0 * T + sg * A * T * T), rp(V0 * T), rp(V0 * T - sg * 0.5 * A * T * T)], mOpt), fall(s, mOpt)),
			params: { case: brake ? 'frena' : 'accelera', v0, a, t: tt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: without the time

function level4(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		const b = rng.pick(BODIES);
		const v0 = two(rng, 1.1, 20), a = two(rng, 1.1, 4.9);
		const V0 = Number(v0), A = Number(a);
		if (askV) {
			const ds = two(rng, 1.1, 99), D = Number(ds);
			const v = Math.sqrt(V0 * V0 + 2 * A * D);
			const ans = r2(v);
			if (ans === null) continue;
			return {
				prompt: 'Trova la velocità finale.',
				problem: textBlock(`${b.name} viaggia a ${pq(v0, 'm/s')} e accelera con un'accelerazione costante di $${acc(a)}$ per un tratto di ${pq(ds, 'm')}. Che velocità ha alla fine del tratto?`),
				solution: `v \\approx ${ms(ans)}`,
				steps: [
					t('Il tempo non è dato: si usa ') + ` v^2 = v_0^2 + 2a\\,\\Delta s`,
					`v^2 = (${ms(v0)})^2 + 2 \\cdot ${acc(a)} \\cdot ${decTex(ds)}\\,\\text{m} = ${f3(V0 * V0 + 2 * A * D)}\\,\\text{m}^2/\\text{s}^2`,
					`v = \\sqrt{${f3(V0 * V0 + 2 * A * D)}}\\,\\text{m/s} = ${f3(v)}\\ldots\\,\\text{m/s} \\approx ${ms(ans)}`,
				],
				// v0 forgotten; the 2 forgotten; the square root split
				answer: choiceOf(rng, msOpt(ans), opts([r2(Math.sqrt(2 * A * D)), r2(Math.sqrt(V0 * V0 + A * D)), r2(V0 + Math.sqrt(2 * A * D))], msOpt), fall(v, msOpt)),
				params: { case: 'velocita', v0, a, ds },
			};
		}
		const v1 = two(rng, 1.1, 40), V1 = Number(v1);
		if (V1 < 1.3 * V0) continue;
		const s = (V1 * V1 - V0 * V0) / (2 * A);
		const ans = r2(s);
		if (ans === null || s < 1) continue;
		return {
			prompt: 'Trova lo spazio percorso.',
			problem: textBlock(`${b.name} accelera in modo uniforme da ${pq(v0, 'm/s')} a ${pq(v1, 'm/s')}, con un'accelerazione di $${acc(a)}$. Quanta strada percorre mentre accelera?`),
			solution: `\\Delta s \\approx ${decTex(ans)}\\,\\text{m}`,
			steps: [
				t('Il tempo non è dato: da ') + ` v^2 = v_0^2 + 2a\\,\\Delta s ` + t(' si ricava lo spostamento.'),
				`\\Delta s = \\dfrac{v^2 - v_0^2}{2a} = \\dfrac{(${ms(v1)})^2 - (${ms(v0)})^2}{2 \\cdot ${acc(a)}} = ${f3(s)}\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`,
			],
			// the 2 forgotten; v0 forgotten; the difference squared
			answer: choiceOf(rng, mOpt(ans), opts([r2((V1 * V1 - V0 * V0) / A), r2((V1 * V1) / (2 * A)), r2(((V1 - V0) * (V1 - V0)) / (2 * A))], mOpt), fall(s, mOpt)),
			params: { case: 'spazio', v0, v1, a },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: braking from a speed in km/h

function level5(rng: Rng): Built {
	const askT = rng.next() < 0.5;
	for (;;) {
		const vk = two(rng, 30, 99), a = two(rng, 3, 8);
		const V = Number(vk) / 3.6, A = Number(a);
		const conv = `${kmh(vk)} = \\dfrac{${decTex(vk)}}{3{,}6}\\,\\text{m/s} = ${f3(V)}\\ldots\\,\\text{m/s}`;
		const lead = `Un'auto viaggia a $${kmh(vk)}$ e frena con un'accelerazione costante di modulo $${acc(a)}$ fino a fermarsi.`;
		if (askT) {
			const tt = V / A;
			const ans = r2(tt);
			if (ans === null) continue;
			return {
				prompt: 'Trova il tempo di frenata.',
				problem: textBlock(`${lead} In quanto tempo si ferma?`),
				solution: `t_f \\approx ${decTex(ans)}\\,\\text{s}`,
				steps: [conv, `t_f = \\dfrac{v_0}{|a|} = \\dfrac{${f3(V)}\\,\\text{m/s}}{${acc(a)}} = ${f3(tt)}\\ldots\\,\\text{s} \\approx ${decTex(ans)}\\,\\text{s}`],
				// km/h not converted; the braking distance's 2; the ratio upside down
				answer: choiceOf(rng, sOpt(ans), opts([r2(Number(vk) / A), r2(V / (2 * A)), r2(A / V)], sOpt), fall(tt, sOpt)),
				params: { case: 'tempo', v: vk, a },
			};
		}
		const d = (V * V) / (2 * A);
		const ans = r2(d);
		if (ans === null || d < 1) continue;
		return {
			prompt: 'Trova lo spazio di frenata.',
			problem: textBlock(`${lead} Quanta strada percorre durante la frenata?`),
			solution: `d_f \\approx ${decTex(ans)}\\,\\text{m}`,
			steps: [conv, `d_f = \\dfrac{v_0^2}{2\\,|a|} = \\dfrac{(${f3(V)}\\,\\text{m/s})^2}{2 \\cdot ${acc(a)}} = ${f3(d)}\\ldots\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`],
			// the 2 forgotten; the square forgotten; km/h not converted
			answer: choiceOf(rng, mOpt(ans), opts([r2((V * V) / A), r2(V / (2 * A)), r2((Number(vk) * Number(vk)) / (2 * A))], mOpt), fall(d, mOpt)),
			params: { case: 'spazio', v: vk, a },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the stopping distance

function level6(rng: Rng): Built {
	for (;;) {
		const vk = two(rng, 30, 99), a = two(rng, 3, 8), tr = rng.pick(REACTION);
		const V = Number(vk) / 3.6, A = Number(a), TR = Number(tr);
		const dr = V * TR, df = (V * V) / (2 * A);
		const d = dr + df;
		const ans = r2(d);
		if (ans === null) continue;
		return {
			prompt: 'Trova lo spazio di arresto.',
			problem: textBlock(
				`Un'auto viaggia a $${kmh(vk)}$ quando il guidatore vede un ostacolo. Il suo tempo di reazione è ${pq(tr, 's')}, poi l'auto frena con un'accelerazione costante di modulo $${acc(a)}$. Quanto vale lo spazio di arresto?`,
			),
			solution: `d \\approx ${decTex(ans)}\\,\\text{m}`,
			steps: [
				`${kmh(vk)} = \\dfrac{${decTex(vk)}}{3{,}6}\\,\\text{m/s} = ${f3(V)}\\ldots\\,\\text{m/s}`,
				`${t('Durante la reazione, a velocità costante: ')} v_0\\,t_r = ${f3(V)}\\,\\text{m/s} \\cdot ${decTex(tr)}\\,\\text{s} = ${f3(dr)}\\ldots\\,\\text{m}`,
				`${t('Frenata: ')} \\dfrac{v_0^2}{2\\,|a|} = \\dfrac{(${f3(V)}\\,\\text{m/s})^2}{2 \\cdot ${acc(a)}} = ${f3(df)}\\ldots\\,\\text{m}`,
				`d = ${f3(dr)}\\,\\text{m} + ${f3(df)}\\,\\text{m} = ${f3(d)}\\ldots\\,\\text{m} \\approx ${decTex(ans)}\\,\\text{m}`,
			],
			// braking only; reaction only; the 2 forgotten in the braking part
			answer: choiceOf(rng, mOpt(ans), opts([r2(df), r2(dr), r2(dr + (V * V) / A)], mOpt), fall(d, mOpt)),
			params: { case: 'arresto', v: vk, a, tr },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const motoUniformeAccelerato: Generator = {
	id: ID,
	title: 'Il moto uniformemente accelerato',
	levels: {
		1: { label: 'La velocità dopo un tempo', constraints: ['v = v0 + a t', 'accelera o frena, metà ciascuno'] },
		2: { label: 'Partenza da fermo', constraints: ['s = a t²/2'] },
		3: { label: 'La legge oraria', constraints: ['Δs = v0 t + a t²/2', 'accelera o frena senza fermarsi, metà ciascuno'] },
		4: { label: 'Senza il tempo', constraints: ['v² = v0² + 2 a Δs', 'la velocità finale o lo spazio, metà ciascuno'] },
		5: { label: 'La frenata', constraints: ['velocità in km/h', 'tempo o spazio di frenata, metà ciascuno'] },
		6: { label: 'Lo spazio di arresto', constraints: ['tempo di reazione più frenata'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default motoUniformeAccelerato;
