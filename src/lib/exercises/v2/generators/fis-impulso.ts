/**
 * L'impulso e il teorema dell'impulso. Spec: specs/exercises/fis-impulso.md
 *
 * Seven levels from the lesson (docs/lezioni/fisica/riscritte/81-fis-impulso.md), each one step harder: the impulse of
 * a constant force, I = F Δt; the speed it gives to a body at rest, v = F Δt / m; the mean force that stops a body in a
 * time given in milliseconds, F = m v / Δt; the mean force in a bounce, F = m (v₁ + v₂) / Δt; the impulse as the area
 * under a force-time graph (a triangle or a trapezium, with a scene); the speed a body at rest gets from that graph,
 * v = I / m; the force of the ground on someone who lands, F = m v / Δt + m g. Data with two significant figures,
 * answers with two (areas read on the graph are exact). Distractors from the lesson's warnings: milliseconds not
 * converted, the speeds subtracted in a bounce, the peak force times the time, the weight forgotten.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, generateWith, r2 } from '../fisica-equilibrio';
import { G, choose, cut, data2, r2s, uOpts } from '../fis-energia';
import { KGMS, NS, dec, spezzata, uOpt, uOptsTex, uq, type GraphAxis } from '../fis-quantita-moto';

export const ID = 'fis-impulso';

const I = (s: string) => uq(s, NS);
const MS = (s: string) => qty(s, 'm/s');
const around = (x: number, unit: string) => uOpts(r2s([x * 1.3, x * 0.7, x * 1.6, x * 0.5]), unit);

// ---------------------------------------------------------------------------
// Level 1: the impulse of a constant force

function level1(rng: Rng): Built {
	for (;;) {
		const F = data2(rng, 1.1, 99), dt = data2(rng, 0.11, 9.9);
		const Fn = Number(F), tn = Number(dt);
		const exact = Fn * tn;
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		return {
			prompt: "Trova l'impulso.",
			problem: textBlock(`Una forza costante di ${pq(F, 'N')} agisce su un carrello per ${pq(dt, 's')}. Quanto vale il modulo dell'impulso della forza?`),
			solution: `I \\approx ${I(ans)}`,
			steps: [`I = F\\,\\Delta t = ${qty(F, 'N')} \\cdot ${qty(dt, 's')} = ${I(cut(exact))} \\approx ${I(ans)}`],
			// the force over the time; the time over the force
			answer: choose(rng, uOpt(ans, NS), uOptsTex(r2s([Fn / tn, tn / Fn]), NS), uOptsTex(r2s([exact * 1.3, exact * 0.7, exact * 1.6, exact * 0.5]), NS)),
			params: { F, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the speed after a push

function level2(rng: Rng): Built {
	for (;;) {
		const F = data2(rng, 1.1, 99), dt = data2(rng, 0.5, 9.9), m = data2(rng, 1.1, 25);
		const Fn = Number(F), tn = Number(dt), mn = Number(m);
		const imp = Fn * tn;
		const exact = imp / mn;
		const ans = r2(exact);
		if (ans === null || exact < 0.5 || exact > 40) continue;
		return {
			prompt: 'Trova la velocità finale.',
			problem: textBlock(`Un carrello di ${pq(m, 'kg')}, fermo su una rotaia senza attrito, viene spinto per ${pq(dt, 's')} da una forza costante di ${pq(F, 'N')}. Che velocità raggiunge?`),
			solution: `v_f \\approx ${MS(ans)}`,
			steps: [
				`I = F\\,\\Delta t = ${qty(F, 'N')} \\cdot ${qty(dt, 's')} = ${I(cut(imp))}`,
				t("Per il teorema dell'impulso, da fermo: ") + ' I = m\\,v_f',
				`v_f = \\dfrac{I}{m} = \\dfrac{${I(cut(imp))}}{${qty(m, 'kg')}} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
			],
			// the impulse read as a speed; the acceleration; the impulse times the mass
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([imp, Fn / mn, imp * mn]), 'm/s'), around(exact, 'm/s')),
			params: { F, dt, m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the mean force that stops a body

function level3(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 0.11, 0.99), v = data2(rng, 2.1, 25), ms = data2(rng, 11, 99);
		const mn = Number(m), vn = Number(v), tn = Number(ms) / 1000;
		const exact = (mn * vn) / tn;
		const ans = r2(exact);
		if (ans === null || exact < 5) continue;
		const [body, stopped, it] = rng.pick([
			['Una palla', 'fermata', 'la'],
			['Un pallone', 'fermato', 'lo'],
			['Una pallina', 'fermata', 'la'],
		]);
		const stopper = rng.pick(['dal guanto di un portiere', 'da una rete', 'dalle mani di un giocatore']);
		return {
			prompt: 'Trova la forza media.',
			problem: textBlock(`${body} di ${pq(m, 'kg')} che viaggia a ${pq(v, 'm/s')} viene ${stopped} ${stopper} in ${pq(ms, 'ms')}. Quanto vale il modulo della forza media che ${it} ferma?`),
			solution: `F_m \\approx ${qty(ans, 'N')}`,
			steps: [
				`|\\Delta p| = m\\,v = ${qty(m, 'kg')} \\cdot ${MS(v)} = ${uq(cut(mn * vn), KGMS)}`,
				`\\Delta t = ${qty(ms, 'ms')} = ${qty(cut(tn), 's')}`,
				`F_m = \\dfrac{|\\Delta p|}{\\Delta t} = \\dfrac{${uq(cut(mn * vn), KGMS)}}{${qty(cut(tn), 's')}} = ${qty(cut(exact), 'N')} \\approx ${qty(ans, 'N')}`,
			],
			// milliseconds not converted; the momentum alone; multiplied by the time
			answer: choose(rng, qOpt(ans, 'N'), uOpts(r2s([(mn * vn) / Number(ms), mn * vn, mn * vn * Number(ms)]), 'N'), around(exact, 'N')),
			params: { m, v, ms },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the mean force in a bounce

function level4(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 0.11, 0.99), v1 = data2(rng, 3.1, 25), v2 = data2(rng, 2.1, 25), ms = data2(rng, 11, 99);
		const mn = Number(m), a = Number(v1), b = Number(v2), tn = Number(ms) / 1000;
		if (b >= a || a - b < 0.15 * a) continue;
		const exact = (mn * (a + b)) / tn;
		const ans = r2(exact);
		if (ans === null || exact < 5) continue;
		return {
			prompt: 'Trova la forza media.',
			problem: textBlock(`Una palla di ${pq(m, 'kg')} colpisce il pavimento a ${pq(v1, 'm/s')} e rimbalza verso l'alto a ${pq(v2, 'm/s')}. Il contatto dura ${pq(ms, 'ms')}. Quanto vale il modulo della forza totale media sulla palla durante il contatto?`),
			solution: `F_m \\approx ${qty(ans, 'N')}`,
			steps: [
				t('Il verso della velocità si inverte: ') + ` |\\Delta p| = m\\,(v_1 + v_2) = ${qty(m, 'kg')} \\cdot ${MS(cut(a + b))} = ${uq(cut(mn * (a + b)), KGMS)}`,
				`\\Delta t = ${qty(ms, 'ms')} = ${qty(cut(tn), 's')}`,
				`F_m = \\dfrac{|\\Delta p|}{\\Delta t} = \\dfrac{${uq(cut(mn * (a + b)), KGMS)}}{${qty(cut(tn), 's')}} = ${qty(cut(exact), 'N')} \\approx ${qty(ans, 'N')}`,
			],
			// the speeds subtracted; only the speed before; milliseconds not converted
			answer: choose(rng, qOpt(ans, 'N'), uOpts(r2s([(mn * (a - b)) / tn, (mn * a) / tn, (mn * (a + b)) / Number(ms)]), 'N'), around(exact, 'N')),
			params: { m, v1, v2, ms },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the area under the force-time graph

const AX: GraphAxis = { nome: 't', unita: 's', passo: 0.1, celle: 12, etichette: 2 };
const yAxis = (step: number): GraphAxis => ({ nome: 'F', unita: 'N', passo: step, celle: 8, etichette: 2 });

type Peak = { pts: [number, number][]; Fmax: number; t3: number; flat: number; step: number; area: number; alt: string };

/** A push that grows, may stay constant and dies out: a triangle or a trapezium on the grid. */
function peak(rng: Rng): Peak {
	const step = rng.pick([5, 10]);
	const Fmax = step * rng.int(3, 8);
	const c1 = rng.int(1, 4), flatCells = rng.int(0, 1) ? 0 : rng.int(1, 4), c3 = rng.int(1, 4);
	const t1 = c1 / 10, t2 = (c1 + flatCells) / 10, t3 = (c1 + flatCells + c3) / 10;
	const r = (x: number) => Math.round(x * 10) / 10;
	const pts: [number, number][] = flatCells ? [[0, 0], [r(t1), Fmax], [r(t2), Fmax], [r(t3), 0]] : [[0, 0], [r(t1), Fmax], [r(t3), 0]];
	const flat = r(t2 - t1);
	// in whole twentieths of a newton second, so that the area is an exact decimal
	const area = (Fmax * (c1 + 2 * flatCells + c3)) / 20;
	const words = (x: number) => String(x).replace('.', ',');
	const alt = flatCells
		? `Il grafico della forza in newton in funzione del tempo in secondi: la forza cresce da zero a ${Fmax} newton in ${words(r(t1))} secondi, resta costante fino a ${words(r(t2))} secondi e torna a zero a ${words(r(t3))} secondi.`
		: `Il grafico della forza in newton in funzione del tempo in secondi: la forza cresce da zero a ${Fmax} newton in ${words(r(t1))} secondi e torna a zero a ${words(r(t3))} secondi.`;
	return { pts, Fmax, t3: r(t3), flat, step, area, alt };
}
const exactOpt = (x: number, unitTex: string): ChoiceOption | null => {
	const s = dec(x, 2);
	return s === null || x <= 0 ? null : uOpt(s, unitTex);
};
const some = (xs: (ChoiceOption | null)[]) => xs.filter((o): o is ChoiceOption => o !== null);

