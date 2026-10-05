/**
 * Shared pieces of the generators of the chapter "L'iterazione" after the while (lessons 61-64: the for loop,
 * counters and accumulators, nested loops, maximum, minimum and mean), on top of v2/inf-programmi.ts.
 *
 * The language of the flowcharts has no `for`: a loop with a counter is written there as the counter set to its
 * first value, a `finché`, and the step as the last line of the body (`counted`). `forCodes` takes the Python and
 * the C++ that inf-programmi.ts writes for such a program and rewrites every loop of that shape as a `for`, as the
 * lessons write it: `for i in range(1, n + 1):` and `for (int i = 1; i <= n; i++) {`. The program in the language of
 * the flowcharts stays the reference: an exercise keeps it in `params.source`, and an option that shows a `for`
 * keeps it in `values[0]`, so the independent check runs both and compares them.
 */
import { choose, codes, wrongPrograms } from './inf-programmi';
import type { ChoiceAnswer, ChoiceOption, CodeText, Rng } from './types';

export type Op = '<' | '<=' | '>' | '>=';

/** A counter: where it starts, the condition to make another turn, how much it changes at every turn (never 0). */
export interface Count {
	from: number | string;
	op: Op;
	to: number | string;
	step: number;
}

export const inside = (rows: string[]) => rows.map((row) => `    ${row}`);

/** The rows of a loop with the counter `name`, in the language of the flowcharts: the three parts of a `for`, apart. */
export function counted(name: string, c: Count, body: string[]): string[] {
	return [`${name} = ${c.from}`, `finché ${name} ${c.op} ${c.to}`, ...inside(body), `    ${name} = ${name} ${c.step > 0 ? '+' : '-'} ${Math.abs(c.step)}`];
}

/** `expr` moved by a whole number: 5 and 1 give 6, "n" and 1 give "n + 1", "n - 1" and 1 give "n". */
function shift(expr: string, by: number): string {
	if (/^-?\d+$/.test(expr)) return String(Number(expr) + by);
	const tail = /^(.+) ([+-]) (\d+)$/.exec(expr);
	const base = tail ? tail[1] : expr;
	const total = (tail ? Number(tail[3]) * (tail[2] === '+' ? 1 : -1) : 0) + by;
	return total === 0 ? base : `${base} ${total > 0 ? '+' : '-'} ${Math.abs(total)}`;
}

/** The value Python's `range` stops before: the first one the condition refuses, when the counter lands on it. */
export const stopOf = (c: Pick<Count, 'op' | 'to'>) => (c.op === '<=' ? shift(String(c.to), 1) : c.op === '>=' ? shift(String(c.to), -1) : String(c.to));

/** The counter as Python writes it: `range(5)`, `range(1, 6)`, `range(0, 11, 2)`, `range(5, 0, -1)`. */
export function rangeOf(c: Count): string {
	const stop = stopOf(c);
	if (c.step === 1) return String(c.from) === '0' ? `range(${stop})` : `range(${c.from}, ${stop})`;
	return `range(${c.from}, ${stop}, ${c.step})`;
}

/** The counter as C++ writes it, between the parentheses of the `for`. */
export function cppOf(name: string, c: Count): string {
	const step = c.step === 1 ? `${name}++` : c.step === -1 ? `${name}--` : c.step > 0 ? `${name} += ${c.step}` : `${name} -= ${-c.step}`;
	return `int ${name} = ${c.from}; ${name} ${c.op} ${c.to}; ${step}`;
}

const OPS = '(<=|<|>=|>)';

/** A step read from the last line of a body, when it goes the way the condition asks. */
function stepOf(sign: string, size: string, op: string): number | null {
	const step = Number(size) * (sign === '+' ? 1 : -1);
	return step !== 0 && step > 0 === op.startsWith('<') ? step : null;
}

/** Python with every counted `while` rewritten as a `for`. */
function pythonFor(text: string): string {
	const rows = text.replace(/\n+$/, '').split('\n');
	for (let changed = true; changed; ) {
		changed = false;
		for (let k = 0; k + 1 < rows.length && !changed; k++) {
			const set = /^(\s*)(\w+) = (.+)$/.exec(rows[k]);
			if (!set) continue;
			const [, indent, name, from] = set;
			const head = new RegExp(`^${indent}while ${name} ${OPS} (.+):$`).exec(rows[k + 1]);
			if (!head) continue;
			let end = k + 1;
			while (end + 1 < rows.length && rows[end + 1].startsWith(`${indent}    `)) end++;
			const move = new RegExp(`^${indent}    ${name} = ${name} ([+-]) (\\d+)$`).exec(rows[end]);
			const step = move && stepOf(move[1], move[2], head[1]);
			// a body that is only the step would be left empty
			if (!step || end === k + 2) continue;
			rows.splice(end, 1);
			rows.splice(k, 2, `${indent}for ${name} in ${rangeOf({ from, op: head[1] as Op, to: head[2], step })}:`);
			changed = true;
		}
	}
	return rows.join('\n') + '\n';
}

