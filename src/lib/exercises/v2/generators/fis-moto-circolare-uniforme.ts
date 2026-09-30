/**
 * Il moto circolare uniforme. Spec: specs/exercises/fis-moto-circolare-uniforme.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/47-fis-moto-circolare-uniforme.md), each one step
 * harder: period and frequency (turns in a time, or revolutions per minute); the tangential speed 2πr/T, sometimes with
 * the radius in centimetres; the angular velocity 2π/T or 2πf; the speed from revolutions per minute through ω = 2πf
 * and v = ωr, or ω from v and r; two points of the same wheel (same ω, speeds proportional to the radius). Data with
 * two significant figures, answers with two. Distractors from the lesson's warnings: period and frequency swapped, the
 * minutes not divided by 60, the 2π forgotten, the centimetres not converted, the same speed for every point.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, TWO_PI, checkCommon, choiceOf, cutQ, dec2, decTex, generateWith, near, pq, qOpt, qty, r2, rel, res, t, unitOpts } from '../fis-moti-piano';

export const ID = 'fis-moto-circolare-uniforme';

const HZ = unitOpts('Hz');
const S = unitOpts('s');
const MS = unitOpts('m/s');
const RADS = unitOpts('rad/s');

/** Revolutions per minute of a washing machine's spin: an exact number from the maker. */
const RPM = [400, 600, 800, 1000, 1200, 1400, 1600];
const rpm = (rng: Rng) => rng.pick(RPM);

// ---------------------------------------------------------------------------
// Level 1: period and frequency

const SPINNERS = ['Una ruota', 'Un disco', 'Una trottola', 'Una giostra'];

