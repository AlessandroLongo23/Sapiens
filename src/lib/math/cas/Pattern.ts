import type { ASTNode } from "$lib/math/validator/ASTNode";
import { ASTNodeType, NumberNode, VariableNode, BinaryOpNode, UnaryOpNode, FunctionNode } from "$lib/math/validator/ASTNode";
import { Operator } from "$lib/math/Operator";

/**
 * Pattern matching utilities for symbolic manipulation
 */

export interface PatternMatch {
    matched: boolean;
    bindings: Record<string, ASTNode>;
}

/**
 * Checks if two AST nodes are structurally equal
 */
export function nodesEqual(a: ASTNode, b: ASTNode): boolean {
    if (a.type !== b.type) return false;

    if (a.type === ASTNodeType.NUMBER && b.type === ASTNodeType.NUMBER) {
        return (a as NumberNode).value === (b as NumberNode).value;
    }

    if (a.type === ASTNodeType.VARIABLE && b.type === ASTNodeType.VARIABLE) {
        return (a as VariableNode).name === (b as VariableNode).name;
    }

    if (a.type === ASTNodeType.BINARY_OP && b.type === ASTNodeType.BINARY_OP) {
        const binA = a as BinaryOpNode;
        const binB = b as BinaryOpNode;
        return binA.operator === binB.operator &&
               nodesEqual(binA.left, binB.left) &&
               nodesEqual(binA.right, binB.right);
    }

    if (a.type === ASTNodeType.UNARY_OP && b.type === ASTNodeType.UNARY_OP) {
        const unA = a as UnaryOpNode;
        const unB = b as UnaryOpNode;
        return unA.operator === unB.operator &&
               unA.isPrefix === unB.isPrefix &&
               nodesEqual(unA.operand, unB.operand);
    }

    if (a.type === ASTNodeType.FUNCTION && b.type === ASTNodeType.FUNCTION) {
        const funcA = a as FunctionNode;
        const funcB = b as FunctionNode;
        return funcA.functionName === funcB.functionName &&
               nodesEqual(funcA.argument, funcB.argument);
    }

    return false;
}

/**
 * Checks if a node is a number with a specific value
 */
export function isNumber(node: ASTNode, value?: number): boolean {
    if (node.type !== ASTNodeType.NUMBER) return false;
    if (value === undefined) return true;
    return (node as NumberNode).value === value;
}

/**
 * Checks if a node is a variable
 */
export function isVariable(node: ASTNode, name?: string): boolean {
    if (node.type !== ASTNodeType.VARIABLE) return false;
    if (name === undefined) return true;
    return (node as VariableNode).name === name;
}

/**
 * Checks if a node is a binary operation
 */
export function isBinaryOp(node: ASTNode, operator?: Operator): boolean {
    if (node.type !== ASTNodeType.BINARY_OP) return false;
    if (operator === undefined) return true;
    return (node as BinaryOpNode).operator === operator;
}

/**
 * Checks if a node is a power operation: base^exponent
 */
export function isPower(node: ASTNode): node is BinaryOpNode {
    return isBinaryOp(node, Operator.POWER);
}

/**
 * Checks if a node is multiplication
 */
export function isMultiplication(node: ASTNode): node is BinaryOpNode {
    return isBinaryOp(node, Operator.MULTIPLICATION);
}

/**
 * Checks if a node is division or fraction
 */
export function isDivision(node: ASTNode): node is BinaryOpNode {
    return isBinaryOp(node, Operator.DIVISION) || 
           isBinaryOp(node, Operator.FRACTION) ||
           isBinaryOp(node, Operator.DFRACTION);
}

/**
 * Gets the numeric value from a NumberNode, or undefined
 */
export function getNumber(node: ASTNode): number | undefined {
    if (node.type !== ASTNodeType.NUMBER) return undefined;
    return (node as NumberNode).value;
}

/**
 * Gets the variable name from a VariableNode, or undefined
 */
export function getVariableName(node: ASTNode): string | undefined {
    if (node.type !== ASTNodeType.VARIABLE) return undefined;
    return (node as VariableNode).name;
}

