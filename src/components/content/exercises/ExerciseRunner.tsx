'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Repeat, RotateCcw, Route } from 'lucide-react';
import type { ExerciseView, PathView, SessionView } from '@/lib/server/exercises';
import { SESSION_LENGTH } from '@/lib/exercises/config';
import { JUMP_LENGTH, MIN_PASS_LENGTH, canPass, passMark, runPassed, type RunKind } from '@/lib/exercises/levels';
import { cn } from '@/lib/utils/cn';
import { progressStore } from '@/lib/state/progress';
import { Button, LinkButton } from '@/components/ui/Button';
import { ExercisePath } from './ExercisePath';
import { RunMistakes } from './RunMistakes';
import { ReviewRun } from './ReviewRun';
import { RunPlayer, post, type Progress, type RunResult } from './RunPlayer';
import { SummarySheet } from './SummarySheet';

interface Props {
	/** The lesson's database path, which the API knows its exercises by. */
	lesson: string;
	/** The lesson's path as the student left it. */
	path: PathView;
	/** A Free account on its daily session. */
	free?: boolean;
	/** Questions left today on Free; SESSION_LENGTH otherwise. */
	questionsLeft?: number;
	titleHtml: string;
	theoryHref: string;
	nextHref: string | null;
}

/** A run under way on this page: the run, the question to start from, and how it went at the end. */
interface Current {
	session: SessionView;
	first: ExerciseView;
	startAt: number;
	initial?: Progress[];
	earlier?: RunResult[];
	/** Set when the last question is answered: the summary opens. */
	done?: { results: RunResult[]; progress: Progress[] };
}

/**
 * A lesson's exercises (vault/Decisioni/2026-09-25 Gli esercizi sono un percorso di livelli.md): the path of
 * levels, then a run at the level picked (see RunPlayer), then its summary with the mistakes to look back at.
 */
