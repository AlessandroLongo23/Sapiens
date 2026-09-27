import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
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

/** A unit's name in the plural, word by word: "chilometro quadrato" → "chilometri quadrati", "ara" → "are". */
export function plural(name: string): string {
	return name
		.split(' ')
		.map((w) => (w.endsWith('a') ? `${w.slice(0, -1)}e` : w.endsWith('o') || w.endsWith('e') ? `${w.slice(0, -1)}i` : w))
		.join(' ');
}

/**
 * The scale of a quantity as a table: the units on the first row, the two in play highlighted; under each unit the
 * step crosses, the factor it takes (×10 going right, :10 going left). A table scrolls sideways on a phone, where a
 * line of units would wrap.
 */
function scaleTable(qty: Quantity, a: string, b: string): string[][] {
	const def = QUANTITIES[qty];
	const factor = def.per === 1 ? '10' : def.per === 2 ? '100' : '1000';
	const ia = def.scale.indexOf(a);
	const ib = def.scale.indexOf(b);
	const units = def.scale.map((id) => {
		if (!id) return '$\\square$';
		const t = unitTex(unitOf(qty, id)!);
		return id === a || id === b ? `$\\hl{${t}}$` : `$${t}$`;
	});
	const factors = def.scale.map((_, i) => {
		if (ia === ib) return '';
		const crossed = ib > ia ? i > ia && i <= ib : i < ia && i >= ib;
		return crossed ? `$${ib > ia ? '\\times' : ':'} ${factor}$` : '';
	});
	return ia === ib ? [units] : [units, factors];
}

const steps = (n: number) => (n === 1 ? '1 gradino' : `${n} gradini`);
const places = (n: number) => (n === 1 ? '1 posto' : `${n} posti`);
/** 10^k written out when it is short enough to read: "1000", "10\,000"; else "10^{12}". */
const powerTex = (k: number) => (k <= 9 ? group('1' + '0'.repeat(k), '\\,') : `10^{${k}}`);

export interface EquivalenzaInput {
	quantity: Quantity;
	value: string;
	from: string;
	to: string;
}

export function equivalenza({ quantity, value, from, to }: EquivalenzaInput): Outcome {
	const def = QUANTITIES[quantity];
	if (!def) return fail('Scegli una grandezza, per esempio lunghezza.');
	const a = unitOf(quantity, from);
	const b = unitOf(quantity, to);
	if (!a || !b) return fail('Scegli le due unità di misura, per esempio km e m.');
	const r = parseDecimal(value);
	if (!r) return fail('Scrivi una misura, per esempio 3,5. Per i decimali usa la virgola.');
	if (r.sign() < 0) return fail('Una misura non può essere negativa: scrivi un numero positivo, per esempio 3,5.');
	return quantity === 'tempo' ? time(r, a, b) : decimalScale(quantity, r, a, b);
}