function level5(rng: Rng): Built {
	for (;;) {
		const p = peak(rng);
		const ans = dec(p.area, 2);
		if (ans === null || Math.abs(p.area / 10 - Math.round(p.area / 10)) < 1e-9 || p.area < 1.5) continue;
		const sc = { x: AX, y: yAxis(p.step), punti: p.pts };
		const shape = p.flat ? 'trapezio' : 'triangolo';
		return {
			prompt: "Trova l'impulso dal grafico.",
			problem: textBlock(`Il grafico mostra la forza che una mano esercita su un carrello durante una spinta, in funzione del tempo. Quanto vale l'impulso della forza?`),
			solution: `I = ${I(ans)}`,
			steps: [
				t(`L'impulso è l'area sotto il grafico, un ${shape}.`),
				p.flat
					? `I = \\dfrac{(${qty(dec(p.t3, 1) ?? '', 's')} + ${qty(dec(p.flat, 1) ?? '', 's')}) \\cdot ${qty(String(p.Fmax), 'N')}}{2} = ${I(ans)}`
					: `I = \\dfrac{${qty(dec(p.t3, 1) ?? '', 's')} \\cdot ${qty(String(p.Fmax), 'N')}}{2} = ${I(ans)}`,
			],
			// the whole rectangle; the triangle's formula on a trapezium, or the peak alone; half and double
			answer: choiceOf(rng, uOpt(ans, NS), some([exactOpt(p.Fmax * p.t3, NS), p.flat ? exactOpt((p.Fmax * p.t3) / 2, NS) : exactOpt(p.Fmax, NS)]), some([exactOpt(p.area / 2, NS), exactOpt(p.area * 1.5, NS), exactOpt(p.area * 3, NS)])),
			params: { punti: p.pts },
			scene: spezzata(p.alt, sc),
			solutionScene: spezzata(`${p.alt} L'area sotto il grafico è colorata.`, { ...sc, area: true }),
		};
	}
}

