'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';
import type { Outcome, Step } from '@/lib/tools/types';
import { mathLine, mathText } from '@/lib/tools/tex';
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

/**
 * The tool on a sheet of squared paper: the inputs and the answer side by side (stacked on a phone), then the steps
 * across the whole sheet, in lines short enough to read (70 characters at most).
 */
export function ToolSheet({ inputs, outcome }: { inputs: ReactNode; outcome: Outcome }) {
	return (
		<section aria-label="Strumento" className="relative overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
			<div className="grid-paper pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
			<div className="relative flex flex-col gap-6 p-4 sm:p-6">
				<div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
					<div className="flex min-w-0 flex-col gap-4">{inputs}</div>
					<ResultBox outcome={outcome} />
				</div>
				{outcome.ok && outcome.steps.length > 0 && <StepList steps={outcome.steps} />}
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

/**
 * A shadow on the side where a wide formula or table continues, so a student sees there is more to scroll to; it
 * disappears at the end (background-attachment: local covers it). After Lea Verou's "scrolling shadows".
 */
const SCROLL_HINT =
	'[background:linear-gradient(to_right,var(--surface-2)_30%,transparent)_left/2rem_100%_no-repeat_local,linear-gradient(to_left,var(--surface-2)_30%,transparent)_right/2rem_100%_no-repeat_local,radial-gradient(farthest-side_at_0_50%,color-mix(in_oklab,var(--fg)_18%,transparent),transparent)_left/0.75rem_100%_no-repeat_scroll,radial-gradient(farthest-side_at_100%_50%,color-mix(in_oklab,var(--fg)_18%,transparent),transparent)_right/0.75rem_100%_no-repeat_scroll]';
/** The same on the answer's box, whose paper is `--surface`. Two literal strings, so Tailwind finds both. */
const SCROLL_HINT_SURFACE =
	'[background:linear-gradient(to_right,var(--surface)_30%,transparent)_left/2rem_100%_no-repeat_local,linear-gradient(to_left,var(--surface)_30%,transparent)_right/2rem_100%_no-repeat_local,radial-gradient(farthest-side_at_0_50%,color-mix(in_oklab,var(--fg)_18%,transparent),transparent)_left/0.75rem_100%_no-repeat_scroll,radial-gradient(farthest-side_at_100%_50%,color-mix(in_oklab,var(--fg)_18%,transparent),transparent)_right/0.75rem_100%_no-repeat_scroll]';

/**
 * The answer: one row per value, its name in words over it, so a screen reader and a student who does not know the
 * symbol both know what the number is. Copy and share buttons at the side.
 */
export function ResultBox({ outcome }: { outcome: Outcome }) {
	const rows = useMemo(() => (outcome.ok ? outcome.rows.map((r) => ({ label: r.label, html: mathText(r.value, true) })) : []), [outcome]);
	const [copied, markCopied] = useCopied();
	const [linked, markLinked] = useCopied();

	return (
		<div aria-live="polite" className="min-w-0">
			{outcome.ok ? (
				<div className="flex items-start gap-3 rounded-xl border border-edge bg-surface px-4 py-3 shadow-paper sm:px-5 sm:py-4">
					<dl className="flex min-w-0 flex-1 flex-col gap-3">
						{rows.map((row, i) => (
							<div key={i} className="min-w-0">
								<dt className="text-sm text-fg-muted">{row.label}</dt>
								<dd>
									<Html html={row.html} className={cn('math-content scroll-x text-xl font-medium leading-snug text-fg-strong sm:text-3xl', SCROLL_HINT_SURFACE)} />
								</dd>
							</div>
						))}
					</dl>
					<div className="flex shrink-0 flex-col gap-1">
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
				<p className="rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-base leading-relaxed text-danger-fg">{outcome.error}</p>
			)}
		</div>
	);
}

/**
 * The working, numbered. Each step: the sentence, then each line of calculation on a line of its own (it scrolls
 * sideways when wider than the screen, never breaks), a table for a list of values, the conclusion. `\hl{…}` in a
 * formula is tinted and underlined. The student can also open the steps one at a time.
 */
export function StepList({ steps }: { steps: Step[] }) {
	const html = useMemo(
		() =>
			steps.map((s) => ({
				group: s.group,
				say: mathText(s.say),
				math: (s.math ?? []).map(mathLine),
				table: s.table && { head: s.table.head?.map((h) => mathText(h, true)), rows: s.table.rows.map((r) => r.map((c) => mathText(c, true))) },
				then: s.then ? mathText(s.then) : null
			})),
		[steps]
	);
	const [oneByOne, setOneByOne] = useState(false);
	const [shown, setShown] = useState(1);
	const visible = oneByOne ? html.slice(0, shown) : html;

	return (
		<section aria-labelledby="steps-heading" className="rounded-xl border border-edge bg-surface-2 shadow-paper">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-4 py-3 sm:px-6">
				<h2 id="steps-heading" className="label-mono text-fg-subtle">
					Come si calcola
				</h2>
				<button
					type="button"
					aria-pressed={oneByOne}
					onClick={() => {
						setOneByOne((v) => !v);
						setShown(1);
					}}
					className="rounded-lg px-2 py-1 text-sm text-fg-muted underline decoration-edge-strong underline-offset-4 hover:text-fg focus-ring"
				>
					{oneByOne ? 'Mostra tutti i passaggi' : 'Un passaggio alla volta'}
				</button>
			</div>
			<ol className="mx-auto flex max-w-[70ch] flex-col gap-5 px-4 py-5 text-[17px] leading-[1.65] text-fg sm:px-6 [&_.hl]:inline-block [&_.hl]:rounded-sm [&_.hl]:bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] [&_.hl]:px-0.5 [&_.hl]:pb-0.5 [&_.hl]:shadow-[inset_0_-2px_0_var(--accent)]">
				{visible.map((step, i) => (
					<li key={i} className="flex flex-col gap-2">
						{step.group && <h3 className="font-display text-lg font-semibold text-fg-strong">{step.group}</h3>}
						<div className="flex gap-3">
							<span className="mt-1 w-6 shrink-0 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
								{String(i + 1).padStart(2, '0')}
							</span>
							<div className="flex min-w-0 flex-1 flex-col gap-2">
								<Html html={step.say} className="math-content" />
								{step.math.map((line, j) => (
									<Html key={j} html={line} className={cn('math-content scroll-x py-0.5', SCROLL_HINT)} />
								))}
								{step.table && (
									<div className={cn('scroll-x', SCROLL_HINT)}>
										<table className="border-collapse text-left tabular-nums">
											{step.table.head && (
												<thead>
													<tr>
														{step.table.head.map((h, j) => (
															<th key={j} className="math-content border-b border-edge-strong px-3 py-1.5 font-medium text-fg-muted first:pl-0" dangerouslySetInnerHTML={{ __html: h }} />
														))}
													</tr>
												</thead>
											)}
											<tbody>
												{step.table.rows.map((row, j) => (
													<tr key={j} className="border-b border-edge last:border-b-0">
														{row.map((cell, k) => (
															<td key={k} className="math-content px-3 py-1.5 first:pl-0" dangerouslySetInnerHTML={{ __html: cell }} />
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
								{step.then && <Html html={step.then} className="math-content" />}
							</div>
						</div>
					</li>
				))}
			</ol>
			{oneByOne && shown < html.length && (
				<div className="border-t border-edge px-4 py-3 sm:px-6">
					<button type="button" onClick={() => setShown((n) => n + 1)} className="rounded-xl bg-inverse px-4 py-2 text-sm font-semibold text-inverse-fg shadow-key focus-ring-offset">
						Mostra il passaggio successivo ({shown + 1} di {html.length})
					</button>
				</div>
			)}
		</section>
	);
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
	return (
		<button type="button" onClick={onClick} aria-label={label} title={label} className={cn('flex size-10 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring')}>
			{children}
		</button>
	);
}
