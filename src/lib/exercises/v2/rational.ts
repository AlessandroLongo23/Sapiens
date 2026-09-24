/**
 * Exact rational numbers on safe JS integers. Always stored reduced, with a
 * positive denominator. Throws if a result leaves the safe-integer range, so
 * an overflow can never turn into a silently wrong answer.
 */

export function gcd(a: number, b: number): number {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b !== 0) {
		[a, b] = [b, a % b];
	}
	return a;
}

export function lcm(a: number, b: number): number {
	if (a === 0 || b === 0) return 0;
	return Math.abs((a / gcd(a, b)) * b);
}

function safe(n: number, what: string): number {
	if (!Number.isSafeInteger(n)) throw new Error(`Rational: ${what} is not a safe integer (${n})`);
	return n;
}

export class Rational {
	readonly num: number;
	readonly den: number;

	private constructor(num: number, den: number) {
		this.num = num;
		this.den = den;
	}

	static of(num: number, den = 1): Rational {
		safe(num, 'numerator');
		safe(den, 'denominator');
		if (den === 0) throw new Error('Rational: division by zero');
		if (den < 0) {
			num = -num;
			den = -den;
		}
		if (num === 0) return new Rational(0, 1);
		const g = gcd(num, den);
		return new Rational(num / g, den / g);
	}

	/** Parses "p", "-p", "p/q". */
	static parse(s: string): Rational {
		const m = /^\s*(-?\d+)\s*(?:\/\s*(-?\d+)\s*)?$/.exec(s);
		if (!m) throw new Error(`Rational.parse: cannot parse "${s}"`);
		return Rational.of(Number(m[1]), m[2] === undefined ? 1 : Number(m[2]));
	}

	add(o: Rational): Rational {
		return Rational.of(this.num * o.den + o.num * this.den, this.den * o.den);
	}

	sub(o: Rational): Rational {
		return Rational.of(this.num * o.den - o.num * this.den, this.den * o.den);
	}

	mul(o: Rational): Rational {
		return Rational.of(this.num * o.num, this.den * o.den);
	}

	div(o: Rational): Rational {
		if (o.num === 0) throw new Error('Rational: division by zero');
		return Rational.of(this.num * o.den, this.den * o.num);
	}

	neg(): Rational {
		return Rational.of(-this.num, this.den);
	}

	abs(): Rational {
		return Rational.of(Math.abs(this.num), this.den);
	}

	sign(): -1 | 0 | 1 {
		return this.num === 0 ? 0 : this.num > 0 ? 1 : -1;
	}

	compare(o: Rational): -1 | 0 | 1 {
		const d = this.num * o.den - o.num * this.den;
		return d === 0 ? 0 : d > 0 ? 1 : -1;
	}

	equals(o: Rational): boolean {
		return this.num === o.num && this.den === o.den;
	}

	isZero(): boolean {
		return this.num === 0;
	}

	isOne(): boolean {
		return this.num === 1 && this.den === 1;
	}

	isInteger(): boolean {
		return this.den === 1;
	}

	/** "p" for integers, "p/q" otherwise. SymPy parses both. */
	toString(): string {
		return this.den === 1 ? `${this.num}` : `${this.num}/${this.den}`;
	}

	toLatex(): string {
		if (this.den === 1) return `${this.num}`;
		const sign = this.num < 0 ? '-' : '';
		return `${sign}\\frac{${Math.abs(this.num)}}{${this.den}}`;
	}

	toJSON(): string {
		return this.toString();
	}
}

export const q = (num: number, den = 1): Rational => Rational.of(num, den);
export const ZERO = Rational.of(0);
export const ONE = Rational.of(1);

/** Exact square root of a non-negative rational if it is a perfect square, else null. */
export function exactSqrt(r: Rational): Rational | null {
	if (r.sign() < 0) return null;
	const sn = Math.round(Math.sqrt(r.num));
	const sd = Math.round(Math.sqrt(r.den));
	if (sn * sn !== r.num || sd * sd !== r.den) return null;
	return Rational.of(sn, sd);
}
