'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeftRight, Atom, Binary, ChartColumn, FlaskConical, GraduationCap, Hash, Search, Shapes, TriangleRight, Variable, X, type LucideIcon } from 'lucide-react';
import type { ToolCategory } from '@/lib/tools/types';
import { normalise } from '@/lib/tools/search';
import { cn } from '@/lib/utils/cn';

/** A tool as its card shows it; `sample` is already typeset (KaTeX HTML) on the server. */
export interface ToolCard {
	href: string;
	title: string;
	lead: string;
	sample: string;
	/** Everything the search matches against, normalised: title, lead, keywords, category. */
	haystack: string;
}

export interface ToolGroup {
	category: ToolCategory;
	name: string;
	/** The name on the tab, shorter than the heading: "Numeri" for "Numeri e aritmetica". */
	short: string;
	tools: ToolCard[];
}

export const CATEGORY_ICONS: Record<ToolCategory, LucideIcon> = {
	numeri: Hash,
	algebra: Variable,
	geometria: Shapes,
	statistica: ChartColumn,
	trigonometria: TriangleRight,
	conversioni: ArrowLeftRight,
	fisica: Atom,
	chimica: FlaskConical,
	informatica: Binary,
	scuola: GraduationCap
};

/**
 * The index of the tools: a search box, then one binder tab per category (as the school years on a subject page) and
 * the tools of the chosen category as cards. Each card leads with a tiny worked example, so a student recognises the
 * calculation before reading the title. Every category is in the HTML, the others hidden, so search engines read all
 * the links; the chosen one is kept in the address (`#geometria`). Typing in the search box shows the matches from
 * every category instead of the tabs.
 */
