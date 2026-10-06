/**
 * L'energia potenziale gravitazionale e la velocità di fuga. Spec: specs/exercises/fis-energia-gravitazionale.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/97-fis-energia-gravitazionale.md), each one step harder:
 * the potential energy −G M m / r, negative; its change from the surface to a height h, G M m (1/R − 1/(R + h)) (with
 * the scene of the planet and the height); the conservation of energy for a projectile fired straight up, which stops
 * at the distance where its kinetic energy has run out; the total energy of a satellite on a circular orbit,
 * −G M m / (2r); the escape speed √(2 G M / R). Data and answers with three significant figures. Distractors from the
 * lesson's warnings: the minus sign forgotten, r² for r, m g h at a large height, the orbital speed for the escape
 * speed, the potential energy for the total one.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { G, G_TEX, asDatum, bodyFor, cap, choose, datum, orbitScene, planet, pq, q, sceneVal, sci, step4, the } from '../fis-campo-orbite';

export const ID = 'fis-energia-gravitazionale';

const need = <T>(x: T | null): T => {
	if (x === null) throw new Error('draw again');
	return x;
};

/** A planet, and a satellite on an orbit between 1,1 and 6 of its radii. */
function withOrbit(rng: Rng) {
	const { M, R } = planet(rng);
	const r = need(asDatum(R.x * (1.1 + rng.next() * 4.9)));
	const m = datum(rng, 2, 4);
	return { M, R, r, m };
}

// ---------------------------------------------------------------------------
// Level 1: U = −G M m / r

