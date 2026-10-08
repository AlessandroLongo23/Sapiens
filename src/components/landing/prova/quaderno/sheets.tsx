import type { CSSProperties, ReactNode } from 'react';
import { Check, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PenTick, Tape, after } from '../ink';
import { tex } from '../data';

/*
 * The sheets that pile up beside the story of version one: a page of a lesson, an
 * exercise, a mistake put right, the review before a test. Each is a picture of the
 * product drawn in HTML, sized in em from the sheet's own width, so it scales as one
 * object. They stay light paper in the dark theme, like the sketch of the hero, and what
 * the pen does on them waits for `data-in` on the Reveal around (landing.css).
 */

const Math = ({ children, className }: { children: string; className?: string }) => <span className={cn('math-content', className)} dangerouslySetInnerHTML={{ __html: tex(children) }} />;

export function StorySheet({ tilt = 0, page, tape = 'right', children }: { tilt?: number; page: number; tape?: 'left' | 'right'; children: ReactNode }) {
	return (
		<div className="lp-pile paper-light relative w-full dark:brightness-[0.92]" style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
			<div className="@container relative overflow-hidden rounded-2xl border border-edge bg-paper-50 text-fg shadow-lift">
				<span className="grid-paper absolute inset-0" aria-hidden="true" />
				<span className="absolute inset-y-0 left-[8.5%] w-px bg-(--grid-margin)" aria-hidden="true" />
				{[18, 50, 82].map((top) => (
					<span key={top} className="absolute left-[3.2%] size-[2.4%] -translate-y-1/2 rounded-full bg-page shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]" style={{ top: `${top}%` }} aria-hidden="true" />
				))}
				<div className="lp-sheet relative flex aspect-[10/9] flex-col py-[2.2em] pl-[calc(8.5%+1.7em)] pr-[2.2em]">{children}</div>
				<span className="lp-mono lp-page absolute bottom-[1.2em] right-[1.6em] text-fg-faint" aria-hidden="true">
					pag. {page}
				</span>
			</div>
			<Tape className={cn('-top-2.5 w-24', tape === 'right' ? 'right-10 rotate-[4deg]' : 'left-16 -rotate-3')} />
		</div>
	);
}

export function LessonSheet() {
	return (
		<StorySheet tilt={-1.2} page={2} tape="left">
			<p className="lp-mono text-fg-subtle">Lezione · Equazioni di secondo grado</p>
			<h3 className="relative mt-[0.45em] w-fit font-display text-[2.15em] font-semibold leading-[1.05] tracking-tight text-fg-strong">
				La formula risolutiva
				<svg viewBox="0 0 200 12" preserveAspectRatio="none" className="lp-draw absolute inset-x-0 -bottom-[0.28em] h-[0.3em] w-full text-accent" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true">
					<path pathLength={1} d="M2 8.5c30-4.200 62-6.100 98-5.900 32 .2 62 1.900 98 4.600" />
				</svg>
			</h3>
			<p className="mt-[1.3em] text-[1.02em] leading-[1.65]">
				Per risolvere <Math>{'ax^2 + bx + c = 0'}</Math> calcola prima il{' '}
				<span className="lp-mark" style={after(0.5)}>
					discriminante
				</span>{' '}
				<Math>{'\\Delta = b^2 - 4ac'}</Math>: ti dice{' '}
				<span className="lp-mark" style={after(1.1)}>
					quante soluzioni
				</span>{' '}
				aspettarti.
			</p>
			<div data-subject="math" className="relative mt-[1.2em] rounded-[0.7em] border border-tint-edge bg-tint-soft py-[0.9em] text-center text-[1.3em]">
				<Math>{'x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}'}</Math>
				<span className="pencil lp-fade absolute -bottom-[1.15em] right-[0.8em] flex rotate-[-3deg] items-start gap-[0.3em] text-[1.05em]" style={after(1.7)}>
					<svg viewBox="0 0 24 28" className="h-[1.1em] w-[0.95em]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<path d="M20 26C22 14 16 6 5 3M4 11L4 2l9 1" />
					</svg>
					da sapere a memoria
				</span>
			</div>
			<p className="lp-mono mt-[2.1em] text-accent-fg">Errore frequente</p>
			<p className="mt-[0.35em] flex flex-wrap items-baseline gap-x-[1em] gap-y-[0.2em]">
				<span className="lp-strike text-[1.12em]" style={after(2.3)}>
					<Math>{'x^2 = 9 \\;\\Rightarrow\\; x = 3'}</Math>
				</span>
				<span className="pencil lp-write text-[1.5em]" style={after(2.9)}>
					le soluzioni sono due: x = ±3
				</span>
			</p>
		</StorySheet>
	);
}

