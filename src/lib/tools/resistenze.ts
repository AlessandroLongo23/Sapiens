import { fail, type Outcome, type ResultRow } from './types';
import { Q, fmt, grouped, howTex, parseNumber, q, safely, unit, type Tagged, type Unit } from './grandezze';

/**
 * Resistors in series and in parallel: the equivalent resistance of a list of resistors, each with its unit (Ω, kΩ,
 * MΩ). In series the resistances add up; in parallel the inverses add up, done with exact fractions over their least
 * common denominator, as on paper. Two resistors in parallel can also go through the product over the sum.
 *
 * All values are brought to one unit first: the smallest unit the student used, and in parallel a smaller one when
 * a value would not be a whole number (4,7 kΩ and 10 kΩ are worked in Ω, 4700 and 10 000), so the fractions have
 * whole numbers in them.
 */

export const OHM = unit('ohm', 'Ω', '\\Omega');
export const KOHM = unit('kohm', 'kΩ', '\\text{k}\\Omega', q(1000));
export const MOHM = unit('Mohm', 'MΩ', '\\text{M}\\Omega', q(1_000_000));
export const RES_UNITS: Unit[] = [OHM, KOHM, MOHM];

export type Collegamento = 'serie' | 'parallelo';
export type Metodo = 'inversi' | 'prodotto';

export const MAX_RESISTORS = 10;

const findRes = (id: string | undefined) => RES_UNITS.find((u) => u.id === id) ?? OHM;
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
/** R₁, R₁₀: the name of a resistor in plain text. */
export const resName = (i: number) => `R${String(i + 1).replace(/\d/g, (d) => SUBS[Number(d)])}`;
const resSym = (i: number) => `R_{${i + 1}}`;

export interface Resistor {
	raw: Q;
	unit: Unit;
	/** In ohm. */
	ohm: Q;
}

/** The values and units as kept in the address: "220;4,7;1" and "ohm;kohm;Mohm". */
export function readResistors(values: string, units: string): Resistor[] | string {
	const vs = values.split(';');
	const us = units.split(';');
	if (vs.length < 2) return 'Servono almeno due resistenze: scrivi per esempio 220 e 330.';
	if (vs.length > MAX_RESISTORS) return `Al massimo ${MAX_RESISTORS} resistenze alla volta.`;
	const out: Resistor[] = [];
	for (let i = 0; i < vs.length; i++) {
		const raw = parseNumber(vs[i]);
		if (!raw) return `Scrivi il valore di ${resName(i)}, per esempio 330.`;
		if (raw.sign() <= 0) return `${resName(i)} deve essere maggiore di zero: scrivi per esempio 330.`;
		const u = findRes(us[i]);
		const ohm = raw.mul(u.factor);
		if (ohm.cmp(q(10n ** 12n)) > 0) return `${resName(i)} è troppo grande: al massimo un milione di MΩ.`;
		if (ohm.cmp(q(1, 1000)) < 0) return `${resName(i)} è troppo piccola: almeno 0,001 Ω.`;
		out.push({ raw, unit: u, ohm });
	}
	return out;
}

const isInt = (x: Q) => x.d === 1n;
const groupBig = (n: bigint) => {
	const s = (n < 0n ? -n : n).toString();
	const body = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
	return n < 0n ? `-${body}` : body;
};
/** A number: whole numbers in full (1\,004\,920, never 1{,}005 \cdot 10^6), the others as fmt writes them. */
const numTex = (x: Q) => (isInt(x) ? groupBig(x.n) : fmt(x).tex);
const numText = (x: Q) => (isInt(x) ? groupBig(x.n).replace(/\\,/g, ' ') : fmt(x).text);
const isExact = (x: Q) => isInt(x) || fmt(x).exact;
/** "=" or "≈" before a value. */
const eq = (x: Q) => (isExact(x) ? '=' : '\\approx');
/** A value in a unit, in a formula: "4{,}7\ \text{k}\Omega". */
const val = (x: Q, u: Unit) => `${numTex(x)}\\ ${u.tex}`;
/** A fraction of whole numbers, or the number when the denominator is 1. */
const fracTex = (x: Q, unitTex = '') => {
	const u = unitTex ? `\\ ${unitTex}` : '';
	return x.d === 1n ? `${groupBig(x.n)}${u}` : `\\dfrac{${groupBig(x.n)}}{${groupBig(x.d)}${u}}`;
};

/** The unit a value reads best in: MΩ from a million ohm, kΩ from a thousand. */
export function niceUnit(ohm: Q): Unit {
	if (ohm.cmp(q(1_000_000)) >= 0) return MOHM;
	if (ohm.cmp(q(1000)) >= 0) return KOHM;
	return OHM;
}

