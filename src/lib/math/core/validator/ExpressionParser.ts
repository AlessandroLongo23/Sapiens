import { Operator } from "@/lib/math/core/Operator";
import { TokenType } from "@/lib/math/core/validator/TokenType";
import type { Token } from "@/lib/math/core/validator/Token";
import { Lexer } from "@/lib/math/core/validator/Lexer";
import { 
    type ASTNode, 
    NumberNode, 
    VariableNode,
    BinaryOpNode, 
    UnaryOpNode, 
    FunctionNode 
} from "@/lib/math/core/validator/ASTNode";

export class ExpressionParser {
    private lexer: Lexer;
    private currentToken: Token;

    constructor(input: string) {
        this.lexer = new Lexer(input);
        this.currentToken = this.lexer.getNextToken();
    }

    private advance(): void {
        this.currentToken = this.lexer.getNextToken();
    }

    private expect(type: TokenType): Token {
        if (this.currentToken.type !== type) {
            throw new Error(
                `Expected token type ${type}, got ${this.currentToken.type} at position ${this.currentToken.position}`
            );
        }
        const token = this.currentToken;
        this.advance();
        return token;
    }

    parseToAST(): ASTNode {
        const ast = this.parseExpression();
        if (this.currentToken.type !== TokenType.EOF) {
            throw new Error(`Unexpected token at position ${this.currentToken.position}`);
        }
        return ast;
    }

    // Parse expression with addition and subtraction (lowest precedence)
    private parseExpression(): ASTNode {
        let left = this.parseTerm();

        while (
            this.currentToken.type === TokenType.OPERATOR &&
            (this.currentToken.value === Operator.ADDITION || 
             this.currentToken.value === Operator.SUBTRACTION)
        ) {
            const op = this.currentToken.value as Operator;
            this.advance();
            const right = this.parseTerm();
            left = new BinaryOpNode(op, left, right);
        }

        return left;
    }

    // Parse term with multiplication and division (including implicit multiplication)
    private parseTerm(): ASTNode {
        let left = this.parseFactor();

        while (true) {
            // Explicit multiplication or division
            if (
                this.currentToken.type === TokenType.OPERATOR &&
                (this.currentToken.value === Operator.MULTIPLICATION || 
                 this.currentToken.value === Operator.DIVISION)
            ) {
                const op = this.currentToken.value as Operator;
                this.advance();
                const right = this.parseFactor();
                left = new BinaryOpNode(op, left, right);
            }
            // Implicit multiplication: 2x, xy, 3(x+1), etc.
            else if (
                this.currentToken.type === TokenType.VARIABLE ||
                this.currentToken.type === TokenType.NUMBER ||
                this.currentToken.type === TokenType.LPAREN
            ) {
                const right = this.parseFactor();
                left = new BinaryOpNode(Operator.MULTIPLICATION, left, right);
            }
            else {
                break;
            }
        }

        return left;
    }

    // Parse factor with power (right associative)
    private parseFactor(): ASTNode {
        let left = this.parseUnary();

        if (
            this.currentToken.type === TokenType.OPERATOR &&
            this.currentToken.value === Operator.POWER
        ) {
            this.advance();
            const right = this.parseFactor(); // Right associative
            left = new BinaryOpNode(Operator.POWER, left, right);
        }

        // Postfix operators (factorial)
        if (
            this.currentToken.type === TokenType.OPERATOR &&
            this.currentToken.value === Operator.FACTORIAL
        ) {
            this.advance();
            left = new UnaryOpNode(Operator.FACTORIAL, left, false);
        }

        return left;
    }

    // Parse unary operators and functions
    private parseUnary(): ASTNode {
        // Unary minus
        if (
            this.currentToken.type === TokenType.OPERATOR &&
            this.currentToken.value === Operator.SUBTRACTION
        ) {
            this.advance();
            return new UnaryOpNode(Operator.SUBTRACTION, this.parseUnary(), true);
        }

        // Unary plus (just skip it)
        if (
            this.currentToken.type === TokenType.OPERATOR &&
            this.currentToken.value === Operator.ADDITION
        ) {
            this.advance();
            return this.parseUnary();
        }

        // Functions like sin, cos, sqrt, etc.
        if (this.currentToken.type === TokenType.FUNCTION) {
            const func = this.currentToken.value as Operator;
            this.advance();
            
            // Special handling for fractions: \frac{numerator}{denominator}
            if (func === Operator.FRACTION || func === Operator.DFRACTION) {
                this.expect(TokenType.LPAREN); // {
                const numerator = this.parseExpression();
                this.expect(TokenType.RPAREN); // }
                this.expect(TokenType.LPAREN); // {
                const denominator = this.parseExpression();
                this.expect(TokenType.RPAREN); // }
                
                return new BinaryOpNode(func, numerator, denominator);
            }
            
            // Regular functions with one argument
            this.expect(TokenType.LPAREN);
            const arg = this.parseExpression();
            this.expect(TokenType.RPAREN);

            return new FunctionNode(func, arg);
        }

        return this.parsePrimary();
    }

    // Parse primary expressions (numbers, variables, and parentheses)
    private parsePrimary(): ASTNode {
        // Numbers
        if (this.currentToken.type === TokenType.NUMBER) {
            const value = parseFloat(this.currentToken.value);
            this.advance();
            return new NumberNode(value);
        }

        // Variables
        if (this.currentToken.type === TokenType.VARIABLE) {
            const varName = this.currentToken.value;
            this.advance();
            return new VariableNode(varName);
        }

        // Parentheses
        if (this.currentToken.type === TokenType.LPAREN) {
            this.advance();
            const result = this.parseExpression();
            this.expect(TokenType.RPAREN);
            return result;
        }

        throw new Error(
            `Unexpected token at position ${this.currentToken.position}: ${this.currentToken.value}`
        );
    }
}