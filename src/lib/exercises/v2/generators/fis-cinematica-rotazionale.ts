/**
 * Velocità angolare e accelerazione angolare. Spec: specs/exercises/fis-cinematica-rotazionale.md
 *
 * Seven levels from the lesson (docs/lezioni/fisica/riscritte/86-fis-cinematica-rotazionale.md), each one step harder:
 * the mean angular acceleration from two angular velocities; the same from revolutions per minute; the law
 * ω = ω0 + αt (the final angular velocity, or the time to stop); the angle θ = ω0t + αt²/2 in radians; the number of
 * turns of a rotation that starts or stops; the relation without time ω² = ω0² + 2αΔθ; the tangential and centripetal
 * accelerations of a point, with its distance in centimetres. Data with two significant figures, answers with two.
 * Distractors from the lesson's warnings: revolutions per minute not converted, the 2π forgotten, radians taken for
 * turns, the half of αt²/2 forgotten, the centimetres not converted, αr taken for ω²r.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, TWO_PI, checkCommon, choiceOf, cutQ, dec2, decTex, generateWith, near, pq, qOpt, qu, r2, rel, res, t, textBlock, unitOpts } from '../fis-rotazioni';

export const ID = 'fis-cinematica-rotazionale';

const RADS = unitOpts('rad/s');
const RADS2 = unitOpts('rad/s^2');
const RAD = unitOpts('rad');
const SEC = unitOpts('s');
const GIRI = unitOpts('giri');
const MS2 = unitOpts('m/s^2');

const BODIES = ['Un disco', 'Una ruota', 'Una puleggia', 'Un volano'];

// ---------------------------------------------------------------------------
// Level 1: the mean angular acceleration

function level1(rng: Rng): Built {
	const fromRest = rng.next() < 0.5;
	for (;;) {
		const who = rng.pick(BODIES);
		const dt = dec2(rng, 1.1, 20), w = dec2(rng, 1.1, 40);
		const D = Number(dt), W = Number(w);
		if (fromRest) {
			const a = W / D;
			const ans = r2(a);
			if (ans === null || a < 0.1) continue;
			return {
				prompt: "Trova l'accelerazione angolare.",
				problem: textBlock(`${who} parte da fermo e in ${pq(dt, 's')} raggiunge la velocità angolare di ${pq(w, 'rad/s')}. Quanto vale la sua accelerazione angolare media?`),
				solution: `\\alpha_m ${rel(a, ans)} ${qu(ans, 'rad/s^2')}`,
				steps: [`\\alpha_m = \\dfrac{\\omega - \\omega_0}{\\Delta t} = \\dfrac{${qu(w, 'rad/s')} - 0}{${qu(dt, 's')}} = ${res(a, ans, 'rad/s^2')}`],
				// ω·Δt; the ratio upside down; divided by the time twice
				answer: choiceOf(rng, qOpt(ans, 'rad/s^2'), RADS2([r2(W * D), r2(D / W), r2(W / (D * D))]), near(a, 'rad/s^2')),
				params: { case: 'da fermo', w, dt },
			};
		}
		const w0 = dec2(rng, 1.1, 40);
		const W0 = Number(w0);
		if (Math.abs(W - W0) < 0.2 * Math.max(W, W0) || Math.min(W, W0) < 0.25 * Math.max(W, W0)) continue;
		const a = Math.abs(W - W0) / D;
		const ans = r2(a);
		if (ans === null || a < 0.1) continue;
		const up = W > W0;
		return {
			prompt: "Trova il modulo dell'accelerazione angolare.",
			problem: textBlock(`La velocità angolare di ${who.toLowerCase()} passa da ${pq(w0, 'rad/s')} a ${pq(w, 'rad/s')} in ${pq(dt, 's')}. Quanto vale, in modulo, la sua accelerazione angolare media?`),
			solution: `|\\alpha_m| ${rel(a, ans)} ${qu(ans, 'rad/s^2')}`,
			steps: [
				`\\alpha_m = \\dfrac{\\omega - \\omega_0}{\\Delta t} = \\dfrac{${qu(w, 'rad/s')} - ${qu(w0, 'rad/s')}}{${qu(dt, 's')}} = ${up ? '' : '-'}${res(a, ans, 'rad/s^2')}`,
				t(up ? 'La velocità angolare aumenta: alfa ha il segno di omega.' : 'Il segno meno dice che la rotazione rallenta; il modulo è il valore senza segno.'),
			],
			// the sum of the two velocities; the final velocity alone; the difference times the time
			answer: choiceOf(rng, qOpt(ans, 'rad/s^2'), RADS2([r2((W + W0) / D), r2(W / D), r2(Math.abs(W - W0) * D)]), near(a, 'rad/s^2')),
			params: { case: 'varia', w0, w, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: from revolutions per minute

const MOTORS = ['Il cestello di una lavatrice', 'Il disco di una smerigliatrice', 'La punta di un trapano', 'Le lame di un frullatore'];
const VERB: Record<string, [string, string]> = {
	'Il cestello di una lavatrice': ['parte da fermo e raggiunge', 'sua'],
	'Il disco di una smerigliatrice': ['parte da fermo e raggiunge', 'sua'],
	'La punta di un trapano': ['parte da ferma e raggiunge', 'sua'],
	'Le lame di un frullatore': ['partono da ferme e raggiungono', 'loro'],
};
const RPM = [120, 180, 240, 300, 450, 600, 900, 1200];

function level2(rng: Rng): Built {
	for (;;) {
		const who = rng.pick(MOTORS), n = rng.pick(RPM), dt = dec2(rng, 2.0, 20);
		const D = Number(dt);
		const w = (TWO_PI * n) / 60;
		const a = w / D;
		const ans = r2(a);
		if (ans === null) continue;
		const [verb, poss] = VERB[who];
		return {
			prompt: "Trova l'accelerazione angolare.",
			problem: textBlock(`${who} ${verb} i $${n}$ giri al minuto in ${pq(dt, 's')}. Quanto vale la ${poss} accelerazione angolare media?`),
			solution: `\\alpha_m ${rel(a, ans)} ${qu(ans, 'rad/s^2')}`,
			steps: [
				t('Prima i giri al minuto diventano radianti al secondo:'),
				`\\omega = \\dfrac{2\\pi \\cdot ${n}}{60\\,\\text{s}} = ${cutQ(w, 'rad/s')}`,
				`\\alpha_m = \\dfrac{\\omega - \\omega_0}{\\Delta t} = \\dfrac{${cutQ(w, 'rad/s')} - 0}{${qu(dt, 's')}} = ${res(a, ans, 'rad/s^2')}`,
			],
			// giri al minuto over the time; giri al secondo over the time (the 2π forgotten); the minute not converted
			answer: choiceOf(rng, qOpt(ans, 'rad/s^2'), RADS2([r2(n / D), r2(n / 60 / D), r2((TWO_PI * n) / D)]), near(a, 'rad/s^2')),
			params: { who, n, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: ω = ω0 + αt

function level3(rng: Rng): Built {
	const stop = rng.next() < 0.5;
	for (;;) {
		const w0 = dec2(rng, 1.1, 40), al = dec2(rng, 0.5, 9.9);
		const W0 = Number(w0), A = Number(al);
		if (stop) {
			const T = W0 / A;
			const ans = r2(T);
			if (ans === null || T < 0.5) continue;
			return {
				prompt: 'Trova il tempo di arresto.',
				problem: textBlock(`Le pale di un ventilatore girano a ${pq(w0, 'rad/s')}. Spento il motore, rallentano con accelerazione angolare costante di modulo ${pq(al, 'rad/s^2')}. Dopo quanto tempo si fermano?`),
				solution: `t ${rel(T, ans)} ${qu(ans, 's')}`,
				steps: [
					t('Le pale rallentano: alfa è opposta a omega, e alla fine omega è zero.'),
					`0 = \\omega_0 + \\alpha\\,t = ${qu(w0, 'rad/s')} - ${qu(al, 'rad/s^2')} \\cdot t`,
					`t = \\dfrac{${qu(w0, 'rad/s')}}{${qu(al, 'rad/s^2')}} = ${res(T, ans, 's')}`,
				],
				// the ratio upside down; the product; twice the time
				answer: choiceOf(rng, qOpt(ans, 's'), SEC([r2(A / W0), r2(W0 * A), r2((2 * W0) / A)]), near(T, 's')),
				params: { case: 'arresto', w0, alpha: al },
			};
		}
		const time = dec2(rng, 1.1, 9.9);
		const T = Number(time);
		const w = W0 + A * T;
		const ans = r2(w);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità angolare finale.',
			problem: textBlock(`Una ruota gira a ${pq(w0, 'rad/s')} e accelera, con accelerazione angolare costante di ${pq(al, 'rad/s^2')}, per ${pq(time, 's')}. Quale velocità angolare raggiunge?`),
			solution: `\\omega ${rel(w, ans)} ${qu(ans, 'rad/s')}`,
			steps: [`\\omega = \\omega_0 + \\alpha\\,t = ${qu(w0, 'rad/s')} + ${qu(al, 'rad/s^2')} \\cdot ${qu(time, 's')} = ${res(w, ans, 'rad/s')}`],
			// the initial velocity forgotten; the time forgotten; the law of the angle
			answer: choiceOf(rng, qOpt(ans, 'rad/s'), RADS([r2(A * T), r2(W0 + A), r2(W0 + 0.5 * A * T * T)]), near(w, 'rad/s')),
			params: { case: 'velocità', w0, alpha: al, t: time },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the angle

function level4(rng: Rng): Built {
	const fromRest = rng.next() < 0.5;
	for (;;) {
		const al = dec2(rng, 0.5, 9.9), time = dec2(rng, 1.1, 9.9);
		const A = Number(al), T = Number(time);
		if (fromRest) {
			const th = 0.5 * A * T * T;
			const ans = r2(th);
			if (ans === null) continue;
			return {
				prompt: "Trova l'angolo descritto.",
				problem: textBlock(`Un disco parte da fermo con accelerazione angolare costante di ${pq(al, 'rad/s^2')}. Di quale angolo ruota in ${pq(time, 's')}?`),
				solution: `\\theta ${rel(th, ans)} ${qu(ans, 'rad')}`,
				steps: [`\\theta = \\omega_0\\,t + \\dfrac{1}{2}\\,\\alpha\\,t^2 = 0 + \\dfrac{1}{2} \\cdot ${qu(al, 'rad/s^2')} \\cdot (${qu(time, 's')})^2 = ${res(th, ans, 'rad')}`],
				// the half forgotten; the angular velocity αt; the time not squared
				answer: choiceOf(rng, qOpt(ans, 'rad'), RAD([r2(A * T * T), r2(A * T), r2(0.5 * A * T)]), near(th, 'rad')),
				params: { case: 'da fermo', alpha: al, t: time },
			};
		}
		const w0 = dec2(rng, 1.1, 20);
		const W0 = Number(w0);
		const th = W0 * T + 0.5 * A * T * T;
		const ans = r2(th);
		if (ans === null) continue;
		return {
			prompt: "Trova l'angolo descritto.",
			problem: textBlock(`Una ruota gira a ${pq(w0, 'rad/s')} e accelera, con accelerazione angolare costante di ${pq(al, 'rad/s^2')}, per ${pq(time, 's')}. Di quale angolo ruota in questo tempo?`),
			solution: `\\theta ${rel(th, ans)} ${qu(ans, 'rad')}`,
			steps: [
				`\\theta = \\omega_0\\,t + \\dfrac{1}{2}\\,\\alpha\\,t^2`,
				`\\theta = ${qu(w0, 'rad/s')} \\cdot ${qu(time, 's')} + \\dfrac{1}{2} \\cdot ${qu(al, 'rad/s^2')} \\cdot (${qu(time, 's')})^2 = ${res(th, ans, 'rad')}`,
			],
			// the acceleration forgotten; the half forgotten; the initial velocity forgotten
			answer: choiceOf(rng, qOpt(ans, 'rad'), RAD([r2(W0 * T), r2(W0 * T + A * T * T), r2(0.5 * A * T * T)]), near(th, 'rad')),
			params: { case: 'con velocità iniziale', w0, alpha: al, t: time },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the number of turns

function level5(rng: Rng): Built {
	const braking = rng.next() < 0.5;
	for (;;) {
		const time = dec2(rng, 2.0, 20);
		const T = Number(time);
		if (braking) {
			const w0 = dec2(rng, 5.0, 60);
			const W0 = Number(w0);
			const al = W0 / T;
			const th = 0.5 * W0 * T;
			const N = th / TWO_PI;
			const ans = r2(N);
			if (ans === null || N < 1) continue;
			return {
				prompt: 'Trova il numero di giri.',
				problem: textBlock(`Le pale di un ventilatore girano a ${pq(w0, 'rad/s')}. Spento il motore, rallentano con accelerazione angolare costante e si fermano in ${pq(time, 's')}. Quanti giri fanno prima di fermarsi?`),
				solution: `N ${rel(N, ans)} ${qu(ans, 'giri')}`,
				steps: [
					`\\alpha = \\dfrac{0 - \\omega_0}{t} = -\\dfrac{${qu(w0, 'rad/s')}}{${qu(time, 's')}} = -${cutQ(al, 'rad/s^2')}`,
					`\\theta = \\omega_0\\,t + \\dfrac{1}{2}\\,\\alpha\\,t^2 = ${cutQ(W0 * T, 'rad')} - ${cutQ(th, 'rad')} = ${cutQ(th, 'rad')}`,
					t('Un giro vale 2 pi greco radianti:'),
					`N = \\dfrac{\\theta}{2\\pi} = ${res(N, ans, 'giri')}`,
				],
				// the radians taken for turns; the slowing down forgotten (ω0·t); θ over π
				answer: choiceOf(rng, qOpt(ans, 'giri'), GIRI([r2(th), r2((W0 * T) / TWO_PI), r2(th / Math.PI)]), near(N, 'giri')),
				params: { case: 'frenata', w0, t: time },
			};
		}
		const al = dec2(rng, 0.5, 9.9);
		const A = Number(al);
		const th = 0.5 * A * T * T;
		const N = th / TWO_PI;
		const ans = r2(N);
		if (ans === null || N < 1) continue;
		return {
			prompt: 'Trova il numero di giri.',
			problem: textBlock(`Una mola parte da ferma con accelerazione angolare costante di ${pq(al, 'rad/s^2')}. Quanti giri fa nei primi ${pq(time, 's')}?`),
			solution: `N ${rel(N, ans)} ${qu(ans, 'giri')}`,
			steps: [
				`\\theta = \\dfrac{1}{2}\\,\\alpha\\,t^2 = \\dfrac{1}{2} \\cdot ${qu(al, 'rad/s^2')} \\cdot (${qu(time, 's')})^2 = ${cutQ(th, 'rad')}`,
				t('Un giro vale 2 pi greco radianti:'),
				`N = \\dfrac{\\theta}{2\\pi} = ${res(N, ans, 'giri')}`,
			],
			// the radians taken for turns; the half forgotten; θ over π
			answer: choiceOf(rng, qOpt(ans, 'giri'), GIRI([r2(th), r2((A * T * T) / TWO_PI), r2(th / Math.PI)]), near(N, 'giri')),
			params: { case: 'partenza', alpha: al, t: time },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: without the time

function level6(rng: Rng): Built {
	const askAngle = rng.next() < 0.5;
	for (;;) {
		const al = dec2(rng, 0.5, 9.9);
		const A = Number(al);
		if (askAngle) {
			const w = dec2(rng, 2.0, 40);
			const W = Number(w);
			const th = (W * W) / (2 * A);
			const ans = r2(th);
			if (ans === null || th < 1) continue;
			return {
				prompt: "Trova l'angolo descritto.",
				problem: textBlock(`Un volano parte da fermo con accelerazione angolare costante di ${pq(al, 'rad/s^2')}. Di quale angolo ha ruotato quando la sua velocità angolare è ${pq(w, 'rad/s')}?`),
				solution: `\\Delta\\theta ${rel(th, ans)} ${qu(ans, 'rad')}`,
				steps: [
					t('Il tempo non è tra i dati:'),
					`\\omega^2 = \\omega_0^2 + 2\\,\\alpha\\,\\Delta\\theta`,
					`\\Delta\\theta = \\dfrac{\\omega^2 - \\omega_0^2}{2\\,\\alpha} = \\dfrac{(${qu(w, 'rad/s')})^2 - 0}{2 \\cdot ${qu(al, 'rad/s^2')}} = ${res(th, ans, 'rad')}`,
				],
				// the 2 forgotten; ω not squared; the time ω/α
				answer: choiceOf(rng, qOpt(ans, 'rad'), RAD([r2((W * W) / A), r2(W / (2 * A)), r2(W / A)]), near(th, 'rad')),
				params: { case: 'angolo', alpha: al, w },
			};
		}
		const dth = dec2(rng, 2.0, 60);
		const D = Number(dth);
		const w = Math.sqrt(2 * A * D);
		const ans = r2(w);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità angolare finale.',
			problem: textBlock(`Un volano parte da fermo con accelerazione angolare costante di ${pq(al, 'rad/s^2')}. Quale velocità angolare ha dopo aver ruotato di ${pq(dth, 'rad')}?`),
			solution: `\\omega ${rel(w, ans)} ${qu(ans, 'rad/s')}`,
			steps: [
				t('Il tempo non è tra i dati:'),
				`\\omega^2 = \\omega_0^2 + 2\\,\\alpha\\,\\Delta\\theta = 0 + 2 \\cdot ${qu(al, 'rad/s^2')} \\cdot ${qu(dth, 'rad')} = ${decTex(String(Number((2 * A * D).toFixed(4))))}\\,\\text{rad}^2/\\text{s}^2`,
				`\\omega = \\sqrt{${decTex(String(Number((2 * A * D).toFixed(4))))}}\\,\\text{rad/s} = ${res(w, ans, 'rad/s')}`,
			],
			// the square root forgotten; the 2 forgotten; α·Δθ
			answer: choiceOf(rng, qOpt(ans, 'rad/s'), RADS([r2(2 * A * D), r2(Math.sqrt(A * D)), r2(A * D)]), near(w, 'rad/s')),
			params: { case: 'velocità', alpha: al, dtheta: dth },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: the tangential and the centripetal acceleration of a point

function level7(rng: Rng): Built {
	const tang = rng.next() < 0.5;
	for (;;) {
		const r = dec2(rng, 11, 99);
		const R = Number(r) / 100;
		const conv = `r = ${qu(r, 'cm')} = ${qu(R.toFixed(2), 'm')}`;
		if (tang) {
			const al = dec2(rng, 0.5, 20);
			const A = Number(al);
			const at = A * R;
			const ans = r2(at);
			if (ans === null || at < 0.1) continue;
			return {
				prompt: "Trova l'accelerazione tangenziale.",
				problem: textBlock(`Un disco ruota con accelerazione angolare di ${pq(al, 'rad/s^2')}. Quanto vale l'accelerazione tangenziale di un punto a ${pq(r, 'cm')} dall'asse?`),
				solution: `a_t ${rel(at, ans)} ${qu(ans, 'm/s^2')}`,
				steps: [conv, `a_t = \\alpha\\,r = ${qu(al, 'rad/s^2')} \\cdot ${qu(R.toFixed(2), 'm')} = ${res(at, ans, 'm/s^2')}`],
				// the centimetres not converted; α over r; α squared times r (the centripetal formula with α)
				answer: choiceOf(rng, qOpt(ans, 'm/s^2'), MS2([r2(A * Number(r)), r2(A / R), r2(A * A * R)]), near(at, 'm/s^2')),
				params: { case: 'tangenziale', alpha: al, r },
			};
		}
		const w = dec2(rng, 1.1, 20);
		const W = Number(w);
		const ac = W * W * R;
		const ans = r2(ac);
		if (ans === null || ac < 0.1) continue;
		return {
			prompt: "Trova l'accelerazione centripeta.",
			problem: textBlock(`In un certo istante un disco gira con velocità angolare ${pq(w, 'rad/s')}. Quanto vale l'accelerazione centripeta di un punto a ${pq(r, 'cm')} dall'asse?`),
			solution: `a_c ${rel(ac, ans)} ${qu(ans, 'm/s^2')}`,
			steps: [conv, `a_c = \\omega^2\\,r = (${qu(w, 'rad/s')})^2 \\cdot ${qu(R.toFixed(2), 'm')} = ${res(ac, ans, 'm/s^2')}`],
			// ω not squared (the speed ωr); ω² over r; the centimetres not converted
			answer: choiceOf(rng, qOpt(ans, 'm/s^2'), MS2([r2(W * R), r2((W * W) / R), r2(W * W * Number(r))]), near(ac, 'm/s^2')),
			params: { case: 'centripeta', w, r },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisCinematicaRotazionale: Generator = {
	id: ID,
	title: 'Velocità angolare e accelerazione angolare',
	levels: {
		1: { label: 'Accelerazione angolare media', constraints: ['da fermo, o tra due velocità angolari diverse di almeno il 20%, la più piccola almeno un quarto della più grande', 'velocità angolari in rad/s'] },
		2: { label: 'Dai giri al minuto', constraints: ['da fermo a un numero di giri al minuto esatto', 'conversione in rad/s'] },
		3: { label: 'Velocità angolare nel tempo', constraints: ['ω = ω0 + αt', 'velocità finale o tempo di arresto, metà ciascuno'] },
		4: { label: 'Angolo descritto', constraints: ['θ = ω0t + αt²/2 in radianti', 'da fermo o con velocità iniziale'] },
		5: { label: 'Numero di giri', constraints: ['frenata fino a fermarsi, o partenza da fermo', 'almeno un giro'] },
		6: { label: 'Senza il tempo', constraints: ['ω² = ω0² + 2αΔθ, da fermo', 'angolo o velocità angolare finale'] },
		7: { label: 'Accelerazione tangenziale e centripeta', constraints: ['a_t = αr oppure a_c = ω²r', 'distanza in centimetri'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisCinematicaRotazionale;
