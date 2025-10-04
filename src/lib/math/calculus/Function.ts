import type { Expression } from "$lib/math/algebra/Expression";
import type { Number } from "$lib/math/algebra/Number";

export class Function {
    name: string;
    variables: string[];
    expression: Expression;

    constructor(name: string, variables: string[], expression: Expression) {
        this.name = name;
        this.variables = variables;
        this.expression = expression;

        if (this.expression.getVariables().some(variable => !this.variables.includes(variable))) {
            throw new Error('Variable not found in function');
        }
    }

    toLatex(): string {
        return `${this.name}(${this.variables.join(',')})=${this.expression.toLatex()}`;
    }

    static fromLatex(string: string): Function {
        // TODO: Think about this and how to implement it
        throw new Error('Not implemented');
        // const match = string.match(functionPattern);
        // if (!match) throw new Error('Invalid function');

        // const name = match[1];
        // const variables = match[2].split(',');
        // const expression = new Expression(match[3]);
        // return new Function(name, variables, expression);
    }

    evaluate(variables: Record<string, number>): Number {
        return this.expression.evaluateWith(variables);
    }
}