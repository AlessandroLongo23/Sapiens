/**
 * Il moto dei satelliti. Spec: specs/exercises/fis-satelliti.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/96-fis-satelliti.md), each one step harder: the orbital
 * speed from the radius of the orbit, √(G M / r); from the height, where r = R + h (with the scene of the orbit); the
 * period, 2π √(r³ / (G M)); two orbits around the same planet compared with ratios (speed as 1/√n, period as n√n);
 * the mass of the central body from radius and period, 4π² r³ / (G T²); the radius of the orbit from the period,
 * the cube root of G M T² / (4π²). Data and answers with three significant figures. Distractors from the lesson's
 * warnings: the height for the radius of the orbit, the square root forgotten, the radius squared for cubed, the
 * period not squared.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { BODIES, G, G_TEX, asDatum, bodyFor, cap, choose, datum, orbitScene, planet, pq, q, radiusOf, sceneVal, sci, step4 } from '../fis-campo-orbite';

export const ID = 'fis-satelliti';

const need = <T>(x: T | null): T => {
	if (x === null) throw new Error('draw again');
	return x;
};
const TWO_PI = 2 * Math.PI;

/**
 * A central mass and the radius of an orbit around it, a datum: 1,3 to 16 times the radius the body would have with
 * a density of 3000 kg/m³, so that the orbit is outside the body.
 */
function orbit(rng: Rng) {
	const M = datum(rng, 22, 27);
	const r = need(asDatum(radiusOf(M.x, 3000) * (1.3 + rng.next() * 14.7)));
	return { M, r };
}

// ---------------------------------------------------------------------------
// Level 1: √(G M / r)

