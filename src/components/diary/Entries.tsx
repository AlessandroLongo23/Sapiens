'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, PenLine, Trash2, X } from 'lucide-react';
import { ENTRY_KINDS, KIND_LABEL, MAX_TEXT, isTest, parseLine, type DiaryEntry, type EntryKind } from '@/lib/diary/entries';
import { DIARY_SUBJECTS, MATERIAL_SUBJECT, SUBJECT_BY_KEY, subjectStyle } from '@/lib/diary/subjects';
import { matchTopic, plainTitle, type Topic } from '@/lib/diary/topics';
import { daysBetween, isDay, longDate, relativeDay, type Day } from '@/lib/diary/dates';
import { cn } from '@/lib/utils/cn';
import { Sheet, sheetActions } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select } from '@/components/ui/Field';
import { HandBox } from './Ink';

type NewEntry = Pick<DiaryEntry, 'day' | 'kind' | 'subject' | 'text' | 'topic'>;

/** Tests first, then homework, then reminders; within a kind, as written. */
const ORDER: Record<EntryKind, number> = {
	verifica: 0,
	interrogazione: 1,
	compito: 2,
	promemoria: 3
};

/** The school part of a day's page: what is due that day, ticked by hand, and the line to write a new one on. */
export function EntryList({
	day,
	today,
	entries,
	topics,
	fresh,
	error,
	onAdd,
	onPatch,
	onDelete,
	onGo
}: {
	day: Day;
	today: Day;
	entries: DiaryEntry[];
	topics: Topic[];
	fresh: string | null;
	error: string | null;
	onAdd: (input: NewEntry) => Promise<boolean>;
	onPatch: (id: string, change: Partial<DiaryEntry>) => void;
	onDelete: (id: string) => void;
	onGo: (day: Day) => void;
}) {
	const own = entries.filter((e) => e.day === day && !e.hidden).sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
	const [editing, setEditing] = useState<DiaryEntry | null>(null);
	const topicTitle = (path: string | null) => (path ? topics.find((t) => t.path === path)?.title : undefined);
	const ahead = daysBetween(today, day);

	return (
		<section aria-labelledby="school-title" className="flex flex-col gap-3">
			<h2 id="school-title" className="label-mono text-fg-subtle">
				Per la scuola
			</h2>
			{own.length === 0 ? (
				<p className="pencil text-xl">{ahead < 0 ? 'Niente segnato quel giorno.' : ahead === 0 ? 'Niente per oggi. Scrivi qui sotto quello che devi fare.' : 'Niente segnato per ora.'}</p>
			) : (
				<ul className="flex flex-col">
					{own.map((e) => (
						<EntryLine key={e.id} entry={e} today={today} topicTitle={topicTitle(e.topic)} fresh={e.id === fresh} onToggle={() => onPatch(e.id, { done: !e.done })} onEdit={() => setEditing(e)} />
					))}
				</ul>
			)}
			<QuickAdd day={day} today={today} topics={topics} onAdd={onAdd} onGo={onGo} />
			{error && (
				<p role="alert" className="text-sm text-danger-fg">
					{error}
				</p>
			)}
			<EntrySheet entry={editing} topics={topics} onClose={() => setEditing(null)} onSave={(change) => editing && onPatch(editing.id, change)} onDelete={() => editing && onDelete(editing.id)} />
		</section>
	);
}

