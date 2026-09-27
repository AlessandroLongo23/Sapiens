import { fail, type Outcome, type Step } from './types';

/**
 * The truth table of a proposition, the way the lesson "Proposizioni e connettivi logici" builds it: one column per
 * letter, rows in the order VV, VF, FV, FF, one column per piece from the innermost to the outermost, the last column
 * the whole proposition. Negation binds tightest and applies to the letter or bracket after it; then ∧, ∨ and ⊻, then
 * →, then ↔. Between ∧ and ∨ the books do not agree on a precedence, so the tool asks for brackets there (as the
 * lesson does), and between two arrows too. Every binary piece inside another is printed in brackets.
 */

export type Op = 'and' | 'or' | 'imp' | 'iff' | 'xor';

export type Prop = { k: 'var'; name: string } | { k: 'const'; value: boolean } | { k: 'not'; a: Prop } | { k: 'bin'; op: Op; a: Prop; b: Prop };

type Token = { t: 'var'; name: string } | { t: 'const'; value: boolean } | { t: 'not' } | { t: 'op'; op: Op } | { t: '(' } | { t: ')' };

export const MAX_LETTERS = 5;
const MAX_LENGTH = 200;
const MAX_PIECES = 16;

const EXAMPLE = 'Scrivi una proposizione con lettere e connettivi, per esempio (p ∨ q) ∧ ¬p.';

const OP_TEX: Record<Op, string> = { and: '\\wedge', or: '\\vee', imp: '\\to', iff: '\\leftrightarrow', xor: '\\mathbin{\\dot{\\vee}}' };
const OP_TEXT: Record<Op, string> = { and: '∧', or: '∨', imp: '→', iff: '↔', xor: '⊻' };
const OP_NAME: Record<Op, string> = { and: 'congiunzione (e)', or: 'disgiunzione (o)', imp: 'implicazione (se… allora)', iff: 'doppia implicazione (se e solo se)', xor: 'disgiunzione esclusiva (o… o)' };
/** The connectives of the same rank, which a chain cannot mix without brackets. */
const CHAIN_OPS: Op[] = ['and', 'or', 'xor'];
/** Connectives that give the same result however a chain of them is bracketed. */
const ASSOCIATIVE: Op[] = ['and', 'or', 'iff', 'xor'];

/** Symbols as typed on a keyboard, longest first. */
const SYMBOLS: [string, Token][] = [
	['<->', { t: 'op', op: 'iff' }],
	['<=>', { t: 'op', op: 'iff' }],
	['->', { t: 'op', op: 'imp' }],
	['=>', { t: 'op', op: 'imp' }],
	['&&', { t: 'op', op: 'and' }],
	['||', { t: 'op', op: 'or' }],
	['¬', { t: 'not' }],
	['!', { t: 'not' }],
	['~', { t: 'not' }],
	['∼', { t: 'not' }],
	['∧', { t: 'op', op: 'and' }],
	['&', { t: 'op', op: 'and' }],
	['^', { t: 'op', op: 'and' }],
	['∨', { t: 'op', op: 'or' }],
	['|', { t: 'op', op: 'or' }],
	['→', { t: 'op', op: 'imp' }],
	['⇒', { t: 'op', op: 'imp' }],
	['↔', { t: 'op', op: 'iff' }],
	['⇔', { t: 'op', op: 'iff' }],
	['⊻', { t: 'op', op: 'xor' }],
	['⊕', { t: 'op', op: 'xor' }],
	['0', { t: 'const', value: false }],
	['1', { t: 'const', value: true }]
];

