import { Number } from "@/lib/math/algebra/Number";
import { Expression } from "@/lib/math/algebra/Expression";

export class Complex extends Expression {
    real: Number;
    imaginary: Number;

    constructor(real: Number, imaginary: Number) {
        super(`${real.toLatex()} + ${imaginary.toLatex()}i`);

        this.real = real;
        this.imaginary = imaginary;
    }

    toLatex(): string {
        return `${this.real.toLatex()} + ${this.imaginary.toLatex()}i`;
    }

    static fromLatex(_string: string): Complex {
        // TODO: Implement this
        throw new Error('Not implemented');
    }
}