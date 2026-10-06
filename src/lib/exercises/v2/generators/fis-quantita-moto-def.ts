/**
 * La quantità di moto. Spec: specs/exercises/fis-quantita-moto-def.md
 *
 * Seven levels from the lesson (docs/lezioni/fisica/riscritte/80-fis-quantita-moto-def.md), each one step harder:
 * p = m v; the same with a mass in grams or a speed in km/h; the speed another body needs for the same momentum,
 * v₂ = m₁ v₁ / m₂; the change of momentum in a bounce, m (v₁ + v₂); the total momentum of two bodies moving in opposite
 * directions, with its sign; the total momentum of two bodies moving at right angles, √(p₁² + p₂²), with a scene of
 * the two velocities; the mean force from F = Δp/Δt. Data with two significant figures, answers with two. Distractors
 * from the lesson's warnings: units not converted, the moduli subtracted in a bounce, the moduli added in a sum of
 * vectors.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { pq, qOpt, qty, scene, t } from '../vettori';
import { type Built, checkCommon, generateWith, r2 } from '../fisica-equilibrio';
import { choose, cut, data2, lab, r2s, uOpts } from '../fis-energia';
import { KGMS, uOpt, uOptsTex, uq } from '../fis-quantita-moto';

export const ID = 'fis-quantita-moto-def';

const P = (s: string) => uq(s, KGMS);
const pOpts = (xs: number[]) => uOptsTex(r2s(xs), KGMS);
const around = (x: number) => pOpts([x * 1.2, x * 0.8, x * 1.4, x * 0.6]);
const MS = (s: string) => qty(s, 'm/s');

// ---------------------------------------------------------------------------
// Level 1: p = m v

const BODIES: [string, number, number, number, number][] = [
	['Un carrello', 1.1, 9.9, 1.1, 9.9],
	['Un ciclista con la sua bicicletta', 61, 95, 2.1, 12],
	['Una palla da bowling', 4.1, 7.2, 1.1, 9.9],
	['Un cane', 11, 45, 1.1, 9.9],
	['Uno skateboard', 2.1, 4.9, 1.1, 9.9],
];

function level1(rng: Rng): Built {
	for (;;) {
		const [body, mlo, mhi, vlo, vhi] = rng.pick(BODIES);
		const m = data2(rng, mlo, mhi), v = data2(rng, vlo, vhi);
		const mn = Number(m), vn = Number(v);
		const exact = mn * vn;
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		return {
			prompt: 'Trova la quantità di moto.',
			problem: textBlock(`${body} di ${pq(m, 'kg')} si muove a ${pq(v, 'm/s')}. Quanto vale la sua quantità di moto?`),
			solution: `p \\approx ${P(ans)}`,
			steps: [`p = m\\,v = ${qty(m, 'kg')} \\cdot ${MS(v)} = ${P(cut(exact))} \\approx ${P(ans)}`],
			// the quotient, both ways; the kinetic energy
			answer: choose(rng, uOpt(ans, KGMS), pOpts([mn / vn, vn / mn, 0.5 * mn * vn * vn]), around(exact)),
			params: { m, v },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: a unit to convert

const KMH = [18, 36, 54, 72, 108, 126, 144, 162];

function level2(rng: Rng): Built {
	for (;;) {
		if (rng.int(0, 1)) {
			const g = rng.int(11, 999);
			if (g % 10 === 0) continue;
			const v = data2(rng, 2.1, 60);
			const exact = (g / 1000) * Number(v);
			const ans = r2(exact);
			if (ans === null || exact < 0.1) continue;
			const body = rng.pick(['Una palla', 'Una pallina', 'Una freccia', 'Un sasso']);
			return {
				prompt: 'Trova la quantità di moto.',
				problem: textBlock(`${body} di ${pq(String(g), 'g')} si muove a ${pq(v, 'm/s')}. Quanto vale la sua quantità di moto?`),
				solution: `p \\approx ${P(ans)}`,
				steps: [`m = ${qty(String(g), 'g')} = ${qty(cut(g / 1000, 4), 'kg')}`, `p = m\\,v = ${qty(cut(g / 1000, 4), 'kg')} \\cdot ${MS(v)} = ${P(cut(exact))} \\approx ${P(ans)}`],
				// grams divided by 100, or by 10; the mass in grams over the speed
				answer: choose(rng, uOpt(ans, KGMS), pOpts([exact * 10, exact * 100, g / Number(v)]), around(exact)),
				params: { kind: 'grammi', g, v },
			};
		}
		const m = data2(rng, 0.11, 0.99);
		const kmh = rng.pick(KMH);
		const v = kmh / 3.6;
		const exact = Number(m) * v;
		const ans = r2(exact);
		if (ans === null) continue;
		const body = rng.pick(['Una palla', 'Un pallone', 'Un disco da hockey']);
		return {
			prompt: 'Trova la quantità di moto.',
			problem: textBlock(`${body} di ${pq(m, 'kg')} si muove a ${pq(String(kmh), 'km/h')}. Quanto vale la sua quantità di moto?`),
			solution: `p \\approx ${P(ans)}`,
			steps: [`v = ${qty(String(kmh), 'km/h')} : 3{,}6 = ${MS(String(Math.round(v)))}`, `p = m\\,v = ${qty(m, 'kg')} \\cdot ${MS(String(Math.round(v)))} = ${P(cut(exact))} \\approx ${P(ans)}`],
			// km/h left as they are; multiplied by 3,6; the mass over the speed
			answer: choose(rng, uOpt(ans, KGMS), pOpts([Number(m) * kmh, Number(m) * kmh * 3.6, v / Number(m)]), around(exact)),
			params: { kind: 'kmh', m, kmh },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the same momentum

function level3(rng: Rng): Built {
	for (;;) {
		const m1 = data2(rng, 2.1, 9.9), v1 = data2(rng, 1.1, 9.9), m2 = data2(rng, 0.11, 1.9);
		const a = Number(m1), b = Number(v1), c = Number(m2);
		const exact = (a * b) / c;
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Una palla da bowling di ${pq(m1, 'kg')} rotola a ${pq(v1, 'm/s')}. A che velocità deve muoversi una palla di ${pq(m2, 'kg')} per avere la stessa quantità di moto?`),
			solution: `v_2 \\approx ${MS(ans)}`,
			steps: [`p = m_1 v_1 = ${qty(m1, 'kg')} \\cdot ${MS(v1)} = ${P(cut(a * b))}`, `v_2 = \\dfrac{p}{m_2} = \\dfrac{${P(cut(a * b))}}{${qty(m2, 'kg')}} = ${MS(cut(exact))} \\approx ${MS(ans)}`],
			// the ratio of the masses upside down; the momentum read as a speed; the momentum times the mass
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([(c * b) / a, a * b, a * b * c]), 'm/s'), uOpts(r2s([exact * 1.3, exact * 0.7, exact * 0.5]), 'm/s')),
			params: { m1, v1, m2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the change of momentum in a bounce

function level4(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 0.11, 0.99), v1 = data2(rng, 3.1, 30), v2 = data2(rng, 2.1, 30);
		const mn = Number(m), a = Number(v1), b = Number(v2);
		if (b >= a || a - b < 0.15 * a) continue;
		const exact = mn * (a + b);
		const ans = r2(exact);
		if (ans === null) continue;
		const wall = rng.pick(['un muro', 'il pavimento', 'una sponda']);
		return {
			prompt: 'Trova la variazione della quantità di moto.',
			problem: textBlock(`Una palla di ${pq(m, 'kg')} colpisce ${wall} alla velocità di ${pq(v1, 'm/s')} e rimbalza indietro, nella stessa direzione, a ${pq(v2, 'm/s')}. Quanto vale il modulo della variazione della sua quantità di moto?`),
			solution: `|\\Delta p| \\approx ${P(ans)}`,
			steps: [
				t('Con il verso positivo in quello di arrivo: ') + ` v_{ix} = ${MS(v1)}, \\quad v_{fx} = -${MS(v2)}`,
				`\\Delta p_x = m\\,v_{fx} - m\\,v_{ix} = ${qty(m, 'kg')} \\cdot (-${MS(v2)} - ${MS(v1)}) = ${P(cut(-exact))}`,
				`|\\Delta p| \\approx ${P(ans)}`,
				t('Il verso si inverte: i moduli delle due velocità si sommano.'),
			],
			// the moduli subtracted; the momentum before; the momentum after
			answer: choose(rng, uOpt(ans, KGMS), pOpts([mn * (a - b), mn * a, mn * b]), around(exact)),
			params: { m, v1, v2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the total momentum on a line

function level5(rng: Rng): Built {
	for (;;) {
		const m1 = data2(rng, 1.1, 9.9), v1 = data2(rng, 1.1, 9.9), m2 = data2(rng, 1.1, 9.9), v2 = data2(rng, 1.1, 9.9);
		const p1 = Number(m1) * Number(v1), p2 = Number(m2) * Number(v2);
		const exact = p1 - p2;
		const ans = r2(exact);
		if (ans === null || Math.abs(exact) < 0.15 * (p1 + p2) || Math.abs(exact) < 1) continue;
		return {
			prompt: 'Trova la quantità di moto totale.',
			problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} va verso destra a ${pq(v1, 'm/s')}, e un carrello di ${pq(m2, 'kg')} va verso sinistra a ${pq(v2, 'm/s')}. Quanto vale la componente $p_{tot,x}$ della quantità di moto totale, con l'asse $x$ verso destra?`),
			solution: `p_{tot,x} \\approx ${P(ans)}`,
			steps: [
				`p_{1x} = ${qty(m1, 'kg')} \\cdot ${MS(v1)} = ${P(cut(p1))}`,
				`p_{2x} = ${qty(m2, 'kg')} \\cdot (-${MS(v2)}) = ${P(cut(-p2))}`,
				`p_{tot,x} = p_{1x} + p_{2x} = ${P(cut(exact))} \\approx ${P(ans)}`,
				t(exact > 0 ? 'La quantità di moto totale è diretta verso destra.' : 'La quantità di moto totale è diretta verso sinistra.'),
			],
			// the moduli added; the sign; the masses added and the speeds subtracted
			answer: choose(rng, uOpt(ans, KGMS), pOpts([p1 + p2, -exact, (Number(m1) + Number(m2)) * (Number(v1) - Number(v2))]), around(exact)),
			params: { m1, v1, m2, v2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the total momentum at right angles

function level6(rng: Rng): Built {
	for (;;) {
		const m1 = data2(rng, 1.1, 9.9), v1 = data2(rng, 1.1, 9.9), m2 = data2(rng, 1.1, 9.9), v2 = data2(rng, 1.1, 9.9);
		const p1 = Number(m1) * Number(v1), p2 = Number(m2) * Number(v2);
		const exact = Math.hypot(p1, p2);
		const ans = r2(exact);
		if (ans === null || Math.min(p1, p2) < 0.35 * Math.max(p1, p2)) continue;
		const vmax = Math.max(Number(v1), Number(v2));
		const u = 3.2 / vmax;
		const alt = `Due dischi visti dall'alto: il primo si muove verso est a ${lab(v1)} metri al secondo, il secondo verso nord a ${lab(v2)} metri al secondo. Le due velocità sono perpendicolari.`;
		return {
			prompt: 'Trova la quantità di moto totale.',
			problem: textBlock(`Su un tavolo liscio un disco di ${pq(m1, 'kg')} si muove verso est a ${pq(v1, 'm/s')}, e un disco di ${pq(m2, 'kg')} si muove verso nord a ${pq(v2, 'm/s')}. Quanto vale il modulo della quantità di moto totale?`),
			solution: `p_{tot} \\approx ${P(ans)}`,
			steps: [
				`p_1 = ${qty(m1, 'kg')} \\cdot ${MS(v1)} = ${P(cut(p1))}, \\quad p_2 = ${qty(m2, 'kg')} \\cdot ${MS(v2)} = ${P(cut(p2))}`,
				t('Le due quantità di moto sono perpendicolari:') + ' p_{tot} = \\sqrt{p_1^2 + p_2^2}',
				`p_{tot} = \\sqrt{(${cut(p1)})^2 + (${cut(p2)})^2}\\,${KGMS} = ${P(cut(exact))} \\approx ${P(ans)}`,
			],
			// the moduli added; subtracted; the masses added times the speeds combined
			answer: choose(rng, uOpt(ans, KGMS), pOpts([p1 + p2, Math.abs(p1 - p2), (Number(m1) + Number(m2)) * Math.hypot(Number(v1), Number(v2))]), around(exact)),
			params: { m1, v1, m2, v2 },
			scene: scene(alt, {
				u: 1,
				vettori: [
					{ da: [0, 0], a: [Number(v1) * u, 0], nome: 'v', sub: '1', colore: 'velocita', etichetta: `${lab(v1)} m/s` },
					{ da: [0, 0], a: [0, Number(v2) * u], nome: 'v', sub: '2', colore: 'velocita', etichetta: `${lab(v2)} m/s` },
				],
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: the force from the change of momentum

function level7(rng: Rng): Built {
	for (;;) {
		const m = rng.int(801, 1999);
		if (m % 10 === 0) continue;
		const v = data2(rng, 11, 40), dt = data2(rng, 1.5, 9.9);
		const vn = Number(v), tn = Number(dt);
		const exact = (m * vn) / tn / 1000;
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza media.',
			problem: textBlock(`Un'automobile di ${pq(String(m), 'kg')} che viaggia a ${pq(v, 'm/s')} frena e si ferma in ${pq(dt, 's')}. Quanto vale il modulo della forza totale media che l'ha frenata?`),
			solution: `F \\approx ${qty(ans, 'kN')}`,
			steps: [
				`\\Delta p = 0 - m\\,v = -${qty(String(m), 'kg')} \\cdot ${MS(v)} = ${P(cut(-m * vn, 4))}`,
				`F = \\dfrac{|\\Delta p|}{\\Delta t} = \\dfrac{${P(cut(m * vn, 4))}}{${qty(dt, 's')}} = ${qty(cut((m * vn) / tn, 4), 'N')} \\approx ${qty(ans, 'kN')}`,
			],
			// multiplied by the time; the momentum alone; the mass over the time
			answer: choose(rng, qOpt(ans, 'kN'), uOpts(r2s([(m * vn * tn) / 1000, (m * vn) / 1000, m / tn / 1000]), 'kN'), uOpts(r2s([exact * 1.3, exact * 0.7, exact * 1.6, exact * 0.5]), 'kN')),
			params: { m, v, dt },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 6 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisQuantitaMotoDef: Generator = {
	id: ID,
	title: 'La quantità di moto',
	levels: {
		1: { label: 'La quantità di moto di un corpo', constraints: ['massa in chilogrammi e velocità in metri al secondo', 'risultato tra 1 e 99 kg·m/s'] },
		2: { label: 'Con le unità da convertire', constraints: ['metà con la massa in grammi, metà con la velocità in km/h'] },
		3: { label: 'La stessa quantità di moto', constraints: ['secondo corpo più leggero del primo'] },
		4: { label: 'La variazione in un rimbalzo', constraints: ['velocità dopo il rimbalzo minore di almeno il 15%'] },
		5: { label: 'La quantità di moto totale su una retta', constraints: ['versi opposti', 'totale almeno il 15% della somma dei moduli'] },
		6: { label: 'La quantità di moto totale nel piano', constraints: ['direzioni perpendicolari', 'la più piccola almeno il 35% della più grande'] },
		7: { label: 'La forza dalla variazione della quantità di moto', constraints: ['forza in kilonewton'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisQuantitaMotoDef;
