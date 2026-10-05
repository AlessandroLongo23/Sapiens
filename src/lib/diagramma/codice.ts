import type { InputType, Stmt } from './blocco';
import { readValue, type Expr } from './espressione';

/**
 * The program of a chart written in Python and in C++, line by line. Each line remembers the block it comes from,
 * so the page can light the line of the block the run is on, and a change to the chart shows at once in the code.
 *
 * C++ wants a type for every variable, which the chart does not write: it is worked out from the values the
 * variable takes (`types`). The division `/` of a chart never drops the decimals, so between two integers the C++
 * line converts one of them.
 */

export type CodeLanguage = 'python' | 'cpp';
export const CODE_LANGUAGES: Record<CodeLanguage, string> = { python: 'Python', cpp: 'C++' };
export type CodeLine = { text: string; stmt?: Stmt };

type Type = InputType | 'bool';

function each(program: Stmt[], visit: (stmt: Stmt, top: boolean) => void, top = true) {
	for (const stmt of program) {
		visit(stmt, top);
		if (stmt.kind === 'while') each(stmt.body, visit, false);
		if (stmt.kind === 'if') {
			each(stmt.then, visit, false);
			if (stmt.else) each(stmt.else, visit, false);
		}
	}
}

function exprsOf(stmt: Stmt): Expr[] {
	return stmt.kind === 'input' ? [] : stmt.kind === 'assign' ? [stmt.expr] : stmt.kind === 'output' ? stmt.items.map((item) => item.expr) : [stmt.cond];
}

/** Whether `name` meets a text somewhere: compared with one, or joined to one. */
function meetsText(expr: Expr, name: string): boolean {
	if (expr.kind === 'unary') return meetsText(expr.operand, name);
	if (expr.kind !== 'binary') return false;
	const text = (e: Expr) => e.kind === 'value' && typeof e.value === 'string';
	const named = (e: Expr) => e.kind === 'name' && e.name === name;
	return (named(expr.left) && text(expr.right)) || (named(expr.right) && text(expr.left)) || meetsText(expr.left, name) || meetsText(expr.right, name);
}

function typeOf(expr: Expr, types: Record<string, Type>): Type {
	switch (expr.kind) {
		case 'value':
			return typeof expr.value === 'string' ? 'str' : typeof expr.value === 'boolean' ? 'bool' : expr.decimal ? 'float' : 'int';
		case 'name':
			return types[expr.name] ?? 'int';
		case 'unary':
			return expr.operator === 'non' ? 'bool' : typeOf(expr.operand, types);
		case 'binary': {
			if (['e', 'o', '==', '!=', '<', '<=', '>', '>='].includes(expr.operator)) return 'bool';
			const left = typeOf(expr.left, types);
			const right = typeOf(expr.right, types);
			if (left === 'str' || right === 'str') return 'str';
			if (expr.operator === '/') return 'float';
			return left === 'float' || right === 'float' ? 'float' : 'int';
		}
	}
}

/**
 * The type of every variable. A "leggi" has the type it declares, or that of the value the lesson suggests for it,
 * or a text when the program treats it as one, or an integer. A variable that takes an integer in one place and a
 * decimal in another is a decimal.
 */
export function typesOf(program: Stmt[], samples: string[] = []): Record<string, Type> {
	const types: Record<string, Type> = {};
	const join = (name: string, type: Type) => {
		const now = types[name];
		types[name] = !now || (now === 'int' && type === 'float') ? type : now;
	};
	let asked = 0;
	each(program, (stmt) => {
		if (stmt.kind !== 'input') return;
		const sample = samples[asked++];
		const value = sample ? readValue(sample) : null;
		let text = false;
		each(program, (other) => {
			if (exprsOf(other).some((expr) => meetsText(expr, stmt.name))) text = true;
		});
		join(stmt.name, stmt.type ?? (typeof value === 'string' ? 'str' : typeof value === 'number' ? (Number.isInteger(value) && !/[.,]/.test(sample) ? 'int' : 'float') : text ? 'str' : 'int'));
	});
	// twice more than once: a variable computed from one that turns out a decimal later is a decimal too
	for (let pass = 0; pass < 3; pass++)
		each(program, (stmt) => {
			if (stmt.kind === 'assign') join(stmt.name, typeOf(stmt.expr, types));
		});
	return types;
}

const PYTHON: Record<string, string> = { e: 'and', o: 'or' };
const CPP: Record<string, string> = { e: '&&', o: '||' };
const LEVEL: Record<string, number> = { o: 1, e: 2, '==': 4, '!=': 4, '<': 4, '<=': 4, '>': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '//': 6, '%': 6 };

/** An expression in a language, with the parentheses its precedence asks for. */
function write(expr: Expr, language: CodeLanguage, types: Record<string, Type>, uses: Set<string>): { text: string; level: number } {
	const wrap = (inner: { text: string; level: number }, least: number) => (inner.level < least ? `(${inner.text})` : inner.text);
	switch (expr.kind) {
		case 'value':
			if (typeof expr.value === 'string') return { text: JSON.stringify(expr.value), level: 9 };
			if (typeof expr.value === 'boolean') return { text: language === 'python' ? (expr.value ? 'True' : 'False') : String(expr.value), level: 9 };
			return { text: expr.decimal && Number.isInteger(expr.value) ? `${expr.value}.0` : String(expr.value), level: 9 };
		case 'name':
			return { text: expr.name, level: 9 };
		case 'unary': {
			const operand = write(expr.operand, language, types, uses);
			if (expr.operator === '-') return { text: `-${wrap(operand, 7)}`, level: 7 };
			return language === 'python' ? { text: `not ${wrap(operand, 3)}`, level: 3 } : { text: `!${wrap(operand, 8)}`, level: 7 };
		}
		case 'binary': {
			const level = LEVEL[expr.operator];
			const left = wrap(write(expr.left, language, types, uses), level);
			const right = wrap(write(expr.right, language, types, uses), level + 1);
			if (language === 'python') return { text: `${left} ${PYTHON[expr.operator] ?? expr.operator} ${right}`, level };
			const whole = typeOf(expr.left, types) === 'int' && typeOf(expr.right, types) === 'int';
			if (expr.operator === '/' && whole) return { text: `(double) ${left} / ${right}`, level };
			if (expr.operator === '//' && !whole) {
				uses.add('cmath');
				return { text: `floor(${left} / ${right})`, level: 9 };
			}
			if (expr.operator === '%' && !whole) {
				uses.add('cmath');
				return { text: `fmod(${left}, ${right})`, level: 9 };
			}
			return { text: `${left} ${expr.operator === '//' ? '/' : (CPP[expr.operator] ?? expr.operator)} ${right}`, level };
		}
	}
}