/** Words for the connectives, in Italian and in English, lower case. */
const WORDS: Record<string, Token> = {
	non: { t: 'not' },
	not: { t: 'not' },
	e: { t: 'op', op: 'and' },
	et: { t: 'op', op: 'and' },
	and: { t: 'op', op: 'and' },
	o: { t: 'op', op: 'or' },
	v: { t: 'op', op: 'or' },
	vel: { t: 'op', op: 'or' },
	or: { t: 'op', op: 'or' },
	implica: { t: 'op', op: 'imp' },
	sse: { t: 'op', op: 'iff' },
	iff: { t: 'op', op: 'iff' },
	xor: { t: 'op', op: 'xor' },
	aut: { t: 'op', op: 'xor' },
	vero: { t: 'const', value: true },
	falso: { t: 'const', value: false }
};

function tokenize(input: string): Token[] | string {
	const s = input.replace(/se\s+e\s+solo\s+se/gi, ' ↔ ').replace(/o\s+esclusivo/gi, ' ⊻ ');
	const out: Token[] = [];
	let i = 0;
	outer: while (i < s.length) {
		const c = s[i];
		if (/\s/.test(c)) {
			i++;
			continue;
		}
		if ('([{'.includes(c)) {
			out.push({ t: '(' });
			i++;
			continue;
		}
		if (')]}'.includes(c)) {
			out.push({ t: ')' });
			i++;
			continue;
		}
		for (const [sym, tok] of SYMBOLS) {
			if (s.startsWith(sym, i)) {
				out.push(tok);
				i += sym.length;
				continue outer;
			}
		}
		const word = /^[A-Za-zÀ-ÿ]+/.exec(s.slice(i));
		if (word) {
			const w = word[0];
			const known = WORDS[w.toLowerCase()];
			if (w === 'V') out.push({ t: 'const', value: true });
			else if (w === 'F') out.push({ t: 'const', value: false });
			else if (known) out.push(known);
			else if (w.length === 1) out.push({ t: 'var', name: w });
			else if (/^[a-zA-Z]+$/.test(w) && w.length <= 3) return `Tra le lettere di "${w}" manca un connettivo: scrivi per esempio ${[...w].join(' ∧ ')}.`;
			else return `"${w}" non è una lettera né un connettivo: usa lettere singole, come p e q, e i connettivi.`;
			i += w.length;
			continue;
		}
		return `Il simbolo "${c}" non è un connettivo. Usa ¬ ∧ ∨ → ↔ ⊻, oppure ! & | -> <->.`;
	}
	return out;
}

const tokenText = (t: Token): string => (t.t === 'var' ? t.name : t.t === 'const' ? (t.value ? 'V' : 'F') : t.t === 'not' ? '¬' : t.t === 'op' ? OP_TEXT[t.op] : t.t);

