export enum Operator {
    // basic operators
    ADDITION = '+',
    SUBTRACTION = '-',
    MULTIPLICATION = '\\times',
    DIVISION = ':',
    FRACTION = '\\frac',
    DFRACTION = '\\dfrac',

    // powers
    POWER = '^',
    ROOT = '\\sqrt',
    
    FACTORIAL = '!',
    ABSOLUTE_VALUE = '|',
    LOGARITHM = '\\log',
    EXPONENTIAL = 'e^',

    // Trigonometric functions
    SINE = '\\sin',
    COSINE = '\\cos',
    TANGENT = '\\tan',
    COTANGENT = '\\cot',
    SECANT = '\\sec',
    COSECANT = '\\csc',

    // Inverse trigonometric functions
    ARCSINE = '\\arcsin',
    ARCCOSINE = '\\arccos',
    ARCTANGENT = '\\arctan',
    ARCCOTANGENT = '\\arccot',
    ARCSECANT = '\\arcsec',
    ARCCOSECA = '\\arccsc',

    // Hyperbolic functions
    HYPERBOLIC_SINE = '\\sinh',
    HYPERBOLIC_COSINE = '\\cosh',
    HYPERBOLIC_TANGENT = '\\tanh',
    HYPERBOLIC_COTANGENT = '\\coth',
    HYPERBOLIC_SECANT = '\\sech',
    HYPERBOLIC_COSECANT = '\\csch',
}