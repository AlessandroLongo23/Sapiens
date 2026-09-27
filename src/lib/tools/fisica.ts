import { fail, type Outcome } from './types';
import {
	baseUnit,
	exact,
	finish,
	fmt,
	grouped,
	q,
	readDatum,
	rel,
	safely,
	solveProduct,
	sqrtVal,
	symbolsTable,
	unit,
	unitsStep,
	vu,
	type Datum,
	type ProductSpec,
	type Quantity,
	type Tagged,
	type Unit,
	type Val
} from './grandezze';

/**
 * The physics formulas of the first two years: uniform and uniformly accelerated motion, density, kinetic and
 * gravitational potential energy, Ohm's law. The student picks the quantity to find and gives the others, each in
 * its unit; the steps convert to SI units, invert the formula and substitute with the units.
 *
 * Symbols as in the Amaldi (Zanichelli), the most used book in Italian licei: s = v · t, d = m / V, K and U for the
 * energies, V = R · I. g is 9,8 m/s² by default, as in the Amaldi, and the student can change it.
 */

// Units, the SI one first.
const M = unit('m', 'm', '\\text{m}');
const KM = unit('km', 'km', '\\text{km}', q(1000));
const CM = unit('cm', 'cm', '\\text{cm}', q(1, 100));
const SEC = unit('s', 's', '\\text{s}');
const MIN = unit('min', 'min', '\\text{min}', q(60));
const HOUR = unit('h', 'h', '\\text{h}', q(3600));
const MS = unit('ms', 'm/s', '\\text{m/s}');
const KMH = unit('kmh', 'km/h', '\\text{km/h}', q(1000, 3600));
const MS2 = unit('ms2', 'm/s²', '\\text{m/s}^2');
const KG = unit('kg', 'kg', '\\text{kg}');
const G = unit('g', 'g', '\\text{g}', q(1, 1000));
const J = unit('J', 'J', '\\text{J}');
const KJ = unit('kJ', 'kJ', '\\text{kJ}', q(1000));

const LENGTHS = [M, KM, CM];
const TIMES = [SEC, MIN, HOUR];
const SPEEDS = [MS, KMH];
const MASSES = [KG, G];

/** Units of intermediate results. */
const M2S2 = unit('', 'm²/s²', '\\text{m}^2/\\text{s}^2');
const S2 = unit('', 's²', '\\text{s}^2');
const W = unit('W', 'W', '\\text{W}');

// ---------------------------------------------------------------------------------------------------------------
// Uniform motion: s = v · t.

export const MOTO_UNIFORME: ProductSpec = {
	p: { key: 's', sym: 's', name: 'spazio', the: 'lo spazio', units: LENGTHS, sign: 'pos', example: '150' },
	a: { key: 'v', sym: 'v', name: 'velocità', the: 'la velocità', units: SPEEDS, sign: 'pos', example: '12,5' },
	b: { key: 't', sym: 't', name: 'tempo', the: 'il tempo', units: TIMES, sign: 'pos', example: '12' },
	main: 'p'
};

export const motoUniforme = (state: Record<string, string>): Outcome => safely(() => solveProduct(MOTO_UNIFORME, state.trova, state).outcome);

// ---------------------------------------------------------------------------------------------------------------
// Density: d = m / V.

export const DENSITA: ProductSpec = {
	p: { key: 'm', sym: 'm', name: 'massa', the: 'la massa', units: MASSES, sign: 'pos', example: '2,5' },
	a: {
		key: 'd',
		sym: 'd',
		name: 'densità',
		the: 'la densità',
		units: [unit('kgm3', 'kg/m³', '\\text{kg/m}^3'), unit('gcm3', 'g/cm³', '\\text{g/cm}^3', q(1000)), unit('gmL', 'g/mL', '\\text{g/mL}', q(1000)), unit('gL', 'g/L', '\\text{g/L}')],
		sign: 'pos',
		example: '1000'
	},
	b: {
		key: 'V',
		sym: 'V',
		name: 'volume',
		the: 'il volume',
		units: [unit('m3', 'm³', '\\text{m}^3'), unit('dm3', 'dm³', '\\text{dm}^3', q(1, 1000)), unit('L', 'L', '\\text{L}', q(1, 1000)), unit('cm3', 'cm³', '\\text{cm}^3', q(1, 1_000_000)), unit('mL', 'mL', '\\text{mL}', q(1, 1_000_000))],
		sign: 'pos',
		example: '0,5'
	},
	main: 'a'
};

