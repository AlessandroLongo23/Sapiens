import { parseProgram, type Stmt } from './blocco';

/**
 * Changing a chart. A chart is its program, so every change is one to the program: a block is added in a place of
 * a run of blocks, replaced, or removed, and the drawing is computed again. Lines are never drawn by hand, which is
 * what keeps every chart a program that Python and C++ can say too.
 *
 * A place is written `key:index`: `key` names a run of blocks by the way to it from the top (`2b` is the body of the
 * loop that is block 2, `2b.0t` the branch "sì" of the first block in there, `e` the branch "no"), and `index` is a
 * position in that run. The same writing names a block and the gap before it.
 */

type Branch = 't' | 'e' | 'b';
type Step = { index: number; branch: Branch };

export const placeOf = (key: string, index: number) => `${key}:${index}`;
export const inside = (key: string, index: number, branch: Branch) => `${key ? `${key}.` : ''}${index}${branch}`;

function read(place: string): { steps: Step[]; index: number } {
	const [key, index] = place.split(':');
	const steps = key ? key.split('.').map((step) => ({ index: Number(step.slice(0, -1)), branch: step.slice(-1) as Branch })) : [];
	return { steps, index: Number(index) };
}

function listOf(stmt: Stmt, branch: Branch): Stmt[] | null {
	if (stmt.kind === 'while') return branch === 'b' ? stmt.body : null;
	if (stmt.kind === 'if') return branch === 't' ? stmt.then : branch === 'e' ? stmt.else : null;
	return null;
}

function withList(stmt: Stmt, branch: Branch, list: Stmt[]): Stmt {
	if (stmt.kind === 'while') return { ...stmt, body: list };
	if (stmt.kind === 'if') return branch === 't' ? { ...stmt, then: list } : { ...stmt, else: list };
	return stmt;
}

/** The program with the run of blocks at `steps` changed by `change`; the program given is left as it is. */
function update(program: Stmt[], steps: Step[], change: (list: Stmt[]) => Stmt[]): Stmt[] {
	if (!steps.length) return change(program);
	const [step, ...rest] = steps;
	const stmt = program[step.index];
	const list = stmt && listOf(stmt, step.branch);
	if (!list) return program;
	return program.map((s, i) => (i === step.index ? withList(stmt, step.branch, update(list, rest, change)) : s));
}

export function blockAt(program: Stmt[], place: string): Stmt | null {
	const { steps, index } = read(place);
	let list: Stmt[] | null = program;
	for (const step of steps) list = list?.[step.index] ? listOf(list[step.index], step.branch) : null;
	return list?.[index] ?? null;
}

export const insertBlock = (program: Stmt[], place: string, stmt: Stmt): Stmt[] => {
	const { steps, index } = read(place);
	return update(program, steps, (list) => [...list.slice(0, index), stmt, ...list.slice(index)]);
};

export const replaceBlock = (program: Stmt[], place: string, stmt: Stmt): Stmt[] => {
	const { steps, index } = read(place);
	return update(program, steps, (list) => list.map((s, i) => (i === index ? stmt : s)));
};

export const removeBlock = (program: Stmt[], place: string): Stmt[] => {
	const { steps, index } = read(place);
	return update(program, steps, (list) => list.filter((_, i) => i !== index));
};

/**
 * The block at `from` taken to the gap at `to`. A block is not put inside itself, and the program given is left as
 * it is; when the move cannot be made the same program comes back.
 */
export function moveBlock(program: Stmt[], from: string, to: string): Stmt[] {
	const stmt = blockAt(program, from);
	if (!stmt) return program;
	const [fromKey, fromIndex] = from.split(':');
	const [toKey, toIndex] = to.split(':');
	const own = `${fromKey ? `${fromKey}.` : ''}${fromIndex}`;
	if (new RegExp(`^${own.replace(/\./g, '\\.')}[tbe](\\.|$)`).test(toKey)) return program;
	// in the same run of blocks, the gaps just before and just after the block are where it already is
	if (fromKey === toKey && (toIndex === fromIndex || Number(toIndex) === Number(fromIndex) + 1)) return program;
	// the block goes in as a copy, so that the one to take away is still told apart
	const without = (stmts: Stmt[]): Stmt[] => stmts.filter((s) => s !== stmt).map((s) => (s.kind === 'while' ? { ...s, body: without(s.body) } : s.kind === 'if' ? { ...s, then: without(s.then), else: s.else && without(s.else) } : s));
	return without(insertBlock(program, to, { ...stmt }));
}

export type BlockKind = Stmt['kind'];
export const BLOCK_KINDS: Record<BlockKind, string> = { input: 'Leggi', output: 'Scrivi', assign: 'Assegna', if: 'Selezione', while: 'Ciclo' };

/** The names a program gives a value to, in order: a new block starts from one the chart already has. */
export function variablesOf(program: Stmt[]): string[] {
	const names: string[] = [];
	const walk = (stmts: Stmt[]) => {
		for (const stmt of stmts) {
			if ((stmt.kind === 'assign' || stmt.kind === 'input') && !names.includes(stmt.name)) names.push(stmt.name);
			if (stmt.kind === 'while') walk(stmt.body);
			if (stmt.kind === 'if') {
				walk(stmt.then);
				if (stmt.else) walk(stmt.else);
			}
		}
	};
	walk(program);
	return names;
}

/** A block of a kind as it is first added, ready to be changed. */
export function newBlock(kind: BlockKind, program: Stmt[]): Stmt {
	const names = variablesOf(program);
	const known = names[names.length - 1] ?? 'x';
	let fresh = 'x';
	for (const name of ['x', 'y', 'z', 'a', 'b', 'c']) {
		fresh = name;
		if (!names.includes(name)) break;
	}
	const line = { input: `leggi ${fresh}`, output: `scrivi ${names.length ? known : '"ciao"'}`, assign: `${fresh} = 0`, if: `se ${known} > 0`, while: `finché ${known} > 0` }[kind];
	return parseProgram(line, true).program[0];
}

/**
 * The block written on `line` ("x = x + 1", "se n > 0"), keeping what `old` holds in its branches: changing the
 * condition of a loop leaves its body where it is. An error comes back in words, for the field that was typed in.
 */
export function rewriteBlock(old: Stmt, line: string): { stmt: Stmt | null; error: string | null } {
	const { program, errors } = parseProgram(line, true);
	if (errors.length || program.length !== 1) return { stmt: null, error: (errors[0] ?? 'manca qualcosa').replace(/^riga \d+: /, '') };
	const stmt = program[0];
	if (stmt.kind === 'while' && old.kind === 'while') return { stmt: { ...stmt, body: old.body }, error: null };
	if (stmt.kind === 'if' && old.kind === 'if') return { stmt: { ...stmt, then: old.then, else: old.else }, error: null };
	return { stmt, error: null };
}
