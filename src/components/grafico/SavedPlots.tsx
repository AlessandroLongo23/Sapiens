'use client';

import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { PlotQuota, SavedPlot, SavedPlotState } from '@/lib/grafico/salvati';
import { useAuth } from '@/lib/state/auth';
import { cn } from '@/lib/utils/cn';

/**
 * "I miei grafici": the graphs a student has saved, to load one on the plane, and the two ways of saving what is
 * there. "Salva" writes over the graph the plane was loaded from; "Salva con nome" makes a new one. Without an
 * account the panel says so and opens the login.
 */

/** A request to the saved graphs' API: the answer, or an error with the sentence the server gave. */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`/api/grafici${path}`, { ...init, headers: init?.body ? { 'Content-Type': 'application/json' } : undefined });
	const body = (await response.json().catch(() => ({}))) as { error?: string };
	if (!response.ok) throw new Error(body.error ?? 'Servizio non disponibile. Riprova più tardi.');
	return body as T;
}

/** "Salva": the state written over a graph already saved. */
export const overwritePlot = (id: string, state: string, preview: string | null) => api<{ plot: SavedPlotState }>(`/${id}`, { method: 'PATCH', body: JSON.stringify({ state, preview }) }).then((r) => r.plot);

/** How long the pointer rests on a name before its picture opens: passing over the list opens nothing. */
const REST = 180;

const day = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const BUTTON = 'h-10 rounded-lg border border-edge-strong bg-surface px-3 text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring disabled:cursor-not-allowed disabled:border-edge disabled:text-fg-faint disabled:hover:bg-surface';

