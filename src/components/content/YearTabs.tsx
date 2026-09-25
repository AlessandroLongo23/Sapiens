'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const YEARS = ['Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto'];

export interface YearPanel {
	year: number;
	ready: number;
	total: number;
	/** The year's chapter rows, rendered on the server. */
	rows: ReactNode;
}

/**
 * A subject's chapters one school year at a time: the title and a binder tab
 * per year on one line, and under them the chapters of the chosen year. Every
 * year is in the HTML, the others hidden, so search engines still read them.
 * The chosen year is kept in the address (`#anno-3`), so a link can open it.
 */
export function YearTabs({ id, years }: { id: string; years: YearPanel[] }) {
	const [current, setCurrent] = useState(years[0].year);
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		const fromHash = () => {
			const year = Number(/^#anno-(\d)$/.exec(window.location.hash)?.[1]);
			if (years.some((y) => y.year === year)) setCurrent(year);
		};
		fromHash();
		window.addEventListener('hashchange', fromHash);
		return () => window.removeEventListener('hashchange', fromHash);
	}, [years]);

	const choose = (year: number, focus = false) => {
		setCurrent(year);
		history.replaceState(null, '', `#anno-${year}`);
		if (focus) tabs.current[years.findIndex((y) => y.year === year)]?.focus();
	};

	// Arrow keys, Home and End move between the tabs, as in any tab list.
	const onKeyDown = (e: KeyboardEvent) => {
		const i = years.findIndex((y) => y.year === current);
		const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: years.length - 1 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		choose(years[(next + years.length) % years.length].year, true);
	};

	return (
		<>
			<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-edge-strong">
				<h2 id={id} className="pb-3 text-3xl font-semibold text-fg-strong app:max-md:text-2xl">
					Capitoli
				</h2>
				<div role="tablist" aria-label="Anno" className="-mb-px flex items-end gap-1" onKeyDown={onKeyDown}>
					{years.map(({ year, ready, total }, i) => {
						const active = year === current;
						return (
							<button
								key={year}
								ref={(el) => {
									tabs.current[i] = el;
								}}
								type="button"
								role="tab"
								id={`anno-${year}-tab`}
								aria-selected={active}
								aria-controls={`anno-${year}`}
								tabIndex={active ? 0 : -1}
								onClick={() => choose(year)}
								className={cn(
									'group flex items-baseline gap-2 rounded-t-lg border px-3 transition-colors focus-ring sm:px-3.5',
									// The chosen tab is open towards its chapters; the others close on the line under the title.
									active ? 'border-edge-strong border-b-page-alt bg-page-alt pb-2.5 pt-2.5' : 'border-edge border-b-edge-strong bg-surface-2 py-1.5 hover:bg-tint-soft'
								)}
							>
								<span className={cn('font-display text-lg font-semibold', active ? 'text-tint-fg' : 'text-fg-muted group-hover:text-tint-fg')}>{year}ª</span>
								<span className="label-mono hidden text-fg-subtle sm:inline">
									{ready}/{total}
									<span className="sr-only"> capitoli pronti</span>
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{years.map(({ year, ready, total, rows }) => (
				<div key={year} role="tabpanel" id={`anno-${year}`} aria-labelledby={`anno-${year}-tab`} hidden={year !== current} className="pt-6">
					<p className="label-mono text-fg-subtle">
						{YEARS[year - 1]} anno · <span className={ready ? 'text-tint-fg' : undefined}>{ready} di {total} pronti</span>
					</p>
					<ol className="mt-2 grid grid-cols-1 gap-x-12 lg:grid-cols-2">{rows}</ol>
				</div>
			))}
		</>
	);
}
