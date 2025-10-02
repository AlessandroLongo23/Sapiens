import { TokenType } from "$lib/math/validator/TokenType";

export interface Token {
    type: TokenType;
    value: string;
    position: number;
}