function level1(rng: Rng): Built {
	const { M, r, m } = withOrbit(rng);
	const U = (-G * M.x * m.x) / r.x;
	const ans = need(sci(U));
	const body = bodyFor(rng, M.x);
	return {
		prompt: "Trova l'energia potenziale gravitazionale.",
		problem: textBlock(`Un satellite di ${pq(m, 'kg')} si trova a ${pq(r, 'm')} dal centro di ${body} di massa ${pq(M, 'kg')}. Quanto vale la sua energia potenziale gravitazionale?`),
		solution: `U \\approx ${q(ans, 'J')}`,
		steps: [
			t("L'energia potenziale è negativa, e al denominatore c'è la distanza, non il suo quadrato:"),
			`U = -G\\,\\dfrac{M\\,m}{r} = -\\dfrac{${G_TEX} \\cdot ${M.tex} \\cdot ${m.tex}}{${r.tex}}\\,\\text{J} \\approx ${q(ans, 'J')}`,
		],
		// the sign forgotten; r squared (the force), with and without the sign
		answer: choose(rng, ans, [-U, U / r.x, -U / r.x], 'J'),
		params: { M: M.value, m: m.value, r: r.value },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the surface to a height

function level2(rng: Rng): Built {
	const { M, R } = planet(rng);
	const k = 0.15 + rng.next() * 2.3;
	const h = need(asDatum(R.x * k));
	const m = datum(rng, 2, 4);
	const r = R.x + h.x;
	const GMm = G * M.x * m.x;
	const dU = GMm * (1 / R.x - 1 / r);
	const ans = need(sci(dU));
	const body = bodyFor(rng, M.x);
	return {
		prompt: "Trova di quanto aumenta l'energia potenziale.",
		problem: textBlock(`${cap(body)} ha massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}. Una sonda di ${pq(m, 'kg')} viene portata dalla superficie a una quota di ${pq(h, 'm')}. Di quanto aumenta la sua energia potenziale gravitazionale?`),
		solution: `\\Delta U \\approx ${q(ans, 'J')}`,
		steps: [
			t('La quota è paragonabile al raggio: non si può usare m g h. Le due distanze dal centro sono'),
			`r_1 = R = ${R.tex}\\,\\text{m} \\qquad r_2 = R + h = ${step4(r)}\\,\\text{m}`,
			`\\Delta U = G\\,M\\,m \\left(\\dfrac{1}{r_1} - \\dfrac{1}{r_2}\\right)`,
			`G\\,M\\,m = ${step4(GMm)}\\,\\text{N} \\cdot \\text{m}^2 \\qquad \\dfrac{1}{r_1} - \\dfrac{1}{r_2} = ${step4(1 / R.x - 1 / r)}\\,\\text{m}^{-1}`,
			`\\Delta U \\approx ${q(ans, 'J')}`,
		],
		// m g h with the surface field; the final potential energy alone; the two terms added
		answer: choose(rng, ans, [(GMm * h.x) / (R.x * R.x), GMm / r, GMm * (1 / R.x + 1 / r)], 'J'),
		params: { M: M.value, R: R.value, m: m.value, h: h.value },
		scene: orbitScene(`${cap(body)} di raggio R e una sonda a quota h sopra la sua superficie`, { rapporto: r / R.x, orbita: false, R: sceneVal(R, 'm'), h: sceneVal(h, 'm') }),
	};
}

// ---------------------------------------------------------------------------
// Level 3: conservation, a projectile fired straight up

function level3(rng: Rng): Built {
	const { M, R, g } = planet(rng);
	const k = 1.3 + rng.next() * 4.2;
	const u0 = (G * M.x) / R.x;
	const v0 = need(asDatum(Math.sqrt(2 * u0 * (1 - 1 / k))));
	const half = (v0.x * v0.x) / 2;
	if (half > 0.9 * u0) throw new Error('draw again');
	const rMax = (G * M.x) / (u0 - half);
	const ans = need(sci(rMax));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova la distanza massima dal centro.',
		problem: textBlock(`${cap(body)} senza atmosfera ha massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}. Dalla sua superficie un proiettile viene lanciato in verticale a ${pq(v0, 'm/s')}. A quale distanza dal centro si ferma, prima di ricadere?`),
		solution: `r_{max} \\approx ${q(ans, 'm')}`,
		steps: [
			t("L'energia si conserva; nel punto più alto il proiettile è fermo. La massa del proiettile si semplifica:"),
			`\\dfrac{1}{2}\\,v_0^2 - \\dfrac{G\\,M}{R} = -\\dfrac{G\\,M}{r_{max}}`,
			`\\dfrac{1}{2}\\,v_0^2 = ${step4(half)}\\,\\text{J/kg} \\qquad \\dfrac{G\\,M}{R} = ${step4(u0)}\\,\\text{J/kg}`,
			`r_{max} = \\dfrac{G\\,M}{${step4(u0 - half)}\\,\\text{J/kg}} = \\dfrac{${step4(G * M.x)}}{${step4(u0 - half)}}\\,\\text{m} \\approx ${q(ans, 'm')}`,
		],
		// R + v0²/(2g), the formula of constant weight; the height for the distance; the starting potential energy forgotten
		answer: choose(rng, ans, [R.x + half / g, rMax - R.x, (G * M.x) / half], 'm'),
		params: { M: M.value, R: R.value, v0: v0.value },
		scene: orbitScene(`${cap(body)} di raggio R e un proiettile che parte dalla superficie in verticale con velocità v con zero`, { rapporto: 2.2, orbita: false, R: sceneVal(R, 'm'), lancio: true }),
	};
}

// ---------------------------------------------------------------------------
// Level 4: the total energy on a circular orbit

function level4(rng: Rng): Built {
	const { M, r, m } = withOrbit(rng);
	const U = (-G * M.x * m.x) / r.x;
	const ans = need(sci(U / 2));
	const body = bodyFor(rng, M.x);
	return {
		prompt: "Trova l'energia totale del satellite.",
		problem: textBlock(`Un satellite di ${pq(m, 'kg')} percorre un'orbita circolare di raggio ${pq(r, 'm')} intorno a ${body} di massa ${pq(M, 'kg')}. Quanto vale la sua energia totale?`),
		solution: `E \\approx ${q(ans, 'J')}`,
		steps: [
			t("In un'orbita circolare l'energia cinetica è metà del valore assoluto di quella potenziale:"),
			`U = -G\\,\\dfrac{M\\,m}{r} = ${step4(U)}\\,\\text{J} \\qquad K = \\dfrac{G\\,M\\,m}{2\\,r} = ${step4(-U / 2)}\\,\\text{J}`,
			`E = K + U = -\\dfrac{G\\,M\\,m}{2\\,r} \\approx ${q(ans, 'J')}`,
		],
		// the potential energy alone; the kinetic energy (the sign); the potential energy without its sign
		answer: choose(rng, ans, [U, -U / 2, -U], 'J'),
		params: { M: M.value, m: m.value, r: r.value },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the escape speed

function level5(rng: Rng): Built {
	const { M, R } = planet(rng);
	const w = (2 * G * M.x) / R.x;
	const ans = need(sci(Math.sqrt(w)));
	const body = bodyFor(rng, M.x);
	return {
		prompt: 'Trova la velocità di fuga.',
		problem: textBlock(`${cap(body)} ha massa ${pq(M, 'kg')} e raggio ${pq(R, 'm')}. Quanto vale la velocità di fuga dalla sua superficie?`),
		solution: `v_f \\approx ${q(ans, 'm/s')}`,
		steps: [
			t(`Con la velocità di fuga l'energia totale è zero: il corpo arriva all'infinito fermo, e lascia ${the(body)}.`),
			`\\dfrac{1}{2}\\,m\\,v_f^2 - G\\,\\dfrac{M\\,m}{R} = 0 \\quad\\Rightarrow\\quad v_f = \\sqrt{\\dfrac{2\\,G\\,M}{R}}`,
			`v_f = \\sqrt{\\dfrac{2 \\cdot ${G_TEX} \\cdot ${M.tex}}{${R.tex}}}\\,\\text{m/s} = \\sqrt{${step4(w)}}\\,\\text{m/s} \\approx ${q(ans, 'm/s')}`,
		],
		// the orbital speed (the 2 forgotten); the root forgotten; R squared under the root
		answer: choose(rng, ans, [Math.sqrt(w / 2), w, Math.sqrt(w / R.x)], 'm/s'),
		params: { M: M.value, R: R.value },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisEnergiaGravitazionale: Generator = {
	id: ID,
	title: "L'energia potenziale gravitazionale e la velocità di fuga",
	levels: {
		1: { label: "L'energia potenziale", constraints: ['U = −G M m / r, negativa', 'distanza tra 1,1 e 6 raggi'] },
		2: { label: 'Dalla superficie a una quota', constraints: ['ΔU = G M m (1/R − 1/(R + h))', 'quota tra 0,15 e 2,5 raggi'] },
		3: { label: 'Fin dove arriva un proiettile', constraints: ['conservazione, lancio verticale', 'energia cinetica al più il 90% di G M / R'] },
		4: { label: "L'energia di un satellite in orbita", constraints: ['E = −G M m / (2r)'] },
		5: { label: 'La velocità di fuga', constraints: ['v = √(2 G M / R)'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnergiaGravitazionale;
