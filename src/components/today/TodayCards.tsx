import Link from 'next/link';
import { ArrowRight, Check, ListChecks, Play, Repeat } from 'lucide-react';
import type { TodayView } from '@/lib/server/exercises';
import { SESSION_LENGTH } from '@/lib/exercises/config';
import { REVIEW_LENGTH } from '@/lib/exercises/review';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';

const CARD = 'flex flex-col gap-4 rounded-2xl border border-edge bg-surface p-5 shadow-paper sm:p-6';
const LINK_BUTTON = 'flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-edge-strong bg-surface px-6 font-semibold text-fg shadow-paper transition-colors hover:bg-surface-2 focus-ring';

/** The run left halfway today or yesterday, on its lesson: the lesson's path takes it up. */
export function ResumeCard({ resume }: { resume: NonNullable<TodayView['resume']> }) {
	return (
		<section aria-labelledby="resume-today" className={cn(CARD, 'border-inverse shadow-lift')}>
			<div className="flex flex-col gap-2">
				<h2 id="resume-today" className="label-mono text-accent-fg">
					Prova a metà
				</h2>
				<p className="text-lg font-semibold text-fg-strong">
					<Html as="span" html={resume.titleHtml} className="math-inline" />
				</p>
				<div className="flex items-center gap-3">
					<div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-4" aria-hidden="true">
						<span className="absolute inset-y-0 left-0 rounded-full bg-fg-subtle" style={{ width: `${Math.round((resume.answered / resume.length) * 100)}%` }} />
					</div>
					<span className="label-mono shrink-0 tabular-nums text-fg-subtle">
						{resume.kind === 'jump' ? `Salto al livello ${resume.level}` : `Livello ${resume.level}`} · {resume.answered}/{resume.length}
					</span>
				</div>
			</div>
			<Link href={resume.exercisesUrl} className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-inverse px-6 font-semibold text-inverse-fg shadow-key transition-transform hover:opacity-90 active:translate-y-px focus-ring-offset">
				<Play className="size-4 fill-current" aria-hidden="true" />
				Riprendi
			</Link>
		</section>
	);
}

/** Mistakes still to redo: how many levels, the review right here, and the list. */
export function MistakesCard({ open, onRedo, starting, blocked }: { open: number; onRedo: () => void; starting: boolean; blocked: boolean }) {
	return (
		<section aria-labelledby="mistakes-today" className={CARD}>
			<div className="flex flex-col gap-1">
				<h2 id="mistakes-today" className="label-mono text-fg-subtle">
					Errori da rifare
				</h2>
				<p className="text-lg font-semibold text-fg-strong">{open === 1 ? 'Un livello da rifare' : `${open} livelli da rifare`}</p>
				<p className="text-sm text-fg-muted">{blocked ? 'Domani puoi rifarli con la sessione gratuita, oppure passa a Studio.' : `${REVIEW_LENGTH} esercizi nuovi sui livelli dove hai sbagliato.`}</p>
			</div>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Button size="lg" variant="secondary" className="flex-1" onClick={onRedo} loading={starting} disabled={blocked}>
					<Repeat className="size-4" aria-hidden="true" />
					Rifai gli errori
				</Button>
				<Link href="/errori" className={cn(LINK_BUTTON, 'flex-1 border-transparent shadow-none')}>
					<ListChecks className="size-4" aria-hidden="true" />
					Vedi l&apos;elenco
				</Link>
			</div>
		</section>
	);
}

/** The lesson practised most recently: the level its path suggests, or the chapter once every level is passed. */
export function NextCard({ next }: { next: NonNullable<TodayView['next']> }) {
	return (
		<section aria-labelledby="next-today" className={CARD}>
			<div className="flex flex-col gap-1">
				<h2 id="next-today" className="label-mono text-fg-subtle">
					{next.done ? 'Lezione completata' : 'Continua il percorso'}
				</h2>
				<p className="text-lg font-semibold text-fg-strong">
					<Html as="span" html={next.titleHtml} className="math-inline" />
				</p>
				<p className="text-sm text-fg-muted">{next.done ? 'Hai superato tutti i livelli. Nel capitolo trovi la lezione dopo.' : `Livello ${next.level}${next.levelName ? `: ${next.levelName}` : ''}`}</p>
			</div>
			<Link href={next.done ? next.chapterUrl : next.exercisesUrl} className={LINK_BUTTON}>
				{next.done ? 'Vai al capitolo' : `Vai al livello ${next.level}`}
				<ArrowRight className="size-4" aria-hidden="true" />
			</Link>
		</section>
	);
}

/** Free questions left today on the Free plan, and Studio next to it without pressure. */
export function FreeCard({ left }: { left: number }) {
	return (
		<section aria-labelledby="free-today" className="flex flex-col gap-3 rounded-2xl border border-dashed border-edge-strong p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
			<div className="flex flex-col gap-1">
				<h2 id="free-today" className="label-mono text-fg-subtle">
					Sessione gratuita
				</h2>
				<p className="text-sm text-fg-muted">
					{left > 0 ? (
						<>
							Oggi ti {left === 1 ? 'resta' : 'restano'} <span className="font-semibold text-fg tabular-nums">{left}</span> {left === 1 ? 'domanda' : 'domande'} su {SESSION_LENGTH}.
						</>
					) : (
						<span className="inline-flex items-center gap-1.5">
							<Check className="size-4 text-ok-fg" aria-hidden="true" /> Fatta. Domani ne hai altre {SESSION_LENGTH}.
						</span>
					)}
				</p>
			</div>
			<Link href="/pricing" className="text-sm font-medium text-accent-fg underline underline-offset-2 hover:text-accent-hover focus-ring">
				Con Studio senza limiti
			</Link>
		</section>
	);
}
