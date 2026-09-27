import { fail, type Outcome, type ResultRow, type Step } from './types';
import { parseDecimal } from './numbers';

/**
 * Unit conversions by a factor: speed, energy, power, pressure, and inches with centimetres. Each unit is defined
 * from another by an exact factor (1 in = 2,54 cm, 1 CV = 735,49875 W, 1 cal = 4,184 J, 1 atm = 101 325 Pa,
 * 1 eV = 1,602176634 · 10⁻¹⁹ J), so the units of a quantity form a tree around one unit, the hub. A conversion is
 * one multiplication or division by "how much one unit is worth in the other", when that factor is a short exact
 * decimal; otherwise it goes along the tree through units where it is (kWh → J → eV). The arithmetic is exact, on
 * big-integer fractions: the eV and the horsepower do not fit in the safe integers of `Rational`.
 */

/** A positive or zero fraction of big integers, always reduced. */
class Big {
	readonly n: bigint;
	readonly d: bigint;
	constructor(n: bigint, d = 1n) {
		if (d === 0n) throw new Error('Big: division by zero');
		if (d < 0n) {
			n = -n;
			d = -d;
		}
		const g = gcd(n < 0n ? -n : n, d);
		this.n = g ? n / g : n;
		this.d = g ? d / g : d;
	}
	mul(o: Big) {
		return new Big(this.n * o.n, this.d * o.d);
	}
	div(o: Big) {
		return new Big(this.n * o.d, this.d * o.n);
	}
	inv() {
		return new Big(this.d, this.n);
	}
	cmp(o: Big) {
		const a = this.n * o.d;
		const b = o.n * this.d;
		return a === b ? 0 : a > b ? 1 : -1;
	}
	isZero() {
		return this.n === 0n;
	}
	toNumber() {
		return Number(this.n) / Number(this.d);
	}
}

function gcd(a: bigint, b: bigint): bigint {
	while (b) [a, b] = [b, a % b];
	return a;
}

/** "735.49875", "1.602176634e-19", "1/760" → an exact fraction. */
function big(s: string): Big {
	if (s.includes('/')) {
		const [a, b] = s.split('/');
		return big(a).div(big(b));
	}
	const m = /^(\d+)(?:\.(\d+))?(?:e(-?\d+))?$/.exec(s);
	if (!m) throw new Error(`big: ${s}`);
	const [, int, frac = '', exp = '0'] = m;
	const e = Number(exp) - frac.length;
	const digits = BigInt(int + frac);
	return e >= 0 ? new Big(digits * 10n ** BigInt(e)) : new Big(digits, 10n ** BigInt(-e));
}

/* ---------------------------------------------------------------- numbers */

/** 10^E ≤ r < 10^(E+1), for r > 0. */
function magnitude(r: Big): number {
	let e = r.n.toString().length - r.d.toString().length;
	const atLeast = (k: number) => (k >= 0 ? r.n >= r.d * 10n ** BigInt(k) : r.n * 10n ** BigInt(-k) >= r.d);
	while (!atLeast(e)) e--;
	while (atLeast(e + 1)) e++;
	return e;
}

/** The exact decimal digits of r as m · 10^e, or null when the expansion does not end. */
function digitsOf(r: Big): { m: bigint; e: number } | null {
	let d = r.d;
	let twos = 0;
	let fives = 0;
	while (d % 2n === 0n) {
		d /= 2n;
		twos++;
	}
	while (d % 5n === 0n) {
		d /= 5n;
		fives++;
	}
	if (d !== 1n) return null;
	const k = Math.max(twos, fives);
	let m = (r.n * 10n ** BigInt(k)) / r.d;
	let e = -k;
	while (m !== 0n && m % 10n === 0n) {
		m /= 10n;
		e++;
	}
	return { m, e };
}

