import type { ASTNode } from "@/lib/math/core/validator/ASTNode";
import { NumberNode, BinaryOpNode, UnaryOpNode } from "@/lib/math/core/validator/ASTNode";
import { Operator } from "@/lib/math/core/Operator";
import { 
    nodesEqual, 
    isPower, 
    isNegative,
    isMultiplication, 
    isDivision,
    getNumber,
    isFraction
} from "@/lib/math/core/cas/Pattern";

/**
 * Power simplification rules
 * 
 * Implements:
 * 1. a^0 = 1
 * 2. a^1 = a
 * 3. 0^n = 0
 * 4. 0^n = NaN
 * 5. 1^n = 1
 * 6. (a^m)^n = a^(m×n)
 
 * 7. (a/b)^n = a^n / b^n
 * 8. a^(-n) = 1 / a^n
 * 
 * 9. a^m × a^n = a^(m+n)
 * 10. a^m × b^m = (a × b)^m
 * 11. a^m / a^n = a^(m-n)
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
        
        //* RULE 1: a^0 = 1
        if (exponent === 0) {
            return new NumberNode(1);
        }
        
        //* RULE 2: a^1 = a
        if (exponent === 1) {
            return power.left;
        }

        if (base === 0 && exponent !== undefined) {
            //* RULE 3: 0^n = 0 (for n > 0)
            if (exponent > 0) {
                return new NumberNode(0);
            } 
            
            //* RULE 4: 0^n = NaN (for n <= 0)
            else {
                return new NumberNode(NaN);
            }
        }
        
        //* RULE 5: 1^n = 1
        if (base === 1) {
            return new NumberNode(1);
        }
        
        //* RULE 6: (a^m)^n = a^(m×n)
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

        //* RULE: 1 / a^m = a^-m (but not for LaTeX fractions)
        if (nodesEqual(div.left, new NumberNode(1)) && isPower(div.right) &&
            div.operator !== Operator.FRACTION && div.operator !== Operator.DFRACTION) {
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

        //* RULE: 1 / a = a^-1 (but not for LaTeX fractions)
        if (nodesEqual(div.left, new NumberNode(1)) && !isPower(div.right) &&
            div.operator !== Operator.FRACTION && div.operator !== Operator.DFRACTION) {
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


/**
 * Simplifies powers of fractions and negative bases
 * 
 * Implements:
 * 1. (a/b)^n = a^n / b^n (for any n)
 * 2. (a/b)^{-n} = (b/a)^n = b^n / a^n (for negative n)
 * 3. (-a)^n = a^n (if n is even), -(a^n) (if n is odd)
 * 4. (-a)^{-n} = 1/a^n (if n is even), -1/a^n (if n is odd)
 * 5. (-(a/b))^n with special handling for negative fractions
 * 6. a^{-n} = 1 / a^n (for positive base with negative exponent)
 *    NOTE: This rule is skipped when base is a power to allow (a^m)^n rule to apply first
 * 
 * This rule MUST be applied BEFORE simplifying the fraction itself,
 * otherwise 1/n gets converted to n^{-1} too early.
 */
