/**
 * Chemistry exercises are generated ahead of time, in Python, because the molecules are drawn with RDKit
 * (scripts/chimica/): every exercise there passes its generator's checks and an independent checker (names read
 * back with OPSIN, formulas and masses recomputed), and scripts/chimica/esporta.py writes the ones that pass to
 * pools/<id>.json, with the drawings as references to files in the `figure` bucket.
 *
 * On the site a pool is a Generator like the others: the seed picks one of the level's exercises, so the same seed
 * gives the same exercise and a stored attempt can always be traced to its item.
 */
import type { Generator, Sample } from '../v2/types';

export interface Pool {
	id: string;
	title: string;
	/** Level → name, from the Python generator's LEVELS. */
	levels: Record<string, string>;
	items: Sample[];
}

export function poolGenerator(pool: Pool): Generator {
	const byLevel = new Map<number, Sample[]>();
	for (const item of pool.items) {
		const list = byLevel.get(item.level) ?? [];
		list.push(item);
		byLevel.set(item.level, list);
	}
	return {
		id: pool.id,
		title: pool.title,
		levels: Object.fromEntries(Object.entries(pool.levels).map(([level, label]) => [Number(level), { label, constraints: [] }])),
		generate(rng, level) {
			const items = byLevel.get(level);
			if (!items?.length) throw new Error(`${pool.id}: no exercises at level ${level}`);
			const item = items[rng.int(0, items.length - 1)];
			// The pool item keeps its own seed (the Python one) in params; the sample carries the seed that picked it.
			return { ...item, seed: rng.seed, params: { ...item.params, poolSeed: item.seed } };
		},
		// Checked in Python before export: nothing left to check here.
		check: () => []
	};
}
