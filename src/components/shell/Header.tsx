'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Search, UsersRound } from 'lucide-react';
import { CONTENT_ROOT, OGGI_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
import { nodePath } from '@/lib/seo/slug';
import { useSearch } from '@/lib/state/search';
import { useAuth } from '@/lib/state/auth';
import type { ContentNode } from '@/lib/utils/tree';
import { cn } from '@/lib/utils/cn';
import { useContentTree } from './ContentTreeContext';
import { SearchField } from './SearchField';
import { SubjectMegaMenu } from './SubjectMegaMenu';
import { ThemeToggle } from './ThemeToggle';
import { LoginButton, LogoutButton } from './AuthButtons';
import { MobileMenu } from './MobileMenu';
import { AppBackButton } from './AppBackButton';

const navLink = (active: boolean) => cn('rounded font-medium transition-colors focus-ring', active ? 'text-fg' : 'text-fg-muted hover:text-fg');

/**
 * Site header. Below `md` it is a phone bar: logo, a search field that
 * opens the overlay, and a menu button for everything else; the parent
 * can slide it away while the page scrolls down (`hidden`). From `md` up
 * it is the full desktop bar with the level menu and account buttons.
 * In the installed app the phone bar is a back arrow and the search field:
 * the tab bar holds everything else.
 * The level menu opens when the pointer rests on a level, or on the down
 * arrow from the keyboard (never on focus alone), and it is rendered after
 * the bar so Tab reaches it. Once open, moving to another level switches at
 * once; leaving the header closes it after a short grace, so overshooting the
 * edge does not. Escape closes it and puts focus back on its level; focus
 * or a click leaving the header closes it too. Next to each level a chevron
 * button opens the menu for keyboard and screen reader users.
 */
export function Header({ hidden = false, immersive = false, bare = false }: { hidden?: boolean; immersive?: boolean; /** Not shown at any width (the note editor). */ bare?: boolean }) {
	const pathname = usePathname();
	const tree = useContentTree();
	const isActive = useSearch((s) => s.isActive);
	const activate = useSearch((s) => s.activate);
	const user = useAuth((s) => s.user);
	const [mega, setMega] = useState<{ level: ContentNode; /** Set (to a fresh value each time) when opened from the keyboard, so focus moves into the menu. */ keyboard: number } | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const megaMenu = tree.length > 0;
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const triggers = useRef(new Map<string, HTMLAnchorElement>());
	const later = (fn: () => void, ms: number) => {
		clearTimeout(timer.current);
		timer.current = setTimeout(fn, ms);
	};
	const closeMega = () => {
		clearTimeout(timer.current);
		setMega(null);
	};
	useEffect(() => () => clearTimeout(timer.current), []);
	const headerRef = useRef<HTMLElement>(null);
	// A click anywhere outside the header closes the menu (a keyboard-opened one has no mouse leave to do it).
	const megaOpen = mega !== null;
	useEffect(() => {
		if (!megaOpen) return;
		const onDown = (e: PointerEvent) => {
			if (!headerRef.current?.contains(e.target as Node)) setMega(null);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	}, [megaOpen]);
	const closeMenu = useCallback(() => setMenuOpen(false), []);
	const inMateriale = pathname.startsWith(CONTENT_ROOT);
	const inTutoring = pathname.startsWith(TUTORING_ROOT);
	const inZaino = pathname.startsWith(ZAINO_ROOT);
	const inOggi = pathname === OGGI_ROOT || pathname.startsWith('/errori');

	return (
		<header
			ref={headerRef}
			onBlur={(e) => {
				if (mega && !e.currentTarget.contains(e.relatedTarget as Node | null)) closeMega();
			}}
			onMouseLeave={() => mega && later(closeMega, 200)}
			onMouseEnter={() => mega && clearTimeout(timer.current)}
			onKeyDown={(e) => {
				if (e.key !== 'Escape' || !mega) return;
				triggers.current.get(mega.level.id)?.focus();
				closeMega();
			}}
			className={cn('sticky top-0 z-30 border-b border-edge bg-page pt-safe-t transition-transform duration-300 ease-out', hidden && 'max-md:-translate-y-full', immersive && 'max-md:hidden', bare && 'hidden')}
		>
			<div id="site-header-bar" className="relative z-20 flex w-full items-center gap-2 bg-page px-3 py-2 md:justify-between md:gap-4 md:p-3">
				<div className="flex min-w-0 items-center gap-2 md:shrink-0 md:gap-6 lg:gap-10">
					<AppBackButton />
					<Link href="/" className="flex shrink-0 items-center gap-3 rounded-md focus-ring app:max-md:hidden" aria-label="Sapiens, pagina iniziale">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/favicon.svg" alt="" width={40} height={40} className="size-10 rounded-md" />
						<span className="hidden font-display text-[1.7rem] font-semibold tracking-tight text-fg-strong lg:inline">Sapiens</span>
					</Link>

					{megaMenu && (
						<nav aria-label="Livelli didattici" className="hidden lg:block">
							<ul className="flex items-center justify-center gap-8">
								{tree.map((level) => {
									const open = mega?.level.id === level.id;
									return (
										<li
											key={level.id}
											className="relative flex items-center"
											onMouseEnter={() => later(() => setMega({ level, keyboard: 0 }), mega ? 0 : 120)}
											onMouseLeave={() => !mega && clearTimeout(timer.current)}
										>
											<Link
												ref={(el) => {
													if (el) triggers.current.set(level.id, el);
													else triggers.current.delete(level.id);
												}}
												href={nodePath([level])}
												onClick={closeMega}
												onKeyDown={(e) => {
													if (e.key === 'ArrowDown') {
														e.preventDefault();
														setMega({ level, keyboard: Date.now() });
													}
												}}
												aria-current={pathname === nodePath([level]) ? 'page' : undefined}
												className={cn('relative flex items-center gap-2', navLink(open))}
											>
												<span className="font-medium">{level.title}</span>
												<span className={cn('absolute -bottom-2 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all', open ? 'w-full opacity-100' : 'w-0 opacity-0')} aria-hidden="true" />
											</Link>
											<button
												type="button"
												// A mouse click on a menu the hover already opened leaves it open.
												onClick={(e) => (open ? e.detail === 0 && closeMega() : setMega({ level, keyboard: e.detail === 0 ? Date.now() : 0 }))}
												aria-expanded={open}
												aria-controls={open ? 'level-menu' : undefined}
												aria-label={`Materie di ${level.title}`}
												className={cn('ml-0.5 grid size-6 place-items-center rounded transition-colors focus-ring', open ? 'text-fg' : 'text-fg-subtle hover:text-fg')}
											>
												<ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
											</button>
										</li>
									);
								})}
							</ul>
						</nav>
					)}

					{/* Tablets have no room for the level menu: the short links stand in for it until `lg`. The links never
					    shrink; the search box gives way instead, up to its usual width. */}
					<nav aria-label="Sezioni" className={cn('hidden items-center gap-6 whitespace-nowrap md:flex', megaMenu && 'lg:hidden xl:flex')}>
						<Link href={CONTENT_ROOT} aria-current={inMateriale ? 'page' : undefined} className={cn(navLink(inMateriale), megaMenu && 'lg:hidden')}>Materiale</Link>
						<Link href={TUTORING_ROOT} aria-current={inTutoring ? 'page' : undefined} className={navLink(inTutoring)}>Ripetizioni</Link>
						{user && <Link href={OGGI_ROOT} aria-current={inOggi ? 'page' : undefined} className={navLink(inOggi)}>Oggi</Link>}
						<Link href={ZAINO_ROOT} aria-current={inZaino ? 'page' : undefined} className={navLink(inZaino)}>Zaino</Link>
					</nav>
				</div>

				<div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:gap-3">
					<div className="h-[40px] min-w-0 flex-1 md:h-auto md:max-w-64 lg:max-w-72 xl:max-w-80 2xl:max-w-96">
						{isActive ? (
							<div className="h-full w-full rounded-lg border border-transparent" aria-hidden="true" />
						) : (
							<div className="h-full">
								{/* Phones: a field-shaped button; the real input is in the overlay, where it gets the keyboard. */}
								<button type="button" onClick={activate} className="flex h-full w-full items-center gap-2 rounded-xl border border-edge bg-surface-2 px-3 text-left text-base text-fg-subtle active:bg-surface-3 focus-ring md:hidden" aria-label="Cerca su Sapiens">
									<Search className="size-5 shrink-0" aria-hidden="true" />
									<span className="truncate">Cerca su Sapiens</span>
								</button>
								<div className="hidden h-full md:block">
									<SearchField id="site-search" placeholder="Cerca su Sapiens" />
								</div>
							</div>
						)}
					</div>
					<Link href={TUTORING_ROOT} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl border border-edge bg-surface-2 text-fg active:bg-surface-4 focus-ring md:hidden app:hidden" aria-label="Ripetizioni" aria-current={inTutoring ? 'page' : undefined}>
						<UsersRound className="size-5" aria-hidden="true" />
					</Link>
					<div className="hidden items-center gap-3 md:flex">
						<ThemeToggle />
						<LoginButton />
						{user && <LogoutButton />}
					</div>
					<button type="button" onClick={() => setMenuOpen(true)} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl border border-edge bg-surface-2 text-fg active:bg-surface-4 focus-ring md:hidden app:hidden" aria-label="Apri il menu" aria-haspopup="dialog" aria-expanded={menuOpen}>
						<Menu className="size-6" aria-hidden="true" />
					</button>
				</div>
			</div>
			{mega && (
				<>
					{/* A veil over the page, so the menu reads as on top; the pointer passes through it. */}
					<div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 animate-fade-in bg-ink-950/15 dark:bg-black/55" style={{ top: 'var(--header-h, 64px)' }} aria-hidden="true" />
					<div className="absolute inset-x-0 z-10" style={{ top: 'var(--header-h, 64px)' }}>
						<SubjectMegaMenu id="level-menu" level={mega.level} pathname={pathname} onClose={closeMega} autoFocus={mega.keyboard} />
					</div>
				</>
			)}
			<MobileMenu open={menuOpen} onClose={closeMenu} />
		</header>
	);
}
