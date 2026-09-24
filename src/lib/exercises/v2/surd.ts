/**
 * Exact real numbers of the form (a + b·√r) / d, the shape of every root of a
 * quadratic with integer coefficients. Always stored normalised: r square-free,
 * d > 0, gcd(a, b, d) = 1, and b = 0, r = 1 for rationals. Two equal numbers
 * therefore have the same fields and the same string.
 */
import { Rational, gcd, q } from './rational';

function safe(n: number): number {
	if (!Number.isSafeInteger(n)) throw new Error(`Surd: ${n} is not a safe integer`);
	return n;
}

export class Surd {
	readonly a: number;
	readonly b: number;
	readonly r: number;
	readonly d: number;

	private constructor(a: number, b: number, r: number, d: number) {
		this.a = a;
		this.b = b;
		this.r = r;
		this.d = d;
	}

	/** (a + b·√r) / d, normalised. r must be >= 0 and d != 0. */
	static of(a: number, b: number, r: number, d: number): Surd {
		[a, b, r, d].forEach(safe);
		if (d === 0) throw new Error('Surd: division by zero');
		if (r < 0) throw new Error(`Surd: negative radicand ${r}`);
		if (r === 0) b = 0;
		for (let i = 2; i * i <= r; i++) {
			while (r % (i * i) === 0) {
				r /= i * i;
				b *= i;
			}
		}
		if (r === 1) {
			a += b;
			b = 0;
		}
		if (b === 0) r = 1;
		if (d < 0) {
			a = -a;
			b = -b;
			d = -d;
		}
		const g = gcd(gcd(a, b), d) || 1;
		return new Surd(a / g, b / g, r, d / g);
	}

	static rational(x: Rational): Surd {
		return Surd.of(x.num, 0, 1, x.den);
	}

	isRational(): boolean {
		return this.b === 0;
	}

	toRational(): Rational {
		if (!this.isRational()) throw new Error(`Surd: ${this} is irrational`);
		return q(this.a, this.d);
	}

	isZero(): boolean {
		return this.a === 0 && this.b === 0;
	}

	neg(): Surd {
		return Surd.of(-this.a, -this.b, this.r, this.d);
	}

	add(x: Rational): Surd {
		// (a + b√r)/d + p/s = (a·s + p·d + b·s·√r) / (d·s)
		return Surd.of(this.a * x.den + x.num * this.d, this.b * x.den, this.r, this.d * x.den);
	}

	/** Approximate value, for ordering and display limits only. Equality is exact. */
	value(): number {
		return (this.a + this.b * Math.sqrt(this.r)) / this.d;
	}

	compare(o: Surd): -1 | 0 | 1 {
		if (this.equals(o)) return 0;
		return this.value() < o.value() ? -1 : 1;
	}

	equals(o: Surd): boolean {
		return this.a === o.a && this.b === o.b && this.r === o.r && this.d === o.d;
	}

	/** "p", "p/q", or a SymPy-parsable form such as "(3-sqrt(5))/2", "-2*sqrt(3)/3". */
	toString(): string {
		if (this.isRational()) return this.toRational().toString();
		const k = Math.abs(this.b);
		const root = k === 1 ? `sqrt(${this.r})` : `${k}*sqrt(${this.r})`;
		const numer = this.a === 0 ? `${this.b < 0 ? '-' : ''}${root}` : `${this.a}${this.b < 0 ? '-' : '+'}${root}`;
		if (this.d === 1) return numer;
		return this.a === 0 ? `${numer}/${this.d}` : `(${numer})/${this.d}`;
	}

	toLatex(): string {
		if (this.isRational()) return this.toRational().toLatex();
		const k = Math.abs(this.b);
		const root = `${k === 1 ? '' : k}\\sqrt{${this.r}}`;
		if (this.a === 0) {
			const sign = this.b < 0 ? '-' : '';
			return this.d === 1 ? `${sign}${root}` : `${sign}\\frac{${root}}{${this.d}}`;
		}
		const numer = `${this.a} ${this.b < 0 ? '-' : '+'} ${root}`;
		return this.d === 1 ? numer : `\\frac{${numer}}{${this.d}}`;
	}

	toJSON(): string {
		return this.toString();
	}
}

/** √n simplified as k·√r with r square-free: sqrtParts(20) = { k: 2, r: 5 }. */
export function sqrtParts(n: number): { k: number; r: number } {
	const s = Surd.of(0, 1, n, 1);
	return s.isRational() ? { k: s.a, r: 1 } : { k: s.b, r: s.r };
}
