# Computer Algebra System (CAS)

A modular symbolic mathematics system for algebraic simplification and manipulation.

## Architecture

```
cas/
├── Pattern.ts        - Pattern matching utilities
├── PowerRules.ts     - Power simplification rules
├── Simplifier.ts     - Main simplification engine
└── README.md        - This file
```

## Current Features

### Power Rules (Implemented)

The system currently implements the following power simplification rules:

1. **Identity rules:**
   - `a^0 = 1`
   - `a^1 = a`
   - `1^n = 1`
   - `0^n = 0` (for n > 0)

2. **Product rule:**
   - `a^m × a^n = a^(m+n)`
   - `a × a = a^2`
   - `a^m × a = a^(m+1)`

3. **Quotient rule:**
   - `a^m / a^n = a^(m-n)`
   - `a / a = 1`
   - `a^m / a = a^(m-1)`

4. **Power of power:**
   - `(a^m)^n = a^(m×n)`

## Usage Examples

### Basic Power Simplification

```typescript
import { Expression } from "$lib/math/Expression";

// Example 1: Product of powers with same base
const expr1 = new Expression('2^{3} \\times 2^{2}');
const simplified1 = expr1.simplify();
console.log(simplified1.toLatex()); // "2^{5}"

// Example 2: Division of powers
const expr2 = new Expression('2^{3} \\times 2^{2} : 2^{4}');
const simplified2 = expr2.simplify();
console.log(simplified2.toLatex()); // "2"

// Get step-by-step simplification
const steps = expr2.getSimplificationSteps();
console.log(steps);
// ["2^{3} \\times 2^{2} : 2^{4}", "2^{5} : 2^{4}", "2"]

### Fine-Grained Numeric Evaluation Control

You can now control exactly which numeric operations get evaluated at the end of simplification:

```typescript
import { Expression, type NumericEvaluationOptions } from "$lib/math/Expression";

// Example 1: Evaluate only multiplication, not powers
const expr1 = new Expression('2^{3} \\times 2^{2}');
const simplified1 = expr1.simplify({
    evaluateNumerics: {
        multiplication: true,
        power: false  // Keep powers symbolic
    }
});
console.log(simplified1.toLatex()); // "2^{5}" (power not evaluated)

// Example 2: Evaluate everything except division
const expr2 = new Expression('8 + 4 \\times 2 - 10 / 2');
const simplified2 = expr2.simplify({
    evaluateNumerics: {
        addition: true,
        subtraction: true,
        multiplication: true,
        division: false  // Keep division symbolic
    }
});
console.log(simplified2.toLatex()); // "11 - 10 / 2"

// Example 3: Don't evaluate anything (default CAS behavior)
const expr3 = new Expression('2^{3} \\times 2^{2}');
const simplified3 = expr3.simplify({
    evaluateNumerics: false
});
console.log(simplified3.toLatex()); // "2^{5}" (symbolic only)

// Example 4: Evaluate everything (default behavior)
const expr4 = new Expression('2^{3} \\times 2^{2}');
const simplified4 = expr4.simplify({
    evaluateNumerics: true  // or omit for default
});
console.log(simplified4.toLatex()); // "32"
```

#### Available Evaluation Options

```typescript
interface NumericEvaluationOptions {
    addition?: boolean;       // Controls: a + b
    subtraction?: boolean;    // Controls: a - b, -a
    multiplication?: boolean; // Controls: a × b
    division?: boolean;       // Controls: a / b, \frac{a}{b}, \dfrac{a}{b}
    power?: boolean;          // Controls: a^b
    factorial?: boolean;      // Controls: n!
    trigonometric?: boolean;  // Controls: sin, cos, tan, etc.
    logarithmic?: boolean;    // Controls: log, ln, exp
    roots?: boolean;          // Controls: sqrt, cbrt
}
```

Each option defaults to `false` when you provide a custom object. To enable specific operations, set them to `true`.

### Symbolic Power Simplification

```typescript
// Works with variables too!
const expr3 = new Expression('x^{2} \\times x^{3}');
const simplified3 = expr3.simplify();
console.log(simplified3.toLatex()); // "x^{5}"

// Division
const expr4 = new Expression('x^{5} : x^{2}');
const simplified4 = expr4.simplify();
console.log(simplified4.toLatex()); // "x^{3}"