/** C++ with every counted `while` rewritten as a `for`; the counter is declared in the line of the loop. */
function cppFor(text: string): string {
	const rows = text.replace(/\n+$/, '').split('\n');
	for (let changed = true; changed; ) {
		changed = false;
		for (let k = 0; k + 1 < rows.length && !changed; k++) {
			const set = /^(\s*)(?:int )?(\w+) = (.+);$/.exec(rows[k]);
			if (!set) continue;
			const [, indent, name, from] = set;
			const head = new RegExp(`^${indent}while \\(${name} ${OPS} (.+)\\) \\{$`).exec(rows[k + 1]);
			if (!head) continue;
			const close = rows.indexOf(`${indent}}`, k + 2);
			const move = close < 0 ? null : new RegExp(`^${indent}    ${name} = ${name} ([+-]) (\\d+);$`).exec(rows[close - 1]);
			const step = move && stepOf(move[1], move[2], head[1]);
			if (!step || close === k + 3) continue;
			rows.splice(close - 1, 1);
			rows.splice(k, 2, `${indent}for (${cppOf(name, { from, op: head[1] as Op, to: head[2], step })}) {`);
			// declared at the top of main when its first value came inside another loop
			const early = rows.indexOf(`    int ${name};`);
			if (early >= 0) rows.splice(early, 1);
			changed = true;
		}
	}
	return rows.join('\n') + '\n';
}

/**
 * The program in the two languages, with a `for` for every loop written with `counted`. The counter must not be
 * read after its loop: in C++ it does not exist there.
 */
export function forCodes(source: string, samples: (string | number)[] = []): CodeText {
	const code = codes(source, samples);
	return { python: pythonFor(code.python), cpp: cppFor(code.cpp) };
}

/**
 * A program that builds each row of a drawing in the text `riga` and writes it, rewritten as the lessons draw:
 * one character at a time without going to a new line (`print("*", end="")`, `cout << "*";`) and the new line at
 * the end of the row. The program must set `riga = ""`, add to it with `riga = riga + "…"` and write it alone.
 */
export function drawCodes(code: CodeText): CodeText {
	const python = code.python
		.split('\n')
		.filter((row) => row.trim() !== 'riga = ""')
		.map((row) => row.replace(/riga = riga \+ ("[^"]*")$/, 'print($1, end="")').replace(/print\(riga\)$/, 'print()'));
	const cpp = code.cpp
		.split('\n')
		.filter((row) => !['string riga;', 'riga = "";', 'string riga = "";', '#include <string>'].includes(row.trim()))
		.map((row) => row.replace(/riga = riga \+ ("[^"]*");$/, 'cout << $1;').replace(/cout << riga << endl;$/, 'cout << endl;'));
	return { python: python.join('\n'), cpp: cpp.join('\n') };
}

/** An option that is a program written with `for`; `values` hold the same program in the language of the flowcharts. */
export const forOption = (source: string, samples: (string | number)[] = []): ChoiceOption => ({ latex: '', values: [source], code: forCodes(source, samples), text: 'un programma' });

/**
 * Whether a program fits an option on a phone: at most 9 rows in Python, rows of at most 34 characters. The row of
 * a `for` in C++ cannot be that short as soon as it has a step or a number of two digits (the lesson's own
 * `for (int i = 0; i < 11; i += 2) {` is 37 inside `main`): it may reach 38, which a 390 px screen still shows whole.
 */
export function fits(code: CodeText): boolean {
	const rows = (text: string) => text.replace(/\n+$/, '').split('\n');
	return rows(code.python).length <= 9 && rows(code.python).every((row) => row.length <= 34) && rows(code.cpp).every((row) => row.length <= (/^\s*for \(/.test(row) ? 38 : 34));
}

/** Thrown by a level when the numbers it drew do not give four good options: `retrying` draws again. */
export class Retry extends Error {}

export function retrying<T>(build: () => T, times = 60): T {
	for (let k = 0; ; k++) {
		try {
			return build();
		} catch (e) {
			if (!(e instanceof Retry) || k >= times) throw e;
		}
	}
}

/** The wrong programs among `candidates` that write something else than `right` on `tests`, at least `least`. */
export function wrongOnes(right: string, candidates: string[], tests: (string | number)[][], least = 3): string[] {
	const wrong = wrongPrograms(right, candidates, tests);
	if (wrong.length < least) throw new Retry(`only ${wrong.length} wrong programs`);
	return wrong;
}

/** `choose`, drawing again when the options that differ are fewer than four. */
export function options(rng: Rng, right: ChoiceOption, others: ChoiceOption[]): ChoiceAnswer {
	const keys = new Set([right, ...others].map((o) => o.values.join('|')));
	if (keys.size < 4) throw new Retry('fewer than four options');
	return choose(rng, right, others);
}

/** The values a program is given, as the exercise says them: "4, 7, 5, 8, 4". */
export const listed = (values: (string | number)[]) => values.join(', ');

/** `count` different whole numbers between `low` and `high`. */
export function distinct(rng: Rng, count: number, low: number, high: number): number[] {
	const out: number[] = [];
	while (out.length < count) {
		const x = rng.int(low, high);
		if (!out.includes(x)) out.push(x);
	}
	return out;
}