function python(program: Stmt[], types: Record<string, Type>, indent: string, lines: CodeLine[]) {
	const text = (expr: Expr) => write(expr, 'python', types, new Set()).text;
	if (!program.length) lines.push({ text: `${indent}pass` });
	for (const stmt of program) {
		switch (stmt.kind) {
			case 'input': {
				const type = types[stmt.name];
				lines.push({ text: `${indent}${stmt.name} = ${type === 'str' ? 'input()' : `${type === 'float' ? 'float' : 'int'}(input())`}`, stmt });
				break;
			}
			case 'assign':
				lines.push({ text: `${indent}${stmt.name} = ${text(stmt.expr)}`, stmt });
				break;
			case 'output':
				lines.push({ text: `${indent}print(${stmt.items.map((item) => text(item.expr)).join(', ')})`, stmt });
				break;
			case 'while':
				lines.push({ text: `${indent}while ${text(stmt.cond)}:`, stmt });
				python(stmt.body, types, indent + '    ', lines);
				break;
			default:
				lines.push({ text: `${indent}if ${text(stmt.cond)}:`, stmt });
				python(stmt.then, types, indent + '    ', lines);
				if (stmt.else) {
					lines.push({ text: `${indent}else:` });
					python(stmt.else, types, indent + '    ', lines);
				}
		}
	}
}

const CPP_TYPES: Record<Type, string> = { int: 'int', float: 'double', str: 'string', bool: 'bool' };

function cpp(program: Stmt[], types: Record<string, Type>, indent: string, lines: CodeLine[], declared: Set<string>, uses: Set<string>) {
	const text = (expr: Expr) => write(expr, 'cpp', types, uses).text;
	for (const stmt of program) {
		switch (stmt.kind) {
			case 'input':
				if (!declared.has(stmt.name)) lines.push({ text: `${indent}${CPP_TYPES[types[stmt.name]]} ${stmt.name};` });
				declared.add(stmt.name);
				lines.push({ text: `${indent}cin >> ${stmt.name};`, stmt });
				break;
			case 'assign':
				lines.push({ text: `${indent}${declared.has(stmt.name) ? '' : `${CPP_TYPES[types[stmt.name]]} `}${stmt.name} = ${text(stmt.expr)};`, stmt });
				declared.add(stmt.name);
				break;
			case 'output':
				lines.push({
					text: `${indent}cout << ${stmt.items
						.map((item) => write(item.expr, 'cpp', types, uses))
						.map((item) => (item.level < 5 ? `(${item.text})` : item.text))
						.join(' << " " << ')} << endl;`,
					stmt
				});
				break;
			case 'while':
				lines.push({ text: `${indent}while (${text(stmt.cond)}) {`, stmt });
				cpp(stmt.body, types, indent + '    ', lines, declared, uses);
				lines.push({ text: `${indent}}` });
				break;
			default:
				lines.push({ text: `${indent}if (${text(stmt.cond)}) {`, stmt });
				cpp(stmt.then, types, indent + '    ', lines, declared, uses);
				if (stmt.else) {
					lines.push({ text: `${indent}} else {` });
					cpp(stmt.else, types, indent + '    ', lines, declared, uses);
				}
				lines.push({ text: `${indent}}` });
		}
	}
}

/** The chart as a program in `language`. `samples` are the values the lesson suggests for each "leggi". */
export function codeOf(program: Stmt[], language: CodeLanguage, samples: string[] = []): CodeLine[] {
	const types = typesOf(program, samples);
	const lines: CodeLine[] = [];
	if (language === 'python') {
		if (program.length) python(program, types, '', lines);
		return lines;
	}
	// a variable that first gets its value inside a branch or a loop is declared before, where all the program sees it
	const first = new Map<string, boolean>();
	each(program, (stmt, top) => {
		if ((stmt.kind === 'assign' || stmt.kind === 'input') && !first.has(stmt.name)) first.set(stmt.name, top);
	});
	const early = [...first].filter(([, top]) => !top).map(([name]) => name);
	const uses = new Set<string>();
	const body: CodeLine[] = early.map((name) => ({ text: `    ${CPP_TYPES[types[name]]} ${name};` }));
	cpp(program, types, '    ', body, new Set(early), uses);
	if (Object.values(types).includes('str')) uses.add('string');
	const includes = ['iostream', ...['string', 'cmath'].filter((name) => uses.has(name))].map((name) => ({ text: `#include <${name}>` }));
	return [...includes, { text: 'using namespace std;' }, { text: '' }, { text: 'int main() {' }, ...body, { text: '    return 0;' }, { text: '}' }];
}

export const codeText = (lines: CodeLine[]) => lines.map((line) => line.text).join('\n') + '\n';
