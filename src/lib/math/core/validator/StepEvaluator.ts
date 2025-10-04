import { 
    type ASTNode, 
    ASTNodeType,
    NumberNode, 
    VariableNode,
    BinaryOpNode, 
    UnaryOpNode, 
    FunctionNode 
} from "$lib/math/core/validator/ASTNode";
import { Number } from "$lib/math/algebra/Number";

interface EvaluationResult {
    node: ASTNode;
    wasEvaluated: boolean;
}

/**
 * Evaluates an expression with variable context
 */
export function evaluateWithContext(ast: ASTNode, context: Record<string, number>): Number {
    const substitutedAst = substituteVariables(ast, context);
    return substitutedAst.evaluate();
}

/**
 * Gets all unique variable names in the expression
 */
export function getVariables(ast: ASTNode): string[] {
    const variables = new Set<string>();
    collectVariables(ast, variables);
    return Array.from(variables).sort();
}

function collectVariables(node: ASTNode, variables: Set<string>): void {
    if (node.type === ASTNodeType.VARIABLE) {
        variables.add((node as VariableNode).name);
    } else if (node.type === ASTNodeType.BINARY_OP) {
        const binaryNode = node as BinaryOpNode;
        collectVariables(binaryNode.left, variables);
        collectVariables(binaryNode.right, variables);
    } else if (node.type === ASTNodeType.UNARY_OP) {
        const unaryNode = node as UnaryOpNode;
        collectVariables(unaryNode.operand, variables);
    } else if (node.type === ASTNodeType.FUNCTION) {
        const funcNode = node as FunctionNode;
        collectVariables(funcNode.argument, variables);
    }
}

function substituteVariables(node: ASTNode, context: Record<string, number>): ASTNode {
    if (node.type === ASTNodeType.VARIABLE) {
        const varNode = node as VariableNode;
        if (varNode.name in context) {
            return new NumberNode(context[varNode.name]);
        }
        return node;
    } else if (node.type === ASTNodeType.BINARY_OP) {
        const binaryNode = node as BinaryOpNode;
        return new BinaryOpNode(
            binaryNode.operator,
            substituteVariables(binaryNode.left, context),
            substituteVariables(binaryNode.right, context)
        );
    } else if (node.type === ASTNodeType.UNARY_OP) {
        const unaryNode = node as UnaryOpNode;
        return new UnaryOpNode(
            unaryNode.operator,
            substituteVariables(unaryNode.operand, context),
            unaryNode.isPrefix
        );
    } else if (node.type === ASTNodeType.FUNCTION) {
        const funcNode = node as FunctionNode;
        return new FunctionNode(
            funcNode.functionName,
            substituteVariables(funcNode.argument, context)
        );
    }
    return node;
}

/**
 * Evaluates an expression step by step, returning the LaTeX representation at each stage
 */
export function evaluateWithSteps(ast: ASTNode, context?: Record<string, number>): string[] {
    const steps: string[] = [];
    
    // Add the initial expression
    steps.push(ast.toLatex());
    
    // Substitute variables if context is provided
    let currentAst = context ? substituteVariables(ast, context) : cloneAST(ast);
    
    // If we substituted, add that as a step
    if (context) {
        const substitutedLatex = currentAst.toLatex();
        if (substitutedLatex !== steps[steps.length - 1]) {
            steps.push(substitutedLatex);
        }
    }
    
    while (!isFullyEvaluated(currentAst)) {
        // Evaluate one layer (the deepest evaluable nodes)
        currentAst = evaluateOneLayer(currentAst);
        
        // Add the new state
        const latex = currentAst.toLatex();
        
        // Only add if different from previous step
        if (steps[steps.length - 1] !== latex) {
            steps.push(latex);
        }
    }
    
    return steps;
}

/**
 * Checks if the AST is fully evaluated (only a single NumberNode)
 */
function isFullyEvaluated(node: ASTNode): boolean {
    return node.type === ASTNodeType.NUMBER;
}

/**
 * Evaluates one layer of the AST (deepest nodes that are ready to be evaluated)
 */
