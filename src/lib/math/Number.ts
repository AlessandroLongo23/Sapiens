import { gcd, lcm } from "$lib/math/functions";

export class Number {
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    toLatex(): string {
        return this.value.toString();
    }

    static fromLatex(value: string): Number {
        throw new Error('Abstract Method Error');
    }

    add(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        return new Number(this.value + other.value);
    }

    static add(a: Number | number, b: Number | number): Number {
        if (typeof a === 'number') a = new Number(a);
        if (typeof b === 'number') b = new Number(b);
        return new Number(a.value + b.value);
    }

    sub(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        return new Number(this.value - other.value);
    }

    static sub(a: Number | number, b: Number | number): Number {
        if (typeof a === 'number') a = new Number(a);
        if (typeof b === 'number') b = new Number(b);
        return new Number(a.value - b.value);
    }

    mul(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        return new Number(this.value * other.value);
    }

    static mul(a: Number | number, b: Number | number): Number {
        if (typeof a === 'number') a = new Number(a);
        if (typeof b === 'number') b = new Number(b);
        return new Number(a.value * b.value);
    }

    div(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        if (other.value == 0) {
            throw new Error('Division by zero');
        }
        return new Number(this.value / other.value);
    }

    static div(a: Number | number, b: Number | number): Number {
        if (typeof a === 'number') a = new Number(a);
        if (typeof b === 'number') b = new Number(b);
        if (b.value == 0) {
            throw new Error('Division by zero');
        }
        return new Number(a.value / b.value);
    }

    pow(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        return new Number(this.value ** other.value);
    }

    square(): Number {
        return new Number(this.value).pow(2);
    }

    cube(): Number {
        return new Number(this.value).pow(3);
    }

    sqrt(): Number {
        return new Number(Math.sqrt(this.value));
    }

    factorial(): Number {
        if (this.value == 0) {
            return new Number(1);
        }
        return new Number(this.value).mul(new Number(this.value - 1).factorial());
    }

    opposite(): Number {
        return new Number(-this.value);
    }

    inverse(): Number {
        if (this.value == 0) {
            throw new Error('Cannot compute the inverse of 0');
        }
        return new Number(1).div(this);
    }

    copy(): Number {
        return new Number(this.value);
    }

    gcd(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        return new Number(gcd(this.value, other.value));
    }

    lcm(other: Number | number): Number {
        if (typeof other === 'number') other = new Number(other);
        return new Number(lcm(this.value, other.value));
    }
}