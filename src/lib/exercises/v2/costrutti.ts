/**
 * The constructs a flowchart or a program is made of, for the exercises that ask for one by name ("usa un ciclo
 * while") or that are about one (a lesson on loops answered with six `print` in a row).
 *
 * A level lists in `needs` what its answer must contain; the answer is graded on what it writes first, and then on
 * this. A chart is read from its statements. A program is read from its words: comments and texts are taken out,
 * and what is left is searched for the reserved words of the language, which can be nothing else there.
 *
 * It tells that a construct is there, not that it does the work: a loop of one turn beside six `print` would pass.
 * So a level that asks for a construct reads its numbers and is tried on runs that write different things
 * (`makeGenerator` checks it): what it writes cannot be typed by hand, one line after the other.
 */
import type { Stmt } from '../../diagramma/blocco';
import type { Construct } from './types';

/** The constructs of a flowchart: it has loops and selections, and no `for`. */
export function chartConstructs(program: Stmt[]): Set<Construct> {
	const found = new Set<Construct>();
	const visit = (stmts: Stmt[], looping: boolean) => {
		for (const s of stmts) {
			if (s.kind === 'while') {
				found.add('ciclo').add('while');
				if (looping) found.add('annidati');
				visit(s.body, true);
			}
			if (s.kind === 'if') {
				found.add('selezione');
				visit(s.then, looping);
				if (s.else) visit(s.else, looping);
			}
		}
	};
	visit(program, false);
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

/** Whether a Python program has a loop in the body of another: a `while` or a `for` indented under one. */
function nestedPython(text: string): boolean {
	const open: number[] = [];
	for (const row of text.split('\n')) {
		if (!row.trim()) continue;
		const indent = row.length - row.trimStart().length;
		while (open.length && open[open.length - 1] >= indent) open.pop();
		if (/^\s*(while|for)\b/.test(row)) {
			if (open.length) return true;
			open.push(indent);
		}
	}
	return false;
}

/**
 * Whether a C++ program has a loop in the body of another. The body of a loop is the block after its round
 * brackets, or the one instruction that follows them; the `while` that closes a `do` is not a loop of its own.
 */
function nestedCpp(text: string): boolean {
	// the depth of the braces at which the block of each open loop was opened
	const open: number[] = [];
	const words = /\b(for|while|do)\b|[{};]/g;
	let depth = 0;
	// a loop whose body is the next instruction, without braces
	let single = false;
	for (let m = words.exec(text); m; m = words.exec(text)) {
		const word = m[0];
		if (word === '{') {
			if (single) open.push(depth);
			single = false;
			depth++;
		} else if (word === '}') {
			depth--;
			if (open[open.length - 1] === depth) open.pop();
		} else if (word === ';') single = false;
		else {
			let i = words.lastIndex;
			if (word !== 'do') {
				// past the round brackets of the loop
				while (i < text.length && text[i] !== '(' && /\s/.test(text[i])) i++;
				let round = 0;
				for (; i < text.length; i++) {
					if (text[i] === '(') round++;
					if (text[i] === ')' && --round === 0) break;
				}
				i++;
			}
			const rest = text.slice(i).trimStart();
			words.lastIndex = text.length - rest.length;
			if (word === 'while' && rest.startsWith(';')) continue;
			if (open.length || single) return true;
			if (rest.startsWith('{')) {
				open.push(depth);
				depth++;
				words.lastIndex++;
			} else single = true;
		}
	}
	return false;
}

/** The constructs of a program in Python or in C++. */
export function codeConstructs(code: string, language: 'python' | 'cpp'): Set<Construct> {
	const text = bare(code, language);
	const has = (word: string) => new RegExp(`\\b${word}\\b`).test(text);
	const found = new Set<Construct>();
	if (has('while')) found.add('ciclo').add('while');
	if (has('for')) found.add('ciclo').add('for');
	if (has('if') || (language === 'python' ? has('elif') || /^\s*match\b.*:\s*$/m.test(text) : has('switch') || text.includes('?'))) found.add('selezione');
	if (language === 'python' ? nestedPython(text) : nestedCpp(text)) found.add('annidati');
	return found;
}

/** The first of `needs` that is not among `found`, or null when all are. */
export const missing = (needs: readonly Construct[] | undefined, found: Set<Construct>): Construct | null => needs?.find((n) => !found.has(n)) ?? null;

/** What to tell a student whose answer writes the right things without the construct that was asked for. */
export function missingMessage(construct: Construct, kind: 'chart' | 'program'): string {
	if (kind === 'chart') return `Il diagramma scrive il risultato giusto, ma manca ${construct === 'selezione' ? 'una selezione: serve un rombo che sceglie tra due strade' : construct === 'annidati' ? 'un ciclo dentro un altro: servono due rombi con la freccia che torna indietro, il secondo nel giro del primo' : 'un ciclo: serve un rombo con la freccia che torna indietro'}.`;
	return `Il programma scrive il risultato giusto, ma l’esercizio chiede ${ASKED[construct]}, e qui non ${construct === 'annidati' ? 'ci sono' : 'c’è'}.`;
}

const ASKED: Record<Construct, string> = { ciclo: 'un ciclo', selezione: 'una selezione', while: 'un ciclo while', for: 'un ciclo for', annidati: 'due cicli, uno dentro l’altro' };

/**
 * What a program to write must contain, told with the question: a program may reach the right numbers another way
 * (a formula, a ready function), and the student must know beforehand that it will not do.
 */
export function neededText(needs: readonly Construct[] | undefined): string | null {
	// a loop inside another says there is a loop
	const told = (needs ?? []).filter((n) => !(n === 'ciclo' && needs!.includes('annidati')));
	if (!told.length) return null;
	const all = told.map((n) => ASKED[n]);
	const list = all.length > 1 ? `${all.slice(0, -1).join(', ')} e ${all[all.length - 1]}` : all[0];
	return `Nel programma ${told.length > 1 || told[0] === 'annidati' ? 'devono esserci' : 'deve esserci'} ${list}.`;
}