function EntryLine({ entry, today, topicTitle, fresh, onToggle, onEdit }: { entry: DiaryEntry; today: Day; topicTitle?: string; fresh: boolean; onToggle: () => void; onEdit: () => void }) {
	const subject = entry.subject ? SUBJECT_BY_KEY.get(entry.subject) : undefined;
	const test = isTest(entry.kind);
	// A teacher's or a tutor's entry: the student ticks it or hides it, nothing else.
	const teacher = entry.source !== 'studente';
	// Tags sit at the start of the pen line, so the box lines up with the handwriting on every entry.
	const tags = (
		<>
			{subject && <span className="label-mono mr-1.5 inline-block rounded-sm bg-tint-soft px-1.5 align-[0.3em] text-[0.6rem] leading-4 text-tint-fg">{subject.label}</span>}
			{entry.kind !== 'compito' && <span className={cn('label-mono mr-1.5 inline-block align-[0.3em] text-[0.6rem] leading-4', test ? 'text-accent-fg' : 'text-fg-subtle')}>{KIND_LABEL[entry.kind]}</span>}
			{teacher && <span className="label-mono mr-1.5 inline-block rounded-sm border border-edge-strong px-1 align-[0.3em] text-[0.55rem] leading-4 text-fg-muted">{entry.source === 'tutor' ? 'dal tutor' : 'dal docente'}</span>}
		</>
	);
	return (
		<li className="flex items-start gap-2 py-[7px]" data-subject style={subjectStyle(entry.subject)}>
			<button
				type="button"
				role="checkbox"
				aria-checked={entry.done}
				aria-label={entry.done ? 'Fatto' : 'Da fare'}
				onClick={onToggle}
				className="-ml-2.5 flex size-[44px] shrink-0 items-center justify-center rounded-lg text-fg-muted -my-2 transition-transform duration-150 ease-out-soft hover:text-fg active:scale-90 focus-ring"
			>
				<HandBox checked={entry.done} />
			</button>
			<button
				type="button"
				onClick={onEdit}
				className="group min-w-0 flex-1 rounded-md text-left focus-ring"
				aria-label={`${KIND_LABEL[entry.kind]}${subject ? ` di ${subject.label}` : ''}: ${entry.text}. Modifica`}
			>
				<span className="flex items-start justify-between gap-3">
					<span
						className={cn(
							'min-w-0 break-words transition-[color,opacity] duration-300',
							teacher ? 'font-sans text-base leading-7 text-fg' : 'diary-pen',
							entry.done && 'text-fg-subtle opacity-70 delay-300',
							fresh && 'ink-write'
						)}
					>
						{tags}
						<span className="diary-strike" data-done={entry.done || undefined}>
							{test && !entry.done ? <span className="marker-hand">{entry.text}</span> : entry.text}
						</span>
					</span>
					{test && !entry.done && entry.day >= today && <span className="pencil shrink-0 pt-0.5 text-lg leading-6 text-accent-fg">{relativeDay(entry.day, today)}</span>}
				</span>
				{topicTitle && (
					<span className="pencil flex items-center gap-1 text-lg leading-6">
						<ArrowRight className="size-3.5" aria-hidden="true" />
						{plainTitle(topicTitle)}
					</span>
				)}
			</button>
		</li>
	);
}

/**
 * One line to write an entry on, as in a paper diary: "verifica mate giovedì". What was read appears under it
 * before it is saved (kind, subject, day, the chapter it is about), and each part can be changed with a tap.
 */
