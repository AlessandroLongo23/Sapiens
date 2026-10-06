/**
 * L'attrito viscoso e la velocità limite. Spec: specs/exercises/fis-viscosita.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/101-fis-viscosita.md), each one step harder: Stokes's
 * force 6π η r v on a small sphere; the limit speed from the mass, m g / (6π η r), Archimedes' push left out; the
 * limit speed of a droplet of water in air from its radius, 2 r² g d / (9 η); the same with Archimedes' push, for a
 * sphere in a liquid; the viscosity from a measured limit speed. g = 9,8 m/s². Radii in millimetres or micrometres,
 * to convert; answers with two significant figures in mN, cm/s, mm/s or Pa·s. Distractors from the lesson's warnings:
 * the diameter for the radius, the 6 or the π forgotten, Archimedes' push forgotten, g forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { roundSig } from '../vettori';
import { type Built, G, checkCommon, cut, d2, generateWith, pick4, pq, qu, rs, t, textBlock } from '../fis-fluidi-moto';

export const ID = 'fis-viscosita';

/** The liquids: viscosity in Pa·s (as written) and density in kg/m³. */
export const LIQUIDS = {
	glicerina: { eta: '1.5', d: 1260, in: 'nella glicerina' },
	miele: { eta: '10', d: 1400, in: 'nel miele' },
	ricino: { eta: '0.99', d: 960, in: "nell'olio di ricino" },
} as const;
type Liquid = keyof typeof LIQUIDS;
const LIQUID_KEYS: Liquid[] = ['glicerina', 'miele', 'ricino'];

/** The spheres: density in kg/m³. */
export const SOLIDS = {
	acciaio: { d: 7800, of: "d'acciaio" },
	alluminio: { d: 2700, of: "d'alluminio" },
	vetro: { d: 2500, of: 'di vetro' },
} as const;
type Solid = keyof typeof SOLIDS;
const SOLID_KEYS: Solid[] = ['acciaio', 'alluminio', 'vetro'];

const ETA_AIR = 1.8e-5;
const ETA_AIR_TEX = '1{,}8 \\cdot 10^{-5}\\,\\text{Pa} \\cdot \\text{s}';
const eta = (l: Liquid) => `$\\eta = ${qu(LIQUIDS[l].eta, 'Pa s')}$`;
const tex = (x: number | string) => String(x).replace('.', '{,}');
/** r in millimetres written in metres: 1{,}5 \cdot 10^{-3}\,\text{m}. */
const mm = (r: string) => `${tex(r)} \\cdot 10^{-3}\\,\\text{m}`;

// ---------------------------------------------------------------------------
// Level 1: Stokes's force