/** r rounded half up to `decimals` decimal places, as m · 10^-decimals. */
function roundTo(r: Big, decimals: number): { m: bigint; e: number } {
	const scale = decimals >= 0 ? 10n ** BigInt(decimals) : 1n;
	const down = decimals < 0 ? 10n ** BigInt(-decimals) : 1n;
	const m = (r.n * scale * 2n + r.d * down) / (2n * r.d * down);
	return { m, e: -decimals };
}

const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/** m · 10^e written out: "12 500", "0,0254". */
function plain(m: bigint, e: number): { text: string; tex: string } {
	let digits = m.toString();
	while (e < 0 && digits.length > 1 && digits.endsWith('0')) {
		digits = digits.slice(0, -1);
		e++;
	}
	if (m === 0n) return { text: '0', tex: '0' };
	let int: string;
	let frac = '';
	if (e >= 0) int = digits + '0'.repeat(e);
	else if (digits.length > -e) {
		int = digits.slice(0, digits.length + e);
		frac = digits.slice(digits.length + e);
	} else {
		int = '0';
		frac = '0'.repeat(-e - digits.length) + digits;
	}
	frac = frac.replace(/0+$/, '');
	return { text: `${group(int, ' ')}${frac ? `,${frac}` : ''}`, tex: `${group(int, '\\,')}${frac ? `{,}${frac}` : ''}` };
}

const SUPERSCRIPT: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

/** A mantissa of digits and a power of ten: "6,2415 · 10¹⁸" in text, for labels and copying. */
function scientific(digits: string, power: number): { text: string; tex: string } {
	const trimmed = digits.replace(/0+$/, '') || '0';
	const mant = trimmed.length > 1 ? `${trimmed[0]},${trimmed.slice(1)}` : trimmed;
	const sup = String(power).replace(/./g, (c) => SUPERSCRIPT[c] ?? c);
	return { text: `${mant} · 10${sup}`, tex: `${mant.replace(',', '{,}')} \\cdot 10^{${power}}` };
}

export interface Shown {
	text: string;
	tex: string;
	/** False when the number is rounded. */
	exact: boolean;
	/** True when it is written with a power of ten. */
	sci: boolean;
}

/** Written out between these powers of ten, with a power of ten outside them. */
const PLAIN_MIN = -6;
const PLAIN_MAX = 12;

/**
 * A number as the tools show it. Exact when its decimal ends within `maxSig` significant digits; else rounded: a
 * result to hundredths, with at least four significant digits (27,78; 1,36; 0,0002778), a factor to seven
 * significant digits (745,6999). Very large and very small numbers get a power of ten (6,2415 · 10¹⁸).
 */
function show(r: Big, kind: 'result' | 'factor' | 'input' = 'result'): Shown {
	if (r.isZero()) return { text: '0', tex: '0', exact: true, sci: false };
	const maxSig = kind === 'input' ? 30 : 12;
	const E = magnitude(r);
	const inRange = E >= PLAIN_MIN && E < PLAIN_MAX;
	const ex = digitsOf(r);
	if (ex && ex.m.toString().length <= maxSig) {
		if (inRange) return { ...plain(ex.m, ex.e), exact: true, sci: false };
		return { ...scientific(ex.m.toString(), E), exact: true, sci: true };
	}
	if (inRange) {
		const decimals = kind === 'factor' ? Math.max(0, 6 - E) : Math.max(2, 3 - E);
		const { m, e } = roundTo(r, decimals);
		return { ...plain(m, e), exact: false, sci: false };
	}
	const sig = kind === 'factor' ? 6 : 4;
	let { m } = roundTo(r.div(E >= 0 ? new Big(10n ** BigInt(E)) : new Big(1n, 10n ** BigInt(-E))), sig);
	let power = E;
	if (m.toString().length > sig + 1) {
		m /= 10n;
		power++;
	}
	return { ...scientific(m.toString(), power), exact: false, sci: true };
}

