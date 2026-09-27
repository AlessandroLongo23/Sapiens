import { fail, type Outcome, type ResultRow } from './types';
import { Q, cap, finish, fmt, grouped, parseNumber, q, readDatum, rel, safely, symbolsTable, unit, unitsStep, vu, type Datum, type Quantity, type Tagged, type Unit, type Val } from './grandezze';

/**
 * The gas laws: the equation of state pV = nRT, the student choosing the quantity to find, and the transformations
 * of a gas from a state 1 to a state 2 (Boyle, Charles, Gay-Lussac and the general law). The temperature always goes
 * to kelvin, in a step of its own and highlighted, even when it is given in kelvin: using degrees Celsius is the most
 * frequent mistake.
 *
 * R is 8,314 J/(mol·K) with the pressure in pascal and the volume in cubic metres, 0,0821 L·atm/(mol·K) with the
 * pressure in atmospheres (or mmHg) and the volume in litres: the pressure unit the student picks decides. T = t +
 * 273,15, as in the physics books; some chemistry books round to 273.
 *
 * Names as in the Italian books: the isobaric law is Charles's law in chemistry and the first law of Gay-Lussac in
 * physics (Amaldi); the isochoric law is Gay-Lussac's law, or his second law.
 */

// ---------------------------------------------------------------------------------------------------------------
// Units.

const ATM_PA = q(101_325);
/** Pressure units by id, with their value in pascal. */
const P_PA: [string, string, string, Q][] = [
	['Pa', 'Pa', '\\text{Pa}', q(1)],
	['kPa', 'kPa', '\\text{kPa}', q(1000)],
	['hPa', 'hPa', '\\text{hPa}', q(100)],
	['bar', 'bar', '\\text{bar}', q(100_000)],
	['atm', 'atm', '\\text{atm}', ATM_PA],
	['mmHg', 'mmHg', '\\text{mmHg}', ATM_PA.div(q(760))]
];
/** Volume units by id, with their value in litres. */
const V_L: [string, string, string, Q][] = [
	['m3', 'm³', '\\text{m}^3', q(1000)],
	['L', 'L', '\\text{L}', q(1)],
	['dm3', 'dm³', '\\text{dm}^3', q(1)],
	['mL', 'mL', '\\text{mL}', q(1, 1000)],
	['cm3', 'cm³', '\\text{cm}^3', q(1, 1000)]
];

/** Units measured against `base`, the base first. */
function unitsIn(table: [string, string, string, Q][], base: string): Unit[] {
	const b = table.find((t) => t[0] === base)![3];
	const all = table.map(([id, label, tex, f]) => unit(id, label, tex, f.div(b)));
	return [all.find((u) => u.id === base)!, ...all.filter((u) => u.id !== base)];
}

export const T_UNITS: Unit[] = [unit('K', 'K', '\\text{K}'), unit('C', '°C', '^\\circ\\text{C}')];
const K = T_UNITS[0];
const ABS_ZERO = q(27_315, 100);

type Kind = 'p' | 'V' | 'n' | 'T';

export interface Var {
	key: string;
	kind: Kind;
	sym: string;
	/** The name, lower case: "pressione iniziale". */
	name: string;
	the: string;
	example: string;
}

const ENDING: Record<string, [string, string]> = {
	'1': ['iniziale', 'iniziale'],
	'2': ['finale', 'finale']
};
function v(kind: Kind, idx = ''): Var {
	const [end] = ENDING[idx] ?? [''];
	const base: Record<Kind, [string, string, string]> = {
		p: ['pressione', 'la pressione', '1'],
		V: ['volume', 'il volume', '22,4'],
		n: ['quantità di sostanza', 'la quantità di sostanza', '2'],
		T: ['temperatura', 'la temperatura', '25']
	};
	const [name, the, example] = base[kind];
	return {
		key: `${kind}${idx}`,
		kind,
		sym: idx ? `${kind}_${idx}` : kind,
		name: end ? `${name} ${end}` : name,
		the: end ? `${the} ${end}` : the,
		example
	};
}

/** The unit tables shown in the selects: the same ids in every system. */
export function quantityOf(x: Var, system: 'si' | 'atm' = 'si'): Quantity {
	const units =
		x.kind === 'p'
			? unitsIn(P_PA, system === 'si' ? 'Pa' : 'atm')
			: x.kind === 'V'
				? unitsIn(V_L, system === 'si' ? 'm3' : 'L')
				: x.kind === 'n'
					? [unit('mol', 'mol', '\\text{mol}'), unit('mmol', 'mmol', '\\text{mmol}', q(1, 1000))]
					: T_UNITS;
	return {
		key: x.key,
		sym: x.sym,
		name: x.name,
		the: x.the,
		units,
		sign: x.kind === 'T' ? 'any' : 'pos',
		example: x.example
	};
}

// ---------------------------------------------------------------------------------------------------------------
// The laws, as a fraction equal to a fraction: num1 / den1 = num2 / den2.

export type LawId = 'pvnrt' | 'boyle' | 'charles' | 'gaylussac' | 'generale';

interface Law {
	id: LawId;
	label: string;
	/** The book's formula. */
	tex: string;
	vars: Var[];
	sides: [string[], string[], string[], string[]];
	/** What stays constant, and the name in the other books. */
	note: string;
}

const P1 = v('p', '1');
const V1 = v('V', '1');
const T1 = v('T', '1');
const P2 = v('p', '2');
const V2 = v('V', '2');
const T2 = v('T', '2');

export const LAWS: Law[] = [
	{
		id: 'pvnrt',
		label: 'pV = nRT',
		tex: 'p V = n R T',
		vars: [v('p'), v('V'), v('n'), v('T')],
		sides: [['p', 'V'], [], ['n', 'R', 'T'], []],
		note: 'È l’equazione di stato del gas perfetto.'
	},
	{
		id: 'boyle',
		label: 'Boyle (isoterma)',
		tex: 'p_1 V_1 = p_2 V_2',
		vars: [P1, V1, P2, V2],
		sides: [['p1', 'V1'], [], ['p2', 'V2'], []],
		note: 'La temperatura resta costante: è una trasformazione isoterma.'
	},
	{
		id: 'charles',
		label: 'Charles (isobara)',
		tex: '\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}',
		vars: [V1, T1, V2, T2],
		sides: [['V1'], ['T1'], ['V2'], ['T2']],
		note: 'La pressione resta costante: è una trasformazione isobara. In fisica si chiama anche prima legge di Gay-Lussac.'
	},
	{
		id: 'gaylussac',
		label: 'Gay-Lussac (isocora)',
		tex: '\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}',
		vars: [P1, T1, P2, T2],
		sides: [['p1'], ['T1'], ['p2'], ['T2']],
		note: 'Il volume resta costante: è una trasformazione isocora. In fisica si chiama anche seconda legge di Gay-Lussac.'
	},
	{
		id: 'generale',
		label: 'Equazione generale',
		tex: '\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}',
		vars: [P1, V1, T1, P2, V2, T2],
		sides: [['p1', 'V1'], ['T1'], ['p2', 'V2'], ['T2']],
		note: 'La quantità di gas resta la stessa; pressione, volume e temperatura cambiano.'
	}
];

export const lawOf = (id: string | undefined) => LAWS.find((l) => l.id === id) ?? LAWS[0];

// ---------------------------------------------------------------------------------------------------------------

const R_SI = q(8314, 1000);
const R_ATM = q(821, 10_000);
const R_UNIT_SI = unit('', 'J/(mol·K)', '\\tfrac{\\text{J}}{\\text{mol} \\cdot \\text{K}}');
const R_UNIT_ATM = unit('', 'L·atm/(mol·K)', '\\tfrac{\\text{L} \\cdot \\text{atm}}{\\text{mol} \\cdot \\text{K}}');

/** The symbol of a variable key: p1 → p_1, R → R. */
const symOf = (key: string) => (/\d$/.test(key) ? `${key.slice(0, -1)}_${key.slice(-1)}` : key);
const prodSym = (keys: string[]) => keys.map(symOf).join(' ');

/** The unknown alone: its formula, and in words how to get it from the book's formula. */
function solveFor(law: Law, x: string): { num: string[]; den: string[]; how: string } {
	const [n1, d1, n2, d2] = law.sides;
	const sides: [string[], string[]][] = [
		[n1, d1],
		[n2, d2]
	];
	const a = sides.findIndex(([n, d]) => n.includes(x) || d.includes(x));
	const [an, ad] = sides[a];
	const [bn, bd] = sides[1 - a];
	const how = (mul: string[], div: string[]) => {
		const m = mul.length ? `moltiplica i due membri per $${prodSym(mul)}$` : '';
		const d = div.length ? `${m ? 'poi dividili' : 'dividi i due membri'} per $${prodSym(div)}$` : '';
		return [m, d].filter(Boolean).join(', ');
	};
	if (an.includes(x)) {
		const rest = an.filter((k) => k !== x);
		return {
			num: [...bn, ...ad],
			den: [...rest, ...bd],
			how: `${cap(
				how(
					ad,
					[...bd, ...rest].filter((k) => !bd.includes(k))
				)
			)}.`
		};
	}
	// In a denominator: flip both fractions first.
	const rest = ad.filter((k) => k !== x);
	return {
		num: [...an, ...bd],
		den: [...bn, ...rest],
		how: `Capovolgi le due frazioni, poi ${how(
			an,
			[...bn, ...rest].filter((k) => !bn.includes(k))
		)}.`
	};
}

/** A temperature read and taken to kelvin. */
interface Temp {
	x: Var;
	raw: Q;
	celsius: boolean;
	kelvin: Q;
}

function readTemp(x: Var, value: string | undefined, unitId: string | undefined): Temp | string {
	const raw = parseNumber(value ?? '');
	if (!raw) return `Scrivi ${x.the}, per esempio ${x.example} con °C.`;
	const celsius = unitId === 'C';
	const kelvin = celsius ? raw.add(ABS_ZERO) : raw;
	if (kelvin.sign() <= 0) return `${cap(x.the)} non può essere sotto lo zero assoluto: in kelvin deve essere maggiore di 0, in gradi Celsius maggiore di -273,15.`;
	return { x, raw, celsius, kelvin };
}

const kelvinLine = (t: Temp): string[] =>
	t.celsius ? [`${t.x.sym} = (${fmt(t.raw).tex} + 273{,}15)\\ \\text{K}`, `= \\hl{${fmt(t.kelvin).tex}\\ \\text{K}}`] : [`${t.x.sym} = \\hl{${fmt(t.kelvin).tex}\\ \\text{K}}`];

/** Values in the formula, with their units: "2\ \text{mol}". */
const T_BASE = unit('K', 'K', '\\text{K}');

export interface GasInput {
	[key: string]: string;
}

export function gas(state: GasInput): Outcome {
	return safely(() => {
		const law = lawOf(state.modo);
		const unknown = law.vars.find((x) => x.key === state.trova) ?? law.vars[law.vars.length - 1];
		const isPV = law.id === 'pvnrt';

		// The system of units: with the pressure in atm or mmHg, R in L·atm/(mol·K).
		const pUnits = law.vars.filter((x) => x.kind === 'p').map((x) => state[`u${x.key}`]);
		const system: 'si' | 'atm' = isPV && pUnits.some((u) => u === 'atm' || u === 'mmHg') ? 'atm' : 'si';

		// For the transformations, each kind is worked in the unit of its first known value.
		const commonUnit = (kind: Kind) => {
			const known = law.vars.find((x) => x.kind === kind && x !== unknown);
			return known ? (state[`u${known.key}`] ?? '') : '';
		};
		const qtOf = (x: Var): Quantity => {
			const base = quantityOf(x, system);
			if (isPV || x.kind === 'T') return base;
			const table = x.kind === 'p' ? P_PA : V_L;
			const id = table.some((t) => t[0] === commonUnit(x.kind)) ? commonUnit(x.kind) : table[x.kind === 'p' ? 0 : 1][0];
			return { ...base, units: unitsIn(table, id) };
		};

		// Read the known values.
		const data: Datum[] = [];
		const temps: Temp[] = [];
		const values: Record<string, Val> = {};
		for (const x of law.vars) {
			if (x === unknown) continue;
			if (x.kind === 'T') {
				const t = readTemp(x, state[x.key], state[`u${x.key}`]);
				if (typeof t === 'string') return fail(t);
				temps.push(t);
				values[x.key] = { q: t.kelvin, approx: false };
			} else {
				const d = readDatum(qtOf(x), state[x.key], state[`u${x.key}`]);
				if (typeof d === 'string') return fail(d);
				data.push(d);
				values[x.key] = d.base;
			}
		}
		const R = system === 'si' ? R_SI : R_ATM;
		const R_UNIT = system === 'si' ? R_UNIT_SI : R_UNIT_ATM;
		if (isPV) values.R = { q: R, approx: true };

		const steps: Tagged[] = [];
		const formula = law.tex.replace(new RegExp(`(^|[ {])${unknown.sym}(?=[ }]|$)`), `$1\\hl{${unknown.sym}}`);
		const symbolsQts = [
			...law.vars.map((x) => ({
				...qtOf(x),
				units: x.kind === 'T' ? [T_BASE] : qtOf(x).units
			})),
			...(isPV
				? [
						{
							key: 'R',
							sym: 'R',
							name: 'costante dei gas',
							the: 'la costante dei gas',
							units: [R_UNIT],
							sign: 'pos' as const,
							example: ''
						}
					]
				: [])
		];
		steps.push({
			say: 'Scrivi la formula.',
			math: [formula],
			table: symbolsTable(symbolsQts),
			then: law.note,
			part: 'La formula'
		});
		const sol = solveFor(law, unknown.key);
		const solTex = `\\hl{${unknown.sym}} = ${sol.den.length ? `\\dfrac{${prodSym(sol.num)}}{${prodSym(sol.den)}}` : prodSym(sol.num)}`;
		steps.push({
			say: `Ricava ${unknown.the} dalla formula.`,
			math: [solTex],
			then: sol.how
		});

		// The temperatures, always.
		if (temps.length)
			steps.push({
				say: temps.length > 1 ? 'Porta le temperature in kelvin.' : 'Porta la temperatura in kelvin.',
				math: temps.flatMap(kelvinLine),
				then: temps.some((t) => t.celsius) ? 'Nelle leggi dei gas la temperatura va sempre in kelvin: $T = t + 273{,}15$.' : 'La temperatura è già in kelvin, come vogliono le leggi dei gas.',
				part: 'I dati'
			});
		else if (unknown.kind === 'T') steps[1].then = `${sol.how} La temperatura che trovi è in kelvin.`;
		if (isPV)
			steps.push({
				say: 'Scegli il valore di $R$ adatto alle unità.',
				math: [`R = ${fmt(R).tex}\\ ${R_UNIT.tex}`],
				then: system === 'si' ? 'Con questo valore la pressione va in pascal e il volume in metri cubi.' : 'Con questo valore la pressione va in atmosfere e il volume in litri.',
				part: temps.length ? undefined : 'I dati'
			});
		const conv = unitsStep(data, isPV ? 'Porta i dati nelle unità di $R$.' : 'Scrivi i dati dello stesso tipo nella stessa unità.');
		if (conv) steps.push(conv);

		// The substitution.
		const unitTex = (key: string) => {
			if (key === 'R') return R_UNIT;
			const x = law.vars.find((y) => y.key === key)!;
			return x.kind === 'T' ? T_BASE : qtOf(x).units[0];
		};
		const term = (key: string) => vu(values[key], unitTex(key));
		const prod = (keys: string[]) => keys.map(term).join(' \\cdot ');
		const mulVals = (keys: string[]): Val => ({
			q: keys.reduce((a, k) => a.mul(values[k].q), q(1)),
			approx: keys.some((k) => values[k].approx)
		});
		const num = mulVals(sol.num);
		const den = mulVals(sol.den);
		if (den.q.isZero()) return fail('Con questi dati il calcolo non si può fare: controlla i valori.');
		const result: Val = {
			q: num.q.div(den.q),
			approx: num.approx || den.approx
		};
		const resultQt = unknown.kind === 'T' ? { ...quantityOf(unknown), units: [T_BASE] } : qtOf(unknown);
		const resultUnit = resultQt.units[0];
		const lines = [`${unknown.sym} = ${sol.den.length ? `\\dfrac{${prod(sol.num)}}{${prod(sol.den)}}` : prod(sol.num)}`];
		if (sol.num.length + sol.den.length > 2 && sol.den.length && !den.q.isOne()) {
			// The products are exact: only R is rounded.
			const [ne, de] = [fmt(num.q), fmt(den.q)];
			lines.push(`${ne.exact && de.exact ? '=' : '\\approx'} \\dfrac{${ne.tex}}{${de.tex}}\\ ${resultUnit.tex}`);
		}
		lines.push(`${rel(result)} \\hl{${vu(result, resultUnit)}}`);
		steps.push({
			say: 'Sostituisci i valori, con le loro unità.',
			math: lines,
			then: result.approx ? 'Il valore di $R$ è arrotondato: anche il risultato lo è.' : undefined,
			part: 'Il calcolo'
		});

		// The result in the unit asked for.
		let rows: ResultRow[];
		let copy: string;
		if (unknown.kind === 'T') {
			const target = state[`u${unknown.key}`] === 'C' ? 'C' : 'K';
			const kRow = {
				label: `${cap(unknown.name)} in kelvin`,
				value: `$${fmt(result).exact ? '' : '\\approx '}${vu(result, K)}$`
			};
			if (target === 'C') {
				const t: Val = { q: result.q.sub(ABS_ZERO), approx: result.approx };
				const tSym = unknown.sym.replace('T', 't');
				steps.push({
					say: 'Scrivi la temperatura in gradi Celsius.',
					math: [`${tSym} = ${fmt(result).tex} - 273{,}15`, `${rel(t)} \\hl{${fmt(t).tex}\\ ^\\circ\\text{C}}`],
					part: 'Il risultato'
				});
				rows = [
					{
						label: cap(unknown.name),
						value: `$${fmt(t).exact ? '' : '\\approx '}${fmt(t).tex}\\ ^\\circ\\text{C}$`
					},
					kRow
				];
				copy = `${fmt(t).text} °C`;
			} else {
				rows = [{ ...kRow, label: cap(unknown.name) }];
				copy = `${fmt(result).text} K`;
			}
		} else {
			const end = finish(resultQt, result, state[`u${unknown.key}`]);
			if (end.step) steps.push({ ...end.step, part: 'Il risultato' });
			rows = end.rows;
			copy = end.copy;
		}
		return { ok: true, rows, copy, steps: grouped(steps) };
	});
}
