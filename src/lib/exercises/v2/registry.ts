import type { Generator } from './types';

/**
 * Generators by id, for the scripts in scripts/exercises (sample, review). The file
 * generators/<id>.ts is imported on demand and must default-export its Generator, so a new
 * generator needs no line here. The site does not use this: each lesson imports its generator
 * through src/lib/exercises/<slug>-v2.ts.
 */
export async function getGenerator(id: string): Promise<Generator> {
	if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid generator id "${id}"`);
	let mod: { default?: Generator };
	try {
		mod = await import(`./generators/${id}.ts`);
	} catch (e) {
		throw new Error(`Unknown generator "${id}": ${(e as Error).message.split('\n')[0]}`);
	}
	if (!mod.default || mod.default.id !== id) throw new Error(`generators/${id}.ts must default-export the generator with id "${id}"`);
	return mod.default;
}
