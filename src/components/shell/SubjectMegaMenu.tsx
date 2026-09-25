'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { countByType } from '@/lib/utils/tree';
import { nodePath, plainTitle } from '@/lib/seo/slug';
import { toneFor } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
import { NodeIcon } from '@/components/ui/NodeIcon';
import { chaptersByYear } from '@/components/content/ChapterYears';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
// The browser's tree drops `has_theory` when it is false, so only `true` counts.
const lessonReady = (lesson: ContentNode) => lesson.has_theory === true;
/** A chapter is ready once one of its lessons is written, as on the subject page. */
const chapterReady = (chapter: ContentNode) => chapter.children.some(lessonReady);
/** Past this many chapters on screen, lesson previews would push most of them out of view. */
const PREVIEW_LIMIT = 12;

/** The subject and chapter the current page sits in, if it is inside this level. */
function locate(level: ContentNode, pathname: string) {
	const inside = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
	const subject = level.children.find((s) => inside(nodePath([level, s])));
	const chapter = subject?.children.find((c) => inside(nodePath([level, subject, c])));
	return { subject, chapter };
}

/** The chapters shown at once: one year's worth where the subject has years, all of them otherwise. */
function largestView(subject: ContentNode) {
	const byYear = chaptersByYear(subject.children);
	return byYear ? Math.max(...[...byYear.values()].map((c) => c.length)) : subject.children.length;
}

// The year last chosen for each subject, kept while the tab is open.
const chosenYear = new Map<string, number>();

/**
 * The level's subjects down the left, the chosen subject's chapters on the
 * right. A subject whose chapters have a school year shows one year at a time,
 * as its page does, starting from the year of the page the student is on.
 *
 * Resting on a subject shows it; the pause keeps a diagonal run to the
 * chapters from switching subject on the way. From the keyboard the subjects
 * are one stop in the Tab order (the arrows move between them), so Tab goes
 * from the chosen subject straight into its chapters. The menu keeps one
 * height per level, so its edge does not jump while the pointer moves.
 */
