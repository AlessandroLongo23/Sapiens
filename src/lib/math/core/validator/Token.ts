import { TokenType } from "$lib/math/core/validator/TokenType";

export interface Token {
    type: TokenType;
    value: string;
    position: number;
}p