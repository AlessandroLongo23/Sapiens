/**
 * The marks of an axis of the plane: where the labelled lines and the finer ones go, and what the labels say.
 * Numbers by 1, 2 or 5 times a power of ten; an axis of angles by fractions of π or by the degrees of the set
 * squares (30, 45, 90). vault/Prodotti/Studenti/Grafico di funzioni.md
 */
import { tickStep, ticks } from './curva';

export type AxisKind = 'numbers' | 'pi' | 'degrees';

export interface AxisMarks {
	/** The labelled lines. */
	major: number[];
	/** The finer lines of the grid, the labelled ones included. */
	minor: number[];
	label: (value: number) => string;
}

/** A number the Italian way, with at most `digits` decimals and no trailing zeros: 2,5 and −3. */
export function italian(x: number, digits: number): string {
	const r = Number(x.toFixed(digits));
	return (Object.is(r, -0) ? 0 : r).toString().replace('.', ',').replace('-', '−');
}

const digitsOf = (step: number) => Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** The fractions of π an axis can step by, as [numerator, denominator], and the finer step under each. */
const PI_STEPS: [number, number, number][] = [
	[1, 12, 2],
	[1, 6, 2],
	[1, 4, 2],
	[1, 2, 2],
	[1, 1, 2],
	[2, 1, 2]
];
/** The degrees an axis can step by, with the finer step under each. */
const DEGREE_STEPS: [number, number][] = [
	[1, 0.5],
	[2, 1],
	[5, 1],
	[10, 5],
	[15, 5],
	[30, 10],
	[45, 15],
	[90, 30],
	[180, 45],
	[360, 90]
];

/** k·n/d of π, as it is written: π/2, −3π/4, 2π, 0. */
function piLabel(k: number, n: number, d: number): string {
	let num = k * n;
	if (num === 0) return '0';
	const g = gcd(num, d);
	num /= g;
	const den = d / g;
	const sign = num < 0 ? '−' : '';
	const top = Math.abs(num) === 1 ? 'π' : `${Math.abs(num)}π`;
	return den === 1 ? `${sign}${top}` : `${sign}${top}/${den}`;
}

function numberMarks(a: number, b: number, unitsPerPixel: number, target: number): AxisMarks {
	const step = tickStep(unitsPerPixel, target);
	const mantissa = Math.round(step / Math.pow(10, Math.floor(Math.log10(step) + 1e-9)));
	const digits = digitsOf(step);
	return { major: ticks(a, b, step), minor: ticks(a, b, step / (mantissa === 2 ? 4 : 5)), label: (v) => italian(v, digits) };
}

/** The marks of an axis between a and b, about `target` pixels apart. */
export function axisMarks(kind: AxisKind, a: number, b: number, unitsPerPixel: number, target = 80): AxisMarks {
	if (kind === 'pi') {
		const raw = (unitsPerPixel * target) / Math.PI;
		const fraction = PI_STEPS.find(([n, d]) => n / d >= raw);
		// closer than π/12 or farther than 2π apart, the marks are plain multiples of π: 0,05π, 10π
		if (!fraction || raw < 1 / 36) {
			const inPi = numberMarks(a / Math.PI, b / Math.PI, unitsPerPixel / Math.PI, target);
			return { major: inPi.major.map((v) => v * Math.PI), minor: inPi.minor.map((v) => v * Math.PI), label: (v) => (Math.abs(v) < 1e-12 ? '0' : `${inPi.label(v / Math.PI)}π`) };
		}
		const [n, d, split] = fraction;
		const step = (n / d) * Math.PI;
		const multiples = (s: number) => {
			const out: number[] = [];
			for (let k = Math.ceil(a / s - 1e-9); k * s <= b + 1e-9; k++) out.push(k * s);
			return out;
		};
		return { major: multiples(step), minor: multiples(step / split), label: (v) => piLabel(Math.round(v / step), n, d) };
	}
	if (kind === 'degrees') {
		const raw = unitsPerPixel * target;
		const found = raw > 0.75 ? DEGREE_STEPS.find(([s]) => s >= raw) : undefined;
		if (found) {
			const [step, minor] = found;
			return { major: ticks(a, b, step), minor: ticks(a, b, minor), label: (v) => `${italian(v, 0)}°` };
		}
		const plain = numberMarks(a, b, unitsPerPixel, target);
		return { ...plain, label: (v) => `${plain.label(v)}°` };
	}
	return numberMarks(a, b, unitsPerPixel, target);
}

/** A value written as a fraction of π where it is a simple one (2π, π/2, 3π/4), and as a number otherwise. */
export function withPi(value: number): string {
	const twelfths = (value / Math.PI) * 12;
	const k = Math.round(twelfths);
	if (k !== 0 && Math.abs(k) <= 240 && Math.abs(twelfths - k) < 1e-9) return piLabel(k, 1, 12);
	return italian(value, 5);
}

/** What a student types for a number: 2,5 or −3, and also π, 2π, 3π/2, pi/4. NaN when it is not one. */
export function readNumber(text: string): number {
	const t = text.trim().replace(/−/g, '-').replace(/,/g, '.').replace(/pi/gi, 'π').replace(/\s+/g, '');
	const m = /^(-?)(\d*\.?\d*)π(?:\/(\d+))?$/.exec(t);
	if (m) {
		const factor = m[2] === '' ? 1 : Number(m[2]);
		return ((m[1] ? -1 : 1) * factor * Math.PI) / (m[3] ? Number(m[3]) : 1);
	}
	return t === '' ? NaN : Number(t);
}
