/**
 * Il lancio obliquo e la gittata. Spec: specs/exercises/fis-lancio-obliquo.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/76-fis-lancio-obliquo.md), each one step harder: the
 * components of the launch velocity, v0 cos α and v0 sin α; the maximum height (v0 sin α)² / 2g; the time of flight
 * 2 v0 sin α / g; the range v0² sin 2α / g; the inverse problem, the launch speed from the range and the angle; the
 * launch from a height, where the time of flight comes from a second-degree equation and the range formula no longer
 * holds. g = 9,8 m/s², data with two significant figures, whole angles, answers with two significant figures, never
 * too close to a rounding boundary. Distractors from the lesson's warnings: sine and cosine swapped, the time of the
 * rise for the time of flight, sin α or 2 sin α for sin 2α, the same-level formula used from a height.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith, lab, r2 } from '../fisica-equilibrio';
import { G, cosD, cut4, datum, fallU, optU, optsU, pu, qu, r2p, sinD } from '../fis-forze-movimento';

export const ID = 'fis-lancio-obliquo';

const BODIES = [
	{ name: 'Un pallone', verb: 'viene calciato', e: 'o' },
	{ name: 'Una palla', verb: 'viene lanciata', e: 'a' },
	{ name: 'Un sasso', verb: 'viene lanciato', e: 'o' },
] as const;
const ANGLES = [20, 25, 30, 35, 40, 50, 55, 60, 65, 70];

/** A launch speed with two significant figures: 5,1 to 9,9 m/s or 11 to 35 m/s. */
function speed(rng: Rng): string {
	for (;;) {
		const s = datum(rng, rng.next() < 0.4 ? 'small' : 'big');
		const x = Number(s);
		if ((x >= 5 && x < 10) || (x > 10 && x <= 35)) return s;
	}
}

function scene(alt: string, d: { angle: number; v0?: string; L?: string; h?: string; path?: { L: number; h: number } }): SceneRef {
	const data: Record<string, unknown> = { angolo: d.angle, alfa: `${d.angle}°` };
	if (d.v0) data.v0 = `${lab(d.v0)} m/s`;
	if (d.h) data.h = `${lab(d.h)} m`;
	if (d.L) data.L = `${lab(d.L)} m`;
	if (d.path) data.traiettoria = { L: Math.round(d.path.L * 1000) / 1000, h: Math.round(d.path.h * 1000) / 1000 };
	return { type: 'lancio-obliquo', data, alt };
}

const VY_STEP = (v0: string, a: number, vy: number) => `v_{0y} = v_0\\sin\\alpha = ${qu(v0, 'm/s')} \\cdot \\sin ${a}^\\circ = ${cut4(vy)}\\,\\text{m/s}`;
const VX_STEP = (v0: string, a: number, vx: number) => `v_{0x} = v_0\\cos\\alpha = ${qu(v0, 'm/s')} \\cdot \\cos ${a}^\\circ = ${cut4(vx)}\\,\\text{m/s}`;

// ---------------------------------------------------------------------------
// Levels 1 to 4: launched from the ground with a given speed and angle

function launched(rng: Rng, level: 1 | 2 | 3 | 4): Built {
	for (;;) {
		const b = rng.pick(BODIES);
		const v0 = speed(rng), a = rng.pick(ANGLES);
		const V = Number(v0);
		const vx = V * cosD(a), vy = V * sinD(a);
		const intro = `${b.name} ${b.verb} da terra a ${pu(v0, 'm/s')}, con un angolo di $${a}^\\circ$ sull'orizzontale.`;
		const alt = `${b.name} lanciat${b.e} da terra a ${lab(v0)} metri al secondo, con un angolo di ${a} gradi sull'orizzontale.`;
		const sc = scene(alt, { angle: a, v0 });
		if (level === 1) {
			const horizontal = rng.next() < 0.5;
			const x = horizontal ? vx : vy;
			const ans = r2(x);
			if (ans === null) continue;
			return {
				prompt: `Trova la componente ${horizontal ? 'orizzontale' : 'verticale'} della velocità iniziale.`,
				problem: textBlock(`${intro} Quanto vale la componente ${horizontal ? 'orizzontale' : 'verticale'} della velocità iniziale?`),
				solution: `v_{0${horizontal ? 'x' : 'y'}} \\approx ${qu(ans, 'm/s')}`,
				steps: [
					t(horizontal ? "Con l'angolo misurato dall'orizzontale, la componente orizzontale usa il coseno:" : "Con l'angolo misurato dall'orizzontale, la componente verticale usa il seno:"),
					`${horizontal ? VX_STEP(v0, a, vx) : VY_STEP(v0, a, vy)} \\approx ${qu(ans, 'm/s')}`,
				],
				// sine and cosine swapped; the whole speed; the tangent
				answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(horizontal ? vy : vx), v0, r2p(V * Math.tan((a * Math.PI) / 180))], 'm/s'), fallU(x, 'm/s')),
				params: { case: horizontal ? 'orizzontale' : 'verticale', v0, angle: a },
				scene: sc,
			};
		}
		if (level === 2) {
			const h = (vy * vy) / (2 * G);
			const ans = r2(h);
			if (ans === null || h < 0.2) continue;
			return {
				prompt: "Trova l'altezza massima.",
				problem: textBlock(`${intro} Quale altezza massima raggiunge?`),
				solution: `h_{max} \\approx ${qu(ans, 'm')}`,
				steps: [
					VY_STEP(v0, a, vy),
					t('Nel punto più alto la componente verticale della velocità è zero:'),
					`h_{max} = \\dfrac{v_{0y}^2}{2\\,g} = \\dfrac{(${cut4(vy)}\\,\\text{m/s})^2}{2 \\cdot 9{,}8\\,\\text{m/s}^2} = ${cut4(h)}\\,\\text{m} \\approx ${qu(ans, 'm')}`,
				],
				// the whole speed; the horizontal component; the missing 2
				answer: choiceOf(rng, optU(ans, 'm'), optsU([r2p((V * V) / (2 * G)), r2p((vx * vx) / (2 * G)), r2p((vy * vy) / G)], 'm'), fallU(h, 'm')),
				params: { v0, angle: a },
				scene: sc,
			};
		}
		const tv = (2 * vy) / G;
		if (level === 3) {
			const ans = r2(tv);
			if (ans === null) continue;
			return {
				prompt: 'Trova il tempo di volo.',
				problem: textBlock(`${intro} Dopo quanto tempo ricade a terra?`),
				solution: `t_v \\approx ${qu(ans, 's')}`,
				steps: [
					VY_STEP(v0, a, vy),
					t('Il tempo di volo è il doppio del tempo di salita:'),
					`t_v = \\dfrac{2\\,v_{0y}}{g} = \\dfrac{2 \\cdot ${cut4(vy)}\\,\\text{m/s}}{9{,}8\\,\\text{m/s}^2} = ${cut4(tv)}\\,\\text{s} \\approx ${qu(ans, 's')}`,
				],
				// the time of the rise alone; the horizontal component; the whole speed
				answer: choiceOf(rng, optU(ans, 's'), optsU([r2p(vy / G), r2p((2 * vx) / G), r2p((2 * V) / G)], 's'), fallU(tv, 's')),
				params: { v0, angle: a },
				scene: sc,
			};
		}
		const L = (V * V * sinD(2 * a)) / G;
		const ans = r2(L);
		if (ans === null || L > 99) continue;
		return {
			prompt: 'Trova la gittata.',
			problem: textBlock(`${intro} A che distanza dal punto di lancio ricade a terra?`),
			solution: `L \\approx ${qu(ans, 'm')}`,
			steps: [
				t("Il corpo ricade alla quota di partenza: vale la formula della gittata, con il seno dell'angolo doppio."),
				`L = \\dfrac{v_0^2\\sin 2\\alpha}{g} = \\dfrac{(${qu(v0, 'm/s')})^2 \\cdot \\sin ${2 * a}^\\circ}{9{,}8\\,\\text{m/s}^2} = ${cut4(L)}\\,\\text{m} \\approx ${qu(ans, 'm')}`,
			],
			// the angle not doubled; twice the sine; half the range (the time of the rise)
			answer: choiceOf(rng, optU(ans, 'm'), optsU([r2p((V * V * sinD(a)) / G), r2p((2 * V * V * sinD(a)) / G), r2p(L / 2)], 'm'), fallU(L, 'm')),
			params: { v0, angle: a },
			scene: sc,
			solutionScene: scene(`${alt} La traiettoria ricade a ${lab(ans)} metri dal punto di lancio.`, { angle: a, v0, L: ans, path: { L, h: 0 } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the launch speed from the range

function inverse(rng: Rng): Built {
	for (;;) {
		const b = rng.pick(BODIES);
		const a = rng.pick(ANGLES);
		const L = datum(rng, rng.next() < 0.5 ? 'small' : 'big');
		const X = Number(L);
		const v0 = Math.sqrt((G * X) / sinD(2 * a));
		const ans = r2(v0);
		if (ans === null || v0 < 3 || v0 > 35) continue;
		return {
			prompt: 'Trova la velocità di lancio.',
			problem: textBlock(`${b.name} ${b.verb} da terra con un angolo di $${a}^\\circ$ sull'orizzontale e ricade a terra a ${pu(L, 'm')} dal punto di lancio. Con quale velocità è partit${b.e}?`),
			solution: `v_0 \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t('Dalla formula della gittata si ricava la velocità:'),
				`L = \\dfrac{v_0^2\\sin 2\\alpha}{g} \\quad\\Rightarrow\\quad v_0 = \\sqrt{\\dfrac{g\\,L}{\\sin 2\\alpha}}`,
				`v_0 = \\sqrt{\\dfrac{9{,}8\\,\\text{m/s}^2 \\cdot ${qu(L, 'm')}}{\\sin ${2 * a}^\\circ}} = ${cut4(v0)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the angle not doubled; the angle forgotten; multiplied by the sine
			answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(Math.sqrt((G * X) / sinD(a))), r2p(Math.sqrt(G * X)), r2p(Math.sqrt(G * X * sinD(2 * a)))], 'm/s'), fallU(v0, 'm/s')),
			params: { L, angle: a },
			scene: scene(`${b.name} lanciat${b.e} da terra con un angolo di ${a} gradi, che ricade a ${lab(L)} metri dal punto di lancio. Il disegno non è in scala.`, { angle: a, L }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: launched from a height

const HIGH_ANGLES = [20, 25, 30, 35, 40, 50, 55, 60];

function fromHeight(rng: Rng): Built {
	for (;;) {
		const h = datum(rng, rng.next() < 0.5 ? 'small' : 'big');
		const H = Number(h);
		if (H < 2 || H > 60) continue;
		const balcony = H < 10;
		const body = balcony ? { name: 'Una palla', e: 'a' } : { name: 'Un sasso', e: 'o' };
		const from = balcony ? 'da un balcone alto' : 'dalla cima di una scogliera alta';
		const v0 = speed(rng), a = rng.pick(HIGH_ANGLES);
		const V = Number(v0);
		const vx = V * cosD(a), vy = V * sinD(a);
		const root = Math.sqrt(vy * vy + 2 * G * H);
		const tv = (vy + root) / G;
		const L = vx * tv;
		const ans = r2(L);
		if (ans === null || L > 99) continue;
		const alt = `${body.name} lanciat${body.e} ${from} ${lab(h)} metri, a ${lab(v0)} metri al secondo, con un angolo di ${a} gradi sopra l'orizzontale.`;
		return {
			prompt: 'Trova la gittata.',
			problem: textBlock(`${body.name} viene lanciat${body.e} ${from} ${pu(h, 'm')}, a ${pu(v0, 'm/s')}, con un angolo di $${a}^\\circ$ sopra l'orizzontale. A che distanza dalla base tocca il suolo?`),
			solution: `L \\approx ${qu(ans, 'm')}`,
			steps: [
				`${VX_STEP(v0, a, vx)} \\qquad ${VY_STEP(v0, a, vy)}`,
				t('Il corpo non ricade alla quota di partenza: il tempo di volo si trova da'),
				`h + v_{0y}\\,t - \\tfrac{1}{2}\\,g\\,t^2 = 0`,
				`t_v = \\dfrac{v_{0y} + \\sqrt{v_{0y}^2 + 2\\,g\\,h}}{g} = \\dfrac{${cut4(vy)} + ${cut4(root)}}{9{,}8}\\,\\text{s} = ${cut4(tv)}\\,\\text{s}`,
				`L = v_{0x}\\,t_v = ${cut4(vx)}\\,\\text{m/s} \\cdot ${cut4(tv)}\\,\\text{s} = ${cut4(L)}\\,\\text{m} \\approx ${qu(ans, 'm')}`,
			],
			// the same-level formula; the time of a horizontal launch; the other root's sign
			answer: choiceOf(rng, optU(ans, 'm'), optsU([r2p((V * V * sinD(2 * a)) / G), r2p(vx * Math.sqrt((2 * H) / G)), r2p((vx * (root - vy)) / G)], 'm'), fallU(L, 'm')),
			params: { h, v0, angle: a },
			scene: scene(`${alt} Il disegno non è in scala.`, { angle: a, v0, h }),
			solutionScene: scene(`${alt} La traiettoria tocca il suolo a ${lab(ans)} metri dalla base.`, { angle: a, v0, h, L: ans, path: { L, h: H } }),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => launched(rng, 1),
	2: (rng) => launched(rng, 2),
	3: (rng) => launched(rng, 3),
	4: (rng) => launched(rng, 4),
	5: inverse,
	6: fromHeight,
};

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisLancioObliquo: Generator = {
	id: ID,
	title: 'Il lancio obliquo e la gittata',
	levels: {
		1: { label: 'Le componenti della velocità iniziale', constraints: ['orizzontale o verticale, metà ciascuno', 'angoli da 20° a 70°, mai 45°'] },
		2: { label: "L'altezza massima", constraints: ['h = v0y² / 2g'] },
		3: { label: 'Il tempo di volo', constraints: ['t = 2 v0y / g'] },
		4: { label: 'La gittata', constraints: ["L = v0² sin 2α / g, con il seno dell'angolo doppio"] },
		5: { label: 'La velocità dalla gittata', constraints: ['v0 tra 3 e 35 m/s'] },
		6: { label: 'Il lancio da una quota', constraints: ['altezza da 2,1 a 60 m', 'il tempo di volo da una equazione di secondo grado'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisLancioObliquo;
