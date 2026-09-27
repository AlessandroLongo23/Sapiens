'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';
import type { Outcome } from '@/lib/tools/types';
import { mathText } from '@/lib/tools/tex';
import { Html } from '@/components/ui/Html';
import { cn } from '@/lib/utils/cn';

/**
 * The parts every tool shares, so they all look and behave alike: the inputs kept in the address (a result can be
 * shared, and the page opens on the example when there is none), the sheet with the inputs and the result side by
 * side, and the result with its steps, set like the solution of an exercise.
 */

/**
 * A tool's inputs, mirrored in the query string: read once after the page loads (the server renders the example),
 * written back as the student types, without a navigation. Only values that differ from the example are written.
 */
export function useToolState<T extends Record<string, string>>(defaults: T): [T, (patch: Partial<T>) => void] {
	const [state, setState] = useState(defaults);
	const loaded = useRef(false);
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const read = Object.fromEntries(Object.keys(defaults).flatMap((k) => (params.has(k) ? [[k, params.get(k) ?? '']] : [])));
		// eslint-disable-next-line react-hooks/set-state-in-effect -- one read of the address after the server-rendered example
		if (Object.keys(read).length) setState((s) => ({ ...s, ...read }));
		loaded.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (!loaded.current) return;
		const params = new URLSearchParams();
		for (const [k, v] of Object.entries(state)) if (v !== defaults[k]) params.set(k, v);
		const query = params.toString();
		window.history.replaceState(window.history.state, '', query ? `?${query}` : window.location.pathname);
	}, [state, defaults]);
	return [state, (patch) => setState((s) => ({ ...s, ...patch }))];
}

/** The tool on a sheet of squared paper: inputs on the left, the result on the right; stacked on a phone. */
export function ToolSheet({ inputs, outcome }: { inputs: ReactNode; outcome: Outcome }) {
	return (
		<section aria-label="Strumento" className="relative overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
			<div className="grid-paper pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
			<div className="relative grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
				<div className="flex min-w-0 flex-col gap-4">{inputs}</div>
				<ResultPanel outcome={outcome} />
			</div>
		</section>
	);
}

/** A labelled field of a tool. `hint` goes under it. */
export function ToolField({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="label-mono text-fg-subtle">{label}</span>
			{children}
			{hint && <span className="text-xs text-fg-subtle">{hint}</span>}
		</label>
	);
}

export const toolInputClass =
	'w-full rounded-xl border border-edge bg-surface px-3.5 py-2.5 font-mono text-lg text-fg-strong outline-none transition shadow-paper placeholder:text-fg-faint focus:border-accent focus:ring-3 focus:ring-accent/20';

/**
 * The modes of a tool (the four questions on percentages, simple or weighted mean): buttons in a grid that wraps,
 * two to a row on a phone, so a long label is never cut. Two or three short modes can use the `ToggleGroup`.
 */
export function ModeSwitch<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
	return (
		<div role="group" aria-label={label} className="grid grid-cols-2 gap-1 rounded-xl border border-edge bg-surface p-1">
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					aria-pressed={value === o.value}
					onClick={() => onChange(o.value)}
					className={cn('min-h-[40px] rounded-lg px-2 py-1.5 text-sm font-medium transition-colors duration-150 focus-ring', value === o.value ? 'bg-accent text-white shadow-sm' : 'text-fg-muted hover:bg-surface-3')}
				>
					{o.label}
				</button>
			))}
		</div>
	);
}

/** Examples the student can click to fill the inputs. */
export function Examples({ items, onPick }: { items: { label: string; apply: () => void }[]; onPick?: () => void }) {
	return (
		<div className="flex flex-wrap items-center gap-2 text-sm">
			<span className="text-fg-subtle">Esempi:</span>
			{items.map((item) => (
				<button
					key={item.label}
					type="button"
					onClick={() => {
						item.apply();
						onPick?.();
					}}
					className="rounded-full border border-edge bg-surface px-3 py-1 font-mono text-fg-muted transition-colors hover:border-edge-strong hover:text-fg focus-ring"
				>
					{item.label}
				</button>
			))}
		</div>
	);
}

function useCopied(): [boolean, () => void] {
	const [copied, setCopied] = useState(false);
	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 1600);
		return () => clearTimeout(id);
	}, [copied]);
	return [copied, () => setCopied(true)];
}

/** The answer set large, the copy and share buttons, then the steps, numbered as in the solution of an exercise. */
export function ResultPanel({ outcome }: { outcome: Outcome }) {
	const result = useMemo(() => (outcome.ok ? mathText(outcome.result) : ''), [outcome]);
	const steps = useMemo(() => (outcome.ok ? outcome.steps.map(mathText) : []), [outcome]);
	const [copied, markCopied] = useCopied();
	const [linked, markLinked] = useCopied();

	return (
		<div className="flex min-w-0 flex-col gap-4">
			<div aria-live="polite" className="min-h-[3.5rem]">
				{outcome.ok ? (
					<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-surface px-4 py-3 shadow-paper">
						<Html html={result} className="math-content min-w-0 break-words text-2xl font-medium text-fg-strong sm:text-3xl" />
						<div className="flex shrink-0 gap-1">
							<IconButton
								label={copied ? 'Copiato' : 'Copia il risultato'}
								onClick={() => {
									void navigator.clipboard?.writeText(outcome.copy);
									markCopied();
								}}
							>
								{copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
							</IconButton>
							<IconButton
								label={linked ? 'Link copiato' : 'Copia il link a questo calcolo'}
								onClick={() => {
									void navigator.clipboard?.writeText(window.location.href);
									markLinked();
								}}
							>
								{linked ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
							</IconButton>
						</div>
					</div>
				) : (
					<p className="rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-danger-fg">{outcome.error}</p>
				)}
			</div>
			{steps.length > 0 && (
				<section aria-label="Come si calcola" className="overflow-hidden rounded-xl border border-edge bg-surface-2 shadow-paper">
					<h2 className="label-mono border-b border-edge px-4 py-3 text-fg-subtle sm:px-5">Come si calcola</h2>
					<ol className="flex flex-col gap-2.5 p-4 sm:p-5">
						{steps.map((html, i) => (
							<li key={i} className="flex gap-3 text-base leading-relaxed text-fg">
								<span className="mt-0.5 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
									{String(i + 1).padStart(2, '0')}
								</span>
								<Html html={html} className="math-content min-w-0 flex-1 break-words" />
							</li>
						))}
					</ol>
				</section>
			)}
		</div>
	);
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
	return (
		<button type="button" onClick={onClick} aria-label={label} title={label} className={cn('flex size-10 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring')}>
			{children}
		</button>
	);
}
