import { Operator } from "$lib/math/core/Operator";
import { TokenType } from "$lib/math/core/validator/TokenType";
import type { Token } from "$lib/math/core/validator/Token";


export class Lexer {
    private input: string;
    private position: number;
    private currentChar: string | null;

    constructor(input: string) {
        this.input = input.replace(/\s+/g, '');
        this.position = 0;
        this.currentChar = this.input[0] || null;
    }

    private advance(): void {
        this.position++;
        this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
    }

    private peek(offset: number = 1): string | null {
        const pos = this.position + offset;
        return pos < this.input.length ? this.input[pos] : null;
    }

    private readNumber(): string {
        let num = '';
        while (this.currentChar !== null && /[0-9.]/.test(this.currentChar)) {
            num += this.currentChar;
            this.advance();
        }
        return num;
    }

    private readVariable(): string {
        let variable = '';
        while (this.currentChar !== null && /[a-zA-Z]/.test(this.currentChar)) {
            variable += this.currentChar;
            this.advance();
        }
        return variable;
    }

    private readLatexCommand(): string {
        let command = '\\';
        this.advance(); // skip the backslash
        
        while (this.currentChar !== null && /[a-zA-Z]/.test(this.currentChar)) {
            command += this.currentChar;
            this.advance();
        }
        
        return command;
    }

    private isFunction(command: string): boolean {
        const functions = [
            Operator.SINE, Operator.COSINE, Operator.TANGENT, 
            Operator.COTANGENT, Operator.SECANT, Operator.COSECANT,
            Operator.ARCSINE, Operator.ARCCOSINE, Operator.ARCTANGENT,
            Operator.ARCCOTANGENT, Operator.ARCSECANT, Operator.ARCCOSECA,
            Operator.HYPERBOLIC_SINE, Operator.HYPERBOLIC_COSINE, 
            Operator.HYPERBOLIC_TANGENT, Operator.HYPERBOLIC_COTANGENT,
            Operator.HYPERBOLIC_SECANT, Operator.HYPERBOLIC_COSECANT,
            Operator.ROOT, Operator.LOGARITHM,
            Operator.FRACTION, Operator.DFRACTION
        ];
        return functions.includes(command as Operator);
    }

    getNextToken(): Token {
        while (this.currentChar !== null) {
            const pos = this.position;

            // Numbers
            if (/[0-9]/.test(this.currentChar)) {
                return {
                    type: TokenType.NUMBER,
                    value: this.readNumber(),
                    position: pos
                };
            }

            // Variables (single or multiple letters, but not LaTeX commands)
            if (/[a-zA-Z]/.test(this.currentChar)) {
                const variable = this.readVariable();
                return {
                    type: TokenType.VARIABLE,
                    value: variable,
                    position: pos
                };
            }

            // LaTeX commands (operators and functions)
            if (this.currentChar === '\\') {
                const command = this.readLatexCommand();
                
                // Handle \left and \right delimiters
                if (command === '\\left') {
                    // Read the delimiter that follows
                    const delimiterPos = this.position;
                    const delimiter = this.input[delimiterPos];
                    if (delimiter === '(' || delimiter === '[' || delimiter === '{') {
                        this.advance();
                        return {
                            type: TokenType.LPAREN,
                            value: '(',
                            position: pos
                        };
                    }
                    throw new Error(`Expected delimiter after \\left at position ${delimiterPos}`);
                }
                
                if (command === '\\right') {
                    // Read the delimiter that follows
                    const delimiterPos = this.position;
                    const delimiter = this.input[delimiterPos];
                    if (delimiter === ')' || delimiter === ']' || delimiter === '}') {
                        this.advance();
                        return {
                            type: TokenType.RPAREN,
                            value: ')',
                            position: pos
                        };
                    }
                    throw new Error(`Expected delimiter after \\right at position ${delimiterPos}`);
                }
                
                if (this.isFunction(command)) {
                    return {
                        type: TokenType.FUNCTION,
                        value: command,
                        position: pos
                    };
                } else {
                    return {
                        type: TokenType.OPERATOR,
                        value: command,
                        position: pos
                    };
                }
            }

            // Simple operators
            if (this.currentChar === '+') {
                this.advance();
                return {
                    type: TokenType.OPERATOR,
                    value: Operator.ADDITION,
                    position: pos
                };
            }

            if (this.currentChar === '-') {
                this.advance();
                return {
                    type: TokenType.OPERATOR,
                    value: Operator.SUBTRACTION,
                    position: pos
                };
            }

            if (this.currentChar === ':') {
                this.advance();
                return {
                    type: TokenType.OPERATOR,
                    value: Operator.DIVISION,
                    position: pos
                };
            }

            if (this.currentChar === '^') {
                this.advance();
                return {
                    type: TokenType.OPERATOR,
                    value: Operator.POWER,
                    position: pos
                };
            }

            if (this.currentChar === '!') {
                this.advance();
                return {
                    type: TokenType.OPERATOR,
                    value: Operator.FACTORIAL,
                    position: pos
                };
            }

            if (this.currentChar === '|') {
                this.advance();
                return {
                    type: TokenType.OPERATOR,
                    value: Operator.ABSOLUTE_VALUE,
                    position: pos
                };
            }

            // Parentheses and brackets
            if (this.currentChar === '(' || this.currentChar === '{' || this.currentChar === '[') {
                this.advance();
                return {
                    type: TokenType.LPAREN,
                    value: '(',
                    position: pos
                };
            }

            if (this.currentChar === ')' || this.currentChar === '}' || this.currentChar === ']') {
                this.advance();
                return {
                    type: TokenType.RPAREN,
                    value: ')',
                    position: pos
                };
            }

            throw new Error(`Unexpected character at position ${pos}: ${this.currentChar}`);
        }

        return {
            type: TokenType.EOF,
            value: '',
            position: this.position
        };
    }
}