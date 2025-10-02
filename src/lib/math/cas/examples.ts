/**
 * Examples demonstrating CAS power simplification
 * 
 * Run these to see the system in action!
 */

import { Expression } from "$lib/math/Expression";

console.log("=== Power Simplification Examples ===\n");

// Example 1: Product of powers
console.log("Example 1: Product of powers");
const expr1 = new Expression('2^{3} \\times 2^{2}');
console.log("Input:  ", expr1.toLatex());
console.log("Output: ", expr1.simplify().toLatex());
console.log("Steps:  ", expr1.getSimplificationSteps());
console.log();

// Example 2: Your original example - the key one!
console.log("Example 2: Mixed operations (2^3 × 2^2 : 2^4)");
const expr2 = new Expression('2^{3} \\times 2^{2} : 2^{4}');
console.log("Input:  ", expr2.toLatex());
console.log("Output: ", expr2.simplify().toLatex());
const steps2 = expr2.getSimplificationSteps();
console.log("Steps:");
steps2.forEach((step, i) => {
    console.log(`  ${i}: ${step}`);
});
console.log("Expected: 2^3 × 2^2 : 2^4 → 2^5 : 2^4 → 2^1 → 2");
console.log();

// Example 3: Symbolic powers
console.log("Example 3: Symbolic powers");
const expr3 = new Expression('a^{2} \\times a^{3}');
console.log("Input:  ", expr3.toLatex());
console.log("Output: ", expr3.simplify().toLatex());
console.log();

// Example 4: Power of power
console.log("Example 4: Power of power");
const expr4 = new Expression('(x^{2})^{3}');
console.log("Input:  ", expr4.toLatex());
console.log("Output: ", expr4.simplify().toLatex());
console.log();

// Example 5: Division
console.log("Example 5: Division of powers");
const expr5 = new Expression('x^{7} : x^{2}');
console.log("Input:  ", expr5.toLatex());
console.log("Output: ", expr5.simplify().toLatex());
console.log();

// Example 6: Identity rules
console.log("Example 6: Identity rules");
const expr6a = new Expression('x^{0}');
const expr6b = new Expression('x^{1}');
const expr6c = new Expression('1^{100}');
console.log("x^0 =   ", expr6a.simplify().toLatex());
console.log("x^1 =   ", expr6b.simplify().toLatex());
console.log("1^100 = ", expr6c.simplify().toLatex());
console.log();

// Example 7: Complex nested expression
console.log("Example 7: Complex expression");
const expr7 = new Expression('(2^{2} \\times 2^{3}) : 2^{4}');
console.log("Input:  ", expr7.toLatex());
const steps7 = expr7.getSimplificationSteps();
steps7.forEach((step, i) => {
    console.log(`Step ${i}: ${step}`);
});
console.log();

// Example 8: Multiple variables
console.log("Example 8: Multiple variables");
const expr8 = new Expression('x^{2} \\times y^{3} \\times x^{4}');
console.log("Input:  ", expr8.toLatex());
console.log("Output: ", expr8.simplify().toLatex());
console.log("Note: Currently doesn't reorder, but x^2 × x^4 would simplify if adjacent");
console.log();

