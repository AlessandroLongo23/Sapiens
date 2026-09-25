'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import type { ExerciseView, SessionView } from '@/lib/server/exercises';
import { CLOSE_AFTER } from '@/lib/exercises/review';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';
import { RunMistakes } from './RunMistakes';
import { RunPlayer, type Progress, type RunResult } from './RunPlayer';
import { SummarySheet } from './SummarySheet';

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

/**
 * A review run (vault/Decisioni/2026-09-25 Rifare gli errori vuol dire esercizi nuovi sugli stessi livelli.md): new
 * exercises at the levels answered wrong, then a summary. A review trains; it never passes or opens a level.
 */
export function ReviewRun({ session, first, backLabel, onBack, showListLink = true }: { session: SessionView; first: ExerciseView; backLabel: string; onBack: () => void; showListLink?: boolean }) {
	const [done, setDone] = useState<{ results: RunResult[]; progress: Progress[] } | null>(null);
	const correct = done ? done.progress.filter((p) => p === 'correct').length : 0;
	const all = done !== null && correct === session.length;
	return (
		<>
			<RunPlayer key={session.id} session={session} first={first} finished={!!done} onLeave={onBack} onFinish={(results, progress) => setDone({ results, progress })} label={itemLabel(session, 'Ripasso degli errori')} />
			<SummarySheet
				open={!!done}
				correct={correct}
				total={session.length}
				passed={all}
				title={all ? 'Tutto giusto' : 'Ripasso finito'}
				detail={`Un errore si chiude quando rispondi giusto ${CLOSE_AFTER} volte allo stesso livello.`}
				onClose={onBack}
				actions={
					<>
						<Button size="lg" className="w-full" onClick={onBack}>
							{backLabel}
						</Button>
						{showListLink && (
							<Link href="/errori" className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-ring">
								<ListChecks className="size-4" aria-hidden="true" />
								Tutti i tuoi errori
							</Link>
						)}
					</>
				}
			>
				{done && <RunMistakes results={done.results} />}
			</SummarySheet>
		</>
	);
}