/** Parses the tokens: negation first, then ∧, ∨ and ⊻ (one kind per run), then →, then ↔. */
function parseTokens(tokens: Token[]): Prop | string {
	let pos = 0;
	const peek = () => tokens[pos];

	function unary(): Prop | string {
		const t = peek();
		if (!t) return pos === 0 ? EXAMPLE : `Dopo ${tokenText(tokens[pos - 1])} manca una lettera o una parentesi.`;
		if (t.t === 'not') {
			pos++;
			const a = unary();
			return typeof a === 'string' ? a : { k: 'not', a };
		}
		if (t.t === 'var') {
			pos++;
			return { k: 'var', name: t.name };
		}
		if (t.t === 'const') {
			pos++;
			return { k: 'const', value: t.value };
		}
		if (t.t === '(') {
			pos++;
			const inner = expr();
			if (typeof inner === 'string') return inner;
			if (peek()?.t !== ')') return 'Manca una parentesi chiusa: ogni parentesi aperta va chiusa.';
			pos++;
			return inner;
		}
		if (t.t === ')') return pos === 0 || tokens[pos - 1].t === '(' ? 'Tra le parentesi non c’è niente: scrivi una lettera, per esempio (p).' : `Dopo ${tokenText(tokens[pos - 1])} manca una lettera o una parentesi.`;
		return pos === 0 ? `Prima di ${tokenText(t)} manca una lettera: scrivi per esempio p ${tokenText(t)} q.` : `Dopo ${tokenText(tokens[pos - 1])} manca una lettera o una parentesi.`;
	}

	/** Operands joined by ∧, ∨ or ⊻: one kind only, since the books disagree on which comes first. */
	function chain(): Prop | string {
		const first = unary();
		if (typeof first === 'string') return first;
		let left = first;
		let op: Op | null = null;
		for (let t = peek(); t && t.t === 'op' && CHAIN_OPS.includes(t.op); t = peek()) {
			if (op && t.op !== op) return `Tra ${OP_TEXT[op]} e ${OP_TEXT[t.op]} i libri non danno sempre la stessa precedenza: metti le parentesi, per esempio (p ${OP_TEXT[op]} q) ${OP_TEXT[t.op]} r.`;
			op = t.op;
			pos++;
			const right = unary();
			if (typeof right === 'string') return right;
			left = { k: 'bin', op, a: left, b: right };
		}
		return left;
	}

	/** An implication binds less than ∧ and ∨; two arrows in a row need brackets. */
	function implication(): Prop | string {
		const left = chain();
		if (typeof left === 'string') return left;
		if (peek()?.t !== 'op' || (peek() as { op: Op }).op !== 'imp') return left;
		pos++;
		const right = chain();
		if (typeof right === 'string') return right;
		const next = peek();
		if (next?.t === 'op' && next.op === 'imp') return 'Metti le parentesi tra due frecce: scrivi (p → q) → r oppure p → (q → r).';
		return { k: 'bin', op: 'imp', a: left, b: right };
	}

	/** The double implication binds least of all. */
	function expr(): Prop | string {
		let left = implication();
		if (typeof left === 'string') return left;
		while (peek()?.t === 'op' && (peek() as { op: Op }).op === 'iff') {
			pos++;
			const right = implication();
			if (typeof right === 'string') return right;
			left = { k: 'bin', op: 'iff', a: left, b: right };
		}
		const t = peek();
		if (t && t.t !== ')') return `Tra ${tokenText(tokens[pos - 1])} e ${tokenText(t)} manca un connettivo, per esempio p ∧ q.`;
		return left;
	}

	const out = expr();
	if (typeof out === 'string') return out;
	if (pos < tokens.length) return 'C’è una parentesi chiusa di troppo: controlla le parentesi.';
	return out;
}

/** A proposition as the student typed it, or an error sentence. */
export function parseProp(input: string): Prop | string {
	if (!input.trim()) return EXAMPLE;
	if (input.length > MAX_LENGTH) return `La proposizione è troppo lunga: scrivine una di al massimo ${MAX_LENGTH} caratteri.`;
	const tokens = tokenize(input);
	if (typeof tokens === 'string') return tokens;
	return parseTokens(tokens);
}

const needsBrackets = (child: Prop, parent: Op | 'not', left: boolean) =>
	child.k === 'bin' && (parent === 'not' || !(left && child.op === parent && ASSOCIATIVE.includes(parent)));

/** LaTeX, with brackets only where they are needed: `(p \vee q) \wedge \neg p`. */
export function propTex(p: Prop): string {
	if (p.k === 'var') return p.name;
	if (p.k === 'const') return `\\text{${p.value ? 'V' : 'F'}}`;
	if (p.k === 'not') return `\\neg ${needsBrackets(p.a, 'not', false) ? `(${propTex(p.a)})` : propTex(p.a)}`;
	const side = (c: Prop, left: boolean) => (needsBrackets(c, p.op, left) ? `(${propTex(c)})` : propTex(c));
	return `${side(p.a, true)} ${OP_TEX[p.op]} ${side(p.b, false)}`;
}

