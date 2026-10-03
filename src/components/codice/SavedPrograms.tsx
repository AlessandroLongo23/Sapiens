'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FolderOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PROGRAM_LANGUAGES, type ProgramFiles, type ProgramLanguage, type ProgramQuota, type SavedProgram, type SavedProgramFiles } from '@/lib/codice/salvati';
import { useAuth } from '@/lib/state/auth';
import { cn } from '@/lib/utils/cn';

/**
 * "I miei programmi": the programs a student has saved, to load one in the editor, and the two ways of saving what
 * is there. "Salva" writes over the program the editor was loaded from; "Salva con nome" makes a new one. Without
 * an account the panel says so and opens the login. Built like the plotter's SavedPlots.
 */

/** What is in the editor: the language and its files. */
export interface Program {
	language: ProgramLanguage;
	files: ProgramFiles;
}

/** A request to the saved programs' API: the answer, or an error with the sentence the server gave. */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`/api/programmi${path}`, { ...init, headers: init?.body ? { 'Content-Type': 'application/json' } : undefined });
	const body = (await response.json().catch(() => ({}))) as { error?: string };
	if (!response.ok) throw new Error(body.error ?? 'Servizio non disponibile. Riprova più tardi.');
	return body as T;
}

const day = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const BUTTON = 'h-10 rounded-lg border border-edge-strong bg-surface px-3 text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring disabled:cursor-not-allowed disabled:border-edge disabled:text-fg-faint disabled:hover:bg-surface';

interface PanelProps {
	/** The saved program the editor was loaded from, or last saved as. */
	current: { id: string; title: string } | null;
	/** Whether the editor has changed since. */
	dirty: boolean;
	/** What is in the editor now. */
	program: () => Program;
	onSaved: (program: SavedProgramFiles) => void;
	/** Missing where a saved program cannot take the place of what is there (an exercise of a lesson): the panel only saves. */
	onLoad?: (program: SavedProgramFiles) => void;
	/** The program in the editor was deleted from the list. */
	onGone: () => void;
}

