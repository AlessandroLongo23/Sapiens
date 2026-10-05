/**
 * The constructs a flowchart or a program is made of, for the exercises that ask for one by name ("usa un ciclo
 * while") or that are about one (a lesson on loops answered with six `print` in a row).
 *
 * A level lists in `needs` what its answer must contain; the answer is graded on what it writes first, and then on
 * this. A chart is read from its statements. A program is read from its words: comments and texts are taken out,
 * and what is left is searched for the reserved words of the language, which can be nothing else there.
 *
 * It tells that a construct is there, not that it does the work: a loop of one turn beside six `print` passes. The
 * levels that can read their numbers do, so that what they write cannot be typed by hand.
 */
import type { Stmt } from '../../diagramma/blocco';
import type { Construct } from './types';

/** The constructs of a flowchart: it has loops and selections, and no `for`. */
export function chartConstructs(program: Stmt[]): Set<Construct> {
	const found = new Set<Construct>();
	const visit = (stmts: Stmt[]) => {
		for (const s of stmts) {
			if (s.kind === 'while') {
				found.add('ciclo').add('while');
				visit(s.body);
			}
			if (s.kind === 'if') {
				found.add('selezione');
				visit(s.then);
				if (s.else) visit(s.else);
			}
		}
	};
	visit(program);
	return found;
}

/** A program without its comments and with its texts emptied, so that a word inside them is not taken for code. */
export function bare(code: string, language: 'python' | 'cpp'): string {
	let out = '';
	let i = 0;
	while (i < code.length) {
		const c = code[i];
		if (language === 'python' && c === '#') {
			while (i < code.length && code[i] !== '\n') i++;
		} else if (language === 'cpp' && code.startsWith('//', i)) {
			while (i < code.length && code[i] !== '\n') i++;
		} else if (language === 'cpp' && code.startsWith('/*', i)) {
			const end = code.indexOf('*/', i + 2);
			i = end < 0 ? code.length : end + 2;
			out += ' ';
		} else if (c === '"' || c === "'") {
			const quote = language === 'python' && code.startsWith(c.repeat(3), i) ? c.repeat(3) : c;
			i += quote.length;
			while (i < code.length && !code.startsWith(quote, i)) {
				// a text of one line ends with its line even when it is left open
				if (quote.length === 1 && code[i] === '\n') break;
				i += code[i] === '\\' ? 2 : 1;
			}
			i += quote.length;
			out += '""';
		} else {
			out += c;
			i++;
		}
	}
	return out;
}

/** The constructs of a program in Python or in C++. */
export function codeConstructs(code: string, language: 'python' | 'cpp'): Set<Construct> {
	const text = bare(code, language);
	const has = (word: string) => new RegExp(`\\b${word}\\b`).test(text);
	const found = new Set<Construct>();
	if (has('while')) found.add('ciclo').add('while');
	if (has('for')) found.add('ciclo').add('for');
	if (has('if') || (language === 'python' ? has('elif') || /^\s*match\b.*:\s*$/m.test(text) : has('switch') || text.includes('?'))) found.add('selezione');
	return found;
}

/** The first of `needs` that is not among `found`, or null when all are. */
export const missing = (needs: readonly Construct[] | undefined, found: Set<Construct>): Construct | null => needs?.find((n) => !found.has(n)) ?? null;

/** What to tell a student whose answer writes the right things without the construct that was asked for. */
export function missingMessage(construct: Construct, kind: 'chart' | 'program'): string {
	if (kind === 'chart') return `Il diagramma scrive il risultato giusto, ma manca ${construct === 'selezione' ? 'una selezione: serve un rombo che sceglie tra due strade' : 'un ciclo: serve un rombo con la freccia che torna indietro'}.`;
	const asked = { ciclo: 'un ciclo', selezione: 'una selezione', while: 'un ciclo while', for: 'un ciclo for' }[construct];
	return `Il programma scrive il risultato giusto, ma l’esercizio chiede ${asked}, e qui non c’è.`;
}
