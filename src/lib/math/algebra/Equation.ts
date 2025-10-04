import type { Expression } from "$lib/math/algebra/Expression.js";

export class Equation {
    left: Expression;
    right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    toLatex(): string {
        return `${this.left.toLatex()} = ${this.right.toLatex()}`;
    }

    check(variables: Record<string, number>): boolean {
        return this.left.evaluateWith(variables).equals(this.right.evaluateWith(variables));
    }

    /**
     * Solves the equation for the given variables
     * 
     * @param variables a list of variables to solve for
     * 
     * @returns a record of variables and their solutions
     */

    solve(variables: string[]): Record<string, Number> {
        throw new Error('Not implemented');
    }
}