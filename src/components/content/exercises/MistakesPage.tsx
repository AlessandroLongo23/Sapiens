'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Repeat } from 'lucide-react';
import type { ExerciseView, MistakeView, SessionView } from '@/lib/server/exercises';
import { CLOSE_AFTER, REVIEW_LENGTH } from '@/lib/exercises/review';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';
import { MistakeCard } from './RunMistakes';
import { ReviewRun } from './ReviewRun';
import { post } from './RunPlayer';

const DAY = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', timeZone: 'Europe/Rome' });

interface Props {
	items: MistakeView[];
	/** Levels with a mistake still to redo. */
	open: number;
	/** The page shown, from 0. */
	page: number;
	more: boolean;
	/** A Free account: a review uses today's free questions. */
	free: boolean;
	/** Free questions left today. */
	left: number;
}

/**
 * The list of mistakes, newest first, and the way to redo the open ones: a review of new exercises at those levels,
 * run right here. A mistake is open until it is answered right CLOSE_AFTER times at its level.
 */
export function MistakesPage({ items, open, page, more, free, left }: Props) {
	const router = useRouter();
	const [review, setReview] = useState<{ session: SessionView; first: ExerciseView } | null>(null);
	const [starting, setStarting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const blocked = free && left === 0;

	const start = async () => {
		if (starting) return;
		setStarting(true);
		setError(null);
		try {
			setReview(await post<{ session: SessionView; exercise: ExerciseView }>('/api/esercizi', { kind: 'review' }).then((r) => ({ session: r.session, first: r.exercise })));
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setStarting(false);
		}
	};

	if (review)
		return (
			<div className="-mx-4 min-h-[70dvh] sm:mx-0">
				<ReviewRun
					session={review.session}
					first={review.first}
					backLabel="Torna ai tuoi errori"
					showListLink={false}
					onBack={() => {
						setReview(null);
						router.refresh();
					}}
				/>
			</div>
		);

	return (
		<div className="flex flex-col gap-8">
			<section aria-labelledby="redo-title" className="flex flex-col gap-4 rounded-2xl border border-edge bg-surface p-5 shadow-paper sm:flex-row sm:items-center sm:p-6">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<h2 id="redo-title" className="text-lg font-semibold text-fg-strong">
						{open === 0 ? 'Nessun errore da rifare' : open === 1 ? 'Un livello da rifare' : `${open} livelli da rifare`}
					</h2>
					<p className="text-sm text-fg-muted">
						{open === 0
							? `Hai chiuso tutti gli errori degli ultimi 30 giorni. Un errore si chiude rispondendo giusto ${CLOSE_AFTER} volte allo stesso livello.`
							: blocked
								? "Hai usato la sessione gratuita di oggi: domani puoi rifarli, oppure passa a Studio."
								: free
									? `Fino a ${REVIEW_LENGTH} esercizi nuovi sui livelli dove hai sbagliato, con le domande gratuite di oggi.`
									: `${REVIEW_LENGTH} esercizi nuovi sui livelli dove hai sbagliato.`}
					</p>
					{error && (
						<p role="alert" className="text-sm text-danger-fg">
							{error}
						</p>
					)}
				</div>
				{open > 0 && (
					<Button size="lg" onClick={start} loading={starting} disabled={blocked} className="shrink-0">
						<Repeat className="size-4" aria-hidden="true" />
						Rifai gli errori
					</Button>
				)}
			</section>

			<ol className="flex flex-col gap-4" aria-label="Errori">
				{items.map((m) => (
					<li key={m.exercise.id}>
						<MistakeCard
							mistake={m}
							heading={
								<div className="flex flex-wrap items-center justify-between gap-2">
									<div className="flex min-w-0 flex-col gap-0.5">
										{m.lesson ? (
											<Link href={m.lesson.url} className="truncate text-sm font-semibold text-fg-strong hover:text-accent-fg focus-ring">
												<Html as="span" html={m.lesson.titleHtml} className="math-inline" />
											</Link>
										) : (
											<span className="text-sm font-semibold text-fg-strong">Lezione non più disponibile</span>
										)}
										<span className="text-xs text-fg-subtle">
											Livello {m.exercise.level}
											{m.levelName && <> · {m.levelName}</>} · {DAY.format(new Date(m.at))}
										</span>
									</div>
									{m.open !== null && <span className={cn('label-mono shrink-0 rounded-md px-2 py-1', m.open ? 'bg-danger-soft text-danger-fg' : 'bg-ok-soft text-ok-fg')}>{m.open ? 'Da rifare' : 'Rifatto'}</span>}
								</div>
							}
						/>
					</li>
				))}
			</ol>

			{(page > 0 || more) && (
				<nav aria-label="Pagine degli errori" className="flex items-center justify-between gap-4">
					{page > 0 ? (
						<Link href={page === 1 ? '/errori' : `/errori?pagina=${page}`} className="inline-flex items-center gap-2 rounded text-sm font-medium text-fg-muted hover:text-fg focus-ring">
							<ArrowLeft className="size-4" aria-hidden="true" />
							Più recenti
						</Link>
					) : (
						<span />
					)}
					{more && (
						<Link href={`/errori?pagina=${page + 2}`} className="inline-flex items-center gap-2 rounded text-sm font-medium text-fg-muted hover:text-fg focus-ring">
							Più vecchi
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					)}
				</nav>
			)}
		</div>
	);
}
