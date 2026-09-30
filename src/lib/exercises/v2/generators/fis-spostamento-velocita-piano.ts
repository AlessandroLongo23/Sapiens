/**
 * Spostamento e velocità nel piano. Spec: specs/exercises/fis-spostamento-velocita-piano.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/45-fis-spostamento-velocita-piano.md), each one step
 * harder: the displacement between two points given by their coordinates; the average velocity from the displacement's
 * components and the time; the average velocity against the average scalar speed on a path of two perpendicular legs;
 * a component of a velocity given by modulus and angle; a component of the displacement of a body moving with constant
 * velocity for a time. Data with two significant figures, answers with two (never too close to a rounding boundary).
 * Distractors from the lesson's warnings: the components added as numbers, the position taken for the displacement,
 * the two average velocities swapped, sine and cosine swapped, the time forgotten.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { type Built, DEG, checkCommon, choiceOf, cutQ, dec2, decTex, rel, res, generateWith, near, pq, qOpt, qty, r2, r3, scene, sceneNum, t, unitOpts } from '../fis-moti-piano';

export const ID = 'fis-spostamento-velocita-piano';

const M = unitOpts('m');
const MS = unitOpts('m/s');

// ---------------------------------------------------------------------------
// Level 1: the displacement from the coordinates

/** A coordinate in metres: a whole number from 11 to 60, not a multiple of ten, with either sign. */
function coord(rng: Rng): number {
	for (;;) {
		const k = rng.int(11, 60);
		if (k % 10) return rng.next() < 0.5 ? -k : k;
	}
}
const texInt = (n: number) => String(n);
/** A number after a minus sign: in brackets if negative. */
const term = (n: number) => (n < 0 ? `(${n})` : String(n));
const point = (name: string, x: number, y: number) => `$${name} = (${qty(texInt(x), 'm')};\\ ${qty(texInt(y), 'm')})$`;

