'use client';

import { useState } from 'react';
import { Check, ChevronsUp, Clock, Lock, PenLine, Play } from 'lucide-react';
import type { PathLevel, PathView, UnfinishedRun } from '@/lib/server/exercises';
import { estimatedTime } from '@/lib/exercises/config';
import { JUMP_LENGTH, MIN_PASS_LENGTH, canPass, passMark, runPassed, type RunKind } from '@/lib/exercises/levels';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Sticker } from '@/components/ui/Sticker';

/** "oggi", "ieri", or the day and month: when a run was done, in the words of a diary. */
function when(iso: string): string {
	const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	const days = Math.round((day(new Date()) - day(new Date(iso))) / 86_400_000);
	if (days <= 0) return 'oggi';
	if (days === 1) return 'ieri';
	return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' }).format(new Date(iso));
}

/** A run's score as squares of the notebook: one per question, the right ones filled. */
function Squares({ correct, total, passed }: { correct: number; total: number; passed: boolean }) {
	return (
		<span className="flex gap-0.5" aria-hidden="true">
			{Array.from({ length: total }, (_, i) => (
				<span key={i} className={cn('size-2.5 rounded-[2px] border', i < correct ? (passed ? 'border-ok bg-ok' : 'border-fg-subtle bg-fg-subtle') : 'border-edge bg-surface')} />
			))}
		</span>
	);
}

/** The node of a level on the rail: a stamp that is the number, the tick once passed, a lock until it opens. */
function Stamp({ level, current, index }: { level: PathLevel; current: boolean; index: number }) {
	const tilt = index % 2 === 0 ? '-rotate-3' : 'rotate-2';
	return (
		<span
			className={cn(
				'relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl border font-display text-xl font-medium tabular-nums transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5',
				tilt,
				level.status === 'passed' && 'border-ok-edge bg-ok-soft text-ok-fg shadow-paper',
				level.status === 'open' && (current ? 'border-inverse bg-inverse text-inverse-fg shadow-key' : 'border-edge-strong bg-surface text-fg-strong shadow-paper'),
				level.status === 'locked' && 'border-dashed border-edge-strong bg-surface-2 text-fg-faint'
			)}
			aria-hidden="true"
		>
			{level.status === 'passed' ? <Check className="size-6" strokeWidth={2.5} /> : level.status === 'locked' ? <Lock className="size-5" strokeWidth={1.75} /> : level.level}
		</span>
	);
}

interface Props {
	titleHtml: string;
	path: PathView;
	/** Questions in a run at one level: 10, or what is left of today's free session. */
	questionCount: number;
	/** Starts a run; absent on the preview behind the paywall. */
	onStart?: (kind: RunKind, level: number) => void;
	/** The level whose run is starting, while its first exercise is on its way. */
	starting?: number | null;
	/** Takes up the run left halfway; absent on the preview behind the paywall. */
	onResume?: () => void;
	/** The run left halfway is being taken up. */
	resuming?: boolean;
}

/**
 * The start of a lesson's exercises (vault/Decisioni/2026-09-25 Gli esercizi sono un percorso di livelli.md):
 * the levels as a path, easiest first, each with its name, its last runs and a way in. The suggested level is
 * open on arrival; a locked one offers the jump test. One level is open at a time.
 */