/** The same in plain text, for the copy button: "(p ∨ q) ∧ ¬p". */
export function propText(p: Prop): string {
	if (p.k === 'var') return p.name;
	if (p.k === 'const') return p.value ? 'V' : 'F';
	if (p.k === 'not') return `¬${needsBrackets(p.a, 'not', false) ? `(${propText(p.a)})` : propText(p.a)}`;
	const side = (c: Prop, left: boolean) => (needsBrackets(c, p.op, left) ? `(${propText(c)})` : propText(c));
	return `${side(p.a, true)} ${OP_TEXT[p.op]} ${side(p.b, false)}`;
}

export function apply(op: Op, a: boolean, b: boolean): boolean {
	switch (op) {
		case 'and':
			return a && b;
		case 'or':
			return a || b;
		case 'imp':
			return !a || b;
		case 'iff':
			return a === b;
		case 'xor':
			return a !== b;
	}
}

export function evaluate(p: Prop, env: Record<string, boolean>): boolean {
	if (p.k === 'var') return env[p.name];
	if (p.k === 'const') return p.value;
	if (p.k === 'not') return !evaluate(p.a, env);
	return apply(p.op, evaluate(p.a, env), evaluate(p.b, env));
}

/** The letters, in alphabetical order. */
export function letters(p: Prop): string[] {
	const out = new Set<string>();
	const walk = (x: Prop) => {
		if (x.k === 'var') out.add(x.name);
		else if (x.k === 'not') walk(x.a);
		else if (x.k === 'bin') {
			walk(x.a);
			walk(x.b);
		}
	};
	walk(p);
	return [...out].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()) || a.localeCompare(b));
}

/** The pieces to compute, innermost first, each once: every negation and every connective. */
export function pieces(p: Prop): Prop[] {
	const out: Prop[] = [];
	const seen = new Set<string>();
	const walk = (x: Prop) => {
		if (x.k === 'not') walk(x.a);
		if (x.k === 'bin') {
			walk(x.a);
			walk(x.b);
		}
		if (x.k === 'not' || x.k === 'bin') {
			const key = propTex(x);
			if (!seen.has(key)) {
				seen.add(key);
				out.push(x);
			}
		}
	};
	walk(p);
	return out;
}

/** Row i of the table, as in the books: the first letter is V in the first half of the rows, the last letter alternates. */
export function assignment(names: string[], i: number): Record<string, boolean> {
	const n = names.length;
	return Object.fromEntries(names.map((name, j) => [name, ((i >> (n - 1 - j)) & 1) === 0]));
}

const vf = (b: boolean) => (b ? 'V' : 'F');

/** The small table of each binary connective used, so the student can check each column. */
function connectiveTable(ops: Op[]): Step {
	const rows = [true, false].flatMap((a) => [true, false].map((b) => [vf(a), vf(b), ...ops.map((op) => vf(apply(op, a, b)))]));
	return {
		say: 'Ricorda quando è vero ogni connettivo.',
		table: { head: ['$p$', '$q$', ...ops.map((op) => `$p ${OP_TEX[op]} q$`)], rows },
		then: ops.includes('imp') ? 'L’implicazione è falsa solo quando la prima è vera e la seconda è falsa.' : undefined
	};
}

export type Kind = 'tautologia' | 'contraddizione' | 'soddisfacibile';

