/**
 * Checks the table of open answers (src/lib/exercises/v2/open-answers.ts) against the generators, and prints a
 * summary of what each maths lesson offers as open answer.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/open-answers.mts [samples per level, default 200]
 *
 * Fails (exit 1) when a row names a generator or a level that does not exist or that no maths lesson offers, when a
 * `form` row has expression samples with no form to grade, when a sample's form is not one the grader knows, or when an
 * offered level with open answers in its samples is missing from the table.
 */
import { configs } from '../../src/lib/exercises/config';
import { openAnswers } from '../../src/lib/exercises/v2/open-answers';
import { getGenerator } from '../../src/lib/exercises/v2/registry';
import { createRng } from '../../src/lib/exercises/v2/rng';
import type { AnswerForm } from '../../src/lib/exercises/v2/types';

const FORMS: readonly string[] = ['expanded', 'factored', 'irreducible', 'simplified', 'rationalized', 'explicit', 'power', 'radical', 'decimal'] satisfies AnswerForm[];
/** Names the generators use for a form the grader knows by another name. */
const ALIASES: Record<string, AnswerForm> = { irriducibile: 'irreducible' };

async function main(): Promise<number> {
	const count = Number(process.argv[2] ?? 200);
	const offered = new Map<string, Set<number>>();
	for (const [path, c] of Object.entries(configs)) {
		if (!path.startsWith('high_school/math/')) continue;
		const levels = offered.get(c.generator) ?? new Set<number>();
		for (const l of c.levels) levels.add(l);
		offered.set(c.generator, levels);
	}

	const errors: string[] = [];
	/** Generator failures: a bug of the generator, not of the table, reported without failing the check. */
	const warnings: string[] = [];
	const tally: Record<string, number> = {};
	let closed = 0;
	for (const [id, levels] of offered) {
		const gen = await getGenerator(id);
		for (const level of [...levels].sort((a, b) => a - b)) {
			const row = openAnswers[id]?.[level];
			let open = 0;
			const forms = new Set<string>();
			let formless = 0;
			const failed: number[] = [];
			for (let i = 0; i < count; i++) {
				const seed = 500_000 + i * 7919;
				let s;
				try {
					s = gen.generate(createRng(seed), level);
				} catch {
					failed.push(seed);
					continue;
				}
				if (s.answer.kind === 'choice') continue;
				open++;
				if (s.answer.kind !== 'expression') continue;
				if (s.answer.form) forms.add(ALIASES[s.answer.form] ?? s.answer.form);
				else formless++;
			}
			const where = `${id}#${level}`;
			if (failed.length) warnings.push(`${where}: generation fails on ${failed.length}/${count} seeds, e.g. ${failed.slice(0, 3).join(', ')}`);
			if (!row) {
				if (open > 0) errors.push(`${where}: ${open}/${count} samples have an open answer, but the level is not in the table`);
				closed++;
				continue;
			}
			if (open === 0) errors.push(`${where}: in the table, but every sample is multiple choice`);
			if (row.grade === 'form' && !row.form && formless > 0) errors.push(`${where}: graded on the form, but ${formless} expression samples declare none`);
			for (const f of forms) if (!FORMS.includes(f)) errors.push(`${where}: sample form "${f}" is not one the grader knows`);
			const key = row.grade === 'value' ? (row.set === 'excluded' ? 'value, excluded set' : 'value') : `form ${row.form ?? [...forms].sort().join('/')}`;
			tally[key] = (tally[key] ?? 0) + 1;
		}
	}
	for (const [id, levels] of Object.entries(openAnswers)) {
		for (const level of Object.keys(levels).map(Number)) {
			if (!offered.get(id)?.has(level)) errors.push(`${id}#${level}: in the table, but no maths lesson offers it`);
		}
	}

	const open = Object.values(tally).reduce((a, b) => a + b, 0);
	console.log(`${open} levels with open answers, ${closed} multiple choice only`);
	for (const [k, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);
	for (const w of warnings) console.warn(`warning: ${w}`);
	for (const e of errors) console.error(e);
	return errors.length ? 1 : 0;
}

main().then((code) => process.exit(code));