function level1(rng: Rng): Built {
	for (;;) {
		const l = rng.pick(LIQUID_KEYS);
		const r = d2(rng, 0.5, 5);
		const v = d2(rng, 0.5, 9);
		const exact = 6 * Math.PI * Number(LIQUIDS[l].eta) * Number(r) * Number(v) * 1e-2; // mN
		const ans = rs(exact);
		if (ans === null || exact < 0.1) continue;
		return {
			prompt: 'Calcola la forza di attrito viscoso.',
			problem: textBlock(`Una sferetta di raggio ${pq(r, 'mm')} scende ${LIQUIDS[l].in} (${eta(l)}) alla velocità di ${pq(v, 'cm/s')}. Quanto vale la forza di attrito viscoso sulla sferetta?`),
			solution: `F_v \\approx ${qu(ans, 'mN')}`,
			steps: [
				`r = ${qu(r, 'mm')} = ${mm(r)} \\qquad v = ${qu(v, 'cm/s')} = ${tex(v)} \\cdot 10^{-2}\\,\\text{m/s}`,
				`F_v = 6\\pi\\,\\eta\\,r\\,v = 6\\pi \\cdot ${qu(LIQUIDS[l].eta, 'Pa s')} \\cdot ${mm(r)} \\cdot ${tex(v)} \\cdot 10^{-2}\\,\\text{m/s}`,
				`F_v = ${cut(exact)} \\cdot 10^{-3}\\,\\text{N} \\approx ${qu(ans, 'mN')}`,
			],
			// the diameter for the radius; π forgotten; the 6 forgotten
			answer: pick4(rng, ans, 'mN', [exact * 2, exact / Math.PI, exact / 6]),
			params: { case: l, r, v },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the limit speed from the mass

function level2(rng: Rng): Built {
	for (;;) {
		const l = rng.pick(LIQUID_KEYS);
		const r = d2(rng, 1.1, 4);
		// the mass of a steel sphere of that radius, in grams, with two figures
		const m = roundSig(7800 * (4 / 3) * Math.PI * (Number(r) * 1e-3) ** 3 * 1000, 2);
		if (m === null || (!m.includes('.') && m.endsWith('0'))) continue;
		const exact = (Number(m) * 1e-3 * G * 100) / (6 * Math.PI * Number(LIQUIDS[l].eta) * Number(r) * 1e-3); // cm/s
		const ans = rs(exact);
		if (ans === null || exact < 0.1) continue;
		return {
			prompt: 'Trova la velocità limite.',
			problem: textBlock(`Una sferetta d'acciaio di massa ${pq(m, 'g')} e raggio ${pq(r, 'mm')} cade ${LIQUIDS[l].in} (${eta(l)}). Trascurando la spinta di Archimede, quanto vale la sua velocità limite?`),
			solution: `v_l \\approx ${qu(ans, 'cm/s')}`,
			steps: [
				t("Alla velocità limite l'attrito viscoso equilibra il peso: ") + '6\\pi\\,\\eta\\,r\\,v_l = m\\,g',
				`m = ${qu(m, 'g')} = ${tex(m)} \\cdot 10^{-3}\\,\\text{kg} \\qquad r = ${mm(r)}`,
				`v_l = \\dfrac{m\\,g}{6\\pi\\,\\eta\\,r} = \\dfrac{${tex(m)} \\cdot 10^{-3}\\,\\text{kg} \\cdot 9{,}8\\,\\text{m/s}^2}{6\\pi \\cdot ${qu(LIQUIDS[l].eta, 'Pa s')} \\cdot ${mm(r)}} = ${cut(exact / 100)}\\,\\text{m/s}`,
				`v_l \\approx ${qu(ans, 'cm/s')}`,
			],
			// g forgotten; the diameter for the radius; π forgotten
			answer: pick4(rng, ans, 'cm/s', [exact / G, exact / 2, exact * Math.PI]),
			params: { case: l, m, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a droplet of water in air

function level3(rng: Rng): Built {
	for (;;) {
		const r = d2(rng, 3, 28);
		const exact = ((2 * (Number(r) * 1e-6) ** 2 * G * 1000) / (9 * ETA_AIR)) * 1000; // mm/s
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità limite.',
			problem: textBlock(`Una gocciolina d'acqua (${pq('1000', 'kg/m3')}) di raggio ${pq(r, 'um')} scende nell'aria, che ha viscosità $${ETA_AIR_TEX}$. La spinta di Archimede è trascurabile. Quanto vale la velocità limite della gocciolina?`),
			solution: `v_l \\approx ${qu(ans, 'mm/s')}`,
			steps: [
				`r = ${qu(r, 'um')} = ${tex(r)} \\cdot 10^{-6}\\,\\text{m}`,
				`v_l = \\dfrac{2\\,r^2\\,g\\,d_s}{9\\,\\eta} = \\dfrac{2 \\cdot (${tex(r)} \\cdot 10^{-6}\\,\\text{m})^2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot 1000\\,\\text{kg/m}^3}{9 \\cdot ${ETA_AIR_TEX}}`,
				`v_l = ${cut(exact)} \\cdot 10^{-3}\\,\\text{m/s} \\approx ${qu(ans, 'mm/s')}`,
			],
			// the diameter for the radius; the 2/9 upside down; g forgotten
			answer: pick4(rng, ans, 'mm/s', [exact * 4, (exact * 81) / 4, exact / G]),
			params: { r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: with Archimedes' push

function level4(rng: Rng): Built {
	for (;;) {
		const l = rng.pick(LIQUID_KEYS);
		const s = rng.pick(SOLID_KEYS);
		const r = d2(rng, 0.5, 3);
		const k = ((2 * (Number(r) * 1e-3) ** 2 * G) / (9 * Number(LIQUIDS[l].eta))) * 1000; // mm/s per kg/m³
		const diff = SOLIDS[s].d - LIQUIDS[l].d;
		const exact = k * diff;
		const ans = rs(exact);
		if (ans === null || exact < 0.5) continue;
		return {
			prompt: 'Trova la velocità limite.',
			problem: textBlock(`Una sferetta ${SOLIDS[s].of} (${pq(String(SOLIDS[s].d), 'kg/m3')}) di raggio ${pq(r, 'mm')} cade ${LIQUIDS[l].in}, che ha densità ${pq(String(LIQUIDS[l].d), 'kg/m3')} e viscosità ${pq(LIQUIDS[l].eta, 'Pa s')}. Quanto vale la sua velocità limite, tenendo conto della spinta di Archimede?`),
			solution: `v_l \\approx ${qu(ans, 'mm/s')}`,
			steps: [
				t("Alla velocità limite attrito viscoso e spinta di Archimede equilibrano il peso: ") + 'F_v + S_A = m\\,g',
				`d_s - d_{fl} = ${SOLIDS[s].d}\\,\\text{kg/m}^3 - ${LIQUIDS[l].d}\\,\\text{kg/m}^3 = ${diff}\\,\\text{kg/m}^3`,
				`v_l = \\dfrac{2\\,r^2\\,g\\,(d_s - d_{fl})}{9\\,\\eta} = \\dfrac{2 \\cdot (${mm(r)})^2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${diff}\\,\\text{kg/m}^3}{9 \\cdot ${qu(LIQUIDS[l].eta, 'Pa s')}}`,
				`v_l = ${cut(exact)} \\cdot 10^{-3}\\,\\text{m/s} \\approx ${qu(ans, 'mm/s')}`,
			],
			// Archimedes' push forgotten; the densities added; the diameter for the radius
			answer: pick4(rng, ans, 'mm/s', [k * SOLIDS[s].d, k * (SOLIDS[s].d + LIQUIDS[l].d), exact * 4]),
			params: { case: `${s}-${l}`, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the viscosity from the limit speed

const OILS = [880, 920, 960];

function level5(rng: Rng): Built {
	for (;;) {
		const dfl = rng.pick(OILS);
		const r = d2(rng, 0.5, 2.5);
		const v = d2(rng, 1.1, 99);
		const diff = 7800 - dfl;
		const exact = (2 * (Number(r) * 1e-3) ** 2 * G * diff) / (9 * Number(v) * 1e-3);
		const ans = rs(exact);
		if (ans === null || exact < 0.1 || exact > 9.9) continue;
		return {
			prompt: 'Trova la viscosità.',
			problem: textBlock(`In un cilindro pieno di un olio di densità ${pq(String(dfl), 'kg/m3')} una sferetta d'acciaio (${pq('7800', 'kg/m3')}) di raggio ${pq(r, 'mm')} scende alla velocità costante di ${pq(v, 'mm/s')}. Quanto vale la viscosità dell'olio?`),
			solution: `\\eta \\approx ${qu(ans, 'Pa s')}`,
			steps: [
				t('La velocità costante è la velocità limite: ') + `v_l = ${qu(v, 'mm/s')} = ${tex(v)} \\cdot 10^{-3}\\,\\text{m/s}`,
				`d_s - d_{fl} = 7800\\,\\text{kg/m}^3 - ${dfl}\\,\\text{kg/m}^3 = ${diff}\\,\\text{kg/m}^3`,
				`\\eta = \\dfrac{2\\,r^2\\,g\\,(d_s - d_{fl})}{9\\,v_l} = \\dfrac{2 \\cdot (${mm(r)})^2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${diff}\\,\\text{kg/m}^3}{9 \\cdot ${tex(v)} \\cdot 10^{-3}\\,\\text{m/s}}`,
				`\\eta = ${cut(exact)}\\,\\text{Pa} \\cdot \\text{s} \\approx ${qu(ans, 'Pa s')}`,
			],
			// Archimedes' push forgotten; the diameter for the radius; g forgotten
			answer: pick4(rng, ans, 'Pa s', [(exact * 7800) / diff, exact * 4, exact / G]),
			params: { dfl, r, v },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisViscosita: Generator = {
	id: ID,
	title: "L'attrito viscoso e la velocità limite",
	levels: {
		1: { label: 'La forza di Stokes', constraints: ['F = 6π η r v in mN', 'raggio in mm, velocità in cm/s', 'glicerina, miele o olio di ricino'] },
		2: { label: 'La velocità limite dalla massa', constraints: ['v = m g / (6π η r) in cm/s', "sferetta d'acciaio, massa in grammi", 'spinta di Archimede trascurata'] },
		3: { label: 'La gocciolina nella nebbia', constraints: ['v = 2 r² g d / (9 η) in mm/s', "goccia d'acqua da 3 a 28 μm nell'aria"] },
		4: { label: 'La velocità limite con Archimede', constraints: ['v = 2 r² g (ds − dfl) / (9 η) in mm/s', 'acciaio, alluminio o vetro in glicerina, miele o olio di ricino'] },
		5: { label: 'La viscosità dalla velocità limite', constraints: ['η = 2 r² g (ds − dfl) / (9 v) tra 0,1 e 9,9 Pa·s', "sferetta d'acciaio in un olio"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisViscosita;
