/**
 * How a generated problem is laid out on the exercise page.
 *
 * Generators write each problem as one LaTeX string, fit for a checker and a
 * print-out: a word problem is `\text{}` lines broken by hand with `\\`, the
 * givens of a set exercise sit side by side with `\qquad`. Typeset as a single
 * display formula, that reads badly on screen: prose comes out in the maths
 * font and never re-wraps, givens stack in ragged rows. This splits the string
 * into blocks the page can lay out: a paragraph, a row of givens, a formula.
 * The generators and their verified output stay as they are.
 */

export type ProblemBlock =
	/** Prose, with inline formulas as `$…$`. Consecutive text lines are one paragraph. */
	| { kind: 'text'; tex: string }
	/** Data side by side, each a formula: `A = \{1, 2\}`, `|B| = 30`, `f(x) = 3x + 2`, or values to compare. */
	| { kind: 'givens'; items: string[] }
	/** A formula on its own: the equation, the thing to find (`A \cup B = ?`). */
	| { kind: 'math'; tex: string };

/** Splits `s` at every match of `sep` outside braces and outside nested environments (a table inside the problem keeps its rows). */
function splitTop(s: string, sep: RegExp): string[] {
	const parts: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '\\' && (s[i + 1] === '{' || s[i + 1] === '}')) {
			i++;
			continue;
		}
		const env = /^\\(begin|end)\{[a-z*]+\}/.exec(s.slice(i, i + 24));
		if (env) {
			depth += env[1] === 'begin' ? 1 : -1;
			i += env[0].length - 1;
			continue;
		}
		if (c === '{') depth++;
		else if (c === '}') depth--;
		else if (depth === 0) {
			const m = sep.exec(s.slice(i));
			if (m && m.index === 0 && m[0].length) {
				parts.push(s.slice(start, i));
				i += m[0].length - 1;
				start = i + 1;
			}
		}
	}
	parts.push(s.slice(start));
	return parts.map((p) => p.trim()).filter(Boolean);
}

/** Every `\text{…}` group of `s`, with where it starts and ends (braces balanced). */
function textGroups(s: string): { from: number; to: number; body: string }[] {
	const groups = [];
	const re = /\\text\s*\{/g;
	for (let m = re.exec(s); m; m = re.exec(s)) {
		let depth = 1;
		let i = m.index + m[0].length;
		for (; i < s.length && depth; i++) {
			if (s[i] === '\\') i++;
			else if (s[i] === '{') depth++;
			else if (s[i] === '}') depth--;
		}
		groups.push({ from: m.index, to: i, body: s.slice(m.index + m[0].length, i - 1) });
		re.lastIndex = i;
	}
	return groups;
}

/** A line made only of `\text{…}` (and punctuation between them) is prose. */
function proseOf(line: string): string | null {
	const groups = textGroups(line);
	if (!groups.length) return null;
	let rest = '';
	let prose = '';
	let at = 0;
	for (const g of groups) {
		rest += line.slice(at, g.from);
		prose += line.slice(at, g.from) + g.body;
		at = g.to;
	}
	rest += line.slice(at);
	prose += line.slice(at);
	if (!/^[\s,.;:!?]*$/.test(rest.replace(/\\[ ,;!]/g, ''))) return null;
	return prose.replace(/\\ /g, ' ').replace(/\s+/g, ' ').trim();
}

/** `= \ ?` is how the generators write the unknown; a thin space reads better on screen. */
const tidy = (tex: string) => tex.replace(/=\s*\\ \s*\?/g, '= \\,?').trim();

export function presentProblem(problem: string): ProblemBlock[] {
	let body = problem.trim();
	const env = /^\\begin\{(array|gathered|aligned)\}(?:\{[^}]*\})?([\s\S]*)\\end\{\1\}$/.exec(body);
	if (env) body = env[2];
	let lines = env ? splitTop(body, /\\\\/) : [body];
	// An aligned problem is one expression broken to fit a phone: each line stands alone, without its
	// alignment marks and without the indent of a continuation line (which would read as a list of givens).
	if (env?.[1] === 'aligned') lines = lines.map((line) => line.replace(/(^|[^\\])&/g, '$1').replace(/^\s*\\q?quad\b\s*/, '').trim());

	const blocks: ProblemBlock[] = [];
	for (const line of lines) {
		const prose = proseOf(line);
		if (prose != null) {
			const last = blocks.at(-1);
			if (last?.kind === 'text') last.tex += ` ${prose}`;
			else blocks.push({ kind: 'text', tex: prose });
			continue;
		}
		// Givens: pieces spaced with \quad (the data, or values to compare), none asking and none a word;
		// a lone definition (`C = \{2, 5\}`) joins the givens next to it.
		const items = splitTop(line, /,?\s*\\q?quad\b\s*/).map((item) => item.replace(/,$/, '').trim());
		const list = items.length >= 2 && !line.includes('?') && items.every((item) => proseOf(item) == null);
		const definition = items.length === 1 && /^[^=?]{1,14}=[^=?]+$/.test(line);
		if (list || definition) {
			// A list is a row of its own (the sets, then the arrows of a function); a lone definition joins the row before.
			const last = blocks.at(-1);
			if (definition && last?.kind === 'givens') last.items.push(tidy(line));
			else blocks.push({ kind: 'givens', items: items.map(tidy) });
			continue;
		}
		blocks.push({ kind: 'math', tex: tidy(line) });
	}
	return blocks;
}

/**
 * A line of a worked solution as prose with inline formulas, ready for renderMath: the `\text{…}` groups
 * become words that wrap and the maths between them `$…$`. A line with no text is one inline formula.
 */
export function presentStep(step: string): string {
	const groups = textGroups(step);
	if (!groups.length) return `$${step.trim()}$`;
	let out = '';
	let at = 0;
	// Spacing commands at the edges of a formula (`25\ \text{cm}`) become plain spaces around it.
	const space = String.raw`(?:\s|\\[ ,;:!]|\\q?quad\b)+`;
	const leading = new RegExp(`^${space}`);
	const trailing = new RegExp(`${space}$`);
	const math = (tex: string) => {
		const t = tex.replace(leading, '').replace(trailing, '');
		// Punctuation between two text groups stays text.
		if (!t || /^[,.;:!?]+$/.test(t)) out += tex;
		else out += `${leading.test(tex) ? ' ' : ''}$${t}$${trailing.test(tex) ? ' ' : ''}`;
	};
	for (const g of groups) {
		math(step.slice(at, g.from));
		out += g.body;
		at = g.to;
	}
	math(step.slice(at));
	return out.replace(/\\ /g, ' ').replace(/\s+/g, ' ').trim();
}
