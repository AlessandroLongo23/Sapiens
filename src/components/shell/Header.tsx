'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Search, UsersRound } from 'lucide-react';
import { CONTENT_ROOT, DIARIO_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
import { nodePath } from '@/lib/seo/slug';
import { useSearch } from '@/lib/state/search';
import { useAuth } from '@/lib/state/auth';
import type { ContentNode } from '@/lib/utils/tree';
import { cn } from '@/lib/utils/cn';
import { useContentTree } from './ContentTreeContext';
import { SearchField } from './SearchField';
import { SubjectMegaMenu } from './SubjectMegaMenu';
import { ThemeToggle } from './ThemeToggle';
import { LoginButton } from './AuthButtons';
import { AccountMenu } from './AccountMenu';
import { MobileMenu } from './MobileMenu';
import { AppBackButton } from './AppBackButton';

// The tools' registry holds every tool's metadata, too much to pull into the header for one path.
const TOOLS_ROOT = '/strumenti';

/** `nav-mark` (globals.css) is the highlighter: faint on hover, full (`data-on`) on the current section and on an open level menu. */
const navLink = (active: boolean) => cn('nav-mark rounded font-medium transition-colors focus-ring', active ? 'text-fg-strong' : 'text-fg-muted hover:text-fg');

/** A section link in the desktop bar. */
function NavLink({ href, active, className, children }: { href: string; active: boolean; className?: string; children: string }) {
	return (
		<Link href={href} aria-current={active ? 'page' : undefined} data-on={active || undefined} className={cn(navLink(active), className)}>
			{children}
		</Link>
	);
}

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
	const inDiario = pathname === DIARIO_ROOT || pathname.startsWith('/errori');
	const inTools = pathname.startsWith(TOOLS_ROOT);

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
				{/* From `lg`, where the word Sapiens shows, the row sits on its baseline so the links line up with it; the
				    logo's image stays centred. */}
				<div className="flex min-w-0 items-center gap-2 md:shrink-0 md:gap-8 lg:items-baseline xl:gap-10 2xl:gap-12">
					<AppBackButton />
					<Link href="/" className="flex shrink-0 items-center gap-3 rounded-md focus-ring lg:items-baseline app:max-md:hidden" aria-label="Sapiens, pagina iniziale">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/favicon.svg" alt="" width={40} height={40} className="size-10 self-center rounded-md" />
						<span className="hidden font-display text-[1.7rem] font-semibold tracking-tight text-fg-strong lg:inline">Sapiens</span>
					</Link>

					{/* One gap between every item, levels and sections alike (a level's chevron counts as part of it). */}
					<div className="hidden items-center gap-6 md:flex lg:items-baseline 2xl:gap-7">
					{megaMenu && (
						<nav aria-label="Livelli didattici" className="hidden lg:block">
							<ul className="flex items-center gap-6 2xl:gap-7">
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
												data-on={open || pathname.startsWith(nodePath([level])) || undefined}
												className={navLink(open || pathname.startsWith(nodePath([level])))}
											>
												{level.title}
											</Link>
											<button
												type="button"
												// A mouse click on a menu the hover already opened leaves it open.
												onClick={(e) => (open ? e.detail === 0 && closeMega() : setMega({ level, keyboard: e.detail === 0 ? Date.now() : 0 }))}
												aria-expanded={open}
												aria-controls={open ? 'level-menu' : undefined}
												aria-label={`Materie di ${level.title}`}
												className={cn('ml-0.5 -mr-1 grid size-6 place-items-center rounded transition-colors focus-ring', open ? 'text-fg' : 'text-fg-subtle hover:text-fg')}
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
					<nav aria-label="Sezioni" className={cn('flex items-baseline gap-6 whitespace-nowrap 2xl:gap-7', megaMenu && 'lg:hidden xl:flex')}>
						<NavLink href={CONTENT_ROOT} active={inMateriale} className={cn(megaMenu && 'lg:hidden')}>Materiale</NavLink>
						<NavLink href={TUTORING_ROOT} active={inTutoring}>Ripetizioni</NavLink>
						{user && <NavLink href={DIARIO_ROOT} active={inDiario}>Diario</NavLink>}
						<NavLink href={ZAINO_ROOT} active={inZaino}>Zaino</NavLink>
						<NavLink href={TOOLS_ROOT} active={inTools}>Strumenti</NavLink>
					</nav>
					</div>
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
						{user ? <AccountMenu /> : <LoginButton />}
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
