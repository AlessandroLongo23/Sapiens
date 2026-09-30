/**
 * Conduzione, convezione e irraggiamento. Spec: specs/exercises/fis-propagazione-calore.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/69-fis-propagazione-calore.md), each one step harder, all
 * on the law of conduction Q/Δt = λ S ΔT / d: the heat per second through a slab with the data in SI units; the same
 * with thicknesses in cm or mm and bars with a section in cm²; the heat in a time given in minutes or hours; the
 * thickness or the conductivity from the heat per second; two layers compared (the thickness of insulation that
 * lets through as much heat as a wall, or the heat through a second wall). Data with two significant figures, results
 * rounded to two and never too close to a rounding boundary. Distractors from the lesson's warnings: thickness or area
 * not converted, the temperature in place of the difference, the time not converted, ratios upside down.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, answerOf, checkCommon, dec, generateWith, pq, q, sig, t, tex, textBlock } from '../fis-calore';

export const ID = 'fis-propagazione-calore';

type Mat = { nome: string; art: string; lam: string };
/** Walls and panes: the article "di" + name; λ as the lesson's table (legno 0,12 as a datum). */
const SLABS: Mat[] = [
	{ nome: 'vetro', art: 'di vetro', lam: '1.0' },
	{ nome: 'mattoni pieni', art: 'di mattoni pieni', lam: '0.80' },
	{ nome: 'legno', art: 'di legno', lam: '0.12' },
	{ nome: 'polistirolo espanso', art: 'di polistirolo espanso', lam: '0.035' },
];
const BARS: Mat[] = [
	{ nome: 'rame', art: 'di rame', lam: '401' },
	{ nome: 'alluminio', art: 'di alluminio', lam: '237' },
	{ nome: 'ferro', art: 'di ferro', lam: '80' },
	{ nome: 'acciaio inossidabile', art: 'di acciaio inossidabile', lam: '16' },
];
const INSULATORS: Mat[] = [
	{ nome: 'polistirolo espanso', art: 'di polistirolo espanso', lam: '0.035' },
	{ nome: 'lana di roccia', art: 'di lana di roccia', lam: '0.040' },
	{ nome: 'sughero', art: 'di sughero', lam: '0.050' },
];
const WALLS: Mat[] = [
	{ nome: 'mattoni pieni', art: 'di mattoni pieni', lam: '0.80' },
	{ nome: 'calcestruzzo', art: 'di calcestruzzo', lam: '1.5' },
	{ nome: 'pietra', art: 'di pietra', lam: '2.2' },
];

const lamTex = (m: Mat) => `\\lambda = ${q(tex(m.lam), 'lam')}`;
/** Two significant figures, 1,1 to 9,9 times 10^k, without a trailing zero: k = -2 gives 0,011-0,099. */
function two(rng: Rng, k: number): string {
	for (;;) {
		const n = rng.int(11, 99);
		if (n % 10) return k >= 1 ? String(n * 10 ** (k - 1)) : dec(n, 1 - k);
	}
}
const lab = (s: string) => s.replace('.', ',');
/** An unrounded intermediate value for the steps: five figures, never in exponent form. */
const raw = (x: number) => tex(x >= 1e4 ? String(Math.round(x)) : x.toPrecision(5));
/** A thickness of 1,1-9,9 cm in metres, exactly ("5.8" → "0.058"). */
const cmToM = (d: string) => dec(Math.round(Number(d) * 10), 3);

/** The slab (or bar) of the scene: faces' temperatures, thickness, area; never the answer. */
function slab(alt: string, d: { caldo?: string; freddo?: string; dT?: string; spessore: string; area: string; materiale: string; sbarra?: boolean }): SceneRef {
	const data: Record<string, unknown> = { spessore: d.spessore, area: d.area, materiale: d.materiale, sbarra: !!d.sbarra };
	if (d.dT) data.dT = d.dT;
	else {
		data.caldo = d.caldo;
		data.freddo = d.freddo;
	}
	return { type: 'lastra-conduzione', data, alt };
}

// ---------------------------------------------------------------------------
// Level 1: the heat per second, data in SI units

