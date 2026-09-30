/**
 * Il grafico velocità-tempo. Spec: specs/exercises/fis-grafico-velocita-tempo.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/43-fis-grafico-velocita-tempo.md), each one step harder:
 * the acceleration from the slope of one straight piece; the displacement as the area of a trapezium; the displacement
 * of a trip in three pieces (accelerate, cruise, brake); areas with their sign (a graph that crosses the time axis:
 * displacement or distance travelled); the average velocity of a trip in three pieces. Every vertex is on a grid
 * point of the `grafico-velocita-tempo` scene, so the values are read exactly; areas are exact decimals, slopes and
 * average velocities are rounded to two significant figures. Distractors from the lesson's warnings: v0 ignored in
 * the slope, the ratio upside down, the sign of a braking slope, rectangle or triangle for a trapezium, a piece left
 * out, displacement and distance swapped, the average of the velocities for the average velocity.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, t } from '../vettori';
import { type Built, checkCommon, generateWith, opts, r2 } from '../fisica-equilibrio';
import { accOpt, exact, mOpt, msOpt, ms } from '../fis-moto-accelerato';

export const ID = 'fis-grafico-velocita-tempo';

type Pt = [number, number];
const lab = (x: number) => String(x).replace('.', ',').replace('-', 'meno ');
const ex = (x: number) => exact(x) ?? String(x);
const m = (x: number) => `${decTex(ex(x))}\\,\\text{m}`;

function graph(alt: string, tStep: number, vStep: number, pts: Pt[], extra: { vMin?: number; aree?: boolean } = {}): SceneRef {
	const tMax = pts[pts.length - 1][0];
	const top = Math.max(...pts.map((p) => p[1]));
	const low = Math.min(0, ...pts.map((p) => p[1]));
	const data: Record<string, unknown> = { tMax, tPasso: tStep, vMin: low < 0 ? low - vStep : 0, vMax: top + vStep, vPasso: vStep, punti: pts };
	if (extra.aree) data.aree = true;
	return { type: 'grafico-velocita-tempo', data, alt };
}

const MOVERS = ["un'auto", 'un ciclista', 'un carrello', 'uno scooter'];
const TRIPS = ['un autobus', 'un tram', 'un treno della metropolitana'];

// ---------------------------------------------------------------------------
// Level 1: the acceleration from the slope

function level1(rng: Rng): Built {
	const brake = rng.next() < 0.5;
	for (;;) {
		const tStep = rng.pick([1, 2]), vStep = rng.pick([1, 2, 5]);
		const n = rng.int(3, 8);
		const i = rng.int(0, 8), j = rng.int(0, 8);
		if (brake ? j >= i : j <= i) continue;
		const T = n * tStep, v0 = i * vStep, v1 = j * vStep;
		const a = (v1 - v0) / T;
		const ans = r2(a);
		if (ans === null) continue;
		const who = rng.pick(MOVERS);
		const pts: Pt[] = [[0, v0], [T, v1]];
		return {
			prompt: "Trova l'accelerazione dal grafico.",
			problem: textBlock(`Il grafico mostra la velocità di ${who} in funzione del tempo. Quanto vale l'accelerazione?`),
			solution: `a \\approx ${decTex(ans)}\\,\\text{m/s}^2`,
			steps: [
				t("L'accelerazione è la pendenza del grafico: si leggono due punti sugli assi.") ,
				`a = \\dfrac{\\Delta v}{\\Delta t} = \\dfrac{${ms(String(v1))} - ${ms(String(v0))}}{${T}\\,\\text{s} - 0\\,\\text{s}} = ${decTex(ex(Math.round(a * 1000) / 1000))}${Math.abs(a * 1000 - Math.round(a * 1000)) > 1e-6 ? '\\ldots' : ''}\\,\\text{m/s}^2 \\approx ${decTex(ans)}\\,\\text{m/s}^2`,
				brake ? t('Il grafico scende: l\'accelerazione è negativa, il corpo frena.') : t('Il grafico sale: l\'accelerazione è positiva.'),
			],
			// v0 ignored; the ratio upside down; the sign swapped
			answer: choiceOf(rng, accOpt(ans), opts([v1 ? r2(v1 / T) : null, r2(T / (v1 - v0)), r2(-a)], accOpt), opts([r2(a * 2), r2(a / 2), r2((v1 + v0) / T)], accOpt)),
			params: { case: brake ? 'frena' : 'accelera' },
			scene: graph(`Grafico velocità-tempo: una retta da 0 secondi e ${lab(v0)} metri al secondo a ${lab(T)} secondi e ${lab(v1)} metri al secondo.`, tStep, vStep, pts),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the displacement as an area

function level2(rng: Rng): Built {
	const brake = rng.next() < 0.5;
	for (;;) {
		const tStep = rng.pick([1, 2, 5]), vStep = rng.pick([1, 2, 5]);
		const n = rng.int(3, 8);
		const i = rng.int(1, 8), j = rng.int(1, 8);
		if (brake ? j >= i : j <= i) continue;
		const T = n * tStep, v0 = i * vStep, v1 = j * vStep;
		const s = ((v0 + v1) / 2) * T;
		const who = rng.pick(MOVERS);
		const pts: Pt[] = [[0, v0], [T, v1]];
		const wrong = [v1 * T, (v1 * T) / 2, (Math.abs(v1 - v0) * T) / 2, v0 * T].filter((x) => x > 0 && Math.abs(x - s) > 1e-9);
		return {
			prompt: 'Trova lo spostamento dal grafico.',
			problem: textBlock(`Il grafico mostra la velocità di ${who} in funzione del tempo. Quanto vale lo spostamento tra $0$ e $${T}\\,\\text{s}$?`),
			solution: `\\Delta s = ${m(s)}`,
			steps: [
				t("Lo spostamento è l'area sotto il grafico, un trapezio con le basi ") + ` v_1 = ${ms(String(v0))} ` + t(' e ') + ` v_2 = ${ms(String(v1))}` + t(':'),
				`\\Delta s = \\dfrac{v_1 + v_2}{2} \\cdot \\Delta t = \\dfrac{${decTex(String(v0))} + ${decTex(String(v1))}}{2}\\,\\text{m/s} \\cdot ${T}\\,\\text{s} = ${m(s)}`,
			],
			// a rectangle at the final velocity; a triangle; only the triangle above the lower base; the rectangle at v0
			answer: choiceOf(rng, mOpt(ex(s)), wrong.map((x) => mOpt(ex(x))), [mOpt(ex(2 * s)), mOpt(ex(s + v0))]),
			params: { case: brake ? 'frena' : 'accelera' },
			scene: graph(`Grafico velocità-tempo: una retta da 0 secondi e ${lab(v0)} metri al secondo a ${lab(T)} secondi e ${lab(v1)} metri al secondo.`, tStep, vStep, pts),
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 3 and 5: a trip in three pieces

function trip(rng: Rng) {
	for (;;) {
		const tStep = rng.pick([1, 2, 5]), vStep = rng.pick([1, 2, 3]);
		const p = rng.int(1, 3), q = rng.int(1, 6), r = rng.int(1, 3);
		if (p + q + r < 4 || p + q + r > 10) continue;
		const k = rng.int(2, 7);
		const t1 = p * tStep, t2 = (p + q) * tStep, T = (p + q + r) * tStep, V = k * vStep;
		const pts: Pt[] = [[0, 0], [t1, V], [t2, V], [T, 0]];
		const s = V * (t2 - t1) + (V * t1) / 2 + (V * (T - t2)) / 2;
		return { tStep, vStep, t1, t2, T, V, pts, s, alt: `Grafico velocità-tempo di un viaggio tra due fermate: da 0 la velocità sale in linea retta fino a ${lab(V)} metri al secondo a ${lab(t1)} secondi, resta costante fino a ${lab(t2)} secondi e scende in linea retta fino a zero a ${lab(T)} secondi.` };
	}
}

function level3(rng: Rng): Built {
	for (;;) {
		const g = trip(rng);
		const { t1, t2, T, V, s } = g;
		const who = rng.pick(TRIPS);
		const wrong = [V * T, V * (t2 - t1), (V * T) / 2, V * (t2 - t1) + (V * t1) / 2].filter((x) => Math.abs(x - s) > 1e-9);
		const a1 = (V * t1) / 2, a2 = V * (t2 - t1), a3 = (V * (T - t2)) / 2;
		try {
			return {
				prompt: 'Trova lo spazio percorso dal grafico.',
				problem: textBlock(`Il grafico mostra la velocità di ${who} tra due fermate. Quanta strada percorre tra le due fermate?`),
				solution: `\\Delta s = ${m(s)}`,
				steps: [
					t("Si divide l'area in un triangolo, un rettangolo e un triangolo:"),
					`\\tfrac{1}{2} \\cdot ${ms(String(V))} \\cdot ${t1}\\,\\text{s} = ${m(a1)} \\qquad ${ms(String(V))} \\cdot ${t2 - t1}\\,\\text{s} = ${m(a2)} \\qquad \\tfrac{1}{2} \\cdot ${ms(String(V))} \\cdot ${T - t2}\\,\\text{s} = ${m(a3)}`,
					`\\Delta s = ${m(a1)} + ${m(a2)} + ${m(a3)} = ${m(s)}`,
				],
				// the whole rectangle; only the middle piece; one triangle; the last piece left out
				answer: choiceOf(rng, mOpt(ex(s)), wrong.map((x) => mOpt(ex(x))), [mOpt(ex(2 * s)), mOpt(ex(s + V))]),
				params: { case: 'tratti' },
				scene: graph(g.alt, g.tStep, g.vStep, g.pts),
			};
		} catch {
			continue;
		}
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const g = trip(rng);
		const { t1, t2, T, V, s } = g;
		const vm = s / T;
		const ans = r2(vm);
		if (ans === null) continue;
		const who = rng.pick(TRIPS);
		try {
			return {
				prompt: 'Trova la velocità media dal grafico.',
				problem: textBlock(`Il grafico mostra la velocità di ${who} tra due fermate. Qual è la sua velocità media tra le due fermate?`),
				solution: `v_m \\approx ${ms(ans)}`,
				steps: [
					t("Lo spostamento è l'area sotto il grafico: ") + ` \\Delta s = \\tfrac{1}{2} \\cdot ${V} \\cdot ${t1} + ${V} \\cdot ${t2 - t1} + \\tfrac{1}{2} \\cdot ${V} \\cdot ${T - t2} = ${m(s)}`,
					`v_m = \\dfrac{\\Delta s}{\\Delta t} = \\dfrac{${m(s)}}{${T}\\,\\text{s}} = ${decTex(ex(Math.round(vm * 1000) / 1000))}${Math.abs(vm * 1000 - Math.round(vm * 1000)) > 1e-6 ? '\\ldots' : ''}\\,\\text{m/s} \\approx ${ms(ans)}`,
				],
				// the average of the lowest and highest velocity; the highest velocity; the time of the middle piece only
				answer: choiceOf(rng, msOpt(ans), opts([r2(V / 2), r2(V), r2(s / (t2 - t1))], msOpt), opts([r2(vm * 1.2), r2(vm * 0.8), r2(vm * 1.4)], msOpt)),
				params: { case: 'media' },
				scene: graph(g.alt, g.tStep, g.vStep, g.pts),
			};
		} catch {
			continue;
		}
	}
}

// ---------------------------------------------------------------------------
// Level 4: areas with their sign

function level4(rng: Rng): Built {
	const askDist = rng.next() < 0.5;
	for (;;) {
		const tStep = rng.pick([0.5, 1, 2]), vStep = rng.pick([1, 2]);
		const p = rng.int(1, 6), q = rng.int(1, 6);
		if (p + q > 8) continue;
		const rr = rng.pick([0.5, 1, 1.5, 2]);
		const i = rr * p, j = rr * q;
		if (!Number.isInteger(i) || !Number.isInteger(j) || i + j > 10 || i > 7 || j > 6) continue;
		const tc = p * tStep, T = (p + q) * tStep, v0 = i * vStep, v1 = -j * vStep;
		const pos = (v0 * tc) / 2, neg = (-v1 * (T - tc)) / 2;
		const disp = pos - neg, dist = pos + neg;
		if (Math.abs(disp) < 1e-9) continue;
		const ans = askDist ? dist : disp;
		const pts: Pt[] = [[0, v0], [T, v1]];
		const wrong = askDist ? [Math.abs(disp), pos, 2 * pos] : [dist, pos, -disp];
		const Ts = exact(T)!;
		try {
			return {
				prompt: askDist ? 'Trova la distanza percorsa.' : 'Trova lo spostamento.',
				problem: textBlock(
					`Una palla viene lanciata su per un piano inclinato, con l'asse rivolto verso l'alto lungo il piano. Il grafico mostra la sua velocità. ${askDist ? `Quanta strada percorre in tutto tra $0$ e $${decTex(Ts)}\\,\\text{s}$?` : `Quanto vale il suo spostamento tra $0$ e $${decTex(Ts)}\\,\\text{s}$?`}`,
				),
				solution: `${askDist ? '\\text{distanza}' : '\\Delta s'} = ${m(ans)}`,
				steps: [
					t('Il grafico taglia l\'asse dei tempi a ') + ` ${decTex(exact(tc)!)}\\,\\text{s}` + t(': fin lì la palla sale, poi scende.'),
					t('Area sopra l\'asse: ') + ` \\tfrac{1}{2} \\cdot ${ms(String(v0))} \\cdot ${decTex(exact(tc)!)}\\,\\text{s} = ${m(pos)}` + t(';  area sotto: ') + ` \\tfrac{1}{2} \\cdot ${ms(String(-v1))} \\cdot ${decTex(exact(T - tc)!)}\\,\\text{s} = ${m(neg)}`,
					askDist ? `\\text{distanza} = ${m(pos)} + ${m(neg)} = ${m(dist)}` : `\\Delta s = ${m(pos)} - ${m(neg)} = ${m(disp)}`,
				],
				// displacement and distance swapped; only the part above the axis; the sign swapped (or the part above twice)
				answer: choiceOf(rng, mOpt(ex(ans)), wrong.filter((x) => Math.abs(x - ans) > 1e-9).map((x) => mOpt(ex(x))), [mOpt(ex(ans + v0)), mOpt(ex(2 * Math.abs(ans) + 1))]),
				params: { case: askDist ? 'distanza' : 'spostamento' },
				scene: graph(`Grafico velocità-tempo della palla: una retta che scende da ${lab(v0)} metri al secondo a 0 secondi a meno ${lab(-v1)} metri al secondo a ${lab(T)} secondi, e taglia l'asse dei tempi a ${lab(tc)} secondi.`, tStep, vStep, pts),
			};
		} catch {
			continue;
		}
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisGraficoVelocitaTempo: Generator = {
	id: ID,
	title: 'Il grafico velocità-tempo',
	levels: {
		1: { label: "L'accelerazione dalla pendenza", constraints: ['un tratto rettilineo', 'sale o scende, metà ciascuno'] },
		2: { label: "Lo spostamento dall'area", constraints: ['un trapezio', 'sale o scende, metà ciascuno'] },
		3: { label: 'Un viaggio a tratti', constraints: ['accelera, velocità costante, frena'] },
		4: { label: 'Le aree con il segno', constraints: ["il grafico taglia l'asse dei tempi", 'spostamento o distanza percorsa, metà ciascuno'] },
		5: { label: 'La velocità media', constraints: ['un viaggio a tratti', 'spostamento diviso tempo'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisGraficoVelocitaTempo;
