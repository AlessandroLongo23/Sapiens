/**
 * Il moto di un proiettile lanciato in orizzontale. Spec: specs/exercises/fis-moto-proiettili.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/56-fis-moto-proiettili.md), each one step harder: the
 * time of flight √(2h/g), which does not depend on v0; the range v0 √(2h/g); the inverse problem, the launch speed
 * from the range and the height or the height from the range and the speed; the speed at landing √(v0² + 2gh); the
 * angle of the landing velocity below the horizontal, tan β = √(2gh)/v0. g = 9,8 m/s², data with two significant
 * figures, answers with two (angles to the degree), never too close to a rounding boundary. Distractors from the
 * lesson's warnings: the missing 2 or square root, the components added as numbers, the height divided by the speed,
 * the angle of the straight line from the edge to the landing point.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, roundDeg, t } from '../vettori';
import { type Built, checkCommon, degOpt, generateWith, lab, opts, r2 } from '../fisica-equilibrio';
import { G, cut4, datum, fallU, optU, optsU, pu, qu, r2p } from '../fis-forze-movimento';

export const ID = 'fis-moto-proiettili';
const RAD = 180 / Math.PI;

/** Where it is launched from, by height: a table up to 1,9 m, a balcony up to 9,9 m, a cliff above. */
function place(h: number) {
	if (h < 2) return { body: 'Una pallina', e: 'a', from: 'dal bordo di un tavolo alto', ctx: 'tavolo' };
	if (h < 10) return { body: 'Una pallina', e: 'a', from: 'da un balcone alto', ctx: 'balcone' };
	return { body: 'Un sasso', e: 'o', from: 'dalla cima di una scogliera alta', ctx: 'scogliera' };
}
/** A height of two significant figures: 1,1 to 9,9 m or 11 to 99 m, half each. */
const height = (rng: Rng) => datum(rng, rng.next() < 0.5 ? 'small' : 'big');

function scene(alt: string, d: { h?: string; v0?: string; x?: string; path?: { h: number; x: number } }): SceneRef {
	const data: Record<string, unknown> = {};
	if (d.h) data.h = `${lab(d.h)} m`;
	if (d.v0) data.v0 = `${lab(d.v0)} m/s`;
	if (d.x) data.x = `${lab(d.x)} m`;
	if (d.path) data.traiettoria = { h: Math.round(d.path.h * 1000) / 1000, x: Math.round(d.path.x * 1000) / 1000 };
	return { type: 'lancio-orizzontale', data, alt };
}

const T_STEP = (h: string, tv: number) => `t_v = \\sqrt{\\dfrac{2\\,h}{g}} = \\sqrt{\\dfrac{2 \\cdot ${qu(h, 'm')}}{9{,}8\\,\\text{m/s}^2}} = ${cut4(tv)}\\,\\text{s}`;

// ---------------------------------------------------------------------------
// Levels 1, 2, 4, 5: launched from a height with a given speed