/**
 * Densities of common materials in kg/m³, at 20 °C and normal pressure unless noted: rounded values as in the
 * tables of the school books (Amaldi; CRC Handbook of Chemistry and Physics). Solids and wood vary with the sample.
 */
export const MATERIALS: { name: string; d: string; note?: string }[] = [
	{ name: 'Aria', d: '1,2' },
	{ name: 'Legno di abete', d: '450', note: 'varia con il legno' },
	{ name: 'Olio di oliva', d: '920' },
	{ name: 'Ghiaccio', d: '917', note: 'a 0 °C' },
	{ name: 'Acqua', d: '1000' },
	{ name: 'Acqua di mare', d: '1030' },
	{ name: 'Alluminio', d: '2700' },
	{ name: 'Ferro', d: '7870' },
	{ name: 'Rame', d: '8960' },
	{ name: 'Piombo', d: '11340' },
	{ name: 'Mercurio', d: '13590' },
	{ name: 'Oro', d: '19300' }
];

export const densita = (state: Record<string, string>): Outcome => safely(() => solveProduct(DENSITA, state.trova, state).outcome);

// ---------------------------------------------------------------------------------------------------------------
// Ohm's law: V = R · I, and the power P = V · I.

export const OHM: ProductSpec = {
	p: { key: 'V', sym: 'V', name: 'tensione', the: 'la tensione', units: [unit('V', 'V', '\\text{V}'), unit('mV', 'mV', '\\text{mV}', q(1, 1000)), unit('kV', 'kV', '\\text{kV}', q(1000))], sign: 'pos', example: '12' },
	a: {
		key: 'R',
		sym: 'R',
		name: 'resistenza',
		the: 'la resistenza',
		units: [unit('ohm', 'Ω', '\\Omega'), unit('kohm', 'kΩ', '\\text{k}\\Omega', q(1000)), unit('Mohm', 'MΩ', '\\text{M}\\Omega', q(1_000_000))],
		sign: 'pos',
		example: '220'
	},
	b: { key: 'I', sym: 'I', name: 'intensità di corrente', the: "l'intensità di corrente", units: [unit('A', 'A', '\\text{A}'), unit('mA', 'mA', '\\text{mA}', q(1, 1000))], sign: 'pos', example: '0,5' },
	main: 'p'
};

export function ohm(state: Record<string, string>): Outcome {
	return safely(
		() =>
			solveProduct(OHM, state.trova, state, (values) => {
				const V = values.p;
				const I = values.b;
				const P: Val = { q: V.q.mul(I.q), approx: V.approx || I.approx };
				return {
					step: {
						say: 'Calcola anche la potenza elettrica.',
						math: ['P = V \\cdot I', `P ${rel(V)} ${vu(V, baseUnit(OHM.p))} \\cdot ${vu(I, baseUnit(OHM.b))}`, `${rel(P)} \\hl{${vu(P, W)}}`],
						then: 'La potenza si misura in watt: $1\\ \\text{W} = 1\\ \\text{V} \\cdot 1\\ \\text{A}$.',
						part: 'La potenza'
					},
					row: { label: 'Potenza elettrica', value: `$${fmt(P).exact ? '' : '\\approx '}${vu(P, W)}$` }
				};
			}).outcome
	);
}

// ---------------------------------------------------------------------------------------------------------------
// Shared pieces of the formulas with a square or with more than three quantities.

/** Reads the known quantities; the first error as a string. */
function readAll(qts: Quantity[], state: Record<string, string>): Record<string, Datum> | string {
	const out: Record<string, Datum> = {};
	for (const qt of qts) {
		const d = readDatum(qt, state[qt.key], state[`u${qt.key}`]);
		if (typeof d === 'string') return d;
		out[qt.key] = d;
	}
	return out;
}

/** "+ 12 m/s" or "- 12 m/s", for a term after the first. */
const plus = (v: Val, u: Unit) => (v.q.sign() < 0 ? `- ${vu({ ...v, q: v.q.neg() }, u)}` : `+ ${vu(v, u)}`);
/** "- 12 m/s" or "+ 12 m/s", for a term subtracted. */
const minus = (v: Val, u: Unit) => (v.q.sign() < 0 ? `+ ${vu({ ...v, q: v.q.neg() }, u)}` : `- ${vu(v, u)}`);