function level1(rng: Rng): Built {
	const motor = rng.next() < 0.5;
	for (;;) {
		if (motor) {
			const n = rpm(rng);
			const T = 60 / n;
			const ans = r2(T);
			if (ans === null) continue;
			return {
				prompt: 'Trova il periodo.',
				problem: textBlock(`Il cestello di una lavatrice in centrifuga fa $${n}$ giri al minuto. Quanto dura un giro?`),
				solution: `T ${rel(T, ans)} ${qty(ans, 's')}`,
				steps: [`f = \\dfrac{${n}}{60\\,\\text{s}} = ${cutQ(n / 60, 'Hz')}`, `T = \\dfrac{1}{f} = \\dfrac{60\\,\\text{s}}{${n}} = ${res(T, ans, 's')}`],
				// the frequency taken for the period; the minute not converted (1/n); turns per second divided again by 60
				answer: choiceOf(rng, qOpt(ans, 's'), S([r2(n / 60), r2(1 / n), r2(n / 3600)]), near(T, 's')),
				params: { case: 'giri al minuto', n },
			};
		}
		const N = rng.int(11, 99), time = dec2(rng, 2.0, 99);
		if (N % 10 === 0) continue;
		const f = N / Number(time);
		const ans = r2(f);
		if (ans === null || f < 0.2) continue;
		const who = rng.pick(SPINNERS);
		return {
			prompt: 'Trova la frequenza.',
			problem: textBlock(`${who} fa $${N}$ giri in ${pq(time, 's')}. Quanto vale la frequenza del suo moto?`),
			solution: `f ${rel(f, ans)} ${qty(ans, 'Hz')}`,
			steps: [t('La frequenza è il numero di giri in un secondo:'), `f = \\dfrac{${N}}{${qty(time, 's')}} = ${res(f, ans, 'Hz')}`],
			// the period for the frequency; the angular velocity; the time per turn upside down
			answer: choiceOf(rng, qOpt(ans, 'Hz'), HZ([r2(Number(time) / N), r2(TWO_PI * f), r2(N * Number(time))]), near(f, 'Hz')),
			params: { case: 'giri nel tempo', N, time },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the tangential speed

type Wheel = { case: 'min' | 'm' | 'cm'; lo: number; hi: number; T0: number; T1: number; text: (r: string, T: string) => string };
const WHEELS: Wheel[] = [
	{ case: 'min', lo: 11, hi: 60, T0: 2.0, T1: 20, text: (r, T) => `Una ruota panoramica di raggio ${pq(r, 'm')} fa un giro in ${pq(T, 'min')}. Con quale velocità si muove un seggiolino?` },
	{ case: 'm', lo: 1.1, hi: 9.9, T0: 5.0, T1: 30, text: (r, T) => `Una giostra fa un giro in ${pq(T, 's')}. Con quale velocità si muove un cavallino a ${pq(r, 'm')} dal centro?` },
	{ case: 'cm', lo: 11, hi: 60, T0: 0.05, T1: 0.99, text: (r, T) => `Le pale di un ventilatore sono lunghe ${pq(r, 'cm')} e fanno un giro in ${pq(T, 's')}. Con quale velocità si muove la punta di una pala?` },
];

function level2(rng: Rng): Built {
	const w = rng.pick(WHEELS);
	for (;;) {
		const r = dec2(rng, w.lo, w.hi), T = dec2(rng, w.T0, w.T1);
		const R = Number(r) / (w.case === 'cm' ? 100 : 1), P = Number(T) * (w.case === 'min' ? 60 : 1);
		const v = (TWO_PI * R) / P;
		const ans = r2(v);
		if (ans === null || v < 0.1) continue;
		const Rq = w.case === 'cm' ? cutQ(R, 'm') : qty(r, 'm');
		const Pq = w.case === 'min' ? cutQ(P, 's') : qty(T, 's');
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(w.text(r, T)),
			solution: `v ${rel(v, ans)} ${qty(ans, 'm/s')}`,
			steps: [
				...(w.case === 'cm' ? [`r = ${qty(r, 'cm')} = ${cutQ(R, 'm')}`] : []),
				...(w.case === 'min' ? [`T = ${qty(T, 'min')} = ${decTex(T)} \\cdot 60\\,\\text{s} = ${cutQ(P, 's')}`] : []),
				`v = \\dfrac{2\\pi r}{T} = \\dfrac{2\\pi \\cdot ${Rq}}{${Pq}} = ${res(v, ans, 'm/s')}`,
			],
			// the 2 forgotten (πr/T); the radius over the period; the unit not converted (the minutes or the centimetres), or 2πr·T
			answer: choiceOf(
				rng,
				qOpt(ans, 'm/s'),
				MS([r2(v / 2), r2(R / P), w.case === 'cm' ? r2(v * 100) : w.case === 'min' ? r2(v * 60) : r2(TWO_PI * R * P)]),
				near(v, 'm/s'),
			),
			params: { case: w.case, r, T },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the angular velocity

function level3(rng: Rng): Built {
	const fromT = rng.next() < 0.5;
	for (;;) {
		if (fromT) {
			const T = dec2(rng, 0.2, 60);
			const P = Number(T);
			const w = TWO_PI / P;
			const ans = r2(w);
			if (ans === null) continue;
			return {
				prompt: 'Trova la velocità angolare.',
				problem: textBlock(`Un punto si muove di moto circolare uniforme e fa un giro in ${pq(T, 's')}. Quanto vale la sua velocità angolare?`),
				solution: `\\omega ${rel(w, ans)} ${qty(ans, 'rad/s')}`,
				steps: [t('In un periodo il raggio spazza un giro, 2 pi greco radianti:'), `\\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{${qty(T, 's')}} = ${res(w, ans, 'rad/s')}`],
				// the frequency; the angle in degrees; 2π times the period
				answer: choiceOf(rng, qOpt(ans, 'rad/s'), RADS([r2(1 / P), r2(360 / P), r2(TWO_PI * P)]), near(w, 'rad/s')),
				params: { case: 'periodo', T },
			};
		}
		const f = dec2(rng, 0.11, 15);
		const F = Number(f);
		const w = TWO_PI * F;
		const ans = r2(w);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità angolare.',
			problem: textBlock(`Un disco gira con la frequenza di ${pq(f, 'Hz')}. Quanto vale la sua velocità angolare?`),
			solution: `\\omega ${rel(w, ans)} ${qty(ans, 'rad/s')}`,
			steps: [`\\omega = 2\\pi f = 2\\pi \\cdot ${qty(f, 'Hz')} = ${res(w, ans, 'rad/s')}`],
			// the frequency taken as it is; 2π over the frequency; π f
			answer: choiceOf(rng, qOpt(ans, 'rad/s'), RADS([r2(F), r2(TWO_PI / F), r2(Math.PI * F)]), near(w, 'rad/s')),
			params: { case: 'frequenza', f },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: v = ωr

function level4(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		if (askV) {
			const n = dec2(rng, 11, 99), r = dec2(rng, 0.11, 2.0);
			const N = Number(n), R = Number(r);
			const w = (TWO_PI * N) / 60;
			const v = w * R;
			const ans = r2(v);
			if (ans === null || v < 0.1) continue;
			return {
				prompt: 'Trova la velocità.',
				problem: textBlock(`Una ruota di raggio ${pq(r, 'm')} fa $${decTex(n)}$ giri al minuto. Con quale velocità si muove un punto del bordo?`),
				solution: `v ${rel(v, ans)} ${qty(ans, 'm/s')}`,
				steps: [
					`f = \\dfrac{${n}}{60\\,\\text{s}} = ${cutQ(N / 60, 'Hz')}`,
					`\\omega = 2\\pi f = ${cutQ(w, 'rad/s')}`,
					`v = \\omega\\,r = ${cutQ(w, 'rad/s')} \\cdot ${qty(r, 'm')} = ${res(v, ans, 'm/s')}`,
				],
				// giri al minuto times r; giri al secondo times r (the 2π forgotten); the minutes not converted
				answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(N * R), r2((N / 60) * R), r2(TWO_PI * N * R)]), near(v, 'm/s')),
				params: { case: 'velocità', n, r },
			};
		}
		const v = dec2(rng, 1.1, 99), r = dec2(rng, 0.11, 9.9);
		const V = Number(v), R = Number(r);
		const w = V / R;
		const ans = r2(w);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità angolare.',
			problem: textBlock(`Un punto percorre una circonferenza di raggio ${pq(r, 'm')} alla velocità costante di ${pq(v, 'm/s')}. Quanto vale la sua velocità angolare?`),
			solution: `\\omega ${rel(w, ans)} ${qty(ans, 'rad/s')}`,
			steps: [`\\omega = \\dfrac{v}{r} = \\dfrac{${qty(v, 'm/s')}}{${qty(r, 'm')}} = ${res(w, ans, 'rad/s')}`],
			// v·r; r / v; the frequency v / (2πr)
			answer: choiceOf(rng, qOpt(ans, 'rad/s'), RADS([r2(V * R), r2(R / V), r2(V / (TWO_PI * R))]), near(w, 'rad/s')),
			params: { case: 'velocità angolare', v, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: two points of the same wheel

function level5(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		const r1 = dec2(rng, 0.5, 5.0), r2d = dec2(rng, 0.5, 5.0), v1 = dec2(rng, 0.5, 9.9);
		const R1 = Number(r1), R2 = Number(r2d), V1 = Number(v1);
		if (R2 < 1.3 * R1 && R2 > R1 / 1.3) continue;
		const v2 = (V1 * R2) / R1;
		const T = (TWO_PI * R1) / V1;
		const exact = askV ? v2 : T;
		const ans = r2(exact);
		if (ans === null) continue;
		const problem = `Su una giostra che gira, Anna è seduta a ${pq(r1, 'm')} dal centro e va a ${pq(v1, 'm/s')}; Bruno è seduto a ${pq(r2d, 'm')} dal centro. ${askV ? 'Con quale velocità si muove Bruno?' : 'Quanto dura un giro della giostra?'}`;
		return {
			prompt: askV ? 'Trova la velocità di Bruno.' : 'Trova il periodo.',
			problem: textBlock(problem),
			solution: askV ? `v_B ${rel(v2, ans)} ${qty(ans, 'm/s')}` : `T ${rel(T, ans)} ${qty(ans, 's')}`,
			steps: askV
				? [
						t('I due bambini hanno la stessa velocità angolare:'),
						`\\omega = \\dfrac{v_A}{r_A} = \\dfrac{${qty(v1, 'm/s')}}{${qty(r1, 'm')}} = ${cutQ(V1 / R1, 'rad/s')}`,
						`v_B = \\omega\\,r_B = ${cutQ(V1 / R1, 'rad/s')} \\cdot ${qty(r2d, 'm')} = ${res(v2, ans, 'm/s')}`,
					]
				: [t('Il periodo è lo stesso per tutti i punti della giostra; con i dati di Anna:'), `T = \\dfrac{2\\pi r_A}{v_A} = \\dfrac{2\\pi \\cdot ${qty(r1, 'm')}}{${qty(v1, 'm/s')}} = ${res(T, ans, 's')}`],
			// v2: the same speed; the ratio upside down; the difference of the radii. T: r/v; 2πv/r; Bruno's radius with Anna's speed
			answer: askV
				? choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(V1), r2((V1 * R1) / R2), r2(V1 * Math.abs(R2 - R1))]), near(v2, 'm/s'))
				: choiceOf(rng, qOpt(ans, 's'), S([r2(R1 / V1), r2((TWO_PI * V1) / R1), r2((TWO_PI * R2) / V1)]), near(T, 's')),
			params: { case: askV ? 'velocità' : 'periodo', r1, r2: r2d, v1 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisMotoCircolareUniforme: Generator = {
	id: ID,
	title: 'Il moto circolare uniforme',
	levels: {
		1: { label: 'Periodo e frequenza', constraints: ['giri in un tempo, o giri al minuto', 'frequenza o periodo'] },
		2: { label: 'La velocità tangenziale', constraints: ['v = 2πr/T', 'metà dei casi con il raggio in centimetri'] },
		3: { label: 'La velocità angolare', constraints: ['dal periodo o dalla frequenza, metà ciascuno'] },
		4: { label: 'Velocità tangenziale e angolare', constraints: ['dai giri al minuto a v = ωr, o ω = v/r'] },
		5: { label: 'Due punti sulla stessa ruota', constraints: ['raggi diversi di almeno il 30%', 'velocità del secondo punto o periodo'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMotoCircolareUniforme;