function launched(rng: Rng, level: 1 | 2 | 4 | 5): Built {
	for (;;) {
		const h = height(rng), v0 = datum(rng, 'small');
		const H = Number(h), V = Number(v0);
		const tv = Math.sqrt((2 * H) / G);
		const vy = G * tv;
		const x = V * tv;
		const p = place(H);
		const intro = `${p.body} viene lanciat${p.e} in orizzontale a ${pu(v0, 'm/s')} ${p.from} ${pu(h, 'm')}.`;
		const alt = `${p.body} lanciat${p.e} in orizzontale ${p.from} ${lab(h)} metri, a ${lab(v0)} metri al secondo.`;
		const sc = scene(alt, { h, v0 });
		if (level === 1) {
			const ans = r2(tv);
			if (ans === null) continue;
			return {
				prompt: 'Trova il tempo di volo.',
				problem: textBlock(`${intro} Dopo quanto tempo tocca il suolo?`),
				solution: `t_v \\approx ${qu(ans, 's')}`,
				steps: [t('Il moto verticale è una caduta libera da ferma, e non dipende dalla velocità orizzontale:'), `${T_STEP(h, tv)} \\approx ${qu(ans, 's')}`],
				// the missing 2; no square root; the height over the horizontal speed
				answer: choiceOf(rng, optU(ans, 's'), optsU([r2p(Math.sqrt(H / G)), r2p((2 * H) / G), r2p(H / V)], 's'), fallU(tv, 's')),
				params: { h, v0 },
				scene: sc,
			};
		}
		if (level === 2) {
			const ans = r2(x);
			if (ans === null || x < 0.1) continue;
			return {
				prompt: 'Trova la gittata.',
				problem: textBlock(`${intro} A che distanza dalla base tocca il suolo?`),
				solution: `x_G \\approx ${qu(ans, 'm')}`,
				steps: [T_STEP(h, tv), t('Nel moto orizzontale uniforme:'), `x_G = v_0\\,t_v = ${qu(v0, 'm/s')} \\cdot ${cut4(tv)}\\,\\text{s} = ${cut4(x)}\\,\\text{m} \\approx ${qu(ans, 'm')}`],
				// the missing 2; no square root; the height itself
				answer: choiceOf(rng, optU(ans, 'm'), optsU([r2p(V * Math.sqrt(H / G)), r2p((V * 2 * H) / G), h], 'm'), fallU(x, 'm')),
				params: { h, v0 },
				scene: sc,
				solutionScene: scene(`${alt} La traiettoria arriva a ${lab(ans)} metri dalla base.`, { h, v0, x: ans, path: { h: H, x } }),
			};
		}
		if (level === 4) {
			const vf = Math.sqrt(V * V + vy * vy);
			const ans = r2(vf);
			if (ans === null) continue;
			return {
				prompt: "Trova la velocità all'arrivo.",
				problem: textBlock(`${intro} Con quale velocità tocca il suolo?`),
				solution: `v \\approx ${qu(ans, 'm/s')}`,
				steps: [
					t('La componente orizzontale resta v0; quella verticale, alla fine della caduta:'),
					`|v_y| = \\sqrt{2\\,g\\,h} = \\sqrt{2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qu(h, 'm')}} = ${cut4(vy)}\\,\\text{m/s}`,
					`v = \\sqrt{v_0^2 + v_y^2} = \\sqrt{(${qu(v0, 'm/s')})^2 + (${cut4(vy)}\\,\\text{m/s})^2} = ${cut4(vf)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
				],
				// the components added as numbers; the vertical component alone; the launch speed
				answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(V + vy), r2p(vy), v0], 'm/s'), fallU(vf, 'm/s')),
				params: { h, v0 },
				scene: sc,
			};
		}
		const beta = Math.atan(vy / V) * RAD;
		const ans = roundDeg(beta);
		if (ans === null || beta < 10 || beta > 85) continue;
		const b = Number(ans);
		return {
			prompt: "Trova l'angolo all'arrivo.",
			problem: textBlock(`${intro} Quale angolo forma la sua velocità con l'orizzontale quando tocca il suolo?`),
			solution: `\\beta \\approx ${ans}^\\circ`,
			steps: [
				`|v_y| = \\sqrt{2\\,g\\,h} = ${cut4(vy)}\\,\\text{m/s} \\qquad v_x = ${qu(v0, 'm/s')}`,
				`\\tan\\beta = \\dfrac{|v_y|}{v_x} = ${cut4(vy / V)} \\quad\\Rightarrow\\quad \\beta = ${cut4(beta)}^\\circ \\approx ${ans}^\\circ`,
				t("L'angolo è sotto l'orizzontale."),
			],
			// the components swapped; the straight line from the edge to the landing point (tan = h/x)
			answer: choiceOf(
				rng,
				degOpt(ans),
				opts([roundDeg(90 - beta), roundDeg(Math.atan(H / x) * RAD)], degOpt),
				[b + 4, b - 4, b + 8, b - 8].filter((y) => y > 0 && y < 90).map((y) => degOpt(String(y))),
			),
			params: { h, v0 },
			scene: sc,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the launch speed or the height, from the range

function inverse(rng: Rng): Built {
	const askSpeed = rng.next() < 0.5;
	for (;;) {
		const x = datum(rng, rng.next() < 0.5 ? 'small' : 'big');
		const X = Number(x);
		if (askSpeed) {
			const h = height(rng);
			const H = Number(h);
			const tv = Math.sqrt((2 * H) / G);
			const v0 = X / tv;
			const ans = r2(v0);
			if (ans === null || v0 < 0.5 || v0 > 40) continue;
			const p = place(H);
			return {
				prompt: 'Trova la velocità di lancio.',
				problem: textBlock(`${p.body}, lanciat${p.e} in orizzontale ${p.from} ${pu(h, 'm')}, tocca il suolo a ${pu(x, 'm')} dalla base. Con quale velocità è stat${p.e} lanciat${p.e}?`),
				solution: `v_0 \\approx ${qu(ans, 'm/s')}`,
				steps: [T_STEP(h, tv), t('Nel moto orizzontale uniforme:'), `v_0 = \\dfrac{x_G}{t_v} = \\dfrac{${qu(x, 'm')}}{${cut4(tv)}\\,\\text{s}} = ${cut4(v0)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`],
				// the missing 2; multiplied by the time; no square root
				answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(X / Math.sqrt(H / G)), r2p(X * tv), r2p(X / ((2 * H) / G))], 'm/s'), fallU(v0, 'm/s')),
				params: { case: 'velocita', h, x },
				scene: scene(`${p.body} lanciat${p.e} in orizzontale ${p.from} ${lab(h)} metri, che tocca il suolo a ${lab(x)} metri dalla base. Il disegno non è in scala.`, { h, x }),
			};
		}
		const v0 = datum(rng, 'small');
		const V = Number(v0);
		const tv = X / V;
		const h = (G * tv * tv) / 2;
		const ans = r2(h);
		if (ans === null || h < 0.5 || h > 99) continue;
		const p = place(Number(ans));
		const where = p.ctx === 'tavolo' ? 'dal bordo di un tavolo' : p.ctx === 'balcone' ? 'da un balcone' : 'dalla cima di una scogliera';
		const what = p.ctx === 'tavolo' ? 'il tavolo' : p.ctx === 'balcone' ? 'il balcone' : 'la scogliera';
		const alto = p.ctx === 'scogliera' ? 'alta' : 'alto';
		return {
			prompt: "Trova l'altezza.",
			problem: textBlock(`${p.body}, lanciat${p.e} in orizzontale a ${pu(v0, 'm/s')} ${where}, tocca il suolo a ${pu(x, 'm')} dalla base. Quanto è ${alto} ${what}?`),
			solution: `h \\approx ${qu(ans, 'm')}`,
			steps: [
				t('Dal moto orizzontale uniforme, il tempo di volo:'),
				`t_v = \\dfrac{x_G}{v_0} = \\dfrac{${qu(x, 'm')}}{${qu(v0, 'm/s')}} = ${cut4(tv)}\\,\\text{s}`,
				t('Nel moto verticale di caduta libera:'),
				`h = \\tfrac{1}{2}\\,g\\,t_v^2 = \\tfrac{1}{2} \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot (${cut4(tv)}\\,\\text{s})^2 = ${cut4(h)}\\,\\text{m} \\approx ${qu(ans, 'm')}`,
			],
			// the missing 1/2; the time not squared; g t² / 2 with the time x·v0
			answer: choiceOf(rng, optU(ans, 'm'), optsU([r2p(G * tv * tv), r2p((G * tv) / 2), r2p((G * (X * V) ** 2) / 2)], 'm'), fallU(h, 'm')),
			params: { case: 'altezza', v0, x },
			scene: scene(`${p.body} lanciat${p.e} in orizzontale a ${lab(v0)} metri al secondo, che tocca il suolo a ${lab(x)} metri dalla base. Il disegno non è in scala.`, { v0, x }),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => launched(rng, 1),
	2: (rng) => launched(rng, 2),
	3: inverse,
	4: (rng) => launched(rng, 4),
	5: (rng) => launched(rng, 5),
};

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisMotoProiettili: Generator = {
	id: ID,
	title: 'Il moto di un proiettile lanciato in orizzontale',
	levels: {
		1: { label: 'Il tempo di volo', constraints: ['altezza da 1,1 a 99 m', 'la velocità non conta'] },
		2: { label: 'La gittata', constraints: ['x = v0 per il tempo di volo'] },
		3: { label: 'Il problema inverso', constraints: ["la velocità o l'altezza dalla gittata, metà ciascuno"] },
		4: { label: "La velocità all'arrivo", constraints: ['le componenti si sommano con Pitagora'] },
		5: { label: "L'angolo all'arrivo", constraints: ['tan β = |vy| / v0, al grado', 'β tra 10° e 85°'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMotoProiettili;