/** Groups the steps when there are more than five: each name goes on the step with that index. */
function grouped(list: Step[], names: [number, string][]): Step[] {
	if (list.length <= 5) return list;
	return list.map((s, i) => {
		const name = names.find(([at]) => at === i)?.[1];
		return name ? { ...s, group: name } : s;
	});
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
	const rows = [{ label: `${xs.text} ${a.text} in ${plural(b.name)}`, value: `$${ys.tex}\\ ${tb}$` }];
	const copy = `${ys.text} ${b.text}`;

	const out: Step[] = [];
	// Units that stand for one of the scale: ha, a, ca, kl, l, ml.
	const onScale = (u: MeasureUnit) => (u.alias ? unitOf(qty, u.alias)! : u);
	for (const u of a === b ? [a] : [a, b]) {
		if (u.alias) {
			const on = onScale(u);
			out.push({ say: `Sulla scala usa $${unitTex(on)}$ al posto di $${unitTex(u)}$: sono uguali.`, math: [`1\\ ${unitTex(u)} = 1\\ ${unitTex(on)}`] });
		}
	}
	const sa = onScale(a);
	const sb = onScale(b);
	const factor = def.per === 1 ? '10' : def.per === 2 ? '100' : '1000';
	out.push({
		say: `Scrivi la scala delle unità di ${def.name}, dalla più grande alla più piccola.`,
		table: { rows: scaleTable(qty, sa.id, sb.id) },
		then: `Ogni unità vale ${factor} volte quella alla sua destra.`
	});
	if (qty === 'massa' && Math.min(a.pos, b.pos) < 4 && Math.max(a.pos, b.pos) > 4) {
		out.push({ say: 'Conta anche il quadratino tra $\\text{q}$ e $\\text{kg}$.', then: 'È un gradino senza nome, che vale $10\\ \\text{kg}$.' });
	}
	if (gradini === 0) {
		out.push({ say: 'Le due unità stanno allo stesso posto della scala: la misura non cambia.', math: [`${xs.tex}\\ ${ta} = \\hl{${ys.tex}\\ ${tb}}`] });
		return { ok: true, rows, copy, steps: out };
	}
	const n = Math.abs(gradini);
	const down = gradini > 0;
	const k = Math.abs(shift);
	const calcAt = out.length;
	out.push({
		say: `Conta i gradini da $${unitTex(sa)}$ a $${unitTex(sb)}$.`,
		then: `Sono ${steps(n)} verso ${down ? 'destra' : 'sinistra'}: l'unità diventa più ${down ? 'piccola' : 'grande'}, quindi il numero diventa più ${down ? 'grande' : 'piccolo'}.`
	});
	const Verb = down ? 'Moltiplica' : 'Dividi';
	if (n > 1) {
		const product = n <= 4 ? Array(n).fill(factor).join(' \\cdot ') : `${factor}^{${n}}`;
		out.push({
			say: `Ogni gradino vale ${factor}: calcola quanto valgono ${n} gradini insieme.`,
			math: [[...(product === `10^{${k}}` ? [] : [product]), k <= 9 ? `10^{${k}}` : `\\hl{10^{${k}}}`, ...(k <= 9 ? [`\\hl{${powerTex(k)}}`] : [])].join(' = ')]
		});
	}
	// Zeros to add: at the end when the comma moves right past the last digit, in front when it moves left past the first.
	const fracDigits = Math.max(0, -x.e);
	const intDigits = x.m === 0n ? 1 : x.m.toString().length + x.e;
	const zeros = x.m !== 0n && (down ? k > fracDigits : k >= intDigits);
	out.push({
		say: `${Verb} per $${powerTex(k)}$: sposta la virgola di ${places(k)} verso ${down ? 'destra' : 'sinistra'}.`,
		math: [`${xs.tex} ${down ? '\\cdot' : ':'} ${powerTex(k)} = ${ys.tex}`, `${xs.tex}\\ ${ta} = \\hl{${ys.tex}\\ ${tb}}`],
		then: zeros ? (down ? 'Dove mancano cifre, aggiungi degli zeri in fondo.' : 'Dove mancano cifre, aggiungi degli zeri davanti, con lo 0 prima della virgola.') : undefined
	});
	return {
		ok: true,
		rows,
		copy,
		steps: grouped(out, [
			[0, 'La scala'],
			[calcAt, 'Il calcolo']
		])
	};
}

const DIGITS = 6;

/** "=" before an exact value, "\approx" before a rounded one. */
const eqSign = (exact: boolean) => (exact ? '=' : '\\approx');

