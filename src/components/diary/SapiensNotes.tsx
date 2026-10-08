'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ListChecks, Play, Repeat } from 'lucide-react';
import type { TestReview } from '@/lib/server/diary';
import type { TodayView } from '@/lib/server/exercises';
import type { Streak } from '@/lib/exercises/streak';
import { STREAK_MIN_ANSWERS } from '@/lib/exercises/streak';
import { PRACTICE_LENGTH } from '@/lib/exercises/practice';
import { SESSION_LENGTH } from '@/lib/exercises/config';
import { REVIEW_LENGTH } from '@/lib/exercises/review';
import { KIND_LABEL } from '@/lib/diary/entries';
import { SUBJECT_BY_KEY } from '@/lib/diary/subjects';
import { daysBetween, relativeDay, weekdayName, type Day } from '@/lib/diary/dates';
import { CONTENT_ROOT } from '@/lib/config/site';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';
import { Tally } from './Ink';
import type { useRuns } from './useRuns';

const INK_LINK =
	'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-inverse px-5 text-sm font-semibold text-inverse-fg shadow-key transition-transform hover:opacity-90 active:translate-y-px focus-ring-offset';
const SOFT_LINK = 'inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-fg underline decoration-fg-faint underline-offset-4 hover:decoration-fg focus-ring';

/** A note Sapiens stuck on the page: a post-it, a touch crooked, with the voice of the app (typed, not handwritten). */
function PostIt({ tone = 'yellow', tilt, label, delay = 0, children }: { tone?: 'yellow' | 'pink' | 'blue' | 'green'; tilt: number; label: string; delay?: number; children: ReactNode }) {
	return (
		<section className="postit flex flex-col gap-3" data-tone={tone} style={{ '--tilt': `${tilt}deg`, '--d': `${delay}s` } as CSSProperties} aria-label={label}>
			{children}
		</section>
	);
}

const Title = ({ children }: { children: ReactNode }) => <p className="text-base font-semibold leading-snug text-fg-strong">{children}</p>;
const Eyebrow = ({ children }: { children: ReactNode }) => <p className="label-mono text-[0.62rem] text-fg-muted">{children}</p>;

/** Levels passed out of the levels, as boxes ticked by hand. */
function Boxes({ passed, total }: { passed: number; total: number }) {
	return (
		<span className="flex gap-[3px]" aria-label={`${passed} livelli su ${total}`}>
			{Array.from({ length: total }, (_, i) => (
				<span key={i} className={cn('size-2.5 rounded-[2px] border', i < passed ? 'border-ok bg-ok' : 'border-fg-faint')} />
			))}
		</span>
	);
}

/** The lessons of a test and how far the student has got on each: the least advanced first, as a start. */
function TestLessons({ review }: { review: TestReview }) {
	const next = [...review.lessons].sort((a, b) => a.passed / Math.max(1, a.total) - b.passed / Math.max(1, b.total))[0];
	return (
		<>
			<ul className="flex flex-col gap-1.5">
				{review.lessons.slice(0, 6).map((l) => (
					<li key={l.exercisesUrl} className="flex items-center justify-between gap-3 text-sm">
						<Link href={l.exercisesUrl} className="min-w-0 truncate text-fg hover:underline focus-ring">
							<Html as="span" html={l.titleHtml} className="math-inline" />
						</Link>
						{l.total > 0 ? <Boxes passed={l.passed} total={l.total} /> : <span className="label-mono text-[0.6rem] text-fg-subtle">da iniziare</span>}
					</li>
				))}
			</ul>
			{next && (
				<Link href={next.exercisesUrl} className={INK_LINK}>
					<Play className="size-4 fill-current" aria-hidden="true" />
					<span className="min-w-0 truncate">
						Esercitati su <Html as="span" html={next.titleHtml} className="math-inline" />
					</span>
				</Link>
			)}
		</>
	);
}

function testName(review: TestReview) {
	const subject = review.entry.subject ? SUBJECT_BY_KEY.get(review.entry.subject)?.label.toLowerCase() : null;
	return `${KIND_LABEL[review.entry.kind]}${subject ? ` di ${subject}` : ''}`;
}

/**
 * What Sapiens suggests today, as post-its on the page: the run left halfway, the tests coming (with their lessons),
 * today's practice, the mistakes to redo, where the path goes on, the free questions left. Practice and reviews
 * start right here.
 */