export function simplifyFractionToPower(node: ASTNode): ASTNode {
    if (!isPower(node)) {
        return node;
    }

    const power = node as BinaryOpNode;
    
    // CASE 1: Base is a negative expression (-(expr))
    if (isNegative(power.left)) {
        const negative = power.left as UnaryOpNode;
        const baseOperand = negative.operand;
        const exponent = power.right;
        
        // Helper to determine if we should keep the negative sign
        const shouldKeepNegative = (exp: ASTNode): boolean => {
            const expValue = getNumber(exp);
            if (expValue !== undefined) {
                // For numeric exponents, check if odd
                return Math.abs(expValue) % 2 === 1;
            }
            // For non-numeric exponents, we can't determine, so keep it
            return true;
        };
        
        // CASE 1a: Base is negative fraction: (-(a/b))^n
        if (isFraction(baseOperand)) {
            const fraction = baseOperand as BinaryOpNode;
            const numerator = fraction.left;
            const denominator = fraction.right;
            
            // CASE 1a-i: (-(a/b))^{-n}
            if (isNegative(exponent)) {
                const negExponent = exponent as UnaryOpNode;
                const positiveExponent = negExponent.operand;
                
                // Get the magnitude of the exponent to check even/odd
                const expValue = getNumber(positiveExponent);
                const keepNegative = expValue !== undefined ? (expValue % 2 === 1) : true;
                
                // Swap numerator and denominator
                const result = new BinaryOpNode(
                    fraction.operator,
                    new BinaryOpNode(Operator.POWER, denominator, positiveExponent),
                    new BinaryOpNode(Operator.POWER, numerator, positiveExponent)
                );
                
                return keepNegative ? new UnaryOpNode(Operator.SUBTRACTION, result, true) : result;
            }
            
            // CASE 1a-ii: (-(a/b))^n (positive exponent)
            const result = new BinaryOpNode(
                fraction.operator,
                new BinaryOpNode(Operator.POWER, numerator, exponent),
                new BinaryOpNode(Operator.POWER, denominator, exponent)
            );
            
            return shouldKeepNegative(exponent) ? new UnaryOpNode(Operator.SUBTRACTION, result, true) : result;
        }
        
        // CASE 1b: Base is negative non-fraction: (-a)^n
        
        // CASE 1b-i: (-a)^{-n} → convert to fraction form
        if (isNegative(exponent)) {
            const negExponent = exponent as UnaryOpNode;
            const positiveExponent = negExponent.operand;
            const expValue = getNumber(positiveExponent);
            const keepNegative = expValue !== undefined ? (expValue % 2 === 1) : true;
            
            // Create: 1 / a^n (where a is the positive base)
            const fractionResult = new BinaryOpNode(
                Operator.DFRACTION,
                new NumberNode(1),
                new BinaryOpNode(Operator.POWER, baseOperand, positiveExponent)
            );
            
            // Apply negative sign if exponent magnitude is odd
            return keepNegative ? new UnaryOpNode(Operator.SUBTRACTION, fractionResult, true) : fractionResult;
        }
        
        // CASE 1b-ii: (-a)^n (positive exponent) → keep as power with negative check
        const result = new BinaryOpNode(Operator.POWER, baseOperand, exponent);
        return shouldKeepNegative(exponent) ? new UnaryOpNode(Operator.SUBTRACTION, result, true) : result;
    }
    
    // CASE 2: Base is a positive fraction (a/b)^n
    if (isFraction(power.left)) {
        const fraction = power.left as BinaryOpNode;
        const numerator = fraction.left;
        const denominator = fraction.right;
        const exponent = power.right;
        
        //* RULE: (a/b)^{-n} = (b/a)^n = b^n / a^n
        if (isNegative(exponent)) {
            const negExponent = exponent as UnaryOpNode;
            const positiveExponent = negExponent.operand;
            
            // Swap numerator and denominator, use positive exponent
            return new BinaryOpNode(
                fraction.operator, // Keep FRACTION or DFRACTION
                new BinaryOpNode(Operator.POWER, denominator, positiveExponent),
                new BinaryOpNode(Operator.POWER, numerator, positiveExponent)
            );
        }
        
        //* RULE: (a/b)^n = a^n / b^n (for any other exponent)
        return new BinaryOpNode(
            fraction.operator, // Keep FRACTION or DFRACTION
            new BinaryOpNode(Operator.POWER, numerator, exponent),
            new BinaryOpNode(Operator.POWER, denominator, exponent)
        );
    }
    
    // CASE 3: Positive base with negative exponent: a^{-n} → 1/a^n
    // BUT: Skip if base is a power - let the (a^m)^n rule handle it first
    if (isNegative(power.right) && !isPower(power.left)) {
        const negExponent = power.right as UnaryOpNode;
        const positiveExponent = negExponent.operand;
        
        //* RULE: a^{-n} = 1 / a^n
        return new BinaryOpNode(
            Operator.DFRACTION,
            new NumberNode(1),
            new BinaryOpNode(Operator.POWER, power.left, positiveExponent)
        );
    }

    return node;
}