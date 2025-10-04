export class Number {
    value: number;

    constructor(value: number | string) {
        if (typeof value === 'string') {
            value = parseFloat(value);
        }
        this.value = value;
    }

    toLatex(): string {
        return this.value.toString();
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

    equals(other: Number | number): boolean {
        if (typeof other === 'number') other = new Number(other);
        return this.value === other.value;
    }

    getDivisors(): Number[] {
        const divisors: Number[] = [];
        for (let i = 1; i <= Math.floor(Math.sqrt(this.value)); i++) {
            if (this.value % i === 0) {
                divisors.push(new Number(i));
                divisors.push(new Number(this.value / i));
            }
        }
        divisors.sort((a, b) => a.value - b.value);
        return divisors;
    }

    getRandomDivisor(): Number {
        const divisors = this.getDivisors();
        return divisors[Math.floor(Math.random() * (divisors.length - 1))];
    }

    getPrimeFactors(): Number[] {
        const primeFactors: Number[] = [];
        let n = this.value;
        for (let i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
            while (n % i === 0) {
                primeFactors.push(new Number(i));
                n = n / i;
            }
        }
        primeFactors.push(new Number(n));
        primeFactors.sort((a, b) => a.value - b.value);
        return primeFactors;
    }
}