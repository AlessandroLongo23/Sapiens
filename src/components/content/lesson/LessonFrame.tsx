'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode, type UIEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Book, ListTree, PenLine, Sigma, Sparkles, Zap } from 'lucide-react';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import { useAISidebar } from '@/lib/state/ai-sidebar';
import { useLg } from '@/lib/hooks/use-media';
import { plainTitle } from '@/lib/seo/slug';
import { cn } from '@/lib/utils/cn';
import { Sheet } from '@/components/ui/Sheet';
import { Html } from '@/components/ui/Html';
import { tabClass } from '@/components/shell/MobileTabBar';
import { AISidebar } from './AISidebar';
import { ImmersiveFrame } from './LessonPresence';

export interface LessonPaths {
	theory: string;
	exercises: string;
	formulary: string;
	flashcards: string;
}

interface Props {
	/** The lesson title, typeset. */
	titleHtml: string;
	parentLink: { url: string; label: string };
	paths: LessonPaths;
	/** Table of contents column, from `lg` up; its presence also enables the phone "Indice" button. */
	left?: ReactNode;
	/** Mount the assistant (theory pages only). */
	withAssistant?: boolean;
	children: ReactNode;
}

/**
 * The lesson frame: a sticky header with the way back, the title and (on
 * wide screens) the section icons; the lesson scrolling in the middle; the
 * table of contents and the assistant beside it from `lg` up, and a bottom
 * bar with the sections and an "ask" button below. Below `lg` the assistant
 * opens in a sheet, driven by the same store the desktop column uses; the
 * column itself is only mounted from `lg` up, so exactly one chat is alive.
 */
