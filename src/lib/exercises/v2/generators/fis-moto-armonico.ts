/**
 * Il moto armonico. Spec: specs/exercises/fis-moto-armonico.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/49-fis-moto-armonico.md), each one step harder: amplitude
 * (half the swing) or period (the time over the number of oscillations); the position x = A cos(ωt) at an instant
 * that is a clean fraction of the period, in radians; the greatest speed ωA; the greatest acceleration ω²A; the period
 * or the amplitude from the greatest speed and acceleration. Data with two significant figures, answers with two.
 * Distractors from the lesson's warnings: the swing taken for the amplitude, the calculator in degrees, the sine for the
 * cosine, the sign, the centimetres not converted, the speed and the acceleration swapped, the square forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, TWO_PI, checkCommon, choiceOf, cut, cutQ, dec2, decTex, generateWith, near, pqU as pq, qOptU as qOpt, qu as qty, r2, rel, res, t, unitOpts } from '../fis-moti-piano';

export const ID = 'fis-moto-armonico';

const CM = unitOpts('cm');
const S = unitOpts('s');
const M = unitOpts('m');
const MS = unitOpts('m/s');
const A2 = unitOpts('m/s^2');

// ---------------------------------------------------------------------------
// Level 1: amplitude and period

const BODIES = ['Un peso appeso a una molla', 'Il pistone di un motore', "L'ago di una macchina da cucire"];

function level1(rng: Rng): Built {
	const askA = rng.next() < 0.5;
	for (;;) {
		const who = rng.pick(BODIES);
		if (askA) {
			const D = dec2(rng, 2.2, 60);
			const A = Number(D) / 2;
			const ans = r2(A);
			if (ans === null) continue;
			return {
				prompt: "Trova l'ampiezza.",
				problem: textBlock(`${who} si muove di moto armonico tra due punti distanti ${pq(D, 'cm')}. Quanto vale l'ampiezza del moto?`),
				solution: `A ${rel(A, ans)} ${qty(ans, 'cm')}`,
				steps: [t("L'ampiezza si misura dal centro di oscillazione: è metà della distanza tra le due estremità."), `A = \\dfrac{${qty(D, 'cm')}}{2} = ${res(A, ans, 'cm')}`],
				// the whole swing; a quarter of it; twice it
				answer: choiceOf(rng, qOpt(ans, 'cm'), CM([r2(Number(D)), r2(Number(D) / 4), r2(Number(D) * 2)]), near(A, 'cm')),
				params: { case: 'ampiezza', D },
			};
		}
		const N = rng.int(11, 60), time = dec2(rng, 2.0, 99);
		if (N % 10 === 0) continue;
		const T = Number(time) / N;
		const ans = r2(T);
		if (ans === null || T < 0.1 || T > 5) continue;
		return {
			prompt: 'Trova il periodo.',
			problem: textBlock(`${who} si muove di moto armonico e compie $${N}$ oscillazioni complete in ${pq(time, 's')}. Quanto vale il periodo del moto?`),
			solution: `T ${rel(T, ans)} ${qty(ans, 's')}`,
			steps: [t('Un periodo è la durata di una oscillazione completa, andata e ritorno:'), `T = \\dfrac{${qty(time, 's')}}{${N}} = ${res(T, ans, 's')}`],
			// the frequency for the period; half an oscillation per period; the time times N
			answer: choiceOf(rng, qOpt(ans, 's'), S([r2(N / Number(time)), r2(Number(time) / (2 * N)), r2(Number(time) * N)]), near(T, 's')),
			params: { case: 'periodo', N, time },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the position at an instant

/** Fractions of the period whose cosine is far from zero, as [numerator, denominator]. */
const FRACTIONS: [number, number][] = [[1, 8], [1, 6], [1, 3], [3, 8], [5, 8], [2, 3], [5, 6], [7, 8], [1, 12], [5, 12], [7, 12], [11, 12]];