function level1(rng: Rng): Built {
	for (;;) {
		const m = rng.pick(SLABS);
		const S = two(rng, 0); // 1,1-9,9 m²
		const d = m.nome === 'vetro' ? two(rng, -3) : m.nome === 'legno' ? two(rng, -2) : two(rng, -1); // m
		const dT = m.nome === 'vetro' ? rng.int(1, 6) : rng.int(5, 30);
		const lam = Number(m.lam), Sn = Number(S), dn = Number(d);
		const exact = (lam * Sn * dT) / dn;
		const ans = sig(exact, 2);
		if (!ans || exact < 1 || exact >= 1e4) continue;
		return {
			prompt: 'Trova il calore che passa ogni secondo.',
			problem: textBlock(`Una lastra ${m.art}, con ${'$' + lamTex(m) + '$'}, ha un'area di ${pq(tex(S), 'm2')} ed è spessa ${pq(tex(d), 'm')}. Tra le due facce c'è una differenza di temperatura di ${pq(String(dT), 'C')}. Quanto calore passa ogni secondo?`),
			solution: `\\dfrac{Q}{\\Delta t} \\approx ${q(ans.tex, 'W')}`,
			steps: [
				`\\dfrac{Q}{\\Delta t} = \\lambda\\,\\dfrac{S\\,\\Delta T}{d} = ${tex(m.lam)} \\cdot \\dfrac{${tex(S)} \\cdot ${dT}}{${tex(d)}}\\,\\text{W} = ${raw(exact)}\\ldots\\,\\text{W} \\approx ${q(ans.tex, 'W')}`,
				t('Una differenza di un grado Celsius è una differenza di un kelvin.'),
			],
			// the thickness multiplied; area and thickness swapped; ΔT forgotten
			answer: answerOf(rng, ans, exact, [lam * Sn * dT * dn, (lam * dn * dT) / Sn, (lam * Sn) / dn], 2, 'W'),
			params: { case: m.nome, lam: m.lam, S, d, dT },
			scene: slab(`Una lastra ${m.art} di ${lab(S)} metri quadrati, spessa ${lab(d)} metri, con una differenza di ${dT} gradi tra le facce.`, { dT: `${dT} °C`, spessore: `${lab(d)} m`, area: `${lab(S)} m²`, materiale: m.nome }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: units to convert

function level2(rng: Rng): Built {
	const bar = rng.next() < 0.5;
	for (;;) {
		if (bar) {
			const m = rng.pick(BARS);
			const Scm = two(rng, 0); // cm²
			const L = String(rng.int(11, 99)); // cm
			if (Number(L) % 10 === 0) continue;
			const hot = rng.int(50, 100), cold = rng.int(0, 30);
			const lam = Number(m.lam), dT = hot - cold;
			const exact = (lam * Number(Scm) * 1e-4 * dT) / (Number(L) / 100);
			const ans = sig(exact, 2);
			if (!ans || exact < 0.1 || exact >= 1e3) continue;
			return {
				prompt: 'Trova il calore che passa ogni secondo.',
				problem: textBlock(`Una sbarra ${m.art}, con ${'$' + lamTex(m) + '$'}, lunga ${pq(L, 'cm')} e con una sezione di $${tex(Scm)}\\,\\text{cm}^2$, ha un'estremità a ${pq(String(hot), 'C')} e l'altra a ${pq(String(cold), 'C')}. Quanto calore passa ogni secondo lungo la sbarra?`),
				solution: `\\dfrac{Q}{\\Delta t} \\approx ${q(ans.tex, 'W')}`,
				steps: [
					`${t('In unità del SI: ')} S = ${tex(Scm)}\\,\\text{cm}^2 = ${tex(Scm)} \\cdot 10^{-4}\\,\\text{m}^2, \\quad d = ${tex(dec(Number(L), 2))}\\,\\text{m}, \\quad \\Delta T = ${hot} - ${cold} = ${dT}\\,^\\circ\\text{C}`,
					`\\dfrac{Q}{\\Delta t} = ${tex(m.lam)} \\cdot \\dfrac{${tex(Scm)} \\cdot 10^{-4} \\cdot ${dT}}{${tex(dec(Number(L), 2))}}\\,\\text{W} = ${raw(exact)}\\ldots\\,\\text{W} \\approx ${q(ans.tex, 'W')}`,
				],
				// the length left in cm; the section in m² as if cm² were dm² (×100); the hot end's temperature for ΔT
				answer: answerOf(rng, ans, exact, [exact / 100, exact * 100, (exact * hot) / dT], 2, 'W'),
				params: { case: 'sbarra', lam: m.lam, S: Scm, L, hot, cold },
				scene: slab(`Una sbarra ${m.art} lunga ${L} centimetri, di sezione ${lab(Scm)} centimetri quadrati, con le estremità a ${hot} e a ${cold} gradi.`, { caldo: `${hot} °C`, freddo: `${cold} °C`, spessore: `${L} cm`, area: `${lab(Scm)} cm²`, materiale: m.nome, sbarra: true }),
			};
		}
		const m = rng.pick(SLABS);
		const glass = m.nome === 'vetro';
		const d = two(rng, 0); // in mm for glass, in cm otherwise
		const unit = glass ? 'mm' : 'cm';
		const S = two(rng, 0);
		const inside = rng.int(15, 22), outside = glass ? inside - rng.int(1, 6) : rng.int(-5, 10);
		const dT = inside - outside;
		const dm = Number(d) / (glass ? 1000 : 100);
		const exact = (Number(m.lam) * Number(S) * dT) / dm;
		const ans = sig(exact, 2);
		if (!ans || exact < 1 || exact >= 1e4) continue;
		const k = glass ? 1000 : 100;
		return {
			prompt: 'Trova il calore che passa ogni secondo.',
			problem: textBlock(`Una lastra ${m.art}, con ${'$' + lamTex(m) + '$'}, ha un'area di ${pq(tex(S), 'm2')} ed è spessa ${pq(tex(d), unit)}. Una faccia è a ${pq(String(inside), 'C')}, l'altra a ${pq(String(outside), 'C')}. Quanto calore passa ogni secondo?`),
			solution: `\\dfrac{Q}{\\Delta t} \\approx ${q(ans.tex, 'W')}`,
			steps: [
				`${t('In unità del SI: ')} d = ${tex(d)}\\,\\text{${unit}} = ${tex(String(dm))}\\,\\text{m}, \\quad \\Delta T = ${inside} - ${outside < 0 ? `(${outside})` : outside} = ${dT}\\,^\\circ\\text{C}`,
				`\\dfrac{Q}{\\Delta t} = ${tex(m.lam)} \\cdot \\dfrac{${tex(S)} \\cdot ${dT}}{${tex(String(dm))}}\\,\\text{W} = ${raw(exact)}\\ldots\\,\\text{W} \\approx ${q(ans.tex, 'W')}`,
			],
			// the thickness not converted; the warmer face's temperature for ΔT; the difference taken as a sum (or the colder face)
			answer: answerOf(rng, ans, exact, [exact / k, (exact * inside) / dT, outside < 0 ? (exact * (inside + outside)) / dT : (exact * outside) / dT], 2, 'W'),
			params: { case: 'lastra', lam: m.lam, S, d, unit, inside, outside },
			scene: slab(`Una lastra ${m.art} di ${lab(S)} metri quadrati, spessa ${lab(d)} ${glass ? 'millimetri' : 'centimetri'}, con le facce a ${inside} e a ${outside} gradi.`, { caldo: `${inside} °C`, freddo: `${String(outside).replace('-', '−')} °C`, spessore: `${lab(d)} ${unit}`, area: `${lab(S)} m²`, materiale: m.nome }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the heat in a time

function level3(rng: Rng): Built {
	const hours = rng.next() < 0.5;
	for (;;) {
		const m = rng.pick(SLABS.filter((x) => x.nome !== 'vetro'));
		const S = two(rng, 0);
		const d = two(rng, 0); // cm
		const dT = rng.int(5, 30);
		const n = hours ? rng.int(2, 12) : rng.int(10, 59);
		if (!hours && n % 10 === 0) continue;
		const P = (Number(m.lam) * Number(S) * dT) / (Number(d) / 100);
		const secs = n * (hours ? 3600 : 60);
		const exact = P * secs;
		const ans = sig(exact, 2);
		if (!ans || P < 1) continue;
		return {
			prompt: 'Trova il calore che passa.',
			problem: textBlock(
				`Una parete ${m.art}, con ${'$' + lamTex(m) + '$'}, ha un'area di ${pq(tex(S), 'm2')} ed è spessa ${pq(tex(d), 'cm')}. Tra le due facce ci sono ${pq(String(dT), 'C')} di differenza. Quanto calore attraversa la parete in ${pq(String(n), hours ? 'h' : 'min')}?`,
			),
			solution: `Q \\approx ${q(ans.tex, 'J')}`,
			steps: [
				`\\dfrac{Q}{\\Delta t} = \\lambda\\,\\dfrac{S\\,\\Delta T}{d} = ${tex(m.lam)} \\cdot \\dfrac{${tex(S)} \\cdot ${dT}}{${tex(cmToM(d))}}\\,\\text{W} = ${raw(P)}\\ldots\\,\\text{W}`,
				`${t('Il tempo in secondi: ')} \\Delta t = ${n} \\cdot ${hours ? 3600 : 60}\\,\\text{s} = ${secs}\\,\\text{s}`,
				`Q = \\dfrac{Q}{\\Delta t} \\cdot \\Delta t = ${raw(exact)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			// the time not converted; hours taken as minutes (or minutes as hours); the thickness left in cm
			answer: answerOf(rng, ans, exact, [P * n, hours ? P * n * 60 : P * n * 3600, exact / 100], 2, 'J'),
			params: { case: hours ? 'ore' : 'minuti', lam: m.lam, S, d, dT, n },
			scene: slab(`Una parete ${m.art} di ${lab(S)} metri quadrati, spessa ${lab(d)} centimetri, con ${dT} gradi di differenza tra le facce.`, { dT: `${dT} °C`, spessore: `${lab(d)} cm`, area: `${lab(S)} m²`, materiale: m.nome }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the thickness or the conductivity

function level4(rng: Rng): Built {
	const askD = rng.next() < 0.5;
	for (;;) {
		if (askD) {
			const m = rng.pick(INSULATORS);
			const S = two(rng, -1); // 0,11-0,99 m²
			const inside = rng.int(2, 8), outside = rng.int(25, 38);
			const dT = outside - inside;
			const P = two(rng, 0); // W
			const exact = (Number(m.lam) * Number(S) * dT) / Number(P) * 100; // cm
			const ans = sig(exact, 2);
			if (!ans || exact < 1 || exact > 30) continue;
			return {
				prompt: 'Trova lo spessore.',
				problem: textBlock(
					`Una borsa frigo ${m.art}, con ${'$' + lamTex(m) + '$'}, ha una superficie di ${pq(tex(S), 'm2')}. Dentro ci sono ${pq(String(inside), 'C')}, fuori ${pq(String(outside), 'C')}. Quanto devono essere spesse le pareti perché entrino al massimo ${pq(tex(P), 'W')}?`,
				),
				solution: `d \\approx ${q(ans.tex, 'cm')}`,
				steps: [
					t('Dalla legge della conduzione si ricava lo spessore:'),
					`d = \\lambda\\,\\dfrac{S\\,\\Delta T}{Q/\\Delta t} = ${tex(m.lam)} \\cdot \\dfrac{${tex(S)} \\cdot (${outside} - ${inside})}{${tex(P)}}\\,\\text{m} = ${raw(exact / 100)}\\ldots\\,\\text{m} \\approx ${q(ans.tex, 'cm')}`,
				],
				// the formula upside down (in cm); the outside temperature for ΔT; the metres read as centimetres
				answer: answerOf(rng, ans, exact, [(Number(P) / (Number(m.lam) * Number(S) * dT)) * 100, (exact * outside) / dT, exact / 100], 2, 'cm'),
				params: { case: 'spessore', lam: m.lam, S, inside, outside, P },
			};
		}
		const S = two(rng, 0);
		const d = two(rng, 0); // cm
		const dT = rng.int(5, 30);
		const P = two(rng, 1); // 11-99 W
		const exact = (Number(P) * (Number(d) / 100)) / (Number(S) * dT);
		const ans = sig(exact, 2);
		if (!ans || exact < 0.02 || exact > 3) continue;
		return {
			prompt: 'Trova la conducibilità termica.',
			problem: textBlock(`Una lastra di un materiale da costruzione ha un'area di ${pq(tex(S), 'm2')} ed è spessa ${pq(tex(d), 'cm')}. Con ${pq(String(dT), 'C')} di differenza tra le facce, la attraversano ${pq(tex(P), 'W')}. Quanto vale la conducibilità termica del materiale?`),
			solution: `\\lambda \\approx ${q(ans.tex, 'lam')}`,
			steps: [
				t('Dalla legge della conduzione, con lo spessore in metri:'),
				`\\lambda = \\dfrac{Q/\\Delta t \\cdot d}{S\\,\\Delta T} = \\dfrac{${tex(P)} \\cdot ${tex(cmToM(d))}}{${tex(S)} \\cdot ${dT}}\\,${'\\text{W/(m}\\cdot\\text{K)}'} = ${raw(exact)}\\ldots \\approx ${q(ans.tex, 'lam')}`,
			],
			// the thickness left in cm; d in the denominator; ΔT forgotten
			answer: answerOf(rng, ans, exact, [exact * 100, Number(P) / (Number(S) * dT * (Number(d) / 100)), (Number(P) * (Number(d) / 100)) / Number(S)], 2, 'lam'),
			params: { case: 'conducibilita', S, d, dT, P },
			scene: slab(`Una lastra di ${lab(S)} metri quadrati, spessa ${lab(d)} centimetri, con ${dT} gradi di differenza tra le facce.`, { dT: `${dT} °C`, spessore: `${lab(d)} cm`, area: `${lab(S)} m²`, materiale: '' }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: two layers compared

function level5(rng: Rng): Built {
	const same = rng.next() < 0.5;
	for (;;) {
		const A = rng.pick(WALLS), B = rng.pick(INSULATORS);
		const dA = String(rng.int(11, 49)); // cm
		if (Number(dA) % 10 === 0) continue;
		const la = Number(A.lam), lb = Number(B.lam);
		if (same) {
			const exact = (Number(dA) * lb) / la;
			const ans = sig(exact, 2);
			if (!ans || exact < 0.1) continue;
			return {
				prompt: 'Trova lo spessore equivalente.',
				problem: textBlock(`Quale spessore di uno strato ${B.art} (${'$' + lamTex(B) + '$'}) lascia passare lo stesso calore di una parete ${A.art} (${'$' + lamTex(A) + '$'}) spessa ${pq(dA, 'cm')}, a parità di area e di differenza di temperatura?`),
				solution: `d \\approx ${q(ans.tex, 'cm')}`,
				steps: [
					t('Il calore che passa ogni secondo è lo stesso se lambda diviso lo spessore è lo stesso:'),
					`\\dfrac{\\lambda_B}{d_B} = \\dfrac{\\lambda_A}{d_A} \\quad\\Rightarrow\\quad d_B = d_A \\cdot \\dfrac{\\lambda_B}{\\lambda_A} = ${dA}\\,\\text{cm} \\cdot \\dfrac{${tex(B.lam)}}{${tex(A.lam)}} = ${raw(exact)}\\ldots\\,\\text{cm} \\approx ${q(ans.tex, 'cm')}`,
				],
				// the ratio upside down; the ratio of the thicknesses forgotten; the difference of the conductivities
				answer: answerOf(rng, ans, exact, [(Number(dA) * la) / lb, Number(dA) * lb, Number(dA) * (la - lb)], 2, 'cm'),
				params: { case: 'spessore', A: A.nome, B: B.nome, dA },
			};
		}
		const dB = two(rng, 0); // cm
		const PA = String(rng.int(11, 99) * 10); // W
		if (Number(PA) % 100 === 0) continue;
		const exact = Number(PA) * (lb / la) * (Number(dA) / Number(dB));
		const ans = sig(exact, 2);
		if (!ans || exact < 1) continue;
		const PAt = `${tex(String(Number(PA) / 100))} \\cdot 10^{2}`;
		return {
			prompt: 'Trova il calore che passa ogni secondo.',
			problem: textBlock(
				`Da una parete ${A.art} (${'$' + lamTex(A) + '$'}) spessa ${pq(dA, 'cm')} passano $${PAt}\\,\\text{W}$. Quanto calore passerebbe ogni secondo da uno strato ${B.art} (${'$' + lamTex(B) + '$'}) spesso ${pq(tex(dB), 'cm')}, con la stessa area e la stessa differenza di temperatura?`,
			),
			solution: `\\dfrac{Q}{\\Delta t} \\approx ${q(ans.tex, 'W')}`,
			steps: [
				t('Area e differenza di temperatura sono le stesse: il calore è proporzionale a lambda e inversamente proporzionale allo spessore.'),
				`\\dfrac{Q_B}{\\Delta t} = ${PAt}\\,\\text{W} \\cdot \\dfrac{${tex(B.lam)}}{${tex(A.lam)}} \\cdot \\dfrac{${dA}}{${tex(dB)}} = ${raw(exact)}\\ldots\\,\\text{W} \\approx ${q(ans.tex, 'W')}`,
			],
			// the thicknesses upside down; the conductivities upside down; the thicknesses forgotten
			answer: answerOf(rng, ans, exact, [Number(PA) * (lb / la) * (Number(dB) / Number(dA)), Number(PA) * (la / lb) * (Number(dA) / Number(dB)), Number(PA) * (lb / la)], 2, 'W'),
			params: { case: 'confronto', A: A.nome, B: B.nome, dA, dB, PA },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	const needsScene = sample.level <= 3 || sample.params.case === 'conducibilita';
	if (needsScene && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisPropagazioneCalore: Generator = {
	id: ID,
	title: 'Conduzione, convezione e irraggiamento',
	levels: {
		1: { label: 'Il calore che passa ogni secondo', constraints: ['dati in unità del SI'] },
		2: { label: 'Le unità da convertire', constraints: ['spessori in cm o mm, sbarre con la sezione in cm²'] },
		3: { label: 'Il calore in un tempo', constraints: ['tempo in minuti o in ore'] },
		4: { label: 'Lo spessore o la conducibilità', constraints: ['formula ricavata al contrario'] },
		5: { label: 'Due strati a confronto', constraints: ['spessore equivalente, o calore attraverso un altro strato'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPropagazioneCalore;