/** A resistance in its best unit, and "≈" when rounded: "4{,}7\ \text{k}\Omega". */
export function ohmTex(ohm: Q): { tex: string; text: string; exact: boolean } {
	const u = niceUnit(ohm);
	const x = ohm.div(u.factor);
	return {
		tex: `${numTex(x)}\\ ${u.tex}`,
		text: `${numText(x)} ${u.label}`,
		exact: isExact(x)
	};
}

/** The unit the calculation is done in: the smallest one used, smaller still in parallel when a value is not whole. */
function workUnit(rs: Resistor[], wholeNumbers: boolean): Unit {
	let i = Math.min(...rs.map((r) => RES_UNITS.indexOf(r.unit)));
	while (wholeNumbers && i > 0 && !rs.every((r) => isInt(r.ohm.div(RES_UNITS[i].factor)))) i--;
	return RES_UNITS[i];
}

export interface ResistenzeInput {
	modo: string;
	/** Values separated by semicolons. */
	r: string;
	/** Unit ids separated by semicolons. */
	u: string;
	/** For two resistors in parallel. */
	metodo?: string;
}

function lcm(a: bigint, b: bigint): bigint {
	let [x, y] = [a, b];
	while (y) [x, y] = [y, x % y];
	return (a / x) * b;
}