/** A number as the right operand of a product or a quotient: in brackets when it has a power of ten. */
const operand = (s: Shown) => (s.sci ? `(${s.tex})` : s.tex);
const eqSign = (exact: boolean) => (exact ? '=' : '\\approx');

/* ---------------------------------------------------------------- units */

export type ConvQuantity = 'velocita' | 'energia' | 'potenza' | 'pressione' | 'lunghezza';

export interface ConvUnit {
	id: string;
	/** As in the select and in copied text: "km/h". */
	text: string;
	/** "chilometro orario". */
	name: string;
	/** For the result label: "chilometri orari". */
	plural: string;
	/** The unit it is defined from, and how many of those one of it is worth. The hub has neither. */
	ref?: string;
	per?: string;
	/** Where the factor comes from, one or two sentences. */
	why?: string;
}

interface QuantityDef {
	name: string;
	hub: string;
	units: ConvUnit[];
}

const unit = (id: string, name: string, plural: string, ref?: string, per?: string, why?: string, text = id): ConvUnit => ({ id, text, name, plural, ref, per, why });

export const CONV_QUANTITIES: Record<ConvQuantity, QuantityDef> = {
	velocita: {
		name: 'velocità',
		hub: 'km/h',
		units: [
			unit('km/h', 'chilometri orari', 'chilometri orari'),
			unit('m/s', 'metri al secondo', 'metri al secondo', 'km/h', '3.6', "Un metro al secondo in un'ora fa $3600$ metri, cioè $3{,}6$ chilometri."),
			unit('kn', 'nodi', 'nodi', 'km/h', '1.852', "Un nodo è un miglio marino all'ora, e il miglio marino è lungo esattamente $1852$ metri."),
			unit('mph', 'miglia orarie', 'miglia orarie', 'km/h', '1.609344', 'Il miglio terrestre, usato negli Stati Uniti e nel Regno Unito, è lungo esattamente $1609{,}344$ metri.')
		]
	},
	energia: {
		name: 'energia',
		hub: 'J',
		units: [
			unit('J', 'joule', 'joule'),
			unit('kJ', 'kilojoule', 'kilojoule', 'J', '1000', 'Il prefisso kilo vuol dire mille.'),
			unit('cal', 'calorie', 'calorie', 'J', '4.184', 'La caloria vale esattamente $4{,}184$ joule, per definizione.'),
			unit('kcal', 'kilocalorie', 'kilocalorie', 'cal', '1000', 'Una kilocaloria, la «caloria» delle etichette dei cibi, vale mille calorie.'),
			unit('Wh', 'wattora', 'wattora', 'J', '3600', "Un wattora è l'energia di un watt per un'ora, cioè per $3600$ secondi."),
			unit('kWh', 'kilowattora', 'kilowattora', 'Wh', '1000', 'Il prefisso kilo vuol dire mille.'),
			unit('eV', 'elettronvolt', 'elettronvolt', 'J', '1.602176634e-19', "L'elettronvolt vale esattamente $1{,}602176634 \\cdot 10^{-19}$ joule, per definizione.")
		]
	},
	potenza: {
		name: 'potenza',
		hub: 'W',
		units: [
			unit('W', 'watt', 'watt'),
			unit('kW', 'kilowatt', 'kilowatt', 'W', '1000', 'Il prefisso kilo vuol dire mille.'),
			unit('CV', 'cavalli vapore', 'cavalli vapore', 'W', '735.49875', 'Il cavallo vapore metrico, quello dei libretti delle auto italiane, vale esattamente $735{,}49875$ watt.'),
			unit('HP', 'cavalli britannici', 'cavalli britannici (HP)', 'W', '745.69987158227022', 'Il cavallo britannico (HP, horsepower) vale circa $745{,}7$ watt, poco più del cavallo vapore.')
		]
	},
	pressione: {
		name: 'pressione',
		hub: 'Pa',
		units: [
			unit('Pa', 'pascal', 'pascal'),
			unit('hPa', 'ettopascal', 'ettopascal', 'Pa', '100', 'Il prefisso etto vuol dire cento.'),
			unit('mbar', 'millibar', 'millibar', 'hPa', '1', 'Un millibar è uguale a un ettopascal.'),
			unit('bar', 'bar', 'bar', 'Pa', '100000', 'Un bar vale centomila pascal, per definizione.'),
			unit('atm', 'atmosfere', 'atmosfere', 'Pa', '101325', "L'atmosfera standard vale esattamente $101\\,325$ pascal, per definizione."),
			unit('mmHg', 'millimetri di mercurio', 'millimetri di mercurio', 'atm', '1/760', "Un'atmosfera sostiene una colonna di mercurio alta $760$ millimetri."),
			unit('psi', 'libbre per pollice quadrato', 'psi', 'Pa', '4.4482216152605/0.00064516', 'Un psi è una libbra-forza su un pollice quadrato: vale circa $6894{,}757$ pascal.')
		]
	},
	lunghezza: {
		name: 'lunghezza',
		hub: 'cm',
		units: [
			unit('in', 'pollici', 'pollici', 'cm', '2.54', 'Il pollice vale esattamente $2{,}54$ centimetri, per definizione.'),
			unit('ft', 'piedi', 'piedi', 'in', '12', 'Un piede è lungo $12$ pollici.'),
			unit('cm', 'centimetri', 'centimetri'),
			unit('mm', 'millimetri', 'millimetri', 'cm', '0.1', 'Un centimetro è $10$ millimetri.'),
			unit('m', 'metri', 'metri', 'cm', '100', 'Un metro è $100$ centimetri.')
		]
	}
};

