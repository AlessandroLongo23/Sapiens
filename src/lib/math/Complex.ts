import { Number } from "$lib/math/Number";
import * as rgx from "$lib/math/patterns";

export class Complex {
    real: Number;
    imaginary: Number;

    constructor(real: Number, imaginary: Number) {
        this.real = real;
        this.imaginary = imaginary;
    }

    toLatex(): string {
        return `${this.real.toLatex()} + ${this.imaginary.toLatex()}i`;
    }

    // static fromLatex(string: string): Complex {
    //     const regex = rgx.complexPattern;
    // }
}