import { ExpressionParser } from "$lib/math/validator/ExpressionParser";
import { Number } from "$lib/math/Number";
import type { ASTNode } from "$lib/math/validator/ASTNode";
import { evaluateWithSteps, evaluateWithContext, getVariables } from "$lib/math/validator/StepEvaluator";
import { simplify as casSimplify, getSimplificationSteps, type SimplificationOptions } from "$lib/math/cas/Simplifier";

// Re-export for convenience
export type { SimplificationOptions };

export class Expression {
    private ast: ASTNode;

    constructor(latex: string) {
        const parser = new ExpressionParser(latex);
        this.ast = parser.parseToAST();
    }

    static fromAST(ast: ASTNode): Expression {
        // Create a dummy expression and replace its AST
        const expr = Object.create(Expression.prototype);
        expr.ast = ast;
        return expr;
    }

    toLatex(): string {
        return this.ast.toLatex();
    }

    /**
     * Evaluates the expression (only works for numeric expressions without variables)
     * @throws Error if the expression contains variables
     */
    evaluate(): Number {
        return this.ast.evaluate();
    }

    /**
     * Evaluates the expression with variable substitutions
     * @param context An object mapping variable names to their numeric values
     * @example
     * const expr = new Expression('2x + 3');
     * expr.evaluateWith({ x: 5 }); // returns Number(13)
     */
    evaluateWith(context: Record<string, number>): Number {
        return evaluateWithContext(this.ast, context);
    }

    /**
     * Gets all variable names used in the expression
     * @returns An array of variable names
     */
    getVariables(): string[] {
        return getVariables(this.ast);
    }

    /**
     * Checks if the expression contains any variables
     */
    hasVariables(): boolean {
        return this.getVariables().length > 0;
    }

    /**
     * Evaluates the expression and returns each step of the computation
     * @param context Optional variable context for evaluation
     * @returns An array of LaTeX strings showing the progression from input to final result
     */
    getSteps(context?: Record<string, number>): string[] {
        return evaluateWithSteps(this.ast, context);
    }

    /**
     * Simplifies the expression using CAS rules
     * @param options Simplification options
     * @returns A new Expression with the simplified form
     * @example
     * const expr = new Expression('2^{3} \\times 2^{2} : 2^{4}');
     * const simplified = expr.simplify();
     * console.log(simplified.toLatex()); // "2"
     */
    simplify(options?: SimplificationOptions): Expression {
        const simplifiedAst = casSimplify(this.ast, options);
        return Expression.fromAST(simplifiedAst);
    }

    /**
     * Gets the steps of simplification
     * @param options Simplification options
     * @returns An array of LaTeX strings showing each simplification step
     */
    getSimplificationSteps(options?: SimplificationOptions): string[] {
        return getSimplificationSteps(this.ast, options);
    }
}