export function ExercisePath({ titleHtml, path, questionCount, onStart, starting = null, onResume, resuming = false }: Props) {
	const [open, setOpen] = useState<number>(path.current);
	const passed = path.levels.filter((l) => l.status === 'passed').length;
	const firstNotPassed = path.levels.find((l) => l.status !== 'passed')?.level ?? null;

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
			<header className="grid-paper flex animate-rise-in items-center gap-5 overflow-hidden rounded-2xl border border-edge bg-surface p-5 shadow-lift sm:p-7">
				<Sticker icon={PenLine} className="hidden sm:flex" />
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<h2 className="text-balance text-2xl font-semibold text-fg-strong sm:text-3xl">
						<Html as="span" html={titleHtml} className="math-inline" />
					</h2>
					<p className="text-sm leading-relaxed text-fg-subtle sm:text-base">
						{canPass(questionCount)
							? `Scegli un livello e fai una prova: con ${passMark(questionCount)} risposte giuste su ${questionCount} lo superi e si apre quello dopo.`
							: `Oggi ti ${questionCount === 1 ? 'resta una domanda gratuita' : `restano ${questionCount} domande gratuite`}: puoi allenarti, ma per superare un livello servono almeno ${MIN_PASS_LENGTH} domande.`}
					</p>
					<div className="flex items-center gap-3">
						<div className="flex flex-1 gap-1" aria-hidden="true">
							{path.levels.map((l) => (
								<span key={l.level} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-500', l.status === 'passed' ? 'bg-ok' : 'bg-surface-4')} />
							))}
						</div>
						<span className="label-mono shrink-0 tabular-nums text-fg-subtle">
							{passed} / {path.levels.length} superati
						</span>
					</div>
				</div>
			</header>

			{path.unfinished && onResume && <ResumeCard run={path.unfinished} levelName={path.levels.find((l) => l.level === path.unfinished?.session.level)?.name ?? null} onResume={onResume} resuming={resuming} />}

			<ol className="flex flex-col" aria-label="Livelli">
				{path.levels.map((level, i) => {
					const isOpen = open === level.level;
					const current = level.level === path.current && level.status !== 'passed';
					const next = path.levels[i + 1];
					const skipped = level.status === 'locked' && firstNotPassed !== null ? path.levels.filter((l) => l.level >= firstNotPassed && l.level < level.level).map((l) => l.level) : [];
					const range = skipped.length === 1 ? `sul livello ${skipped[0]}` : `sui livelli ${skipped[0]}${skipped.length === 2 ? ' e ' : '-'}${skipped[skipped.length - 1]}`;
					return (
						<li key={level.level} className="relative animate-rise-in pb-3" style={{ animationDelay: `${60 + i * 45}ms` }}>
							{/* The rail to the next level: inked up to where the student has got, pencilled after. */}
							{next && <span className={cn('absolute bottom-0 left-6 top-6 w-0 -translate-x-1/2 border-l-2', level.status === 'passed' ? 'border-ok' : 'border-dashed border-edge-strong')} aria-hidden="true" />}
							<button
								type="button"
								onClick={() => setOpen(isOpen ? -1 : level.level)}
								aria-expanded={isOpen}
								aria-controls={`livello-${level.level}`}
								className="group relative flex w-full items-center gap-4 rounded-xl py-1 pr-2 text-left focus-ring"
							>
								<Stamp level={level} current={current} index={i} />
								<span className="flex min-w-0 flex-1 flex-col gap-0.5">
									<span className="flex items-center gap-2">
										<span className="label-mono text-fg-subtle">Livello {level.level}</span>
										{current && <span className="label-mono rounded bg-accent-soft px-1.5 py-0.5 text-accent-soft-fg">Sei qui</span>}
										{level.skipped && <span className="label-mono text-fg-faint">con il salto</span>}
									</span>
									<span className={cn('text-pretty font-display text-lg font-medium leading-snug sm:text-xl', level.status === 'locked' ? 'text-fg-subtle' : 'text-fg-strong')}>{level.name ?? `Livello ${level.level}`}</span>
								</span>
								{level.best && (
									<span className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
										<span className="font-mono text-sm tabular-nums text-fg-muted">
											{level.best.correct}/{level.best.total}
										</span>
										<span className="label-mono text-fg-faint">migliore</span>
									</span>
								)}
							</button>

							{isOpen && (
								<div id={`livello-${level.level}`} className="ml-16 mt-2 mb-3 animate-note-in rounded-xl border border-edge bg-surface p-4 shadow-paper sm:p-5">
									{level.status === 'locked' ? (
										<>
											<p className="text-sm leading-relaxed text-fg-muted sm:text-base">
												Si apre superando il livello {path.levels[i - 1]?.level}. Se lo sai già fare, prova il salto: {JUMP_LENGTH} domande {range}; con {passMark(JUMP_LENGTH)} giuste si apre il livello {level.level}.
											</p>
											{onStart && (
												<button type="button" onClick={() => onStart('jump', level.level)} disabled={starting !== null} className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-edge-strong bg-surface px-5 py-3 font-semibold text-fg-strong shadow-paper transition-[transform,background-color] duration-150 hover:bg-surface-2 active:translate-y-px disabled:opacity-60 focus-ring-offset">
													<ChevronsUp className="size-5" aria-hidden="true" />
													{starting === level.level ? 'Preparo la prova…' : 'Fai la prova di salto'}
												</button>
											)}
										</>
									) : (
										<>
											{level.runs.length > 0 ? (
												<>
													<h3 className="label-mono mb-2 text-fg-subtle">Le ultime prove</h3>
													<ul className="mb-4 flex flex-col gap-1.5">
														{level.runs.map((run, k) => {
															const ok = runPassed({ ...run, answered: run.total });
															return (
																<li key={k} className="flex items-center gap-3 text-sm">
																	<span className="w-14 shrink-0 text-fg-subtle">{when(run.at)}</span>
																	<Squares correct={run.correct} total={run.total} passed={ok} />
																	<span className={cn('ml-auto font-mono tabular-nums', ok ? 'text-ok-fg' : 'text-fg-muted')}>
																		{run.correct}/{run.total}
																	</span>
																</li>
															);
														})}
													</ul>
												</>
											) : (
												<p className="mb-4 text-sm text-fg-muted sm:text-base">{level.skipped ? 'Superato con la prova di salto. Puoi comunque esercitarti qui.' : 'Non hai ancora fatto prove a questo livello.'}</p>
											)}
											<div className="mb-4 flex items-center gap-4 text-sm text-fg-subtle">
												<span className="font-mono tabular-nums">{questionCount} domande</span>
												<span className="flex items-center gap-1.5">
													<Clock className="size-3.5" aria-hidden="true" />
													{estimatedTime(questionCount)}
												</span>
											</div>
											{onStart && (
												<button type="button" onClick={() => onStart('level', level.level)} disabled={starting !== null} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-4 font-semibold text-inverse-fg shadow-key transition-transform duration-150 hover:opacity-90 active:translate-y-px disabled:opacity-60 focus-ring-offset">
													<Play className="size-5 fill-current" aria-hidden="true" />
													{starting === level.level ? 'Preparo gli esercizi…' : level.status === 'passed' ? `Rifai il livello ${level.level}` : `Inizia il livello ${level.level}`}
												</button>
											)}
										</>
									)}
								</div>
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
}

/** The run left halfway, above the path: where it stopped, and the way back in. */
function ResumeCard({ run, levelName, onResume, resuming }: { run: UnfinishedRun; levelName: string | null; onResume: () => void; resuming: boolean }) {
	const done = run.progress.filter((p) => p !== 'unanswered').length;
	const title = run.session.kind === 'jump' ? `Prova di salto al livello ${run.session.level}` : `Livello ${run.session.level}`;
	return (
		<section aria-labelledby="resume-title" className="flex animate-rise-in flex-col gap-4 rounded-2xl border border-inverse bg-surface p-5 shadow-lift sm:flex-row sm:items-center sm:p-6">
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<p className="label-mono text-accent-fg">Prova a metà</p>
				<h3 id="resume-title" className="truncate text-lg font-semibold text-fg-strong">
					{title}
					{run.session.kind === 'level' && levelName && <span className="font-normal text-fg-muted"> · {levelName}</span>}
				</h3>
				<div className="flex items-center gap-3">
					<div className="flex flex-1 gap-1" role="img" aria-label={`${done} domande fatte su ${run.session.length}`}>
						{run.progress.map((p, i) => (
							<span key={i} className={cn('h-1.5 flex-1 rounded-full', p === 'correct' ? 'bg-ok' : p === 'incorrect' ? 'bg-accent' : 'bg-surface-4')} />
						))}
					</div>
					<span className="label-mono shrink-0 tabular-nums text-fg-subtle" aria-hidden="true">
						{done} / {run.session.length}
					</span>
				</div>
			</div>
			<button type="button" onClick={onResume} disabled={resuming} className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-3 font-semibold text-inverse-fg shadow-key transition-transform duration-150 hover:opacity-90 active:translate-y-px disabled:opacity-60 focus-ring-offset">
				<Play className="size-4 fill-current" aria-hidden="true" />
				{resuming ? 'Riprendo…' : 'Riprendi'}
			</button>
		</section>
	);
}