function QuickAdd({ day, today, topics, onAdd, onGo }: { day: Day; today: Day; topics: Topic[]; onAdd: (input: NewEntry) => Promise<boolean>; onGo: (day: Day) => void }) {
	const id = useId();
	const input = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState('');
	const [kind, setKind] = useState<EntryKind | null>(null);
	const [dropTopic, setDropTopic] = useState(false);
	const [saving, setSaving] = useState(false);
	const [elsewhere, setElsewhere] = useState<Day | null>(null);

	const parsed = value.trim() ? parseLine(value, today, day) : null;
	const topic = !parsed || dropTopic || (parsed.subject && parsed.subject !== MATERIAL_SUBJECT) ? null : matchTopic(parsed.text, topics);
	const subject = parsed?.subject ?? (topic ? MATERIAL_SUBJECT : null);
	const chosenKind = kind ?? parsed?.kind ?? 'compito';

	useEffect(() => {
		if (!elsewhere) return;
		const t = setTimeout(() => setElsewhere(null), 6000);
		return () => clearTimeout(t);
	}, [elsewhere]);

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (!parsed || saving) return;
		setSaving(true);
		const ok = await onAdd({
			day: parsed.day,
			kind: chosenKind,
			subject,
			text: parsed.text,
			topic: topic?.path ?? null
		});
		setSaving(false);
		if (!ok) return;
		setValue('');
		setKind(null);
		setDropTopic(false);
		setElsewhere(parsed.day !== day ? parsed.day : null);
		input.current?.focus();
	};

	const chip = 'label-mono inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[0.62rem] transition-colors focus-ring';
	const cycle = () => setKind(ENTRY_KINDS[(ENTRY_KINDS.findIndex((k) => k.value === chosenKind) + 1) % ENTRY_KINDS.length].value);

	return (
		<form onSubmit={submit} className="flex flex-col gap-2">
			<label htmlFor={id} className="sr-only">
				Scrivi una voce del diario
			</label>
			<div className="flex items-center gap-2 border-b border-dashed border-edge-strong">
				<PenLine className="size-4 shrink-0 text-[var(--pen)] opacity-60" aria-hidden="true" />
				<input
					ref={input}
					id={id}
					value={value}
					maxLength={MAX_TEXT}
					onChange={(e) => {
						setValue(e.target.value);
						setDropTopic(false);
					}}
					placeholder="scrivi qui… es. verifica mate giovedì"
					enterKeyHint="done"
					autoComplete="off"
					className="diary-pen min-w-0 flex-1 border-0 bg-transparent px-0 py-2 placeholder:text-fg-faint focus:outline-none focus:ring-0"
				/>
				{parsed && (
					<Button type="submit" size="sm" loading={saving} className="shrink-0">
						Segna
					</Button>
				)}
			</div>
			{parsed && (
				<div className="flex flex-wrap items-center gap-1.5 animate-fade-in" aria-live="polite">
					<button
						type="button"
						onClick={cycle}
						className={cn(chip, isTest(chosenKind) ? 'border-accent-edge bg-accent-soft text-accent-soft-fg' : 'border-edge-strong bg-surface text-fg-muted hover:text-fg')}
						title="Cambia tipo"
					>
						{KIND_LABEL[chosenKind]}
					</button>
					{subject && (
						<span data-subject style={subjectStyle(subject)} className={cn(chip, 'border-tint-edge bg-tint-soft text-tint-fg')}>
							{SUBJECT_BY_KEY.get(subject)?.label}
						</span>
					)}
					<span className={cn(chip, 'bg-surface', parsed.dayFound ? 'border-[var(--pen)] text-[var(--pen)]' : 'border-edge text-fg-muted')}>
						{parsed.day === day ? (parsed.dayFound ? relativeDay(parsed.day, today) : 'questa pagina') : longDate(parsed.day)}
					</span>
					{topic && (
						<span className={cn(chip, 'border-edge-strong bg-surface pr-1 text-fg')}>
							<ArrowRight className="size-3" aria-hidden="true" />
							{plainTitle(topic.title)}
							<button type="button" onClick={() => setDropTopic(true)} aria-label="Togli l'argomento" className="relative flex size-5 items-center justify-center rounded-full before:absolute before:-inset-3 hover:bg-surface-3 focus-ring">
								<X className="size-3" aria-hidden="true" />
							</button>
						</span>
					)}
				</div>
			)}
			{elsewhere && (
				<p className="pencil flex flex-wrap items-center gap-2 text-lg" role="status">
					Segnato su {longDate(elsewhere)}.
					<button type="button" onClick={() => onGo(elsewhere)} className="font-sans text-sm font-medium text-accent-fg underline underline-offset-2 focus-ring">
						Vai a quel giorno
					</button>
				</p>
			)}
		</form>
	);
}

