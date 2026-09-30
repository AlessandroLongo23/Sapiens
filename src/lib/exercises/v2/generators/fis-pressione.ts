/**
 * La pressione. Spec: specs/exercises/fis-pressione.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/26-fis-pressione.md): the pressure from a force and an
 * area in m²; the area in cm² or mm², to convert; the weight of a body as the force; the force or the area from the
 * pressure (in kPa); the highest or lowest pressure of a block on one of its faces. p = F⊥/S, g = 9,8 N/kg, data with
 * two significant figures, answers rounded to two (never a tie). Multiple choice with the unit in the option and the
 * lesson's mistakes: cm² not converted (or converted with 10^-2), the formula upside down or multiplied, the mass
 * taken for the weight, the wrong face.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { q } from '../rational';
import { type Built, type R, G, G_TEX, approx, choiceOf, commonCheck, datum, dec, generateWith, n, p10, pd, round2, roundSig, sig, t, two, withU } from '../fis-fluidi';

export const ID = 'fis-pressione';
const S2 = { kind: 'sig', s: 2 } as const;
const PA = 'Pa';

/** An exact value rounded to two figures, or null for a tie (the caller draws again). */
const r2 = (x: R) => round2(x, 2);

// ---------------------------------------------------------------------------
// Level 1: the pressure from the force and the area in m²

export const THINGS = ['Una cassa', 'Uno scatolone', 'Una valigia', 'Un baule', 'Un mobiletto', 'Una lavatrice'];

