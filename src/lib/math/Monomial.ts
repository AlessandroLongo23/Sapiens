export class Monomial {
    coefficient: number;
    variables: string[];
    exponents: Record<string, number>;

    constructor(coefficient: number, variables: string[], exponents: Record<string, number>) {
        this.coefficient = coefficient;
        this.variables = variables;
        this.exponents = exponents;
    }
    
    // \dfrac{34}{9}x^2y^{10}z^3
    static fromLatex(string: string): Monomial {
        throw new Error('Not implemented');
    }

    static add(m1: Monomial, m2: Monomial): Monomial {
        if (m1.variables.length !== m2.variables.length) {
            throw new Error('Variables length mismatch');
        }
        for (let i = 0; i < m1.variables.length; i++) {
            if (m1.variables[i] !== m2.variables[i]) {
                throw new Error('Variables mismatch');
            }
        }
        return new Monomial(m1.coefficient + m2.coefficient, m1.variables, m1.exponents);
    }

    static sub(m1: Monomial, m2: Monomial): Monomial {
        if (m1.variables.length !== m2.variables.length) {
            throw new Error('Variables length mismatch');
        }
        for (let i = 0; i < m1.variables.length; i++) {
            if (m1.variables[i] !== m2.variables[i]) {
                throw new Error('Variables mismatch');
            }
        }
        return new Monomial(m1.coefficient - m2.coefficient, m1.variables, m1.exponents);
    }

    static mul(m1: Monomial, m2: Monomial): Monomial {
        throw new Error('Not implemented');
    }

    static div(m1: Monomial, m2: Monomial): Monomial {
        throw new Error('Not implemented');
    }
    
    toString(): string {
        throw new Error('Not implemented');
    }
}