const mul = (...vs: Val[]): Val => ({ q: vs.reduce((acc, v) => acc.mul(v.q), q(1)), approx: vs.some((v) => v.approx) });
const div = (a: Val, b: Val): Val => ({ q: a.q.div(b.q), approx: a.approx || b.approx });
const add = (a: Val, b: Val): Val => ({ q: a.q.add(b.q), approx: a.approx || b.approx });
const sub = (a: Val, b: Val): Val => ({ q: a.q.sub(b.q), approx: a.approx || b.approx });
const num = (n: number, d = 1): Val => exact(q(n, d));
const HALF = num(1, 2);
const TWO = num(2);

/** The last line of a calculation: "= 12 m/s" highlighted. */
const last = (v: Val, u: Unit) => `${rel(v)} \\hl{${vu(v, u)}}`;

interface Parts {
	unknown: Quantity;
	/** The formula of the book, and the quantities in it for the symbols table. */
	formula: string;
	symbols: Quantity[];
	/** The formula solved for the unknown, when it is not the book's formula, and how to get there. */
	inverse?: { tex: string; how: string };
	data: Datum[];
	/** The calculation, from the substitution to the result. */
	calc: Tagged[];
	result: Val;
	state: Record<string, string>;
	then?: string;
}

/** Puts together the steps every formula shares and the result rows. */
function assemble(p: Parts): Outcome {
	const steps: Tagged[] = [{ say: 'Scrivi la formula.', math: [p.formula], table: symbolsTable(p.symbols), then: p.then, part: 'La formula' }];
	if (p.inverse) steps.push({ say: `Ricava ${p.unknown.the} dalla formula.`, math: [p.inverse.tex], then: p.inverse.how });
	const conv = unitsStep(p.data);
	if (conv) steps.push({ ...conv, part: 'I dati' });
	steps.push(...p.calc.map((s, i) => (i === 0 ? { ...s, part: s.part ?? 'Il calcolo' } : s)));
	const end = finish(p.unknown, p.result, p.state[`u${p.unknown.key}`]);
	if (end.step) steps.push({ ...end.step, part: 'Il risultato' });
	return { ok: true, rows: end.rows, copy: end.copy, steps: grouped(steps) };
}

// ---------------------------------------------------------------------------------------------------------------
// Kinetic energy: K = ½ m v².

const ENERGY_UNITS = [J, KJ];
export const K_QT: Quantity = { key: 'K', sym: 'K', name: 'energia cinetica', the: "l'energia cinetica", units: ENERGY_UNITS, sign: 'pos', example: '1500' };
export const U_QT: Quantity = { key: 'U', sym: 'U', name: 'energia potenziale', the: "l'energia potenziale", units: ENERGY_UNITS, sign: 'pos', example: '196' };
export const MASS_QT: Quantity = { key: 'm', sym: 'm', name: 'massa', the: 'la massa', units: MASSES, sign: 'pos', example: '2' };
export const SPEED_QT: Quantity = { key: 'v', sym: 'v', name: 'velocità', the: 'la velocità', units: SPEEDS, sign: 'pos', example: '10' };
export const HEIGHT_QT: Quantity = { key: 'h', sym: 'h', name: 'altezza', the: "l'altezza", units: LENGTHS, sign: 'pos', example: '10' };
export const G_QT: Quantity = { key: 'g', sym: 'g', name: 'accelerazione di gravità', the: "l'accelerazione di gravità", units: [MS2], sign: 'pos', example: '9,8' };

export const ENERGIA_CINETICA = [K_QT, MASS_QT, SPEED_QT];
export const ENERGIA_POTENZIALE = [U_QT, MASS_QT, HEIGHT_QT];

export function energiaCinetica(state: Record<string, string>): Outcome {
	return safely(() => {
		const unknown = ENERGIA_CINETICA.find((x) => x.key === state.trova) ?? K_QT;
		const read = readAll(
			ENERGIA_CINETICA.filter((x) => x !== unknown),
			state
		);
		if (typeof read === 'string') return fail(read);
		const x = (k: string) => read[k].base;
		const u = (qt: Quantity) => baseUnit(qt);
		const formula = `${unknown === K_QT ? '\\hl{K}' : 'K'} = \\dfrac{1}{2}\\, m v^2`;
		let result: Val;
		let calc: Tagged[];
		let inverse: Parts['inverse'];
		if (unknown === K_QT) {
			const v2 = mul(x('v'), x('v'));
			result = mul(HALF, x('m'), v2);
			calc = [{ say: 'Sostituisci i valori, con le loro unità.', math: [`K = \\dfrac{1}{2} \\cdot ${vu(x('m'), u(MASS_QT))} \\cdot (${vu(x('v'), u(SPEED_QT))})^2`, `= \\dfrac{1}{2} \\cdot ${vu(x('m'), u(MASS_QT))} \\cdot ${vu(v2, M2S2)}`, last(result, J)] }];
		} else if (unknown === MASS_QT) {
			inverse = { tex: '\\hl{m} = \\dfrac{2K}{v^2}', how: 'Moltiplica i due membri per 2, poi dividili per $v^2$.' };
			const v2 = mul(x('v'), x('v'));
			const k2 = mul(TWO, x('K'));
			result = div(k2, v2);
			calc = [{ say: 'Sostituisci i valori, con le loro unità.', math: [`m = \\dfrac{2 \\cdot ${vu(x('K'), J)}}{(${vu(x('v'), u(SPEED_QT))})^2}`, `= \\dfrac{${vu(k2, J)}}{${vu(v2, M2S2)}}`, last(result, KG)] }];
		} else {
			inverse = { tex: '\\hl{v} = \\sqrt{\\dfrac{2K}{m}}', how: 'Ricava prima $v^2$, poi fai la radice quadrata.' };
			const k2 = mul(TWO, x('K'));
			const v2 = div(k2, x('m'));
			result = sqrtVal(v2);
			calc = [
				{
					say: 'Sostituisci i valori, con le loro unità.',
					math: [`v = \\sqrt{\\dfrac{2 \\cdot ${vu(x('K'), J)}}{${vu(x('m'), KG)}}}`, `= \\sqrt{${vu(v2, M2S2)}}`, last(result, MS)],
					then: fmt(result).exact ? undefined : 'La radice non è esatta: il risultato è arrotondato.'
				}
			];
		}
		return assemble({ unknown, formula, symbols: ENERGIA_CINETICA, inverse, data: Object.values(read), calc, result, state, then: 'Un joule è un $\\text{kg} \\cdot \\text{m}^2/\\text{s}^2$.' });
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Gravitational potential energy: U = m g h, with g given (9,8 m/s² by default).

export function energiaPotenziale(state: Record<string, string>): Outcome {
	return safely(() => {
		const unknown = ENERGIA_POTENZIALE.find((x) => x.key === state.trova) ?? U_QT;
		const read = readAll(
			ENERGIA_POTENZIALE.filter((x) => x !== unknown),
			state
		);
		if (typeof read === 'string') return fail(read);
		const gd = readDatum(G_QT, state.g, 'ms2');
		if (typeof gd === 'string') return fail('Scrivi l’accelerazione di gravità, per esempio 9,8.');
		const g = gd.base;
		const x = (k: string) => read[k].base;
		const formula = `${unknown === U_QT ? '\\hl{U}' : 'U'} = m g h`;
		const gTex = vu(g, MS2);
		let result: Val;
		let calc: Tagged[];
		let inverse: Parts['inverse'];
		if (unknown === U_QT) {
			result = mul(x('m'), g, x('h'));
			calc = [{ say: 'Sostituisci i valori, con le loro unità.', math: [`U = ${vu(x('m'), KG)} \\cdot ${gTex} \\cdot ${vu(x('h'), M)}`, last(result, J)] }];
		} else if (unknown === MASS_QT) {
			inverse = { tex: '\\hl{m} = \\dfrac{U}{g h}', how: 'Dividi i due membri per $g h$.' };
			const gh = mul(g, x('h'));
			result = div(x('U'), gh);
			calc = [{ say: 'Sostituisci i valori, con le loro unità.', math: [`m = \\dfrac{${vu(x('U'), J)}}{${gTex} \\cdot ${vu(x('h'), M)}}`, `= \\dfrac{${vu(x('U'), J)}}{${vu(gh, M2S2)}}`, last(result, KG)] }];
		} else {
			inverse = { tex: '\\hl{h} = \\dfrac{U}{m g}', how: 'Dividi i due membri per $m g$.' };
			const mg = mul(x('m'), g);
			result = div(x('U'), mg);
			calc = [{ say: 'Sostituisci i valori, con le loro unità.', math: [`h = \\dfrac{${vu(x('U'), J)}}{${vu(x('m'), KG)} \\cdot ${gTex}}`, `= \\dfrac{${vu(x('U'), J)}}{${vu(mg, unit('', 'N', '\\text{N}'))}}`, last(result, M)] }];
		}
		const standard = g.q.cmp(q(98, 10)) === 0 || g.q.cmp(q(981, 100)) === 0;
		return assemble({
			unknown,
			formula,
			symbols: [...ENERGIA_POTENZIALE, G_QT],
			inverse,
			data: Object.values(read),
			calc,
			result,
			state,
			then: standard ? `Sulla Terra $g = ${gTex}$. L'altezza si misura dal livello scelto come zero.` : `Qui $g = ${gTex}$. L'altezza si misura dal livello scelto come zero.`
		});
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Uniformly accelerated motion, starting from s = 0: three formulas with four quantities each.

export const V0_QT: Quantity = { key: 'v0', sym: 'v_0', name: 'velocità iniziale', the: 'la velocità iniziale', units: SPEEDS, sign: 'any', example: '5' };
export const VF_QT: Quantity = { key: 'v', sym: 'v', name: 'velocità finale', the: 'la velocità finale', units: SPEEDS, sign: 'any', example: '25' };
export const A_QT: Quantity = { key: 'a', sym: 'a', name: 'accelerazione', the: "l'accelerazione", units: [MS2], sign: 'any', example: '2' };
export const T_QT: Quantity = { key: 't', sym: 't', name: 'tempo', the: 'il tempo', units: TIMES, sign: 'pos', example: '10' };
export const S_QT: Quantity = { key: 's', sym: 's', name: 'spazio percorso', the: 'lo spazio percorso', units: LENGTHS, sign: 'any', example: '150' };

export type MotoFormula = 'v' | 's' | 'v2';

export const MOTO_FORMULE: { id: MotoFormula; label: string; tex: string; vars: Quantity[] }[] = [
	{ id: 'v', label: 'v = v₀ + a·t', tex: 'v = v_0 + a t', vars: [VF_QT, V0_QT, A_QT, T_QT] },
	{ id: 's', label: 's = v₀·t + ½·a·t²', tex: 's = v_0 t + \\dfrac{1}{2} a t^2', vars: [S_QT, V0_QT, A_QT, T_QT] },
	{ id: 'v2', label: 'v² = v₀² + 2·a·s', tex: 'v^2 = v_0^2 + 2 a s', vars: [VF_QT, V0_QT, A_QT, S_QT] }
];

const SAY_SUB = 'Sostituisci i valori, con le loro unità.';

export function motoAccelerato(state: Record<string, string>): Outcome {
	return safely(() => {
		const f = MOTO_FORMULE.find((x) => x.id === state.f) ?? MOTO_FORMULE[0];
		const unknown = f.vars.find((x) => x.key === state.trova) ?? f.vars[0];
		const read = readAll(
			f.vars.filter((x) => x !== unknown),
			state
		);
		if (typeof read === 'string') return fail(read);
		const x = (k: string) => read[k].base;
		const hl = (tex: string) => tex.replace(new RegExp(`^${unknown.sym.replace(/[\\^]/g, (c) => `\\${c}`)}(?![_\\w])`), `\\hl{${unknown.sym}}`);
		let formula = f.tex;
		if (unknown === f.vars[0] && f.id !== 'v2') formula = hl(f.tex);
		let inverse: Parts['inverse'];
		let calc: Tagged[];
		let result: Val;
		const P = (k: string, qt: Quantity) => vu(x(k), baseUnit(qt), true);

		if (f.id === 'v') {
			if (unknown === VF_QT) {
				const at = mul(x('a'), x('t'));
				result = add(x('v0'), at);
				calc = [{ say: SAY_SUB, math: [`v = ${P('v0', V0_QT)} + ${P('a', A_QT)} \\cdot ${P('t', T_QT)}`, `= ${vu(x('v0'), MS)} ${plus(at, MS)}`, last(result, MS)] }];
			} else if (unknown === V0_QT) {
				inverse = { tex: '\\hl{v_0} = v - a t', how: 'Sottrai $a t$ ai due membri.' };
				const at = mul(x('a'), x('t'));
				result = sub(x('v'), at);
				calc = [{ say: SAY_SUB, math: [`v_0 = ${vu(x('v'), MS)} - ${P('a', A_QT)} \\cdot ${P('t', T_QT)}`, `= ${vu(x('v'), MS)} ${minus(at, MS)}`, last(result, MS)] }];
			} else if (unknown === A_QT) {
				inverse = { tex: '\\hl{a} = \\dfrac{v - v_0}{t}', how: 'Sottrai $v_0$, poi dividi per $t$.' };
				const dv = sub(x('v'), x('v0'));
				result = div(dv, x('t'));
				calc = [{ say: SAY_SUB, math: [`a = \\dfrac{${vu(x('v'), MS)} ${minus(x('v0'), MS)}}{${vu(x('t'), SEC)}}`, `= \\dfrac{${vu(dv, MS)}}{${vu(x('t'), SEC)}}`, last(result, MS2)] }];
			} else {
				if (x('a').q.isZero()) return fail('Con accelerazione zero la velocità non cambia: il tempo non si ricava da questa formula. Usa il moto rettilineo uniforme.');
				inverse = { tex: '\\hl{t} = \\dfrac{v - v_0}{a}', how: 'Sottrai $v_0$, poi dividi per $a$.' };
				const dv = sub(x('v'), x('v0'));
				result = div(dv, x('a'));
				if (result.q.sign() < 0) return fail('Con questi dati il tempo viene negativo. Se il corpo accelera, la velocità finale è maggiore di quella iniziale; se frena, l’accelerazione è negativa.');
				calc = [{ say: SAY_SUB, math: [`t = \\dfrac{${vu(x('v'), MS)} ${minus(x('v0'), MS)}}{${P('a', A_QT)}}`, `= \\dfrac{${vu(dv, MS)}}{${P('a', A_QT)}}`, last(result, SEC)] }];
			}
		} else if (f.id === 's') {
			const t = () => x('t');
			if (unknown === S_QT) {
				const v0t = mul(x('v0'), t());
				const half = mul(HALF, x('a'), t(), t());
				result = add(v0t, half);
				calc = [{ say: SAY_SUB, math: [`s = ${P('v0', V0_QT)} \\cdot ${vu(t(), SEC)} + \\dfrac{1}{2} \\cdot ${P('a', A_QT)} \\cdot (${vu(t(), SEC)})^2`, `= ${vu(v0t, M)} ${plus(half, M)}`, last(result, M)] }];
			} else if (unknown === V0_QT) {
				inverse = { tex: '\\hl{v_0} = \\dfrac{s - \\frac{1}{2} a t^2}{t}', how: 'Sottrai $\\frac{1}{2} a t^2$, poi dividi per $t$.' };
				const half = mul(HALF, x('a'), t(), t());
				const top = sub(x('s'), half);
				result = div(top, t());
				calc = [
					{
						say: SAY_SUB,
						math: [`v_0 = \\dfrac{${vu(x('s'), M)} - \\frac{1}{2} \\cdot ${P('a', A_QT)} \\cdot (${vu(t(), SEC)})^2}{${vu(t(), SEC)}}`, `= \\dfrac{${vu(x('s'), M)} ${minus(half, M)}}{${vu(t(), SEC)}}`, `= \\dfrac{${vu(top, M)}}{${vu(t(), SEC)}}`, last(result, MS)]
					}
				];
			} else if (unknown === A_QT) {
				inverse = { tex: '\\hl{a} = \\dfrac{2\\,(s - v_0 t)}{t^2}', how: 'Sottrai $v_0 t$, poi moltiplica per 2 e dividi per $t^2$.' };
				const v0t = mul(x('v0'), t());
				const diff = sub(x('s'), v0t);
				const top = mul(TWO, diff);
				const t2 = mul(t(), t());
				result = div(top, t2);
				calc = [
					{
						say: SAY_SUB,
						math: [`a = \\dfrac{2 \\cdot (${vu(x('s'), M)} - ${P('v0', V0_QT)} \\cdot ${vu(t(), SEC)})}{(${vu(t(), SEC)})^2}`, `= \\dfrac{2 \\cdot (${vu(x('s'), M)} ${minus(v0t, M)})}{${vu(t2, S2)}}`, `= \\dfrac{${vu(top, M)}}{${vu(t2, S2)}}`, last(result, MS2)]
					}
				];
			} else {
				const a = x('a');
				const v0 = x('v0');
				const s = x('s');
				if (a.q.isZero()) {
					if (v0.q.isZero()) return fail('Con velocità iniziale e accelerazione zero il corpo resta fermo: il tempo non si può calcolare.');
					inverse = { tex: '\\hl{t} = \\dfrac{s}{v_0}', how: 'Con $a = 0$ il moto è uniforme: dividi i due membri per $v_0$.' };
					result = div(s, v0);
					if (result.q.sign() <= 0) return fail('Con questi dati il tempo viene negativo o zero: controlla i segni di spazio e velocità.');
					calc = [{ say: SAY_SUB, math: [`t = \\dfrac{${vu(s, M)}}{${P('v0', V0_QT)}}`, last(result, SEC)] }];
				} else {
					// ½ a t² + v0 t − s = 0, so t = (−v0 ± √(v0² + 2as)) / a.
					const v02 = mul(v0, v0);
					const as2 = mul(TWO, a, s);
					const delta = add(v02, as2);
					if (delta.q.sign() < 0) return fail('Con questi dati il corpo non arriva mai a percorrere quello spazio: si ferma prima e torna indietro. Controlla il segno dell’accelerazione.');
					const root = sqrtVal(delta);
					const mv0: Val = { q: v0.q.neg(), approx: v0.approx };
					const t1 = div(add(mv0, root), a);
					const t2 = div(sub(mv0, root), a);
					const positive = [t1, t2].filter((r) => r.q.sign() > 0);
					const distinct = positive.filter((r, i) => positive.findIndex((o) => o.q.cmp(r.q) === 0) === i);
					if (!distinct.length) return fail('Con questi dati il tempo viene negativo: il corpo non passa mai da quella posizione andando avanti. Controlla i segni dei dati.');
					if (distinct.length > 1)
						return fail('Con questi dati il corpo passa due volte da quella posizione: prima si allontana, poi frena e torna indietro. Calcola prima la velocità finale, poi il tempo con v = v0 + a·t.');
					result = distinct[0];
					const other = result === t1 ? t2 : t1;
					calc = [
						{ say: 'Porta tutti i termini a sinistra.', math: [`\\dfrac{1}{2} a t^2 + v_0 t - s = 0`], then: 'È un’equazione di secondo grado nell’incognita $t$.', part: 'L’equazione in t' },
						{ say: 'Usa la formula risolutiva, scritta con le grandezze del moto.', math: ['\\hl{t} = \\dfrac{-v_0 \\pm \\sqrt{v_0^2 + 2 a s}}{a}'] },
						{
							say: 'Calcola il numero sotto la radice, poi la radice.',
							math: [`v_0^2 + 2 a s = (${vu(v0, MS)})^2 + 2 \\cdot ${P('a', A_QT)} \\cdot ${vu(s, M, true)}`, `= ${vu(v02, M2S2)} ${plus(as2, M2S2)}`, `= ${vu(delta, M2S2)}`, `\\sqrt{${vu(delta, M2S2)}} ${rel(root)} ${vu(root, MS)}`]
						},
						{
							say: 'Calcola le due soluzioni.',
							math: [
								`t_1 = \\dfrac{${fmt(v0.q.neg()).tex} + ${fmt(root).tex}}{${fmt(a).tex.startsWith('-') ? `(${fmt(a).tex})` : fmt(a).tex}} ${rel(t1)} ${fmt(t1).tex}\\ \\text{s}`,
								`t_2 = \\dfrac{${fmt(v0.q.neg()).tex} - ${fmt(root).tex}}{${fmt(a).tex.startsWith('-') ? `(${fmt(a).tex})` : fmt(a).tex}} ${rel(t2)} ${fmt(t2).tex}\\ \\text{s}`
							],
							then: fmt(root).exact ? undefined : 'La radice non è esatta: i valori sono arrotondati.'
						},
						{ say: other.q.isZero() ? 'Scarta la soluzione zero: è l’istante della partenza.' : 'Scarta la soluzione negativa: il tempo è positivo.', math: [`t ${last(result, SEC)}`] }
					];
				}
			}
		} else {
			// v² = v0² + 2as.
			if (unknown === VF_QT || unknown === V0_QT) {
				const isV = unknown === VF_QT;
				const known = isV ? x('v0') : x('v');
				const k2 = mul(known, known);
				const as2 = mul(TWO, x('a'), x('s'));
				const sq = isV ? add(k2, as2) : sub(k2, as2);
				if (sq.q.sign() < 0)
					return fail(
						isV
							? 'Con questi dati il quadrato della velocità viene negativo: il corpo si ferma prima di percorrere quello spazio. Controlla il segno dell’accelerazione.'
							: 'Con questi dati il quadrato della velocità iniziale viene negativo: controlla i dati e il segno dell’accelerazione.'
					);
				result = sqrtVal(sq);
				const sym = isV ? 'v' : 'v_0';
				const ksym = isV ? 'v_0' : 'v';
				inverse = { tex: `\\hl{${sym}} = \\sqrt{${ksym}^2 ${isV ? '+' : '-'} 2 a s}`, how: isV ? 'Fai la radice quadrata dei due membri.' : 'Sottrai $2 a s$, poi fai la radice quadrata.' };
				calc = [
					{
						say: SAY_SUB,
						math: [`${sym} = \\sqrt{(${vu(known, MS)})^2 ${isV ? '+' : '-'} 2 \\cdot ${P('a', A_QT)} \\cdot ${vu(x('s'), M, true)}}`, `= \\sqrt{${vu(k2, M2S2)} ${isV ? plus(as2, M2S2) : minus(as2, M2S2)}}`, `= \\sqrt{${vu(sq, M2S2)}}`, last(result, MS)],
						then: `Prendi la radice positiva: il corpo va nel verso positivo.${fmt(result).exact ? '' : ' La radice non è esatta: il risultato è arrotondato.'}`
					}
				];
			} else if (unknown === A_QT) {
				if (x('s').q.isZero()) return fail('Con spazio zero l’accelerazione non si ricava da questa formula: scrivi uno spazio diverso da zero.');
				inverse = { tex: '\\hl{a} = \\dfrac{v^2 - v_0^2}{2 s}', how: 'Sottrai $v_0^2$, poi dividi per $2 s$.' };
				const v2 = mul(x('v'), x('v'));
				const v02 = mul(x('v0'), x('v0'));
				const top = sub(v2, v02);
				const s2 = mul(TWO, x('s'));
				result = div(top, s2);
				calc = [
					{
						say: SAY_SUB,
						math: [`a = \\dfrac{(${vu(x('v'), MS)})^2 - (${vu(x('v0'), MS)})^2}{2 \\cdot ${vu(x('s'), M)}}`, `= \\dfrac{${vu(v2, M2S2)} - ${vu(v02, M2S2)}}{${vu(s2, M)}}`, `= \\dfrac{${vu(top, M2S2)}}{${vu(s2, M)}}`, last(result, MS2)]
					}
				];
			} else {
				if (x('a').q.isZero()) return fail('Con accelerazione zero la velocità non cambia: lo spazio non si ricava da questa formula. Usa il moto rettilineo uniforme.');
				inverse = { tex: '\\hl{s} = \\dfrac{v^2 - v_0^2}{2 a}', how: 'Sottrai $v_0^2$, poi dividi per $2 a$.' };
				const v2 = mul(x('v'), x('v'));
				const v02 = mul(x('v0'), x('v0'));
				const top = sub(v2, v02);
				const a2 = mul(TWO, x('a'));
				result = div(top, a2);
				if (result.q.sign() < 0) return fail('Con questi dati lo spazio viene negativo. Se il corpo frena, l’accelerazione è negativa: scrivi il segno meno.');
				calc = [
					{
						say: SAY_SUB,
						math: [`s = \\dfrac{(${vu(x('v'), MS)})^2 - (${vu(x('v0'), MS)})^2}{2 \\cdot ${P('a', A_QT)}}`, `= \\dfrac{${vu(v2, M2S2)} - ${vu(v02, M2S2)}}{${vu(a2, MS2, true)}}`, `= \\dfrac{${vu(top, M2S2)}}{${vu(a2, MS2, true)}}`, last(result, M)]
					}
				];
			}
		}
		return assemble({
			unknown,
			formula,
			symbols: f.vars,
			inverse,
			data: Object.values(read),
			calc,
			result,
			state,
			then: f.vars.includes(S_QT) ? 'Lo spazio $s$ si misura dal punto di partenza.' : undefined
		});
	});
}