function evaluateOneLayer(node: ASTNode): ASTNode {
    const result = evaluateOneLayerRecursive(node);
    return result.node;
}

/**
 * Recursively evaluates one layer, returning whether any evaluation happened
 */
function evaluateOneLayerRecursive(node: ASTNode): EvaluationResult {
    if (node.type === ASTNodeType.NUMBER) {
        return { node, wasEvaluated: false };
    }
    
    if (node.type === ASTNodeType.FUNCTION) {
        const funcNode = node as FunctionNode;
        const argResult = evaluateOneLayerRecursive(funcNode.argument);
        
        // If argument was evaluated in this pass, just update and return
        if (argResult.wasEvaluated) {
            return {
                node: new FunctionNode(funcNode.functionName, argResult.node),
                wasEvaluated: true
            };
        }
        
        // If argument is fully evaluated (a number), evaluate this function
        if (argResult.node.type === ASTNodeType.NUMBER) {
            const value = funcNode.evaluate();
            return {
                node: new NumberNode(value.value),
                wasEvaluated: true
            };
        }
        
        return { node, wasEvaluated: false };
    }
    
    if (node.type === ASTNodeType.UNARY_OP) {
        const unaryNode = node as UnaryOpNode;
        const operandResult = evaluateOneLayerRecursive(unaryNode.operand);
        
        // If operand was evaluated in this pass, just update and return
        if (operandResult.wasEvaluated) {
            return {
                node: new UnaryOpNode(unaryNode.operator, operandResult.node, unaryNode.isPrefix),
                wasEvaluated: true
            };
        }
        
        // If operand is fully evaluated (a number), evaluate this unary operation
        if (operandResult.node.type === ASTNodeType.NUMBER) {
            const value = unaryNode.evaluate();
            return {
                node: new NumberNode(value.value),
                wasEvaluated: true
            };
        }
        
        return { node, wasEvaluated: false };
    }
    
    if (node.type === ASTNodeType.BINARY_OP) {
        const binaryNode = node as BinaryOpNode;
        const leftResult = evaluateOneLayerRecursive(binaryNode.left);
        const rightResult = evaluateOneLayerRecursive(binaryNode.right);
        
        // If either child was evaluated, update this node and return
        if (leftResult.wasEvaluated || rightResult.wasEvaluated) {
            return {
                node: new BinaryOpNode(binaryNode.operator, leftResult.node, rightResult.node),
                wasEvaluated: true
            };
        }
        
        // If both children are numbers, evaluate this operation
        if (leftResult.node.type === ASTNodeType.NUMBER && 
            rightResult.node.type === ASTNodeType.NUMBER) {
            const value = binaryNode.evaluate();
            return {
                node: new NumberNode(value.value),
                wasEvaluated: true
            };
        }
        
        return { node, wasEvaluated: false };
    }
    
    return { node, wasEvaluated: false };
}

/**
 * Deep clones an AST node
 */
function cloneAST(node: ASTNode): ASTNode {
    if (node.type === ASTNodeType.NUMBER) {
        const numNode = node as NumberNode;
        return new NumberNode(numNode.value);
    }
    
    if (node.type === ASTNodeType.VARIABLE) {
        const varNode = node as VariableNode;
        return new VariableNode(varNode.name);
    }
    
    if (node.type === ASTNodeType.FUNCTION) {
        const funcNode = node as FunctionNode;
        return new FunctionNode(funcNode.functionName, cloneAST(funcNode.argument));
    }
    
    if (node.type === ASTNodeType.UNARY_OP) {
        const unaryNode = node as UnaryOpNode;
        return new UnaryOpNode(unaryNode.operator, cloneAST(unaryNode.operand), unaryNode.isPrefix);
    }
    
    if (node.type === ASTNodeType.BINARY_OP) {
        const binaryNode = node as BinaryOpNode;
        return new BinaryOpNode(
            binaryNode.operator,
            cloneAST(binaryNode.left),
            cloneAST(binaryNode.right)
        );
    }
    
    throw new Error(`Unknown node type: ${node.type}`);
}

