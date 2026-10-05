import { ChartError, namesOf, parseExpression, showExpression, tokenize, type Expr, type Part, type Token } from './espressione';

/**
 * A flowchart in a lesson: a ```diagramma fence that holds a small program, one instruction per line, with the
 * body of a selection or of a loop indented under it. The page draws its chart and runs it one block at a time
 * (components/diagramma/Flowchart.tsx).
 *
 * ```diagramma
 * % nome: somma-da-uno-a-n
 * % alt: Diagramma di flusso che somma i numeri da 1 a n
 * % ingresso: 4
 * leggi n
 * s = 0
 * i = 1
 * finché i <= n
 *     s = s + i
 *     i = i + 1
 * scrivi s
 * ```
 *
 * The instructions: `leggi x`, `scrivi a, "testo"`, `x = espressione`, `se condizione` with an optional
 * `altrimenti`, `finché condizione`. Conditions are joined with `E`, `O` and `NON`, in capitals. `% ingresso:` gives the values already written in the field of each "leggi",
 * in order, separated by commas. The chart is structured: there is no way to write a jump, so every chart has a
 * program in Python and in C++ that does the same.
 */

export type Stmt =
	| { kind: 'assign'; line: number; name: string; expr: Expr; tokens: Token[] }
	| { kind: 'input'; line: number; name: string }
	| { kind: 'output'; line: number; items: { expr: Expr; tokens: Token[] }[] }
	| { kind: 'if'; line: number; cond: Expr; tokens: Token[]; then: Stmt[]; else: Stmt[] | null }
	| { kind: 'while'; line: number; cond: Expr; tokens: Token[]; body: Stmt[] };

export type ChartBlock = { name: string; alt: string; inputs: string[]; program: Stmt[] };

const NAME = /^[\p{L}_][\p{L}\d_]*$/u;
const RESERVED = ['leggi', 'scrivi', 'se', 'altrimenti', 'finché', 'finche', 'vero', 'falso', 'div', 'mod', 'and', 'or', 'not', 'true', 'false'];
const reserved = (name: string) => RESERVED.includes(name.toLowerCase()) || ['E', 'O', 'NON'].includes(name);

function expression(source: string): { expr: Expr; tokens: Token[] } {
	const tokens = tokenize(source);
	return { expr: parseExpression(tokens), tokens };
}

/** The items of "scrivi", split at the commas that are outside quotes and parentheses. */
function items(source: string): string[] {
	const out: string[] = [];
	let depth = 0;
	let quoted = false;
	let from = 0;
	[...source].forEach((c, i) => {
		if (c === '"') quoted = !quoted;
		else if (!quoted && c === '(') depth++;
		else if (!quoted && c === ')') depth--;
		else if (!quoted && depth === 0 && c === ',') {
			out.push(source.slice(from, i));
			from = i + 1;
		}
	});
	out.push(source.slice(from));
	return out;
}