export function LessonFrame({ titleHtml, parentLink, paths, left, withAssistant = false, children }: Props) {
	const pathname = usePathname();
	const lg = useLg();
	// Selectors, so the frame re-renders on scroll but the rest of the store's readers do not.
	const scrollY = useLessonLayout((s) => s.scrollY);
	const scrollProgress = useLessonLayout((s) => s.scrollProgress);
	const tocOpen = useLessonLayout((s) => s.tocOpen);
	const setScroll = useLessonLayout((s) => s.setScroll);
	const setTocOpen = useLessonLayout((s) => s.setTocOpen);
	const resetSections = useLessonLayout((s) => s.resetSections);
	const aiOpen = useAISidebar((s) => s.isOpen);
	const openAi = useAISidebar((s) => s.open);
	const closeAi = useAISidebar((s) => s.close);
	const scroller = useRef<HTMLDivElement>(null);
	const compact = scrollY > 20;
	const progress = Math.round(scrollProgress * 100);
	const aiSheet = withAssistant && !lg && aiOpen;
	const hasToc = !!left;

	const onScroll = (e: UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		const range = el.scrollHeight - el.clientHeight;
		setScroll(el.scrollTop, range > 0 ? Math.min(1, el.scrollTop / range) : 0);
	};

	// A new lesson starts at the top, with the sheet closed and no section highlighted (heading ids repeat across lessons).
	useLayoutEffect(() => {
		if (scroller.current) scroller.current.scrollTop = 0;
		setScroll(0, 0);
		setTocOpen(false);
		resetSections();
	}, [pathname, setScroll, setTocOpen, resetSections]);
	useEffect(() => () => closeAi(), [closeAi]);

	const sections = [
		{ href: paths.theory, label: 'Teoria', icon: Book },
		{ href: paths.exercises, label: 'Esercizi', icon: PenLine },
		{ href: paths.formulary, label: 'Formulario', icon: Sigma },
		{ href: paths.flashcards, label: 'Flashcards', icon: Zap }
	];
	const active = (href: string) => pathname === href;
	const backLabel = `Torna a ${plainTitle(parentLink.label)}`;

	return (
		<div className="relative flex h-dvh w-full justify-center overflow-hidden bg-surface text-fg md:h-[calc(100dvh-var(--header-h,60px))]">
			<ImmersiveFrame />
			<aside className="absolute inset-y-0 left-0 hidden w-1/4 overflow-y-auto overscroll-contain px-4 py-6 lg:flex lg:flex-col" aria-label="Indice della lezione">
				{lg && left}
			</aside>

			<div ref={scroller} onScroll={onScroll} className="no-scrollbar relative flex h-full w-full flex-col justify-between overflow-y-scroll overscroll-contain pb-tabbar lg:mx-[25%] lg:pb-0">
				<header className="sticky top-0 z-20 transition-all duration-300">
					<div className={cn('flex min-h-[56px] items-center justify-between gap-1 bg-surface px-2 transition-all duration-300 lg:min-h-0 lg:gap-4 lg:px-10', compact ? 'lg:py-3' : 'lg:py-8')}>
						<div className="flex min-w-0 flex-1 items-center gap-1 lg:gap-3">
							<Link href={parentLink.url} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl text-fg-muted transition-all hover:bg-surface-3 hover:text-fg active:bg-surface-3 focus-ring" title={backLabel} aria-label={backLabel}>
								<ArrowLeft className="size-6 lg:size-5" aria-hidden="true" />
							</Link>
							{/* One line on phones; on wide screens a long title wraps to two lines instead of being cut. */}
							<h1 className={cn('origin-left truncate text-lg font-bold leading-tight text-fg transition-all duration-300 lg:line-clamp-2 lg:whitespace-normal', compact ? 'lg:text-xl' : 'lg:text-3xl')}>
								<Html as="span" html={titleHtml} className="math-inline" />
							</h1>
						</div>
						{hasToc && (
							<button type="button" onClick={() => setTocOpen(true)} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl text-fg-muted transition-colors hover:bg-surface-3 active:bg-surface-3 focus-ring lg:hidden" aria-label="Indice della lezione" aria-haspopup="dialog" aria-expanded={tocOpen}>
								<ListTree className="size-6" aria-hidden="true" />
							</button>
						)}
						<nav className={cn('hidden shrink-0 items-center gap-2 transition-all duration-300 lg:flex', compact && 'scale-90')} aria-label="Sezioni della lezione">
							{sections.map(({ href, label, icon: Icon }) => (
								<Link
									key={href}
									href={href}
									title={label}
									aria-label={label}
									aria-current={active(href) ? 'page' : undefined}
									className={cn('flex size-10 items-center justify-center rounded-xl border transition-all duration-200 focus-ring', active(href) ? 'scale-105 border-edge bg-inverse text-inverse-fg shadow-md' : 'border-edge bg-surface text-fg-subtle hover:border-edge-strong hover:text-fg hover:shadow-sm')}
								>
									<Icon size={18} strokeWidth={2.5} aria-hidden="true" />
								</Link>
							))}
						</nav>
					</div>
					{/* Reading progress (phones and tablets). */}
					<div className="h-0.5 bg-surface-3 lg:hidden" role="progressbar" aria-label="Avanzamento della lettura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
						<div className="h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
					</div>
					{compact && <div className="relative hidden h-8 w-full bg-gradient-to-b from-surface to-transparent lg:block" />}
				</header>
				<div className="flex flex-1 flex-col">
					<div className="flex-1">{children}</div>
				</div>
			</div>

			<aside className="absolute inset-y-0 right-0 hidden w-1/4 overflow-y-auto overscroll-contain px-4 py-6 lg:flex lg:flex-col" aria-label="Assistente">
				{lg && withAssistant && <AISidebar />}
			</aside>

			{/* Phones and tablets: the lesson's sections and the assistant, in the thumb zone. */}
			<nav aria-label="Sezioni" className="fixed inset-x-0 bottom-0 z-30 border-t border-edge-soft bg-surface pb-safe lg:hidden">
				<ul className="grid h-tabbar grid-cols-5">
					{sections.map(({ href, label, icon: Icon }) => (
						<li key={href}>
							<Link href={href} aria-current={active(href) ? 'page' : undefined} className={tabClass(active(href))}>
								<Icon className="size-6" strokeWidth={active(href) ? 2.4 : 1.8} aria-hidden="true" />
								<span>{label}</span>
							</Link>
						</li>
					))}
					<li>
						<button type="button" onClick={openAi} className={cn(tabClass(false, true), 'active:bg-accent-soft')} aria-label="Chiedi a Sapiens AI" aria-haspopup="dialog" aria-expanded={aiSheet}>
							<span className="flex size-7 items-center justify-center rounded-full bg-accent text-white shadow-sm shadow-crimson-500/30" aria-hidden="true">
								<Sparkles className="size-4" />
							</span>
							<span>Chiedi</span>
						</button>
					</li>
				</ul>
			</nav>

			{!lg && (
				<Sheet open={aiSheet} onClose={closeAi} title="Sapiens AI" hideTitle size="full" bodyClass="flex flex-col">
					<AISidebar onClose={closeAi} />
				</Sheet>
			)}
		</div>
	);
}
