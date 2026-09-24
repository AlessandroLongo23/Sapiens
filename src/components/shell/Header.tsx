'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, UsersRound } from 'lucide-react';
import { CONTENT_ROOT, TUTORING_ROOT, ZAINO_ROOT } from '@/lib/config/site';
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

const navLink = (active: boolean) => cn('rounded font-medium transition-colors focus-ring', active ? 'text-fg' : 'text-fg-muted hover:text-fg');

/**
 * Site header. Below `md` it is a phone bar: logo, a search field that
 * opens the overlay, and a menu button for everything else; the parent
 * can slide it away while the page scrolls down (`hidden`). From `md` up
 * it is the full desktop bar with the level menu and account buttons.
 * The level menu opens on hover, or on the down arrow from the keyboard
 * (never on focus alone), and it is rendered after the bar so Tab reaches it.
 */
export function Header({ hidden = false, immersive = false }: { hidden?: boolean; immersive?: boolean }) {
	const pathname = usePathname();
	const tree = useContentTree();
	const isActive = useSearch((s) => s.isActive);
	const activate = useSearch((s) => s.activate);
	const user = useAuth((s) => s.user);
	const [mega, setMega] = useState<{ level: ContentNode; keyboard: boolean } | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const megaMenu = tree.length > 0;
	const closeMega = () => setMega(null);
	const closeMenu = useCallback(() => setMenuOpen(false), []);
	const inMateriale = pathname.startsWith(CONTENT_ROOT);
	const inTutoring = pathname.startsWith(TUTORING_ROOT);
	const inZaino = pathname.startsWith(ZAINO_ROOT);

	return (
		<header
			onMouseLeave={closeMega}
			onKeyDown={(e) => e.key === 'Escape' && closeMega()}
			className={cn('sticky top-0 z-30 border-b border-edge bg-page pt-safe-t transition-transform duration-300 ease-out', hidden && 'max-md:-translate-y-full', immersive && 'max-md:hidden')}
		>
			<div id="site-header-bar" className="relative z-20 flex w-full items-center gap-2 bg-page px-3 py-2 md:justify-between md:gap-4 md:p-3">
				<div className="flex min-w-0 items-center gap-2 md:gap-10">
					<Link href="/" className="flex shrink-0 items-center gap-3 rounded-md focus-ring" aria-label="Sapiens, pagina iniziale">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/favicon.svg" alt="" width={40} height={40} className="size-10 rounded-md" />
						<span className="hidden font-display text-[1.7rem] font-semibold tracking-tight text-fg-strong md:inline">Sapiens</span>
					</Link>

					{megaMenu && (
						<nav aria-label="Livelli didattici" className="hidden lg:block">
							<ul className="flex items-center justify-center gap-8">
								{tree.map((level) => {
									const open = mega?.level.id === level.id;
									return (
										<li key={level.id} className="relative">
											<Link
												href={nodePath([level])}
												onClick={closeMega}
												onMouseEnter={() => setMega({ level, keyboard: false })}
												onKeyDown={(e) => {
													if (e.key === 'ArrowDown') {
														e.preventDefault();
														setMega({ level, keyboard: true });
													}
												}}
												aria-haspopup="true"
												aria-expanded={open}
												aria-current={pathname === nodePath([level]) ? 'page' : undefined}
												className={cn('relative flex items-center gap-2', navLink(open))}
											>
												<span className="font-medium">{level.title}</span>
												<span className={cn('absolute -bottom-2 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all', open ? 'w-full opacity-100' : 'w-0 opacity-0')} aria-hidden="true" />
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
					)}

					{/* Tablets have no room for the level menu: the short links stand in for it until `lg`. */}
					<nav aria-label="Sezioni" className={cn('hidden items-center gap-6 whitespace-nowrap md:flex', megaMenu && 'lg:hidden xl:flex')}>
						<Link href={CONTENT_ROOT} aria-current={inMateriale ? 'page' : undefined} className={cn(navLink(inMateriale), megaMenu && 'lg:hidden')}>Materiale</Link>
						<Link href={TUTORING_ROOT} aria-current={inTutoring ? 'page' : undefined} className={navLink(inTutoring)}>Ripetizioni</Link>
						<Link href={ZAINO_ROOT} aria-current={inZaino ? 'page' : undefined} className={navLink(inZaino)}>Zaino</Link>
					</nav>
				</div>

				<div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none md:gap-3">
					<div className="h-[40px] min-w-0 flex-1 md:h-auto md:w-64 md:flex-none lg:w-72 xl:w-96">
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
					<Link href={TUTORING_ROOT} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl border border-edge bg-surface-2 text-fg active:bg-surface-4 focus-ring md:hidden" aria-label="Ripetizioni" aria-current={inTutoring ? 'page' : undefined}>
						<UsersRound className="size-5" aria-hidden="true" />
					</Link>
					<div className="hidden items-center gap-3 md:flex">
						<ThemeToggle />
						<LoginButton />
						{user && <LogoutButton />}
					</div>
					<button type="button" onClick={() => setMenuOpen(true)} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl border border-edge bg-surface-2 text-fg active:bg-surface-4 focus-ring md:hidden" aria-label="Apri il menu" aria-haspopup="dialog" aria-expanded={menuOpen}>
						<Menu className="size-6" aria-hidden="true" />
					</button>
				</div>
			</div>
			{mega && (
				<div className="absolute inset-x-0 z-10" style={{ top: 'var(--header-h, 64px)' }}>
					<SubjectMegaMenu level={mega.level} onClose={closeMega} autoFocus={mega.keyboard} />
				</div>
			)}
			<MobileMenu open={menuOpen} onClose={closeMenu} />
		</header>
	);
}
