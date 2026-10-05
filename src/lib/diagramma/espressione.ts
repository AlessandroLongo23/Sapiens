/**
 * The expressions of a flowchart (lib/diagramma/blocco.ts): numbers, texts and truth values, with the operators a
 * first course of programming uses. They are read into a tree and evaluated here, with no `eval`: a block of a
 * lesson, and later a student's own chart, never reaches the page's JavaScript.
 *
 * `/` is the division of the calculator (7 / 2 is 3,5); `//` and `%` are the quotient and the remainder of the
 * division between integers.
 */

export type Value = number | string | boolean;

export type Token = { kind: 'number' | 'text' | 'name' | 'operator' | 'word' | 'open' | 'close'; text: string };

export type Expr = { kind: 'value'; value: Value; decimal?: boolean } | { kind: 'name'; name: string } | { kind: 'unary'; operator: '-' | 'non'; operand: Expr } | { kind: 'binary'; operator: string; left: Expr; right: Expr };

/** A mistake in a chart, in words for whoever is reading it. */
export class ChartError extends Error {}

/** The words of the language. "E", "O" and "NON" are capitals, so that `e` and `o` stay free as names of variables. */
const WORDS: Record<string, string> = { and: 'e', or: 'o', not: 'non', E: 'e', O: 'o', NON: 'non', div: '//', mod: '%', true: 'vero', false: 'falso', vero: 'vero', falso: 'falso' };
const OPERATORS = ['//', '==', '!=', '<=', '>=', '+', '-', '*', '/', '%', '<', '>'];

export function tokenize(source: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;
	while (i < source.length) {
		const rest = source.slice(i);
		const space = /^\s+/.exec(rest);
		if (space) {
			i += space[0].length;
			continue;
		}
		const number = /^\d+(\.\d+)?/.exec(rest);
		if (number) {
			tokens.push({ kind: 'number', text: number[0] });
			i += number[0].length;
			continue;
		}
		if (rest[0] === '"') {
			const end = rest.indexOf('"', 1);
			if (end < 0) throw new ChartError('manca la chiusura delle virgolette');
			tokens.push({ kind: 'text', text: rest.slice(1, end) });
			i += end + 1;
			continue;
		}
		const name = /^[\p{L}_][\p{L}\d_]*/u.exec(rest);
		if (name) {
			const word = WORDS[name[0]];
			if (word === '//' || word === '%') tokens.push({ kind: 'operator', text: word });
			else if (word) tokens.push({ kind: 'word', text: word });
			else tokens.push({ kind: 'name', text: name[0] });
			i += name[0].length;
			continue;
		}
		const operator = OPERATORS.find((o) => rest.startsWith(o));
		if (operator) {
			tokens.push({ kind: 'operator', text: operator });
			i += operator.length;
			continue;
		}
		if (rest[0] === '(' || rest[0] === ')') {
			tokens.push({ kind: rest[0] === '(' ? 'open' : 'close', text: rest[0] });
			i += 1;
			continue;
		}
		if (rest[0] === '=') throw new ChartError('per confrontare due valori si scrive ==');
		throw new ChartError(`il segno ${rest[0]} non si può usare`);
	}
	return tokens;
}

const LEVELS: string[][] = [['o'], ['e'], ['==', '!=', '<', '<=', '>', '>='], ['+', '-'], ['*', '/', '//', '%']];