function time(r: Rational, a: MeasureUnit, b: MeasureUnit): Outcome {
	let y: Rational;
	let seconds: Rational;
	try {
		seconds = r.mul(q(a.pos));
		y = seconds.div(q(b.pos));
	} catch {
		return fail('Il numero ha troppe cifre per questo calcolo: scrivi una misura più corta, per esempio 2,5.');
	}
	const x = decimal(r, DIGITS);
	const yd = decimal(y, DIGITS);
	const ta = unitTex(a);
	const tb = unitTex(b);
	const rows = [{ label: `${x.text} ${a.text} in ${plural(b.name)}`, value: `$${yd.exact ? '' : '\\approx '}${yd.tex}\\ ${tb}$` }];
	const copy = `${yd.text} ${b.text}`;
	const out: Step[] = [{ say: 'Ricorda che il tempo si conta in base 60, non in base 10.', math: ['1\\ \\text{h} = 60\\ \\text{min}', '1\\ \\text{min} = 60\\ \\text{s}'] }];
	if (a === b) {
		out.push({ say: 'Le due unità sono uguali: la misura non cambia.', math: [`${x.tex}\\ ${ta} = \\hl{${yd.tex}\\ ${tb}}`] });
		return { ok: true, rows, copy, steps: out };
	}
	const down = a.pos > b.pos;
	const f = down ? a.pos / b.pos : b.pos / a.pos;
	out.push({
		say: `Passi a un'unità più ${down ? 'piccola' : 'grande'}: ${down ? 'moltiplica' : 'dividi'} per ${f}.`,
		math: [...(f === 3600 ? ['60 \\cdot 60 = 3600'] : []), `${x.tex} ${down ? '\\cdot' : ':'} ${f} ${eqSign(yd.exact)} ${yd.tex}`, `${x.tex}\\ ${ta} ${eqSign(yd.exact)} \\hl{${yd.tex}\\ ${tb}}`]
	});
	if (b.id !== 's' && !y.isInteger()) {
		// Whole hours, minutes and seconds: the decimal part times 60, twice at most, the seconds rounded.
		const whole = (v: Rational) => Math.floor(v.num / v.den);
		let h = b.id === 'h' ? whole(y) : 0;
		const minutes = b.id === 'h' ? y.sub(q(h)).mul(q(60)) : y;
		let min = whole(minutes);
		const secs = minutes.sub(q(min)).mul(q(60));
		let s = Math.round(secs.num / secs.den);
		const exact = secs.isInteger();
		if (s === 60) {
			s = 0;
			min++;
		}
		if (b.id === 'h' && min === 60) {
			min = 0;
			h++;
		}
		const parts = [...(h ? [`${h}\\ \\text{h}`] : []), ...(min ? [`${min}\\ \\text{min}`] : []), ...(s ? [`${s}\\ \\text{s}`] : [])];
		if (parts.length > 1 || (parts.length === 1 && !exact)) {
			const hFrac = decimal(y.sub(q(whole(y))), DIGITS);
			const mFrac = decimal(minutes.sub(q(whole(minutes))), DIGITS);
			const secsD = decimal(secs, 2);
			const split: Step[] = [];
			if (b.id === 'h' && !y.sub(q(whole(y))).isZero()) {
				const md = decimal(minutes, DIGITS);
				split.push({ say: 'Tieni le ore intere e moltiplica per 60 la parte decimale: sono i minuti.', math: [`${hFrac.tex} \\cdot 60 ${eqSign(hFrac.exact && md.exact)} \\hl{${md.tex}}`] });
			}
			if (!minutes.sub(q(whole(minutes))).isZero()) {
				split.push({
					say: `Tieni i minuti interi e moltiplica per 60 la parte decimale: sono i secondi.`,
					math: [`${mFrac.tex} \\cdot 60 ${eqSign(mFrac.exact && secsD.exact)} \\hl{${secsD.tex}}`],
					then: exact ? undefined : 'Arrotonda i secondi al numero intero più vicino.'
				});
			}
			const inWords = b.id === 'h' ? 'ore, minuti e secondi' : 'minuti e secondi';
			split.push({ say: `Scrivi la misura in ${inWords}.`, math: [`${x.tex}\\ ${ta} ${eqSign(exact)} \\hl{${parts.join('\\ ')}}`] });
			out.push(...split);
			rows.push({ label: `In ${inWords}`, value: `$${exact ? '' : '\\approx '}${parts.join('\\ ')}$` });
		}
	}
	return { ok: true, rows, copy, steps: out };
}
