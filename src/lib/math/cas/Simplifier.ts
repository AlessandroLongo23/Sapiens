import type { ASTNode } from "$lib/math/validator/ASTNode";
import { ASTNodeType, NumberNode, VariableNode, BinaryOpNode, UnaryOpNode, FunctionNode } from "$lib/math/validator/ASTNode";
import { Operator } from "$lib/math/Operator";
import { simplifyPowers } from "$lib/math/cas/PowerRules";
import { nodesEqual } from "$lib/math/cas/Pattern";

/**
 * Main simplification engine
 * 
 * Applies simplification rules recursively to an AST
 */

export interface SimplificationOptions {
    maxIterations?: number;
    powers?: boolean;
    evaluateNumerics?: boolean; // Evaluate numeric operations at the end
}

const DEFAULT_OPTIONS: SimplificationOptions = {
    maxIterations: 10,
    powers: true,
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
        current = evaluateNumericOperations(current);
    }
    
    return current;
}

/**
 * Performs one pass of simplification
 */
function simplifyOnce(node: ASTNode, options: SimplificationOptions): ASTNode {
    // First, recursively simplify children
    let simplified = simplifyChildren(node);
    
    // Then apply rules to this node
    if (options.powers) {
        simplified = simplifyPowers(simplified);
    }
    
    return simplified;
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
 * Evaluates numeric operations in the AST
 */
function evaluateNumericOperations(node: ASTNode): ASTNode {
    if (node.type === ASTNodeType.NUMBER || node.type === ASTNodeType.VARIABLE) {
        return node;
    }
    
    if (node.type === ASTNodeType.BINARY_OP) {
        const binary = node as BinaryOpNode;
        const left = evaluateNumericOperations(binary.left);
        const right = evaluateNumericOperations(binary.right);
        
        // If both sides are numbers, evaluate the operation
        const leftNum = left.type === ASTNodeType.NUMBER ? (left as NumberNode).value : undefined;
        const rightNum = right.type === ASTNodeType.NUMBER ? (right as NumberNode).value : undefined;
        
        if (leftNum !== undefined && rightNum !== undefined) {
            let result: number;
            switch (binary.operator) {
                case Operator.ADDITION:
                    result = leftNum + rightNum;
                    break;
                case Operator.SUBTRACTION:
                    result = leftNum - rightNum;
                    break;
                case Operator.MULTIPLICATION:
                    result = leftNum * rightNum;
                    break;
                case Operator.DIVISION:
                case Operator.FRACTION:
                case Operator.DFRACTION:
                    result = leftNum / rightNum;
                    break;
                case Operator.POWER:
                    result = Math.pow(leftNum, rightNum);
                    break;
                default:
                    return new BinaryOpNode(binary.operator, left, right);
            }
            return new NumberNode(result);
        }
        
        return new BinaryOpNode(binary.operator, left, right);
    }
    
    if (node.type === ASTNodeType.UNARY_OP) {
        const unary = node as UnaryOpNode;
        const operand = evaluateNumericOperations(unary.operand);
        
        if (operand.type === ASTNodeType.NUMBER) {
            const num = (operand as NumberNode).value;
            switch (unary.operator) {
                case Operator.SUBTRACTION:
                    return new NumberNode(-num);
                case Operator.FACTORIAL:
                    return new NumberNode(factorial(num));
                default:
                    return new UnaryOpNode(unary.operator, operand, unary.isPrefix);
            }
        }
        
        return new UnaryOpNode(unary.operator, operand, unary.isPrefix);
    }
    
    if (node.type === ASTNodeType.FUNCTION) {
        const func = node as FunctionNode;
        const arg = evaluateNumericOperations(func.argument);
        
        if (arg.type === ASTNodeType.NUMBER) {
            const num = (arg as NumberNode).value;
            let result: number;
            switch (func.functionName) {
                case Operator.ROOT:
                    result = Math.sqrt(num);
                    break;
                case Operator.SINE:
                    result = Math.sin(num);
                    break;
                case Operator.COSINE:
                    result = Math.cos(num);
                    break;
                case Operator.TANGENT:
                    result = Math.tan(num);
                    break;
                case Operator.LOGARITHM:
                    result = Math.log(num);
                    break;
                default:
                    return new FunctionNode(func.functionName, arg);
            }
            return new NumberNode(result);
        }
        
        return new FunctionNode(func.functionName, arg);
    }
    
    return node;
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
        const evaluated = evaluateNumericOperations(current);
        const latex = evaluated.toLatex();
        if (latex !== steps[steps.length - 1]) {
            steps.push(latex);
        }
    }
    
    return steps;
}

