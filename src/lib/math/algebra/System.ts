import { Equation } from "$lib/math/algebra/Equation";
import { Matrix } from "$lib/math/linearAlgebra/Matrix";

export class System {
    equations: Equation[];

    constructor(equations: Equation[]) {
        this.equations = equations;
    }

    toLatex(): string {
        let latex = '\\begin{cases}';
        for (const equation of this.equations) {
            latex += equation.toLatex() + '\\\\\n';
        }
        latex += '\\end{cases}';
        return latex;
    }

    static fromLatex(string: string): System {
        // TODO: Implement this
        throw new Error('Not implemented');
    }

    solve(): Record<string, number> {
        const A: Matrix = new Matrix();
        const x: Matrix = new Matrix();
        const b: Matrix = new Matrix();
        const solution = solve(A, x, b);
        return solution;
    }
}