import { simplify as casSimplify, getSimplificationSteps, type SimplificationOptions, type NumericEvaluationOptions } from "@/lib/math/core/cas/Simplifier";
import { evaluateWithSteps, evaluateWithContext, getVariables } from "@/lib/math/core/validator/StepEvaluator";
import { ExpressionParser } from "@/lib/math/core/validator/ExpressionParser";
import type { ASTNode } from "@/lib/math/core/validator/ASTNode";
import { BinaryOpNode, NumberNode, UnaryOpNode } from "@/lib/math/core/validator/ASTNode";
import { Operator } from "@/lib/math/core/Operator";
import type { Number } from "@/lib/math/algebra/Number";

// Re-export for convenience
export type { SimplificationOptions, NumericEvaluationOptions };
export { Operator };

export class Expression {
    latex: string;
    private ast: ASTNode;

    constructor(latex: string) {
        this.latex = latex;

        const parser = new ExpressionParser(latex);
        this.ast = parser.parseToAST();
    }

    static fromAST(ast: ASTNode): Expression {
        // Create a dummy expression and replace its AST
        const expr = Object.create(Expression.prototype);
        expr.ast = ast;
        expr.latex = ast.toLatex(); // Keep latex field in sync
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

    /**
     * Applies a binary operation to this expression and another
     * @param operator The operator to apply
     * @param other Another expression or a number
     * @returns A new Expression representing the operation result
     * @example
     * const expr1 = new Expression('2x');
     * const result = expr1.operate(Operator.ADDITION, 3); // 2x + 3
     */
    operate(operator: Operator, other: Expression | number): Expression {
        let otherAst: ASTNode;
        
        if (typeof other === 'number') {
            // If the number is negative, represent it as a unary negation
            // This ensures proper parenthesization in contexts like: expr × (-1) or expr^{-n}
            if (other < 0) {
                otherAst = new UnaryOpNode(
                    Operator.SUBTRACTION, 
                    new NumberNode(Math.abs(other)), 
                    true // isPrefix
                );
            } else {
                otherAst = new NumberNode(other);
            }
        } else {
            otherAst = other.ast;
        }
        
        const resultAst = new BinaryOpNode(operator, this.ast, otherAst);
        return Expression.fromAST(resultAst);
    }

    /**
     * Adds this expression to another
     * @param other Another expression or a number
     * @returns A new Expression representing the sum
     * @example
     * const expr1 = new Expression('2x');
     * const sum = expr1.add(3); // 2x + 3
     */
    add(other: Expression | number): Expression {
        return this.operate(Operator.ADDITION, other);
    }

    /**
     * Subtracts another expression from this one
     * @param other Another expression or a number
     * @returns A new Expression representing the difference
     * @example
     * const expr1 = new Expression('5x');
     * const diff = expr1.sub(2); // 5x - 2
     */
    sub(other: Expression | number): Expression {
        return this.operate(Operator.SUBTRACTION, other);
    }

    /**
     * Multiplies this expression by another
     * @param other Another expression or a number
     * @returns A new Expression representing the product
     * @example
     * const expr1 = new Expression('2x');
     * const product = expr1.mul(3); // 2x × 3
     */
    mul(other: Expression | number): Expression {
        return this.operate(Operator.MULTIPLICATION, other);
    }

    /**
     * Divides this expression by another
     * @param other Another expression or a number
     * @returns A new Expression representing the quotient
     * @example
     * const expr1 = new Expression('6x');
     * const quotient = expr1.div(2); // 6x / 2
     */
    div(other: Expression | number): Expression {
        return this.operate(Operator.DIVISION, other);
    }

    /**
     * Raises this expression to a power
     * @param other The exponent (expression or number)
     * @returns A new Expression representing the power
     * @example
     * const expr1 = new Expression('x + 1');
     * const result = expr1.power(2); // (x + 1)^2
     */
    power(other: Expression | number): Expression {
        return this.operate(Operator.POWER, other);
    }
}