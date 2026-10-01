import { ELEMENTI, type ChemElement } from '@/lib/tools/tavola-periodica';

/**
 * The electron configuration of an element laid on the table of sublevels (components/orbitali/OrbitalGrid): which
 * sublevels are occupied and by how many electrons, how the electrons of a sublevel sit in its boxes (Hund's rule),
 * and the order in which the sublevels fill (the rule of the diagonal). The configurations are those of the periodic
 * table's data, exceptions included.
 */

export const LETTERS = ['s', 'p', 'd', 'f'];

/** The sublevels of the school table, by level: those that fill in the known elements, from 1s to 7p. */
export const SUBLEVEL_TABLE: Record<number, number[]> = { 1: [0], 2: [0, 1], 3: [0, 1, 2], 4: [0, 1, 2, 3], 5: [0, 1, 2, 3], 6: [0, 1, 2], 7: [0, 1] };

export interface Sublevel {
	n: number;
	l: number;
	/** "3d". */
	name: string;
}

/**
 * The order in which the sublevels fill, by the rule of the diagonal: by growing n + l, and for the same sum by
 * growing n. 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, …
 */
export const FILLING_ORDER: Sublevel[] = Object.entries(SUBLEVEL_TABLE)
	.flatMap(([n, ls]) => ls.map((l) => ({ n: Number(n), l, name: `${n}${LETTERS[l]}` })))
	.sort((a, b) => a.n + a.l - (b.n + b.l) || a.n - b.n);

/** How many electrons a sublevel holds: two for each of its 2l + 1 orbitals. */
export const capacity = (l: number): number => 2 * (2 * l + 1);

const bySymbol = new Map(ELEMENTI.map((el) => [el.symbol, el]));

/** The electrons of each sublevel of an element, by name ("3d" → 6), with the noble gas in brackets written out. */
export function electronsBySublevel(el: ChemElement): Map<string, number> {
	const out = new Map<string, number>();
	for (const part of el.config.split(' ')) {
		const core = /^\[([A-Z][a-z]?)\]$/.exec(part);
		if (core) {
			for (const [name, count] of electronsBySublevel(bySymbol.get(core[1])!)) out.set(name, count);
			continue;
		}
		const m = /^(\d[spdf])(\d+)$/.exec(part);
		if (m) out.set(m[1], Number(m[2]));
	}
	return out;
}

/** The configuration the rule of the diagonal gives for Z electrons, with no exceptions. */
export function diagonalConfiguration(z: number): Map<string, number> {
	const out = new Map<string, number>();
	let left = z;
	for (const sub of FILLING_ORDER) {
		if (left <= 0) break;
		const here = Math.min(left, capacity(sub.l));
		out.set(sub.name, here);
		left -= here;
	}
	return out;
}

/** Whether the element's real configuration is not the one the rule of the diagonal gives (chromium, copper). */
export function isException(el: ChemElement): boolean {
	const real = electronsBySublevel(el);
	const rule = diagonalConfiguration(el.z);
	const names = new Set([...real.keys(), ...rule.keys()]);
	return [...names].some((name) => (real.get(name) ?? 0) !== (rule.get(name) ?? 0));
}

/**
 * The electrons of a sublevel in its boxes, by Hund's rule: one in each box first, all with the same spin, then the
 * second ones. 0, 1 or 2 per box: four electrons in a p sublevel are [2, 1, 1].
 */
export function boxOccupation(l: number, electrons: number): number[] {
	const boxes = 2 * l + 1;
	return Array.from({ length: boxes }, (_, i) => (electrons > i ? 1 : 0) + (electrons > boxes + i ? 1 : 0));
}

/** Unpaired electrons of an element: the boxes with a single arrow. */
export function unpaired(el: ChemElement): number {
	let count = 0;
	for (const [name, electrons] of electronsBySublevel(el)) count += boxOccupation(LETTERS.indexOf(name[1]), electrons).filter((x) => x === 1).length;
	return count;
}
