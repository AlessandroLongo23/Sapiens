'use client';

import { useState } from 'react';
import { Check, MapPin, Monitor, Plus, X } from 'lucide-react';
import { WEEKDAYS_SHORT, durationLabel, isHeld, longDay, romeParts, weekdayOf, type AgendaLesson, type Side } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import { LessonForm } from './LessonForm';
import { Badge } from '@/components/ui/Badge';
import { DayLeaf, Empty } from './Paper';
import { useApi } from './useApi';

const isLink = (s: string) => /^https?:\/\/\S+$/.test(s);

/**
 * One lesson: the day as the diary writes it, the time in the serif, where and what about, and what this side can
 * do with it. A proposal still waiting stands out in a card with the warning's edge; the rest is a row of the register.
 */
export function LessonCard({ lesson, side, showWith = false, now }: { lesson: AgendaLesson; side: Side; showWith?: boolean; now: number }) {
	const { busy, error, call } = useApi();
	const [cancelling, setCancelling] = useState(false);
	const held = isHeld(lesson, now);
	const past = Date.parse(lesson.startsAt) < now;
	const waiting = lesson.status === 'proposed' && !past;
	const act = (action: string, extra: Record<string, unknown> = {}) => call(`${lesson.id}-${action}`, `/api/tutoring/lessons/${lesson.id}`, 'POST', { action, as: side, ...extra });
	const Where = lesson.mode === 'online' ? Monitor : MapPin;
	const { day, time } = romeParts(lesson.startsAt);
	const end = romeParts(new Date(Date.parse(lesson.startsAt) + lesson.durationMin * 60_000)).time;
	const stamp =
		lesson.status === 'proposed' ? <Badge tone="warn">{past ? 'Proposta scaduta' : side === 'tutor' ? 'Da confermare' : 'In attesa del tutor'}</Badge>
		: lesson.status === 'declined' ? <Badge>Non accettata</Badge>
		: lesson.status === 'cancelled' ? <Badge>Annullata</Badge>
		: held ? <Badge>Fatta</Badge>
		: <Badge tone="ok">Confermata</Badge>;
	const dim = lesson.status === 'declined' || lesson.status === 'cancelled' || held || (lesson.status === 'proposed' && past);

	return (
		<li className={cn('flex gap-4', waiting ? 'rounded-2xl border border-warn-edge bg-surface p-4 shadow-paper' : 'border-b border-edge py-4 last:border-b-0', dim && 'opacity-75')} data-lesson={lesson.id}>
			<DayLeaf iso={lesson.startsAt} muted={dim} />
			<div className="min-w-0 flex-1 space-y-1.5">
				<div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
					<p className="text-fg-strong">
						<span className="font-display text-xl font-semibold tabular-nums">{time}-{end}</span>
						<span className="sr-only">, {longDay(day)}</span>
						{showWith && <span className="ml-2 font-medium">{lesson.with}</span>}
					</p>
					{stamp}
				</div>
				<p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-fg-muted">
					<span className="first-letter:uppercase">{longDay(day)}</span>
					<span className="label-mono">{durationLabel(lesson.durationMin)}</span>
					<span className="inline-flex items-center gap-1">
						<Where className="size-3.5 text-fg-faint" aria-hidden="true" />
						{lesson.mode === 'online' ? 'Online' : 'In presenza'}
					</span>
				</p>
				{lesson.note && <p className="text-sm text-fg">{lesson.note}</p>}
				{lesson.place && (isLink(lesson.place) ? <a href={lesson.place} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-accent-fg hover:underline">{lesson.place}</a> : <p className="text-sm text-fg-muted">{lesson.place}</p>)}
				{error && <Alert tone="error">{error}</Alert>}
				{!past && (lesson.status === 'proposed' || lesson.status === 'confirmed') && (
					<div className="flex flex-wrap items-center gap-2 pt-1">
						{lesson.status === 'proposed' && side === 'tutor' && (
							<>
								<Button size="sm" loading={busy === `${lesson.id}-accept`} onClick={() => act('accept')}>
									{busy !== `${lesson.id}-accept` && <Check className="size-4" aria-hidden="true" />}
									Accetta
								</Button>
								<Button variant="secondary" size="sm" loading={busy === `${lesson.id}-decline`} onClick={() => act('decline')}>
									{busy !== `${lesson.id}-decline` && <X className="size-4" aria-hidden="true" />}
									Rifiuta
								</Button>
							</>
						)}
						{(lesson.status === 'confirmed' || side === 'student') &&
							(cancelling ? (
								<>
									<span className="text-sm text-fg-muted">{lesson.status === 'proposed' ? 'Ritiri la proposta?' : 'Annulli la lezione?'}</span>
									<Button variant="inverse" size="sm" loading={busy === `${lesson.id}-cancel`} onClick={() => act('cancel')}>Sì, annulla</Button>
									{side === 'tutor' && lesson.seriesId && <Button variant="secondary" size="sm" loading={busy === `${lesson.id}-series`} onClick={() => call(`${lesson.id}-series`, `/api/tutoring/lessons/${lesson.id}`, 'POST', { action: 'cancel', as: side, series: true })}>Questa e le successive</Button>}
									<Button variant="ghost" size="sm" onClick={() => setCancelling(false)}>No</Button>
								</>
							) : (
								<Button variant="ghost" size="sm" className="-ml-3" onClick={() => setCancelling(true)}>{lesson.status === 'proposed' ? 'Ritira la proposta' : 'Annulla la lezione'}</Button>
							))}
					</div>
				)}
			</div>
		</li>
	);
}

const MONTH_YEAR = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The lessons behind: a register, a line each, under the name of their month. */
function History({ lessons, now }: { lessons: AgendaLesson[]; now: number }) {
	const months = new Map<string, AgendaLesson[]>();
	for (const l of lessons) {
		const key = romeParts(l.startsAt).day.slice(0, 7);
		months.set(key, [...(months.get(key) ?? []), l]);
	}
	return (
		<div className="space-y-5 pt-1">
			{[...months.entries()].map(([month, list]) => (
				<div key={month}>
					<p className="label-mono mb-1 text-fg-subtle">{MONTH_YEAR.format(new Date(`${month}-01T00:00:00Z`))}</p>
					<ul className="border-t border-edge">
						{list.map((l) => {
							const { day, time } = romeParts(l.startsAt);
							const state = l.status === 'declined' ? 'Non accettata' : l.status === 'cancelled' ? 'Annullata' : l.status === 'proposed' ? 'Proposta scaduta' : isHeld(l, now) ? 'Fatta' : 'Confermata';
							const off = l.status !== 'confirmed';
							return (
								<li key={l.id} className="grid grid-cols-[4.5rem_3rem_1fr_auto] items-baseline gap-x-3 border-b border-edge py-2 text-sm" data-lesson={l.id}>
									<span className="label-mono text-fg-muted"><span className="sr-only">{longDay(day)}</span><span aria-hidden="true">{WEEKDAYS_SHORT[weekdayOf(day)]} {Number(day.slice(8))}</span></span>
									<span className={cn('font-display font-semibold tabular-nums text-fg-strong', off && 'line-through decoration-fg-faint')}>{time}</span>
									<span className="min-w-0 truncate">
										<span className="label-mono mr-2 text-fg-subtle">{durationLabel(l.durationMin)}</span>
										{l.note && <span className="text-fg-muted">{l.note}</span>}
									</span>
									<span className={cn('label-mono', off ? 'text-fg-subtle' : 'text-fg-muted')}>{state}</span>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</div>
	);
}

/** "Fissa una lezione" or "Chiedi una lezione": the button and its sheet. */
export function NewLesson({ side, linkId, today, primary = false }: { side: Side; linkId: string; today: string; primary?: boolean }) {
	const [adding, setAdding] = useState(false);
	const label = side === 'tutor' ? 'Fissa una lezione' : 'Chiedi una lezione';
	return (
		<>
			<Button variant={primary ? 'primary' : 'secondary'} size={primary ? 'md' : 'sm'} onClick={() => setAdding(true)}>
				<Plus className="size-4" aria-hidden="true" />
				{label}
			</Button>
			<Sheet open={adding} onClose={() => setAdding(false)} title={label} align="center" width="md">
				<LessonForm side={side} linkId={linkId} today={today} onDone={() => setAdding(false)} />
			</Sheet>
		</>
	);
}

/** The lessons of a link: the ones to come, then the history. */
export function Lessons({ lessons, side, now, canAdd = true, limit }: { lessons: AgendaLesson[]; side: Side; now: number; canAdd?: boolean; /** Only the first lessons to come, without the history: the overview. */ limit?: number }) {
	const coming = lessons.filter((l) => Date.parse(l.startsAt) + l.durationMin * 60_000 > now && (l.status === 'confirmed' || l.status === 'proposed')).reverse();
	const history = lessons.filter((l) => !coming.includes(l));
	const shown = limit ? coming.slice(0, limit) : coming;
	const waiting = shown.filter((l) => l.status === 'proposed');
	const planned = shown.filter((l) => l.status !== 'proposed');
	return (
		<div className="space-y-4">
			{waiting.length > 0 && <ul className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(19rem,1fr))]">{waiting.map((l) => <LessonCard key={l.id} lesson={l} side={side} now={now} />)}</ul>}
			{coming.length === 0 ? canAdd && <Empty>Nessuna lezione in programma.</Empty> : planned.length > 0 && <ul>{planned.map((l) => <LessonCard key={l.id} lesson={l} side={side} now={now} />)}</ul>}
			{!limit && history.length > 0 && (
				<details open={!canAdd} className="pt-2">
					<summary className="label-mono cursor-pointer py-2 text-fg-subtle hover:text-fg">Storico delle lezioni ({history.length})</summary>
					<History lessons={history} now={now} />
				</details>
			)}
		</div>
	);
}