export function tabellaVerita(input: string): Outcome {
	const p = parseProp(input);
	if (typeof p === 'string') return fail(p);
	const names = letters(p);
	if (names.length > MAX_LETTERS) return fail(`Al massimo ${MAX_LETTERS} lettere diverse: con ${MAX_LETTERS} le righe sono già 32. Questa proposizione ne ha ${names.length}.`);
	const cols = pieces(p);
	if (cols.length > MAX_PIECES) return fail(`La proposizione ha troppi pezzi per una tabella leggibile: dividila in parti più corte, con al massimo ${MAX_PIECES} connettivi.`);

	const n = names.length;
	const count = 2 ** n;
	const values = Array.from({ length: count }, (_, i) => {
		const env = assignment(names, i);
		return { env, cols: cols.map((c) => evaluate(c, env)), result: evaluate(p, env) };
	});
	const trueRows = values.filter((v) => v.result).length;
	const kind: Kind = trueRows === count ? 'tautologia' : trueRows === 0 ? 'contraddizione' : 'soddisfacibile';
	const tex = propTex(p);
	const last = cols.length - 1;

	const steps: Step[] = [];
	if (n > 0) {
		steps.push({
			say: 'Conta le lettere diverse.',
			table: { rows: [['Lettere', ...names.map((x) => `$${x}$`)]] },
			math: [`2^{${n}} = \\hl{${count}}`],
			then: `Ogni lettera raddoppia le righe: la tavola ha ${count} righe.`
		});
	} else {
		steps.push({ say: 'Non ci sono lettere: la tavola ha una riga sola.' });
	}
	if (cols.length > 1) {
		steps.push({
			say: 'Scegli i pezzi da calcolare, dal più interno al più esterno.',
			table: {
				head: ['Colonna', 'Pezzo', 'Connettivo'],
				rows: cols.map((c, i) => [`$${i + 1}$`, `$${propTex(c)}$`, c.k === 'not' ? 'negazione (non)' : c.k === 'bin' ? OP_NAME[c.op] : ''])
			},
			then: 'L’ultimo pezzo è la proposizione intera.'
		});
	}
	const ops = [...new Set(cols.flatMap((c) => (c.k === 'bin' ? [c.op] : [])))];
	if (ops.length) steps.push(connectiveTable(ops));
	if (cols.length) {
		steps.push({
			say: 'Riempi ogni colonna riga per riga, usando le colonne a sinistra.',
			table: {
				head: [...names.map((x) => `$${x}$`), ...cols.map((c, i) => (i === last ? `$\\hl{${propTex(c)}}$` : `$${propTex(c)}$`))],
				rows: values.map((v) => [...names.map((x) => vf(v.env[x])), ...v.cols.map((b, i) => (i === last ? `$\\hl{\\text{${vf(b)}}}$` : vf(b)))])
			},
			then: n ? `Le righe seguono l’ordine dei libri: ${n === 1 ? 'V, F' : n === 2 ? 'VV, VF, FV, FF' : `da ${'V'.repeat(n)} a ${'F'.repeat(n)}`}.` : undefined
		});
	} else {
		steps.push({
			say: n ? 'La proposizione è una lettera sola: la sua colonna è già la tavola.' : 'La proposizione è un valore fisso.',
			table: { head: [`$${tex}$`], rows: values.map((v) => [vf(v.result)]) }
		});
	}
	const verdict =
		kind === 'tautologia'
			? 'È tutta V: la proposizione è una tautologia, vera in ogni caso.'
			: kind === 'contraddizione'
				? 'È tutta F: la proposizione è una contraddizione, falsa in ogni caso.'
				: `Ha ${trueRows} V e ${count - trueRows} F: la proposizione è soddisfacibile, ma non è una tautologia.`;
	steps.push({ say: 'Guarda l’ultima colonna.', then: verdict });

	const kindText = kind === 'tautologia' ? 'una tautologia' : kind === 'contraddizione' ? 'una contraddizione' : 'soddisfacibile (né tautologia né contraddizione)';
	const header = [...names, ...cols.map(propText)];
	const copyRows = values.map((v) => [...names.map((x) => vf(v.env[x])), ...v.cols.map(vf)]);
	return {
		ok: true,
		rows: [
			{ label: 'Proposizione', value: `$${tex}$` },
			{ label: 'La proposizione è', value: kindText },
			{ label: 'Righe in cui è vera', value: `$${trueRows}$ su $${count}$` }
		],
		copy: (cols.length ? [header, ...copyRows] : [[propText(p)], ...values.map((v) => [vf(v.result)])]).map((r) => r.join('\t')).join('\n'),
		steps
	};
}
