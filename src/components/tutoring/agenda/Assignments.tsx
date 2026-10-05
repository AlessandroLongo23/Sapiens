'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { shortDay, weekdayOf, WEEKDAYS_SHORT, type AgendaAssignment, type AssignableLesson } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import { AssignForm } from './AssignForm';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Empty, MoreLink } from './Paper';
import { useApi } from './useApi';

function state(a: AgendaAssignment, today: string): { label: string; tone: BadgeTone } {
	if (a.done) return { label: 'Fatto', tone: 'ok' };
	if (a.done === null) return { label: a.due < today ? 'Scaduto' : 'Assegnato', tone: 'neutral' };
	return a.due < today ? { label: 'In ritardo', tone: 'danger' } : { label: 'Da fare', tone: 'warn' };
}

/** Still to do: not done, and either not due yet or known to be late. A late one stays in view until it is done or withdrawn. */
const isOpen = (a: AgendaAssignment, today: string) => !a.done && (a.due >= today || a.done === false);

/** The red pen's tick beside what is done; nothing beside the rest, since nobody ticks an assignment by hand. */
function Tick({ done }: { done: boolean | null }) {
	return (
		<span className="mt-0.5 flex w-6 shrink-0 justify-center" aria-hidden="true">
			{done ? (
				<svg viewBox="0 0 24 24" className="-mt-1 size-7 text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
					<path d="M4 13.5c2 1.5 3.6 3.4 5 5.5C12 12 16 7.5 21 4" />
				</svg>
			) : (
				<span className="mt-2 size-1.5 rounded-full bg-fg-faint" />
			)}
		</span>
	);
}

export interface TutorAssigning {
	linkId: string;
	lessons: AssignableLesson[];
	subject: string | null;
	canAssign: boolean;
	shared: boolean;
}

/** "Assegna esercizi": the button and its sheet. */
export function Assign({ tutor, today, primary = false }: { tutor: TutorAssigning; today: string; primary?: boolean }) {
	const [adding, setAdding] = useState(false);
	if (!tutor.canAssign) return null;
	return (
		<>
			<Button variant={primary ? 'primary' : 'secondary'} size={primary ? 'md' : 'sm'} onClick={() => setAdding(true)}>
				<Plus className="size-4" aria-hidden="true" />
				Assegna esercizi
			</Button>
			<Sheet open={adding} onClose={() => setAdding(false)} title="Assegna esercizi" description="Dalle lezioni di Sapiens che hanno gli esercizi." align="center" width="md">
				<AssignForm linkId={tutor.linkId} lessons={tutor.lessons} subject={tutor.subject} today={today} onDone={() => setAdding(false)} />
			</Sheet>
		</>
	);
}

/**
 * The exercises assigned on a link, as a checklist: the red pen ticks what is done. The tutor (`tutor` given)
 * withdraws; the student opens them. `today` comes from the server, in Rome's time, so both sides agree on what
 * is late.
 */
export function Assignments({ assignments, today, tutor, empty, limit }: { assignments: AgendaAssignment[]; today: string; tutor?: TutorAssigning; /** What to say when there are none. */ empty: string; /** Only the first ones still to do: the overview. */ limit?: number }) {
	const { busy, error, call } = useApi();
	const [withdrawing, setWithdrawing] = useState<string | null>(null);
	const open = assignments.filter((a) => isOpen(a, today)).sort((a, b) => a.due.localeCompare(b.due));
	const rest = assignments.filter((a) => !isOpen(a, today));
	const withdraw = async (id: string) => {
		if (await call(id, `/api/tutoring/assignments/${id}`, 'DELETE')) setWithdrawing(null);
	};

	const item = (a: AgendaAssignment) => {
		const s = state(a, today);
		return (
			<li key={a.id} className={cn('flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-edge py-3.5 last:border-b-0', a.done && 'opacity-80')} data-assignment={a.lessonPath}>
				<div className="flex min-w-0 flex-1 basis-64 items-start gap-3">
					<Tick done={a.done} />
					<div className="min-w-0">
						<p className={cn('font-medium text-fg-strong', a.done && 'line-through decoration-fg-faint')}>{a.title}</p>
						<p className="text-sm text-fg-muted">{a.level === null ? 'Tutti i livelli' : `Livello ${a.level}${a.levelName ? `: ${a.levelName}` : ''}`}</p>
						<p className="label-mono mt-0.5 text-fg-subtle">entro {WEEKDAYS_SHORT[weekdayOf(a.due)]} {shortDay(a.due)}</p>
						{a.note && <p className="mt-1 text-sm text-fg">{a.note}</p>}
					</div>
				</div>
				<div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 pl-9 sm:pl-0">
					<Badge tone={s.tone}>{s.label}</Badge>
					{tutor
						? tutor.canAssign &&
							!a.done &&
							(withdrawing === a.id ? (
								<>
									<Button variant="inverse" size="sm" loading={busy === a.id} onClick={() => withdraw(a.id)}>Sì, ritira</Button>
									<Button variant="ghost" size="sm" onClick={() => setWithdrawing(null)}>No</Button>
								</>
							) : (
								<Button variant="ghost" size="sm" aria-label={`Ritira il compito ${a.title}`} onClick={() => setWithdrawing(a.id)}>
									<X className="size-4" aria-hidden="true" />
									Ritira
								</Button>
							))
						: a.url &&
							!a.done && (
								<MoreLink href={a.url}>Fai gli esercizi</MoreLink>
							)}
				</div>
			</li>
		);
	};

	if (assignments.length === 0) return <Empty>{empty}</Empty>;
	if (limit) return open.length === 0 ? <Empty>Niente da fare in questo momento.</Empty> : <ul>{open.slice(0, limit).map(item)}</ul>;
	return (
		<div className="space-y-2">
			{error && <Alert tone="error">{error}</Alert>}
			{tutor && !tutor.shared && <p className="text-sm text-fg-subtle">Lo studente non condivide i progressi: qui non si vede se un compito è fatto.</p>}
			{open.length > 0 && <ul>{open.map(item)}</ul>}
			{rest.length > 0 && (
				<details open={open.length === 0}>
					<summary className="label-mono cursor-pointer py-2 text-fg-subtle hover:text-fg">{rest.every((a) => a.done) ? 'Fatti' : 'Fatti e scaduti'} ({rest.length})</summary>
					<ul>{rest.map(item)}</ul>
				</details>
			)}
		</div>
	);
}