const OPTIONS = ['x = 2 \\,\\lor\\, x = 3', 'x = -2 \\,\\lor\\, x = -3', 'x = 1 \\,\\lor\\, x = 6', 'x = 6'];

export function ExerciseSheet() {
	return (
		<StorySheet tilt={1.4} page={3}>
			<div className="flex items-center justify-between gap-[1em]">
				<p className="lp-mono text-fg-subtle">
					Esercizi · <span className="text-accent-fg">livello 2</span>
				</p>
				<p className="lp-mono tabular-nums text-fg-subtle">06 / 08</p>
			</div>
			<div className="mt-[0.8em] flex gap-[0.4em]" aria-hidden="true">
				{Array.from({ length: 8 }, (_, i) => (
					<span key={i} className={cn('h-[0.38em] flex-1 rounded-full', i < 5 ? 'bg-ok' : i === 5 ? 'lp-seg bg-surface-4' : 'bg-surface-4')} style={i === 5 ? after(1.5) : undefined} />
				))}
			</div>
			<p className="mt-[1.5em] text-center text-[0.95em] text-fg-muted">Risolvi l&apos;equazione</p>
			<p className="mt-[0.3em] text-center font-display text-[2.1em] font-medium leading-none text-fg-strong">
				<Math>{'x^2 - 5x + 6 = 0'}</Math>
			</p>
			<div className="mt-[1.5em] grid grid-cols-2 gap-[0.7em]">
				{OPTIONS.map((option, i) => (
					<div key={i} className={cn('relative flex items-center justify-center rounded-[0.8em] border border-edge bg-surface whitespace-nowrap py-[0.95em] pl-[2.5em] pr-[0.5em] text-[0.92em] font-medium text-fg-strong shadow-paper', i === 0 ? 'lp-pick' : 'lp-dim')} style={after(1.3)}>
						<span className="lp-badge absolute left-[0.7em] top-1/2 flex size-[1.75em] -translate-y-1/2 items-center justify-center rounded-[0.4em] border border-edge-strong font-mono text-[0.78em] text-fg-subtle">
							<span className="lp-badge-n">{i + 1}</span>
							{i === 0 && <Check className="lp-badge-tick absolute size-[1.1em]" strokeWidth={3} aria-hidden="true" />}
						</span>
						<Math>{option}</Math>
					</div>
				))}
			</div>
			<div className="mt-auto flex items-end justify-between gap-[1em] pt-[1em]">
				<p className="pencil lp-write flex items-center gap-[0.3em] text-[1.6em]" style={after(2.1)}>
					6 giuste su 6!
				</p>
				<span className="lp-stamp mb-[1.6em] -rotate-[4deg] whitespace-nowrap mr-[0.5em] rounded-[0.35em] border-[0.14em] border-accent px-[0.6em] py-[0.25em] font-mono text-[0.85em] font-semibold uppercase tracking-[0.1em] text-accent" style={after(2.8)}>
					verso il livello 3
				</span>
			</div>
		</StorySheet>
	);
}

export function MistakeSheet() {
	return (
		<StorySheet tilt={-0.8} page={4} tape="left">
			<p className="lp-mono flex items-center gap-[0.6em] text-fg-subtle">
				<span className="flex size-[1.6em] items-center justify-center rounded-full bg-danger-soft text-danger-fg">
					<X className="size-[0.95em]" strokeWidth={3} aria-hidden="true" />
				</span>
				Come si risolve
			</p>
			<p className="mt-[0.9em] font-display text-[1.9em] font-medium leading-none text-fg-strong">
				<Math>{'2x^2 - 8 = 0'}</Math>
			</p>
			<p className="mt-[1em] flex items-baseline gap-[0.8em] text-[1em] text-fg-muted">
				La tua risposta:
				<span className="lp-strike text-[1.1em] text-fg-strong" style={after(0.5)}>
					<Math>{'x = \\pm 4'}</Math>
				</span>
			</p>
			<div className="relative mt-[1.1em] flex flex-col gap-[0.15em] border-l-[0.14em] border-edge-strong pl-[1.2em] font-hand text-[2.05em] font-semibold leading-[1.25] text-[oklch(0.33_0.07_262)]">
				<span className="lp-write" style={after(1.1)}>
					2x² = 8
				</span>
				<span className="lp-write" style={after(1.7)}>
					x² = 4
				</span>
				<span className="relative w-fit">
					<span className="lp-write block" style={after(2.3)}>
						x = ±2
					</span>
					<svg viewBox="0 0 120 56" preserveAspectRatio="none" className="lp-draw absolute -inset-x-[0.45em] -inset-y-[0.12em] h-[calc(100%+0.24em)] w-[calc(100%+0.9em)] text-accent" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
						<path pathLength={1} d="M70 5C40 1 8 9 5 27c-3 17 26 25 56 24 31-1 55-9 54-25C114 12 92 5 58 6" style={after(2.9)} />
					</svg>
					<PenTick delay={3.4} className="absolute -right-[1.7em] top-[0.1em] h-[0.9em] w-[1em]" />
				</span>
			</div>
			<p className="pencil lp-write absolute right-[1.6em] top-[42%] w-[9.5em] rotate-[3deg] text-[1.45em] leading-[1.05]" style={after(3.6)}>
				x² = 4 non vuol dire x = 4: manca la radice
			</p>
			<p className="lp-fade mt-auto flex w-fit items-center gap-[0.6em] rounded-full border border-edge bg-surface py-[0.35em] pl-[0.5em] pr-[1em] text-[0.9em] font-medium text-fg shadow-paper" style={after(4.2)}>
				<span className="flex size-[1.5em] items-center justify-center rounded-full bg-accent-soft font-mono text-[0.8em] text-accent-fg">+1</span>
				tra gli errori da rifare
			</p>
		</StorySheet>
	);
}

