import { polynomialPattern } from "$lib/math/patterns";
import { Monomial } from "$lib/math/Monomial";
import { Fraction } from "$lib/math/Fraction";

export class Polynomial {
    monomials: Monomial[];

    constructor(monomials: Monomial[]) {
        this.monomials = monomials;
        this.simplify();
    }

    toLatex(): string {
        let latex = '';
        for (let i = 0; i < this.monomials.length; i++) {
            if (this.monomials[i].sign() == 0) continue;

            if (i > 0) {
                latex += this.monomials[i].sign() >= 0 && latex.length > 0 ? '+' : '';
            }
            latex += this.monomials[i].toLatex();
        }
        return latex;
    }

    static fromLatex(string: string): Polynomial {
        const match = string.match(polynomialPattern);
        if (!match) throw new Error('Invalid polynomial');

        const monomials = match[1].split(' + ').map(monomial => Monomial.fromLatex(monomial));
        return new Polynomial(monomials);
    }

    static sub(p1: Polynomial, p2: Polynomial): Polynomial {
        const monomials = p1.monomials.map((monomial) => {
            const monomial2 = p2.monomials.find((m) => Object.keys(m.variables).every((v) => monomial.variables[v] === m.variables[v]));
            return Monomial.sub(monomial, monomial2);
        });
        return new Polynomial(monomials);
    }

    simplify(): void {
        const monomials = this.monomials.map((monomial, i) => {
            const monomial2 = this.monomials.find((m) => Object.keys(m.variables).every((v) => monomial.variables[v] === m.variables[v]));
            const j = this.monomials.indexOf(monomial2);
            return i == j ? monomial : Monomial.add(monomial, monomial2);
        });
        this.monomials = monomials;
    }
}

export class Quadratic extends Polynomial {
    delta: number;
    solutions: Fraction[];
    a: number;
    b: number;
    c: number;

    constructor(a: number, b: number, c: number) {
        super([
            new Monomial(new Fraction(a), { x: 2 }),
            new Monomial(new Fraction(b), { x: 1 }),
            new Monomial(new Fraction(c), {}),
        ]);

        this.a = a;
        this.b = b;
        this.c = c;

        this.calculateSolutions();
    }

    calculateDelta(): number {
        this.delta = this.b ** 2 - 4 * this.a * this.c;
        return this.delta;
    }

    calculateSolutions(): Fraction[] {
        this.calculateDelta();

        if (this.a == 0) {
            this.solutions = [new Fraction(-this.c, this.b)];
            return this.solutions;
        }

        this.solutions = [];
        if (this.delta == 0) {
            this.solutions = [new Fraction(-this.b, 2 * this.a)];
        } else if (this.delta > 0) {
            this.solutions = [
                new Fraction(-this.b - Math.sqrt(this.delta), 2 * this.a),
                new Fraction(-this.b + Math.sqrt(this.delta), 2 * this.a)
            ];
        }
        return this.solutions;
    }

    static random(ensureIntegerDelta: boolean = true, max_value: number = 10): Quadratic {
        let quadratic: Quadratic;
        do {
            let a = (Math.floor(Math.random() * max_value) + 1) * (Math.random() < 0.5 ? 1 : -1);
            let b = Math.floor(Math.random() * max_value) * (Math.random() < 0.5 ? 1 : -1);
            let c = Math.floor(Math.random() * max_value) * (Math.random() < 0.5 ? 1 : -1);

            quadratic = new Quadratic(a, b, c);
        } while (ensureIntegerDelta && Math.sqrt(quadratic.delta) % 1 != 0);

        return quadratic;
    }

    static sub(p1: Quadratic, p2: Quadratic): Quadratic {
        return new Quadratic(p1.a - p2.a, p1.b - p2.b, p1.c - p2.c);
    }
}