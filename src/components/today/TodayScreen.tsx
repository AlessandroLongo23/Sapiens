'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnsweredView, ExerciseView, SessionView, TodayView } from '@/lib/server/exercises';
import { progressStore } from '@/lib/state/progress';
import { post, type Progress } from '@/components/content/exercises/RunPlayer';
import { MixedRun, ReviewRun } from '@/components/content/exercises/ReviewRun';
import { PracticeCard } from './PracticeCard';
import { StreakCard } from './StreakCard';
import { FreeCard, MistakesCard, NextCard, ResumeCard } from './TodayCards';

/** A run under way on Oggi, possibly taken up again. */
interface Current {
	kind: 'practice' | 'review';
	session: SessionView;
	first: ExerciseView;
	startAt: number;
	initial?: Progress[];
	earlier?: AnsweredView[];
}

interface Props {
	today: TodayView;
}

/**
 * The student's day (vault/Decisioni/2026-09-25 Oggi è lo schermo iniziale dell'app.md), most pressing first: the
 * run left halfway, today's practice and the streak, the mistakes to redo, where the path goes on, and the free
 * questions left. Practice and reviews run right here; back from one, the server draws the page again.
 */
export function TodayScreen({ today }: Props) {
	const { streak, week, practice, resume, next, openMistakes, freeLeft } = today;
	const blocked = freeLeft === 0;
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
			setRun({ kind: 'practice', session: res.session, first: res.exercise, startAt: res.startAt, initial: res.progress, earlier: res.mistakes });
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setStarting(false);
		}
	};

	const [reviewing, setReviewing] = useState(false);
	const [reviewError, setReviewError] = useState<string | null>(null);
	const startReview = async () => {
		if (reviewing) return;
		setReviewing(true);
		setReviewError(null);
		try {
			const res = await post<{ session: SessionView; exercise: ExerciseView }>('/api/esercizi', { kind: 'review' });
			setRun({ kind: 'review', session: res.session, first: res.exercise, startAt: 0 });
		} catch (err) {
			setReviewError((err as Error).message);
		} finally {
			setReviewing(false);
		}
	};

	const back = () => {
		progressStore.getState().invalidate();
		setRun(null);
		router.refresh();
	};

	if (run?.kind === 'review')
		return (
			<div className="-mx-4 min-h-[70dvh] sm:mx-0">
				<ReviewRun session={run.session} first={run.first} backLabel="Torna a Oggi" onBack={back} />
			</div>
		);

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
			{resume && <ResumeCard resume={resume} />}
			<PracticeCard practice={practice} onStart={startPractice} starting={starting} blocked={blocked && practice.state !== 'done'} error={error} />
			<StreakCard streak={streak} week={week} />
			{openMistakes > 0 && (
				<div className="flex flex-col gap-2">
					<MistakesCard open={openMistakes} onRedo={startReview} starting={reviewing} blocked={blocked} />
					{reviewError && (
						<p role="alert" className="px-1 text-sm text-danger-fg">
							{reviewError}
						</p>
					)}
				</div>
			)}
			{next && !(resume && resume.exercisesUrl === next.exercisesUrl) && <NextCard next={next} />}
			{freeLeft !== null && <FreeCard left={freeLeft} />}
		</div>
	);
}