export function resistenze(input: ResistenzeInput): Outcome {
	return safely(() => {
		const rs = readResistors(input.r, input.u);
		if (typeof rs === 'string') return fail(rs);
		const parallel = input.modo === 'parallelo';
		const product = parallel && rs.length === 2 && input.metodo !== 'inversi';
		const U = workUnit(rs, parallel);
		const xs = rs.map((r) => r.ohm.div(U.factor));
		const steps: Tagged[] = [];
		const syms = rs.map((_, i) => resSym(i));

		// The formula.
		if (!parallel)
			steps.push({
				say: 'Scrivi la formula delle resistenze in serie.',
				math: [`R_{eq} = ${syms.join(' + ')}`],
				then: 'In serie le resistenze si sommano.',
				part: 'La formula'
			});
		else if (product)
			steps.push({
				say: 'Per due resistenze in parallelo usa il prodotto diviso la somma.',
				math: [`R_{eq} = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2}`],
				part: 'La formula'
			});
		else
			steps.push({
				say: 'Scrivi la formula delle resistenze in parallelo.',
				math: [`\\dfrac{1}{R_{eq}} = ${syms.map((s) => `\\dfrac{1}{${s}}`).join(' + ')}`],
				then: 'In parallelo si sommano gli inversi delle resistenze.',
				part: 'La formula'
			});

		// The data in one unit.
		const moved = rs.map((r, i) => ({ r, i })).filter(({ r }) => r.unit !== U);
		if (moved.length)
			steps.push({
				say: `Scrivi tutte le resistenze in ${U.label}.`,
				table: {
					head: ['Resistenza', 'Dato', 'Come', `In ${U.label}`],
					rows: moved.map(({ r, i }) => [`$${syms[i]}$`, `$${val(r.raw, r.unit)}$`, `$${howTex(r.unit.factor.div(U.factor))}$`, `$${val(xs[i], U)}$`])
				},
				part: 'I dati'
			});

		let result: Q;
		if (!parallel) {
			result = xs.reduce((a, b) => a.add(b), q(0));
			steps.push({
				say: 'Sostituisci i valori e somma.',
				math: [`R_{eq} = ${xs.map((x) => val(x, U)).join(' + ')}`, `${eq(result)} \\hl{${val(result, U)}}`],
				part: 'Il calcolo'
			});
		} else if (product) {
			const prod = xs[0].mul(xs[1]);
			const sum = xs[0].add(xs[1]);
			result = prod.div(sum);
			const exactFrac = !isExact(result) && isInt(prod) && isInt(sum);
			steps.push({
				say: 'Sostituisci i valori, con le loro unità.',
				math: [
					`R_{eq} = \\dfrac{${val(xs[0], U)} \\cdot ${val(xs[1], U)}}{${val(xs[0], U)} + ${val(xs[1], U)}}`,
					`= \\dfrac{${numTex(prod)}\\ ${U === OHM ? '\\Omega^2' : `(${U.tex})^2`}}{${numTex(sum)}\\ ${U.tex}}`,
					...(exactFrac && (result.n !== prod.n || result.d !== sum.d) ? [`= ${fracTex(result)}\\ ${U.tex}`] : []),
					`${eq(result)} \\hl{${val(result, U)}}`
				],
				part: 'Il calcolo'
			});
		} else {
			const inv = xs.map((x) => q(1).div(x));
			const sum = inv.reduce((a, b) => a.add(b), q(0));
			result = q(1).div(sum);
			const uTex = U.tex;
			steps.push({
				say: 'Sostituisci i valori.',
				math: [`\\dfrac{1}{R_{eq}} = ${xs.map((x) => `\\dfrac{1}{${val(x, U)}}`).join(' + ')}`],
				part: 'La somma degli inversi'
			});
			const den = inv.reduce((a, x) => lcm(a, x.d), 1n);
			const allWhole = xs.every(isInt);
			if (den.toString().length <= 12 && inv.some((x) => x.d !== den)) {
				const nums = inv.map((x) => x.n * (den / x.d));
				steps.push({
					say: 'Scrivi le frazioni con lo stesso denominatore.',
					math: [
						`\\dfrac{1}{R_{eq}} = ${nums.map((n) => `\\dfrac{${groupBig(n)}}{${groupBig(den)}\\ ${uTex}}`).join(' + ')}`,
						`= \\dfrac{${nums.map(groupBig).join(' + ')}}{${groupBig(den)}\\ ${uTex}}`,
						`= \\dfrac{${groupBig(nums.reduce((a, b) => a + b, 0n))}}{${groupBig(den)}\\ ${uTex}}`
					],
					then: allWhole ? `Il denominatore comune è il mcm dei denominatori: $${groupBig(den)}$.` : undefined
				});
				const total = nums.reduce((a, b) => a + b, 0n);
				if (total !== sum.n)
					steps.push({
						say: 'Semplifica la frazione.',
						math: [`\\dfrac{1}{R_{eq}} = ${fracTex(sum, uTex)}`]
					});
			} else if (inv.length > 1) {
				steps.push({
					say: 'Somma le frazioni.',
					math: [`\\dfrac{1}{R_{eq}} = ${sum.d === 1n ? `${groupBig(sum.n)}\\ ${uTex}^{-1}` : fracTex(sum, uTex)}`]
				});
			}
			const flipped = sum.d === 1n ? `\\dfrac{1}{${groupBig(sum.n)}}\\ ${uTex}` : `${fracTex(result)}\\ ${uTex}`;
			const lines = [`R_{eq} = ${flipped}`];
			if (!(result.d === 1n && sum.n === 1n)) lines.push(`${eq(result)} \\hl{${val(result, U)}}`);
			else lines[0] = `R_{eq} = \\hl{${val(result, U)}}`;
			steps.push({
				say: 'Capovolgi la frazione: trovi $R_{eq}$.',
				math: lines,
				part: 'Il risultato'
			});
		}

		const ohm = result.mul(U.factor);
		const best = niceUnit(ohm);
		const smallest = rs.reduce((m, r) => (r.ohm.cmp(m.ohm) < 0 ? r : m));
		const largest = rs.reduce((m, r) => (r.ohm.cmp(m.ohm) > 0 ? r : m));
		if (best !== U) {
			const inBest = ohm.div(best.factor);
			steps.push({
				say: `Scrivi il risultato in ${best.label}.`,
				math: [`R_{eq} ${eq(result)} ${val(result, U)}`, `${eq(inBest)} \\hl{${val(inBest, best)}}`]
			});
		}
		const last = steps[steps.length - 1];
		last.then = parallel
			? `La resistenza equivalente è minore della più piccola, $${val(smallest.raw, smallest.unit)}$.`
			: `La resistenza equivalente è maggiore della più grande, $${val(largest.raw, largest.unit)}$.`;

		const shown = ohmTex(ohm);
		const approx = shown.exact ? '' : '\\approx ';
		// A fraction that does not end is shown exact too, when it is short: 31 020/301 Ω ≈ 103,06 Ω.
		const exactPart = !shown.exact && !isExact(result) && result.n.toString().length + result.d.toString().length <= 12 ? `${fracTex(result)}\\ ${U.tex} ` : '';
		const rows: ResultRow[] = [
			{
				label: `Resistenza equivalente ${parallel ? 'in parallelo' : 'in serie'}`,
				value: `$${exactPart}${approx}${shown.tex}$`
			}
		];
		if (best !== OHM)
			rows.push({
				label: 'In ohm',
				value: `$${isExact(ohm) ? '' : '\\approx '}${numTex(ohm)}\\ \\Omega$`
			});
		return { ok: true, rows, copy: shown.text, steps: grouped(steps) };
	});
}

/** For the drawing: a resistor's value as a short label, "4,7 kΩ", or empty when it is not a positive number. */
export function resistorLabel(value: string, unitId: string): string {
	const raw = parseNumber(value);
	if (!raw || raw.sign() <= 0) return '';
	return `${numText(raw)} ${findRes(unitId).label}`;
}