export function ExerciseRunner({ lesson, path, free = false, questionsLeft = SESSION_LENGTH, titleHtml, theoryHref, nextHref }: Props) {
	const router = useRouter();
	const [run, setRun] = useState<Current | null>(null);
	const [starting, setStarting] = useState<number | null>(null);
	const [resuming, setResuming] = useState(false);
	// A review of the mistakes of the run just finished, on this same page.
	const [review, setReview] = useState<{ session: SessionView; first: ExerciseView } | null>(null);
	const [reviewing, setReviewing] = useState(false);
	const [left, setLeft] = useState(questionsLeft);
	const [error, setError] = useState<string | null>(null);
	const questionCount = free ? Math.min(SESSION_LENGTH, left) : SESSION_LENGTH;

	const start = async (kind: RunKind, level: number) => {
		if (starting !== null) return;
		setStarting(level);
		setError(null);
		try {
			const res = await post<{ session: SessionView; exercise: ExerciseView }>('/api/esercizi', { lesson, kind, level });
			setLeft((n) => Math.max(0, n - res.session.length));
			setRun({ session: res.session, first: res.exercise, startAt: 0 });
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setStarting(null);
		}
	};

	/** Takes up the run left halfway, at its first question without an answer, with its mistakes so far. */
	const resume = async () => {
		const unfinished = path.unfinished;
		if (!unfinished || resuming) return;
		setResuming(true);
		setError(null);
		try {
			const { exercise } = await post<{ exercise: ExerciseView }>(`/api/esercizi/prove/${unfinished.session.id}`, { position: unfinished.next });
			setRun({ session: unfinished.session, first: exercise, startAt: unfinished.next, initial: unfinished.progress, earlier: unfinished.mistakes });
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setResuming(false);
		}
	};

	/** Back to the path, which the server draws again with the runs just made. */
	const leave = () => {
		// The badges of the material's pages ask for the progress again.
		progressStore.getState().invalidate();
		setRun(null);
		setReview(null);
		setError(null);
		router.refresh();
	};

	/** New exercises at the levels the run just finished got wrong. */
	const redo = async (sessionId: string) => {
		if (reviewing) return;
		setReviewing(true);
		setError(null);
		try {
			const res = await post<{ session: SessionView; exercise: ExerciseView }>('/api/esercizi', { kind: 'review', session: sessionId });
			setLeft((n) => Math.max(0, n - res.session.length));
			setReview({ session: res.session, first: res.exercise });
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setReviewing(false);
		}
	};

	const alert = error && (
		<p role="alert" className="px-4 text-center text-sm text-danger-fg">
			{error}
		</p>
	);

	if (!run)
		return (
			<>
				{/* Keyed by the suggested level: back from a run that passed, the path opens on the level it unlocked. */}
				<ExercisePath key={path.current} titleHtml={titleHtml} path={path} questionCount={questionCount} onStart={start} starting={starting} onResume={resume} resuming={resuming} />
				{alert}
				{free && !error && <p className="px-4 pb-6 text-center text-sm text-fg-muted">La sessione gratuita di oggi: {left} {left === 1 ? 'domanda' : 'domande'}. Con Studio ti eserciti senza limiti.</p>}
			</>
		);

	if (review) return <ReviewRun session={review.session} first={review.first} backLabel="Torna al percorso" onBack={leave} />;

	const { session } = run;
	// Runs started on a lesson's path are at a level or jump tests; practice and reviews run elsewhere.
	const kind = session.kind as RunKind;
	const length = session.length;
	const wrong = run.done ? run.done.progress.filter((p) => p === 'incorrect').length : 0;
	const correct = run.done ? run.done.progress.filter((p) => p === 'correct').length : 0;
	const levelIndex = path.levels.findIndex((l) => l.level === session.level);
	const levelName = path.levels[levelIndex]?.name;
	const following = path.levels[levelIndex + 1]?.level ?? null;
	const passed = runPassed({ total: length, answered: length, correct });
	const mark = passMark(length);
	// A Free account may have used its whole day on this run.
	const canGo = (kind: RunKind) => !free || left >= (kind === 'jump' ? JUMP_LENGTH : 1);
	const heading = session.kind === 'jump' ? `Prova di salto al livello ${session.level}` : `Livello ${session.level}`;
	const outcome =
		session.kind === 'jump'
			? passed
				? { title: `Si apre il livello ${session.level}`, detail: 'I livelli prima contano come superati.' }
				: { title: 'Non ancora', detail: `Per il salto servivano ${mark} risposte giuste. Puoi riprovarlo o passare dai livelli prima.` }
			: passed
				? { title: `Livello ${session.level} superato`, detail: following ? `Si apre il livello ${following}.` : 'Hai superato tutti i livelli di questa lezione.' }
				: !canPass(length)
					? { title: 'Allenamento fatto', detail: `Una prova di ${length} ${length === 1 ? 'domanda' : 'domande'} allena, ma per superare il livello ne servono almeno ${MIN_PASS_LENGTH}.` }
					: { title: correct >= mark - 2 ? 'Ci sei quasi' : 'Continua ad allenarti', detail: `Per superare il livello servono ${mark} risposte giuste su ${length}.` };
	const retry = passed && kind === 'level' && following !== null ? { kind: 'level' as const, level: following, label: `Vai al livello ${following}` } : passed && kind === 'jump' ? { kind: 'level' as const, level: session.level, label: `Inizia il livello ${session.level}` } : passed ? null : { kind, level: session.level, label: kind === 'jump' ? 'Riprova il salto' : 'Riprova il livello' };
	const actions = (
		<>
			{alert}
			{retry && canGo(retry.kind) ? (
				<Button size="lg" className="w-full" onClick={() => start(retry.kind, retry.level)} loading={starting !== null}>
					{retry.kind === kind && retry.level === session.level ? <RotateCcw className="size-5" aria-hidden="true" /> : <ArrowRight className="size-5" aria-hidden="true" />}
					{retry.label}
				</Button>
			) : retry && free ? (
				<LinkButton href="/pricing" size="lg" className="w-full">
					Hai finito la sessione di oggi: passa a Studio
				</LinkButton>
			) : (
				nextHref && (
					<LinkButton href={nextHref} size="lg" className="w-full">
						Prossima lezione
						<ArrowRight className="size-5" aria-hidden="true" />
					</LinkButton>
				)
			)}
			{wrong > 0 && canGo('level') && (
				<Button variant="secondary" size="lg" className="w-full" onClick={() => redo(session.id)} loading={reviewing}>
					<Repeat className="size-4 shrink-0" aria-hidden="true" />
					{wrong === 1 ? "Rifai l'errore" : 'Rifai gli errori'}
				</Button>
			)}
			<div className={cn('grid gap-2', passed ? 'grid-cols-1' : 'grid-cols-2')}>
				<Button variant="secondary" size="lg" onClick={leave}>
					<Route className="size-4 shrink-0" aria-hidden="true" />
					Torna al percorso
				</Button>
				{!passed && (
					<LinkButton href={theoryHref} variant="secondary" size="lg">
						<BookOpen className="size-4 shrink-0" aria-hidden="true" />
						Rileggi la teoria
					</LinkButton>
				)}
			</div>
		</>
	);

	return (
		<>
			<RunPlayer
				key={session.id}
				session={session}
				first={run.first}
				startAt={run.startAt}
				initial={run.initial}
				earlier={run.earlier}
				finished={!!run.done}
				onLeave={leave}
				onFinish={(results, progress) => setRun((r) => r && { ...r, done: { results, progress } })}
				label={
					<>
						<span className="label-mono shrink-0 text-fg-subtle">{heading}</span>
						{session.kind === 'level' && levelName && <span className="truncate text-fg-muted">{levelName}</span>}
					</>
				}
			/>
			<SummarySheet open={!!run.done} correct={correct} total={length} passed={passed} title={outcome.title} detail={outcome.detail} actions={actions} onClose={leave}>
				{run.done && <RunMistakes results={run.done.results} />}
			</SummarySheet>
		</>
	);
}