function level1(rng: Rng): Built {
	for (;;) {
		const F = two(rng, rng.next() < 0.7 ? 1 : 2);
		const S = two(rng, rng.pick([-1, -2]));
		const exact = F.div(S);
		const p = r2(exact);
		if (!p) continue;
		const who = rng.pick(THINGS);
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`${who} preme sul pavimento con una forza di ${pd(F, 'N')}, distribuita su una superficie di ${pd(S, 'm^2')}. Quanto vale la pressione sul pavimento?`),
			solution: `p = ${withU(sig(p, 2), PA)}`,
			steps: [`p = \\dfrac{F_\\perp}{S} = \\dfrac{${withU(datum(F), 'N')}}{${withU(datum(S), 'm^2')}} ${approx(exact, 2, PA)}`],
			answer: p,
			unit: PA,
			format: S2,
			// force times area; the formula upside down; ten times the pressure
			mistakes: [F.mul(S), S.div(F), p.mul(n(10))],
			params: { case: 'm2', F: F.toString(), S: S.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the area in cm² or mm²

function level2(rng: Rng): Built {
	for (;;) {
		const mm = rng.next() < 0.3;
		const F = two(rng, rng.pick([0, 1]));
		const S = two(rng, mm ? rng.pick([0, 1, 2]) : rng.pick([0, 1]));
		const k = mm ? -6 : -4;
		const Sm = S.mul(p10(k));
		const exact = F.div(Sm);
		const p = r2(exact);
		if (!p) continue;
		const u = mm ? 'mm^2' : 'cm^2';
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`Una forza di ${pd(F, 'N')} agisce perpendicolarmente su una superficie di ${pd(S, u)}. Quanto vale la pressione in pascal?`),
			solution: `p = ${withU(sig(p, 2), PA)}`,
			steps: [
				`S = ${withU(datum(S), u)} = ${withU(sig(Sm, 2), 'm^2')}`,
				`p = \\dfrac{F_\\perp}{S} = \\dfrac{${withU(datum(F), 'N')}}{${withU(sig(Sm, 2), 'm^2')}} ${approx(exact, 2, PA)}`,
			],
			answer: p,
			unit: PA,
			format: S2,
			// the area not converted; converted with the factor of the lengths (10^-2 or 10^-3); force times area
			mistakes: [F.div(S), F.div(S.mul(p10(k / 2))), F.mul(Sm), p.div(n(10))],
			params: { case: mm ? 'mm2' : 'cm2', F: F.toString(), S: S.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the weight as the force

/** Bodies on a table, with the mass range (kg, two significant figures) that makes them believable. */
export const BODIES: [string, string, number, number][] = [
	['Un vaso', 'appoggiato', 1, 9.9],
	['Una valigia', 'appoggiata', 10, 30],
	['Uno zaino', 'appoggiato', 3, 9.9],
	['Una cassa', 'appoggiata', 10, 99],
	['Un televisore', 'appoggiato', 5, 30],
	['Una pila di libri', 'appoggiata', 2, 9.9],
];

function level3(rng: Rng): Built {
	for (;;) {
		const [who, lying, lo, hi] = rng.pick(BODIES);
		const m = hi < 10 ? q(rng.int(lo * 10, Math.round(hi * 10)), 10) : n(rng.int(lo, hi));
		const S = two(rng, rng.pick([1, 2]));
		const Sm = S.mul(p10(-4));
		const F = m.mul(G);
		const exact = F.div(Sm);
		const p = r2(exact);
		if (!p) continue;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`${who} di massa ${pd(m, 'kg')} è ${lying} su un tavolo orizzontale e lo tocca su una superficie di ${pd(S, 'cm^2')}. Che pressione esercita sul tavolo?`),
			solution: `p = ${withU(sig(p, 2), PA)}`,
			steps: [
				`F_\\perp = m \\cdot g = ${withU(datum(m), 'kg')} \\cdot ${G_TEX} = ${withU(dec(F), 'N')}`,
				`S = ${withU(datum(S), 'cm^2')} = ${withU(sig(Sm, 2), 'm^2')}`,
				`p = \\dfrac{F_\\perp}{S} = \\dfrac{${withU(dec(F), 'N')}}{${withU(sig(Sm, 2), 'm^2')}} ${approx(exact, 2, PA)}`,
			],
			answer: p,
			unit: PA,
			format: S2,
			// the mass taken for the force; the cm² not converted; force times area
			mistakes: [m.div(Sm), F.div(S), F.mul(Sm)],
			params: { case: 'peso', m: m.toString(), S: S.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the force or the area from the pressure

function level4(rng: Rng): Built {
	const askForce = rng.next() < 0.5;
	for (;;) {
		if (askForce) {
			const p = two(rng, rng.pick([1, 2])); // kPa
			const S = two(rng, rng.pick([0, 1])); // cm²
			const exact = p.mul(n(1000)).mul(S).mul(p10(-4));
			const F = r2(exact);
			if (!F) continue;
			return {
				prompt: 'Calcola la forza.',
				problem: textBlock(`Su una superficie di ${pd(S, 'cm^2')} agisce una pressione di ${pd(p, 'kPa')}. Quanto vale la forza perpendicolare alla superficie?`),
				solution: `F_\\perp = ${withU(datum(F), 'N')}`,
				steps: [
					`p = ${withU(datum(p), 'kPa')} = ${datum(p)} \\cdot 10^{3}\\,\\text{Pa} \\qquad S = ${withU(datum(S), 'cm^2')} = ${datum(S)} \\cdot 10^{-4}\\,\\text{m}^2`,
					`F_\\perp = p \\cdot S = ${datum(p)} \\cdot 10^{3}\\,\\text{Pa} \\cdot ${datum(S)} \\cdot 10^{-4}\\,\\text{m}^2 ${approx(exact, 2, 'N')}`,
				],
				answer: F,
				unit: 'N',
				format: S2,
				// the numbers multiplied as they are; the kPa converted, the cm² not; the area divided by the pressure
				mistakes: [p.mul(S), p.mul(n(1000)).mul(S), exact.div(n(10)), S.div(p)],
				params: { case: 'forza', p: p.toString(), S: S.toString() },
			};
		}
		const F = two(rng, rng.pick([1, 2])); // N
		const p = two(rng, rng.pick([0, 1])); // kPa
		const exact = F.div(p.mul(n(1000))).mul(p10(4)); // cm²
		const S = r2(exact);
		if (!S || S.compare(n(1)) < 0 || S.compare(n(999)) > 0) continue;
		return {
			prompt: "Calcola l'area.",
			problem: textBlock(`Quale area deve avere una superficie perché una forza perpendicolare di ${pd(F, 'N')} eserciti su di essa una pressione di ${pd(p, 'kPa')}? Scrivi il risultato in centimetri quadrati.`),
			solution: `S = ${withU(datum(S), 'cm^2')}`,
			steps: [
				`S = \\dfrac{F_\\perp}{p} = \\dfrac{${withU(datum(F), 'N')}}{${datum(p)} \\cdot 10^{3}\\,\\text{Pa}} ${approx(exact.mul(p10(-4)), 2, 'm^2')}`,
				`1\\,\\text{m}^2 = 10^{4}\\,\\text{cm}^2 \\text{, quindi } S ${approx(exact, 2, 'cm^2')}`,
			],
			answer: S,
			unit: 'cm^2',
			format: S2,
			// the kPa not converted; the m² written as cm²; the formula upside down
			mistakes: [F.div(p), exact.div(n(10000)), p.div(F), exact.div(n(100))],
			params: { case: 'area', F: F.toString(), p: p.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a block on one of its faces

/** An edge with two significant figures, in cm: 2,0 to 9,5 (steps of 0,5) or 10 to 40. */
function edge(rng: Rng): R {
	return rng.next() < 0.5 ? q(rng.int(4, 19), 2) : n(rng.int(10, 40));
}

function level5(rng: Rng): Built {
	const highest = rng.next() < 0.5;
	for (;;) {
		const dims = [edge(rng), edge(rng), edge(rng)];
		const [a, b, c] = dims;
		if (a.equals(b) || b.equals(c) || a.equals(c)) continue;
		const sorted = [...dims].sort((x, y) => x.compare(y));
		const faces = [sorted[0].mul(sorted[1]), sorted[0].mul(sorted[2]), sorted[1].mul(sorted[2])]; // cm², smallest first
		const face = highest ? faces[0] : faces[2];
		// the mass from a believable density, 0,5 to 8,0 g/cm³ (wood to iron), rounded to two figures
		const vol = a.mul(b).mul(c); // cm³
		const m = roundSig(vol.mul(q(rng.int(5, 80), 10)).div(n(1000)), 2);
		if (m.compare(q(1, 10)) < 0) continue;
		const F = m.mul(G);
		const exact = F.div(face.mul(p10(-4)));
		const p = r2(exact);
		if (!p) continue;
		const others = faces.filter((x) => !x.equals(face)).map((x) => F.div(x.mul(p10(-4))));
		const sideTex = (x: R) => withU(datum(x), 'cm');
		const faceTex = highest ? `${sideTex(sorted[0])} \\cdot ${sideTex(sorted[1])}` : `${sideTex(sorted[1])} \\cdot ${sideTex(sorted[2])}`;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(
				`Un blocco di massa ${pd(m, 'kg')} ha la forma di un parallelepipedo con gli spigoli di ${pd(a, 'cm')}, ${pd(b, 'cm')} e ${pd(c, 'cm')}. Si può appoggiare sul pavimento su una qualunque delle sue facce. Qual è la pressione ${highest ? 'più alta' : 'più bassa'} che può esercitare sul pavimento?`,
			),
			solution: `p = ${withU(sig(p, 2), PA)}`,
			steps: [
				t(highest ? 'La pressione più alta si ha sulla faccia più piccola:' : 'La pressione più bassa si ha sulla faccia più grande:'),
				`S = ${faceTex} = ${withU(dec(face), 'cm^2')} = ${withU(dec(face.mul(p10(-4))), 'm^2')}`,
				`F_\\perp = m \\cdot g = ${withU(datum(m), 'kg')} \\cdot ${G_TEX} = ${withU(dec(F), 'N')}`,
				`p = \\dfrac{${withU(dec(F), 'N')}}{${withU(dec(face.mul(p10(-4))), 'm^2')}} ${approx(exact, 2, PA)}`,
			],
			answer: p,
			unit: PA,
			format: S2,
			// the other faces; the cm² not converted
			mistakes: [...others, F.div(face)],
			params: { case: highest ? 'massima' : 'minima', m: m.toString(), dims: dims.map(String) },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	return v;
}

export const fisPressione: Generator = {
	id: ID,
	title: 'La pressione',
	levels: {
		1: { label: "La pressione dalla forza e dall'area", constraints: ['forza e area in m² con due cifre significative', 'p = F/S in Pa con due cifre significative'] },
		2: { label: "L'area in centimetri quadrati", constraints: ['area in cm² (70%) o in mm² (30%) da convertire', 'p in Pa'] },
		3: { label: 'Il peso come forza premente', constraints: ['massa in kg e area in cm²', 'F = m·g, g = 9,8 N/kg'] },
		4: { label: "La forza o l'area dalla pressione", constraints: ['pressione in kPa', 'F = p·S in N o S = F/p in cm²'] },
		5: { label: 'Il blocco appoggiato su una faccia', constraints: ['tre spigoli in cm e la massa', 'la faccia più piccola o la più grande'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceOf(sample, rng, ID),
};

export default fisPressione;
