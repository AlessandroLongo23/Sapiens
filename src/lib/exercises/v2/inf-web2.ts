/**
 * Shared pieces of the generators of the second half of the chapter "Internet e il web" of informatica
 * (inf-servizi-internet, inf-ricerca-informazioni, cloud): lessons without programming, all multiple choice.
 *
 * The samples are text (`format: 'text'`, see inf-programmi.ts). Every option carries in `values` the identifier of
 * the piece it is made of, which is what the Python checkers read (scripts/exercises/checkers/_inf_web2.py).
 */
import { choose, shuffle, textOption, type Built } from './inf-programmi';
import type { Rng } from './types';

export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'];

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Luca", "Luca e Sara", "Luca, Sara e Anna"; "Giulia ed Elena" before an e. */
export const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${/^[Ee]/.test(items.at(-1)!) ? 'ed' : 'e'} ${items.at(-1)}`);

/** "a Luca", "ad Anna". */
export const to = (name: string) => `${/^[Aa]/.test(name) ? 'ad' : 'a'} ${name}`;

/** The article before a number written in digits: "i 5 compagni", "gli 8 compagni". */
export const the = (n: number) => (n === 8 || n === 11 ? 'gli' : 'i');

/** `n` different elements of `xs`, in random order. */
export const take = <T>(rng: Rng, xs: readonly T[], n: number): T[] => shuffle(rng, xs).slice(0, n);

/**
 * A whole number as the lessons write it: from ten thousand on, the thousands are set apart, here with a narrow
 * space that does not break (in a formula the digits would change typeface beside the other options).
 */
export const num = (n: number) => (n < 10000 ? String(n) : String(n).replace(/\B(?=(\d{3})+$)/g, '\u202f'));

/** A statement of a true-or-false level: `why` says what is true, in one sentence. */
export interface Statement {
	id: string;
	text: string;
	why: string;
}

/** The true statement among three false ones, or the false one among three true, half each. */
export function statementLevel(rng: Rng, TRUE: Statement[], FALSE: Statement[], about: string, prompt: string): Built {
	const wantTrue = rng.next() < 0.5;
	const [rights, wrongs] = wantTrue ? [TRUE, FALSE] : [FALSE, TRUE];
	const right = rng.pick(rights);
	const others = take(rng, wrongs, 3);
	const o = (s: Statement) => textOption(s.text, s.id);
	return {
		prompt,
		problem: `Quale di queste affermazioni ${about} è ${wantTrue ? 'vera' : 'falsa'}?`,
		solution: right.text,
		steps: [right.why, `Le altre tre affermazioni sono ${wantTrue ? 'false' : 'vere'}. Per esempio: ${others[0].why}`],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: wantTrue ? 'vera' : 'falsa', ids: [right.id, ...others.map((s) => s.id)] }
	};
}
