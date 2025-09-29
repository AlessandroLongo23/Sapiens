import { Polynomial } from "$lib/math/Polynomial.js";
import { Monomial } from "$lib/math/Monomial.js";
import { Fraction } from "$lib/math/Fraction.js";

export class Equation {
    left: Polynomial | Monomial | Fraction;
    right: Polynomial | Monomial | Fraction;

    constructor(left, right) {
        this.left = left;
        this.right = right;

        if (typeof this.left === 'number') {
            this.left = new Fraction(this.left);
        }
        if (typeof this.right === 'number') {
            this.right = new Fraction(this.right);
        }
    }

    toLatex(): string {
        return `${this.left.toLatex()} = ${this.right.toLatex()}`;
    }

    solve(): Fraction[] {
        return [];
    }
}