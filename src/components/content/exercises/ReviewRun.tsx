'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import type { AnsweredView, ExerciseView, SessionView } from '@/lib/server/exercises';
import { CLOSE_AFTER } from '@/lib/exercises/review';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';
import { RunPlayer, type Progress, type RunResult } from './RunPlayer';
import { SummarySheet } from './SummarySheet';
import { RunReview } from './RunReview';

/** The line above a question of a run across lessons: which lesson and level it comes from. */
export function itemLabel(session: SessionView, title: string) {
	return function Label(index: number) {
		const item = session.items?.[index];
		return (
			<>
				<span className="label-mono shrink-0 text-fg-subtle">{title}</span>
				{item && (
					<>
						<Html as="span" html={item.lessonTitleHtml} className="math-inline min-w-0 truncate text-fg-muted" />
						<span className="shrink-0 text-fg-muted">· livello {item.level}</span>
					</>
				)}
			</>
		);
	};
}

interface MixedProps {
	session: SessionView;
	first: ExerciseView;
	/** Taken up again: where it starts, how the questions before went, and the mistakes among them. */
	startAt?: number;
	initial?: Progress[];
	earlier?: AnsweredView[];
	/** What the run is, above each question: "Ripasso degli errori", "Pratica di oggi". */
	title: string;
	/** The summary's heading and line once all is answered, from the number right. */
	outcome: (correct: number, total: number) => { title: string; detail: string };
	backLabel: string;
	onBack: () => void;
	/** Under the main button: a link somewhere else. */
	extra?: ReactNode;
}

/**
 * A run across lessons (practice, review): the questions, then a summary. It never passes a level. The mistakes
 * have the whole page (RunReview), opened from the summary; back from there returns to it.
 */
export function MixedRun({ session, first, startAt, initial, earlier, title, outcome, backLabel, onBack, extra }: MixedProps) {
	const [done, setDone] = useState<{ results: RunResult[]; progress: Progress[] } | null>(null);
	const [showMistakes, setShowMistakes] = useState(false);
	const correct = done ? done.progress.filter((p) => p === 'correct').length : 0;
	const wrong = done ? done.progress.filter((p) => p === 'incorrect').length : 0;
	const { title: heading, detail } = outcome(correct, session.length);
	const back = (
		<Button variant={wrong > 0 ? 'secondary' : 'primary'} size="lg" className="w-full" onClick={onBack}>
			{backLabel}
		</Button>
	);

	if (done && showMistakes)
		return (
			<RunReview
				heading={<span className="label-mono text-fg-subtle">{title}</span>}
				correct={correct}
				total={session.length}
				outcome={heading}
				results={done.results}
				backLabel="Torna al riepilogo"
				onBack={() => setShowMistakes(false)}
				actions={
					<>
						{back}
						{extra}
					</>
				}
			/>
		);

	return (
		<>
			<RunPlayer key={session.id} session={session} first={first} startAt={startAt} initial={initial} earlier={earlier} finished={!!done} onLeave={onBack} onFinish={(results, progress) => setDone({ results, progress })} label={itemLabel(session, title)} />
			<SummarySheet
				open={!!done}
				correct={correct}
				total={session.length}
				passed={done !== null && correct === session.length}
				title={heading}
				detail={detail}
				onClose={onBack}
				actions={
					<>
						{wrong > 0 && (
							<Button size="lg" className="w-full" onClick={() => {
								setShowMistakes(true);
								window.scrollTo({ top: 0 });
							}}>
								<ListChecks className="size-5 shrink-0" aria-hidden="true" />
								{wrong === 1 ? "Rivedi l'errore" : `Rivedi gli errori (${wrong})`}
							</Button>
						)}
						{back}
						{extra}
					</>
				}
			/>
		</>
	);
}

/**
 * A review run (vault/Decisioni/2026-09-25 Rifare gli errori vuol dire esercizi nuovi sugli stessi livelli.md): new
 * exercises at the levels answered wrong, then a summary. A review trains; it never passes or opens a level.
 */
export function ReviewRun({ session, first, backLabel, onBack, showListLink = true }: { session: SessionView; first: ExerciseView; backLabel: string; onBack: () => void; showListLink?: boolean }) {
	return (
		<MixedRun
			session={session}
			first={first}
			title="Ripasso degli errori"
			outcome={(correct, total) => ({ title: correct === total ? 'Tutto giusto' : 'Ripasso finito', detail: `Un errore si chiude quando rispondi giusto ${CLOSE_AFTER} volte allo stesso livello, in prove diverse.` })}
			backLabel={backLabel}
			onBack={onBack}
			extra={
				showListLink && (
					<Link href="/errori" className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-ring">
						<ListChecks className="size-4" aria-hidden="true" />
						Tutti i tuoi errori
					</Link>
				)
			}
		/>
	);
}