export const CONV_QUANTITY_IDS = Object.keys(CONV_QUANTITIES) as ConvQuantity[];

const unitTex = (u: ConvUnit) => `\\text{${u.text}}`;

/** The value of one unit in the hub, exact. */
function inHub(qty: ConvQuantity, u: ConvUnit): Big {
	if (!u.ref) return new Big(1n);
	return big(u.per!).mul(inHub(qty, findUnit(qty, u.ref)!));
}

const findUnit = (qty: ConvQuantity, id: string) => CONV_QUANTITIES[qty]?.units.find((u) => u.id === id);

/** The unit and its ancestors, up to the hub. */
function ancestry(qty: ConvQuantity, u: ConvUnit): ConvUnit[] {
	const out = [u];
	while (out[out.length - 1].ref) out.push(findUnit(qty, out[out.length - 1].ref!)!);
	return out;
}

/** The path between two units along the tree. */
function treePath(qty: ConvQuantity, a: ConvUnit, b: ConvUnit): ConvUnit[] {
	const up = ancestry(qty, a);
	const down = ancestry(qty, b);
	const lca = up.find((u) => down.includes(u))!;
	return [...up.slice(0, up.indexOf(lca) + 1), ...down.slice(0, down.indexOf(lca)).reverse()];
}

/** A factor worth writing as it is: an exact decimal of at most 12 significant digits. */
function nice(r: Big): boolean {
	const d = digitsOf(r);
	return !!d && d.m.toString().length <= 12;
}

/** How one step of the conversion is stated: "1 P = f Q", with f exact when it can be. */
interface Hop {
	from: ConvUnit;
	to: ConvUnit;
	/** The unit stated as worth f of the other. */
	p: ConvUnit;
	q: ConvUnit;
	f: Big;
}

function hop(qty: ConvQuantity, from: ConvUnit, to: ConvUnit): Hop {
	const k = inHub(qty, from).div(inHub(qty, to));
	const options: Hop[] = [
		{ from, to, p: from, q: to, f: k },
		{ from, to, p: to, q: from, f: k.inv() }
	];
	const good = options.filter((o) => nice(o.f));
	const pick = (list: Hop[]) => list.find((o) => o.f.cmp(new Big(1n)) >= 0) ?? list[0];
	return good.length ? pick(good) : pick(options);
}