function level1(rng: Rng): Built {
	const { M, r } = orbit(rng);
	const v2 = (G * M.x) / r.x;
	const ans = need(sci(Math.sqrt(v2)));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova la velocità orbitale.',
		problem: textBlock(`Un satellite percorre un'orbita circolare di raggio ${pq(r, 'm')} intorno a ${body} di massa ${pq(M, 'kg')}. Con quale velocità si muove?`),
		solution: `v \\approx ${q(ans, 'm/s')}`,
		steps: [
			t('La gravità fa da forza centripeta, e la massa del satellite si semplifica:'),
			`G\\,\\dfrac{M\\,m}{r^2} = m\\,\\dfrac{v^2}{r} \\quad\\Rightarrow\\quad v = \\sqrt{\\dfrac{G\\,M}{r}}`,
			`v = \\sqrt{\\dfrac{${G_TEX} \\cdot ${M.tex}}{${r.tex}}}\\,\\text{m/s} = \\sqrt{${step4(v2)}}\\,\\text{m/s} \\approx ${q(ans, 'm/s')}`,
		],
		// the root forgotten; r squared under the root; the fraction upside down
		answer: choose(rng, ans, [v2, Math.sqrt((G * M.x) / (r.x * r.x)), Math.sqrt(r.x / (G * M.x))], 'm/s'),
		params: { M: M.value, r: r.value },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the height

function level2(rng: Rng): Built {
	const { M, R } = planet(rng);
	const k = 0.06 + rng.next() * 2.4;
	const h = need(asDatum(R.x * k));
	const r = R.x + h.x;
	const v2 = (G * M.x) / r;
	const ans = need(sci(Math.sqrt(v2)));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova la velocità orbitale.',
		problem: textBlock(`${cap(body)} ha massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}. Un satellite percorre un'orbita circolare a una quota di ${pq(h, 'm')} sopra la sua superficie. Con quale velocità si muove?`),
		solution: `v \\approx ${q(ans, 'm/s')}`,
		steps: [
			t("Il raggio dell'orbita si misura dal centro: è il raggio del corpo più la quota."),
			`r = R + h = ${R.tex}\\,\\text{m} + ${h.tex}\\,\\text{m} = ${step4(r)}\\,\\text{m}`,
			`v = \\sqrt{\\dfrac{G\\,M}{r}} = \\sqrt{\\dfrac{${G_TEX} \\cdot ${M.tex}}{${step4(r)}}}\\,\\text{m/s} \\approx ${q(ans, 'm/s')}`,
		],
		// the height for the radius of the orbit; the height ignored; the root forgotten
		answer: choose(rng, ans, [Math.sqrt((G * M.x) / h.x), Math.sqrt((G * M.x) / R.x), v2], 'm/s'),
		params: { M: M.value, R: R.value, h: h.value },
		scene: orbitScene(`${cap(body)} di raggio R e un satellite su un'orbita circolare a quota h sopra la sua superficie`, { rapporto: r / R.x, orbita: true, R: sceneVal(R, 'm'), h: sceneVal(h, 'm') }),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the period

function level3(rng: Rng): Built {
	const { M, r } = orbit(rng);
	const k = (r.x * r.x * r.x) / (G * M.x);
	const T = TWO_PI * Math.sqrt(k);
	const ans = need(sci(T));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova il periodo.',
		problem: textBlock(`Un satellite percorre un'orbita circolare di raggio ${pq(r, 'm')} intorno a ${body} di massa ${pq(M, 'kg')}. Quanto tempo impiega a fare un giro?`),
		solution: `T \\approx ${q(ans, 's')}`,
		steps: [
			`T = 2\\pi\\,\\sqrt{\\dfrac{r^3}{G\\,M}}`,
			`r^3 = ${step4(r.x ** 3)}\\,\\text{m}^3 \\qquad G\\,M = ${step4(G * M.x)}\\,\\text{m}^3/\\text{s}^2`,
			`T = 2\\pi\\,\\sqrt{${step4(k)}\\,\\text{s}^2} \\approx ${q(ans, 's')}`,
		],
		// r squared for r cubed; the fraction upside down; 2π forgotten
		answer: choose(rng, ans, [TWO_PI * Math.sqrt((r.x * r.x) / (G * M.x)), TWO_PI * Math.sqrt(1 / k), Math.sqrt(k)], 's'),
		params: { M: M.value, r: r.value },
	};
}

// ---------------------------------------------------------------------------
// Level 4: two orbits compared

function level4(rng: Rng): Built {
	const speed = rng.next() < 0.5;
	const n = rng.pick([2, 3, 4, 5, 9]);
	const body = rng.pick(BODIES);
	const intro = `Due satelliti percorrono orbite circolari intorno a ${body === 'una luna' ? 'una stessa luna' : 'uno stesso pianeta'}. Il raggio dell'orbita del secondo è ${n} volte quello del primo.`;
	if (speed) {
		const v1 = datum(rng, 3, 4);
		const v2 = v1.x / Math.sqrt(n);
		const ans = need(sci(v2));
		return {
			prompt: 'Trova la velocità del secondo satellite.',
			problem: textBlock(`${intro} Il primo si muove a ${pq(v1, 'm/s')}. Con quale velocità si muove il secondo?`),
			solution: `v_2 \\approx ${q(ans, 'm/s')}`,
			steps: [
				t('La velocità orbitale è inversamente proporzionale alla radice del raggio:'),
				`\\dfrac{v_2}{v_1} = \\sqrt{\\dfrac{r_1}{r_2}} = \\dfrac{1}{\\sqrt{${n}}}`,
				`v_2 = \\dfrac{${q(v1, 'm/s')}}{\\sqrt{${n}}} \\approx ${q(ans, 'm/s')}`,
			],
			// divided by n; multiplied by √n (farther, faster); divided by n²
			answer: choose(rng, ans, [v1.x / n, v1.x * Math.sqrt(n), v1.x / (n * n)], 'm/s'),
			params: { case: 'velocita', n, v1: v1.value },
		};
	}
	const T1 = datum(rng, 3, 4);
	const T2 = T1.x * n * Math.sqrt(n);
	const ans = need(sci(T2));
	return {
		prompt: 'Trova il periodo del secondo satellite.',
		problem: textBlock(`${intro} Il primo fa un giro in ${pq(T1, 's')}. In quanto tempo fa un giro il secondo?`),
		solution: `T_2 \\approx ${q(ans, 's')}`,
		steps: [
			t('Per la terza legge di Keplero il quadrato del periodo è proporzionale al cubo del raggio:'),
			`\\dfrac{T_2^2}{T_1^2} = \\dfrac{r_2^3}{r_1^3} = ${n}^3 \\quad\\Rightarrow\\quad \\dfrac{T_2}{T_1} = \\sqrt{${n}^3} = ${step4(n * Math.sqrt(n))}`,
			`T_2 = ${q(T1, 's')} \\cdot ${step4(n * Math.sqrt(n))} \\approx ${q(ans, 's')}`,
		],
		// proportional to r; the root forgotten (n³); r squared
		answer: choose(rng, ans, [T1.x * n, T1.x * n ** 3, T1.x * n * n, T1.x * Math.sqrt(n)], 's'),
		params: { case: 'periodo', n, T1: T1.value },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the central mass

function level5(rng: Rng): Built {
	const { M: M0, r } = orbit(rng);
	const T = need(asDatum(TWO_PI * Math.sqrt(r.x ** 3 / (G * M0.x))));
	const M = (4 * Math.PI ** 2 * r.x ** 3) / (G * T.x * T.x);
	const ans = need(sci(M));
	const body = bodyFor(rng, M0.x);
	return {
		prompt: 'Trova la massa del corpo centrale.',
		problem: textBlock(`Un satellite percorre un'orbita circolare di raggio ${pq(r, 'm')} intorno a ${body}, e fa un giro in ${pq(T, 's')}. Quanto vale la massa ${body === 'una luna' ? 'della luna' : 'del pianeta'}?`),
		solution: `M \\approx ${q(ans, 'kg')}`,
		steps: [
			t('Dalla terza legge di Keplero, ricavata per le orbite circolari:'),
			`\\dfrac{T^2}{r^3} = \\dfrac{4\\pi^2}{G\\,M} \\quad\\Rightarrow\\quad M = \\dfrac{4\\pi^2\\,r^3}{G\\,T^2}`,
			`r^3 = ${step4(r.x ** 3)}\\,\\text{m}^3 \\qquad T^2 = ${step4(T.x * T.x)}\\,\\text{s}^2`,
			`M = \\dfrac{4\\pi^2 \\cdot ${step4(r.x ** 3)}}{${G_TEX} \\cdot ${step4(T.x * T.x)}}\\,\\text{kg} \\approx ${q(ans, 'kg')}`,
		],
		// the period not squared; r squared for r cubed; 2π for 4π²
		answer: choose(rng, ans, [(4 * Math.PI ** 2 * r.x ** 3) / (G * T.x), (4 * Math.PI ** 2 * r.x * r.x) / (G * T.x * T.x), (TWO_PI * r.x ** 3) / (G * T.x * T.x)], 'kg'),
		params: { r: r.value, T: T.value },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the radius from the period

function level6(rng: Rng): Built {
	const { M, r: r0 } = orbit(rng);
	const T = need(asDatum(TWO_PI * Math.sqrt(r0.x ** 3 / (G * M.x))));
	const cube = (G * M.x * T.x * T.x) / (4 * Math.PI ** 2);
	const ans = need(sci(Math.cbrt(cube)));
	const body = bodyFor(rng, M.x);
	return {
		prompt: "Trova il raggio dell'orbita.",
		problem: textBlock(`Un satellite deve fare un giro intorno a ${body} di massa ${pq(M, 'kg')} in ${pq(T, 's')}, su un'orbita circolare. Quale deve essere il raggio dell'orbita?`),
		solution: `r \\approx ${q(ans, 'm')}`,
		steps: [
			t('Dalla terza legge di Keplero si ricava il raggio:'),
			`T^2 = \\dfrac{4\\pi^2}{G\\,M}\\,r^3 \\quad\\Rightarrow\\quad r = \\sqrt[3]{\\dfrac{G\\,M\\,T^2}{4\\pi^2}}`,
			`\\dfrac{G\\,M\\,T^2}{4\\pi^2} = ${step4(cube)}\\,\\text{m}^3`,
			`r = \\sqrt[3]{${step4(cube)}\\,\\text{m}^3} \\approx ${q(ans, 'm')}`,
		],
		// a square root for the cube root; the period not squared; 4π² forgotten
		answer: choose(rng, ans, [Math.sqrt(cube), Math.cbrt((G * M.x * T.x) / (4 * Math.PI ** 2)), Math.cbrt(G * M.x * T.x * T.x)], 'm'),
		params: { M: M.value, T: T.value },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisSatelliti: Generator = {
	id: ID,
	title: 'Il moto dei satelliti',
	levels: {
		1: { label: 'La velocità orbitale', constraints: ['v = √(G M / r)', "orbita fuori dal corpo: da 1,3 a 16 raggi di una sfera di densità 3000 kg/m³"] },
		2: { label: 'Dalla quota', constraints: ['r = R + h', 'quota tra 0,06 e 2,5 raggi'] },
		3: { label: 'Il periodo', constraints: ['T = 2π √(r³ / (G M))'] },
		4: { label: 'Due orbite a confronto', constraints: ['raggio 2, 3, 4, 5 o 9 volte', 'velocità o periodo, metà ciascuno'] },
		5: { label: 'La massa del corpo centrale', constraints: ['M = 4π² r³ / (G T²)'] },
		6: { label: "Il raggio dell'orbita dal periodo", constraints: ['r = ∛(G M T² / (4π²))'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisSatelliti;
