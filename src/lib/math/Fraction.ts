import { gcd } from '$lib/utils/auxiliary';
import * as rgx from "$lib/math/patterns";

export class Fraction {
    num: number;
    den: number;
    value: number | null;

    constructor(num: number, den: number = 1) {
        this.num = num;
        this.den = den;
        if (den != 0) {
            this.value = num / den;
        } else {
            this.value = null;
        }

        this.simplify();
    }

    simplify(): void {
        if (this.num % 1 == 0 && this.den % 1 == 0) {
            const c = gcd(Math.abs(this.num), Math.abs(this.den));
            this.num /= c;
            this.den /= c;
        }
    }

    toLatex(): string {
        if (this.value == null) {
            return 'N/D';
        } else if (this.value == 0) {
            return '0';
        } else if (Math.abs(this.den) == 1) {
            return `${this.value > 0 ? '' : '-'}${Math.abs(this.num)}`;
        } else if (this.value < 0) {
            return `-\\dfrac{${Math.abs(this.num)}}{${Math.abs(this.den)}}`;
        }
        return `\\dfrac{${Math.abs(this.num)}}{${Math.abs(this.den)}}`;
    }

    add(other: Fraction | number): Fraction {
        if (typeof other === 'number') {
            other = new Fraction(other, 1);
        }
        const num = this.num * other.den + other.num * this.den;
        const den = this.den * other.den;
        const result = new Fraction(num, den);
        result.simplify();
        return result;
    }

    static add(a: Fraction, b: Fraction): Fraction {
        const result = new Fraction(a.num * b.den + b.num * a.den, a.den * b.den);
        result.simplify();
        return result;
    }
    
    sub(other: Fraction | number): Fraction {
        if (typeof other === 'number') {
            other = new Fraction(other, 1);
        }
        const num = this.num * other.den - other.num * this.den;
        const den = this.den * other.den;
        const result = new Fraction(num, den);
        result.simplify();
        return result;
    }

    static sub(a: Fraction, b: Fraction): Fraction {
        const result = new Fraction(a.num * b.den - b.num * a.den, a.den * b.den);
        result.simplify();
        return result;
    }
    
    mul(other: Fraction | number): Fraction {
        if (typeof other === 'number') {
            other = new Fraction(other, 1);
        }
        const num = this.num * other.num;
        const den = this.den * other.den;
        return new Fraction(num, den);
    }
    
    div(other: Fraction | number): Fraction {
        if (typeof other === 'number') {
            other = new Fraction(other, 1);
        }
        const num = this.num * other.den;
        const den = this.den * other.num;
        return new Fraction(num, den);
    }

    toNumber(): number | null {
        if (this.value == null) {
            return null;
        }
        return this.value;
    }

    static fromNumber(value: number, precision: number = 2) {
        if (value == Math.floor(value)) {
            return new Fraction(value, 1);
        } else {
            return new Fraction(Math.round(value * Math.pow(10, precision)), Math.pow(10, precision));
        }
    }

    static random(sign: string = null, num: number = null, den: number = null, min_value: number = 1, max_value: number = 10) {
        if (sign == null) {
            sign = Math.random() < 0.5 ? '+' : '-';
        }
        if (num == null) {
            num = Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
        }
        if (den == null) {
            den = Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
        }

        if (sign == '+') {
            num = Math.abs(num);
        } else {
            num = -Math.abs(num);
        }

        if (den == 0) {
            den = 1;
        }

        return new Fraction(num, den);
    }

    static fromString(value: string): Fraction {
        if (value.includes('/')) {
            const [num, den] = value.split('/').map(Number);
            return new Fraction(num, den);
        } else {
            return new Fraction(Number(value), 1);
        }
    }

    static fromLatex(value: string): Fraction {
        const fractionPattern = rgx.fractionPattern;
        const match = value.match(fractionPattern);
        if (!match) throw new Error('Invalid fraction');

        const [num, den] = match.slice(1).map(Number);
        return new Fraction(num, den);
    }

    static inverse(fraction: Fraction): Fraction {
        if (fraction.num == 0) {
            throw new Error('Cannot inverse a fraction with 0 numerator');
        }
        return new Fraction(fraction.den, fraction.num);
    }

    inverse(): Fraction {
        if (this.num == 0) {
            throw new Error('Cannot inverse a fraction with 0 numerator');
        }
        return new Fraction(this.den, this.num);
    }

    static pow(fraction: Fraction, exponent: number): Fraction {
        return new Fraction(Math.pow(fraction.num, exponent), Math.pow(fraction.den, exponent));
    }

    pow(exponent: number): Fraction {
        return new Fraction(Math.pow(this.num, exponent), Math.pow(this.den, exponent));
    }

    equals(other: Fraction | number): boolean {
        if (typeof other === 'number') {
            return this.value === other;
        }
        
        if (this.value === null && other.value === null) return true;
        if (this.value === null || other.value === null) return false;
        
        return this.value === other.value;
    }

    notEquals(other: Fraction | number): boolean {
        return !this.equals(other);
    }

    valueOf(): number {
        return this.value === null ? NaN : this.value;
    }
}