export function parseExpression(tokens: Token[]): Expr {
	let at = 0;
	const peek = () => tokens[at] as Token | undefined;

	const primary = (): Expr => {
		const token = tokens[at++] as Token | undefined;
		if (!token) throw new ChartError("l'espressione è incompleta");
		if (token.kind === 'number') return token.text.includes('.') ? { kind: 'value', value: Number(token.text), decimal: true } : { kind: 'value', value: Number(token.text) };
		if (token.kind === 'text') return { kind: 'value', value: token.text };
		if (token.kind === 'name') return { kind: 'name', name: token.text };
		if (token.kind === 'word' && (token.text === 'vero' || token.text === 'falso')) return { kind: 'value', value: token.text === 'vero' };
		if (token.kind === 'open') {
			const inside = level(0);
			if (tokens[at++]?.kind !== 'close') throw new ChartError('manca una parentesi chiusa');
			return inside;
		}
		throw new ChartError(`${token.text} non è al suo posto`);
	};

	const unary = (): Expr => {
		const token = peek();
		if (token?.kind === 'operator' && token.text === '-') {
			at++;
			return { kind: 'unary', operator: '-', operand: unary() };
		}
		return primary();
	};

	const level = (n: number): Expr => {
		if (n === LEVELS.length) return unary();
		// "non" binds looser than a comparison and tighter than "e": non a > b is non (a > b)
		if (n === 2 && peek()?.kind === 'word' && peek()?.text === 'non') {
			at++;
			return { kind: 'unary', operator: 'non', operand: level(2) };
		}
		let left = level(n + 1);
		for (;;) {
			const token = peek();
			if (!token || (token.kind !== 'operator' && token.kind !== 'word') || !LEVELS[n].includes(token.text)) return left;
			at++;
			left = { kind: 'binary', operator: token.text, left, right: level(n + 1) };
		}
	};

	if (!tokens.length) throw new ChartError("manca l'espressione");
	const expr = level(0);
	if (at < tokens.length) throw new ChartError(`${tokens[at].text} non è al suo posto`);
	return expr;
}

/** The names an expression reads, each once, in the order they appear. */
export function namesOf(tokens: Token[]): string[] {
	return [...new Set(tokens.filter((t) => t.kind === 'name').map((t) => t.text))];
}

const kindOf = (value: Value) => (typeof value === 'number' ? 'un numero' : typeof value === 'string' ? 'un testo' : 'un valore vero o falso');

function number(value: Value, operator: string): number {
	if (typeof value !== 'number') throw new ChartError(`${shownOperator(operator)} lavora sui numeri, e ${showValue(value, true)} è ${kindOf(value)}`);
	return value;
}

function truth(value: Value, what: string): boolean {
	if (typeof value !== 'boolean') throw new ChartError(`${what} vuole un valore vero o falso, e ${showValue(value, true)} è ${kindOf(value)}`);
	return value;
}

export function evaluate(expr: Expr, variables: Record<string, Value>): Value {
	switch (expr.kind) {
		case 'value':
			return expr.value;
		case 'name': {
			if (!(expr.name in variables)) throw new ChartError(`la variabile ${expr.name} non ha ancora un valore`);
			return variables[expr.name];
		}
		case 'unary': {
			const operand = evaluate(expr.operand, variables);
			return expr.operator === '-' ? -number(operand, '-') : !truth(operand, 'NON');
		}
		case 'binary': {
			const { operator } = expr;
			const left = evaluate(expr.left, variables);
			if (operator === 'e') return truth(left, 'E') && truth(evaluate(expr.right, variables), 'E');
			if (operator === 'o') return truth(left, 'O') || truth(evaluate(expr.right, variables), 'O');
			const right = evaluate(expr.right, variables);
			if (operator === '==' || operator === '!=') {
				if (typeof left !== typeof right) throw new ChartError(`non si confrontano ${kindOf(left)} e ${kindOf(right)}`);
				return (left === right) === (operator === '==');
			}
			if (operator === '+' && typeof left === 'string' && typeof right === 'string') return left + right;
			if (['<', '<=', '>', '>='].includes(operator) && typeof left === 'string' && typeof right === 'string') return compare(operator, left < right ? -1 : left > right ? 1 : 0);
			const a = number(left, operator);
			const b = number(right, operator);
			switch (operator) {
				case '+':
					return a + b;
				case '-':
					return a - b;
				case '*':
					return a * b;
				case '/':
				case '//':
				case '%': {
					if (b === 0) throw new ChartError('non si può dividere per zero');
					if (operator === '/') return a / b;
					const quotient = Math.floor(a / b);
					return operator === '//' ? quotient : a - b * quotient;
				}
				default:
					return compare(operator, a < b ? -1 : a > b ? 1 : 0);
			}
		}
	}
}

