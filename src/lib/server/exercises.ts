import 'server-only';
import { configs } from '@/lib/exercises/config';
import { generatorModules } from '@/lib/exercises';
import { optionsOf } from '@/lib/exercises/abstract';
import { renderMath } from '@/lib/content/markdown';

/** One exercise as sent to the browser: question and answers already typeset, so the client ships no KaTeX. */
export interface ExerciseView {
	id: string;
	questionHtml: string;
	/** Plain-ish text of each answer, for the column-count guess. */
	options: { html: string; text: string; isCorrect: boolean }[];
}

/** Whether a lesson (by database path and slug) has an exercise generator. */
export const hasExercises = (dbPath: string, slug: string): boolean => !!configs[dbPath] && !!generatorModules[slug];

/** A fresh, shuffled set of exercises for a lesson; every call generates different numbers. Empty when a generator fails. */
export async function generateExercises(dbPath: string, slug: string): Promise<ExerciseView[]> {
	const topicConfig = configs[dbPath];
	const load = generatorModules[slug];
	if (!topicConfig || !load) return [];
	try {
		const generators = await load();
		// The session climbs from the easiest level to the hardest; the order is shuffled only inside each level.
		const byLevel = new Map<number, ExerciseView[]>();
		for (const { generator, count, args } of Object.values(topicConfig)) {
			const Generator = generators[generator];
			if (!Generator) throw new Error(`Generator '${generator}' not found in ${slug}`);
			const level = args[0] ?? 0;
			const group = byLevel.get(level) ?? [];
			byLevel.set(level, group);
			for (let i = 0; i < count; i++) {
				const instance = new Generator(...args);
				group.push({
					id: `${generator}-${i}-${Math.random().toString(36).slice(2, 8)}`,
					questionHtml: renderMath(instance.question.textContent),
					options: optionsOf(instance).map((a) => ({ html: renderMath(a.textContent), text: a.textContent, isCorrect: a.isCorrect }))
				});
			}
		}
		return [...byLevel.entries()].sort(([a], [b]) => a - b).flatMap(([, group]) => group.shuffle());
	} catch (err) {
		console.error(`exercise generation failed for ${slug}:`, err);
		return [];
	}
}
