'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CornerDownLeft, NotebookPen } from 'lucide-react';
import { focusSearchTrigger, useSearch } from '@/lib/state/search';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import { useNoteHits } from '@/lib/hooks/use-note-hits';
import { useSemanticHits } from '@/lib/hooks/use-semantic-hits';
import { useMd } from '@/lib/hooks/use-media';
import { reconstructTree, type ContentNode } from '@/lib/utils/tree';
import { buildIndex, fuse, highlight, search, titleOf, type LessonHit, type PlaceHit, type SearchSection, type SectionHit } from '@/lib/search/rank';
import { toneFor } from '@/lib/utils/icons';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NoteHit } from '@/lib/zaino/config';
import { cn } from '@/lib/utils/cn';
import { NodeIcon } from '@/components/ui/NodeIcon';
import { PenStroke } from '@/components/content/PageHeader';
import { useContentTree } from './ContentTreeContext';
import { SearchField } from './SearchField';

/** What the empty search suggests: one word, a title, and two questions the way a student asks them. */
const EXAMPLES = ['non ho capito le equazioni di secondo grado', 'come si calcola il mcm', 'prodotti notevoli', 'frazioni equivalenti'];

// Fetched once per visit: the sections change only when a lesson is published.
let sectionsRequest: Promise<SearchSection[]> | null = null;
const loadSections = () =>
	(sectionsRequest ??= fetch('/api/search')
		.then((r) => (r.ok ? r.json() : []))
		.catch(() => {
			sectionsRequest = null;
			return [];
		}));

type Row = { key: string; href: string; section?: string } & ({ kind: 'note'; note: NoteHit } | { kind: 'place'; hit: PlaceHit } | { kind: 'lesson'; hit: LessonHit } | { kind: 'section'; hit: SectionHit; featured?: boolean });

interface Group {
	id: string;
	label: string;
	rows: Row[];
}

/**
 * Full-page search, drawn as a page of the notebook: the query is written on
 * a line in the display serif and the pen underlines it. Results are grouped
 * as an index would group them. When the query reads as a question the
 * paragraph that answers it comes first, as a card on squared paper that
 * opens the lesson at that heading; then the other paragraphs, the lessons,
 * subjects and chapters, and the student's notes above all of them.
 *
 * The tree comes from the library routes when they loaded it; elsewhere it is
 * fetched the first time the search opens, so marketing pages ship nothing.
 * The lessons' sections are fetched on first open too, and the ranking runs
 * in the browser (see lib/search/rank.ts), so results follow every keystroke.
 * For a question, a sentence or a search the words answer poorly, the sections
 * nearest in meaning (/api/search/semantic) join the ranking after a pause.
 * Arrow keys move through the results and Enter opens one.
 */