// Power of power
const expr5 = new Expression('(x^{2})^{3}');
const simplified5 = expr5.simplify();
console.log(simplified5.toLatex()); // "x^{6}"
```

### Complex Examples

```typescript
// Example: (2^3 × 2^2) / 2^4
const expr6 = new Expression('(2^{3} \\times 2^{2}) : 2^{4}');
const simplified6 = expr6.simplify();
console.log(simplified6.toLatex()); // "2"

// Example: a^2 × a^3 / a^4
const expr7 = new Expression('a^{2} \\times a^{3} : a^{4}');
const simplified7 = expr7.simplify();
console.log(simplified7.toLatex()); // "a"
```

## Options

The `simplify()` method accepts an optional configuration object:

```typescript
interface SimplificationOptions {
    maxIterations?: number;     // Max simplification passes (default: 10)
    powers?: boolean;            // Enable power rules (default: true)
    evaluateNumerics?: boolean;  // Evaluate numeric operations at end (default: true)
}

const expr = new Expression('2^{3} \\times 2^{2}');
const simplified = expr.simplify({ 
    maxIterations: 5,
    powers: true,
    evaluateNumerics: true  // Set to false to keep symbolic form
});
```

### Important: Symbolic Simplification First

The system **does not** immediately evaluate numeric operations like `2^3 = 8`. Instead, it:

1. **Keeps powers symbolic** during simplification
2. **Applies algebraic rules** (e.g., `2^3 × 2^2 = 2^5`)
3. **Evaluates at the end** (if `evaluateNumerics: true`)

This ensures algebraic laws are applied before numeric evaluation:

```typescript
// With evaluateNumerics: true (default)
const expr1 = new Expression('2^{3} \\times 2^{2} : 2^{4}');
console.log(expr1.simplify().toLatex()); // "2"

// Steps: 2^3 × 2^2 : 2^4 → 2^5 : 2^4 → 2^1 → 2

// With evaluateNumerics: false (keep symbolic)
const expr2 = new Expression('2^{3} \\times 2^{2}');
console.log(expr2.simplify({ evaluateNumerics: false }).toLatex()); // "2^{5}"
```

## Extending the System

### Adding New Rule Sets

To add new simplification rules (e.g., for fractions, trigonometry):

1. **Create a new rules file** (e.g., `FractionRules.ts`):

```typescript
import type { ASTNode } from "$lib/math/core/validator/ASTNode";

export function simplifyFractions(node: ASTNode): ASTNode {
    // Implement your rules here
    return node;
}
```

2. **Update `Simplifier.ts`** to include your rules:

```typescript
import { simplifyFractions } from "$lib/math/cas/FractionRules";

// In SimplificationOptions:
interface SimplificationOptions {
    maxIterations?: number;
    powers?: boolean;
    fractions?: boolean;  // Add new option
}

// In simplifyOnce():
if (options.fractions) {
    simplified = simplifyFractions(simplified);
}
```

3. **Add tests** to verify your rules work correctly.

## Future Extensions

### Planned Features

1. **Fraction Simplification:**
   - Cancel common factors
   - Simplify complex fractions
   - Example: `\\dfrac{a+b}{(a+b)(a-b)}` → `\\dfrac{1}{a-b}`

2. **Polynomial Simplification:**
   - Expand: `(x+1)(x+2)` → `x^2 + 3x + 2`
   - Factor: `x^2 - 1` → `(x+1)(x-1)`
   - Collect like terms

3. **Trigonometric Identities:**
   - `sin^2(x) + cos^2(x)` → `1`
   - Angle addition formulas
   - Multiple angle formulas

4. **Expression Expansion:**
   - Distribute multiplication over addition
   - Expand powers of binomials

5. **Common Factor Extraction:**
   - `ab + ac` → `a(b + c)`

## Implementation Notes

### Pattern Matching

The `Pattern.ts` module provides utilities for matching AST patterns:

- `nodesEqual(a, b)`: Checks structural equality
- `isPower(node)`: Checks if node is a power operation
- `isMultiplication(node)`: Checks if node is multiplication
- `isDivision(node)`: Checks if node is division/fraction

### Rule Application

Rules are applied in a bottom-up manner:
1. Recursively simplify children first
2. Apply rules to the current node
3. Repeat until no changes occur (fixed point)

This ensures that deeply nested expressions are fully simplified.

## Contributing

When adding new rules:
1. Keep rules focused and modular
2. Document each rule with comments
3. Handle edge cases (divide by zero, etc.)
4. Test with both numeric and symbolic expressions
5. Consider commutativity and associativity