/** The hops from a to b: one when the direct factor is exact and short, else along the tree through such units. */
/**
 * A hop worth taking: one unit defined from the other, or an exact short factor written without a power of ten.
 * 1 eV = 4,45049065 · 10⁻²⁶ kWh is exact, but a student would go through the joule.
 */
function usable(qty: ConvQuantity, h: Hop): boolean {
	const edge = h.p.ref === h.q.id || h.q.ref === h.p.id;
	if (!nice(h.f)) return false;
	if (edge) return true;
	const e = magnitude(h.f);
	return e >= PLAIN_MIN && e < PLAIN_MAX;
}

function route(qty: ConvQuantity, a: ConvUnit, b: ConvUnit): Hop[] {
	const direct = hop(qty, a, b);
	if (usable(qty, direct)) return [direct];
	const path = treePath(qty, a, b);
	const hops: Hop[] = [];
	let i = 0;
	while (i < path.length - 1) {
		let j = path.length - 1;
		while (j > i && !usable(qty, hop(qty, path[i], path[j]))) j--;
		// A factor that is never exact (psi, HP): one approximate step is clearer than a detour.
		if (j === i) return [direct];
		hops.push(hop(qty, path[i], path[j]));
		i = j;
	}
	return hops;
}

/* ---------------------------------------------------------------- steps */

/** "1 CV = 735,49875 W = 0,73549875 kW", through the unit both are defined from when that is neither of them. */
function statement(qty: ConvQuantity, h: Hop): string {
	const f = show(h.f, 'factor');
	const path = treePath(qty, h.p, h.q);
	const upP = ancestry(qty, h.p);
	const lca = path.find((u) => upP.includes(u) && ancestry(qty, h.q).includes(u))!;
	let middle = '';
	if (lca !== h.p && lca !== h.q) {
		const v = inHub(qty, h.p).div(inHub(qty, lca));
		if (nice(v)) middle = ` = ${show(v, 'factor').tex}\\ ${unitTex(lca)}`;
	}
	return `1\\ ${unitTex(h.p)}${middle} ${eqSign(f.exact)} \\hl{${f.tex}}\\ ${unitTex(h.q)}`;
}

/** Where the factor comes from: the definitions of the units between P and Q. */
function origin(qty: ConvQuantity, h: Hop): string {
	const path = treePath(qty, h.p, h.q);
	const upP = ancestry(qty, h.p);
	const upQ = ancestry(qty, h.q);
	const lca = path.find((u) => upP.includes(u) && upQ.includes(u))!;
	const seen = new Set<string>();
	return path
		.filter((u) => u !== lca && u.why)
		.map((u) => u.why!)
		.filter((w) => (seen.has(w) ? false : (seen.add(w), true)))
		.join(' ');
}

function hopSteps(qty: ConvQuantity, h: Hop, x: Big, xShown: Shown, last: boolean): { steps: Step[]; y: Big; yShown: Shown } {
	const f = show(h.f, 'factor');
	const times = h.p === h.from;
	const y = times ? x.mul(h.f) : x.div(h.f);
	const yShown = show(y);
	const exact = xShown.exact && f.exact && yShown.exact;
	const bigger = inHub(qty, h.to).cmp(inHub(qty, h.from)) > 0;
	const why = origin(qty, h);
	const steps: Step[] = [
		{
			say: `Scrivi quanto vale $1\\ ${unitTex(h.p)}$ in $${unitTex(h.q)}$.`,
			math: [statement(qty, h)],
			then: why || undefined
		},
		{
			say: `Da $${unitTex(h.from)}$ a $${unitTex(h.to)}$: ${times ? 'moltiplica' : 'dividi'} per $${f.tex}$.`,
			math: [
				`${xShown.tex} ${times ? '\\cdot' : ':'} ${operand(f)} ${eqSign(exact)} ${yShown.tex}`,
				`${xShown.tex}\\ ${unitTex(h.from)} ${eqSign(exact)} ${last ? `\\hl{${yShown.tex}\\ ${unitTex(h.to)}}` : `\\hl{${yShown.tex}}\\ ${unitTex(h.to)}`}`
			],
			then: x.isZero()
				? undefined
				: `L'unità di arrivo è più ${bigger ? 'grande' : 'piccola'}: il numero diventa più ${bigger ? 'piccolo' : 'grande'}.`
		}
	];
	return { steps, y, yShown };
}