export function SubjectMegaMenu({ id, level, pathname, onClose, autoFocus = 0 }: { id?: string; level: ContentNode; pathname: string; onClose: () => void; /** Non-zero, and new on each keyboard open: focus the chosen subject. */ autoFocus?: number }) {
	const here = locate(level, pathname);
	const [chosen, setChosen] = useState<string | null>(null);
	const [shownLevel, setShownLevel] = useState(level.id);
	const rest = useRef<ReturnType<typeof setTimeout>>(undefined);
	if (level.id !== shownLevel) {
		setShownLevel(level.id);
		setChosen(null);
	}
	// Resolved from the level itself, so a refreshed tree keeps the choice and another level's never leaks in.
	const subject = level.children.find((s) => s.id === chosen) ?? here.subject ?? level.children[0] ?? null;
	const root = useRef<HTMLElement>(null);
	const rail = useRef<(HTMLAnchorElement | null)[]>([]);
	const single = level.children.length === 1;
	// Tall levels get a fixed height; short ones (a handful of chapters per subject) keep their own.
	const tall = level.children.some((s) => largestView(s) > 6);

	useEffect(() => {
		if (!autoFocus) return;
		const menu = root.current;
		(menu?.querySelector<HTMLElement>('[data-rail-active]') ?? menu?.querySelector<HTMLElement>('a[href]'))?.focus();
	}, [autoFocus, level.id]);
	useEffect(() => () => clearTimeout(rest.current), [level.id]);

	const choose = (s: ContentNode) => {
		clearTimeout(rest.current);
		setChosen(s.id);
	};
	const hover = (s: ContentNode) => {
		clearTimeout(rest.current);
		rest.current = setTimeout(() => setChosen(s.id), 150);
	};
	const onRailKey = (e: KeyboardEvent) => {
		const i = level.children.findIndex((s) => s.id === subject?.id);
		const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: level.children.length - 1 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		const n = (next + level.children.length) % level.children.length;
		choose(level.children[n]);
		rail.current[n]?.focus();
	};

	return (
		<nav
			id={id}
			ref={root}
			aria-label={`Materie di ${level.title}`}
			className={cn('flex w-full animate-drop-in border-y border-edge bg-surface shadow-lift', tall ? 'h-[min(38rem,calc(100dvh-var(--header-h,64px)-3rem))]' : 'max-h-[calc(100dvh-var(--header-h,64px)-3rem)]')}
		>
			{!single && (
				<div className="w-60 shrink-0 overflow-y-auto overscroll-contain border-r border-edge bg-surface-2/60 py-4 2xl:w-72">
					<p className="label-mono px-5 pb-2 text-fg-subtle" aria-hidden="true">
						Materie
					</p>
					<ul onKeyDown={onRailKey}>
						{level.children.map((s, i) => {
							const active = subject?.id === s.id;
							const current = here.subject?.id === s.id;
							return (
								<li key={s.id} data-subject={toneFor(s)}>
									<Link
										ref={(el) => {
											rail.current[i] = el;
										}}
										href={nodePath([level, s])}
										onClick={onClose}
										onMouseEnter={() => hover(s)}
										onMouseLeave={() => clearTimeout(rest.current)}
										onFocus={() => choose(s)}
										tabIndex={active ? 0 : -1}
										data-rail-active={active ? '' : undefined}
										aria-current={current ? 'page' : undefined}
										className={cn(
											'group flex items-center gap-3 border-l-3 px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson-500',
											active ? 'border-tint bg-surface text-fg-strong' : 'border-transparent text-fg-muted hover:bg-surface/60 hover:text-fg'
										)}
									>
										<span className={cn('flex size-8 shrink-0 items-center justify-center rounded-md transition-colors', active ? 'bg-tint-cover text-tint-cover-fg' : 'bg-tint-soft text-tint-fg')}>
											<NodeIcon node={s} className="size-4" aria-hidden="true" />
										</span>
										<span className="flex min-w-0 flex-1 flex-col">
											<span className="line-clamp-2 font-medium leading-tight">{plainTitle(s.title)}</span>
											<span className="label-mono mt-0.5 text-fg-subtle">{plural(s.children.length, 'capitolo', 'capitoli')}</span>
										</span>
										{/* Where the student is, kept while another subject is shown. */}
										{current && <span className="size-1.5 shrink-0 rounded-full bg-tint" title="Sei qui" aria-hidden="true" />}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			)}

			{subject ? (
				<SubjectPanel key={subject.id} level={level} subject={subject} inside={subject.id === here.subject?.id} here={subject.id === here.subject?.id ? here.chapter : undefined} pathname={pathname} onClose={onClose} />
			) : (
				<p className="flex-1 p-8 text-fg-subtle">Le materie di questo livello sono in arrivo.</p>
			)}
		</nav>
	);
}

function SubjectPanel({ level, subject, inside, here, pathname, onClose }: { level: ContentNode; subject: ContentNode; /** The current page is in this subject. */ inside: boolean; here?: ContentNode; pathname: string; onClose: () => void }) {
	const chapters = subject.children;
	const byYear = chaptersByYear(chapters);
	const years = byYear ? [...byYear.keys()].sort((a, b) => a - b) : [];
	const [year, setYear] = useState(() => {
		// The chapter the student is in, else the year the subject page shows, else the last one chosen here.
		const shownOnPage = inside && !here ? Number(/^#anno-(\d)$/.exec(window.location.hash)?.[1]) : 0;
		const candidates = [here?.school_year, shownOnPage, chosenYear.get(subject.id)];
		return candidates.find((y) => y && byYear?.has(y)) ?? years[0] ?? 0;
	});
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);
	const shown = byYear ? (byYear.get(year) ?? []) : chapters.map((_, i) => i);
	const withTabs = years.length > 1;
	const counts = countByType(chapters);
	const subjectHref = nodePath([level, subject]);
	const panelId = `menu-${subject.id}-anno-${year}`;

	const choose = (y: number, focus = false) => {
		setYear(y);
		chosenYear.set(subject.id, y);
		if (focus) tabs.current[years.indexOf(y)]?.focus();
	};
	const onTabKey = (e: KeyboardEvent) => {
		const i = years.indexOf(year);
		const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: years.length - 1 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		choose(years[(next + years.length) % years.length], true);
	};

	return (
		<div data-subject={toneFor(subject)} className="flex min-w-0 flex-1 animate-fade-in flex-col">
			<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-edge px-8 pt-5">
				<div className="min-w-0 pb-3">
					<Link href={subjectHref} onClick={onClose} className="group inline-flex items-center gap-2 rounded focus-ring">
						<span className="font-display text-2xl font-semibold tracking-tight text-fg-strong group-hover:text-tint-fg">{plainTitle(subject.title)}</span>
						<ArrowRight className="size-4 text-tint-fg opacity-60 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
					</Link>
					<p className="label-mono mt-1 text-fg-subtle">
						{plural(counts.chapter, 'capitolo', 'capitoli')} · {plural(counts.topic, 'lezione', 'lezioni')}
					</p>
				</div>
				{withTabs && (
					<div role="tablist" aria-label="Classe" className="-mb-px flex items-end" onKeyDown={onTabKey}>
						{years.map((y, i) => {
							const active = y === year;
							const indexes = byYear!.get(y)!;
							const ready = indexes.filter((c) => chapterReady(chapters[c])).length;
							return (
								<button
									key={y}
									ref={(el) => {
										tabs.current[i] = el;
									}}
									type="button"
									role="tab"
									id={`menu-${subject.id}-anno-${y}-tab`}
									aria-selected={active}
									aria-controls={active ? panelId : undefined}
									tabIndex={active ? 0 : -1}
									onClick={() => choose(y)}
									className={cn('group flex flex-col items-center border-b-2 px-3 pb-2 pt-1 transition-colors focus-ring', active ? 'border-tint' : 'border-transparent hover:border-edge-strong')}
								>
									<span className={cn('font-display text-lg font-semibold leading-none', active ? 'text-tint-fg' : 'text-fg-muted group-hover:text-fg')}>
										{y}ª<span className="sr-only"> classe</span>
									</span>
									<span className={cn('label-mono mt-1', ready ? 'text-tint-fg' : 'text-fg-subtle')}>
										{ready}/{indexes.length}
										<span className="sr-only"> capitoli pronti</span>
									</span>
								</button>
							);
						})}
					</div>
				)}
			</div>

			<div
				id={withTabs ? panelId : undefined}
				role={withTabs ? 'tabpanel' : undefined}
				aria-labelledby={withTabs ? `menu-${subject.id}-anno-${year}-tab` : undefined}
				className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 pb-10 pt-5 [mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]"
			>
				{chapters.length === 0 ? (
					<p className="text-fg-subtle">I capitoli di questa materia sono in arrivo.</p>
				) : (
					<ol className={cn('gap-x-8 pb-8', shown.length <= 4 ? 'columns-2' : 'columns-3 2xl:columns-4')}>
						{shown.map((i) => (
							<ChapterBlock key={chapters[i].id} level={level} subject={subject} chapter={chapters[i]} number={i + 1} current={here?.id === chapters[i].id} onClose={onClose} previews={shown.length <= PREVIEW_LIMIT} />
						))}
					</ol>
				)}
				{withTabs && (
					<Link
						href={`${subjectHref}#anno-${year}`}
						onClick={(e) => {
							onClose();
							// Already on the page: a router push fires no hashchange, and the page's tabs listen for one.
							if (pathname !== subjectHref) return;
							e.preventDefault();
							window.location.hash = `anno-${year}`;
						}}
						className="group inline-flex items-center gap-1.5 rounded text-sm font-medium text-tint-fg focus-ring">
						Tutte le lezioni della {year}ª
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
					</Link>
				)}
			</div>
		</div>
	);
}

/**
 * A chapter as a short table of contents: its number and title, then its
 * first lessons, each ticked with a dot when written and a ring while not.
 */
function ChapterBlock({ level, subject, chapter, number, current, onClose, previews }: { level: ContentNode; subject: ContentNode; chapter: ContentNode; number: number; current: boolean; onClose: () => void; previews: boolean }) {
	const perChapter = 3;
	const lessons = chapter.children;
	// Hiding a single lesson behind "altre 1" costs as much room as showing it.
	const shown = lessons.length === perChapter + 1 ? lessons : lessons.slice(0, perChapter);
	const more = lessons.length - shown.length;
	const ready = chapterReady(chapter);
	const href = nodePath([level, subject, chapter]);
	return (
		<li className="mb-6 break-inside-avoid">
			<Link href={href} onClick={onClose} aria-current={current ? 'page' : undefined} className="group flex items-baseline gap-2.5 rounded focus-ring">
				<span className="label-mono w-5 shrink-0 text-right tabular-nums text-tint-fg">{number}</span>
				<span className={cn('line-clamp-2 font-semibold leading-snug group-hover:text-tint-fg', current ? 'text-tint-fg' : ready ? 'text-fg-strong' : 'text-fg-muted')}>{plainTitle(chapter.title)}</span>
			</Link>
			{!ready ? (
				<p className="label-mono mt-1 pl-7.5 text-fg-subtle">In arrivo · {plural(lessons.length, 'lezione', 'lezioni')}</p>
			) : previews ? (
				<ul className="mt-1 flex flex-col pl-7.5 [@media(max-height:760px)]:hidden">
					{shown.map((lesson) => {
						const written = lessonReady(lesson);
						return (
							<li key={lesson.id}>
								<Link href={nodePath([level, subject, chapter, lesson])} onClick={onClose} className={cn('group/l flex items-baseline gap-2 rounded py-0.5 text-sm leading-snug transition-colors hover:text-tint-fg focus-ring', written ? 'text-fg-muted' : 'text-fg-subtle')}>
									<span className={cn('relative -top-px size-1.5 shrink-0 rounded-full', written ? 'bg-tint' : 'border border-fg-subtle')} aria-hidden="true" />
									<span className="line-clamp-2">{plainTitle(lesson.title)}</span>
									{!written && <span className="sr-only"> (in arrivo)</span>}
								</Link>
							</li>
						);
					})}
					{more > 0 && (
						<li>
							<Link href={href} onClick={onClose} className="inline-flex items-center gap-1 rounded py-0.5 pl-3.5 text-xs text-fg-subtle hover:text-tint-fg focus-ring">
								altre {more} lezioni
								<ArrowRight className="size-3" aria-hidden="true" />
							</Link>
						</li>
					)}
				</ul>
			) : null}
			{/* The count stands in for the previews where they are left out: too many chapters, or a short window. */}
			{ready && <p className={cn('label-mono mt-1 pl-7.5 text-fg-subtle', previews && 'hidden [@media(max-height:760px)]:block')}>{plural(lessons.length, 'lezione', 'lezioni')}</p>}
		</li>
	);
}