function level2(rng: Rng): Built {
	for (;;) {
		const A = dec2(rng, 2.0, 20), T = dec2(rng, 1.2, 9.6);
		const [p, q] = rng.pick(FRACTIONS);
		const P = Number(T);
		const tt = (P * p) / q;
		// the instant must be a datum with two significant figures, exactly (1,0 s, 0,25 s, 12 s; not 20 s)
		const e = Math.floor(Math.log10(tt) + 1e-12);
		const tStr = tt.toFixed(Math.max(0, 1 - e));
		if (Math.abs(Number(tStr) - tt) > 1e-9 || (e >= 1 && Math.round(tt) % 10 === 0)) continue;
		const phase = (TWO_PI * p) / q;
		const x = Number(A) * Math.cos(phase);
		const ans = r2(x);
		if (ans === null || Math.abs(Math.cos(phase)) < 0.2) continue;
		const w = TWO_PI / P;
		return {
			prompt: 'Trova la posizione.',
			problem: textBlock(
				`Un corpo si muove di moto armonico con ampiezza ${pq(A, 'cm')} e periodo ${pq(T, 's')}; all'istante $t = 0$ si trova nell'estremità $x = A$. Dove si trova all'istante $t = ${qty(tStr, 's')}$?`,
			),
			solution: `x ${rel(x, ans)} ${qty(ans, 'cm')}`,
			steps: [
				`\\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{${qty(T, 's')}} = ${cutQ(w, 'rad/s')}`,
				`\\omega t = ${cut(w)} \\cdot ${decTex(tStr)} = ${cut(phase)}\\,\\text{rad}`,
				t('Con la calcolatrice in radianti:'),
				`x = A\\cos(\\omega t) = ${qty(A, 'cm')} \\cdot \\cos(${cut(phase)}) = ${res(x, ans, 'cm')}`,
			],
			// the calculator in degrees; the sine for the cosine; the sign
			answer: choiceOf(rng, qOpt(ans, 'cm'), CM([r2(Number(A) * Math.cos((phase * Math.PI) / 180)), r2(Number(A) * Math.sin(phase)), r2(-x)]), near(x, 'cm')),
			params: { A, T, t: tStr, fraction: `${p}/${q}` },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the greatest speed

function level3(rng: Rng): Built {
	const withF = rng.next() < 0.5;
	for (;;) {
		const A = dec2(rng, 1.1, 60), X = dec2(rng, withF ? 0.2 : 0.2, withF ? 9.9 : 5.0);
		const Am = Number(A) / 100;
		const w = withF ? TWO_PI * Number(X) : TWO_PI / Number(X);
		const v = w * Am;
		const ans = r2(v);
		if (ans === null || v < 0.01) continue;
		const data = withF ? `frequenza ${pq(X, 'Hz')}` : `periodo ${pq(X, 's')}`;
		return {
			prompt: 'Trova la velocità massima.',
			problem: textBlock(`Un corpo oscilla di moto armonico con ampiezza ${pq(A, 'cm')} e ${data}. Quanto vale la sua velocità massima?`),
			solution: `v_{max} ${rel(v, ans)} ${qty(ans, 'm/s')}`,
			steps: [
				withF ? `\\omega = 2\\pi f = 2\\pi \\cdot ${qty(X, 'Hz')} = ${cutQ(w, 'rad/s')}` : `\\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{${qty(X, 's')}} = ${cutQ(w, 'rad/s')}`,
				`A = ${qty(A, 'cm')} = ${cutQ(Am, 'm')}`,
				`v_{max} = \\omega A = ${cutQ(w, 'rad/s')} \\cdot ${cutQ(Am, 'm')} = ${res(v, ans, 'm/s')}`,
			],
			// the centimetres not converted; the 2π forgotten; the greatest acceleration
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(v * 100), r2(v / TWO_PI), r2(w * w * Am)]), near(v, 'm/s')),
			params: { case: withF ? 'frequenza' : 'periodo', A, X },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the greatest acceleration

function level4(rng: Rng): Built {
	const withF = rng.next() < 0.5;
	for (;;) {
		const A = dec2(rng, 1.1, 60), X = dec2(rng, 0.2, withF ? 5.0 : 5.0);
		const Am = Number(A) / 100;
		const w = withF ? TWO_PI * Number(X) : TWO_PI / Number(X);
		const a = w * w * Am;
		const ans = r2(a);
		if (ans === null || a < 0.05) continue;
		const data = withF ? `frequenza ${pq(X, 'Hz')}` : `periodo ${pq(X, 's')}`;
		return {
			prompt: "Trova l'accelerazione massima.",
			problem: textBlock(`Un corpo oscilla di moto armonico con ampiezza ${pq(A, 'cm')} e ${data}. Quanto vale la sua accelerazione massima?`),
			solution: `a_{max} ${rel(a, ans)} ${qty(ans, 'm/s^2')}`,
			steps: [
				withF ? `\\omega = 2\\pi f = 2\\pi \\cdot ${qty(X, 'Hz')} = ${cutQ(w, 'rad/s')}` : `\\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{${qty(X, 's')}} = ${cutQ(w, 'rad/s')}`,
				`a_{max} = \\omega^2 A = (${cutQ(w, 'rad/s')})^2 \\cdot ${cutQ(Am, 'm')} = ${res(a, ans, 'm/s^2')}`,
			],
			// the greatest speed; 2π for 4π² (2πA/T², 2πf²A); the centimetres not converted
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), A2([r2(w * Am), r2((w * w * Am) / TWO_PI), r2(a * 100)]), near(a, 'm/s^2')),
			params: { case: withF ? 'frequenza' : 'periodo', A, X },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: from the greatest speed and acceleration

function level5(rng: Rng): Built {
	const askT = rng.next() < 0.5;
	for (;;) {
		const v = dec2(rng, 0.11, 9.9), a = dec2(rng, 0.5, 99);
		const V = Number(v), Aa = Number(a);
		const w = Aa / V;
		if (w < 0.5 || w > 50) continue;
		const T = TWO_PI / w, A = (V * V) / Aa;
		const exact = askT ? T : A;
		const ans = r2(exact);
		if (ans === null || A < 0.01) continue;
		return {
			prompt: askT ? 'Trova il periodo.' : "Trova l'ampiezza.",
			problem: textBlock(`Nel moto armonico di un corpo la velocità massima è ${pq(v, 'm/s')} e l'accelerazione massima è ${pq(a, 'm/s^2')}. Quanto vale ${askT ? 'il periodo' : "l'ampiezza"}?`),
			solution: askT ? `T ${rel(T, ans)} ${qty(ans, 's')}` : `A ${rel(A, ans)} ${qty(ans, 'm')}`,
			steps: [
				t("Dividendo l'accelerazione massima per la velocità massima resta la pulsazione:"),
				`\\omega = \\dfrac{a_{max}}{v_{max}} = \\dfrac{${qty(a, 'm/s^2')}}{${qty(v, 'm/s')}} = ${cutQ(w, 'rad/s')}`,
				askT ? `T = \\dfrac{2\\pi}{\\omega} = ${res(T, ans, 's')}` : `A = \\dfrac{v_{max}}{\\omega} = \\dfrac{${qty(v, 'm/s')}}{${cutQ(w, 'rad/s')}} = ${res(A, ans, 'm')}`,
			],
			// T: 1/ω; 2π·ω; ω itself. A: v/a; a/v²; v·a
			answer: askT
				? choiceOf(rng, qOpt(ans, 's'), S([r2(1 / w), r2(TWO_PI * w), r2(w)]), near(T, 's'))
				: choiceOf(rng, qOpt(ans, 'm'), M([r2(V / Aa), r2(Aa / (V * V)), r2(V * Aa)]), near(A, 'm')),
			params: { case: askT ? 'periodo' : 'ampiezza', v, a },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisMotoArmonico: Generator = {
	id: ID,
	title: 'Il moto armonico',
	levels: {
		1: { label: 'Ampiezza e periodo', constraints: ["l'ampiezza dall'escursione, o il periodo dalle oscillazioni contate"] },
		2: { label: 'La posizione a un istante', constraints: ['x = A cos(ωt), istante che è una frazione semplice del periodo', 'calcolatrice in radianti'] },
		3: { label: 'La velocità massima', constraints: ['v = ωA, ampiezza in centimetri', 'dal periodo o dalla frequenza'] },
		4: { label: "L'accelerazione massima", constraints: ['a = ω²A, ampiezza in centimetri', 'dal periodo o dalla frequenza'] },
		5: { label: 'Dalla velocità e dall’accelerazione massime', constraints: ['ω = a/v, poi il periodo o l’ampiezza'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMotoArmonico;
