/**
 * Il campo gravitazionale. Spec: specs/exercises/fis-campo-gravitazionale.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/95-fis-campo-gravitazionale.md), each one step harder:
 * the field from the force on a test mass, g = F/m; the field at the surface of a planet, G M / R²; at a height h,
 * where the distance from the centre is R + h (with the scene of the planet and the point); with ratios, g0 / n² at
 * n radii from the centre or at a height of n radii; two sources on a line, where the fields subtract. Data and
 * answers with three significant figures, in scientific notation when large or small. Distractors from the lesson's
 * warnings: the height for the distance from the centre, the square forgotten, force and field swapped, the fields
 * added.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { BODIES, G, G_TEX, asDatum, bodyFor, cap, choose, datum, of, orbitScene, planet, pq, q, sceneVal, sci, step4 } from '../fis-campo-orbite';

export const ID = 'fis-campo-gravitazionale';

const need = <T>(x: T | null): T => {
	if (x === null) throw new Error('draw again');
	return x;
};

// ---------------------------------------------------------------------------
// Level 1: g = F / m

function level1(rng: Rng): Built {
	const m = datum(rng, 2);
	const g0 = datum(rng, rng.next() < 0.75 ? 0 : 1);
	if (g0.x > 30) throw new Error('draw again');
	const F = need(asDatum(m.x * g0.x));
	const g = F.x / m.x;
	const ans = need(sci(g));
	const body = rng.pick(BODIES);
	return {
		prompt: 'Trova il campo gravitazionale.',
		problem: textBlock(`In un punto vicino a ${body} una sonda di ${pq(m, 'kg')} è attirata con una forza di ${pq(F, 'N')}. Quanto vale il campo gravitazionale in quel punto?`),
		solution: `g \\approx ${q(ans, 'N/kg')}`,
		steps: [t('La sonda fa da massa di prova: il campo è la forza divisa per la massa.'), `g = \\dfrac{F}{m} = \\dfrac{${q(F, 'N')}}{${q(m, 'kg')}} \\approx ${q(ans, 'N/kg')}`],
		// the ratio upside down; the product; the force divided by 9,8 (a mass, not a field)
		answer: choose(rng, ans, [m.x / F.x, F.x * m.x, F.x / 9.8], 'N/kg'),
		params: { m: m.value, F: F.value },
	};
}

// ---------------------------------------------------------------------------
// Level 2: G M / R² at the surface

function level2(rng: Rng): Built {
	const { M, R, g } = planet(rng);
	const ans = need(sci(g));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova il campo alla superficie.',
		problem: textBlock(`${cap(body)} ha massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}. Quanto vale il campo gravitazionale alla sua superficie?`),
		solution: `g \\approx ${q(ans, 'N/kg')}`,
		steps: [
			t('Alla superficie la distanza dal centro è il raggio:'),
			`g = G\\,\\dfrac{M}{R^2} = ${G_TEX} \\cdot \\dfrac{${M.tex}}{(${R.tex})^2}\\,\\text{N/kg}`,
			`R^2 = ${step4(R.x * R.x)}\\,\\text{m}^2 \\quad\\Rightarrow\\quad g \\approx ${q(ans, 'N/kg')}`,
		],
		// the square forgotten; the diameter for the radius; G forgotten
		answer: choose(rng, ans, [(G * M.x) / R.x, g / 4, M.x / (R.x * R.x)], 'N/kg'),
		params: { M: M.value, R: R.value },
	};
}

// ---------------------------------------------------------------------------
// Level 3: at a height h

function level3(rng: Rng): Built {
	const { M, R } = planet(rng);
	const k = 0.08 + rng.next() * 2.4;
	const h = need(asDatum(R.x * k));
	const r = R.x + h.x;
	const g = (G * M.x) / (r * r);
	const ans = need(sci(g));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova il campo a quella quota.',
		problem: textBlock(`${cap(body)} ha massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}. Quanto vale il campo gravitazionale a una quota di ${pq(h, 'm')} sopra la superficie?`),
		solution: `g \\approx ${q(ans, 'N/kg')}`,
		steps: [
			t('La distanza si misura dal centro: è il raggio più la quota.'),
			`r = R + h = ${R.tex}\\,\\text{m} + ${h.tex}\\,\\text{m} = ${step4(r)}\\,\\text{m}`,
			`g = G\\,\\dfrac{M}{r^2} = ${G_TEX} \\cdot \\dfrac{${M.tex}}{(${step4(r)})^2}\\,\\text{N/kg} \\approx ${q(ans, 'N/kg')}`,
		],
		// the height for the distance; the height ignored; the square forgotten
		answer: choose(rng, ans, [(G * M.x) / (h.x * h.x), (G * M.x) / (R.x * R.x), (G * M.x) / r], 'N/kg'),
		params: { M: M.value, R: R.value, h: h.value },
		scene: orbitScene(`${cap(body)} di raggio R e un punto a quota h sopra la sua superficie, sulla retta che passa per il centro`, { rapporto: r / R.x, orbita: false, R: sceneVal(R, 'm'), h: sceneVal(h, 'm') }),
	};
}

// ---------------------------------------------------------------------------
// Level 4: ratios

function level4(rng: Rng): Built {
	const height = rng.next() < 0.5;
	const k = rng.pick(height ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 6]);
	const n = height ? k + 1 : k;
	const g0 = datum(rng, rng.next() < 0.8 ? 0 : 1);
	if (g0.x > 30) throw new Error('draw again');
	const g = g0.x / (n * n);
	const ans = need(sci(g));
	const body = rng.pick(BODIES);
	const radii = (x: number) => (x === 1 ? 'un raggio' : `${x} raggi`);
	const where = height ? `a una quota uguale a ${radii(k)} ${of(body)}` : `a una distanza dal centro uguale a ${radii(k)} ${of(body)}`;
	return {
		prompt: 'Trova il campo senza usare le costanti.',
		problem: textBlock(`Alla superficie di ${body} il campo gravitazionale vale ${pq(g0, 'N/kg')}. Quanto vale ${where}?`),
		solution: `g \\approx ${q(ans, 'N/kg')}`,
		steps: [
			height ? t(`La quota si aggiunge al raggio: la distanza dal centro è ${n} raggi.`) : t(`La distanza dal centro è ${n} volte quella della superficie.`),
			t('Il campo diminuisce con il quadrato della distanza:'),
			`g = \\dfrac{g_0}{${n}^2} = \\dfrac{${q(g0, 'N/kg')}}{${n * n}} \\approx ${q(ans, 'N/kg')}`,
		],
		// divided by n and not by n²; the height taken for the distance (or the other way round); divided by 2n
		answer: choose(rng, ans, [g0.x / n, height ? g0.x / (k * k) : g0.x / ((k + 1) * (k + 1)), g0.x / (2 * n), g0.x / (n * n * n)], 'N/kg'),
		params: { case: height ? 'quota' : 'distanza', g0: g0.value, k },
	};
}

// ---------------------------------------------------------------------------
// Level 5: two sources on a line

function level5(rng: Rng): Built {
	const M1 = datum(rng, 23, 25);
	const M2 = datum(rng, 22, 24);
	const d = datum(rng, 8);
	const x = need(asDatum(d.x * (0.2 + rng.next() * 0.6)));
	const y = d.x - x.x;
	const g1 = (G * M1.x) / (x.x * x.x);
	const g2 = (G * M2.x) / (y * y);
	const diff = Math.abs(g1 - g2);
	if (diff < 0.15 * Math.max(g1, g2)) throw new Error('draw again');
	const ans = need(sci(diff));
	const first = g1 > g2;
	return {
		prompt: 'Trova il modulo del campo totale.',
		problem: textBlock(
			`Due corpi celesti di masse ${pq(M1, 'kg')} e ${pq(M2, 'kg')} hanno i centri a ${pq(d, 'm')} di distanza. Il punto P sta sul segmento che unisce i centri, a ${pq(x, 'm')} dal primo. Quanto vale il modulo del campo gravitazionale totale in P?`,
		),
		solution: `g \\approx ${q(ans, 'N/kg')}`,
		steps: [
			t('Distanza di P dal secondo corpo:'),
			`${d.tex}\\,\\text{m} - ${x.tex}\\,\\text{m} = ${step4(y)}\\,\\text{m}`,
			`g_1 = G\\,\\dfrac{M_1}{r_1^2} = ${step4(g1)}\\,\\text{N/kg} \\qquad g_2 = G\\,\\dfrac{M_2}{r_2^2} = ${step4(g2)}\\,\\text{N/kg}`,
			t('I due campi hanno versi opposti, ognuno verso la sua sorgente: i moduli si sottraggono.'),
			`g = ${first ? 'g_1 - g_2' : 'g_2 - g_1'} \\approx ${q(ans, 'N/kg')}`,
			t(`Il campo totale punta verso il ${first ? 'primo' : 'secondo'} corpo.`),
		],
		// the fields added; one field alone; the other alone; both from the same distance
		answer: choose(rng, ans, [g1 + g2, g1, g2, Math.abs(G * (M1.x - M2.x)) / (x.x * x.x)], 'N/kg'),
		params: { M1: M1.value, M2: M2.value, d: d.value, x: x.value },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisCampoGravitazionale: Generator = {
	id: ID,
	title: 'Il campo gravitazionale',
	levels: {
		1: { label: 'Il campo dalla forza', constraints: ['g = F / m', 'campo tra 1 e 30 N/kg'] },
		2: { label: 'Alla superficie di un pianeta', constraints: ['g = G M / R²', 'densità del corpo tra 1000 e 6000 kg/m³'] },
		3: { label: 'A una quota', constraints: ['r = R + h', 'quota tra 0,08 e 2,5 raggi'] },
		4: { label: 'Con i rapporti', constraints: ['g = g0 / n²', 'distanza o quota in raggi, metà ciascuna'] },
		5: { label: 'Due sorgenti', constraints: ['punto sul segmento dei centri', 'i moduli si sottraggono'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisCampoGravitazionale;
