import { Number } from "$lib/math/algebra/Number";
import { Operator } from "$lib/math/core/Operator";

// Abstract Syntax Tree Node types
export enum ASTNodeType {
    NUMBER = 'NUMBER',
    VARIABLE = 'VARIABLE',
    BINARY_OP = 'BINARY_OP',
    UNARY_OP = 'UNARY_OP',
    FUNCTION = 'FUNCTION'
}

// Base interface for all AST nodes
export interface ASTNode {
    type: ASTNodeType;
    evaluate(): Number;
    toLatex(): string;
}

// Number literal node
export class NumberNode implements ASTNode {
    type = ASTNodeType.NUMBER;
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    evaluate(): Number {
        return new Number(this.value);
    }

    toLatex(): string {
        return this.value.toString();
    }
}

// Variable node (e.g., x, y, a, b)
export class VariableNode implements ASTNode {
    type = ASTNodeType.VARIABLE;
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    evaluate(): Number {
        throw new Error(`Cannot evaluate variable '${this.name}' without substitution`);
    }

    evaluateWithContext(context: Record<string, number>): Number {
        if (!(this.name in context)) {
            throw new Error(`Variable '${this.name}' not found in context`);
        }
        return new Number(context[this.name]);
    }

    toLatex(): string {
        return this.name;
    }
}

// Binary operation node (e.g., 2 + 3, 4 * 5)
export class BinaryOpNode implements ASTNode {
    type = ASTNodeType.BINARY_OP;
    operator: Operator;
    left: ASTNode;
    right: ASTNode;

    constructor(operator: Operator, left: ASTNode, right: ASTNode) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    evaluate(): Number {
        const leftVal = this.left.evaluate();
        const rightVal = this.right.evaluate();

        switch (this.operator) {
            case Operator.ADDITION:
                return leftVal.add(rightVal);
            case Operator.SUBTRACTION:
                return leftVal.sub(rightVal);
            case Operator.MULTIPLICATION:
                return leftVal.mul(rightVal);
            case Operator.DIVISION:
            case Operator.FRACTION:
            case Operator.DFRACTION:
                return leftVal.div(rightVal);
            case Operator.POWER:
                return leftVal.pow(rightVal);
            default:
                throw new Error(`Unknown binary operator: ${this.operator}`);
        }
    }

    toLatex(): string {
        // Handle fractions specially
        if (this.operator === Operator.FRACTION || this.operator === Operator.DFRACTION) {
            return `${this.operator}{${this.left.toLatex()}}{${this.right.toLatex()}}`;
        }

        const leftLatex = this.needsParentheses(this.left, true) 
            ? `\\left(${this.left.toLatex()}\\right)` 
            : this.left.toLatex();
        
        const rightLatex = this.needsParentheses(this.right, false) 
            ? `\\left(${this.right.toLatex()}\\right)` 
            : this.right.toLatex();

        // Handle power operator with curly braces
        if (this.operator === Operator.POWER) {
            return `${leftLatex}^{${this.right.toLatex()}}`;
        }

        return `${leftLatex} ${this.operator} ${rightLatex}`;
    }

    private needsParentheses(node: ASTNode, isLeft: boolean): boolean {
        // Unary operations (like negative numbers) need parentheses in several contexts
        if (node.type === ASTNodeType.UNARY_OP) {
            const unary = node as UnaryOpNode;
            
            // Always wrap unary operations when they're the base of a power
            // e.g., (-5)^2, not -5^2
            if (isLeft && this.operator === Operator.POWER) {
                return true;
            }
            
            // Wrap prefix unary operations (like negation) on the right side of most binary operators
            // e.g., 2 × (-1), not 2 × -1
            // e.g., (x+1)^{-3}, not (x+1)^-3
            if (!isLeft && unary.isPrefix && unary.operator === Operator.SUBTRACTION) {
                return true;
            }
        }
        
        if (node.type !== ASTNodeType.BINARY_OP) return false;
        
        const childOp = (node as BinaryOpNode).operator;
        const currentOp = this.operator;

        // Define operator precedence
        const precedence: Record<string, number> = {
            [Operator.ADDITION]: 1,
            [Operator.SUBTRACTION]: 1,
            [Operator.MULTIPLICATION]: 2,
            [Operator.DIVISION]: 2,
            [Operator.FRACTION]: 2,
            [Operator.DFRACTION]: 2,
            [Operator.POWER]: 3
        };

        const currentPrec = precedence[currentOp] || 0;
        const childPrec = precedence[childOp] || 0;

        // Add parentheses if child has lower precedence
        if (childPrec < currentPrec) return true;

        // Special case: Power of a power needs parentheses on the base (left side)
        // e.g., (a^m)^n, not a^m^n
        if (currentOp === Operator.POWER && childOp === Operator.POWER && isLeft) {
            return true;
        }

        // For same precedence, add parentheses on the right for non-associative ops
        if (childPrec === currentPrec && !isLeft) {
            if (currentOp === Operator.SUBTRACTION || 
                currentOp === Operator.DIVISION ||
                currentOp === Operator.FRACTION ||
                currentOp === Operator.DFRACTION ||
                currentOp === Operator.POWER) {
                return true;
            }
        }

        return false;
    }
}

// Unary operation node (e.g., -5, 3!)
export class UnaryOpNode implements ASTNode {
    type = ASTNodeType.UNARY_OP;
    operator: Operator;
    operand: ASTNode;
    isPrefix: boolean; // true for -x, false for x!

    constructor(operator: Operator, operand: ASTNode, isPrefix: boolean = true) {
        this.operator = operator;
        this.operand = operand;
        this.isPrefix = isPrefix;
    }

    evaluate(): Number {
        const operandVal = this.operand.evaluate();

        switch (this.operator) {
            case Operator.SUBTRACTION:
                return operandVal.opposite();
            case Operator.FACTORIAL:
                return operandVal.factorial();
            case Operator.ABSOLUTE_VALUE:
                return new Number(Math.abs(operandVal.value));
            default:
                throw new Error(`Unknown unary operator: ${this.operator}`);
        }
    }

    toLatex(): string {
        const operandLatex = this.operand.toLatex();
        
        if (this.isPrefix) {
            // Prefix operators like -x
            if (this.operator === Operator.SUBTRACTION) {
                // Add parentheses if operand is a binary operation
                // Exception: fractions don't need parentheses as they're already visually separated
                const isFraction = this.operand.type === ASTNodeType.BINARY_OP && 
                    ((this.operand as BinaryOpNode).operator === Operator.FRACTION || 
                     (this.operand as BinaryOpNode).operator === Operator.DFRACTION);
                const needsParens = this.operand.type === ASTNodeType.BINARY_OP && !isFraction;
                return needsParens ? `-\\left(${operandLatex}\\right)` : `-${operandLatex}`;
            }
            return `${this.operator}${operandLatex}`;
        } else {
            // Postfix operators like x!
            const isFraction = this.operand.type === ASTNodeType.BINARY_OP && 
                ((this.operand as BinaryOpNode).operator === Operator.FRACTION || 
                 (this.operand as BinaryOpNode).operator === Operator.DFRACTION);
            const needsParens = this.operand.type === ASTNodeType.BINARY_OP && !isFraction;
            return needsParens ? `\\left(${operandLatex}\\right)${this.operator}` : `${operandLatex}${this.operator}`;
        }
    }
}

// Function node (e.g., sin(x), sqrt(4))
export class FunctionNode implements ASTNode {
    type = ASTNodeType.FUNCTION;
    functionName: Operator;
    argument: ASTNode;

    constructor(functionName: Operator, argument: ASTNode) {
        this.functionName = functionName;
        this.argument = argument;
    }

    evaluate(): Number {
        const argVal = this.argument.evaluate();

        switch (this.functionName) {
            case Operator.ROOT:
                return argVal.sqrt();
            case Operator.SINE:
                return new Number(Math.sin(argVal.value));
            case Operator.COSINE:
                return new Number(Math.cos(argVal.value));
            case Operator.TANGENT:
                return new Number(Math.tan(argVal.value));
            case Operator.COTANGENT:
                return new Number(1 / Math.tan(argVal.value));
            case Operator.SECANT:
                return new Number(1 / Math.cos(argVal.value));
            case Operator.COSECANT:
                return new Number(1 / Math.sin(argVal.value));
            case Operator.LOGARITHM:
                return new Number(Math.log(argVal.value));
            case Operator.EXPONENTIAL:
                return new Number(Math.exp(argVal.value));
            case Operator.ARCSINE:
                return new Number(Math.asin(argVal.value));
            case Operator.ARCCOSINE:
                return new Number(Math.acos(argVal.value));
            case Operator.ARCTANGENT:
                return new Number(Math.atan(argVal.value));
            case Operator.ARCCOTANGENT:
                return new Number(Math.atan(1 / argVal.value));
            case Operator.HYPERBOLIC_SINE:
                return new Number(Math.sinh(argVal.value));
            case Operator.HYPERBOLIC_COSINE:
                return new Number(Math.cosh(argVal.value));
            case Operator.HYPERBOLIC_TANGENT:
                return new Number(Math.tanh(argVal.value));
            case Operator.HYPERBOLIC_COTANGENT:
                return new Number(1 / Math.tanh(argVal.value));
            default:
                throw new Error(`Unknown function: ${this.functionName}`);
        }
    }

    toLatex(): string {
        const argLatex = this.argument.toLatex();
        
        // Special handling for sqrt with curly braces
        if (this.functionName === Operator.ROOT) {
            return `${this.functionName}{${argLatex}}`;
        }
        
        // Most functions use parentheses
        return `${this.functionName}\\left(${argLatex}\\right)`;
    }
}