export function ReviewSheet() {
	return (
		<StorySheet tilt={1} page={5}>
			<p className="lp-mono text-fg-subtle">Diario · giovedì 15 ottobre</p>
			<p className="relative mt-[0.5em] w-fit font-hand text-[2em] font-semibold leading-[1.2] text-[oklch(0.33_0.07_262)]">
				<span className="lp-write block" style={after(0.3)}>
					verifica di matematica, 2ª ora
				</span>
				<svg viewBox="0 0 120 40" preserveAspectRatio="none" className="lp-draw absolute -left-[0.3em] -top-[0.05em] h-[1.3em] w-[3.7em] text-accent" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
					<path pathLength={1} d="M68 4C38 1 7 7 5 20c-2 12 24 17 55 16 30-1 56-6 55-18C114 8 90 3 56 5" style={after(1.1)} />
				</svg>
			</p>
			<div className="lp-deck relative mt-[1.3em] min-h-[12.5em] flex-1">
				{/* the card on top of the deck */}
				<div className="lp-fade absolute left-0 top-[0.4em] w-[58%] -rotate-[2.5deg] overflow-hidden rounded-[0.8em] border border-edge-strong bg-surface shadow-lift" style={after(1.5)}>
					<p className="lp-mono flex justify-between border-b-[0.14em] border-(--grid-margin) px-[1.1em] py-[0.7em] text-fg-subtle">
						Flashcard <span className="text-fg-faint">07 / 20</span>
					</p>
					<p className="lp-ruled px-[1.1em] py-[1em] font-display text-[1.25em] font-medium leading-[1.6em] text-fg-strong">
						Quante soluzioni reali ha l&apos;equazione se <Math>{'\\Delta < 0'}</Math>?
					</p>
				</div>
				{/* the note Sapiens leaves the day before */}
				<div className="lp-stamp absolute right-[0.2em] top-0 w-[40%] rotate-[3deg] bg-[oklch(0.93_0.12_100)] px-[1.1em] pb-[1.2em] pt-[1em] shadow-lift" style={after(2.1)}>
					<p className="lp-mono text-[oklch(0.45_0.08_90)]">Ripasso pronto</p>
					<p className="mt-[0.3em] font-hand text-[1.55em] font-semibold leading-[1.1] text-[oklch(0.3_0.04_262)]">20 carte e i 2 livelli che non ti riuscivano</p>
				</div>
			</div>
			<div>
				<p className="lp-mono text-fg-subtle">Il percorso della lezione</p>
				<ol className="mt-[0.7em] flex items-center gap-[0.5em]" aria-hidden="true">
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<li key={n} className="flex flex-1 items-center gap-[0.5em] last:flex-none">
							<span
								className={cn(
									'flex size-[2.3em] shrink-0 items-center justify-center rounded-[0.6em] border font-display text-[1em] font-semibold',
									n <= 3 ? 'lp-pick border-edge-strong bg-surface text-fg-strong' : n === 4 ? 'border-inverse bg-inverse text-inverse-fg' : 'border-dashed border-edge-strong bg-surface-2 text-fg-faint'
								)}
								style={n <= 3 ? after(2.4 + n * 0.3) : undefined}
							>
								{n <= 3 ? <Check className="size-[1.1em]" strokeWidth={3} /> : n === 4 ? n : <Lock className="size-[0.9em]" />}
							</span>
							{n < 6 && <span className={cn('h-[0.14em] flex-1 rounded-full', n <= 3 ? 'bg-ok' : 'bg-surface-4')} />}
						</li>
					))}
				</ol>
			</div>
		</StorySheet>
	);
}