function level6(rng: Rng): Built {
	for (;;) {
		const p = peak(rng);
		const imp = dec(p.area, 2);
		const m = data2(rng, 1.1, 9.9);
		const mn = Number(m);
		if (imp === null || p.area < 1.5) continue;
		const exact = p.area / mn;
		const ans = r2(exact);
		if (ans === null || exact < 0.5) continue;
		const sc = { x: AX, y: yAxis(p.step), punti: p.pts };
		return {
			prompt: 'Trova la velocità finale.',
			problem: textBlock(`Il grafico mostra la forza totale che agisce su un carrello di ${pq(m, 'kg')}, fermo all'inizio, durante una spinta. Che velocità ha il carrello alla fine della spinta?`),
			solution: `v_f \\approx ${MS(ans)}`,
			steps: [
				t("L'impulso è l'area sotto il grafico: ") + ` I = ${I(imp)}`,
				t("Per il teorema dell'impulso, da fermo: ") + ' I = m\\,v_f',
				`v_f = \\dfrac{I}{m} = \\dfrac{${I(imp)}}{${qty(m, 'kg')}} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
			],
			// the whole rectangle; the impulse read as a speed; the peak force over the mass
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([(p.Fmax * p.t3) / mn, p.area, p.Fmax / mn]), 'm/s'), around(exact, 'm/s')),
			params: { punti: p.pts, m },
			scene: spezzata(p.alt, sc),
			solutionScene: spezzata(`${p.alt} L'area sotto il grafico è colorata.`, { ...sc, area: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: the force of the ground, with the weight

function level7(rng: Rng): Built {
	for (;;) {
		const m = rng.int(41, 95);
		if (m % 10 === 0) continue;
		const v = data2(rng, 2.1, 6.9), dt = data2(rng, 0.11, 0.9);
		const vn = Number(v), tn = Number(dt);
		const net = (m * vn) / tn, w = m * G;
		const exact = (net + w) / 1000;
		const ans = r2(exact);
		if (ans === null || net < 0.3 * w) continue;
		const who = rng.pick(['Un ragazzo', 'Una ragazza', 'Un atleta', "Un'atleta"]);
		return {
			prompt: 'Trova la forza del suolo.',
			problem: textBlock(`${who} di ${pq(String(m), 'kg')} salta da un muretto, tocca terra a ${pq(v, 'm/s')} e si ferma in ${pq(dt, 's')}. Con quale forza media il suolo spinge verso l'alto durante l'atterraggio?`),
			solution: `F_s \\approx ${qty(ans, 'kN')}`,
			steps: [
				`\\dfrac{|\\Delta p|}{\\Delta t} = \\dfrac{${qty(String(m), 'kg')} \\cdot ${MS(v)}}{${qty(dt, 's')}} = ${qty(cut(net, 4), 'N')}${t(" è la forza totale, verso l'alto.")}`,
				`m g = ${qty(String(m), 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 = ${qty(cut(w, 4), 'N')}`,
				`F_s - m g = \\dfrac{|\\Delta p|}{\\Delta t} \\quad\\Rightarrow\\quad F_s = ${qty(cut(net, 4), 'N')} + ${qty(cut(w, 4), 'N')} = ${qty(cut(net + w, 4), 'N')} \\approx ${qty(ans, 'kN')}`,
			],
			// the weight forgotten; the weight subtracted; the weight alone
			answer: choose(rng, qOpt(ans, 'kN'), uOpts(r2s([net / 1000, Math.abs(net - w) / 1000, w / 1000]), 'kN'), around(exact, 'kN')),
			params: { m, v, dt },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 5 || sample.level === 6) && (!sample.scene || !sample.solutionScene)) v.push('manca la scena');
	return v;
}

export const fisImpulso: Generator = {
	id: ID,
	title: "L'impulso e il teorema dell'impulso",
	levels: {
		1: { label: "L'impulso di una forza costante", constraints: ['impulso tra 1 e 99 N·s'] },
		2: { label: 'La velocità dopo una spinta', constraints: ["corpo fermo all'inizio", 'velocità tra 0,5 e 40 m/s'] },
		3: { label: 'La forza media che ferma un corpo', constraints: ['durata in millisecondi', 'forza tra 5 e 99 N'] },
		4: { label: 'La forza media in un rimbalzo', constraints: ['velocità dopo il rimbalzo minore di almeno il 15%'] },
		5: { label: "L'impulso dal grafico", constraints: ['triangolo o trapezio sulla quadrettatura', 'area esatta, non multipla di 10'] },
		6: { label: 'La velocità dal grafico', constraints: ["corpo fermo all'inizio"] },
		7: { label: 'La forza del suolo in un atterraggio', constraints: ['forza totale almeno il 30% del peso', 'forza in kilonewton'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisImpulso;
