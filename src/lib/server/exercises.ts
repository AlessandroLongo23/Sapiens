import 'server-only';
import { configs } from '@/lib/exercises/config';
import { generatorModules } from '@/lib/exercises';
import { optionsOf } from '@/lib/exercises/abstract';
import { renderMath, renderTex } from '@/lib/content/markdown';
import { presentProblem } from '@/lib/exercises/present';

/** A piece of a question, typeset: a paragraph, the question itself as a sentence, a row of givens, a formula on its own. */
export type QuestionBlock = { kind: 'text' | 'ask'; html: string } | { kind: 'givens'; items: string[] } | { kind: 'math'; html: string };

/** Instructions that say nothing the question does not: dropped when the problem asks its own question. */
const GENERIC_PROMPTS = new Set(['Scegli la risposta corretta.']);
/** A short sentence ending in "?" is the question, not context: it is set like one. */
const isAsk = (tex: string) => tex.trim().endsWith('?') && tex.length <= 100;

/** One exercise as sent to the browser: question and answers already typeset, so the client ships no KaTeX. */
export interface ExerciseView {
	id: string;
	/** The instruction ("Scrivi l'unione per elencazione."), plain HTML; empty when the problem speaks for itself. */
	promptHtml: string;
	blocks: QuestionBlock[];
	/** Plain-ish text of each answer, for the column-count guess. */
	options: { html: string; text: string; isCorrect: boolean }[];
}

/** A v2 question as instruction and blocks; an old one, which only has its text, as one block. */
function question(q: { textContent: string; prompt?: string; problem?: string }): Pick<ExerciseView, 'promptHtml' | 'blocks'> {
	if (q.problem == null) return { promptHtml: '', blocks: [{ kind: 'math', html: renderMath(q.textContent) }] };
	const blocks = q.problem.trim()
		? presentProblem(q.problem).map((b): QuestionBlock =>
				b.kind === 'text' ? { kind: isAsk(b.tex) ? 'ask' : 'text', html: renderMath(b.tex) } : b.kind === 'givens' ? { kind: 'givens', items: b.items.map((t) => renderTex(t, false)) } : { kind: 'math', html: renderTex(b.tex, true) }
			)
		: [];
	const asks = blocks.some((b) => b.kind === 'ask');
	const prompt = q.prompt && !(asks && GENERIC_PROMPTS.has(q.prompt)) ? q.prompt : '';
	return { promptHtml: prompt ? renderMath(prompt) : '', blocks };
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
					...question(instance.question),
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
