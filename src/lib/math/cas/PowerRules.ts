import type { ASTNode } from "$lib/math/validator/ASTNode";
import { NumberNode, BinaryOpNode } from "$lib/math/validator/ASTNode";
import { Operator } from "$lib/math/Operator";
import { 
    nodesEqual, 
    isNumber, 
    isPower, 
    isMultiplication, 
    isDivision,
    getNumber 
} from "$lib/math/cas/Pattern";

/**
 * Power simplification rules
 * 
 * Implements:
 * 1. a^m × a^n = a^(m+n)
 * 2. a^m / a^n = a^(m-n)
 * 3. (a^m)^n = a^(m×n)
 * 4. a^0 = 1
 * 5. a^1 = a
 * 6. 1^n = 1
 * 7. 0^n = 0 (for n > 0)
 * 8. a^m x b^m = (a x b)^m
 * 9. a^m / b^m = (a / b)^m
 */

/**
 * Simplifies power expressions
 */
export function simplifyPowers(node: ASTNode): ASTNode {
    
    // SECTION: expr ^ expr
    if (isPower(node)) {
        const power = node as BinaryOpNode;
        const base = getNumber(power.left);
        const exponent = getNumber(power.right);
        
        //* RULE: a^0 = 1
        if (exponent === 0) {
            return new NumberNode(1);
        }
        
        //* RULE: a^1 = a
        if (exponent === 1) {
            return power.left;
        }

        //* RULE: 0^n = 0 (for n > 0)
        //* RULE: 0^n = NaN (for n <= 0)
        if (base === 0 && exponent !== undefined) {
            if (exponent > 0) {
                return new NumberNode(0);
            } else {
                return new NumberNode(NaN);
            }
        }
        
        //* RULE: 1^n = 1
        if (base === 1) {
            return new NumberNode(1);
        }
        
        //* RULE: (a^m)^n = a^(m×n)
        if (isPower(power.left)) {
            const innerPower = power.left as BinaryOpNode;
            const m = getNumber(innerPower.right);
            const n = getNumber(power.right);
            
            if (m !== undefined && n !== undefined) {
                return new BinaryOpNode(
                    Operator.POWER,
                    innerPower.left,
                    new NumberNode(m * n)
                );
            }
        }
    }
    // !SECTION
    

    // SECTION: power x power
    if (isMultiplication(node)) {
        const mult = node as BinaryOpNode;
        
        //* RULE: a^m × b^n
        if (isPower(mult.left) && isPower(mult.right)) {
            const leftPow = mult.left as BinaryOpNode;
            const rightPow = mult.right as BinaryOpNode;

            const isBaseEqual = nodesEqual(leftPow.left, rightPow.left);
            const isExponentEqual = nodesEqual(leftPow.right, rightPow.right);
            
            //* RULE: a^m × a^n = a^(m+n)
            if (isBaseEqual) {
                const m = getNumber(leftPow.right);
                const n = getNumber(rightPow.right);
                
                if (m !== undefined && n !== undefined) {
                    const newExponent = m + n;
                    
                    //* RULE: a^m x a^n = a^0 --> 1
                    if (newExponent === 0) {
                        return new NumberNode(1);
                    }
                    
                    //* RULE: a^m x a^n = a^1 --> a
                    if (newExponent === 1) {
                        return leftPow.left;
                    }
                    
                    //* RULE: default case
                    return new BinaryOpNode(
                        Operator.POWER,
                        leftPow.left,
                        new NumberNode(newExponent)
                    );
                }
                
                // Symbolic addition: a^m × a^n = a^(m+n) even if m,n are not numbers
                return new BinaryOpNode(
                    Operator.POWER,
                    leftPow.left,
                    new BinaryOpNode(Operator.ADDITION, leftPow.right, rightPow.right)
                );
            }

            //* RULE: a^m × b^m = (axb)^m
            else if (isExponentEqual) {
                const a = getNumber(leftPow.left);
                const b = getNumber(rightPow.left);

                if (a !== undefined && b !== undefined) {
                    const newBase = a * b;
                    
                    //* RULE: a^m x a^n = 0^m --> 0
                    if (newBase === 0) {
                        return new NumberNode(0);
                    }
                    
                    //* RULE: a^m x b^m = 1^m --> 1
                    if (newBase === 1) {
                        return new NumberNode(1);
                    }
                    
                    //* RULE: default case
                    return new BinaryOpNode(
                        Operator.POWER,
                        new NumberNode(newBase),
                        leftPow.right
                    );
                }

                // Symbolic m: a^m × b^m = (a×b)^m even if m is not a number
                return new BinaryOpNode(
                    Operator.POWER,
                    new BinaryOpNode(Operator.MULTIPLICATION, leftPow.left, rightPow.left),
                    leftPow.right
                );
            }
        }
        
        //* RULE: a^m × a = a^(m+1)
        if (isPower(mult.left) && nodesEqual((mult.left as BinaryOpNode).left, mult.right)) {
            const leftPow = mult.left as BinaryOpNode;
            const m = getNumber(leftPow.right);
            
            if (m !== undefined) {
                const newExponent = m + 1;
                if (newExponent === 0) return new NumberNode(1);
                if (newExponent === 1) return leftPow.left;
                
                return new BinaryOpNode(
                    Operator.POWER,
                    leftPow.left,
                    new NumberNode(newExponent)
                );
            }
        }
        
        //* RULE: a × a^m = a^(m+1)
        if (isPower(mult.right) && nodesEqual(mult.left, (mult.right as BinaryOpNode).left)) {
            const rightPow = mult.right as BinaryOpNode;
            const m = getNumber(rightPow.right);
            
            if (m !== undefined) {
                const newExponent = m + 1;
                if (newExponent === 0) return new NumberNode(1);
                if (newExponent === 1) return rightPow.left;
                
                return new BinaryOpNode(
                    Operator.POWER,
                    rightPow.left,
                    new NumberNode(newExponent)
                );
            }
        }
        
        //* RULE: a × a = a^2
        if (nodesEqual(mult.left, mult.right)) {
            return new BinaryOpNode(
                Operator.POWER,
                mult.left,
                new NumberNode(2)
            );
        }

        //* RULE: 1 x a^m = a^m
        if (nodesEqual(mult.left, new NumberNode(1)) && isPower(mult.right)) {
            const rightPow = mult.right as BinaryOpNode;
            return new BinaryOpNode(
                Operator.POWER,
                rightPow.left,
                rightPow.right
            );
        }
    }
    // !SECTION


    // SECTION: power / power
    if (isDivision(node)) {
        const div = node as BinaryOpNode;
        
        //* RULE: a^m / a^n = a^(m-n)
        if (isPower(div.left) && isPower(div.right)) {
            const leftPow = div.left as BinaryOpNode;
            const rightPow = div.right as BinaryOpNode;
            
            // Check if bases are equal
            if (nodesEqual(leftPow.left, rightPow.left)) {
                const m = getNumber(leftPow.right);
                const n = getNumber(rightPow.right);
                
                if (m !== undefined && n !== undefined) {
                    const newExponent = m - n;
                    
                    // If new exponent is 0, return 1
                    if (newExponent === 0) {
                        return new NumberNode(1);
                    }
                    
                    // If new exponent is 1, return base
                    if (newExponent === 1) {
                        return leftPow.left;
                    }
                    
                    // If new exponent is negative, return 1/base^|n|
                    if (newExponent < 0) {
                        return new BinaryOpNode(
                            div.operator, // Keep original division operator
                            new NumberNode(1),
                            new BinaryOpNode(
                                Operator.POWER,
                                leftPow.left,
                                new NumberNode(-newExponent)
                            )
                        );
                    }
                    
                    return new BinaryOpNode(
                        Operator.POWER,
                        leftPow.left,
                        new NumberNode(newExponent)
                    );
                }
                
                // Symbolic subtraction: a^m / a^n = a^(m-n)
                return new BinaryOpNode(
                    Operator.POWER,
                    leftPow.left,
                    new BinaryOpNode(Operator.SUBTRACTION, leftPow.right, rightPow.right)
                );
            }
        }
        
        //* RULE: a^m / a = a^(m-1)
        if (isPower(div.left) && nodesEqual((div.left as BinaryOpNode).left, div.right)) {
            const leftPow = div.left as BinaryOpNode;
            const m = getNumber(leftPow.right);
            
            if (m !== undefined) {
                const newExponent = m - 1;
                if (newExponent === 0) return new NumberNode(1);
                if (newExponent === 1) return leftPow.left;
                
                if (newExponent < 0) {
                    return new BinaryOpNode(
                        div.operator,
                        new NumberNode(1),
                        new BinaryOpNode(Operator.POWER, leftPow.left, new NumberNode(-newExponent))
                    );
                }
                
                return new BinaryOpNode(
                    Operator.POWER,
                    leftPow.left,
                    new NumberNode(newExponent)
                );
            }
        }

        //* RULE: a^m / 1 = a^m
        if (nodesEqual(div.right, new NumberNode(1))) {
            return div.left;
        }

        //* RULE: a / a^m = a^(1-m)
        if (isPower(div.right) && nodesEqual(div.left, (div.right as BinaryOpNode).left)) {
            const rightPow = div.right as BinaryOpNode;
            const m = getNumber(rightPow.right);
            
            if (m !== undefined) {
                const newExponent = 1 - m;
                if (newExponent === 0) return new NumberNode(1);
                if (newExponent === 1) return rightPow.left;
                
                if (newExponent < 0) {
                    return new BinaryOpNode(
                        div.operator,
                        new NumberNode(1),
                        new BinaryOpNode(Operator.POWER, rightPow.left, new NumberNode(-newExponent))
                    );
                }
                
                return new BinaryOpNode(
                    Operator.POWER,
                    rightPow.left,
                    new NumberNode(newExponent)
                );
            }
        }

        //* RULE: 1 / a^m = a^-m
        if (nodesEqual(div.left, new NumberNode(1)) && isPower(div.right)) {
            const rightPow = div.right as BinaryOpNode;
            const m = getNumber(rightPow.right);
            if (m !== undefined) {
                return new BinaryOpNode(
                    Operator.POWER,
                    rightPow.left,
                    new NumberNode(-m)
                );
            }
        }

        //* RULE: 1 / a = a^-1
        if (nodesEqual(div.left, new NumberNode(1)) && !isPower(div.right)) {
            return new BinaryOpNode(
                Operator.POWER,
                div.right,
                new NumberNode(-1)
            );
        }

        //* RULE: a / a = 1
        if (nodesEqual(div.left, div.right)) {
            return new NumberNode(1);
        }
    }
    // !SECTION

    
    return node;
}

