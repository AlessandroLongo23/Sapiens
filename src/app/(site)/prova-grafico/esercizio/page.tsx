import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { Page } from '@/components/content/PageHeader';
import { answerExercise, previewExercise, type BuildResponse, type Verdict } from '@/lib/server/exercises';
import { generators } from '@/lib/exercises';
import { getGenerator } from '@/lib/exercises/v2/registry';
import { ExerciseProbe } from './ExerciseProbe';

/**
 * Only in development: one exercise of a generator, at a level and a seed, asked as a choice or as an open
 * question (`?g=inf-ciclo-while&l=5&seed=1&open=1`), without a run and without the database. For looking at the
 * exercises that show or ask for a flowchart or a program. In production it answers 404.
 */
export const metadata: Metadata = { title: 'Prova di un esercizio', robots: { index: false, follow: false } };

async function grade(key: string, response: { choice?: number; latex?: string; built?: BuildResponse }): Promise<Verdict> {
	'use server';
	if (process.env.NODE_ENV === 'production') notFound();
	// graded as on the site; the attempt is not saved, there is none
	return (await answerExercise('preview', key, response, null)).verdict;
}

export default async function ExerciseTrial({ searchParams }: { searchParams: Promise<{ g?: string; l?: string; seed?: string; open?: string }> }) {
	if (process.env.NODE_ENV === 'production') notFound();
	const { g = 'inf-ciclo-while', l = '1', seed = '1', open } = await searchParams;
	// a generator not yet wired to a lesson is read from its file, by its id
	const generator = generators[g] ? await generators[g]() : await getGenerator(g);
	const exercise = previewExercise(generator, Number(l), Number(seed), open ? 'open' : 'choice');
	return (
		<Page>
			<p className="label-mono mb-6 text-fg-subtle">
				{g} · livello {l} · seed {seed} · {exercise.mode === 'open' ? 'aperta' : 'scelta multipla'}
			</p>
			<ExerciseProbe key={exercise.key} exercise={exercise} grade={grade} />
		</Page>
	);
}