function compare(operator: string, order: number): boolean {
	return operator === '<' ? order < 0 : operator === '<=' ? order <= 0 : operator === '>' ? order > 0 : order >= 0;
}

/** A value as the chart writes it: the decimal comma, and a text in quotes only where it stands among code. */
export function showValue(value: Value, quoted = false): string {
	if (typeof value === 'boolean') return value ? 'vero' : 'falso';
	if (typeof value === 'string') return quoted ? `“${value}”` : value;
	if (!Number.isFinite(value)) return 'un numero troppo grande';
	const text = Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(10)));
	return text.replace('.', ',').replace('-', '−');
}

/** What a student typed for "leggi": a number when it reads as one, with the comma or the point, otherwise a text. */
export function readValue(typed: string): Value {
	const text = typed.trim();
	if (/^[+\-−]?\d+([.,]\d+)?$/.test(text)) return Number(text.replace(',', '.').replace('−', '-'));
	return text;
}

const SHOWN: Record<string, string> = { '*': '·', '<=': '≤', '>=': '≥', '!=': '≠', '==': '=', '-': '−', '//': 'div', '%': 'mod' };
const SHOWN_WORDS: Record<string, string> = { e: 'E', o: 'O', non: 'NON' };

const shownOperator = (operator: string) => SHOWN[operator] ?? operator;

/** A piece of a label: names are set in italics, the rest upright. */
export type Part = { text: string; name?: boolean };

/**
 * The expression as a block of the chart shows it (≤ for <=, · for *). With `variables`, every name is replaced by
 * its value: `i ≤ n` becomes `6 ≤ 5`, which is what explains why a condition is true or false.
 */
export function showExpression(tokens: Token[], variables?: Record<string, Value>): Part[] {
	const parts: Part[] = [];
	let sign = false;
	tokens.forEach((token, i) => {
		const before = tokens[i - 1];
		const space = before && before.kind !== 'open' && token.kind !== 'close' && !sign ? ' ' : '';
		// a minus with nothing to subtract from is the sign of what follows, and stays attached to it
		sign = token.kind === 'operator' && token.text === '-' && (!before || before.kind === 'operator' || before.kind === 'word' || before.kind === 'open');
		const name = token.kind === 'name' && !(variables && token.text in variables);
		const text =
			token.kind === 'name'
				? name
					? token.text
					: showValue(variables![token.text], true)
				: token.kind === 'number'
					? token.text.replace('.', ',')
					: token.kind === 'text'
						? `“${token.text}”`
						: token.kind === 'operator'
							? shownOperator(token.text)
							: (SHOWN_WORDS[token.text] ?? token.text);
		const last = parts[parts.length - 1];
		if (name) {
			if (space && last) last.text += space;
			parts.push({ text, name: true });
		} else if (last && !last.name) last.text += space + text;
		else parts.push({ text: space + text });
	});
	return parts;
}

const WRITTEN: Record<string, string> = { e: 'E', o: 'O', non: 'NON' };

/** The expression as it is written in a block of a lesson, from its tokens: what `tokenize` reads back the same. */
export function sourceOf(tokens: Token[]): string {
	let sign = false;
	return tokens
		.map((token, i) => {
			const before = tokens[i - 1];
			const space = before && before.kind !== 'open' && token.kind !== 'close' && !sign ? ' ' : '';
			sign = token.kind === 'operator' && token.text === '-' && (!before || before.kind === 'operator' || before.kind === 'word' || before.kind === 'open');
			return space + (token.kind === 'text' ? `"${token.text}"` : token.kind === 'word' ? (WRITTEN[token.text] ?? token.text) : token.text);
		})
		.join('');
}

export const textOf = (parts: Part[]) => parts.map((p) => p.text).join('');
