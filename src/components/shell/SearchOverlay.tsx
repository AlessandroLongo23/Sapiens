'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { focusSearchTrigger, useSearch } from '@/lib/state/search';
import { useMd } from '@/lib/hooks/use-media';
import { reconstructTree, type ContentNode } from '@/lib/utils/tree';
import { nodePath, plainTitle } from '@/lib/seo/slug';
import { cn } from '@/lib/utils/cn';
import { useContentTree } from './ContentTreeContext';
import { SearchField } from './SearchField';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { NodeIcon } from '@/components/ui/NodeIcon';

interface Hit {
	topic: ContentNode;
	chapter: ContentNode;
	subject: ContentNode;
	href: string;
}

function hits(tree: ContentNode[]): Hit[] {
	const out: Hit[] = [];
	for (const level of tree)
		for (const subject of level.children)
			for (const chapter of subject.children)
				for (const topic of chapter.children) out.push({ topic, chapter, subject, href: nodePath([level, subject, chapter, topic]) });
	return out;
}

/**
 * Full-page search. The tree comes from the library routes when they loaded
 * it; elsewhere it is fetched the first time the search opens, so marketing
 * pages ship nothing. One result per row on phones; grid or list on wider screens.
 */
export function SearchOverlay() {
	const { query, isActive, deactivate } = useSearch();
	const pageTree = useContentTree();
	const [fetched, setFetched] = useState<ContentNode[] | null>(null);
	const fetching = useRef(false);
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const md = useMd();
	const tree = useMemo(() => (pageTree.length ? pageTree : (fetched ?? [])), [pageTree, fetched]);
	const loading = isActive && !pageTree.length && !fetched;

	useEffect(() => {
		if (!loading || fetching.current) return;
		fetching.current = true;
		fetch('/api/node/root')
			.then((r) => (r.ok ? r.json() : []))
			.then((nodes) => setFetched(reconstructTree(nodes)))
			.catch(() => setFetched([]));
	}, [loading]);

	const all = useMemo(() => hits(tree), [tree]);
	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];
		return all.filter(({ topic, chapter }) => plainTitle(topic.title).toLowerCase().includes(q) || plainTitle(chapter.title).toLowerCase().includes(q));
	}, [all, query]);

	if (!isActive) return null;
	const list = !md || view === 'list';
	const close = () => setTimeout(deactivate, 10);
	const dismiss = () => {
		deactivate();
		focusSearchTrigger();
	};

	return (
		<div
			className="fixed inset-0 z-40 flex animate-fade-in items-start justify-center overflow-y-auto overscroll-contain bg-page-alt/95 px-3 pb-safe backdrop-blur-sm sm:px-6 dark:bg-black/90"
			style={{ paddingTop: md ? 'calc(var(--header-h, 64px) + 32px)' : 'calc(var(--safe-t) + 0.5rem)' }}
			onClick={dismiss}
			role="dialog"
			aria-modal="true"
			aria-label="Cerca su Sapiens"
		>
			<div className="relative z-10 flex w-full flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
				<div className="flex w-full max-w-2xl items-center gap-2">
					<SearchField placeholder="Cerca in Sapiens" size="lg" autoFocus closeOnBlur={false} className="min-w-0 flex-1" />
					<button type="button" onClick={dismiss} className="min-h-[44px] shrink-0 rounded-lg px-2 text-base font-medium text-accent-fg focus-ring md:hidden">
						Annulla
					</button>
				</div>

				{results.length > 0 ? (
					<div className="relative z-10 flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
						<div className="flex items-center justify-between px-1">
							<p className="text-sm font-medium text-fg-subtle" aria-live="polite">
								{results.length} {results.length === 1 ? 'risultato trovato' : 'risultati trovati'}
							</p>
							<div className="hidden md:block">
								<ToggleGroup label="Vista" iconOnly value={view} onChange={setView} options={[{ value: 'grid', label: 'Griglia', icon: LayoutGrid }, { value: 'list', label: 'Elenco', icon: List }]} />
							</div>
						</div>
						<div className={list ? 'flex flex-col gap-1 pb-8 sm:gap-2' : 'grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
							{results.map((hit) => (
								<Result key={hit.topic.id} hit={hit} list={list} onClick={close} />
							))}
						</div>
					</div>
				) : (
					<p className="relative z-10 w-full max-w-2xl py-8 text-center text-fg-muted" aria-live="polite">
						{loading ? 'Caricamento del catalogo…' : query ? `Nessun risultato trovato per "${query}"` : 'Inserisci un termine per iniziare a cercare'}
					</p>
				)}
			</div>
		</div>
	);
}

function Result({ hit, list, onClick }: { hit: Hit; list: boolean; onClick: () => void }) {
	const title = plainTitle(hit.topic.title);
	const chapter = plainTitle(hit.chapter.title);
	if (list) {
		return (
			<Link href={hit.href} onClick={onClick} className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:border-edge-strong hover:bg-surface-2 focus-ring">
				<span className="flex min-w-0 items-center gap-4">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-fg-subtle transition-colors group-hover:bg-accent-soft group-hover:text-accent-fg">
						<NodeIcon node={hit.subject} size={18} aria-hidden="true" />
					</span>
					<span className="flex min-w-0 flex-col gap-0.5">
						<span className="truncate text-base font-semibold text-fg transition-colors group-hover:text-accent-fg">{title}</span>
						<span className="flex items-center gap-1.5 text-xs text-fg-subtle">
							<span className="font-medium">{hit.subject.title}</span>
							<span aria-hidden="true">•</span>
							<span className="truncate italic">{chapter}</span>
						</span>
					</span>
				</span>
				<ChevronRight size={18} className="text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent-fg" aria-hidden="true" />
			</Link>
		);
	}
	return (
		<Link href={hit.href} onClick={onClick} className="group flex flex-col gap-3 rounded-xl border border-edge bg-surface p-4 transition-all hover:border-accent-edge hover:shadow-sm focus-ring">
			<span className="flex items-center gap-2 text-xs text-fg-subtle">
				<span className={cn('rounded-md bg-surface-2 p-1 transition-colors group-hover:bg-accent-soft group-hover:text-accent-fg')}>
					<NodeIcon node={hit.subject} size={14} aria-hidden="true" />
				</span>
				<span className="font-medium">{hit.subject.title}</span>
			</span>
			<span className="flex flex-col gap-1">
				<span className="text-lg font-semibold leading-tight text-fg transition-colors group-hover:text-accent-fg">{title}</span>
				<span className="truncate text-xs text-fg-subtle">
					In <span className="italic">{chapter}</span>
				</span>
			</span>
		</Link>
	);
}
