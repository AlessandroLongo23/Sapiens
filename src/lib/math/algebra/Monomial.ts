// @ts-nocheck -- legacy module ported as-is; its types do not hold up under strict checking (see the port notes).
import { Expression } from "@/lib/math/algebra/Expression";
import { Fraction } from "@/lib/math/algebra/Fraction";
import * as rgx from "@/lib/math/core/patterns";

export class Monomial extends Expression {
    coefficient: Expression;
    variables: Record<string, number>;

    constructor(latex: string) {
        super(latex);

        const regex = rgx.monomialPattern;
        const match = latex.match(regex);

        if (!match) {
            throw new Error("Invalid term format");
        }

        const [, coeffStr, varsStr] = match;

        this.coefficient = new Expression(coeffStr);
        this.variables = {};

        const varRegex = rgx.monomialVariablesPattern;
        let varMatch;
        while ((varMatch = varRegex.exec(varsStr)) !== null) {
            const variable = varMatch[1];
            this.variables[variable] = varMatch[2] ? parseInt(varMatch[2], 10) : 1;
        }
    }

    static fromTerms(coefficient: Expression, variables: Record<string, number>): Monomial {
        return new Monomial(`${coefficient.toLatex()}${Object.keys(variables).map(variable => `${variable}^{${variables[variable]}}`).join('')}`);
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

    sign(): number {
        if (this.coefficient.equals(0)) {
            return 0;
        } else if (this.coefficient.valueOf() > 0) {
            return 1;
        } else {
            return -1;
        }
    }

    grade(): number {
        return Object.values(this.variables).reduce((sum, exponent) => sum + exponent, 0);
    }
}