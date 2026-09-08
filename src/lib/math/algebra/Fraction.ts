// @ts-nocheck -- legacy module ported as-is; its types do not hold up under strict checking (see the port notes).
import { gcd, abs } from '@/lib/math/core/utils';
import { Number } from "@/lib/math/algebra/Number";
import { Expression, type SimplificationOptions } from "@/lib/math/algebra/Expression";

export class Fraction extends Expression {
    num!: Number;
    den!: Number;
    value!: Number | null;

    constructor(latex: string) {
        super(latex);
    }

    static fromNumDen(num: number | Number, den: number | Number = 1, simplify_fraction: boolean = true): Fraction {
        if (typeof num === 'number') num = new Number(num);
        if (typeof den === 'number') den = new Number(den);

        const fraction: Fraction = new Fraction(`\\dfrac{${num.value}}{${den.value}}`);

        fraction.num = num;
        fraction.den = den;
        if (den.value != 0) {
            fraction.value = num.div(den);
        } else {
            fraction.value = null;
        }

        if (simplify_fraction) {
            fraction.simplify();
        }

        return fraction;
    }

    simplify(_options?: SimplificationOptions): Fraction {
        if (this.num.value % 1 == 0 && this.den.value % 1 == 0) {
            const c: Number = gcd(abs(this.num), abs(this.den));
            this.num = this.num.div(c);
            this.den = this.den.div(c);
        }
        return this;
    }

    toLatex(): string {
        if (this.value == null) {
            return 'N/D';
        } else if (this.value.equals(0)) {
            return '0';
        } else if (abs(this.den).value == 1) {
            return `${this.value.value > 0 ? '' : '-'}${abs(this.num).value}`;
        } else if (this.value.value < 0) {
            return `-\\dfrac{${abs(this.num).value}}{${abs(this.den).value}}`;
        }
        return `\\dfrac{${abs(this.num).value}}{${abs(this.den).value}}`;
    }

    add(other: Fraction | number): Fraction {
        if (typeof other === 'number') other = Fraction.fromNumDen(other, 1);

        const num = this.num.value * other.den.value + other.num.value * this.den.value;
        const den = this.den.value * other.den.value;
        const result = Fraction.fromNumDen(num, den);
        result.simplify();
        return result;
    }

    static add(a: Fraction, b: Fraction): Fraction {
        const result = Fraction.fromNumDen(a.num.value * b.den.value + b.num.value * a.den.value, a.den.value * b.den.value);
        result.simplify();
        return result;
    }
    
    sub(other: Fraction | number): Fraction {
        if (typeof other === 'number') other = Fraction.fromNumDen(other, 1);

        const num = this.num.value * other.den.value - other.num.value * this.den.value;
        const den = this.den.value * other.den.value;
        const result = Fraction.fromNumDen(num, den);
        result.simplify();
        return result;
    }

    static sub(a: Fraction, b: Fraction): Fraction {
        const result = Fraction.fromNumDen(a.num.value * b.den.value - b.num.value * a.den.value, a.den.value * b.den.value);
        result.simplify();
        return result;
    }
    
    mul(other: Fraction | number): Fraction {
        if (typeof other === 'number') other = Fraction.fromNumDen(other, 1);

        const num = this.num.value * other.num.value;
        const den = this.den.value * other.den.value;
        return Fraction.fromNumDen(num, den);
    }
    
    div(other: Fraction | number): Fraction {
        if (typeof other === 'number') other = Fraction.fromNumDen(other, 1);

        const num = this.num.value * other.den.value;
        const den = this.den.value * other.num.value;
        return Fraction.fromNumDen(num, den);
    }

    toNumber(): number | null {
        if (this.value == null) {
            return null;
        }
        return this.value.value;
    }

    static fromNumber(value: number, precision: number = 2) {
        if (value == Math.floor(value)) {
            return Fraction.fromNumDen(value, 1);
        } else {
            return Fraction.fromNumDen(Math.round(value * Math.pow(10, precision)), Math.pow(10, precision));
        }
    }

    // TODO: Move to Random class
    static random(
        sign: string = null, 
        num: number = null, 
        den: number = null, 
        min_value: number = 1, 
        max_value: number = 10,
        simplify_fraction: boolean = true
    ) {
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

        return Fraction.fromNumDen(num, den, simplify_fraction);
    }

    static inverse(fraction: Fraction): Fraction {
        if (fraction.num.value == 0) {
            throw new Error('Cannot inverse a fraction with 0 numerator');
        }
        return Fraction.fromNumDen(fraction.den, fraction.num);
    }

    inverse(): Fraction {
        if (this.num.value == 0) {
            throw new Error('Cannot inverse a fraction with 0 numerator');
        }
        return Fraction.fromNumDen(this.den, this.num);
    }

    static pow(fraction: Fraction, exponent: number): Fraction {
        return Fraction.fromNumDen(Math.pow(fraction.num.value, exponent), Math.pow(fraction.den.value, exponent));
    }

    pow(exponent: number): Fraction {
        return Fraction.fromNumDen(Math.pow(this.num.value, exponent), Math.pow(this.den.value, exponent));
    }

    equals(other: Fraction | number): boolean {
        if (typeof other === 'number') {
            return this.value.equals(other);
        }
        
        if (this.value === null && other.value === null) return true;
        if (this.value === null || other.value === null) return false;
        
        return this.value.equals(other.value);
    }

    notEquals(other: Fraction | number): boolean {
        return !this.equals(other);
    }

    valueOf(): number {
        return this.value === null ? NaN : this.value.value;
    }
}