export const monomialPattern: RegExp = /^\s*([+-]?(?:\d+(?:\.\d+)?|\\(?:d?frac|frac)\{[^{}]+\}\{[^{}]+\}))?\s*(([a-z](?:\^\{?\d+\}?)*\s*)+)\s*$/;
export const monomialVariablesPattern: RegExp = /([a-z])(?:\^(\d+))?/gi;
export const fractionPattern: RegExp = /\d?frac\{(\d+)\}\{(\d+)\}/;
export const polynomialPattern: RegExp = /${monomialPattern.source}(?:\\s*\\+\\s*${monomialPattern.source})*/;