export function parseChartBlock(source: string): { block: ChartBlock | null; errors: string[] } {
	const errors: string[] = [];
	const meta: Record<string, string> = {};
	const lines: { n: number; indent: number; text: string }[] = [];
	source.split(/\r?\n/).forEach((raw, i) => {
		const header = /^%\s*([\p{L}]+)\s*:\s*(.*)$/u.exec(raw.trim());
		if (header) meta[header[1].toLowerCase()] = header[2].trim();
		else if (raw.trim() && !raw.trim().startsWith('%')) lines.push({ n: i + 1, indent: raw.replace(/\t/g, '    ').search(/\S/), text: raw.trim() });
	});
	if (!meta.nome) errors.push('manca "% nome:"');
	if (!meta.alt) errors.push('manca "% alt:"');

	let at = 0;
	const body = (indent: number): Stmt[] => {
		const stmts: Stmt[] = [];
		while (at < lines.length && lines[at].indent >= indent) {
			const line = lines[at];
			if (line.indent > indent) {
				errors.push(`riga ${line.n}: il rientro non corrisponde a nessun blocco`);
				at++;
				continue;
			}
			if (/^altrimenti\b/i.test(line.text)) break;
			at++;
			try {
				const stmt = statement(line, indent);
				if (stmt) stmts.push(stmt);
			} catch (e) {
				if (!(e instanceof ChartError)) throw e;
				errors.push(`riga ${line.n}: ${e.message}`);
			}
		}
		return stmts;
	};

	const inner = (indent: number, what: string): Stmt[] => {
		if (at >= lines.length || lines[at].indent <= indent) throw new ChartError(`sotto "${what}" servono delle istruzioni rientrate`);
		return body(lines[at].indent);
	};

	const statement = (line: { n: number; text: string }, indent: number): Stmt | null => {
		const [, word, rest = ''] = /^(\S+)\s*(.*)$/.exec(line.text)!;
		switch (word.toLowerCase()) {
			case 'leggi':
				if (!NAME.test(rest) || reserved(rest)) throw new ChartError('dopo "leggi" va il nome di una variabile');
				return { kind: 'input', line: line.n, name: rest };
			case 'scrivi':
				return { kind: 'output', line: line.n, items: items(rest).map(expression) };
			case 'se': {
				const cond = expression(rest.replace(/:$/, ''));
				const then = inner(indent, 'se');
				let otherwise: Stmt[] | null = null;
				if (at < lines.length && lines[at].indent === indent && /^altrimenti:?$/i.test(lines[at].text)) {
					at++;
					otherwise = inner(indent, 'altrimenti');
				}
				return { kind: 'if', line: line.n, cond: cond.expr, tokens: cond.tokens, then, else: otherwise };
			}
			case 'finché':
			case 'finche': {
				const cond = expression(rest.replace(/:$/, ''));
				return { kind: 'while', line: line.n, cond: cond.expr, tokens: cond.tokens, body: inner(indent, 'finché') };
			}
			case 'altrimenti':
				throw new ChartError('"altrimenti" senza un "se" prima');
			default: {
				const assign = /^(\S+)\s*=(?!=)\s*(.*)$/.exec(line.text);
				if (!assign) throw new ChartError(`"${line.text}" non è un'istruzione`);
				if (!NAME.test(assign[1]) || reserved(assign[1])) throw new ChartError(`${assign[1]} non può essere il nome di una variabile`);
				return { kind: 'assign', line: line.n, name: assign[1], ...expression(assign[2]) };
			}
		}
	};

	const program = body(0);
	// an "altrimenti" left at the top level stops body() without being read
	if (at < lines.length) errors.push(`riga ${lines[at].n}: "altrimenti" senza un "se" prima`);
	if (!program.length && !errors.length) errors.push('il diagramma è vuoto');
	if (errors.length) return { block: null, errors };
	const inputs = meta.ingresso ? meta.ingresso.split(',').map((v) => v.trim()) : [];
	return { block: { name: meta.nome, alt: meta.alt, inputs, program }, errors };
}

/** What each kind of block shows: the assignment with its arrow, the condition with its question mark. */
export function labelOf(stmt: Stmt): Part[] {
	switch (stmt.kind) {
		case 'assign':
			return [{ text: stmt.name, name: true }, { text: ' ← ' }, ...showExpression(stmt.tokens)];
		case 'input':
			return [{ text: 'leggi ' }, { text: stmt.name, name: true }];
		case 'output':
			return [{ text: 'scrivi ' }, ...stmt.items.flatMap((item, i) => [...(i ? [{ text: ', ' }] : []), ...showExpression(item.tokens)])];
		default:
			return [...showExpression(stmt.tokens), { text: '?' }];
	}
}

/** The variables a block reads, for the table beside the chart. */
export function readsOf(stmt: Stmt): string[] {
	if (stmt.kind === 'input') return [];
	if (stmt.kind === 'output') return [...new Set(stmt.items.flatMap((item) => namesOf(item.tokens)))];
	return namesOf(stmt.tokens);
}