function Panel({ current, dirty, program, onSaved, onLoad, onGone }: PanelProps) {
	const user = useAuth((s) => s.user);
	const openModal = useAuth((s) => s.openModal);
	const [programs, setPrograms] = useState<SavedProgram[] | null>(null);
	const [quota, setQuota] = useState<ProgramQuota | null>(null);
	const [name, setName] = useState('');
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [asked, setAsked] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;
		let cancelled = false;
		api<{ programs: SavedProgram[]; quota: ProgramQuota }>('')
			.then((r) => {
				if (cancelled) return;
				setPrograms(r.programs);
				setQuota(r.quota);
			})
			.catch((err: Error) => !cancelled && setError(err.message));
		return () => {
			cancelled = true;
		};
	}, [user]);

	if (!user)
		return (
			<>
				<p className="mt-0 mb-3 text-sm text-fg-muted">Con un account salvi i programmi con un nome e li ritrovi qui, da ogni dispositivo.</p>
				<button type="button" onClick={() => openModal()} className={cn(BUTTON, 'w-full')}>
					Accedi o registrati
				</button>
			</>
		);

	/** Runs a request with the buttons off, and shows what went wrong. */
	const run = async (work: () => Promise<void>) => {
		setBusy(true);
		setError(null);
		try {
			await work();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Servizio non disponibile. Riprova più tardi.');
		} finally {
			setBusy(false);
		}
	};
	const listed = (saved: SavedProgram) => setPrograms((list) => [{ id: saved.id, title: saved.title, language: saved.language, updated_at: saved.updated_at }, ...(list ?? []).filter((p) => p.id !== saved.id)]);

	const save = () =>
		run(async () => {
			const { program: saved } = await api<{ program: SavedProgramFiles }>(`/${current!.id}`, { method: 'PATCH', body: JSON.stringify(program()) });
			listed(saved);
			onSaved(saved);
		});
	const saveAs = () =>
		run(async () => {
			const { program: saved } = await api<{ program: SavedProgramFiles }>('', { method: 'POST', body: JSON.stringify({ title: name, ...program() }) });
			listed(saved);
			setQuota((q) => q && { ...q, used: q.used + 1 });
			setName('');
			onSaved(saved);
		});
	const open = (id: string) => run(async () => onLoad?.((await api<{ program: SavedProgramFiles }>(`/${id}`)).program));
	const remove = (id: string) =>
		run(async () => {
			await api(`/${id}`, { method: 'DELETE' });
			setPrograms((list) => (list ?? []).filter((p) => p.id !== id));
			setQuota((q) => q && { ...q, used: Math.max(0, q.used - 1) });
			setAsked(null);
			if (current?.id === id) onGone();
		});

	return (
		<div className="flex flex-col gap-3">
			{current && (
				<div className="flex items-center gap-2">
					<p className="m-0 min-w-0 flex-1 text-sm text-fg-muted">
						Nell’editor: <span className="font-medium text-fg-strong">{current.title}</span>
						{dirty ? ', con modifiche non salvate.' : ', salvato.'}
					</p>
					<button type="button" onClick={() => void save()} disabled={busy || !dirty} className={BUTTON}>
						Salva
					</button>
				</div>
			)}
			<form
				className="flex items-center gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					if (name.trim()) void saveAs();
				}}
			>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={120}
					placeholder={current ? 'Un altro nome' : 'Nome del programma'}
					aria-label="Nome con cui salvare il programma"
					className="h-10 min-w-0 flex-1 rounded-lg border border-edge-strong bg-surface px-3 text-sm text-fg-strong placeholder:text-fg-faint focus-ring max-sm:text-base"
				/>
				<button type="submit" disabled={busy || !name.trim()} className={BUTTON}>
					Salva con nome
				</button>
			</form>
			{error && (
				<p role="alert" className="m-0 text-sm text-accent-fg">
					{error}
				</p>
			)}

			{onLoad && (
				<div className="border-t border-edge pt-2">
					{programs === null && !error && <p className="m-0 py-2 text-sm text-fg-muted">Carico i tuoi programmi…</p>}
					{programs?.length === 0 && <p className="m-0 py-2 text-sm text-fg-muted">Non hai ancora salvato programmi.</p>}
					{programs && programs.length > 0 && (
						<ul className="m-0 flex max-h-64 list-none flex-col gap-0.5 overflow-y-auto p-0">
							{programs.map((saved) => (
								<li key={saved.id} className="flex items-start gap-1">
									<button type="button" disabled={busy} onClick={() => void open(saved.id)} className={cn('flex min-w-0 flex-1 flex-col rounded-lg px-2.5 py-1.5 text-left hover:bg-surface-3 focus-ring', current?.id === saved.id && 'bg-surface-2')}>
										<span className="truncate text-sm font-medium text-fg-strong">{saved.title}</span>
										<span className="text-xs text-fg-muted">
											{PROGRAM_LANGUAGES[saved.language]} · {day.format(new Date(saved.updated_at))}
										</span>
									</button>
									{asked === saved.id ? (
										<button type="button" disabled={busy} onClick={() => void remove(saved.id)} onBlur={() => setAsked(null)} autoFocus className="h-9 shrink-0 rounded-lg bg-accent px-2.5 text-xs font-medium text-white focus-ring">
											Elimina
										</button>
									) : (
										<button type="button" onClick={() => setAsked(saved.id)} aria-label={`Elimina il programma ${saved.title}`} title="Elimina" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring">
											<Trash2 className="size-4" aria-hidden="true" />
										</button>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			)}
			{quota?.max != null && (
				<p className="m-0 text-xs text-fg-muted">
					{quota.used} di {quota.max} programmi del piano gratuito.
				</p>
			)}
		</div>
	);
}

/** The button of an editor's bar that opens "I miei programmi" under it; on a phone, under the whole bar, which is `relative`. */
export function SavedPrograms(props: PanelProps & { label?: ReactNode }) {
	const [open, setOpen] = useState(false);
	const box = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const outside = (event: PointerEvent) => !box.current?.contains(event.target as Node) && setOpen(false);
		const escape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
		document.addEventListener('pointerdown', outside);
		document.addEventListener('keydown', escape);
		return () => {
			document.removeEventListener('pointerdown', outside);
			document.removeEventListener('keydown', escape);
		};
	}, [open]);

	return (
		<div ref={box} className="relative max-sm:static">
			<Button variant="ghost" size="sm" onClick={() => setOpen((now) => !now)} aria-expanded={open} title="I miei programmi: salva questo, o caricane uno">
				<FolderOpen className="size-3.5" aria-hidden="true" />
				<span className="max-w-40 truncate">{props.label ?? (props.current ? `${props.current.title}${props.dirty ? ' •' : ''}` : 'I miei programmi')}</span>
			</Button>
			{open && (
				<div role="dialog" aria-label="I miei programmi" className="absolute top-full left-0 z-20 mt-1 w-[22rem] rounded-xl max-sm:right-2 max-sm:left-2 max-sm:w-auto border border-edge bg-surface p-3 shadow-paper">
					<Panel
						{...props}
						onLoad={
							props.onLoad &&
							((program) => {
								props.onLoad!(program);
								setOpen(false);
							})
						}
					/>
				</div>
			)}
		</div>
	);
}