export function ToolIndex({ groups }: { groups: ToolGroup[] }) {
	const [current, setCurrent] = useState(groups[0].category);
	const [query, setQuery] = useState('');
	const deferred = useDeferredValue(query);
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);
	const strip = useRef<HTMLDivElement>(null);
	// Whether the strip of tabs goes on past its right edge, to show the fade that says so.
	const [more, setMore] = useState(false);
	const measure = () => {
		const el = strip.current;
		if (el) setMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	};

	useEffect(() => {
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	}, []);

	useEffect(() => {
		const fromHash = () => {
			const hash = window.location.hash.slice(1);
			if (groups.some((g) => g.category === hash)) setCurrent(hash as ToolCategory);
		};
		fromHash();
		window.addEventListener('hashchange', fromHash);
		return () => window.removeEventListener('hashchange', fromHash);
	}, [groups]);

	const choose = (category: ToolCategory, focus = false) => {
		setCurrent(category);
		history.replaceState(null, '', `#${category}`);
		const i = groups.findIndex((g) => g.category === category);
		if (focus) tabs.current[i]?.focus();
		// On a phone the strip scrolls: keep the chosen tab in view.
		tabs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const i = groups.findIndex((g) => g.category === current);
		const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: groups.length - 1 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		choose(groups[(next + groups.length) % groups.length].category, true);
	};

	const words = normalise(deferred).split(/\s+/).filter(Boolean);
	const matches = words.length ? groups.flatMap((g) => g.tools.filter((t) => words.every((w) => t.haystack.includes(w))).map((t) => ({ ...t, group: g }))) : [];
	const searching = words.length > 0;

	return (
		<div>
			<search className="relative">
				<label htmlFor="tool-search" className="sr-only">
					Cerca uno strumento
				</label>
				<Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-fg-subtle" aria-hidden="true" />
				<input
					id="tool-search"
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
					placeholder="Cerca: mcm, sconto, pollici, voto…"
					autoComplete="off"
					enterKeyHint="search"
					className="h-14 w-full rounded-xl border border-edge-strong bg-surface pl-12 pr-12 text-lg text-fg-strong shadow-paper placeholder:text-fg-subtle focus-ring [&::-webkit-search-cancel-button]:hidden"
				/>
				{query && (
					<button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-2 focus-ring">
						<X className="size-5" aria-hidden="true" />
						<span className="sr-only">Cancella la ricerca</span>
					</button>
				)}
			</search>

			<p aria-live="polite" className={cn('label-mono mt-8 text-fg-subtle', !searching && 'sr-only')}>
				{searching ? (matches.length ? `${matches.length} ${matches.length === 1 ? 'strumento' : 'strumenti'} per “${deferred.trim()}”` : '') : ''}
			</p>
			{searching && (
				<div className="pt-3">
					{matches.length ? (
						<CardGrid tools={matches} showCategory />
					) : (
						<p className="rounded-xl border border-dashed border-edge-strong p-6 text-fg-muted">
							Nessuno strumento per “{deferred.trim()}”. Prova con un’altra parola, per esempio il nome dell’argomento (“frazioni”, “area”, “moli”).
						</p>
					)}
				</div>
			)}

			<div hidden={searching}>
				<div className="relative mt-10 border-b border-edge-strong">
					{/* A fade on the right edge says the strip goes on. */}
					{more && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-page-alt" />}
					{/* A strip of binder tabs; where the ten do not fit, it scrolls sideways. */}
					<div ref={strip} role="tablist" aria-label="Categoria" onKeyDown={onKeyDown} onScroll={measure} className="-mb-px flex items-end gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{groups.map(({ category, short }, i) => {
							const active = category === current;
							const Icon = CATEGORY_ICONS[category];
							return (
								<button
									key={category}
									ref={(el) => {
										tabs.current[i] = el;
									}}
									type="button"
									role="tab"
									id={`${category}-tab`}
									aria-selected={active}
									aria-controls={category}
									tabIndex={active ? 0 : -1}
									onClick={() => choose(category)}
									className={cn(
										'group flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg border px-2.5 transition-colors focus-ring xl:gap-2 xl:px-3',
										active ? 'border-edge-strong border-b-page-alt bg-page-alt pb-3 pt-3' : 'border-edge border-b-edge-strong bg-surface-2 py-2 hover:bg-tint-soft'
									)}
								>
									<Icon className={cn('size-4', active ? 'text-tint-fg' : 'text-fg-subtle group-hover:text-tint-fg')} aria-hidden="true" />
									<span className={cn('font-medium', active ? 'text-fg-strong' : 'text-fg-muted group-hover:text-fg')}>{short}</span>
								</button>
							);
						})}
					</div>
				</div>

				{groups.map(({ category, name, tools }) => (
					<section key={category} role="tabpanel" id={category} aria-labelledby={`${category}-tab`} hidden={category !== current} className="pt-6">
						<h2 className="mb-4 flex items-baseline gap-3 text-2xl font-semibold text-fg-strong">
							{name}
							<span className="label-mono font-normal text-fg-subtle">
								{tools.length} {tools.length === 1 ? 'strumento' : 'strumenti'}
							</span>
						</h2>
						<CardGrid tools={tools} />
					</section>
				))}
			</div>
		</div>
	);
}

function CardGrid({ tools, showCategory }: { tools: (ToolCard & { group?: ToolGroup })[]; showCategory?: boolean }) {
	return (
		<ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
			{tools.map((t) => (
				<li key={t.href}>
					<Link href={t.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-edge bg-surface shadow-paper transition-colors hover:border-edge-strong focus-ring">
						{/* The worked example, in ink on a strip of squared paper. */}
						<span aria-hidden="true" className="grid-paper flex h-16 items-center justify-center overflow-hidden border-b border-edge px-2 text-sm text-fg-strong sm:h-20 sm:px-4 sm:text-lg">
							<span className="whitespace-nowrap" dangerouslySetInnerHTML={{ __html: t.sample }} />
						</span>
						<span className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
							{showCategory && t.group && <span className="label-mono text-fg-subtle">{t.group.short}</span>}
							<span className="text-[15px] font-medium leading-snug text-fg-strong group-hover:text-accent-fg sm:text-base">{t.title}</span>
							<span className="line-clamp-2 text-sm text-fg-muted max-sm:hidden">{t.lead}</span>
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
