/**
 * Prints JSONL samples from a v2 generator.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <generatorId> <count> [level|all] [startSeed]
 *
 * With "all", <count> samples are produced for EACH level. Sample i of a level
 * uses seed startSeed + i. The choice variant uses a seed derived from it.
 * Samples that fail the generator's own check() are still printed, and the
 * violations go to stderr (exit code 1), so verify.py sees them too. A sample
 * whose generation throws is printed as {generatorId, level, seed, error}.
 */
import { getGenerator } from '../../src/lib/exercises/v2/registry';
import { createRng, deriveSeed } from '../../src/lib/exercises/v2/rng';

async function main(): Promise<number> {
	const [id, countArg, levelArg = 'all', seedArg = '1'] = process.argv.slice(2);
	if (!id || !countArg) {
		console.error('usage: sample.mts <generatorId> <count> [level|all] [startSeed]');
		return 2;
	}
	const gen = await getGenerator(id);
	const count = Number(countArg);
	const startSeed = Number(seedArg);
	const levels = levelArg === 'all' ? Object.keys(gen.levels).map(Number) : [Number(levelArg)];
	for (const level of levels) {
		if (!gen.levels[level]) {
			console.error(`unknown level ${level} for ${id}`);
			return 2;
		}
	}

	let bad = 0;
	const out: string[] = [];
	for (const level of levels) {
		for (let i = 0; i < count; i++) {
			const seed = startSeed + i;
			try {
				const sample = gen.generate(createRng(seed), level);
				if (gen.toChoice) sample.choice = gen.toChoice(sample, createRng(deriveSeed(seed, level)));
				const violations = gen.check(sample);
				if (violations.length > 0) {
					bad++;
					console.error(`[check] level ${level} seed ${seed}: ${violations.join('; ')}`);
				}
				out.push(JSON.stringify(sample));
			} catch (e) {
				bad++;
				console.error(`[error] level ${level} seed ${seed}: ${(e as Error).stack ?? e}`);
				// Also on stdout, so verify.py counts the crash as a failure instead of a missing sample.
				out.push(JSON.stringify({ generatorId: id, level, seed, error: String((e as Error).message ?? e) }));
			}
		}
	}
	process.stdout.write(out.join('\n') + (out.length ? '\n' : ''));
	return bad > 0 ? 1 : 0;
}

process.exitCode = await main();
