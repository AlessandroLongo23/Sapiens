import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
import { decimal, parseDecimal } from './numbers';

/**
 * The "equivalenze" of the Italian school: a measure moved along the scale of the units of the SI. Every step of
 * the scale multiplies or divides by 10 (lengths, masses, capacities), 100 (areas) or 1000 (volumes), so the
 * answer is the same digits with the comma moved, computed exactly on the digits and never through floats. Time is
 * the exception, in base 60.
 */

export type Quantity = 'lunghezza' | 'massa' | 'capacita' | 'superficie' | 'volume' | 'tempo';

export interface MeasureUnit {
	id: string;
	/** As written in the select and in copied text: "km²". */
	text: string;
	/** Its name, for the select: "chilometro quadrato". */
	name: string;
	/** Place on the scale, in steps from the base unit (m, g, l, m², m³); for time, the value in seconds. */
	pos: number;
	/** A unit that takes the place of one on the scale: ha for hm², l for dm³. */
	alias?: string;
}

interface QuantityDef {
	name: string;
	/** Powers of ten per step of the scale: 1, 2 or 3. 0 for time. */
	per: number;
	units: MeasureUnit[];
	/** The units in order, largest first; an empty step is null (the 10 kg between q and kg). */
	scale: (string | null)[];
}

const u = (id: string, name: string, pos: number, alias?: string, text = id): MeasureUnit => ({ id, text, name, pos, alias });
const sq = (id: string, name: string, pos: number): MeasureUnit => u(`${id}2`, name, pos, undefined, `${id}²`);
const cu = (id: string, name: string, pos: number): MeasureUnit => u(`${id}3`, name, pos, undefined, `${id}³`);