export function SapiensNotes({ now, reviews, runs, today }: { now: TodayView; reviews: TestReview[]; runs: ReturnType<typeof useRuns>; today: Day }) {
	const { practice, resume, next, openMistakes, freeLeft } = now;
	const blocked = freeLeft === 0;
	const done = practice.state === 'done';
	let n = 0;
	const tilt = () => [-1.2, 0.9, -0.6, 1.3, -0.9][n++ % 5];
	const delay = () => 0.08 * n;

	return (
		<section aria-labelledby="sapiens-title" className="flex flex-col gap-5">
			<h2 id="sapiens-title" className="label-mono text-fg-subtle">
				Da Sapiens
			</h2>

			{resume && (
				<PostIt tone="green" tilt={tilt()} delay={delay()} label="Prova a metà">
					<Eyebrow>Prova a metà</Eyebrow>
					<Title>
						<Html as="span" html={resume.titleHtml} className="math-inline" />
					</Title>
					<p className="text-sm text-fg-muted">
						{resume.kind === 'jump' ? `Salto al livello ${resume.level}` : `Livello ${resume.level}`}: {resume.answered} di {resume.length}
					</p>
					<Link href={resume.exercisesUrl} className={cn(INK_LINK, 'self-start')}>
						<Play className="size-4 fill-current" aria-hidden="true" />
						Riprendi
					</Link>
				</PostIt>
			)}

			{reviews.map((r) => (
				<PostIt key={r.entry.id} tone="pink" tilt={tilt()} delay={delay()} label={`Ripasso per ${testName(r)}`}>
					<Eyebrow>
						{testName(r)} {relativeDay(r.entry.day, today)}
					</Eyebrow>
					<Title>
						Ripassa <Html as="span" html={r.topicTitleHtml} className="math-inline" />
					</Title>
					<TestLessons review={r} />
				</PostIt>
			))}

			<PostIt tone="yellow" tilt={tilt()} delay={delay()} label="Pratica di oggi">
				<div className="flex items-start justify-between gap-3">
					<div className="flex min-w-0 flex-col gap-1">
						<Eyebrow>Pratica di oggi</Eyebrow>
						<Title>
							{practice.state === 'none'
								? 'Parte dalle lezioni che hai cominciato'
								: practice.state === 'done'
									? `Fatta: ${practice.correct} giuste su ${practice.length}`
									: practice.state === 'doing'
										? `A metà: ${practice.answered} di ${practice.length}`
										: `${PRACTICE_LENGTH} domande dalle tue lezioni`}
						</Title>
						<p className="text-sm text-fg-muted">
							{practice.state === 'none'
								? 'Fai una prova in una lezione: da domani la pratica te la ripropone insieme ai tuoi errori.'
								: done
									? 'Domani ne trovi una nuova.'
									: blocked
										? 'Hai usato la sessione gratuita di oggi: domani la trovi qui, oppure passa a Studio.'
										: 'Un po’ di quello che hai già fatto, gli errori da ripassare, un passo avanti. Circa tre minuti.'}
						</p>
					</div>
					{done && (
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ok text-white" aria-hidden="true">
							<Check className="size-5" strokeWidth={3} />
						</span>
					)}
				</div>
				{runs.error?.kind === 'practice' && (
					<p role="alert" className="text-sm text-danger-fg">
						{runs.error.message}
					</p>
				)}
				{practice.state === 'none' ? (
					<Link href={CONTENT_ROOT} className={cn(INK_LINK, 'self-start')}>
						Scegli una lezione
					</Link>
				) : (
					!done && (
						<Button variant="inverse" className="self-start" onClick={() => runs.start('practice')} loading={runs.starting === 'practice'} disabled={blocked}>
							<Play className="size-4 fill-current" aria-hidden="true" />
							{practice.state === 'doing' ? 'Riprendi la pratica' : 'Inizia la pratica'}
						</Button>
					)
				)}
			</PostIt>

			{openMistakes > 0 && (
				<PostIt tone="blue" tilt={tilt()} delay={delay()} label="Errori da ripassare">
					<Eyebrow>Errori da ripassare</Eyebrow>
					<Title>{openMistakes === 1 ? 'Un livello da ripassare' : `${openMistakes} livelli da ripassare`}</Title>
					<p className="text-sm text-fg-muted">
						{blocked ? 'Domani puoi ripassarli con la sessione gratuita, oppure passa a Studio.' : `${REVIEW_LENGTH} esercizi nuovi sui livelli dove hai sbagliato.`}
					</p>
					{runs.error?.kind === 'review' && (
						<p role="alert" className="text-sm text-danger-fg">
							{runs.error.message}
						</p>
					)}
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
						<Button variant="inverse" onClick={() => runs.start('review')} loading={runs.starting === 'review'} disabled={blocked}>
							<Repeat className="size-4" aria-hidden="true" />
							Ripassa
						</Button>
						<Link href="/errori" className={SOFT_LINK}>
							<ListChecks className="size-4" aria-hidden="true" />
							Vedi l&apos;elenco
						</Link>
					</div>
				</PostIt>
			)}

			{next && !(resume && resume.exercisesUrl === next.exercisesUrl) && (
				<PostIt tone="yellow" tilt={tilt()} delay={delay()} label={next.done ? 'Lezione completata' : 'Continua il percorso'}>
					<Eyebrow>{next.done ? 'Lezione completata' : 'Continua il percorso'}</Eyebrow>
					<Title>
						<Html as="span" html={next.titleHtml} className="math-inline" />
					</Title>
					<p className="text-sm text-fg-muted">
						{next.done ? 'Hai superato tutti i livelli. Nel capitolo trovi la lezione dopo.' : `Livello ${next.level}${next.levelName ? `: ${next.levelName}` : ''}`}
					</p>
					<Link href={next.done ? next.chapterUrl : next.exercisesUrl} className={SOFT_LINK}>
						{next.done ? 'Vai al capitolo' : `Vai al livello ${next.level}`}
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</PostIt>
			)}

			{freeLeft !== null && (
				<p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-dashed border-edge-strong px-4 py-3 text-sm text-fg-muted">
					<span>
						{freeLeft > 0 ? (
							<>
								Sessione gratuita: oggi ti {freeLeft === 1 ? 'resta' : 'restano'} <span className="font-semibold text-fg tabular-nums">{freeLeft}</span> {freeLeft === 1 ? 'domanda' : 'domande'} su{' '}
								{SESSION_LENGTH}.
							</>
						) : (
							`Sessione gratuita fatta. Domani ne hai altre ${SESSION_LENGTH}.`
						)}
					</span>
					<Link href="/pricing" className="font-medium text-accent-fg underline underline-offset-2 hover:text-accent-hover focus-ring">
						Con Studio senza limiti
					</Link>
				</p>
			)}
		</section>
	);
}