export function SearchOverlay() {
	const { query, isActive, setQuery, deactivate } = useSearch();
	const router = useRouter();
	const md = useMd();
	const pageTree = useContentTree();
	const [fetched, setFetched] = useState<ContentNode[] | null>(null);
	const [sections, setSections] = useState<SearchSection[]>([]);
	const fetching = useRef(false);
	const tree = useMemo(() => (pageTree.length ? pageTree : (fetched ?? [])), [pageTree, fetched]);
	const loading = isActive && !pageTree.length && !fetched;
	// Kept mounted for the closing animation.
	const [shown, setShown] = useState(isActive);
	if (isActive && !shown) setShown(true);

	useEffect(() => {
		if (isActive || !shown) return;
		const t = setTimeout(() => setShown(false), 160);
		return () => clearTimeout(t);
	}, [isActive, shown]);

	useEffect(() => {
		if (!isActive) return;
		loadSections().then(setSections);
		if (!loading || fetching.current) return;
		fetching.current = true;
		fetch('/api/node/root')
			.then((r) => (r.ok ? r.json() : []))
			.then((nodes) => setFetched(reconstructTree(nodes)))
			.catch(() => setFetched([]));
	}, [isActive, loading]);

	const index = useMemo(() => buildIndex(tree, sections), [tree, sections]);
	const deferred = useDeferredValue(query);
	const lexical = useMemo(() => search(index, deferred), [index, deferred]);
	// Meaning is asked for when the words may not be enough: a question, a sentence, or few results.
	const wantMeaning = lexical.question || deferred.trim().split(/\s+/).length >= 3 || lexical.lessons.length + lexical.sections.length < 3;
	const meaning = useSemanticHits(deferred, wantMeaning);
	const results = useMemo(() => fuse(index, lexical, meaning.hits), [index, lexical, meaning.hits]);
	const notes = useNoteHits(query);
	const groups = useMemo(() => arrange(results, notes), [results, notes]);
	const rows = groups.flatMap((g) => g.rows);

	// The highlighted row: the first one after each keystroke, then wherever the arrows take it.
	const [picked, setPicked] = useState({ query: '', index: 0 });
	const active = picked.query === deferred ? Math.min(picked.index, rows.length - 1) : 0;

	const close = () => setTimeout(deactivate, 10);
	const dismiss = () => {
		deactivate();
		focusSearchTrigger();
	};
	const open = (row: Row) => {
		// Already on that lesson: the URL gains only a hash, so the page is told to jump.
		if (row.section && location.pathname === row.href.split('#')[0]) useLessonLayout.getState().jumpTo(row.section);
		close();
	};

	useEffect(() => {
		if (!isActive) return;
		const onKey = (e: KeyboardEvent) => {
			if (!rows.length || e.isComposing) return;
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				const next = (active + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
				setPicked({ query: deferred, index: next });
				document.getElementById(`hit-${next}`)?.scrollIntoView({ block: 'nearest' });
			} else if (e.key === 'Enter' && deferred.trim()) {
				e.preventDefault();
				const row = rows[active];
				open(row);
				router.push(row.href);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	if (!shown) return null;
	const closing = !isActive;
	const typed = deferred.trim().length > 0;
	const empty = typed && rows.length === 0 && !meaning.pending;
	let n = 0;

	return (
		<div
			className={cn('fixed inset-0 z-40 overflow-y-auto overscroll-contain', closing && 'pointer-events-none')}
			onClick={dismiss}
			role="dialog"
			aria-modal="true"
			aria-label="Cerca su Sapiens"
		>
			{/* The page: warm paper over the site, squared where the query is written. */}
			<div className={cn('fixed inset-0 bg-page/95 backdrop-blur-md', closing ? 'search-out' : 'animate-fade-in')} aria-hidden="true">
				<div className="grid-paper absolute inset-x-0 top-0 h-72 [mask-image:linear-gradient(to_bottom,black,transparent)] md:h-96" />
			</div>

			<div
				className={cn('relative mx-auto flex w-full max-w-3xl flex-col px-4 pb-safe sm:px-6', closing ? 'search-out' : 'search-in')}
				style={{ paddingTop: md ? 'calc(var(--header-h, 64px) + 1.5rem)' : 'calc(var(--safe-t) + 0.75rem)' }}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sticky top-0 z-10 pb-6 pt-2">
						{/* Full width behind the field, so what scrolls under it disappears into the paper; the squares go on across it. */}
						<span className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-page [mask-image:linear-gradient(to_bottom,black_75%,transparent)]" aria-hidden="true">
							<span className="grid-paper absolute inset-0" style={{ backgroundAttachment: 'fixed' }} />
						</span>
					<div className="mb-3 flex items-center justify-between gap-3">
						<span className="label-mono text-accent-fg">Cerca su Sapiens</span>
						<button type="button" onClick={dismiss} className="label-mono -my-2 min-h-[44px] rounded-md px-2 text-fg-subtle transition-colors hover:text-fg focus-ring md:min-h-0 md:py-1">
							<span className="md:hidden">Annulla</span>
							<span className="hidden items-center gap-1.5 md:flex">
								Chiudi <kbd className="rounded border border-edge bg-surface px-1 text-[0.625rem] tracking-normal shadow-paper">esc</kbd>
							</span>
						</button>
					</div>
					<SearchField
						placeholder={md ? 'Una lezione, un argomento, una domanda…' : 'Cerca o fai una domanda…'}
						size="lg"
						autoFocus
						closeOnBlur={false}
						controls="search-results"
						activeDescendant={rows.length && typed ? `hit-${active}` : undefined}
					/>
				</div>

				<div id="search-results" role="listbox" aria-label="Risultati" className="flex flex-col gap-8 pb-16">
					{!typed && (
						<div className="flex flex-col gap-4">
							<p className="text-base text-fg-muted">Scrivi il titolo di una lezione o chiedi come lo diresti a un compagno: la ricerca guarda anche dentro le lezioni e ti porta al paragrafo giusto.</p>
							<div>
								<p className="label-mono mb-2 text-fg-subtle">Prova con</p>
								<ul className="flex flex-col">
									{EXAMPLES.map((example, i) => (
										<li key={example} className="animate-note-in border-b border-dashed border-edge" style={{ animationDelay: `${120 + i * 40}ms` }}>
											<button type="button" onClick={() => setQuery(example)} className="group flex w-full items-center gap-3 py-3 text-left font-display text-lg italic text-fg transition-colors hover:text-accent-fg focus-ring">
												<span className="font-mono text-xs not-italic text-fg-faint">{String(i + 1).padStart(2, '0')}</span>
												<span className="flex-1">«{example}»</span>
												<ArrowRight className="size-4 text-fg-faint transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-accent-fg" aria-hidden="true" />
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					{typed && loading && <p className="label-mono text-fg-subtle">Apro il catalogo…</p>}
					{typed && !loading && rows.length === 0 && meaning.pending && <p className="label-mono animate-fade-in text-fg-subtle">Cerco il senso della domanda nelle lezioni…</p>}

					{empty && !loading && (
						<div className="animate-note-in py-6" aria-live="polite">
							<p className="font-display text-2xl tracking-tight text-fg-strong">
								Niente per <span className="marker-hand">«{deferred.trim()}»</span>
							</p>
							<p className="mt-2 text-fg-muted">Prova con meno parole, o con il nome dell&apos;argomento come lo trovi sul libro.</p>
						</div>
					)}

					{groups.map((group) => (
						<section key={group.id} role="group" aria-labelledby={`group-${group.id}`} className="flex flex-col">
							<h2 id={`group-${group.id}`} className="label-mono mb-1 flex items-center gap-3 font-sans text-fg-subtle">
								{group.label}
								<span className="h-px flex-1 bg-edge" aria-hidden="true" />
								<span className="tabular-nums text-fg-faint">{group.rows.length}</span>
							</h2>
							<ul role="presentation" className={cn('flex', group.id === 'places' ? 'flex-wrap gap-2 pt-2' : 'flex-col')}>
								{group.rows.map((row) => {
									const i = n++;
									return (
										<li key={row.key} role="presentation" className="animate-note-in" style={{ animationDelay: `${Math.min(i, 10) * 22}ms` }}>
											<Hit row={row} index={i} active={i === active} stems={results.stems} onOpen={() => open(row)} onHover={() => setPicked({ query: deferred, index: i })} />
										</li>
									);
								})}
							</ul>
						</section>
					))}

					{rows.length > 0 && (
						<p className="label-mono hidden items-center justify-center gap-4 text-fg-faint md:flex" aria-hidden="true">
							<span>↑ ↓ scegli</span>
							<span className="flex items-center gap-1">
								<CornerDownLeft className="size-3" /> apri
							</span>
							<span>esc chiudi</span>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

/** Results in reading order. A question puts its best paragraph first, on its own. */
function arrange(results: ReturnType<typeof search>, notes: NoteHit[]): Group[] {
	const groups: Group[] = [];
	const noteRows: Row[] = notes.map((note) => ({ kind: 'note', note, key: `n-${note.id}`, href: `${ZAINO_ROOT}/nota/${note.id}` }));
	const placeRows: Row[] = results.places.map((hit) => ({ kind: 'place', hit, key: `p-${hit.node.id}`, href: hit.href }));
	const lessonRows: Row[] = results.lessons.map((hit) => ({ kind: 'lesson', hit, key: `l-${hit.topic.id}`, href: hit.href }));
	const sectionRows: Row[] = results.sections.map((hit) => ({ kind: 'section', hit, key: `s-${hit.section.topic}-${hit.section.id}`, href: hit.href, section: hit.section.id }));
	const add = (id: string, label: string, rows: Row[]) => rows.length && groups.push({ id, label, rows });

	add('notes', 'Dai tuoi appunti', noteRows);
	if (results.question && sectionRows.length) {
		const [best, ...rest] = sectionRows;
		add('answer', 'La risposta è qui', [best.kind === 'section' ? { ...best, featured: true } : best]);
		add('lessons', 'Lezioni', lessonRows);
		add('sections', 'Anche in questi paragrafi', rest);
	} else {
		add('places', 'Materie e capitoli', placeRows);
		add('lessons', 'Lezioni', lessonRows);
		add('sections', 'Dentro le lezioni', sectionRows);
	}
	if (results.question) add('places', 'Materie e capitoli', placeRows);
	return groups;
}

/** A text with the words the query matched run over with the highlighter. */
function Marked({ text, stems }: { text: string; stems: string[] }) {
	return (
		<>
			{highlight(text, stems).map((part, i) =>
				part.hit ? (
					<mark key={i} className="marker-hand">
						{part.text}
					</mark>
				) : (
					<span key={i}>{part.text}</span>
				)
			)}
		</>
	);
}

function Hit({ row, index, active, stems, onOpen, onHover }: { row: Row; index: number; active: boolean; stems: string[]; onOpen: () => void; onHover: () => void }) {
	const common = { id: `hit-${index}`, href: row.href, onClick: onOpen, onMouseMove: active ? undefined : onHover, role: 'option', 'aria-selected': active, 'data-active': active || undefined };

	if (row.kind === 'place') {
		const { node, parent } = row.hit;
		return (
			<Link {...common} data-subject={toneFor(node, parent)} className="group flex items-center gap-2 rounded-full border border-tint-edge bg-tint-soft py-1.5 pl-2 pr-3.5 text-tint-fg no-underline shadow-paper transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift focus-ring data-active:-translate-y-0.5 data-active:shadow-lift">
				<NodeIcon node={node.type === 'subject' ? node : parent} className="size-4" aria-hidden="true" />
				<span className="font-medium text-fg-strong">
					<Marked text={titleOf(node)} stems={stems} />
				</span>
				<span className="label-mono text-tint-fg/80">{titleOf(parent)}</span>
			</Link>
		);
	}

	if (row.kind === 'section' && row.featured) {
		const { section, lesson } = row.hit;
		return (
			<Link {...common} data-subject={toneFor(lesson.subject)} className="group relative isolate block overflow-hidden rounded-2xl border border-edge bg-surface p-5 pl-9 no-underline shadow-paper transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift focus-ring sm:p-6 sm:pl-12 data-active:shadow-lift">
				<span className="grid-paper absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
				{/* The red margin of a notebook page. */}
				<span className="absolute inset-y-0 left-5 -z-10 w-px bg-[var(--grid-margin)] sm:left-7" aria-hidden="true" />
				<span className="label-mono flex items-center gap-2 text-tint-fg">
					<NodeIcon node={lesson.subject} className="size-3.5" aria-hidden="true" />
					{titleOf(lesson.subject)} · {titleOf(lesson.topic)}
				</span>
				<span className="relative mt-3 inline-block font-display text-2xl font-semibold leading-tight tracking-tight text-fg-strong sm:text-3xl">
					<Marked text={section.title} stems={stems} />
					<PenStroke className="absolute inset-x-0 -bottom-2 h-2.5" />
				</span>
				{section.snippet && (
					<span className="mt-4 block text-base leading-relaxed text-fg">
						<Marked text={section.snippet} stems={stems} />
					</span>
				)}
				<span className="label-mono mt-5 flex items-center gap-2 text-accent-fg">
					Apri la lezione a questo paragrafo
					<ArrowRight className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-data-active:translate-x-1" aria-hidden="true" />
				</span>
			</Link>
		);
	}

	let mark: ReactNode;
	let title: ReactNode;
	let body: ReactNode = null;
	let meta: ReactNode;
	let tone: string | undefined;
	let pencil = false;

	if (row.kind === 'note') {
		const { note } = row;
		mark = (
			<span data-notebook={note.notebook_color} className="flex size-9 shrink-0 rotate-[-4deg] items-center justify-center rounded-lg bg-tint-cover text-tint-cover-fg shadow-paper">
				<NotebookPen className="size-4" aria-hidden="true" />
			</span>
		);
		title = <Marked text={note.title} stems={stems} />;
		body = note.excerpt ? <Marked text={note.excerpt} stems={stems} /> : <span className="italic">Nota vuota</span>;
		meta = note.notebook_title;
	} else if (row.kind === 'lesson') {
		const { topic, chapter, subject } = row.hit;
		tone = toneFor(subject);
		pencil = topic.has_theory === false;
		mark = (
			<span className="flex size-9 shrink-0 rotate-[-4deg] items-center justify-center rounded-lg border border-tint-edge bg-tint-soft text-tint-fg transition-transform duration-300 ease-out-soft group-hover:rotate-0 group-data-active:rotate-0">
				<NodeIcon node={subject} className="size-4" aria-hidden="true" />
			</span>
		);
		title = <Marked text={titleOf(topic)} stems={stems} />;
		meta = (
			<>
				{titleOf(subject)} · {titleOf(chapter)}
				{pencil && <span className="italic text-fg-faint"> · in arrivo</span>}
			</>
		);
	} else {
		const { section, lesson } = row.hit;
		tone = toneFor(lesson.subject);
		mark = <span className="flex size-9 shrink-0 items-center justify-center font-display text-2xl leading-none text-tint-fg">§</span>;
		title = <Marked text={section.title} stems={stems} />;
		body = section.snippet ? <Marked text={section.snippet} stems={stems} /> : null;
		meta = (
			<>
				{titleOf(lesson.topic)}
				{section.parent && ` · ${section.parent}`}
			</>
		);
	}

	return (
		<Link
			{...common}
			data-subject={tone}
			className="group relative -mx-3 flex items-start gap-3.5 rounded-xl px-3 py-3 no-underline transition-colors hover:bg-surface-2/70 focus-ring data-active:bg-surface-2 sm:gap-4"
		>
			{/* Picked by the arrows: the correcting pen's tick in the margin. */}
			<span className="absolute inset-y-3 left-0 w-[3px] origin-top scale-y-0 rounded-full bg-accent transition-transform duration-200 ease-out-soft group-data-active:scale-y-100" aria-hidden="true" />
			{mark}
			<span className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className={cn('relative font-display text-lg font-medium leading-snug tracking-tight sm:text-xl', pencil ? 'text-fg-subtle' : 'text-fg-strong')}>{title}</span>
				{body && <span className="line-clamp-2 text-sm leading-relaxed text-fg-muted">{body}</span>}
				<span className="label-mono mt-1 truncate text-fg-subtle">{meta}</span>
			</span>
			<ArrowRight className="mt-1.5 size-4 shrink-0 text-fg-faint transition-[transform,color] duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-tint-fg group-data-active:translate-x-1 group-data-active:text-tint-fg" aria-hidden="true" />
		</Link>
	);
}
