'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnsweredView, ExerciseView, PracticeState, SessionView, WeekDay } from '@/lib/server/exercises';
import type { Streak } from '@/lib/exercises/streak';
import { progressStore } from '@/lib/state/progress';
import { post, type Progress } from '@/components/content/exercises/RunPlayer';
import { MixedRun } from '@/components/content/exercises/ReviewRun';
import { PracticeCard } from './PracticeCard';
import { StreakCard } from './StreakCard';

/** A run under way on Oggi, possibly taken up again. */
interface Current {
	session: SessionView;
	first: ExerciseView;
	startAt: number;
	initial?: Progress[];
	earlier?: AnsweredView[];
}

interface Props {
	streak: Streak;
	week: WeekDay[];
	practice: PracticeState;
	/** A Free account with no questions left today. */
	blocked: boolean;
}

/**
 * The student's day (vault/Decisioni/2026-09-25 Oggi è lo schermo iniziale dell'app.md): the streak and today's
 * practice, run right here. Back from a run, the server draws the page again with the new streak.
 */
export function TodayScreen({ streak, week, practice, blocked }: Props) {
	const router = useRouter();
	const [run, setRun] = useState<Current | null>(null);
	const [starting, setStarting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const startPractice = async () => {
		if (starting) return;
		setStarting(true);
		setError(null);
		try {
			const res = await post<{ session: SessionView; exercise: ExerciseView; startAt: number; progress?: Progress[]; mistakes?: AnsweredView[] }>('/api/esercizi', { kind: 'practice' });
			setRun({ session: res.session, first: res.exercise, startAt: res.startAt, initial: res.progress, earlier: res.mistakes });
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setStarting(false);
		}
	};

	const back = () => {
		progressStore.getState().invalidate();
		setRun(null);
		router.refresh();
	};

	if (run)
		return (
			<div className="-mx-4 min-h-[70dvh] sm:mx-0">
				<MixedRun
					session={run.session}
					first={run.first}
					startAt={run.startAt}
					initial={run.initial}
					earlier={run.earlier}
					title="Pratica di oggi"
					outcome={(correct, total) => ({ title: 'Pratica fatta', detail: correct === total ? 'Tutte giuste. Domani ne trovi una nuova.' : `${correct} giuste su ${total}. Gli errori li ritrovi da rifare.` })}
					backLabel="Torna a Oggi"
					onBack={back}
				/>
			</div>
		);

	return (
		<div className="flex flex-col gap-6">
			<PracticeCard practice={practice} onStart={startPractice} starting={starting} blocked={blocked} error={error} />
			<StreakCard streak={streak} week={week} />
		</div>
	);
}