function level1(rng: Rng): Built {
	for (;;) {
		const xA = coord(rng), yA = coord(rng), xB = coord(rng), yB = coord(rng);
		const dx = xB - xA, dy = yB - yA;
		if (Math.abs(dx) < 5 || Math.abs(dy) < 5) continue;
		const ds = Math.hypot(dx, dy);
		const ans = r2(ds);
		if (ans === null) continue;
		const u = r3(3.2 / Math.max(...[xA, yA, xB, yB].map(Math.abs)));
		const box = { x0: Math.min(0, xA, xB) - 6, x1: Math.max(0, xA, xB) + 6, y0: Math.min(0, yA, yB) - 6, y1: Math.max(0, yA, yB) + 6 };
		const alt = `Due punti nel piano cartesiano: A di coordinate ${sceneNum(String(xA))} e ${sceneNum(String(yA))} metri, B di coordinate ${sceneNum(String(xB))} e ${sceneNum(String(yB))} metri.`;
		const pts = [
			{ at: [xA, yA] as [number, number], nome: 'A' },
			{ at: [xB, yB] as [number, number], nome: 'B' },
		];
		return {
			prompt: 'Trova il modulo dello spostamento.',
			problem: textBlock(`Un pallone passa dal punto ${point('A', xA, yA)} al punto ${point('B', xB, yB)}. Quanto vale il modulo dello spostamento?`),
			solution: `\\Delta s ${rel(ds, ans)} ${qty(ans, 'm')}`,
			steps: [
				`\\Delta x = x_B - x_A = ${xB} - ${term(xA)} = ${dx}\\,\\text{m}`,
				`\\Delta y = y_B - y_A = ${yB} - ${term(yA)} = ${dy}\\,\\text{m}`,
				`\\Delta s = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2} = \\sqrt{${dx * dx + dy * dy}}\\,\\text{m} = ${res(ds, ans, 'm')}`,
			],
			// the components added as numbers; the difference of the distances from O; the sum of the positions; B's position
			answer: choiceOf(
				rng,
				qOpt(ans, 'm'),
				M([r2(Math.abs(dx) + Math.abs(dy)), r2(Math.abs(Math.hypot(xB, yB) - Math.hypot(xA, yA))), r2(Math.hypot(xA + xB, yA + yB)), r2(Math.hypot(xB, yB))]),
				near(ds, 'm'),
			),
			params: { xA, yA, xB, yB },
			scene: scene(alt, { u, assi: box, vettori: [], punti: pts }),
			solutionScene: scene(`${alt} Lo spostamento va da A a B.`, { u, assi: box, vettori: [{ da: [xA, yA], a: [xB, yB], nome: 'Δs', colore: 'risultante', etichetta: `${sceneNum(ans)} m` }], punti: pts }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the average velocity

const FLYERS = ['Un drone', 'Un gabbiano', 'Una barca a vela', 'Un pallone aerostatico'];

/** The two legs east and north, u cm per metre, with their lengths written. */
function legsScene(alt: string, a: number, b: number, la: string, lb: string, diagonal: boolean): SceneRef {
	const u = r3(3.2 / Math.max(a, b));
	return scene(alt, {
		u,
		vettori: [
			{ da: [0, 0], a: [a, 0], etichetta: la },
			{ da: [a, 0], a: [a, b], etichetta: lb },
			...(diagonal ? [{ da: [0, 0] as [number, number], a: [a, b] as [number, number], nome: 'Δs', colore: 'risultante' as const }] : []),
		],
		punti: [{ at: [0, 0], nome: 'A' }],
	});
}

function level2(rng: Rng): Built {
	for (;;) {
		const dx = dec2(rng, 11, 99), dy = dec2(rng, 11, 99), dt = dec2(rng, 1.1, 99);
		const X = Number(dx), Y = Number(dy), T = Number(dt);
		const ds = Math.hypot(X, Y);
		const vm = ds / T;
		const ans = r2(vm);
		if (ans === null || vm < 0.5) continue;
		const who = rng.pick(FLYERS);
		const alt = `${who} si sposta di ${sceneNum(dx)} metri verso est e di ${sceneNum(dy)} metri verso nord.`;
		return {
			prompt: 'Trova la velocità media.',
			problem: textBlock(`${who} si sposta di ${pq(dx, 'm')} verso est e di ${pq(dy, 'm')} verso nord in ${pq(dt, 's')}. Quanto vale il modulo della sua velocità media?`),
			solution: `v_m ${rel(vm, ans)} ${qty(ans, 'm/s')}`,
			steps: [
				`\\Delta s = \\sqrt{${decTex(dx)}^2 + ${decTex(dy)}^2}\\,\\text{m} = ${cutQ(ds, 'm')}`,
				`v_m = \\dfrac{\\Delta s}{\\Delta t} = \\dfrac{${cutQ(ds, 'm')}}{${qty(dt, 's')}} = ${res(vm, ans, 'm/s')}`,
			],
			// the components added; only the eastward component; the displacement for the velocity
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2((X + Y) / T), r2(X / T), r2(Y / T), r2(ds)]), near(vm, 'm/s')),
			params: { dx, dy, dt },
			scene: legsScene(alt, X, Y, `${sceneNum(dx)} m`, `${sceneNum(dy)} m`, false),
			solutionScene: legsScene(`${alt} Lo spostamento va dal punto di partenza a quello di arrivo.`, X, Y, `${sceneNum(dx)} m`, `${sceneNum(dy)} m`, true),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: average velocity and average scalar speed

const WALKERS = [
	{ who: 'Una ragazza', verb: 'cammina' },
	{ who: 'Un ragazzo', verb: 'corre' },
	{ who: 'Un cane', verb: 'corre' },
];

function level3(rng: Rng): Built {
	const scalar = rng.next() < 0.5;
	for (;;) {
		const d1 = dec2(rng, 11, 99), d2 = dec2(rng, 11, 99), t1 = dec2(rng, 2.0, 99), t2 = dec2(rng, 2.0, 99);
		const D1 = Number(d1), D2 = Number(d2), T1 = Number(t1), T2 = Number(t2);
		// a walker or a runner: each leg between 0,8 and 8 m/s
		if ([D1 / T1, D2 / T2].some((x) => x < 0.8 || x > 8)) continue;
		const T = T1 + T2;
		const path = D1 + D2, ds = Math.hypot(D1, D2);
		const exact = scalar ? path / T : ds / T;
		const other = scalar ? ds / T : path / T;
		const ans = r2(exact);
		if (ans === null || r2(other) === ans) continue;
		const w = rng.pick(WALKERS);
		const alt = `Il percorso: ${sceneNum(d1)} metri verso est, poi ${sceneNum(d2)} metri verso nord.`;
		return {
			prompt: scalar ? 'Trova la velocità scalare media.' : 'Trova la velocità media.',
			problem: textBlock(`${w.who} ${w.verb} per ${pq(d1, 'm')} verso est in ${pq(t1, 's')}, poi per ${pq(d2, 'm')} verso nord in ${pq(t2, 's')}. Quanto vale ${scalar ? 'la sua velocità scalare media' : 'il modulo della sua velocità media'}?`),
			solution: `${scalar ? '\\dfrac{d}{\\Delta t}' : 'v_m'} ${rel(exact, ans)} ${qty(ans, 'm/s')}`,
			steps: scalar
				? [
						`${t('Tempo: ')} \\Delta t = ${qty(t1, 's')} + ${qty(t2, 's')} = ${cutQ(T, 's')}`,
						`${t('Distanza percorsa: ')} d = ${qty(d1, 'm')} + ${qty(d2, 'm')} = ${cutQ(path, 'm')}`,
						`\\dfrac{d}{\\Delta t} = ${res(exact, ans, 'm/s')}`,
					]
				: [
						`${t('Tempo: ')} \\Delta t = ${qty(t1, 's')} + ${qty(t2, 's')} = ${cutQ(T, 's')}`,
						`${t('Spostamento: ')} \\Delta s = \\sqrt{d_1^2 + d_2^2} = ${cutQ(ds, 'm')}`,
						`v_m = \\dfrac{\\Delta s}{\\Delta t} = ${res(exact, ans, 'm/s')}`,
					],
			// the other average; the mean of the two legs' speeds; the time of one leg only
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(other), r2((D1 / T1 + D2 / T2) / 2), r2((scalar ? path : ds) / Math.max(T1, T2))]), near(exact, 'm/s')),
			params: { case: scalar ? 'scalare' : 'vettoriale', d1, d2, t1, t2 },
			scene: legsScene(alt, D1, D2, `${sceneNum(d1)} m`, `${sceneNum(d2)} m`, false),
			...(scalar ? {} : { solutionScene: legsScene(`${alt} Lo spostamento va dalla partenza all'arrivo.`, D1, D2, `${sceneNum(d1)} m`, `${sceneNum(d2)} m`, true) }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a component of the velocity

const RISERS = [
	{ who: 'Un aereo', verb: 'sale', lo: 51, hi: 99, a0: 5, a1: 25 },
	{ who: 'Un pallone calciato', verb: 'parte', lo: 11, hi: 35, a0: 15, a1: 70 },
	{ who: 'Un drone', verb: 'sale', lo: 1.1, hi: 9.9, a0: 10, a1: 80 },
];
const L = 2.4; // drawn length of the velocity, cm

function velocityScene(alt: string, v: string, a: number, comps?: { x: boolean }): SceneRef {
	const tip: [number, number] = [r3(L * Math.cos(a * DEG)), r3(L * Math.sin(a * DEG))];
	const box = { x0: -0.6, x1: Math.max(1.3, tip[0] + 0.6), y0: -0.6, y1: Math.max(1.4, tip[1] + 0.6) };
	return scene(alt, {
		u: 1,
		assi: box,
		vettori: [
			{ da: [0, 0], a: tip, nome: 'v', colore: 'velocita', etichetta: `${sceneNum(v)} m/s` },
			...(comps ? [comps.x ? { da: [0, 0] as [number, number], a: [tip[0], 0] as [number, number], nome: 'v', sub: 'x', colore: 'risultante' as const, tratteggiato: true } : { da: [0, 0] as [number, number], a: [0, tip[1]] as [number, number], nome: 'v', sub: 'y', colore: 'risultante' as const, tratteggiato: true }] : []),
		],
		angoli: [{ vettore: 0, rif: 'x', testo: `${a}°` }],
	});
}

function level4(rng: Rng): Built {
	const horiz = rng.next() < 0.5;
	for (;;) {
		const w = rng.pick(RISERS);
		const v = dec2(rng, w.lo, w.hi), a = rng.int(w.a0, w.a1);
		const V = Number(v);
		const exact = horiz ? V * Math.cos(a * DEG) : V * Math.sin(a * DEG);
		const other = horiz ? V * Math.sin(a * DEG) : V * Math.cos(a * DEG);
		const ans = r2(exact);
		if (ans === null || exact < 0.5) continue;
		const alt = `La velocità di ${sceneNum(v)} metri al secondo, inclinata di ${a} gradi sull'orizzontale.`;
		const fn = horiz ? '\\cos' : '\\sin';
		const rad = horiz ? V * Math.cos(a) : V * Math.sin(a);
		return {
			prompt: horiz ? 'Trova la componente orizzontale.' : 'Trova la componente verticale.',
			problem: textBlock(`${w.who} ${w.verb} con una velocità di ${pq(v, 'm/s')} inclinata di $${a}^\\circ$ sull'orizzontale. Quanto vale la componente ${horiz ? 'orizzontale' : 'verticale'} della velocità?`),
			solution: `v_${horiz ? 'x' : 'y'} ${rel(exact, ans)} ${qty(ans, 'm/s')}`,
			steps: [
				horiz ? t("La componente orizzontale è adiacente all'angolo: va con il coseno.") : t("La componente verticale è opposta all'angolo: va con il seno."),
				`v_${horiz ? 'x' : 'y'} = v ${fn}\\alpha = ${qty(v, 'm/s')} \\cdot ${fn} ${a}^\\circ = ${res(exact, ans, 'm/s')}`,
			],
			// sine and cosine swapped; the whole velocity; the calculator in radians (when positive)
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(other), r2(V), rad > 0 ? r2(rad) : null]), near(exact, 'm/s')),
			params: { case: horiz ? 'orizzontale' : 'verticale', v, angle: a },
			scene: velocityScene(alt, v, a),
			solutionScene: velocityScene(`${alt} La componente ${horiz ? 'orizzontale' : 'verticale'} è tratteggiata.`, v, a, { x: horiz }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the displacement in a time

const MOVERS = ['Una barca', 'Un rover', 'Un pattinatore', 'Un ciclista'];

function level5(rng: Rng): Built {
	const north = rng.next() < 0.5;
	for (;;) {
		const v = dec2(rng, 1.1, 9.9), dt = dec2(rng, 1.1, 99), a = rng.int(10, 80);
		const V = Number(v), T = Number(dt);
		const s = north ? Math.sin(a * DEG) : Math.cos(a * DEG);
		const c = north ? Math.cos(a * DEG) : Math.sin(a * DEG);
		const exact = V * s * T;
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		const who = rng.pick(MOVERS);
		const fn = north ? '\\sin' : '\\cos';
		return {
			prompt: `Trova lo spostamento verso ${north ? 'nord' : 'est'}.`,
			problem: textBlock(`${who} si muove in linea retta a ${pq(v, 'm/s')}, in una direzione che forma un angolo di $${a}^\\circ$ con la direzione est, verso nord. Di quanti metri si sposta verso ${north ? 'nord' : 'est'} in ${pq(dt, 's')}?`),
			solution: `\\Delta ${north ? 'y' : 'x'} ${rel(exact, ans)} ${qty(ans, 'm')}`,
			steps: [
				`v_${north ? 'y' : 'x'} = v ${fn}\\alpha = ${qty(v, 'm/s')} \\cdot ${fn} ${a}^\\circ = ${cutQ(V * s, 'm/s')}`,
				t(`Lungo l'asse ${north ? 'y' : 'x'} il moto è uniforme:`),
				`\\Delta ${north ? 'y' : 'x'} = v_${north ? 'y' : 'x'}\\,\\Delta t = ${cutQ(V * s, 'm/s')} \\cdot ${qty(dt, 's')} = ${res(exact, ans, 'm')}`,
			],
			// sine and cosine swapped; the whole displacement v·Δt; the time forgotten
			answer: choiceOf(rng, qOpt(ans, 'm'), M([r2(V * c * T), r2(V * T), r2(V * s)]), near(exact, 'm')),
			params: { case: north ? 'nord' : 'est', v, dt, angle: a },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level <= 4 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisSpostamentoVelocitaPiano: Generator = {
	id: ID,
	title: 'Spostamento e velocità nel piano',
	levels: {
		1: { label: 'Lo spostamento dalle coordinate', constraints: ['coordinate intere da 11 a 60 metri, con il segno', 'componenti dello spostamento di almeno 5 m'] },
		2: { label: 'La velocità media', constraints: ['spostamento verso est e verso nord', 'dati con due cifre significative'] },
		3: { label: 'Velocità media e velocità scalare media', constraints: ['due tratti perpendicolari', 'una delle due velocità, metà ciascuna'] },
		4: { label: 'Le componenti della velocità', constraints: ['angolo da 5° a 80° sull’orizzontale, secondo il contesto', 'componente orizzontale o verticale, metà ciascuna'] },
		5: { label: 'Lo spostamento in un intervallo', constraints: ['velocità costante, angolo da 10° a 80° dalla direzione est', 'spostamento verso est o verso nord'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisSpostamentoVelocitaPiano;
