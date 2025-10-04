import type { ASTNode } from "$lib/math/core/validator/ASTNode";
import { ASTNodeType, NumberNode, VariableNode, BinaryOpNode, UnaryOpNode, FunctionNode } from "$lib/math/core/validator/ASTNode";
import { Operator } from "$lib/math/core/Operator";
import { simplifyFractionToPower, simplifyPowers } from "$lib/math/core/cas/PowerRules";
import { nodesEqual, isNegative } from "$lib/math/core/cas/Pattern";

/**
 * Main simplification engine
 * 
 * Applies simplification rules recursively to an AST
 */

/**
 * Fine-grained control over which numeric operations to evaluate
 */
export interface NumericEvaluationOptions {
    addition?: boolean;
    subtraction?: boolean;
    multiplication?: boolean;
    division?: boolean;
    power?: boolean;
    factorial?: boolean;
    trigonometric?: boolean; // sin, cos, tan, etc.
    logarithmic?: boolean;   // log, ln
    roots?: boolean;         // sqrt, cbrt
}

export interface SimplificationOptions {
    maxIterations?: number;
    fractionToPower?: boolean; // Apply (a/b)^n = a^n/b^n rule
    powers?: boolean; // Apply power simplification rules
    /** 
     * Control which numeric operations to evaluate at the end:
     * - true: evaluate all operations
     * - false: don't evaluate any operations
     * - object: evaluate only specified operations
     */
    evaluateNumerics?: NumericEvaluationOptions | boolean;
}

const DEFAULT_NUMERIC_EVALUATION: NumericEvaluationOptions = {
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
    power: true,
    factorial: true,
    trigonometric: true,
    logarithmic: true,
    roots: true
};

const DEFAULT_OPTIONS: SimplificationOptions = {
    maxIterations: 10,
    powers: true,
    fractionToPower: true,
    evaluateNumerics: true
};

/**
 * Simplifies an expression AST
 */
export function simplify(node: ASTNode, options: SimplificationOptions = {}): ASTNode {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    let current = node;
    let previous: ASTNode | null = null;
    let iterations = 0;
    
    // Keep simplifying until no changes occur or max iterations reached
    while (!previous || !nodesEqual(current, previous)) {
        if (iterations++ >= opts.maxIterations!) break;
        
        previous = current;
        current = simplifyOnce(current, opts);
    }
    
    // Optionally evaluate numeric operations at the end
    if (opts.evaluateNumerics) {
        const evalOpts = resolveEvaluationOptions(opts.evaluateNumerics);
        current = evaluateNumericOperations(current, evalOpts);
    }
    
    return current;
}

/**
 * Resolves evaluation options from boolean or object
 */
function resolveEvaluationOptions(options: NumericEvaluationOptions | boolean): NumericEvaluationOptions {
    if (typeof options === 'boolean') {
        return options ? DEFAULT_NUMERIC_EVALUATION : {};
    }
    return options;
}

/**
 * Performs one pass of simplification
 */
function simplifyOnce(node: ASTNode, options: SimplificationOptions): ASTNode {
    // IMPORTANT: Apply fraction-to-power rule FIRST, before simplifying children
    // This ensures (a/b)^n is handled before a/b is converted to a*b^-1
    let simplified = node;
    
    if (options.fractionToPower) {
        simplified = simplifyFractionToPower(simplified);
    }
    
    // Apply sign simplification rules (e.g., (-a) × (-b) = a × b)
    simplified = simplifySignOperations(simplified);
    
    // Simplify double negatives: -(-a) = a
    simplified = simplifyDoubleNegative(simplified);
    
    // Then recursively simplify children
    simplified = simplifyChildren(simplified);
    
    // Finally apply other power rules
    if (options.powers) {
        simplified = simplifyPowers(simplified);
    }
    
    return simplified;
}

/**
 * Simplifies double negatives: -(-a) = a
 */
function simplifyDoubleNegative(node: ASTNode): ASTNode {
    if (node.type !== ASTNodeType.UNARY_OP) return node;
    
    const unary = node as UnaryOpNode;
    
    // Check if it's a negation of a negation
    if (unary.operator === Operator.SUBTRACTION && 
        unary.isPrefix && 
        isNegative(unary.operand)) {
        
        const innerUnary = unary.operand as UnaryOpNode;
        // Return the inner value (canceling both negatives)
        return innerUnary.operand;
    }
    
    return node;
}

/**
 * Simplifies sign operations and identity operations in multiplication and division
 * 
 * Implements:
 * Sign rules:
 * 1. (-a) × (-b) = a × b
 * 2. (-a) × b = -(a × b)
 * 3. a × (-b) = -(a × b)
 * 4. (-a) / (-b) = a / b
 * 5. (-a) / b = -(a / b)
 * 6. a / (-b) = -(a / b)
 * 
 * Identity rules:
 * 7. a × 1 = a
 * 8. 1 × a = a
 * 9. a × 0 = 0
 * 10. 0 × a = 0
 * 11. a / 1 = a
 */
function simplifySignOperations(node: ASTNode): ASTNode {
    if (node.type !== ASTNodeType.BINARY_OP) return node;
    
    const binary = node as BinaryOpNode;
    
    // Only apply to multiplication and division
    const isMultiplication = binary.operator === Operator.MULTIPLICATION;
    const isDivision = binary.operator === Operator.DIVISION ||
                       binary.operator === Operator.FRACTION ||
                       binary.operator === Operator.DFRACTION;
    
    if (!isMultiplication && !isDivision) {
        return node;
    }
    
    // Check if operands are numeric 1 or 0
    const leftIsOne = binary.left.type === ASTNodeType.NUMBER && (binary.left as NumberNode).value === 1;
    const rightIsOne = binary.right.type === ASTNodeType.NUMBER && (binary.right as NumberNode).value === 1;
    const leftIsZero = binary.left.type === ASTNodeType.NUMBER && (binary.left as NumberNode).value === 0;
    const rightIsZero = binary.right.type === ASTNodeType.NUMBER && (binary.right as NumberNode).value === 0;
    
    // Identity rules for multiplication
    if (isMultiplication) {
        // a × 1 = a
        if (rightIsOne) return binary.left;
        // 1 × a = a
        if (leftIsOne) return binary.right;
        // a × 0 = 0
        if (rightIsZero) return new NumberNode(0);
        // 0 × a = 0
        if (leftIsZero) return new NumberNode(0);
    }
    
    // Identity rules for division
    if (isDivision) {
        // a / 1 = a
        if (rightIsOne) return binary.left;
    }
    
    // Sign simplification
    const leftNegative = isNegative(binary.left);
    const rightNegative = isNegative(binary.right);
    
    // Case 1: Both operands are negative → result is positive
    if (leftNegative && rightNegative) {
        const leftUnary = binary.left as UnaryOpNode;
        const rightUnary = binary.right as UnaryOpNode;
        
        return new BinaryOpNode(
            binary.operator,
            leftUnary.operand,
            rightUnary.operand
        );
    }
    
    // Case 2: Only left is negative → result is negative
    if (leftNegative && !rightNegative) {
        const leftUnary = binary.left as UnaryOpNode;
        
        return new UnaryOpNode(
            Operator.SUBTRACTION,
            new BinaryOpNode(
                binary.operator,
                leftUnary.operand,
                binary.right
            ),
            true
        );
    }
    
    // Case 3: Only right is negative → result is negative
    if (!leftNegative && rightNegative) {
        const rightUnary = binary.right as UnaryOpNode;
        
        return new UnaryOpNode(
            Operator.SUBTRACTION,
            new BinaryOpNode(
                binary.operator,
                binary.left,
                rightUnary.operand
            ),
            true
        );
    }
    
    return node;
}

/**
 * Recursively simplifies all children of a node
 */
function simplifyChildren(node: ASTNode): ASTNode {
    if (node.type === ASTNodeType.NUMBER || node.type === ASTNodeType.VARIABLE) {
        return node;
    }
    
    if (node.type === ASTNodeType.BINARY_OP) {
        const binary = node as BinaryOpNode;
        return new BinaryOpNode(
            binary.operator,
            simplifyOnce(binary.left, DEFAULT_OPTIONS),
            simplifyOnce(binary.right, DEFAULT_OPTIONS)
        );
    }
    
    if (node.type === ASTNodeType.UNARY_OP) {
        const unary = node as UnaryOpNode;
        return new UnaryOpNode(
            unary.operator,
            simplifyOnce(unary.operand, DEFAULT_OPTIONS),
            unary.isPrefix
        );
    }
    
    if (node.type === ASTNodeType.FUNCTION) {
        const func = node as FunctionNode;
        return new FunctionNode(
            func.functionName,
            simplifyOnce(func.argument, DEFAULT_OPTIONS)
        );
    }
    
    return node;
}

/**
 * Evaluates numeric operations in the AST based on the given options
 */
function evaluateNumericOperations(node: ASTNode, options: NumericEvaluationOptions): ASTNode {
    if (node.type === ASTNodeType.NUMBER || node.type === ASTNodeType.VARIABLE) {
        return node;
    }
    
    if (node.type === ASTNodeType.BINARY_OP) {
        const binary = node as BinaryOpNode;
        const left = evaluateNumericOperations(binary.left, options);
        const right = evaluateNumericOperations(binary.right, options);
        
        // If both sides are numbers, evaluate the operation (if enabled)
        const leftNum = left.type === ASTNodeType.NUMBER ? (left as NumberNode).value : undefined;
        const rightNum = right.type === ASTNodeType.NUMBER ? (right as NumberNode).value : undefined;
        
        if (leftNum !== undefined && rightNum !== undefined) {
            let result: number | undefined;
            let shouldEvaluate = false;
            
            switch (binary.operator) {
                case Operator.ADDITION:
                    shouldEvaluate = options.addition ?? false;
                    result = leftNum + rightNum;
                    break;
                case Operator.SUBTRACTION:
                    shouldEvaluate = options.subtraction ?? false;
                    result = leftNum - rightNum;
                    break;
                case Operator.MULTIPLICATION:
                    shouldEvaluate = options.multiplication ?? false;
                    result = leftNum * rightNum;
                    break;
                case Operator.DIVISION:
                case Operator.FRACTION:
                case Operator.DFRACTION:
                    shouldEvaluate = options.division ?? false;
                    result = leftNum / rightNum;
                    break;
                case Operator.POWER:
                    shouldEvaluate = options.power ?? false;
                    result = Math.pow(leftNum, rightNum);
                    break;
                default:
                    return new BinaryOpNode(binary.operator, left, right);
            }
            
            if (shouldEvaluate && result !== undefined) {
                return new NumberNode(result);
            }
        }
        
        return new BinaryOpNode(binary.operator, left, right);
    }
    
    if (node.type === ASTNodeType.UNARY_OP) {
        const unary = node as UnaryOpNode;
        const operand = evaluateNumericOperations(unary.operand, options);
        
        if (operand.type === ASTNodeType.NUMBER) {
            const num = (operand as NumberNode).value;
            let result: number | undefined;
            let shouldEvaluate = false;
            
            switch (unary.operator) {
                case Operator.SUBTRACTION:
                    shouldEvaluate = options.subtraction ?? false;
                    result = -num;
                    break;
                case Operator.FACTORIAL:
                    shouldEvaluate = options.factorial ?? false;
                    result = factorial(num);
                    break;
                default:
                    return new UnaryOpNode(unary.operator, operand, unary.isPrefix);
            }
            
            if (shouldEvaluate && result !== undefined) {
                return new NumberNode(result);
            }
        }
        
        return new UnaryOpNode(unary.operator, operand, unary.isPrefix);
    }
    
    if (node.type === ASTNodeType.FUNCTION) {
        const func = node as FunctionNode;
        const arg = evaluateNumericOperations(func.argument, options);
        
        if (arg.type === ASTNodeType.NUMBER) {
            const num = (arg as NumberNode).value;
            let result: number | undefined;
            let shouldEvaluate = false;
            
            switch (func.functionName) {
                case Operator.ROOT:
                    shouldEvaluate = options.roots ?? false;
                    result = Math.sqrt(num);
                    break;
                case Operator.SINE:
                case Operator.COSINE:
                case Operator.TANGENT:
                case Operator.COTANGENT:
                case Operator.SECANT:
                case Operator.COSECANT:
                case Operator.ARCSINE:
                case Operator.ARCCOSINE:
                case Operator.ARCTANGENT:
                case Operator.ARCCOTANGENT:
                case Operator.HYPERBOLIC_SINE:
                case Operator.HYPERBOLIC_COSINE:
                case Operator.HYPERBOLIC_TANGENT:
                case Operator.HYPERBOLIC_COTANGENT:
                    shouldEvaluate = options.trigonometric ?? false;
                    result = evaluateTrigFunction(func.functionName, num);
                    break;
                case Operator.LOGARITHM:
                case Operator.EXPONENTIAL:
                    shouldEvaluate = options.logarithmic ?? false;
                    result = func.functionName === Operator.LOGARITHM ? Math.log(num) : Math.exp(num);
                    break;
                default:
                    return new FunctionNode(func.functionName, arg);
            }
            
            if (shouldEvaluate && result !== undefined) {
                return new NumberNode(result);
            }
        }
        
        return new FunctionNode(func.functionName, arg);
    }
    
    return node;
}

/**
 * Helper to evaluate trigonometric functions
 */
function evaluateTrigFunction(funcName: Operator, value: number): number {
    switch (funcName) {
        case Operator.SINE: return Math.sin(value);
        case Operator.COSINE: return Math.cos(value);
        case Operator.TANGENT: return Math.tan(value);
        case Operator.COTANGENT: return 1 / Math.tan(value);
        case Operator.SECANT: return 1 / Math.cos(value);
        case Operator.COSECANT: return 1 / Math.sin(value);
        case Operator.ARCSINE: return Math.asin(value);
        case Operator.ARCCOSINE: return Math.acos(value);
        case Operator.ARCTANGENT: return Math.atan(value);
        case Operator.ARCCOTANGENT: return Math.PI / 2 - Math.atan(value);
        case Operator.HYPERBOLIC_SINE: return Math.sinh(value);
        case Operator.HYPERBOLIC_COSINE: return Math.cosh(value);
        case Operator.HYPERBOLIC_TANGENT: return Math.tanh(value);
        case Operator.HYPERBOLIC_COTANGENT: return 1 / Math.tanh(value);
        default: return value;
    }
}

function factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Gets the steps of simplification
 */
export function getSimplificationSteps(node: ASTNode, options: SimplificationOptions = {}): string[] {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const steps: string[] = [node.toLatex()];
    
    let current = node;
    let iterations = 0;
    
    while (iterations++ < opts.maxIterations!) {
        const next = simplifyOnce(current, opts);
        const latex = next.toLatex();
        
        // Only add if different from previous
        if (latex !== steps[steps.length - 1]) {
            steps.push(latex);
        }
        
        // Stop if no more changes
        if (nodesEqual(current, next)) break;
        
        current = next;
    }
    
    // Optionally evaluate numeric operations at the end
    if (opts.evaluateNumerics) {
        const evalOpts = resolveEvaluationOptions(opts.evaluateNumerics);
        const evaluated = evaluateNumericOperations(current, evalOpts);
        const latex = evaluated.toLatex();
        if (latex !== steps[steps.length - 1]) {
            steps.push(latex);
        }
    }
    
    return steps;
}