/** Feet and inches as the Americans write a height: 5'11", 5' 11'', 5 ft 11 in. */
const FEET_INCHES = /^\s*(\d{1,6})\s*(?:'|’|′|ft)\s*(?:(\d{1,3}(?:[.,]\d{1,4})?)\s*(?:"|''|’’|”|″|in)?)?\s*$/;

/** Inches as feet and inches, the inches to one decimal: 5' 10,9''. */
function feetInches(inches: Big): { tex: string; text: string; exact: boolean; ft: bigint; rest: Big; restShown: Shown } {
	const tenths = roundTo(inches, 1).m;
	const exact = new Big(tenths, 10n).cmp(inches) === 0;
	const ft = tenths / 120n;
	const restTenths = tenths - ft * 120n;
	const rest = new Big(restTenths, 10n);
	const restShown = show(rest);
	return { tex: `${ft}'\\ ${restShown.tex}''`, text: `${ft}' ${restShown.text}"`, exact, ft, rest, restShown };
}

export interface ConversioneInput {
	quantity: ConvQuantity;
	value: string;
	from: string;
	to: string;
}

const LIMIT = new Big(10n ** 15n);

export function conversione({ quantity, value, from, to }: ConversioneInput): Outcome {
	const def = CONV_QUANTITIES[quantity];
	if (!def) return fail('Scegli una grandezza, per esempio la velocità.');
	let a = findUnit(quantity, from);
	const b = findUnit(quantity, to);
	if (!a || !b) return fail(`Scegli le due unità di misura, per esempio ${def.units[0].text} e ${def.units[1].text}.`);

	const steps: Step[] = [];
	let x: Big;
	let label: string;
	const fi = quantity === 'lunghezza' ? FEET_INCHES.exec(value) : null;
	if (fi) {
		const feet = BigInt(fi[1]);
		const inchR = parseDecimal(fi[2] ?? '0');
		if (!inchR) return fail('Scrivi piedi e pollici così: 5\'11".');
		const inch = new Big(BigInt(inchR.num), BigInt(inchR.den));
		x = new Big(feet * 12n * inch.d + inch.n, inch.d);
		const inchShown = show(inch, 'input');
		a = findUnit(quantity, 'in')!;
		label = `${feet}' ${inchShown.text}"`;
		steps.push({
			say: 'Scrivi la misura tutta in pollici: ogni piede è $12$ pollici.',
			math: [`${feet} \\cdot 12 + ${inchShown.tex} = \\hl{${show(x, 'input').tex}}\\ \\text{in}`]
		});
	} else {
		const r = parseDecimal(value);
		if (!r) {
			const eg = quantity === 'lunghezza' ? ', oppure piedi e pollici come 5\'11"' : '';
			return fail(`Scrivi un numero, per esempio 3,5${eg}. Per i decimali usa la virgola.`);
		}
		if (r.sign() < 0) return fail('Scrivi un numero positivo, per esempio 3,5.');
		x = new Big(BigInt(r.num), BigInt(r.den));
		if (x.cmp(LIMIT) > 0) return fail('Il numero è troppo grande: scrivi un numero più piccolo, per esempio 1000.');
		label = show(x, 'input').text;
	}
	const xShown = show(x, 'input');
	const inWords = `${label} ${fi ? '' : `${a.text} `}in ${b.plural}`;

	let y = x;
	let yShown = xShown;
	if (a === b) {
		steps.push({ say: 'Le due unità sono uguali: la misura non cambia.', math: [`${xShown.tex}\\ ${unitTex(a)} = \\hl{${xShown.tex}\\ ${unitTex(b)}}`] });
	} else {
		const hops = route(quantity, a, b);
		if (hops.length > 1) {
			const via = hops
				.slice(0, -1)
				.map((h) => `$${unitTex(h.to)}$`)
				.join(' e ');
			steps.push({ say: `Passa per ${via}: così i fattori sono più semplici.` });
		}
		let current = x;
		let shown = xShown;
		let rounded = false;
		hops.forEach((h, i) => {
			const last = i === hops.length - 1;
			const out = hopSteps(quantity, h, current, shown, last);
			if (!last && !out.yShown.exact) rounded = true;
			steps.push(...out.steps);
			current = out.y;
			shown = out.yShown;
		});
		if (rounded) {
			const lastStep = steps[steps.length - 1];
			lastStep.then = `${lastStep.then ? `${lastStep.then} ` : ''}Il convertitore continua con il valore non arrotondato: l'ultima cifra può cambiare.`;
		}
		y = current;
		yShown = shown;
	}

	const rows: ResultRow[] = [{ label: inWords, value: `$${yShown.exact ? '' : '\\approx '}${yShown.tex}\\ ${unitTex(b)}$` }];
	let copy = `${yShown.text} ${b.text}`;

	// Feet and inches, for a length that ends in inches or feet.
	if (quantity === 'lunghezza' && (b.id === 'in' || b.id === 'ft') && !fi) {
		const inches = b.id === 'ft' ? y.mul(new Big(12n)) : y;
		if (inches.cmp(new Big(12n)) >= 0) {
			const f = feetInches(inches);
			const inchShown = show(inches);
			const ok = inchShown.exact && f.exact;
			steps.push({
				say: 'Per piedi e pollici, togli $12$ pollici per ogni piede intero.',
				math: [
					...(b.id === 'ft' ? [`${yShown.tex} \\cdot 12 ${eqSign(inchShown.exact && yShown.exact)} ${inchShown.tex}\\ \\text{in}`] : []),
					...(b.id === 'in' ? [`${inchShown.tex} : 12 ${eqSign(show(inches.div(new Big(12n))).exact)} ${show(inches.div(new Big(12n))).tex}`] : []),
					`${f.ft} \\cdot 12 = ${f.ft * 12n}`,
					`${inchShown.tex} - ${f.ft * 12n} ${eqSign(ok)} ${f.restShown.tex}`,
					`${xShown.tex}\\ ${unitTex(a)} ${eqSign(ok)} \\hl{${f.tex}}`
				],
				then: `Sono ${f.ft} piedi e ${f.restShown.text} pollici${f.exact ? '' : ', arrotondati al decimo'}.`
			});
			rows.push({ label: 'In piedi e pollici', value: `$${ok ? '' : '\\approx '}${f.tex}$` });
		}
	}
	if (x.isZero()) copy = `0 ${b.text}`;
	return { ok: true, rows, copy, steps };
}

/** The exact value of x (a decimal string) in another unit, as a float: for the tests. */
export function convertFloat(quantity: ConvQuantity, x: number, from: string, to: string): number {
	const a = findUnit(quantity, from)!;
	const b = findUnit(quantity, to)!;
	return (x * inHub(quantity, a).toNumber()) / inHub(quantity, b).toNumber();
}

/** Which units a conversion goes through, for the tests: ['kWh', 'J', 'eV']. */
export function routeOf(quantity: ConvQuantity, from: string, to: string): string[] {
	const hops = route(quantity, findUnit(quantity, from)!, findUnit(quantity, to)!);
	return [hops[0].from.id, ...hops.map((h) => h.to.id)];
}
