'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AnsweredView, ExerciseView, SessionView } from '@/lib/server/exercises';
import { progressStore } from '@/lib/state/progress';
import { post, type Progress } from '@/components/content/exercises/RunPlayer';
import { MixedRun, ReviewRun } from '@/components/content/exercises/ReviewRun';

/** A run under way on the diary, possibly taken up again. */
interface Current {
	kind: 'practice' | 'review';
	session: SessionView;
	first: ExerciseView;
	startAt: number;
	initial?: Progress[];
	earlier?: AnsweredView[];
}

/**
 * Today's practice and the review of mistakes, run right on the diary's page: `player` is the run while one is
 * under way, in place of the diary; back from it, the server draws the page again with the new counts.
 */
export function useRuns() {
	const router = useRouter();
	const [run, setRun] = useState<Current | null>(null);
	const [starting, setStarting] = useState<'practice' | 'review' | null>(null);
	const [error, setError] = useState<{
		kind: 'practice' | 'review';
		message: string;
	} | null>(null);

	const start = async (kind: 'practice' | 'review') => {
		if (starting) return;
		setStarting(kind);
		setError(null);
		try {
			const res = await post<{
				session: SessionView;
				exercise: ExerciseView;
				startAt?: number;
				progress?: Progress[];
				mistakes?: AnsweredView[];
			}>('/api/esercizi', { kind });
			setRun({
				kind,
				session: res.session,
				first: res.exercise,
				startAt: res.startAt ?? 0,
				initial: res.progress,
				earlier: res.mistakes
			});
		} catch (err) {
			setError({ kind, message: (err as Error).message });
		} finally {
			setStarting(null);
		}
	};

	const back = () => {
		progressStore.getState().invalidate();
		setRun(null);
		router.refresh();
	};

	let player: ReactNode = null;
	if (run?.kind === 'review') player = <ReviewRun session={run.session} first={run.first} backLabel="Torna al diario" onBack={back} />;
	else if (run)
		player = (
			<MixedRun
				session={run.session}
				first={run.first}
				startAt={run.startAt}
				initial={run.initial}
				earlier={run.earlier}
				title="Pratica di oggi"
				outcome={(correct, total) => ({
					title: 'Pratica fatta',
					detail: correct === total ? 'Tutte giuste. Domani ne trovi una nuova.' : `${correct} giuste su ${total}. Gli errori li ritrovi da ripassare.`
				})}
				backLabel="Torna al diario"
				onBack={back}
			/>
		);

	return { player, start, starting, error };
}