/** An entry opened to change it: text, kind, subject, day and topic, or to delete it. A teacher's can only be hidden. */
function EntrySheet({
	entry,
	topics,
	onClose,
	onSave,
	onDelete
}: {
	entry: DiaryEntry | null;
	topics: Topic[];
	onClose: () => void;
	onSave: (change: Partial<DiaryEntry>) => void;
	onDelete: () => void;
}) {
	const [draft, setDraft] = useState<DiaryEntry | null>(entry);
	const [shown, setShown] = useState(entry);
	if (entry !== shown) {
		setShown(entry);
		if (entry) setDraft(entry);
	}
	const teacher = !!entry && entry.source !== 'studente';
	const valid = !!draft && draft.text.trim().length > 0 && isDay(draft.day);
	const chapters = topics.filter((t) => t.kind === 'chapter');

	const save = () => {
		if (!entry || !draft || !valid) return;
		const change: Partial<DiaryEntry> = teacher
			? { hidden: draft.hidden }
			: {
					text: draft.text.trim(),
					kind: draft.kind,
					subject: draft.subject,
					day: draft.day,
					topic: draft.subject === MATERIAL_SUBJECT || !draft.subject ? draft.topic : null
				};
		onSave(change);
		onClose();
	};

	return (
		<Sheet
			open={!!entry}
			onClose={onClose}
			title={teacher ? (entry?.source === 'tutor' ? 'Voce del tutor' : 'Voce del docente') : 'Modifica la voce'}
			footer={
				draft && (
					<div className={sheetActions}>
						{!teacher && (
							<Button
								variant="ghost"
								className="text-danger-fg sm:mr-auto"
								onClick={() => {
									onDelete();
									onClose();
								}}
							>
								<Trash2 className="size-4" aria-hidden="true" />
								Cancella
							</Button>
						)}
						<Button variant="secondary" onClick={onClose}>
							Annulla
						</Button>
						<Button onClick={save} disabled={!valid}>
							Salva
						</Button>
					</div>
				)
			}
		>
			{draft &&
				(teacher ? (
					<div className="flex flex-col gap-3">
						<p className="text-fg">{draft.text}</p>
						<label className="flex items-center gap-2 text-sm text-fg-muted">
							<input type="checkbox" checked={draft.hidden} onChange={(e) => setDraft({ ...draft, hidden: e.target.checked })} className="rounded border-edge-strong" />
							Nascondi dal mio diario
						</label>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="entry-text">Cosa</Label>
							<Input id="entry-text" value={draft.text} maxLength={MAX_TEXT} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
						</div>
						<fieldset className="flex flex-col gap-1.5">
							<legend className="mb-1.5 text-sm font-medium text-fg">Tipo</legend>
							<div className="flex flex-wrap gap-1.5">
								{ENTRY_KINDS.map((k) => (
									<button
										key={k.value}
										type="button"
										aria-pressed={draft.kind === k.value}
										onClick={() => setDraft({ ...draft, kind: k.value })}
										className={cn(
											'h-9 rounded-full border px-3.5 text-sm transition-colors focus-ring',
											draft.kind === k.value ? 'border-inverse bg-inverse text-inverse-fg' : 'border-edge-strong bg-surface text-fg-muted hover:text-fg'
										)}
									>
										{k.label}
									</button>
								))}
							</div>
						</fieldset>
						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="entry-subject">Materia</Label>
								<Select id="entry-subject" value={draft.subject ?? ''} onChange={(e) => setDraft({ ...draft, subject: e.target.value || null })}>
									<option value="">Nessuna</option>
									{DIARY_SUBJECTS.map((s) => (
										<option key={s.key} value={s.key}>
											{s.label}
										</option>
									))}
								</Select>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="entry-day">Giorno</Label>
								<Input id="entry-day" type="date" value={draft.day} onChange={(e) => setDraft({ ...draft, day: e.target.value })} />
							</div>
						</div>
						{(draft.subject === MATERIAL_SUBJECT || !draft.subject) && (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="entry-topic">Argomento</Label>
								<Select id="entry-topic" value={draft.topic ?? ''} onChange={(e) => setDraft({ ...draft, topic: e.target.value || null })}>
									<option value="">Nessuno</option>
									{chapters.map((c) => (
										<optgroup key={c.path} label={plainTitle(c.title)}>
											<option value={c.path}>Tutto il capitolo</option>
											{topics
												.filter((t) => t.chapter === c.path)
												.map((t) => (
													<option key={t.path} value={t.path}>
														{plainTitle(t.title)}
													</option>
												))}
										</optgroup>
									))}
								</Select>
								<p className="text-xs text-fg-subtle">Con l&apos;argomento, prima di una verifica Sapiens ti propone il ripasso.</p>
							</div>
						)}
					</div>
				))}
		</Sheet>
	);
}