export const QUANTITIES: Record<Quantity, QuantityDef> = {
	lunghezza: {
		name: 'lunghezza',
		per: 1,
		units: [u('km', 'chilometro', 3), u('hm', 'ettometro', 2), u('dam', 'decametro', 1), u('m', 'metro', 0), u('dm', 'decimetro', -1), u('cm', 'centimetro', -2), u('mm', 'millimetro', -3)],
		scale: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm']
	},
	massa: {
		name: 'massa',
		per: 1,
		units: [
			u('t', 'tonnellata', 6),
			u('q', 'quintale', 5),
			u('kg', 'chilogrammo', 3),
			u('hg', 'ettogrammo', 2),
			u('dag', 'decagrammo', 1),
			u('g', 'grammo', 0),
			u('dg', 'decigrammo', -1),
			u('cg', 'centigrammo', -2),
			u('mg', 'milligrammo', -3)
		],
		scale: ['t', 'q', null, 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg']
	},
	capacita: {
		name: 'capacità',
		per: 1,
		units: [u('kl', 'chilolitro', 3), u('hl', 'ettolitro', 2), u('dal', 'decalitro', 1), u('l', 'litro', 0), u('dl', 'decilitro', -1), u('cl', 'centilitro', -2), u('ml', 'millilitro', -3)],
		scale: ['kl', 'hl', 'dal', 'l', 'dl', 'cl', 'ml']
	},
	superficie: {
		name: 'superficie',
		per: 2,
		units: [
			sq('km', 'chilometro quadrato', 3),
			sq('hm', 'ettometro quadrato', 2),
			sq('dam', 'decametro quadrato', 1),
			sq('m', 'metro quadrato', 0),
			sq('dm', 'decimetro quadrato', -1),
			sq('cm', 'centimetro quadrato', -2),
			sq('mm', 'millimetro quadrato', -3),
			u('ha', 'ettaro', 2, 'hm2'),
			u('a', 'ara', 1, 'dam2'),
			u('ca', 'centiara', 0, 'm2')
		],
		scale: ['km2', 'hm2', 'dam2', 'm2', 'dm2', 'cm2', 'mm2']
	},
	volume: {
		name: 'volume',
		per: 3,
		units: [
			cu('km', 'chilometro cubo', 3),
			cu('hm', 'ettometro cubo', 2),
			cu('dam', 'decametro cubo', 1),
			cu('m', 'metro cubo', 0),
			cu('dm', 'decimetro cubo', -1),
			cu('cm', 'centimetro cubo', -2),
			cu('mm', 'millimetro cubo', -3),
			u('kl', 'chilolitro', 0, 'm3'),
			u('l', 'litro', -1, 'dm3'),
			u('ml', 'millilitro', -2, 'cm3')
		],
		scale: ['km3', 'hm3', 'dam3', 'm3', 'dm3', 'cm3', 'mm3']
	},
	tempo: {
		name: 'tempo',
		per: 0,
		units: [u('h', 'ora', 3600), u('min', 'minuto', 60), u('s', 'secondo', 1)],
		scale: ['h', 'min', 's']
	}
};

export const QUANTITY_IDS = Object.keys(QUANTITIES) as Quantity[];

/** The unit a quantity's converter opens with. */
export const DEFAULT_UNITS: Record<Quantity, [string, string]> = {
	lunghezza: ['km', 'm'],
	massa: ['kg', 'g'],
	capacita: ['l', 'ml'],
	superficie: ['m2', 'cm2'],
	volume: ['dm3', 'cm3'],
	tempo: ['h', 'min']
};

const unitOf = (qty: Quantity, id: string) => QUANTITIES[qty].units.find((x) => x.id === id);

/** A unit in LaTeX: "\text{km}^2". */
export function unitTex(unit: MeasureUnit): string {
	const m = /^(.*?)([²³])$/.exec(unit.text);
	return m ? `\\text{${m[1]}}^${m[2] === '²' ? 2 : 3}` : `\\text{${unit.text}}`;
}

/** A non-negative decimal as digits and a power of ten, value = m · 10^e, exact. */
export interface Scaled {
	m: bigint;
	e: number;
}

/** A rational read from a decimal ("3,5" = 7/2) back to its digits: 35 · 10^-1. */
export function toScaled(r: Rational): Scaled | null {
	const den = BigInt(r.den);
	for (let k = 0; k <= 20; k++) {
		const p = 10n ** BigInt(k);
		if (p % den === 0n) return { m: BigInt(Math.abs(r.num)) * (p / den), e: -k };
	}
	return null;
}

const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/** Digits beyond which a number is written with a power of ten: nobody reads 22 zeros. */
const MAX_PLAIN = 21;

/** m · 10^e as an Italian decimal, "3 500" and "0,0035", or "3,5 · 10^21" when it is very large or very small. */
export function formatScaled({ m, e }: Scaled): { text: string; tex: string } {
	if (m === 0n) return { text: '0', tex: '0' };
	let digits = m.toString();
	let exp = e;
	while (digits.length > 1 && digits.endsWith('0')) {
		digits = digits.slice(0, -1);
		exp++;
	}
	const intLength = digits.length + exp;
	if (intLength > MAX_PLAIN || intLength < -MAX_PLAIN + 2) {
		const power = intLength - 1;
		const mant = digits.length > 1 ? `${digits[0]},${digits.slice(1)}` : digits;
		const mantTex = mant.replace(',', '{,}');
		return { text: `${mant} · 10^${power}`, tex: `${mantTex} \\cdot 10^{${power}}` };
	}
	let int: string;
	let frac: string;
	if (exp >= 0) {
		int = digits + '0'.repeat(exp);
		frac = '';
	} else if (intLength > 0) {
		int = digits.slice(0, intLength);
		frac = digits.slice(intLength);
	} else {
		int = '0';
		frac = '0'.repeat(-intLength) + digits;
	}
	return {
		text: `${group(int, ' ')}${frac ? `,${frac}` : ''}`,
		tex: `${group(int, '\\,')}${frac ? `{,}${frac}` : ''}`
	};
}

/** The scale of a quantity in LaTeX, the two units in play boxed. */
function scaleTex(qty: Quantity, a: string, b: string): string {
	return QUANTITIES[qty].scale
		.map((id) => {
			if (!id) return '\\square';
			const t = unitTex(unitOf(qty, id)!);
			return id === a || id === b ? `\\boxed{${t}}` : t;
		})
		.join(' \\quad ');
}

const steps = (n: number) => (n === 1 ? '1 gradino' : `${n} gradini`);
const places = (n: number) => (n === 1 ? '1 posto' : `${n} posti`);
const powerTex = (k: number) => (k === 1 ? '10' : `10^{${k}} = ${group('1' + '0'.repeat(k), '\\,')}`);

export interface EquivalenzaInput {
	quantity: Quantity;
	value: string;
	from: string;
	to: string;
}

export function equivalenza({ quantity, value, from, to }: EquivalenzaInput): Outcome {
	const def = QUANTITIES[quantity];
	if (!def) return fail('Scegli una grandezza.');
	const a = unitOf(quantity, from);
	const b = unitOf(quantity, to);
	if (!a || !b) return fail('Scegli le due unità di misura.');
	const r = parseDecimal(value);
	if (!r) return fail('Scrivi una misura, per esempio 3,5; per i decimali usa la virgola.');
	if (r.sign() < 0) return fail('Una misura non può essere negativa: scrivi un numero positivo.');
	return quantity === 'tempo' ? time(r, a, b) : decimalScale(quantity, r, a, b);
}

function decimalScale(qty: Quantity, r: Rational, a: MeasureUnit, b: MeasureUnit): Outcome {
	const def = QUANTITIES[qty];
	const x = toScaled(r);
	if (!x) return fail('Scrivi la misura come numero decimale, per esempio 3,5.');
	const gradini = a.pos - b.pos;
	const shift = gradini * def.per;
	const y: Scaled = { m: x.m, e: x.e + shift };
	const xs = formatScaled(x);
	const ys = formatScaled(y);
	const ta = unitTex(a);
	const tb = unitTex(b);
	const result = `$${xs.tex}\\ ${ta} = ${ys.tex}\\ ${tb}$`;
	const copy = `${ys.text} ${b.text}`;

	const out: string[] = [];
	// Units that stand for one of the scale: ha, a, ca, kl, l, ml.
	const onScale = (x: MeasureUnit) => (x.alias ? unitOf(qty, x.alias)! : x);
	for (const x of a === b ? [a] : [a, b]) {
		if (x.alias) {
			const on = onScale(x);
			out.push(`Ricorda che $1\\ ${unitTex(x)} = 1\\ ${unitTex(on)}$: sulla scala usa $${unitTex(on)}$ al posto di $${unitTex(x)}$.`);
		}
	}
	const sa = onScale(a);
	const sb = onScale(b);
	const factor = def.per === 1 ? '10' : def.per === 2 ? '100' : '1000';
	out.push(`Scrivi la scala delle unità di ${def.name}, dalla più grande alla più piccola: $${scaleTex(qty, sa.id, sb.id)}$. Ogni unità vale ${factor} volte quella alla sua destra.`);
	if (qty === 'massa' && Math.min(a.pos, b.pos) < 4 && Math.max(a.pos, b.pos) > 4) {
		out.push('Il quadratino tra $\\text{q}$ e $\\text{kg}$ è un gradino senza nome, che vale 10 kg: contalo lo stesso.');
	}
	if (gradini === 0) {
		out.push(`Le due unità stanno allo stesso posto della scala: la misura non cambia, $${xs.tex}\\ ${ta} = ${ys.tex}\\ ${tb}$.`);
		return { ok: true, result, copy, steps: out };
	}
	const n = Math.abs(gradini);
	const down = gradini > 0;
	out.push(
		`Da $${unitTex(sa)}$ a $${unitTex(sb)}$ ci sono ${steps(n)} verso ${down ? 'destra' : 'sinistra'}: passi a un'unità più ${down ? 'piccola' : 'grande'}, quindi il numero diventa più ${down ? 'grande' : 'piccolo'}.`
	);
	const k = Math.abs(shift);
	const per = def.per === 1 ? '' : `, cioè sposta la virgola di ${places(def.per)}`;
	const verb = down ? 'moltiplica' : 'dividi';
	const Verb = down ? 'Moltiplica' : 'Dividi';
	out.push(
		n === 1
			? `${Verb} per ${factor}: sposta la virgola di ${places(k)} verso ${down ? 'destra' : 'sinistra'}${down ? ', aggiungendo degli zeri se mancano cifre' : ', aggiungendo degli zeri davanti se mancano cifre'}.`
			: `A ogni gradino ${verb} per ${factor}${per}. In tutto ${verb} per $${powerTex(k)}$: sposta la virgola di ${places(k)} verso ${down ? 'destra' : 'sinistra'}${down ? ', aggiungendo degli zeri se mancano cifre' : ', aggiungendo degli zeri davanti se mancano cifre'}.`
	);
	out.push(`Il risultato è $${xs.tex}\\ ${ta} = ${ys.tex}\\ ${tb}$.`);
	return { ok: true, result, copy, steps: out };
}

const DIGITS = 6;

/** A rational after "=": "= 2{,}5", or "\approx 0{,}000278" when rounded. */
function eqTex(r: Rational): string {
	const d = decimal(r, DIGITS);
	return d.exact ? `= ${d.tex}` : `\\approx ${d.tex}`;
}

function time(r: Rational, a: MeasureUnit, b: MeasureUnit): Outcome {
	let y: Rational;
	let seconds: Rational;
	try {
		seconds = r.mul(q(a.pos));
		y = seconds.div(q(b.pos));
	} catch {
		return fail('Il numero ha troppe cifre per questo calcolo.');
	}
	const x = decimal(r, DIGITS);
	const yd = decimal(y, DIGITS);
	const ta = unitTex(a);
	const tb = unitTex(b);
	const result = `$${x.tex}\\ ${ta} ${eqTex(y)}\\ ${tb}$`;
	const copy = `${yd.text} ${b.text}`;
	const out = ['Il tempo non si misura in base 10 ma in base 60: $1\\ \\text{h} = 60\\ \\text{min}$ e $1\\ \\text{min} = 60\\ \\text{s}$, quindi $1\\ \\text{h} = 3600\\ \\text{s}$.'];
	if (a === b) {
		out.push(`Le due unità sono uguali: la misura non cambia.`);
		return { ok: true, result, copy, steps: out };
	}
	const down = a.pos > b.pos;
	const f = down ? a.pos / b.pos : b.pos / a.pos;
	out.push(
		`Da $${ta}$ a $${tb}$ passi a un'unità più ${down ? 'piccola' : 'grande'}: ${down ? 'moltiplica' : 'dividi'} per ${f === 60 ? '60' : '$60 \\cdot 60 = 3600$'}.`
	);
	out.push(`Il risultato è $${x.tex} ${down ? '\\cdot' : ':'} ${f} ${eqTex(y)}$, cioè $${x.tex}\\ ${ta} ${eqTex(y)}\\ ${tb}$.`);
	if (b.id !== 's' && !y.isInteger()) {
		// Whole hours, minutes and seconds, the seconds rounded.
		const total = Math.round(seconds.num / seconds.den);
		const exact = seconds.isInteger();
		const h = Math.floor(total / 3600);
		const min = Math.floor((total % 3600) / 60);
		const s = total % 60;
		const parts = [
			...(b.id === 'h' && h ? [`${h}\\ \\text{h}`] : []),
			...((b.id === 'h' ? min : min + h * 60) ? [`${b.id === 'h' ? min : min + h * 60}\\ \\text{min}`] : []),
			...(s ? [`${s}\\ \\text{s}`] : [])
		];
		if (parts.length > 1 || (parts.length === 1 && !exact))
			out.push(`In ${b.id === 'h' ? 'ore, minuti e secondi' : 'minuti e secondi'}: moltiplica la parte decimale per 60 per avere l'unità più piccola, e ottieni $${x.tex}\\ ${ta} ${exact ? '=' : '\\approx'} ${parts.join('\\ ')}$.`);
	}
	return { ok: true, result, copy, steps: out };
}