/** On a day to come, a few days before a test: the review Sapiens plans for that day. */
export function PlannedReview({ review, day, tilt }: { review: TestReview; day: Day; tilt: number }) {
	const left = daysBetween(day, review.entry.day);
	return (
		<PostIt tone="pink" tilt={tilt} label={`Ripasso previsto per ${testName(review)}`}>
			<Eyebrow>Ripasso previsto</Eyebrow>
			<Title>
				{left === 1 ? 'Domani' : `Tra ${left} giorni`}, {weekdayName(review.entry.day)}: {testName(review).toLowerCase()} su <Html as="span" html={review.topicTitleHtml} className="math-inline" />
			</Title>
			<TestLessons review={review} />
		</PostIt>
	);
}

/** What the streak means today, in one line, without blame: a streak only ever asks for today's answers. */
function streakLine(streak: Streak): string {
	const missing = Math.max(0, STREAK_MIN_ANSWERS - streak.todayAnswered);
	if (streak.today) return streak.best > streak.current ? `Oggi fatto. Il tuo record è di ${streak.best} giorni.` : 'Oggi fatto: è il tuo record.';
	if (streak.atRisk) return `Rispondi ad altre ${missing} ${missing === 1 ? 'domanda' : 'domande'} oggi per tenere la serie.`;
	return streak.todayAnswered > 0 ? `Ancora ${missing} ${missing === 1 ? 'domanda' : 'domande'} e oggi conta per la serie.` : `Rispondi a ${STREAK_MIN_ANSWERS} domande oggi per cominciare una serie.`;
}

/** The streak at the foot of today's page: the days in a row as tally marks, and what today still asks. */
export function StreakLine({ streak }: { streak: Streak }) {
	return (
		<section aria-labelledby="streak-title" className="flex flex-col gap-2 border-t border-dashed border-edge-strong pt-4">
			<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
				<h2 id="streak-title" className="label-mono text-fg-subtle">
					Serie di giorni
				</h2>
				{streak.current > 0 ? <Tally count={streak.current} /> : <span className="pencil text-xl">ancora nessuna</span>}
				{streak.current > 0 && (
					<span className="diary-pen text-2xl">
						{streak.current} {streak.current === 1 ? 'giorno' : 'giorni'}
					</span>
				)}
			</div>
			<p className="text-sm text-fg-muted">{streakLine(streak)}</p>
		</section>
	);
}
