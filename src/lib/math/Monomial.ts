import { Fraction } from "$lib/math/Fraction";
import * as rgx from "$lib/math/patterns";

export class Monomial {
    coefficient: Fraction;
    variables: Record<string, number>;

    constructor(coefficient: Fraction, variables: Record<string, number>) {
        this.coefficient = coefficient;
        this.variables = variables;
    }
    
    static fromLatex(string: string): Monomial {
        const regex = rgx.monomialPattern;
        const match = string.match(regex);

        if (!match) {
            throw new Error("Invalid term format");
        }

        let [, coeffStr, varsStr] = match;

        const coefficient = Fraction.fromLatex(coeffStr);

        const varRegex = rgx.monomialVariablesPattern;
        const variables: Record<string, number> = {};

        let varMatch;
        while ((varMatch = varRegex.exec(varsStr)) !== null) {
            const variable = varMatch[1];
            const exponent = varMatch[2] ? parseInt(varMatch[2], 10) : 1;
            variables[variable] = exponent;
        }

        return new Monomial(coefficient, variables);
    }

    toLatex(): string {
        let latex = ``;
        const variables = Object.keys(this.variables)

        if (this.coefficient.equals(1)) {
            latex += variables.length > 0 ? '' : '1';
        } else if (this.coefficient.equals(-1)) {
            latex += variables.length > 0 ? '-' : '-1';
        } else {
            latex += this.coefficient.toLatex();
        }

        for (const variable of variables) {
            if (this.variables[variable] === 1) {
                latex += variable;
            } else if (this.variables[variable] > 1) {
                latex += `${variable}^{${this.variables[variable]}}`;
            }
        }
        return latex;
    }

    static add(m1: Monomial, m2: Monomial): Monomial {
        if (Object.keys(m1.variables).length !== Object.keys(m2.variables).length) {
            throw new Error('Variables length mismatch');
        }
        for (const variable of Object.keys(m1.variables)) {
            if (m1.variables[variable] !== m2.variables[variable]) {
                throw new Error('Variables mismatch');
            }
        }
        return new Monomial(Fraction.add(m1.coefficient, m2.coefficient), m1.variables);
    }

    static sub(m1: Monomial, m2: Monomial): Monomial {
        if (Object.keys(m1.variables).length !== Object.keys(m2.variables).length) {
            throw new Error('Variables length mismatch');
        }
        for (const variable of Object.keys(m1.variables)) {
            if (m1.variables[variable] !== m2.variables[variable]) {
                throw new Error('Variables mismatch');
            }
        }
        return new Monomial(Fraction.sub(m1.coefficient, m2.coefficient), m1.variables);
    }

    static mul(m1: Monomial, m2: Monomial): Monomial {
        throw new Error('Not implemented');
    }

    static div(m1: Monomial, m2: Monomial): Monomial {
        throw new Error('Not implemented');
    }

    sign(): number {
        if (this.coefficient.equals(0)) {
            return 0;
        } else if (this.coefficient.valueOf() > 0) {
            return 1;
        } else {
            return -1;
        }
    }
}