export function SavedPlots({
	current,
	dirty,
		empty,
	state,
	preview,
	onSaved,
	onLoad,
	onGone
}: {
	/** The saved graph the plane was loaded from, or last saved as. */
	current: { id: string; title: string } | null;
	/** Whether the plane has changed since. */
	dirty: boolean;
	/** Nothing on the plane: nothing to save. */
	empty: boolean;
	/** What is on the plane now, as a link would carry it. */
		state: () => string;
	/** The plane as a picture, kept with the graph for the list. */
	preview: () => string | null;
	onSaved: (plot: SavedPlot) => void;
	onLoad: (plot: SavedPlotState) => void;
	/** The graph on the plane was deleted from the list. */
	onGone: () => void;
}) {
	const user = useAuth((s) => s.user);
	const openModal = useAuth((s) => s.openModal);
	const [plots, setPlots] = useState<SavedPlot[] | null>(null);
	const [quota, setQuota] = useState<PlotQuota | null>(null);
	const [name, setName] = useState('');
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [asked, setAsked] = useState<string | null>(null);
	// The graph under the pointer, or with the focus, shows its picture: read once, with the graph, and kept.
	const [shown, setShown] = useState<string | null>(null);
	const [pictures, setPictures] = useState<Record<string, string | null>>({});
	const loaded = useRef(new Map<string, SavedPlotState>());
	const rest = useRef(0);
	const read = async (id: string) => {
		const known = loaded.current.get(id);
		if (known) return known;
		const { plot } = await api<{ plot: SavedPlotState }>(`/${id}`);
		loaded.current.set(id, plot);
		return plot;
	};
	const keep = (id: string, svg: string | null) => setPictures((p) => ({ ...p, [id]: svg ? URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })) : null }));
	const show = (id: string | null) => {
		window.clearTimeout(rest.current);
		if (id === null) return setShown(null);
		rest.current = window.setTimeout(() => {
			setShown(id);
			if (id in pictures) return;
			read(id)
				.then((plot) => keep(id, plot.preview ?? null))
				.catch(() => {});
		}, REST);
	};
	useEffect(() => () => window.clearTimeout(rest.current), []);


	useEffect(() => {
		if (!user) return;
		let cancelled = false;
		api<{ plots: SavedPlot[]; quota: PlotQuota }>('')
			.then((r) => {
				if (cancelled) return;
				setPlots(r.plots);
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
				<p className="mt-0 mb-3 text-sm text-fg-muted">Con un account salvi i grafici con un nome e li ritrovi qui, da ogni dispositivo. Senza account c’è “Condividi”, che copia il link al grafico.</p>
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
	const listed = (plot: SavedPlot) => setPlots((list) => [{ id: plot.id, title: plot.title, updated_at: plot.updated_at }, ...(list ?? []).filter((p) => p.id !== plot.id)]);

	const save = () =>
		run(async () => {
			const picture = preview();
			const plot = await overwritePlot(current!.id, state(), picture);
			loaded.current.delete(plot.id);
			keep(plot.id, picture);
			listed(plot);
			onSaved(plot);
		});
	const saveAs = () =>
		run(async () => {
			const picture = preview();
			const { plot } = await api<{ plot: SavedPlotState }>('', { method: 'POST', body: JSON.stringify({ title: name, state: state(), preview: picture }) });
			keep(plot.id, picture);
			listed(plot);
			setQuota((q) => q && { ...q, used: q.used + 1 });
			setName('');
			onSaved(plot);
		});
	const open = (id: string) => run(async () => onLoad(await read(id)));
	const remove = (id: string) =>
		run(async () => {
			await api(`/${id}`, { method: 'DELETE' });
			setPlots((list) => (list ?? []).filter((p) => p.id !== id));
			setQuota((q) => q && { ...q, used: Math.max(0, q.used - 1) });
			setAsked(null);
			if (current?.id === id) onGone();
		});

	return (
		<div className="flex flex-col gap-3">
			{current && (
				<div className="flex items-center gap-2">
					<p className="m-0 min-w-0 flex-1 text-sm text-fg-muted">
						Sul piano: <span className="font-medium text-fg-strong">{current.title}</span>
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
					if (name.trim() && !empty) void saveAs();
				}}
			>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={120}
					placeholder={current ? 'Un altro nome' : 'Nome del grafico'}
					aria-label="Nome con cui salvare il grafico"
					className="h-10 min-w-0 flex-1 rounded-lg border border-edge-strong bg-surface px-3 text-sm text-fg-strong placeholder:text-fg-faint focus-ring"
				/>
				<button type="submit" disabled={busy || empty || !name.trim()} className={BUTTON}>
					Salva con nome
				</button>
			</form>
			{error && (
				<p role="alert" className="m-0 text-sm text-accent-fg">
					{error}
				</p>
			)}

			<div className="border-t border-edge pt-2">
				{plots === null && !error && <p className="m-0 py-2 text-sm text-fg-muted">Carico i tuoi grafici…</p>}
				{plots?.length === 0 && <p className="m-0 py-2 text-sm text-fg-muted">Non hai ancora salvato grafici.</p>}
				{plots && plots.length > 0 && (
					<ul className="m-0 flex max-h-64 list-none flex-col gap-0.5 overflow-y-auto p-0">
						{plots.map((plot) => (
							<li key={plot.id} className="flex items-start gap-1" onPointerEnter={(e) => e.pointerType === 'mouse' && show(plot.id)} onPointerLeave={() => show(null)}>
								<button
									type="button"
									disabled={busy}
									onClick={() => void open(plot.id)}
									onFocus={() => show(plot.id)}
									onBlur={() => show(null)}
									className={cn('flex min-w-0 flex-1 flex-col rounded-lg px-2.5 py-1.5 text-left hover:bg-surface-3 focus-ring', current?.id === plot.id && 'bg-surface-2')}
								>
									<span className="truncate text-sm font-medium text-fg-strong">{plot.title}</span>
									<span className="text-xs text-fg-muted">{day.format(new Date(plot.updated_at))}</span>
									{/* the row opens on the picture of the graph, the plane as it was saved */}
									<span className={cn('grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none', shown === plot.id && pictures[plot.id] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
										<span className="min-h-0 overflow-hidden">
											{/* eslint-disable-next-line @next/next/no-img-element -- a picture made in the browser, from the student's own graph */}
											{pictures[plot.id] && <img src={pictures[plot.id]!} alt="" className="plot-clip mt-1.5 block w-full rounded-md border border-edge bg-white" />}
										</span>
									</span>
								</button>
								{asked === plot.id ? (
									<button type="button" disabled={busy} onClick={() => void remove(plot.id)} onBlur={() => setAsked(null)} autoFocus className="h-9 shrink-0 rounded-lg bg-accent px-2.5 text-xs font-medium text-white focus-ring">
										Elimina
									</button>
								) : (
									<button type="button" onClick={() => setAsked(plot.id)} aria-label={`Elimina il grafico ${plot.title}`} title="Elimina" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring">
										<Trash2 className="size-4" aria-hidden="true" />
									</button>
								)}
							</li>
						))}
					</ul>
				)}
				{quota?.max != null && (
					<p className="mt-2 mb-0 text-xs text-fg-muted">
						{quota.used} di {quota.max} grafici del piano gratuito.
					</p>
				)}
			</div>
		</div>
	);
}
